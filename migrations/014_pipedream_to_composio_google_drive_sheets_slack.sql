-- Mark existing Pipedream connections for google-drive, google-sheets, and slack
-- as needing reauth now that these integrations use Composio instead.
UPDATE user_integrations
SET auth_state = 'needs_reauth',
    auth_error = 'This integration now connects through ClawLink''s hosted setup. Reconnect to enable the expanded tool catalog.',
    is_default = 0,
    updated_at = datetime('now')
WHERE integration IN ('google-drive', 'google-sheets', 'slack')
  AND (auth_provider = 'pipedream' OR pipedream_account_id IS NOT NULL);