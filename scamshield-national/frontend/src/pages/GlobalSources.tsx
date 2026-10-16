import { useMemo, useState } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useGlobalSources } from '../hooks/useGlobalSources';
import { GlobalSource, GlobalStat } from '../types';

const DATA_TYPE_LABEL: Record<GlobalSource['data_type'], string> = {
  open_dataset: 'Open dataset',
  annual_report: 'Annual report',
  public_stats: 'Public statistics',
};

// Exact figure in the agency's own currency, as printed on the card.
export function formatLoss(stat: GlobalStat): string | null {
  if (stat.loss_amount == null) return null;
  const amount = Number(stat.loss_amount);
  const formatted = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
  return stat.currency ? `${stat.currency} ${formatted}` : formatted;
}

// Headline-sized version for the at-a-glance strip: "$20.88B", "CA$704M".
// Always in the agency's own currency — figures are never converted, so
// nobody is tempted to add a US dollar total to a Singapore dollar one.
function formatLossCompact(stat: GlobalStat): string | null {
  if (stat.loss_amount == null) return null;
  const amount = Number(stat.loss_amount);
  try {
    return new Intl.NumberFormat('en-US', {
      style: stat.currency ? 'currency' : 'decimal',
      currency: stat.currency ?? undefined,
      notation: 'compact',
      maximumSignificantDigits: 4,
    }).format(amount);
  } catch {
    return formatLoss(stat);
  }
}

function formatCountCompact(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumSignificantDigits: 4 }).format(n);
}

// The four-digit year a stat covers, for ordering. "Fiscal year 2024" and
// "2025 — victims aged 60+" both resolve; anything without one sorts last.
function statYear(stat: GlobalStat): number {
  const m = stat.period_label.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : 0;
}

// Newest period first; within a period the broadest figure (most reports)
// leads, so a source's headline is its national total rather than a subset
// like "victims aged 60+".
function orderStats(stats: GlobalStat[]): GlobalStat[] {
  return [...stats].sort(
    (a, b) => statYear(b) - statYear(a) || Number(b.report_count ?? 0) - Number(a.report_count ?? 0)
  );
}

// Coarse world regions for the filter. Hand-kept because the generated ISO
// table carries no region; a code missing here lands under "Other" rather
// than disappearing.
const REGIONS: { key: string; label: string; codes: string }[] = [
  { key: 'na', label: 'North America', codes: 'US CA' },
  {
    key: 'latam',
    label: 'Latin America & Caribbean',
    codes: 'AG AR BB BO BR BS BZ CL CO CR CU DM DO EC GD GT GY HN HT JM KN LC MX NI PA PE PY SR SV TT UY VC VE',
  },
  {
    key: 'europe',
    label: 'Europe',
    codes:
      'AD AL AM AT AZ BA BE BG BY CH CY CZ DE DK EE ES FI FR GB GE GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA VA XK',
  },
  {
    key: 'apac',
    label: 'Asia & Pacific',
    codes:
      'AU BD BN BT CN FJ HK ID IN JP KG KH KR KZ LA LK MM MN MO MV MY NP NZ PG PH PK PW SB SG TH TJ TL TM TO TW UZ VN VU WS',
  },
  { key: 'mena', label: 'Middle East & North Africa', codes: 'AE BH DZ EG IL IQ IR JO KW LB LY MA OM PS QA SA SD SY TN YE' },
  {
    key: 'africa',
    label: 'Sub-Saharan Africa',
    codes:
      'AO BF BI BJ BW CD CF CG CI CM CV DJ ER ET GA GH GM GN GQ GW KE KM LR LS MG ML MR MU MW MZ NA NE NG RW SC SL SN SO SS ST SZ TD TG TZ UG ZA ZM ZW',
  },
];
const REGION_OF: Record<string, string> = Object.fromEntries(
  REGIONS.flatMap((r) => r.codes.split(' ').map((code) => [code, r.key]))
);
function regionOf(code: string): string {
  return REGION_OF[code] ?? 'other';
}
const REGION_LABEL: Record<string, string> = {
  ...Object.fromEntries(REGIONS.map((r) => [r.key, r.label])),
  other: 'Other',
};

// Shorter agency label for the strip, where the full name would wrap to
// four lines: the part before an em dash, or before a parenthetical.
function shortAgency(name: string): string {
  return name.split(' — ')[0].replace(/\s*\(.*\)\s*$/, '').trim();
}

function StatRow({ stat }: { stat: GlobalStat }) {
  const loss = formatLoss(stat);
  return (
    <li className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">{stat.period_label}</span>
        {stat.top_category && <span className="text-xs text-slate-500">Top: {stat.top_category}</span>}
      </div>
      <p className="mt-1.5 text-sm text-slate-800">{stat.headline}</p>
      <dl className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
        {stat.report_count != null && (
          <div>
            <dt className="sr-only">Reports</dt>
            <dd>
              <span className="font-semibold text-slate-700">{Number(stat.report_count).toLocaleString()}</span> reports
            </dd>
          </div>
        )}
        {loss && (
          <div>
            <dt className="sr-only">Reported losses</dt>
            <dd>
              <span className="font-semibold text-slate-700">{loss}</span> reported lost
            </dd>
          </div>
        )}
      </dl>
      <a
        href={stat.source_url}
        target="_blank"
        rel="noreferrer"
        className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-red-700 underline hover:text-red-800"
      >
        Read the agency&apos;s report ↗
      </a>
    </li>
  );
}

function SourceCard({ source }: { source: GlobalSource }) {
  const stats = orderStats(source.stats);
  const hasStats = stats.length > 0;
  return (
    <div
      className={`flex flex-col rounded-xl border bg-white p-5 ${
        hasStats ? 'border-slate-300 shadow-sm' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            <span className="rounded border border-slate-200 px-1 font-mono text-[10px] text-slate-500">{source.country}</span>
            {source.country_name}
          </p>
          <h3 className="mt-1 font-semibold leading-snug text-slate-900">{source.agency_name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-600">
          {DATA_TYPE_LABEL[source.data_type]}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600 line-clamp-4">{source.description}</p>

      {hasStats && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50/40 p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-red-700 uppercase">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z"
                clipRule="evenodd"
              />
            </svg>
            Verified against the agency&apos;s own report
          </p>
          <ul className="space-y-3">
            {stats.map((stat) => (
              <StatRow key={stat.id} stat={stat} />
            ))}
          </ul>
        </div>
      )}

      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="mt-auto pt-4 text-sm font-semibold text-red-700 hover:text-red-800"
      >
        Visit agency site ↗
      </a>
    </div>
  );
}

// One verified headline per agency that has one. Never a world total: every
// figure is a different agency, year, currency and counting method.
function AtAGlance({ sources }: { sources: GlobalSource[] }) {
  const items = sources
    .filter((s) => s.stats.length > 0)
    .map((s) => ({ source: s, stat: orderStats(s.stats)[0] }))
    .sort((a, b) => Number(b.stat.report_count ?? 0) - Number(a.stat.report_count ?? 0));
  if (items.length === 0) return null;

  return (
    <section className="mt-8 overflow-hidden rounded-2xl bg-[#0f1a2b] text-white">
      <div className="flex flex-wrap items-end justify-between gap-2 px-5 pt-5 sm:px-6">
        <div>
          <p className="text-[11px] font-bold tracking-widest text-red-300 uppercase">Scam losses at a glance</p>
          <h2 className="mt-1 text-lg font-semibold sm:text-xl">What the agencies themselves report</h2>
        </div>
        <p className="text-xs text-slate-400">Each figure is one agency&apos;s own count — not added together.</p>
      </div>
      <div className="mt-4 flex snap-x snap-mandatory overflow-x-auto border-t border-white/10 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
        {items.map(({ source, stat }) => {
          const loss = formatLossCompact(stat);
          return (
            <a
              key={stat.id}
              href={stat.source_url}
              target="_blank"
              rel="noreferrer"
              className="group w-[78%] shrink-0 snap-start border-r border-white/10 p-5 transition-colors hover:bg-[#16243a] sm:w-auto sm:border-b sm:p-6"
            >
              <p className="text-xs font-semibold text-slate-300">
                {source.country_name} · {stat.period_label}
              </p>
              {loss ? (
                <>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums">{loss}</p>
                  <p className="text-xs text-slate-400">reported lost</p>
                </>
              ) : stat.report_count != null ? (
                <>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight tabular-nums">
                    {formatCountCompact(Number(stat.report_count))}
                  </p>
                  <p className="text-xs text-slate-400">reports</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-200 line-clamp-3">{stat.headline}</p>
              )}
              {loss && stat.report_count != null && (
                <p className="mt-2 text-sm text-slate-200">
                  <span className="font-semibold tabular-nums">{Number(stat.report_count).toLocaleString()}</span> reports
                </p>
              )}
              <p className="mt-3 text-xs font-medium text-red-300 group-hover:text-red-200">
                {shortAgency(source.agency_name)} ↗
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}

type TypeFilter = 'all' | GlobalSource['data_type'];

export default function GlobalSourcesPage() {
  useDocumentMeta({
    title: 'Global Scam Intelligence',
    description:
      'Official fraud-reporting agencies from around the world, with headline scam-loss figures verified against their own published reports.',
    path: '/global-sources',
  });

  const { data, isLoading, isError } = useGlobalSources();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<string>('all');
  const [type, setType] = useState<TypeFilter>('all');
  const [withFiguresOnly, setWithFiguresOnly] = useState(false);

  const countries = useMemo(() => new Set(data?.map((s) => s.country) ?? []).size, [data]);
  const withFigures = useMemo(() => data?.filter((s) => s.stats.length > 0).length ?? 0, [data]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of data ?? []) counts[regionOf(s.country)] = (counts[regionOf(s.country)] ?? 0) + 1;
    return counts;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data
      .filter((s) => region === 'all' || regionOf(s.country) === region)
      .filter((s) => type === 'all' || s.data_type === type)
      .filter((s) => !withFiguresOnly || s.stats.length > 0)
      .filter(
        (s) =>
          !q ||
          s.agency_name.toLowerCase().includes(q) ||
          s.country_name.toLowerCase().includes(q) ||
          s.country.toLowerCase() === q ||
          s.description.toLowerCase().includes(q)
      )
      // Agencies with verified figures lead; the server's country order is
      // kept otherwise (Array.prototype.sort is stable).
      .sort((a, b) => Number(b.stats.length > 0) - Number(a.stats.length > 0));
  }, [data, search, region, type, withFiguresOnly]);

  // Grouped by region only when the reader hasn't narrowed to one — a single
  // heading over a single region's results is noise.
  const groups = useMemo(() => {
    if (region !== 'all') return [{ key: region, items: filtered }];
    const order = [...REGIONS.map((r) => r.key), 'other'];
    return order
      .map((key) => ({ key, items: filtered.filter((s) => regionOf(s.country) === key) }))
      .filter((g) => g.items.length > 0);
  }, [filtered, region]);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Global Scam Intelligence</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Official sources, worldwide</h1>
      <p className="mt-3 max-w-3xl text-slate-600">
        No single database records every scam on earth. National fraud agencies publish annual reports and aggregate
        statistics instead, so ScamShield tracks the ones the public can read and links straight to them. Every
        figure on this page was checked against the agency&apos;s own publication before it was added. Nothing is
        auto-ingested, estimated or converted between currencies.
      </p>

      {data && (
        <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">
          {[
            ['Agencies tracked', data.length],
            ['Countries & territories', countries],
            ['With verified figures', withFigures],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <dd className="text-2xl font-bold tabular-nums text-slate-900">{value}</dd>
              <dt className="text-[11px] leading-tight text-slate-500">{label}</dt>
            </div>
          ))}
        </dl>
      )}

      {data && <AtAGlance sources={data} />}

      {isLoading && <p className="mt-8 text-sm text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-sm text-red-700">Couldn&apos;t load global sources.</p>}

      {data && (
        <>
          <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative sm:w-72">
                <svg
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M8 3a5 5 0 103.2 8.9l3.4 3.4a1 1 0 001.4-1.4l-3.4-3.4A5 5 0 008 3zM5 8a3 3 0 116 0 3 3 0 01-6 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or agency…"
                  aria-label="Search country or agency"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TypeFilter)}
                  aria-label="Data type"
                  className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700"
                >
                  <option value="all">All data types</option>
                  <option value="annual_report">Annual reports</option>
                  <option value="public_stats">Public statistics</option>
                  <option value="open_dataset">Open datasets</option>
                </select>
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={withFiguresOnly}
                    onChange={(e) => setWithFiguresOnly(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 accent-red-700"
                  />
                  Verified figures only
                </label>
              </div>
            </div>
            <div className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <button type="button" onClick={() => setRegion('all')} className={chip(region === 'all')}>
                All regions <span className="opacity-60">{data.length}</span>
              </button>
              {[...REGIONS.map((r) => r.key), 'other']
                .filter((key) => regionCounts[key])
                .map((key) => (
                  <button key={key} type="button" onClick={() => setRegion(key)} className={chip(region === key)}>
                    {REGION_LABEL[key]} <span className="opacity-60">{regionCounts[key]}</span>
                  </button>
                ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500" aria-live="polite">
            Showing {filtered.length} of {data.length} agencies
          </p>

          {filtered.length === 0 && (
            <p className="mt-6 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No agencies match those filters.
            </p>
          )}

          {groups.map((group) => (
            <section key={group.key} className="mt-8">
              {region === 'all' && (
                <h2 className="mb-3 flex items-baseline gap-2 text-lg font-bold text-slate-900">
                  {REGION_LABEL[group.key]}
                  <span className="text-sm font-normal text-slate-400">{group.items.length}</span>
                </h2>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((source) => (
                  <SourceCard key={source.id} source={source} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
