import { useState } from 'react';
import { useCategories, useCountries, useScams } from '../hooks/useScams';
import { ScamCard } from '../components/ScamCard';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { TrendWatch } from '../components/TrendWatch';
import { countryName } from '../utils/countries';

export default function Database() {
  useDocumentMeta({
    title: 'Scam Database',
    description: 'Browse and search the full national database of recorded scam activity by category, state, and date.',
    path: '/database',
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);
  const { data: categories } = useCategories();
  const { data: countries } = useCountries();
  const { data: scams, isLoading } = useScams({ search: search || undefined, category, country });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Scam Database</h1>

      <div className="mb-8">
        <TrendWatch />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scams…"
          className="flex-1 min-w-[200px] rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          value={category ?? ''}
          onChange={(e) => setCategory(e.target.value || undefined)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        {countries && countries.length > 1 && (
          <select
            value={country ?? ''}
            onChange={(e) => setCountry(e.target.value || undefined)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {countryName(c)}
              </option>
            ))}
          </select>
        )}
      </div>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scams?.map((scam) => (
          <ScamCard key={scam.id} scam={scam} />
        ))}
      </div>
      {scams && scams.length === 0 && <p className="text-slate-500">No scams match your filters.</p>}
    </div>
  );
}
