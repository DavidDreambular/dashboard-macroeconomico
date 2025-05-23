# Configuración de Railway para el Dashboard Macroeconómico

## Obtener Token de Railway

1. **Crear cuenta en Railway** (si no tienes una):
   - Ve a https://railway.app/
   - Haz clic en "Start a New Project"
   - Inicia sesión con GitHub (recomendado para integración)

2. **Generar un API Token**:
   - Ve a https://railway.app/account/tokens
   - Haz clic en "Create Token"
   - Dale un nombre descriptivo como "Dashboard Macro Token"
   - Copia el token generado (solo se muestra una vez)

3. **Configurar el token en tu proyecto**:
   - Opción A: Variable de entorno local
     ```bash
     export RAILWAY_API_TOKEN="tu_token_aqui"
     ```
   
   - Opción B: Archivo .env local
     ```
     RAILWAY_API_TOKEN=tu_token_aqui
     ```

## Próximos Pasos

Una vez que tengas el token, podremos:

1. Crear el proyecto en Railway
2. Configurar PostgreSQL y Redis
3. Desplegar los servicios (API y Web)
4. Configurar las variables de entorno
5. Conectar con GitHub para auto-deploy

## Servicios a Configurar

- **PostgreSQL**: Base de datos principal
- **Redis**: Cache y gestión de colas
- **API Backend**: NestJS con Prisma
- **Frontend**: React con Nginx

## Variables de Entorno Necesarias

Las siguientes variables serán configuradas automáticamente:

```
# Database
DATABASE_URL
REDIS_URL

# APIs Externas (deberás proporcionar)
NEWS_API_KEY
ALPHAVANTAGE_KEY
IEX_CLOUD_KEY

# Configuración
NODE_ENV=production
PORT=3000
```

## Importante

- Railway ofrece $5 USD de créditos gratis al mes
- Para proyectos en producción, considera actualizar a un plan de pago
- Los logs y métricas están disponibles en el dashboard de Railway