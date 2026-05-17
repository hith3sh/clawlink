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
    integration: "affinity",
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
      toolkit: "affinity",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const affinityComposioTools: IntegrationTool[] = [
  composioTool({
    name: "affinity_get_a_company_s_list_entries",
    description: "Summarize company data across all lists, including list-specific fields and metadata like creation date and author. Access requires \"Export data from Lists\" permission.",
    toolSlug: "AFFINITY_GET_A_COMPANY_S_LIST_ENTRIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "companies",
    ],
  }),
  composioTool({
    name: "affinity_get_a_company_s_lists",
    description: "Returns metadata for all the Lists on which the given Company appears.",
    toolSlug: "AFFINITY_GET_A_COMPANY_S_LISTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "companies",
    ],
  }),
  composioTool({
    name: "affinity_get_a_person_s_list_entries",
    description: "Summary: Browse rows for a Person in all Lists, showing field data and entry metadata like creation time and author. Requires \"Export data from Lists\" permission.",
    toolSlug: "AFFINITY_GET_A_PERSON_S_LIST_ENTRIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "persons",
    ],
  }),
  composioTool({
    name: "affinity_get_a_person_s_lists",
    description: "Returns metadata for all the Lists on which the given Person appears.",
    toolSlug: "AFFINITY_GET_A_PERSON_S_LISTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "persons",
    ],
  }),
  composioTool({
    name: "affinity_get_a_single_company",
    description: "Retrieve basic company info and specific field data by using `fieldIds` or `fieldTypes` parameters. Multiple fields can be queried. No field data if parameters aren't specified. Requires \"Export All Organizations directory\" permission.",
    toolSlug: "AFFINITY_GET_A_SINGLE_COMPANY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "companies",
    ],
  }),
  composioTool({
    name: "affinity_get_a_single_opportunity",
    description: "Get basic details about an Opportunity without field data via provided endpoints. Field data requires using specific list entry APIs and the \"Export data from Lists\" permission.",
    toolSlug: "AFFINITY_GET_A_SINGLE_OPPORTUNITY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "opportunities",
    ],
  }),
  composioTool({
    name: "affinity_get_a_single_person",
    description: "Use GET `/v2/persons/fields` with `fieldIds` or `fieldTypes` for detailed data; basic info by default. Request multiple fields at once. \"Export All People\" permission needed.",
    toolSlug: "AFFINITY_GET_A_SINGLE_PERSON",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "persons",
    ],
  }),
  composioTool({
    name: "affinity_get_all_companies",
    description: "Affinity API allows paginated access to company info and custom fields. Use `fieldIds` or `fieldTypes` to specify data in a request. Retrieve field IDs/Types via GET `/v2/companies/fields`. Export permission needed.",
    toolSlug: "AFFINITY_GET_ALL_COMPANIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "companies",
    ],
  }),
  composioTool({
    name: "affinity_get_all_list_entries_on_a_list",
    description: "Access and export essential data and metadata for Companies, Persons, or Opportunities from a List, specifying data via `fieldIds` or `fieldTypes`. \"Export data from Lists\" permission is necessary.",
    toolSlug: "AFFINITY_GET_ALL_LIST_ENTRIES_ON_A_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "affinity_get_all_list_entries_on_a_saved_view",
    description: "Use the endpoint to access rows in a Saved View with specific filters and selected fields from a web app. It doesn't maintain sort order, supports only sheet-type views, and requires export permissions.",
    toolSlug: "AFFINITY_GET_ALL_LIST_ENTRIES_ON_A_SAVED_VIEW",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "affinity_get_all_opportunities",
    description: "Pagination through Opportunities in Affinity yields basic info but excludes field data. For field data, use specified GET endpoints. \"Export data from Lists\" permission needed.",
    toolSlug: "AFFINITY_GET_ALL_OPPORTUNITIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "opportunities",
    ],
  }),
  composioTool({
    name: "affinity_get_all_persons",
    description: "The Affinity API offers paginated access to Person data using `fieldIds` or `fieldTypes`. Bulk extraction needs special permissions and supports multiple parameters.",
    toolSlug: "AFFINITY_GET_ALL_PERSONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "persons",
    ],
  }),
  composioTool({
    name: "affinity_get_current_user",
    description: "Returns metadata about the current user.",
    toolSlug: "AFFINITY_GET_CURRENT_USER",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "auth",
    ],
  }),
  composioTool({
    name: "affinity_get_metadata_on_a_single_list",
    description: "Returns metadata on a single List.",
    toolSlug: "AFFINITY_GET_METADATA_ON_A_SINGLE_LIST",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "affinity_get_metadata_on_a_single_list_s_fields",
    description: "Returns metadata on the Fields available on a single List. Use the returned Field IDs to request field data from the GET `/v2/lists/{listId}/list-entries` endpoint.",
    toolSlug: "AFFINITY_GET_METADATA_ON_A_SINGLE_LIST_S_FIELDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "affinity_get_metadata_on_a_single_saved_view",
    description: "Returns metadata on a single Saved View.",
    toolSlug: "AFFINITY_GET_METADATA_ON_A_SINGLE_SAVED_VIEW",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "affinity_get_metadata_on_all_lists",
    description: "Returns metadata on Lists.",
    toolSlug: "AFFINITY_GET_METADATA_ON_ALL_LISTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "affinity_get_metadata_on_company_fields",
    description: "Returns metadata on non-list-specific Company Fields. Use the returned Field IDs to request field data from the GET `/v2/companies` and GET `/v2/companies/{id}` endpoints.",
    toolSlug: "AFFINITY_GET_METADATA_ON_COMPANY_FIELDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "companies",
    ],
  }),
  composioTool({
    name: "affinity_get_metadata_on_person_fields",
    description: "Returns metadata on non-list-specific Person Fields. Use the returned Field IDs to request field data from the GET `/v2/persons` and GET `/v2/persons/{id}` endpoints.",
    toolSlug: "AFFINITY_GET_METADATA_ON_PERSON_FIELDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "persons",
    ],
  }),
  composioTool({
    name: "affinity_get_metadata_on_saved_views",
    description: "Returns metadata on the Saved Views on a List.",
    toolSlug: "AFFINITY_GET_METADATA_ON_SAVED_VIEWS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "affinity",
      "read",
      "lists",
    ],
  }),
];
