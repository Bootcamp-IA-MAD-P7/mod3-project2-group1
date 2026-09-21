"""Adaptador de inferencia real sobre un bundle congelado (US-16)."""

from __future__ import annotations

from collections.abc import Sequence

import numpy as np
from sklearn.pipeline import Pipeline

from app.ports.predictor import InferenceResult
from ml.inference.bundle import BundleManifest


class BundlePredictor:
    """Predictor real que cumple el contrato Python `Predictor`.

    El pipeline congelado incorpora preprocessing, TF-IDF y clasificador; la
    proba de clase hate es `predict_proba[:, hate_index]`, el score nunca es
    null (`calibrated_probability`) y la versión es opaca (hash del artefacto).
    """

    def __init__(self, pipeline: Pipeline, manifest: BundleManifest) -> None:
        self._pipeline = pipeline
        self._manifest = manifest
        self.MODEL_VERSION = manifest.artifact_sha256[:8]
        self._hate_index = self._resolve_hate_index()

    def _resolve_hate_index(self) -> int:
        classes = np.asarray(self._pipeline.classes_)
        hate_indices = np.where(classes.astype(bool))[0]
        if hate_indices.size == 0:
            raise ValueError("pipeline has no explicit True/hate class index")
        return int(hate_indices[0])

    def predict(self, texts: Sequence[str]) -> Sequence[InferenceResult]:
        """Devuelve una salida por entrada, en el mismo orden, sin parciales."""
        if not texts:
            raise ValueError("predict requires a non-empty sequence of texts")

        probabilities = self._pipeline.predict_proba(list(texts))
        results: list[InferenceResult] = []
        for row in probabilities:
            score = float(row[self._hate_index])
            results.append(
                InferenceResult(
                    label="hate" if score >= 0.5 else "non_hate",
                    score=score,
                    score_kind="calibrated_probability",
                    model_version=self.MODEL_VERSION,
                )
            )
        return results