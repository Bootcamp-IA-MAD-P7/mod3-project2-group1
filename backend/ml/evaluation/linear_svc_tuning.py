"""Small, reproducible DEV-only tuning rounds for LinearSVC."""

from collections.abc import Callable
from dataclasses import asdict, dataclass
from itertools import product
from statistics import fmean, pstdev
from typing import Any

import pandas as pd
from sklearn.metrics import f1_score

from ml.data.dataset import TARGET_COLUMN, TEXT_COLUMN, VIDEO_ID_COLUMN, create_grouped_cv
from ml.evaluation.metrics import evaluate_binary_classification
from ml.models.linear_svc_pipeline import create_linear_svc_pipeline

NEAR_TIE_TOLERANCE = 0.0001


@dataclass(frozen=True)
class TuningConfiguration:
    """Parameters evaluated during the approved DEV-only tuning rounds."""

    c: float
    min_df: int
    max_features: int | None
    ngram_range: tuple[int, int]


def build_first_tuning_configurations() -> list[TuningConfiguration]:
    """Return the approved round-1 grid: 3 × 2 combinations with the control."""
    return [
        TuningConfiguration(c, min_df=1, max_features=None, ngram_range=ngram_range)
        for c, ngram_range in product(
            (0.01, 0.1, 1.0),
            ((1, 1), (1, 2)),
        )
    ]


def build_second_tuning_configurations(
    c_star: float, ngram_range: tuple[int, int]
) -> list[TuningConfiguration]:
    """Return the approved C-focused grid around the round-1 winner."""
    return [
        TuningConfiguration(c, min_df=1, max_features=None, ngram_range=ngram_range)
        for c in (c_star / 4, c_star / 2, c_star, 2 * c_star, 4 * c_star)
    ]


def evaluate_linear_svc_configuration(
    development_data: pd.DataFrame,
    configuration: TuningConfiguration,
    pipeline_factory: Callable[[], Any] | None = None,
) -> dict[str, Any]:
    """Evaluate one configuration with fresh pipelines on the common DEV folds."""
    if pipeline_factory is None:
        pipeline_factory = lambda: create_linear_svc_pipeline(**asdict(configuration))

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
                "video_overlap": overlap,
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


def select_best_tuning_configuration(evaluations: list[dict[str, Any]]) -> dict[str, Any]:
    """Pick the configuration by mean validation F1, breaking near ties by smaller C."""
    ranked = sorted(
        evaluations,
        key=lambda evaluation: evaluation["summary"]["validation_f1_mean"],
        reverse=True,
    )
    best = ranked[0]
    best_f1 = best["summary"]["validation_f1_mean"]

    for candidate in ranked[1:]:
        candidate_f1 = candidate["summary"]["validation_f1_mean"]
        if best_f1 - candidate_f1 < NEAR_TIE_TOLERANCE and _configuration_c(candidate) < _configuration_c(best):
            best = candidate
            best_f1 = candidate_f1

    return best


def _configuration_c(evaluation: dict[str, Any]) -> float:
    configuration = evaluation["configuration"]
    if isinstance(configuration, TuningConfiguration):
        return configuration.c
    return configuration["c"]


def _metrics_with_macro_f1(y_true, y_pred) -> dict[str, Any]:
    metrics = evaluate_binary_classification(y_true, y_pred)
    metrics["macro_f1"] = f1_score(y_true, y_pred, average="macro", zero_division=0)
    return metrics