@echo off
chcp 65001 >nul
title Dev Environment Starter

echo Starting Full-Stack Development Environment...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo Error: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js is installed

REM Check if backend directory exists
if not exist "backend\" (
    echo Error: backend directory not found
    pause
    exit /b 1
)

REM Check if frontend directory exists
if not exist "frontend\" (
    echo Error: frontend directory not found
    pause
    exit /b 1
)

echo Project structure is correct

REM Check if backend package.json exists
if not exist "backend\package.json" (
    echo Error: backend\package.json not found. Please run 'cd backend && npm install' first
    pause
    exit /b 1
)

REM Check if frontend package.json exists
if not exist "frontend\package.json" (
    echo Error: frontend\package.json not found. Please run 'cd frontend && npm install' first
    pause
    exit /b 1
)

echo Package configuration files exist
echo.

REM Start backend server (new window)
echo Starting Backend Server (PORT=3000)...
start "Backend Server" cmd /k "cd /d \"%~dp0backend\" && echo Backend server starting... && npm run dev"

REM Wait for backend to start
echo Waiting for Backend server to start...
ping 127.0.0.1 -n 4 >nul

REM Start frontend development server (new window)
echo Starting Frontend Development Server (PORT=5173)...
start "Frontend Server" cmd /k "cd /d \"%~dp0frontend\" && echo Frontend server starting... && npm run dev"

echo.
echo Development environment started successfully!
echo.
echo Service URLs:
echo    Backend API:  http://localhost:3000
echo    Frontend App: http://localhost:5173
echo    Admin Panel:  http://localhost:3000/admin.html
echo.
echo Tips:
echo    - Two terminal windows will open
echo    - Close any window to stop the corresponding service
echo    - Press Ctrl+C to stop services
echo.
pause