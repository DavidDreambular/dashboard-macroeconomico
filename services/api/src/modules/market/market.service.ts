import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketState, MarketStatus } from '@prisma/client';
import { AlphaVantageService } from './services/alpha-vantage.service';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alphaVantage: AlphaVantageService,
  ) {}

  async getCurrentMarketState(): Promise<MarketStatus | null> {
    return this.prisma.marketStatus.findFirst({
      orderBy: { timestamp: 'desc' },
    });
  }

  async getMarketHistory(days = 30): Promise<MarketStatus[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.prisma.marketStatus.findMany({
      where: {
        timestamp: {
          gte: since,
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async createMarketStatus(
    state: MarketState,
    confidence: number,
    indicators: any,
    summary: string,
  ): Promise<MarketStatus> {
    return this.prisma.marketStatus.create({
      data: {
        state,
        confidence,
        indicators,
        summary,
      },
    });
  }

  async getMarketData(symbol: string) {
    try {
      const quote = await this.alphaVantage.getQuote(symbol);
      const timeSeries = await this.alphaVantage.getTimeSeries(symbol);
      
      return {
        quote,
        timeSeries: timeSeries.slice(0, 10), // Last 10 data points
      };
    } catch (error) {
      this.logger.error(`Error fetching market data for ${symbol}:`, error);
      throw error;
    }
  }

  async getMultipleQuotes(symbols: string[]) {
    const quotes = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          return await this.alphaVantage.getQuote(symbol);
        } catch (error) {
          this.logger.error(`Error fetching quote for ${symbol}:`, error);
          return null;
        }
      })
    );
    
    return quotes.filter(quote => quote !== null);
  }
}
