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
    integration: "airtable",
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
      toolkit: "airtable",
      toolSlug: partial.toolSlug,
      version: "20260501_00",
    },
  };
}

export const airtableComposioTools: IntegrationTool[] = [
  composioTool({
    name: "airtable_create_base",
    description: "Creates a new Airtable base with specified tables and fields within a workspace.",
    toolSlug: "AIRTABLE_CREATE_BASE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create base.",
    ],
  }),
  composioTool({
    name: "airtable_create_comment",
    description: "Tool to create a comment on a specific Airtable record. Use when adding comments to records, mentioning collaborators using @[userId] syntax, or creating threaded comment replies. Supports optional parentCommentId for threaded conversations.",
    toolSlug: "AIRTABLE_CREATE_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Comment.",
    ],
  }),
  composioTool({
    name: "airtable_create_field",
    description: "Creates a new field within a specified table in an Airtable base.",
    toolSlug: "AIRTABLE_CREATE_FIELD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Field.",
    ],
  }),
  composioTool({
    name: "airtable_create_record_from_natural_language",
    description: "Creates a new record in an Airtable table from a natural language description. Fetches the table schema, uses an LLM to generate the correct field payload, and creates the record with typecast enabled for automatic type conversion.",
    toolSlug: "AIRTABLE_CREATE_RECORD_FROM_NATURAL_LANGUAGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Record From Natural Language.",
    ],
  }),
  composioTool({
    name: "airtable_create_records",
    description: "Tool to create multiple records (up to 10) in a specified Airtable table. Use when you need to add new rows to a table with field values. Rate limit: 5 requests per second per base.",
    toolSlug: "AIRTABLE_CREATE_RECORDS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "records_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Create records.",
    ],
  }),
  composioTool({
    name: "airtable_create_table",
    description: "Creates a new table within a specified existing Airtable base, allowing definition of its name, description, and field structure.",
    toolSlug: "AIRTABLE_CREATE_TABLE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "schema_and_base_administration",
    ],
    askBefore: [
      "Confirm the parameters before executing Create table.",
    ],
  }),
  composioTool({
    name: "airtable_delete_comment",
    description: "Tool to delete a comment from a record in an Airtable table. Use when you need to remove an existing comment. Non-admin users can only delete their own comments; Enterprise Admins can delete any comment.",
    toolSlug: "AIRTABLE_DELETE_COMMENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "airtable",
      "write",
      "comments",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Comment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "airtable_delete_multiple_records",
    description: "Tool to delete up to 10 specified records from a table within an Airtable base. Use when you need to remove multiple records in a single operation.",
    toolSlug: "AIRTABLE_DELETE_MULTIPLE_RECORDS",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "airtable",
      "write",
      "records_management",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete multiple records.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "airtable_delete_record",
    description: "Permanently deletes a specific record from an existing table within an existing Airtable base.",
    toolSlug: "AIRTABLE_DELETE_RECORD",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "airtable",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Record.",
    ],
  }),
  composioTool({
    name: "airtable_get_base_schema",
    description: "Retrieves the detailed schema for a specified Airtable base, including its tables, fields, field types, and configurations, using the `baseId`.",
    toolSlug: "AIRTABLE_GET_BASE_SCHEMA",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "airtable",
      "read",
      "schema_and_base_administration",
    ],
  }),
  composioTool({
    name: "airtable_get_record",
    description: "Retrieves a specific record from an Airtable table by its record ID. Requires a known, valid record ID obtained from listing records or another API call - this tool cannot search or list records. Use the list records tool to find record IDs. Empty field values are not returned in the response.",
    toolSlug: "AIRTABLE_GET_RECORD",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "airtable",
      "read",
      "records_management",
    ],
  }),
  composioTool({
    name: "airtable_get_user_info",
    description: "Retrieves information, such as ID and permission scopes, for the currently authenticated Airtable user from the `/meta/whoami` endpoint.",
    toolSlug: "AIRTABLE_GET_USER_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "airtable",
      "read",
      "users",
    ],
  }),
  composioTool({
    name: "airtable_list_bases",
    description: "Retrieves all Airtable bases accessible to the authenticated user, which may include an 'offset' for pagination.",
    toolSlug: "AIRTABLE_LIST_BASES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "airtable",
      "read",
      "schema_and_base_administration",
    ],
  }),
  composioTool({
    name: "airtable_list_comments",
    description: "Tool to list comments on a specific Airtable record. Use when retrieving comments for a record, with optional pagination support for large comment threads.",
    toolSlug: "AIRTABLE_LIST_COMMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "airtable",
      "read",
      "comments",
    ],
  }),
  composioTool({
    name: "airtable_list_records",
    description: "Tool to list records from an Airtable table with filtering, sorting, and pagination. Use when you need to retrieve multiple records from a table with optional query parameters.",
    toolSlug: "AIRTABLE_LIST_RECORDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "airtable",
      "read",
    ],
  }),
  composioTool({
    name: "airtable_update_comment",
    description: "Tool to update an existing comment on a specific Airtable record. Use when modifying comment text or updating user mentions using @[userId] syntax. API users can only update comments they have created.",
    toolSlug: "AIRTABLE_UPDATE_COMMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "comments",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Comment.",
    ],
  }),
  composioTool({
    name: "airtable_update_field",
    description: "Updates a field's name or description in an Airtable table. Use this action to modify field metadata without changing the field's type or options. At least one of 'name' or 'description' must be provided.",
    toolSlug: "AIRTABLE_UPDATE_FIELD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "schema_and_base_administration",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Field.",
    ],
  }),
  composioTool({
    name: "airtable_update_multiple_records",
    description: "Tool to update up to 10 records in an Airtable table with selective field modifications. Use when you need to modify multiple existing records or perform upsert operations. Updates are not performed atomically.",
    toolSlug: "AIRTABLE_UPDATE_MULTIPLE_RECORDS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "records_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Update multiple records.",
    ],
  }),
  composioTool({
    name: "airtable_update_multiple_records_put",
    description: "Tool to destructively update multiple records in Airtable using PUT, clearing unspecified fields. Use when you need to fully replace record data or perform upsert operations. Supports up to 10 records per request.",
    toolSlug: "AIRTABLE_UPDATE_MULTIPLE_RECORDS_PUT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "records_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Update multiple records (PUT).",
    ],
  }),
  composioTool({
    name: "airtable_update_record",
    description: "Modifies specified fields of an existing record in an Airtable base and table; the base, table, and record must exist.",
    toolSlug: "AIRTABLE_UPDATE_RECORD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "records_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Update record.",
    ],
  }),
  composioTool({
    name: "airtable_update_record_put",
    description: "Updates an existing record in an Airtable base using PUT method. Use when you want to replace all field values, clearing any unspecified fields. For partial updates that preserve unspecified fields, use the PATCH-based update action instead.",
    toolSlug: "AIRTABLE_UPDATE_RECORD_PUT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "records_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Update record (PUT).",
    ],
  }),
  composioTool({
    name: "airtable_update_table",
    description: "Updates the name, description, and/or date dependency settings of a table in Airtable. Use this action to modify table metadata without changing the table's fields or views. At least one of 'name', 'description', or 'dateDependencySettings' must be provided.",
    toolSlug: "AIRTABLE_UPDATE_TABLE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "schema_and_base_administration",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Table.",
    ],
  }),
  composioTool({
    name: "airtable_upload_attachment",
    description: "Uploads a file attachment to a specified field in an Airtable record. Use when you need to add a file to an attachment field. The file must be provided as a base64-encoded string.",
    toolSlug: "AIRTABLE_UPLOAD_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "airtable",
      "write",
      "attachments",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload attachment.",
    ],
  }),
];
