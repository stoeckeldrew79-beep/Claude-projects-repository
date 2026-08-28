import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { NotoriousCoverArt } from '../components/NotoriousCoverArt';
import { BlurFade } from '../components/magicui/blur-fade';

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
    <div className="max-w-5xl mx-auto px-4 py-10">
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

      <div className="grid gap-6 sm:grid-cols-2">
        {articles?.map((article, i) => (
          <BlurFade key={article.id} delay={0.04 + i * 0.03} inView>
            <Link
              to={`/articles/${article.slug}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="h-40 sm:h-48 overflow-hidden">
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: `50% ${article.cover_image_position ?? 50}%` }}
                  />
                ) : (
                  <NotoriousCoverArt slug={article.slug} className="h-full transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-900 group-hover:underline">{article.title}</h2>
                {article.author && <p className="text-xs text-slate-400 mt-0.5">By {article.author}</p>}
                <p className="mt-2 text-sm text-slate-600">{excerpt(article.body)}</p>
              </div>
            </Link>
          </BlurFade>
        ))}
        {articles && articles.length === 0 && <p className="text-slate-500 col-span-2">No articles published yet.</p>}
      </div>
    </div>
  );
}
