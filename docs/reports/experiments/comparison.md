# Comparación de candidatos clásicos (US-15)

> Estado: **candidato seleccionado por decisión humana en DEV; TEST permanece sellado.**
> Actualizado: 2026-09-18.

Este documento consolida la evidencia observada de los cuatro candidatos clásicos y registra la decisión humana de selección. No contiene evaluación TEST, reentrenamiento sobre DEV completo ni artefacto de inferencia.

## 1. Protocolo común

| Componente | Valor común |
|---|---|
| Datos | `youtoxic_english_1000.csv` → 995 filas preparadas tras deduplicación case-insensitive |
| Development | 808 filas; los `VideoId` de holdout se excluyen antes de la evaluación |
| TEST | Sellado; no usado para fitting, tuning, predicción, métricas, inspección ni selección |
| Validación | `StratifiedGroupKFold(n_splits=3, shuffle=True, random_state=42)`, agrupado por `VideoId` |
| Leakage | Cero `VideoId` compartidos entre train y validation en cada fold |
| Preprocesamiento | `normalize_text` + `casefold` mediante TF-IDF común |
| Ajuste de TF-IDF | Vectorizador nuevo, ajustado solo con los textos train de cada fold |
| Métrica primaria | F1 de clase tóxica en validation, media de tres folds |
| Métricas secundarias | Desviación, mínimo/máximo, precisión, recall, macro-F1, accuracy, F1 train, gap y matrices de confusión |
| Umbral / resampling | Umbral por defecto; sin threshold tuning ni resampling |

Los parámetros TF-IDF seleccionados pueden diferir entre candidatos por su tuning DEV individual. La comparación es de pipelines candidatos seleccionados bajo el protocolo común, no de algoritmos aislados con idénticos hiperparámetros.

## 2. Tabla común DEV

| Model | Selected configuration | Val F1 toxic mean | Val F1 std | Precision toxic | Recall toxic | Macro-F1 | Accuracy | Train F1 | Train-Val gap | Fold 1 F1 | Fold 2 F1 | Fold 3 F1 | Augmentation |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| MultinomialNB | `alpha=0.01`; `ngram=(1,2)`; `min_df=1`; `max_features=None` | 0.5517 | 0.0392 | 0.5919 | 0.5396 | 0.5869 | 0.5964 | 0.9987 | 44.69 pp | 0.5263 | 0.5217 | 0.6071 | No |
| Logistic Regression | `C=5.0`; `ngram=(1,1)`; `min_df=2`; `max_features=None`; `class_weight=None` | 0.5518 | 0.0059 | 0.6343 | 0.5127 | 0.6049 | 0.6152 | 0.9823 | 43.05 pp | 0.5520 | 0.5590 | 0.5446 | No |
| LinearSVC | `C=16.0`; `ngram=(1,1)`; `min_df=1`; `max_features=None`; `loss=squared_hinge` | 0.5741 | 0.0410 | 0.6118 | 0.5510 | 0.6091 | 0.6197 | 1.0000 | 42.59 pp | 0.5185 | 0.5878 | 0.6161 | No |
| SGDClassifier | `loss=log_loss`; `alpha=0.0001`; `penalty=elasticnet`; `ngram=(1,2)`; `min_df=1`; `max_features=None` | 0.5370 | 0.0134 | 0.6223 | 0.5136 | 0.5862 | 0.5967 | 1.0000 | 46.30 pp | 0.5415 | 0.5189 | 0.5507 | No |

## 3. Decisión humana y configuración congelada

El equipo ha seleccionado **Logistic Regression** como candidato final para el siguiente paso controlado. La decisión se tomó exclusivamente con la evidencia DEV consolidada de esta tabla; no fue generada automáticamente y no afirma superioridad universal ni generalización demostrada fuera de DEV.

La configuración queda congelada para el protocolo posterior:

| Componente | Valor congelado |
|---|---|
| Clasificador | `LogisticRegression(C=5.0, class_weight=None, random_state=42, max_iter=1000)` |
| TF-IDF | `ngram_range=(1,1)`, `min_df=2`, `max_features=None`, `stop_words=None`, `sublinear_tf=True` |
| Preprocesamiento | `normalize_text` seguido de `casefold`, mediante la utilidad común |
| Umbral | Default del clasificador; no se realizó threshold tuning |
| Datos para la decisión | DEV original, sin augmentation |

La factoría existente `create_best_logistic_pipeline_observed_on_dev()` contiene esos mismos valores. La selección y congelación se realizaron antes de crear un bundle y antes de cualquier acceso a TEST. En una fase posterior e independiente, la configuración congelada se entrenó una sola vez sobre todo DEV y generó el bundle DEV-only `backend/ml/artifacts/logistic_regression_dev_final.joblib` con su metadata auditable. TEST continúa sellado: después de la selección no hubo tuning, threshold tuning ni cambio de configuración.

### Justificación registrada

F1 toxic es la métrica primaria. LinearSVC alcanzó mayor F1 media (`0.5741` frente a `0.5518`) y conserva ventaja de recall (`0.5510` frente a `0.5127`) y FN (`167` frente a `183`). El equipo prefirió Logistic Regression por el equilibrio observado entre rendimiento, estabilidad entre grupos de vídeo y necesidades del producto:

- Logistic Regression: F1 por fold `0.5520 / 0.5590 / 0.5446`, desviación `0.0059` y rango `0.5446–0.5590`.
- LinearSVC: F1 por fold `0.5185 / 0.5878 / 0.6161`, desviación `0.0410` y rango `0.5185–0.6161`.
- Logistic Regression produjo `122` FP frente a `137` de LinearSVC y expone `predict_proba`; LinearSVC aporta márgenes, no probabilidades.

La ventaja media de LinearSVC no fue uniforme entre los tres folds. Esta evidencia no demuestra que Logistic Regression generalice mejor ni que LinearSVC sea intrínsecamente inestable; expresa la preferencia del equipo bajo la composición DEV observada.

### Limitaciones de la decisión

- DEV contiene 808 comentarios y solo 9 `VideoId`; la CV agrupada tiene tres folds.
- La prevalencia toxic y los vídeos dominantes cambian sustancialmente entre folds; la evidencia no separa el efecto de prevalencia del cambio de dominio por vídeo.
- Todos los candidatos presentan gaps train-validation elevados.
- TEST no intervino en comparación, tuning, selección, predicción, métricas ni inspección. Permanece sellado hasta después de esta selección y congelación.

## 4. Evidencia por candidato

- [MultinomialNB DEV evidence](multinomial_nb_dev.md) · [JSON](multinomial_nb_dev.json)
- [Logistic Regression DEV experiment](logistic_regression_dev.md) · [JSON](logistic_regression_dev.json)
- [LinearSVC DEV experiment](linear_svc_dev.md) · [JSON](linear_svc_dev.json)
- [SGDClassifier DEV experiment](sgd_classifier_dev.md) · [JSON](sgd_classifier_dev.json)

El baseline Dummy `most_frequent`, medido con el protocolo común, tiene F1 tóxica media 0.1713. Se conserva como referencia; no forma parte de los cuatro candidatos comparados.

## 5. Augmentation

La tabla principal excluye augmentation para los cuatro candidatos. El experimento separado de MultinomialNB con augmentation solo sobre train está documentado en [`augmentation.md`](augmentation.md); no es comparable directamente porque cambia las muestras de entrenamiento de cada fold.

## 6. Límites de esta consolidación

- La selección es una decisión humana de candidato pre-TEST, no un resultado final train-TEST ni una garantía de calidad fuera de DEV.
- No se ha realizado evaluación final train-TEST ni se ha usado TEST para tomar decisiones.
- DEV contiene nueve `VideoId` y muestra cambio de distribución por vídeo; los gaps train-validation deben formar parte de la revisión humana.
- Antes de materializar la promoción de US-15, el equipo debe revisar explícitamente el coste relativo de FN y FP junto con las matrices de confusión por fold.

## 7. Estado de US-15

- [x] Selección DEV — El equipo eligió Logistic Regression y congeló la configuración anterior con evidencia de F1 toxic, estabilidad, precision/recall, FN/FP y matrices. No hubo threshold tuning.
- [x] AC2.1 — El artefacto DEV-only de la configuración congelada se entrenó y persistió antes de cualquier evaluación TEST.
- [ ] AC2.2 — Ejecutar la futura evaluación TEST autorizada y aplicar el gate train-TEST; si falla, reportarlo sin reabrir iteración sobre TEST.
- [ ] AC3 — Registrar la decisión humana, F1 por clase, matrices, FN/FP y limitaciones mediante revisión cruzada.
