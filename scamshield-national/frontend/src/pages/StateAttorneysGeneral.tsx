import { useMemo, useState } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useStateAgSources } from '../hooks/useStateAgSources';
import { StateAgSource } from '../types';

function StateCard({ source }: { source: StateAgSource }) {
  return (
    <div className="rounded-lg border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{source.state_name}</p>
          <h2 className="mt-0.5 font-semibold text-slate-900">{source.agency_name}</h2>
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-1 rounded-full ${
            source.has_published_reports ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {source.has_published_reports ? 'Publishes reports' : 'Complaint intake only'}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-600">{source.description}</p>
      <div className="mt-2 flex flex-col gap-1">
        <a href={source.consumer_protection_url} target="_blank" rel="noreferrer" className="text-sm text-red-700 underline">
          Consumer protection office →
        </a>
        {source.reports_url && (
          <a href={source.reports_url} target="_blank" rel="noreferrer" className="text-sm text-red-700 underline">
            Published reports / press releases →
          </a>
        )}
      </div>
    </div>
  );
}

export default function StateAttorneysGeneralPage() {
  useDocumentMeta({
    title: 'State Attorneys General',
    description: "Every US state's Attorney General consumer protection office, with links to file a complaint and any published fraud reports.",
    path: '/state-attorneys-general',
  });

  const { data, isLoading, isError } = useStateAgSources();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (s) => s.state_name.toLowerCase().includes(q) || s.state.toLowerCase() === q || s.agency_name.toLowerCase().includes(q)
    );
  }, [data, search]);

  const reportCount = data?.filter((s) => s.has_published_reports).length ?? 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">State Consumer Protection</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">State Attorneys General, nationwide</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Every state runs its own consumer protection office inside the Attorney General's office, and many field scam
        complaints directly, separate from the FTC and FBI. This page links to each one directly — where a state
        publishes a real consumer-fraud report or press release archive, that's linked here too, checked against the
        office's own site before it's added.
      </p>

      {data && !isLoading && (
        <p className="mt-4 text-sm text-slate-500">
          {data.length} states and territories listed — {reportCount} publish their own fraud reports or press releases.
        </p>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by state..."
        className="mt-6 w-full max-w-sm rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
      />

      {isLoading && <p className="mt-8 text-sm text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-sm text-red-700">Couldn't load state Attorney General sources.</p>}

      {data && filtered.length === 0 && <p className="mt-8 text-sm text-slate-500">No states match "{search}".</p>}

      {data && filtered.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((source) => (
            <StateCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}
