# Diseño: integración de inferencia real (US-16)

## Context

El backend expone `POST /api/v1/predictions` y health mediante `Predictor` (puerto Protocol) con `FakePredictor` en desarrollo. El bundle congelado `logistic_regression_dev_final.{joblib,metadata.json}` existe en `backend/ml/artifacts/`, es DEV-only y no está aprobado (gate US-15 pendiente). Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Bundle íntegro cargado una vez por proceso con validación de checksum/schema.
- `BundlePredictor` sustituible por el fake sin tocar rutas ni schemas (cumple `Predictor`).
- Readiness `503` ante bundle corrupto/faltante/incompatible, sin Dummy y sin DB.
- Versión opaca derivada del hash del artefacto.

**Non-Goals:**
- Entrenar en request, HTTP hacia ML ni uploads de pickle (fuera del scope US-16).
- Promocionar el candidato ni declarar el gate US-15 aprobado.
- Cambiar el contrato HTTP de `/api/v1`, rutas, schemas o validaciones.

## Decisions

- **Layout de bundle**: `MODEL_PATH` apunta al `.joblib`; la metadata es el sidecar `<path>.metadata.json` (resolved en config). *Alternativa descartada*: directorio de bundle versionado — más estructura sin beneficio para este slice.
- **Activación del predictor**: si `model_path` está configurado → construir `BundlePredictor` en el lifespan (carga una vez); si la validación falla → predictor `None` → readiness `503 MODEL_UNAVAILABLE`. Si no hay `model_path`: `FakePredictor` solo en desarrollo, `None` en producción (API-03). Nunca Dummy en producción.
- **Versión opaca**: `model_version = artifact_sha256[:8]` (prefijo del hash). No revela algoritmo ni configuración.
- **Score**: `predict_proba` del pipeline; proba de clase hate = `pipeline.predict_proba(text)[:, 1]`; `score_kind="calibrated_probability"` siempre no-nulo. *Alternativa descartada*: margen de SVC — no aplica a LR y el contrato exige probabilidad calibrada.
- **Paridad**: el pipeline congelado incluye el preprocesado (`normalize_text` + `casefold`) dentro del TF-IDF, así que la API recibe el texto crudo tal como el contrato; paridad verificada con test contra la factory congelada.
- **Errores**: se reutiliza `ErrorEnvelope`/`MODEL_UNAVAILABLE` existente; sin códigos nuevos.

## Risks / Trade-offs

- [Carga del bundle lenta en arranque] → Se hace en el lifespan (una vez), no en import; readiness refleja disponibilidad.
- [Bundle no aprobado servido en dev] → Se marca como congelado DEV-only; readiness expone versión opaca sin afirmar aprobación.
- [Checksum debe coincidir tras regenerar] → El validador rechaza cualquier discrepancia; documentar que regenerar el bundle exige actualizar metadata (el generador ya lo hace).
- [Fake en dev coexiste con bundle] → Prioridad: si hay `MODEL_PATH` válido, se usa el real; el fake queda solo para cuando no hay bundle en dev.

## Migration Plan

N/A: rutas y capacidades nuevas, sin datos que migrar. No sync ni archive hasta que el gate US-15 se resuelva y la implementación pase validaciones y revisión humana (AGENTS).

## Open Questions

- Decisión del gate US-15 (promoción del candidato): aplazada; no bloquea build ni tests de este change, sí bloquea sync/archive y reclamar «candidato aprobado».