# Integrar inferencia real (US-16)

## Why

US-09 entrega la API manual con un predictor fake de desarrollo. US-15 congeló y evaluó el candidato Logistic Regression (fallo de gate reportado, promoción pendiente de decisión humana). El producto necesita consultar el pipeline real en la API para producir una señal reproducible, manteniendo el contrato `Predictor` sin tocar rutas ni schemas.

## What Changes

- Crear `backend/ml/inference/`: loader de bundle (pipeline + metadata sidecar + checksums) y `BundlePredictor` que cumple el contrato Python `Predictor`.
- Usar `MODEL_PATH` (joblib) con metadata sidecar `<path>.metadata.json`; carga única por proceso y validación de checksum/schema al arrancar.
- Integrar el predictor real en la app: `readiness` 503 sin Dummy si el bundle es corrupto/faltante/incompatible; liveness sigue 200; sin llamadas a DB.
- Suprimir la exposición del fake en producción (prohibido según API-03); fake solo desarrollo y solo si no hay bundle.
- Añadir requisito real-inference a la capability `manual-analysis` (PR-02) con escenarios WHEN/THEN.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `manual-analysis`: añade el requisito de inferencia real (PR-02): bundle íntegro cargado una vez por proceso, respuestas con orden de batch, score nullable/consistente y versión opaca, paridad con la pipeline offline, y readiness 503 ante bundle corrupto/faltante/incompatible sin fallback Dummy y sin conectarse a DB.

## Impact

- Código backend nuevo (`backend/ml/inference/`) y cambios en `app/core/config.py` y `app/main.py`.
- Tests unitarios e integración ASGI con bundle real pequeño.
- No cambia el contrato HTTP de `/api/v1`, ni rutas, ni schemas, ni el transformado de datos.
- Trazabilidad: US-16 en la planificación (Issue enlazada de US-16). No se promociona el candidato: la integración usa el bundle congelado DEV-only; la decisión del gate US-15 sigue pendiente y bloquea sync/archive.