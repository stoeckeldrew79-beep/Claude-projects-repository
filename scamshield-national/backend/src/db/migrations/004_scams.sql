CREATE TABLE scams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  alert_level VARCHAR(20) CHECK (alert_level IN ('low','medium','high','critical')),
  first_recorded DATE,
  is_active BOOLEAN DEFAULT true,
  is_historical BOOLEAN DEFAULT false,
  sources TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scams_name ON scams USING gin(to_tsvector('english', name));
CREATE INDEX idx_scams_category ON scams(category_id);
CREATE INDEX idx_scams_alert ON scams(alert_level);
