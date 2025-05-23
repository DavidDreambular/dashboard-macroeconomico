export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL,
  },
  
  redis: {
    url: process.env.REDIS_URL,
  },
  
  cors: {
    origins: process.env.CORS_ORIGINS || 'http://localhost:5173',
  },
  
  apis: {
    newsApi: {
      key: process.env.NEWS_API_KEY,
      baseUrl: 'https://newsapi.org/v2',
    },
    alphaVantage: {
      key: process.env.ALPHAVANTAGE_KEY,
      baseUrl: 'https://www.alphavantage.co/query',
    },
    iex: {
      key: process.env.IEX_CLOUD_KEY,
      sandbox: process.env.IEX_SANDBOX === 'true',
      baseUrl: process.env.IEX_SANDBOX === 'true' 
        ? 'https://sandbox.iexapis.com/stable'
        : 'https://cloud.iexapis.com/stable',
    },
  },
  
  scheduler: {
    enabled: process.env.ENABLE_SCHEDULER !== 'false',
    cronDaily: process.env.CRON_DAILY || '0 8 * * *',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
});