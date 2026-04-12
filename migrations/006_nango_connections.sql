PRAGMA foreign_keys = OFF;

CREATE TABLE user_integrations_v3 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  integration TEXT NOT NULL,
  connection_label TEXT,
  account_label TEXT,
  external_account_id TEXT,
  credentials_encrypted TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  auth_state TEXT NOT NULL DEFAULT 'active',
  auth_error TEXT,
  auth_provider TEXT NOT NULL DEFAULT 'clawlink',
  nango_connection_id TEXT,
  nango_provider_config_key TEXT,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO user_integrations_v3 (
  id,
  user_id,
  integration,
  connection_label,
  account_label,
  external_account_id,
  credentials_encrypted,
  is_default,
  auth_state,
  auth_error,
  auth_provider,
  nango_connection_id,
  nango_provider_config_key,
  expires_at,
  created_at,
  updated_at
)
SELECT
  id,
  user_id,
  integration,
  connection_label,
  account_label,
  external_account_id,
  credentials_encrypted,
  is_default,
  auth_state,
  auth_error,
  'clawlink',
  NULL,
  NULL,
  expires_at,
  created_at,
  updated_at
FROM user_integrations;

DROP TABLE user_integrations;
ALTER TABLE user_integrations_v3 RENAME TO user_integrations;

CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_lookup ON user_integrations(user_id, integration);
CREATE INDEX IF NOT EXISTS idx_user_integrations_auth_state
  ON user_integrations(user_id, auth_state);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_default_unique
  ON user_integrations(user_id, integration)
  WHERE is_default = 1;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_external_account_unique
  ON user_integrations(user_id, integration, external_account_id)
  WHERE external_account_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_integrations_nango_connection
  ON user_integrations(nango_connection_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_nango_connection_unique
  ON user_integrations(nango_connection_id)
  WHERE nango_connection_id IS NOT NULL;

PRAGMA foreign_keys = ON;
