# ================================================
# GET NGROK PUBLIC URL
# ================================================

Write-Host "🌐 Checking Ngrok Tunnel..." -ForegroundColor Cyan

# Check if ngrok is running
$ngrokStatus = docker compose ps ngrok --format json 2>&1 | ConvertFrom-Json -ErrorAction SilentlyContinue

if (-not $ngrokStatus -or $ngrokStatus.State -ne "running") {
    Write-Host "❌ Ngrok is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start ngrok:" -ForegroundColor Yellow
    Write-Host "  docker compose --profile dev up -d ngrok" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "✓ Ngrok is running" -ForegroundColor Green
Write-Host ""

# Get ngrok URL from logs
Write-Host "📋 Extracting public URL..." -ForegroundColor Yellow
$logs = docker compose logs ngrok 2>&1 | Select-String "started tunnel.*url=" | Select-Object -Last 1

if ($logs) {
    $url = ($logs.Line -split "url=")[1].Trim()
    
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "  🚀 NGROK PUBLIC URL" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  $url" -ForegroundColor White
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "📱 Access your app from anywhere:" -ForegroundColor Yellow
    Write-Host "   Frontend:  $url" -ForegroundColor Cyan
    Write-Host "   API:       $url/api" -ForegroundColor Cyan
    Write-Host "   Health:    $url/health" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "💡 Tips:" -ForegroundColor Yellow
    Write-Host "   - Share this URL with team members" -ForegroundColor Gray
    Write-Host "   - URL changes every time ngrok restarts" -ForegroundColor Gray
    Write-Host "   - Free tier has rate limits" -ForegroundColor Gray
    Write-Host ""
    
    # Copy to clipboard
    Set-Clipboard -Value $url
    Write-Host "✓ URL copied to clipboard!" -ForegroundColor Green
    Write-Host ""
    
} else {
    Write-Host "⚠️ Could not extract URL from logs" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Raw ngrok logs:" -ForegroundColor Gray
    docker compose logs ngrok --tail 10
}

# Check if ngrok web interface is accessible
Write-Host "🔍 Ngrok Web Interface:" -ForegroundColor Yellow
Write-Host "   http://localhost:4040 (may not be exposed)" -ForegroundColor Gray
Write-Host ""
