# Tasks

## 1. Carga y validación del bundle

- [x] 1.1 Crear `backend/ml/inference/bundle.py` con `BundleManifest` (Pydantic, metadata sidecar) y `load_bundle(artifact_path, metadata_path)` que valida `artifact_sha256`, autoconsistencia de `metadata_sha256`, `schema_version` y modelo compatible; verificar con test de que un bundle válido se carga y los checksums son coherentes
- [x] 1.2 Definir y lanzar `BundleMissingError`, `BundleCorruptError` y `BundleIncompatibleError` indicando la causa; verificar con tests de archivo faltante, bytes alterados (checksum) y `schema_version` no soportado

## 2. Adaptador de predicción real

- [x] 2.1 Crear `backend/ml/inference/bundle_predictor.py` con `BundlePredictor(pipeline, manifest)` que cumple el Protocol `Predictor`: una salida por entrada en el mismo orden, `label` por `predict_proba` con umbral 0.5 sobre la proba de hate, `score` = proba calibrada de hate en `[0,1]` (no nulo con `score_kind="calibrated_probability"`) y `model_version` opaca `artifact_sha256[:8]`; verificar con tests de orden, valores y composición del `InferenceResult`
- [x] 2.2 Verificar que el bundle se carga una sola vez por proceso (conteo de carga en la factoría/lifespan) y que el pipeline devuelve predicciones idénticas al refit offline de `create_best_logistic_pipeline_observed_on_dev()` (paridad) en textos de muestra

## 3. Configuración y wiring de la app

- [x] 3.1 Añadir a `Settings` la resolución de la metadata sidecar (`model_metadata_path` = `<model_path>.metadata.json`) y verificar con test de defaults/`MODEL_PATH`
- [x] 3.2 Integrar en `app/main.py`: construir `BundlePredictor` en el lifespan cuando `MODEL_PATH` es válido (carga única); sin `MODEL_PATH` → `FakePredictor` solo en desarrollo y `None` en producción; bundle inválido/corrupto/ausente → predictor `None`; verificar con tests ASGI: readiness `200` con bundle real, `503` sin bundle o con bundle corrupto, liveness `200` siempre, y que en `APP_ENV=production` sin bundle hay `503` sin Dummy

## 4. Verificación del change

- [x] 4.1 Ejecutar suite backend completa (`pytest` desde `backend/`) y registrar resultado real
- [x] 4.2 Ejecutar `ruff check .` desde `backend/`, corregir hallazgos y registrar resultado real
- [x] 4.3 Ejecutar `openspec validate integrate-real-inference --strict` y `git diff --check`; no declarar el candidato como aprobado/promocionado
- [x] 4.4 Registrar que el build es completo pero sync/archive quedan pendientes de la decisión del gate US-15 y revisión humana; no reclamar cierre de US-16

## Pendiente humano antes del archive de US-16

Este change queda implementado y validado, pero **no se archiva ni se reclama cierre** hasta:

- [ ] Decisión del equipo sobre el gate US-15 (promoción del candidato); la integración sirve el bundle congelado DEV-only sin afirmar aprobación.
- [ ] `/opsx:sync` y `/opsx:archive` tras revisión humana y commit manual con `Closes #` (Issue US-16).

## Evidencia de validación (real, ejecutada)

- `uv run pytest -p no:cacheprovider` (backend): **192 passed, 2 warnings** (~4.5s). Incluye 7 tests de `test_bundle.py`, 5 de `test_bundle_predictor.py`, 7 de `test_real_inference.py` (ASGI) y 2 de config.
- `uv run ruff check .` (backend): **All checks passed**.
- `openspec validate integrate-real-inference --strict`: **Change is valid** (delta spec `manual-analysis` API-04).
- `git diff --check`: OK.

## Fuera de alcance

- Entrenar en request, HTTP hacia ML, uploads de pickle, cambio de rutas/schemas/contrato HTTP.
- Promocionar el candidato o reclamar el gate US-15 aprobado.