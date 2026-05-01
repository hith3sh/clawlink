---
name: salesforce-ops
description: Search Salesforce records, inspect objects, query CRM data, and perform actions for accounts, contacts, leads, opportunities, and cases — powered by ClawLink.
metadata:
  openclaw:
    requires:
      env:
        - CLAWLINK_API_KEY
    primaryEnv: CLAWLINK_API_KEY
    homepage: https://claw-link.dev
---

# Salesforce via ClawLink

Work with Salesforce CRM from chat — search records, manage contacts, leads, accounts, opportunities, cases, and more.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles OAuth and credentials so you don't need to configure Salesforce API access yourself.

## Quick start

1. Install the ClawLink plugin: `openclaw plugins install @useclawlink/openclaw-plugin`
2. Create a free account at [claw-link.dev](https://claw-link.dev)
3. Get your API key at [claw-link.dev/dashboard/settings?tab=api](https://claw-link.dev/dashboard/settings?tab=api)
4. The dashboard shows a ready-to-paste `/clawlink login <key>` command — copy it and paste it into OpenClaw
5. Connect Salesforce from [claw-link.dev/dashboard](https://claw-link.dev/dashboard)
6. Done — ask OpenClaw to work with your Salesforce data

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

### Connecting Salesforce

Tell the user to open https://claw-link.dev/dashboard and connect Salesforce there. The dashboard handles OAuth — the user clicks through the Salesforce login and grant screen. When they confirm it is done, call `clawlink_list_integrations` to verify.

## Using Salesforce tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know the tool names in advance.

### Discovery (always start here)

1. Call `clawlink_list_tools` to see available Salesforce tools.
2. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
3. If no Salesforce tools appear, call `clawlink_list_integrations` to check whether Salesforce is connected.
4. If it is not connected, direct the user to the dashboard.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. Prefer read and search operations before writes.
3. For writes or destructive actions, call `clawlink_preview_tool` first, then confirm with the user.
4. Execute with `clawlink_call_tool`.
5. If it fails, report the real error — do not invent results.

## What you can do

Typical Salesforce tasks (actual availability depends on the user's connected account and permissions):

- Find contacts, leads, or accounts by name or email
- Search opportunities by customer or stage
- Look up open cases
- Inspect supported Salesforce objects
- Create, update, or delete records when those actions are available
- Run SOQL-style queries when supported

## Rules

- Always use ClawLink tools for Salesforce. Do not ask the user for separate Salesforce credentials.
- Do not claim a capability is missing without calling `clawlink_list_tools` first.
- Do not invent slash commands. The only slash command is the copy-pasted `/clawlink login <key>` during setup.
- Ask for confirmation before destructive or bulk write actions.
- If Salesforce is not connected, direct the user to https://claw-link.dev/dashboard.
- Never echo or repeat the user's API key.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- npm: https://www.npmjs.com/package/@useclawlink/openclaw-plugin
- Source: https://github.com/hith3sh/clawlink
- Salesforce REST API: https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest
