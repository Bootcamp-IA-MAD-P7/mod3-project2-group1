# Seleccionar Logistic Regression como candidato

## Why

El equipo ha tomado una decisión humana de selección basada exclusivamente en la evidencia DEV de los cuatro modelos clásicos. Debe quedar trazable y la configuración elegida debe congelarse antes de cualquier acceso autorizado a TEST.

## What Changes

- Registrar Logistic Regression como candidato seleccionado por decisión humana.
- Congelar su configuración de clasificador y TF-IDF para el siguiente paso controlado.
- Registrar el trade-off frente a LinearSVC y las limitaciones de la evidencia DEV.

## Capabilities

No se añaden ni modifican capabilities: este change documenta una decisión de la capability existente `model-lifecycle` dentro de `define-project`.

## Impact

- Documentación: `docs/reports/experiments/comparison.md`.
- No hay cambios de modelo, datos, contratos, inferencia ni evaluación.
- Trazabilidad: US-15 está verificada en `define-project/tasks.md`; la relación con un número concreto de Issue de GitHub no está verificada.
