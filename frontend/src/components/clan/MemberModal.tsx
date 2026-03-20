'use client';

import { useEffect } from 'react';
import { X, Trophy, Gift, Sword, Anchor, Layers, Star } from 'lucide-react';
import type { MemberStats } from '@/types';
import { Card, ScoreBar } from '@/components/ui';
import { RoleBadge, StatusBadge, WarBadge } from './Badges';
import { cn, formatNumber, scoreGradient } from '@/lib/utils';

interface MemberModalProps {
  member: MemberStats;
  onClose: () => void;
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ElementType }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function interpretScore(member: MemberStats): string {
  const lines: string[] = [];
  if (member.collaborationScore >= 80) lines.push('🏆 Contribuição excepcional');
  else if (member.collaborationScore >= 60) lines.push('✅ Boa contribuição geral');
  else if (member.collaborationScore >= 40) lines.push('🔵 Colaboração regular');
  else lines.push('⚠️ Colaboração baixa');

  if (!member.war.participated) lines.push('❌ Não participou da guerra atual');
  else if (member.war.decksUsed === 0) lines.push('⚠️ Entrou na guerra mas não atacou');
  else if (member.war.fame >= 500) lines.push('⚔️ Ótima performance na guerra');

  if (member.donations >= 100) lines.push('🎁 Doador exemplar');
  else if (member.donations === 0) lines.push('📭 Sem doações neste ciclo');

  return lines.join('\n');
}

export function MemberModal({ member, onClose }: MemberModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const scoreColor = scoreGradient(member.collaborationScore);
  const summary = interpretScore(member);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <RoleBadge role={member.role} />
              <StatusBadge status={member.activityStatus} />
            </div>
            <h2 className="text-xl font-bold text-white">{member.name}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{member.tag}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Score de Colaboração</span>
            <span className={cn('text-2xl font-black', `bg-gradient-to-r ${scoreColor} bg-clip-text text-transparent`)}>
              {member.collaborationScore}
            </span>
          </div>
          <ScoreBar score={member.collaborationScore} showLabel={false} />
        </div>

        {/* Stats */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Estatísticas
          </p>
          <InfoRow label="Troféus" value={formatNumber(member.trophies)} icon={Trophy} />
          <InfoRow label="Nível" value={member.expLevel} icon={Star} />
          <InfoRow label="Doações" value={member.donations} icon={Gift} />
          <InfoRow label="Recebidas" value={member.donationsReceived} icon={Gift} />
        </div>

        {/* War */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Guerra / River Race
            </p>
            <WarBadge participated={member.war.participated} />
          </div>
          {member.war.participated ? (
            <>
              <InfoRow label="Fama / Contribuição" value={formatNumber(member.war.fame)} icon={Sword} />
              <InfoRow label="Decks Usados" value={`${member.war.decksUsed}`} icon={Layers} />
              <InfoRow label="Decks Hoje" value={`${member.war.decksUsedToday}`} icon={Layers} />
              <InfoRow label="Ataques ao Barco" value={member.war.boatAttacks} icon={Anchor} />
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center py-3">
              Não participou desta River Race
            </p>
          )}
        </div>

        {/* Summary */}
        <div className="p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Resumo
          </p>
          <div className="bg-surface-2 rounded-lg p-3 space-y-1">
            {summary.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-slate-300">{line}</p>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
