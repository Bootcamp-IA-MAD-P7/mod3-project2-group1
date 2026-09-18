from fastapi import FastAPI
from starlette.testclient import TestClient

from app.adapters.fake_predictor import FakePredictor
from app.api.v1.routes.health import create_health_router


def _app_with_predictor():
    app = FastAPI()
    app.include_router(create_health_router(predictor=FakePredictor()))
    return app


def _app_without_predictor():
    app = FastAPI()
    app.include_router(create_health_router(predictor=None))
    return app


def test_liveness_returns_200_alive():
    with TestClient(_app_with_predictor()) as client:
        response = client.get("/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "alive"}


def test_readiness_returns_200_with_capabilities():
    with TestClient(_app_with_predictor()) as client:
        response = client.get("/health/ready")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ready"
    assert body["model_version"] == "fake-dev-v1"
    assert body["capabilities"]["prediction"] is True
    assert body["capabilities"]["video_analysis"] is False
    assert body["capabilities"]["monitoring"] is False
    assert body["capabilities"]["persistence"] is False


def test_readiness_returns_503_when_no_predictor():
    with TestClient(_app_without_predictor()) as client:
        response = client.get("/health/ready")

    assert response.status_code == 503
    error = response.json()["error"]
    assert error["code"] == "MODEL_UNAVAILABLE"
    assert "request_id" in error


def test_readiness_503_has_error_envelope_format():
    """El 503 de readiness respeta ErrorEnvelope (code, message, request_id, details)."""
    with TestClient(_app_without_predictor()) as client:
        response = client.get("/health/ready")

    error = response.json()["error"]
    assert isinstance(error["code"], str)
    assert isinstance(error["message"], str)
    assert isinstance(error["request_id"], str)
    assert isinstance(error["details"], list)