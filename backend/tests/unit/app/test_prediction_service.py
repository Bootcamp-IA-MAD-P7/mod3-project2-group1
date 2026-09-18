from datetime import UTC
from uuid import UUID

from app.adapters.fake_predictor import FakePredictor
from app.adapters.null_repo import NullPredictionRepository
from app.services.prediction_service import PredictionService


def test_service_returns_contract_fields():
    """El servicio construye PredictionResponse conforme al contrato."""
    service = PredictionService(
        predictor=FakePredictor(),
        repository=NullPredictionRepository(),
    )

    response = service.predict(text="Comentario de ejemplo")

    assert isinstance(response.prediction_id, UUID)
    assert response.label == "non_hate"
    assert response.score is None
    assert response.score_kind == "unavailable"
    assert response.model_version == "fake-dev-v1"
    assert response.review_required is True
    assert response.created_at.tzinfo is not None
    assert response.created_at.utcoffset() == UTC.utcoffset(response.created_at)
    assert response.persistence.status == "disabled"
    assert response.resource_token is None


def test_service_generates_unique_ids():
    """Cada solicitud produce su propio prediction_id."""
    service = PredictionService(
        predictor=FakePredictor(),
        repository=NullPredictionRepository(),
    )

    first = service.predict(text="uno")
    second = service.predict(text="dos")

    assert first.prediction_id != second.prediction_id


def test_service_uses_persistence_from_repository():
    """La persistence del repositorio se refleja sin bloquear la inferencia."""
    service = PredictionService(
        predictor=FakePredictor(),
        repository=NullPredictionRepository(),
    )

    response = service.predict(text="x")

    assert response.persistence.status == "disabled"
    assert response.label == "non_hate"