import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

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
      apiKeys: {
        newsApi: process.env.NEWS_API_KEY ? 'configured' : 'missing',
        alphaVantage: process.env.ALPHAVANTAGE_KEY ? 'configured' : 'missing',
      },
    };
  }
  
  @Get('ready')
  async ready() {
    const services: any = {
      database: 'unknown',
      redis: 'unknown',
      externalApis: 'ok',
    };

    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      services.database = 'ok';
    } catch (error) {
      services.database = 'error';
    }

    // TODO: Check Redis connection when Redis service is added
    services.redis = 'not-implemented';

    return {
      status: services.database === 'ok' ? 'ready' : 'not-ready',
      timestamp: new Date().toISOString(),
      services,
    };
  }
}
