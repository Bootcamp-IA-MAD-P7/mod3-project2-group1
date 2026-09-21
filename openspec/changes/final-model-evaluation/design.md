# Diseño: evaluación final del candidato congelado

## Context

La pipeline congelada (`create_best_logistic_pipeline_observed_on_dev()`) y el bundle DEV-only ya existen y están validados. El holdout TEST permanece sellado; no se ha medido nada sobre él. El cierre de US-15 necesita una única corrida TEST autorizada, el gate de gap (< 5 pp de macro-F1) y el registro de coste y decisión. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Tooling que entrena la pipeline congelada una vez sobre DEV y evalúa una única vez sobre TEST aislado.
- Gate reproducible e inmutable: `gap_final_pp = abs(train_macro_f1 - test_macro_f1) * 100 < 5.0`, verificable en bordes sintéticos 4.99/5.00/5.01 pp.
- Métricas por clase y macro-F1, matriz de confusión, FN/FP, y coste (tiempo, memoria pico, tamaño del bundle).
- Guard de corrida única para impedir re-iteraciones accidentales sobre TEST.

**Non-Goals:**
- Ejecutar la corrida TEST real (requiere autorización humana y cierre del gate OQ-03).
- Cambiar configuración congelada, umbral, candidato o cualquier spec.
- Implementar serving, readiness o inferencia (US-16).

## Decisions

- **Fuente del pipeline**: reutilizar `train_frozen_logistic_pipeline` de `ml/training/final_logistic_regression.py` en lugar de duplicar la factory; la paridad se verifica contra `create_best_logistic_pipeline_observed_on_dev()` refit sobre DEV. *Alternativa descartada*: cargar el `.joblib` persistido como única fuente — generaría una dependencia de un artefacto gitignored para los tests.
- **Métrica del gate**: macro-F1 de sklearn (spec ML-03), no el F1 de clase tóxica usado en la comparación DEV. El gap final usa estos valores. *Alternativa descartada*: móvil de gap sobre F1 toxic — no coincide con la spec.
- **Coste GO-01**: medir tiempo de la corrida, memoria pico (tracemalloc) y tamaño del bundle, sin herramientas externas.
- **Guard de corrida única**: estado por proceso que rechaza una segunda llamada a la evaluación final; bloquea re-ejecuciones accidentales, no re-sellos de TEST.
- **Informe**: escribir JSON + markdown solo desde resultados reales; la plantilla no contiene métricas inventadas.

## Risks / Trade-offs

- [Correr TEST real sin autorización/gate] → El tooling separa build y ejecución: el script de corrida documenta el requisito de autorización (OQ-03 + orden humana) y no forma parte de la suite de tests.
- [Re-iteración sobre TEST tras un fallo del gate] → Config inmutable + guard de corrida única por proceso; un fallo se reporta sin tuning.
- [Paridad joblib vs factory si el artefacto cambia] → Los tests comparan la factory congelada refit contra el bundle cargado solo localmente; no son dependencia de CI.
- [Memoria/tracemalloc en CI] → La medición de memoria es opcional y se salta si `tracemalloc` no está disponible (detectado con try/except), sin falsear el resultado.

## Migration Plan

N/A: capacidades deshabilitadas por defecto y rutas nuevas; no hay despliegue ni datos que migrar. No se archiva el change hasta completar la corrida autorizada, validaciones y revisión humana (AGENTS).

## Open Questions

- Umbrales mínimos adicionales de OQ-03 (recall de odio mínimo, mejora sobre Dummy) y la autorización formal de la corrida TEST: se resuelven en humano antes de ejecutar; el tooling acepta valores configurables si se fijan.