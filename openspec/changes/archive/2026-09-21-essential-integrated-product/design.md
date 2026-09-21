# Diseño: producto Essential integrado y E2E (US-18)

## Context

En `dev` están mergeadas US-16 (inferencia real, bundle sidecar corregido) y US-17 (feature `manual-analysis` accesible, archivada en el spec). `App.tsx` ya navega `dashboard`/`analyze-conversation`/`settings` tras un `LoginPage` mock, pero **no integra** `analyze-comment`. No hay E2E. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Integrar `ManualAnalysisPage` en la navegación (vista `analyze-comment`) y verlo con el cliente API real.
- E2E Playwright real (navegador → API → bundle) con señal+versión, y caso de modelo faltante (indisponibilidad visible).
- Smoke sin DB/YouTube/MLflow/neuronales; informe de testing US-18 y README de ejecución real.
- Enlazar evidencia del gate Essential (TDD/tests, EDA/NLP/gap, augmentation US-08, revisión accesible) sin reclamar gates pendientes.

**Non-Goals:**
- Sustituir la aceptación ML por mocks (el E2E usa bundle real).
- Resolver el gate US-15 (promoción) ni completar US-08; solo registrar su estado.
- Capacidades Medium/Advanced/Expert (vídeo, historial, tuning, ensembles).

## Decisions

- **Integración (routing):** añadir `"analyze-comment"` a `NAVIGABLE_VIEWS` de `App.tsx` y renderizar `ManualAnalysisPage` en su rama; se conserva el `LoginPage` como puerta. *Alternativa descartada*: router externo (react-router) — no necesario para Essential y añade dependencia.
- **E2E Playwright:** añadir `@playwright/test` como devDependency y script `test:e2e`. Un `playwright.config.ts` con **dos proyectos**:
  - `with-model`: backend en puerto 8000 con `MODEL_PATH` válido (bundle QA o real) + frontend en 5173 (`VITE_API_BASE_URL=http://localhost:8000/api/v1`) → spec del flujo completo.
  - `no-model`: backend en puerto 8001 **sin** `MODEL_PATH` + frontend en 5174 → spec de indisponibilidad (readiness `503`, sin señal inventada).
  - CORS del backend incluye 5173 y 5174 (env `CORS_ORIGINS`); los `webServer` esperan `readyOnStdout`.
- **Smoke sin servicios opcionales:** el E2E ya arranca sin DB/YouTube/MLflow/neuronales; se verifica liveness + predicción real.
- **Evidencia gate:** sección nueva en `docs/reports/testing/report.md` (US-18) y README de ejecución real; enlaces a las evidencias (tests, EDA/NLP/gap, `docs/reports/experiments/augmentation.md` US-08, revisión accesible US-17). Promoción/US-08 se registran como **pendientes**, no cumplidas.
- **CI:** el E2E se documenta y ejecuta localmente (browsers Playwright); añadir job de E2E en CI es opcional y no bloquea el cierre documentado.

## Risks / Trade-offs

- [E2E necesita un bundle válido local] → Se reutiliza uno DEV-only autoconsistente (p. ej. `qa_preview`, gitignored) o se regenera con el script de entrenamiento; nunca TEST.
- [Dos servidores/port de E2E] → Proyectos Playwright separados con `webServer` y env `VITE_API_BASE_URL`/`CORS_ORIGINS` específicos, aislados en puertos distintos.
- [Login mock como puerta] → El E2E pasa por el submit del login (mock), igual que un usuario real en la demo.
- [CI sin browsers] → Se registra la ejecución local y su comando; el job CI optional queda fuera del cambio si el equipo lo decide.

## Migration Plan

N/A: integración en `App` ya navegable; sin datos a migrar. No sync/archive hasta validaciones, revisión humana y estado del gate US-15/US-08 registrado.

## Open Questions

- ¿E2E en CI (job con instalación de browsers Playwright) en este change o solo local/documentado? Se asume local + documentado; si el equipo quiere CI, es ampliación acotada a una tarea adicional.