from __future__ import annotations

import json

import pandas as pd
import pytest

from ml.data.dataset import HOLDOUT_VIDEO_IDS
from ml.training.final_logistic_regression import (
    build_metadata,
    load_frozen_pipeline,
    persist_frozen_pipeline,
    select_development_data,
    train_frozen_logistic_pipeline,
)


def _development_fixture() -> pd.DataFrame:
    videos = [f"dev-{letter}" for letter in "abcdef"]
    rows = []
    for video_index, video in enumerate(videos):
        for offset in range(4):
            row_index = video_index * 4 + offset
            toxic = row_index % 2 == 1
            flavor = ("kind", "supportive", "respectful", "helpful") if not toxic else ("hate", "cruel", "abusive", "hostile")
            rows.append(
                {
                    "VideoId": video,
                    "Text": f"{flavor[offset]} comment number {row_index}",
                    "IsToxic": int(toxic),
                }
            )
    return pd.DataFrame(rows)


def test_select_development_data_excludes_all_holdout_video_ids():
    holdout_video = next(iter(HOLDOUT_VIDEO_IDS))
    prepared = pd.concat(
        [
            _development_fixture(),
            pd.DataFrame({"VideoId": [holdout_video], "Text": ["sealed"], "IsToxic": [1]}),
        ],
        ignore_index=True,
    )

    development_data = select_development_data(prepared)

    assert len(development_data) == len(_development_fixture())
    assert not set(development_data["VideoId"]) & HOLDOUT_VIDEO_IDS


def test_frozen_pipeline_has_the_selected_configuration_and_predict_proba():
    pipeline = train_frozen_logistic_pipeline(_development_fixture())

    vectorizer = pipeline.named_steps["tfidf"]
    classifier = pipeline.named_steps["classifier"]
    assert vectorizer.ngram_range == (1, 1)
    assert vectorizer.min_df == 12
    assert vectorizer.max_features is None
    assert vectorizer.stop_words is None
    assert vectorizer.sublinear_tf is True
    assert classifier.C == 5.0
    assert classifier.class_weight is None
    assert classifier.random_state == 42
    assert classifier.max_iter == 1000
    assert hasattr(pipeline, "predict_proba")


def test_final_training_rejects_holdout_rows_before_fitting():
    holdout_row = _development_fixture().iloc[[0]].copy()
    holdout_row["VideoId"] = next(iter(HOLDOUT_VIDEO_IDS))

    with pytest.raises(ValueError, match="holdout"):
        train_frozen_logistic_pipeline(pd.concat([_development_fixture(), holdout_row]))


def test_persisted_pipeline_loads_and_predicts_without_refitting(tmp_path):
    artifact_path = tmp_path / "final.joblib"
    metadata_path = tmp_path / "final.metadata.json"
    development_data = _development_fixture()

    metadata = persist_frozen_pipeline(
        development_data,
        artifact_path,
        metadata_path,
        generated_at_utc="2026-09-18T00:00:00+00:00",
    )
    loaded = load_frozen_pipeline(artifact_path)

    assert artifact_path.exists()
    assert loaded.predict(["hate abusive comment"]).shape == (1,)
    assert loaded.predict_proba(["kind helpful comment"]).shape == (1, 2)
    assert metadata["training_data"]["partition"] == "DEV only"
    assert metadata["training_data"]["row_count"] == len(development_data)
    assert metadata["artifact_sha256"]
    assert metadata["metadata_sha256"]
    assert json.loads(metadata_path.read_text(encoding="utf-8")) == metadata


def test_metadata_records_a_deterministic_development_fingerprint():
    development_data = _development_fixture()

    first = build_metadata(development_data, "artifact", generated_at_utc="fixed")
    second = build_metadata(development_data, "artifact", generated_at_utc="fixed")

    assert first["training_data"]["fingerprint_sha256"] == second["training_data"]["fingerprint_sha256"]
    assert first["metadata_sha256"] == second["metadata_sha256"]
