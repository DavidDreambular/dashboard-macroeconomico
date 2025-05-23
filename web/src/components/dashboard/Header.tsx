import React from 'react';
import { usePolling } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

export function Header() {
  const { data: health, loading, error } = usePolling(
    () => apiService.getHealth(),
    60000 // Poll cada minuto
  );

  const getStatusIcon = () => {
    if (loading) return <Activity className="w-4 h-4 animate-pulse" />;
    if (error || health?.status !== 'ok') return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Macroeconómico</h1>
            <p className="text-sm text-muted-foreground">
              Análisis técnico y fundamental del mercado
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sistema:</span>
            {getStatusIcon()}
            <span className={error ? 'text-red-500' : 'text-green-500'}>
              {error ? 'Error' : 'Operativo'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
