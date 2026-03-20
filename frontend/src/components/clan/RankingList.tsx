'use client';

import { useState } from 'react';
import { Medal } from 'lucide-react';
import type { RankingEntry } from '@/types';
import { Card, ScoreBar } from '@/components/ui';
import { RoleBadge, StatusBadge } from './Badges';
import { MemberModal } from './MemberModal';
import { cn, formatNumber } from '@/lib/utils';
import type { MemberStats } from '@/types';

interface Props {
  ranking: RankingEntry[];
  members: MemberStats[];
}

const MEDAL_COLORS = ['text-champion', 'text-slate-300', 'text-amber-600'];
const MEDAL_BG = ['bg-champion/10 border-champion/20', 'bg-slate-400/10 border-slate-400/20', 'bg-amber-600/10 border-amber-600/20'];

export function RankingList({ ranking, members }: Props) {
  const [selected, setSelected] = useState<MemberStats | null>(null);

  function openMember(tag: string) {
    const found = members.find((m) => m.tag === tag);
    if (found) setSelected(found);
  }

  return (
    <>
      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}
      <div className="space-y-2">
        {ranking.map((entry) => {
          const isTop = entry.position <= 3;
          const medalColor = MEDAL_COLORS[entry.position - 1];
          const medalBg = MEDAL_BG[entry.position - 1];

          return (
            <Card
              key={entry.tag}
              onClick={() => openMember(entry.tag)}
              className={cn(
                'px-4 py-3 cursor-pointer hover:border-border-light transition-all duration-150',
                entry.isHighlight && entry.position > 3 && 'border-champion/15',
                isTop && 'glow-border'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Position */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm border',
                    isTop ? cn(medalBg, medalColor) : 'bg-surface-2 border-border text-slate-500'
                  )}
                >
                  {isTop ? <Medal className="w-4 h-4" /> : entry.position}
                </div>

                {/* Name & role */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-white truncate">{entry.name}</span>
                    {isTop && (
                      <span className={cn('text-xs font-bold', medalColor)}>
                        {entry.position === 1 ? '🥇' : entry.position === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <RoleBadge role={entry.role} />
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden sm:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Doações</p>
                    <p className="font-semibold text-white">{entry.donations}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Fama</p>
                    <p className="font-semibold text-white">{formatNumber(entry.warFame)}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="w-32 flex-shrink-0">
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge status={entry.activityStatus} />
                    <span className="text-xs font-bold text-slate-300">{entry.collaborationScore}</span>
                  </div>
                  <ScoreBar score={entry.collaborationScore} showLabel={false} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
