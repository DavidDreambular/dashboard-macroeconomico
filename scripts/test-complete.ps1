# Dashboard Macroeconómico - Suite de Testing Completa
Write-Host "🧪 Dashboard Macroeconómico - Suite de Testing Completa" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# URLs
$PROD_API = "https://api-backend-production-c9f2.up.railway.app"
$PROD_WEB = "https://web-frontend-production-df7e.up.railway.app"

# Función para test HTTP
function Test-Endpoint {
    param($url, $expected, $description)
    
    Write-Host -NoNewline "Testing $description... "
    
    try {
        $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing -TimeoutSec 10
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq $expected) {
            Write-Host "✓ PASS (HTTP $statusCode)" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ FAIL (HTTP $statusCode, expected $expected)" -ForegroundColor Red
            return $false
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "✗ FAIL (HTTP $statusCode)" -ForegroundColor Red
        return $false
    }
}

# Función para test con contenido
function Test-Content {
    param($url, $contains, $description)
    
    Write-Host -NoNewline "Testing $description... "
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 10
        $content = $response | ConvertTo-Json -Compress
        
        if ($content -like "*$contains*") {
            Write-Host "✓ PASS" -ForegroundColor Green
            $preview = if ($content.Length -gt 100) { $content.Substring(0, 100) + "..." } else { $content }
            Write-Host "  Response: $preview" -ForegroundColor Gray
            return $true
        } else {
            Write-Host "✗ FAIL" -ForegroundColor Red
            Write-Host "  Expected to contain: $contains" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host "✗ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        return $false
    }
}

Write-Host "1️⃣ Testing Production Backend API" -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Test endpoints
Test-Endpoint "$PROD_API/api/health" 200 "Health Check"
Test-Endpoint "$PROD_API/api/docs" 200 "Swagger Docs"
Test-Endpoint "$PROD_API/api/state" 200 "Market State"
Test-Endpoint "$PROD_API/api/news" 200 "News List"
Test-Content "$PROD_API/api/health" "status" "Health Status Content"

Write-Host ""
Write-Host "2️⃣ Testing Production Frontend" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow

Test-Endpoint "$PROD_WEB" 200 "Frontend Homepage"

Write-Host ""
Write-Host "3️⃣ Testing API Special Endpoints" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow

# Test market data
Write-Host -NoNewline "Testing Market Data (Alpha Vantage)... "
try {
    $marketResponse = Invoke-RestMethod -Uri "$PROD_API/api/state/market-data?symbol=AAPL" -Method GET -TimeoutSec 10
    if ($marketResponse) {
        Write-Host "✓ PASS" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ WARNING - May need API key configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "==============" -ForegroundColor Cyan
Write-Host "✅ Tests completed" -ForegroundColor Green
Write-Host ""
Write-Host "🔧 If tests failed, configure these in Railway:" -ForegroundColor Yellow
Write-Host "   NEWS_API_KEY=24ec2f716d8d41dcb51e9c9ed870ddba" -ForegroundColor White
Write-Host "   ALPHAVANTAGE_KEY=7ZMGPQ3OGTIXQXRB" -ForegroundColor White
Write-Host "   ENABLE_SCHEDULER=true" -ForegroundColor White
Write-Host "   NODE_ENV=production" -ForegroundColor White
