import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { TechnicalAnalysisService } from './technical-analysis.service';
import { AlphaVantageService } from './services/alpha-vantage.service';
import { TickerModule } from '../ticker/ticker.module';

@Module({
  imports: [TickerModule],
  controllers: [MarketController],
  providers: [MarketService, TechnicalAnalysisService, AlphaVantageService],
  exports: [MarketService, TechnicalAnalysisService, AlphaVantageService],
})
export class MarketModule {}