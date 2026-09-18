from app.adapters.fake_predictor import FakePredictor
from app.ports.predictor import Predictor


def test_fake_predictor_satisfies_protocol():
    """FakePredictor cumple el Protocol Predictor (una salida por entrada)."""
    predictor: Predictor = FakePredictor()

    assert isinstance(predictor, Predictor)


def test_fake_predictor_is_deterministic():
    """Misma entrada produce misma salida en llamadas repetidas."""
    predictor = FakePredictor()

    first = predictor.predict(["hola", "mundo"])
    second = predictor.predict(["hola", "mundo"])

    assert [(r.label, r.score, r.score_kind) for r in first] == [
        (r.label, r.score, r.score_kind) for r in second
    ]


def test_fake_predictor_preserves_order_and_count():
    """Una salida por entrada, mismo orden, sin resultados parciales."""
    predictor = FakePredictor()

    texts = ["a", "b", "c"]
    results = predictor.predict(texts)

    assert len(results) == len(texts)
    assert [r.label for r in results] == ["non_hate", "non_hate", "non_hate"]


def test_fake_predictor_uses_fixture_model_version():
    """La versión del fake es inequívocamente de desarrollo, nunca un modelo entrenado."""
    predictor = FakePredictor()

    results = predictor.predict(["hola"])

    assert results[0].model_version.startswith("fake")
    assert results[0].model_version == "fake-dev-v1"


def test_fake_predictor_returns_nullable_score():
    """El fake de Essential devuelve score null con score_kind unavailable."""
    predictor = FakePredictor()

    result = predictor.predict(["x"])[0]

    assert result.score is None
    assert result.score_kind == "unavailable"


def test_fake_predictor_rejects_empty_batch():
    """El contrato Python exige entrada no vacía."""
    import pytest

    predictor = FakePredictor()

    with pytest.raises(ValueError):
        predictor.predict([])