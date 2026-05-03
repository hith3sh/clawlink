# How to create a new ClawHub skill for a ClawLink integration

This guide is for agents or contributors creating a new per-integration skill to publish on [ClawHub](https://clawhub.ai) under the `hith3sh` account. Each skill is a thin onboarding wrapper that teaches OpenClaw how to install the verified ClawLink plugin, pair it with the user's ClawLink account, and use the dynamic tool system for one provider.

## Architecture context

ClawLink uses a **single verified OpenClaw plugin** published to ClawHub as `clawlink-plugin`. Per-integration skills should point users to the ClawHub plugin install:

```bash
openclaw plugins install clawhub:clawlink-plugin
```

Do not promote the npm package in user-facing skill content. The npm package still exists for release compatibility, but ClawHub is the preferred install surface because OpenClaw can verify it.

The plugin exposes these tools at runtime:

- `clawlink_begin_pairing` — start browser pairing when the plugin is not configured
- `clawlink_get_pairing_status` — finish pairing after browser approval
- `clawlink_list_integrations` — check which integrations are connected
- `clawlink_list_tools` — list available tools for one connected integration
- `clawlink_search_tools` — search the live tool catalog for a capability
- `clawlink_describe_tool` — get usage guidance and the current argument schema
- `clawlink_preview_tool` — dry-run or preview a write when available
- `clawlink_call_tool` — execute a tool

`clawlink_start_connection` and `clawlink_get_connection_status` still exist for compatibility, but skills should not use them to start user-facing setup. New app connections happen through the filtered dashboard add-connection URL, such as `https://claw-link.dev/dashboard?add=airtable`.

Because tools are discovered dynamically, **skills do NOT need to list specific tool names, endpoints, or code examples**. The skill's job is to:

1. Get the user from zero to a paired ClawLink plugin
2. Direct app connection to the hosted dashboard
3. Teach the agent the live discovery, description, preview, and execution workflow
4. Provide provider-specific context in plain English

## Backend and schema context

ClawLink can expose tools from different backends depending on the provider and connection:

- Pipedream-backed connections use generated Pipedream action manifests with imported LLM-facing schemas, overrides, safe defaults, and hidden internal props.
- Composio-backed connections use generated Composio manifests. Static manifests may contain empty schema stubs; schemas are hydrated at runtime from Composio and cached in KV.
- Some legacy Nango/custom paths may still exist, but new skill content should not care which backend is active.

For a skill, this means:

- Always treat `clawlink_list_tools`, `clawlink_search_tools`, and `clawlink_describe_tool` as the source of truth.
- Never hardcode provider tool names, argument schemas, required fields, or backend assumptions.
- Do not copy schemas out of generated manifests into the skill. Pipedream imports and Composio schema hydration can change independently of the skill text.

## File structure

Each skill is a folder with this layout:

```text
clawhub-skills/
  <slug>/
    SKILL.md          # Required — the skill content
    .clawhub/
      origin.json     # Created by CLI after first publish
```

The `<slug>` is the ClawHub URL slug (for example `salesforce-ops`, `onedrive-files`). It must be lowercase and URL-safe: `^[a-z0-9][a-z0-9-]*$`.

## SKILL.md template

Copy this template and replace all `{{PLACEHOLDERS}}` with the actual values for the integration.

````markdown
---
name: {{SLUG}}
description: {{ONE_LINE_DESCRIPTION}} — powered by ClawLink.
---

# {{DISPLAY_NAME}} via ClawLink

Work with {{DISPLAY_NAME}} from chat — {{SHORT_CAPABILITIES_SUMMARY}}.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles hosted connection flows and credentials so you don't need to configure {{DISPLAY_NAME}} API access yourself.

## Quick start

1. Install the verified ClawLink plugin: `openclaw plugins install clawhub:clawlink-plugin`
2. Start a fresh OpenClaw chat if the plugin was just installed and ClawLink tools are not visible yet
3. If ClawLink is not configured, call `clawlink_begin_pairing`
4. Tell the user to open the returned pairing URL, sign in to ClawLink if needed, and approve the device
5. After the user confirms approval, call `clawlink_get_pairing_status`
6. Tell the user to connect {{DISPLAY_NAME}} at [claw-link.dev/dashboard?add={{INTEGRATION_SLUG}}](https://claw-link.dev/dashboard?add={{INTEGRATION_SLUG}})
7. When the user confirms {{DISPLAY_NAME}} is connected, call `clawlink_list_integrations` and then `clawlink_list_tools` with the `{{INTEGRATION_SLUG}}` integration slug

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

### Connecting {{DISPLAY_NAME}}

Tell the user to open https://claw-link.dev/dashboard?add={{INTEGRATION_SLUG}} and connect {{DISPLAY_NAME}} there. The page opens the add-connection panel filtered to {{DISPLAY_NAME}}. ClawLink's hosted page runs whichever provider flow is needed ({{AUTH_METHOD}}) — the user {{AUTH_USER_ACTION}}. When they confirm it is done, call `clawlink_list_integrations` to verify, then call `clawlink_list_tools` with integration `{{INTEGRATION_SLUG}}`.

## Using {{DISPLAY_NAME}} tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know tool names or schemas in advance.

### Discovery

1. Call `clawlink_list_integrations` to confirm {{DISPLAY_NAME}} is connected.
2. Call `clawlink_list_tools` with integration `{{INTEGRATION_SLUG}}`.
3. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
4. If the user describes a capability but the exact tool is unclear, call `clawlink_search_tools` with a short query and integration `{{INTEGRATION_SLUG}}`.
5. If no {{DISPLAY_NAME}} tools appear, direct the user to https://claw-link.dev/dashboard?add={{INTEGRATION_SLUG}}.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. Use the returned schema, `whenToUse`, `askBefore`, `safeDefaults`, `examples`, and `followups`.
3. Prefer read, list, search, and get operations before writes.
4. For writes or anything marked as requiring confirmation, call `clawlink_preview_tool` first, then confirm with the user.
5. Execute with `clawlink_call_tool`.
6. If it fails, report the real error. Do not invent results or restate the failure as a missing capability unless the live catalog supports that conclusion.

## What you can do

Typical {{DISPLAY_NAME}} tasks (actual availability depends on the user's connected account, permissions, scopes, and current ClawLink tool catalog):

{{BULLET_LIST_OF_CAPABILITIES}}

## Rules

- Always use ClawLink tools for {{DISPLAY_NAME}}. Do not ask the user for separate {{DISPLAY_NAME}} credentials.
- Do not claim a capability is missing without checking the live ClawLink catalog in the current turn.
- Do not invent slash commands or ask the user to paste raw credentials.
- Ask for confirmation before destructive, external-facing, or bulk write actions.
- If {{DISPLAY_NAME}} is not connected, direct the user to https://claw-link.dev/dashboard?add={{INTEGRATION_SLUG}}.
- Never echo or repeat the user's ClawLink credential.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- ClawLink Verification: https://claw-link.dev/verify
- ClawLink Source: https://github.com/hith3sh/clawlink
{{PROVIDER_DOCS_LINKS}}
````

## Placeholder reference

| Placeholder | What to fill in | Example |
|---|---|---|
| `{{SLUG}}` | ClawHub URL slug, lowercase with hyphens | `salesforce-ops` |
| `{{INTEGRATION_SLUG}}` | ClawLink integration slug passed to `clawlink_list_tools` | `salesforce` |
| `{{DISPLAY_NAME}}` | Human-readable provider name | `Salesforce` |
| `{{ONE_LINE_DESCRIPTION}}` | What the skill does in one sentence (no period) | `Search Salesforce records, inspect objects, query CRM data, and work with accounts, contacts, leads, opportunities, and cases` |
| `{{SHORT_CAPABILITIES_SUMMARY}}` | Brief comma-separated list of what users can do | `search records, manage contacts, leads, accounts, opportunities, cases, and more` |
| `{{AUTH_METHOD}}` | How the hosted connection usually works | `hosted OAuth`, `hosted OAuth with Microsoft`, or `hosted provider setup` |
| `{{AUTH_USER_ACTION}}` | What the user does during connection | `clicks through the Salesforce login and grant screen`, or `follows the hosted provider setup form` |
| `{{BULLET_LIST_OF_CAPABILITIES}}` | Markdown bullet list of typical tasks in plain English | See examples below |
| `{{PROVIDER_DOCS_LINKS}}` | Markdown links to official provider docs | `- Salesforce REST API: https://developer.salesforce.com/docs/...` |

## Choosing a slug

The skill slug should be short, descriptive, and follow this pattern: `<provider>-<domain>`. Examples:

- `salesforce-ops`
- `onedrive-files`
- `calendly-scheduling`
- `airtable-records`
- `slack-messaging`
- `gmail-email`
- `notion-workspace`
- `hubspot-crm`
- `jira-issues`

## ClawHub compliance checklist

Before publishing, verify:

- [ ] **No stale env requirements** — do not declare `CLAWLINK_API_KEY` or any provider credential in frontmatter. Current setup uses browser pairing, not a user-pasted key.
- [ ] **No npm promotion** — the user-facing install command is `openclaw plugins install clawhub:clawlink-plugin`.
- [ ] **No obfuscated shell commands** — ClawHub hard-blocks skills with `curl | sh`, base64-decoded payloads, or obfuscated install commands.
- [ ] **No hardcoded tool names** — list capabilities in plain English. Tool names and schemas can change between Pipedream manifest imports, override updates, and Composio schema hydration.
- [ ] **No hardcoded schemas** — the skill must use `clawlink_describe_tool` for current argument shape.
- [ ] **No secrets in the file** — never include API keys, tokens, provider credentials, or device credentials in `SKILL.md`.
- [ ] **Dashboard connection flow** — the skill directs new app connections to the filtered dashboard URL (`https://claw-link.dev/dashboard?add=<slug>`) instead of starting connection sessions from chat.

## Publishing

### First-time publish

Always pass `--name` to set the clean display name (for example, "Airtable" instead of "Airtable Records"). If you omit `--name`, ClawHub derives it from the slug.

```bash
clawhub skill publish clawhub-skills/<slug> --slug <slug> --name "<Display Name>" --version 0.1.0
```

### Updating an existing skill

Use `clawhub skill publish` with `--name` to preserve the display name:

```bash
clawhub skill publish clawhub-skills/<slug> --slug <slug> --name "<Display Name>" --version <next-version> --changelog "Description of changes"
```

Do not use `clawhub sync` for updates because it can reset display names to slug-derived names.

### Dry run before publishing

Check what will be published first:

```bash
clawhub sync --root clawhub-skills --dry-run
```

### Auth

You must be logged in as `hith3sh` to publish or update these skills:

```bash
clawhub login
```

## Existing skills

| Slug | Provider | ClawHub URL |
|---|---|---|
| `salesforce-ops` | Salesforce | https://clawhub.ai/hith3sh/salesforce-ops |
| `onedrive-files` | OneDrive | https://clawhub.ai/hith3sh/onedrive-files |
| `calendly-scheduling` | Calendly | https://clawhub.ai/hith3sh/calendly-scheduling |
| `airtable-records` | Airtable | https://clawhub.ai/hith3sh/airtable-records |
| `instantly-campaigns` | Instantly | https://clawhub.ai/hith3sh/instantly-campaigns |
| `gmail-email` | Gmail | https://clawhub.ai/hith3sh/gmail-email |

## Example: creating a skill for Notion

1. Create the directory:
   ```bash
   mkdir -p clawhub-skills/notion-workspace
   ```

2. Create `clawhub-skills/notion-workspace/SKILL.md` using the template above with:
   - `{{SLUG}}` = `notion-workspace`
   - `{{INTEGRATION_SLUG}}` = `notion`
   - `{{DISPLAY_NAME}}` = `Notion`
   - `{{ONE_LINE_DESCRIPTION}}` = `Browse Notion databases and pages, search content, create and update pages, and manage workspace data`
   - `{{SHORT_CAPABILITIES_SUMMARY}}` = `browse databases, search pages, create and update content, and manage workspace data`
   - `{{AUTH_METHOD}}` = `hosted OAuth`
   - `{{AUTH_USER_ACTION}}` = `clicks through the Notion login and authorization screen`
   - `{{BULLET_LIST_OF_CAPABILITIES}}`:
     ```markdown
     - Search pages and databases
     - Browse database entries
     - Read page content
     - Create new pages
     - Update existing pages
     - Query database records with filters
     ```
   - `{{PROVIDER_DOCS_LINKS}}`:
     ```markdown
     - Notion API: https://developers.notion.com/
     ```

3. Publish:
   ```bash
   clawhub skill publish clawhub-skills/notion-workspace --slug notion-workspace --name "Notion" --version 0.1.0
   ```
