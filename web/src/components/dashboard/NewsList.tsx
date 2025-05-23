import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { News } from '@/types';

export function NewsList() {
  const { data: response, loading, error } = useApi(
    () => apiService.getNews({ limit: 5 }),
    []
  );

  const news = response?.data || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimas Noticias</CardTitle>
          <CardDescription>Noticias macroeconómicas relevantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
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
          <CardTitle>Últimas Noticias</CardTitle>
          <CardDescription>Error al cargar noticias</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getSentimentBadge = (sentiment?: number) => {
    if (sentiment === undefined || sentiment === null) return null;
    
    let label: string;
    let variant: 'success' | 'destructive' | 'secondary';
    
    if (sentiment > 0.3) {
      label = 'POSITIVE';
      variant = 'success';
    } else if (sentiment < -0.3) {
      label = 'NEGATIVE';
      variant = 'destructive';
    } else {
      label = 'NEUTRAL';
      variant = 'secondary';
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Noticias</CardTitle>
        <CardDescription>
          {news.length} noticias macroeconómicas recientes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay noticias disponibles
            </p>
          ) : (
            news.map((item: News) => (
              <article key={item.id} className="border-b pb-4 last:border-0">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-tight flex-1">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline flex items-start gap-1"
                      >
                        {item.title}
                        <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0" />
                      </a>
                    </h3>
                    {getSentimentBadge(item.sentiment)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{item.source}</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
