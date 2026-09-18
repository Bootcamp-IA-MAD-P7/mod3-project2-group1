# manual-analysis Specification

## Purpose
Capacidad de análisis manual de textos en el backend del challenge: expone health check y predicción manual con un predictor determinista de desarrollo, cumpliendo el contrato OpenAPI revisado en el nivel Essential.

## Requirements

### Requirement: API-01 Health manual

El backend MUST exponer `GET /api/v1/health/live` y `GET /api/v1/health/ready` conforme al contrato OpenAPI revisado. Liveness devuelve `200` sin depender de modelo, almacenamiento ni red. Readiness devuelve `200` con `status: ready`, `model_version` y `capabilities` cuando el predictor está disponible, y `503` con `ErrorEnvelope` cuando la dependencia requerida (modelo) no está disponible. La ausencia de dependencias opcionales de nivel superior NO impide readiness Essential.

Nivel: 🟢 Essential. Historias: US-09.

#### Scenario: API-01 liveness sin dependencias

- **WHEN** un cliente llama a `GET /api/v1/health/live` sin modelo, base de datos ni red disponibles
- **THEN** recibe `200` con cuerpo `{"status": "alive"}` y sin depender de ninguna dependencia externa.

#### Scenario: API-01 readiness con predictor disponible

- **WHEN** un cliente llama a `GET /api/v1/health/ready` y el predictor de desarrollo está cargado
- **THEN** recibe `200` con `status: ready`, `model_version` (opaca) y `capabilities` que declaran `prediction` disponible y las capacidades de niveles superiores como deshabilitadas, sin fallar.

#### Scenario: API-01 readiness sin modelo

- **WHEN** el predictor requerido no está disponible o no es compatible
- **THEN** el backend responde `503` con `ErrorEnvelope` estándar, mientras liveness sigue respondiendo `200`.

### Requirement: API-02 Predicción manual estable

El backend MUST aceptar `POST /api/v1/predictions` con texto de 1 a 5000 code points y al menos un carácter no whitespace, aplicando validación estricta sin coerción de tipos ni campos extra, y devolver `200` con el schema `Prediction` (label `hate`/`non_hate`, score nullable, score_kind, model_version, review_required, persistence `disabled`, resource_token nullable) o un `ErrorEnvelope` estándar en los casos de error. MUST NOT aceptar tipos/coerciones/campos extra inválidos.

Nivel: 🟢 Essential. Historias: US-09.

#### Scenario: API-02 texto válido

- **WHEN** un cliente envía `POST /api/v1/predictions` con un texto de al menos un carácter no whitespace y longitud entre 1 y 5000 code points
- **THEN** recibe `200` con un `Prediction` conforme al contrato, incluyendo `persistence.status` con valor `disabled`, `resource_token` `null` y `review_required` `true`.

#### Scenario: API-02 whitespace rechazado

- **WHEN** un cliente envía un texto compuesto únicamente por whitespace
- **THEN** recibe `422` con `ErrorEnvelope` estándar, error de validación sin eco del input y sin aceptar el texto.

#### Scenario: API-02 límite de longitud

- **WHEN** un cliente envía un texto de longitud superior a 5000 code points, un campo extra o un tipo incorrecto
- **THEN** recibe `422` con `ErrorEnvelope` estándar y `details` que indican path y razón de forma segura, sin eco de contenido.

### Requirement: API-03 Predictor fake acotado a desarrollo

El backend MUST soportar un predictor determinista de desarrollo claramente identificado y deshabilitado en producción. El predictor fake MUST cumplir el contrato Python `Predictor` (una salida por entrada, mismo orden, sin resultados parciales) y ser sustituible por la inferencia real sin cambiar rutas ni schemas. MUST NOT presentarse como modelo entrenado.

Nivel: 🟢 Essential. Historias: US-09.

#### Scenario: API-03 fake identificado en desarrollo

- **WHEN** se ejecuta el backend en entorno de desarrollo con predictor fake configurado
- **THEN** la respuesta de predicción refleja una `model_version` inequívocamente de desarrollo/fixture, la readiness lo declara disponible y ningún log ni respuesta lo presenta como modelo entrenado.

#### Scenario: API-03 fake prohibido en producción

- **WHEN** el entorno de aplicación es producción y no existe un predictor autorizado configurado
- **THEN** el predictor fake no se activa, readiness responde `503` con `ErrorEnvelope` y liveness continúa respondiendo.