import { Link } from 'react-router-dom';
import { useLiveStats } from '../../hooks/useStats';
import { useCategories } from '../../hooks/useScams';
import { timeAgo } from '../../utils/timeAgo';
import { countryName } from '../../utils/countries';
import { NumberTicker } from '../magicui/number-ticker';
import { OfficialAlertsList } from './OfficialAlertsList';

const LEVEL_STYLES: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-slate-100 text-slate-700',
};

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60 motion-reduce:hidden" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
    </span>
  );
}

function PulseMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-white/5 px-4 py-3 ring-1 ring-inset ring-white/10">
      <div className="text-2xl font-bold tabular-nums text-white">
        <NumberTicker value={value} />
      </div>
      <div className="mt-0.5 text-xs leading-snug text-slate-400">{label}</div>
    </div>
  );
}

// The home page's "what's happening right now" panel. Every value here is
// read from the public API (GET /v1/stats/live and the daily-news feeds) —
// when a number isn't available the tile is omitted, never estimated.
export function IntelligenceBriefing() {
  const { data: live, isLoading: liveLoading } = useLiveStats();
  const { data: categories } = useCategories();
  const topCategory = live?.mostActiveCategory;
  const topCategorySlug = topCategory ? categories?.find((c) => c.name === topCategory.name)?.slug : undefined;

  return (
    <section aria-labelledby="briefing-heading" className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-14 sm:py-16">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8a2e2e]">
              <LiveDot /> Intelligence briefing
            </p>
            <h2 id="briefing-heading" className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              What enforcement agencies are warning about now
            </h2>
          </div>
          <p className="text-sm text-slate-500 sm:max-w-xs sm:text-right">
            Pulled from official Attorney General and federal publications, plus our own scam database.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Official alerts */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-900">Latest official alerts</h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                <LiveDot /> Live feed
              </span>
            </div>
            <div className="mt-2">
              <OfficialAlertsList limit={6} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 pt-4 text-sm font-medium">
              <Link to="/todays-scams" className="text-[#8a2e2e] hover:underline">
                All of today's scams →
              </Link>
              <Link to="/state-attorneys-general" className="text-slate-600 hover:text-slate-900">
                State AGs
              </Link>
              <Link to="/federal" className="text-slate-600 hover:text-slate-900">
                Federal Watch
              </Link>
            </div>
          </div>

          {/* Pulse */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#0f1a2b] p-5 sm:p-6 text-white shadow-sm">
              <h3 className="font-semibold">This week's pulse</h3>
              {liveLoading && (
                <div className="mt-4 grid grid-cols-2 gap-3" aria-busy="true">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-[68px] rounded-lg bg-white/5 animate-pulse" />
                  ))}
                </div>
              )}
              {live && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <PulseMetric value={live.newLast7Days} label="New scams documented, last 7 days" />
                    <PulseMetric value={live.newsLast24h} label="Alerts & reports logged, last 24 hours" />
                    <PulseMetric value={live.activeCriticalCount} label="Active threats rated critical" />
                    <PulseMetric value={live.activeHighCount} label="Active threats rated high" />
                  </div>
                  {topCategory && (
                    <div className="mt-4 rounded-lg bg-red-600/15 px-4 py-3 ring-1 ring-inset ring-red-500/30">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-red-300">
                        Most active category this week
                      </p>
                      <p className="mt-1 flex items-baseline justify-between gap-2">
                        {topCategorySlug ? (
                          <Link
                            to={`/database?category=${topCategorySlug}`}
                            className="font-semibold text-white hover:underline"
                          >
                            {topCategory.name} →
                          </Link>
                        ) : (
                          <span className="font-semibold text-white">{topCategory.name}</span>
                        )}
                        <span className="shrink-0 text-xs text-slate-300">
                          {topCategory.count.toLocaleString()} new
                        </span>
                      </p>
                    </div>
                  )}
                </>
              )}
              {!liveLoading && !live && (
                <p className="mt-3 text-sm text-slate-400">Live numbers are unavailable right now.</p>
              )}
            </div>

            {live && live.recentCritical.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900">Newest high-risk threats</h3>
                <ul className="mt-3 space-y-1">
                  {live.recentCritical.slice(0, 4).map((s) => (
                    <li key={s.id}>
                      <Link to={`/scams/${s.slug}`} className="group -mx-2 block rounded-md px-2 py-2 hover:bg-slate-50">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              LEVEL_STYLES[s.alert_level] ?? LEVEL_STYLES.low
                            }`}
                          >
                            {s.alert_level}
                          </span>
                          <span className="truncate">
                            {[s.category_name, s.country ? countryName(s.country) : null].filter(Boolean).join(' · ')}
                          </span>
                          <span className="ml-auto shrink-0">{timeAgo(s.created_at)}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium leading-snug text-slate-900 line-clamp-2 group-hover:text-[#8a2e2e]">
                          {s.name}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to="/database" className="mt-3 inline-block text-sm font-medium text-[#8a2e2e] hover:underline">
                  Search the full database →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
