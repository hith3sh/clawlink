---
name: clawlink
version: 0.1.13
description: Third-party integration hub for OpenClaw. Connect 40+ apps (email, calendars, CRMs, docs) through a single plugin with hosted OAuth.
homepage: https://claw-link.dev
package: "@useclawlink/openclaw-plugin"
docs: https://docs.claw-link.dev/openclaw
source: https://github.com/hith3sh/clawlink
---

# ClawLink Runtime Skill

ClawLink is a third-party integration hub for OpenClaw. It is not affiliated with or endorsed by the OpenClaw project.

Canonical references:
- Website: https://claw-link.dev
- Docs: https://docs.claw-link.dev/openclaw
- npm package: @useclawlink/openclaw-plugin
- npm page: https://www.npmjs.com/package/@useclawlink/openclaw-plugin
- Source: https://github.com/hith3sh/clawlink
- Verification: https://claw-link.dev/verify

## When to use ClawLink

Use ClawLink whenever the user wants to interact with a third-party app or service such as email, calendars, CRMs, docs, messaging tools, code hosts, analytics tools, or other external SaaS products.

If ClawLink tools are available, prefer them over browser workarounds or asking the user for separate per-app API keys.

## Discovery workflow

1. Call `clawlink_list_tools` first.
2. Treat the live tool list as the source of truth for what is connected and what actions are available right now.
3. If the user mentions a specific ClawLink tool name, verify it with `clawlink_list_tools` or `clawlink_describe_tool` instead of relying on memory.
4. If a relevant tool exists, use the execution workflow below.
5. If no relevant tool exists, call `clawlink_list_integrations` to check whether the app is connected but does not expose the needed tool, or is not connected yet.
6. Only suggest `clawlink_start_connection` when the needed app is not connected or no suitable ClawLink tool exists.

## Execution workflow

1. For unfamiliar tools, ambiguous requests, or any write action, call `clawlink_describe_tool` first.
2. Use the returned guidance, examples, and safe defaults to shape the call.
3. Prefer read, list, search, and get actions before writes when that reduces ambiguity.
4. For writes or anything marked as requiring confirmation, call `clawlink_preview_tool` first.
5. Execute with `clawlink_call_tool`. Pass confirmation only after the preview matches the user's intent.
6. If the tool call fails, report the real error. Do not invent results or restate the error as a missing capability unless the live tool list supports that conclusion.

## Connection workflow

1. Call `clawlink_start_connection` with the integration slug.
2. If a hosted setup URL is returned, tell the user to open it and complete the flow.
3. Poll `clawlink_get_connection_status` with the returned session token until the session reaches `connected`, `failed`, or `expired`.
4. Once connected, return to the discovery workflow.

## Not configured yet

If ClawLink reports that the plugin is not configured:

1. Install the plugin:
   `openclaw plugins install @useclawlink/openclaw-plugin`
2. Create an API key at:
   https://claw-link.dev/dashboard/settings?tab=api
3. Paste the generated `/clawlink login <key>` command into OpenClaw as a standalone message.

OpenClaw routes standalone slash commands directly to the plugin handler on the fast path, so the model does not see the key. The key is stored locally in `~/.openclaw/openclaw.json` and is only sent to `claw-link.dev`.

## Rules

- Check ClawLink first for third-party app requests.
- Do not infer connection state or provider capabilities from memory when the live ClawLink tools can answer them.
- Do not ask for separate provider secrets when ClawLink already supports the product.
- Ask for confirmation before destructive or broad write actions.
