# CrowdIQ Python FastAPI Backend Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting CrowdIQ Python FastAPI + PyTorch AI Engine...  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$VenvPython = Join-Path $PSScriptRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Host "[ERROR] Virtual environment not found at $VenvPython" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Using Python environment: $VenvPython" -ForegroundColor Green
Write-Host "[OK] Launching FastAPI at http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "[OK] Swagger Interactive Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "[OK] Real-time WebSocket: ws://127.0.0.1:8000/ws/telemetry" -ForegroundColor Yellow

& $VenvPython -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
