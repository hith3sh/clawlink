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
    integration: "freshbooks",
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
      toolkit: "freshbooks",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const freshbooksComposioTools: IntegrationTool[] = [
  composioTool({
    name: "freshbooks_create_webhook",
    description: "Register a new webhook callback for a FreshBooks account. Webhooks notify your application when specified events occur (e.g., when invoices are created, clients are updated, or payments are received). **Prerequisites:** Obtain a valid account_id using the List Businesses action first. **Important Notes:** - FreshBooks implements a verification mechanism to ensure you own the callback URI. The 'verified' field will initially be false. - Your webhook endpoint must respond with a 2xx HTTP status code. Any other status code (including 3xx redirects) is treated as a failure. - Webhook requests have a 10-second timeout. - Requires 'user:webhooks:write' OAuth scope. **Common Event Types:** client.create, client.update, client.delete, invoice.create, invoice.update, invoice.delete, payment.create, payment.update, payment.delete, expense.create, expense.update, expense.delete.",
    toolSlug: "FRESHBOOKS_CREATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "freshbooks",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Webhook.",
    ],
  }),
  composioTool({
    name: "freshbooks_delete_webhook",
    description: "Delete a webhook callback from a FreshBooks account. Use when you need to remove an existing webhook subscription that is no longer needed.",
    toolSlug: "FRESHBOOKS_DELETE_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "freshbooks",
      "write",
      "webhooks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Webhook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "freshbooks_get_business_users",
    description: "Retrieves staff identities and members for a specific FreshBooks business. This action returns detailed information about all staff members (owners, admins, employees) in a business group, including their roles, email addresses, and active status. Use this to discover team members before assigning time entries or tasks.",
    toolSlug: "FRESHBOOKS_GET_BUSINESS_USERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshbooks",
      "read",
      "users",
    ],
  }),
  composioTool({
    name: "freshbooks_list_businesses",
    description: "List all businesses associated with the authenticated user. This action retrieves business membership information from the FreshBooks Identity endpoint, showing all businesses the user has access to along with their role in each business. The business_id from this response is required for many other FreshBooks API calls.",
    toolSlug: "FRESHBOOKS_LIST_BUSINESSES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshbooks",
      "read",
    ],
  }),
  composioTool({
    name: "freshbooks_list_clients",
    description: "Retrieves all clients for a FreshBooks account. Clients are entities you send invoices to. Supports pagination, filtering by email/user ID/visibility state, sorting, and includes optional balance data (outstanding, credit, draft, overdue).",
    toolSlug: "FRESHBOOKS_LIST_CLIENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshbooks",
      "read",
      "clients",
    ],
  }),
  composioTool({
    name: "freshbooks_list_journal_entries2",
    description: "Retrieves all journal entries for a FreshBooks business account. Journal entries are the building blocks of financial accounting, recording all business transactions including invoices, payments, credits, and expenses. Use this action to get a comprehensive view of your accounting records.",
    toolSlug: "FRESHBOOKS_LIST_JOURNAL_ENTRIES2",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshbooks",
      "read",
      "journal_entries",
    ],
  }),
  composioTool({
    name: "freshbooks_list_projects",
    description: "Retrieves all projects associated with a FreshBooks business account. This action returns a paginated list of projects with comprehensive details including client information, billing rates, budget, completion status, team members, and associated services. Use this to discover available projects before performing project-specific operations. **Prerequisites:** Obtain a valid business_id using the List Businesses action first. **Use Cases:** - Get all projects for time tracking or invoicing - Find projects by client, status, or date range - Monitor project completion and budget tracking - Retrieve team assignments and project groups **Response:** Returns an empty list if no projects exist or match the filters.",
    toolSlug: "FRESHBOOKS_LIST_PROJECTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshbooks",
      "read",
    ],
  }),
  composioTool({
    name: "freshbooks_list_webhooks",
    description: "List all webhook callbacks registered for a FreshBooks account. Webhooks notify your application when events occur (e.g., invoice creation, payment received). Use this to discover what webhook callbacks are currently active for an account before creating or managing webhook subscriptions.",
    toolSlug: "FRESHBOOKS_LIST_WEBHOOKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "freshbooks",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "freshbooks_register_as_a_new_user",
    description: "Register a new user account in FreshBooks. Returns an access token upon successful registration. Use this action when you need to create a new FreshBooks user account programmatically with their business information.",
    toolSlug: "FRESHBOOKS_REGISTER_AS_A_NEW_USER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "freshbooks",
      "write",
      "users",
    ],
    askBefore: [
      "Confirm the parameters before executing Register as a New User.",
    ],
  }),
  composioTool({
    name: "freshbooks_update_webhook",
    description: "Update or verify a FreshBooks webhook callback. Use this to verify a newly created webhook by providing the verification code, or to request a new verification code be sent to the callback URI. **Prerequisites:** You need the account_id (from List Businesses as business_uuid) and callback_id (from webhook creation). **Use Cases:** - Verify a webhook after creation by providing the verifier code received at your callback URI - Request a new verification code if the original was lost or expired (set resend=true) **Important:** The verifier and resend parameters are mutually exclusive - provide only one per request.",
    toolSlug: "FRESHBOOKS_UPDATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "freshbooks",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Webhook.",
    ],
  }),
];
