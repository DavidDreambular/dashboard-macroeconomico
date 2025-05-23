import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MarketState } from '@/types';
import { formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TechnicalIndicatorsProps {
  marketState: MarketState | null;
  loading?: boolean;
}

export function TechnicalIndicators({ marketState, loading }: TechnicalIndicatorsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Técnicos</CardTitle>
          <CardDescription>Análisis técnico del mercado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketState) {
    return null;
  }

  const indicators = [
    {
      name: 'RSI',
      value: marketState.indicators.rsi,
      signal: marketState.indicators.rsi > 70 ? 'SELL' : 
              marketState.indicators.rsi < 30 ? 'BUY' : 'NEUTRAL',
      description: marketState.indicators.rsi > 70 ? 'Sobrecomprado' : 
                   marketState.indicators.rsi < 30 ? 'Sobrevendido' : 'Neutral'
    },
    {
      name: 'SMA 20',
      value: marketState.indicators.sma20,
      signal: 'NEUTRAL',
      description: 'Media móvil 20 períodos'
    },
    {
      name: 'SMA 50',
      value: marketState.indicators.sma50,
      signal: marketState.indicators.sma20 > marketState.indicators.sma50 ? 'BUY' : 'SELL',
      description: 'Media móvil 50 períodos'
    },
    {
      name: 'MACD',
      value: marketState.indicators.macd.macd,
      signal: marketState.indicators.macd.histogram > 0 ? 'BUY' : 'SELL',
      description: `Histograma: ${marketState.indicators.macd.histogram.toFixed(2)}`
    }
  ];

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'SELL':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicadores Técnicos</CardTitle>
        <CardDescription>Análisis técnico del mercado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {indicators.map((indicator) => (
            <div key={indicator.name} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{indicator.name}</span>
                {getSignalIcon(indicator.signal)}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {indicator.value.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {indicator.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
