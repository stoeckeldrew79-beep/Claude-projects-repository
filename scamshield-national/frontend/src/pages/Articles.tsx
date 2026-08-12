import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

function excerpt(text: string, length = 160): string {
  const plain = text.replace(/[#*_`]/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

const FILTERS = [
  { tag: undefined, label: 'All' },
  { tag: 'guide', label: 'Guides' },
  { tag: 'notorious', label: 'Notorious' },
] as const;

export default function Articles() {
  useDocumentMeta({
    title: 'Articles',
    description: 'Historical scam features, fraud news, and how-to guides from ScamShield National.',
    path: '/articles',
  });

  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { data: articles, isLoading, isError } = useArticles(filter);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Articles</h1>
      <p className="text-slate-600 mb-6">
        How-to guides for recognizing common scams, plus the historical stories behind them.
      </p>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilter(f.tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              filter === f.tag
                ? 'bg-slate-900 text-white border-slate-900'
                : 'text-slate-600 border-slate-300 hover:border-slate-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {isError && <p className="text-red-700">Couldn't load articles.</p>}

      <div className="space-y-6">
        {articles?.map((article) => (
          <Link key={article.id} to={`/articles/${article.slug}`} className="block group border-b border-slate-100 pb-6">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:underline">{article.title}</h2>
            {article.author && <p className="text-xs text-slate-400 mt-0.5">By {article.author}</p>}
            <p className="text-sm text-slate-600 mt-2">{excerpt(article.body)}</p>
          </Link>
        ))}
        {articles && articles.length === 0 && <p className="text-slate-500">No articles published yet.</p>}
      </div>
    </div>
  );
}
