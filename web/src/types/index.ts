// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Market State Types
export interface MarketState {
  id: string;
  state: 'BULL' | 'BEAR' | 'NEUTRAL' | 'VOLATILE';
  trend: 'UP' | 'DOWN' | 'SIDEWAYS';
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  momentum: number;
  timestamp: string;
  indicators: {
    rsi: number;
    sma20: number;
    sma50: number;
    macd: {
      macd: number;
      signal: number;
      histogram: number;
    };
  };
}

// News Types
export interface News {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment?: number; // -1 to 1
  keywords?: string[];
  category?: string;
  processed?: boolean;
}

// Ticker Types
export interface Ticker {
  id: string;
  symbol: string;
  name: string;
  type: 'STOCK' | 'INDEX' | 'COMMODITY' | 'CURRENCY' | 'CRYPTO';
  exchange?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Signal Types
export interface Signal {
  id: string;
  tickerId: string;
  ticker?: Ticker;
  type: 'BUY' | 'SELL' | 'HOLD';
  strength: 'STRONG' | 'MEDIUM' | 'WEAK';
  confidence: number;
  price: number;
  targetPrice?: number;
  stopLoss?: number;
  reason: string;
  indicators: {
    technical?: string[];
    fundamental?: string[];
    sentiment?: string[];
  };
  isActive: boolean;
  timestamp: string;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal?: 'BUY' | 'SELL' | 'NEUTRAL';
  description?: string;
}

// Health Check Types
export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
  environment: string;
  version?: string;
  memory?: {
    used: number;
    total: number;
  };
  services?: {
    database: boolean;
    redis: boolean;
    external_apis: boolean;
  };
  apiKeys?: {
    newsApi: string;
    alphaVantage: string;
  };
}
