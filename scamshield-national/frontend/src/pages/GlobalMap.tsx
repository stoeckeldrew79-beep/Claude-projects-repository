import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountsByCountry } from '../hooks/useGlobe';
import { useDailyNewsStates } from '../hooks/useDailyNews';
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
  const totalReports = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  function handleCountryClick(country: string) {
    navigate(`/database?country=${encodeURIComponent(country)}`);
  }

  function handleStateClick(code: string) {
    navigate(`/todays-scams?state=${encodeURIComponent(code)}`);
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

      {stateCounts && stateCounts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Alerts by US state</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Live scam alerts from the last 30 days, tied to the state they were issued in — including alerts
            published directly by state Attorneys General. Click a state to read them. Shading shows how many
            alerts each state has recorded, not how risky the state is.
          </p>
          <div className="mt-6 rounded-xl border border-slate-200 bg-[#0f1a2b] p-6">
            <Suspense
              fallback={<div className="h-[420px] flex items-center justify-center text-slate-400 text-sm">Loading map…</div>}
            >
              <UsStateMap counts={stateCounts} onStateClick={handleStateClick} />
            </Suspense>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            {stateCounts.reduce((sum, s) => sum + s.total, 0)} alerts across {stateCounts.length} states,{' '}
            {stateCounts.reduce((sum, s) => sum + s.ag_count, 0)} published directly by a state Attorney General.
          </p>
        </section>
      )}
    </div>
  );
}
