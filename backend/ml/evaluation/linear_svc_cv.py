"""Grouped development-set evaluation for the LinearSVC baseline."""

from collections.abc import Callable
from statistics import fmean, pstdev
from typing import Any

import pandas as pd
from sklearn.pipeline import Pipeline

from ml.data.dataset import TARGET_COLUMN, TEXT_COLUMN, VIDEO_ID_COLUMN, create_grouped_cv
from ml.evaluation.metrics import evaluate_binary_classification
from ml.models.linear_svc_pipeline import create_linear_svc_pipeline

PipelineFactory = Callable[[], Pipeline]


def evaluate_linear_svc_cv(
    development_data: pd.DataFrame,
    pipeline_factory: PipelineFactory = create_linear_svc_pipeline,
) -> dict[str, Any]:
    """Evaluate fresh LinearSVC pipelines with grouped CV on DEV only."""
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
                "train_metrics": evaluate_binary_classification(
                    train_data[TARGET_COLUMN], train_predictions
                ),
                "validation_metrics": evaluate_binary_classification(
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
            "train_f1_mean": mean_train_f1,
            "f1_gap_percentage_points": f1_gap_percentage_points,
            "f1_gap_below_5_percentage_points": abs(f1_gap_percentage_points) < 5,
        },
    }