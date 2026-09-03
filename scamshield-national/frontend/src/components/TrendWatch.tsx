import { useState } from 'react';
import { useCategoryTrends } from '../hooks/useCategoryTrends';
import { CategoryTrend } from '../services/trends';

// Real report-volume comparison (last 30 days vs. the 30 days before),
// computed directly from the scams table — not a forecast of specific
// future scams. Single-hue sequential bar chart per the dataviz method:
// magnitude comparison across categories gets one hue, not a rainbow.
// Light-mode only, matching the rest of this app (which doesn't have a
// dark theme yet) — the CSS custom properties below are still scoped
// per the method's convention so dark mode is a drop-in later.
const MIN_TOTAL_REPORTS_FOR_CHART = 5;

function formatDelta(trend: CategoryTrend): { label: string; tone: 'up' | 'down' | 'flat' | 'new' } {
  if (trend.count_prior_30d === 0) {
    return trend.count_last_30d > 0 ? { label: 'New activity', tone: 'new' } : { label: 'No change', tone: 'flat' };
  }
  const pct = Math.round(((trend.count_last_30d - trend.count_prior_30d) / trend.count_prior_30d) * 100);
  if (pct === 0) return { label: 'No change', tone: 'flat' };
  return { label: `${pct > 0 ? '+' : ''}${pct}% vs. prior 30 days`, tone: pct > 0 ? 'up' : 'down' };
}

export function TrendWatch() {
  const { data: trends, isLoading, isError } = useCategoryTrends();
  const [tableView, setTableView] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const totalReports = trends?.reduce((sum, t) => sum + t.count_last_30d, 0) ?? 0;
  const maxCount = Math.max(1, ...(trends?.map((t) => t.count_last_30d) ?? [1]));

  return (
    <section
      className="viz-root rounded-xl border border-slate-200 p-6"
      style={
        {
          '--surface-1': '#fcfcfb',
          '--text-primary': '#0b0b0b',
          '--text-secondary': '#52514e',
          '--muted': '#898781',
          '--series-1': '#2a78d6',
          '--gridline': '#e1e0d9',
          '--good': '#006300',
        } as React.CSSProperties
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Trend Watch
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Real report volume by category, last 30 days vs. the 30 days before — not a prediction of specific
            future scams, just what's actually being reported right now.
          </p>
        </div>
        {trends && totalReports >= MIN_TOTAL_REPORTS_FOR_CHART && (
          <button
            type="button"
            onClick={() => setTableView((v) => !v)}
            className="shrink-0 text-xs font-medium underline"
            style={{ color: 'var(--text-secondary)' }}
          >
            {tableView ? 'Show chart' : 'Show table'}
          </button>
        )}
      </div>

      {isLoading && (
        <p className="mt-6 text-sm" style={{ color: 'var(--muted)' }}>
          Loading…
        </p>
      )}
      {isError && (
        <p className="mt-6 text-sm text-red-700">Couldn't load trend data.</p>
      )}

      {trends && totalReports < MIN_TOTAL_REPORTS_FOR_CHART && (
        <p className="mt-6 text-sm" style={{ color: 'var(--muted)' }}>
          Not enough recorded activity yet to show a meaningful trend. This fills in as more scams are reported.
        </p>
      )}

      {trends && totalReports >= MIN_TOTAL_REPORTS_FOR_CHART && tableView && (
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: 'var(--muted)' }}>
              <th className="font-medium pb-2">Category</th>
              <th className="font-medium pb-2 text-right">Last 30 days</th>
              <th className="font-medium pb-2 text-right">Prior 30 days</th>
              <th className="font-medium pb-2 text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((t) => {
              const delta = formatDelta(t);
              return (
                <tr key={t.category_id} style={{ borderTop: '1px solid var(--gridline)' }}>
                  <td className="py-2" style={{ color: 'var(--text-primary)' }}>
                    {t.name}
                  </td>
                  <td className="py-2 text-right" style={{ color: 'var(--text-primary)' }}>
                    {t.count_last_30d}
                  </td>
                  <td className="py-2 text-right" style={{ color: 'var(--text-secondary)' }}>
                    {t.count_prior_30d}
                  </td>
                  <td
                    className="py-2 text-right"
                    style={{ color: delta.tone === 'up' ? 'var(--good)' : 'var(--text-secondary)' }}
                  >
                    {delta.label}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {trends && totalReports >= MIN_TOTAL_REPORTS_FOR_CHART && !tableView && (
        <div className="mt-6 space-y-3">
          {trends.map((t) => {
            const delta = formatDelta(t);
            const widthPct = Math.max(4, (t.count_last_30d / maxCount) * 100);
            const isHovered = hovered === t.category_id;
            return (
              <div
                key={t.category_id}
                className="relative"
                onPointerEnter={() => setHovered(t.category_id)}
                onPointerLeave={() => setHovered(null)}
              >
                <div className="flex items-baseline justify-between text-sm mb-1">
                  <span style={{ color: 'var(--text-primary)' }}>{t.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{t.count_last_30d}</span>
                </div>
                <div className="h-[10px] rounded-[4px] overflow-hidden" style={{ backgroundColor: 'var(--gridline)' }}>
                  <div
                    className="h-full rounded-[4px] transition-all"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: 'var(--series-1)',
                      opacity: isHovered ? 1 : 0.9,
                    }}
                  />
                </div>
                {isHovered && (
                  <div
                    className="absolute left-0 top-full mt-1 z-10 rounded-md border px-3 py-2 text-xs shadow-sm"
                    style={{
                      backgroundColor: 'var(--surface-1)',
                      borderColor: 'var(--gridline)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <strong>{t.count_last_30d}</strong> reports in the last 30 days ·{' '}
                    <span style={{ color: 'var(--text-secondary)' }}>{delta.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
