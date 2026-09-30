// Seed data — separate from migrations, which stay schema-only. Content
// here is idempotent (ON CONFLICT DO NOTHING on slug) so re-running is
// safe. Run with `npm run seed`.
//
// "Notorious" articles are factual, publicly documented historical
// cases (criminal convictions, court/SEC records, decades of reporting)
// — the same kind of coverage the FTC, Wikipedia, and financial press
// publish. Where a subject's public account is itself disputed
// (Abagnale), that dispute is part of the story, not omitted.
//
// The records themselves live in ./seed-data/, one module per array. They
// were split out when this file reached 6.9MB — past the point any model or
// editor can load it whole, and with six scheduled content routines all
// appending to the same file. This file is now only the seeding logic; to
// add records, edit the module for that array.
import 'dotenv/config';
import { pool } from './connection';
import { SeedArticle } from './seed-data/types';
import { NOTORIOUS_ARTICLES } from './seed-data/notorious';
import { GUIDE_ARTICLES } from './seed-data/guides';
import { SEED_CATEGORIES } from './seed-data/categories';
import { SEED_SCAMS } from './seed-data/scams';
import { SCAM_TAGS } from './seed-data/scam-tags';
import { SEED_GLOBAL_SOURCES } from './seed-data/global-sources';
import { SEED_STATE_AG_SOURCES } from './seed-data/state-ag-sources';

async function seedArticles(articles: SeedArticle[], label: string) {
  for (const article of articles) {
    await pool.query(
      `INSERT INTO articles (title, slug, body, author, tags, source_url, cover_image, cover_image_credit, cover_image_position, published, published_at, seed_managed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW(), true)
       ON CONFLICT (slug) DO UPDATE SET
         -- The Admin panel's cover-photo form edits source_url in the same
         -- save action as cover_image (it's the "no photo yet" fallback
         -- link) — so once that save has locked the row, a manually-set
         -- source_url must survive reseeding the same way the photo does,
         -- instead of being silently overwritten back to seed.ts's value.
         source_url = CASE WHEN articles.cover_image_locked THEN COALESCE(articles.source_url, EXCLUDED.source_url)
                            ELSE COALESCE(EXCLUDED.source_url, articles.source_url) END,
         -- A manually curated photo (set via the Admin panel) is locked
         -- and must survive reseeding — see migration 019. Only an
         -- unlocked row takes seed.ts's photo fields.
         cover_image = CASE WHEN articles.cover_image_locked THEN articles.cover_image
                             ELSE COALESCE(EXCLUDED.cover_image, articles.cover_image) END,
         cover_image_credit = CASE WHEN articles.cover_image_locked THEN articles.cover_image_credit
                                    ELSE COALESCE(EXCLUDED.cover_image_credit, articles.cover_image_credit) END,
         cover_image_position = CASE WHEN articles.cover_image_locked THEN articles.cover_image_position
                                      ELSE COALESCE(EXCLUDED.cover_image_position, articles.cover_image_position) END,
         -- A row can start out seed-managed=false (created some other way,
         -- e.g. generateDailyDrafts.ts) and later collide with a slug that
         -- seed-data now also uses; once seed.ts has upserted it, it is
         -- seed-managed going forward like any other seeded row.
         seed_managed = true`,
      [
        article.title,
        article.slug,
        article.body,
        article.author,
        article.tags,
        article.sourceUrl ?? null,
        article.coverImage ?? null,
        article.coverImageCredit ?? null,
        article.coverImagePosition ?? 50,
      ]
    );
  }
  console.log(`seed: upserted ${articles.length} ${label} articles`);
}

// seed.ts upserts but historically never deleted a row whose slug was
// later removed from seed-data, leaving orphaned, still-published content
// live indefinitely (see migration 027). Only rows seed.ts itself has
// marked seed_managed are candidates for removal — a row created another
// way (an admin edit, a daily-draft job) is never touched here even if
// its slug isn't in the current seed-data set. Deletes run one row at a
// time so a single row still referenced by another table (an alert, a
// promoted scam report) can't abort cleanup of the rest — it's logged and
// left in place instead.
async function pruneOrphanedSeedRows(table: 'articles' | 'scams', currentSlugs: string[]) {
  const { rows } = await pool.query(
    `SELECT id, slug FROM ${table} WHERE seed_managed = true AND slug <> ALL($1::text[])`,
    [currentSlugs]
  );
  if (rows.length === 0) return;

  let removed = 0;
  for (const row of rows) {
    try {
      await pool.query(`DELETE FROM ${table} WHERE id = $1`, [row.id]);
      removed++;
    } catch (err) {
      console.warn(
        `seed: could not remove orphaned ${table} row (slug=${row.slug}), likely still referenced elsewhere: ${
          (err as Error).message
        }`
      );
    }
  }
  console.log(`seed: removed ${removed}/${rows.length} orphaned ${table} row(s) no longer in seed-data`);
}

async function seedCategoriesAndScams() {
  for (const category of SEED_CATEGORIES) {
    await pool.query(
      `INSERT INTO categories (name, slug, description)
       VALUES ($1, $2, $3)
       ON CONFLICT (slug) DO NOTHING`,
      [category.name, category.slug, category.description]
    );
  }
  console.log(`seed: upserted ${SEED_CATEGORIES.length} categories`);

  let locationsUpserted = 0;
  for (const scam of SEED_SCAMS) {
    const { rows } = await pool.query(
      `INSERT INTO scams (name, slug, description, category_id, alert_level, is_active, sources, source_url, country, is_historical, first_recorded, tags, seed_managed)
       VALUES ($1, $2, $3, (SELECT id FROM categories WHERE slug = $4), $5, true, $6, $7, $8, $9, $10, $11, true)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         category_id = EXCLUDED.category_id,
         alert_level = EXCLUDED.alert_level,
         sources = EXCLUDED.sources,
         source_url = EXCLUDED.source_url,
         country = EXCLUDED.country,
         is_historical = EXCLUDED.is_historical,
         first_recorded = EXCLUDED.first_recorded,
         tags = EXCLUDED.tags,
         -- See seedArticles' matching note: a scam created another way
         -- (e.g. promoted from a scam_report) becomes seed-managed the
         -- moment seed-data also defines its slug.
         seed_managed = true,
         updated_at = NOW()
       RETURNING id`,
      [
        scam.name,
        scam.slug,
        scam.description,
        scam.categorySlug,
        scam.alertLevel ?? null,
        scam.sources,
        scam.sourceUrl ?? null,
        scam.country ?? 'US',
        scam.isHistorical ?? false,
        scam.firstRecorded ?? null,
        SCAM_TAGS[scam.slug] ?? null,
      ]
    );

    if (scam.state) {
      await pool.query(
        `INSERT INTO scam_locations (scam_id, state)
         VALUES ($1, $2)
         ON CONFLICT (scam_id) DO UPDATE SET state = EXCLUDED.state, updated_at = NOW()`,
        [rows[0].id, scam.state]
      );
      locationsUpserted++;
    }
  }
  console.log(`seed: upserted ${SEED_SCAMS.length} scams (${locationsUpserted} with a state location)`);

  await pruneOrphanedSeedRows(
    'scams',
    SEED_SCAMS.map((scam) => scam.slug)
  );
}

async function seedGlobalSources() {
  for (const source of SEED_GLOBAL_SOURCES) {
    await pool.query(
      `INSERT INTO global_sources (agency_name, country, country_name, url, description, data_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (agency_name, country) DO NOTHING`,
      [source.agency_name, source.country, source.country_name, source.url, source.description, source.data_type]
    );
  }
  console.log(`seed: upserted ${SEED_GLOBAL_SOURCES.length} global sources`);
}

async function seedStateAgSources() {
  for (const source of SEED_STATE_AG_SOURCES) {
    await pool.query(
      `INSERT INTO state_ag_sources (state, state_name, agency_name, consumer_protection_url, reports_url, has_published_reports, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (state) DO UPDATE SET
         state_name = EXCLUDED.state_name,
         agency_name = EXCLUDED.agency_name,
         consumer_protection_url = EXCLUDED.consumer_protection_url,
         reports_url = EXCLUDED.reports_url,
         has_published_reports = EXCLUDED.has_published_reports,
         description = EXCLUDED.description,
         updated_at = NOW()`,
      [
        source.state,
        source.state_name,
        source.agency_name,
        source.consumer_protection_url,
        source.reports_url ?? null,
        source.has_published_reports,
        source.description,
      ]
    );
  }
  console.log(`seed: upserted ${SEED_STATE_AG_SOURCES.length} state AG sources`);
}

async function main() {
  await seedArticles(NOTORIOUS_ARTICLES, 'notorious');
  await seedArticles(GUIDE_ARTICLES, 'guide');
  // Both arrays share the `articles` table with no type column, so pruning
  // has to run once against their combined slugs — pruning right after
  // just NOTORIOUS_ARTICLES would delete every guide as "orphaned".
  await pruneOrphanedSeedRows(
    'articles',
    [...NOTORIOUS_ARTICLES, ...GUIDE_ARTICLES].map((article) => article.slug)
  );
  await seedCategoriesAndScams();
  await seedGlobalSources();
  await seedStateAgSources();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
