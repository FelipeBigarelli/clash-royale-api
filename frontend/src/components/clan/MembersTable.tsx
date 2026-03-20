'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { MemberStats, MemberRole } from '@/types';
import { Card, ScoreBar, EmptyState } from '@/components/ui';
import { RoleBadge, StatusBadge, WarBadge } from './Badges';
import { MemberModal } from './MemberModal';
import { cn, formatNumber } from '@/lib/utils';

type SortKey = 'name' | 'role' | 'donations' | 'collaborationScore' | 'war.fame' | 'trophies';
type FilterKey = 'all' | 'war' | 'noWar' | 'top' | 'low' | MemberRole;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'war', label: '⚔️ Na guerra' },
  { key: 'noWar', label: '💤 Ausentes' },
  { key: 'top', label: '🏆 Top' },
  { key: 'low', label: '⚠️ Baixo' },
  { key: 'leader', label: 'Líderes' },
  { key: 'elder', label: 'Anciões' },
];

function SortIcon({ col, active, dir }: { col: string; active: string; dir: 'asc' | 'desc' }) {
  if (col !== active) return <ChevronsUpDown className="w-3 h-3 text-slate-600" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-primary" />
    : <ChevronDown className="w-3 h-3 text-primary" />;
}

interface Props {
  members: MemberStats[];
}

export function MembersTable({ members }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [sortKey, setSortKey] = useState<SortKey>('collaborationScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<MemberStats | null>(null);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const filtered = useMemo(() => {
    let list = [...members];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q));
    }

    switch (filter) {
      case 'war': list = list.filter((m) => m.war.participated); break;
      case 'noWar': list = list.filter((m) => !m.war.participated); break;
      case 'top': list = list.filter((m) => m.activityStatus === 'champion' || m.activityStatus === 'active'); break;
      case 'low': list = list.filter((m) => m.activityStatus === 'low' || m.activityStatus === 'inactive'); break;
      case 'leader': list = list.filter((m) => m.role === 'leader' || m.role === 'coLeader'); break;
      case 'elder': list = list.filter((m) => m.role === 'elder'); break;
    }

    list.sort((a, b) => {
      const aVal = sortKey === 'war.fame' ? a.war.fame : (a as Record<string, unknown>)[sortKey] as number | string;
      const bVal = sortKey === 'war.fame' ? b.war.fame : (b as Record<string, unknown>)[sortKey] as number | string;
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [members, search, filter, sortKey, sortDir]);

  const Th = ({ label, sortable, col }: { label: string; sortable?: SortKey; col?: string }) => (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap',
        sortable && 'cursor-pointer hover:text-slate-300 select-none'
      )}
      onClick={() => sortable && toggleSort(sortable)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortable && <SortIcon col={sortable} active={sortKey} dir={sortDir} />}
      </div>
    </th>
  );

  return (
    <>
      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}

      <Card>
        {/* Controls */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar membro..."
              className="w-full pl-9 pr-3 py-2 bg-surface-2 border border-border rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border',
                  filter === key
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-transparent text-slate-500 border-border hover:border-border-light hover:text-slate-300'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <EmptyState message="Nenhum membro encontrado com esses filtros" />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-2/50">
                  <Th label="#" />
                  <Th label="Nome" sortable="name" />
                  <Th label="Cargo" sortable="role" />
                  <Th label="Troféus" sortable="trophies" />
                  <Th label="Doações" sortable="donations" />
                  <Th label="Fama" sortable="war.fame" />
                  <Th label="Score" sortable="collaborationScore" />
                  <Th label="Status" />
                  <Th label="Guerra" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr
                    key={m.tag}
                    onClick={() => setSelected(m)}
                    className={cn(
                      'border-b border-border/60 cursor-pointer transition-colors duration-100',
                      'hover:bg-surface-2/60',
                      m.isHighlight && 'bg-champion/3'
                    )}
                  >
                    <td className="px-4 py-3 text-slate-500 text-sm w-10">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-sm text-white">{m.name}</div>
                      <div className="text-xs text-slate-600 font-mono">{m.tag}</div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={m.role} />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{formatNumber(m.trophies)}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{m.donations}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{formatNumber(m.war.fame)}</td>
                    <td className="px-4 py-3 w-36">
                      <ScoreBar score={m.collaborationScore} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={m.activityStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <WarBadge participated={m.war.participated} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-slate-600">{filtered.length} membro(s) exibido(s)</p>
        </div>
      </Card>
    </>
  );
}
