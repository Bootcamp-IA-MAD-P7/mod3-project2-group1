# Evaluación final del candidato congelado (US-15)

## Why

US-15 exige una evaluación final aislada del candidato congelado sobre el holdout TEST, aplicando el gate de gap de macro-F1 y registrando coste y decisión, sin reabrir iteración. El candidato (Logistic Regression) ya está seleccionado y su bundle DEV-only persistido; falta el kit que permite la única corrida TEST autorizada y su informe audible.

## What Changes

- Crear el tooling de evaluación final en `backend/ml/evaluation`: entrenamiento único DEV con la pipeline congelada, una sola evaluación sobre TEST aislado, métricas por clase y macro-F1, matriz/FN/FP, gate, coste (GO-01) y guard de corrida única.
- Preparar un script de ejecución para uso humano que solo produce el informe cuando la corrida TEST esté autorizada.
- Añadir tests sintéticos RED→GREEN (bordes del gate, aislamiento del holdout, paridad con la factory congelada, guard de corrida única) que no tocan TEST real.
- Crear la plantilla del informe final sin rellenar resultados inexistentes.

## Capabilities

No se añade ni modifica una capability: ML-02 (coste de error) y ML-03 (gap/test final) ya existen en `model-lifecycle` y este change los demuestra sin cambiar su comportamiento. Por ello el change declara `skip_specs: true`.

### New Capabilities

_Ninguna._

### Modified Capabilities

_Ninguna._

## Impact

- Código ML de evaluación y tests unitarios en `backend/ml/`.
- Script de corrida autorizada y plantilla documental en `docs/reports/experiments/`.
- No hay cambios de API, configuración congelada, datos, contratos, modelo seleccionado ni rutas HTTP.
- Trazabilidad: US-15 en la planificación; la relación con la Issue de GitHub de US-15 está verificada (consultar trazabilidad del proyecto).