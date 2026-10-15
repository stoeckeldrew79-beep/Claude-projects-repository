-- State Attorney General feed engine (jobs/scanStateAgNews.ts).

-- Federal DOJ/FTC rows were stored as source_kind 'ag', so the site
-- labelled FTC releases "Official AG alert". They are now 'federal'.
-- (state = 'US' marks the federal jurisdiction; see scanFederalScamNews.ts.)
UPDATE daily_scam_news SET source_kind = 'federal' WHERE state = 'US' AND source_kind = 'ag';

-- One row per state: what happened the last time its first-party source was
-- read. This is what monitoring checks — an office's feed that starts
-- returning errors, or valid-but-empty responses, shows up here instead of
-- the state page quietly going stale. (Before this table existed, four
-- states were configured with WordPress comment feeds that never carried a
-- single release, and Texas's feed had stopped in 2023; nothing noticed.)
CREATE TABLE ag_feed_status (
  state VARCHAR(2) PRIMARY KEY,
  source_type VARCHAR(10) NOT NULL,
  source_url TEXT NOT NULL,
  last_attempt_at TIMESTAMPTZ NOT NULL,
  -- Last time the source answered AND yielded at least one release.
  last_success_at TIMESTAMPTZ,
  last_item_count INT NOT NULL DEFAULT 0,
  newest_item_at TIMESTAMPTZ,
  last_error TEXT
);
