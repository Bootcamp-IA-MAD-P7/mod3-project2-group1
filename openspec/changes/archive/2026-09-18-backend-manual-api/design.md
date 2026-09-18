# Backend API manual — diseño

## Context

Estado actual: `backend/` contiene únicamente la librería ML local (`ml/`) con `pyproject.toml` que ya declara fastapi, pydantic, pydantic-settings y uvicorn. No existe `backend/app/`. El contrato formal es `openspec/changes/define-project/contracts/openapi.json`; la semántica en `contracts/README.md`. Ver proposal.md para motivación.

Restricciones vinculantes del maestro (design.md de define-project): monolito modular (D-01), estructura `app/` (D-02), contratos primero y artefactos opacos (D-05), persistencia progresiva con NullPredictionRepository (D-07), configuración Pydantic Settings (D-09). Este slice Essential no introduce DB, YouTube, MLflow ni redes neuronales.

## Goals / Non-Goals

**Goals:**
- Entregar el slice Essential de backend: health y predicción manual con predictor determinista de desarrollo.
- Cumplir el contrato OpenAPI en forma y semántica (schemas estrictos, ErrorEnvelope, límites).
- Definir los puertos Python (Predictor, PredictionRepository) y composición por inyección para que US-16 (inferencia real) y US-30 (persistencia) solo añadan adaptadores.
- Tests RED→GREEN→REFACTOR sin red, sin DB y sin servicios opcionales.

**Non-Goals:**
- Inferencia real sobre bundles (US-16): se diseña el puerto y un FakePredictor; no se integra artefacto.
- Rutas de vídeo (US-20/21), monitoring (US-26) e historial (US-30).
- Rate limiting avanzado con colas distribuidas; autenticación multiusuario.
- Publicar Issues ni hacer Git/GitHub: control humano obligatorio (AGENTS.md).

## Decisions

### DC-01 — App factory y lifespan con predictor inyectado

`app/main.py` expone `create_app()` que construye la aplicación FastAPI con: prefijo `/api/v1`, middleware CORS desde configuración, handlers de excepciones (ErrorEnvelope) y un estado de aplicación que conserva el predictor disponible. El predictor se resuelve en el módulo de configuración/adapters (fake en desarrollo, real en US-16) y se carga una sola vez por proceso.

Alternativa considerada: módulos singleton con imports globales. Rechazada: dificulta tests aislados y la sustitución de adaptadores por nivel.

### DC-02 — Configuración central con Pydantic Settings (D-09)

`app/core/config.py` define `Settings` (pydantic-settings) con defaults seguros:
- `app_env`: `development`; el fake solo se activa si `app_env != "production"`.
- `cors_origins`: lista explícita (`http://localhost:5173`).
- Límites de contrato: `max_text_length=5000`, `max_body_bytes=32768`, `inference_timeout_seconds=10`.
- `model_path`: vacío por defecto; ausencia NO bloquea liveness ni predictions fake en desarrollo (readiness declarará predicción como disponible con el fake en desarrollo).

Alternativa: hardcodear valores en rutas. Rechazada: impide validación condicional y el perfil de producción.

### DC-03 — Schemas estrictos derivados del contrato

`app/api/v1/schemas.py` implementa LiveResponse, ReadyResponse, Capabilities, PredictionRequest, PersistenceStatus, PredictionResponse y ErrorEnvelope con `model_config = ConfigDict(extra="forbid", strict=True)`. Validaciones de modelo: texto 1–5000 code points con al menos un carácter no whitespace (validación conjunta con trim solo para detectar vacío, sin alterar el texto); score/score_kind validados conjuntamente (si `unavailable` ⇒ score `None`; si `calibrated_probability` ⇒ `0 <= score <= 1`).

### DC-04 — ErrorEnvelope y mapeo de errores

`app/core/errors.py` define el esquema ErrorEnvelope (`code`, `message`, `request_id` UUID, `details` con `path`/`reason` seguras) y handlers globales:
- Validación FastAPI (RequestValidationError) → `422` con details de path/reason, sin eco del `input` y sin stack traces.
- Diversas excepciones predecibles → códigos de contrato (p. ej. modelo no disponible ↔ 503).
- HTTPException conocida → envelope con su código.
- Error inesperado → `500` seguro (mensaje genérico), sin exponer el interno, y con `request_id` para correlación en logs (sin texto de entrada ni secretos).

ErrorEnvelope se reutiliza tal cual en respuestas de error; los fixtures del contrato se respetan.

### DC-05 — Puertos Python y composición por inyección (D-05/D-07)

`app/ports/predictor.py` define el Protocol `Predictor.predict(texts) -> Sequence[InferenceResult]` (InferenceResult: label, score nullable, score_kind, model_version). `app/ports/repository.py` define `PredictionRepository.save(record)`.

Adaptadores:
- `app/adapters/null_repo.py`: `NullPredictionRepository` devuelve persistencia `disabled`, sin abrir conexiones (D-07).
- `app/adapters/fake_predictor.py`: `FakePredictor` determinista de desarrollo, activo solo si `app_env != "production"`, con `model_version` inequívocamente de fixture (p. ej. `fake-dev-v1`). Cumple una salida por entrada, mismo orden, sin resultados parciales.

`app/services/prediction_service.py` compone: valida entrada (bounded por schemas), delega en `Predictor`, construye `PredictionResponse` con UUID, timestamp UTC, `review_required=true`, persistence desde el repositorio y `resource_token` `null` (no hay guardado en este slice). No hay timeout interno todavía: la ejecución del fake es síncrona y acotada; US-16 introducirá el aislamiento/cancelación de inferencia.

### DC-06 — Rutas delgadas y montaje

`app/api/v1/routes/health.py`: `GET /health/live` (200 alive, sin dependencias) y `GET /health/ready` (200 con capabilities, o 503 si el predictor no está disponible). `app/api/v1/routes/predictions.py`: `POST /predictions` delega en el servicio. La composición (settings → servicios → router) ocurre en `create_app()`; las rutas reciben dependencias por FastAPI `Depends`/estado para permitir tests con fakes.

## Risks / Trade-offs

- [Contrato binario aún condicionado a OQ-02] → Este slice respeta la taxonomía `hate`/`non_hate` ya aprobada para mocks/fake; cualquier revisión posterior es un cambio de spec con su propio change.
- [Presentar el fake como modelo real] → `model_version` de fixture y fake deshabilitado en `production`; readiness identifica el perfil.
- [ErrorEnvelope omite detalles internos] → Logs con `request_id` para diagnóstico, sin texto de entrada ni secretos.
- [Sin aislamiento de timeout en fake] → Aceptable para un fake síncrono; el diseño deja el puerto y el punto de composición para que US-16 añada aislamiento/cancelación sin reescribir rutas.

## Migration Plan

- No hay migración de datos. Despliegue: arrancar `backend` con `uv run uvicorn app.main:app` en desarrollo; en producción, el fake no está disponible y readiness quedará 503 hasta configurar un predictor autorizado (US-16).
- Rollback: revertir el commit del change; no hay servicios opcionales ni DB que desactivar.

## Open Questions

Ninguna que altere specs, enfoque o tareas en este slice. La integración del bundle real (checksum/schema del artefacto, paridad offline) pertenece a US-16 y se definirá en su change.