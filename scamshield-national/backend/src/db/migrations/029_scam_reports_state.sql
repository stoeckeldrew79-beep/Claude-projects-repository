-- Groundwork for state-targeted alerts. Alert targeting matches a
-- report's state against subscribers' users.state, so `scam_reports.state`
-- has to be a real, consistently-cased code — until now it was stored
-- exactly as submitted. State stays optional (NULL = unknown; those reports
-- still count toward nationwide detection).

-- Normalize what's already there so the CHECK below can be added:
-- uppercase codes, and clear anything that isn't a US state/DC code or
-- that sits on a non-US report.
UPDATE scam_reports SET state = UPPER(TRIM(state)) WHERE state IS NOT NULL;
UPDATE scam_reports SET state = NULL
WHERE state IS NOT NULL
  AND (
    COALESCE(country, 'US') <> 'US'
    OR state NOT IN (
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
      'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
      'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
      'WV', 'WI', 'WY'
    )
  );

-- Same 51 codes as backend/src/utils/usStates.ts US_STATE_CODES; change
-- both together.
ALTER TABLE scam_reports ADD CONSTRAINT scam_reports_state_valid CHECK (
  state IS NULL OR state IN (
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
    'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM',
    'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA',
    'WV', 'WI', 'WY'
  )
);

-- How the state was established, so detection/review can weigh it:
--   'reporter'  the reporter picked it on the form ("where this happened")
--   'zip'       derived server-side from the report's ZIP prefix
--   'admin'     set or corrected by staff in the review queue
-- NULL exactly when state is NULL.
ALTER TABLE scam_reports ADD COLUMN state_source VARCHAR(10)
  CHECK (state_source IN ('reporter', 'zip', 'admin'));

-- Every state stored before this migration came straight off the form.
UPDATE scam_reports SET state_source = 'reporter' WHERE state IS NOT NULL;

ALTER TABLE scam_reports ADD CONSTRAINT scam_reports_state_source_matches CHECK (
  (state IS NULL) = (state_source IS NULL)
);

-- Per-state, time-windowed counts are what state-scoped pattern
-- detection will query.
CREATE INDEX idx_scam_reports_state_created ON scam_reports(state, created_at) WHERE state IS NOT NULL;
