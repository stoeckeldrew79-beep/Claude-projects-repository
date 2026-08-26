import { useDailyScamNews } from '../hooks/useDailyNews';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { DailyScamNews } from '../types';
import { BlurFade } from '../components/magicui/blur-fade';

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function NewsRow({ item }: { item: DailyScamNews }) {
  return (
    <a
      href={item.source_url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg border border-slate-200 p-4 hover:border-slate-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-slate-900 group-hover:underline">{item.headline}</h2>
        <span className="shrink-0 text-xs text-slate-400 whitespace-nowrap">
          {timeAgo(item.published_at ?? item.scanned_at)}
        </span>
      </div>
      {item.summary && <p className="mt-1.5 text-sm text-slate-600">{item.summary}</p>}
      <p className="mt-2 text-xs font-medium text-red-700">{item.source_name}</p>
    </a>
  );
}

export default function TodaysScams() {
  useDocumentMeta({
    title: "Today's Scams",
    description: 'Real scam-related news headlines from across the US, scanned automatically and updated daily.',
    path: '/todays-scams',
  });

  const { data: news, isLoading, isError } = useDailyScamNews();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <BlurFade>
        <p className="text-xs font-semibold tracking-widest text-red-700 uppercase">Live feed</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-bold text-slate-900">Today's Scams</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Real scam-related news from outlets across the US, scanned automatically and updated daily. Every headline
          links directly to the original story at its source — nothing here is written or verified by hand, so
          always read the full article before acting on it.
        </p>
      </BlurFade>

      {isLoading && <p className="mt-8 text-slate-500">Loading…</p>}
      {isError && <p className="mt-8 text-red-700">Couldn't load today's scam news.</p>}

      <div className="mt-8 space-y-3">
        {news?.map((item, i) => (
          <BlurFade key={item.id} delay={0.03 + i * 0.02} inView>
            <NewsRow item={item} />
          </BlurFade>
        ))}
        {news && news.length === 0 && <p className="text-slate-500">No scam news scanned yet — check back soon.</p>}
      </div>
    </div>
  );
}
