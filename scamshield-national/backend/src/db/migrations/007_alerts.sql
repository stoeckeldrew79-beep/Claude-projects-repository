CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scam_id UUID REFERENCES scams(id),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  alert_level VARCHAR(20),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  is_nationwide BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_scam ON alerts(scam_id);
CREATE INDEX idx_alerts_state ON alerts(state);
CREATE INDEX idx_alerts_zip ON alerts(zip_code);
