# Producto Essential integrado y E2E (US-18)

## Why

US-16 (inferencia real) y US-17 (interacción manual accesible) están implementadas y archivadas, pero el flujo completo comentario → navegador → API → bundle no está demostrado de extremo a extremo ni integrado en la navegación de la app. US-18 cierra el recorrido Essential: integra la feature en App, ejecuta E2E real (Playwright) contra el bundle, verifica el smoke sin servicios opcionales y enlaza la evidencia del gate Essential.

## What Changes

- Integrar `ManualAnalysisPage` en `App.tsx`/navegación (vista `analyze-comment`) y conectar el cliente API real (`/api/v1/predictions`), manteniendo los estados accesibles ya implementados.
- Añadir E2E Playwright con el bundle real (navegador → API → señal con versión y error accesible) y caso de modelo faltante (readiness 503 → UI de indisponibilidad).
- Smoke sin DB/YouTube/MLflow/paquetes neuronales; documento `docs/reports/testing/report.md` para US-18 y README de ejecución real.
- Enlazar evidencia Essential (TDD/tests, EDA/NLP/gap, augmentation US-08 y revisión accesible) conforme al gate; la ablation de US-08 puede ser posterior a la integración del primer clásico.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `manual-analysis`: añade requisito `E2E-01 Producto Essential integrado` (PR-04): E2E navegador→API→bundle real con señal, versión y error accesible; flujo operativo sin servicios opcionales (DB/YouTube/MLflow/neuronales); y modelo faltante → indisponibilidad visible.

## Impact

- Frontend: integración de la feature en App/routing; E2E Playwright y tooling de test.
- Backend: sin cambios funcionales (el fix del sidecar del bundle ya está en `dev`); únicamente se usa para el E2E real.
- Docs: `docs/reports/testing/report.md` (US-18) y README de ejecución real.
- Trazabilidad: US-18 en la planificación (Issue enlazada de US-18). **Gate de cierre** «US-15 aprobado» y evidencia US-08: no bloquean comenzar la integración/E2E, pero sí declarar Essential completo; se registran como pendientes de decisión humana.