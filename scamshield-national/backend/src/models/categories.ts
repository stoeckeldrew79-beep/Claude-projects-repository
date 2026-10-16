import { pool } from '../db/connection';

// The categories table has its own scam_count column, but nothing in this
// codebase ever writes to it — it sits at its DEFAULT 0 forever. Computed
// live here instead, the same way states.ts already computes its own
// per-state scam_count rather than trusting a stored counter that could
// drift from the rows it's supposed to describe.
export async function listCategories() {
  const { rows } = await pool.query(`
    SELECT c.id, c.name, c.slug, c.icon, c.description,
           COUNT(s.id) FILTER (WHERE s.is_active = true AND s.is_historical = false)::int AS scam_count
    FROM categories c
    LEFT JOIN scams s ON s.category_id = c.id
    GROUP BY c.id, c.name, c.slug, c.icon, c.description
    ORDER BY c.name ASC
  `);
  return rows;
}

export async function getCategoryBySlug(slug: string) {
  const { rows } = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug]);
  if (!rows[0]) return null;

  const { rows: scams } = await pool.query(
    'SELECT * FROM scams WHERE category_id = $1 AND is_active = true ORDER BY created_at DESC',
    [rows[0].id]
  );
  return { ...rows[0], scams };
}

export interface CategoryTrend {
  category_id: string;
  name: string;
  slug: string;
  count_last_30d: number;
  count_prior_30d: number;
}

// What this counts, precisely: curated database ENTRIES (rows in `scams`,
// active and non-historical) whose created_at — the moment the entry was
// added to this database — falls in the last 30 days, against the 30 days
// before that, per category. It is NOT a count of victim reports or of
// scam incidents in the world: one entry documents one scam pattern, and
// entries arrive in batches when sources are reviewed. The frontend must
// say "entries added", never "reports". (It used to say "report volume".)
// country, when given, narrows the whole comparison to that country — both
// the "last 30 days" and "prior 30 days" sides — rather than just the
// visible bars, so a filtered Trend Watch reads as that country's own
// volume and trend, not the global trend re-labeled. $1::text IS NULL lets
// one query serve both the filtered and unfiltered case.
export async function categoryReportTrends(country?: string): Promise<CategoryTrend[]> {
  const { rows } = await pool.query(
    `
    SELECT
      c.id AS category_id,
      c.name,
      c.slug,
      COUNT(*) FILTER (WHERE s.created_at >= NOW() - INTERVAL '30 days') AS count_last_30d,
      COUNT(*) FILTER (
        WHERE s.created_at >= NOW() - INTERVAL '60 days'
          AND s.created_at < NOW() - INTERVAL '30 days'
      ) AS count_prior_30d
    FROM categories c
    JOIN scams s ON s.category_id = c.id AND s.is_active = true AND s.is_historical = false
    WHERE ($1::text IS NULL OR s.country = $1)
    GROUP BY c.id, c.name, c.slug
    HAVING COUNT(*) FILTER (WHERE s.created_at >= NOW() - INTERVAL '60 days') > 0
    ORDER BY count_last_30d DESC, c.name ASC
  `,
    [country ?? null]
  );
  return rows.map((r) => ({
    ...r,
    count_last_30d: Number(r.count_last_30d),
    count_prior_30d: Number(r.count_prior_30d),
  }));
}

export interface CategoryTrendsMeta {
  window_days: number;
  // When the earliest entry in scope was added. If it is inside the prior
  // window, a "0 before" is the database being younger than the
  // comparison, not a category that was quiet — the UI says so instead of
  // labelling everything "new activity".
  first_entry_at: string | null;
  total_last_30d: number;
  total_prior_30d: number;
}

export async function categoryTrendsMeta(country?: string): Promise<CategoryTrendsMeta> {
  const { rows } = await pool.query(
    `SELECT MIN(created_at) AS first_entry_at,
            COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS total_last_30d,
            COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '60 days'
                               AND created_at < NOW() - INTERVAL '30 days')::int AS total_prior_30d
     FROM scams
     WHERE is_active = true AND is_historical = false AND ($1::text IS NULL OR country = $1)`,
    [country ?? null]
  );
  const r = rows[0] ?? {};
  return {
    window_days: 30,
    first_entry_at: r.first_entry_at ? new Date(r.first_entry_at).toISOString() : null,
    total_last_30d: Number(r.total_last_30d ?? 0),
    total_prior_30d: Number(r.total_prior_30d ?? 0),
  };
}
