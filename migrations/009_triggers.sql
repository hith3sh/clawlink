CREATE TABLE IF NOT EXISTS triggers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  integration TEXT,
  type TEXT NOT NULL,
  config_json TEXT NOT NULL,
  target_flow_template TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  last_fired_at DATETIME,
  next_run_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS trigger_logs (
  id TEXT PRIMARY KEY,
  trigger_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  payload_json TEXT,
  flow_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trigger_id) REFERENCES triggers(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_triggers_user_created
  ON triggers(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_triggers_due
  ON triggers(type, enabled, next_run_at);

CREATE INDEX IF NOT EXISTS idx_trigger_logs_trigger_created
  ON trigger_logs(trigger_id, created_at DESC);
