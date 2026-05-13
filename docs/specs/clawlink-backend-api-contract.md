# ClawLink Backend API Contract for Generic Agent Bridges

Status: draft

This document maps the current OpenClaw plugin surface to a backend contract that can also power MCP clients like Hermes.

## Goals

- One backend contract for OpenClaw, Hermes, and future clients
- Dynamic integration/action catalog
- Clear safety and guidance metadata
- Portable normalized actions
- Async execution support

## Current OpenClaw plugin surface

The current plugin already uses these backend concepts:

- `GET /api/integrations`
- `GET /api/tools?integration=...`
- `GET /api/tools/search?query=...`
- `GET /api/tools/:name`
- `POST /api/tools/:name/preview`
- `POST /api/tools/:name/execute`
- pairing and connection endpoints

That is a good bridge surface for OpenClaw, but it is slightly tool-name-centric rather than action-schema-centric.

## Recommended canonical backend model

Internally model these resources:

- `Integration`
- `Action`
- `Connection`
- `Execution`
- `Policy`

## Recommended canonical endpoints

### Identity

#### `GET /api/agent/whoami`

Response:

```json
{
  "user_id": "usr_123",
  "workspace_id": "ws_456",
  "workspace_name": "Taxxa",
  "environment": "production",
  "region": "global",
  "capabilities": {
    "can_execute": true,
    "can_begin_connection": true
  }
}
```

### Discovery

#### `GET /api/integrations`

Query params:

- `query`
- `category`
- `connected_only`
- `supports_action`
- `page`
- `page_size`

#### `GET /api/integrations/:integrationId`

Returns integration metadata plus action summaries.

#### `GET /api/actions`

Query params:

- `integration_id` required
- `intent` optional

#### `GET /api/actions/:integrationId/:actionId`

Returns full action schema, examples, preconditions, output schema, and safety hints.

#### `GET /api/search`

Query params:

- `query` required
- `connected_only` optional
- `limit` optional

Searches integrations and actions together.

### Connection state

#### `GET /api/connections/:integrationId`

Returns normalized connection readiness for the current user/workspace.

#### `POST /api/connections/:integrationId/begin`

Starts a user-mediated connection flow.

Request:

```json
{
  "redirect_url": "https://app.example.com/return",
  "channel": "web"
}
```

### Execution

#### `POST /api/executions`

Request:

```json
{
  "integration_id": "salesforce",
  "action_id": "create_record",
  "input": {
    "object_type": "Lead",
    "fields": {
      "LastName": "Perera",
      "Company": "Acme"
    }
  },
  "idempotency_key": "msg-5962-create-lead-acme",
  "confirm": true
}
```

Returns sync success, async running, or blocked.

#### `GET /api/executions/:executionId`

Returns normalized execution status/result.

## Backward compatibility with current plugin

The current OpenClaw plugin can continue to use tool-centric endpoints while the backend grows a canonical action-centric layer.

### Compatibility mapping

- `clawlink_list_integrations` -> `GET /api/integrations`
- `clawlink_list_tools` -> `GET /api/tools?integration=...`
- `clawlink_search_tools` -> `GET /api/tools/search?query=...`
- `clawlink_describe_tool` -> `GET /api/tools/:name`
- `clawlink_preview_tool` -> `POST /api/tools/:name/preview`
- `clawlink_call_tool` -> `POST /api/tools/:name/execute`

### Forward mapping to canonical model

Each tool descriptor should also carry normalized action metadata:

```json
{
  "name": "salesforce_create_record",
  "integration": "salesforce",
  "action_id": "create_record",
  "title": "Create record",
  "description": "Create a Salesforce record.",
  "side_effect_level": "write",
  "requires_confirmation": true,
  "inputSchema": {},
  "outputSchema": {},
  "guidanceAvailable": true
}
```

That lets OpenClaw keep its current dispatcher model while Hermes MCP clients use normalized action contracts.

## Guidance metadata

Action descriptions should include guidance such as:

- `when_to_use`
- `ask_before`
- `safe_defaults`
- `examples`
- `followups`
- `preconditions`
- `requires_confirmation`
- `supports_async`

## Error contract

Use a consistent shape:

```json
{
  "status": "failed",
  "error": {
    "code": "validation_error",
    "message": "Missing required field: object_type",
    "retryable": false,
    "details": {
      "field": "object_type"
    }
  }
}
```

## Recommendation

Build the backend around canonical normalized actions and executions, then project that into:

1. the current OpenClaw tool-dispatch surface
2. a future ClawLink MCP server surface
3. any native Hermes integration layer

That gives ClawLink one real control plane instead of multiple drifting adapters.
