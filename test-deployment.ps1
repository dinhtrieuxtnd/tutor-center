# ================================================
# TEST DOCKER DEPLOYMENT SCRIPT
# ================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " TESTING TUTOR CENTER DOCKER DEPLOYMENT" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Container Status
Write-Host "[1/6] Checking Container Status..." -ForegroundColor Yellow
docker compose ps
Write-Host ""

# 2. Test Nginx Health
Write-Host "[2/6] Testing Nginx Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing
    Write-Host "✓ Nginx Health: $($health.StatusCode) OK" -ForegroundColor Green
    Write-Host "  Response: $([System.Text.Encoding]::UTF8.GetString($health.Content))" -ForegroundColor Gray
} catch {
    Write-Host "✗ Nginx Health: FAILED" -ForegroundColor Red
}
Write-Host ""

# 3. Test Frontend (React App)
Write-Host "[3/6] Testing Frontend (React SPA)..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing
    Write-Host "✓ Frontend: $($frontend.StatusCode) OK (Content: $($frontend.RawContentLength) bytes)" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend: FAILED - $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. Test Backend API (Unauthorized expected)
Write-Host "[4/6] Testing Backend API..." -ForegroundColor Yellow
try {
    $api = Invoke-WebRequest -Uri "http://localhost:8080/api/tutors" -UseBasicParsing -ErrorAction Stop
    Write-Host "⚠ Backend API: Unexpected $($api.StatusCode)" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401) {
        Write-Host "✓ Backend API: 401 Unauthorized (Authentication working correctly)" -ForegroundColor Green
    } else {
        Write-Host "✗ Backend API: $statusCode - $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# 5. Test MinIO Storage (403 expected for public listing)
Write-Host "[5/6] Testing MinIO Storage..." -ForegroundColor Yellow
try {
    $storage = Invoke-WebRequest -Uri "http://localhost:8080/storage/tutor-media/" -UseBasicParsing -ErrorAction Stop
    Write-Host "✓ MinIO Storage: $($storage.StatusCode) OK" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 403) {
        Write-Host "✓ MinIO Storage: 403 Forbidden (Bucket exists, listing disabled)" -ForegroundColor Green
    } elseif ($statusCode -eq 404) {
        Write-Host "⚠ MinIO Storage: 404 Not Found (Bucket may not exist)" -ForegroundColor Yellow
    } else {
        Write-Host "✗ MinIO Storage: Failed - $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# 6. Summary
Write-Host "[6/6] Deployment Summary" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Frontend (React):     http://localhost:8080" -ForegroundColor White
Write-Host "Backend API:          http://localhost:8080/api" -ForegroundColor White
Write-Host "MinIO Storage:        http://localhost:8080/storage" -ForegroundColor White
Write-Host "Nginx Health:         http://localhost:8080/health" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:8080 in browser to access the app" -ForegroundColor Gray
Write-Host "2. Login with default credentials (from seed data)" -ForegroundColor Gray
Write-Host "3. Check logs: docker compose logs -f [service_name]" -ForegroundColor Gray
Write-Host "4. Stop all: docker compose down" -ForegroundColor Gray
Write-Host ""
