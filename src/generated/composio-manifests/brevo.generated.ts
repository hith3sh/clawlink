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
    integration: "brevo",
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
      toolkit: "brevo",
      toolSlug: partial.toolSlug,
      version: "20260424_00",
    },
  };
}

export const brevoComposioTools: IntegrationTool[] = [
  composioTool({
    name: "brevo_create_a_company",
    description: "Creates a new company record in your Brevo CRM. Companies can be used to organize contacts and deals, track business relationships, and manage customer accounts. You can add custom attributes, link existing contacts and deals, and set country codes for international phone numbers. Use this when you need to add a new business or organization to your CRM system.",
    toolSlug: "BREVO_CREATE_A_COMPANY",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "brevo",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a company.",
    ],
  }),
  composioTool({
    name: "brevo_create_contact_list",
    description: "Creates a new contact list (audience) in Brevo within a specified folder. Contact lists are used to organize and segment contacts for email campaigns, SMS campaigns, and marketing automation workflows. Use this tool when you need to: - Create a new audience segment for a marketing campaign - Organize contacts by specific criteria (e.g., geographic location, interests, purchase history) - Set up a list for newsletter subscribers, event attendees, or customer segments - Prepare a target audience before adding contacts or launching campaigns Note: You must specify a valid folder ID. Use Get Contact Lists to view existing folders and their IDs.",
    toolSlug: "BREVO_CREATE_CONTACT_LIST",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "brevo",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Contact List.",
    ],
  }),
  composioTool({
    name: "brevo_create_or_update_email_template",
    description: "This tool creates a new email template or updates an existing one in Brevo. If a 'templateId' is provided, it performs an update; otherwise, it creates a new template.",
    toolSlug: "BREVO_CREATE_OR_UPDATE_EMAIL_TEMPLATE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "brevo",
      "write",
      "email_templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Create or Update Email Template.",
    ],
  }),
  composioTool({
    name: "brevo_create_sms_campaign",
    description: "This tool allows you to create a new SMS campaign in Brevo. You can specify the campaign name, sender, content, recipients (by providing list IDs, exclusion list IDs, or segment IDs), and optionally schedule the campaign for a specific time. You can also enable Unicode characters, add an organization prefix, and include unsubscribe instructions.",
    toolSlug: "BREVO_CREATE_SMS_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "brevo",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create SMS Campaign.",
    ],
  }),
  composioTool({
    name: "brevo_delete_company",
    description: "Deletes a company from Brevo using its unique identifier.",
    toolSlug: "BREVO_DELETE_COMPANY",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "brevo",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete a company.",
    ],
  }),
  composioTool({
    name: "brevo_delete_contact",
    description: "Deletes a contact from Brevo by email, contact ID, external ID, phone number, WhatsApp ID, or landline number. Use the identifier_type parameter to specify the type of identifier when using ext_id, phone_id, whatsapp_id, or landline_number_id.",
    toolSlug: "BREVO_DELETE_CONTACT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "brevo",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Contact.",
    ],
  }),
  composioTool({
    name: "brevo_delete_email_template",
    description: "This tool deletes an inactive email template from Brevo. You need to provide the 'templateId' of the email template you want to delete. Only inactive templates can be deleted.",
    toolSlug: "BREVO_DELETE_EMAIL_TEMPLATE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "brevo",
      "write",
      "email_template",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Email Template.",
    ],
  }),
  composioTool({
    name: "brevo_delete_sms_campaign",
    description: "This tool deletes an existing SMS campaign.",
    toolSlug: "BREVO_DELETE_SMS_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "brevo",
      "write",
      "sms_campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete SMS Campaign.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "brevo_get_account_info",
    description: "Retrieves comprehensive information about the authenticated Brevo account. Returns account details including: - Account holder information (email, first name, last name, company name) - Complete address (street, city, zip code, country) - Plan details with credit information (type, credits remaining, start/end dates) - Relay configuration for transactional emails (enabled status and data) - Marketing Automation status and tracker key (if enabled) No input parameters are required - the action uses the authenticated account's credentials. Use this action to: - Verify account configuration and settings - Check available credits and plan type - Monitor transactional email relay status - Retrieve Marketing Automation tracker information. If credentials are missing or invalid, verify the Brevo connection is active before calling — retries will not resolve credential issues. If blocked by an 'unrecognised IP address' error, add the integration host's IP to the Brevo account allowlist.",
    toolSlug: "BREVO_GET_ACCOUNT_INFO",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
      "account",
    ],
  }),
  composioTool({
    name: "brevo_get_all_contacts",
    description: "This tool retrieves all contacts from your Brevo account with pagination and filtering based on modification/creation dates, list IDs, segment IDs, and contact attributes. For complete retrieval, iterate pages by incrementing `offset` by `limit` on each call until no more records are returned; a single call returns at most `limit` contacts.",
    toolSlug: "BREVO_GET_ALL_CONTACTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "brevo_get_all_email_templates",
    description: "This tool retrieves a list of all email templates created in your Brevo account. It corresponds to the GET /v3/smtp/templates endpoint as per the Brevo API documentation, with optional parameters for filtering (templateStatus), pagination (limit, offset), and sorting (asc/desc).",
    toolSlug: "BREVO_GET_ALL_EMAIL_TEMPLATES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
      "email_templates",
    ],
  }),
  composioTool({
    name: "brevo_get_all_senders",
    description: "This tool retrieves a list of all senders associated with the Brevo account. Senders are the email addresses or domains that are authorized to send emails through Brevo. This action can be useful for managing and verifying sender identities.",
    toolSlug: "BREVO_GET_ALL_SENDERS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
    ],
  }),
  composioTool({
    name: "brevo_get_company_details",
    description: "Retrieves detailed information about a specific company from Brevo's CRM. Returns company data including its unique identifier, custom attributes, and lists of linked contact IDs and deal IDs. This is useful for accessing comprehensive company records and understanding company relationships.",
    toolSlug: "BREVO_GET_COMPANY_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
      "company",
    ],
  }),
  composioTool({
    name: "brevo_get_contact_details",
    description: "This tool retrieves detailed information about a specific contact in Brevo. You can identify the contact using their email address (URL-encoded), their unique contact ID, or their SMS attribute value.",
    toolSlug: "BREVO_GET_CONTACT_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
    ],
  }),
  composioTool({
    name: "brevo_get_contact_lists",
    description: "Retrieves all contact lists from your Brevo account with pagination support. Returns list IDs, names, subscriber counts, and folder associations. Use this to discover available lists or obtain list IDs needed for other operations (e.g., SMS campaigns, adding contacts to lists).",
    toolSlug: "BREVO_GET_CONTACT_LISTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "brevo_get_email_campaign_details",
    description: "Tool to retrieve full configuration and content for a specific email campaign. Use when you need complete campaign details including HTML content, recipients, statistics, and all configuration settings that may be omitted from list responses.",
    toolSlug: "BREVO_GET_EMAIL_CAMPAIGN_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
      "email_campaigns",
    ],
  }),
  composioTool({
    name: "brevo_get_sms_campaign_details",
    description: "Retrieves the details of a specific SMS campaign. This action fetches complete information about an SMS campaign including its status, content, sender, scheduling, recipients, and statistics.",
    toolSlug: "BREVO_GET_SMS_CAMPAIGN_DETAILS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
    ],
  }),
  composioTool({
    name: "brevo_get_sms_campaigns",
    description: "Retrieves all SMS campaigns from your Brevo account with optional filtering and pagination. Use this tool to: - List all SMS campaigns with their details (name, status, content, sender, dates) - Filter campaigns by status (sent, draft, queued, suspended, inProcess, archive) - Filter sent campaigns by date range - Control pagination with limit and offset - Sort results by creation date (ascending or descending) Returns campaign overview information including ID, name, status, content, sender, scheduled date (if any), and creation/modification timestamps.",
    toolSlug: "BREVO_GET_SMS_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
    ],
  }),
  composioTool({
    name: "brevo_list_all_companies",
    description: "This action retrieves a list of all companies stored in the Brevo CRM. It supports pagination and filtering by name and other attributes.",
    toolSlug: "BREVO_LIST_ALL_COMPANIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
      "companies",
      "crm",
    ],
  }),
  composioTool({
    name: "brevo_list_email_campaigns",
    description: "This tool retrieves a list of all email campaigns associated with the user's Brevo account. It allows filtering by campaign type, status, start date, and end date. The response includes the total count of campaigns and an array of campaign objects, each containing details like ID, name, subject, type, status, scheduled date/time, sender information, and optionally, campaign statistics. A response with `count` of 0 and an empty campaigns array is a valid result, not an error.",
    toolSlug: "BREVO_LIST_EMAIL_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "brevo",
      "read",
    ],
  }),
  composioTool({
    name: "brevo_update_email_campaign",
    description: "Updates an email campaign in Brevo using its unique identifier.",
    toolSlug: "BREVO_UPDATE_EMAIL_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "brevo",
      "write",
      "email_campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Email Campaign.",
    ],
  }),
];
