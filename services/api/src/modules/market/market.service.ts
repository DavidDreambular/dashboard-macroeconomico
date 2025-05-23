import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketState, MarketStatus } from '@prisma/client';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(private readonly prisma: PrismaService) {}

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
}