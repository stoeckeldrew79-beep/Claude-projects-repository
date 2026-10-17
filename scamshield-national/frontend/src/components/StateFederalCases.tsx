import { Link } from 'react-router-dom';
import { useFederalCases } from '../hooks/useFederalCases';

// A state page's slice of the federal case archive: how many DOJ fraud
// cases came out of that state's US Attorneys' offices, and the newest
// few. Hidden when the archive has nothing for the state (or isn't
// deployed yet).
export function StateFederalCases({ code, name }: { code: string; name: string }) {
  const { data } = useFederalCases({ state: code });
  const first = data?.pages[0];
  if (!first || first.total === 0) return null;
  const latest = first.data.slice(0, 4);

  return (
    <section className="mt-10" aria-labelledby="state-federal-cases">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="state-federal-cases" className="text-2xl font-bold text-slate-900">
            Federal fraud cases in {name}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{first.total.toLocaleString()}</span> fraud{' '}
            {first.total === 1 ? 'case' : 'cases'} announced by U.S. Attorneys in {name}, from the Justice
            Department's own releases.
          </p>
        </div>
        <Link
          to={`/federal/cases?state=${code}`}
          className="text-sm font-semibold text-[#8a2e2e] hover:underline"
        >
          Search all {first.total.toLocaleString()} →
        </Link>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {latest.map((c) => (
          <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">
              {new Date(c.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}
              {c.office ? ` · ${c.office}` : ''}
            </p>
            <a href={c.url} target="_blank" rel="noreferrer" className="mt-1 block font-semibold leading-snug text-slate-900 hover:underline">
              {c.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
