"""Errores estandarizados con ErrorEnvelope conforme al contrato OpenAPI."""

import uuid
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict
from starlette.exceptions import HTTPException as StarletteHTTPException


class ErrorDetail(BaseModel):
    model_config = ConfigDict(extra="forbid")

    path: str
    reason: str


class ErrorBody(BaseModel):
    model_config = ConfigDict(extra="forbid")

    code: str
    message: str
    request_id: str
    details: list[ErrorDetail]


class ErrorEnvelope(BaseModel):
    model_config = ConfigDict(extra="forbid")

    error: ErrorBody


def generate_request_id() -> str:
    """Genera un request_id UUID para correlación en logs."""
    return str(uuid.uuid4())


def error_envelope(
    code: str,
    message: str,
    request_id: str,
    details: list[tuple[str, str]] | None = None,
) -> ErrorEnvelope:
    """Construye un ErrorEnvelope a partir de datos seguros."""
    items = [ErrorDetail(path=path, reason=reason) for path, reason in (details or [])]
    return ErrorEnvelope(
        error=ErrorBody(code=code, message=message, request_id=request_id, details=items)
    )


def _validation_details(errors: list[Any]) -> list[tuple[str, str]]:
    """Mapea errores de validación a path/reason seguros, sin eco del input."""
    details: list[tuple[str, str]] = []
    for err in errors:
        path = ".".join(str(part) for part in err.get("loc", []))
        reason = str(err.get("type", "invalid"))
        details.append((path, reason))
    return details


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Convierte errores de validación en un 422 ErrorEnvelope sin eco del input."""
    request_id = generate_request_id()
    details = _validation_details(exc.errors())
    envelope = error_envelope(
        code="VALIDATION_ERROR",
        message="Input validation failed",
        request_id=request_id,
        details=details,
    )
    return JSONResponse(status_code=422, content=envelope.model_dump())


_HTTP_ERROR_CODES: dict[int, str] = {
    404: "NOT_FOUND",
    503: "MODEL_UNAVAILABLE",
}


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Convierte HTTPException conocida en un ErrorEnvelope estándar."""
    request_id = generate_request_id()
    envelope = error_envelope(
        code=_HTTP_ERROR_CODES.get(exc.status_code, "HTTP_ERROR"),
        message=str(exc.detail),
        request_id=request_id,
    )
    return JSONResponse(status_code=exc.status_code, content=envelope.model_dump())


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Devuelve un 500 seguro sin exponer detalles internos."""
    request_id = generate_request_id()
    envelope = error_envelope(
        code="INTERNAL_ERROR",
        message="Unexpected server error",
        request_id=request_id,
    )
    return JSONResponse(status_code=500, content=envelope.model_dump())


def register_error_handlers(app: FastAPI) -> None:
    """Registra los handlers de ErrorEnvelope en la aplicación."""
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)