import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
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

  @Get('fetch')
  @ApiOperation({ summary: 'Fetch new news from external API' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  async fetchNews(@Query('page', new ParseIntPipe({ optional: true })) page = 1) {
    const news = await this.newsService.fetchMacroNews(page);
    return {
      count: news.length,
      message: `Fetched ${news.length} news articles`,
    };
  }

  @Get('unprocessed')
  @ApiOperation({ summary: 'Get unprocessed news for analysis' })
  async getUnprocessedNews() {
    return this.newsService.getUnprocessedNews();
  }
}