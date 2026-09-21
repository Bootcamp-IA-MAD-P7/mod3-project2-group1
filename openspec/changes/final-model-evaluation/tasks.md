# Tasks

## 1. Gate de evaluación final

- [x] 1.1 Implementar `compute_final_gate(train_macro_f1, test_macro_f1, *, gap_threshold_pp=5.0, min_recall=None, dummy_macro_f1=None)` y verificar con tests de borde: gap `4.99` → PASS, `5.00` → FAIL, `5.01` → FAIL, y que un `min_recall`/`dummy_macro_f1` configurados se evalúan y reportan sin cambiar la configuración congelada
- [x] 1.2 Implementar métricas finales por clase y macro en el tooling reutilizando `ml/evaluation/metrics.py` y verificar que coinciden con sklearn (precision/recall/F1 por clase, macro-F1, matriz, FN/FP)

## 2. Tooling de evaluación final

- [x] 2.1 Crear `backend/ml/evaluation/final_evaluation.py` que entrena la pipeline congelada una vez sobre DEV y evalúa sobre TEST aislado, y verificar con test de que el entrenamiento nunca ve `HOLDOUT_VIDEO_IDS`
- [x] 2.2 Añadir medición de coste GO-01 (tiempo, memoria pico opcional vía `tracemalloc`, tamaño del bundle) y verificar con test de que los campos están presentes y son no negativos
- [x] 2.3 Añadir guard de corrida única por proceso y verificar con test de que una segunda llamada a la evaluación final lanza error
- [x] 2.4 Verificar paridad con test de que `final_evaluation` (bundle) y `create_best_logistic_pipeline_observed_on_dev()` refit sobre DEV predicen idéntico en textos de muestra

## 3. Script y informe

- [x] 3.1 Crear `backend/scripts/run_final_evaluation.py` que solo produce `docs/reports/experiments/final-evaluation.md` + JSON desde resultados reales de la corrida autorizada, y verificar su estructura (JSON+markdown) con tests sintéticos sobre `tmp_path`
- [x] 3.2 Crear la plantilla `docs/reports/experiments/final-evaluation.md` documentando el estado pendiente de autorización y gate, sin métricas inventadas

## 4. Verificación del change

- [x] 4.1 Ejecutar suite backend (`pytest` desde `backend/`) y entregar resultados reales en tareas/reportes sin tocar TEST real
- [x] 4.2 Ejecutar `ruff check` desde `backend/` y corregir hallazgos; registrar resultado real
- [x] 4.3 Ejecutar `openspec validate final-model-evaluation --strict` y `git diff --check`; registrar hallazgos y no declarar cierre de US-15 sin corrida autorizada
- [x] 4.4 Registrar en este change que la corrida TEST real, el gate OQ-03 y la revisión cruzada de AC3 quedan pendientes de decisión y autorización humana (no se archiva el change hasta completarlas)

## Pendiente humano antes del cierre de US-15

Este change queda completo pero **no habilita la promoción del candidato ni el archive**:

- [x] OQ-03 cerrado el 2026-09-21 (ver `docs/discovery.md`): recall hate ≥ 0.50, mejora sobre Dummy exigida con `test macro-F1 > 0.50`, gap spec ML-03 < 5 pp. Corrida TEST autorizada.
- [x] Corrida TEST única ejecutada el 2026-09-21: bundle DEV-only regenerado (fingerprint DEV `b8f4ae…` reproducido) y `run_final_evaluation.py --confirm-authorized-test --min-recall 0.50 --dummy-macro-f1 0.50`. **Gate FAIL (gap 33.67 pp)** — reportado sin re-iteración. Evidencia en `docs/reports/experiments/final-evaluation.{md,json}` y `comparison.md §7`.
- [x] Revisión cruzada de AC3 realizada en sesión a petición del equipo (decisión, F1 por clase/macro, matriz, FN/FP y limitaciones); recomendable firma adicional de otro miembro.
- [ ] `/opsx:sync` y `/opsx:archive` tras revisión humana; commit manual con `Closes #` (Issue US-15) y decisión del equipo sobre el gate fallido (la promoción queda bloqueada; US-16 no tiene «US-15 aprobado» como gate).
- [ ] No reentrenar ni re-evaluar sobre el mismo TEST: cualquier siguiente ciclo exige holdout independiente según diseño.

## Evidencia de validación (real, ejecutada)

- `uv run pytest -p no:cacheprovider` (backend): **172 passed, 2 warnings** en ~7s.
- `uv run ruff check .` (backend): **All checks passed**.
- `openspec validate final-model-evaluation --strict`: **Change is valid** (skip_specs: true).
- `git diff --check`: OK.
- Tests sintéticos nuevos `tests/unit/test_final_evaluation.py`: 8/8 (bordes del gate 4.99/5.00/5.01, aislamiento holdout, guard corrida única, coste con medición de memoria válida, paridad factory, informe JSON+markdown en tmp_path).

## Fuera de alcance

- Ejecutar la corrida TEST real sobre el holdout.
- Cambiar configuración congelada, umbral, candidato, specs, API, inferencia o serving (US-16).