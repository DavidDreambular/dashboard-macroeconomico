// API Service for all backend communications
import { 
  ApiResponse, 
  MarketState, 
  News, 
  Ticker, 
  Signal, 
  HealthStatus 
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string, 
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health Check
  async getHealth(): Promise<HealthStatus> {
    return this.request<HealthStatus>('/health');
  }

  // Market State
  async getMarketState(): Promise<MarketState> {
    return this.request<MarketState>('/state');
  }

  async getMarketStateHistory(
    params?: { limit?: number; offset?: number }
  ): Promise<ApiResponse<MarketState[]>> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<ApiResponse<MarketState[]>>(
      `/state/history${query ? `?${query}` : ''}`
    );
  }

  // News
  async getNews(
    params?: { limit?: number; offset?: number; search?: string }
  ): Promise<ApiResponse<News[]>> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<ApiResponse<News[]>>(
      `/news${query ? `?${query}` : ''}`
    );
  }

  async fetchLatestNews(): Promise<{ message: string; count: number }> {
    return this.request('/news/fetch', { method: 'POST' });
  }

  // Tickers
  async getTickers(
    params?: { type?: string; isActive?: boolean }
  ): Promise<ApiResponse<Ticker[]>> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<ApiResponse<Ticker[]>>(
      `/tickers${query ? `?${query}` : ''}`
    );
  }

  async seedTickers(): Promise<{ message: string; count: number }> {
    return this.request('/tickers/seed', { method: 'POST' });
  }

  // Signals
  async getSignals(
    params?: { 
      tickerId?: string; 
      type?: string; 
      isActive?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<ApiResponse<Signal[]>> {
    const query = new URLSearchParams(params as any).toString();
    return this.request<ApiResponse<Signal[]>>(
      `/signals${query ? `?${query}` : ''}`
    );
  }
}

export const apiService = new ApiService();
