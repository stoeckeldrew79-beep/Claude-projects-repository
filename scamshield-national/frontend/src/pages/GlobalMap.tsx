import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountsByCountry } from '../hooks/useGlobe';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { GlobalActivityTicker } from '../components/GlobalActivityTicker';

// Code-split: three.js only loads when someone visits this page, not on
// every page load.
const Globe3D = lazy(() => import('../components/Globe3D').then((m) => ({ default: m.Globe3D })));

export default function GlobalMap() {
  useDocumentMeta({
    title: 'Global Threat Map',
    description: 'Real scam report activity by country, from the ScamShield National database.',
    path: '/global-map',
  });

  const navigate = useNavigate();
  const { data, isLoading, isError } = useCountsByCountry();
  const totalReports = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  function handleCountryClick(country: string) {
    navigate(`/database?country=${encodeURIComponent(country)}`);
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
    </div>
  );
}
