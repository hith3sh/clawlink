-- Hosted connection sessions for browser/headless setup flows

CREATE TABLE IF NOT EXISTS connection_sessions (
  id TEXT PRIMARY KEY,
  public_token TEXT UNIQUE NOT NULL,
  display_code TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL,
  integration TEXT NOT NULL,
  connection_id INTEGER,
  status TEXT NOT NULL,
  flow_type TEXT NOT NULL,
  error_message TEXT,
  expires_at DATETIME NOT NULL,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (connection_id) REFERENCES user_integrations(id)
);

CREATE INDEX IF NOT EXISTS idx_connection_sessions_user_id ON connection_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_connection_sessions_integration ON connection_sessions(integration);
CREATE INDEX IF NOT EXISTS idx_connection_sessions_connection_id ON connection_sessions(connection_id);
CREATE INDEX IF NOT EXISTS idx_connection_sessions_status ON connection_sessions(status);
CREATE INDEX IF NOT EXISTS idx_connection_sessions_expires_at ON connection_sessions(expires_at);
