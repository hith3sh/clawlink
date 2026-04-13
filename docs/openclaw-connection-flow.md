# ClawLink OpenClaw Connection Flow

This repo now supports the hosted connection-session model for OpenClaw-style installs.

## Flow

1. OpenClaw calls `POST /api/connect/start` with:
   - authenticated browser session, or
   - `X-ClawLink-API-Key: cllk_live_...`
2. ClawLink returns:
   - `sessionId`
   - `sessionToken`
   - `displayCode`
   - `connectUrl`
   - `statusUrl`
   - `expiresAt`
   - `pollIntervalMs`
3. OpenClaw opens `connectUrl` in a browser or prints it for a remote device.
4. The user completes setup on the hosted page.
5. OpenClaw polls `statusUrl` until the session becomes `connected`.

## Status values

- `awaiting_user_action`
- `connected`
- `failed`
- `expired`

## Current provider coverage

- Manual hosted connect is implemented for integrations that declare `credentialFields` and `dashboardStatus = "available"`.
- Nango-managed OAuth integrations use the hosted connect page plus Nango connect sessions and webhook/session reconciliation.
- Legacy provider-specific OAuth start/callback routes for Gmail, Notion, and Outlook are now disabled.

## OpenClaw plugin contract

Recommended plugin tools:

- `clawlink_start_connection`
  - input: `{ integration: string }`
  - calls `POST /api/connect/start`
- `clawlink_get_connection_status`
  - input: `{ sessionToken: string }`
  - calls `GET /api/connect/sessions/:token`

Recommended skill behavior:

- When a user says `connect my notion to openclaw`, call `clawlink_start_connection`.
- If browser access is available, open `connectUrl`.
- Otherwise print the URL and tell the user they can open it on any device.
- Poll until the session reports `connected`.
