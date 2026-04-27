-- App request voting system

CREATE TABLE IF NOT EXISTS app_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  toolkit_name TEXT NOT NULL,
  use_case TEXT NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS app_request_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES app_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(request_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_app_requests_votes ON app_requests(votes DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_requests_user ON app_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_app_request_votes_request ON app_request_votes(request_id);
CREATE INDEX IF NOT EXISTS idx_app_request_votes_user ON app_request_votes(user_id);
