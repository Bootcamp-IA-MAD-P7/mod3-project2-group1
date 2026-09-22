"""Test-only helpers to build small trustworthy bundles (not collected by pytest)."""

from __future__ import annotations

import hashlib
import json
from datetime import UTC, datetime
from pathlib import Path

import joblib
import pandas as pd

from ml.data.dataset import TARGET_COLUMN, TEXT_COLUMN
from ml.models.logistic_pipeline import create_best_logistic_pipeline_observed_on_dev


def _synthetic_data() -> pd.DataFrame:
    kind_rows = [
        f"this is a nice and honest comment number {i}" for i in range(12)
    ]
    hate_rows = [
        f"you are a disgusting and stupid person number {i}" for i in range(12)
    ]
    rows = [
        (text, False) for text in kind_rows
    ] + [
        (text, True) for text in hate_rows
    ]
    return pd.DataFrame(rows, columns=[TEXT_COLUMN, TARGET_COLUMN])


def build_test_bundle(
    root: Path,
    *,
    schema_version: int = 1,
    model_name: str = "LogisticRegression",
    corrupt_artifact: bool = False,
    tamper_metadata: bool = False,
) -> tuple[Path, Path]:
    """Persist a tiny frozen pipeline + metadata sidecar in `root`."""
    data = _synthetic_data()
    pipeline = create_best_logistic_pipeline_observed_on_dev().fit(
        data[TEXT_COLUMN], data[TARGET_COLUMN]
    )

    artifact = root / "pipeline.joblib"
    metadata_path = root / f"{artifact.stem}.metadata.json"
    joblib.dump(pipeline, artifact)

    artifact_sha256 = hashlib.sha256(artifact.read_bytes()).hexdigest()
    class_distribution = data[TARGET_COLUMN].value_counts().sort_index().to_dict()
    metadata: dict[str, object] = {
        "schema_version": schema_version,
        "model": {
            "name": model_name,
            "C": 5.0,
            "class_weight": None,
            "random_state": 42,
            "max_iter": 1000,
        },
        "tfidf": {
            "ngram_range": [1, 1],
            "min_df": 12,
            "max_features": None,
            "stop_words": None,
            "sublinear_tf": True,
        },
        "preprocessing": "normalize_text followed by casefold",
        "training_data": {
            "partition": "DEV only",
            "row_count": len(data),
            "video_id_count": 1,
            "class_distribution": {str(k): int(v) for k, v in class_distribution.items()},
            "holdout_video_ids_excluded": [],
            "fingerprint_sha256": "test-fixture",
        },
        "runtime": {"python": "3.12", "pandas": "2.2", "scikit_learn": "1.5", "joblib": "1.4"},
        "generated_at_utc": datetime.now(UTC).isoformat(),
        "artifact_sha256": artifact_sha256,
    }
    canonical = json.dumps(metadata, sort_keys=True, separators=(",", ":")).encode("utf-8")
    metadata["metadata_sha256"] = hashlib.sha256(canonical).hexdigest()
    metadata_path.write_text(
        json.dumps(metadata, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )

    if corrupt_artifact:
        artifact.write_bytes(b"corrupted-not-a-pickle")
    if tamper_metadata:
        tampered = json.loads(metadata_path.read_text(encoding="utf-8"))
        tampered["artifact_sha256"] = "0" * 64
        metadata_path.write_text(
            json.dumps(tampered, indent=2, sort_keys=True) + "\n", encoding="utf-8"
        )

    return artifact, metadata_path