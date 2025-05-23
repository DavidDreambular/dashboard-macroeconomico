# 🚨 SOLUCIÓN URGENTE - Dashboard Macroeconómico Railway

## Estado Actual (Basado en las imágenes)

### ✅ Funcionando:
- **postgres-dashboard**: Running ✅
- **redis-dashboard**: Running ✅
- **Frontend Local**: http://localhost:5173 ✅

### ❌ Con Problemas:
- **api-backend**: Failed (27 min ago) ❌
- **web-frontend**: Crashed (2 hours ago) ❌

## 🔧 Solución Inmediata

### 1. Verificar Logs del Backend

En Railway Dashboard:
1. Click en **api-backend**
2. Ve a **Logs** o **Deploy Logs**
3. Busca errores como:
   - `DATABASE_URL is not defined`
   - `Cannot connect to database`
   - `Module not found`

### 2. Configurar Variables de Entorno

En **api-backend** → **Variables**, agrega TODAS estas:

```bash
# CRÍTICAS - Sin estas no funciona
DATABASE_URL=[Copia desde postgres-dashboard → Connect → DATABASE_URL]
REDIS_URL=[Copia desde redis-dashboard → Connect → REDIS_URL]

# API Keys - Ya las tienes
NEWS_API_KEY=24ec2f716d8d41dcb51e9c9ed870ddba
ALPHAVANTAGE_KEY=7ZMGPQ3OGTIXQXRB

# Configuración
NODE_ENV=production
PORT=3000
ENABLE_SCHEDULER=true
API_PREFIX=api
CORS_ORIGINS=*
```

### 3. Verificar Build Settings

En **api-backend** → **Settings**:

- **Root Directory**: `/services/api`
- **Build Command**: `npm run build`
- **Start Command**: `npm run start:prod`

### 4. Redeploy Manual

1. En **api-backend**, click en **Deploy** → **Trigger Deploy**
2. Observa los logs en tiempo real
3. Si falla, copia el error exacto

### 5. Si el Backend Funciona, Fix Frontend

En **web-frontend** → **Settings**:

- **Root Directory**: `/web`
- **Build Command**: `npm run build`
- **Start Command**: `npm run preview`

Variables:
```bash
VITE_API_URL=https://api-backend-production-c9f2.up.railway.app
```

## 🐛 Errores Comunes y Soluciones

### Error: "Cannot find module"
```bash
# En Build Command:
npm install && npm run build
```

### Error: "Prisma Client not generated"
```bash
# Start Command actualizado:
npx prisma generate && npx prisma migrate deploy && node dist/main
```

### Error: "Database connection failed"
- Verifica que DATABASE_URL esté correcta
- Formato: `postgresql://usuario:password@host:puerto/database`

### Error: "Port already in use"
- Asegúrate que PORT=3000 esté configurado

## 🚀 Script de Emergencia

Si nada funciona, en **api-backend**:

**Start Command**:
```bash
chmod +x start-debug.sh && ./start-debug.sh
```

Esto ejecutará el script de debugging que creamos.

## 📱 Verificación Final

Una vez desplegado:

1. **Health Check**:
   ```
   https://api-backend-production-c9f2.up.railway.app/api/health
   ```
   Debe mostrar: `{"status":"ok","apiKeys":{"newsApi":"configured","alphaVantage":"configured"}}`

2. **Market Data Test**:
   ```
   https://api-backend-production-c9f2.up.railway.app/api/state/market-data?symbol=AAPL
   ```

3. **Frontend**:
   ```
   https://web-frontend-production-df7e.up.railway.app
   ```
   Debe mostrar el dashboard con datos reales

## ⏱️ Tiempo Estimado: 10-15 minutos

1. Configurar variables: 3 min
2. Trigger deploy: 5 min
3. Verificar logs: 2 min
4. Fix frontend: 5 min

¡Con estos pasos tu dashboard estará funcionando! 🎉
