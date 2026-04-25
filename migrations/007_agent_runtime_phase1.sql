ALTER TABLE user_integrations
  ADD COLUMN last_used_at DATETIME;

ALTER TABLE user_integrations
  ADD COLUMN last_success_at DATETIME;

ALTER TABLE user_integrations
  ADD COLUMN last_error_at DATETIME;

ALTER TABLE user_integrations
  ADD COLUMN last_error_code TEXT;

ALTER TABLE user_integrations
  ADD COLUMN last_error_message TEXT;

ALTER TABLE user_integrations
  ADD COLUMN scope_snapshot_json TEXT;

ALTER TABLE user_integrations
  ADD COLUMN capabilities_json TEXT;

CREATE INDEX IF NOT EXISTS idx_user_integrations_last_used
  ON user_integrations(user_id, last_used_at);

CREATE TABLE IF NOT EXISTS tool_executions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  flow_id TEXT,
  step_id TEXT,
  integration TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  connection_id INTEGER,
  execution_mode TEXT NOT NULL,
  status TEXT NOT NULL,
  error_type TEXT,
  error_code TEXT,
  request_json TEXT NOT NULL,
  response_json TEXT,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  provider_request_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (connection_id) REFERENCES user_integrations(id)
);

CREATE INDEX IF NOT EXISTS idx_tool_executions_user_created
  ON tool_executions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tool_executions_tool
  ON tool_executions(user_id, tool_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tool_executions_connection
  ON tool_executions(connection_id, created_at DESC);
