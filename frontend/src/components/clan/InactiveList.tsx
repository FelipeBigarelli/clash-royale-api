'use client';

import { useState } from 'react';
import { AlertTriangle, UserX, ZapOff } from 'lucide-react';
import type { MemberStats } from '@/types';
import { Card, EmptyState } from '@/components/ui';
import { RoleBadge } from './Badges';
import { MemberModal } from './MemberModal';
import { cn } from '@/lib/utils';

interface Props {
  members: MemberStats[];
}

function alertLevel(m: MemberStats): 'red' | 'yellow' {
  if (m.isInactive || (!m.war.participated && m.donations === 0)) return 'red';
  return 'yellow';
}

export function InactiveList({ members }: Props) {
  const [selected, setSelected] = useState<MemberStats | null>(null);

  if (members.length === 0) {
    return <EmptyState message="Nenhum membro ausente ou com baixa colaboração 🎉" />;
  }

  const red = members.filter((m) => alertLevel(m) === 'red');
  const yellow = members.filter((m) => alertLevel(m) === 'yellow');

  return (
    <>
      {selected && <MemberModal member={selected} onClose={() => setSelected(null)} />}

      {red.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
              <UserX className="w-3.5 h-3.5 text-danger" />
            </div>
            <h3 className="text-sm font-semibold text-danger">Inatividade crítica</h3>
            <span className="ml-auto bg-danger/10 text-danger text-xs font-bold px-2 py-0.5 rounded-full border border-danger/20">
              {red.length}
            </span>
          </div>
          <div className="space-y-2">
            {red.map((m) => (
              <MemberCard key={m.tag} member={m} level="red" onClick={() => setSelected(m)} />
            ))}
          </div>
        </div>
      )}

      {yellow.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-warning" />
            </div>
            <h3 className="text-sm font-semibold text-warning">Atenção</h3>
            <span className="ml-auto bg-warning/10 text-warning text-xs font-bold px-2 py-0.5 rounded-full border border-warning/20">
              {yellow.length}
            </span>
          </div>
          <div className="space-y-2">
            {yellow.map((m) => (
              <MemberCard key={m.tag} member={m} level="yellow" onClick={() => setSelected(m)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function MemberCard({
  member,
  level,
  onClick,
}: {
  member: MemberStats;
  level: 'red' | 'yellow';
  onClick: () => void;
}) {
  const isRed = level === 'red';
  const flags: string[] = [];
  if (!member.war.participated) flags.push('Não participou da guerra');
  else if (member.war.decksUsed === 0) flags.push('Entrou mas não atacou');
  if (member.donations === 0) flags.push('Sem doações');
  if (member.isInactive) flags.push('Score muito baixo');

  return (
    <Card
      onClick={onClick}
      className={cn(
        'px-4 py-3 cursor-pointer hover:border-border-light transition-all',
        isRed ? 'border-danger/20 bg-danger/5' : 'border-warning/20 bg-warning/5'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            isRed
              ? 'bg-danger/10 border border-danger/20'
              : 'bg-warning/10 border border-warning/20'
          )}
        >
          <ZapOff className={cn('w-4 h-4', isRed ? 'text-danger' : 'text-warning')} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-white">{member.name}</span>
            <RoleBadge role={member.role} />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {flags.map((f) => (
              <span
                key={f}
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded font-medium',
                  isRed
                    ? 'bg-danger/10 text-danger'
                    : 'bg-warning/10 text-warning'
                )}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-slate-500">Score</p>
          <p className={cn('font-bold text-sm', isRed ? 'text-danger' : 'text-warning')}>
            {member.collaborationScore}
          </p>
        </div>
      </div>
    </Card>
  );
}
