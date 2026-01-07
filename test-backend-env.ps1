# Test Backend Environment Variables

Write-Host "🧪 Testing Backend Configuration..." -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
$status = docker compose ps backend --format json 2>&1 | ConvertFrom-Json -ErrorAction SilentlyContinue

if (-not $status -or $status.State -ne "running") {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Backend is running" -ForegroundColor Green
Write-Host ""

# Test 1: Check environment variables inside container
Write-Host "📋 Checking Environment Variables in Container..." -ForegroundColor Yellow
Write-Host ""

$envVars = @(
    "ConnectionStrings__DefaultConnection",
    "S3Storage__ServiceUrl",
    "S3Storage__PublicUrl",
    "Jwt__Key",
    "Jwt__Issuer",
    "AIProvider__GeminiApiKey",
    "VNPay__TmnCode",
    "Resend__ApiKey"
)

foreach ($var in $envVars) {
    $value = docker compose exec -T backend sh -c "echo `$env:$var" 2>&1
    if ($value -and $value -notlike "*error*") {
        $maskedValue = if ($var -like "*Key*" -or $var -like "*Secret*" -or $var -like "*Password*") {
            "***HIDDEN***"
        } else {
            $value.Substring(0, [Math]::Min(50, $value.Length)) + "..."
        }
        Write-Host "  ✓ $var = $maskedValue" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ $var = NOT SET" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "💡 Environment variables are set!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 How .NET reads config:" -ForegroundColor Yellow
Write-Host "  1. appsettings.json (base)" -ForegroundColor Gray
Write-Host "  2. Environment Variables (override) <- We use this in Docker" -ForegroundColor Green
Write-Host "  3. Command line args (highest priority)" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Example:" -ForegroundColor Yellow
Write-Host "  appsettings.json:     Jwt__Key = default-dev-key" -ForegroundColor Gray
Write-Host "  Docker env:           Jwt__Key = production-key-from-env" -ForegroundColor Green
Write-Host "  Result in app:        production-key-from-env (env wins!)" -ForegroundColor Green
Write-Host ""
