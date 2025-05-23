import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MarketService } from './market.service';

@ApiTags('market')
@Controller('state')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  @ApiOperation({ summary: 'Get current market state' })
  async getCurrentState() {
    const state = await this.marketService.getCurrentMarketState();
    if (!state) {
      return {
        state: 'NEUTRAL',
        confidence: 0,
        message: 'No market analysis available yet',
      };
    }
    return state;
  }

  @Get('history')
  @ApiOperation({ summary: 'Get market state history' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 30 })
  async getHistory(@Query('days', new ParseIntPipe({ optional: true })) days = 30) {
    return this.marketService.getMarketHistory(days);
  }

  @Get('market-data')
  @ApiOperation({ summary: 'Get real-time market data for a symbol' })
  @ApiQuery({ name: 'symbol', required: true, type: String, example: 'AAPL' })
  async getMarketData(@Query('symbol') symbol: string) {
    return this.marketService.getMarketData(symbol);
  }

  @Get('quotes')
  @ApiOperation({ summary: 'Get quotes for multiple symbols' })
  @ApiQuery({ name: 'symbols', required: true, type: String, example: 'AAPL,MSFT,GOOGL' })
  async getMultipleQuotes(@Query('symbols') symbols: string) {
    const symbolList = symbols.split(',').map(s => s.trim());
    return this.marketService.getMultipleQuotes(symbolList);
  }
}
