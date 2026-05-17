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
    integration: "grafana",
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
      toolkit: "grafana",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const grafanaComposioTools: IntegrationTool[] = [
  composioTool({
    name: "grafana_create_otlp_v1_logs",
    description: "Tool to create OTLP v1 logs in Grafana Loki. Use when you need to send OpenTelemetry Protocol logs to Grafana for ingestion and storage.",
    toolSlug: "GRAFANA_CREATE_OTLP_V1_LOGS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "grafana",
      "write",
      "logs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create OTLP v1 Logs.",
    ],
  }),
  composioTool({
    name: "grafana_get_distributor_ha_tracker",
    description: "Tool to retrieve distributor HA tracker status. Use when you need to check which replica has been elected as leader for each Prometheus HA cluster.",
    toolSlug: "GRAFANA_GET_DISTRIBUTOR_HA_TRACKER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "monitoring",
    ],
  }),
  composioTool({
    name: "grafana_get_health",
    description: "Check Grafana server health and database connectivity. Returns 'ok' if Grafana's web server is running and can access the database. Use when you need to verify Grafana instance availability before performing operations.",
    toolSlug: "GRAFANA_GET_HEALTH",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "health",
    ],
  }),
  composioTool({
    name: "grafana_get_index_gateway_ring",
    description: "Tool to retrieve the index gateway hash ring status from Grafana Loki. Returns information about the state, health, and last heartbeat time of each index gateway in the ring.",
    toolSlug: "GRAFANA_GET_INDEX_GATEWAY_RING",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "ring_status",
    ],
  }),
  composioTool({
    name: "grafana_get_overrides_exporter_ring",
    description: "Tool to retrieve the overrides-exporter hash ring status as an HTML page. Use when you need to check the state, health, and heartbeat information of overrides-exporter instances. Only accessible when -overrides-exporter.ring.enabled flag is true.",
    toolSlug: "GRAFANA_GET_OVERRIDES_EXPORTER_RING",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "ring_status",
    ],
  }),
  composioTool({
    name: "grafana_get_ruler_ring",
    description: "Tool to retrieve the ruler ring status from Grafana Mimir. Use when you need to check the distributed hash ring topology and operational status of ruler instances.",
    toolSlug: "GRAFANA_GET_RULER_RING",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "ruler",
    ],
  }),
  composioTool({
    name: "grafana_get_status",
    description: "Tool to check if a valid Grafana Enterprise license is available. Use when you need to verify license status or availability.",
    toolSlug: "GRAFANA_GET_STATUS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "license_management",
    ],
  }),
  composioTool({
    name: "grafana_get_store_gateway_tenants",
    description: "Retrieves store gateway tenants. Returns a list of tenants that have blocks stored in the store-gateway's configured storage. Use when you need to view which tenants have data stored on a store-gateway node.",
    toolSlug: "GRAFANA_GET_STORE_GATEWAY_TENANTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "store_gateway",
    ],
  }),
  composioTool({
    name: "grafana_post_acs",
    description: "Tool to perform SAML Assertion Consumer Service (ACS) operation. Use when processing SAML authentication responses from an identity provider. This endpoint typically handles the SAML assertion and returns a redirect response (HTTP 302).",
    toolSlug: "GRAFANA_POST_ACS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "grafana",
      "write",
      "saml",
    ],
    askBefore: [
      "Confirm the parameters before executing Post ACS.",
    ],
  }),
  composioTool({
    name: "grafana_query_public_dashboard",
    description: "Query a panel on a public Grafana dashboard to retrieve time-series data and metrics. Use when you need to fetch visualization data from a publicly shared dashboard without authentication. Returns data frames with query results for the specified time range.",
    toolSlug: "GRAFANA_QUERY_PUBLIC_DASHBOARD",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "public_dashboard",
    ],
  }),
  composioTool({
    name: "grafana_retrieve_jwks",
    description: "Tool to retrieve JSON Web Key Set (JWKS) with all public keys for token verification. Use when you need to get the keys that can verify JWT tokens.",
    toolSlug: "GRAFANA_RETRIEVE_JWKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "grafana",
      "read",
      "security",
    ],
  }),
];
