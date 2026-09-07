import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountsByCountry } from '../hooks/useGlobe';
import { useDailyNewsStates } from '../hooks/useDailyNews';
import { useScamStates } from '../hooks/useScams';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { GlobalActivityTicker } from '../components/GlobalActivityTicker';

// Code-split: three.js only loads when someone visits this page, not on
// every page load.
const Globe3D = lazy(() => import('../components/Globe3D').then((m) => ({ default: m.Globe3D })));

// Same treatment: the US map pulls in d3-geo and the state topology, which
// nothing else on the site needs.
const UsStateMap = lazy(() => import('../components/UsStateMap').then((m) => ({ default: m.UsStateMap })));

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
  const totalReports = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  function handleCountryClick(country: string) {
    navigate(`/database?country=${encodeURIComponent(country)}`);
  }

  // Each view sends you where its own numbers live: the shading you clicked
  // has to be the thing you land on, or the map is lying about what it counts.
  function handleStateClick(code: string) {
    const to =
      stateView === 'documented'
        ? `/database?state=${encodeURIComponent(code)}`
        : `/todays-scams?state=${encodeURIComponent(code)}`;
    navigate(to);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Global Threat Map</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Where scams are being reported</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Real report counts by country, from the curated public database — drag to rotate, scroll or pinch to zoom,
        click a marker to see that country's reports. This shows where activity has actually been recorded, not a
        prediction of where scams will happen next.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="rounded-xl border border-slate-200 bg-[#0f1a2b] p-6">
          {isLoading && <p className="text-slate-300 text-sm">Loading…</p>}
          {isError && <p className="text-red-300 text-sm">Couldn't load report data.</p>}
          {data && data.length === 0 && <p className="text-slate-300 text-sm">No country data recorded yet.</p>}
          {data && data.length > 0 && (
            <Suspense fallback={<div className="h-[420px] flex items-center justify-center text-slate-400 text-sm">Loading globe…</div>}>
              <Globe3D data={data} onCountryClick={handleCountryClick} />
            </Suspense>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-[#0f1a2b] p-4 lg:max-h-[500px]">
          <GlobalActivityTicker />
        </div>
      </div>

      {data && data.length > 0 && (
        <p className="mt-4 text-sm text-slate-500">{totalReports} total reports across {data.length} countries.</p>
      )}

      {hasAnyStateData && (
        <section className="mt-12">
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
              ? 'Every scam in the database tied to a specific state — a state agency impersonation, a state AG alert, a state-run benefit program. Click a state to browse them. Shading shows how many entries each state has, not how risky it is.'
              : 'Scam alerts from the last 30 days, tied to the state they were issued in, including alerts published directly by state Attorneys General. Click a state to read them. A quiet month is not the same as no coverage — switch to documented scams for the full picture.'}
          </p>

          <div className="mt-6 rounded-xl border border-slate-200 bg-[#0f1a2b] p-6">
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
              <div className="flex h-[420px] items-center justify-center px-6 text-center text-sm text-slate-400">
                {stateView === 'documented'
                  ? 'No state data came back for documented scams. The other view may still have data.'
                  : 'No alerts recorded in the last 30 days. Switch to documented scams for the full picture.'}
              </div>
            )}
          </div>

          <p className="mt-4 text-sm text-slate-500">
            {!activeStateCounts?.length ? null : stateView === 'documented' ? (
              <>
                {activeStateCounts.reduce((sum, s) => sum + s.total, 0).toLocaleString()} documented scams across{' '}
                {activeStateCounts.length} states and territories.
              </>
            ) : (
              <>
                {activeStateCounts.reduce((sum, s) => sum + s.total, 0)} alerts across {activeStateCounts.length} states,{' '}
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
