import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { News } from '@prisma/client';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly apiKey: string;
  private readonly keywords = [
    'fed', 'inflation', 'gdp', 'unemployment', 
    'interest rates', 'monetary policy'
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get('NEWS_API_KEY', '');
  }

  async fetchMacroNews(page = 1): Promise<News[]> {
    if (!this.apiKey) {
      this.logger.warn('NEWS_API_KEY not configured');
      return [];
    }

    try {
      const query = this.keywords.join(' OR ');
      const url = `https://newsapi.org/v2/everything`;
      
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            q: query,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 100,
            page,
            apiKey: this.apiKey,
          },
        }),
      );

      const articles = response.data.articles || [];
      const newsPromises = articles.map(article => this.processArticle(article));
      return Promise.all(newsPromises);    } catch (error) {
      this.logger.error('Error fetching news:', error);
      return [];
    }
  }

  private async processArticle(article: any): Promise<News> {
    const existingNews = await this.prisma.news.findFirst({
      where: { url: article.url },
    });

    if (existingNews) {
      return existingNews;
    }

    return this.prisma.news.create({
      data: {
        title: article.title || 'No title',
        description: article.description || '',
        content: article.content || article.description || '',
        source: article.source?.name || 'Unknown',
        url: article.url,
        publishedAt: new Date(article.publishedAt),
        keywords: this.extractKeywords(article.title + ' ' + article.description),
        sentiment: null, // TODO: Implement sentiment analysis
        category: 'macro',
        processed: false,
      },
    });
  }

  private extractKeywords(text: string): string[] {
    const lowerText = text.toLowerCase();
    return this.keywords.filter(keyword => lowerText.includes(keyword));
  }

  async getRecentNews(limit = 20): Promise<News[]> {
    return this.prisma.news.findMany({
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async getUnprocessedNews(): Promise<News[]> {
    return this.prisma.news.findMany({
      where: { processed: false },
      orderBy: { publishedAt: 'desc' },
    });
  }
}