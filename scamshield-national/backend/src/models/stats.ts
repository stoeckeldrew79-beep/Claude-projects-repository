import { pool } from '../db/connection';

export interface SiteStats {
  scams: number;
  categories: number;
  countries: number;
  sources: number;
}

// Every number here is a live COUNT(*) against real tables — no
// hardcoded or fabricated figures. "countries" unions scams.country
// with global_sources.country so it reflects both our own curated
// records and the official agencies we link out to.
export async function getSiteStats(): Promise<SiteStats> {
  const [scams, categories, countries, sources] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM scams WHERE is_active = true'),
    pool.query('SELECT COUNT(*) FROM categories'),
    pool.query(`
      SELECT COUNT(DISTINCT country) FROM (
        SELECT country FROM scams WHERE is_active = true AND country IS NOT NULL
        UNION
        SELECT country FROM global_sources
      ) AS c
    `),
    pool.query('SELECT COUNT(*) FROM global_sources'),
  ]);

  return {
    scams: Number(scams.rows[0].count),
    categories: Number(categories.rows[0].count),
    countries: Number(countries.rows[0].count),
    sources: Number(sources.rows[0].count),
  };
}

export interface StatsBreakdown {
  byCategory: { name: string; count: number }[];
  byCountry: { country: string; count: number }[];
}

// Same live-COUNT(*) principle as getSiteStats — this just slices the
// same active scams by category and by country instead of totaling them.
export async function getStatsBreakdown(): Promise<StatsBreakdown> {
  const [byCategory, byCountry] = await Promise.all([
    pool.query(`
      SELECT c.name, COUNT(s.id)::int AS count
      FROM categories c
      LEFT JOIN scams s ON s.category_id = c.id AND s.is_active = true
      GROUP BY c.name
      ORDER BY count DESC, c.name ASC
    `),
    pool.query(`
      SELECT country, COUNT(*)::int AS count
      FROM scams
      WHERE is_active = true AND country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC, country ASC
    `),
  ]);

  return {
    byCategory: byCategory.rows,
    byCountry: byCountry.rows,
  };
}
