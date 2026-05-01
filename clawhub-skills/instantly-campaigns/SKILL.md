---
name: instantly-campaigns
description: Manage cold email campaigns, leads, and tags in Instantly — powered by ClawLink.
metadata:
  openclaw:
    requires:
      env:
        - CLAWLINK_API_KEY
    primaryEnv: CLAWLINK_API_KEY
    homepage: https://claw-link.dev
---

# Instantly via ClawLink

Work with Instantly cold email outreach from chat — manage campaigns, leads, and tags.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles OAuth and credentials so you don't need to configure Instantly API access yourself.

## Quick start

1. Install the ClawLink plugin: `openclaw plugins install @useclawlink/openclaw-plugin`
2. Create a free account at [claw-link.dev](https://claw-link.dev)
3. Get your API key at [claw-link.dev/dashboard/settings?tab=api](https://claw-link.dev/dashboard/settings?tab=api)
4. The dashboard shows a ready-to-paste `/clawlink login <key>` command — copy it and paste it into OpenClaw
5. Connect Instantly from [claw-link.dev/dashboard](https://claw-link.dev/dashboard)
6. Done — ask OpenClaw to work with your Instantly campaigns

## Setup details

### Installing the plugin

If the ClawLink plugin is not installed yet, tell the user to run:

```
openclaw plugins install @useclawlink/openclaw-plugin
```

### Adding the API key

If ClawLink reports that the plugin is not configured, the user has not added their API key yet.

1. Sign up or sign in at https://claw-link.dev
2. Go to https://claw-link.dev/dashboard/settings?tab=api and create an API key
3. The dashboard shows a ready-to-paste `/clawlink login <key>` command — tell the user to **copy that line from the dashboard and paste it into OpenClaw**. They are copy-pasting, not typing.
4. Alternatively, if the OpenClaw client shows a plugin settings UI, they can paste the key into the `apiKey` field.

The key is stored locally in `~/.openclaw/openclaw.json` and is only sent to `claw-link.dev`. Never echo or repeat the key.

### Connecting Instantly

Tell the user to open https://claw-link.dev/dashboard and connect Instantly there. The dashboard handles OAuth — the user clicks through the Instantly login and grant screen. When they confirm it is done, call `clawlink_list_integrations` to verify.

## Using Instantly tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know the tool names in advance.

### Discovery (always start here)

1. Call `clawlink_list_tools` to see available Instantly tools.
2. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
3. If no Instantly tools appear, call `clawlink_list_integrations` to check whether Instantly is connected.
4. If it is not connected, direct the user to the dashboard.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. For all Instantly actions, call `clawlink_preview_tool` first, then confirm with the user.
3. Execute with `clawlink_call_tool`.
4. If it fails, report the real error — do not invent results.

## What you can do

Typical Instantly tasks (actual availability depends on the user's connected account and permissions):

- Add leads to a campaign
- Add tags to campaigns
- Update the interest status of a lead in a campaign

## Rules

- Always use ClawLink tools for Instantly. Do not ask the user for separate Instantly API keys.
- Do not claim a capability is missing without calling `clawlink_list_tools` first.
- Do not invent slash commands. The only slash command is the copy-pasted `/clawlink login <key>` during setup.
- Ask for confirmation before any Instantly write action.
- If Instantly is not connected, direct the user to https://claw-link.dev/dashboard.
- Never echo or repeat the user's API key.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- npm: https://www.npmjs.com/package/@useclawlink/openclaw-plugin
- Source: https://github.com/hith3sh/clawlink
- Instantly API: https://developer.instantly.ai/
