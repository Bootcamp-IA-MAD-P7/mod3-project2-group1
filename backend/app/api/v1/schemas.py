"""Schemas Pydantic estrictos derivados del contrato OpenAPI v1."""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

AllowedLabel = Literal["hate", "non_hate"]
ScoreKind = Literal["calibrated_probability", "unavailable"]
PersistenceKind = Literal["disabled", "stored", "failed"]


class _StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)


class LiveResponse(_StrictModel):
    status: Literal["alive"]


class Capabilities(_StrictModel):
    prediction: Literal[True]
    video_analysis: bool
    monitoring: bool
    persistence: bool


class ReadyResponse(_StrictModel):
    status: Literal["ready"]
    model_version: str
    capabilities: Capabilities


class PredictionRequest(_StrictModel):
    text: str = Field(min_length=1, max_length=5000)

    @field_validator("text")
    @classmethod
    def reject_whitespace_only(cls, value: str) -> str:
        """Exige al menos un carácter no whitespace sin alterar el texto."""
        if not value.strip():
            raise ValueError("text must contain a non-whitespace character")
        return value


class PersistenceStatus(_StrictModel):
    status: PersistenceKind


class PredictionResponse(_StrictModel):
    prediction_id: UUID
    label: AllowedLabel
    score: float | None = Field(default=None, ge=0, le=1)
    score_kind: ScoreKind
    model_version: str = Field(min_length=1)
    review_required: Literal[True]
    created_at: datetime
    persistence: PersistenceStatus
    resource_token: str | None

    @model_validator(mode="after")
    def validate_score_consistency(self) -> "PredictionResponse":
        """Valida conjuntamente score y score_kind."""
        if self.score_kind == "unavailable":
            if self.score is not None:
                raise ValueError("score must be null when score_kind is unavailable")
        else:
            if self.score is None:
                raise ValueError("score is required when score_kind is calibrated_probability")
        return self