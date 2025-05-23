@echo off
echo ========================================
echo   Dashboard Macroeconomico - Quick Start
echo ========================================
echo.

echo [1/3] Starting Frontend...
echo.
cd web
start cmd /k "npm run dev"
timeout /t 3 >nul

echo [2/3] Opening Dashboard in Browser...
echo.
start http://localhost:5173
timeout /t 2 >nul

echo [3/3] Dashboard Status:
echo.
echo Frontend URL: http://localhost:5173
echo.
echo The dashboard is now running locally!
echo You will see the UI, but backend data won't load until Railway is configured.
echo.
echo To see full functionality:
echo 1. Configure Railway with the API keys
echo 2. Ensure PostgreSQL and Redis are running
echo 3. Deploy the backend service
echo.
echo Press any key to exit...
pause >nul
