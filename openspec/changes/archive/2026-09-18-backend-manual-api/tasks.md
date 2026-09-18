# Tasks

## 1. Configuración y errores (core)

- [x] 1.1 Crear `backend/app/core/config.py` con `Settings` (pydantic-settings): `app_env`, `cors_origins`, `max_text_length`, `max_body_bytes`, `inference_timeout_seconds`, `model_path`; verificar con test de instanciación con defaults y regla de que el fake queda deshabilitado si `app_env == "production"` (US-09)
- [x] 1.2 Crear `backend/app/core/errors.py` con el esquema `ErrorEnvelope` (code, message, request_id UUID, details) y handlers de RequestValidationError→422 y excepción inesperada→500; verificar con test unitario de construcción de envelope y mapeo sin eco del input (US-09, RED de contrato antes de GREEN)

## 2. Schemas del contrato

- [x] 2.1 Crear `backend/app/api/v1/schemas.py` con LiveResponse, ReadyResponse, Capabilities, PersistenceStatus, PredictionRequest y PredictionResponse estrictos (`extra="forbid"`, `strict=True`) según openapi.json; verificar con tests de validación: texto válido, whitespace→error, longitud >5000→error, campo extra→error (UA-09)
- [x] 2.2 Implementar validación conjunta de score/score_kind y review_required en schemas; verificar con tests de que `unavailable` exige `score=None` y que `calibrated_probability` exige `[0,1]` (US-09)

## 3. Puertos y adaptadores

- [x] 3.1 Crear `backend/app/ports/predictor.py` con `Predictor` Protocol y `InferenceResult` (label, score, score_kind, model_version); verificar con test de cumplimiento estructural del FakePredictor frente al Protocol (US-09)
- [x] 3.2 Crear `backend/app/ports/repository.py` con `PredictionRepository` Protocol; verificar con test de conformidad del adaptador Null (US-09)
- [x] 3.3 Crear `backend/app/adapters/null_repo.py` con `NullPredictionRepository` que devuelve `disabled` sin abrir conexiones; verificar con test unitario de que no contacta red/DB (US-09)
- [x] 3.4 Crear `backend/app/adapters/fake_predictor.py` con `FakePredictor` determinista, una salida por entrada y `model_version` de fixture; verificar con test de determinismo y orden de salida por batch, y de desactivación en `production` (US-09)

## 4. Servicio de predicción

- [x] 4.1 Crear `backend/app/services/prediction_service.py` que componga predictor + repositorio, genere prediction_id UUID, timestamp UTC, `review_required=true` y persistence del repositorio; verificar con tests RED de servicio con fake y assertion de campos del contrato (US-09)

## 5. Rutas y app factory

- [x] 5.1 Crear `backend/app/api/v1/routes/health.py` con `GET /health/live` (200 alive sin dependencias) y `GET /health/ready` (200 con capabilities o 503 con ErrorEnvelope); verificar con tests de integración ASGI (US-09)
- [x] 5.2 Crear `backend/app/api/v1/routes/predictions.py` con `POST /predictions` delegando en el servicio; verificar con tests ASGI de 200/422 (validación estricta conforma al contrato) (US-09)
- [x] 5.3 Crear `backend/app/main.py` con `create_app()` (CORS desde settings, handlers de ErrorEnvelope, lifespan con predictor fake en desarrollo, prefijo `/api/v1`); verificar con smoke de TestClient que liveness responde sin modelo y que las rutas están montadas en `/api/v1` (US-09)

## 6. Verificación integral

- [x] 6.1 Ejecutar suite completa backend (`pytest`) verificar que todos los tests pasan sin red, DB ni servicios opcionales (US-09)
- [x] 6.2 Ejecutar lint (`ruff` desde `backend/`) y `openspec validate backend-manual-api --strict` cuando la CLI esté disponible; registrar resultados de forma fiel en diseño/tasks (US-09)
- [x] 6.3 Verificar manualmente con TestClient/uvicorn que health y POST predictions cumplen el contrato y que en `APP_ENV=production` el fake no está activo (readiness 503 en ausencia de predictor autorizado) (US-09)