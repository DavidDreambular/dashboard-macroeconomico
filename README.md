# Dashboard de Análisis Macroeconómico

Sistema semiautomático para análisis macroeconómico con ingesta de datos, análisis técnico/fundamental y generación de señales de trading.

## Stack Tecnológico

- **Backend**: NestJS + Prisma + PostgreSQL + Redis
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Infraestructura**: Railway
- **Automatización**: n8n workflows
- **CI/CD**: GitHub Actions

## Estructura del Proyecto

```
/infra          - Configuración de Railway
/services/api   - Backend API (NestJS)
/web           - Frontend (React)
/config        - Configuraciones compartidas
/tests         - Tests de integración y unitarios
/docs          - Documentación del proyecto
```

## Setup Rápido

1. Clonar el repositorio:
```bash
git clone https://github.com/DavidDreambular/dashboard-macroeconomico.git
cd dashboard-macro
```

2. Configurar variables de entorno:
```bash
cp config/.env.example config/.env
# Editar .env con tus credenciales
```

3. Desarrollo local:
```bash
# Backend
cd services/api
npm install
npm run dev

# Frontend
cd web
npm install
npm run dev
```

## Documentación

- [Plan de Implementación](./docs/plan-implementacion.md)
- [Arquitectura](./docs/architecture.md)
- [API Documentation](./services/api/README.md)
- [Frontend Guide](./web/README.md)

## License

MIT