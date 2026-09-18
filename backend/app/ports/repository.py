"""Puerto de persistencia de predicciones (NullRepo en Essential)."""

from dataclasses import dataclass
from datetime import datetime
from typing import Literal, Protocol, runtime_checkable

PersistenceKind = Literal["disabled", "stored", "failed"]
ScoreKind = Literal["calibrated_probability", "unavailable"]
AllowedLabel = Literal["hate", "non_hate"]


@dataclass(frozen=True)
class PredictionRecord:
    """Datos mínimos de una predicción a persistir (sin secretos ni author)."""

    prediction_id: str
    text: str
    label: AllowedLabel
    score: float | None
    score_kind: ScoreKind
    model_version: str
    created_at: datetime


@runtime_checkable
class PredictionRepository(Protocol):
    """Protocolo de persistencia; NullRepo responde disabled sin conexiones."""

    def save(self, record: PredictionRecord) -> PersistenceKind:
        """Guarda el registro y devuelve el estado de persistencia resultante."""