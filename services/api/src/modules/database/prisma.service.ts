import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('database.url'),
        },
      },
      log: configService.get('nodeEnv') === 'development' 
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (this.configService.get('nodeEnv') !== 'test') {
      throw new Error('cleanDatabase is only allowed in test environment');
    }

    const models = ['signal', 'technical', 'fundamental', 'news', 'ticker', 'marketStatus'];
    
    for (const model of models) {
      await this[model].deleteMany({});
    }
  }
}