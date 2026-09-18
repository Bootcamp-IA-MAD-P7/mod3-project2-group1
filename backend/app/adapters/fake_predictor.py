"""Predictor determinista de desarrollo, claramente identificado y no usable en producción."""

from collections.abc import Sequence

from app.ports.predictor import InferenceResult


class FakePredictor:
    """Devuelve una señal fija de desarrollo; nunca se presenta como modelo entrenado."""

    MODEL_VERSION = "fake-dev-v1"

    def predict(self, texts: Sequence[str]) -> Sequence[InferenceResult]:
        if not texts:
            raise ValueError("predict requires a non-empty sequence of texts")
        return [
            InferenceResult(
                label="non_hate",
                score=None,
                score_kind="unavailable",
                model_version=self.MODEL_VERSION,
            )
            for _ in texts
        ]