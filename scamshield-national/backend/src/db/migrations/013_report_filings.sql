-- "File this for you": consumer consent to have ScamShield National file
-- their report with the appropriate outside agency on their behalf, plus
-- per-agency filing status. Deliberately separate from scam_reports.status
-- (our own internal review of whether to promote it to the public database)
-- — a report can be under internal review AND already filed with an
-- agency; these are independent processes.
ALTER TABLE scam_reports ADD COLUMN consent_to_file BOOLEAN DEFAULT false;
ALTER TABLE scam_reports ADD COLUMN consent_to_file_at TIMESTAMPTZ;

-- status:
--   'suggested'      system identified this agency as relevant; nobody has acted yet
--   'filed'          staff manually submitted the report through the agency's own
--                    portal and recorded a confirmation/reference number
--   'not_applicable' staff reviewed and determined this agency doesn't actually apply
-- There is deliberately no 'auto-submitted' status: nothing is ever filed
-- with a government agency without a person at ScamShield actually doing
-- it and recording what happened, the same review-before-action pattern
-- as report promotion and AI-drafted articles.
CREATE TABLE report_filings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id        UUID NOT NULL REFERENCES scam_reports(id) ON DELETE CASCADE,
  agency_name      VARCHAR(255) NOT NULL,
  agency_url       TEXT NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested', 'filed', 'not_applicable')),
  reference_number VARCHAR(255),
  filed_at         TIMESTAMPTZ,
  filed_by         UUID REFERENCES users(id),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_report_filings_report_id ON report_filings(report_id);
