# AI Integration Test Script
Write-Host "=== AI Integration Test ===" -ForegroundColor Green

# Test backend server
Write-Host "1. Checking backend service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "✓ Backend service is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend service connection failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test AI API endpoint
Write-Host "2. Testing AI API endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        prompt = "Improve this article title"
        currentContent = "This is test content for the article"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/ai/assist" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 30
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ AI API responded successfully" -ForegroundColor Green
        $result = $response.Content | ConvertFrom-Json
        Write-Host "Response: $($result.suggestion)" -ForegroundColor Cyan
    } else {
        Write-Host "✗ AI API responded with error: HTTP $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ AI API test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend server
Write-Host "3. Checking frontend service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5
    Write-Host "✓ Frontend service is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend service connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "=== Test Complete ===" -ForegroundColor Green