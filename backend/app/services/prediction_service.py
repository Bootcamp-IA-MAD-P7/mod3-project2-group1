"""Caso de uso de predicción manual: composición por inyección."""

from datetime import UTC, datetime
from uuid import uuid4

from app.api.v1.schemas import PersistenceStatus, PredictionResponse
from app.ports.predictor import Predictor
from app.ports.repository import PredictionRecord, PredictionRepository


class PredictionService:
    """Coordina validación, inferencia y persistencia para una predicción manual."""

    def __init__(self, predictor: Predictor, repository: PredictionRepository) -> None:
        self._predictor = predictor
        self._repository = repository

    def predict(self, text: str) -> PredictionResponse:
        prediction_id = uuid4()
        created_at = datetime.now(UTC)

        if not text.strip():
            raise ValueError("text must contain a non-whitespace character")

        result = self._predictor.predict([text])[0]

        record = PredictionRecord(
            prediction_id=str(prediction_id),
            text=text,
            label=result.label,
            score=result.score,
            score_kind=result.score_kind,
            model_version=result.model_version,
            created_at=created_at,
        )
        persistence = self._repository.save(record)

        return PredictionResponse(
            prediction_id=prediction_id,
            label=result.label,
            score=result.score,
            score_kind=result.score_kind,
            model_version=result.model_version,
            review_required=True,
            created_at=created_at,
            persistence=PersistenceStatus(status=persistence),
            resource_token=None,
        )