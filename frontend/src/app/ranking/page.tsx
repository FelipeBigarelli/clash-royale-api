'use client';

import { Trophy } from 'lucide-react';
import { useRanking, useMembers } from '@/hooks/useClanData';
import { RankingList } from '@/components/clan/RankingList';
import { ErrorState, RowSkeleton } from '@/components/ui';

export default function RankingPage() {
  const { data: ranking, loading: loadingR, error: errorR } = useRanking();
  const { data: members, loading: loadingM } = useMembers();

  if (errorR) return <ErrorState message={errorR} />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-champion/10 border border-champion/20 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-champion" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Ranking de Colaboração</h1>
          <p className="text-sm text-slate-500">
            Classificação dos membros por score de contribuição
          </p>
        </div>
      </div>

      {loadingR || loadingM ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : ranking && members ? (
        <RankingList ranking={ranking} members={members} />
      ) : null}
    </div>
  );
}
