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
    integration: "dynamics-365",
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
      toolkit: "dynamics365",
      toolSlug: partial.toolSlug,
      version: "20260414_00",
    },
  };
}

export const dynamics365ComposioTools: IntegrationTool[] = [
  composioTool({
    name: "dynamics365_dynamicscrm_create_account",
    description: "Creates a new account entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_CREATE_ACCOUNT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Account.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_create_case",
    description: "Creates a new case (incident) entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_CREATE_CASE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Case.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_create_contact",
    description: "Creates a new contact entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_CREATE_CONTACT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Contact.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_create_invoice",
    description: "Creates a new invoice entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_CREATE_INVOICE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Invoice.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_create_lead",
    description: "Creates a new lead entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_CREATE_LEAD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Lead.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_create_opportunity",
    description: "Creates a new opportunity entity record in Dynamics CRM using the Web API. Some CRM configurations enforce `estimatedclosedate` and a transaction currency at the server level even though they are schema-optional; omitting them may cause the request to be rejected.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_CREATE_OPPORTUNITY",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Opportunity.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_create_sales_order",
    description: "Creates a new sales order entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_CREATE_SALES_ORDER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Sales Order.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_get_a_invoice",
    description: "Dynamicscrm get a invoice",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_GET_A_INVOICE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "dynamics-365",
      "read",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_get_a_lead",
    description: "Dynamicscrm get a lead",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_GET_A_LEAD",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "dynamics-365",
      "read",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_get_all_leads",
    description: "Dynamicscrm get all leads",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_GET_ALL_LEADS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "dynamics-365",
      "read",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_update_case",
    description: "Updates an existing case (incident) entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_UPDATE_CASE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Case.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_update_invoice",
    description: "Updates an existing invoice entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_UPDATE_INVOICE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Invoice.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_update_lead",
    description: "Updates an existing lead entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_UPDATE_LEAD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Lead.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_update_opportunity",
    description: "Updates an existing opportunity entity record in Dynamics CRM using the Web API. Some updates may be rejected if required relational fields (e.g., transactioncurrency) are absent from the record, even though they are not exposed as explicit parameters.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_UPDATE_OPPORTUNITY",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Opportunity.",
    ],
  }),
  composioTool({
    name: "dynamics365_dynamicscrm_update_sales_order",
    description: "Updates an existing sales order entity record in Dynamics CRM using the Web API.",
    toolSlug: "DYNAMICS365_DYNAMICSCRM_UPDATE_SALES_ORDER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "dynamics-365",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Sales Order.",
    ],
  }),
  composioTool({
    name: "dynamics365_get_all_invoices_action",
    description: "Get all invoices action",
    toolSlug: "DYNAMICS365_GET_ALL_INVOICES_ACTION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "dynamics-365",
      "read",
    ],
  }),
];
