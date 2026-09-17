# Proposal

## Why

La historia US-14 del backlog exige evaluar individualmente el cuarto clásico para completar la comparación controlada ML-01 del nivel Essential (Dummy + cuatro modelos, uno por persona). El target ya está decidido (`IsToxic`, casi balanceado, 46,2 % positivos), por lo que la alternativa ComplementNB — cuya ventaja teórica es el desbalanceo— debe descartarse y se confirma el candidato original del diseño: SGDClassifier con `loss="log_loss"`.

## What Changes

- Se añade la evaluación reproducible de **SGDClassifier(`loss="log_loss"`)** como cuarto clásico de US-14, sin tocar TEST ni el protocolo común.
- Se crea el modelo (`backend/ml/models/sgd_classifier.py`) y su pipeline (`backend/ml/models/sgd_pipeline.py`) reutilizando la TF-IDF común para comparabilidad controlada.
- Se crea la evaluación CV agrupada (`backend/ml/evaluation/sgd_classifier_cv.py`) y el tuning DEV acotado (`backend/ml/evaluation/sgd_classifier_tuning.py`), replicando el patrón de Logistic Regression.
- Se publica el informe de experimento (`docs/reports/experiments/sgd_classifier_dev.md` y `.json`) con la misma estructura que el de Logistic Regression, más su reproducción por otra persona (AC3 de US-14).
- Sin cambios de contrato, configuraciones, dependencias del runtime ni comportamiento externo del producto.

## Capabilities

### New Capabilities

Ninguna: `openspec/specs/` no tiene baseline todavía y `model-lifecycle` vive como delta del change maestro `define-project`, sin sincronizar.

### Modified Capabilities

Ninguna: este change no altera requisitos de comportamiento. El cuarto clásico ya está especificado en `model-lifecycle` (ML-01) y en la historia US-14; su elección concreta sobre el dataset real se confirma aquí como implementación, no como requisito nuevo.
Cambio declarado sin delta de specs mediante `skip_specs: true` en `.openspec.yaml`.

## Impact

- Código afectado: `backend/ml/models/`, `backend/ml/evaluation/`, `backend/tests/unit/`.
- Evidencia: `docs/reports/experiments/sgd_classifier_dev.{md,json}`.
- Ejecución: solo development, con el entorno reproducible del equipo (Python 3.12.7, scikit-learn 1.9.1, pandas 3.0.5). Sin dependencias nuevas.
- Sin impacto en API (`/api/v1`), frontend, artefactos de inferencia ni splits de datos.