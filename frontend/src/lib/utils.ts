import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ActivityStatus, MemberRole } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

export function roleLabel(role: MemberRole): string {
  const map: Record<MemberRole, string> = {
    leader: 'Líder',
    coLeader: 'Co-líder',
    elder: 'Ancião',
    member: 'Membro',
  };
  return map[role] ?? role;
}

export function statusLabel(status: ActivityStatus): string {
  const map: Record<ActivityStatus, string> = {
    champion: 'Campeão',
    active: 'Ativo',
    average: 'Regular',
    low: 'Baixo',
    inactive: 'Inativo',
  };
  return map[status] ?? status;
}

export function statusColor(status: ActivityStatus): string {
  const map: Record<ActivityStatus, string> = {
    champion: 'text-champion',
    active: 'text-success',
    average: 'text-primary',
    low: 'text-warning',
    inactive: 'text-danger',
  };
  return map[status] ?? 'text-gray-400';
}

export function statusBg(status: ActivityStatus): string {
  const map: Record<ActivityStatus, string> = {
    champion: 'bg-champion/10 text-champion border-champion/30',
    active: 'bg-success/10 text-success border-success/30',
    average: 'bg-primary/10 text-primary border-primary/30',
    low: 'bg-warning/10 text-warning border-warning/30',
    inactive: 'bg-danger/10 text-danger border-danger/30',
  };
  return map[status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30';
}

export function roleBg(role: MemberRole): string {
  const map: Record<MemberRole, string> = {
    leader: 'bg-champion/10 text-champion border-champion/30',
    coLeader: 'bg-accent/10 text-accent border-accent/30',
    elder: 'bg-primary/10 text-primary border-primary/30',
    member: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return map[role] ?? 'bg-gray-500/10 text-gray-400';
}

export function scoreGradient(score: number): string {
  if (score >= 80) return 'from-champion to-yellow-300';
  if (score >= 60) return 'from-success to-emerald-300';
  if (score >= 40) return 'from-primary to-cyan-300';
  if (score >= 20) return 'from-warning to-amber-300';
  return 'from-danger to-red-400';
}

export function warStateLabel(state: string): string {
  const map: Record<string, string> = {
    warDay: '⚔️ Dia de Guerra',
    training: '🛡️ Treinamento',
    notInWar: '💤 Fora de Guerra',
    ended: '✅ Finalizada',
  };
  return map[state] ?? state;
}

export function cleanTag(tag: string): string {
  return tag.startsWith('#') ? tag.slice(1) : tag;
}
