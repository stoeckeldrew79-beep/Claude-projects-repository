import { pool } from '../db/connection';
import { buildUpdateSet } from '../utils/buildUpdateSet';

const UPDATABLE_SCAM_FIELDS = [
  'name',
  'slug',
  'description',
  'category_id',
  'alert_level',
  'first_recorded',
  'is_active',
  'is_historical',
  'sources',
  'country',
] as const;

export interface Scam {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  alert_level: 'low' | 'medium' | 'high' | 'critical' | null;
  first_recorded: string | null;
  is_active: boolean;
  is_historical: boolean;
  sources: string[] | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScamListFilters {
  category?: string;
  state?: string;
  zip?: string;
  country?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'alert_level' | 'name_asc' | 'chronological';
  // 'current' (default) hides historical entries so the main browsing
  // experience stays about active threats; 'historical' shows only the
  // historical archive; 'all' mixes both.
  view?: 'current' | 'historical' | 'all';
  page?: number;
  pageSize?: number;
}

export async function listScams(filters: ScamListFilters) {
  const { category, state, zip, country, search, sort = 'newest', view = 'current', page = 1, pageSize = 20 } = filters;
  const conditions: string[] = ['s.is_active = true'];
  const values: unknown[] = [];

  if (view === 'historical') {
    conditions.push('s.is_historical = true');
  } else if (view === 'current') {
    conditions.push('s.is_historical = false');
  }

  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
  }
  if (country) {
    values.push(country);
    conditions.push(`s.country = $${values.length}`);
  }
  if (state || zip) {
    const locConditions: string[] = [];
    if (state) {
      values.push(state);
      locConditions.push(`l.state = $${values.length}`);
    }
    if (zip) {
      values.push(zip);
      locConditions.push(`l.zip_code = $${values.length}`);
    }
    conditions.push(
      `(l.is_nationwide = true OR EXISTS (SELECT 1 FROM scam_locations l WHERE l.scam_id = s.id AND (${locConditions.join(' OR ')})))`
    );
  }
  if (search) {
    values.push(search);
    conditions.push(`to_tsvector('english', s.name) @@ plainto_tsquery('english', $${values.length})`);
  }

  // alert_level is free-text ('low'/'medium'/'high'/'critical'), not a
  // Postgres ENUM with a defined order, so a plain ORDER BY alert_level
  // sorts alphabetically (medium, low, high, critical) instead of by
  // actual severity. Rank it explicitly instead.
  const SEVERITY_RANK = `CASE s.alert_level WHEN 'critical' THEN 4 WHEN 'high' THEN 3 WHEN 'medium' THEN 2 WHEN 'low' THEN 1 ELSE 0 END`;
  const orderBy =
    sort === 'oldest'
      ? 's.created_at ASC'
      : sort === 'alert_level'
        ? 'severity_rank DESC, s.name ASC'
        : sort === 'name_asc'
          ? 's.name ASC'
          : sort === 'chronological'
            ? 's.first_recorded ASC NULLS LAST, s.name ASC'
            : 's.created_at DESC';

  values.push(pageSize);
  const limitParam = values.length;
  values.push((page - 1) * pageSize);
  const offsetParam = values.length;

  // SELECT DISTINCT requires every ORDER BY expression to appear in the
  // select list, so the severity rank has to be selected (and aliased)
  // here, not just referenced in ORDER BY.
  const { rows } = await pool.query(
    `SELECT DISTINCT s.*, c.name AS category_name, c.slug AS category_slug, ${SEVERITY_RANK} AS severity_rank
     FROM scams s
     LEFT JOIN categories c ON c.id = s.category_id
     LEFT JOIN scam_locations l ON l.scam_id = s.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY ${orderBy}
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    values
  );
  return rows;
}

export async function listActiveCountries() {
  const { rows } = await pool.query(
    `SELECT DISTINCT country FROM scams WHERE is_active = true AND country IS NOT NULL ORDER BY country ASC`
  );
  return rows.map((r) => r.country as string);
}

// Real per-country counts from the curated public database — the same
// source of truth as the rest of the site, not the unvetted report
// intake. Backs the globe visualization.
export async function countsByCountry() {
  const { rows } = await pool.query(
    `SELECT country, COUNT(*) AS count
     FROM scams
     WHERE is_active = true AND country IS NOT NULL
     GROUP BY country
     ORDER BY count DESC`
  );
  return rows.map((r) => ({ country: r.country as string, count: Number(r.count) }));
}

export async function getScamBySlug(slug: string) {
  const { rows } = await pool.query(
    `SELECT s.*, c.name AS category_name, c.slug AS category_slug
     FROM scams s
     LEFT JOIN categories c ON c.id = s.category_id
     WHERE s.slug = $1`,
    [slug]
  );
  if (!rows[0]) return null;

  const { rows: locations } = await pool.query('SELECT * FROM scam_locations WHERE scam_id = $1', [rows[0].id]);
  return { ...rows[0], locations };
}

export async function searchScams(query: string) {
  const { rows } = await pool.query(
    `SELECT * FROM scams
     WHERE is_active = true
       AND (to_tsvector('english', name) @@ plainto_tsquery('english', $1)
            OR description ILIKE '%' || $1 || '%')
     ORDER BY ts_rank(to_tsvector('english', name), plainto_tsquery('english', $1)) DESC
     LIMIT 50`,
    [query]
  );
  return rows;
}

export async function scamsNearZip(zip: string) {
  const { rows } = await pool.query(
    `SELECT DISTINCT s.*
     FROM scams s
     JOIN scam_locations l ON l.scam_id = s.id
     WHERE s.is_active = true AND (l.zip_code = $1 OR l.is_nationwide = true)
     ORDER BY s.created_at DESC`,
    [zip]
  );
  return rows;
}

export async function createScam(data: Partial<Scam>) {
  const { rows } = await pool.query(
    `INSERT INTO scams (name, slug, description, category_id, alert_level, first_recorded, is_historical, sources, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.name,
      data.slug,
      data.description,
      data.category_id ?? null,
      data.alert_level ?? null,
      data.first_recorded ?? null,
      data.is_historical ?? false,
      data.sources ?? [],
      data.country ?? 'US',
    ]
  );
  return rows[0];
}

export async function updateScam(id: string, data: Partial<Scam>) {
  const { fields, setClauses, values } = buildUpdateSet(data, UPDATABLE_SCAM_FIELDS);
  if (fields.length === 0) return getScamById(id);

  setClauses.push('updated_at = NOW()');

  const { rows } = await pool.query(
    `UPDATE scams SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
    [id, ...values]
  );
  return rows[0] ?? null;
}

export async function getScamById(id: string) {
  const { rows } = await pool.query('SELECT * FROM scams WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function softDeleteScam(id: string) {
  const { rows } = await pool.query(
    'UPDATE scams SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
    [id]
  );
  return rows[0] ?? null;
}
