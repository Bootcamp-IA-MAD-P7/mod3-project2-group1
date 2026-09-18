from collections.abc import Sequence

from app.ports.predictor import InferenceResult, Predictor


class _StubPredictor:
    def predict(self, texts: Sequence[str]) -> Sequence[InferenceResult]:
        return [
            InferenceResult(
                label="non_hate",
                score=None,
                score_kind="unavailable",
                model_version="stub-v1",
            )
            for _ in texts
        ]


def test_inference_result_fields():
    """InferenceResult describe la salida del contrato Python (sin HTTP)."""
    result = InferenceResult(
        label="non_hate",
        score=None,
        score_kind="unavailable",
        model_version="fake-dev-v1",
    )

    assert result.label == "non_hate"
    assert result.score is None
    assert result.score_kind == "unavailable"
    assert result.model_version == "fake-dev-v1"


def test_inference_result_accepts_calibrated_score():
    result = InferenceResult(
        label="hate",
        score=0.87,
        score_kind="calibrated_probability",
        model_version="fake-dev-v1",
    )

    assert isinstance(result.score, float)


def test_predictor_protocol_structural_conformance():
    """Un objeto con predict(texts) cumple estructuralmente el Protocol Predictor."""
    predictor: Predictor = _StubPredictor()

    assert isinstance(predictor, Predictor)
    results = predictor.predict(["uno", "dos"])
    assert len(results) == 2