"""Bundle validation and loading for the frozen inference pipeline (US-16)."""

from __future__ import annotations

import hashlib
import json
import pickle
from pathlib import Path
from typing import Any

import joblib
from pydantic import BaseModel, ConfigDict, ValidationError
from sklearn.pipeline import Pipeline

SUPPORTED_SCHEMA_VERSION = 1
SUPPORTED_MODEL_NAMES = frozenset({"LogisticRegression"})


class BundleError(Exception):
    """Base error for bundle loading failures."""


class BundleMissingError(BundleError):
    """Raised when the artifact or its metadata sidecar is missing."""


class BundleCorruptError(BundleError):
    """Raised when checksums or the artifact payload are inconsistent."""


class BundleIncompatibleError(BundleError):
    """Raised when schema version or model is not supported."""


class BundleModelMeta(BaseModel):
    model_config = ConfigDict(extra="ignore")

    name: str


class BundleManifest(BaseModel):
    """Auditable metadata sidecar of a frozen bundle (extra fields tolerated)."""

    model_config = ConfigDict(extra="ignore")

    schema_version: int
    artifact_sha256: str
    metadata_sha256: str
    model: BundleModelMeta


def _sha256_bytes(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def _metadata_sha256(metadata: dict[str, Any]) -> str:
    canonical = json.dumps(
        {key: value for key, value in metadata.items() if key != "metadata_sha256"},
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return _sha256_bytes(canonical)


def load_bundle(
    artifact_path: Path | str,
    metadata_path: Path | str,
    *,
    supported_schema_version: int = SUPPORTED_SCHEMA_VERSION,
    supported_model_names: frozenset[str] = SUPPORTED_MODEL_NAMES,
) -> tuple[Pipeline, BundleManifest]:
    """Load and validate a trustworthy local bundle once per process.

    Validates artifact existence, metadata self-consistency, artifact checksum,
    schema version and model compatibility before instantiating the pipeline.
    """
    artifact = Path(artifact_path)
    metadata = Path(metadata_path)

    if not artifact.is_file():
        raise BundleMissingError(f"artifact not found: {artifact}")
    if not metadata.is_file():
        raise BundleMissingError(f"metadata sidecar not found: {metadata}")

    try:
        raw = json.loads(metadata.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as exc:
        raise BundleCorruptError(f"metadata is not valid JSON: {exc}") from exc

    try:
        manifest = BundleManifest.model_validate(raw)
    except ValidationError as exc:
        raise BundleCorruptError(f"metadata does not match the bundle schema: {exc}") from exc

    if _metadata_sha256(raw) != manifest.metadata_sha256:
        raise BundleCorruptError("metadata checksum mismatch (metadata_sha256)")

    if manifest.schema_version != supported_schema_version:
        raise BundleIncompatibleError(
            f"unsupported schema_version {manifest.schema_version} "
            f"(supported: {supported_schema_version})"
        )

    if manifest.model.name not in supported_model_names:
        raise BundleIncompatibleError(
            f"unsupported model {manifest.model.name!r} (supported: {sorted(supported_model_names)})"
        )

    if _sha256_bytes(artifact.read_bytes()) != manifest.artifact_sha256:
        raise BundleCorruptError("artifact checksum mismatch (artifact_sha256)")

    try:
        pipeline = joblib.load(artifact)
    except (
        OSError,
        pickle.PickleError,
        ValueError,
        TypeError,
        KeyError,
        ModuleNotFoundError,
        AttributeError,
    ) as exc:
        raise BundleCorruptError(f"artifact could not be loaded: {exc}") from exc

    return pipeline, manifest