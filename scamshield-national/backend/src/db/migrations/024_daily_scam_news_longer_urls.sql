-- Google News redirect URLs for quoted, multi-word queries (the state AG
-- scan uses "<State> Attorney General" scam) run past the original 1000
-- character limit. source_url is the dedupe key, so truncating it would
-- both break the link and defeat the ON CONFLICT, hence a wider column.
-- 2048 stays comfortably under the btree index limit for the UNIQUE
-- constraint on this column.
ALTER TABLE daily_scam_news ALTER COLUMN source_url TYPE VARCHAR(2048);
