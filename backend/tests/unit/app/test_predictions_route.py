from fastapi import FastAPI
from starlette.testclient import TestClient

from app.adapters.fake_predictor import FakePredictor
from app.adapters.null_repo import NullPredictionRepository
from app.api.v1.routes.predictions import create_predictions_router
from app.core.errors import register_error_handlers
from app.services.prediction_service import PredictionService


def _app():
    service = PredictionService(
        predictor=FakePredictor(),
        repository=NullPredictionRepository(),
    )
    app = FastAPI()
    register_error_handlers(app)
    app.include_router(create_predictions_router(service=service))
    return app


def test_create_prediction_returns_200_with_contract_fields():
    with TestClient(_app()) as client:
        response = client.post("/predictions", json={"text": "Comentario de ejemplo"})

    assert response.status_code == 200
    body = response.json()
    assert body["label"] == "non_hate"
    assert body["score"] is None
    assert body["score_kind"] == "unavailable"
    assert body["model_version"] == "fake-dev-v1"
    assert body["review_required"] is True
    assert body["persistence"]["status"] == "disabled"
    assert body["resource_token"] is None


def test_create_prediction_rejects_whitespace():
    with TestClient(_app()) as client:
        response = client.post("/predictions", json={"text": "   \t\n "})

    assert response.status_code == 422
    body = response.json()
    assert "error" in body
    assert body["error"]["code"] == "VALIDATION_ERROR"


def test_create_prediction_rejects_missing_text():
    with TestClient(_app()) as client:
        response = client.post("/predictions", json={})

    assert response.status_code == 422


def test_create_prediction_rejects_extra_field():
    with TestClient(_app()) as client:
        response = client.post("/predictions", json={"text": "hola", "extra": "x"})

    assert response.status_code == 422


def test_create_prediction_rejects_non_string_text():
    with TestClient(_app()) as client:
        response = client.post("/predictions", json={"text": 123})

    assert response.status_code == 422


def test_create_prediction_validation_error_has_no_input_echo():
    """El 422 no repite el valor del input del usuario en la respuesta."""
    with TestClient(_app()) as client:
        response = client.post("/predictions", json={"text": 123456789})

    assert "123456789" not in response.text
    assert response.status_code == 422
    body = response.json()
    assert body["error"]["code"] == "VALIDATION_ERROR"
    assert isinstance(body["error"]["details"], list)