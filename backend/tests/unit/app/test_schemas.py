import uuid
from datetime import UTC, datetime

import pytest
from pydantic import ValidationError

from app.api.v1.schemas import (
    Capabilities,
    LiveResponse,
    PersistenceStatus,
    PredictionRequest,
    PredictionResponse,
    ReadyResponse,
)

VALID_TEXT = "Comentario de ejemplo"
FIXED_ID = uuid.UUID("11111111-1111-4111-8111-111111111111")
FIXED_TIME = datetime(2026, 9, 14, 10, 0, 0, tzinfo=UTC)


def _prediction_kwargs(**overrides):
    kwargs = {
        "prediction_id": FIXED_ID,
        "label": "non_hate",
        "score": None,
        "score_kind": "unavailable",
        "model_version": "fake-dev-v1",
        "review_required": True,
        "created_at": FIXED_TIME,
        "persistence": {"status": "disabled"},
        "resource_token": None,
    }
    kwargs.update(overrides)
    return kwargs


def test_prediction_request_accepts_valid_text():
    request = PredictionRequest(text="  hola mundo  ")

    assert request.text == "  hola mundo  "


def test_prediction_request_rejects_whitespace_only():
    with pytest.raises(ValidationError):
        PredictionRequest(text="   \t\n  ")


def test_prediction_request_rejects_empty_string():
    with pytest.raises(ValidationError):
        PredictionRequest(text="")


def test_prediction_request_rejects_too_long_text():
    with pytest.raises(ValidationError):
        PredictionRequest(text="a" * 5001)


def test_prediction_request_accepts_5000_characters():
    request = PredictionRequest(text="a" * 5000)

    assert len(request.text) == 5000


def test_prediction_request_rejects_extra_field():
    with pytest.raises(ValidationError):
        PredictionRequest(text=VALID_TEXT, extra="campo")


def test_prediction_request_does_not_coerce_types():
    with pytest.raises(ValidationError):
        PredictionRequest(text=123)


def test_live_response_requires_alive_status():
    response = LiveResponse(status="alive")

    assert response.status == "alive"


def test_ready_response_with_capabilities():
    response = ReadyResponse(
        status="ready",
        model_version="fake-dev-v1",
        capabilities=Capabilities(
            prediction=True,
            video_analysis=False,
            monitoring=False,
            persistence=False,
        ),
    )

    assert response.status == "ready"
    assert response.capabilities.prediction is True
    assert response.capabilities.video_analysis is False


def test_persistence_status_accepts_known_values():
    assert PersistenceStatus(status="disabled").status == "disabled"
    assert PersistenceStatus(status="stored").status == "stored"
    assert PersistenceStatus(status="failed").status == "failed"


def test_prediction_response_without_score():
    response = PredictionResponse(**_prediction_kwargs())

    assert response.score is None
    assert response.score_kind == "unavailable"
    assert response.review_required is True
    assert response.persistence.status == "disabled"
    assert response.resource_token is None


def test_prediction_response_serializes_uuid_and_datetime():
    response = PredictionResponse(**_prediction_kwargs())
    dumped = response.model_dump(mode="json")

    assert dumped["prediction_id"] == "11111111-1111-4111-8111-111111111111"
    assert dumped["created_at"].startswith("2026-09-14T10:00:00")


def test_prediction_response_unavailable_requires_null_score():
    with pytest.raises(ValidationError):
        PredictionResponse(**_prediction_kwargs(score=0.9, score_kind="unavailable"))


def test_prediction_response_calibrated_requires_score_in_range():
    with pytest.raises(ValidationError):
        PredictionResponse(
            **_prediction_kwargs(score=1.5, score_kind="calibrated_probability", label="hate")
        )


def test_prediction_response_calibrated_requires_score_not_null():
    with pytest.raises(ValidationError):
        PredictionResponse(
            **_prediction_kwargs(score=None, score_kind="calibrated_probability")
        )