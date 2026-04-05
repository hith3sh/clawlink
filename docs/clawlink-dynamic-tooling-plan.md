# ClawLink Dynamic Tooling Plan

## Problem

Today the OpenClaw plugin mainly handles ClawLink connection setup. That is enough to connect Notion, Slack, or other providers, but not enough to help OpenClaw actually use those integrations in a scalable way.

The current failure mode is:

1. User installs the ClawLink npm plugin once.
2. User connects Notion through the hosted ClawLink flow.
3. OpenClaw knows the connection exists, but it does not have enough runtime guidance to choose and use the correct Notion operations.

We do not want to solve this by shipping a new npm package release every time ClawLink adds a new integration.

## Goals

- Keep the npm plugin stable and generic.
- Allow new integrations to ship from the ClawLink backend without requiring plugin updates.
- Avoid forcing users to install one ClawHub skill per integration just to make the product work.
- Support very different providers like Notion, Slack, Airtable, Gmail, and future Apple integrations.
- Leave room for optional integration-specific skill packs later if they improve quality.

## Non-Goals

- Do not make ClawHub skill installation mandatory for core ClawLink functionality.
- Do not hardcode one `SKILL.md` per integration into the plugin as the main architecture.
- Do not treat backend-served prompt guidance as literal runtime `SKILL.md` files.

## Recommended Architecture

### 1. Stable plugin layer

The npm plugin should become a generic ClawLink bridge.

It should provide stable tools such as:

- `clawlink_start_connection`
- `clawlink_get_connection_status`
- `clawlink_list_integrations`
- `clawlink_list_tools`
- `clawlink_describe_tool`
- `clawlink_call_tool`

The plugin should not need provider-specific logic for Notion, Slack, Airtable, or future integrations.

### 2. Dynamic backend layer

The ClawLink backend should own:

- which integrations are available
- which tools each integration exposes
- each tool's schema
- tool descriptions
- runtime execution
- per-tool usage guidance

This allows us to add a new integration without changing the npm package, as long as the generic protocol stays stable.

### 3. Generic bundled skill

The plugin should ship one generic ClawLink skill that teaches OpenClaw how to use the generic bridge.

That skill should instruct the model to:

1. detect which connected integration the user wants
2. discover available ClawLink tools
3. inspect tool-specific guidance when needed
4. prefer read/list/search operations first
5. ask for confirmation before destructive or ambiguous writes
6. call the chosen tool through the generic ClawLink dispatcher

This bundled skill is required.

### 4. Optional ClawHub skill packs

Later we can publish optional integration-specific skill packs on ClawHub, for example:

- `clawlink-notion`
- `clawlink-slack`
- `clawlink-gmail`

These should improve prompting quality for complex providers, but they should not be required for base functionality.

## Why one generic skill is not enough by itself

One generic skill is only sufficient if the backend also provides tool-specific playbooks.

The generic skill should not try to encode all provider behavior. Instead, it should route OpenClaw into backend-served metadata that explains how to use each operation safely and correctly.

Examples:

- Notion needs concepts like pages, databases, blocks, and search-first workflows.
- Slack needs channels, message posting, and read-vs-write behavior.
- Airtable needs bases, tables, records, and views.

Those differences should live in backend metadata, not in frequent npm plugin releases.

## Backend-served guidance model

The backend should return operation guidance alongside the tool catalog.

Example shape:

```json
{
  "tool": "notion_search",
  "integration": "notion",
  "description": "Search pages and databases in Notion",
  "whenToUse": [
    "User asks what pages exist",
    "User asks to find a page or database"
  ],
  "askBefore": [
    "If the user request is vague, ask which workspace or object they mean"
  ],
  "safeDefaults": {
    "pageSize": 10
  },
  "examples": [
    {
      "user": "what pages can you see in notion",
      "args": {
        "query": "",
        "filter": { "value": "page" },
        "pageSize": 10
      }
    }
  ],
  "followups": [
    "Offer to fetch a selected page",
    "Offer to query a selected database"
  ]
}
```

This is effectively a dynamic playbook, not a runtime `SKILL.md`.

## Proposed API surface

### `GET /api/tools`

Returns the list of tools available to the authenticated user, including:

- integration slug
- tool name
- description
- input schema
- read/write classification
- optional tags

### `GET /api/tools/:name`

Returns tool-specific guidance, including:

- when to use it
- what to ask before using it
- safe defaults
- examples
- follow-up suggestions

### `POST /api/tools/:name/execute`

Executes the tool for the authenticated user with validated input.

## Execution flow

For a request like:

`what pages can you see in notion`

Expected flow:

1. OpenClaw activates the generic ClawLink skill.
2. The skill calls `clawlink_list_tools`.
3. The model sees `notion_search` is available.
4. If needed, it calls `clawlink_describe_tool("notion_search")`.
5. It calls `clawlink_call_tool` with safe read-oriented arguments.
6. It summarizes the results and offers a sensible next step.

## ClawHub strategy

ClawHub is still useful, but as an optional enhancement layer.

We can publish integration-specific skills there for users who want higher-quality prompting or custom workflows. That gives us a place for richer Notion-specific or Slack-specific instructions without turning ClawHub installation into a requirement for basic ClawLink usage.

## Implementation order

1. Add backend endpoints for tool catalog, tool description, and tool execution.
2. Add generic runtime tools to the npm plugin.
3. Replace the current connection-only skill approach with a bundled generic ClawLink runtime skill.
4. Test with Notion first using read operations before writes.
5. Expand to Slack, Airtable, Gmail, and other integrations.
6. Add optional ClawHub skill packs only where they clearly improve UX.

## Open questions

- Should `clawlink_call_tool` be one generic dispatcher or should we also expose discovered tools as native OpenClaw tools at runtime?
- How much guidance should be returned inline from `clawlink_list_tools` versus fetched from `clawlink_describe_tool`?
- Should backend metadata include explicit safety levels like `read`, `write`, and `destructive`?
- Do we want optional per-user integration enablement filters in the tool catalog response?
