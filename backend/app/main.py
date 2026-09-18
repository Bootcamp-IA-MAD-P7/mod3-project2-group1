"""App factory del backend del challenge (level: essential)."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.adapters.fake_predictor import FakePredictor
from app.adapters.null_repo import NullPredictionRepository
from app.api.v1.routes.health import create_health_router
from app.api.v1.routes.predictions import create_predictions_router
from app.core.config import Settings
from app.core.errors import register_error_handlers
from app.ports.predictor import Predictor
from app.services.prediction_service import PredictionService


def _build_predictor(settings: Settings) -> Predictor | None:
    """Solo permite el predictor fake en desarrollo; nunca en producción."""
    if settings.fake_predictor_enabled:
        return FakePredictor()
    return None


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or Settings()

    predictor = _build_predictor(settings)
    service = (
        PredictionService(
            predictor=predictor,
            repository=NullPredictionRepository(),
        )
        if predictor is not None
        else None
    )

    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        _app.state.predictor = predictor
        _app.state.prediction_service = service
        yield

    app = FastAPI(
        title="SaneText - Hate Speech Detection API",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_error_handlers(app)

    app.include_router(create_health_router(predictor=predictor), prefix="/api/v1")
    app.include_router(create_predictions_router(service=service), prefix="/api/v1")

    return app