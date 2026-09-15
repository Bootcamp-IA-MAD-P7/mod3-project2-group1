"""Common evaluation metrics for binary toxicity classification."""

from collections.abc import Sequence
from typing import Any

from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)


def evaluate_binary_classification(
    y_true: Sequence[bool],
    y_pred: Sequence[bool],
) -> dict[str, Any]:
    """Evaluate binary predictions using the common project metrics."""
    return {
        "accuracy": accuracy_score(y_true, y_pred),
        "precision": precision_score(
            y_true,
            y_pred,
            pos_label=True,
            zero_division=0,
        ),
        "recall": recall_score(
            y_true,
            y_pred,
            pos_label=True,
            zero_division=0,
        ),
        "f1": f1_score(
            y_true,
            y_pred,
            pos_label=True,
            zero_division=0,
        ),
        "confusion_matrix": confusion_matrix(
            y_true,
            y_pred,
            labels=[False, True],
        ).tolist(),
    }