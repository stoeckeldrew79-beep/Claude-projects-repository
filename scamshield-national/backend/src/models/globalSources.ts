import { pool } from '../db/connection';

export interface GlobalSource {
  id: string;
  agency_name: string;
  country: string;
  country_name: string;
  url: string;
  description: string;
  data_type: 'annual_report' | 'open_dataset' | 'public_stats';
}

export interface GlobalStat {
  id: string;
  source_id: string;
  period_label: string;
  headline: string;
  report_count: number | null;
  loss_amount: number | null;
  currency: string | null;
  top_category: string | null;
  source_url: string;
  published_date: string | null;
}

// Sources with their published stats nested, newest first — this is the
// shape the "Global Scam Intelligence" page renders directly.
export async function listSourcesWithStats() {
  const { rows: sources } = await pool.query<GlobalSource>(
    `SELECT * FROM global_sources ORDER BY (country = 'US') DESC, country_name ASC`
  );
  const { rows: stats } = await pool.query<GlobalStat>(
    `SELECT * FROM global_stats ORDER BY published_date DESC NULLS LAST, created_at DESC`
  );

  return sources.map((source) => ({
    ...source,
    stats: stats.filter((stat) => stat.source_id === source.id),
  }));
}

export async function createStat(data: Partial<GlobalStat>) {
  const { rows } = await pool.query(
    `INSERT INTO global_stats (source_id, period_label, headline, report_count, loss_amount, currency, top_category, source_url, published_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.source_id,
      data.period_label,
      data.headline,
      data.report_count ?? null,
      data.loss_amount ?? null,
      data.currency ?? null,
      data.top_category ?? null,
      data.source_url,
      data.published_date ?? null,
    ]
  );
  return rows[0];
}

export async function deleteStat(id: string) {
  const { rows } = await pool.query('DELETE FROM global_stats WHERE id = $1 RETURNING id', [id]);
  return rows[0];
}
