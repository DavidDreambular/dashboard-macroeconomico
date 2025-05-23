import { Controller, Get, Query, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NewsService } from './news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent news' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async getNews(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.newsService.getRecentNews(limit);
  }

  @Post('fetch')
  @ApiOperation({ summary: 'Fetch new news from external API' })
  async fetchNews() {
    return this.newsService.fetchAndSaveNews();
  }
}