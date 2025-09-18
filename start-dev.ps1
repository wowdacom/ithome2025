# PowerShell script to start both frontend and backend development servers
# Usage: .\start-dev.ps1

param(
    [switch]$Help
)

if ($Help) {
    Write-Host "Development Environment Starter for Full-Stack Application" -ForegroundColor Green
    Write-Host "Usage: .\start-dev.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "This script will:"
    Write-Host "  - Check Node.js installation"
    Write-Host "  - Verify project structure"
    Write-Host "  - Start backend server on port 3000"
    Write-Host "  - Start frontend server on port 5173"
    Write-Host ""
    Write-Host "Prerequisites:"
    Write-Host "  - Node.js installed"
    Write-Host "  - npm dependencies installed in both backend/ and frontend/"
    exit 0
}

Write-Host "🚀 Starting Full-Stack Development Environment..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed ($nodeVersion)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: Node.js not found. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed ($npmVersion)" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error: npm not found. Please install npm first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if backend directory exists
$backendPath = Join-Path $scriptPath "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Error: backend directory not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if frontend directory exists
$frontendPath = Join-Path $scriptPath "frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Error: frontend directory not found" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Project structure is correct" -ForegroundColor Green

# Check if backend package.json exists
$backendPackageJson = Join-Path $backendPath "package.json"
if (-not (Test-Path $backendPackageJson)) {
    Write-Host "❌ Error: backend/package.json not found. Please run 'cd backend && npm install' first" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if frontend package.json exists
$frontendPackageJson = Join-Path $frontendPath "package.json"
if (-not (Test-Path $frontendPackageJson)) {
    Write-Host "❌ Error: frontend/package.json not found. Please run 'cd frontend && npm install' first" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Package configuration files exist" -ForegroundColor Green
Write-Host ""

# Function to start server in new window
function Start-ServerInNewWindow {
    param(
        [string]$WindowTitle,
        [string]$Path,
        [string]$Command
    )
    
    $fullCommand = "cd '$Path'; Write-Host '$WindowTitle starting...' -ForegroundColor Yellow; $Command"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $fullCommand -WindowStyle Normal
}

# Start backend server
Write-Host "🔧 Starting Backend Server (PORT=3000)..." -ForegroundColor Cyan
Start-ServerInNewWindow -WindowTitle "Backend Server" -Path $backendPath -Command "npm run dev"

# Wait for backend to start
Write-Host "⏳ Waiting for Backend server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start frontend development server
Write-Host "🎨 Starting Frontend Development Server (PORT=5173)..." -ForegroundColor Cyan
Start-ServerInNewWindow -WindowTitle "Frontend Server" -Path $frontendPath -Command "npm run dev"

Write-Host ""
Write-Host "🎉 Development environment started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Service URLs:" -ForegroundColor Yellow
Write-Host "   🔗 Backend API:  http://localhost:3000" -ForegroundColor White
Write-Host "   🔗 Frontend App: http://localhost:5173" -ForegroundColor White
Write-Host "   🔗 Admin Panel:  http://localhost:3000/admin.html" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   - Two PowerShell windows will open" -ForegroundColor White
Write-Host "   - Close any window to stop the corresponding service" -ForegroundColor White
Write-Host "   - Press Ctrl+C in server windows to stop services" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit this window"