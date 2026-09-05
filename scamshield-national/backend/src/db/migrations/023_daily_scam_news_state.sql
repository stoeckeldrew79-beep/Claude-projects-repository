-- Tags a Today's Scams headline with the US state it came from, so
-- state-scoped alerts (from state Attorney General press feeds) can be
-- filtered per state and, later, drive the zoom-to-region view on the
-- Global Map. NULL means the story is national or international, which is
-- every row the general news scan produces.
ALTER TABLE daily_scam_news ADD COLUMN state VARCHAR(2);

-- Records which AG source a state-tagged row came from, so a state's page
-- can credit the office and a first-party AG alert is distinguishable from
-- general news coverage about that office.
ALTER TABLE daily_scam_news ADD COLUMN source_kind VARCHAR(20) NOT NULL DEFAULT 'news';

CREATE INDEX idx_daily_scam_news_state ON daily_scam_news (state) WHERE state IS NOT NULL;
