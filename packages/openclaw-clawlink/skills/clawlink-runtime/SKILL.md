---
name: clawlink-runtime
description: Use ClawLink's generic bridge to connect apps, discover backend-served tools, inspect tool guidance, and execute actions safely.
---

Use this skill when the user wants to connect a ClawLink integration or use a connected integration through ClawLink inside OpenClaw.

Runtime workflow:
1. Call `clawlink_list_integrations` to see which ClawLink integrations are already connected.
2. If the requested app is not connected yet, switch to the hosted connection flow below.
3. Call `clawlink_list_tools` to discover the tools available for the user's connected integrations.
4. Choose the matching tool for the user's request.
5. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or any time the request is ambiguous.
6. Use the returned `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups` guidance to shape the request.
7. Prefer read, list, search, and get operations before writes whenever that can reduce ambiguity.
8. Call `clawlink_call_tool` with the selected tool name and arguments.
9. If the user has multiple connections for one integration, use the default connection unless the user asked for a specific account. Pass `connectionId` when needed.
10. Summarize the result clearly and offer a sensible next step.

Hosted connection workflow:
1. Call `clawlink_start_connection` with the integration slug.
2. If the tool returns a `connectUrl`, tell the user to open that hosted setup link.
3. Use the returned `sessionToken` with `clawlink_get_connection_status`.
4. Poll until the session reaches `connected`, `failed`, or `expired`.
5. When the session becomes `connected`, continue with `clawlink_list_integrations` or `clawlink_list_tools`.

Missing API key workflow:
1. If a ClawLink tool reports that the plugin is not configured, ask the user to paste their ClawLink API key.
2. Tell them to paste `/clawlink login <apiKey>` into OpenClaw.
3. Tell them to create the key at `https://claw-link.dev/dashboard/settings?tab=api` if they do not have one yet.
4. Do not print the full API key back to the user after they provide it. Mask it in confirmations.

Rules:
- Do not hardcode provider-specific behavior when `clawlink_describe_tool` can provide guidance.
- Ask for confirmation before destructive actions and before broad or ambiguous writes.
- If the user request is vague, use a read or search tool first when possible.
- If no relevant integration is connected, use the hosted connection flow instead of pretending the tool is available.
- Stop polling once the connection session reaches a terminal state.
