import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
// import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { NewsModule } from './modules/news/news.module';
import { MarketModule } from './modules/market/market.module';
import { SignalModule } from './modules/signal/signal.module';
import { TickerModule } from './modules/ticker/ticker.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
// import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    
    // Cache with Redis - Commented temporarily for build
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: redisStore,
    //     url: configService.get('REDIS_URL'),
    //     ttl: 600, // 10 minutes default
    //   }),
    //   inject: [ConfigService],
    // }),
    
    // Scheduler
    ScheduleModule.forRoot(),
    
    // Core modules
    PrismaModule,
    HealthModule,
    
    // Feature modules
    NewsModule,
    MarketModule,
    SignalModule,
    TickerModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}