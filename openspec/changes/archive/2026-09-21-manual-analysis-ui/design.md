# Diseño: interacción manual accesible (US-17)

## Context

El frontend (React 19 + Vite + Tailwind v4, alias `@`) no tiene cliente HTTP ni routing: `App.tsx` renderiza el Dashboard con `DASHBOARD_MOCK_DATA` y las features se construyen aisladas (patrón `features/<name>/view-model + page + components`). No hay runner de tests ni MSW. El contrato backend `POST /api/v1/predictions` (API-02) y `VITE_API_BASE_URL` ya existen. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Feature `frontend/src/features/manual-analysis/` con cliente API tipo, estado de vistas y formulario accesible.
- Tests Testing Library (RED→GREEN) con MSW para éxito/error/`score null`.
- Mocks fuera del build de producción.

**Non-Goals:**
- Routing global, Sidebar/Header/App ni navegación entre features (llega en US-18).
- Cambios de backend (el contrato ya está testado).
- Funcionalidades Medium/Advanced/Expert (jobs, vídeo, historial).

## Decisions

- **Cliente API**: mínimo en `features/manual-analysis/api.ts` usando `fetch`, `VITE_API_BASE_URL` con fallback a `http://localhost:8000/api/v1`; tipado con el contrato `PredictionResponse`. *Alternativa descartada*: librería axios — dependencia extra sin beneficio para un solo endpoint.
- **Vista**: unión de estados `idle | invalid | loading | success | error` en el view-model (patrón existente); `score null` es un caso de `success` sin probabilidad. El estado conserva el texto introducido ante error.
- **Accesibilidad**: `<label htmlFor>`, `<input id>` con `aria-describedby` a errores, `aria-invalid`, región `role="status"` + `aria-live="polite"` para el resultado, botón `disabled` durante `loading`, y señal con texto + icono + badge (color no es la única señal).
- **Tests y mocks**: añadir `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom` y `msw` como devDependencies; handlers MSW para `POST /predictions` (éxito, 422/error, `score null`). Activación solo por `import.meta.env.MODE !== 'production'`; el build de producción no bundlea MSW (tree-shaking del guard en el punto de entrada dev).
- **Sin App/routing**: la feature se crea sin modificar `App.tsx` ni Sidebar (consistente con Laboratory/Conversation); US-18 las integra.
- **Sin e2e en este change** (corresponden a US-18); aquí solo unit/integration de la feature.

## Risks / Trade-offs

- [MSW se cuele en producción] → Guard explícito `MODE !== 'production'` + verificación en el build (`npm run build` sin rastros de MSW) como tarea de AC3.
- [Sin routing no es accesible la URL] → Se documenta como non-goal (US-18); los tests cubren la feature directamente.
- [Typescript 7 unknown con vitest] → Config de test separada (`vitest.config.ts`) con types y `reference types="vitest"`; verificación con `npm run build` intacta.
- [Accesibilidad solo test automático] → QA-02 exige evidencia manual (teclado/foco/contraste/320px/200%) + tests; ambas se registran.

## Migration Plan

N/A: feature nueva, sin migración. No sync/archive hasta validaciones, revisión humana y, para reclamar cierre, evidencia US-18/Essential.

## Open Questions

- Nada que cambie alcance: la persona de integración/routing (US-18) queda fuera de este change por decisión de alcance ya registrada.