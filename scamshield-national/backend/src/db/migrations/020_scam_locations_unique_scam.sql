-- One location record per scam for now (a single primary state, city, or
-- zip) — needed so seed.ts can upsert scam_locations idempotently via
-- ON CONFLICT (scam_id) instead of inserting a fresh duplicate row every
-- time `npm run seed` runs.
ALTER TABLE scam_locations ADD CONSTRAINT scam_locations_scam_id_key UNIQUE (scam_id);
