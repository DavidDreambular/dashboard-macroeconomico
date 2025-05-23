import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlphaVantageService {
  private readonly logger = new Logger(AlphaVantageService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('apis.alphaVantage.key') || '7ZMGPQ3OGTIXQXRB';
    this.baseUrl = this.configService.get('apis.alphaVantage.baseUrl') || 'https://www.alphavantage.co/query';
    
    if (!this.apiKey || this.apiKey === 'your_alphavantage_key_here') {
      this.logger.warn('Alpha Vantage API key not configured, using default');
    }
  }

  async getQuote(symbol: string) {
    try {
      const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      if (data['Note']) {
        this.logger.warn('API call frequency limit reached');
        return this.getMockQuote(symbol);
      }

      const quote = data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        return this.getMockQuote(symbol);
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: quote['10. change percent'],
        volume: parseInt(quote['06. volume']),
        latestTradingDay: quote['07. latest trading day'],
        previousClose: parseFloat(quote['08. previous close']),
        open: parseFloat(quote['02. open']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
      };
    } catch (error) {
      this.logger.error(`Error fetching quote for ${symbol}:`, error);
      return this.getMockQuote(symbol);
    }
  }

  async getTimeSeries(symbol: string, interval: string = '5min') {
    try {
      const url = `${this.baseUrl}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&apikey=${this.apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data['Error Message']) {
        throw new Error(data['Error Message']);
      }

      if (data['Note']) {
        this.logger.warn('API call frequency limit reached');
        return this.getMockTimeSeries(symbol);
      }

      const timeSeries = data[`Time Series (${interval})`];
      if (!timeSeries) {
        return this.getMockTimeSeries(symbol);
      }

      return Object.entries(timeSeries).map(([time, values]: [string, any]) => ({
        time,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      }));
    } catch (error) {
      this.logger.error(`Error fetching time series for ${symbol}:`, error);
      return this.getMockTimeSeries(symbol);
    }
  }

  private getMockQuote(symbol: string) {
    const basePrice = symbol === 'AAPL' ? 180 : 100;
    const change = (Math.random() - 0.5) * 5;
    
    return {
      symbol,
      price: basePrice + change,
      change,
      changePercent: `${(change / basePrice * 100).toFixed(2)}%`,
      volume: Math.floor(Math.random() * 10000000),
      latestTradingDay: new Date().toISOString().split('T')[0],
      previousClose: basePrice,
      open: basePrice + (Math.random() - 0.5) * 2,
      high: basePrice + Math.random() * 3,
      low: basePrice - Math.random() * 3,
    };
  }

  private getMockTimeSeries(symbol: string) {
    const now = new Date();
    const series = [];
    const basePrice = symbol === 'AAPL' ? 180 : 100;
    
    for (let i = 0; i < 20; i++) {
      const time = new Date(now.getTime() - i * 5 * 60 * 1000);
      const price = basePrice + (Math.random() - 0.5) * 5;
      
      series.push({
        time: time.toISOString(),
        open: price + (Math.random() - 0.5),
        high: price + Math.random() * 2,
        low: price - Math.random() * 2,
        close: price + (Math.random() - 0.5),
        volume: Math.floor(Math.random() * 1000000),
      });
    }
    
    return series;
  }
}
