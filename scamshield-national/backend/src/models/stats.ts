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

export interface LiveStatsCritical {
  id: string;
  name: string;
  slug: string;
  alert_level: string;
  category_name: string | null;
  country: string | null;
  created_at: string;
}

export interface LiveStats {
  newLast7Days: number;
  newLast30Days: number;
  activeCriticalCount: number;
  activeHighCount: number;
  newsLast24h: number;
  mostActiveCategory: { name: string; count: number } | null;
  recentCritical: LiveStatsCritical[];
}

// Replaces the old all-time category/country breakdown (same number every
// time someone checked, which read as a chart rather than a live site).
// This is what's actually changing right now: how fast the database is
// growing, how many currently-active threats are rated critical/high, and
// the specific newest ones — what a visitor should actually watch for
// today, not a percentage split that looks the same on every visit.
export async function getLiveStats(): Promise<LiveStats> {
  const [counts, newsCount, topCategory, recentCritical] = await Promise.all([
    pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS new_7d,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS new_30d,
        COUNT(*) FILTER (WHERE alert_level = 'critical') AS critical_count,
        COUNT(*) FILTER (WHERE alert_level = 'high') AS high_count
      FROM scams
      WHERE is_active = true AND is_historical = false
    `),
    pool.query(`SELECT COUNT(*)::int FROM daily_scam_news WHERE scanned_at >= NOW() - INTERVAL '24 hours'`),
    pool.query(`
      SELECT c.name, COUNT(s.id)::int AS count
      FROM scams s
      JOIN categories c ON c.id = s.category_id
      WHERE s.is_active = true AND s.is_historical = false AND s.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY c.name
      ORDER BY count DESC
      LIMIT 1
    `),
    pool.query(`
      SELECT s.id, s.name, s.slug, s.alert_level, s.country, s.created_at, c.name AS category_name
      FROM scams s
      LEFT JOIN categories c ON c.id = s.category_id
      WHERE s.is_active = true AND s.is_historical = false AND s.alert_level IN ('critical', 'high')
      ORDER BY s.created_at DESC
      LIMIT 5
    `),
  ]);

  const row = counts.rows[0];
  return {
    newLast7Days: Number(row.new_7d),
    newLast30Days: Number(row.new_30d),
    activeCriticalCount: Number(row.critical_count),
    activeHighCount: Number(row.high_count),
    newsLast24h: Number(newsCount.rows[0].count),
    mostActiveCategory: topCategory.rows[0] ?? null,
    recentCritical: recentCritical.rows,
  };
}
