"""Tests del loader y validador de bundle (US-16)."""

from __future__ import annotations

import pytest

from ml.inference.bundle import (
    BundleCorruptError,
    BundleIncompatibleError,
    BundleMissingError,
    load_bundle,
)
from tests.unit._bundle_factory import build_test_bundle


def test_load_valid_bundle_has_coherent_checksums(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path)

    pipeline, manifest = load_bundle(artifact, metadata_path)

    assert pipeline is not None
    assert manifest.artifact_sha256
    assert manifest.metadata_sha256
    assert manifest.schema_version == 1
    assert manifest.model.name == "LogisticRegression"


def test_load_bundle_missing_artifact(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path)
    artifact.unlink()

    with pytest.raises(BundleMissingError, match="artifact not found"):
        load_bundle(artifact, metadata_path)


def test_load_bundle_missing_metadata(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path)
    metadata_path.unlink()

    with pytest.raises(BundleMissingError, match="metadata sidecar not found"):
        load_bundle(artifact, metadata_path)


def test_load_bundle_corrupt_artifact_checksum(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path, corrupt_artifact=True)

    with pytest.raises(BundleCorruptError, match="artifact checksum mismatch"):
        load_bundle(artifact, metadata_path)


def test_load_bundle_corrupt_metadata_checksum(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path, tamper_metadata=True)

    with pytest.raises(BundleCorruptError, match="metadata checksum mismatch"):
        load_bundle(artifact, metadata_path)


def test_load_bundle_incompatible_schema_version(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path, schema_version=99)

    with pytest.raises(BundleIncompatibleError, match="unsupported schema_version"):
        load_bundle(artifact, metadata_path)


def test_load_bundle_incompatible_model(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path, model_name="LinearSVC")

    with pytest.raises(BundleIncompatibleError, match="unsupported model"):
        load_bundle(artifact, metadata_path)