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
}