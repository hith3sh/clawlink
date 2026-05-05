ALTER TABLE users ADD COLUMN billing_access_started_at DATETIME;

UPDATE users
SET billing_access_started_at = COALESCE(billing_access_started_at, CURRENT_TIMESTAMP)
WHERE billing_access_started_at IS NULL;
