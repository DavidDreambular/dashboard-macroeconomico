#!/bin/bash

# Railway Environment Variables Setup Script
# This script sets up all necessary environment variables for the Dashboard Macroeconómico project

echo "Setting up Railway environment variables..."

# API Keys
railway variables set NEWS_API_KEY=24ec2f716d8d41dcb51e9c9ed870ddba --service api-backend
railway variables set ALPHAVANTAGE_KEY=7ZMGPQ3OGTIXQXRB --service api-backend

# Scheduler
railway variables set ENABLE_SCHEDULER=true --service api-backend

# Node Environment
railway variables set NODE_ENV=production --service api-backend
railway variables set PORT=3000 --service api-backend

# SMTP Configuration (Optional)
railway variables set SMTP_HOST=smtp.hostinger.com --service api-backend
railway variables set SMTP_PORT=587 --service api-backend
railway variables set SMTP_USER=info@saftagency.com --service api-backend
railway variables set SMTP_PASS=Terrassa2025! --service api-backend
railway variables set NOTIFICATION_EMAIL=info@saftagency.com --service api-backend

echo "Environment variables set successfully!"
echo "Now redeploy the service to apply changes:"
echo "railway up --service api-backend"
