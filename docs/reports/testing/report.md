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