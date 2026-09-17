.PHONY: help setup dev-backend dev-frontend test test-backend test-frontend lint format

## help: lista comandos, requisitos y equivalentes PowerShell
help:
	@echo "Comandos disponibles (equivalentes PowerShell en scripts/*.ps1):"
	@echo ""
	@echo "  make setup             Instala backend (uv sync) y frontend (npm ci) con locks"
	@echo "  make dev-backend       Arranca uvicorn en modo reload (PATHUAL en .env)"
	@echo "  make dev-frontend      Arranca Vite en modo dev"
	@echo "  make test              Ejecuta test-backend + test-frontend (sin live APIs)"
	@echo "  make test-backend      Ejecuta pytest del backend"
	@echo "  make test-frontend     Ejecuta build/chequeo del frontend"
	@echo "  make lint              Ruff (backend) y ESLint/Prettier (frontend, si configurado)"
	@echo "  make format            Ruff format (backend)"
	@echo ""
	@echo "Requisitos: uv, Node LTS con npm, Python >= 3.12."

## setup: instalación limpia con locks, sin descargar dataset/modelos
setup:
	cd backend && uv sync --all-groups
	cd frontend && npm ci

## dev-backend: uvicorn con reload
dev-backend:
	cd backend && uv run uvicorn app.main:app --reload

## dev-frontend: Vite dev
dev-frontend:
	cd frontend && npm run dev

## test: suites disponibles sin integraciones live
test: test-backend test-frontend

## test-backend: pytest
test-backend:
	cd backend && uv run pytest

## test-frontend: build y chequeos disponibles
test-frontend:
	cd frontend && npm run build

## lint: Ruff backend; ESLint/Prettier frontend se añade cuando exista configuración
lint:
	cd backend && uv run ruff check .

## format: Ruff format
format:
	cd backend && uv run ruff format .