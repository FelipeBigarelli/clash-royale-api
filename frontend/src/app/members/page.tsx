'use client';

import { Users } from 'lucide-react';
import { useMembers } from '@/hooks/useClanData';
import { MembersTable } from '@/components/clan/MembersTable';
import { ErrorState, RowSkeleton } from '@/components/ui';

export default function MembersPage() {
  const { data: members, loading, error } = useMembers();

  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Membros do Clã</h1>
          <p className="text-sm text-slate-500">
            Tabela completa com busca, filtros e ordenação
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : members ? (
        <MembersTable members={members} />
      ) : null}
    </div>
  );
}
