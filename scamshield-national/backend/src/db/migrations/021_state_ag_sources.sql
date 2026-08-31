-- Each US state (plus DC) Attorney General's consumer protection office.
-- Distinct from global_sources: these are US-state-level, not national/
-- international agencies, and most don't publish a structured annual
-- report the way FTC/CFPB do — has_published_reports + reports_url track
-- which ones actually have something beyond a complaint-filing page.
CREATE TABLE state_ag_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state VARCHAR(2) NOT NULL UNIQUE,
  state_name VARCHAR(50) NOT NULL,
  agency_name VARCHAR(255) NOT NULL,
  consumer_protection_url TEXT NOT NULL,
  reports_url TEXT,
  has_published_reports BOOLEAN NOT NULL DEFAULT false,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
