# Diseño: congelación documental de la selección

## Contexto

DEV contiene 808 comentarios y 9 `VideoId`. Los cuatro candidatos se evaluaron mediante tres folds de `StratifiedGroupKFold` agrupados por `VideoId`; TEST permaneció sellado.

## Decisión

La decisión humana selecciona Logistic Regression con `C=5.0`, `class_weight=None`, `random_state=42`, `max_iter=1000`, y TF-IDF con `ngram_range=(1,1)`, `min_df=2`, `max_features=None`, `stop_words=None`, `sublinear_tf=True`, usando el preprocesamiento común.

La decisión prefiere el equilibrio observado entre F1 toxic DEV, baja dispersión entre los tres folds y disponibilidad de `predict_proba`. No interpreta esa observación como prueba de mejor generalización fuera de DEV ni como propiedad intrínseca de LinearSVC.

## No objetivos

- Reentrenar con DEV completo.
- Crear un bundle de inferencia.
- Evaluar, inspeccionar o modificar TEST.
- Hacer tuning, threshold tuning, augmentation o cambiar hiperparámetros.

## Limitaciones

La evidencia solo cubre tres folds y nueve vídeos, con variación de prevalencia y dominio entre grupos. Todos los candidatos tienen gaps train-validation elevados.

## Follow-up

Un change posterior, explícitamente autorizado, deberá definir el reentrenamiento congelado sobre DEV completo, el artefacto y manifiesto reproducibles y una única evaluación TEST. Un resultado TEST no abre tuning ni cambios de umbral sobre TEST.
