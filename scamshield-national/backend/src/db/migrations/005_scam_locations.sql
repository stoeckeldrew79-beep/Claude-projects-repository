CREATE TABLE scam_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scam_id UUID REFERENCES scams(id) ON DELETE CASCADE,
  state VARCHAR(2),
  zip_code VARCHAR(10),
  city VARCHAR(100),
  is_nationwide BOOLEAN DEFAULT false,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_zip ON scam_locations(zip_code);
CREATE INDEX idx_locations_state ON scam_locations(state);
