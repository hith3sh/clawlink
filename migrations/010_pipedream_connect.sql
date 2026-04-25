ALTER TABLE user_integrations
  ADD COLUMN pipedream_account_id TEXT;

CREATE INDEX IF NOT EXISTS idx_user_integrations_pipedream_account
  ON user_integrations(pipedream_account_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_pipedream_account_unique
  ON user_integrations(pipedream_account_id)
  WHERE pipedream_account_id IS NOT NULL;
