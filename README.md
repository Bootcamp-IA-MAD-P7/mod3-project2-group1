# Plan de proyecto — detección de contenido de odio

**Estado: propuesta para revisión, sin implementación.** Repositorio objetivo: `Bootcamp-IA-MAD-P7/mod3-project2-group1`. Equipo: Naimireth, María, Veru y Víctor.

Herramienta de apoyo a moderación de comentarios de YouTube. Clasifica contenido y presenta señales para revisión humana; no sanciona personas ni elimina comentarios automáticamente.

## Lectura de la entrega

1. [Assessment y preguntas abiertas](docs/discovery.md).
2. [Arquitectura, decisiones y evolución por niveles](openspec/changes/define-project/design.md).
3. [Contratos HTTP y ML](openspec/changes/define-project/contracts/README.md), con OpenAPI y ejemplos de esquemas Pydantic exclusivamente documentales.
4. [Propuesta OpenSpec](openspec/changes/define-project/proposal.md) y [guía de uso](openspec/README.md).
5. [Épicas, backlog, dependencias, slices y roadmap](docs/planning/backlog.md).
6. [Historias listas para revisión](docs/planning/stories/README.md), [trazabilidad](docs/planning/traceability.md) y [GitHub Project](docs/planning/github-project.md).
7. [Colaboración y DoD](CONTRIBUTING.md), [informes](docs/reports/README.md) y [validación](docs/planning/validation.md).

## Ejecución

El backend (FastAPI + ML clásico) y el frontend (React/Vite) se ejecutan por separado. No hay
servicios opcionales obligatorios; las capacidades deshabilitadas no bloquean el arranque esencial.

Requisitos: [uv](https://docs.astral.sh/uv/), Node LTS con npm, Python >= 3.12.

### Instalación reproducible (usa lockfiles, no descarga datos/modelos)

```bash
make setup            # backend: uv sync; frontend: npm ci
```

Equivalentes PowerShell: `scripts/setup.ps1`.

### Comandos

| Tarea | Make | PowerShell |
|---|---|---|
| Ayuda | `make help` | — |
| Instalación | `make setup` | `scripts/setup.ps1` |
| Backend (dev) | `make dev-backend` | `uv run uvicorn app.main:create_app --factory --reload` |
| Frontend (dev) | `make dev-frontend` | `npm run dev` (en `frontend/`) |
| Tests completos | `make test` | `scripts/test.ps1` |
| Tests backend | `make test-backend` | `uv run pytest` |
| Tests/chequeo frontend | `make test-frontend` | `npm run build` |
| E2E Essential | — | `npm run test:e2e` (en `frontend/`, con browsers Playwright instalados) |
| Lint | `make lint` | `scripts/lint.ps1` |
| Formato | `make format` | — |

### Ejecución real del recorrido Essential (US-18)

El flujo completo (navegador → API → bundle real) se demuestra con E2E Playwright:

```bash
# 1) (una vez) instalar el navegador de Playwright
cd frontend && npx playwright install chromium

# 2) ejecutar el recorrido (levanta 2 backends + 2 vite, corre los specs y los apaga)
cd frontend && npm run test:e2e
```

- `with-model`: comentario → `POST /api/v1/predictions` → señal real con `model_version` y error accesible.
- `no-model`: sin `MODEL_PATH` (producción) → `503` y la UI muestra indisponibilidad sin señal inventada.
- No requiere DB, YouTube, MLflow ni paquetes neuronales (smoke Essential).

Para ejecución manual: backend con `MODEL_PATH` (p. ej. `ml/artifacts/logistic_regression_dev_final.joblib`,
ver `.env.example`) arrancado con `uv run uvicorn app.main:create_app --factory --reload`, y frontend
con `npm run dev`. Se accede al flujo desde la navegación **Analyze comment** tras entrar en la demo.

### Evidencia del gate Essential (enlaces)

El cierre formal del nivel Essential enlaza: TDD/tests (este informe y suites), EDA/NLP/gap
([comparación DEV](docs/reports/experiments/comparison.md), [eval final](docs/reports/experiments/final-evaluation.md)),
augmentation US-08 ([informe](docs/reports/experiments/augmentation.md)) y revisión accesible US-17.
**Gates pendientes (no completados aún):** promoción del candidato (US-15, gap 33.67 pp reportado) y
cierre formal de US-08 para declarar Essential completo.

### Configuración

Copiar `.env.example` a `.env` para desarrollo local y ajustar según el [diseño
D-09](openspec/changes/define-project/design.md). Ningún secreto real en Git: los secretos van en el
CI/proveedor. `MODEL_PATH` vacío solo afecta a readiness, no al arranque (liveness). El endpoint de
predicción manual quedará disponible en la historia US-09.

## Incorporación a dev

Esta carpeta es un paquete documental independiente, no un nuevo repositorio. El usuario confirma que el repositorio real es greenfield, con `main` y `dev` sincronizadas; el directorio de ejecución de esta sesión tiene un Git vacío en `main`. No se han hecho operaciones Git de escritura. Antes de incorporar, verificar el checkout real de `dev`, revisar que no haya archivos nuevos en conflicto y copiar el **contenido** de esta carpeta a una rama de documentación derivada de `dev`. No copiar `.git` ni sobrescribir documentación sin revisar. No ejecutar `apply` de OpenSpec en esta fase.

## Alcance de los niveles

Essential entrega predicción manual con ML clásico local. Medium añade ensemble, optimización y análisis de vídeo. Advanced añade comparación neuronal, seguimiento, Docker y despliegue público. Expert añade transformer, historial PostgreSQL y MLflow. Cada ampliación es opcional para arrancar y usar la predicción esencial.
