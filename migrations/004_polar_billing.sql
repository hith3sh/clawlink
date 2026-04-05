-- Polar billing state synced from checkout and webhook events

CREATE TABLE IF NOT EXISTS billing_accounts (
  user_id TEXT PRIMARY KEY,
  polar_customer_id TEXT,
  polar_external_customer_id TEXT NOT NULL,
  polar_checkout_id TEXT,
  polar_subscription_id TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free',
  product_id TEXT,
  product_name TEXT,
  current_period_end DATETIME,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  canceled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_accounts_customer_id
  ON billing_accounts(polar_customer_id)
  WHERE polar_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_accounts_subscription_id
  ON billing_accounts(polar_subscription_id)
  WHERE polar_subscription_id IS NOT NULL;

