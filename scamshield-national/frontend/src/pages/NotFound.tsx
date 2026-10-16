import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const SUGGESTIONS = [
  { to: '/check-now', label: 'Check something now', body: 'Is this call, text or link a scam?' },
  { to: '/todays-scams', label: "Today's scams", body: 'The latest official warnings' },
  { to: '/database', label: 'Scam database', body: 'Search every documented scam' },
  { to: '/report', label: 'Report a scam', body: 'Tell us what happened' },
];

export default function NotFound() {
  useDocumentMeta({ title: 'Page not found', description: "This page doesn't exist.", noindex: true });

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <p className="text-xs font-semibold tracking-widest text-[#8a2e2e] uppercase">Error 404</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">We couldn't find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-slate-600">
        The link may be out of date, or the page may have moved. Here are some good places to go instead.
      </p>
      <div className="mt-10 grid gap-3 text-left sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300"
          >
            <p className="font-semibold text-slate-900 group-hover:text-[#8a2e2e]">{s.label} →</p>
            <p className="mt-0.5 text-sm text-slate-500">{s.body}</p>
          </Link>
        ))}
      </div>
      <Link to="/" className="mt-8 inline-block text-sm font-medium text-slate-600 underline hover:text-slate-900">
        Back to the home page
      </Link>
    </div>
  );
}
