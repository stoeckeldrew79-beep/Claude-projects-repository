-- "Be the first to know" sign-ups from the launch page, so there is an
-- audience to tell on launch day. Only the address and when/where it came
-- from; one row per address (case-insensitive).
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'launch',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_lower ON waitlist_signups (lower(email));
