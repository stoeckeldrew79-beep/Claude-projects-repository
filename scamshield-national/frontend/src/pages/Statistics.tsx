import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useStats, useStatsBreakdown } from '../hooks/useStats';
import { useGlobalSources } from '../hooks/useGlobalSources';
import { StatsBar } from '../components/StatsBar';
import { countryName } from '../utils/countries';
import { formatLoss } from './GlobalSources';
import { GlobalSource } from '../types';

function BreakdownList({ rows, total }: { rows: { label: string; count: number }[]; total: number }) {
  const max = rows.reduce((m, r) => Math.max(m, r.count), 1);
  return (
    <ul className="mt-4 space-y-2.5">
      {rows.map((row) => (
        <li key={row.label}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-slate-700">{row.label}</span>
            <span className="text-slate-500 tabular-nums">
              {row.count.toLocaleString()} <span className="text-slate-400">({Math.round((row.count / total) * 100)}%)</span>
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-red-600"
              style={{ width: `${Math.max((row.count / max) * 100, 2)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
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

  const { data: stats } = useStats();
  const { data: breakdown, isLoading: breakdownLoading, isError: breakdownError } = useStatsBreakdown();
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

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-semibold text-slate-900">Our database, by category</h2>
          {breakdownLoading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
          {breakdownError && <p className="mt-4 text-sm text-red-700">Couldn't load the breakdown.</p>}
          {breakdown && stats && (
            <BreakdownList
              rows={breakdown.byCategory.map((c) => ({ label: c.name, count: c.count }))}
              total={stats.scams}
            />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Our database, by country</h2>
          {breakdownLoading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
          {breakdownError && <p className="mt-4 text-sm text-red-700">Couldn't load the breakdown.</p>}
          {breakdown && stats && (
            <BreakdownList
              rows={breakdown.byCountry.map((c) => ({ label: countryName(c.country), count: c.count }))}
              total={stats.scams}
            />
          )}
        </div>
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
