-- seed.ts upserted content forever but never deleted a row whose slug was
-- later removed from seed-data, so any past slug removal/rename left an
-- orphaned, still-published row live in the database indefinitely.
--
-- A blanket "delete anything not in seed-data" cleanup would be unsafe on
-- its own: articles and scams can also be created outside seed-data
-- (generateDailyDrafts.ts writes articles directly, and the admin
-- create-scam path in src/models/scams.ts writes scams directly), and
-- neither of those slugs ever appears in the seed-data .ts files. This
-- flag lets seed.ts prune only the rows it itself manages. It defaults to
-- false so every existing non-seed row is left alone; seed.ts sets it true
-- on every row it upserts, so the next `npm run seed` run marks all
-- current legitimate seed-data rows without a separate backfill step.
ALTER TABLE articles ADD COLUMN seed_managed BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE scams ADD COLUMN seed_managed BOOLEAN NOT NULL DEFAULT false;
