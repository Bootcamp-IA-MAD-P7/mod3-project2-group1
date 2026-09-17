# Equivalente PowerShell: make lint
# Ruff para backend. ESLint/Prettier del frontend se añade cuando exista configuración.
Write-Host "Lint backend (ruff)..." -ForegroundColor Cyan
Push-Location backend
uv run ruff check .
Pop-Location