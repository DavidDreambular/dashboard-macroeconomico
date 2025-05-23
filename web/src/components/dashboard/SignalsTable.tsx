import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { formatCurrency, formatPercentage, formatDate, getSignalColor } from '@/lib/utils';
import { Signal } from '@/types';

export function SignalsTable() {
  const { data: response, loading, error } = useApi(
    () => apiService.getSignals({ isActive: true, limit: 10 }),
    []
  );

  const signals = response?.data || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Señales Activas</CardTitle>
          <CardDescription>Últimas señales de trading generadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Señales Activas</CardTitle>
          <CardDescription>Error al cargar señales</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Señales Activas</CardTitle>
        <CardDescription>
          {signals.length} señales activas encontradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {signals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay señales activas en este momento
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Símbolo</th>
                    <th className="text-left py-2">Tipo</th>
                    <th className="text-right py-2">Precio</th>
                    <th className="text-right py-2">Target</th>
                    <th className="text-right py-2">Confianza</th>
                    <th className="text-left py-2">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal: Signal) => (
                    <tr key={signal.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div className="font-medium">
                          {signal.ticker?.symbol || 'N/A'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {signal.ticker?.name}
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={getSignalColor(signal.type)}>
                          {signal.type}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        {formatCurrency(signal.price)}
                      </td>
                      <td className="py-3 text-right">
                        {signal.targetPrice ? formatCurrency(signal.targetPrice) : '-'}
                      </td>
                      <td className="py-3 text-right">
                        <Badge variant={signal.confidence > 0.7 ? 'success' : 'warning'}>
                          {(signal.confidence * 100).toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {formatDate(signal.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
