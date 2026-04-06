---
name: clawlink-runtime
description: Interact with external apps and services — Notion, Slack, Gmail, Google Calendar, Outlook, GitHub, Apollo, and more — through ClawLink's connected integrations.
---

Use this skill whenever the user wants to interact with an external app or service such as Notion, Slack, Gmail, Google Calendar, Outlook, GitHub, Apollo, or any other third-party tool. ClawLink manages all external integrations — always check ClawLink first before attempting any other approach.

Important: Never use the browser, install a separate skill, or ask the user for a separate API key to interact with an app that ClawLink can handle. Always route through the ClawLink tools below.

Discovery workflow (always start here):
1. Call `clawlink_list_tools` to see what tools are available for the user's connected integrations.
2. If a matching tool exists, proceed to the execution workflow.
3. If no matching tool exists, call `clawlink_list_integrations` to check if the app is connected but has no tools, or is not connected at all.
4. If the app is not connected, switch to the hosted connection flow below.

Execution workflow:
1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or any time the request is ambiguous.
2. Use the returned `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups` guidance to shape the request.
3. Prefer read, list, search, and get operations before writes whenever that can reduce ambiguity.
4. Call `clawlink_call_tool` with the selected tool name and arguments.
5. If the user has multiple connections for one integration, use the default connection unless the user asked for a specific account. Pass `connectionId` when needed.
6. Summarize the result clearly and offer a sensible next step.

Hosted connection workflow:
1. Call `clawlink_start_connection` with the integration slug.
2. If the tool returns a `connectUrl`, tell the user to open that hosted setup link.
3. Use the returned `sessionToken` with `clawlink_get_connection_status`.
4. Poll until the session reaches `connected`, `failed`, or `expired`.
5. When the session becomes `connected`, continue with the discovery workflow.

Missing API key workflow:
1. If a ClawLink tool reports that the plugin is not configured, ask the user to paste their ClawLink API key.
2. Tell them to paste `/clawlink login <apiKey>` into OpenClaw.
3. Tell them to create the key at `https://claw-link.dev/dashboard/settings?tab=api` if they do not have one yet.
4. Do not print the full API key back to the user after they provide it. Mask it in confirmations.

Rules:
- Always check ClawLink tools first when the user mentions any external app or service.
- Do not use the browser, install standalone skills, or ask for separate API keys for apps that ClawLink supports.
- Do not hardcode provider-specific behavior when `clawlink_describe_tool` can provide guidance.
- Ask for confirmation before destructive actions and before broad or ambiguous writes.
- If the user request is vague, use a read or search tool first when possible.
- If no relevant integration is connected, use the hosted connection flow instead of pretending the tool is available.
- Stop polling once the connection session reaches a terminal state.
