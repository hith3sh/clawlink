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
2. Treat the returned tool list as the source of truth for the current turn. Do not rely on memory, prior examples, or assumptions about what a provider can do.
3. If the user names or hints at a specific ClawLink tool, verify it against `clawlink_list_tools` instead of contradicting the user from memory.
4. If a matching tool exists, proceed to the execution workflow.
5. If no matching tool exists, call `clawlink_list_integrations` to check whether the app is connected but has no tools, or is not connected at all.
6. If the app is not connected, switch to the hosted connection flow below.

## Capability claims

Before saying any of the following, you must have checked the live ClawLink tool catalog in the current turn:

- "there is no tool for that"
- "ClawLink does not support that"
- any provider-specific claim about missing capabilities

If you have not called `clawlink_list_tools` in the current turn, do not make those claims. Call it first.

## Execution workflow

1. If the user asked for a concrete operation and there is an exact matching tool in the catalog, prefer using that exact tool name over substituting a nearby search tool.
2. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or any time the request is ambiguous.
3. Use the returned `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups` guidance to shape the request.
4. Prefer read, list, search, and get operations before writes whenever that reduces ambiguity.
5. Call `clawlink_call_tool` with the selected tool name and arguments.
6. If the user has multiple connections for one integration, use the default unless the user asked for a specific account. Pass `connectionId` when needed.
7. If the tool call fails, report the actual error. Do not invent results, and do not restate the failure as a capability gap unless the live tool catalog supports that conclusion.
8. Summarize the result clearly and offer a sensible next step.

## Hosted connection workflow

1. Call `clawlink_start_connection` with the integration slug.
2. If the tool returns a `connectUrl`, tell the user to open that hosted setup link in their browser.
3. Use the returned `sessionToken` with `clawlink_get_connection_status`.
4. Poll until the session reaches `connected`, `failed`, or `expired`.
5. When the session becomes `connected`, continue with the discovery workflow.

## Not configured yet

If a ClawLink tool reports that the plugin is not configured, the user has not yet supplied their ClawLink API key to OpenClaw. Handle it like this:

1. If they do not have a key yet, send them to https://claw-link.dev/dashboard/settings?tab=api to create one.
2. Tell them to paste the `/clawlink login <key>` command from the dashboard into this chat as a standalone message. OpenClaw's gateway routes slash commands directly to the ClawLink plugin handler on the fast path (see docs.openclaw.ai/tools/slash-commands) — you will not see the command or the key, and the plugin stores it locally in OpenClaw's config.
3. If the user's OpenClaw client renders a plugin settings UI, they can alternatively paste the raw key into the `apiKey` ("ClawLink API key") field in the plugin settings. Same local storage, same destination.
4. Never echo or repeat the API key back, even if the user pastes it in a form you can see.

## Rules

- Always check ClawLink tools first when the user mentions any external app or service.
- The live output of `clawlink_list_tools` overrides your prior beliefs about which provider operations exist.
- Do not use the browser, install standalone skills, or ask for separate per-app API keys for apps that ClawLink supports.
- Do not hardcode provider-specific behavior when `clawlink_describe_tool` can provide guidance.
- If a user mentions a specific ClawLink tool name, verify it against `clawlink_list_tools` or `clawlink_describe_tool` instead of dismissing it from memory.
- Ask for confirmation before destructive actions and before broad or ambiguous writes.
- If the user request is vague, use a read or search tool first when possible.
- If no relevant integration is connected, use the hosted connection flow instead of pretending the tool is available.
- Stop polling once the connection session reaches a terminal state.
- Never print, echo, or repeat the user's ClawLink API key after it is provided.
