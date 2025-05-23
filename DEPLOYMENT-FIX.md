# 🚀 Railway Deployment Fix - Dashboard Macroeconómico

## 🔧 Solución para Error 502

### 1. **Variables de Entorno Configuradas**

Las siguientes API keys están listas para usar:

```bash
NEWS_API_KEY=24ec2f716d8d41dcb51e9c9ed870ddba
ALPHAVANTAGE_KEY=7ZMGPQ3OGTIXQXRB
ENABLE_SCHEDULER=true
```

### 2. **Pasos para Resolver el Error 502**

#### Opción A: Usando Railway Dashboard (Recomendado)
1. Accede a https://railway.app
2. Encuentra el proyecto `dashboard-macroeconomico`
3. Ve al servicio `api-backend`
4. Click en "Variables"
5. Agrega las siguientes variables:
   ```
   NEWS_API_KEY=24ec2f716d8d41dcb51e9c9ed870ddba
   ALPHAVANTAGE_KEY=7ZMGPQ3OGTIXQXRB
   ENABLE_SCHEDULER=true
   NODE_ENV=production
   PORT=3000
   ```
6. Click en "Deploy" para reiniciar el servicio

#### Opción B: Usando Railway CLI
```bash
# Instalar Railway CLI si no lo tienes
npm install -g @railway/cli

# Login
railway login

# Seleccionar proyecto
railway link 871a2ffc-2053-414e-aef7-36a55e980818

# Ejecutar script de configuración
bash scripts/setup-railway-env.sh

# O manualmente:
railway variables set NEWS_API_KEY=24ec2f716d8d41dcb51e9c9ed870ddba --service api-backend
railway variables set ALPHAVANTAGE_KEY=7ZMGPQ3OGTIXQXRB --service api-backend
railway variables set ENABLE_SCHEDULER=true --service api-backend

# Redeploy
railway up --service api-backend
```

### 3. **Verificar el Deployment**

1. **Check Logs**:
   ```bash
   railway logs --service api-backend
   ```

2. **Test Health Endpoint**:
   ```bash
   curl https://api-backend-production-c9f2.up.railway.app/api/health
   ```

3. **Test Market Data**:
   ```bash
   curl https://api-backend-production-c9f2.up.railway.app/api/state/market-data?symbol=AAPL
   ```

### 4. **Funcionalidades Nuevas Agregadas**

✅ **Alpha Vantage Integration**:
- `/api/state/market-data?symbol=AAPL` - Datos de mercado en tiempo real
- `/api/state/quotes?symbols=AAPL,MSFT,GOOGL` - Múltiples cotizaciones

✅ **NewsAPI Integration**:
- `/api/news/fetch` - Obtener noticias financieras
- `/api/news` - Ver noticias almacenadas

✅ **Health Check Mejorado**:
- Muestra estado de API keys configuradas
- Verifica conexión a base de datos

### 5. **Desarrollo Local**

Para probar localmente con las API keys:

```bash
cd services/api
npm install
npm run start:dev
```

El archivo `.env` ya contiene las API keys para desarrollo.

### 6. **Frontend Listo**

El frontend está 100% implementado y esperando la conexión:

```bash
cd web
npm install
npm run dev
```

Abre http://localhost:5173 para ver el dashboard.

## 📊 Estado Final

- ✅ API Keys configuradas en código
- ✅ Servicios Alpha Vantage y NewsAPI implementados
- ✅ Health checks mejorados
- ✅ Frontend completamente funcional
- ✅ Solo falta aplicar variables en Railway

## 🎯 Próximo Paso

**Aplicar las variables de entorno en Railway y el sistema estará 100% operativo!**
