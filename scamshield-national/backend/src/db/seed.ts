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
import { SEED_GLOBAL_SOURCES } from './seed-data/global-sources';
import { SEED_STATE_AG_SOURCES } from './seed-data/state-ag-sources';

async function seedArticles(articles: SeedArticle[], label: string) {
  for (const article of articles) {
    await pool.query(
      `INSERT INTO articles (title, slug, body, author, tags, source_url, cover_image, cover_image_credit, cover_image_position, published, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())
       ON CONFLICT (slug) DO UPDATE SET
         source_url = COALESCE(EXCLUDED.source_url, articles.source_url),
         -- A manually curated photo (set via the Admin panel) is locked
         -- and must survive reseeding — see migration 019. Only an
         -- unlocked row takes seed.ts's photo fields.
         cover_image = CASE WHEN articles.cover_image_locked THEN articles.cover_image
                             ELSE COALESCE(EXCLUDED.cover_image, articles.cover_image) END,
         cover_image_credit = CASE WHEN articles.cover_image_locked THEN articles.cover_image_credit
                                    ELSE COALESCE(EXCLUDED.cover_image_credit, articles.cover_image_credit) END,
         cover_image_position = CASE WHEN articles.cover_image_locked THEN articles.cover_image_position
                                      ELSE COALESCE(EXCLUDED.cover_image_position, articles.cover_image_position) END`,
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
      `INSERT INTO scams (name, slug, description, category_id, alert_level, is_active, sources, source_url, country, is_historical, first_recorded)
       VALUES ($1, $2, $3, (SELECT id FROM categories WHERE slug = $4), $5, true, $6, $7, $8, $9, $10)
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
  await seedCategoriesAndScams();
  await seedGlobalSources();
  await seedStateAgSources();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
