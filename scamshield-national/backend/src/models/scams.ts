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
  created_at: string;
  updated_at: string;
}

export interface ScamListFilters {
  category?: string;
  state?: string;
  zip?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'alert_level';
  page?: number;
  pageSize?: number;
}

export async function listScams(filters: ScamListFilters) {
  const { category, state, zip, search, sort = 'newest', page = 1, pageSize = 20 } = filters;
  const conditions: string[] = ['s.is_active = true'];
  const values: unknown[] = [];

  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
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

  const orderBy =
    sort === 'oldest' ? 's.created_at ASC' : sort === 'alert_level' ? 's.alert_level DESC' : 's.created_at DESC';

  values.push(pageSize);
  const limitParam = values.length;
  values.push((page - 1) * pageSize);
  const offsetParam = values.length;

  const { rows } = await pool.query(
    `SELECT DISTINCT s.*, c.name AS category_name, c.slug AS category_slug
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
    `INSERT INTO scams (name, slug, description, category_id, alert_level, first_recorded, is_historical, sources)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
