import { pool } from '../db/connection';

// Per-state pages are built on data that already exists: state_ag_sources
// carries all 51 jurisdictions (verified office, complaint URL, alerts URL),
// scam_locations ties documented entries to a state, and daily_scam_news
// carries live AG press activity. This model joins those three so a state
// page is one request rather than the frontend stitching them together.

export interface StateSummary {
  state: string;
  state_name: string;
  slug: string;
  scam_count: number;
  news_count: number;
}

export interface StateCategoryCount {
  name: string;
  slug: string;
  count: number;
}

export interface StateDetail extends StateSummary {
  agency_name: string;
  consumer_protection_url: string;
  reports_url: string | null;
  has_published_reports: boolean;
  description: string;
  ag_news_count: number;
  categories: StateCategoryCount[];
}

// state_ag_sources.state_name is the canonical display name, so the slug is
// derived from it rather than kept as a second column that could drift out
// of sync with it. 'District of Columbia' -> 'district-of-columbia'.
export function slugForStateName(stateName: string): string {
  return stateName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Same predicate the state filter in listScams uses, so a state's count
// matches what its page actually lists.
const SCAM_COUNT_SUBQUERY = `
  SELECT COUNT(DISTINCT s.id)
  FROM scams s
  JOIN scam_locations l ON l.scam_id = s.id
  WHERE l.state = a.state AND s.is_active = true AND s.is_historical = false`;

const NEWS_COUNT_SUBQUERY = `
  SELECT COUNT(*) FROM daily_scam_news n WHERE n.state = a.state`;

const AG_NEWS_COUNT_SUBQUERY = `
  SELECT COUNT(*) FROM daily_scam_news n WHERE n.state = a.state AND n.source_kind = 'ag'`;

export async function listStates(): Promise<StateSummary[]> {
  const { rows } = await pool.query(
    `SELECT a.state, a.state_name,
            (${SCAM_COUNT_SUBQUERY})::int AS scam_count,
            (${NEWS_COUNT_SUBQUERY})::int AS news_count
     FROM state_ag_sources a
     ORDER BY a.state_name ASC`
  );
  return rows.map((r) => ({
    state: r.state,
    state_name: r.state_name,
    slug: slugForStateName(r.state_name),
    scam_count: Number(r.scam_count),
    news_count: Number(r.news_count),
  }));
}

// Looked up by slug rather than by code so the public URL is /states/florida
// (readable, and what someone searching actually types) while the database
// keeps using the two-letter code everywhere else.
export async function getStateBySlug(slug: string): Promise<StateDetail | null> {
  const { rows } = await pool.query(
    `SELECT a.*,
            (${SCAM_COUNT_SUBQUERY})::int AS scam_count,
            (${NEWS_COUNT_SUBQUERY})::int AS news_count,
            (${AG_NEWS_COUNT_SUBQUERY})::int AS ag_news_count
     FROM state_ag_sources a
     WHERE regexp_replace(lower(a.state_name), '[^a-z0-9]+', '-', 'g') = $1`,
    [slug]
  );
  const row = rows[0];
  if (!row) return null;

  const { rows: categories } = await pool.query(
    `SELECT c.name, c.slug, COUNT(DISTINCT s.id)::int AS count
     FROM scams s
     JOIN scam_locations l ON l.scam_id = s.id
     JOIN categories c ON c.id = s.category_id
     WHERE l.state = $1 AND s.is_active = true AND s.is_historical = false
     GROUP BY c.name, c.slug
     ORDER BY count DESC, c.name ASC`,
    [row.state]
  );

  return {
    state: row.state,
    state_name: row.state_name,
    slug: slugForStateName(row.state_name),
    agency_name: row.agency_name,
    consumer_protection_url: row.consumer_protection_url,
    reports_url: row.reports_url,
    has_published_reports: row.has_published_reports,
    description: row.description,
    scam_count: Number(row.scam_count),
    news_count: Number(row.news_count),
    ag_news_count: Number(row.ag_news_count),
    categories: categories.map((c) => ({ name: c.name, slug: c.slug, count: Number(c.count) })),
  };
}
