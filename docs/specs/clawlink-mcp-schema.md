# ClawLink MCP Schema v1

Status: draft
Owner: ClawLink
Audience: Hermes Agent, OpenClaw, Cursor, Claude Code, Codex, and other MCP-capable clients

## Purpose

This document defines a compact MCP surface for ClawLink so agents can:

1. discover available integrations and actions
2. inspect connection readiness and action schemas
3. execute normalized actions safely
4. recover cleanly from auth, validation, and provider failures

The goal is to expose a small, stable control plane rather than one MCP tool per provider action.

## Design principles

- Small fixed tool surface
- Dynamic backend-owned catalog
- Stable normalized identifiers
- Readable error semantics
- Clear write/destructive safety metadata
- Multi-tenant safe by default
- Portable across agent ecosystems

## Naming

Use dotted MCP tool names:

- `clawlink.whoami`
- `clawlink.search`
- `clawlink.list_integrations`
- `clawlink.get_integration`
- `clawlink.list_actions`
- `clawlink.get_action`
- `clawlink.get_connection`
- `clawlink.begin_connection`
- `clawlink.execute`
- `clawlink.get_execution`

Entity ids should use snake_case where applicable:

- integration ids: `salesforce`, `notion`, `gmail`
- action ids: `search_records`, `create_record`, `send_message`

## Core entities

### Integration

```json
{
  "integration_id": "salesforce",
  "name": "Salesforce",
  "slug": "salesforce",
  "category": "sales",
  "summary": "CRM platform for accounts, contacts, leads, and opportunities.",
  "connected": true,
  "connection_state": "healthy",
  "capabilities": ["search_records", "create_record", "update_record"]
}
```

### Action

```json
{
  "action_id": "create_record",
  "title": "Create record",
  "description": "Create a new object in the provider.",
  "side_effect_level": "write",
  "requires_confirmation": true,
  "idempotent": false,
  "supports_async": true,
  "input_schema": {},
  "output_schema": {}
}
```

### Connection

```json
{
  "integration_id": "salesforce",
  "connected": true,
  "state": "healthy",
  "account_label": "hithesh@taxxa.ai",
  "can_execute": true,
  "needs_reauth": false
}
```

### Execution

```json
{
  "execution_id": "exe_123",
  "status": "succeeded",
  "integration_id": "salesforce",
  "action_id": "create_record",
  "output": {},
  "display": {
    "title": "Lead created",
    "summary": "Created record successfully."
  }
}
```

## Shared enums

### Side effect level

- `read`
- `write`
- `delete`
- `admin`

### Connection state

- `not_connected`
- `setup_started`
- `healthy`
- `stale_auth`
- `permission_denied`
- `degraded`
- `error`

### Execution status

- `pending`
- `running`
- `succeeded`
- `failed`
- `blocked`
- `cancelled`

## MCP tools

### 1. `clawlink.whoami`

Input:

```json
{}
```

Output:

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

### 2. `clawlink.search`

Purpose: keyword/semantic search across connected or available integrations/actions.

Input:

```json
{
  "query": "salesforce create lead",
  "connected_only": false,
  "limit": 10
}
```

Output:

```json
{
  "items": [
    {
      "kind": "action",
      "integration_id": "salesforce",
      "action_id": "create_record",
      "title": "Create record",
      "summary": "Create a lead, contact, account, or opportunity.",
      "score": 0.96,
      "connected": true,
      "connection_state": "healthy"
    }
  ]
}
```

### 3. `clawlink.list_integrations`

Input:

```json
{
  "query": "crm",
  "category": "sales",
  "connected_only": false,
  "supports_action": "create_record",
  "page": 1,
  "page_size": 25
}
```

Output:

```json
{
  "items": [
    {
      "integration_id": "salesforce",
      "name": "Salesforce",
      "slug": "salesforce",
      "category": "sales",
      "connected": true,
      "connection_state": "healthy",
      "summary": "CRM, contacts, leads, accounts, opportunities",
      "capabilities": ["search_records", "create_record", "update_record"]
    }
  ],
  "page": 1,
  "page_size": 25,
  "total": 1
}
```

### 4. `clawlink.get_integration`

Input:

```json
{
  "integration_id": "salesforce"
}
```

Output:

```json
{
  "integration_id": "salesforce",
  "name": "Salesforce",
  "slug": "salesforce",
  "category": "sales",
  "description": "CRM platform for accounts, contacts, leads, and opportunities.",
  "auth": {
    "required": true,
    "type": "oauth2"
  },
  "connection": {
    "supported": true,
    "state": "healthy"
  },
  "actions": [
    {
      "action_id": "search_records",
      "title": "Search records",
      "side_effect_level": "read"
    },
    {
      "action_id": "create_record",
      "title": "Create record",
      "side_effect_level": "write"
    }
  ],
  "limits": {
    "rate_limited": true
  }
}
```

### 5. `clawlink.list_actions`

Input:

```json
{
  "integration_id": "salesforce",
  "intent": "create a new lead"
}
```

Output:

```json
{
  "integration_id": "salesforce",
  "items": [
    {
      "action_id": "create_record",
      "title": "Create record",
      "description": "Create a new CRM object such as lead, contact, or account.",
      "side_effect_level": "write",
      "input_summary": {
        "required": ["object_type", "fields"],
        "optional": ["dedupe_strategy"]
      },
      "examples": [
        {
          "object_type": "Lead",
          "fields": {
            "LastName": "Perera",
            "Company": "Acme"
          }
        }
      ]
    }
  ]
}
```

### 6. `clawlink.get_action`

Input:

```json
{
  "integration_id": "salesforce",
  "action_id": "create_record"
}
```

Output:

```json
{
  "integration_id": "salesforce",
  "action_id": "create_record",
  "title": "Create record",
  "description": "Create a record in Salesforce.",
  "side_effect_level": "write",
  "idempotent": false,
  "input_schema": {
    "type": "object",
    "properties": {
      "object_type": {
        "type": "string",
        "enum": ["Lead", "Contact", "Account", "Opportunity"]
      },
      "fields": {
        "type": "object",
        "description": "Field map using provider field API names."
      },
      "dedupe_strategy": {
        "type": "string",
        "enum": ["none", "email", "external_id"]
      }
    },
    "required": ["object_type", "fields"]
  },
  "output_schema": {
    "type": "object",
    "properties": {
      "record_id": { "type": "string" },
      "object_type": { "type": "string" },
      "created": { "type": "boolean" }
    }
  },
  "examples": [
    {
      "input": {
        "object_type": "Lead",
        "fields": {
          "LastName": "Perera",
          "Company": "Acme"
        }
      }
    }
  ],
  "preconditions": ["Integration must be connected"]
}
```

### 7. `clawlink.get_connection`

Input:

```json
{
  "integration_id": "salesforce"
}
```

Output:

```json
{
  "integration_id": "salesforce",
  "connected": true,
  "state": "healthy",
  "account_label": "hithesh@taxxa.ai",
  "last_checked_at": "2026-05-13T18:00:00Z",
  "can_execute": true,
  "needs_reauth": false,
  "health_reason": null
}
```

### 8. `clawlink.begin_connection`

Input:

```json
{
  "integration_id": "salesforce",
  "redirect_url": "https://app.example.com/return",
  "channel": "web"
}
```

Output:

```json
{
  "integration_id": "salesforce",
  "status": "requires_user_action",
  "connection_session_id": "cs_123",
  "connect_url": "https://claw-link.dev/connect/cs_123",
  "expires_at": "2026-05-13T18:29:00Z",
  "instructions": [
    "Open the connect URL",
    "Authorize Salesforce",
    "Return here after completion"
  ]
}
```

### 9. `clawlink.execute`

Input:

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

Sync success output:

```json
{
  "execution_id": "exe_123",
  "status": "succeeded",
  "integration_id": "salesforce",
  "action_id": "create_record",
  "output": {
    "record_id": "00Qxx0000012345",
    "object_type": "Lead",
    "created": true
  },
  "display": {
    "title": "Lead created",
    "summary": "Created Salesforce Lead 00Qxx0000012345 for Acme."
  }
}
```

Async output:

```json
{
  "execution_id": "exe_124",
  "status": "running",
  "poll_after_ms": 2000,
  "display": {
    "title": "Execution started",
    "summary": "Searching 12,431 HubSpot contacts."
  }
}
```

Blocked output:

```json
{
  "execution_id": null,
  "status": "blocked",
  "error_code": "integration_not_connected",
  "message": "HubSpot is not connected for this workspace.",
  "recommended_next_action": {
    "tool": "clawlink.begin_connection",
    "input": {
      "integration_id": "hubspot"
    }
  }
}
```

### 10. `clawlink.get_execution`

Input:

```json
{
  "execution_id": "exe_124"
}
```

Output:

```json
{
  "execution_id": "exe_124",
  "status": "succeeded",
  "started_at": "2026-05-13T18:14:10Z",
  "finished_at": "2026-05-13T18:14:14Z",
  "output": {
    "matches": 248,
    "items": [
      {
        "id": "c_1",
        "email": "jan@rent-a-jan.de"
      }
    ]
  },
  "display": {
    "title": "Search complete",
    "summary": "Found 248 matching contacts."
  }
}
```

## Error model

Errors should be returned in a stable machine-friendly shape:

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

Recommended error codes:

- `unauthorized`
- `forbidden`
- `integration_not_found`
- `action_not_found`
- `integration_not_connected`
- `reauth_required`
- `validation_error`
- `rate_limited`
- `execution_failed`
- `timeout`
- `unsupported_operation`
- `policy_blocked`

## Safety requirements

### Idempotency

All write, delete, or admin executions should accept an idempotency key.

### Confirmation hints

Actions should advertise whether confirmation is required.

### Recommended next action

When blocked, ClawLink should return a structured next action instead of forcing agents to guess recovery.

### Display block

All terminal responses should include a compact `display` object for user-facing summarization.

## v1 recommendation

Ship these tools first:

- `clawlink.whoami`
- `clawlink.search`
- `clawlink.list_integrations`
- `clawlink.get_integration`
- `clawlink.list_actions`
- `clawlink.get_action`
- `clawlink.get_connection`
- `clawlink.begin_connection`
- `clawlink.execute`
- `clawlink.get_execution`

## Relationship to current OpenClaw plugin

The current OpenClaw plugin already implements a generic bridge using:

- `clawlink_list_integrations`
- `clawlink_list_tools`
- `clawlink_search_tools`
- `clawlink_describe_tool`
- `clawlink_preview_tool`
- `clawlink_call_tool`

That surface is directionally correct. The MCP schema in this document is the agent-neutral evolution of the same idea, with stronger normalized contracts for actions, connections, and async executions.
