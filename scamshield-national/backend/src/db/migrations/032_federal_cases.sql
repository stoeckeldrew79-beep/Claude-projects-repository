-- Federal fraud case archive: every fraud/scam press release the US
-- Department of Justice has published since 2009 (its public API carries
-- ~274,000 releases of all kinds; roughly a quarter are fraud cases).
-- Filled by jobs/scanDojArchive.ts, which works through the backlog a
-- slice per run and then keeps up with new releases.
--
-- Only a short summary is stored, not the full release: each row links
-- to the release on justice.gov, and this keeps ~70,000 rows to roughly
-- 150 MB including indexes.
CREATE TABLE federal_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doj_uuid UUID NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  -- "Western District of Texas", or a Main Justice component.
  office TEXT,
  components TEXT[] NOT NULL DEFAULT '{}',
  topics TEXT[] NOT NULL DEFAULT '{}',
  -- Two-letter state (or PR/GU/VI/MP) of the US Attorney's Office;
  -- NULL for Main Justice releases with national scope.
  state VARCHAR(2),
  theme VARCHAR(60) NOT NULL,
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || COALESCE(summary, ''))
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_federal_cases_published ON federal_cases (published_at DESC);
CREATE INDEX idx_federal_cases_state ON federal_cases (state, published_at DESC);
CREATE INDEX idx_federal_cases_theme ON federal_cases (theme, published_at DESC);
CREATE INDEX idx_federal_cases_search ON federal_cases USING GIN (search_vector);

-- Where a resumable import got to (e.g. the DOJ archive's next page), so a
-- long backfill can be spread across scheduled runs.
CREATE TABLE ingest_state (
  name VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
