-- Early-warning review queue: when the pattern detector (recurring
-- scammer contact info, or a category spike) finds something, it lands
-- here rather than firing SMS/email straight away. An admin reviews and
-- either approves it (which creates a real row in `alerts` and triggers
-- the existing broadcastAlert SMS/email fan-out) or dismisses it. This
-- mirrors the existing AI-drafted-article review queue in spirit, but
-- feeds the real-time member alert system instead of the articles table.
CREATE TABLE alert_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Matches the detector's dedupeTag (e.g. "pattern:contact:555-0100" or
  -- "pattern:category:romance-scams:2026-08") so re-running detection
  -- never creates a second pending (or already-resolved) candidate for
  -- the same underlying pattern.
  dedupe_tag VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  alert_level VARCHAR(20) NOT NULL,
  state VARCHAR(2),
  zip_code VARCHAR(10),
  is_nationwide BOOLEAN NOT NULL DEFAULT false,
  pattern_type VARCHAR(30) NOT NULL CHECK (pattern_type IN ('recurring_contact', 'category_spike')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_alert_candidates_status ON alert_candidates(status);
