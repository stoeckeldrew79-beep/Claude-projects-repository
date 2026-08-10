import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';

export const list = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT a.*, s.slug AS scam_slug
     FROM articles a
     LEFT JOIN scams s ON s.id = a.scam_id
     WHERE a.published = true
     ORDER BY a.published_at DESC LIMIT 50`
  );
  res.json({ data: rows });
});

export const getBySlug = asyncHandler<AuthedRequest>(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT a.*, s.slug AS scam_slug
     FROM articles a
     LEFT JOIN scams s ON s.id = a.scam_id
     WHERE a.slug = $1`,
    [req.params.slug]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
  res.json({ data: rows[0] });
});

export const create = asyncHandler<AuthedRequest>(async (req, res) => {
  const { title, slug, body, author, cover_image, tags, scam_id, published } = req.body;
  const isPublished = published ?? false;
  const { rows } = await pool.query(
    `INSERT INTO articles (title, slug, body, author, cover_image, tags, scam_id, published, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      title,
      slug,
      body,
      author ?? null,
      cover_image ?? null,
      tags ?? [],
      scam_id ?? null,
      isPublished,
      isPublished ? new Date() : null,
    ]
  );
  res.status(201).json({ data: rows[0] });
});

export const update = asyncHandler<AuthedRequest>(async (req, res) => {
  const body = { ...req.body };
  // Publishing without an explicit published_at would leave it NULL,
  // and Postgres sorts NULLs first on a DESC order — a newly published
  // article would jump to the top of the list ahead of dated ones.
  if (body.published === true && body.published_at === undefined) {
    body.published_at = new Date();
  }

  const fields = Object.keys(body);
  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  const setClauses = fields.map((f, i) => `${f} = $${i + 2}`);
  setClauses.push('updated_at = NOW()');
  const values = fields.map((f) => body[f]);

  const { rows } = await pool.query(
    `UPDATE articles SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
    [req.params.id, ...values]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
  res.json({ data: rows[0] });
});
