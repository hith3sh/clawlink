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
    integration: "gumroad",
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
      toolkit: "gumroad",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const gumroadComposioTools: IntegrationTool[] = [
  composioTool({
    name: "gumroad_get_resource_subscriptions",
    description: "Tool to show all active subscriptions of the user for the input resource. Use when you need to review existing webhooks before adding a new one.",
    toolSlug: "GUMROAD_GET_RESOURCE_SUBSCRIPTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "gumroad",
      "read",
    ],
  }),
  composioTool({
    name: "gumroad_get_sales",
    description: "Tool to retrieve all successful sales by the authenticated user; excludes failed charges, abandoned carts, and page views — conversion rates cannot be derived from this data. Use when you need to list your Gumroad sales, optionally filtering by email, date range, product, or pagination. For high sales volumes, combine product_id and/or after/before filters with page to avoid large unfiltered result sets.",
    toolSlug: "GUMROAD_GET_SALES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "gumroad",
      "read",
    ],
  }),
  composioTool({
    name: "gumroad_get_user",
    description: "Tool to retrieve the authenticated user's data. Use when you need the current user's profile details after authentication.",
    toolSlug: "GUMROAD_GET_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "gumroad",
      "read",
    ],
  }),
  composioTool({
    name: "gumroad_list_products",
    description: "Tool to retrieve all products for the authenticated Gumroad account. Use when you need product IDs for downstream operations like license verification, subscriber retrieval, or offer-code management.",
    toolSlug: "GUMROAD_LIST_PRODUCTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "gumroad",
      "read",
      "products",
    ],
  }),
  composioTool({
    name: "gumroad_subscribe_to_resource",
    description: "Tool to subscribe to a resource. Use when you need to receive real-time event webhooks after creating your webhook endpoint.",
    toolSlug: "GUMROAD_SUBSCRIBE_TO_RESOURCE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "gumroad",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Subscribe to Resource.",
    ],
  }),
  composioTool({
    name: "gumroad_unsubscribe_from_resource",
    description: "Tool to unsubscribe from a resource. Use after verifying the subscription ID exists to remove webhook.",
    toolSlug: "GUMROAD_UNSUBSCRIBE_FROM_RESOURCE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "gumroad",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Unsubscribe From Resource.",
    ],
  }),
  composioTool({
    name: "gumroad_verify_license",
    description: "Tool to verify a Gumroad license key against a specific product. Use when you need to check if a license key is valid, check usage count, or verify membership entitlement for software licensing or gated content.",
    toolSlug: "GUMROAD_VERIFY_LICENSE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "gumroad",
      "write",
      "licensing",
    ],
    askBefore: [
      "Confirm the parameters before executing Verify License.",
    ],
  }),
];
