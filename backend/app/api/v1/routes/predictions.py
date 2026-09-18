"""Ruta de predicción manual única."""

from fastapi import APIRouter, HTTPException

from app.api.v1.schemas import PredictionRequest, PredictionResponse
from app.services.prediction_service import PredictionService


def create_predictions_router(service: PredictionService | None) -> APIRouter:
    router = APIRouter()

    @router.post("/predictions", response_model=PredictionResponse)
    def create_prediction(payload: PredictionRequest) -> PredictionResponse:
        if service is None:
            raise HTTPException(status_code=503, detail="Predictor not available")
        return service.predict(text=payload.text)

    return router