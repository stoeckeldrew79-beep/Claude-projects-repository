import { Link } from 'react-router-dom';
import { useScams } from '../hooks/useScams';
import { ScamCard } from '../components/ScamCard';

export default function Home() {
  const { data: scams, isLoading } = useScams({ sort: 'newest', page: 1 });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">Know the scam before it reaches you.</h1>
        <p className="mt-3 text-slate-600">
          Search the national database of recorded scam activity, from historical fraud to today's alerts.
        </p>
        <Link
          to="/database"
          className="inline-block mt-6 px-5 py-2.5 rounded-md bg-slate-900 text-white font-medium"
        >
          Browse the database
        </Link>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Recently added</h2>
        {isLoading && <p className="text-slate-500">Loading…</p>}
        <div className="grid gap-4 sm:grid-cols-2">
          {scams?.slice(0, 4).map((scam) => (
            <ScamCard key={scam.id} scam={scam} />
          ))}
        </div>
      </section>
    </div>
  );
}
