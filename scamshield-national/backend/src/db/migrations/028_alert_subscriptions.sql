-- Digest alert subscriptions — the free/weekly/daily/instant tier ladder.
-- `users.subscription_tier` already governs the *real-time* broadcast
-- fan-out (see models/users.ts usersForAlertSms/usersForAlertEmail); this
-- adds the periodic-digest path the original spec anticipated for Basic
-- ("digest-only, handled separately by a periodic job") and extends the
-- same idea down to Free and up through Pro, so every tier gets something.
--
-- `alert_preferences`: one row per user, their digest cadence and the
-- high-water mark (`last_sent_at`) the digest job advances past on every
-- send. Cadence defaults from `users.subscription_tier` at signup but is
-- deliberately a separate, user-editable column (via config/alertTiers.ts
-- MAX_FREQUENCY, a subscriber may always choose something less frequent
-- than their tier allows, never more).
CREATE TABLE alert_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  frequency VARCHAR(10) NOT NULL DEFAULT 'monthly'
    CHECK (frequency IN ('monthly', 'weekly', 'daily', 'instant')),
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- `alert_watch_profiles`: what a subscriber is actually watching for. One
-- row per (state, category) the user cares about; a Family-tier account
-- gets several rows under the SAME user_id rather than separate logins —
-- e.g. one row per family member's state, so "Mom in FL" and "my own
-- account in TX" both land in one consolidated digest to the one inbox on
-- file. This sidesteps needing separate email consent per family member
-- while still letting a single membership watch several places/topics.
-- NULL state = nationwide-only matches for that row; NULL category_id =
-- all categories for that row's state.
CREATE TABLE alert_watch_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(100),
  state VARCHAR(2),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alert_watch_profiles_user ON alert_watch_profiles(user_id);
CREATE INDEX idx_alert_watch_profiles_state ON alert_watch_profiles(state);
