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
    integration: "cloudflare",
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
      toolkit: "cloudflare",
      toolSlug: partial.toolSlug,
      version: "20260506_00",
    },
  };
}

export const cloudflareComposioTools: IntegrationTool[] = [
  composioTool({
    name: "cloudflare_create_dns_record",
    description: "Tool to create a new DNS record within a specific zone. Requires write privileges and makes live changes to the zone. Use after obtaining the zone ID via CLOUDFLARE_LIST_ZONES to programmatically add DNS entries.",
    toolSlug: "CLOUDFLARE_CREATE_DNS_RECORD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create DNS record.",
    ],
  }),
  composioTool({
    name: "cloudflare_create_list",
    description: "Create a new empty custom list for use in WAF rules and filters. Lists can contain IP addresses, hostnames, ASNs, or redirects. Once created, use separate actions to add items to the list. Note: List availability depends on plan (Free: 1 list, Pro/Business: 10 lists, Enterprise: 1000 lists). Example: CREATE_LIST(account_id=\"abc123\", kind=\"ip\", name=\"blocklist\", description=\"Block malicious IPs\")",
    toolSlug: "CLOUDFLARE_CREATE_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create WAF List.",
    ],
  }),
  composioTool({
    name: "cloudflare_create_zone",
    description: "Creates a new DNS zone (domain) in Cloudflare. A zone represents a domain and its DNS records. Use this when adding a new domain to manage with Cloudflare. Requires account ID (obtainable via LIST_ACCOUNTS). The zone will be in 'pending' status until nameservers are updated at the domain registrar.",
    toolSlug: "CLOUDFLARE_CREATE_ZONE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Zone.",
    ],
  }),
  composioTool({
    name: "cloudflare_delete_dns_record",
    description: "Tool to delete a DNS record within a specific zone. Deletion is immediate and irreversible. Use only after confirming both zone and record IDs. Requires write privileges on the zone. Example: \"Delete DNS record 372e6795... from zone 023e105f4ecef...\"",
    toolSlug: "CLOUDFLARE_DELETE_DNS_RECORD",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "cloudflare",
      "write",
      "dns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete DNS Record.",
    ],
  }),
  composioTool({
    name: "cloudflare_delete_list",
    description: "Tool to delete a WAF list. Use when you need to remove a list after verifying no filters reference it. Example: DELETE_LIST(account_id=\"<account_id>\", list_id=\"<list_id>\")",
    toolSlug: "CLOUDFLARE_DELETE_LIST",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete WAF List.",
    ],
  }),
  composioTool({
    name: "cloudflare_delete_zone",
    description: "Tool to delete a zone. Use after confirming the zone identifier to permanently remove a DNS zone and all its DNS records from your Cloudflare account. Example: DELETE_ZONE(zone_identifier=\"023e105f4ecef8ad9ca31a8372d0c353\")",
    toolSlug: "CLOUDFLARE_DELETE_ZONE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Zone.",
    ],
  }),
  composioTool({
    name: "cloudflare_get_bot_management_settings",
    description: "Tool to retrieve a zone's Bot Management configuration (Bot Fight Mode / Super Bot Fight Mode / Enterprise Bot Management). Use after identifying the correct zone_id (e.g., via CLOUDFLARE_LIST_ZONES). This tool is the canonical way to audit bot-related configuration; firewall rules are adjacent controls but not equivalent to Bot Management settings.",
    toolSlug: "CLOUDFLARE_GET_BOT_MANAGEMENT_SETTINGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
      "bot_management",
    ],
  }),
  composioTool({
    name: "cloudflare_get_lists",
    description: "Tool to fetch all WAF lists (no items) for an account. Results are paginated; iterate using page and per_page parameters until result_info.total_pages is reached to retrieve all lists. Use after confirming account ID.",
    toolSlug: "CLOUDFLARE_GET_LISTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_list_account_members",
    description: "Lists all members of a Cloudflare account with their roles, permissions, and status. Returns detailed information about each account member including their user details (name, email, 2FA status), assigned roles with granular permissions, membership status (accepted/pending/rejected), and access policies. Supports filtering by status, sorting by various fields, and pagination for accounts with many members. Use this action when you need to: - View all users with access to a Cloudflare account - Audit account member permissions and roles - Check membership status of invited users - List members with specific roles or statuses Requires the account ID which can be obtained using the List Accounts action. Note: caller's account role may restrict visibility of some members if permissions are insufficient.",
    toolSlug: "CLOUDFLARE_LIST_ACCOUNT_MEMBERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_list_accounts",
    description: "List all Cloudflare accounts you have ownership or verified access to. Retrieves a paginated list of accounts with their details including account ID, name, type, settings, and creation date. An empty or partial result may indicate insufficient API token scope or permissions, not the absence of accounts. When multiple accounts are returned, confirm the intended account_id before performing any write operations to avoid acting on unintended environments. Use this when you need to: - Discover available accounts before performing account-specific operations - Find an account ID for other API calls that require an account identifier - Audit account configurations and settings - Filter accounts by name or paginate through large account lists",
    toolSlug: "CLOUDFLARE_LIST_ACCOUNTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_list_dns_records",
    description: "Tool to list and search DNS records in a Cloudflare zone. Use when you need to find existing DNS record IDs for update or delete operations, especially after a \"record already exists\" error during creation. Returns matching records with their IDs, names, types, content, and other properties.",
    toolSlug: "CLOUDFLARE_LIST_DNS_RECORDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_list_firewall_rules",
    description: "Tool to list firewall rules for a specific DNS zone. Use after confirming the zone ID to retrieve and audit current firewall rules. Does not expose Workers routes or other routing constructs.",
    toolSlug: "CLOUDFLARE_LIST_FIREWALL_RULES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_list_monitors",
    description: "Tool to list all load-balancer monitors in a Cloudflare account. Use after creating or updating monitors to retrieve a paginated list. Response includes `result_info.total_pages` to determine when all pages have been fetched.",
    toolSlug: "CLOUDFLARE_LIST_MONITORS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_list_pools",
    description: "Tool to list all load balancer pools in a Cloudflare account. Use after confirming account ID to discover pool IDs. Paginate using `page` and `per_page`; check `result_info.total_pages` in the response to determine if additional pages exist.",
    toolSlug: "CLOUDFLARE_LIST_POOLS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_list_tunnels",
    description: "List Cloudflare Tunnel (cloudflared) tunnels in an account to discover tunnel IDs, names, and statuses. Use when you need to find a tunnel_id before performing tunnel operations like routing, DNS configuration, or debugging.",
    toolSlug: "CLOUDFLARE_LIST_TUNNELS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
      "tunnels",
    ],
  }),
  composioTool({
    name: "cloudflare_list_zones",
    description: "Lists, searches, sorts, and filters zones in the authenticated account. Use `page`/`per_page` to paginate; check `result_info.total_pages` in the response to iterate all pages. Does not return DNS records — extract `zone_id` from results before passing to zone-scoped tools (DNS, firewall, etc.). Only zones delegated to Cloudflare nameservers appear; empty results indicate scope or delegation constraints, not errors.",
    toolSlug: "CLOUDFLARE_LIST_ZONES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "cloudflare",
      "read",
    ],
  }),
  composioTool({
    name: "cloudflare_update_dns_record",
    description: "Tool to update an existing DNS record within a specific zone. Use after confirming both zone and record identifiers; only provided fields are modified. Updates to records used by active tunnels take effect immediately and can disrupt live traffic.",
    toolSlug: "CLOUDFLARE_UPDATE_DNS_RECORD",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update DNS record.",
    ],
  }),
  composioTool({
    name: "cloudflare_update_list",
    description: "Tool to update the description of a WAF list (cannot update items). Use after confirming list metadata.",
    toolSlug: "CLOUDFLARE_UPDATE_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update WAF List.",
    ],
  }),
  composioTool({
    name: "cloudflare_update_tunnel_configuration",
    description: "Tool to update a remotely-managed Cloudflare Tunnel's configuration (ingress rules and routing). Use when you need to programmatically configure hostname-to-origin mappings for a tunnel. WARNING: This operation REPLACES the entire configuration - incorrect configuration can break routing and make services unreachable. Best practice: fetch current configuration first (if patching) to preserve existing rules. At least one ingress rule is required, and the last rule should typically be a catch-all (hostname='*' or omitted) with service='http_status:404'.",
    toolSlug: "CLOUDFLARE_UPDATE_TUNNEL_CONFIGURATION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "cloudflare",
      "write",
      "tunnels",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Tunnel Configuration.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "cloudflare_update_zone",
    description: "Tool to update properties of an existing zone; changes apply immediately to the live zone. Confirm zone ID and intended change with the user before calling. Only one field can be modified per call.",
    toolSlug: "CLOUDFLARE_UPDATE_ZONE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "cloudflare",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Zone.",
    ],
  }),
];
