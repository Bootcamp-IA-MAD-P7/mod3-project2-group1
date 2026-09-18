from datetime import UTC, datetime

from app.adapters.null_repo import NullPredictionRepository
from app.ports.repository import PredictionRecord, PredictionRepository


def _record() -> PredictionRecord:
    return PredictionRecord(
        prediction_id="11111111-1111-4111-8111-111111111111",
        text="hola",
        label="non_hate",
        score=None,
        score_kind="unavailable",
        model_version="fake-dev-v1",
        created_at=datetime(2026, 9, 14, 10, 0, 0, tzinfo=UTC),
    )


def test_null_repository_satisfies_protocol():
    """NullPredictionRepository cumple el Protocol PredictionRepository."""
    repo: PredictionRepository = NullPredictionRepository()

    assert isinstance(repo, PredictionRepository)


def test_null_repository_returns_disabled():
    """NullRepo informa disabled y no oculta la pérdida de persistencia."""
    repo = NullPredictionRepository()

    assert repo.save(_record()) == "disabled"


def test_null_repository_does_not_open_connections(monkeypatch):
    """NullRepo no abre conexiones de red/DB."""
    import socket

    def _fail(*args, **kwargs):
        raise AssertionError("NullRepo no debe abrir conexiones")

    monkeypatch.setattr(socket, "create_connection", _fail)
    monkeypatch.setattr(socket, "socket", _fail)

    repo = NullPredictionRepository()
    assert repo.save(_record()) == "disabled"