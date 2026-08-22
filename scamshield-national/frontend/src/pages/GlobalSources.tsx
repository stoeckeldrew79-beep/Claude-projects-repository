import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useGlobalSources } from '../hooks/useGlobalSources';
import { GlobalSource, GlobalStat } from '../types';

const DATA_TYPE_LABEL: Record<GlobalSource['data_type'], string> = {
  open_dataset: 'Open dataset',
  annual_report: 'Annual report',
  public_stats: 'Public statistics',
};

export function formatLoss(stat: GlobalStat): string | null {
  if (stat.loss_amount == null) return null;
  const amount = Number(stat.loss_amount);
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
  return stat.currency ? `${stat.currency} ${formatted}` : formatted;
}

function StatRow({ stat }: { stat: GlobalStat }) {
  const loss = formatLoss(stat);
  return (
    <li className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
      <p className="text-sm text-slate-800">{stat.headline}</p>
      <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
        <span>{stat.period_label}</span>
        {stat.report_count != null && <span>{stat.report_count.toLocaleString()} reports</span>}
        {loss && <span>{loss} in losses</span>}
        {stat.top_category && <span>Top category: {stat.top_category}</span>}
      </dl>
      <a href={stat.source_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-red-700 underline">
        Source
      </a>
    </li>
  );
}

function SourceCard({ source }: { source: GlobalSource }) {
  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{source.country_name}</p>
          <h2 className="mt-0.5 font-semibold text-slate-900">{source.agency_name}</h2>
        </div>
        <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {DATA_TYPE_LABEL[source.data_type]}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{source.description}</p>
      <a href={source.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-red-700 underline">
        Visit agency site →
      </a>

      <div className="mt-4">
        {source.stats.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No figures verified against this agency's own report yet — check back as they're added.
          </p>
        ) : (
          <ul className="space-y-3">
            {source.stats.map((stat) => (
              <StatRow key={stat.id} stat={stat} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function GlobalSourcesPage() {
  useDocumentMeta({
    title: 'Global Scam Intelligence',
    description: 'Official fraud-reporting agencies from around the world, and figures verified against their own published reports.',
    path: '/global-sources',
  });

  const { data, isLoading, isError } = useGlobalSources();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Global Scam Intelligence</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Official sources, worldwide</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        There is no single global database of every scam ever recorded — most national fraud-reporting agencies
        publish annual reports or aggregate statistics, not a live feed of individual cases. This page tracks the
        major agencies that do publish something the public can read, and links directly to their reports. Every
        figure shown here has been checked against the agency's own publication before it's added — nothing is
        auto-ingested or estimated.
      </p>

      {isLoading && <p className="mt-8 text-sm text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-sm text-red-700">Couldn't load global sources.</p>}

      {data && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {data.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}
