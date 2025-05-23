import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Ticker, Prisma } from '@prisma/client';

export interface CreateTickerDto {
  symbol: string;
  name: string;
  sector?: string;
  active?: boolean;
}

export interface UpdateTickerDto {
  name?: string;
  sector?: string;
  active?: boolean;
}

@Injectable()
export class TickerService {
  private readonly logger = new Logger(TickerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTickerDto): Promise<Ticker> {
    return this.prisma.ticker.create({
      data: {
        symbol: data.symbol.toUpperCase(),
        name: data.name,
        sector: data.sector,
        active: data.active ?? true,
      },
    });
  }

  async findAll(active?: boolean): Promise<Ticker[]> {
    const where: Prisma.TickerWhereInput = {};
    if (active !== undefined) {
      where.active = active;
    }

    return this.prisma.ticker.findMany({
      where,
      orderBy: { symbol: 'asc' },
    });
  }

  async findOne(id: string): Promise<Ticker> {
    const ticker = await this.prisma.ticker.findUnique({
      where: { id },
    });
    if (!ticker) {
      throw new NotFoundException(`Ticker with ID ${id} not found`);
    }

    return ticker;
  }

  async findBySymbol(symbol: string): Promise<Ticker | null> {
    return this.prisma.ticker.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });
  }

  async update(id: string, data: UpdateTickerDto): Promise<Ticker> {
    await this.findOne(id); // Check if exists

    return this.prisma.ticker.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Ticker> {
    await this.findOne(id); // Check if exists

    return this.prisma.ticker.delete({
      where: { id },
    });
  }

  async seedDefaultTickers(): Promise<void> {
    const defaultTickers = [
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF', sector: 'ETF' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust', sector: 'ETF' },
      { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', sector: 'ETF' },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', sector: 'ETF' },
      { symbol: 'GLD', name: 'SPDR Gold Shares', sector: 'Commodity' },
      { symbol: 'TLT', name: 'iShares 20+ Year Treasury Bond ETF', sector: 'Bond' },
    ];

    for (const ticker of defaultTickers) {
      const existing = await this.findBySymbol(ticker.symbol);
      if (!existing) {
        await this.create(ticker);
        this.logger.log(`Created ticker: ${ticker.symbol}`);
      }
    }
  }
}