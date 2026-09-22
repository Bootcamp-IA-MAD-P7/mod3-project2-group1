# Informe de testing — US-02 entorno reproducible

> Estado: evidencia de la historia US-02 (entorno/CI), no de producto E2E.
> Rama: `feature/US-02-entorno-reproducible`. Fecha: 2026-09-17.

## Alcance

Verificar que la instalación reproducible (lockfiles), los comandos documentados y el chequeo de
imports básico funcionan sin servicios opcionales ni datos/modelos descargados ocultamente.

## Entorno usado

- `uv` 0.11.31 (lock resuelto con CPython 3.13.x).
- Lockfile `backend/uv.lock` generado con `uv lock` (34 packages).
- Dependencias de runtime: FastAPI, uvicorn, pydantic(-settings), scikit-learn, pandas, numpy.

## Comandos y resultados reales

| Comando | Resultado |
|---|---|
| `uv lock` (backend) | Resolved 34 packages, sin errores |
| `uv sync --all-groups` (backend) | Instaló entorno según lock, sin descargar dataset/modelos |
| `uv run pytest tests/unit/test_smoke_config.py -v` | **4 passed** (env.example, pyproject+uv.lock, imports core) |
| `uv run pytest` (suite completa backend) | **45 passed** |
| `uv run ruff check .` | **All checks passed** |
| `npm ci` / `npm run build` (frontend) | dependen del workflow CI; build disponible en `package.json` |

## Cumplimiento de AC

- **AC1**: instalación usa lockfiles (`uv.lock`, `package-lock.json`); `uv lock` no descarga
  dataset/modelos; `MODEL_PATH` vacío no simula modelo.
- **AC2**: `make help/setup/test/lint` y equivalentes PowerShell (`scripts/*.ps1`) documentados y
  enlazados en README; `.env.example` con claves secretas vacías y frontend solo `VITE_*`.
- **AC3**: smoke de imports de módulos core sin DB/MLflow/YouTube; CI mínima (`ci.yml`) ejecuta
  pytest + ruff (backend) y build (frontend) sin credenciales externas.

## Limitaciones

- Orden de imports y estilo de 7 módulos `ml/` preexistentes ajustado por `ruff --fix` (solo
  cosmético; comportamiento y 45 tests intactos).
- El lint/frontend ESLint se habilita cuando exista configuración (diseño D-09).
- Docker/PostgreSQL fuera de scope de US-02.

---

# Informe de testing — US-18 producto Essential integrado

> Estado: recorrido Essential integrado y E2E real (navegador → API → bundle).
> Rama: feature de US-18. Fecha: 2026-09-21.

## Alcance

Verificar el flujo completo comentario → navegador → API → bundle real, la indisponibilidad sin
modelo, y el smoke sin servicios opcionales (DB/YouTube/MLflow/neuronales).

## Entorno usado

- Frontend: React 19 + Vite 8, vitest + Testing Library + MSW, Playwright (Chromium).
- Backend: FastAPI + bundle Logistic Regression DEV-only (`qa_preview`/`logistic_regression_dev_final`).
- Sin DB, YouTube, MLflow ni dependencias neuronales en toda la ejecución.

## Comandos y resultados reales

| Comando | Resultado |
|---|---|
| `uv run pytest -p no:cacheprovider` (backend) | **184 passed** (incluye US-16/US-17 y smoke) |
| `uv run ruff check .` (backend) | **All checks passed** |
| `npm run test` (frontend, vitest) | **19 passed** (4 files: api, view-model, página, navegación App) |
| `npm run build` (frontend) | **OK** (tsc --noEmit + vite build) |
| `npm run test:e2e` (Playwright, runner Node) | **3 passed** (with-model: flujo real + error accesible; no-model: indisponibilidad 503) |
| Smoke sin servicios opcionales | POST /predictions `200` con modelo y `503` sin modelo; liveness `200` |

Detalles E2E observados (logs del runner): con modelo, `POST /predictions` → `200` con señal real
(`model_version` del bundle); sin modelo (APP_ENV=production), `POST` → `503 MODEL_UNAVAILABLE` y la
UI muestra el mensaje sin señal inventada.

## Cumplimiento de AC

- **AC1**: E2E navegador→API→bundle real entrega señal con versión y error accesible (spec
  `flow.spec.ts`; se muestra `Hate signal`/`Non-hate signal`, versión `xxxxxxxx` y el error
  `aria-invalid` en envío vacío).
- **AC2**: el flujo funciona sin DB/YouTube/MLflow/neuronales y con modelo faltante se muestra
  indisponibilidad (spec `no-model.spec.ts`, `503`).
- **AC3**: evidencia enlazada en README/repo (TDD/tests, EDA/NLP/gap, augmentation US-08 y revisión
  accesible US-17); gates US-15 y US-08 se declaran **pendientes**, no cumplidos.

## Limitaciones

- El E2E ejecuta con un bundle DEV-only local (gitignored); requiere `npx playwright install chromium`.
- Los browsers Playwright no se instalan en CI de este change (se documenta la ejecución local; un
  job CI de E2E quedaría como ampliación).