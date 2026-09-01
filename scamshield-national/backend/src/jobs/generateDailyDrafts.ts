// Run daily (via system cron / hosting-platform scheduler — see README) to
// draft new articles from real patterns in the public report intake.
// Drafts are NEVER auto-published: every one lands with published=false
// and tag 'ai-draft', visible only in the admin review queue, until a
// human approves it. See services/anthropic.ts for why.
import 'dotenv/config';
import { pool } from '../db/connection';
import { draftArticleFromPattern } from '../services/anthropic';
import { DetectedPattern, detectAllPatterns } from '../services/patternDetection';

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
  const patterns = await detectAllPatterns();
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
