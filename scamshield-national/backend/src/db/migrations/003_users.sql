CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  zip_code VARCHAR(10),
  state VARCHAR(2),
  subscription_tier VARCHAR(20) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  sms_opt_in BOOLEAN DEFAULT false,
  email_opt_in BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_zip ON users(zip_code);
