# Backend API manual — propuesta

## Why

El producto necesita un slice ejecutable que conecte frontend y API antes de disponer de modelo entrenado. Hoy `backend/` solo contiene la librería ML local: no existe `app/`, no hay rutas, ni endpoints de health ni de predicción. La Issue #11 (US-09) exige entregar conectividad y API manual con predictor fake de desarrollo, respetando el contrato OpenAPI revisado.

## What Changes

- Crear la aplicación FastAPI en `backend/app/` con el prefijo `/api/v1`.
- Implementar `GET /health/live` y `GET /health/ready` conforme a OpenAPI y al diseño del maestro.
- Implementar `POST /predictions` con validación estricta (1–5000 code points, al menos un carácter no whitespace, sin coerción ni campos extra) y respuesta `Prediction` / `ErrorEnvelope`.
- Añadir schemas Pydantic estrictos (`extra="forbid"`) derivados del contrato para health y predicción.
- Definir puertos Python (Protocols) `Predictor` y `PredictionRepository` y adaptadores de desarrollo: `FakePredictor` y `NullPredictionRepository`.
- Mantener el predictor fake deshabilitado en producción y claramente identificado en desarrollo/tests.
- Estandarizar errores con `ErrorEnvelope` (code, message, request_id, details) y mapear validación 422 sin eco del input.
- No añadir áreas fuera de Essential: sin DB, sin YouTube, sin monitoring, sin inferencia real (US-16, pendiente de US-15).

## Capabilities

### New Capabilities

Ninguna. Este change no introduce una capability nueva.

### Modified Capabilities

- `manual-analysis`: implementar el slice Essential PR-01 (contrato manual estable) en su parte de backend — health y `POST /predictions` — siguiendo el contrato revisado y el diseño del maestro; sin modificar la semántica de otros requisitos ni capacidades de niveles superiores.

## Impact

- **Código**: nuevo `backend/app/` (core, api/v1, ports, adapters, services); tests de contrato/integración ASGI en `backend/tests/`.
- **APIs**: primera implementación del contrato `openapi.json` (3 de 10 operaciones: getLiveness, getReadiness, createPrediction).
- **ML**: no se tocan `backend/ml/` ni los bundles; la inferencia real queda fuera (US-16).
- **Dependencias**: se usan las ya declaradas en `backend/pyproject.toml` (fastapi, pydantic, pydantic-settings, uvicorn); no se añaden dependencias Medium/Advanced/Expert.
- **Configuración**: entorno con defaults seguros (CORS local, APP_ENV); `MODEL_PATH` ausente no bloquea liveness ni predictions fake en desarrollo.
- **Issue**: cerrar la Issue #11 (US-09). Relación verificada por el propio número y contenido de la Issue.