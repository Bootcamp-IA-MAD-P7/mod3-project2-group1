# Informe de Entrenamiento: Multinomial Naive Bayes

**Historia:** [US-11](../../../docs/planning/stories/US-11.md) — Evaluar individualmente Multinomial Naive Bayes
**Fecha:** 2026-09-16
**Estado:** Implementación + evaluación sobre development completadas. Test sellado sin tocar.

---

## 1. Contexto y objetivo

El proyecto Moder AI clasifica comentarios de YouTube como tóxicos o no tóxicos para ayudar a la
moderación humana. Esta historia entrega el candidato **Multinomial Naive Bayes** siguiendo el
protocolo común compartido con el resto de modelos: mismo pipeline de datos, mismos folds, misma
seed, mismas métricas.

El objetivo binario es `IsToxic` (46,2 % positivos en el dataset completo, casi balanceado según el
[informe EDA](../../../preoprocessing/Informe.md)).

---

## 2. Protocolo seguido

Se reutilizó íntegramente la infraestructura compartida de `backend/ml/`, sin modificar ningún
archivo existente:

| Componente | Módulo | Uso |
|---|---|---|
| Preparación del dataset | `ml.data.dataset.prepare_binary_dataset` | Selecciona `VideoId`, `Text`, `IsToxic` y elimina duplicados (sin distinguir mayúsculas) |
| Split sellado | `ml.data.dataset.create_holdout_split` | Separa 4 `VideoId`s concretos como test sellado |
| Validación cruzada | `ml.data.dataset.create_grouped_cv` | `StratifiedGroupKFold(3, shuffle, seed=42)` — ningún video comparte train/val |
| Vectorización | `ml.features.tfidf.create_tfidf_vectorizer` | TF-IDF con bigramas (1,2), `sublinear_tf=True`, sin stop words, case-insensitive |
| Métricas | `ml.evaluation.metrics.evaluate_binary_classification` | accuracy, precision, recall, F1, matriz de confusión |
| Modelo | `ml.models.multinomial_nb.create_multinomial_nb` | `MultinomialNB` con `alpha` configurable |

### Rejilla de hiperparámetros

Ajuste básico de `alpha` (suavizado de Laplace) solo sobre folds de development, con el mismo
presupuesto para todos los candidatos:

```
alpha ∈ {0.01, 0.1, 0.5, 1.0, 2.0}
```

### No realizado (fuera de scope)

- No se consultó el test sellado (187 muestras reservadas).
- No se añadió ensamblado ni optimización posterior (Optuna queda fuera de esta historia Essential).
- No se modificó la semántica ni los límites de la spec ni de los contratos.

---

## 3. Archivos creados

| Archivo | Contenido |
|---|---|
| `backend/ml/models/multinomial_nb.py` | Factoría `create_multinomial_nb(alpha=1.0)` |
| `backend/ml/training/train_multinomial_nb.py` | Script de entrenamiento y evaluación del candidato |
| `backend/tests/unit/test_multinomial_nb.py` | 3 tests unitarios (tipo del modelo, alpha por defecto, alpha custom) |
| `backend/ml/training/__init__.py` | Marcador de paquete |
| `backend/ml/training/Informe-MultinomialNB.md` | Este informe |

No se modificó ningún archivo preexistente del proyecto.

---

## 4. Ejecución y resultados

### Comandos

```bash
# Tests unitarios del candidato
cd backend
python -m pytest tests/unit/test_multinomial_nb.py -v          # 3 passed

# Suite completa del proyecto (verificación de no-regresión)
python -m pytest tests/ -v                                      # 26 passed

# Entrenamiento y evaluación
python -m ml.training.train_multinomial_nb
```

### Resultados por alpha (media en 3 folds de development)

| alpha | val F1 | gap F1 (train − val) | ¿mejor? |
|---|---|---|---|
| 0.01 | 0.5517 | +0.4469 | **sí** |
| 0.1 | 0.5120 | +0.4866 | |
| 0.5 | 0.3669 | +0.6310 | |
| 1.0 | 0.3142 | +0.6660 | |
| 2.0 | 0.2337 | +0.6153 | |

**Mejor hiperparámetro seleccionado: `alpha = 0.01`** (extremo inferior de la rejilla).

### Detalle por fold del mejor alpha

| fold | accuracy | precision | recall | F1 | gap F1 | FN | FP |
|---|---|---|---|---|---|---|---|
| 1 | 0.6038 | 0.4487 | 0.6364 | 0.5263 | +0.4718 | 40 | 86 |
| 2 | 0.6127 | 0.6186 | 0.4511 | 0.5217 | +0.4762 | 73 | 37 |
| 3 | 0.5728 | 0.7083 | 0.5312 | 0.6071 | +0.3929 | 60 | 28 |

### Resumen

| Métrica | Valor |
|---|---|
| alpha seleccionado | 0.01 |
| val F1 media | 0.5517 |
| gap F1 medio (train − val) | +0.4469 |
| Falsos negativos (total 3 folds) | 173 |
| Falsos positivos (total 3 folds) | 151 |
| Tiempo de ejecución | 1.69 s |
| Muestras development | 808 |
| Muestras test sellado | 187 (sin usar) |

---

## 5. Análisis técnico

1. **El mejor `alpha` cayó en el borde inferior de la rejilla.** La F1 sube monótonamente al bajar
   `alpha`, lo que sugiere que la rejilla está mal posicionada: conviene ampliarla hacia valores más
   pequeños (`0.001`, `0.0001`) antes de cerrar la historia. No podemos afirmar que 0.01 sea el
   óptimo global; solo es el mejor del presupuesto evaluado.

2. **Sobreajuste relevante (gap ≈ +0.45).** El modelo puntúa muy alto en train y cae en validación.
   Es un comportamiento típico de MultinomialNB con vocabulario grande (bigramas TF-IDF) sobre solo
   808 muestras de development: el modelo memoriza señales que no generalizan.

3. **Desbalanceo de errores según el fold.** En el fold 1 los errores dominantes son los falsos
   positivos (86 vs 40 FN); en los folds 2 y 3 dominan los falsos negativos. La varianza entre folds
   es alta (F1 de 0.52 a 0.61), coherente con un dataset pequeño y agrupado por video.

4. **Posición frente al baseline.** Falta comparar con el `DummyClassifier(most_frequent)`, que es
   el paso inmediato para valorar si la señal aprendida supera la mayoría de clase. Esta comparación
   se hará formalmente al consolidar los resultados de los cuatro candidatos.

---

## 6. Limitaciones y próximos pasos

**Limitaciones registradas:**
- Rejilla demasiado angosta: `alpha=0.01` quedó en el extremo, por lo que el óptimo estimado es
  provisional.
- 808 muestras de development con vocabulario TF-IDF de bigramas generan sobreajuste estructural.
- El test sellado no se ha utilizado y no se puede consultar en esta fase.

**Próximos pasos:**
1. Ampliar la rejilla a `{0.0001, 0.001, 0.01, 0.1}` para confirmar o descartar una mejora.
2. Comparar formalmente contra el baseline Dummy y contra los otros tres candidatos (RL, LinearSVC,
   SGDClassifier) con el protocolo común.
3. Ejecutar la **revisión cruzada por otra persona** (AC3 de US-11) y registrar evidencia de los AC.

---

## 7. Reproducibilidad

Todo el proceso es reproducible ejecutando, desde `backend/`:

```bash
python -m pytest tests/                                  # 26 passed (21 previos + 3 nuevos + 2 baseline)
python -m ml.training.train_multinomial_nb               # resultados de la sección 4
```

Dependencias de Python: `scikit-learn`, `pandas`. Sin fichero de dependencias en el repo (pendiente
de US-02). Los resultados numéricos de este informe provienen de la ejecución directa del script
sobre `data/youtoxic_english_1000.csv`.