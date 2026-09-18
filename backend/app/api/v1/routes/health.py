"""Rutas de health: liveness y readiness."""

from fastapi import APIRouter, Response

from app.api.v1.schemas import Capabilities, LiveResponse, ReadyResponse
from app.core.errors import error_envelope, generate_request_id
from app.ports.predictor import Predictor


def create_health_router(predictor: Predictor | None = None) -> APIRouter:
    router = APIRouter()

    @router.get("/health/live")
    def get_liveness() -> LiveResponse:
        return LiveResponse(status="alive")

    @router.get("/health/ready")
    def get_readiness() -> Response:
        if predictor is None:
            envelope = error_envelope(
                code="MODEL_UNAVAILABLE",
                message="Predictor not available",
                request_id=generate_request_id(),
            )
            return Response(
                content=envelope.model_dump_json(),
                status_code=503,
                media_type="application/json",
            )
        return Response(
            content=ReadyResponse(
                status="ready",
                model_version=predictor.MODEL_VERSION if hasattr(predictor, "MODEL_VERSION") else "unknown",
                capabilities=Capabilities(
                    prediction=True,
                    video_analysis=False,
                    monitoring=False,
                    persistence=False,
                ),
            ).model_dump_json(),
            status_code=200,
            media_type="application/json",
        )

    return router