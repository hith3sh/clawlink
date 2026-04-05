-- Multi-connection support for integrations

PRAGMA foreign_keys = OFF;

CREATE TABLE user_integrations_v2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  integration TEXT NOT NULL,
  connection_label TEXT,
  account_label TEXT,
  external_account_id TEXT,
  credentials_encrypted TEXT NOT NULL,
  is_default INTEGER NOT NULL DEFAULT 0,
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO user_integrations_v2 (
  id,
  user_id,
  integration,
  connection_label,
  account_label,
  external_account_id,
  credentials_encrypted,
  is_default,
  expires_at,
  created_at,
  updated_at
)
SELECT
  id,
  user_id,
  integration,
  NULL,
  NULL,
  NULL,
  credentials_encrypted,
  1,
  expires_at,
  created_at,
  updated_at
FROM user_integrations;

DROP TABLE user_integrations;
ALTER TABLE user_integrations_v2 RENAME TO user_integrations;

CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_lookup ON user_integrations(user_id, integration);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_default_unique
  ON user_integrations(user_id, integration)
  WHERE is_default = 1;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_integrations_external_account_unique
  ON user_integrations(user_id, integration, external_account_id)
  WHERE external_account_id IS NOT NULL;

ALTER TABLE connection_sessions ADD COLUMN connection_id INTEGER REFERENCES user_integrations(id);
CREATE INDEX IF NOT EXISTS idx_connection_sessions_connection_id ON connection_sessions(connection_id);

PRAGMA foreign_keys = ON;
