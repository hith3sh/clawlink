ALTER TABLE user_integrations
  ADD COLUMN composio_connected_account_id TEXT;

ALTER TABLE user_integrations
  ADD COLUMN composio_auth_config_id TEXT;

ALTER TABLE user_integrations
  ADD COLUMN composio_toolkit TEXT;

CREATE INDEX IF NOT EXISTS idx_user_integrations_composio_connected_account
  ON user_integrations(composio_connected_account_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_composio_connected_account_unique
  ON user_integrations(composio_connected_account_id)
  WHERE composio_connected_account_id IS NOT NULL;

UPDATE user_integrations
SET auth_state = 'needs_reauth',
    auth_error = 'Instantly now connects through ClawLink API-key setup. Reconnect Instantly to enable the expanded tool catalog.',
    is_default = 0,
    updated_at = datetime('now')
WHERE integration = 'instantly'
  AND (auth_provider = 'pipedream' OR pipedream_account_id IS NOT NULL);
