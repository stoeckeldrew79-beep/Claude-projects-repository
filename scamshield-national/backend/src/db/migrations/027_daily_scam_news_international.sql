-- Lets "Today's Scams" offer a "United States" filter distinct from "All
-- states & international": every state-tagged row is already US (see
-- migration 023), but the general national scan and the international scan
-- both land as state IS NULL, with nothing to tell them apart. This column
-- is that distinction, set at insert time going forward by
-- scanDailyScamNews.ts (see US_SEARCH_TERMS vs INTERNATIONAL_SEARCH_TERMS).
ALTER TABLE daily_scam_news ADD COLUMN is_international BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing rows from the search_term that produced them — the six
-- terms below are exactly INTERNATIONAL_SEARCH_TERMS as of this migration.
-- Everything else (every US_SEARCH_TERMS row, and every state-AG row, which
-- never has a search_term in this list) defaults correctly to false already.
UPDATE daily_scam_news
SET is_international = true
WHERE search_term = ANY (ARRAY[
  'ACCC Scamwatch scam',
  'Action Fraud scam UK',
  'Canadian Anti-Fraud Centre scam',
  'Singapore police scam alert',
  'India cyber fraud arrest',
  'Garda fraud warning Ireland'
]);
