@echo off
title AI Code Review Platform

echo ========================================
echo   AI Code Review Platform
echo ========================================
echo.
echo Starting server and client...
echo.

:: Start the server in a new minimized window
start "Server" /min cmd /c "cd /d "%~dp0server" && npm run dev"

:: Wait a moment for server to initialize
timeout /t 3 /nobreak >nul

:: Start the client in a new minimized window
start "Client" /min cmd /c "cd /d "%~dp0client" && npm run dev"

:: Wait for dev server to be ready
echo Waiting for servers to start...
timeout /t 5 /nobreak >nul

:: Open Microsoft Edge to the client
echo Opening in Microsoft Edge...
start msedge http://localhost:5173

echo.
echo Servers are running in the background.
echo Close the terminal windows or press Ctrl+C to stop.
echo.
