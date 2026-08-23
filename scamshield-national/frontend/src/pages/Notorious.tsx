import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { NotoriousCoverArt } from '../components/NotoriousCoverArt';
import { BlurFade } from '../components/magicui/blur-fade';

function excerpt(text: string, length = 180): string {
  const plain = text.replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

export default function Notorious() {
  useDocumentMeta({
    title: 'Notorious Scams & Scammers',
    description:
      'The true stories behind history’s most infamous cons — from Charles Ponzi to Bernie Madoff — and the psychology that made them work.',
    path: '/notorious',
  });

  const { data: articles, isLoading, isError } = useArticles('notorious');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <BlurFade>
        <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Notorious</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Scams & Scammers</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The true stories behind history's most infamous cons — how they worked, why they fooled so many people,
          and what happened when they finally fell apart.
        </p>
      </BlurFade>

      {isLoading && <p className="mt-8 text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-red-700">Couldn't load this collection.</p>}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {articles?.map((article, i) => (
          <BlurFade key={article.id} delay={0.06 + i * 0.05} inView>
            <Link
              to={`/articles/${article.slug}`}
              className="group block overflow-hidden rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all"
            >
              <div className="h-44 overflow-hidden">
                {article.cover_image ? (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: `50% ${article.cover_image_position}%` }}
                  />
                ) : (
                  <NotoriousCoverArt slug={article.slug} className="h-full transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-5">
                <h2 className="text-lg font-semibold text-slate-900 group-hover:underline">{article.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{excerpt(article.body)}</p>
              </div>
            </Link>
          </BlurFade>
        ))}
        {articles && articles.length === 0 && (
          <p className="text-slate-500 col-span-2">No entries published yet.</p>
        )}
      </div>
    </div>
  );
}
