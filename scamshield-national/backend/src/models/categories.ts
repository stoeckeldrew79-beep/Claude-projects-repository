import { pool } from '../db/connection';

export async function listCategories() {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
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

// Real, DB-derived report-volume comparison — current 30-day window vs.
// the 30 days before it. This is pattern analysis over recorded report
// counts, not a forecast of specific future scams; the frontend must
// label it accordingly.
export async function categoryReportTrends(): Promise<CategoryTrend[]> {
  const { rows } = await pool.query(`
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
    GROUP BY c.id, c.name, c.slug
    HAVING COUNT(*) FILTER (WHERE s.created_at >= NOW() - INTERVAL '60 days') > 0
    ORDER BY count_last_30d DESC, c.name ASC
  `);
  return rows.map((r) => ({
    ...r,
    count_last_30d: Number(r.count_last_30d),
    count_prior_30d: Number(r.count_prior_30d),
  }));
}
