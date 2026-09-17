"""Ablation experiment: MultinomialNB with and without safe augmentation (US-08)."""

import hashlib
import time
from pathlib import Path

import pandas as pd

from ml.data.dataset import (
    TARGET_COLUMN,
    TEXT_COLUMN,
    VIDEO_ID_COLUMN,
    create_grouped_cv,
    create_holdout_split,
    prepare_binary_dataset,
)
from ml.evaluation.metrics import evaluate_binary_classification
from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.multinomial_nb import create_multinomial_nb
from ml.training.augmentation import apply_augmentation

DATA_PATH = Path(__file__).resolve().parents[3] / "data" / "youtoxic_english_1000.csv"

# Candidato ya observado en US-11; NO se tunca aquí (US-08 es ablation).
ALPHA = 0.01
AUGMENTATION_SEED = 42


def _text_hash(rows: pd.DataFrame) -> str:
    payload = (
        rows[["VideoId", "Text", "IsToxic"]]
        .astype(str)
        .agg("|".join, axis=1)
        .str.casefold()
        .sort_values()
        .to_list()
    )
    return hashlib.sha256("::".join(payload).encode("utf-8")).hexdigest()


def _run_mnb_on_fold(
    train: pd.DataFrame,
    validation: pd.DataFrame,
    *,
    augment: bool,
) -> dict:
    if augment:
        train = apply_augmentation(train, seed=AUGMENTATION_SEED)

    vectorizer = create_tfidf_vectorizer()
    train_tfidf = vectorizer.fit_transform(train[TEXT_COLUMN])
    validation_tfidf = vectorizer.transform(validation[TEXT_COLUMN])

    model = create_multinomial_nb(alpha=ALPHA)
    model.fit(train_tfidf, train[TARGET_COLUMN])

    val_metrics = evaluate_binary_classification(
        validation[TARGET_COLUMN].astype(bool),
        model.predict(validation_tfidf).astype(bool),
    )
    return {
        "train_size": len(train),
        "augmented_new_rows": train["parent_id"].notna().sum() if augment else 0,
        "validation_size": len(validation),
        "validation_f1": val_metrics["f1"],
        "validation_accuracy": val_metrics["accuracy"],
        "false_negatives": val_metrics["confusion_matrix"][1][0],
        "false_positives": val_metrics["confusion_matrix"][0][1],
    }


def main() -> None:
    start = time.perf_counter()

    df = pd.read_csv(DATA_PATH)
    dev, test = create_holdout_split(prepare_binary_dataset(df))

    control_folds: list[dict] = []
    augmented_folds: list[dict] = []

    for fold_n, (train_idx, val_idx) in enumerate(
        create_grouped_cv().split(dev, dev[TARGET_COLUMN], groups=dev[VIDEO_ID_COLUMN]),
        start=1,
    ):
        train = dev.iloc[train_idx]
        validation = dev.iloc[val_idx]

        control = _run_mnb_on_fold(train, validation, augment=False)
        augmented = _run_mnb_on_fold(train, validation, augment=True)

        control["fold"] = fold_n
        augmented["fold"] = fold_n
        control_folds.append(control)
        augmented_folds.append(augmented)

        print(
            f"fold={fold_n} "
            f"control_f1={control['validation_f1']:.4f} "
            f"augmented_f1={augmented['validation_f1']:.4f} "
            f"new_synth={augmented['augmented_new_rows']}"
        )

    control_f1_mean = sum(f["validation_f1"] for f in control_folds) / len(control_folds)
    augmented_f1_mean = sum(f["validation_f1"] for f in augmented_folds) / len(augmented_folds)
    delta_pp = (augmented_f1_mean - control_f1_mean) * 100

    dev_hash = _text_hash(dev)
    test_hash = _text_hash(test)

    print("\n=== RESUMEN ABLATION US-08 (MNB, alpha=0.01, folds development) ===")
    print(f"control_val_f1_mean={control_f1_mean:.4f}")
    print(f"augmented_val_f1_mean={augmented_f1_mean:.4f}")
    print(f"delta_f1_percentage_points={delta_pp:+.4f}")
    print(
        f"sinteticos_totales={sum(f['augmented_new_rows'] for f in augmented_folds)} "
        f"(solo train, por fold)"
    )
    print(f"dev_hash_sha256={dev_hash} (sin alterar)")
    print(f"test_hash_sha256={test_hash} (sellado, sin alterar)")
    print(f"candidato_no_modificado=alpha={ALPHA} congelado en US-11")
    print(f"recursos_tiempo_seg={time.perf_counter() - start:.2f}")


if __name__ == "__main__":
    main()