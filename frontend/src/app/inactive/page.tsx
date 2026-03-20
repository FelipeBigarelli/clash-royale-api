'use client';

import { AlertTriangle } from 'lucide-react';
import { useInactive, useOverview } from '@/hooks/useClanData';
import { InactiveList } from '@/components/clan/InactiveList';
import { Card, ErrorState, RowSkeleton } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function InactivePage() {
  const { data: inactive, loading, error } = useInactive();
  const { data: overview } = useOverview();

  if (error) return <ErrorState message={error} />;

  const total = overview?.memberCount ?? 0;
  const absentCount = inactive?.length ?? 0;
  const pct = total > 0 ? Math.round((absentCount / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-danger" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Ausentes & Baixa Colaboração</h1>
          <p className="text-sm text-slate-500">
            Membros que precisam de atenção do líder
          </p>
        </div>
      </div>

      {/* Summary bar */}
      {overview && !loading && (
        <Card className="p-4 mb-6 flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-sm text-slate-400">
              <span className="font-bold text-white">{absentCount}</span> membros com baixa colaboração
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm text-slate-400">
              <span className="font-bold text-white">{total - absentCount}</span> colaborando bem
            </span>
          </div>
          {/* Progress bar */}
          <div className="flex-1 min-w-40">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Ausentes</span>
              <span>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  pct >= 40 ? 'bg-danger' : pct >= 20 ? 'bg-warning' : 'bg-success'
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : inactive ? (
        <InactiveList members={inactive} />
      ) : null}
    </div>
  );
}
