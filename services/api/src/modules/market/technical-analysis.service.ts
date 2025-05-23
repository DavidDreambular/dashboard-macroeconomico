import { Injectable } from '@nestjs/common';

@Injectable()
export class TechnicalAnalysisService {
  calculateSMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;
    
    const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  calculateRSI(prices: number[], period = 14): number | null {
    if (prices.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference > 0) {
        gains += difference;
      } else {
        losses += Math.abs(difference);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } | null {
    if (prices.length < 26) return null;

    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);

    if (!ema12 || !ema26) return null;

    const macd = ema12 - ema26;
    const signal = macd * 0.2; // Simplified signal line
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  private calculateEMA(prices: number[], period: number): number | null {
    if (prices.length < period) return null;

    const multiplier = 2 / (period + 1);
    let ema = this.calculateSMA(prices.slice(0, period), period);

    if (!ema) return null;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  determineTrend(sma20: number, sma50: number): 'bullish' | 'bearish' | 'neutral' {
    if (!sma20 || !sma50) return 'neutral';
    
    const difference = ((sma20 - sma50) / sma50) * 100;
    
    if (difference > 1) return 'bullish';
    if (difference < -1) return 'bearish';
    return 'neutral';
  }
}