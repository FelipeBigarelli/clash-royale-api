'use client';

import {
  Users,
  Trophy,
  Gift,
  Sword,
  UserX,
  UserCheck,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useOverview, useMembers } from '@/hooks/useClanData';
import { StatCard } from '@/components/clan/StatCard';
import { ClanHeader } from '@/components/clan/ClanHeader';
import { MembersTable } from '@/components/clan/MembersTable';
import { CardSkeleton, ErrorState } from '@/components/ui';
import { formatNumber } from '@/lib/utils';

export default function DashboardPage() {
  const { data: overview, loading: loadingOv, error: errorOv } = useOverview();
  const { data: members, loading: loadingM, error: errorM } = useMembers();

  const loading = loadingOv || loadingM;
  const error = errorOv || errorM;

  if (error) return <ErrorState message={error} />;

  return (
    <div>
      {/* Clan Header */}
      {overview ? (
        <ClanHeader overview={overview} />
      ) : (
        <div className="h-24 mb-8 shimmer rounded-xl" />
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
        ) : overview ? (
          <>
            <StatCard
              label="Membros"
              value={overview.memberCount}
              icon={Users}
              iconColor="text-primary"
            />
            <StatCard
              label="Troféus do clã"
              value={formatNumber(overview.clanScore)}
              icon={Trophy}
              iconColor="text-champion"
            />
            <StatCard
              label="Participaram da guerra"
              value={overview.warParticipants}
              sub={`de ${overview.memberCount} membros`}
              icon={UserCheck}
              iconColor="text-success"
            />
            <StatCard
              label="Ausentes na guerra"
              value={overview.warAbsents}
              icon={UserX}
              iconColor="text-danger"
            />
            <StatCard
              label="Doações / semana"
              value={formatNumber(overview.donationsPerWeek)}
              icon={Gift}
              iconColor="text-accent"
            />
            <StatCard
              label="Média de doações"
              value={overview.avgDonations}
              sub="por membro"
              icon={Target}
              iconColor="text-primary"
            />
            <StatCard
              label="Fama total na guerra"
              value={formatNumber(overview.warTotalFame)}
              icon={Sword}
              iconColor="text-warning"
            />
            <StatCard
              label="Score médio"
              value={overview.avgCollaborationScore}
              sub="de colaboração"
              icon={TrendingUp}
              iconColor="text-success"
            />
          </>
        ) : null}
      </div>

      {/* Members table */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Todos os Membros</h2>
        {members ? (
          <MembersTable members={members} />
        ) : (
          <div className="h-64 shimmer rounded-xl" />
        )}
      </div>
    </div>
  );
}
