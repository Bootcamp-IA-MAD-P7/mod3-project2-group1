"""Persist fold-level train metrics for the frozen Logistic Regression DEV run."""

import json
from pathlib import Path

import pandas as pd

from ml.data.dataset import (
    HOLDOUT_VIDEO_IDS,
    VIDEO_ID_COLUMN,
    prepare_binary_dataset,
)
from ml.evaluation.logistic_regression_tuning import (
    TuningConfiguration,
    evaluate_tuning_configuration,
)

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "youtoxic_english_1000.csv"
REPORT_PATH = ROOT / "docs" / "reports" / "experiments" / "logistic_regression_dev.json"
TOLERANCE = 0.0001
HISTORICAL_SUMMARY = {
    "validation_f1_mean": 0.5518354735036822,
    "validation_precision_mean": 0.6342556842556842,
    "validation_recall_mean": 0.5127210782638415,
    "validation_macro_f1_mean": 0.6048867731260771,
    "validation_accuracy_mean": 0.6151876658579635,
    "train_f1_mean": 0.9823117182909997,
    "f1_gap_percentage_points": 43.04762447873175,
}
HISTORICAL_FOLD_F1 = (0.552, 0.5589519650655022, 0.5445544554455446)
FROZEN_CONFIGURATION = TuningConfiguration(
    c=5.0,
    min_df=2,
    max_features=None,
    ngram_range=(1, 1),
)


def load_development_data() -> pd.DataFrame:
    """Prepare only DEV by excluding the sealed holdout before evaluation."""
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
    """Abort before writing if frozen validation or aggregates do not reproduce."""
    summary = result["summary"]
    for metric, expected in HISTORICAL_SUMMARY.items():
        observed = summary[metric]
        if abs(observed - expected) > TOLERANCE:
            raise RuntimeError(
                f"Historical {metric} was not reproduced: "
                f"expected {expected}, got {observed:.10f}"
            )

    for fold_number, (fold, expected) in enumerate(
        zip(result["folds"], HISTORICAL_FOLD_F1, strict=True), start=1
    ):
        observed = fold["validation_metrics"]["f1"]
        if abs(observed - expected) > TOLERANCE:
            raise RuntimeError(
                "Historical validation F1 was not reproduced: "
                f"fold {fold_number}, expected {expected}, got {observed:.10f}"
            )


def add_train_metrics(existing_report: dict, result: dict) -> dict:
    """Add only verified train metrics while preserving existing validation evidence."""
    existing_folds = existing_report["selected_results"]["folds"]
    reproduced_folds = result["folds"]
    if len(existing_folds) != len(reproduced_folds):
        raise RuntimeError("Existing report has a different number of folds")

    for existing_fold, reproduced_fold in zip(
        existing_folds, reproduced_folds, strict=True
    ):
        if existing_fold["fold"] != reproduced_fold["fold"]:
            raise RuntimeError("Existing report fold order differs from reproduced run")
        if existing_fold["validation_metrics"] != reproduced_fold["validation_metrics"]:
            raise RuntimeError(
                f"Validation metrics differ in fold {existing_fold['fold']}; report not updated"
            )
        if existing_fold["video_overlap"] != reproduced_fold["video_overlap"]:
            raise RuntimeError(
                f"Video overlap evidence differs in fold {existing_fold['fold']}; report not updated"
            )
        existing_fold["train_metrics"] = reproduced_fold["train_metrics"]

    summary = existing_report["selected_results"]["summary"]
    train_f1_mean = sum(
        fold["train_metrics"]["f1"] for fold in existing_folds
    ) / len(existing_folds)
    gap = (train_f1_mean - summary["validation_f1_mean"]) * 100
    if abs(train_f1_mean - summary["train_f1_mean"]) > TOLERANCE:
        raise RuntimeError("Fold train F1 mean differs from the historical summary")
    if abs(gap - summary["f1_gap_percentage_points"]) > TOLERANCE:
        raise RuntimeError("Fold train-validation gap differs from the historical summary")
    return existing_report


def main() -> None:
    """Run the frozen DEV control once and persist only fold-level train metrics."""
    development_data = load_development_data()
    result = evaluate_tuning_configuration(development_data, FROZEN_CONFIGURATION)
    assert_historical_reproduction(result)

    existing_report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
    updated_report = add_train_metrics(existing_report, result)
    REPORT_PATH.write_text(
        json.dumps(updated_report, indent=2, allow_nan=False), encoding="utf-8"
    )
    print("Historical Logistic Regression DEV results reproduced; train metrics persisted.")


if __name__ == "__main__":
    main()
