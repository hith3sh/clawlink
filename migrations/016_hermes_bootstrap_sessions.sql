-- Short-lived install sessions for chat-first Hermes bootstrap.
--
-- A local Hermes installer starts an unauthenticated session, the user approves
-- it in ClawLink, and the installer polls for a scoped ClawLink MCP credential.

CREATE TABLE IF NOT EXISTS hermes_bootstrap_sessions (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  agent_family TEXT NOT NULL,
  agent_version TEXT,
  client_label TEXT NOT NULL,
  hostname TEXT,
  platform TEXT,
  approval_return_hint TEXT,
  requested_transport TEXT,
  user_id TEXT,
  workspace_id TEXT,
  api_key_id INTEGER,
  install_token_hash TEXT,
  issued_key_encrypted TEXT,
  ip_hash TEXT,
  expires_at DATETIME NOT NULL,
  approved_at DATETIME,
  consumed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  metadata_json TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
);

CREATE INDEX IF NOT EXISTS idx_hermes_bootstrap_sessions_status
  ON hermes_bootstrap_sessions(status);
CREATE INDEX IF NOT EXISTS idx_hermes_bootstrap_sessions_expires_at
  ON hermes_bootstrap_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_hermes_bootstrap_sessions_user_id
  ON hermes_bootstrap_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_hermes_bootstrap_sessions_ip_created
  ON hermes_bootstrap_sessions(ip_hash, created_at);
