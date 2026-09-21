# Interacción manual accesible (US-17)

## Why

El frontend presenta features visuales con fixtures pero no tiene una interacción de análisis manual real: sin cliente API, sin estados de envío, sin acceso inclusivo verificado. US-17 construye el formulario de análisis manual accesible con mocks (MSW) cumpliendo PR-03 (semántica de señal/score) y QA-02 (acceso inclusivo), manteniéndolo fuera del build de producción.

## What Changes

- Crear `frontend/src/features/manual-analysis/` con cliente API (`POST /api/v1/predictions` vía `VITE_API_BASE_URL`) y vista con estados `idle`, `invalid`, `loading`, `success`, `error` y `score null`.
- Añadir soporte de tests y mock: MSW (Handlers para éxito/error/score null) y Testing Library, activos solo en dev/test y excluidos del build de producción.
- Formulario accesible: label vinculado, errores anunciados y asociados al control, foco tras error, `loading` bloquea doble envío y conserva el texto ante error, lenguage prudente sin color como única señal, `aria-live` para el resultado.
- Sin modificar App/Sidebar/Header ni introducir routing (la integración global llega en US-18).

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `manual-analysis`: añade requisito `UI-01 Análisis manual accesible` (PR-03 + QA-02 en el formulario): cliente API con estados idle/invalid/loading/success/error y `score null`, lenguaje prudente, accesibilidad del formulario, y mocks excluidos del build de producción.

## Impact

- Frontend: nueva feature `manual-analysis`, cliente HTTP, MSW, tooling de test y fixtures.
- Backend: sin cambios (contrato `POST /predictions` ya existente y testado).
- Build de producción: no incluye MSW ni fixtures.
- Trazabilidad: US-17 en la planificación (Issue enlazada de US-17). Dependencias US-01/US-02 cubiertas; el gate «contrato de mocks aprobado» se evidencia con el delta spec y fixtures versionadas.