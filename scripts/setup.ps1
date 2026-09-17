# Equivalente PowerShell: make setup
# Instala backend (uv sync) y frontend (npm ci) usando los lockfiles.
Write-Host "Setup backend..." -ForegroundColor Cyan
Push-Location backend
uv sync --all-groups
Pop-Location

Write-Host "Setup frontend..." -ForegroundColor Cyan
Push-Location frontend
npm ci
Pop-Location