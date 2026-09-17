# Design

## Context

Ver propuesta en proposal.md. El proyecto ya tiene el protocolo común de ML definido en el maestro (`model-lifecycle` ML-01..ML-03 y decisión D-03 de `design.md`): misma TF-IDF, mismos folds agrupados por `VideoId`, semilla 42, macro-F1 como métrica principal y gap absoluto <5 pp, con holdout TEST sellado. Existe código previo de Logistic Regression que marca el patrón esperado para el informe, la CV y el tuning: `backend/ml/models/logistic_*`, `backend/ml/evaluation/logistic_*`. El target es `IsToxic` (balanceado, 46,2 % positivos). No hay baseline en `openspec/specs/`; por eso este change es `skip_specs` (implementación de un requisito ya especificado, sin cambiar requisitos).

## Goals / Non-Goals

**Goals:**
- Entrenar y evaluar `SGDClassifier(loss="log_loss")` como cuarto clásico bajo el protocolo idéntico al de Logistic Regression sobre development.
- Ajuste básico de hiperparámetros en DEV (`alpha`, `penalty`) con presupuesto acotado e igualitario.
- Informe reproducible y estructuralmente comparable al de LR: macro-F1, toxic F1, gap por fold, matriz, FN/FP, vocabulario y densidad, con seed fija.
- Tests TDD (RED → GREEN → REFACTOR) y revisión del run por otra persona (AC3 de US-14).

**Non-Goals:**
- No modificar splits ni consultar TEST; no tocar pipelines de otros candidatos.
- No ensemble, Optuna, calibración, ni features adicionales (longitud/nº etiquetas).
- No empaquetar inferencia ni bundle (US-16), no tocar contratos de API.

## Decisions

### D-1 — Confirmar SGDClassifier(`loss="log_loss"`)
Se usa `SGDClassifier(loss="log_loss", random_state=42, shuffle=True, max_iter=1000)` con `random_state` en el split interno para barajado determinista.
**Alternativas consideradas:** ComplementNB (descartada: su ventaja teórica es el desbalanceo y `IsToxic` está casi balanceado); LinearSVC y MultinomialNB (ya asignados a otras personas); volver a un sustituto genérico (sin ventaja clara bajo target balanceado).
**Rationale:** es la propuesta original de OQ-05/US-14, mantiene la diversidad de autores/as y aporta `predict_proba` válida (a diferencia de LinearSVC), relevante para el futuro score de D-05 en US-16.

### D-2 — Reutilizar la TF-IDF común
El pipeline usa `create_tfidf_vectorizer` (la misma de `logistic_pipeline.py`) para que la comparación sea controlada (ML-01: "mismos datos/folds/preprocessing principal/métricas/presupuesto").
**Alternativa:** `CountVectorizer` (teóricamente más afín a SGD en espacio de conteos) descartada por romper la comparabilidad; cualquier variante de representación es ablation aparte, no parte de este cambio.

### D-3 — Fábricas con parámetros explícitos y defaults reproduccibles
`create_sgd_classifier(*, loss="log_loss", penalty="l2", alpha=1e-4, random_state=42, max_iter=1000)` y `create_sgd_pipeline(...)` con las constantes de TF-IDF comunes. Cada configuración de tuning queda registrada con sus valores en el informe.

### D-4 — Evaluación CV agrupada y métricas comunes
`evaluate_sgd_classifier_cv` replica `logistic_regression_cv.py`: pipeline fresco por fold, verificación de solape de `VideoId` (lanza `ValueError` si existe), métricas con `evaluate_binary_classification` y **macro-F1 añadida** (igual que el tuning de LR) porque es la métrica principal del protocolo.

### D-5 — Tuning DEV acotado
Rejilla pequeña predefinida sobre `alpha` (p. ej. `{1e-5, 1e-4, 1e-3}`) × `penalty` (`{l2, elasticnet}`), presupuesto idéntico al del resto de candidatos y únicamente sobre folds de development. Control interno (reproducción de la configuración base) para validar determinismo.

### D-6 — Informe comparable al de LR
`docs/reports/experiments/sgd_classifier_dev.{md,json}` con la misma estructura que `logistic_regression_dev.{md,json}`: entorno, histórico de tuning, configuración seleccionada, agregados, tabla por fold, comparación con baseline y limitaciones. Incluye análisis de errores (FN/FP) y la nota de que no se presenta margen sin calibrar como probabilidad.

## Risks / Trade-offs

- [SGD se solapa conceptualmente con Logistic Regression (ambos lineales con log-loss)] → aceptado en OQ-05; el informe documenta el solape y la decisión final la toma la evidencia de la comparación, no este change.
- [Gap train/validation alto por pocos grupos de vídeo (9 `VideoId`) con shift por vídeo — LR ya mostró ~43 pp] → se reporta por fold y en agregado, sin esconder casos tras la media; el gate <5 pp se aplica en US-15, no aquí.
- [No convergencia o variabilidad de SGD] → seed fija, `shuffle=True` con `random_state`, `max_iter` explícito; si una configuración no converge se registra el aviso explícitamente en lugar de ocultarlo.
- [TF-IDF sublinear como representación para un modelo lineal + regularización tipo red] → misma representación para todos los candidatos; alternativas fuera del protocolo se reportarían como ablation.

## Migration Plan

No aplica despliegue: es experimentación local dentro de `backend/ml` con TDD. Al cerrar el change, el informe queda como evidencia para la comparación de US-15. Sin cambios de contrato ni de configuración de runtime.

## Open Questions

Ninguna que altere specs, enfoque o desglose de tareas. El comando y entorno exactos para ejecutar el run DEV los proporciona el equipo (los tests del informe LR se ejecutaron con Python 3.12.7 + scikit-learn 1.9.1 + pandas 3.0.5).