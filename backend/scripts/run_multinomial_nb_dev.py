"""Regenerate DEV-only evidence for the frozen MultinomialNB configuration."""

import json
import platform
from pathlib import Path

import pandas as pd
import sklearn

from ml.data.dataset import (
    HOLDOUT_VIDEO_IDS,
    VIDEO_ID_COLUMN,
    prepare_binary_dataset,
)
from ml.evaluation.multinomial_nb_cv import evaluate_selected_multinomial_nb_cv

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "youtoxic_english_1000.csv"
REPORT_PATH = ROOT / "docs" / "reports" / "experiments" / "multinomial_nb_dev.json"
HISTORICAL_FOLD_F1 = (0.5263, 0.5217, 0.6071)
HISTORICAL_F1_MEAN = 0.5517
REPRODUCTION_TOLERANCE = 0.0001


def load_development_data() -> pd.DataFrame:
    """Load prepared DEV only, excluding the sealed holdout before evaluation."""
    prepared = prepare_binary_dataset(pd.read_csv(DATA_PATH))
    development_data = prepared.loc[
        ~prepared[VIDEO_ID_COLUMN].isin(HOLDOUT_VIDEO_IDS)
    ].copy()
    development_data.reset_index(drop=True, inplace=True)

    assert len(prepared) == 995, f"expected 995 prepared rows, got {len(prepared)}"
    assert len(development_data) == 808, (
        f"expected 808 DEV rows, got {len(development_data)}"
    )
    assert not set(development_data[VIDEO_ID_COLUMN]) & HOLDOUT_VIDEO_IDS, (
        "sealed TEST VideoIds leaked into DEV"
    )
    return development_data


def assert_historical_reproduction(result: dict) -> None:
    """Abort before publishing if the frozen configuration no longer reproduces."""
    observed_mean = result["summary"]["validation_f1_mean"]
    observed_folds = [
        fold["validation_metrics"]["f1"] for fold in result["folds"]
    ]
    if abs(observed_mean - HISTORICAL_F1_MEAN) > REPRODUCTION_TOLERANCE:
        raise RuntimeError(
            "Historical mean F1 was not reproduced: "
            f"expected {HISTORICAL_F1_MEAN}, got {observed_mean:.10f}"
        )
    for fold_number, (observed, expected) in enumerate(
        zip(observed_folds, HISTORICAL_FOLD_F1, strict=True), start=1
    ):
        if abs(observed - expected) > REPRODUCTION_TOLERANCE:
            raise RuntimeError(
                "Historical fold F1 was not reproduced: "
                f"fold {fold_number}, expected {expected}, got {observed:.10f}"
            )


def build_report(development_data: pd.DataFrame, result: dict) -> dict:
    """Build a structured, comparable DEV-only evidence artifact."""
    return {
        "model": "MultinomialNB",
        "selection_label": "historically selected configuration reproduced on DEV",
        "environment": {
            "python": platform.python_version(),
            "scikit_learn": sklearn.__version__,
            "pandas": pd.__version__,
        },
        "data_protocol": {
            "source": "youtoxic_english_1000.csv",
            "prepared_rows": 995,
            "development_rows": len(development_data),
            "holdout_group_column": VIDEO_ID_COLUMN,
            "test_sealed": True,
            "test_used_for_fitting_tuning_prediction_metrics_or_inspection": False,
            "cross_validation": {
                "strategy": "StratifiedGroupKFold",
                "n_splits": 3,
                "shuffle": True,
                "random_state": 42,
                "zero_video_overlap_per_fold": True,
            },
            "primary_metric": "toxic_class_f1_validation_mean",
        },
        "selected_configuration": result["configuration"],
        "historical_reproduction": {
            "historical_validation_f1_mean": HISTORICAL_F1_MEAN,
            "historical_validation_f1_by_fold": list(HISTORICAL_FOLD_F1),
            "tolerance": REPRODUCTION_TOLERANCE,
            "reproduced": True,
        },
        "selected_results": {
            "summary": result["summary"],
            "folds": result["folds"],
        },
        "augmentation": {
            "included_in_common_comparison": False,
            "note": "No augmentation was used. The separate US-08 ablation remains documented in augmentation.md.",
        },
        "limitations": [
            "Only nine VideoId groups in DEV",
            "Substantial video-level distribution shift",
            "Train-validation gap is reported from DEV grouped CV",
            "This run reproduces a fixed historical configuration; it does not tune alpha",
            "No TEST evaluation was performed",
        ],
    }


def main() -> None:
    """Evaluate the frozen configuration and write the report after reproduction passes."""
    development_data = load_development_data()
    result = evaluate_selected_multinomial_nb_cv(development_data)
    assert_historical_reproduction(result)
    report = build_report(development_data, result)
    REPORT_PATH.write_text(
        json.dumps(report, indent=2, allow_nan=False), encoding="utf-8"
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
