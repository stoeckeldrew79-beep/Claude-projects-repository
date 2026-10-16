import { useMemo } from 'react';
import { useDailyScamNews, useLatestAgByState } from '../../hooks/useDailyNews';

export interface OfficialAlert {
  key: string;
  headline: string;
  source_name: string;
  source_url: string;
  kind: 'ag' | 'federal';
  /** Two-letter state for AG items; null for federal. */
  state: string | null;
  published_at: string | null;
}

function time(iso: string | null) {
  return iso ? new Date(iso).getTime() : 0;
}

// The newest first-party enforcement items we hold: state Attorney General
// publications plus DOJ/FTC releases — never press coverage. Merged from
// three public endpoints, each optional: if one is unavailable (e.g. an
// older API without /daily-news/latest-by-state) the rest still render.
export function useOfficialAlerts(limit = 6) {
  const federal = useDailyScamNews('US');
  const latestAg = useLatestAgByState();
  const feed = useDailyScamNews();

  const items = useMemo(() => {
    const out = new Map<string, OfficialAlert>();
    const add = (a: OfficialAlert) => {
      if (!a.source_url || out.has(a.source_url)) return;
      out.set(a.source_url, a);
    };

    // A federal release isn't "news"; only first-party kinds are kept.
    for (const n of federal.data ?? []) {
      if (n.source_kind !== 'federal' && n.source_kind !== 'ag') continue;
      add({
        key: n.id,
        headline: n.headline,
        source_name: n.source_name,
        source_url: n.source_url,
        kind: n.source_kind,
        state: n.source_kind === 'ag' ? n.state : null,
        published_at: n.published_at ?? n.scanned_at,
      });
    }
    for (const n of feed.data ?? []) {
      if (n.source_kind !== 'ag') continue;
      add({
        key: n.id,
        headline: n.headline,
        source_name: n.source_name,
        source_url: n.source_url,
        kind: 'ag',
        state: n.state,
        published_at: n.published_at ?? n.scanned_at,
      });
    }
    for (const a of Array.isArray(latestAg.data) ? latestAg.data : []) {
      add({
        key: `ag-${a.state}-${a.source_url}`,
        headline: a.headline,
        source_name: a.source_name,
        source_url: a.source_url,
        kind: 'ag',
        state: a.state,
        published_at: a.published_at,
      });
    }

    // Newest first, but don't let one burst from a single publisher (DOJ
    // often posts a dozen releases at once) fill the whole list: at most two
    // per source in the first pass, then backfill if there's room.
    const sorted = [...out.values()].sort((a, b) => time(b.published_at) - time(a.published_at));
    const perSource = new Map<string, number>();
    const picked: OfficialAlert[] = [];
    const rest: OfficialAlert[] = [];
    for (const a of sorted) {
      const n = perSource.get(a.source_name) ?? 0;
      if (n < 2) {
        picked.push(a);
        perSource.set(a.source_name, n + 1);
      } else rest.push(a);
    }
    return [...picked, ...rest].slice(0, limit).sort((a, b) => time(b.published_at) - time(a.published_at));
  }, [federal.data, feed.data, latestAg.data, limit]);

  const isLoading = (federal.isLoading || feed.isLoading) && items.length === 0;
  const isError = federal.isError && feed.isError && latestAg.isError;

  return { items, isLoading, isError };
}
