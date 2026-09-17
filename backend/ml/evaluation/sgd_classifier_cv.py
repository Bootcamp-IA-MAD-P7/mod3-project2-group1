"""Grouped development-set evaluation for the SGDClassifier candidate."""

from collections.abc import Callable
from statistics import fmean, pstdev
from typing import Any

import pandas as pd
from sklearn.metrics import f1_score
from sklearn.pipeline import Pipeline

from ml.data.dataset import (
    TARGET_COLUMN,
    TEXT_COLUMN,
    VIDEO_ID_COLUMN,
    create_grouped_cv,
)
from ml.evaluation.metrics import evaluate_binary_classification
from ml.models.sgd_pipeline import create_sgd_pipeline

PipelineFactory = Callable[[], Pipeline]


def _metrics_with_macro_f1(y_true, y_pred) -> dict[str, Any]:
    metrics = evaluate_binary_classification(y_true, y_pred)
    metrics["macro_f1"] = f1_score(y_true, y_pred, average="macro", zero_division=0)
    return metrics


def evaluate_sgd_classifier_cv(
    development_data: pd.DataFrame,
    pipeline_factory: PipelineFactory = create_sgd_pipeline,
) -> dict[str, Any]:
    """Evaluate fresh SGDClassifier pipelines with grouped CV on DEV only."""
    texts = development_data[TEXT_COLUMN]
    targets = development_data[TARGET_COLUMN]
    groups = development_data[VIDEO_ID_COLUMN]
    folds: list[dict[str, Any]] = []

    for fold_number, (train_indices, validation_indices) in enumerate(
        create_grouped_cv().split(texts, targets, groups=groups),
        start=1,
    ):
        train_data = development_data.iloc[train_indices]
        validation_data = development_data.iloc[validation_indices]
        train_videos = set(train_data[VIDEO_ID_COLUMN])
        validation_videos = set(validation_data[VIDEO_ID_COLUMN])
        overlapping_videos = sorted(train_videos & validation_videos)

        if overlapping_videos:
            raise ValueError(
                f"VideoId overlap detected in fold {fold_number}: {overlapping_videos}"
            )

        pipeline = pipeline_factory()
        pipeline.fit(train_data[TEXT_COLUMN], train_data[TARGET_COLUMN])

        train_predictions = pipeline.predict(train_data[TEXT_COLUMN])
        validation_predictions = pipeline.predict(validation_data[TEXT_COLUMN])

        folds.append(
            {
                "fold": fold_number,
                "train_size": len(train_data),
                "validation_size": len(validation_data),
                "train_video_count": len(train_videos),
                "validation_video_count": len(validation_videos),
                "video_overlap": overlapping_videos,
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
    mean_validation_f1 = fmean(metric["f1"] for metric in validation_metrics)
    mean_train_f1 = fmean(metric["f1"] for metric in train_metrics)
    f1_gap_percentage_points = (mean_train_f1 - mean_validation_f1) * 100

    return {
        "folds": folds,
        "summary": {
            "validation_f1_mean": mean_validation_f1,
            "validation_f1_std": pstdev(metric["f1"] for metric in validation_metrics),
            "validation_accuracy_mean": fmean(
                metric["accuracy"] for metric in validation_metrics
            ),
            "validation_precision_mean": fmean(
                metric["precision"] for metric in validation_metrics
            ),
            "validation_recall_mean": fmean(
                metric["recall"] for metric in validation_metrics
            ),
            "validation_macro_f1_mean": fmean(
                metric["macro_f1"] for metric in validation_metrics
            ),
            "train_f1_mean": mean_train_f1,
            "f1_gap_percentage_points": f1_gap_percentage_points,
            "f1_gap_below_5_percentage_points": abs(f1_gap_percentage_points) < 5,
        },
    }