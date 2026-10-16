import { lazy, Suspense, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountsByCountry } from '../hooks/useGlobe';
import { useDailyNewsStates } from '../hooks/useDailyNews';
import { useScamStates } from '../hooks/useScams';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { GlobalActivityTicker } from '../components/GlobalActivityTicker';
import { US_STATE_NAMES, stateSlug } from '../utils/usStates';
import { countryName } from '../utils/countries';
import { CountryCount } from '../services/globe';

// Code-split: the globe (d3-geo + world outline) only loads on this page.
const Globe3D = lazy(() => import('../components/Globe3D').then((m) => ({ default: m.Globe3D })));

// Same treatment: the US map pulls in d3-geo and the state topology, which
// nothing else on the site needs.
const UsStateMap = lazy(() => import('../components/UsStateMap').then((m) => ({ default: m.UsStateMap })));

// Same footprint as the globe, so nothing jumps when the chunk arrives.
function GlobePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center">
      <div className="absolute inset-[6%] animate-pulse rounded-full bg-gradient-to-br from-[#16283f] to-[#0a1424] ring-1 ring-white/5" />
      <span className="relative text-sm text-slate-400">{label}</span>
    </div>
  );
}

function Kpi({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4">
      <div className="text-2xl font-extrabold tracking-tight text-slate-900 tabular-nums sm:text-3xl">{value}</div>
      <div className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">{label}</div>
      {sub && <div className="mt-1 truncate text-xs text-red-700">{sub}</div>}
    </div>
  );
}

// A ranked, readable companion to the globe: on a phone this is the fastest
// way to answer "which countries", and it's the accessible version of the
// globe for screen readers.
function CountryRanking({ data, onSelect }: { data: CountryCount[]; onSelect: (c: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  const sorted = useMemo(() => [...data].sort((a, b) => b.count - a.count), [data]);
  const total = sorted.reduce((sum, d) => sum + d.count, 0);
  const max = sorted[0]?.count ?? 1;
  const top = sorted.slice(0, 10);
  const rest = sorted.slice(10);

  return (
    <section className="mt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">Countries by documented entries</h2>
        <span className="text-xs text-slate-500">Share of {total.toLocaleString()} entries</span>
      </div>
      <ol className="mt-4 space-y-2">
        {top.map((d, i) => (
          <li key={d.country}>
            <button
              type="button"
              onClick={() => onSelect(d.country)}
              className="group grid w-full grid-cols-[1.75rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50"
            >
              <span className="text-right text-sm font-semibold text-slate-400 tabular-nums">{i + 1}</span>
              <span className="min-w-0">
                <span className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-slate-900 group-hover:underline">{countryName(d.country)}</span>
                  <span className="text-xs text-slate-500 tabular-nums">{((d.count / total) * 100).toFixed(1)}%</span>
                </span>
                <span className="mt-1 block h-2 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full bg-red-600" style={{ width: `${Math.max(2, (d.count / max) * 100)}%` }} />
                </span>
              </span>
              <span className="w-14 text-right text-sm font-semibold text-slate-900 tabular-nums">{d.count.toLocaleString()}</span>
            </button>
          </li>
        ))}
      </ol>
      {rest.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-medium text-red-700 hover:underline"
            aria-expanded={showAll}
          >
            {showAll ? 'Show fewer' : `Show all ${sorted.length} countries`}
          </button>
          {showAll && (
            <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((d, i) => (
                <li key={d.country}>
                  <button
                    type="button"
                    onClick={() => onSelect(d.country)}
                    className="flex w-full items-baseline justify-between gap-2 rounded px-2 py-1 text-left hover:bg-slate-50"
                  >
                    <span className="truncate text-slate-700">
                      <span className="mr-2 text-xs text-slate-400 tabular-nums">{i + 11}</span>
                      {countryName(d.country)}
                    </span>
                    <span className="font-medium text-slate-900 tabular-nums">{d.count.toLocaleString()}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

// "56 states" was really 50 states + DC + 5 territories; say which.
function describeJurisdictions(codes: string[]): string {
  const states = codes.filter((c) => c in US_STATE_NAMES && c !== 'DC').length;
  const dc = codes.includes('DC');
  const territories = codes.filter((c) => !(c in US_STATE_NAMES)).length;
  const parts = [`${states} state${states === 1 ? '' : 's'}`];
  if (dc) parts.push('DC');
  if (territories) parts.push(`${territories} territor${territories === 1 ? 'y' : 'ies'}`);
  return parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

export default function GlobalMap() {
  useDocumentMeta({
    title: 'Global Threat Map',
    description: 'Real scam report activity by country, from the ScamShield National database.',
    path: '/global-map',
  });

  const navigate = useNavigate();
  const { data, isLoading, isError } = useCountsByCountry();
  const { data: stateCounts } = useDailyNewsStates();
  const { data: scamStateCounts } = useScamStates();

  // Documented scams lead: the map's first job is answering "do you cover my
  // state", and on the live-alert data alone two thirds of the map read as
  // "no data" while the database held entries for all 51.
  const [stateView, setStateView] = useState<'documented' | 'alerts'>('documented');
  const activeStateCounts = stateView === 'documented' ? scamStateCounts : stateCounts;
  // The section used to render only when the active view had rows, so one
  // failing request took the whole map off the page with nothing said. Either
  // view having data is enough to show the section; an empty active view
  // explains itself below.
  const hasAnyStateData = Boolean(scamStateCounts?.length || stateCounts?.length);
  const totalEntries = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;
  const topCountry = data && data.length > 0 ? data.reduce((a, b) => (b.count > a.count ? b : a)) : null;
  const nonUsShare =
    data && totalEntries > 0 ? (data.filter((d) => d.country !== 'US').reduce((s2, d) => s2 + d.count, 0) / totalEntries) * 100 : null;

  function handleCountryClick(country: string) {
    navigate(`/database?country=${encodeURIComponent(country)}`);
  }

  // Documented coverage now has a destination of its own — the state page,
  // which carries that state's AG office and live alerts alongside its
  // entries, rather than a filtered slice of the national database. The
  // alerts view still lands on the live feed, which is what it counts.
  function handleStateClick(code: string) {
    // Territories have no state page; their entries are a database filter.
    const hasStatePage = code in US_STATE_NAMES;
    const to =
      stateView === 'documented'
        ? hasStatePage
          ? `/states/${stateSlug(code)}`
          : `/database?state=${encodeURIComponent(code)}&view=all`
        : `/todays-scams?state=${encodeURIComponent(code)}`;
    navigate(to);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Global Threat Map</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Where scams are being documented</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Every dot is a country with entries in the curated ScamShield database, sized by how many. Spin the globe, tap a
        country to open its entries. This shows where activity has been recorded — not a prediction of where scams will
        happen next.
      </p>

      {data && data.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi value={totalEntries.toLocaleString()} label="Current documented entries" />
          <Kpi value={data.length.toLocaleString()} label="Countries with entries" />
          {topCountry && (
            <Kpi value={topCountry.count.toLocaleString()} label="Most documented country" sub={countryName(topCountry.country)} />
          )}
          {nonUsShare !== null && <Kpi value={`${nonUsShare.toFixed(0)}%`} label="Entries outside the US" />}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-slate-800 bg-[#0b1526] p-3 sm:p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {isLoading && <GlobePlaceholder label="Loading country data…" />}
          {isError && <p className="p-6 text-sm text-red-300">Couldn't load country data. Try refreshing.</p>}
          {data && data.length === 0 && <p className="p-6 text-sm text-slate-300">No country data recorded yet.</p>}
          {data && data.length > 0 && (
            <Suspense fallback={<GlobePlaceholder label="Loading globe…" />}>
              <Globe3D data={data} onCountryClick={handleCountryClick} />
            </Suspense>
          )}
        </div>

        <div className="h-[420px] rounded-2xl border border-slate-800 bg-[#0b1526] p-4 lg:h-auto lg:max-h-[640px]">
          <GlobalActivityTicker />
        </div>
      </div>

      {data && data.length > 0 && <CountryRanking data={data} onSelect={handleCountryClick} />}

      {hasAnyStateData && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-slate-900">Scams by US state</h2>

          {/* Two genuinely different questions, so two views rather than one
              compromise. Coverage answers "is my state in this database" and
              is complete; live alerts answer "what is happening now" and are
              sparse by nature — a state with no alert this month is quiet,
              not uncovered. */}
          <div className="mt-4 inline-flex rounded-lg border border-slate-300 p-1">
            {(
              [
                ['documented', 'Documented scams'],
                ['alerts', 'Live alerts · 30 days'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStateView(value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  stateView === value ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mt-3 max-w-2xl text-slate-600">
            {stateView === 'documented'
              ? 'Every scam in the database tied to a specific state — a state agency impersonation, a state AG alert, a state-run benefit program. Tap a state to open it. Brighter red means more entries, not more risk.'
              : 'Scam alerts from the last 30 days, tied to the state they were issued in, including alerts published directly by state Attorneys General. Click a state to read them. A quiet month is not the same as no coverage — switch to documented scams for the full picture.'}
          </p>

          <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0f1a2b] p-3 sm:p-6">
            {activeStateCounts && activeStateCounts.length > 0 ? (
              <Suspense
                fallback={<div className="h-[420px] flex items-center justify-center text-slate-400 text-sm">Loading map…</div>}
              >
                <UsStateMap
                  counts={activeStateCounts}
                  onStateClick={handleStateClick}
                  unit={stateView === 'documented' ? { singular: 'scam', plural: 'scams' } : { singular: 'alert', plural: 'alerts' }}
                />
              </Suspense>
            ) : (
              <div className="flex aspect-[8/5] items-center justify-center px-6 text-center text-sm text-slate-400">
                {stateView === 'documented'
                  ? 'No state data came back for documented scams. The other view may still have data.'
                  : 'No alerts recorded in the last 30 days. Switch to documented scams for the full picture.'}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-slate-500">
            {!activeStateCounts?.length ? null : stateView === 'documented' ? (
              <>
                {activeStateCounts.reduce((sum, s) => sum + s.total, 0).toLocaleString()} state-level listings across{' '}
                {describeJurisdictions(activeStateCounts.map((c) => c.state))}. A scam that targets several states is
                listed under each one, so this is more than the number of distinct scams.
              </>
            ) : (
              <>
                {activeStateCounts.reduce((sum, s) => sum + s.total, 0).toLocaleString()} alerts across{' '}
                {describeJurisdictions(activeStateCounts.map((c) => c.state))},{' '}
                {(stateCounts ?? []).reduce((sum, s) => sum + s.ag_count, 0)} published directly by a state Attorney
                General.
              </>
            )}
          </p>
        </section>
      )}
    </div>
  );
}
