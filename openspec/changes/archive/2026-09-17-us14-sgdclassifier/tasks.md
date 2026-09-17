# Tasks

## 1. Modelo y pipeline SGDClassifier

- [x] 1.1 Crear `backend/ml/models/sgd_classifier.py` con `create_sgd_classifier(loss="log_loss", penalty="l2", alpha=1e-4, random_state=42, max_iter=1000)` y verificar TDD: test `test_sgd_classifier.py` (RED por comportamiento ausente) comprueba los parámetros por defecto y que el clasificador es `SGDClassifier` con `loss="log_loss"`.
- [x] 1.2 Crear `backend/ml/models/sgd_pipeline.py` con `create_sgd_pipeline(...)` reutilizando `create_tfidf_vectorizer` y verificar TDD: test `test_sgd_pipeline.py` comprueba pasos `["tfidf", "classifier"]`, que TF-IDF no tiene `vocabulary_` antes del fit y los defaults comunes de la TF-IDF.

## 2. Evaluación CV y tuning DEV

- [x] 2.1 Crear `backend/ml/evaluation/sgd_classifier_cv.py` con `evaluate_sgd_classifier_cv(development_data, pipeline_factory)` y verificar TDD: test `test_sgd_classifier_cv.py` comprueba 3 folds sin solape de `VideoId` (pipeline fresco por fold), `ValueError` ante solape, y que summary incluye `validation_f1_mean`, `validation_macro_f1_mean`, `f1_gap_percentage_points` y `f1_gap_below_5_percentage_points`.
- [x] 2.2 Crear `backend/ml/evaluation/sgd_classifier_tuning.py` con rejilla pequeña `alpha × penalty` (`alpha ∈ {1e-5,1e-4,1e-3}`, `penalty ∈ {l2, elasticnet}`) y verificar TDD: test `test_sgd_classifier_tuning.py` comprueba el número de configuraciones, que todas se ajustan solo sobre development (control de solape por fold) y que retorna `configuration`, `folds` y `summary`.

## 3. Run DEV e informe reproducible

- [x] 3.1 Ejecutar el run DEV completo sobre development con el entorno del equipo (Python 3.12.7, scikit-learn 1.9.1, pandas 3.0.5) y verificar que reproduce el baseline y que ningún fold usa TEST.
- [x] 3.2 Generar `docs/reports/experiments/sgd_classifier_dev.{md,json}` con la estructura del informe de Logistic Regression (entorno, histórico de tuning, configuración seleccionada, agregados, tabla por fold con matriz `[[TN,FP],[FN,TP]]`, FN/FP, vocabulario y densidad) y verificar que incluye comparación con Dummy/LR y la nota de que no se presenta margen como probabilidad.
- [X] 3.3 Otra persona reproduce el run y revisa las conclusiones (AC3 de US-14) y verificar que la revisión queda registrada en el informe.

## 4. Validación y cierre

- [x] 4.1 Ejecutar la suite `pytest` de `backend/tests/unit` completa con el entorno del equipo y verificar que todos los tests (incluidos los nuevos de SGDClassifier) pasan.
- [x] 4.2 Ejecutar `openspec validate us14-sgdclassifier --strict` y verificar resultado válido.
- [X] 4.3 Presentar evidencia de cada AC de US-14 (asignación AC1, run con hiperparámetros/gap/FN/FP AC2, reproducción AC3) y verificar revisión humana antes del cierre del change.