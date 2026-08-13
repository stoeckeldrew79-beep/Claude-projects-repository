-- Official third-party fraud-reporting agencies (FTC, FBI IC3, ACCC/Scamwatch,
-- Canadian Anti-Fraud Centre, etc.) and figures published from their own
-- reports. Deliberately a separate table from `scams`/`scam_reports`: this is
-- someone else's data, cited with a source link, never blended into our own
-- report-derived numbers as if we collected it ourselves.
CREATE TABLE global_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name VARCHAR(255) NOT NULL,
  country VARCHAR(2) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  data_type VARCHAR(20) NOT NULL CHECK (data_type IN ('annual_report', 'open_dataset', 'public_stats')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (agency_name, country)
);

-- Individual published figures ("headline") attributed to a source, added
-- only once an admin has verified the number against the agency's own
-- report — never auto-ingested or guessed. source_url points at the exact
-- report cited, which may be more specific than global_sources.url.
CREATE TABLE global_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES global_sources(id) ON DELETE CASCADE,
  period_label VARCHAR(50) NOT NULL,
  headline TEXT NOT NULL,
  report_count BIGINT,
  loss_amount NUMERIC,
  currency VARCHAR(3),
  top_category VARCHAR(255),
  source_url TEXT NOT NULL,
  published_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_global_stats_source_id ON global_stats(source_id);
