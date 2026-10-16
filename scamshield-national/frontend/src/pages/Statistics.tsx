import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLiveStats, useStatsBreakdown } from '../hooks/useStats';
import { StatsBreakdown } from '../services/stats';
import { tagLabel } from '../utils/scamTags';
import { useGlobalSources } from '../hooks/useGlobalSources';
import { StatsBar } from '../components/StatsBar';
import { countryName } from '../utils/countries';
import { timeAgo } from '../utils/timeAgo';
import { formatLoss } from './GlobalSources';
import { GlobalSource } from '../types';
import { LiveStatsCritical } from '../services/stats';

// Severity is a status scale, so it uses the site's severity colours (the
// same ones on every scam card) and always ships with a text label.
const SEVERITY_SEGMENTS: { key: keyof StatsBreakdown['bySeverity']; label: string; color: string }[] = [
  { key: 'critical', label: 'Critical', color: '#dc2626' },
  { key: 'high', label: 'High', color: '#f97316' },
  { key: 'medium', label: 'Medium', color: '#fbbf24' },
  { key: 'low', label: 'Low', color: '#94a3b8' },
  { key: 'unrated', label: 'Unrated', color: '#e2e8f0' },
];

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SeverityBar({ data }: { data: StatsBreakdown['bySeverity'] }) {
  const total = SEVERITY_SEGMENTS.reduce((sum, s) => sum + data[s.key], 0) || 1;
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div>
      <div className="flex h-5 gap-[2px] overflow-hidden rounded-md" role="img" aria-label="Current entries by severity">
        {SEVERITY_SEGMENTS.filter((s) => data[s.key] > 0).map((s) => (
          <div
            key={s.key}
            onPointerEnter={() => setHover(s.key)}
            onPointerLeave={() => setHover(null)}
            className="h-full transition-opacity first:rounded-l-md last:rounded-r-md"
            style={{ width: `${(data[s.key] / total) * 100}%`, backgroundColor: s.color, opacity: hover && hover !== s.key ? 0.45 : 1 }}
            title={`${s.label}: ${data[s.key].toLocaleString()}`}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-y-1.5 text-sm">
        {SEVERITY_SEGMENTS.map((s) => (
          <li key={s.key} className={`flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 last:border-0 ${hover && hover !== s.key ? 'opacity-50' : ''}`}>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="h-2.5 w-2.5 rounded-sm ring-1 ring-black/5" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
            <span className="tabular-nums text-slate-900">
              <span className="font-semibold">{data[s.key].toLocaleString()}</span>
              <span className="ml-1 text-xs text-slate-400">{Math.round((data[s.key] / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Change over time: one column per week, single hue. Values are direct-
// labelled on hover/focus and for the latest week; the axis is implicit
// (bars share a zero baseline) so a reader never compares unlabelled heights.
function WeeklyColumns({ weeks }: { weeks: StatsBreakdown['weeklyAdded'] }) {
  const max = Math.max(1, ...weeks.map((w) => w.count));
  const [active, setActive] = useState<number>(weeks.length - 1);
  const current = weeks[active];
  const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return (
    <div>
      <p className="text-sm text-slate-600">
        Week of <span className="font-semibold text-slate-900">{current ? fmt(current.week_start) : '—'}</span>:{' '}
        <span className="font-semibold text-slate-900 tabular-nums">{current?.count.toLocaleString() ?? 0}</span> entries added
      </p>
      <div className="mt-3 flex h-36 items-end gap-[3px] border-b border-slate-200" role="list">
        {weeks.map((w, i) => (
          <button
            key={w.week_start}
            type="button"
            role="listitem"
            aria-label={`Week of ${fmt(w.week_start)}: ${w.count} entries added`}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className="group flex h-full flex-1 items-end"
          >
            <span
              className={`block w-full rounded-t-[4px] transition-colors ${i === active ? 'bg-red-600' : 'bg-red-300 group-hover:bg-red-400'}`}
              style={{ height: `${w.count === 0 ? 0 : Math.max(2, (w.count / max) * 100)}%` }}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-400">
        <span>{weeks[0] ? fmt(weeks[0].week_start) : ''}</span>
        <span>This week</span>
      </div>
    </div>
  );
}

function RankedBars({
  rows,
  hrefFor,
  accentKey,
  accentLabel,
}: {
  rows: { label: string; count: number; key: string; accent?: number }[];
  hrefFor?: (key: string) => string;
  accentKey?: boolean;
  accentLabel?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <>
      <ol className="space-y-2">
        {rows.map((r) => {
          const inner = (
            <>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="min-w-0 truncate text-slate-800 group-hover:underline">{r.label}</span>
                <span className="shrink-0 font-semibold text-slate-900 tabular-nums">{r.count.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`relative h-full rounded-full ${accentKey ? 'bg-red-200' : 'bg-red-500'}`} style={{ width: `${Math.max(1.5, (r.count / max) * 100)}%` }}>
                  {accentKey && r.accent !== undefined && (
                    <div className="absolute inset-y-0 left-0 rounded-full bg-red-600" style={{ width: `${(r.accent / Math.max(1, r.count)) * 100}%` }} />
                  )}
                </div>
              </div>
            </>
          );
          return (
            <li key={r.key}>
              {hrefFor ? (
                <Link to={hrefFor(r.key)} className="group block rounded-md -mx-1 px-1 py-0.5 hover:bg-slate-50">
                  {inner}
                </Link>
              ) : (
                <div>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
      {accentKey && (
        <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-red-600" /> {accentLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-full bg-red-200" /> All current entries
          </span>
        </div>
      )}
    </>
  );
}

function DatabaseBreakdown() {
  const { data, isLoading, isError } = useStatsBreakdown();
  const [allCategories, setAllCategories] = useState(false);
  // An API without this endpoint (or a failed request) just omits the
  // section; nothing here may fall back to made-up numbers.
  if (isError) return null;
  if (isLoading || !data) {
    return (
      <div className="mt-6 grid gap-4 md:grid-cols-2" aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
        ))}
      </div>
    );
  }
  const categories = allCategories ? data.byCategory : data.byCategory.slice(0, 10);
  const criticalHighShare =
    data.totals.current > 0 ? Math.round(((data.bySeverity.critical + data.bySeverity.high) / data.totals.current) * 100) : 0;

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <LiveStatTile value={data.totals.current} label="Current entries" />
        <LiveStatTile value={data.totals.historical} label="Historical archive" />
        <LiveStatTile value={data.totals.countries} label="Countries with entries" />
        <div className="rounded-lg border border-slate-200 px-4 py-5 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-red-600 tabular-nums">{criticalHighShare}%</div>
          <div className="mt-1 text-xs sm:text-sm font-medium text-slate-500">Rated critical or high</div>
        </div>
      </div>

      {/* Two independent columns (not a row grid) so a short panel never
          stretches to match a tall neighbour and leave a hole. */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 md:items-start">
        <div className="grid gap-4">
          <Panel title="Severity of current threats" sub={`${data.totals.current.toLocaleString()} current entries by alert level`}>
            <SeverityBar data={data.bySeverity} />
          </Panel>
          <Panel title="Categories" sub="Current entries per category, with the share rated critical or high">
            <RankedBars
              rows={categories.map((c) => ({ key: c.slug, label: c.name, count: c.count, accent: c.critical_high }))}
              hrefFor={(slug) => `/database?category=${encodeURIComponent(slug)}&view=all`}
              accentKey
              accentLabel="Critical or high"
            />
            {data.byCategory.length > 10 && (
              <button type="button" onClick={() => setAllCategories((v) => !v)} className="mt-3 text-sm font-semibold text-red-700 hover:underline">
                {allCategories ? 'Show top 10' : `Show all ${data.byCategory.length} categories`}
              </button>
            )}
          </Panel>
        </div>
        <div className="grid gap-4">
          <Panel title="Entries added per week" sub="Database growth over the last 12 weeks (UTC weeks) — not a count of scam incidents">
            <WeeklyColumns weeks={data.weeklyAdded} />
          </Panel>
          <Panel title="Top countries" sub="Current entries by country">
            <RankedBars
              rows={data.topCountries.map((c) => ({ key: c.country, label: countryName(c.country), count: c.count }))}
              hrefFor={(code) => `/database?country=${encodeURIComponent(code)}&view=all`}
            />
          </Panel>
          {data.topTargets.length > 0 && (
            <Panel title="Who is targeted" sub="Entries where the source names a targeted group">
              <RankedBars
                rows={data.topTargets.map((t) => ({ key: t.tag, label: tagLabel(t.tag), count: t.count }))}
                hrefFor={(tag) => `/database?tag=${encodeURIComponent(tag)}&view=all`}
              />
            </Panel>
          )}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Live aggregates of the curated database, refreshed every few minutes · as of{' '}
        {new Date(data.generated_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
      </p>
    </>
  );
}

const ALERT_BADGE_STYLES: Record<string, string> = {
  critical: 'bg-red-50 text-red-700',
  high: 'bg-orange-50 text-orange-700',
};

function LiveStatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-slate-200 px-4 py-5 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-red-600 tabular-nums">{value.toLocaleString()}</div>
      <div className="mt-1 text-xs sm:text-sm font-medium text-slate-500">{label}</div>
    </div>
  );
}

function UrgentRow({ item }: { item: LiveStatsCritical }) {
  return (
    <Link
      to={`/scams/${item.slug}`}
      className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${ALERT_BADGE_STYLES[item.alert_level] ?? 'bg-slate-100 text-slate-600'}`}
          >
            {item.alert_level}
          </span>
          <span className="font-medium text-slate-900 truncate">{item.name}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          {item.category_name}
          {item.country && <> · {countryName(item.country)}</>}
        </p>
      </div>
      <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">{timeAgo(item.created_at)}</span>
    </Link>
  );
}

function AgencyStatRow({ source }: { source: GlobalSource }) {
  return (
    <>
      {source.stats.map((stat) => {
        const loss = formatLoss(stat);
        return (
          <tr key={stat.id} className="border-t border-slate-100">
            <td className="py-3 pr-4 align-top">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{source.country_name}</p>
              <p className="text-sm font-medium text-slate-900">{source.agency_name}</p>
            </td>
            <td className="py-3 pr-4 align-top text-sm text-slate-600">{stat.headline}</td>
            <td className="py-3 pr-4 align-top text-sm text-slate-500 whitespace-nowrap">{stat.period_label}</td>
            <td className="py-3 pr-4 align-top text-sm text-slate-500 whitespace-nowrap tabular-nums">
              {stat.report_count != null ? stat.report_count.toLocaleString() : '—'}
            </td>
            <td className="py-3 pr-4 align-top text-sm text-slate-500 whitespace-nowrap tabular-nums">{loss ?? '—'}</td>
            <td className="py-3 align-top">
              <a href={stat.source_url} target="_blank" rel="noreferrer" className="text-xs text-red-700 underline">
                Source
              </a>
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default function Statistics() {
  useDocumentMeta({
    title: 'Scam Statistics',
    description:
      'Live counts from the ScamShield National database, alongside official fraud figures verified against each agency\'s own published report.',
    path: '/statistics',
  });

  const { data: liveStats, isLoading: liveLoading, isError: liveError } = useLiveStats();
  const { data: sources, isLoading: sourcesLoading, isError: sourcesError } = useGlobalSources();

  const sourcesWithStats = sources?.filter((s) => s.stats.length > 0) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Scam Intelligence</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">National &amp; global scam statistics</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        There is no single, authoritative count of "how many scams happen." What follows is two different, clearly
        separated things: live counts from our own database below, and figures each government agency has actually
        published — never a number we've estimated or combined across sources ourselves.
      </p>

      <div className="mt-8">
        <StatsBar />
      </div>

      <div className="mt-14">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="font-semibold text-slate-900">Right now</h2>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Not a snapshot that looks the same every time you check — this reflects how fast the database is actually
          growing and what's currently rated dangerous, refreshed automatically.
        </p>

        {liveLoading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
        {liveError && <p className="mt-4 text-sm text-red-700">Couldn't load live statistics.</p>}

        {liveStats && (
          <>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <LiveStatTile value={liveStats.activeCriticalCount} label="Critical-severity threats active" />
              <LiveStatTile value={liveStats.activeHighCount} label="High-severity threats active" />
              <LiveStatTile value={liveStats.newLast7Days} label="New patterns, last 7 days" />
              <LiveStatTile value={liveStats.newsLast24h} label="News headlines scanned, last 24h" />
            </div>

            {liveStats.mostActiveCategory && (
              <p className="mt-4 text-sm text-slate-600">
                Most active category this week:{' '}
                <span className="font-semibold text-slate-900">{liveStats.mostActiveCategory.name}</span> (
                {liveStats.mostActiveCategory.count} new pattern
                {liveStats.mostActiveCategory.count === 1 ? '' : 's'})
              </p>
            )}

            {liveStats.recentCritical.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-900">Most urgent right now</h3>
                <div className="mt-2">
                  {liveStats.recentCritical.map((item) => (
                    <UrgentRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-14">
        <h2 className="font-semibold text-slate-900">Inside the database</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          What the ScamShield database holds right now — by severity, category, country and who is targeted, and how
          fast it is growing. Every figure is a live count of curated entries; one entry is one documented scam
          pattern, not one victim.
        </p>
        <DatabaseBreakdown />
      </div>

      <div className="mt-14">
        <h2 className="font-semibold text-slate-900">Official reported fraud, by country</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Pulled from{' '}
          <a href="/global-sources" className="underline">
            Global Sources
          </a>{' '}
          — each row is one figure checked directly against that agency's own report. Figures use different
          currencies and cover different time periods, so they are never summed into a single worldwide total here.
        </p>

        {sourcesLoading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
        {sourcesError && <p className="mt-4 text-sm text-red-700">Couldn't load official figures.</p>}

        {sourcesWithStats.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  <th className="pb-2 pr-4 font-semibold">Agency</th>
                  <th className="pb-2 pr-4 font-semibold">Figure</th>
                  <th className="pb-2 pr-4 font-semibold">Period</th>
                  <th className="pb-2 pr-4 font-semibold">Reports</th>
                  <th className="pb-2 pr-4 font-semibold">Losses</th>
                  <th className="pb-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {sourcesWithStats.map((source) => (
                  <AgencyStatRow key={source.id} source={source} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-14 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h2 className="font-semibold text-slate-900">Why there's no single "scams per day" number</h2>
        <p className="mt-2 text-sm text-slate-600">
          Fraud reports, scam attempts, and actual victims are three different things, and no country counts all
          three the same way. A report count tells you how many people contacted an agency — not how many scam
          attempts actually happened, since most go unreported. A loss figure tells you what victims said they lost —
          not what scammers actually took, since figures are sometimes estimated, revised, or based on a subset of
          cases. Adding figures from different agencies or countries together would combine incompatible
          definitions and currencies into a number that looks precise but isn't real. That's why every figure on this
          page stays attributed to its own agency, its own period, and its own source link.
        </p>
      </div>
    </div>
  );
}
