import React from 'react';
import { 
  Header, 
  MarketStateCard, 
  SignalsTable, 
  NewsList, 
  TechnicalIndicators 
} from '@/components/dashboard';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/api';

function App() {
  const { data: marketState, loading: marketLoading } = useApi(
    () => apiService.getMarketState(),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Primera fila - Estado del mercado e indicadores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketStateCard />
            <TechnicalIndicators 
              marketState={marketState} 
              loading={marketLoading} 
            />
          </div>

          {/* Segunda fila - Señales de trading */}
          <SignalsTable />

          {/* Tercera fila - Noticias */}
          <NewsList />
        </div>
      </main>
    </div>
  );
}

export default App;
