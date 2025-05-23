import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { TechnicalAnalysisService } from './technical-analysis.service';
import { TickerModule } from '../ticker/ticker.module';

@Module({
  imports: [TickerModule],
  controllers: [MarketController],
  providers: [MarketService, TechnicalAnalysisService],
  exports: [MarketService, TechnicalAnalysisService],
})
export class MarketModule {}