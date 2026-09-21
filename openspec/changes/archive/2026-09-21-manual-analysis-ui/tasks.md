# Tasks

## 1. Cliente API y estado de vista

- [x] 1.1 Crear `frontend/src/features/manual-analysis/api.ts` con cliente `fetch` tipado para `POST /predictions` usando `VITE_API_BASE_URL` (fallback `http://localhost:8000/api/v1`) y verificar con test de que mapea la respuesta del contrato (label/score nullable/score_kind/model_version/review_required/persistence)
- [x] 1.2 Crear el view-model con los estados `idle | invalid | loading | success | error` y `score null` como caso de `success` sin probabilidad, y verificar con tests de transiciones (loading impide doble envío; error conserva el texto

## 2. Formulario accesible (UI-01 / QA-02)

- [x] 2.1 Implementar la página `manual-analysis` con `<label>` vinculado, `aria-describedby`/`aria-invalid` en validación, `role="status"` + `aria-live`, y señal con texto+icono+badge (no color como única señal); verificar con tests Testing Library (interacción, error mostrado, score null sin porcentaje inventado y lenguaje prudente)
- [x] 2.2 Verificar foco/teclado en el flujo de error y que `loading` deshabilita el envío manteniendo el texto; cubrir con test de interacción

## 3. Tests con MSW y fixture (mocks fuera de producción)

- [x] 3.1 Añadir devDependencies (`vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`, `msw`), `vitest.config.ts` con `jsdom` y setup, y script `test`; verificar que `npm run test` ejecuta la suite RED→GREEN
- [x] 3.2 Crear MSW handlers para `POST /predictions` (éxito, `422`/error, `score null`) y verificar que los tests los consumen
- [x] 3.3 Garantizar mocks fuera del build de producción (guard `MODE !== 'production'`) y verificar con `npm run build` que no quedan referencias a MSW/fixtures en el bundle

## 4. Verificación del change

- [x] 4.1 Ejecutar suite frontend (`npm run test`) y `npm run build` y registrar resultados reales
- [x] 4.2 Revisión manual (evidencia QA-02): teclado/foco, 320 CSS px, zoom 200 %, contraste; registrar en tasks/reporte
- [x] 4.3 Ejecutar `openspec validate manual-analysis-ui --strict` y `git diff --check`; no reclamar funcionalidades fuera de Scope
- [x] 4.4 Registrar que el build no integra routing/App (queda para US-18) y que sync/archive requieren revisión humana y CI

## Evidencia de validación (real, ejecutada)

- `npm run test` (frontend): **17 passed** (3 files: api, view-model, página con Testing Library + user-event + MSW).
- `npm run build` (frontend): **OK** — tsc --noEmit + vite build sin errores.
- Bundle de producción: **sin referencias** a "msw", "Predictor not available", fixtures (`0ddfbc97`) ni `MODEL_UNAVAILABLE` (grep en `dist/assets` = 0).
- `openspec validate manual-analysis-ui --strict`: **Change is valid** (delta `manual-analysis` UI-01).
- `git diff --check`: **OK**.

## Evidencia QA-02 (manual, confirmada por el equipo el 2026-09-21)

- Teclado/foco (Tab hasta textarea, foco visible, submit con Enter, errores con `aria-invalid`/`aria-describedby` y guía de foco): **OK**.
- 320 CSS px sin overflow y zoom 200 % usable: **OK**.
- Contraste suficiente en light/dark: **OK**.
- Estados idle/invalid/loading/success/error en preview con modelo real y texto conservado ante error: **OK**.

## Sobre sync/archive y routing

- El sync del delta (UI-01) y el archive de este change se ejecutan tras CI y confirmación del equipo (2026-09-21); US-18 integra routing/App en un change posterior.
- El fix del sidecar del bundle (backend) se tramita en un PR separado.

## Fuera de alcance

- Routing global, Sidebar/Header/App, E2E de producto (US-18), cambios de backend, capacidades Medium/Advanced/Expert.