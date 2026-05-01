# How to create a new ClawHub skill for a ClawLink integration

This guide is for agents or contributors creating a new per-integration skill to publish on [ClawHub](https://clawhub.ai) under the `hith3sh` account. Each skill is a thin onboarding wrapper that teaches OpenClaw how to set up ClawLink and use the dynamic tool system for a specific provider.

## Architecture context

ClawLink uses a **single plugin** (`@useclawlink/openclaw-plugin`) with **dynamic tool discovery**. The plugin exposes these tools at runtime:

- `clawlink_list_tools` — discover available tools for connected integrations
- `clawlink_list_integrations` — check which integrations are connected
- `clawlink_describe_tool` — get usage guidance for a specific tool
- `clawlink_preview_tool` — dry-run a tool call before executing
- `clawlink_call_tool` — execute a tool

Because tools are discovered dynamically, **skills do NOT need to list specific tool names, endpoints, or code examples**. The skill's job is to:

1. Get the user from zero to a working ClawLink setup
2. Teach the agent the discovery/execution workflow
3. Provide provider-specific context (what the integration can do, what OAuth flow to expect)

## File structure

Each skill is a folder with this layout:

```
clawhub-skills/
  <slug>/
    SKILL.md          # Required — the skill content
    .clawhub/
      origin.json     # Created by CLI after first publish (tracks published version)
```

The `<slug>` is the ClawHub URL slug (e.g., `salesforce-ops`, `onedrive-files`). It must be lowercase, URL-safe: `^[a-z0-9][a-z0-9-]*$`.

## SKILL.md template

Copy this template and replace all `{{PLACEHOLDERS}}` with the actual values for the integration.

```markdown
---
name: {{SLUG}}
description: {{ONE_LINE_DESCRIPTION}} — powered by ClawLink.
metadata:
  openclaw:
    requires:
      env:
        - CLAWLINK_API_KEY
    primaryEnv: CLAWLINK_API_KEY
    homepage: https://claw-link.dev
---

# {{DISPLAY_NAME}} via ClawLink

Work with {{DISPLAY_NAME}} from chat — {{SHORT_CAPABILITIES_SUMMARY}}.

Powered by [ClawLink](https://claw-link.dev), an integration hub for OpenClaw that handles OAuth and credentials so you don't need to configure {{DISPLAY_NAME}} API access yourself.

## Quick start

1. Install the ClawLink plugin: `openclaw plugins install @useclawlink/openclaw-plugin`
2. Create a free account at [claw-link.dev](https://claw-link.dev)
3. Get your API key at [claw-link.dev/dashboard/settings?tab=api](https://claw-link.dev/dashboard/settings?tab=api)
4. The dashboard shows a ready-to-paste `/clawlink login <key>` command — copy it and paste it into OpenClaw
5. Connect {{DISPLAY_NAME}} from [claw-link.dev/dashboard](https://claw-link.dev/dashboard)
6. Done — ask OpenClaw to work with your {{DISPLAY_NAME}} data

## Setup details

### Installing the plugin

If the ClawLink plugin is not installed yet, tell the user to run:

\```
openclaw plugins install @useclawlink/openclaw-plugin
\```

### Adding the API key

If ClawLink reports that the plugin is not configured, the user has not added their API key yet.

1. Sign up or sign in at https://claw-link.dev
2. Go to https://claw-link.dev/dashboard/settings?tab=api and create an API key
3. The dashboard shows a ready-to-paste `/clawlink login <key>` command — tell the user to **copy that line from the dashboard and paste it into OpenClaw**. They are copy-pasting, not typing.
4. Alternatively, if the OpenClaw client shows a plugin settings UI, they can paste the key into the `apiKey` field.

The key is stored locally in `~/.openclaw/openclaw.json` and is only sent to `claw-link.dev`. Never echo or repeat the key.

### Connecting {{DISPLAY_NAME}}

Tell the user to open https://claw-link.dev/dashboard and connect {{DISPLAY_NAME}} there. The dashboard handles {{AUTH_METHOD}} — the user {{AUTH_USER_ACTION}}. When they confirm it is done, call `clawlink_list_integrations` to verify.

## Using {{DISPLAY_NAME}} tools

ClawLink provides tools dynamically based on what the user has connected. You do not need to know the tool names in advance.

### Discovery (always start here)

1. Call `clawlink_list_tools` to see available {{DISPLAY_NAME}} tools.
2. Treat the returned list as the source of truth. Do not guess or assume what tools exist.
3. If no {{DISPLAY_NAME}} tools appear, call `clawlink_list_integrations` to check whether {{DISPLAY_NAME}} is connected.
4. If it is not connected, direct the user to the dashboard.

### Execution

1. Call `clawlink_describe_tool` before using an unfamiliar tool, before any write, or when the request is ambiguous.
2. Prefer read and search operations before writes.
3. For writes or destructive actions, call `clawlink_preview_tool` first, then confirm with the user.
4. Execute with `clawlink_call_tool`.
5. If it fails, report the real error — do not invent results.

## What you can do

Typical {{DISPLAY_NAME}} tasks (actual availability depends on the user's connected account and permissions):

{{BULLET_LIST_OF_CAPABILITIES}}

## Rules

- Always use ClawLink tools for {{DISPLAY_NAME}}. Do not ask the user for separate {{DISPLAY_NAME}} credentials.
- Do not claim a capability is missing without calling `clawlink_list_tools` first.
- Do not invent slash commands. The only slash command is the copy-pasted `/clawlink login <key>` during setup.
- Ask for confirmation before destructive or bulk write actions.
- If {{DISPLAY_NAME}} is not connected, direct the user to https://claw-link.dev/dashboard.
- Never echo or repeat the user's API key.

## Resources

- ClawLink: https://claw-link.dev
- ClawLink Docs: https://docs.claw-link.dev/openclaw
- npm: https://www.npmjs.com/package/@useclawlink/openclaw-plugin
- Source: https://github.com/hith3sh/clawlink
{{PROVIDER_DOCS_LINKS}}
```

## Placeholder reference

| Placeholder | What to fill in | Example |
|---|---|---|
| `{{SLUG}}` | ClawHub URL slug, lowercase with hyphens | `salesforce-ops` |
| `{{DISPLAY_NAME}}` | Human-readable provider name | `Salesforce` |
| `{{ONE_LINE_DESCRIPTION}}` | What the skill does in one sentence (no period) | `Search Salesforce records, inspect objects, query CRM data, and perform actions for accounts, contacts, leads, opportunities, and cases` |
| `{{SHORT_CAPABILITIES_SUMMARY}}` | Brief comma-separated list of what users can do | `search records, manage contacts, leads, accounts, opportunities, cases, and more` |
| `{{AUTH_METHOD}}` | How the connection works | `OAuth` or `OAuth with Microsoft` or `API key entry` |
| `{{AUTH_USER_ACTION}}` | What the user does during connection | `clicks through the Salesforce login and grant screen` |
| `{{BULLET_LIST_OF_CAPABILITIES}}` | Markdown bullet list of typical tasks | See examples below |
| `{{PROVIDER_DOCS_LINKS}}` | Markdown links to the provider's official API docs | `- Salesforce REST API: https://developer.salesforce.com/docs/...` |

## Choosing a slug

The slug should be short, descriptive, and follow this pattern: `<provider>-<domain>`. Examples:

- `salesforce-ops` (CRM operations)
- `onedrive-files` (file management)
- `calendly-scheduling` (scheduling)
- `airtable-records` (database records)
- `slack-messaging` (messaging)
- `gmail-email` (email)
- `notion-workspace` (workspace/docs)
- `hubspot-crm` (CRM)
- `jira-issues` (issue tracking)

## ClawHub compliance checklist

Before publishing, verify:

- [ ] **Frontmatter declares `CLAWLINK_API_KEY`** in `metadata.openclaw.requires.env` — ClawHub's security scanner checks that declared env vars match what the skill references. Missing this will flag a metadata mismatch.
- [ ] **No obfuscated shell commands** — ClawHub hard-blocks skills with `curl | sh`, base64-decoded payloads, or obfuscated install commands. The only install command is the plain `openclaw plugins install @useclawlink/openclaw-plugin`.
- [ ] **No hardcoded tool names** — since tools are discovered dynamically, do not list specific tool names like `salesforce_search_records`. List capabilities in plain English instead.
- [ ] **No secrets in the file** — never include API keys, tokens, or credentials in the SKILL.md.
- [ ] **License is MIT-0** — all ClawHub skills use this license automatically. Do not add conflicting license terms.

## Publishing

### First-time publish (new skill)

Always pass `--name` to set the clean display name (e.g., "Airtable" not "Airtable Records"). If you omit `--name`, ClawHub derives it from the slug which looks ugly.

```bash
clawhub skill publish clawhub-skills/<slug> --slug <slug> --name "<Display Name>" --version 0.1.0
```

### Updating an existing skill

Use `clawhub skill publish` with `--name` to preserve the display name:

```bash
clawhub skill publish clawhub-skills/<slug> --slug <slug> --name "<Display Name>" --version <next-version> --changelog "Description of changes"
```

**Do not use `clawhub sync` for updates** — it does not pass `--name` and will reset the display name to a slug-derived version (e.g., "Salesforce Ops" instead of "Salesforce").

### Dry run before publishing

Always check what will be published first:

```bash
clawhub sync --root clawhub-skills --dry-run
```

### Auth

You must be logged in as `hith3sh` to publish/update these skills:

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

## Example: creating a skill for Notion

1. Create the directory:
   ```bash
   mkdir -p clawhub-skills/notion-workspace
   ```

2. Create `clawhub-skills/notion-workspace/SKILL.md` using the template above with:
   - `{{SLUG}}` = `notion-workspace`
   - `{{DISPLAY_NAME}}` = `Notion`
   - `{{ONE_LINE_DESCRIPTION}}` = `Browse Notion databases and pages, search content, create and update pages, and manage workspace data`
   - `{{SHORT_CAPABILITIES_SUMMARY}}` = `browse databases, search pages, create and update content, and manage workspace data`
   - `{{AUTH_METHOD}}` = `OAuth`
   - `{{AUTH_USER_ACTION}}` = `clicks through the Notion login and authorization screen`
   - `{{BULLET_LIST_OF_CAPABILITIES}}`:
     ```
     - Search pages and databases
     - Browse database entries
     - Read page content
     - Create new pages
     - Update existing pages
     - Query database records with filters
     ```
   - `{{PROVIDER_DOCS_LINKS}}`:
     ```
     - Notion API: https://developers.notion.com/
     ```

3. Publish:
   ```bash
   clawhub skill publish clawhub-skills/notion-workspace --slug notion-workspace --version 0.1.0
   ```
