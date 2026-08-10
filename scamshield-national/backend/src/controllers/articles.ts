import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';

export async function list(_req: AuthedRequest, res: Response) {
  const { rows } = await pool.query(
    'SELECT * FROM articles WHERE published = true ORDER BY published_at DESC LIMIT 50'
  );
  res.json({ data: rows });
}

export async function getBySlug(req: AuthedRequest, res: Response) {
  const { rows } = await pool.query('SELECT * FROM articles WHERE slug = $1', [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
  res.json({ data: rows[0] });
}

export async function create(req: AuthedRequest, res: Response) {
  const { title, slug, body, author, cover_image, tags, scam_id } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO articles (title, slug, body, author, cover_image, tags, scam_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, slug, body, author ?? null, cover_image ?? null, tags ?? [], scam_id ?? null]
  );
  res.status(201).json({ data: rows[0] });
}

export async function update(req: AuthedRequest, res: Response) {
  const fields = Object.keys(req.body);
  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  const setClauses = fields.map((f, i) => `${f} = $${i + 2}`);
  setClauses.push('updated_at = NOW()');
  const values = fields.map((f) => req.body[f]);

  const { rows } = await pool.query(
    `UPDATE articles SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
    [req.params.id, ...values]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
  res.json({ data: rows[0] });
}
