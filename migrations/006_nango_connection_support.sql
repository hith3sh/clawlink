ALTER TABLE user_integrations
  ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'clawlink';

ALTER TABLE user_integrations
  ADD COLUMN nango_connection_id TEXT;

ALTER TABLE user_integrations
  ADD COLUMN nango_provider_config_key TEXT;

CREATE INDEX IF NOT EXISTS idx_user_integrations_nango_connection
  ON user_integrations(nango_connection_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_nango_connection_unique
  ON user_integrations(nango_connection_id)
  WHERE nango_connection_id IS NOT NULL;
