"""Build and persist the frozen Logistic Regression pipeline using DEV only."""

from __future__ import annotations

import hashlib
import json
import platform
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
import sklearn
from sklearn.pipeline import Pipeline

from ml.data.dataset import HOLDOUT_VIDEO_IDS, TARGET_COLUMN, TEXT_COLUMN, VIDEO_ID_COLUMN
from ml.models.logistic_pipeline import create_best_logistic_pipeline_observed_on_dev

ARTIFACT_SCHEMA_VERSION = 1


def select_development_data(prepared_data: pd.DataFrame) -> pd.DataFrame:
    """Return DEV rows only, rejecting any possibility of holdout fitting."""
    development_data = prepared_data.loc[
        ~prepared_data[VIDEO_ID_COLUMN].isin(HOLDOUT_VIDEO_IDS)
    ].copy()
    development_data.reset_index(drop=True, inplace=True)

    if set(development_data[VIDEO_ID_COLUMN]) & HOLDOUT_VIDEO_IDS:
        raise ValueError("HOLDOUT_VIDEO_IDS leaked into the development training data")
    return development_data


def train_frozen_logistic_pipeline(development_data: pd.DataFrame) -> Pipeline:
    """Fit the selected full pipeline on DEV and never accept holdout videos."""
    if set(development_data[VIDEO_ID_COLUMN]) & HOLDOUT_VIDEO_IDS:
        raise ValueError("Refusing to fit the final pipeline with holdout videos")

    pipeline = create_best_logistic_pipeline_observed_on_dev()
    pipeline.fit(development_data[TEXT_COLUMN], development_data[TARGET_COLUMN])
    return pipeline


def _sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def _development_fingerprint(development_data: pd.DataFrame) -> str:
    """Hash deterministic DEV fields without serializing rows into metadata."""
    canonical_csv = development_data[
        [VIDEO_ID_COLUMN, TEXT_COLUMN, TARGET_COLUMN]
    ].to_csv(index=False, lineterminator="\n")
    return _sha256_bytes(canonical_csv.encode("utf-8"))


def build_metadata(
    development_data: pd.DataFrame,
    artifact_sha256: str,
    *,
    generated_at_utc: str | None = None,
) -> dict[str, Any]:
    """Build auditable metadata for a DEV-only frozen pipeline artifact."""
    class_distribution = (
        development_data[TARGET_COLUMN].value_counts().sort_index().to_dict()
    )
    metadata: dict[str, Any] = {
        "schema_version": ARTIFACT_SCHEMA_VERSION,
        "model": {
            "name": "LogisticRegression",
            "C": 5.0,
            "class_weight": None,
            "random_state": 42,
            "max_iter": 1000,
        },
        "tfidf": {
            "ngram_range": [1, 1],
            "min_df": 2,
            "max_features": None,
            "stop_words": None,
            "sublinear_tf": True,
        },
        "preprocessing": "normalize_text followed by casefold",
        "training_data": {
            "partition": "DEV only",
            "row_count": len(development_data),
            "video_id_count": development_data[VIDEO_ID_COLUMN].nunique(),
            "class_distribution": {str(label): int(count) for label, count in class_distribution.items()},
            "holdout_video_ids_excluded": sorted(HOLDOUT_VIDEO_IDS),
            "fingerprint_sha256": _development_fingerprint(development_data),
        },
        "runtime": {
            "python": platform.python_version(),
            "pandas": pd.__version__,
            "scikit_learn": sklearn.__version__,
            "joblib": joblib.__version__,
        },
        "generated_at_utc": generated_at_utc or datetime.now(UTC).isoformat(),
        "artifact_sha256": artifact_sha256,
    }
    canonical_metadata = json.dumps(metadata, sort_keys=True, separators=(",", ":")).encode("utf-8")
    metadata["metadata_sha256"] = _sha256_bytes(canonical_metadata)
    return metadata


def persist_frozen_pipeline(
    development_data: pd.DataFrame,
    artifact_path: Path,
    metadata_path: Path,
    *,
    generated_at_utc: str | None = None,
) -> dict[str, Any]:
    """Fit once on DEV, persist the full pipeline, and write its audit metadata."""
    pipeline = train_frozen_logistic_pipeline(development_data)
    artifact_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, artifact_path)
    artifact_sha256 = _sha256_bytes(artifact_path.read_bytes())
    metadata = build_metadata(
        development_data, artifact_sha256, generated_at_utc=generated_at_utc
    )
    metadata_path.write_text(
        json.dumps(metadata, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )
    return metadata


def load_frozen_pipeline(artifact_path: Path) -> Pipeline:
    """Load a locally generated and trusted final pipeline artifact."""
    return joblib.load(artifact_path)
