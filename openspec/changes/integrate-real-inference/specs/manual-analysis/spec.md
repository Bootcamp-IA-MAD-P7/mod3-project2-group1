# manual-analysis Specification

## ADDED Requirements

### Requirement: API-04 Inferencia real y versión

El backend MUST cargar una vez por proceso un bundle congelado íntegro (pipeline completo con preprocessing/vectorizador/modelo, metadata sidecar y checksums `artifact_sha256`/`metadata_sha256`) y exponer la predicción por el contrato Python `Predictor`, sin cambiar rutas ni schemas. La respuestas MUST respetar el orden del batch, una salida por entrada y sin resultados parciales; el `score` MUST ser la probabilidad calibrada de clase hate en `[0,1]` (o `null` coherente con `score_kind`), y `model_version` MUST ser opaco (no revela algoritmo). Si el bundle es corrupto, faltante o incompatible, el backend MUST responder `readiness` `503` con `ErrorEnvelope` estándar, NUNCA con un predictor Dummy de reemplazo en silencio, y SIN conectarse a la base de datos.

Nivel: 🟢 Essential. Historias: US-16.

#### Scenario: API-04 bundle íntegro cargado una vez

- **WHEN** el backend arranca con un bundle válido (checksum y schema coherentes, modelo compatible)
- **THEN** el pipeline se carga una sola vez por proceso, `GET /api/v1/health/ready` responde `200` con `status: ready`, `model_version` opaca y `capabilities.prediction` disponible, sin presentar el modelo como aprobado/promocionado.

#### Scenario: API-04 orden de batch, score y versión opaca

- **WHEN** un cliente hace `POST /api/v1/predictions` (o inferencia batch) sobre el bundle real
- **THEN** recibe una salida por entrada en el mismo orden, sin parciales; `label` `hate`/`non_hate` según el umbral del pipeline, `score` la probabilidad calibrada de hate en `[0,1]` o `null` según `score_kind`, y `model_version` opaca; el resultado es idéntico al del pipeline congelado offline.

#### Scenario: API-04 bundle corrupto, faltante o incompatible

- **WHEN** el bundle no existe, no coincide el checksum, el schema no es compatible o el modelo no es el esperado
- **THEN** el backend responde `503` con `ErrorEnvelope` estándar en `readiness`, sin activar un predictor Dummy de reemplazo, sin conectar DB, mientras `GET /api/v1/health/live` sigue respondiendo `200`.