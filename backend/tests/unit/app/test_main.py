from fastapi import FastAPI
from starlette.testclient import TestClient

from app.core.config import Settings
from app.main import create_app


def test_create_app_builds():
    app: FastAPI = create_app()

    assert app is not None


def test_liveness_responds_without_model():
    """En desarrollo sin predictor configurado, el liveness no depende del modelo."""
    app = create_app()

    with TestClient(app) as client:
        response = client.get("/api/v1/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "alive"}


def test_routes_are_mounted_under_api_v1():
    """Las rutas están montadas bajo el prefijo /api/v1."""
    app = create_app()

    with TestClient(app) as client:
        live = client.get("/api/v1/health/live")
        prediction = client.post("/api/v1/predictions", json={"text": "hola"})

    assert live.status_code == 200
    assert prediction.status_code == 200


def test_unprefixed_routes_are_not_exposed():
    app = create_app()

    with TestClient(app) as client:
        response = client.get("/health/live")

    assert response.status_code == 404


def test_production_disables_fake_predictor():
    """En producción el fake no está activo: readiness y predictions quedan en 503."""
    app = create_app(settings=Settings(app_env="production"))

    with TestClient(app) as client:
        ready = client.get("/api/v1/health/ready")
        prediction = client.post("/api/v1/predictions", json={"text": "hola"})

    assert ready.status_code == 503
    assert ready.json()["error"]["code"] == "MODEL_UNAVAILABLE"
    assert prediction.status_code == 503
    assert prediction.json()["error"]["code"] == "MODEL_UNAVAILABLE"