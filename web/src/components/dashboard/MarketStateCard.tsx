import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { getMarketStateColor, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function MarketStateCard() {
  const { data: marketState, loading, error } = useApi(
    () => apiService.getMarketState(),
    []
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !marketState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estado del Mercado</CardTitle>
          <CardDescription>Error al cargar datos</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getTrendIcon = () => {
    switch (marketState.trend) {
      case 'UP':
        return <TrendingUp className="w-5 h-5" />;
      case 'DOWN':
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Estado del Mercado
          <Badge 
            variant={marketState.state === 'BULL' ? 'success' : marketState.state === 'BEAR' ? 'destructive' : 'warning'}
          >
            {marketState.state}
          </Badge>
        </CardTitle>
        <CardDescription>
          Análisis técnico y tendencia actual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTrendIcon()}
              <span className={getMarketStateColor(marketState.state)}>
                Tendencia: {marketState.trend}
              </span>
            </div>
            <Badge variant="outline">
              Volatilidad: {marketState.volatility}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">RSI</p>
              <p className="text-lg font-semibold">
                {marketState.indicators.rsi.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Momentum</p>
              <p className="text-lg font-semibold">
                {formatPercentage(marketState.momentum)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
