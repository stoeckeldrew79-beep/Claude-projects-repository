import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Articles() {
  useDocumentMeta({
    title: 'Articles',
    description: 'Historical scam features, fraud news, and how-to guides from ScamShield National.',
    path: '/articles',
  });

  const { data: articles, isLoading, isError } = useArticles();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Articles</h1>

      {isLoading && <p className="text-slate-500">Loading…</p>}
      {isError && <p className="text-red-700">Couldn't load articles.</p>}

      <div className="space-y-6">
        {articles?.map((article) => (
          <Link key={article.id} to={`/articles/${article.slug}`} className="block group">
            <h2 className="text-lg font-semibold text-slate-900 group-hover:underline">{article.title}</h2>
            {article.author && <p className="text-sm text-slate-500">By {article.author}</p>}
          </Link>
        ))}
        {articles && articles.length === 0 && <p className="text-slate-500">No articles published yet.</p>}
      </div>
    </div>
  );
}
