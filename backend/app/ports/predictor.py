"""Puerto de inferencia: contrato Python entre el backend y la capa ML."""

from collections.abc import Sequence
from dataclasses import dataclass
from typing import Literal, Protocol, runtime_checkable

AllowedLabel = Literal["hate", "non_hate"]
ScoreKind = Literal["calibrated_probability", "unavailable"]


@dataclass(frozen=True)
class InferenceResult:
    """Salida de una predicción: señal, score opcional y versión opaca.

    No contiene IDs HTTP, timestamps ni persistencia.
    """

    label: AllowedLabel
    score: float | None
    score_kind: ScoreKind
    model_version: str


@runtime_checkable
class Predictor(Protocol):
    """Protocolo que deben cumplir los adaptadores clásico/LSTM/transformer."""

    def predict(self, texts: Sequence[str]) -> Sequence[InferenceResult]:
        """Devuelve una salida por entrada, en el mismo orden, sin parciales."""