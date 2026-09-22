"""DEV-only grouped evaluation for MultinomialNB overfitting control.

This module parameterises the TF-IDF vocabulary (``min_df``, ``ngram_range``)
and the smoothing ``alpha`` so the overfitting treatment can be evaluated
against the frozen candidate configuration in exactly the same DEV protocol.
"""

from dataclasses import dataclass
from statistics import fmean, pstdev
from typing import Any

import pandas as pd
from sklearn.metrics import f1_score

from ml.data.dataset import TARGET_COLUMN, TEXT_COLUMN, VIDEO_ID_COLUMN, create_grouped_cv
from ml.evaluation.metrics import evaluate_binary_classification
from ml.features.tfidf import create_tfidf_vectorizer
from ml.models.multinomial_nb import create_multinomial_nb

FROZEN_MULTINOMIAL_NB_ALPHA = 0.01
FROZEN_MULTINOMIAL_NB_NGRAM_RANGE = (1, 2)
FROZEN_MULTINOMIAL_NB_MIN_DF = 1

TREATMENT_MIN_DF = 12
TREATMENT_NGRAM_RANGE = (1, 1)
TREATMENT_ALPHA_GRID = (0.1, 0.5, 1.0)


@dataclass(frozen=True)
class MultinomialNbOverfittingConfiguration:
    """Parameters permitted in the MultinomialNB overfitting treatment."""

    alpha: float
    min_df: int
    ngram_range: tuple[int, int] = (1, 1)
    max_features: int | None = None


def _metrics_with_macro_f1(y_true, y_pred) -> dict[str, Any]:
    """Return the common binary metrics plus macro-F1 for comparison reports."""
    metrics = evaluate_binary_classification(y_true, y_pred)
    metrics["macro_f1"] = f1_score(y_true, y_pred, average="macro", zero_division=0)
    return metrics


def evaluate_multinomial_nb_configuration(
    development_data: pd.DataFrame,
    configuration: MultinomialNbOverfittingConfiguration,
) -> dict[str, Any]:
    """Evaluate one MultinomialNB configuration on the common grouped DEV folds.

    A new vectorizer and model are created in every fold.  The vectorizer is
    fitted only with that fold's train texts; validation is transformed after
    fitting and never participates in learned vocabulary or IDF values.
    """
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

        vectorizer = create_tfidf_vectorizer(
            ngram_range=configuration.ngram_range,
            min_df=configuration.min_df,
            max_features=configuration.max_features,
        )
        train_matrix = vectorizer.fit_transform(train_data[TEXT_COLUMN])
        validation_matrix = vectorizer.transform(validation_data[TEXT_COLUMN])

        model = create_multinomial_nb(alpha=configuration.alpha)
        model.fit(train_matrix, train_data[TARGET_COLUMN])
        train_predictions = model.predict(train_matrix)
        validation_predictions = model.predict(validation_matrix)
        vocabulary_size = len(vectorizer.vocabulary_)

        folds.append(
            {
                "fold": fold_number,
                "train_size": len(train_data),
                "validation_size": len(validation_data),
                "train_video_count": len(train_videos),
                "validation_video_count": len(validation_videos),
                "train_video_ids": sorted(train_videos),
                "validation_video_ids": sorted(validation_videos),
                "video_overlap": overlapping_videos,
                "vocabulary_size": vocabulary_size,
                "train_density": train_matrix.nnz
                / (train_matrix.shape[0] * vocabulary_size),
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
        "configuration": {
            "alpha": configuration.alpha,
            "ngram_range": list(configuration.ngram_range),
            "min_df": configuration.min_df,
            "max_features": configuration.max_features,
            "augmentation": False,
        },
        "folds": folds,
        "summary": {
            "validation_f1_mean": mean_validation_f1,
            "validation_f1_std": pstdev(validation_f1_scores),
            "validation_f1_min": min(validation_f1_scores),
            "validation_f1_max": max(validation_f1_scores),
            "validation_precision_mean": fmean(
                metrics["precision"] for metrics in validation_metrics
            ),
            "validation_recall_mean": fmean(
                metrics["recall"] for metrics in validation_metrics
            ),
            "validation_macro_f1_mean": fmean(
                metrics["macro_f1"] for metrics in validation_metrics
            ),
            "validation_accuracy_mean": fmean(
                metrics["accuracy"] for metrics in validation_metrics
            ),
            "train_f1_mean": mean_train_f1,
            "f1_gap_percentage_points": (mean_train_f1 - mean_validation_f1) * 100,
        },
    }