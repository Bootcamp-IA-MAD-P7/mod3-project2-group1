# Contratos propuestos v1

Fuente formal de schemas y rutas: [openapi.json](openapi.json) (OpenAPI 3.1). Estado: revisión; taxonomía binaria depende de OQ-02. No hay endpoints implementados. Los fixtures son sintéticos. Este documento añade semántica que JSON Schema no expresa.

## HTTP

JSON UTF-8, UTC ISO-8601, UUID en IDs. Request IDs emitidos por servidor; todos los errores tienen `{error:{code,message,request_id,details}}`. Details solo paths/razones seguras, no eco del texto. Unknown request fields se rechazan; clientes toleran campos nuevos de respuesta. Breaking changes requieren `/api/v2`, no reinterpretar v1. No devolver clases nativas de sklearn ni stack traces.

| Endpoint | Nivel | Éxito | Errores / semántica |
|---|---|---|---|
| GET /api/v1/health/live | Essential | 200 status alive | Sin dependencia de modelo/DB/red |
| GET /api/v1/health/ready | Essential | 200 ready con capabilities | 503 MODEL_UNAVAILABLE si falta bundle; una dependencia opcional no cambia readiness esencial |
| POST /api/v1/predictions | Essential | 200 Prediction | 413 cuerpo >32 KiB; 422 entrada; 429 rate limit; 503 modelo; 504 timeout 10 s; 500 fallo inesperado |
| POST /api/v1/video-analyses | Medium | 202 AnalysisAccepted y token de acceso | 422 URL/limit; 429 cola llena; 503 función deshabilitada; fallos posteriores se reflejan en Job |
| GET /api/v1/video-analyses/{analysis_id} | Medium | 200 Job | token header requerido, 401 ausente; 404 inválido/inaccesible/expirado (sin revelar existencia) |
| GET /api/v1/video-analyses/{analysis_id}/results | Medium | 200 ResultPage | 422 cursor/limit; resultados disponibles incluso en processing/partial; token y 404 como anterior |
| POST /api/v1/video-monitors | Advanced | 202 MonitorAccepted y token | 422 intervalo/duración/URL; 429 capacidad; 503 deshabilitado |
| GET /api/v1/video-monitors/{monitor_id} | Advanced | 200 Monitor | token requerido; 401/404 |
| DELETE /api/v1/video-monitors/{monitor_id} | Advanced | 204 al detener; idempotente mientras exista recurso | token requerido; 401/404; no borra resultados previos |
| GET /api/v1/predictions/{prediction_id} | Expert | 200 Prediction | token requerido; 401/404; 503 STORAGE_UNAVAILABLE; sin listado público |

Todas las rutas con ID devuelven también 422 ErrorEnvelope si UUID o parámetros tienen formato inválido. La validación de formato no consulta existencia ni sustituye autorización.

`X-Resource-Token` es un secreto por recurso (propuesta aleatorio ≥256 bits, solo hash en almacenamiento). Se entrega al crear predicción guardada/job/monitor. Los tokens de predicción nulos significan que no existe resultado guardado accesible; las lecturas de predicciones y jobs no repiten el token. La excepción explícita es el monitor protegido: expone el token de su último análisis hijo para permitir consultar sus resultados. No usar query parameters para tokens. CORS permite header desde frontend configurado. Mocks usan strings inequívocamente ficticios.

### Predicción

Request `{ "text": "Comentario de ejemplo" }`; longitud de 1–5000 code points y al menos un carácter no whitespace. No modificar el texto antes de aplicar el preprocessing versionado; trim solo para validar vacío. `label` es señal sobre contenido, `hate` o `non_hate`, no una acusación. `score` es probabilidad calibrada de clase hate en [0,1] o null; `score_kind` es `calibrated_probability` o `unavailable`. Ambos se validan conjuntamente. Nunca convertir margen SVC a porcentaje por normalización arbitraria.

Ejemplo de respuesta sintética:

```json
{
  "prediction_id": "11111111-1111-4111-8111-111111111111",
  "label": "non_hate",
  "score": null,
  "score_kind": "unavailable",
  "model_version": "fixture-v1",
  "review_required": true,
  "created_at": "2026-09-14T10:00:00Z",
  "persistence": {"status": "disabled"},
  "resource_token": null
}
```

Persistence `failed` no altera label ni status 200. Solo `stored` puede entregar token al crear. `GET` lo devuelve null. Toda predicción mantiene `review_required=true`; no hay endpoint de sanción.

### Vídeo y monitor

Request video: `{youtube_url,max_comments}`; default 100, rango 1–500. Job aceptado devuelve `analysis_id,status=queued,resource_token,expires_at`; no requiere consulta YouTube síncrona para aceptar. Poll recomendado cada 2 s con backoff hasta 10 s, detener en terminal. Estado `queued → processing → completed|partial|failed`; transiciones monotónicas. `completed` vacío es válido. `partial` significa que hay resultados pero la extracción acabó por error; `truncated=true` al alcanzar límite, sin afirmar que se cubrió todo el vídeo.

Job expone video_id, fetched_count, analyzed_count, counts por etiqueta, stop_reason, error nullable y expires_at. Invariante `hate + non_hate = analyzed_count ≤ fetched_count ≤ max_comments`; no prometer total de comentarios existente. `completed` puede tener `stop_reason=limit_reached` y truncated true; `failed` tiene cero resultados y error; `partial` tiene resultados y error. Errores externos normalizados: VIDEO_NOT_FOUND, COMMENTS_DISABLED, QUOTA_EXCEEDED, UPSTREAM_UNAVAILABLE. Cuota no se reintenta inmediatamente. Estado terminal retiene resultados hasta TTL. Expiración/reinicio devuelve 404 e instrucción UI para nuevo análisis.

Resultados: items ordenados por ordinal de ingestión, cursor opaco estable, limit 1–100 default 50, next_cursor null cuando no hay más disponibles. Cada item incluye comment_id, texto plano, prediction y ordinal. Página no repite token de predicción. Deduplicación por comment_id. Mediante polling de Job el cliente sabe si llegarán más páginas. No confundir fin actual de página con fin del job.

Monitor request añade interval_seconds 300–3600 y duration_seconds 300–86400, duración ≥ intervalo. Monitor guarda `active|stopped|completed|failed`, último análisis y token de ese análisis accesible únicamente con token del monitor; el campo `latest_analysis_token` permite usar las rutas existentes. Tras DELETE deja de crear trabajos, permite terminar el que ya estaba procesándose y conserva último resultado hasta TTL. Una ejecución en curso impide lanzar la siguiente concurrentemente para el mismo monitor. Latest_analysis_id/token null antes del primer ciclo; el cliente no asume disponibilidad inmediata.

## Interfaz ML local (sin HTTP)

Contrato conceptual Python que deberá implementarse en `backend/ml/inference/`:

```python
class Predictor(Protocol):
    def predict(self, texts: Sequence[str]) -> Sequence[InferenceResult]: ...
```

Entrada no vacía, máximo propuesto 100 textos por batch, cada texto validado. Una salida por entrada, mismo orden. InferenceResult = label, score, score_kind, model_version; nunca IDs HTTP, timestamps ni persistencia. `UnsupportedInput`, `ModelUnavailable`, `InferenceTimeout` e `InferenceFailure` se traducen por servicio a errores de contrato. Sin resultados parciales dentro de una llamada ML; el job conserva batches ya completados. Adaptadores clásico/LSTM/transformer cumplen la misma suite. El backend añade metadata de request y guardado.

Preprocessing y vectorización forman parte del bundle; no duplicarlos en handler. Entrenamiento invoca una interfaz de tracking `log_params/log_metrics/log_artifact/close` con adapter local por defecto y MLflow opcional. Repositorio conceptual `save(record) -> stored|failed` y `get(id, token_hash) -> record|not_found`; NullRepo responde disabled sin abrir conexiones. Estas firmas describen puertos, no crean código ejecutable.

## Diseño de schemas Pydantic

Los modelos se implementarán en `backend/app/api/v1/schemas.py` o módulos por feature equivalentes. Ejemplo documental, no módulo ejecutable:

```python
class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    text: str = Field(min_length=1, max_length=5000)

    @field_validator("text")
    @classmethod
    def reject_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("text must contain a non-whitespace character")
        return value

class PredictionResponse(BaseModel):
    prediction_id: UUID
    label: Literal["hate", "non_hate"]
    score: float | None = Field(ge=0, le=1)
    score_kind: Literal["calibrated_probability", "unavailable"]
    model_version: str
    review_required: Literal[True]
    created_at: AwareDatetime
    persistence: PersistenceStatus
    resource_token: str | None
```

Usar validación de modelo para score/score_kind, token/status y contadores de Job; estricta evita coerción de números a texto. VideoAnalysisRequest, MonitorRequest, JobResponse, MonitorResponse, ResultPage y ErrorEnvelope se derivan de schemas homónimos en OpenAPI. UUID/timestamps, enums, límites y nullable son obligatorios tal como se especifican. Mapear también errores de validación FastAPI al ErrorEnvelope, sin eco de `input`. Timeout de inferencia requiere aislamiento/cancelación o capacidad limitada: un timeout HTTP no justifica acumular trabajos CPU sin límite.

## Pruebas de contrato

Validar todos los fixtures contra OpenAPI; snapshot semántico de schemas Pydantic frente al contrato revisado. Casos: éxito con y sin score, whitespace, longitud 5000/5001, tipo incorrecto, campo extra, DB caída, modelo incompatible, cuota con resultados parciales, vídeo vacío, cursor inválido, token ausente/incorrecto, expiración, cancelación y UI accesible. Mocks no contactan YouTube ni requieren modelo. E2E de producto final usa bundle real aprobado para demostrar inferencia, no fixtures.

Fuentes verificadas: [Pydantic Fields](https://pydantic.dev/docs/validation/latest/concepts/fields/) para restricciones de campos y [YouTube commentThreads.list](https://developers.google.com/youtube/v3/docs/commentThreads/list) para paginación y errores externos. Los límites de la aplicación son propuestas propias, no cuotas oficiales garantizadas.
