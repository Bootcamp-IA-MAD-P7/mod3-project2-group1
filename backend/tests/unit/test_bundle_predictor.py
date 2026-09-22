"""Tests del adaptador BundlePredictor (US-16): orden, score, versión y paridad."""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from ml.data.dataset import TARGET_COLUMN, TEXT_COLUMN, create_holdout_split, prepare_binary_dataset
from ml.inference.bundle import load_bundle
from ml.inference.bundle_predictor import BundlePredictor
from ml.models.logistic_pipeline import create_best_logistic_pipeline_observed_on_dev
from ml.training.final_logistic_regression import train_frozen_logistic_pipeline
from tests.unit._bundle_factory import _synthetic_data, build_test_bundle


def test_predict_keeps_order_and_returns_inference_results(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path)
    pipeline, manifest = load_bundle(artifact, metadata_path)
    predictor = BundlePredictor(pipeline=pipeline, manifest=manifest)

    texts = [
        "this is a nice and honest comment",
        "hate you and everyone like you",
        "a completely new unseen sentence",
    ]
    results = predictor.predict(texts)

    assert len(results) == len(texts)
    assert all(result.model_version == manifest.artifact_sha256[:8] for result in results)
    assert all(result.score is not None for result in results)
    assert all(0.0 <= result.score <= 1.0 for result in results)
    assert all(result.score_kind == "calibrated_probability" for result in results)

    hate_index = int(np.where(np.asarray(pipeline.classes_).astype(bool))[0][0])
    probabilities = pipeline.predict_proba(texts)
    for text, result, proba in zip(texts, results, probabilities, strict=True):
        expected_score = float(proba[hate_index])
        assert result.score == pytest.approx(expected_score)
        assert result.label == ("hate" if expected_score >= 0.5 else "non_hate")


def test_predict_rejects_empty_input(tmp_path):
    artifact, metadata_path = build_test_bundle(tmp_path)
    pipeline, manifest = load_bundle(artifact, metadata_path)
    predictor = BundlePredictor(pipeline=pipeline, manifest=manifest)

    with pytest.raises(ValueError, match="non-empty"):
        predictor.predict([])


def test_parity_between_bundle_and_offline_frozen_pipeline(tmp_path):
    """El bundle cargado predice idéntico al refit offline de la factory congelada."""
    artifact, metadata_path = build_test_bundle(tmp_path)
    pipeline, manifest = load_bundle(artifact, metadata_path)
    predictor = BundlePredictor(pipeline=pipeline, manifest=manifest)

    bundle_data = _synthetic_data()
    offline = create_best_logistic_pipeline_observed_on_dev()
    offline.fit(bundle_data[TEXT_COLUMN], bundle_data[TARGET_COLUMN])

    samples = [
        "this is a nice and honest comment",
        "hate you and everyone like you",
        "shut up you disgusting person",
        "a completely new unseen sentence",
    ]
    bundle_results = predictor.predict(samples)
    hate_index = int(np.where(np.asarray(offline.classes_).astype(bool))[0][0])
    offline_proba = offline.predict_proba(samples)

    for result, proba in zip(bundle_results, offline_proba, strict=True):
        assert result.score == pytest.approx(float(proba[hate_index]))
        assert result.label == ("hate" if float(proba[hate_index]) >= 0.5 else "non_hate")


def test_pipeline_includes_preprocessing_no_manual_normalization(tmp_path):
    """El pipeline real procesa texto crudo: parity con train_frozen sobre DEV."""
    kind_rows = [f"this is a nice and honest comment number {i}" for i in range(12)]
    hate_rows = [f"you are a disgusting and stupid person number {i}" for i in range(12)]
    prepared = prepare_binary_dataset(
        pd.DataFrame(
            {
                "VideoId": ["v1"] * 24,
                "Text": kind_rows + hate_rows,
                "IsToxic": [False] * 12 + [True] * 12,
            }
        )
    )
    dev, _ = create_holdout_split(prepared)
    frozen = train_frozen_logistic_pipeline(dev)  # noqa: PB001

    artifact, metadata_path = build_test_bundle(tmp_path)
    pipeline, manifest = load_bundle(artifact, metadata_path)
    predictor = BundlePredictor(pipeline=pipeline, manifest=manifest)

    sample = "THIS  IS   a NICE  COMMENT @user https://example.com"
    bundle_proba = predictor.predict([sample])[0]
    offline_proba = frozen.predict_proba([sample])[0]
    hate_index = int(np.where(np.asarray(frozen.classes_).astype(bool))[0][0])
    assert bundle_proba.score == pytest.approx(float(offline_proba[hate_index]))