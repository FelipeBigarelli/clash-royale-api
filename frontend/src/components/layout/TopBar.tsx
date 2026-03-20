'use client';

import { useState } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { api } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function TopBar() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const overview = await api.refresh();
      setLastUpdated(overview.lastUpdated);
      // Reload page data
      window.location.reload();
    } catch {
      // silent fail – page keeps existing data
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2">
        {lastUpdated && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Atualizado: {formatDate(lastUpdated)}</span>
          </div>
        )}
      </div>

      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
          'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
          refreshing && 'opacity-60 cursor-not-allowed'
        )}
      >
        <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
        {refreshing ? 'Atualizando...' : 'Atualizar dados'}
      </button>
    </header>
  );
}
