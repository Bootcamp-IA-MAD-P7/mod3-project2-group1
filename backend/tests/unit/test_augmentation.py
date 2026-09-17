"""Tests for safe textual augmentation applied only to training folds (TX-03)."""

import hashlib

import pandas as pd

from ml.data.dataset import create_grouped_cv, prepare_binary_dataset
from ml.training.augmentation import (
    AUGMENTATION_TECHNIQUE,
    SYNONYM_MAP,
    apply_augmentation,
)

NO_LEAK_COLUMNS = {"parent_id", "technique", "seed"}


def _sample() -> pd.DataFrame:
    rows = [
        {"VideoId": "a", "Text": "I am very happy today", "IsToxic": False},
        {"VideoId": "a", "Text": "you are so bad", "IsToxic": True},
        {"VideoId": "a", "Text": "this is not good", "IsToxic": False},
        {"VideoId": "b", "Text": "i love this nice video", "IsToxic": False},
        {"VideoId": "b", "Text": "i hate your channel", "IsToxic": True},
        {"VideoId": "b", "Text": "great job everyone", "IsToxic": False},
        {"VideoId": "c", "Text": "this is awful content", "IsToxic": True},
        {"VideoId": "c", "Text": "keep up the good work", "IsToxic": False},
        {"VideoId": "c", "Text": "nobody likes that", "IsToxic": False},
    ]
    return pd.DataFrame(rows)


def _text_hash(values: pd.Series) -> str:
    payload = "|".join(str(value) for value in values)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


class TestTracingColumns:
    def test_adds_parent_technique_seed_columns(self):
        augmented = apply_augmentation(_sample(), seed=1)
        assert NO_LEAK_COLUMNS <= set(augmented.columns)

    def test_technique_is_synonym_replacement(self):
        augmented = apply_augmentation(_sample(), seed=1)
        synthetic = augmented.dropna(subset=["parent_id"])
        assert (synthetic["technique"] == AUGMENTATION_TECHNIQUE).all()

    def test_seed_is_recorded(self):
        augmented = apply_augmentation(_sample(), seed=7)
        synthetic = augmented.dropna(subset=["parent_id"])
        assert (synthetic["seed"] == 7).all()

    def test_original_rows_keep_leak_columns_empty(self):
        augmented = apply_augmentation(_sample(), seed=1)
        original = augmented[augmented["parent_id"].isna()]
        assert original["technique"].isna().all()
        assert original["seed"].isna().all()


class TestDeterminism:
    def test_same_seed_yields_same_synthetics(self):
        first = apply_augmentation(_sample(), seed=9)
        second = apply_augmentation(_sample(), seed=9)
        synthetic_first = (
            first[first["parent_id"].notna()].sort_values(["parent_id", "Text"]).reset_index(drop=True)
        )
        synthetic_second = (
            second[second["parent_id"].notna()].sort_values(["parent_id", "Text"]).reset_index(drop=True)
        )
        pd.testing.assert_frame_equal(synthetic_first, synthetic_second)

    def test_static_seed_makes_run_reproducible(self):
        augmented = apply_augmentation(_sample(), seed=123)
        run_id = _text_hash(augmented["Text"])
        assert isinstance(run_id, str) and len(run_id) == 64


class TestFoldIsolation:
    def test_synthetics_make_train_bigger(self):
        sample = _sample()
        augmented = apply_augmentation(sample, seed=1)
        assert len(augmented) > len(sample)

    def test_parents_never_cross_folds(self):
        sample = _sample()
        groups = sample["VideoId"]
        for _, (train_idx, val_idx) in enumerate(
            create_grouped_cv().split(sample, sample["IsToxic"], groups=groups)
        ):
            train_fold = apply_augmentation(sample.iloc[train_idx], seed=3)
            parents = train_fold["parent_id"].dropna().astype(int).tolist()
            for parent in parents:
                assert parent in train_idx, "synthetic parent crossed out of the train fold"

    def test_validation_and_test_hashes_unchanged(self):
        sample = prepare_binary_dataset(_sample())
        dev, test = _split_dev_test(sample)
        val_hash_before = _text_hash(dev[["VideoId", "Text", "IsToxic"]].astype(str).agg("|".join, axis=1))
        test_hash_before = _text_hash(test[["VideoId", "Text", "IsToxic"]].astype(str).agg("|".join, axis=1))

        train_fold = apply_augmentation(dev, seed=5)

        val_hash_after = _text_hash(dev[["VideoId", "Text", "IsToxic"]].astype(str).agg("|".join, axis=1))
        test_hash_after = _text_hash(test[["VideoId", "Text", "IsToxic"]].astype(str).agg("|".join, axis=1))
        assert val_hash_before == val_hash_after
        assert test_hash_before == test_hash_after
        assert train_fold.shape[0] > dev.shape[0]


def _split_dev_test(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    from ml.data.dataset import HOLDOUT_VIDEO_IDS

    is_holdout = df["VideoId"].isin(HOLDOUT_VIDEO_IDS)
    return df.loc[~is_holdout].reset_index(drop=True), df.loc[is_holdout].reset_index(drop=True)


class TestSemanticPreservation:
    def test_negation_blocks_synonym_replacement(self):
        sample = _sample()
        augmented = apply_augmentation(sample, seed=1)
        original_negative = sample.loc[sample["Text"].str.contains("not good")].iloc[0]
        descendants = augmented[
            augmented["parent_id"] == original_negative.name
        ]["Text"]
        for text in descendants:
            assert "good" in text, "negated token must not be replaced"

    def test_augmentation_only_uses_known_synonyms(self):
        sample = _sample().set_index(pd.RangeIndex(len(_sample())))
        augmented = apply_augmentation(sample, seed=1)
        known_synonyms = {
            synonym.casefold()
            for variants in SYNONYM_MAP.values()
            for synonym in variants
        }
        synthetic_texts = augmented[augmented["parent_id"].notna()]["Text"]
        assert len(synthetic_texts) > 0
        for text in synthetic_texts:
            tokens = {token.casefold() for token in text.split()}
            assert tokens & known_synonyms, (
                "augmented text expected to reuse a known synonym"
            )