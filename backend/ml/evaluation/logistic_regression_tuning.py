"""Small, reproducible DEV-only tuning round for Logistic Regression."""

from dataclasses import asdict, dataclass
from itertools import product
from statistics import fmean, pstdev
from typing import Any

import pandas as pd
from sklearn.metrics import f1_score

from ml.data.dataset import TEXT_COLUMN, TARGET_COLUMN, VIDEO_ID_COLUMN, create_grouped_cv
from ml.evaluation.metrics import evaluate_binary_classification
from ml.models.logistic_pipeline import create_logistic_pipeline


BASELINE_F1_VALIDATION_MEAN = 0.3542
BASELINE_REPRODUCTION_TOLERANCE = 0.0001


@dataclass(frozen=True)
class TuningConfiguration:
    """Parameters permitted in the first regularization-focused tuning round."""

    c: float
    min_df: int
    max_features: int | None
    ngram_range: tuple[int, int]


def build_first_tuning_configurations() -> list[TuningConfiguration]:
    """Return the approved 3 × 2 × 2 × 2 configuration grid."""
    return [
        TuningConfiguration(c, min_df, max_features, ngram_range)
        for c, min_df, max_features, ngram_range in product(
            (0.01, 0.1, 1.0),
            (1, 2),
            (None, 10_000),
            ((1, 1), (1, 2)),
        )
    ]


def build_second_tuning_configurations() -> list[TuningConfiguration]:
    """Return the approved C-focused grid around the first-round winner."""
    return [
        TuningConfiguration(c, min_df=2, max_features=None, ngram_range=(1, 1))
        for c in (0.25, 0.50, 0.75, 1.00, 1.50, 2.00)
    ]


def build_third_tuning_configurations() -> list[TuningConfiguration]:
    """Return the final approved C-focused grid, including its control."""
    return [
        TuningConfiguration(c, min_df=2, max_features=None, ngram_range=(1, 1))
        for c in (2.0, 2.5, 3.0, 4.0, 5.0)
    ]


def evaluate_tuning_configuration(
    development_data: pd.DataFrame,
    configuration: TuningConfiguration,
) -> dict[str, Any]:
    """Evaluate one configuration with fresh pipelines on the common DEV folds."""
    texts = development_data[TEXT_COLUMN]
    targets = development_data[TARGET_COLUMN]
    groups = development_data[VIDEO_ID_COLUMN]
    folds: list[dict[str, Any]] = []

    for fold_number, (train_indices, validation_indices) in enumerate(
        create_grouped_cv().split(texts, targets, groups=groups), start=1
    ):
        train_data = development_data.iloc[train_indices]
        validation_data = development_data.iloc[validation_indices]
        train_videos = set(train_data[VIDEO_ID_COLUMN])
        validation_videos = set(validation_data[VIDEO_ID_COLUMN])
        overlap = sorted(train_videos & validation_videos)
        if overlap:
            raise ValueError(f"VideoId overlap detected in fold {fold_number}: {overlap}")

        pipeline = create_logistic_pipeline(**asdict(configuration))
        pipeline.fit(train_data[TEXT_COLUMN], train_data[TARGET_COLUMN])
        vectorizer = pipeline.named_steps["tfidf"]
        train_matrix = vectorizer.transform(train_data[TEXT_COLUMN])
        validation_matrix = vectorizer.transform(validation_data[TEXT_COLUMN])
        train_predictions = pipeline.predict(train_data[TEXT_COLUMN])
        validation_predictions = pipeline.predict(validation_data[TEXT_COLUMN])
        vocabulary_size = len(vectorizer.vocabulary_)

        folds.append(
            {
                "fold": fold_number,
                "train_size": len(train_data),
                "validation_size": len(validation_data),
                "train_video_count": len(train_videos),
                "validation_video_count": len(validation_videos),
                "video_overlap": overlap,
                "vocabulary_size": vocabulary_size,
                "train_density": train_matrix.nnz / (train_matrix.shape[0] * vocabulary_size),
                "validation_density": validation_matrix.nnz
                / (validation_matrix.shape[0] * vocabulary_size),
                "train_metrics": _metrics_with_macro_f1(
                    train_data[TARGET_COLUMN], train_predictions
                ),
                "validation_metrics": _metrics_with_macro_f1(
                    validation_data[TARGET_COLUMN], validation_predictions
                ),
            }
        )

    validation_metrics = [fold["validation_metrics"] for fold in folds]
    train_metrics = [fold["train_metrics"] for fold in folds]
    validation_f1_scores = [metrics["f1"] for metrics in validation_metrics]
    mean_validation_f1 = fmean(validation_f1_scores)
    mean_train_f1 = fmean(metrics["f1"] for metrics in train_metrics)

    return {
        "configuration": asdict(configuration),
        "folds": folds,
        "summary": {
            "validation_f1_mean": mean_validation_f1,
            "validation_f1_std": pstdev(validation_f1_scores),
            "validation_f1_min": min(validation_f1_scores),
            "validation_f1_max": max(validation_f1_scores),
            "validation_accuracy_mean": fmean(
                metrics["accuracy"] for metrics in validation_metrics
            ),
            "validation_precision_mean": fmean(
                metrics["precision"] for metrics in validation_metrics
            ),
            "validation_recall_mean": fmean(
                metrics["recall"] for metrics in validation_metrics
            ),
            "validation_macro_f1_mean": fmean(
                metrics["macro_f1"] for metrics in validation_metrics
            ),
            "train_f1_mean": mean_train_f1,
            "f1_gap_percentage_points": (mean_train_f1 - mean_validation_f1) * 100,
        },
    }


def _metrics_with_macro_f1(y_true, y_pred) -> dict[str, Any]:
    metrics = evaluate_binary_classification(y_true, y_pred)
    metrics["macro_f1"] = f1_score(y_true, y_pred, average="macro", zero_division=0)
    return metrics
