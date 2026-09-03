-- Raw public "report a scam" submissions — deliberately a separate table
-- from `scams`. `scams` is curated, admin-vetted intelligence shown
-- publicly; `scam_reports` is unverified public intake that staff
-- triage and, where warranted, promote into a scams entry. Conflating
-- the two would mean publishing unverified claims about real people or
-- businesses under the site's own authority.
CREATE TABLE scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_name VARCHAR(255),
  reporter_email VARCHAR(255),
  reporter_phone VARCHAR(20),
  scammer_phone VARCHAR(20),
  scammer_email VARCHAR(255),
  scammer_website VARCHAR(500),
  category_id UUID REFERENCES categories(id),
  description TEXT NOT NULL,
  money_lost_amount NUMERIC(12, 2),
  money_lost_currency VARCHAR(3) DEFAULT 'USD',
  incident_date DATE,
  -- ISO 3166-1 alpha-2. Defaults to US to match today's data, but every
  -- report carries a country so international coverage is additive, not
  -- a later migration.
  country VARCHAR(2) DEFAULT 'US',
  state VARCHAR(2),
  zip_code VARCHAR(10),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'promoted', 'dismissed')),
  promoted_scam_id UUID REFERENCES scams(id),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scam_reports_status ON scam_reports(status);
CREATE INDEX idx_scam_reports_created ON scam_reports(created_at);
CREATE INDEX idx_scam_reports_country ON scam_reports(country);
