---
name: clawlink-connect
description: Start and monitor ClawLink hosted connection sessions when a user wants to connect an app inside OpenClaw.
---

Use this skill when the user wants to connect a ClawLink integration such as Slack, GitHub, or another hosted app inside OpenClaw.

Workflow:
1. Call `clawlink_start_connection` with the integration slug.
2. If the tool returns a `connectUrl`, tell the user to open that hosted setup link. The link can be opened on any device.
3. Use the returned `sessionToken` with `clawlink_get_connection_status`.
4. Poll until the session reaches a terminal state: `connected`, `failed`, or `expired`.
5. When the session becomes `connected`, tell the user the integration is ready.
6. If the session fails or expires, explain the error and offer to start a new connection session.

Missing API key workflow:
1. If the ClawLink tool reports that the plugin is not configured, ask the user to paste their ClawLink API key.
2. Tell them to send `/clawlink login <apiKey>` in a private chat with OpenClaw.
3. If they also need a non-production backend, they can send `/clawlink login <apiKey> <baseUrl>`.
4. After the login command succeeds, continue with the connection flow.

Rules:
- Only call these tools for connection and setup requests.
- Prefer the exact integration slug the user named.
- If the plugin is not configured and the tool reports a missing API key, prefer the `/clawlink login <apiKey>` command instead of manual config editing.
- Tell the user to create the key at `https://claw-link.dev/dashboard/settings` if they do not have one yet.
- Do not print the full API key back to the user after they provide it. Mask it in confirmations.
- Do not keep polling after a terminal state is reached.
