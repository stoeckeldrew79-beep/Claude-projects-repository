import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchScams } from '../services/scams';
import { countryName } from '../utils/countries';
import { timeAgo } from '../utils/timeAgo';

const ALERT_DOT_COLORS: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500',
};

// Polls rather than streams — the backend has no websocket/SSE channel, and
// a short interval reads as "live" without needing one for a feed this size.
const REFRESH_MS = 20_000;
const VISIBLE_COUNT = 10;

export function GlobalActivityTicker() {
  const { data, isLoading } = useQuery({
    queryKey: ['scams', { sort: 'newest' as const }, 'ticker'],
    queryFn: () => fetchScams({ sort: 'newest' }),
    refetchInterval: REFRESH_MS,
  });
  const items = data?.slice(0, VISIBLE_COUNT) ?? [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-1">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <p className="text-xs font-semibold tracking-widest text-slate-300 uppercase">Live activity</p>
      </div>

      <div className="mt-3 flex-1 space-y-1 overflow-y-auto pr-1">
        {isLoading && <p className="px-1 text-sm text-slate-400">Loading…</p>}
        {items.map((scam) => (
          <Link
            key={scam.id}
            to={`/scams/${scam.slug}`}
            className="block rounded-md px-2 py-2 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start gap-2">
              <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                  ALERT_DOT_COLORS[scam.alert_level ?? 'low'] ?? 'bg-slate-400'
                }`}
              />
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-100">{scam.name}</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {scam.country && countryName(scam.country)}
                  {scam.country && ' · '}
                  {timeAgo(scam.created_at)}
                </p>
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && items.length === 0 && <p className="px-1 text-sm text-slate-400">No activity recorded yet.</p>}
      </div>
    </div>
  );
}
