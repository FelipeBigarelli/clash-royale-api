import type { ClanOverview } from '@/types';
import { formatDate, formatNumber, warStateLabel } from '@/lib/utils';
import { Clock, MapPin } from 'lucide-react';

interface Props {
  overview: ClanOverview;
}

export function ClanHeader({ overview }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
      {/* Badge / icon placeholder */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0 text-3xl">
        ⚔️
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-extrabold text-white">{overview.name}</h1>
          <span className="text-xs font-mono text-slate-500 bg-surface-2 px-2 py-1 rounded-lg border border-border">
            {overview.tag}
          </span>
          <span className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
            {warStateLabel(overview.warState)}
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{overview.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {overview.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDate(overview.lastUpdated)}
          </span>
          <span>🏆 {formatNumber(overview.clanScore)} pts</span>
          <span>🛡️ {formatNumber(overview.clanWarTrophies)} troféus</span>
        </div>
      </div>
    </div>
  );
}
