import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly newsApiKey: string;
  private readonly newsApiUrl: string;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Use API key from env or fallback
    this.newsApiKey = this.configService.get('apis.newsApi.key') || '24ec2f716d8d41dcb51e9c9ed870ddba';
    this.newsApiUrl = this.configService.get('apis.newsApi.baseUrl') || 'https://newsapi.org/v2';
    
    if (!this.newsApiKey || this.newsApiKey === 'your_newsapi_key_here') {
      this.logger.warn('NewsAPI key not configured, using default');
    }
  }

  async fetchAndSaveNews() {
    try {
      this.logger.log('Fetching news from NewsAPI...');
      
      // Mock data for now if API key is not configured
      if (!this.newsApiKey || this.newsApiKey === 'your_newsapi_key_here') {
        return await this.saveMockNews();
      }

      const response = await fetch(
        `${this.newsApiUrl}/everything?q=macroeconomics OR "federal reserve" OR inflation OR "interest rates"&language=en&sortBy=publishedAt`,
        {
          headers: {
            'X-Api-Key': this.newsApiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      
      // Save news to database
      const savedCount = await this.saveNewsToDb(data.articles);
      this.logger.log(`Saved ${savedCount} news articles`);
      
      return { message: 'News fetched successfully', count: savedCount };
    } catch (error) {
      this.logger.error('Error fetching news:', error);
      return await this.saveMockNews();
    }
  }

  private async saveNewsToDb(articles: any[]) {
    let savedCount = 0;
    
    for (const article of articles) {
      try {
        await this.prisma.news.create({
          data: {
            title: article.title,
            description: article.description || '',
            content: article.content || '',
            url: article.url,
            source: article.source.name,
            publishedAt: new Date(article.publishedAt),
            sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
            relevance: this.calculateRelevance(article),
            tags: this.extractTags(article),
          },
        });
        savedCount++;
      } catch (error) {
        // Skip duplicates
        if (error.code !== 'P2002') {
          this.logger.error('Error saving article:', error);
        }
      }
    }
    
    return savedCount;
  }

  private async saveMockNews() {
    const mockArticles = [
      {
        title: 'Federal Reserve Signals Potential Rate Changes',
        description: 'The Federal Reserve indicated possible adjustments to interest rates in the coming months.',
        url: 'https://example.com/fed-rates',
        source: { name: 'Financial Times' },
        publishedAt: new Date().toISOString(),
      },
      {
        title: 'Inflation Data Shows Mixed Signals',
        description: 'Latest CPI data reveals complex inflation dynamics across different sectors.',
        url: 'https://example.com/inflation',
        source: { name: 'Bloomberg' },
        publishedAt: new Date().toISOString(),
      },
    ];

    const savedCount = await this.saveNewsToDb(mockArticles);
    return { message: 'Mock news saved', count: savedCount };
  }

  private analyzeSentiment(text: string): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    const positiveWords = ['growth', 'increase', 'improve', 'gain', 'rise', 'boost'];
    const negativeWords = ['decline', 'fall', 'drop', 'decrease', 'loss', 'recession'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'POSITIVE';
    if (negativeCount > positiveCount) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  private calculateRelevance(article: any): number {
    const keywords = ['federal reserve', 'inflation', 'interest rates', 'gdp', 'unemployment'];
    const text = `${article.title} ${article.description}`.toLowerCase();
    
    const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
    return Math.min(matchCount / keywords.length, 1);
  }

  private extractTags(article: any): string[] {
    const text = `${article.title} ${article.description}`.toLowerCase();
    const tags = [];
    
    if (text.includes('federal reserve') || text.includes('fed')) tags.push('FED');
    if (text.includes('inflation')) tags.push('INFLATION');
    if (text.includes('interest rate')) tags.push('RATES');
    if (text.includes('gdp')) tags.push('GDP');
    if (text.includes('unemployment')) tags.push('EMPLOYMENT');
    
    return tags;
  }

  async getRecentNews(limit: number = 10) {
    return this.prisma.news.findMany({
      take: limit,
      orderBy: { publishedAt: 'desc' },
    });
  }

  @Cron('0 */6 * * *') // Every 6 hours
  async scheduledNewsFetch() {
    if (this.configService.get('scheduler.enabled')) {
      this.logger.log('Running scheduled news fetch...');
      await this.fetchAndSaveNews();
    }
  }
}
