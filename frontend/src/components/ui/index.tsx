import { cn } from '@/lib/utils';

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface border border-border shadow-card',
        glow && 'glow-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export function Badge({ children, className, variant = 'outline' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border',
        variant === 'outline' && 'bg-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── ScoreBar ────────────────────────────────────────────────────────────────

interface ScoreBarProps {
  score: number;
  className?: string;
  showLabel?: boolean;
}

export function ScoreBar({ score, className, showLabel = true }: ScoreBarProps) {
  const color =
    score >= 80
      ? 'bg-gradient-to-r from-champion to-yellow-300'
      : score >= 60
      ? 'bg-gradient-to-r from-success to-emerald-300'
      : score >= 40
      ? 'bg-gradient-to-r from-primary to-cyan-300'
      : score >= 20
      ? 'bg-gradient-to-r from-warning to-amber-300'
      : 'bg-gradient-to-r from-danger to-red-400';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 score-bar-track h-1.5">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${score}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-slate-300 w-7 text-right">{score}</span>
      )}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('shimmer rounded-lg bg-surface-2', className)} />
  );
}

export function CardSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-7 w-16 mb-2" />
      <Skeleton className="h-2 w-32" />
    </Card>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border">
      <Skeleton className="h-4 w-6" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-3 w-16 ml-auto" />
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

// ─── ErrorState ──────────────────────────────────────────────────────────────

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <p className="text-danger font-semibold mb-1">Erro ao carregar dados</p>
      <p className="text-slate-500 text-sm max-w-xs">{message}</p>
    </div>
  );
}

// ─── EmptyState ──────────────────────────────────────────────────────────────

export function EmptyState({ message = 'Nenhum dado encontrado' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <span className="text-2xl">🔍</span>
      </div>
      <p className="text-slate-400 font-medium">{message}</p>
    </div>
  );
}
