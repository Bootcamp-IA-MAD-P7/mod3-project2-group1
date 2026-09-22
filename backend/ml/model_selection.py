"""Overfitting-aware configuration selection for DEV experiments.

The gate ML-03 requires a train-validation gap below 5 percentage points.
When no candidate reaches the gate, the selection keeps the configurations
that preserve validation F1 and then prefers the smallest gap, mirroring the
overfitting-guided criteria already used by the LinearSVC, SGDClassifier and
LogisticRegression DEV workstreams.
"""

from __future__ import annotations

from typing import Any

VALIDATION_F1_RELATIVE_TOLERANCE = 0.10


def pick_overfitting_aware_configuration(
    candidates: list[dict[str, Any]],
    validation_f1_relative_tolerance: float = VALIDATION_F1_RELATIVE_TOLERANCE,
) -> dict[str, Any]:
    """Select the lowest-gap candidate whose validation F1 stays competitive.

    A candidate is competitive when its validation F1 is within
    ``validation_f1_relative_tolerance`` (relative, e.g. 0.10 = 10%) of the
    best validation F1 among all candidates. Among competitive candidates the
    smallest train-validation gap wins, with validation F1 as the tie-breaker.

    The criterion is relative because Naive Bayes pruning lowers validation F1
    (unlike the discriminative models where pruning raised it); an absolute band
    would wrongly discard every pruned configuration.
    """
    if not candidates:
        raise ValueError("at least one candidate configuration is required")

    best_validation_f1 = max(
        candidate["summary"]["validation_f1_mean"] for candidate in candidates
    )
    cutoff = best_validation_f1 * (1.0 - validation_f1_relative_tolerance)
    competitive = [
        candidate
        for candidate in candidates
        if candidate["summary"]["validation_f1_mean"] >= cutoff
    ]

    return min(
        competitive,
        key=lambda candidate: (
            candidate["summary"]["f1_gap_percentage_points"],
            -candidate["summary"]["validation_f1_mean"],
        ),
    )