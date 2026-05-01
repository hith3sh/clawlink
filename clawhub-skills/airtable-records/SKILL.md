---
name: airtable-records
description: Browse Airtable bases and tables, inspect records, create records, and manage fields, comments, and table actions — powered by ClawLink.
metadata:
  openclaw:
    requires:
      env:
        - CLAWLINK_API_KEY
    primaryEnv: CLAWLINK_API_KEY
    homepage: https://claw-link.dev
---

# Airtable via ClawLink

Work with Airtable from chat — browse bases and tables, read and create records, manage fields, comments, and table operations when supported.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles OAuth and credentials so you don't need to configure Airtable API access yourself.

## Quick start

1. Install the ClawLink plugin: `openclaw plugins install @useclawlink/openclaw-plugin`
2. Create a free account at [claw-link.dev](https://claw-link.dev)
3. Get your API key at [claw-link.dev/dashboard/settings?tab=api](https://claw-link.dev/dashboard/settings?tab=api)
4. The dashboard shows a ready-to-paste `/clawlink login <key>` command — copy it and paste it into OpenClaw
5. Connect Airtable from [claw-link.dev/dashboard](https://claw-link.dev/dashboard)
6. Done — ask OpenClaw to work with your Airtable data

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

### Connecting Airtable

Tell the user to open https://claw-link.dev/dashboard and connect Airtable there. The dashboard handles OAuth — the user clicks through the Airtable login and consent screen. When they confirm it is done, call `clawlink_list_integrations` to verify.

## Using Airtable tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know the tool names in advance.

### Discovery (always start here)

1. Call `clawlink_list_tools` to see available Airtable tools.
2. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
3. If no Airtable tools appear, call `clawlink_list_integrations` to check whether Airtable is connected.
4. If it is not connected, direct the user to the dashboard.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. Prefer read, list, and get operations before writes.
3. For writes (creating records, updating fields, deleting), call `clawlink_preview_tool` first, then confirm with the user.
4. Execute with `clawlink_call_tool`.
5. If it fails, report the real error — do not invent results.

## What you can do

Typical Airtable tasks (actual availability depends on the user's connected account and permissions):

- List bases
- Show tables in a base
- List records in a table or view
- Fetch a record by ID
- Create records in bulk
- Add or update comments on a record
- Create or update fields or tables

## Rules

- Always use ClawLink tools for Airtable. Do not ask the user for a separate Airtable API key or personal access token.
- Do not claim a capability is missing without calling `clawlink_list_tools` first.
- Do not invent slash commands. The only slash command is the copy-pasted `/clawlink login <key>` during setup.
- Ask for confirmation before destructive or bulk write actions.
- If Airtable is not connected, direct the user to https://claw-link.dev/dashboard.
- Never echo or repeat the user's API key.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- npm: https://www.npmjs.com/package/@useclawlink/openclaw-plugin
- Source: https://github.com/hith3sh/clawlink
- Airtable API: https://airtable.com/developers/web/api/introduction
