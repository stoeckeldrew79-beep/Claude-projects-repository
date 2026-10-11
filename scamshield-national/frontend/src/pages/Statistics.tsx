import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLiveStats } from '../hooks/useStats';
import { useGlobalSources } from '../hooks/useGlobalSources';
import { StatsBar } from '../components/StatsBar';
import { countryName } from '../utils/countries';
import { timeAgo } from '../utils/timeAgo';
import { formatLoss } from './GlobalSources';
import { GlobalSource } from '../types';
import { LiveStatsCritical } from '../services/stats';

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
