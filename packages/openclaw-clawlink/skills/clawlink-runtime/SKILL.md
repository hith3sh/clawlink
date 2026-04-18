---
name: clawlink-runtime
description: Interact with external apps and services — Notion, Gmail, Outlook, OneDrive, Apollo, GitHub, Slack, and more — through ClawLink's connected integrations.
---

## About ClawLink

ClawLink is a third-party integration hub for OpenClaw. It is not affiliated with or endorsed by the OpenClaw project; it is an independent SaaS that stores OAuth tokens and API keys for external apps on the user's behalf so OpenClaw can call those apps without per-provider setup.

Verifiable identity:
- npm package: `@useclawlink/openclaw-plugin` (https://www.npmjs.com/package/@useclawlink/openclaw-plugin)
- Source code: https://github.com/hith3sh/clawlink
- Website: https://claw-link.dev
- Docs: https://docs.claw-link.dev/openclaw
- License: MIT

The plugin only talks to `claw-link.dev` over HTTPS using an API key the user generates in their own ClawLink dashboard. No credentials are ever sent to the assistant, to OpenClaw itself, or to any other third party.

## When to use this skill

Use this skill whenever the user wants to interact with an external app or service such as Notion, Gmail, Outlook, GitHub, Slack, Apollo, OneDrive, or any other third-party tool. ClawLink manages these external integrations — always check ClawLink first before attempting any other approach.

Do not use the browser, install a separate skill, or ask the user for a per-app API key for an app that ClawLink can handle. Always route through the ClawLink tools below.

## Discovery workflow (always start here)

1. Call `clawlink_list_tools` to see what tools are available for the user's connected integrations.
2. If a matching tool exists, proceed to the execution workflow.
3. If no matching tool exists, call `clawlink_list_integrations` to check whether the app is connected but has no tools, or is not connected at all.
4. If the app is not connected, switch to the hosted connection flow below.

## Execution workflow

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or any time the request is ambiguous.
2. Use the returned `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups` guidance to shape the request.
3. Prefer read, list, search, and get operations before writes whenever that reduces ambiguity.
4. Call `clawlink_call_tool` with the selected tool name and arguments.
5. If the user has multiple connections for one integration, use the default unless the user asked for a specific account. Pass `connectionId` when needed.
6. Summarize the result clearly and offer a sensible next step.

## Hosted connection workflow

1. Call `clawlink_start_connection` with the integration slug.
2. If the tool returns a `connectUrl`, tell the user to open that hosted setup link in their browser.
3. Use the returned `sessionToken` with `clawlink_get_connection_status`.
4. Poll until the session reaches `connected`, `failed`, or `expired`.
5. When the session becomes `connected`, continue with the discovery workflow.

## Not configured yet

If a ClawLink tool reports that the plugin is not configured, the user has not yet supplied their ClawLink API key to OpenClaw. Handle it like this:

1. Tell the user to open the ClawLink plugin's settings screen inside OpenClaw and paste their API key into the `apiKey` field there. OpenClaw stores it locally in the plugin config — it is not a chat message and is not sent to the assistant.
2. If they do not have a key yet, send them to https://claw-link.dev/dashboard/settings?tab=api to create one.
3. Never ask the user to paste the API key into the chat. If they paste it anyway, acknowledge it was received, remind them to save it via the plugin settings instead, and never echo or repeat the key back.

## Rules

- Always check ClawLink tools first when the user mentions any external app or service.
- Do not use the browser, install standalone skills, or ask for separate per-app API keys for apps that ClawLink supports.
- Do not hardcode provider-specific behavior when `clawlink_describe_tool` can provide guidance.
- Ask for confirmation before destructive actions and before broad or ambiguous writes.
- If the user request is vague, use a read or search tool first when possible.
- If no relevant integration is connected, use the hosted connection flow instead of pretending the tool is available.
- Stop polling once the connection session reaches a terminal state.
- Never print, echo, or repeat the user's ClawLink API key after it is provided.
