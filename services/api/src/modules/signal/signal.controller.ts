import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SignalService, CreateSignalDto } from './signal.service';
import { SignalType } from '@prisma/client';

@ApiTags('signals')
@Controller('signals')
export class SignalController {
  constructor(private readonly signalService: SignalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new signal' })
  create(@Body() createSignalDto: CreateSignalDto) {
    return this.signalService.create(createSignalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active signals' })
  getActiveSignals() {
    return this.signalService.getActiveSignals();
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get signals by type' })
  getByType(@Param('type') type: SignalType) {
    return this.signalService.getSignalsByType(type);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a signal' })
  deactivate(@Param('id') id: string) {
    return this.signalService.deactivateSignal(id);
  }
}