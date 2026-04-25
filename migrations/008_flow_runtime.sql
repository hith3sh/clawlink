CREATE TABLE IF NOT EXISTS flows (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  template_key TEXT NOT NULL,
  status TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  input_json TEXT NOT NULL,
  context_json TEXT NOT NULL,
  current_step TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS flow_steps (
  id TEXT PRIMARY KEY,
  flow_id TEXT NOT NULL,
  step_key TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  step_type TEXT NOT NULL,
  status TEXT NOT NULL,
  input_json TEXT NOT NULL,
  output_json TEXT,
  error_json TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (flow_id) REFERENCES flows(id)
);

CREATE INDEX IF NOT EXISTS idx_flows_user_created
  ON flows(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_flows_status
  ON flows(user_id, status, updated_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_flow_steps_flow_key
  ON flow_steps(flow_id, step_key);

CREATE INDEX IF NOT EXISTS idx_flow_steps_flow_order
  ON flow_steps(flow_id, step_index);
