# Diseño: bundle Logistic Regression DEV-only

## Flujo

1. Cargar el dataset con las utilidades comunes y aplicar `prepare_binary_dataset`.
2. Construir únicamente DEV excluyendo `HOLDOUT_VIDEO_IDS`; no materializar, inspeccionar, predecir ni medir TEST.
3. Verificar 808 filas DEV y ausencia de grupos holdout.
4. Crear `create_best_logistic_pipeline_observed_on_dev()` y ajustar el pipeline una vez con todo DEV.
5. Persistir el pipeline completo con joblib y metadata JSON junto al artefacto.

## Configuración inmutable

- LogisticRegression: `C=5.0`, `class_weight=None`, `random_state=42`, `max_iter=1000`.
- TF-IDF: `ngram_range=(1,1)`, `min_df=2`, `max_features=None`, `stop_words=None`, `sublinear_tf=True`.
- Preprocesamiento: `normalize_text` seguido de `casefold`.

## Metadata

La metadata registra configuración, filas y vídeos DEV, distribución de `IsToxic`, versiones de runtime, timestamp UTC, hash determinista de DEV, SHA-256 del bundle y checksum del propio JSON. No contiene filas ni métricas de TEST.

## Seguridad y límites

Joblib solo carga artefactos locales confiables. Este change no implementa serving, readiness ni evaluación TEST. Un cambio posterior y autorización humana separada son necesarios para una única evaluación TEST; un resultado no habilita tuning ni cambios de umbral.

## Limitación de validación del entorno

El entorno local `backend/.venv` está operativo. El entrenamiento DEV-only se realizó una vez y las validaciones Python correspondientes pasaron. La CLI `openspec` y `/opsx:verify` siguen sin estar disponibles en este entorno y no se instalarán para este change; esas validaciones no se han ejecutado.
