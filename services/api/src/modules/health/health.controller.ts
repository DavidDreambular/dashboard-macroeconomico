import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
    };
  }
  
  @Get('ready')
  ready() {
    // TODO: Check database connection
    // TODO: Check Redis connection
    // TODO: Check external APIs
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      services: {
        database: 'ok',
        redis: 'ok',
        externalApis: 'ok',
      },
    };
  }
}