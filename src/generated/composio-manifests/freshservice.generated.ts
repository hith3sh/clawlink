import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "freshservice",
    name: partial.name,
    description: partial.description,
    inputSchema: { type: "object", properties: {} },
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "freshservice",
      toolSlug: partial.toolSlug,
      version: "20260513_00",
    },
  };
}

export const freshserviceComposioTools: IntegrationTool[] = [
  composioTool({
    name: "freshservice_bulk_update_tickets",
    description: "Tool to bulk update multiple Freshservice tickets by sequential update calls. Use when you need to update fields across many tickets in absence of a native bulk API.",
    toolSlug: "FRESHSERVICE_BULK_UPDATE_TICKETS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "freshservice",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk Update Tickets.",
    ],
  }),
  composioTool({
    name: "freshservice_create_service_request",
    description: "Create a service request for a catalog item in Freshservice using the v2 API. The catalog item display_id can be found in Admin > Service Catalog by clicking on an item and checking the URL (e.g., /service_catalog/items/1 means display_id=1).",
    toolSlug: "FRESHSERVICE_CREATE_SERVICE_REQUEST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "freshservice",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Service Request.",
    ],
  }),
  composioTool({
    name: "freshservice_create_ticket",
    description: "Tool to create a new ticket. Use when you need to log an incident or service request.",
    toolSlug: "FRESHSERVICE_CREATE_TICKET",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "freshservice",
      "write",
      "tickets",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Ticket.",
    ],
  }),
  composioTool({
    name: "freshservice_get_problem_form_fields_by_workspace",
    description: "Tool to list problem form fields. Use when you need to retrieve the form fields available for problems in a specific workspace.",
    toolSlug: "FRESHSERVICE_GET_PROBLEM_FORM_FIELDS_BY_WORKSPACE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshservice",
      "read",
      "problems",
      "form_fields",
    ],
  }),
  composioTool({
    name: "freshservice_get_release_form_fields",
    description: "Tool to list release form fields metadata. Use when you need to fetch release field definitions before building or validating release forms.",
    toolSlug: "FRESHSERVICE_GET_RELEASE_FORM_FIELDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshservice",
      "read",
      "releases",
    ],
  }),
  composioTool({
    name: "freshservice_get_ticket",
    description: "Tool to retrieve detailed information about a specific ticket by ID. Use when you need to get full details of a ticket including its status, priority, requester, and other attributes.",
    toolSlug: "FRESHSERVICE_GET_TICKET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshservice",
      "read",
      "tickets",
    ],
  }),
  composioTool({
    name: "freshservice_list_locations",
    description: "Tool to list all locations in Freshservice. Use when you need to retrieve paginated location data.",
    toolSlug: "FRESHSERVICE_LIST_LOCATIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshservice",
      "read",
      "locations",
    ],
  }),
  composioTool({
    name: "freshservice_list_service_catalog_items",
    description: "Tool to list all service catalog items in Freshservice. Use when you need to discover available catalog items and their display_ids before creating service requests.",
    toolSlug: "FRESHSERVICE_LIST_SERVICE_CATALOG_ITEMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshservice",
      "read",
      "service_catalog",
    ],
  }),
  composioTool({
    name: "freshservice_list_tickets",
    description: "Tool to list all tickets in Freshservice with optional filtering and pagination. Use when you need to retrieve ticket IDs or search for tickets. By default only tickets created within the past 30 days are returned; use updated_since for older tickets.",
    toolSlug: "FRESHSERVICE_LIST_TICKETS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshservice",
      "read",
      "tickets",
    ],
  }),
];
