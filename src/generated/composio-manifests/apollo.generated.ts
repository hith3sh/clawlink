import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
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
    integration: "apollo",
    name: partial.name,
    description: partial.description,
    inputSchema: partial.inputSchema,
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
      toolkit: "apollo",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const apolloComposioTools: IntegrationTool[] = [
  composioTool({
    name: "apollo_add_contacts_to_sequence",
    description: "Adds contacts to a specified Apollo email sequence and returns the contact details. `sequence_id`, `emailer_campaign_id`, and `send_email_from_email_account_id` must be retrieved from Apollo listing/search endpoints before calling this tool — these IDs cannot be inferred from names.",
    toolSlug: "APOLLO_ADD_CONTACTS_TO_SEQUENCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "Optional unique ID of the user performing the action (in request body if specified).",
        },
        contact_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of unique Apollo contact IDs to add to the sequence (in request body).",
        },
        sequence_id: {
          type: "string",
          description: "Unique ID of the Apollo sequence to add contacts to (path parameter).",
        },
        sequence_no_email: {
          type: "boolean",
          description: "If true, add contacts without an email address (query parameter).",
        },
        emailer_campaign_id: {
          type: "string",
          description: "Unique ID of the Apollo emailer campaign (should match `sequence_id`; in request body).",
        },
        sequence_job_change: {
          type: "boolean",
          description: "If true, add contacts who recently changed jobs (query parameter).",
        },
        sequence_unverified_email: {
          type: "boolean",
          description: "If true, add contacts with unverified emails (query parameter).",
        },
        send_email_from_email_account_id: {
          type: "string",
          description: "Unique ID of the Apollo email account for sending emails (in request body).",
        },
        sequence_active_in_other_campaigns: {
          type: "boolean",
          description: "If true, add contacts active in other sequences (query parameter).",
        },
        sequence_finished_in_other_campaigns: {
          type: "boolean",
          description: "If true, add contacts finished in other sequences (query parameter).",
        },
      },
      required: [
        "sequence_id",
        "emailer_campaign_id",
        "contact_ids",
        "send_email_from_email_account_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "contacts",
      "sequences",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Contacts to Sequence.",
    ],
  }),
  composioTool({
    name: "apollo_bulk_organization_enrichment",
    description: "Enriches data for up to 10 organizations simultaneously by providing a list of their base company domains (e.g., 'apollo.io', not 'www.apollo.io'). Each call consumes Apollo credits per domain enriched; monitor quota to avoid exhaustion errors.",
    toolSlug: "APOLLO_BULK_ORGANIZATION_ENRICHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        domains: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of 1-10 company domains to enrich. Domains should be base domains (e.g., 'apollo.io') and not include 'www.', '@', or protocols like 'http://'.",
        },
      },
      required: [
        "domains",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
    ],
  }),
  composioTool({
    name: "apollo_bulk_people_enrichment",
    description: "Use to enrich multiple person profiles simultaneously with comprehensive data from Apollo's database. Each call consumes Apollo credits; avoid re-enriching the same contacts. Responses may include null or missing fields (e.g., email, phone, organization); treat unmatched records as valid 'no match' outcomes, not errors. Heavy use may trigger HTTP 429; respect Retry-After headers.",
    toolSlug: "APOLLO_BULK_PEOPLE_ENRICHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        details: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Apollo's unique person identifier.",
              },
              name: {
                type: "string",
                description: "Person's full name.",
              },
              email: {
                type: "string",
                description: "Email address.",
              },
              title: {
                type: "string",
                description: "Job title.",
              },
              domain: {
                type: "string",
                description: "Company's domain.",
              },
              last_name: {
                type: "string",
                description: "Person's last name.",
              },
              first_name: {
                type: "string",
                description: "Person's first name.",
              },
              company_name: {
                type: "string",
                description: "Company name.",
              },
              hashed_email: {
                type: "string",
                description: "MD5 or SHA-256 hashed email.",
              },
              linkedin_url: {
                type: "string",
                description: "LinkedIn profile URL.",
              },
              organization_id: {
                type: "string",
                description: "Apollo ID of the associated organization.",
              },
            },
          },
          description: "List of 1-10 person objects to enrich. At least one person is required. For effective matching, include key identifiers like email, LinkedIn URL, or name plus company information. Exceeding 10 objects causes 400/422 errors; chunk larger lists into batches of ≤10.",
        },
        webhook_url: {
          type: "string",
          description: "Webhook URL for phone number delivery if `reveal_phone_number` is true; mandatory in that case. URL must be publicly reachable; inaccessible URLs silently prevent phone data delivery.",
        },
        reveal_phone_number: {
          type: "boolean",
          description: "If true, enriches with all available phone numbers; may consume credits and requires 'webhook_url'.",
        },
        reveal_personal_emails: {
          type: "boolean",
          description: "If true, enriches with personal emails; may consume additional credits.",
        },
      },
      required: [
        "details",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "enrichment",
      "people",
    ],
  }),
  composioTool({
    name: "apollo_bulk_update_account_stage",
    description: "Bulk updates the stage for specified existing Apollo.io accounts, moving them to a valid new account stage.",
    toolSlug: "APOLLO_BULK_UPDATE_ACCOUNT_STAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        account_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of unique identifiers for accounts whose stage needs to be updated.",
        },
        account_stage_id: {
          type: "string",
          description: "The unique identifier of the account stage to which the specified accounts will be moved.",
        },
      },
      required: [
        "account_ids",
        "account_stage_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "accounts",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk update account stage.",
    ],
  }),
  composioTool({
    name: "apollo_create_account",
    description: "Creates a new account in Apollo.io; a new record is created even if a similar account exists, and provided `owner_id` or `account_stage_id` must be valid existing IDs. The response includes the new account's ID, which can be used directly in subsequent calls.",
    toolSlug: "APOLLO_CREATE_ACCOUNT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Human-readable name for the account.",
        },
        phone: {
          type: "string",
          description: "Primary phone number for the account (e.g., main corporate line, branch, or direct dial).",
        },
        domain: {
          type: "string",
          description: "Company's primary domain name (e.g., 'apollo.io', not 'www.apollo.io') to help Apollo enrich account data.",
        },
        owner_id: {
          type: "string",
          description: "Unique ID of the user within your Apollo team to be assigned as owner; retrieve via the 'Get a List of Users' endpoint.",
        },
        raw_address: {
          type: "string",
          description: "Physical address or general location of the account (e.g., full street address or 'City, State, Country').",
        },
        account_stage_id: {
          type: "string",
          description: "Unique ID for the account's sales stage (e.g., 'Prospecting' or 'Closed Won'); retrieve via the 'List Account Stages' endpoint.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "account",
      "create",
    ],
    askBefore: [
      "Confirm the parameters before executing Create an Apollo account.",
    ],
  }),
  composioTool({
    name: "apollo_create_bulk_accounts",
    description: "Creates multiple accounts in Apollo.io with a single API call (maximum 100 accounts per request). Use when creating multiple company records at once.",
    toolSlug: "APOLLO_CREATE_BULK_ACCOUNTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        accounts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Human-readable name for the account (e.g., company name).",
              },
              phone: {
                type: "string",
                description: "Primary phone number for the account (e.g., main corporate line).",
              },
              domain: {
                type: "string",
                description: "Company's primary domain name (e.g., 'apollo.io', not 'www.apollo.io') to help Apollo enrich account data.",
              },
              owner_id: {
                type: "string",
                description: "Unique ID of the user within your Apollo team to be assigned as owner; retrieve via the 'Get a List of Users' endpoint.",
              },
              hubspot_id: {
                type: "string",
                description: "HubSpot CRM ID for this account.",
              },
              raw_address: {
                type: "string",
                description: "Physical address or general location of the account (e.g., full street address or 'City, State, Country').",
              },
              twitter_url: {
                type: "string",
                description: "Twitter/X company handle URL.",
              },
              facebook_url: {
                type: "string",
                description: "Facebook company page URL.",
              },
              linkedin_url: {
                type: "string",
                description: "LinkedIn company page URL.",
              },
              salesforce_id: {
                type: "string",
                description: "Salesforce CRM ID for this account.",
              },
              merged_crm_ids: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Array of merged CRM IDs for deduplication.",
              },
              organization_id: {
                type: "string",
                description: "Apollo organization ID for this account.",
              },
              phone_status_cd: {
                type: "string",
                description: "Phone number status code.",
              },
              account_stage_id: {
                type: "string",
                description: "Unique ID for the account's sales stage (e.g., 'Prospecting' or 'Closed Won'); retrieve via the 'List Account Stages' endpoint.",
              },
              parent_account_id: {
                type: "string",
                description: "Apollo account ID of the parent account.",
              },
              append_label_names: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Array of label names to append to the account.",
              },
              typed_custom_fields: {
                type: "object",
                additionalProperties: true,
                description: "Custom field key-value pairs for the account.",
              },
            },
            description: "Individual account attributes for bulk creation.",
          },
          description: "Array of account objects to create (maximum 100 accounts per request). Each account should have at least a name or domain.",
        },
        run_dedupe: {
          type: "boolean",
          description: "Enable aggressive deduplication by domain, organization_id, and name. When false (default), only matches by CRM IDs. When true, also matches by domain, organization_id, and name. Existing accounts are returned without modification in both modes.",
        },
      },
      required: [
        "accounts",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "accounts",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk create Apollo accounts.",
    ],
  }),
  composioTool({
    name: "apollo_create_bulk_contacts",
    description: "Tool to bulk create multiple contacts in Apollo with a single API call. Use when you need to create multiple contacts efficiently. Supports up to 100 contacts per request with optional deduplication.",
    toolSlug: "APOLLO_CREATE_BULK_CONTACTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contacts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              email: {
                type: "string",
                description: "Primary email address for the contact. Used for deduplication when run_dedupe is enabled.",
              },
              phone: {
                type: "string",
                description: "Primary phone number for the contact.",
              },
              title: {
                type: "string",
                description: "Job title of the contact.",
              },
              owner_id: {
                type: "string",
                description: "Apollo user ID to assign as the contact owner.",
              },
              last_name: {
                type: "string",
                description: "Last name of the contact.",
              },
              photo_url: {
                type: "string",
                description: "URL to the contact's profile photo.",
              },
              account_id: {
                type: "string",
                description: "Apollo ID of the account/organization to associate this contact with. Obtain via Organization Search.",
              },
              first_name: {
                type: "string",
                description: "First name of the contact.",
              },
              hubspot_id: {
                type: "string",
                description: "HubSpot CRM identifier for the contact.",
              },
              outreach_id: {
                type: "string",
                description: "Outreach.io identifier for the contact.",
              },
              twitter_url: {
                type: "string",
                description: "Twitter profile URL for the contact.",
              },
              facebook_url: {
                type: "string",
                description: "Facebook profile URL for the contact.",
              },
              linkedin_url: {
                type: "string",
                description: "LinkedIn profile URL for the contact. Used for deduplication when run_dedupe is enabled.",
              },
              salesloft_id: {
                type: "string",
                description: "SalesLoft identifier for the contact.",
              },
              phone_numbers: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description: "Array of phone number objects with additional metadata (type, status, etc.).",
              },
              primary_title: {
                type: "string",
                description: "Primary job title for the contact.",
              },
              salesforce_id: {
                type: "string",
                description: "Salesforce CRM identifier for the contact.",
              },
              contact_emails: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Array of additional email addresses for the contact.",
              },
              organization_id: {
                type: "string",
                description: "Apollo organization ID to associate the contact with.",
              },
              phone_status_cd: {
                type: "string",
                description: "Phone verification status code.",
              },
              contact_stage_id: {
                type: "string",
                description: "Apollo ID for the contact's sales/engagement stage. Obtain via List Contact Stages action.",
              },
              organization_name: {
                type: "string",
                description: "Name of the contact's organization. Used for deduplication matching when combined with name.",
              },
              append_label_names: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Array of label names to add to this contact. Creates new labels if they don't exist.",
              },
              salesforce_lead_id: {
                type: "string",
                description: "Salesforce lead ID for CRM integration.",
              },
              present_raw_address: {
                type: "string",
                description: "Current location of the contact as a single string.",
              },
              typed_custom_fields: {
                type: "object",
                additionalProperties: true,
                description: "Custom fields with their values as key-value pairs.",
              },
              contact_role_type_ids: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Array of contact role type IDs to assign.",
              },
              salesforce_account_id: {
                type: "string",
                description: "Salesforce account ID for CRM integration.",
              },
              salesforce_contact_id: {
                type: "string",
                description: "Salesforce contact ID for CRM integration.",
              },
            },
            description: "Input model for a single contact to be created.",
          },
          description: "Array of contact objects to create. Maximum 100 contacts per request. Each contact should have at least first_name, last_name, or email.",
        },
        run_dedupe: {
          type: "boolean",
          description: "Enable full deduplication across all sources. When false (default), creates duplicates for non-email_import sources and merges with email_import placeholders only. When true, returns existing contacts without modifying them (except email_import placeholders which are still merged). Matches by email, CRM IDs, or name + organization.",
        },
      },
      required: [
        "contacts",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk create Apollo contacts.",
    ],
  }),
  composioTool({
    name: "apollo_create_call_record",
    description: "Tool to log call records in Apollo from external systems. Use when recording calls made through outside systems like Orum or Nooks; requires a master API key and cannot dial prospects directly.",
    toolSlug: "APOLLO_CREATE_CALL_RECORD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        note: {
          type: "string",
          description: "Add a note to the call record.",
        },
        logged: {
          type: "boolean",
          description: "Set to true if you want to create an individual record for the phone call in Apollo.",
        },
        status: {
          type: "string",
          description: "Possible status values for a phone call.",
          enum: [
            "queued",
            "ringing",
            "in-progress",
            "completed",
            "no_answer",
            "failed",
            "busy",
          ],
        },
        user_id: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Designate the caller in your team's Apollo account. Use the Get a List of Users endpoint to retrieve IDs for all of the users within your Apollo account.",
        },
        duration: {
          type: "integer",
          description: "The duration of the call in seconds. Do not enter minutes.",
        },
        end_time: {
          type: "string",
          description: "The time when the call ended. Should adhere to the ISO 8601 date-time format. Apollo uses GMT by default. You can adjust the time manually by specifying in hours and minutes how much you want to offset GMT.",
        },
        to_number: {
          type: "string",
          description: "The phone number that you dialed.",
        },
        account_id: {
          type: "string",
          description: "Associate the call with an account. Use the Search for Accounts endpoint to retrieve IDs for all of the accounts within your Apollo account.",
        },
        contact_id: {
          type: "string",
          description: "Designate the contact that was called. Use the Search for Contacts endpoint to retrieve IDs for all of the contacts within your Apollo account.",
        },
        start_time: {
          type: "string",
          description: "The time when the call started. Should adhere to the ISO 8601 date-time format. Apollo uses GMT by default. You can adjust the time manually by specifying in hours and minutes how much you want to offset GMT.",
        },
        from_number: {
          type: "string",
          description: "The phone number that dialed you.",
        },
        phone_call_outcome_id: {
          type: "string",
          description: "Assign a call outcome to the record. Call outcomes are unique to your team's Apollo account. When you use the Disposition search filter for calls in the Apollo product, you can find the corresponding call outcome ID in the URL.",
        },
        phone_call_purpose_id: {
          type: "string",
          description: "Assign a call purpose to the record. Call purposes are unique to your team's Apollo account. When you use the Purpose search filter for calls in the Apollo product, you can find the corresponding call purpose ID in the URL.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "calls",
    ],
    askBefore: [
      "Confirm the parameters before executing Create call record in Apollo.",
    ],
  }),
  composioTool({
    name: "apollo_create_contact",
    description: "Creates a new contact in Apollo.io; use `account_id` to link to an organization and `contact_stage_id` for sales stage. Apollo does not auto-deduplicate — duplicate records sharing the same email are silently created; always search via APOLLO_SEARCH_CONTACTS before calling this tool. Requires explicit user confirmation before execution.",
    toolSlug: "APOLLO_CREATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "The primary email address for the contact.",
        },
        title: {
          type: "string",
          description: "The contact's current job title.",
        },
        last_name: {
          type: "string",
          description: "Last name of the contact.",
        },
        account_id: {
          type: "string",
          description: "Apollo ID of the organization to assign this contact; obtain via 'Organization Search' (usually the `id` field).",
        },
        first_name: {
          type: "string",
          description: "First name of the contact.",
        },
        home_phone: {
          type: "string",
          description: "Home phone number. Apollo attempts to parse/sanitize format.",
        },
        label_names: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Descriptive labels to categorize the contact; new labels create new lists in Apollo. Validate values against existing Apollo labels via APOLLO_GET_LABELS before use; unrecognized or mismatched values can cause request failures.",
        },
        other_phone: {
          type: "string",
          description: "Alternative or unspecified-type phone number. Apollo attempts to parse/sanitize format.",
        },
        website_url: {
          type: "string",
          description: "Full corporate website URL for the contact's employer (e.g., 'https://www.apollo.io/'); must be an official company site, not social media.",
        },
        direct_phone: {
          type: "string",
          description: "Primary direct dial phone number. Apollo attempts to parse/sanitize format.",
        },
        mobile_phone: {
          type: "string",
          description: "Mobile phone number. Apollo attempts to parse/sanitize format.",
        },
        corporate_phone: {
          type: "string",
          description: "Work or office direct line. Apollo attempts to parse/sanitize format.",
        },
        contact_stage_id: {
          type: "string",
          description: "Apollo ID for the contact's sales/engagement stage (e.g., representing 'Approaching'); obtain via an action listing contact stages.",
        },
        organization_name: {
          type: "string",
          description: "Name of the contact's current organization. Use 'Organization Search' for the exact Apollo-recognized name for best results.",
        },
        present_raw_address: {
          type: "string",
          description: "Contact's current location as a single string (e.g., 'Atlanta, United States', 'Tokyo, Japan').",
        },
      },
      required: [
        "first_name",
        "last_name",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "contact",
      "create",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Apollo contact.",
    ],
  }),
  composioTool({
    name: "apollo_create_custom_field",
    description: "Creates a new custom field in Apollo.io for contacts, accounts, or opportunities. Use when you need to define additional data fields beyond Apollo's standard attributes.",
    toolSlug: "APOLLO_CREATE_CUSTOM_FIELD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        meta: {
          type: "object",
          additionalProperties: true,
          properties: {
            max_length: {
              type: "integer",
              description: "Maximum character length for text-based field types (string, textarea).",
            },
          },
          description: "Optional metadata for the custom field.",
        },
        type: {
          type: "string",
          description: "Type of the custom field that determines what kind of data it can store.",
          enum: [
            "string",
            "textarea",
            "number",
            "date",
            "datetime",
            "boolean",
          ],
        },
        label: {
          type: "string",
          description: "Name/label for the custom field you want to create in Apollo.",
        },
        modality: {
          type: "string",
          description: "Enum for custom field modality (which object type the field applies to).",
          enum: [
            "contact",
            "account",
            "opportunity",
          ],
        },
      },
      required: [
        "label",
        "type",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "fields",
    ],
    askBefore: [
      "Confirm the parameters before executing Create custom field.",
    ],
  }),
  composioTool({
    name: "apollo_create_deal",
    description: "Creates a new sales opportunity (deal) in Apollo.io; all provided IDs (`owner_id`, `account_id`, `opportunity_stage_id`) must be valid existing Apollo identifiers. This action has persistent side effects — obtain explicit user confirmation before invoking.",
    toolSlug: "APOLLO_CREATE_DEAL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Human-readable name for the new deal.",
        },
        amount: {
          type: "string",
          description: "Monetary value (string of numbers only, e.g., '50000', no symbols/commas). Currency is based on Apollo account settings.",
        },
        owner_id: {
          type: "string",
          description: "Unique identifier of the Apollo user owning this deal. Retrieve via 'Get a List of Users' endpoint.",
        },
        account_id: {
          type: "string",
          description: "Unique identifier of the Apollo account (company) for this deal. Find via 'Organization Search' endpoint.",
        },
        closed_date: {
          type: "string",
          description: "Anticipated deal closing date (YYYY-MM-DD).",
        },
        opportunity_stage_id: {
          type: "string",
          description: "Unique identifier for the deal's sales pipeline stage (e.g., 'Prospecting'). Retrieve via 'List Deal Stages' endpoint.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "create",
      "deal",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Apollo deal.",
    ],
  }),
  composioTool({
    name: "apollo_create_task",
    description: "Tool to create a single task in Apollo.io. Use when you need to add a new task to your team's Apollo account for a specific contact. The task will be assigned to a user and includes details like type, status, priority, due date, and optional notes.",
    toolSlug: "APOLLO_CREATE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        note: {
          type: "string",
          description: "Add a description for the task. This should be a human-readable message. This parameter is not required, but it is recommended as it provides the task owner with more context on the action they need to take.",
        },
        type: {
          type: "string",
          description: "Set the task to be one of the following task types. This enables the task owner to know the type of action they need to take: 'call' (Call the contact), 'outreach_manual_email' (Email the contact), 'linkedin_step_connect' (Send a LinkedIn invitation), 'linkedin_step_message' (Send a LinkedIn message), 'linkedin_step_view_profile' (View LinkedIn profile), 'linkedin_step_interact_post' (Interact with LinkedIn posts), 'action_item' (Generic action - recommended to use with note parameter).",
          enum: [
            "call",
            "outreach_manual_email",
            "linkedin_step_connect",
            "linkedin_step_message",
            "linkedin_step_view_profile",
            "linkedin_step_interact_post",
            "action_item",
          ],
        },
        title: {
          type: "string",
          description: "A title for the task. If omitted, Apollo will display an auto-generated title based on the task type and contact name.",
        },
        due_at: {
          type: "string",
          description: "The full date and time when the task will be due. Your entry should adhere to the ISO 8601 date-time format. Apollo uses Greenwich Mean Time (GMT) by default. If you do not account for time zone differences, you could add a task due date that falls on a different day than you intended. The value you enter can either adhere to GMT, or you can adjust the time manually by specifying in hours and minutes how much you want to offset GMT.",
        },
        status: {
          type: "string",
          description: "The status of the task being created. For future-facing tasks, use 'scheduled'. For tasks that are already completed, use 'completed' or 'skipped'.",
          enum: [
            "scheduled",
            "completed",
            "skipped",
          ],
        },
        user_id: {
          type: "string",
          description: "The ID for the task owner within your team's Apollo account. This is the user that will take action on the contact. Use the 'Get a List of Users' endpoint to retrieve IDs for all users within your Apollo account.",
        },
        priority: {
          type: "string",
          description: "Valid priority levels for tasks",
          enum: [
            "high",
            "medium",
            "low",
          ],
        },
        contact_id: {
          type: "string",
          description: "The Apollo ID for the contact that you want to be on the receiving end of the action. To find contact IDs, call the 'Search for Contacts' endpoint and identify the 'id' value for the contact.",
        },
      },
      required: [
        "user_id",
        "contact_id",
        "type",
        "status",
        "due_at",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "tasks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Apollo Task.",
    ],
  }),
  composioTool({
    name: "apollo_get_account",
    description: "Tool to retrieve detailed information about a specific account by its Apollo ID. Use when you need to fetch complete account data including company details, contact information, and CRM integration fields.",
    toolSlug: "APOLLO_GET_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Apollo ID for the account that you want to retrieve. To find account IDs, call the Search for Accounts endpoint and identify the id value for the account.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "accounts",
    ],
  }),
  composioTool({
    name: "apollo_get_auth_status",
    description: "Tool to check whether the provided Apollo API key is valid and accepted by Apollo (health/auth check). Use when any Apollo endpoint returns 401/403/422 to quickly diagnose invalid/expired keys versus permission scope issues. If this succeeds but other endpoints return 403, it strongly suggests permissioning or master-key scope issues rather than a totally invalid credential.",
    toolSlug: "APOLLO_GET_AUTH_STATUS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "auth",
    ],
  }),
  composioTool({
    name: "apollo_get_contact",
    description: "Retrieves detailed information about a specific contact by its ID. Use this to view contact details including name, email, phone numbers, organization, and custom fields.",
    toolSlug: "APOLLO_GET_CONTACT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contact_id: {
          type: "string",
          description: "The Apollo ID for the contact that you want to view. To find contact IDs, call the Search for Contacts action and identify the 'id' value for the contact.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "apollo_get_deal",
    description: "Retrieves information about a specific deal by its ID. Use this when you need to view details of a single deal.",
    toolSlug: "APOLLO_GET_DEAL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        opportunity_id: {
          type: "string",
          description: "The ID for the deal you want to view. Each deal in the Apollo database is assigned a unique ID. To find deal IDs, call the List All Deals endpoint and identify the value for 'id' for the desired deal.",
        },
      },
      required: [
        "opportunity_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "deals",
    ],
  }),
  composioTool({
    name: "apollo_get_labels",
    description: "Retrieves all labels from Apollo.io, used for organizing contacts and accounts. Call this before APOLLO_CREATE_CONTACT or APOLLO_UPDATE_ACCOUNT to validate label values against the returned list; mismatched labels cause 400/422 errors.",
    toolSlug: "APOLLO_GET_LABELS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "labels",
    ],
  }),
  composioTool({
    name: "apollo_get_opportunity_stages",
    description: "Retrieves all configured opportunity (deal) stages from the Apollo.io account.",
    toolSlug: "APOLLO_GET_OPPORTUNITY_STAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
    ],
  }),
  composioTool({
    name: "apollo_get_organization",
    description: "Retrieves complete information about a specific organization by its Apollo ID. Use when you need detailed company data including funding, technologies, employee counts, and more.",
    toolSlug: "APOLLO_GET_ORGANIZATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Apollo ID for the organization that you want to research. To find organization IDs, call the Organization Search endpoint and identify the organization_id value for the organization.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "organization",
    ],
  }),
  composioTool({
    name: "apollo_get_organization_job_postings",
    description: "Retrieves paginated job postings for a specified organization by its ID, optionally filtering by domain; ensure `organization_id` is a valid identifier.",
    toolSlug: "APOLLO_GET_ORGANIZATION_JOB_POSTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination.",
        },
        per_page: {
          type: "integer",
          description: "Number of job postings per page (max 100) for pagination.",
        },
        organization_id: {
          type: "string",
          description: "The unique identifier for the organization whose job postings are being requested.",
        },
        q_organization_domains: {
          type: "string",
          description: "Filter job postings by the organization's domain (e.g., 'apollo.io').",
        },
      },
      required: [
        "organization_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
    ],
  }),
  composioTool({
    name: "apollo_get_typed_custom_fields",
    description: "Retrieves all typed custom field definitions available in the Apollo.io instance, detailing their types and configurations. Call before constructing payloads for APOLLO_UPDATE_CONTACT or APOLLO_UPDATE_ACCOUNT — mismatched types or invalid enum options cause 400 errors.",
    toolSlug: "APOLLO_GET_TYPED_CUSTOM_FIELDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
    ],
  }),
  composioTool({
    name: "apollo_list_account_stages",
    description: "Retrieves the IDs for all available account stages in your team's Apollo account.",
    toolSlug: "APOLLO_LIST_ACCOUNT_STAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "account",
      "stages",
    ],
  }),
  composioTool({
    name: "apollo_list_contact_stages",
    description: "Retrieves all available contact stages from an Apollo account, including their unique IDs and names.",
    toolSlug: "APOLLO_LIST_CONTACT_STAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "contact",
      "stages",
    ],
  }),
  composioTool({
    name: "apollo_list_deals",
    description: "Retrieves a list of deals from Apollo, using Apollo's default sort order if 'sort_by_field' is omitted.",
    toolSlug: "APOLLO_LIST_DEALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        per_page: {
          type: "integer",
          description: "Number of deals to retrieve per page.",
        },
        sort_by_field: {
          type: "string",
          description: "Field to sort deals by. If not provided, a default sort order is applied by the Apollo API.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "deals",
    ],
  }),
  composioTool({
    name: "apollo_list_email_accounts",
    description: "Retrieves all email accounts and their details for the authenticated user; takes no parameters.",
    toolSlug: "APOLLO_LIST_EMAIL_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
    ],
  }),
  composioTool({
    name: "apollo_list_fields",
    description: "Retrieves all field definitions from Apollo.io, including system fields and custom fields. Use the optional 'source' parameter to filter by field type (system, custom, or crm_synced).",
    toolSlug: "APOLLO_LIST_FIELDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        source: {
          type: "string",
          description: "Source type of the field.",
          enum: [
            "system",
            "custom",
            "crm_synced",
          ],
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "fields",
    ],
  }),
  composioTool({
    name: "apollo_list_users",
    description: "Retrieves a list of all users (teammates) associated with the Apollo account, supporting pagination via `page` and `per_page` parameters. Use this to obtain numeric user IDs required by operations like APOLLO_UPDATE_CONTACT_OWNERSHIP — names or email addresses are not accepted in place of these IDs.",
    toolSlug: "APOLLO_LIST_USERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (e.g., 1, 2, 3...). Defaults to the first page if omitted.",
        },
        per_page: {
          type: "integer",
          description: "Number of users to retrieve per page (e.g., 10, 25, 50...). Defaults to a predefined page size if omitted.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "users",
    ],
  }),
  composioTool({
    name: "apollo_organization_enrichment",
    description: "Fetches comprehensive organization enrichment data from Apollo.io for a given company domain; results are most meaningful if the company exists in Apollo's database. Each call consumes Apollo credits and may be unavailable on free plans. Returns HTTP 429 under burst usage; use exponential backoff on retries.",
    toolSlug: "APOLLO_ORGANIZATION_ENRICHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        domain: {
          type: "string",
          description: "The domain of the company to enrich, (e.g., 'apollo.io', 'microsoft.com'). Do not include 'www.' or '@' symbols.",
        },
      },
      required: [
        "domain",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "enrichment",
      "organization",
    ],
  }),
  composioTool({
    name: "apollo_organization_search",
    description: "Searches Apollo's database for organizations using various filters; consumes credits on every call (unavailable on free plans) — avoid re-running identical queries and surface quota errors rather than retrying. Retrieves a maximum of 50,000 records; uses `page` (1-500) and `per_page` (1-100) for pagination — check `total_pages` in the response to iterate. Overly strict filter combinations can return zero results; start broad and narrow iteratively. Empty results and `org_not_found` are valid outcomes, not errors.",
    toolSlug: "APOLLO_ORGANIZATION_SEARCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results, used with `per_page`. Use `total_pages` from the response to iterate; a single call returns at most 100 records.",
        },
        per_page: {
          type: "integer",
          description: "Number of organization records per page, used with `page`.",
        },
        organization_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Apollo's unique organization IDs to fetch specific companies.",
        },
        q_organization_name: {
          type: "string",
          description: "Organization name; supports partial matching (e.g., 'Apollo' matches 'Apollo Inc.').",
        },
        organization_locations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Company HQs (city, state, country) to include; filters on primary HQ only.",
        },
        organization_not_locations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Company HQs (city, state, country) to exclude; useful for territory management.",
        },
        q_organization_domains_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Company domains to filter by (e.g., 'apollo.io', 'google.com'); exclude 'www.' or '@' prefixes. Normalize domain casing to improve match quality.",
        },
        q_organization_keyword_tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Keywords for company industries/specializations (e.g., 'software', 'healthcare').",
        },
        organization_num_employees_ranges: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Employee count ranges. Each string must be in 'min,max' format (e.g., '1,10').",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "organization",
      "search",
    ],
  }),
  composioTool({
    name: "apollo_people_enrichment",
    description: "Enriches and retrieves information for a person from Apollo.io. Requires one of: `id`, `email`, `hashed_email`, `linkedin_url`, or (`first_name` and `last_name` with `organization_name` or `domain`) for matching. `webhook_url` must be provided if `reveal_phone_number` is true. Name-only inputs without `organization_name` or `domain` frequently return no matches.",
    toolSlug: "APOLLO_PEOPLE_ENRICHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Apollo ID for the person. Each person in the Apollo database is assigned a unique ID. To find IDs, call the People API Search endpoint and identify the values for person_id.",
        },
        name: {
          type: "string",
          description: "Full name of the person; used for matching instead of or with `first_name` and `last_name`.",
        },
        email: {
          type: "string",
          description: "The email address of the person.",
        },
        domain: {
          type: "string",
          description: "Domain name of the person's organization (e.g., 'apollo.io'). Must be a bare hostname without protocol (http/https) or markup. Exclude 'www.' prefix.",
        },
        last_name: {
          type: "string",
          description: "The last name of the person.",
        },
        first_name: {
          type: "string",
          description: "The first name of the person.",
        },
        webhook_url: {
          type: "string",
          description: "Publicly accessible URL for Apollo to POST phone number data if `reveal_phone_number` is true. Phone data is delivered asynchronously via POST to this URL and is NOT returned inline in the API response.",
        },
        hashed_email: {
          type: "string",
          description: "MD5 or SHA-256 hashed email; used for matching if plain email is unavailable.",
        },
        linkedin_url: {
          type: "string",
          description: "Full URL of the person's LinkedIn profile.",
        },
        organization_name: {
          type: "string",
          description: "Name of the person's organization; used with name fields for matching.",
        },
        reveal_phone_number: {
          type: "boolean",
          description: "If true, attempts to enrich with phone numbers; may incur additional API credits and requires `webhook_url`.",
        },
        reveal_personal_emails: {
          type: "boolean",
          description: "If true, attempts to enrich with personal emails; may incur additional API credits.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "enrichment",
      "people",
    ],
  }),
  composioTool({
    name: "apollo_people_search",
    description: "Searches Apollo's contact database for people using various filters; results capped at 50,000 records and does not enrich contact data. Combining multiple strict filters (organization_ids, person_titles, person_seniorities) can return zero results — start broad and narrow iteratively. Result records may have null email, phone, or organization fields.",
    toolSlug: "APOLLO_PEOPLE_SEARCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number (1-based) for pagination. Max 500 if `per_page` is 100. Iterate until `pagination.total_pages` is reached to avoid missing contacts.",
        },
        per_page: {
          type: "integer",
          description: "Records per page. Max 100.",
        },
        q_keywords: {
          type: "string",
          description: "Search keywords for profile fields (names, skills, job descriptions, technologies). Use organizational filters (q_organization_domains, person_titles) as primary search criteria, then optionally add a first name here for refinement. Avoid full names (last names are often obfuscated in results). Do not combine names with skill keywords as this creates an AND search that may return no results.",
        },
        person_titles: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Job titles (e.g., 'software engineer'); matches if any title found, may include similar. Can be a list of titles or a comma-separated string. Each list entry must be a plain string — do not embed boolean operators (e.g., 'title1 OR title2') in a single string, as this returns zero results.",
        },
        organization_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Apollo-specific company IDs to find people within these organizations; obtain from Organization Search. Can be a list or comma-separated string.",
        },
        person_locations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Current geographic locations of people (e.g., 'London', 'California', 'Germany'). Can be a list or comma-separated string.",
        },
        person_seniorities: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Job seniority levels for current positions (e.g., 'Director', 'VP', 'Senior'). Can be a list or comma-separated string.",
        },
        contact_email_status: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Email statuses to filter contacts. Allowed: 'verified', 'unverified', 'likely to engage', 'unavailable'. Can be a list or comma-separated string.",
        },
        organization_locations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Company HQs (e.g., 'Texas', 'Tokyo', 'Spain'); uses primary HQ location. Can be a list or comma-separated string.",
        },
        q_organization_domains: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Company domains (e.g., 'apollo.io', 'microsoft.com'); exclude 'www.' or '@' prefixes. Can be a list or comma-separated string.",
        },
        organization_num_employees_ranges: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Org employee count ranges for organizations (e.g., '1,10', '10000,20000'); format as 'min,max' string. Can be a list or semicolon-separated string (e.g., '1,10;250,500').",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "people",
      "search",
    ],
  }),
  composioTool({
    name: "apollo_search_accounts",
    description: "Searches for accounts within your existing Apollo.io database using various criteria; requires a paid plan and is limited to 50,000 records.",
    toolSlug: "APOLLO_SEARCH_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "The page number for pagination, starting from 1. This is used with the 'per_page' parameter to navigate through results.",
        },
        per_page: {
          type: "integer",
          description: "The number of results to return per page. This is used for pagination in conjunction with the 'page' parameter. Maximum value is 100.",
        },
        sort_by_field: {
          type: "string",
          description: "The field by which to sort the accounts. Valid options are: 'account_last_activity_date', 'account_created_at', 'account_updated_at'.",
        },
        sort_ascending: {
          type: "boolean",
          description: "Determines the sort order. Set to true for ascending order. This parameter must be used in conjunction with 'sort_by_field'.",
        },
        account_stage_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of Apollo IDs for account stages to filter the results by. These IDs can be retrieved using the 'List Account Stages' endpoint.",
        },
        q_organization_name: {
          type: "string",
          description: "Keywords to search for in account names. This field supports partial name matching.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "account",
      "search",
    ],
  }),
  composioTool({
    name: "apollo_search_calls",
    description: "Searches for call records in Apollo.io using filters like date range, duration, direction (inbound/outgoing), users, contacts, purposes, outcomes, and keywords. Supports pagination for efficient data retrieval.",
    toolSlug: "APOLLO_SEARCH_CALLS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination. Use with per_page to make search results navigable and improve performance.",
        },
        inbound: {
          type: "string",
          description: "Filter calls by direction: 'incoming' (prospect called your team) or 'outgoing' (your team called the prospect).",
        },
        per_page: {
          type: "integer",
          description: "Number of search results per page. Limiting results per page improves performance. Use page parameter to navigate pages.",
        },
        user_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Find calls that included specific users in your team's Apollo account. Use the Get a List of Users endpoint to retrieve user IDs.",
        },
        q_keywords: {
          type: "string",
          description: "Keywords to narrow the search of calls in your team's Apollo account.",
        },
        duration_max: {
          type: "integer",
          description: "Upper bound for call duration in seconds. Use with duration_min. This number should be larger than duration_min.",
        },
        duration_min: {
          type: "integer",
          description: "Lower bound for call duration in seconds. Use with duration_max. This number should be smaller than duration_max.",
        },
        date_range_max: {
          type: "string",
          description: "Upper bound of date range to search (format: YYYY-MM-DD). Use with date_range_min. This date should fall after date_range_min.",
        },
        date_range_min: {
          type: "string",
          description: "Lower bound of date range to search (format: YYYY-MM-DD). Use with date_range_max. This date should fall before date_range_max.",
        },
        contact_label_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Find calls that included specific contacts. Contacts are people explicitly added to your database.",
        },
        phone_call_outcome_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter calls based on their outcome. Call outcomes are unique to your team's Apollo account. Find the outcome ID in the URL when using the Disposition filter in Apollo product.",
        },
        phone_call_purpose_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter calls based on their purpose. Call purposes are unique to your team's Apollo account. Find the purpose ID in the URL when using the Purpose filter in Apollo product.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "apollo_search_contacts",
    description: "Searches Apollo contacts using keywords, stage IDs (from 'List Contact Stages' action), or sorting (max 50,000 records; `sort_ascending` requires `sort_by_field`). Search before creating contacts to avoid duplicates.",
    toolSlug: "APOLLO_SEARCH_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number of results (1-indexed, max 500); use with 'per_page' for pagination. Check `pagination.total_pages` in the response to determine when to stop iterating.",
        },
        per_page: {
          type: "integer",
          description: "Contact records to return per page (max 100); for pagination.",
        },
        q_keywords: {
          type: "string",
          description: "Keywords for matching contact names, titles, employers, or emails.",
        },
        sort_by_field: {
          type: "string",
          description: "Field to sort results. Valid options: 'contact_last_activity_date', 'contact_email_last_opened_at', 'contact_email_last_clicked_at', 'contact_created_at', 'contact_updated_at'.",
        },
        sort_ascending: {
          type: "boolean",
          description: "Sorts results in ascending order; requires 'sort_by_field'.",
        },
        contact_stage_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Apollo contact stage IDs to filter contacts; obtain IDs using the 'List Contact Stages' action.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "contact",
      "search",
    ],
  }),
  composioTool({
    name: "apollo_search_news_articles",
    description: "Tool to search for news articles about companies in Apollo's database. Use when you need to find recent news, announcements, or updates about specific organizations using their Apollo IDs.",
    toolSlug: "APOLLO_SEARCH_NEWS_ARTICLES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "The page number of the Apollo data that you want to retrieve. Use this parameter in combination with the per_page parameter to make search results for navigable and improve the performance of the endpoint. Example: 4",
        },
        per_page: {
          type: "integer",
          description: "The number of search results that should be returned for each page. Limiting the number of results per page improves the endpoint's performance. Use the page parameter to search the different pages of data. Example: 10",
        },
        categories: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter your search to include only certain categories or sub-categories of news. Use the News search filter for companies within Apollo to uncover all possible categories and sub-categories. Examples: hires, investment, contract",
        },
        organization_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The Apollo IDs for the companies you want to include in your search results. Each company in the Apollo database is assigned a unique ID. To find IDs, call the Organization Search endpoint and identify the values for organization_id. Example: 5e66b6381e05b4008c8331b8",
        },
        published_at_max: {
          type: "string",
          description: "Set the upper bound of the date range you want to search. Use this parameter in combination with the published_at_min parameter. This date should fall after the published_at_min date. The date should be formatted as YYYY-MM-DD. Example: 2025-05-15",
        },
        published_at_min: {
          type: "string",
          description: "Set the lower bound of the date range you want to search. Use this parameter in combination with the published_at_max parameter. This date should fall before the published_at_max date. The date should be formatted as YYYY-MM-DD. Example: 2025-02-15",
        },
      },
      required: [
        "organization_ids",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "apollo_search_outreach_emails",
    description: "Tool to search for outreach emails sent through Apollo sequences. Use when you need to find emails created and sent by your team as part of Apollo email campaigns. This endpoint requires a master API key and has a display limit of 50,000 records (100 records per page, up to 500 pages).",
    toolSlug: "APOLLO_SEARCH_OUTREACH_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (1-based). Maximum page number is 500.",
        },
        per_page: {
          type: "integer",
          description: "Number of email records per page. Maximum value is 100.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "apollo_search_sequences",
    description: "Searches for sequences (e.g., automated email campaigns) in Apollo.io.",
    toolSlug: "APOLLO_SEARCH_SEQUENCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        q_name: {
          type: "string",
          description: "Name or part of the name of the sequence to search for. If omitted, results are not filtered by name.",
        },
        per_page: {
          type: "integer",
          description: "Number of sequences per page. Maximum value is 100.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
    ],
  }),
  composioTool({
    name: "apollo_search_tasks",
    description: "Searches for tasks in Apollo.io using filters like keywords, date ranges (due, created, updated), priorities, types, assigned users, associated contacts/accounts, supporting sorting and pagination.",
    toolSlug: "APOLLO_SEARCH_TASKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (starts from 1).",
        },
        per_page: {
          type: "integer",
          description: "Number of tasks per page (1-100).",
        },
        q_keywords: {
          type: "string",
          description: "Keywords for searching task notes or subjects (matches partial words).",
        },
        task_types: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of task types to filter by (e.g., 'call', 'email').",
        },
        account_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of account IDs to filter tasks by association.",
        },
        contact_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of contact IDs to filter tasks by association.",
        },
        sort_by_field: {
          type: "string",
          description: "Field for sorting tasks. Note: This parameter may not be supported by the API and could result in 'Invalid sort criteria' error.",
        },
        task_user_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of user IDs to filter tasks by assignment.",
        },
        due_date_range: {
          type: "object",
          additionalProperties: true,
          properties: {
            gte: {
              type: "string",
              description: "Start date of the range (inclusive).",
            },
            lte: {
              type: "string",
              description: "End date of the range (inclusive).",
            },
          },
          description: "Filter tasks by due date range.",
        },
        sort_ascending: {
          type: "boolean",
          description: "Sort order: `true` for ascending, `false` for descending.",
        },
        task_priorities: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of lowercase task priorities to filter by. Valid values are 'high', 'medium', 'low'.",
        },
        task_created_at_range: {
          type: "object",
          additionalProperties: true,
          properties: {
            gte: {
              type: "string",
              description: "Start date of the range (inclusive).",
            },
            lte: {
              type: "string",
              description: "End date of the range (inclusive).",
            },
          },
          description: "Filter tasks by creation date range.",
        },
        task_updated_at_range: {
          type: "object",
          additionalProperties: true,
          properties: {
            gte: {
              type: "string",
              description: "Start date of the range (inclusive).",
            },
            lte: {
              type: "string",
              description: "End date of the range (inclusive).",
            },
          },
          description: "Filter tasks by last update date range.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "tasks",
    ],
  }),
  composioTool({
    name: "apollo_update_account",
    description: "Updates specified attributes of an existing account in Apollo.io.",
    toolSlug: "APOLLO_UPDATE_ACCOUNT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the account. This should be a human-readable name representing the organization.",
        },
        phone: {
          type: "string",
          description: "The new primary phone number for the account. Apollo will attempt to sanitize and standardize the provided phone number format.",
        },
        domain: {
          type: "string",
          description: "The new primary domain for the account. Ensure the 'www.' prefix is excluded (e.g., 'apollo.io' instead of 'www.apollo.io').",
        },
        owner_id: {
          type: "string",
          description: "The unique identifier (ID) of the Apollo user to be assigned as the new owner of this account. This ID can be retrieved using the 'Get a List of Users' endpoint.",
        },
        account_id: {
          type: "string",
          description: "The unique Apollo identifier (ID) for the account to be updated. This ID can be retrieved using the 'Search for Accounts' endpoint.",
        },
        raw_address: {
          type: "string",
          description: "The new corporate street address for the account. This can be a free-form string including details like street, city, state, and country.",
        },
        account_stage_id: {
          type: "string",
          description: "The unique Apollo identifier (ID) for the new account stage (e.g., 'Prospecting', 'Negotiation'). This ID can be retrieved using the 'List Account Stages' endpoint.",
        },
      },
      required: [
        "account_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "account",
      "update",
    ],
    askBefore: [
      "Confirm the parameters before executing Update an Apollo account.",
    ],
  }),
  composioTool({
    name: "apollo_update_account_owners",
    description: "Updates the ownership of multiple Apollo accounts to a specified user. Use when bulk assigning account ownership to a team member.",
    toolSlug: "APOLLO_UPDATE_ACCOUNT_OWNERS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        owner_id: {
          type: "string",
          description: "The Apollo user ID to assign as the new owner for all specified accounts. This user must be part of your team's Apollo account. Use the Get a List of Users endpoint to retrieve user IDs.",
        },
        account_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of Apollo account IDs to update. Each ID uniquely identifies an account in your team's Apollo instance. To find account IDs, use the Search for Accounts endpoint.",
        },
      },
      required: [
        "account_ids",
        "owner_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "accounts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update account ownership.",
    ],
  }),
  composioTool({
    name: "apollo_update_call_record",
    description: "Tool to update an existing call record in Apollo.io. Use when you need to modify details of a previously logged phone call such as duration, status, notes, or associated contact/account information.",
    toolSlug: "APOLLO_UPDATE_CALL_RECORD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Apollo ID for the call record to be updated. To find call record IDs, use the 'Search for Calls' action and identify the 'id' value for the call record.",
        },
        note: {
          type: "string",
          description: "Add a note to the call record.",
        },
        logged: {
          type: "boolean",
          description: "Set to true if you want to create an individual record for the phone call in Apollo.",
        },
        status: {
          type: "string",
          description: "Enumeration of possible call status values.",
          enum: [
            "queued",
            "ringing",
            "in-progress",
            "completed",
            "no_answer",
            "failed",
            "busy",
          ],
        },
        user_id: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Designate the caller(s) in your team's Apollo account. Use the 'Get a List of Users' action to retrieve IDs for all users within your Apollo account.",
        },
        duration: {
          type: "integer",
          description: "The duration of the call in seconds (not minutes).",
        },
        end_time: {
          type: "string",
          description: "The time when the call ended. Should adhere to ISO 8601 date-time format. Apollo uses GMT by default. You can adjust for timezone by specifying offset in hours and minutes.",
        },
        to_number: {
          type: "string",
          description: "The phone number that you dialed.",
        },
        account_id: {
          type: "string",
          description: "Associate the call with an account. Use the 'Search for Accounts' action to retrieve IDs for accounts within your Apollo account.",
        },
        contact_id: {
          type: "string",
          description: "Designate the contact that was called. Use the 'Search for Contacts' action to retrieve IDs for contacts within your Apollo account.",
        },
        start_time: {
          type: "string",
          description: "The time when the call started. Should adhere to ISO 8601 date-time format. Apollo uses GMT by default. You can adjust for timezone by specifying offset in hours and minutes.",
        },
        from_number: {
          type: "string",
          description: "The phone number that dialed you.",
        },
        phone_call_outcome_id: {
          type: "string",
          description: "Assign a call outcome to the record. Call outcomes are unique to your team's Apollo account. When you use the Disposition search filter for calls in Apollo, you can find the corresponding call outcome ID in the URL.",
        },
        phone_call_purpose_id: {
          type: "string",
          description: "Assign a call purpose to the record. Call purposes are unique to your team's Apollo account. When you use the Purpose search filter for calls in Apollo, you can find the corresponding call purpose ID in the URL.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "calls",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Apollo call record.",
    ],
  }),
  composioTool({
    name: "apollo_update_contact",
    description: "Tool to update an existing contact's information in Apollo. Use when you need to modify contact details such as name, email, phone, title, organization, or custom fields. At least one field beyond contact_id must be provided.",
    toolSlug: "APOLLO_UPDATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Update the contact email address.",
        },
        title: {
          type: "string",
          description: "Update the job title.",
        },
        last_name: {
          type: "string",
          description: "Update the contact's last name.",
        },
        account_id: {
          type: "string",
          description: "Update the account ID. This associates the contact with a different account.",
        },
        contact_id: {
          type: "string",
          description: "The Apollo ID for the contact that you want to update. To find contact IDs, call the 'Search for Contacts' action and identify the `id` value for the contact.",
        },
        first_name: {
          type: "string",
          description: "Update the contact's first name.",
        },
        home_phone: {
          type: "string",
          description: "Home phone number for the contact.",
        },
        label_names: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Replace lists this contact belongs to. Passing new values will overwrite existing lists.",
        },
        other_phone: {
          type: "string",
          description: "Alternate phone number for the contact.",
        },
        website_url: {
          type: "string",
          description: "Update the employer website URL.",
        },
        direct_phone: {
          type: "string",
          description: "Primary direct phone number for the contact.",
        },
        mobile_phone: {
          type: "string",
          description: "Mobile phone number for the contact.",
        },
        corporate_phone: {
          type: "string",
          description: "Work/office phone number for the contact.",
        },
        contact_stage_id: {
          type: "string",
          description: "Update the contact stage ID. Use the 'List Contact Stages' action to get valid stage IDs.",
        },
        organization_name: {
          type: "string",
          description: "Update the employer (company) name.",
        },
        present_raw_address: {
          type: "string",
          description: "Update location (city/state/country) as a single string.",
        },
        typed_custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Add information to custom fields in Apollo. Your custom fields are unique to your team's Apollo account. To utilize this parameter successfully, call the 'Get a List of All Custom Fields' action and identify the `id` value for the custom field, as well as the appropriate data type. For string fields, pass a string value. For picklist fields (single-select), pass a string with the picklist option ID. For multi-select picklist fields, pass a list of picklist option IDs.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "contact",
      "update",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Apollo contact details.",
    ],
  }),
  composioTool({
    name: "apollo_update_contact_ownership",
    description: "Updates the ownership of specified Apollo contacts to a given Apollo user, who must be part of the same team.",
    toolSlug: "APOLLO_UPDATE_CONTACT_OWNERSHIP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        owner_id: {
          type: "string",
          description: "Unique Apollo identifier for the user, part of your team's Apollo account, to become the new owner. Must be retrieved from APOLLO_LIST_USERS; names and emails are not accepted. An invalid or mismatched ID may cause a silent no-op with no explicit error returned.",
        },
        contact_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Unique Apollo identifiers for existing contacts to update.",
        },
      },
      required: [
        "contact_ids",
        "owner_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contact ownership.",
    ],
  }),
  composioTool({
    name: "apollo_update_contact_stage",
    description: "Updates the stage for one or more existing contacts in Apollo.io to a new valid contact stage, useful for managing sales funnel progression.",
    toolSlug: "APOLLO_UPDATE_CONTACT_STAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contact_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Unique identifiers for the contacts whose stage needs to be updated.",
        },
        contact_stage_id: {
          type: "string",
          description: "Unique identifier of the contact stage to assign to the contacts.",
        },
      },
      required: [
        "contact_ids",
        "contact_stage_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contact stage.",
    ],
  }),
  composioTool({
    name: "apollo_update_contact_status_in_sequence",
    description: "Updates a contact's status within a designated Apollo sequence, but cannot set the status to 'active'.",
    toolSlug: "APOLLO_UPDATE_CONTACT_STATUS_IN_SEQUENCE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        status: {
          type: "string",
          description: "New status for the contact in the sequence. Note: 'active' status is not supported by this action.",
          enum: [
            "active",
            "paused",
            "finished_replied",
            "finished_not_replied",
            "bounced",
            "unsubscribed",
          ],
        },
        contact_id: {
          type: "string",
          description: "Unique identifier of the contact.",
        },
        sequence_id: {
          type: "string",
          description: "Unique identifier of the sequence.",
        },
      },
      required: [
        "contact_id",
        "sequence_id",
        "status",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "contacts",
      "sequences",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Update contact status in sequence.",
    ],
  }),
  composioTool({
    name: "apollo_update_contacts_bulk",
    description: "Tool to bulk update multiple Apollo contacts with a single API call. Use when updating multiple contacts simultaneously - either apply the same updates to all contacts using contact_ids, or apply different updates to each contact using contact_attributes. Automatically processes asynchronously for more than 100 contacts.",
    toolSlug: "APOLLO_UPDATE_CONTACTS_BULK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        async: {
          type: "boolean",
          description: "Force asynchronous processing. Automatically enabled for more than 100 contacts. When true, returns a job object instead of contact data.",
        },
        email: {
          type: "string",
          description: "When using contact_ids, apply this email to all contacts in the list.",
        },
        title: {
          type: "string",
          description: "When using contact_ids, apply this title to all contacts in the list.",
        },
        owner_id: {
          type: "string",
          description: "When using contact_ids, apply this owner ID to all contacts in the list.",
        },
        last_name: {
          type: "string",
          description: "When using contact_ids, apply this last name to all contacts in the list.",
        },
        account_id: {
          type: "string",
          description: "When using contact_ids, apply this account ID to all contacts in the list.",
        },
        first_name: {
          type: "string",
          description: "When using contact_ids, apply this first name to all contacts in the list.",
        },
        contact_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of contact IDs to update with the same values. Use this approach when applying identical updates to multiple contacts. Must provide either contact_ids or contact_attributes.",
        },
        linkedin_url: {
          type: "string",
          description: "When using contact_ids, apply this LinkedIn URL to all contacts in the list.",
        },
        organization_name: {
          type: "string",
          description: "When using contact_ids, apply this organization name to all contacts in the list.",
        },
        contact_attributes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the contact to update. This is required when using contact_attributes.",
              },
              email: {
                type: "string",
                description: "Email address to set for this contact.",
              },
              title: {
                type: "string",
                description: "Job title to set for this contact.",
              },
              owner_id: {
                type: "string",
                description: "Owner ID to assign to this contact.",
              },
              last_name: {
                type: "string",
                description: "Last name to set for this contact.",
              },
              account_id: {
                type: "string",
                description: "Apollo ID of the account to associate with this contact.",
              },
              first_name: {
                type: "string",
                description: "First name to set for this contact.",
              },
              linkedin_url: {
                type: "string",
                description: "LinkedIn profile URL to set for this contact.",
              },
              organization_name: {
                type: "string",
                description: "Organization name to set for this contact.",
              },
              present_raw_address: {
                type: "string",
                description: "Address to set for this contact.",
              },
              typed_custom_fields: {
                type: "object",
                additionalProperties: true,
                description: "Custom fields to set for this contact as key-value pairs.",
              },
            },
            description: "Individual contact update attributes with contact ID.",
          },
          description: "Array of contact objects with individual updates. Use this approach when applying different updates to each contact. Must provide either contact_ids or contact_attributes.",
        },
        visible_entity_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific contact IDs to return in the response for performance optimization. Only these contacts will be included in the response.",
        },
        present_raw_address: {
          type: "string",
          description: "When using contact_ids, apply this address to all contacts in the list.",
        },
        typed_custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "When using contact_ids, apply these custom fields to all contacts in the list as key-value pairs.",
        },
      },
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk update Apollo contacts.",
    ],
  }),
  composioTool({
    name: "apollo_update_deals",
    description: "Updates specified fields of an existing Apollo.io deal (opportunity), requiring a valid `opportunity_id`.",
    toolSlug: "APOLLO_UPDATE_DEALS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new human-readable name for the deal. Preserves current name if omitted.",
        },
        amount: {
          type: "string",
          description: "The new monetary value of the deal (e.g., '50000'). Preserves current amount if omitted.",
        },
        is_won: {
          type: "boolean",
          description: "Indicates if the deal is won. `true` for won, `false` for lost/open. Preserves current status if omitted.",
        },
        source: {
          type: "string",
          description: "The new source from which this deal originated (e.g., 'Website', 'Referral'). Preserves current source if omitted.",
        },
        owner_id: {
          type: "string",
          description: "The unique identifier of the Apollo user to be assigned as the new owner. Obtain this ID via 'List All Users'. Preserves current owner if omitted.",
        },
        is_closed: {
          type: "boolean",
          description: "Indicates if the deal is closed. `true` for closed, `false` for open. Preserves current status if omitted.",
        },
        account_id: {
          type: "string",
          description: "The unique Apollo identifier of the account to be associated. Obtain this ID from account-related actions. Preserves current account if omitted.",
        },
        closed_date: {
          type: "string",
          description: "The new estimated or actual close date (YYYY-MM-DD). Preserves current close date if omitted.",
        },
        opportunity_id: {
          type: "string",
          description: "The unique identifier of the Apollo opportunity (deal) to be updated.",
        },
        opportunity_stage_id: {
          type: "string",
          description: "The unique identifier for the new stage. Obtain this ID via 'List Deal Stages'. Preserves current stage if omitted.",
        },
      },
      required: [
        "opportunity_id",
      ],
    },
    tags: [
      "composio",
      "apollo",
      "write",
      "deals",
      "update",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Apollo deal.",
    ],
  }),
  composioTool({
    name: "apollo_view_api_usage_stats",
    description: "Fetches Apollo API usage statistics and rate limits for the connected team. Use before large enrichment/search runs to understand current API usage and plan/budget constraints. If experiencing 403s on credit/usage sensitive endpoints, use this tool to confirm whether the key has master privileges (this endpoint will 403 without a master key).",
    toolSlug: "APOLLO_VIEW_API_USAGE_STATS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "apollo",
      "read",
      "usage",
    ],
  }),
];
