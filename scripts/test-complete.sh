#!/bin/bash

echo "🧪 Dashboard Macroeconómico - Suite de Testing Completa"
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs
PROD_API="https://api-backend-production-c9f2.up.railway.app"
PROD_WEB="https://web-frontend-production-df7e.up.railway.app"
LOCAL_API="http://localhost:3000"
LOCAL_WEB="http://localhost:5173"

# Función para test HTTP
test_endpoint() {
    local url=$1
    local expected=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" == "$expected" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $response, expected $expected)"
        return 1
    fi
}

# Función para test con contenido
test_content() {
    local url=$1
    local contains=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    response=$(curl -s "$url" 2>/dev/null)
    
    if [[ "$response" == *"$contains"* ]]; then
        echo -e "${GREEN}✓ PASS${NC}"
        echo "  Response: ${response:0:100}..."
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "  Expected to contain: $contains"
        echo "  Got: ${response:0:100}..."
        return 1
    fi
}

echo "1️⃣ Testing Production Backend API"
echo "================================="
test_endpoint "$PROD_API/api/health" "200" "Health Check"
test_endpoint "$PROD_API/api/docs" "200" "Swagger Docs"
test_endpoint "$PROD_API/api/state" "200" "Market State"
test_endpoint "$PROD_API/api/news" "200" "News List"
test_endpoint "$PROD_API/api/tickers" "200" "Tickers List"
test_endpoint "$PROD_API/api/signals" "200" "Signals List"
test_content "$PROD_API/api/health" "status" "Health Status Content"
echo ""

echo "2️⃣ Testing Production Frontend"
echo "=============================="
test_endpoint "$PROD_WEB" "200" "Frontend Homepage"
test_endpoint "$PROD_WEB/index.html" "200" "Frontend Index"
test_content "$PROD_WEB" "Dashboard Macroeconómico" "Frontend Title"
echo ""

echo "3️⃣ Testing API Integrations"
echo "=========================="
echo -n "Testing Market Data (Alpha Vantage)... "
market_response=$(curl -s "$PROD_API/api/state/market-data?symbol=AAPL" 2>/dev/null)
if [[ "$market_response" == *"quote"* ]] || [[ "$market_response" == *"price"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - May need API key configuration"
fi

echo -n "Testing News Fetch... "
news_response=$(curl -s -X POST "$PROD_API/api/news/fetch" 2>/dev/null)
if [[ "$news_response" == *"message"* ]] || [[ "$news_response" == *"count"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - May need API key configuration"
fi
echo ""

echo "4️⃣ Testing Database Connection"
echo "============================="
echo -n "Testing Database Ready... "
ready_response=$(curl -s "$PROD_API/api/health/ready" 2>/dev/null)
if [[ "$ready_response" == *"ready"* ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  Database: $(echo $ready_response | grep -o '"database":"[^"]*"' | cut -d'"' -f4)"
else
    echo -e "${RED}✗ FAIL${NC} - Database may not be connected"
fi
echo ""

echo "5️⃣ Testing CORS Headers"
echo "======================"
echo -n "Testing CORS... "
cors_response=$(curl -s -I -X OPTIONS "$PROD_API/api/health" 2>/dev/null | grep -i "access-control")
if [[ -n "$cors_response" ]]; then
    echo -e "${GREEN}✓ PASS${NC}"
    echo "  $cors_response"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - CORS headers not found"
fi
echo ""

echo "📊 Test Summary"
echo "=============="
echo "✅ Basic connectivity tests completed"
echo "⚠️  Some tests may fail due to:"
echo "   - Missing environment variables in Railway"
echo "   - Database connection not configured"
echo "   - API rate limits"
echo ""
echo "🔧 Next Steps:"
echo "1. Configure environment variables in Railway"
echo "2. Ensure PostgreSQL and Redis are running"
echo "3. Add API keys for Alpha Vantage and NewsAPI"
echo "4. Redeploy the service"
