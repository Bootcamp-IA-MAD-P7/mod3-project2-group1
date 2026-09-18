"""Train the frozen Logistic Regression candidate once on all DEV rows."""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from ml.data.dataset import HOLDOUT_VIDEO_IDS, VIDEO_ID_COLUMN, prepare_binary_dataset
from ml.training.final_logistic_regression import persist_frozen_pipeline, select_development_data

ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "youtoxic_english_1000.csv"
ARTIFACT_PATH = ROOT / "backend" / "ml" / "artifacts" / "logistic_regression_dev_final.joblib"
METADATA_PATH = ROOT / "backend" / "ml" / "artifacts" / "logistic_regression_dev_final.metadata.json"
EXPECTED_DEV_ROWS = 808


def load_development_data() -> pd.DataFrame:
    """Prepare the common dataset and retain only DEV rows for final fitting."""
    prepared_data = prepare_binary_dataset(pd.read_csv(DATA_PATH))
    development_data = select_development_data(prepared_data)
    if len(development_data) != EXPECTED_DEV_ROWS:
        raise RuntimeError(
            f"Expected {EXPECTED_DEV_ROWS} DEV rows after preparation, got {len(development_data)}"
        )
    if set(development_data[VIDEO_ID_COLUMN]) & HOLDOUT_VIDEO_IDS:
        raise RuntimeError("HOLDOUT_VIDEO_IDS must be excluded before final fitting")
    return development_data


def main() -> None:
    """Persist the one DEV-only pre-TEST Logistic Regression artifact."""
    development_data = load_development_data()
    metadata = persist_frozen_pipeline(development_data, ARTIFACT_PATH, METADATA_PATH)
    print(
        "Final DEV-only Logistic Regression pipeline persisted: "
        f"{metadata['training_data']['row_count']} rows, "
        f"{metadata['training_data']['video_id_count']} VideoIds"
    )


if __name__ == "__main__":
    main()
