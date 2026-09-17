# Comparación de candidatos (US-15)

> Estado: **esqueleto en preparación — no hay decisión de selección todavía.**
> Fecha de apertura: 2026-09-17.

Este documento compara el baseline Dummy y los cuatro candidatos clásicos bajo el **mismo protocolo**.
Solo se rellenan resultados **observados** de informes existentes; el resto queda marcado como pendiente
hasta que cada historia individual (US-11/12/13/14) entregue su informe revisado. El test sellado no se
usa en ninguna fase de esta comparación.

---

## 1. Protocolo común

Misma partición, mismos folds y mismas métricas para todos los candidatos (verificado en cada
informe individual):

| Componente | Valor común |
|---|---|
| Datos | `youtoxic_english_1000.csv` → 995 filas preparadas (dedup case-insensitive) |
| Split sellado | 4 `VideoId` fijos como test, 187 muestras; nunca usado en fitting/tuning/comparación |
| Development | 808 muestras |
| Validación | `StratifiedGroupKFold(3, shuffle=True, random_state=42)` agrupado por `VideoId`; cero overlap de videos por fold |
| Pipeline | TF-IDF común (`create_tfidf_vectorizer`), `normalize_text` + `casefold` |
| Métrica primaria | F1 de la clase tóxica en validación (media 3 folds) |
| Métricas secundarias | preción/recall, macro-F1, accuracy, estabilidad (std/min/max), gap train−val, FN/FP |
| Umbral | Default del clasificador; umbral/calibración solo sobre development (AC1 US-15) |

## 2. Criterios de decisión (a aplicar al consolidar)

- **Superar al baseline Dummy** en F1 de clase tóxica (señal real).
- **Estabilidad:** std entre folds baja y mínimo de fold aceptable.
- **Coste de error (ML-02):** fijar antes de decidir si pesa más dejar pasar un tóxico (FN) o censurar
  uno limpio (FP), según el uso de moderación.
- **Gate de promoción (ML-03):** tras congelar el artefacto y el umbral, gap final
  `abs(train − test) × 100 < 5 pp` y mínimos de calidad; si falla, se reporta el fallo y **no** se abre
  iteración sobre el mismo test.

## 3. Tabla de candidatos

| Candidato | Informe individual | val F1 tóxica | gap train−val | precisión / recall | macro-F1 / acc | FN / FP (3 folds) | Estado |
|---|---|---|---|---|---|---|---|
| Dummy `most_frequent` | (medido en run MNB) | 0.1713 | +0.0604 | pendiente | pendiente | pendiente | comparado |
| MultinomialNB `alpha=0.01` | [Informe-MultinomialNB.md](../../../backend/ml/training/Informe-MultinomialNB.md) | 0.5517 | +0.4469 | pendiente de consolidar | pendiente | 173 / 151 | comparado |
| Logistic Regression `C=5.0` | [`logistic_regression_dev.md`](logistic_regression_dev.md) | 0.5518 | +0.4305 | 0.6343 / 0.5127 | 0.6049 / 0.6152 | ver informe | pendiente de revisión cruzada |
| LinearSVC | — | pendiente | pendiente | pendiente | pendiente | pendiente | sin informe |
| SGDClassifier | — | pendiente | pendiente | pendiente | pendiente | pendiente | sin informe |

Notas:
- Dummy y MultinomialNB provienen de la ejecución local de `train_multinomial_nb.py` en la rama
  `bayes` (mismos folds).
- Logistic Regression proviene de su informe individual en `dev`; se cita solo como referencia, aún no
  ha pasado revisión cruzada de otra persona.
- Ablations (p. ej. unigramas/`min_df` en LR, rejilla de `alpha` en MNB) se mantienen **separadas** en
  cada informe individual y no se mezclan con el pipeline comparado.

## 4. Checklist US-15 (sin cubrir)

- [ ] AC1 — Consolidar con mismos folds, calidad y coste; umbral solo en development.
- [ ] AC2 — Congelar artefacto antes de test; gap final < 5 pp o fallo reportado sin reabrir test.
- [ ] AC3 — Reportar F1 por clase, matriz, FN/FP, limitaciones y decisión firmada (revisión cruzada).

## 5. Próximos pasos

1. Rellenar LinearSVC y SGDClassifier cuando sus historias (US-13/US-14) entreguen informe.
2. Consolidar métricas con el evaluador común en una única tabla por candidato.
3. Ejecutar revisión cruzada de cada informe individual (AC3 US-11/12/13/14) antes de decidir.
4. Confirmar con el equipo el criterio de coste de error (FN vs FP) previo a la selección.