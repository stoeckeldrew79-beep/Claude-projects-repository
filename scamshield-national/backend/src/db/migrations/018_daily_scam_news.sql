-- Powers the "Today's Scams" page: real, live scam-related news headlines,
-- scanned daily from public news search (see jobs/scanDailyScamNews.ts).
-- Fully automatic by design (no admin review gate) — source_url dedupe
-- keeps the scan idempotent, and the job prunes anything older than 30
-- days so the table stays a rolling window of recent headlines, not an
-- ever-growing archive.
CREATE TABLE daily_scam_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline VARCHAR(500) NOT NULL,
  summary TEXT,
  source_name VARCHAR(200) NOT NULL,
  source_url VARCHAR(1000) UNIQUE NOT NULL,
  published_at TIMESTAMPTZ,
  search_term VARCHAR(200),
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_scam_news_published_at ON daily_scam_news (published_at DESC NULLS LAST);
