"""Integración ASGI de la inferencia real (US-16): readiness, predictions y fallos."""

from __future__ import annotations

from starlette.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from tests.unit._bundle_factory import build_test_bundle


def _client_for_artifact(artifact, *, app_env: str = "development"):
    settings = Settings(
        _env_file=None,
        app_env=app_env,
        model_path=str(artifact),
    )
    return TestClient(create_app(settings))


def test_readiness_200_with_real_bundle(tmp_path):
    artifact, _ = build_test_bundle(tmp_path)

    with _client_for_artifact(artifact) as client:
        response = client.get("/api/v1/health/ready")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ready"
    assert len(body["model_version"]) == 8
    assert set(body["model_version"]) <= set("0123456789abcdef")
    assert body["capabilities"]["prediction"] is True


def test_readiness_200_liveness_with_real_bundle(tmp_path):
    artifact, _ = build_test_bundle(tmp_path)

    with _client_for_artifact(artifact) as client:
        ready = client.get("/api/v1/health/ready")
        live = client.get("/api/v1/health/live")

    assert ready.status_code == 200
    assert live.status_code == 200
    assert live.json() == {"status": "alive"}


def test_predictions_return_real_signal(tmp_path):
    artifact, _ = build_test_bundle(tmp_path)

    with _client_for_artifact(artifact) as client:
        response = client.post("/api/v1/predictions", json={"text": "hate you"})

    assert response.status_code == 200
    body = response.json()
    assert body["label"] in {"hate", "non_hate"}
    assert body["score"] is not None
    assert 0.0 <= body["score"] <= 1.0
    assert body["score_kind"] == "calibrated_probability"
    assert len(body["model_version"]) == 8
    assert body["review_required"] is True
    assert body["persistence"]["status"] == "disabled"
    assert body["resource_token"] is None


def test_corrupt_bundle_readiness_503_and_liveness_200(tmp_path):
    artifact, _ = build_test_bundle(tmp_path, corrupt_artifact=True)

    with _client_for_artifact(artifact) as client:
        ready = client.get("/api/v1/health/ready")
        live = client.get("/api/v1/health/live")
        prediction = client.post("/api/v1/predictions", json={"text": "hate you"})

    assert ready.status_code == 503
    assert ready.json()["error"]["code"] == "MODEL_UNAVAILABLE"
    assert live.status_code == 200
    assert prediction.status_code == 503


def test_missing_bundle_readiness_503(tmp_path):
    artifact, _ = build_test_bundle(tmp_path)
    artifact.unlink()

    with _client_for_artifact(artifact) as client:
        response = client.get("/api/v1/health/ready")

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "MODEL_UNAVAILABLE"


def test_bundle_loads_once_per_process(tmp_path, monkeypatch):
    from app import main as main_module
    from ml.inference.bundle import load_bundle as real_load

    calls: list[int] = []

    def counting_load(*args, **kwargs):
        calls.append(1)
        return real_load(*args, **kwargs)

    monkeypatch.setattr(main_module, "load_bundle", counting_load)
    artifact, _ = build_test_bundle(tmp_path)

    create_app(
        settings=Settings(_env_file=None, app_env="development", model_path=str(artifact))
    )

    assert len(calls) == 1


def test_production_without_bundle_readiness_503_no_dummy(tmp_path):
    settings = Settings(_env_file=None, app_env="production", model_path="")
    with TestClient(create_app(settings)) as client:
        ready = client.get("/api/v1/health/ready")
        prediction = client.post("/api/v1/predictions", json={"text": "hola"})

    assert ready.status_code == 503
    assert ready.json()["error"]["code"] == "MODEL_UNAVAILABLE"
    assert prediction.status_code == 503