@echo off
title CrowdIQ Python FastAPI Backend
echo ==========================================================
echo   Starting CrowdIQ Python FastAPI + PyTorch AI Engine...
echo ==========================================================
echo [OK] Launching FastAPI at http://127.0.0.1:8000
echo [OK] Swagger Interactive Docs: http://127.0.0.1:8000/docs
echo [OK] Real-time WebSocket: ws://127.0.0.1:8000/ws/telemetry
echo.

".venv\Scripts\python.exe" -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
pause
