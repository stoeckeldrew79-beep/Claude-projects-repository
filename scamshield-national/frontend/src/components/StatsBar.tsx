import { useStats } from '../hooks/useStats';
import { SiteStats } from '../services/stats';
import { NumberTicker } from './magicui/number-ticker';
import { BlurFade } from './magicui/blur-fade';

const TILES: { key: keyof SiteStats; label: string }[] = [
  { key: 'scams', label: 'Scams Documented' },
  { key: 'categories', label: 'Scam Categories' },
  { key: 'countries', label: 'Countries Tracked' },
  { key: 'sources', label: 'Official Sources Linked' },
];

// Every figure here comes from GET /stats, a live COUNT(*) against the
// real database — no placeholder or fabricated numbers, matching the
// same honesty principle as Trend Watch and Global Sources.
export function StatsBar() {
  const { data: stats, isLoading } = useStats();
  if (isLoading || !stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-200 border-y border-slate-200">
      {TILES.map((tile, i) => (
        <BlurFade key={tile.key} delay={0.06 * i} inView>
          <div className="px-4 py-6 text-center">
            <div className="text-3xl sm:text-4xl font-bold text-red-600 tabular-nums">
              <NumberTicker value={stats[tile.key]} delay={0.1 * i} />
            </div>
            <div className="mt-1 text-xs sm:text-sm font-medium text-slate-500">{tile.label}</div>
          </div>
        </BlurFade>
      ))}
    </div>
  );
}
