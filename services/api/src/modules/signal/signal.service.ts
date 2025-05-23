import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Signal, SignalType } from '@prisma/client';

export interface CreateSignalDto {
  tickerId?: string;
  type: SignalType;
  strength: number;
  reason: string;
  indicators: any;
  price?: number;
  targetPrice?: number;
  stopLoss?: number;
}

@Injectable()
export class SignalService {
  private readonly logger = new Logger(SignalService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSignalDto): Promise<Signal> {
    return this.prisma.signal.create({
      data: {
        ...data,
        active: true,
      },
    });
  }

  async getActiveSignals(): Promise<Signal[]> {
    return this.prisma.signal.findMany({
      where: { active: true },
      include: { ticker: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSignalsByType(type: SignalType): Promise<Signal[]> {
    return this.prisma.signal.findMany({
      where: { type, active: true },
      include: { ticker: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deactivateSignal(id: string): Promise<Signal> {
    return this.prisma.signal.update({
      where: { id },
      data: { active: false },
    });
  }
}