// Run daily (via system cron / hosting-platform scheduler — see README) to
// draft new articles from real patterns in the public report intake.
// Drafts are NEVER auto-published: every one lands with published=false
// and tag 'ai-draft', visible only in the admin review queue, until a
// human approves it. See services/anthropic.ts for why.
import 'dotenv/config';
import { pool } from '../db/connection';
import { draftArticleFromPattern, DraftInput } from '../services/anthropic';

const MIN_RECURRING_CONTACT_REPORTS = 2;
const MIN_CATEGORY_SPIKE_REPORTS = 3;

interface DetectedPattern {
  input: DraftInput;
  dedupeTag: string;
}

async function detectRecurringContacts(): Promise<DetectedPattern[]> {
  const patterns: DetectedPattern[] = [];

  for (const column of ['scammer_phone', 'scammer_email', 'scammer_website'] as const) {
    const { rows } = await pool.query(
      `SELECT ${column} AS contact, array_agg(description) AS descriptions, COUNT(*) AS n
       FROM scam_reports
       WHERE ${column} IS NOT NULL AND created_at >= NOW() - INTERVAL '60 days'
       GROUP BY ${column}
       HAVING COUNT(*) >= $1`,
      [MIN_RECURRING_CONTACT_REPORTS]
    );
    for (const row of rows) {
      patterns.push({
        input: {
          kind: 'recurring_contact',
          recurringContact: row.contact,
          reportDescriptions: row.descriptions.slice(0, 8),
        },
        dedupeTag: `pattern:contact:${row.contact}`,
      });
    }
  }
  return patterns;
}

async function detectCategorySpikes(): Promise<DetectedPattern[]> {
  const { rows } = await pool.query(`
    SELECT
      c.id AS category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      COUNT(*) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') AS count_last_30d,
      COUNT(*) FILTER (
        WHERE r.created_at >= NOW() - INTERVAL '60 days' AND r.created_at < NOW() - INTERVAL '30 days'
      ) AS count_prior_30d,
      array_agg(r.description) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') AS descriptions
    FROM categories c
    JOIN scam_reports r ON r.category_id = c.id
    GROUP BY c.id, c.name, c.slug
    HAVING COUNT(*) FILTER (WHERE r.created_at >= NOW() - INTERVAL '30 days') >= $1
  `, [MIN_CATEGORY_SPIKE_REPORTS]);

  const monthKey = new Date().toISOString().slice(0, 7);
  const patterns: DetectedPattern[] = [];
  for (const row of rows) {
    const last30d = Number(row.count_last_30d);
    const prior30d = Number(row.count_prior_30d);
    if (last30d <= prior30d) continue;
    patterns.push({
      input: {
        kind: 'category_spike',
        categoryName: row.category_name,
        countLast30d: last30d,
        countPrior30d: prior30d,
        reportDescriptions: (row.descriptions ?? []).slice(0, 8),
      },
      dedupeTag: `pattern:category:${row.category_slug}:${monthKey}`,
    });
  }
  return patterns;
}

async function alreadyDrafted(dedupeTag: string): Promise<boolean> {
  const { rows } = await pool.query('SELECT 1 FROM articles WHERE $1 = ANY(tags) LIMIT 1', [dedupeTag]);
  return rows.length > 0;
}

async function saveDraft(pattern: DetectedPattern) {
  const drafted = await draftArticleFromPattern(pattern.input);
  await pool.query(
    `INSERT INTO articles (title, slug, body, author, tags, published)
     VALUES ($1, $2, $3, $4, $5, false)
     ON CONFLICT (slug) DO NOTHING`,
    [
      drafted.title,
      `${drafted.slug}-${Date.now().toString(36)}`,
      drafted.body,
      'ScamShield AI (draft — pending review)',
      ['ai-draft', 'guide', pattern.dedupeTag],
    ]
  );
}

async function main() {
  const patterns = [...(await detectRecurringContacts()), ...(await detectCategorySpikes())];
  let drafted = 0;

  for (const pattern of patterns) {
    if (await alreadyDrafted(pattern.dedupeTag)) continue;
    await saveDraft(pattern);
    drafted += 1;
  }

  console.log(`generateDailyDrafts: ${patterns.length} patterns detected, ${drafted} new drafts created`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
