# Tasks

## 1. Integración en la app

- [x] 1.1 Añadir `"analyze-comment"` a `NAVIGABLE_VIEWS` y renderizar `ManualAnalysisPage` en `App.tsx`; verificar con el test de navegación que la vista muestra el formulario y con `npm run build` (tsc) que compila
- [x] 1.2 Verificar con test (vitest) que desde la navegación `analyze-comment` se llega a la feature y que heartbeat (liveness) funciona sin servicios opcionales

## 2. E2E Playwright

- [x] 2.1 Añadir `@playwright/test` (devDependency), script `test:e2e` y `playwright.config.ts` con proyecto `with-model` (backend puerto 8101 con `MODEL_PATH` válido + frontend 5176); verificar que `npm run test:e2e -- --project=with-model` pasa el flujo comentario→API→señal con versión y error accesible
- [x] 2.2 Añadir proyecto `no-model` (backend puerto 8102 sin `MODEL_PATH` + frontend 5177 con `CORS_ORIGINS` 5176,5177); verificar que el spec de indisponibilidad muestra `503`/readiness sin señal inventada
- [x] 2.3 Registrar comando e instalación de browsers (`npx playwright install chromium`) en README/documentación y confirmar que el smoke E2E no usa DB/YouTube/MLflow/neuronales

## 3. Informe y evidencia del gate

- [x] 3.1 Añadir sección US-18 en `docs/reports/testing/report.md` con resultados reales de unit/vitest, build, E2E with/no-model y smoke; registrar sin inventar
- [x] 3.2 Actualizar README con la ejecución real del recorrido Essential (backend con bundle + frontend) y enlazar evidencias del gate (TDD/tests, EDA/NLP/gap, augmentation US-08, revisión accesible US-17) declarando los gates US-15/US-08 como pendientes, no cumplidos

## 4. Verificación del change

- [x] 4.1 Ejecutar suite frontend (`npm run test`), build (`npm run build`) y E2E `with-model`/`no-model`; registrar resultados reales
- [x] 4.2 Ejecutar `openspec validate essential-integrated-product --strict` y `git diff --check`; no reclamar gates pendientes
- [x] 4.3 Registrar que el cierre formal del nivel Essential depende del gate «US-15 aprobado» y de la evidencia US-08 (decisión humana), y que sync/archive requieren revisión y CI

## Evidencia de validación (real, ejecutada)

- Backend: `uv run pytest -p no:cacheprovider` → **184 passed**; `uv run ruff check .` → OK.
- Frontend: `npm run test` → **19 passed** (4 files); `npm run build` → OK (tsc + vite).
- E2E: `npm run test:e2e` → **3 passed** (with-model: flujo real + error accesible; no-model: `503` sin señal).
- Informe y ejecución real: `docs/reports/testing/report.md` (US-18) y README.
- `openspec validate essential-integrated-product --strict`: **valid** · `git diff --check`: OK.

## Pendiente humano antes de declarar Essential completo

- [ ] Gate «US-15 aprobado» (promoción del candidato; gap 33.67 pp reportado): decisión de equipo y, en su caso, nuevo ciclo con holdout independiente.
- [ ] Evidencia formal de US-08 (augmentation) para el cierre del nivel.
- [ ] Revisión de PR/CI y, cuando el equipo lo confirme, `/opsx:sync` + `/opsx:archive`.

## Fuera de alcance

- Sustituir la aceptación ML por mocks; resolver el gate US-15; completar US-08; capacidades Medium/Advanced/Expert.