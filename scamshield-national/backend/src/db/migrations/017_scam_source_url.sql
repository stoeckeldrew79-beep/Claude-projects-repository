-- Scam entries cite an agency by name (the `sources` array) but had no
-- clickable link to that agency's actual page. Mirrors articles.source_url
-- (015_article_source_url.sql) — a verified link, never a guess.
ALTER TABLE scams ADD COLUMN source_url VARCHAR(500);
