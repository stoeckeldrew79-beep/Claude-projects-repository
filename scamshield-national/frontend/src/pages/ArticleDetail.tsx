import { Link, useParams } from 'react-router-dom';
import { useArticle, useRelatedArticles } from '../hooks/useArticles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { NotoriousCoverArt } from '../components/NotoriousCoverArt';
import { CoverImage } from '../components/CoverImage';
import { ShareButton } from '../components/ShareButton';
import { displayAuthor } from '../utils/brand';

// Strips the handful of markdown/HTML-ish characters a plain-text body
// might carry, just enough for a clean <meta description> excerpt.
function excerpt(text: string, length = 155): string {
  const plain = text.replace(/[#*_`]/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > length ? `${plain.slice(0, length - 1)}…` : plain;
}

// Bodies are plain text with blank lines between paragraphs. Splitting them
// into real <p>s gives the reader paragraph spacing and a lead paragraph
// instead of one pre-wrapped block.
function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 230));
}

// Collection tags say which shelf an article sits on; everything else
// describes its subject. Only subject tags are shown or used for "related".
const COLLECTION_TAGS = new Set(['notorious', 'notorious-scammer', 'guide', 'historical', 'international', 'ai-draft']);

function tagLabel(tag: string): string {
  return tag.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticle(slug);

  const isNotorious = Boolean(article?.tags?.includes('notorious'));
  const subjectTags = (article?.tags ?? []).filter((t) => !COLLECTION_TAGS.has(t));
  const collection = isNotorious ? 'notorious' : article?.tags?.includes('guide') ? 'guide' : null;
  const { data: related } = useRelatedArticles(
    article && collection ? { tag: collection, tags: subjectTags[0], exclude: article.slug } : null
  );

  useDocumentMeta({
    title: article?.title ?? 'Article',
    description: article ? excerpt(article.body) : 'Historical scam features and fraud news.',
    path: `/articles/${slug}`,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10" aria-busy>
        <div className="h-4 w-24 rounded bg-slate-100" />
        <div className="mt-4 h-9 w-4/5 rounded bg-slate-100" />
        <div className="mt-6 h-56 rounded-xl bg-slate-100 sm:h-80" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-4 rounded bg-slate-50" />
          ))}
        </div>
      </div>
    );
  }
  if (isError || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Article not found</h1>
        <p className="mt-2 text-slate-600">It may have been renamed or removed.</p>
        <Link to="/articles" className="mt-4 inline-block text-sm font-semibold text-red-700 underline">
          Browse all articles →
        </Link>
      </div>
    );
  }

  const paras = paragraphs(article.body);
  const published = formatDate(article.published_at);
  const backTo = isNotorious ? '/notorious' : '/articles';
  const backLabel = isNotorious ? 'Notorious' : 'Articles';

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <nav className="text-sm text-slate-500">
        <Link to={backTo} className="hover:text-slate-800 hover:underline">
          ← {backLabel}
        </Link>
      </nav>

      <p className="mt-4 text-xs font-bold tracking-widest text-red-700 uppercase">
        {isNotorious ? 'Notorious case file' : article.tags?.includes('guide') ? 'Scam guide' : 'Article'}
      </p>
      <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
        {article.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
        {article.author && <span>By {displayAuthor(article.author)}</span>}
        {published && <span>{published}</span>}
        <span>{readingMinutes(article.body)} min read</span>
        <ShareButton title={article.title} text={excerpt(article.body, 120)} className="ml-auto" />
      </div>

      <figure className="mt-6">
        {article.cover_image ? (
          <CoverImage
            src={article.cover_image}
            alt={article.title}
            slug={article.slug}
            position={article.cover_image_position}
            className="h-56 w-full rounded-xl object-cover sm:h-80"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        ) : (
          isNotorious && <NotoriousCoverArt slug={article.slug} className="h-56 overflow-hidden rounded-xl sm:h-80" />
        )}
        {article.cover_image && article.cover_image_credit && (
          <figcaption className="mt-1.5 text-right text-xs text-slate-400">{article.cover_image_credit}</figcaption>
        )}
      </figure>

      <div className="mt-8 space-y-5 text-[17px] leading-8 text-slate-700">
        {paras.map((p, i) => (
          <p key={i} className={i === 0 ? 'text-lg leading-8 text-slate-900 sm:text-xl sm:leading-9' : undefined}>
            {p}
          </p>
        ))}
      </div>

      {(article.source_url || article.scam_slug) && (
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-slate-200 p-4 hover:border-slate-400"
            >
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Primary source</p>
              <p className="mt-1 font-semibold text-slate-900 group-hover:underline">Read the full story ↗</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{hostname(article.source_url)}</p>
            </a>
          )}
          {article.scam_slug && (
            <Link
              to={`/scams/${article.scam_slug}`}
              className="group rounded-xl border border-red-200 bg-red-50/50 p-4 hover:border-red-300"
            >
              <p className="text-[11px] font-bold tracking-wider text-red-700 uppercase">In the database</p>
              <p className="mt-1 font-semibold text-slate-900 group-hover:underline">See the related scam entry →</p>
              <p className="mt-0.5 text-xs text-slate-500">Red flags and where to report it</p>
            </Link>
          )}
        </div>
      )}

      {subjectTags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {subjectTags.map((t) => (
            <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {tagLabel(t)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-10 rounded-xl bg-[#0f1a2b] p-5 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-semibold">Seen something like this?</p>
          <p className="mt-1 text-sm text-slate-300">
            Reporting it helps us warn others — it takes about two minutes.
          </p>
        </div>
        <Link
          to="/report"
          className="mt-4 inline-block shrink-0 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 sm:mt-0"
        >
          Report a scam
        </Link>
      </div>

      {related && related.length > 0 && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-bold text-slate-900">{isNotorious ? 'More notorious cases' : 'Keep reading'}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/articles/${r.slug}`}
                className="group overflow-hidden rounded-xl border border-slate-200 hover:border-slate-400"
              >
                <div className="h-28 overflow-hidden bg-slate-100">
                  {r.cover_image ? (
                    <CoverImage
                      src={r.cover_image}
                      alt={r.title}
                      slug={r.slug}
                      position={r.cover_image_position}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <NotoriousCoverArt slug={r.slug} className="h-full" />
                  )}
                </div>
                <p className="p-3 text-sm font-semibold leading-snug text-slate-900 line-clamp-3 group-hover:underline">
                  {r.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
