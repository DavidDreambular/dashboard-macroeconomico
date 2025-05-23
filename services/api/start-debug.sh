#!/bin/bash

echo "=== Backend Debugging Script ==="
echo ""

# Check environment variables
echo "1. Checking environment variables..."
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "REDIS_URL: ${REDIS_URL:0:30}..."
echo "NEWS_API_KEY: ${NEWS_API_KEY:0:10}..."
echo "ALPHAVANTAGE_KEY: ${ALPHAVANTAGE_KEY:0:10}..."
echo ""

# Test database connection
echo "2. Testing database connection..."
if [ ! -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL is set"
    # You can add actual connection test here
else
    echo "ERROR: DATABASE_URL is not set!"
fi
echo ""

# Check if node_modules exists
echo "3. Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "node_modules exists"
else
    echo "ERROR: node_modules not found. Running npm install..."
    npm install
fi
echo ""

# Generate Prisma client
echo "4. Generating Prisma client..."
npx prisma generate
echo ""

# Run migrations
echo "5. Running database migrations..."
npx prisma migrate deploy
echo ""

# Start the application
echo "6. Starting the application..."
npm run start:prod
