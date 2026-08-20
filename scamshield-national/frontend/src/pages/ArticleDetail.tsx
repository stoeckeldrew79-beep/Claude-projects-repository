import { Link, useParams } from 'react-router-dom';
import { useArticle } from '../hooks/useArticles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { NotoriousCoverArt } from '../components/NotoriousCoverArt';

// Strips the handful of markdown/HTML-ish characters a plain-text body
// might carry, just enough for a clean <meta description> excerpt.
function excerpt(text: string, length = 155): string {
  const plain = text.replace(/[#*_`]/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticle(slug);

  useDocumentMeta({
    title: article?.title ?? 'Article',
    description: article ? excerpt(article.body) : 'Historical scam features and fraud news.',
    path: `/articles/${slug}`,
  });

  if (isLoading) return <p className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Loading…</p>;
  if (isError || !article) return <p className="max-w-3xl mx-auto px-4 py-10 text-slate-500">Article not found.</p>;

  const isNotorious = article.tags?.includes('notorious');

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <Link to={isNotorious ? '/notorious' : '/articles'} className="text-sm text-slate-500 hover:underline">
        ← {isNotorious ? 'Notorious' : 'Articles'}
      </Link>
      <h1 className="text-3xl font-bold text-slate-900 mt-2">{article.title}</h1>
      {article.author && <p className="text-sm text-slate-500 mt-1">By {article.author}</p>}
      {article.cover_image ? (
        <div className="mt-6">
          <img
            src={article.cover_image}
            alt={article.title}
            className="rounded-lg w-full h-56 object-cover"
          />
          {article.cover_image_credit && (
            <p className="mt-1 text-xs text-slate-400 text-right">{article.cover_image_credit}</p>
          )}
        </div>
      ) : (
        isNotorious && <NotoriousCoverArt slug={article.slug} className="mt-6 rounded-lg h-56" />
      )}
      <div className="mt-6 text-slate-700 whitespace-pre-line leading-relaxed">{article.body}</div>
      {article.scam_slug && (
        <Link to={`/scams/${article.scam_slug}`} className="inline-block mt-8 text-sm underline text-slate-600">
          Related scam entry →
        </Link>
      )}
    </article>
  );
}
