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
