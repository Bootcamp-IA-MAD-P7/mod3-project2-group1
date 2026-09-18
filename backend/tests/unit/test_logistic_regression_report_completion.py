import copy

import pytest

from scripts.complete_logistic_regression_train_metrics import (
    add_train_metrics,
    assert_historical_reproduction,
)


def reproduced_result() -> dict:
    return {
        "summary": {
            "validation_f1_mean": 0.5518354735036822,
            "validation_precision_mean": 0.6342556842556842,
            "validation_recall_mean": 0.5127210782638415,
            "validation_macro_f1_mean": 0.6048867731260771,
            "validation_accuracy_mean": 0.6151876658579635,
            "train_f1_mean": 0.9823117182909997,
            "f1_gap_percentage_points": 43.04762447873175,
        },
        "folds": [
            {
                "fold": 1,
                "video_overlap": [],
                "validation_metrics": {"f1": 0.552},
                "train_metrics": {"f1": 0.98},
            },
            {
                "fold": 2,
                "video_overlap": [],
                "validation_metrics": {"f1": 0.5589519650655022},
                "train_metrics": {"f1": 0.98},
            },
            {
                "fold": 3,
                "video_overlap": [],
                "validation_metrics": {"f1": 0.5445544554455446},
                "train_metrics": {"f1": 0.9869351548729991},
            },
        ],
    }


def existing_report() -> dict:
    result = reproduced_result()
    return {
        "selected_results": {
            "summary": copy.deepcopy(result["summary"]),
            "folds": [
                {
                    "fold": fold["fold"],
                    "video_overlap": [],
                    "validation_metrics": copy.deepcopy(
                        fold["validation_metrics"]
                    ),
                }
                for fold in result["folds"]
            ],
        }
    }


def test_completion_preserves_validation_metrics_and_adds_train_metrics():
    report = existing_report()
    original_validation = copy.deepcopy(report["selected_results"]["folds"])

    completed = add_train_metrics(report, reproduced_result())

    for original, updated in zip(
        original_validation, completed["selected_results"]["folds"], strict=True
    ):
        assert updated["validation_metrics"] == original["validation_metrics"]
        assert updated["train_metrics"]["f1"] > 0


def test_historical_reproduction_guard_rejects_changed_validation_result():
    result = reproduced_result()
    result["folds"][0]["validation_metrics"]["f1"] = 0.4

    with pytest.raises(RuntimeError, match="Historical validation F1"):
        assert_historical_reproduction(result)
