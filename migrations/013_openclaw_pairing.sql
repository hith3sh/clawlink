-- Browser pairing sessions for the OpenClaw plugin.
--
-- These sessions let a local OpenClaw plugin start an unauthenticated device
-- pairing flow, have the user approve it in the browser, then exchange that
-- approval for a locally stored ClawLink credential without copy/pasting.

CREATE TABLE IF NOT EXISTS openclaw_pairing_sessions (
  id TEXT PRIMARY KEY,
  public_token TEXT UNIQUE NOT NULL,
  display_code TEXT UNIQUE NOT NULL,
  device_label TEXT NOT NULL,
  verifier_hash TEXT NOT NULL,
  approved_user_id TEXT,
  api_key_id INTEGER,
  issued_key_encrypted TEXT,
  status TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  approved_at DATETIME,
  paired_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (approved_user_id) REFERENCES users(id),
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id)
);

CREATE INDEX IF NOT EXISTS idx_openclaw_pairing_sessions_status
  ON openclaw_pairing_sessions(status);
CREATE INDEX IF NOT EXISTS idx_openclaw_pairing_sessions_expires_at
  ON openclaw_pairing_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_openclaw_pairing_sessions_approved_user_id
  ON openclaw_pairing_sessions(approved_user_id);
