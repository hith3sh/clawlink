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
    integration: "snowflake",
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
      toolkit: "snowflake",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const snowflakeComposioTools: IntegrationTool[] = [
  composioTool({
    name: "snowflake_cancel_statement_execution",
    description: "Cancels the execution of a running SQL statement. Use this action to stop a long-running query.",
    toolSlug: "SNOWFLAKE_CANCEL_STATEMENT_EXECUTION",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "snowflake",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel Statement Execution.",
    ],
  }),
  composioTool({
    name: "snowflake_check_statement_status",
    description: "Retrieves the status and results of a previously submitted SQL statement using its statement handle. Use this to poll async queries submitted via SNOWFLAKE_SUBMIT_SQL_STATEMENT; call repeatedly until status is no longer pending. Use SNOWFLAKE_CANCEL_STATEMENT to abort a hanging query.",
    toolSlug: "SNOWFLAKE_CHECK_STATEMENT_STATUS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_execute_sql",
    description: "Execute SQL statements in Snowflake and retrieve results. Supports SELECT queries for data retrieval, DDL statements (CREATE, ALTER, DROP) for schema management, and DML statements (INSERT, UPDATE, DELETE) for data modification. Returns comprehensive result metadata including column types, row counts, and execution status. Unquoted SQL identifiers are auto-uppercased by Snowflake — use matching case in `database`, `schema_name`, `warehouse`, and `role` parameters to avoid 'object not found' errors. Always apply explicit time-range filters and a LIMIT clause to unbounded SELECT queries to prevent large, slow result sets.",
    toolSlug: "SNOWFLAKE_EXECUTE_SQL",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "snowflake",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Execute SQL.",
    ],
  }),
  composioTool({
    name: "snowflake_fetch_catalog_integration",
    description: "Retrieves detailed configuration and metadata for a specific catalog integration. Catalog integrations allow Snowflake to connect to external Apache Iceberg catalogs (AWS Glue, Snowflake Open Catalog/Polaris, or Apache Iceberg REST catalogs) to query Iceberg tables managed by those external systems.",
    toolSlug: "SNOWFLAKE_FETCH_CATALOG_INTEGRATION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
      "catalog",
    ],
  }),
  composioTool({
    name: "snowflake_get_active_scheduled_maintenances",
    description: "Retrieves a list of any active scheduled maintenances currently in the In Progress or Verifying state.",
    toolSlug: "SNOWFLAKE_GET_ACTIVE_SCHEDULED_MAINTENANCES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_get_all_scheduled_maintenances",
    description: "Retrieves a list of the 50 most recent scheduled maintenances, including those in the Completed state.",
    toolSlug: "SNOWFLAKE_GET_ALL_SCHEDULED_MAINTENANCES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_get_component_status",
    description: "Retrieves the status of individual components, each listed with its current status.",
    toolSlug: "SNOWFLAKE_GET_COMPONENT_STATUS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_get_status_rollup",
    description: "Retrieves the status rollup for the entire page, including indicators and human-readable descriptions of the blended component status.",
    toolSlug: "SNOWFLAKE_GET_STATUS_ROLLUP",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_get_status_summary",
    description: "Retrieves the current status summary from Snowflake's public status page (status.snowflake.com). Returns overall system status, operational status of all regional components (AWS, Azure, GCP regions), any unresolved incidents, and upcoming or in-progress scheduled maintenances. This is a public endpoint that provides global Snowflake service status, not account-specific information.",
    toolSlug: "SNOWFLAKE_GET_STATUS_SUMMARY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_get_unresolved_incidents",
    description: "Retrieves a list of any unresolved incidents from the Snowflake status page. This endpoint returns incidents currently in the Investigating, Identified, or Monitoring state. Returns an empty list if there are no active incidents. This is a public status page API that does not require authentication.",
    toolSlug: "SNOWFLAKE_GET_UNRESOLVED_INCIDENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_get_upcoming_scheduled_maintenances",
    description: "Retrieves upcoming scheduled maintenances from Snowflake's public status page. This action queries the Snowflake status API to get a list of any scheduled maintenance events that are still in the 'Scheduled' state (not yet started or completed). The response includes maintenance details such as impact level, scheduled time windows, incident updates, and direct links to the maintenance notices. Note: This uses Snowflake's public status API and does not require authentication.",
    toolSlug: "SNOWFLAKE_GET_UPCOMING_SCHEDULED_MAINTENANCES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_show_databases",
    description: "Lists all databases for which you have access privileges. Shows database metadata including name, creation date, owner, retention time, and more. Can filter results and include dropped databases within Time Travel retention period.",
    toolSlug: "SNOWFLAKE_SHOW_DATABASES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_show_schemas",
    description: "Lists all schemas for which you have access privileges. Shows schema metadata including name, creation date, owner, database, retention time, and more. Can filter results and include dropped schemas within Time Travel retention period.",
    toolSlug: "SNOWFLAKE_SHOW_SCHEMAS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
  composioTool({
    name: "snowflake_show_tables",
    description: "Lists all tables for which you have access privileges. Shows table metadata including name, creation date, owner, database, schema, row count, size in bytes, clustering keys, and more. Can filter results and include dropped tables within Time Travel retention period.",
    toolSlug: "SNOWFLAKE_SHOW_TABLES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "snowflake",
      "read",
    ],
  }),
];
