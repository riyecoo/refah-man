@echo off
cd /d "%~dp0"
title Refah Man
echo.
echo   Starting Refah Man...
echo.
where node >nul 2>nul
if %errorlevel%==0 (
  node serve.cjs
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
)
pause
