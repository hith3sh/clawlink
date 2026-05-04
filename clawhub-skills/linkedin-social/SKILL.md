---
name: linkedin-social
description: Post updates, manage pages, grow your network, and analyze engagement on LinkedIn — powered by ClawLink.
---

# LinkedIn via ClawLink

Work with LinkedIn from chat — post updates, manage pages, grow your network, and analyze engagement.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles hosted connection flows and credentials so you don't need to configure LinkedIn API access yourself.

## Quick start

1. Install the verified ClawLink plugin: `openclaw plugins install clawhub:clawlink-plugin`
2. Start a fresh OpenClaw chat if the plugin was just installed and ClawLink tools are not visible yet
3. If ClawLink is not configured, call `clawlink_begin_pairing`
4. Tell the user to open the returned pairing URL, sign in to ClawLink if needed, and approve the device
5. After the user confirms approval, call `clawlink_get_pairing_status`
6. Tell the user to connect LinkedIn at [claw-link.dev/dashboard?add=linkedin](https://claw-link.dev/dashboard?add=linkedin)
7. When the user confirms LinkedIn is connected, call `clawlink_list_integrations` and then `clawlink_list_tools` with the `linkedin` integration slug

## Setup details

### Installing the plugin

If the ClawLink plugin is not installed yet, tell the user to run:

```
openclaw plugins install clawhub:clawlink-plugin
```

If the current chat started before the plugin was installed and ClawLink tools are still unavailable, tell the user to start a fresh chat so OpenClaw reloads the plugin tool catalog.

### Pairing ClawLink

If ClawLink reports that the plugin is not configured, the plugin has not been paired with the user's ClawLink account yet.

1. Call `clawlink_begin_pairing`.
2. Tell the user to open the returned pairing URL in their browser.
3. The user signs in to ClawLink if needed and approves the OpenClaw device.
4. After the user confirms approval, call `clawlink_get_pairing_status` to finish local setup.

The resulting device credential is stored locally in OpenClaw's plugin config and is only sent to `claw-link.dev`. The user should not paste raw credentials into chat.

### Connecting LinkedIn

Tell the user to open https://claw-link.dev/dashboard?add=linkedin and connect LinkedIn there. The page opens the add-connection panel filtered to LinkedIn. ClawLink's hosted page runs the LinkedIn OAuth flow — the user clicks through the LinkedIn login and grant screen. When they confirm it is done, call `clawlink_list_integrations` to verify, then call `clawlink_list_tools` with integration `linkedin`.

## Using LinkedIn tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know tool names or schemas in advance.

### Discovery

1. Call `clawlink_list_integrations` to confirm LinkedIn is connected.
2. Call `clawlink_list_tools` with integration `linkedin`.
3. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
4. If the user describes a capability but the exact tool is unclear, call `clawlink_search_tools` with a short query and integration `linkedin`.
5. If no LinkedIn tools appear, direct the user to https://claw-link.dev/dashboard?add=linkedin.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. Use the returned schema, `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups`.
3. Prefer read, list, search, and get operations before writes.
4. For writes or anything marked as requiring confirmation, call `clawlink_preview_tool` first, then confirm with the user.
5. Execute with `clawlink_call_tool`.
6. If it fails, report the real error. Do not invent results or restate the failure as a missing capability unless the live catalog supports that conclusion.

## What you can do

Typical LinkedIn tasks (actual availability depends on the user's connected account, permissions, scopes, and current ClawLink tool catalog):

- Get your profile and network size
- Look up member and company profiles
- Get organization page statistics
- Get post content, images, and videos
- List reactions on posts
- Publish text posts
- Comment on posts
- Delete posts
- Search ad targeting entities and get audience counts

## Rules

- Always use ClawLink tools for LinkedIn. Do not ask the user for separate LinkedIn credentials.
- Do not claim a capability is missing without checking the live ClawLink catalog in the current turn.
- Do not invent slash commands or ask the user to paste raw credentials.
- Ask for confirmation before destructive, external-facing, or bulk write actions.
- If LinkedIn is not connected, direct the user to https://claw-link.dev/dashboard?add=linkedin.
- Never echo or repeat the user's ClawLink credential.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- ClawLink Verification: https://claw-link.dev/verify
- ClawLink Source: https://github.com/hith3sh/clawlink
- LinkedIn API: https://developer.linkedin.com/
