import { Badge } from '@/components/ui';
import { cn, roleLabel, roleBg, statusLabel, statusBg } from '@/lib/utils';
import type { MemberRole, ActivityStatus } from '@/types';
import { Crown, Shield, Star, User } from 'lucide-react';

const RoleIcons: Record<MemberRole, React.ElementType> = {
  leader: Crown,
  coLeader: Shield,
  elder: Star,
  member: User,
};

export function RoleBadge({ role }: { role: MemberRole }) {
  const Icon = RoleIcons[role];
  return (
    <Badge className={cn('gap-1', roleBg(role))}>
      <Icon className="w-2.5 h-2.5" />
      {roleLabel(role)}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: ActivityStatus }) {
  const emoji: Record<ActivityStatus, string> = {
    champion: '🏆',
    active: '✅',
    average: '🔵',
    low: '⚠️',
    inactive: '❌',
  };
  return (
    <Badge className={cn(statusBg(status))}>
      <span>{emoji[status]}</span>
      {statusLabel(status)}
    </Badge>
  );
}

export function WarBadge({ participated }: { participated: boolean }) {
  return (
    <Badge
      className={
        participated
          ? 'bg-success/10 text-success border-success/30'
          : 'bg-danger/10 text-danger border-danger/30'
      }
    >
      {participated ? '⚔️ Participou' : '💤 Ausente'}
    </Badge>
  );
}
