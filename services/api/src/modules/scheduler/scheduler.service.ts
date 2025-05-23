import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { NewsService } from '../news/news.service';
import { MarketService } from '../market/market.service';
import { SignalService } from '../signal/signal.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private readonly isEnabled: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly newsService: NewsService,
    private readonly marketService: MarketService,
    private readonly signalService: SignalService,
  ) {
    this.isEnabled = this.configService.get('ENABLE_SCHEDULER', 'false') === 'true';
  }

  @Cron(CronExpression.EVERY_HOUR)
  async fetchNewsTask() {
    if (!this.isEnabled) return;

    this.logger.log('Starting news fetch task...');
    try {
      const news = await this.newsService.fetchMacroNews();
      this.logger.log(`Fetched ${news.length} news articles`);
    } catch (error) {
      this.logger.error('Error in news fetch task:', error);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async analyzeMarketTask() {
    if (!this.isEnabled) return;

    this.logger.log('Starting market analysis task...');
    try {
      // TODO: Implement market analysis
      this.logger.log('Market analysis completed');
    } catch (error) {
      this.logger.error('Error in market analysis task:', error);
    }
  }

  @Cron('0 8 * * *') // Daily at 8 AM
  async dailyAnalysisTask() {
    if (!this.isEnabled) return;

    this.logger.log('Starting daily analysis task...');
    try {
      // TODO: Implement comprehensive daily analysis
      this.logger.log('Daily analysis completed');
    } catch (error) {
      this.logger.error('Error in daily analysis task:', error);
    }
  }
}