from datetime import UTC, datetime

from app.ports.repository import PersistenceKind, PredictionRecord, PredictionRepository


class _StubRepository:
    def save(self, record: PredictionRecord) -> PersistenceKind:
        return "stored"


def test_stub_satisfies_repository_protocol():
    """Un objeto con save(record) cumple estructuralmente el Protocol."""
    repo: PredictionRepository = _StubRepository()

    assert isinstance(repo, PredictionRepository)


def test_prediction_record_fields():
    """PredictionRecord contiene la información mínima a persistir."""
    record = PredictionRecord(
        prediction_id="11111111-1111-4111-8111-111111111111",
        text="hola",
        label="non_hate",
        score=None,
        score_kind="unavailable",
        model_version="fake-dev-v1",
        created_at=datetime(2026, 9, 14, 10, 0, 0, tzinfo=UTC),
    )

    assert record.label == "non_hate"
    assert record.text == "hola"