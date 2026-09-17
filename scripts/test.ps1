# Equivalente PowerShell: make test
# Ejecuta pytest del backend y build del frontend. Sin integraciones live.
Write-Host "Test backend..." -ForegroundColor Cyan
Push-Location backend
uv run pytest
Pop-Location

Write-Host "Test frontend (build)..." -ForegroundColor Cyan
Push-Location frontend
npm run build
Pop-Location