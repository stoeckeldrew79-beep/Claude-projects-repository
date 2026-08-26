import { AuthedRequest } from '../middleware/auth';
import { pool } from '../db/connection';
import { asyncHandler } from '../utils/asyncHandler';
import { buildUpdateSet } from '../utils/buildUpdateSet';

const UPDATABLE_ARTICLE_FIELDS = [
  'title',
  'slug',
  'body',
  'author',
  'cover_image',
  'cover_image_credit',
  'cover_image_position',
  'source_url',
  'tags',
  'scam_id',
  'published',
  'published_at',
] as const;

export const list = asyncHandler<AuthedRequest>(async (req, res) => {
  const tag = req.query.tag as string | undefined;
  const conditions = ['a.published = true'];
  const values: unknown[] = [];

  if (tag) {
    values.push(tag);
    conditions.push(`$${values.length} = ANY(a.tags)`);
  }

  const { rows } = await pool.query(
    `SELECT a.*, s.slug AS scam_slug
     FROM articles a
     LEFT JOIN scams s ON s.id = a.scam_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY a.published_at DESC LIMIT 200`,
    values
  );
  res.json({ data: rows });
});

// Admin-only: the AI-draft review queue. Deliberately not exposed on the
// public list() endpoint — a draft is unreviewed until a human approves it.
export const listDrafts = asyncHandler<AuthedRequest>(async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT * FROM articles WHERE published = false AND 'ai-draft' = ANY(tags) ORDER BY created_at DESC LIMIT 50`
  );
  res.json({ data: rows });
});

export const remove = asyncHandler<AuthedRequest>(async (req, res) => {
  const { rows } = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
  res.status(204).send();
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
  const { title, slug, body, author, cover_image, cover_image_credit, tags, scam_id, published } = req.body;
  const isPublished = published ?? false;
  const { rows } = await pool.query(
    `INSERT INTO articles (title, slug, body, author, cover_image, cover_image_credit, tags, scam_id, published, published_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
    [
      title,
      slug,
      body,
      author ?? null,
      cover_image ?? null,
      cover_image_credit ?? null,
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

  const { fields, setClauses, values } = buildUpdateSet(body, UPDATABLE_ARTICLE_FIELDS);
  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  setClauses.push('updated_at = NOW()');

  const { rows } = await pool.query(
    `UPDATE articles SET ${setClauses.join(', ')} WHERE id = $1 RETURNING *`,
    [req.params.id, ...values]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Article not found' });
  res.json({ data: rows[0] });
});
