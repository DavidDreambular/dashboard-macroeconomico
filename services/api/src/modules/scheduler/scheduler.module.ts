import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { NewsModule } from '../news/news.module';
import { MarketModule } from '../market/market.module';
import { SignalModule } from '../signal/signal.module';

@Module({
  imports: [NewsModule, MarketModule, SignalModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}