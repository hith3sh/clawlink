ALTER TABLE user_integrations
  ADD COLUMN auth_state TEXT NOT NULL DEFAULT 'active';

ALTER TABLE user_integrations
  ADD COLUMN auth_error TEXT;

CREATE INDEX IF NOT EXISTS idx_user_integrations_auth_state
  ON user_integrations(user_id, auth_state);
