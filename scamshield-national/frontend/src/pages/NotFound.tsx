import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function NotFound() {
  useDocumentMeta({ title: 'Page not found', description: 'This page doesn\'t exist.', noindex: true });

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">404</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-slate-600">
        The page you're looking for doesn't exist, or the link may be out of date.
      </p>
      <div className="mt-6 flex justify-center gap-4 text-sm">
        <Link to="/" className="underline text-slate-700 hover:text-slate-900">
          Go home
        </Link>
        <Link to="/database" className="underline text-slate-700 hover:text-slate-900">
          Browse the scam database
        </Link>
      </div>
    </div>
  );
}
