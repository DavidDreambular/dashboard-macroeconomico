import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TickerService, CreateTickerDto, UpdateTickerDto } from './ticker.service';

@ApiTags('tickers')
@Controller('tickers')
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticker' })
  create(@Body() createTickerDto: CreateTickerDto) {
    return this.tickerService.create(createTickerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickers' })
  @ApiQuery({ name: 'active', required: false, type: Boolean })
  findAll(@Query('active', new ParseBoolPipe({ optional: true })) active?: boolean) {
    return this.tickerService.findAll(active);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticker by ID' })
  findOne(@Param('id') id: string) {
    return this.tickerService.findOne(id);
  }

  @Get('symbol/:symbol')
  @ApiOperation({ summary: 'Get ticker by symbol' })
  findBySymbol(@Param('symbol') symbol: string) {
    return this.tickerService.findBySymbol(symbol);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ticker' })
  update(@Param('id') id: string, @Body() updateTickerDto: UpdateTickerDto) {
    return this.tickerService.update(id, updateTickerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ticker' })
  remove(@Param('id') id: string) {
    return this.tickerService.remove(id);
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed default tickers' })
  async seed() {
    await this.tickerService.seedDefaultTickers();
    return { message: 'Default tickers seeded successfully' };
  }
}