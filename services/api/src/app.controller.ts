import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getInfo() {
    return {
      name: 'Dashboard Macroeconómico API',
      version: '1.0.0',
      description: 'API para análisis macroeconómico y señales de trading',
      endpoints: {
        docs: '/api/docs',
        health: '/api/health',
        state: '/api/state',
        signals: '/api/signals',
        news: '/api/news',
        fundamentals: '/api/fundamentals',
        technical: '/api/technical',
      },
    };
  }
}