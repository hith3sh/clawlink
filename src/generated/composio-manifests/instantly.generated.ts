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
    integration: "instantly",
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
      toolkit: "instantly",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const instantlyComposioTools: IntegrationTool[] = [
  composioTool({
    name: "instantly_accounts_ctd_status_get",
    description: "Tool to check Custom Tracking Domain (CTD) status for email accounts. Use to verify SSL configuration and CNAME records for a specified domain/host.",
    toolSlug: "INSTANTLY_ACCOUNTS_CTD_STATUS_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        host: {
          type: "string",
          description: "The domain/host to check CTD status for. Verifies SSL configuration and CNAME records.",
        },
      },
      required: [
        "host",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_activate_campaign",
    description: "Tool to activate or resume a paused campaign. Use when you need to start sending operations for a specific campaign. Prerequisites: Campaign must have at least one sender account, one lead, email sequences, and schedule configured.",
    toolSlug: "INSTANTLY_ACTIVATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to activate",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Activate Campaign.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_add_leads_bulk",
    description: "Tool to add multiple leads in bulk to a campaign or list. Use when you need to import several leads at once to an Instantly campaign or list. Supports duplicate handling options and lead verification.",
    toolSlug: "INSTANTLY_ADD_LEADS_BULK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        leads: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              email: {
                type: "string",
                description: "Email address of the lead (required)",
              },
              phone: {
                type: "string",
                description: "Phone number of the lead",
              },
              website: {
                type: "string",
                description: "Website URL of the lead",
              },
              last_name: {
                type: "string",
                description: "Last name of the lead",
              },
              first_name: {
                type: "string",
                description: "First name of the lead",
              },
              company_name: {
                type: "string",
                description: "Company name of the lead",
              },
              company_domain: {
                type: "string",
                description: "Company domain of the lead",
              },
              personalization: {
                type: "string",
                description: "Custom personalization message for the lead",
              },
              custom_variables: {
                type: "object",
                additionalProperties: true,
                description: "Custom metadata for the lead. Values must be string, number, boolean, or null. Objects or arrays are not allowed as values.",
              },
            },
            description: "Individual lead information for bulk add operation.",
          },
          description: "List of leads to add. Each lead must have at least an email address.",
        },
        verify: {
          type: "boolean",
          description: "Verify leads on import",
        },
        list_id: {
          type: "string",
          description: "UUID of the list to add leads to. Either campaign_id or list_id is required.",
        },
        campaign_id: {
          type: "string",
          description: "UUID of the campaign to add leads to. Either campaign_id or list_id is required.",
        },
        blocklist_id: {
          type: "string",
          description: "Blocklist ID to check against when adding leads",
        },
        skip_if_in_list: {
          type: "boolean",
          description: "Skip adding the lead if it already exists in the list",
        },
        verify_leadfinder: {
          type: "boolean",
          description: "Verify leads for the lead finder",
        },
        skip_if_in_campaign: {
          type: "boolean",
          description: "Skip adding the lead if it already exists in the campaign",
        },
        skip_if_in_workspace: {
          type: "boolean",
          description: "Skip adding the lead if it already exists in the workspace",
        },
      },
      required: [
        "leads",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Leads in Bulk.",
    ],
  }),
  composioTool({
    name: "instantly_api_keys_get",
    description: "Tool to retrieve paginated list of API keys for organization. Use when you need to list all API keys with their names, scopes, and timestamps.",
    toolSlug: "INSTANTLY_API_KEYS_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of API keys to return per page, between 1 and 100",
        },
        starting_after: {
          type: "string",
          description: "UUID cursor for pagination - pass the next_starting_after value from previous response to get next page",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "platform_administration_resources",
    ],
  }),
  composioTool({
    name: "instantly_bulk_assign_leads",
    description: "Tool to bulk assign leads to organization users. Use when you need to assign multiple leads to specific organization members.",
    toolSlug: "INSTANTLY_BULK_ASSIGN_LEADS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lead_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of lead UUIDs to assign to organization users",
        },
        organization_user_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of organization user UUIDs to assign the leads to",
        },
      },
      required: [
        "lead_ids",
        "organization_user_ids",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk Assign Leads.",
    ],
  }),
  composioTool({
    name: "instantly_campaigns_analytics_overview_get",
    description: "Tool to get analytics overview for one or multiple campaigns. Use when you need comprehensive performance metrics including leads, emails, replies, opens, clicks, and CRM events.",
    toolSlug: "INSTANTLY_CAMPAIGNS_ANALYTICS_OVERVIEW_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Campaign UUID to retrieve analytics for a single campaign. Leave empty for all campaigns.",
        },
        ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of campaign UUIDs to retrieve analytics for multiple campaigns.",
        },
        end_date: {
          type: "string",
          description: "End date for analytics range in YYYY-MM-DD format.",
        },
        start_date: {
          type: "string",
          description: "Start date for analytics range in YYYY-MM-DD format.",
        },
        campaign_status: {
          type: "integer",
          description: "Filter by campaign status (e.g., 1 = active).",
        },
        expand_crm_events: {
          type: "boolean",
          description: "When true, calculates total of all lead interest status events instead of only first occurrence. Affects: total_opportunities, total_interested, total_meeting_booked, total_meeting_completed, total_closed. Default: false.",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "instantly_campaigns_from_export_post",
    description: "Tool to import a campaign from exported data. Use when you need to recreate a campaign from previously exported configuration.",
    toolSlug: "INSTANTLY_CAMPAIGNS_FROM_EXPORT_POST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID identifier from the exported campaign data",
        },
        name: {
          type: "string",
          description: "Name of the campaign being imported",
        },
        status: {
          type: "integer",
          description: "Status code of the campaign; e.g., 0=Draft, 1=Active, 2=Paused, 3=Completed, 4=Running Subsequences, -99=Account Suspended, -1=Accounts Unhealthy, -2=Bounce Protect",
        },
        campaign_id: {
          type: "string",
          description: "UUID of the campaign to import the exported data into",
        },
        organization: {
          type: "string",
          description: "UUID of the organization that owns the campaign",
        },
        campaign_schedule: {
          type: "object",
          additionalProperties: true,
          description: "Campaign schedule configuration including schedules, start_date, and end_date",
        },
        timestamp_created: {
          type: "string",
          description: "ISO 8601 timestamp when the campaign was originally created",
        },
        timestamp_updated: {
          type: "string",
          description: "ISO 8601 timestamp when the campaign was last updated",
        },
      },
      required: [
        "campaign_id",
        "id",
        "name",
        "status",
        "campaign_schedule",
        "timestamp_created",
        "timestamp_updated",
        "organization",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Import Campaign from Export.",
    ],
  }),
  composioTool({
    name: "instantly_check_dfy_email_account_order_domains",
    description: "Tool to check domain availability for DFY email account orders. Use when you need to validate domains before creating DFY email account orders.",
    toolSlug: "INSTANTLY_CHECK_DFY_EMAIL_ACCOUNT_ORDER_DOMAINS",
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
          description: "List of domain names to check for DFY email account order availability or validation. At least one domain is required.",
        },
      },
      required: [
        "domains",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_check_email_verification_status",
    description: "Tool to check status of an email verification job. Use after submitting a verification request to retrieve the current status of a specific email address.",
    toolSlug: "INSTANTLY_CHECK_EMAIL_VERIFICATION_STATUS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Email address to check verification status",
        },
      },
      required: [
        "email",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_verification",
    ],
  }),
  composioTool({
    name: "instantly_count_launched_campaigns",
    description: "Tool to retrieve the count of launched campaigns. Use when you need to know the total number of campaigns that have been launched in the workspace.",
    toolSlug: "INSTANTLY_COUNT_LAUNCHED_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "instantly_count_leads_from_supersearch",
    description: "Tool to count leads matching supersearch filter criteria. Use when you need to preview how many leads match your search criteria before creating an enrichment job.",
    toolSlug: "INSTANTLY_COUNT_LEADS_FROM_SUPERSEARCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum number of leads to count",
        },
        search_filters: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "Filter by person name",
            },
            news: {
              type: "boolean",
              description: "Include companies with recent headlines or media mentions",
            },
            domains: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Specific domain lists from CSV or Google Sheet URLs",
            },
            revenue: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Company revenue range filter. WARNING: The Instantly API enforces a strict enum of allowed revenue range values. The exact allowed values and format are not publicly documented. Example formats like '$1M-$10M' may not match the API's expected format. Passing undocumented values will result in a 400 error: 'must be equal to one of the allowed values'. To find valid values, inspect the SuperSearch interface at instantly.ai or contact Instantly support. Do not guess revenue range formats.",
            },
            industry: {
              type: "object",
              additionalProperties: true,
              properties: {
                exclude: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to exclude from the search",
                },
                include: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to include in the search",
                },
              },
              description: "Filter with include and exclude options.",
            },
            keywords: {
              type: "object",
              additionalProperties: true,
              properties: {
                exclude: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Keywords to exclude from the search",
                },
                include: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Keywords to include in the search",
                },
              },
              description: "Keywords to include or exclude in search.",
            },
            location: {
              type: "object",
              additionalProperties: true,
              properties: {
                exclude: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to exclude from the search",
                },
                include: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to include in the search",
                },
              },
              description: "Filter with include and exclude options.",
            },
            job_title: {
              type: "object",
              additionalProperties: true,
              properties: {
                exclude: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to exclude from the search",
                },
                include: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to include in the search",
                },
              },
              description: "Filter with include and exclude options.",
            },
            department: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by department. The API validates this field - only specific department values are accepted. Common accepted values include 'Engineering', 'Sales', 'Marketing', 'Operations', 'Human Resources'. Unsupported values will be rejected by the API.",
            },
            company_name: {
              type: "object",
              additionalProperties: true,
              properties: {
                exclude: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to exclude from the search",
                },
                include: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to include in the search",
                },
              },
              description: "Filter with include and exclude options.",
            },
            funding_type: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Type of funding received by the company. WARNING: The Instantly API enforces a strict enum of allowed funding type values. The exact allowed values are not publicly documented. Common funding stages like 'Seed', 'Series A', 'Series B', etc. may or may not match the API's expected format. Passing undocumented values will result in a 400 error: 'must be equal to one of the allowed values'. To find valid values, inspect the SuperSearch interface at instantly.ai or contact Instantly support.",
            },
            job_listings: {
              type: "boolean",
              description: "Target companies actively hiring",
            },
            technologies: {
              type: "object",
              additionalProperties: true,
              properties: {
                exclude: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to exclude from the search",
                },
                include: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Values to include in the search",
                },
              },
              description: "Filter with include and exclude options.",
            },
            employee_size: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Company headcount range filter as list of range strings (e.g., '1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10001+')",
            },
            lookalike_domain: {
              type: "boolean",
              description: "Enable broad or targeted lookalike search based on domains",
            },
            management_level: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by management level (e.g., C-Level, VP, Director, Manager)",
            },
            one_lead_per_company: {
              type: "boolean",
              description: "When true, limit results to one lead per company",
            },
          },
          description: "Filter criteria object containing professional attributes, company characteristics, and data source filters to count matching leads",
        },
        skip_already_owned: {
          type: "boolean",
          description: "When true, exclude leads previously acquired by your workspace",
        },
      },
      required: [
        "search_filters",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "lead_enrichment_discovery",
    ],
  }),
  composioTool({
    name: "instantly_count_unread_emails",
    description: "Tool to retrieve the count of unread emails. Use when you need to know how many unread messages are in your inbox before sending new emails.",
    toolSlug: "INSTANTLY_COUNT_UNREAD_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "emails",
    ],
  }),
  composioTool({
    name: "instantly_create_ai_enrichment",
    description: "Tool to create an AI enrichment job for a campaign or lead list. Use when you need to enrich a resource with AI-driven insights.",
    toolSlug: "INSTANTLY_CREATE_AI_ENRICHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum number of leads to enrich (1–1,000,000)",
        },
        prompt: {
          type: "string",
          description: "Custom prompt to use (when template_id is not provided)",
        },
        status: {
          type: "integer",
          description: "Filter by job status: 1=pending, 2=processing, 3=completed, 4=failed",
        },
        overwrite: {
          type: "boolean",
          description: "Whether to overwrite existing values in the output column",
        },
        show_state: {
          type: "boolean",
          description: "Return the current state of the enrichment job in the response",
        },
        auto_update: {
          type: "boolean",
          description: "Automatically enrich new leads added after job creation",
        },
        resource_id: {
          type: "string",
          description: "UUID of the resource (campaign or list) to enrich",
        },
        template_id: {
          type: "integer",
          description: "ID of a pre-defined prompt template to use",
        },
        input_columns: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of input column names to feed into the model",
        },
        model_version: {
          type: "string",
          description: "Model version to use. Allowed values: 3.5, 4.0, gpt-4o, gpt-5, gpt-5-mini, gpt-5-nano, o3, gpt-4.1, claude-3.7-sonnet, claude-3.5-sonnet",
        },
        output_column: {
          type: "string",
          description: "Column name to store the AI enrichment result",
        },
        resource_type: {
          type: "integer",
          description: "Type of resource: 1 = List, 2 = Campaign",
        },
        use_instantly_account: {
          type: "boolean",
          description: "Whether to use Instantly's own account for API calls",
        },
        skip_leads_without_email: {
          type: "boolean",
          description: "Skip leads that do not have an email address",
        },
      },
      required: [
        "resource_id",
        "output_column",
        "resource_type",
        "model_version",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "supersearchenrichment",
      "ai",
    ],
    askBefore: [
      "Confirm the parameters before executing Create AI Enrichment.",
    ],
  }),
  composioTool({
    name: "instantly_create_api_key",
    description: "Creates a new API key with specified permissions for the Instantly API. Use this tool to generate credentials for programmatic access. Each API key can be scoped with granular permissions (e.g., 'campaigns:read', 'leads:create') to limit access to specific resources and operations. The generated key value is returned in the response and should be stored securely. Common use cases: - Create integration keys with limited scopes for third-party applications - Generate read-only keys for reporting/analytics tools - Set up automation keys with specific resource access",
    toolSlug: "INSTANTLY_CREATE_API_KEY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Human-readable name to identify this API key. Should be descriptive of its purpose or the application/integration using it. This name will appear in API key listings.",
        },
        scopes: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of permission scopes for the API key. Each scope follows the format 'resource:action' (e.g., 'campaigns:read', 'leads:create'). Use 'all:all' for full access to all resources. Common resources include: campaigns, leads, accounts, webhooks, api_keys, workspaces, subsequences, lead_lists, custom_tags, block_list_entries, emails, and more. Common actions include: create, read, update, delete, all.",
        },
      },
      required: [
        "name",
        "scopes",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "api_keys",
    ],
    askBefore: [
      "Confirm the parameters before executing Create API Key.",
    ],
  }),
  composioTool({
    name: "instantly_create_block_list_entry",
    description: "Tool to create a new block list entry for a specific email or domain. Use when you need to prevent campaigns from sending emails to a specific address or domain.",
    toolSlug: "INSTANTLY_CREATE_BLOCK_LIST_ENTRY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        bl_value: {
          type: "string",
          description: "The email address or domain to block (e.g., 'user@example.com' or 'example.com'). The API automatically determines if it's a domain or email.",
        },
      },
      required: [
        "bl_value",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Block List Entry.",
    ],
  }),
  composioTool({
    name: "instantly_create_campaign",
    description: "Tool to create a new campaign. Use when you have campaign details ready and want to launch.",
    toolSlug: "INSTANTLY_CREATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name of the campaign",
        },
        cc_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "CC list",
        },
        bcc_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "BCC list",
        },
        owned_by: {
          type: "string",
          description: "Owner ID",
        },
        pl_value: {
          type: "number",
          description: "Value of every positive lead",
        },
        email_gap: {
          type: "number",
          description: "Gap between emails in minutes",
        },
        sequences: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              steps: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    type: {
                      type: "string",
                      description: "Type of step (must be 'email')",
                    },
                    delay: {
                      type: "integer",
                      description: "Number of days to wait before sending the NEXT email in the sequence",
                    },
                    variants: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          body: {
                            type: "string",
                            description: "Email body content",
                          },
                          subject: {
                            type: "string",
                            description: "Email subject line",
                          },
                          v_disabled: {
                            type: "boolean",
                            description: "Whether this variant is disabled",
                          },
                        },
                        description: "Email variant with subject and body.",
                      },
                      description: "List of email variants for A/B testing",
                    },
                  },
                  description: "A step in an email sequence.",
                },
                description: "List of steps in the sequence",
              },
            },
            description: "Email sequence containing multiple steps.",
          },
          description: "Email sequences. Only the first element is used by the API. Each sequence contains steps, where each step must have: (1) type='email', (2) delay (days before NEXT email, defaults to 0 if omitted), (3) variants list with subject and body for each variant.",
        },
        text_only: {
          type: "boolean",
          description: "Send as text-only",
        },
        email_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Email addresses of pre-configured sending accounts in your Instantly workspace. These must be accounts already added to your workspace, not arbitrary email addresses. Use the INSTANTLY_LIST_ACCOUNTS action to discover valid email addresses.",
        },
        daily_limit: {
          type: "integer",
          description: "Daily sending limit",
        },
        is_evergreen: {
          type: "boolean",
          description: "Whether the campaign is evergreen",
        },
        link_tracking: {
          type: "boolean",
          description: "Track link clicks",
        },
        open_tracking: {
          type: "boolean",
          description: "Track opens",
        },
        stop_on_reply: {
          type: "boolean",
          description: "Stop campaign on reply",
        },
        email_tag_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Tag IDs to use for sending",
        },
        match_lead_esp: {
          type: "boolean",
          description: "Match lead by ESP",
        },
        daily_max_leads: {
          type: "integer",
          description: "Max new leads to contact daily",
        },
        random_wait_max: {
          type: "number",
          description: "Max random wait in minutes",
        },
        stop_for_company: {
          type: "boolean",
          description: "Stop for company on reply",
        },
        campaign_schedule: {
          type: "object",
          additionalProperties: true,
          properties: {
            end_date: {
              type: "string",
              description: "Campaign end date in ISO 8601 format",
            },
            schedules: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  days: {
                    type: "object",
                    additionalProperties: true,
                    description: "Mapping of day index strings '0' (Sun) to '6' (Sat) to booleans",
                  },
                  name: {
                    type: "string",
                    description: "Name of the schedule",
                  },
                  timing: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      to: {
                        type: "string",
                        description: "Schedule end time in HH:mm format",
                      },
                      from: {
                        type: "string",
                        description: "Schedule start time in HH:mm format",
                      },
                    },
                    description: "Timing window for this schedule",
                  },
                  timezone: {
                    type: "string",
                    description: "Timezone for this schedule. The Instantly API accepts a restricted set of timezones. API-verified working values: 'America/Chicago' (Central), 'America/Detroit' (Eastern), 'America/Boise' (Mountain), 'America/Anchorage' (Alaska), 'America/Belize', 'America/Chihuahua', 'America/Creston', 'America/Dawson', 'Etc/GMT+10', 'Etc/GMT+11', 'Etc/GMT+12'. Auto-mapped aliases: 'America/New_York'/'US/Eastern' -> 'America/Detroit', 'America/Denver'/'US/Mountain' -> 'America/Boise'. NOTE: Pacific Time (America/Los_Angeles, US/Pacific, PST, PDT) is NOT supported by the API - use 'America/Anchorage' (UTC-9/UTC-8) or 'America/Dawson' (UTC-7 year-round, no DST) as alternatives depending on your needs.",
                  },
                },
                description: "A named schedule with timing and active days.",
              },
              description: "List of schedules for the campaign",
            },
            start_date: {
              type: "string",
              description: "Campaign start date in ISO 8601 format",
            },
          },
          description: "Schedule configuration for the campaign",
        },
        stop_on_auto_reply: {
          type: "boolean",
          description: "Stop on auto-reply",
        },
        auto_variant_select: {
          type: "object",
          additionalProperties: true,
          description: "Auto variant select settings",
        },
        allow_risky_contacts: {
          type: "boolean",
          description: "Allow risky contacts",
        },
        prioritize_new_leads: {
          type: "boolean",
          description: "Prioritize new leads",
        },
        first_email_text_only: {
          type: "boolean",
          description: "First email as text-only",
        },
        disable_bounce_protect: {
          type: "boolean",
          description: "Disable bounce protect",
        },
        provider_routing_rules: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Provider routing rules",
        },
        insert_unsubscribe_header: {
          type: "boolean",
          description: "Insert unsubscribe header",
        },
      },
      required: [
        "name",
        "campaign_schedule",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Campaign.",
    ],
  }),
  composioTool({
    name: "instantly_create_custom_tag",
    description: "Tool to create a new custom tag for organizing accounts and campaigns. Use when you need to create a new tag for categorization purposes.",
    toolSlug: "INSTANTLY_CREATE_CUSTOM_TAG",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "The label/name for the custom tag",
        },
        description: {
          type: "string",
          description: "A description for the tag to provide additional context",
        },
      },
      required: [
        "label",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Custom Tag.",
    ],
  }),
  composioTool({
    name: "instantly_create_inbox_placement_test",
    description: "Tool to create an inbox placement test. Use when you need to measure deliverability across providers with your prepared email and recipient list.",
    toolSlug: "INSTANTLY_CREATE_INBOX_PLACEMENT_TEST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name of the inbox placement test",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of tag UUIDs to apply to the test",
        },
        type: {
          type: "integer",
          description: "Test type: 1=one-time, 2=automated",
          enum: [
            1,
            2,
          ],
        },
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of recipient email addresses for the test",
        },
        status: {
          type: "integer",
          description: "Initial status: 1=Active, 2=Paused, 3=Completed",
          enum: [
            1,
            2,
            3,
          ],
        },
        schedule: {
          type: "object",
          additionalProperties: true,
          properties: {
            days: {
              type: "object",
              additionalProperties: true,
              description: "Object map of weekdays when the test should run (keys 0-6 as strings), e.g., {\"1\": true, \"3\": true, \"5\": true}",
            },
            timing: {
              type: "object",
              additionalProperties: true,
              description: "Object with time window for the test in 24-hour format, e.g., {\"from\": \"09:00\", \"to\": \"17:00\"}",
            },
            timezone: {
              type: "string",
              description: "IANA timezone for scheduling, e.g., 'UTC' or 'America/Los_Angeles'",
            },
          },
          description: "Schedule settings for automated inbox placement tests.",
        },
        test_code: {
          type: "string",
          description: "External identifier for tests sent from outside Instantly",
        },
        text_only: {
          type: "boolean",
          description: "If true, send plain-text only and disable open tracking",
        },
        email_body: {
          type: "string",
          description: "HTML body of the test email",
        },
        automations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Automations to trigger based on test results or schedule",
        },
        campaign_id: {
          type: "string",
          description: "UUID of the campaign to associate with the test",
        },
        description: {
          type: "string",
          description: "Optional description of the test",
        },
        delivery_mode: {
          type: "integer",
          description: "Delivery mode: 1=one by one, 2=all together",
          enum: [
            1,
            2,
          ],
        },
        email_subject: {
          type: "string",
          description: "Subject line for the test email",
        },
        sending_method: {
          type: "integer",
          description: "Sending method: 1=From Instantly, 2=From outside Instantly",
          enum: [
            1,
            2,
          ],
        },
        run_immediately: {
          type: "boolean",
          description: "If true, trigger the test immediately in addition to schedule",
        },
        recipients_labels: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Label settings for email service providers; fetch options via GET /inbox-placement-tests/email-service-provider-options",
        },
        not_sending_status: {
          type: "string",
          description: "Reason for not sending: 'daily_limits_hit' or 'other'",
          enum: [
            "daily_limits_hit",
            "other",
          ],
        },
        timestamp_next_run: {
          type: "string",
          description: "Next run timestamp in ISO 8601 format",
        },
      },
      required: [
        "name",
        "type",
        "sending_method",
        "email_subject",
        "email_body",
        "emails",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "inbox_placement_tests",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Inbox Placement Test.",
    ],
  }),
  composioTool({
    name: "instantly_create_lead",
    description: "Tool to create a new lead. Use when you need to add an individual lead to a campaign.",
    toolSlug: "INSTANTLY_CREATE_LEAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Email address of the lead",
        },
        phone: {
          type: "string",
          description: "Phone number of the lead",
        },
        website: {
          type: "string",
          description: "Website URL of the lead",
        },
        campaign: {
          type: "string",
          description: "UUID of the campaign to associate the lead with",
        },
        last_name: {
          type: "string",
          description: "Last name of the lead",
        },
        first_name: {
          type: "string",
          description: "First name of the lead",
        },
        company_name: {
          type: "string",
          description: "Company name of the lead",
        },
        personalization: {
          type: "string",
          description: "Personalized note or message for the lead",
        },
        custom_variables: {
          type: "object",
          additionalProperties: true,
          description: "Custom variables for the lead as a key/value map. Values must be scalars (string, number, boolean, or null); nested objects or arrays are not allowed. These will be stored on the lead's payload and can be used in campaigns.",
        },
        lt_interest_status: {
          type: "integer",
          description: "Lead interest status; allowed values: 0=Out of Office, 1=Interested, 2=Meeting Booked, 3=Meeting Completed, 4=Closed, -1=Not Interested, -2=Wrong Person, -3=Lost",
          enum: [
            -3,
            -2,
            -1,
            0,
            1,
            2,
            3,
            4,
          ],
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Lead.",
    ],
  }),
  composioTool({
    name: "instantly_create_lead_list",
    description: "Tool to create a new lead list. Use when you need to organize leads into a dedicated list before importing them into campaigns.",
    toolSlug: "INSTANTLY_CREATE_LEAD_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name of the lead list",
        },
        owned_by: {
          type: "string",
          description: "Owner user ID (UUID); defaults to creator if not provided",
        },
        has_enrichment_task: {
          type: "boolean",
          description: "Whether to run enrichment on added leads",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "lead_lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Lead List.",
    ],
  }),
  composioTool({
    name: "instantly_create_subsequence",
    description: "Creates an automated follow-up subsequence for a campaign. Subsequences are triggered when leads meet specific conditions (CRM status changes, activities, or reply keywords). Use this tool when you need to: - Set up automatic follow-ups for interested leads (CRM status = 1) - Send targeted sequences when leads reply with specific keywords - Create different follow-up paths based on meeting status or lead activities - Implement A/B testing with multiple email variants Key features: - Condition-based triggering (CRM status, lead activity, or reply keywords) - Flexible scheduling with timezone support and active days - Multi-step email sequences with configurable delays - A/B testing support with multiple email variants per step",
    toolSlug: "INSTANTLY_CREATE_SUBSEQUENCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Descriptive name for the subsequence to identify its purpose",
        },
        sequences: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              steps: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    type: {
                      type: "string",
                      description: "Step type - must be 'email' (currently the only supported step type)",
                    },
                    delay: {
                      type: "integer",
                      description: "Number of days to delay before sending this step. Use 0 to send immediately when conditions are met, or positive integers for delayed sending.",
                    },
                    variants: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          body: {
                            type: "string",
                            description: "Email body content. Supports dynamic variables like {{firstName}}, {{lastName}}, {{companyName}}, {{email}}. Use \\n for line breaks.",
                          },
                          subject: {
                            type: "string",
                            description: "Email subject line. Supports dynamic variables like {{firstName}}, {{lastName}}, {{companyName}}, {{email}}.",
                          },
                          disabled: {
                            type: "boolean",
                            description: "Whether this variant is disabled. Set to true to exclude this variant from A/B testing while keeping it in the configuration.",
                          },
                        },
                        description: "Email variant for A/B testing. Multiple variants enable split testing.",
                      },
                      description: "One or more email variants for A/B testing. If multiple variants are provided, they will be randomly distributed among leads.",
                    },
                  },
                  description: "Email step in the subsequence with delay and email variants.",
                },
                description: "One or more email steps in chronological order. Each step can have a delay and multiple variants for A/B testing.",
              },
            },
            description: "Sequence containing email steps. Note: Only the first sequence in the sequences array is processed by the API.",
          },
          description: "List of sequences containing email steps. Important: Only the first sequence element is used by the API; additional elements are ignored.",
        },
        conditions: {
          type: "object",
          additionalProperties: true,
          properties: {
            crm_status: {
              type: "array",
              items: {
                type: "integer",
              },
              description: "Lead CRM status IDs that trigger the subsequence. Multiple statuses can be combined. Valid values: 1=Interested, 2=Meeting Booked, 3=Meeting Completed, 4=Closed, -1=Not Interested, -2=Do Not Contact",
            },
            lead_activity: {
              type: "array",
              items: {
                type: "integer",
              },
              description: "Lead activity IDs that trigger the subsequence. The API accepts specific activity values only (exact valid values not documented). Consider using crm_status or reply_contains for more predictable triggering.",
            },
            reply_contains: {
              type: "string",
              description: "Text or keywords in lead replies that trigger the subsequence. Case-insensitive partial match.",
            },
          },
          description: "Trigger conditions that determine when leads enter the subsequence. At least one of crm_status, lead_activity, or reply_contains must be provided (non-empty).",
        },
        parent_campaign: {
          type: "string",
          description: "UUID of the parent campaign that this subsequence belongs to. Must be a valid existing campaign ID.",
        },
        subsequence_schedule: {
          type: "object",
          additionalProperties: true,
          properties: {
            end_date: {
              type: "string",
              description: "Optional end date in YYYY-MM-DD format. Subsequence will stop running after this date. Uses the campaign's timezone.",
            },
            schedules: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                properties: {
                  days: {
                    type: "object",
                    additionalProperties: true,
                    description: "Active days of the week. Map day index strings to booleans: '0'=Sunday, '1'=Monday, '2'=Tuesday, '3'=Wednesday, '4'=Thursday, '5'=Friday, '6'=Saturday. Set true for active days, false for inactive days.",
                  },
                  name: {
                    type: "string",
                    description: "Descriptive name for this schedule configuration",
                  },
                  timing: {
                    type: "object",
                    additionalProperties: true,
                    properties: {
                      to: {
                        type: "string",
                        description: "End time in HH:MM format (24-hour clock). Must be later than 'from' time.",
                      },
                      from: {
                        type: "string",
                        description: "Start time in HH:MM format (24-hour clock). Must be earlier than 'to' time.",
                      },
                    },
                    description: "Time window during which emails can be sent (start and end times in 24-hour format)",
                  },
                  timezone: {
                    type: "string",
                    description: "Timezone for the schedule in IANA format. Supported values: 'America/Chicago' (Central), 'America/Detroit' (Eastern), 'America/Boise' (Mountain), 'America/Anchorage' (Alaska), 'America/Belize', 'America/Chihuahua', 'America/Creston', 'America/Dawson', 'Etc/GMT+10', 'Etc/GMT+11', 'Etc/GMT+12'. Note: Pacific Time (America/Los_Angeles, PST/PDT) is NOT supported by the Instantly API.",
                  },
                },
                description: "Individual schedule configuration with timing, days, and timezone.",
              },
              description: "Array of one or more schedule configurations. Each schedule defines timing windows, active days, and timezone for when the subsequence can send emails.",
            },
            start_date: {
              type: "string",
              description: "Optional start date in YYYY-MM-DD format. Subsequence will only run from this date onwards. Uses the campaign's timezone.",
            },
          },
          description: "Scheduling configuration including timing windows, active days, timezone, and optional start/end dates",
        },
      },
      required: [
        "parent_campaign",
        "name",
        "conditions",
        "subsequence_schedule",
        "sequences",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "sequences_subsequences",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Subsequence.",
    ],
  }),
  composioTool({
    name: "instantly_create_supersearch_enrichment",
    description: "Tool to create a supersearch enrichment job for a list or campaign. Use when you need to enrich leads with data such as email verification, work email, profile information, job listings, technologies, news, or funding details.",
    toolSlug: "INSTANTLY_CREATE_SUPERSEARCH_ENRICHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Type of enrichment to create",
          enum: [
            "work_email_enrichment",
            "fully_enriched_profile",
            "email_verification",
            "joblisting",
            "technologies",
            "news",
            "funding",
            "ai_enrichment",
          ],
        },
        limit: {
          type: "integer",
          description: "Maximum number of leads to enrich",
        },
        lead_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific lead IDs to enrich (1-10000 items)",
        },
        auto_update: {
          type: "boolean",
          description: "When true, automatically enriches new leads added to the campaign/list",
        },
        resource_id: {
          type: "string",
          description: "UUID of the resource (list or campaign) to run enrichments for",
        },
        input_columns: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of column names to use as input data for AI enrichment from your leads",
        },
        model_version: {
          type: "string",
          description: "Version of the AI model to use for enrichment",
        },
        enrichment_payload: {
          type: "object",
          additionalProperties: true,
          properties: {
            news: {
              type: "boolean",
              description: "Enable news data enrichment for recent company news",
            },
            funding: {
              type: "boolean",
              description: "Enable funding information enrichment to gather investment data",
            },
            joblisting: {
              type: "boolean",
              description: "Enable job listing enrichment to gather employment data",
            },
            technologies: {
              type: "boolean",
              description: "Enable technology data enrichment to discover tech stack information",
            },
            ai_enrichment: {
              type: "object",
              additionalProperties: true,
              properties: {
                prompt: {
                  type: "string",
                  description: "Custom prompt to use for AI enrichment",
                },
                input_columns: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "List of column names to use as input data for AI enrichment",
                },
                output_column: {
                  type: "string",
                  description: "Column name to store the AI enrichment result",
                },
              },
              description: "Configuration for AI-powered enrichment.",
            },
            email_verification: {
              type: "boolean",
              description: "Enable email verification to validate email addresses",
            },
            work_email_enrichment: {
              type: "boolean",
              description: "Enable work email enrichment to find professional email addresses",
            },
            fully_enriched_profile: {
              type: "boolean",
              description: "Enable full profile enrichment for comprehensive contact information",
            },
          },
          description: "Configuration options for enrichment types.",
        },
        overwrite_existing: {
          type: "boolean",
          description: "When true, overwrites existing values; when false, only enriches empty fields",
        },
        use_instantly_credits: {
          type: "boolean",
          description: "When true, uses Instantly's account for API calls; when false, uses your own API keys",
        },
        skip_leads_without_email: {
          type: "boolean",
          description: "When true, leads without an email will be skipped",
        },
      },
      required: [
        "resource_id",
        "type",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "lead_enrichment_discovery",
    ],
    askBefore: [
      "Confirm the parameters before executing Create SuperSearch Enrichment.",
    ],
  }),
  composioTool({
    name: "instantly_create_webhook",
    description: "Tool to create a new webhook endpoint. Use when you need to receive Instantly event notifications via HTTP callbacks.",
    toolSlug: "INSTANTLY_CREATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign: {
          type: "string",
          description: "Filter webhook events to a specific campaign by its UUID; null for all campaigns",
        },
        event_type: {
          type: "string",
          description: "Event that triggers the webhook; use 'all_events' to subscribe to all events. See GET /webhooks/event-types for valid values",
        },
        target_hook_url: {
          type: "string",
          description: "Target URL to send webhook payloads; must start with http:// or https://",
        },
        custom_interest_value: {
          type: "integer",
          description: "Custom interest value for custom label events; corresponds to LeadLabel.interest_status",
        },
      },
      required: [
        "target_hook_url",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Webhook.",
    ],
  }),
  composioTool({
    name: "instantly_delete_api_key",
    description: "Tool to delete an API key. Use when you need to remove a specific API key by its ID after confirming its existence.",
    toolSlug: "INSTANTLY_DELETE_API_KEY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the API key to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "apikey",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete API Key.",
    ],
  }),
  composioTool({
    name: "instantly_delete_block_list_entry",
    description: "Tool to delete a blocked email or domain entry by its ID. Use when you need to remove a specific block list entry.",
    toolSlug: "INSTANTLY_DELETE_BLOCK_LIST_ENTRY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the block list entry to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Block List Entry.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_delete_campaign",
    description: "Tool to delete a campaign. Use when you need to remove a specific campaign by ID.",
    toolSlug: "INSTANTLY_DELETE_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaign",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Campaign.",
    ],
  }),
  composioTool({
    name: "instantly_delete_custom_tag",
    description: "Tool to delete a custom tag by its ID. Use when you need to remove a specific custom tag used for organizing and categorizing accounts and campaigns.",
    toolSlug: "INSTANTLY_DELETE_CUSTOM_TAG",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the custom tag to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Custom Tag.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_delete_lead",
    description: "Tool to delete a lead by its ID. Use when you need to remove a specific lead after confirming its existence.",
    toolSlug: "INSTANTLY_DELETE_LEAD",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "lead",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Lead.",
    ],
  }),
  composioTool({
    name: "instantly_delete_lead_label",
    description: "Tool to delete a lead label by ID. Use when you need to remove a custom label for categorizing and managing leads.",
    toolSlug: "INSTANTLY_DELETE_LEAD_LABEL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead label to delete",
        },
        reassigned_status: {
          type: "integer",
          description: "The interest status to reassign leads and emails to when deleting this label",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Lead Label.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_delete_lead_list",
    description: "Tool to delete a lead list by ID. Use when you need to remove a specific lead list after confirming its existence.",
    toolSlug: "INSTANTLY_DELETE_LEAD_LIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead list to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "lead_list",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Lead List.",
    ],
  }),
  composioTool({
    name: "instantly_delete_subsequence",
    description: "Delete a subsequence from a campaign by its UUID. A subsequence is an automated follow-up sequence triggered by specific conditions (e.g., CRM status changes, lead activity, or reply content). Use this action when you need to permanently remove a subsequence that is no longer needed or was created in error. The deletion is permanent and cannot be undone. Returns the complete subsequence data including its configuration, schedule, and email sequences for reference before deletion.",
    toolSlug: "INSTANTLY_DELETE_SUBSEQUENCE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the subsequence to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "sequences_subsequences",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Subsequence.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_delete_webhook",
    description: "Tool to delete a webhook. Use when you need to remove a specific webhook by its UUID.",
    toolSlug: "INSTANTLY_DELETE_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the webhook to delete",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "webhooks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Webhook.",
    ],
  }),
  composioTool({
    name: "instantly_delete_whitelabel_domain",
    description: "Tool to delete the whitelabel domain from current workspace. Use when you need to remove the whitelabel domain configuration from a workspace.",
    toolSlug: "INSTANTLY_DELETE_WHITELABEL_DOMAIN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "email_accounts_domains",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Whitelabel Domain.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_dfy_email_account_orders_domains_pre_warmed_up",
    description: "Tool to retrieve a list of pre-warmed up domains ready for DFY email account orders. Use when you need to check available domains that come pre-configured with SPF, DKIM, DMARC, and warmup already completed.",
    toolSlug: "INSTANTLY_DFY_EMAIL_ACCOUNT_ORDERS_DOMAINS_PRE_WARMED_UP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        search: {
          type: "string",
          description: "Search string to filter domains by partial or full domain name match",
        },
        domain_extensions: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of domain extensions (TLDs) to filter results. Only .com, .org, and .co are supported. Defaults to ['com', 'org', 'co'] if not provided.",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_disable_account_warmup",
    description: "Tool to disable the warm-up process for email accounts. Use when you need to stop warmup for specific or all accounts before sending critical campaigns.",
    toolSlug: "INSTANTLY_DISABLE_ACCOUNT_WARMUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of emails to disable warmup for (max 100).",
        },
        excluded_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of emails to exclude when `include_all_emails` is true (max 100).",
        },
        include_all_emails: {
          type: "boolean",
          description: "If true, disable warmup on all accounts.",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "accounts",
    ],
    askBefore: [
      "Confirm the parameters before executing Disable Account Warmup.",
    ],
  }),
  composioTool({
    name: "instantly_duplicate_campaign",
    description: "Tool to duplicate an existing campaign. Use when you need to create a copy of a campaign with the same configuration.",
    toolSlug: "INSTANTLY_DUPLICATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to duplicate",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Duplicate Campaign.",
    ],
  }),
  composioTool({
    name: "instantly_duplicate_subsequence",
    description: "Tool to duplicate an existing subsequence to a specified parent campaign. Use when you need to create a copy of a subsequence with the same trigger conditions.",
    toolSlug: "INSTANTLY_DUPLICATE_SUBSEQUENCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the subsequence to duplicate",
        },
        name: {
          type: "string",
          description: "Name for the duplicated subsequence",
        },
        parent_campaign: {
          type: "string",
          description: "UUID of the campaign to duplicate the subsequence to",
        },
      },
      required: [
        "id",
        "parent_campaign",
        "name",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "sequences_subsequences",
    ],
    askBefore: [
      "Confirm the parameters before executing Duplicate Subsequence.",
    ],
  }),
  composioTool({
    name: "instantly_enable_account_warmup",
    description: "Tool to enable the warm-up process for email accounts. Use when you want to start warming up one or more accounts to improve deliverability.",
    toolSlug: "INSTANTLY_ENABLE_ACCOUNT_WARMUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to enable warmup for; max 100 items",
        },
        excluded_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to exclude when include_all_emails is true; max 100 items",
        },
        include_all_emails: {
          type: "boolean",
          description: "If true, enable warmup for all email accounts in the workspace",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "accounts",
    ],
    askBefore: [
      "Confirm the parameters before executing Enable Account Warmup.",
    ],
  }),
  composioTool({
    name: "instantly_export_campaign",
    description: "Tool to export campaign data to JSON format. Use when you need to retrieve complete campaign configuration for backup or migration.",
    toolSlug: "INSTANTLY_EXPORT_CAMPAIGN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to export",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "instantly_get_account_campaign_mappings",
    description: "Tool to retrieve campaigns associated with an email account. Use when you need to find which campaigns are mapped to a specific email address.",
    toolSlug: "INSTANTLY_GET_ACCOUNT_CAMPAIGN_MAPPINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Email address to query for campaign associations",
        },
        limit: {
          type: "integer",
          description: "Number of results to return for pagination",
        },
        starting_after: {
          type: "string",
          description: "Pagination cursor that accepts UUID, timestamp (ISO 8601 format), or email for retrieving subsequent results",
        },
      },
      required: [
        "email",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_get_accounts_analytics_daily",
    description: "Tool to retrieve daily account analytics showing emails sent per day for each account. Use when you need per-day performance metrics for email accounts.",
    toolSlug: "INSTANTLY_GET_ACCOUNTS_ANALYTICS_DAILY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Filter by specific email accounts. If not provided, returns data for all accounts in workspace",
        },
        end_date: {
          type: "string",
          description: "End date for analytics period in YYYY-MM-DD format. If not provided, defaults to current date",
        },
        start_date: {
          type: "string",
          description: "Start date for analytics period in YYYY-MM-DD format. If not provided, returns data for the last 30 days",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_get_accounts_warmup_analytics",
    description: "Tool to retrieve warmup analytics for specified email accounts. Use when you need daily and aggregate warmup statistics including health scores.",
    toolSlug: "INSTANTLY_GET_ACCOUNTS_WARMUP_ANALYTICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to retrieve warmup analytics for. The emails must be attached to accounts in your workspace",
        },
      },
      required: [
        "emails",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_get_audit_logs",
    description: "Tool to retrieve audit log records for tracking system activities. Use when you need to review account activity history or monitor changes.",
    toolSlug: "INSTANTLY_GET_AUDIT_LOGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum number of audit log entries to return, between 1 and 100",
        },
        starting_after: {
          type: "string",
          description: "Cursor for pagination. Use 'next_starting_after' from previous response",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "platform_administration_resources",
    ],
  }),
  composioTool({
    name: "instantly_get_block_list_entry",
    description: "Tool to retrieve a specific blocked email or domain entry by its ID. Use when you have a block list entry UUID and need to check block details.",
    toolSlug: "INSTANTLY_GET_BLOCK_LIST_ENTRY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the block list entry to retrieve",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "leads_segmentation",
    ],
  }),
  composioTool({
    name: "instantly_get_campaign",
    description: "Tool to retrieve campaign details. Use when you need full campaign configuration for a given campaign ID.",
    toolSlug: "INSTANTLY_GET_CAMPAIGN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to retrieve",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
    ],
  }),
  composioTool({
    name: "instantly_get_campaign_analytics",
    description: "Tool to retrieve analytics for campaigns. Use when you need performance metrics for one or multiple campaigns.",
    toolSlug: "INSTANTLY_GET_CAMPAIGN_ANALYTICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Campaign UUID to retrieve analytics for a single campaign",
        },
        ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of campaign UUIDs to retrieve analytics for multiple campaigns",
        },
        end_date: {
          type: "string",
          description: "End date filter (YYYY-MM-DD)",
        },
        start_date: {
          type: "string",
          description: "Start date filter (YYYY-MM-DD)",
        },
        exclude_total_leads_count: {
          type: "boolean",
          description: "If true, exclude total leads count to speed response",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "instantly_get_campaign_sending_status",
    description: "Tool to retrieve campaign sending status diagnostics explaining why a campaign may not be sending emails or is sending slower than expected. Use when troubleshooting campaign delivery issues or understanding campaign health.",
    toolSlug: "INSTANTLY_GET_CAMPAIGN_SENDING_STATUS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to retrieve sending status for",
        },
        with_ai_summary: {
          type: "boolean",
          description: "If true, includes an AI-generated summary of the sending status in the response. Defaults to false.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "instantly_get_campaign_steps_analytics",
    description: "Tool to retrieve analytics data broken down by campaign steps and variants. Use when you need detailed performance metrics for each step in a campaign sequence.",
    toolSlug: "INSTANTLY_GET_CAMPAIGN_STEPS_ANALYTICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end_date: {
          type: "string",
          description: "End date for analytics period in YYYY-MM-DD format (e.g., '2024-01-01')",
        },
        start_date: {
          type: "string",
          description: "Start date for analytics period in YYYY-MM-DD format (e.g., '2024-01-01')",
        },
        campaign_id: {
          type: "string",
          description: "Campaign ID in UUID format (e.g., '019b0aee-b8b9-7e26-ab5f-4fca02ce11f8'). Leave empty to get analytics for all campaigns",
        },
        include_opportunities_count: {
          type: "boolean",
          description: "Whether to include opportunities count per step. When true, 'opportunities' and 'unique_opportunities' fields will be included in the response",
        },
      },
      required: [
        "start_date",
        "end_date",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "instantly_get_current_workspace",
    description: "Tool to retrieve current workspace details based on API key. Use when you need workspace information like plan details, owner, or organization settings.",
    toolSlug: "INSTANTLY_GET_CURRENT_WORKSPACE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "workspace_members_billing",
    ],
  }),
  composioTool({
    name: "instantly_get_custom_tag",
    description: "Tool to retrieve a specific custom tag by ID. Use when you need details about a custom tag used for organizing accounts and campaigns.",
    toolSlug: "INSTANTLY_GET_CUSTOM_TAG",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the custom tag to retrieve",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "leads_segmentation",
    ],
  }),
  composioTool({
    name: "instantly_get_custom_tag_mappings",
    description: "Tool to retrieve custom tag mappings that connect tags to resources like campaigns and email accounts. Use when you need to see which tags are assigned to which resources.",
    toolSlug: "INSTANTLY_GET_CUSTOM_TAG_MAPPINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of custom tag mappings to return, between 1 and 100",
        },
        tag_ids: {
          type: "string",
          description: "Comma-separated tag IDs to filter mappings by",
        },
        resource_ids: {
          type: "string",
          description: "Comma-separated resource IDs (account or campaign) to filter mappings by",
        },
        starting_after: {
          type: "string",
          description: "Cursor ID to start listing after for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "leads_segmentation",
    ],
  }),
  composioTool({
    name: "instantly_get_daily_campaign_analytics",
    description: "Tool to retrieve daily analytics for a campaign. Use when you need per-day performance metrics for campaigns.",
    toolSlug: "INSTANTLY_GET_DAILY_CAMPAIGN_ANALYTICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end_date: {
          type: "string",
          description: "End date (inclusive) for analytics in YYYY-MM-DD format",
        },
        start_date: {
          type: "string",
          description: "Start date (inclusive) for analytics in YYYY-MM-DD format",
        },
        campaign_id: {
          type: "string",
          description: "Campaign ID (UUID); omit to retrieve analytics for all campaigns",
        },
        campaign_status: {
          type: "integer",
          description: "Filter by campaign status. Allowed values: 0=Draft, 1=Active, 2=Paused, 3=Completed, 4=Running Subsequences, -99=Account Suspended, -1=Accounts Unhealthy, -2=Bounce Protect",
          enum: [
            0,
            1,
            2,
            3,
            4,
            -99,
            -1,
            -2,
          ],
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "analytics",
    ],
  }),
  composioTool({
    name: "instantly_get_dfy_email_account_order_accounts",
    description: "Tool to retrieve DFY (Done-For-You) email account order accounts. Use when you need to fetch accounts from DFY email account orders with optional pagination and password inclusion.",
    toolSlug: "INSTANTLY_GET_DFY_EMAIL_ACCOUNT_ORDER_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of accounts to return, between 1 and 100. Default is 10.",
        },
        starting_after: {
          type: "string",
          description: "ID of the last item in the previous page for pagination. Can be UUID, timestamp, or email.",
        },
        with_passwords: {
          type: "boolean",
          description: "When set to true, the password of the account is returned. Can be empty if accounts are not ready yet.",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_get_email_service_provider_options",
    description: "Tool to retrieve email service provider options for inbox placement tests. Use when you need valid recipients_labels options.",
    toolSlug: "INSTANTLY_GET_EMAIL_SERVICE_PROVIDER_OPTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "inbox_placement_tests",
    ],
  }),
  composioTool({
    name: "instantly_get_inbox_placement_analytics_stats_by_date",
    description: "Tool to retrieve time-series statistics for inbox placement test results by date. Use when you need daily analytics showing how emails were distributed across inbox, spam, and category folders.",
    toolSlug: "INSTANTLY_GET_INBOX_PLACEMENT_ANALYTICS_STATS_BY_DATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        test_id: {
          type: "string",
          description: "The unique identifier (UUID format) of the inbox placement test",
        },
      },
      required: [
        "test_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "deliverability_inbox_placement",
    ],
  }),
  composioTool({
    name: "instantly_get_inbox_placement_test",
    description: "Tool to retrieve inbox placement test results. Use when you need details for a specific inbox placement test by ID.",
    toolSlug: "INSTANTLY_GET_INBOX_PLACEMENT_TEST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the inbox placement test",
        },
        with_metadata: {
          type: "boolean",
          description: "Whether to include campaign and tags metadata in response",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "inbox_placement_tests",
    ],
  }),
  composioTool({
    name: "instantly_get_lead",
    description: "Tool to retrieve details of a specific lead by its ID. Use when you have the lead UUID and need full lead metadata.",
    toolSlug: "INSTANTLY_GET_LEAD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "leads",
    ],
  }),
  composioTool({
    name: "instantly_get_lead_label",
    description: "Tool to retrieve a specific lead label by ID. Use when you need details about a custom label for categorizing and managing leads.",
    toolSlug: "INSTANTLY_GET_LEAD_LABEL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead label to retrieve",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "leads_segmentation",
    ],
  }),
  composioTool({
    name: "instantly_get_lead_list",
    description: "Tool to retrieve details of a specific lead list by its ID. Use when you have the lead list UUID and need list metadata.",
    toolSlug: "INSTANTLY_GET_LEAD_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead list",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "lead_lists",
    ],
  }),
  composioTool({
    name: "instantly_get_phone_numbers",
    description: "Tool to retrieve all phone numbers associated with your organization. Use when you need to list phone numbers configured for CRM actions.",
    toolSlug: "INSTANTLY_GET_PHONE_NUMBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "platform_administration_resources",
    ],
  }),
  composioTool({
    name: "instantly_get_similar_dfy_email_account_order_domains",
    description: "Tool to generate similar available domain suggestions for DFY email account orders. Use when you need to find available domain alternatives based on a provided domain. Returns maximum of 66 suggestions per extension (TLD) requested.",
    toolSlug: "INSTANTLY_GET_SIMILAR_DFY_EMAIL_ACCOUNT_ORDER_DOMAINS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        domain: {
          type: "string",
          description: "The base domain name to find similar alternatives for (e.g., 'example.com')",
        },
        extensions: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "com",
              "org",
            ],
          },
          description: "Array of TLD extensions to use for generating similar domains. Supported values: 'com', 'org'. Default: ['com', 'org'] if not specified. Maximum of 66 suggestions per extension.",
        },
      },
      required: [
        "domain",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_get_subsequence",
    description: "Tool to retrieve a specific subsequence by its ID. Use when you need full details of a follow-up sequence entity.",
    toolSlug: "INSTANTLY_GET_SUBSEQUENCE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the subsequence to retrieve",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "sequences_subsequences",
    ],
  }),
  composioTool({
    name: "instantly_get_supersearch_enrichment",
    description: "Tool to retrieve supersearch enrichment configuration and status for a list or campaign. Use this to check enrichment settings, progress status, and configuration details for a specific list or campaign resource.",
    toolSlug: "INSTANTLY_GET_SUPERSEARCH_ENRICHMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        resource_id: {
          type: "string",
          description: "UUID of the list or campaign to retrieve enrichment configuration and status for",
        },
      },
      required: [
        "resource_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "lead_enrichment_discovery",
    ],
  }),
  composioTool({
    name: "instantly_get_verification_stats_for_lead_list",
    description: "Tool to retrieve verification statistics for a lead list. Use when you need summary counts by verification status for a specific lead list.",
    toolSlug: "INSTANTLY_GET_VERIFICATION_STATS_FOR_LEAD_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead list",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "lead_lists",
    ],
  }),
  composioTool({
    name: "instantly_get_webhook",
    description: "Tool to retrieve details of a specific webhook subscription. Use when you have the webhook ID and need full webhook configuration.",
    toolSlug: "INSTANTLY_GET_WEBHOOK",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the webhook",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "instantly_get_webhook_event",
    description: "Tool to retrieve details of a specific webhook event. Use when you need to inspect a particular webhook event by its ID.",
    toolSlug: "INSTANTLY_GET_WEBHOOK_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the webhook event to retrieve",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
    ],
  }),
  composioTool({
    name: "instantly_get_webhook_event_types",
    description: "Tool to retrieve all available webhook event types. Use when you need to see valid event types for webhook subscriptions.",
    toolSlug: "INSTANTLY_GET_WEBHOOK_EVENT_TYPES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "webhooks_event_tracking",
    ],
  }),
  composioTool({
    name: "instantly_get_webhook_events_summary",
    description: "Tool to retrieve webhook events summary with success and failure statistics. Use when you need aggregated webhook delivery metrics for a date range.",
    toolSlug: "INSTANTLY_GET_WEBHOOK_EVENTS_SUMMARY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        to_date: {
          type: "string",
          description: "Inclusive end date of the date range in YYYY-MM-DD format",
        },
        from_date: {
          type: "string",
          description: "Inclusive start date of the date range in YYYY-MM-DD format",
        },
      },
      required: [
        "from_date",
        "to_date",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "webhooks_event_tracking",
    ],
  }),
  composioTool({
    name: "instantly_get_webhook_events_summary_by_date",
    description: "Tool to retrieve webhook event summaries grouped by date. Use when you need aggregated webhook event statistics over a date range.",
    toolSlug: "INSTANTLY_GET_WEBHOOK_EVENTS_SUMMARY_BY_DATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        to_date: {
          type: "string",
          description: "End date (inclusive) in YYYY-MM-DD format for the summary period",
        },
        from_date: {
          type: "string",
          description: "Start date (inclusive) in YYYY-MM-DD format for the summary period",
        },
      },
      required: [
        "from_date",
        "to_date",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "webhooks_event_tracking",
    ],
  }),
  composioTool({
    name: "instantly_get_workspace_billing_plan_details",
    description: "Tool to retrieve workspace billing plan details. Use when you need to view billing plan information for various services like lead finder, verification, CRM, website visitor tracking, and inbox placement.",
    toolSlug: "INSTANTLY_GET_WORKSPACE_BILLING_PLAN_DETAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "workspace_members_billing",
    ],
  }),
  composioTool({
    name: "instantly_inbox_placement_analytics_deliverability_insights",
    description: "Tool to retrieve deliverability insights for inbox placement tests. Use when you need detailed percentage breakdowns of emails landing in spam, inbox, and category folders with optional date range filtering and previous period comparison.",
    toolSlug: "INSTANTLY_INBOX_PLACEMENT_ANALYTICS_DELIVERABILITY_INSIGHTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        date_to: {
          type: "string",
          description: "End date for filtering results in ISO 8601 format",
        },
        test_id: {
          type: "string",
          description: "The unique identifier for the inbox placement test (UUID)",
        },
        date_from: {
          type: "string",
          description: "Start date for filtering results in ISO 8601 format",
        },
        recipient_esp: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by recipient email service providers",
        },
        recipient_geo: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by recipient geographic locations",
        },
        show_previous: {
          type: "boolean",
          description: "Whether to include previous period data in response",
        },
        recipient_type: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by recipient types",
        },
        previous_date_to: {
          type: "string",
          description: "End date for previous period comparison in ISO 8601 format",
        },
        previous_date_from: {
          type: "string",
          description: "Start date for previous period comparison in ISO 8601 format",
        },
      },
      required: [
        "test_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "deliverability_inbox_placement",
    ],
  }),
  composioTool({
    name: "instantly_inbox_placement_analytics_stats_by_test_id",
    description: "Tool to retrieve aggregated inbox placement analytics statistics for specified test IDs. Use when you need consolidated inbox, spam, and category counts across multiple tests with optional filtering by date range, recipient geo, type, ESP, or sender email.",
    toolSlug: "INSTANTLY_INBOX_PLACEMENT_ANALYTICS_STATS_BY_TEST_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        date_to: {
          type: "string",
          description: "End date for filtering results in ISO 8601 format",
        },
        test_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of test IDs (UUIDs) to retrieve statistics for. Must be non-empty.",
        },
        date_from: {
          type: "string",
          description: "Start date for filtering results in ISO 8601 format",
        },
        sender_email: {
          type: "string",
          description: "Filter by sender email address",
        },
        recipient_esp: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by recipient email service provider",
        },
        recipient_geo: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by recipient geographic locations",
        },
        recipient_type: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter by recipient type",
        },
      },
      required: [
        "test_ids",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "deliverability_inbox_placement",
    ],
  }),
  composioTool({
    name: "instantly_lead_labels_post",
    description: "Tool to create a custom lead label for categorizing leads. Use when you need to create a new label to organize and manage leads with specific interest status categories.",
    toolSlug: "INSTANTLY_LEAD_LABELS_POST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "The display name for the custom lead label",
        },
        description: {
          type: "string",
          description: "Detailed description of the lead label's purpose",
        },
        use_with_ai: {
          type: "boolean",
          description: "Whether this label should be used with AI features",
        },
        interest_status_label: {
          type: "string",
          description: "Interest status category for this label. Must be one of: 'positive', 'negative', 'neutral'",
          enum: [
            "positive",
            "negative",
            "neutral",
          ],
        },
      },
      required: [
        "label",
        "interest_status_label",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Lead Label.",
    ],
  }),
  composioTool({
    name: "instantly_list_accounts",
    description: "Tool to list all email accounts for the authenticated user. Use after obtaining auth credentials to retrieve available accounts.",
    toolSlug: "INSTANTLY_LIST_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum number of items to return, between 1 and 100",
        },
        search: {
          type: "string",
          description: "Search string to filter accounts, e.g., domain or email substring",
        },
        status: {
          type: "integer",
          description: "Filter by account status: 1 Active; 2 Paused; -1 Connection Error; -2 Soft Bounce Error; -3 Sending Error",
        },
        tag_ids: {
          type: "string",
          description: "Comma-separated list of tag UUIDs to filter accounts",
        },
        provider_code: {
          type: "integer",
          description: "Filter by email provider: 1 Custom IMAP/SMTP; 2 Google; 3 Microsoft; 4 AWS",
        },
        starting_after: {
          type: "string",
          description: "Cursor for pagination. Use 'next_starting_after' from previous response",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
    ],
  }),
  composioTool({
    name: "instantly_list_block_list_entries",
    description: "Tool to list blocked emails or domains from blocklist. Use when you need to retrieve multiple block list entries with optional filtering by domains only or search terms. Supports pagination.",
    toolSlug: "INSTANTLY_LIST_BLOCK_LIST_ENTRIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of items per page (1-100)",
        },
        search: {
          type: "string",
          description: "Search filter by email or domain value",
        },
        domains_only: {
          type: "boolean",
          description: "Filter to return only domain blocks (true) or include both domains and specific emails (false/null)",
        },
        starting_after: {
          type: "string",
          description: "Cursor for pagination - ID of last item from previous page (UUID format)",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "leads_segmentation",
    ],
  }),
  composioTool({
    name: "instantly_list_campaigns",
    description: "Tool to list all campaigns. Use when you need to fetch your campaigns list with optional filters and pagination.",
    toolSlug: "INSTANTLY_LIST_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of campaigns to return, between 1 and 100",
        },
        search: {
          type: "string",
          description: "Search text to filter campaign names",
        },
        tag_ids: {
          type: "string",
          description: "Comma-separated tag UUIDs to filter campaigns",
        },
        starting_after: {
          type: "string",
          description: "UUID cursor to start listing after for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "instantly_list_custom_tags",
    description: "Tool to list custom tags. Use when you need to retrieve custom tags with optional pagination and filtering.",
    toolSlug: "INSTANTLY_LIST_CUSTOM_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of custom tags to return, between 1 and 100",
        },
        search: {
          type: "string",
          description: "Search text to filter custom tags by label or description",
        },
        tag_ids: {
          type: "string",
          description: "Comma-separated tag IDs to filter by",
        },
        resource_ids: {
          type: "string",
          description: "Comma-separated resource IDs (account or campaign) to filter by",
        },
        starting_after: {
          type: "string",
          description: "Cursor ID to start listing after for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
      "tags",
    ],
  }),
  composioTool({
    name: "instantly_list_dfy_email_account_orders",
    description: "Tool to list DFY email account orders. Use when you need to fetch your DFY email account orders with pagination.",
    toolSlug: "INSTANTLY_LIST_DFY_EMAIL_ACCOUNT_ORDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of DFY Email Account Orders to return, between 1 and 100",
        },
        starting_after: {
          type: "string",
          description: "ID of the last order from the previous page for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "dfy_email_account_orders",
    ],
  }),
  composioTool({
    name: "instantly_list_emails",
    description: "Tool to list emails. Use when you need to retrieve emails with optional filters and pagination.",
    toolSlug: "INSTANTLY_LIST_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lead: {
          type: "string",
          description: "Filter by lead email address",
        },
        mode: {
          type: "string",
          description: "Unibox mode filter: emode_focused, emode_others, or emode_all",
          enum: [
            "emode_focused",
            "emode_others",
            "emode_all",
          ],
        },
        limit: {
          type: "integer",
          description: "Number of items to return, between 1 and 100",
        },
        search: {
          type: "string",
          description: "Search by lead email or 'thread:<thread_id>' to filter by thread",
        },
        eaccount: {
          type: "string",
          description: "Email account used to send the email",
        },
        i_status: {
          type: "integer",
          description: "Email status to filter by",
        },
        is_unread: {
          type: "boolean",
          description: "Filter only unread emails",
        },
        email_type: {
          type: "string",
          description: "Filter by email type: received, sent, or manual",
          enum: [
            "received",
            "sent",
            "manual",
          ],
        },
        sort_order: {
          type: "string",
          description: "Sort order: asc or desc",
          enum: [
            "asc",
            "desc",
          ],
        },
        assigned_to: {
          type: "string",
          description: "Filter by assignee user ID",
        },
        campaign_id: {
          type: "string",
          description: "Campaign ID (UUID) to filter emails",
        },
        has_reminder: {
          type: "boolean",
          description: "Filter emails that have a reminder set",
        },
        preview_only: {
          type: "boolean",
          description: "Filter preview-only emails",
        },
        company_domain: {
          type: "string",
          description: "Filter by lead company domain",
        },
        marked_as_done: {
          type: "boolean",
          description: "Filter emails marked as done",
        },
        scheduled_only: {
          type: "boolean",
          description: "Return only scheduled emails",
        },
        starting_after: {
          type: "string",
          description: "Cursor ID to start listing from for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "emails",
    ],
  }),
  composioTool({
    name: "instantly_list_inbox_placement_blacklist_spam_assassin",
    description: "Tool to list inbox placement blacklist & SpamAssassin reports. Use when you need to retrieve spam and blacklist analytics after running an inbox placement test.",
    toolSlug: "INSTANTLY_LIST_INBOX_PLACEMENT_BLACKLIST_SPAM_ASSASSIN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of items to return, between 1 and 100",
        },
        date_to: {
          type: "string",
          description: "Filter items created at or before this timestamp (ISO 8601)",
        },
        test_id: {
          type: "string",
          description: "Inbox Placement Test ID to filter by",
        },
        date_from: {
          type: "string",
          description: "Filter items created at or after this timestamp (ISO 8601)",
        },
        starting_after: {
          type: "string",
          description: "Cursor of last item from previous page for pagination",
        },
        skip_blacklist_report: {
          type: "boolean",
          description: "If true, omit blacklist_report from each item",
        },
        skip_spam_assassin_report: {
          type: "boolean",
          description: "If true, omit spam_assassin_report from each item",
        },
      },
      required: [
        "test_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "inbox_placement",
    ],
  }),
  composioTool({
    name: "instantly_list_inbox_placement_tests",
    description: "Tool to list inbox placement tests. Use when you need a paginated overview of tests with optional filtering and sort order.",
    toolSlug: "INSTANTLY_LIST_INBOX_PLACEMENT_TESTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of tests to return, between 1 and 100",
        },
        search: {
          type: "string",
          description: "Search term to filter tests by name or content",
        },
        status: {
          type: "integer",
          description: "Filter by status: 1=Active, 2=Paused, 3=Completed",
          enum: [
            1,
            2,
            3,
          ],
        },
        sort_order: {
          type: "string",
          description: "Sort order by id (UUIDv7 timestamp); asc or desc",
          enum: [
            "asc",
            "desc",
          ],
        },
        starting_after: {
          type: "string",
          description: "UUID cursor to start listing after for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "inbox_placement_tests",
    ],
  }),
  composioTool({
    name: "instantly_list_lead_lists",
    description: "Tool to list all lead lists. Use when you need to fetch the lead lists with optional filters and pagination.",
    toolSlug: "INSTANTLY_LIST_LEAD_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of lead lists to return, between 1 and 100",
        },
        search: {
          type: "string",
          description: "Search text to filter lead list names",
        },
        starting_after: {
          type: "string",
          description: "Cursor timestamp (ISO 8601) to start listing after for pagination",
        },
        has_enrichment_task: {
          type: "boolean",
          description: "Filter lists that have an enrichment task",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "lead_lists",
    ],
  }),
  composioTool({
    name: "instantly_list_leads",
    description: "Tool to list leads. Use when you need to retrieve leads with optional filters like search, status filters, and pagination.",
    toolSlug: "INSTANTLY_LIST_LEADS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Only include these lead IDs (UUID strings)",
        },
        limit: {
          type: "integer",
          description: "Page size limit between 1 and 100",
        },
        filter: {
          type: "string",
          description: "Lead filter status; allowed values: FILTER_VAL_CONTACTED, FILTER_VAL_NOT_CONTACTED, FILTER_VAL_COMPLETED, FILTER_VAL_UNSUBSCRIBED, FILTER_VAL_ACTIVE, FILTER_LEAD_INTERESTED, FILTER_LEAD_NOT_INTERESTED, FILTER_LEAD_MEETING_BOOKED",
        },
        search: {
          type: "string",
          description: "Search by first name, last name, or email",
        },
        in_list: {
          type: "boolean",
          description: "Whether the lead is in any list",
        },
        list_id: {
          type: "string",
          description: "Lead list ID to filter leads",
        },
        queries: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Advanced query conditions as raw JSON objects",
        },
        campaign: {
          type: "string",
          description: "Campaign ID to filter leads",
        },
        contacts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Only include leads with these emails",
        },
        in_campaign: {
          type: "boolean",
          description: "Whether the lead is in any campaign",
        },
        excluded_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Exclude these lead IDs (UUID strings)",
        },
        starting_after: {
          type: "string",
          description: "Cursor of last item from previous page for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "leads",
    ],
  }),
  composioTool({
    name: "instantly_list_webhook_events",
    description: "Tool to list webhook events. Use when you need to view received webhook events with optional pagination and filters.",
    toolSlug: "INSTANTLY_LIST_WEBHOOK_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of items to return, between 1 and 100",
        },
        search: {
          type: "string",
          description: "Exact match on webhook URL or lead email",
        },
        success: {
          type: "boolean",
          description: "Filter events by success status",
        },
        to_date: {
          type: "string",
          description: "Inclusive end date filter in YYYY-MM-DD format",
        },
        from_date: {
          type: "string",
          description: "Inclusive start date filter in YYYY-MM-DD format",
        },
        starting_after: {
          type: "string",
          description: "Cursor for pagination. ID of the last item from the previous page",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "webhook_events",
    ],
  }),
  composioTool({
    name: "instantly_list_webhooks",
    description: "Tool to list configured webhooks. Use when you need to retrieve your webhook configurations with optional filters and pagination.",
    toolSlug: "INSTANTLY_LIST_WEBHOOKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Number of webhooks to return, between 1 and 100",
        },
        campaign: {
          type: "string",
          description: "Filter webhooks by campaign UUID",
        },
        event_type: {
          type: "string",
          description: "Filter webhooks by event type. Allowed: all_events, email_sent, email_opened, email_link_clicked, reply_received, email_bounced, lead_unsubscribed, campaign_completed, account_error, lead_neutral, etc.",
        },
        starting_after: {
          type: "string",
          description: "Cursor (webhook ID) to start listing after for pagination",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "instantly_mark_thread_as_read",
    description: "Tool to mark all emails in a specific thread as read. Use when you want to update the read status of an email thread after processing.",
    toolSlug: "INSTANTLY_MARK_THREAD_AS_READ",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        thread_id: {
          type: "string",
          description: "UUID of the email thread to mark as read",
        },
      },
      required: [
        "thread_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Mark Thread As Read.",
    ],
  }),
  composioTool({
    name: "instantly_merge_leads",
    description: "Tool to merge multiple leads into a single lead. Use after confirming both source and destination lead IDs exist.",
    toolSlug: "INSTANTLY_MERGE_LEADS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lead_id: {
          type: "string",
          description: "UUID of the source lead to be merged",
        },
        destination_lead_id: {
          type: "string",
          description: "UUID of the destination lead that will receive merged data",
        },
      },
      required: [
        "lead_id",
        "destination_lead_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge Leads.",
    ],
  }),
  composioTool({
    name: "instantly_move_leads",
    description: "Tool to move leads from one campaign to another. Use when you need to transfer specific leads between campaigns.",
    toolSlug: "INSTANTLY_MOVE_LEADS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of lead UUIDs to move to the destination campaign",
        },
        campaign: {
          type: "string",
          description: "UUID of the source campaign from which leads will be moved",
        },
        to_campaign_id: {
          type: "string",
          description: "UUID of the destination campaign to which leads will be moved",
        },
      },
      required: [
        "ids",
        "campaign",
        "to_campaign_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Move Leads.",
    ],
  }),
  composioTool({
    name: "instantly_patch_lead_label",
    description: "Tool to update an existing lead label by ID. Use when you need to modify a custom label for categorizing and managing leads.",
    toolSlug: "INSTANTLY_PATCH_LEAD_LABEL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead label to update",
        },
        label: {
          type: "string",
          description: "Display label/name for the custom lead label (e.g., 'Hot Lead')",
        },
        description: {
          type: "string",
          description: "Detailed description of the custom lead label purpose",
        },
        use_with_ai: {
          type: "boolean",
          description: "Whether this label should be used with AI features",
        },
        interest_status_label: {
          type: "string",
          description: "Interest status label associated with this label (e.g., 'positive', 'negative', 'neutral')",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Lead Label.",
    ],
  }),
  composioTool({
    name: "instantly_patch_supersearch_enrichment_settings",
    description: "Tool to update auto-update and skip settings for SuperSearch enrichment. Use when you need to configure enrichment behavior for leads in a list or campaign, including automatic enrichment of new leads, skipping leads without emails, evergreen updates, and overwrite settings.",
    toolSlug: "INSTANTLY_PATCH_SUPERSEARCH_ENRICHMENT_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        overwrite: {
          type: "boolean",
          description: "When true, will overwrite existing values in the output column. When false, only empty fields will be enriched. Default is false",
        },
        auto_update: {
          type: "boolean",
          description: "When true, new leads added to the campaign/list will be automatically enriched using these same settings. Allows you to auto-update existing rows and keeps outputs fresh over time",
        },
        resource_id: {
          type: "string",
          description: "Unique identifier (UUID) for the resource (list or campaign) to update enrichment settings for",
        },
        is_evergreen: {
          type: "boolean",
          description: "Whether the enrichment is evergreen (automatically updates over time)",
        },
        skip_rows_without_email: {
          type: "boolean",
          description: "When true, leads without an email will be skipped. Enabled by default to ensure only leads with work email will be enriched, preventing credit waste for leads without work emails",
        },
      },
      required: [
        "resource_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "lead_enrichment_discovery",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch SuperSearch Enrichment Settings.",
    ],
  }),
  composioTool({
    name: "instantly_patch_webhook",
    description: "Tool to update an existing webhook configuration. Use when you need to modify webhook properties like name, event type, or target URL.",
    toolSlug: "INSTANTLY_PATCH_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the webhook to update.",
        },
        name: {
          type: "string",
          description: "Name for the webhook, or null to clear.",
        },
        headers: {
          type: "object",
          additionalProperties: true,
          description: "Custom headers to include in webhook requests (key-value pairs).",
        },
        campaign: {
          type: "string",
          description: "Campaign UUID to associate with the webhook, or null to clear.",
        },
        event_type: {
          type: "string",
          description: "Type of event to trigger the webhook. Options include: 'all_events' (subscribes to all events including custom label events), 'email_sent', 'email_opened', 'email_link_clicked', 'reply_received', 'email_bounced', 'lead_unsubscribed', 'campaign_completed', 'account_error', 'lead_neutral', and additional event types. Set to null for custom label events.",
        },
        target_hook_url: {
          type: "string",
          description: "The URL where webhook events will be sent; must start with http:// or https://",
        },
        custom_interest_value: {
          type: "integer",
          description: "Integer value for custom interest; corresponds to LeadLabel.interest_status.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "webhooks_event_tracking",
    ],
    askBefore: [
      "Confirm the parameters before executing Patch Webhook.",
    ],
  }),
  composioTool({
    name: "instantly_pause_campaign",
    description: "Tool to pause an active campaign. Use when you need to suspend sending operations for a specific campaign.",
    toolSlug: "INSTANTLY_PAUSE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to pause",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Pause Campaign.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_pause_subsequence",
    description: "Tool to pause an active campaign subsequence. Use when you need to temporarily suspend a follow-up sequence.",
    toolSlug: "INSTANTLY_PAUSE_SUBSEQUENCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the subsequence to pause",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "sequences_subsequences",
    ],
    askBefore: [
      "Confirm the parameters before executing Pause Subsequence.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_remove_lead_from_subsequence",
    description: "Tool to remove a lead from a campaign subsequence. Use when you need to stop a lead from receiving subsequence emails.",
    toolSlug: "INSTANTLY_REMOVE_LEAD_FROM_SUBSEQUENCE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (UUID format) of the lead to remove from the subsequence",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "sequences_subsequences",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Lead From Subsequence.",
    ],
  }),
  composioTool({
    name: "instantly_resume_subsequence",
    description: "Tool to resume a paused campaign subsequence. Use when you need to restart a previously paused follow-up sequence.",
    toolSlug: "INSTANTLY_RESUME_SUBSEQUENCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the subsequence to resume",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "sequences_subsequences",
    ],
    askBefore: [
      "Confirm the parameters before executing Resume Subsequence.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_search_campaigns_by_lead_email",
    description: "Tool to search campaigns by a lead's email address. Use when you need to find campaigns containing a specific lead by their email.",
    toolSlug: "INSTANTLY_SEARCH_CAMPAIGNS_BY_LEAD_EMAIL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        search: {
          type: "string",
          description: "Lead email to search",
        },
        sort_order: {
          type: "string",
          description: "Sort direction, either 'asc' or 'desc' (default 'asc')",
          enum: [
            "asc",
            "desc",
          ],
        },
        sort_column: {
          type: "string",
          description: "Column to sort by, default 'timestamp_created'",
        },
      },
      required: [
        "search",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "instantly_set_whitelabel_domain",
    description: "Tool to set whitelabel agency domain for current workspace. Use when you need to configure custom branding with your own domain name for the workspace.",
    toolSlug: "INSTANTLY_SET_WHITELABEL_DOMAIN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        domain: {
          type: "string",
          description: "The agency domain to set for the workspace whitelabel configuration",
        },
      },
      required: [
        "domain",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "email_accounts_domains",
    ],
    askBefore: [
      "Confirm the parameters before executing Set Whitelabel Domain.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_share_campaign",
    description: "Tool to share a campaign. Use when you need to share a campaign template for 7 days.",
    toolSlug: "INSTANTLY_SHARE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to share",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Share Campaign.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "instantly_supersearch_enrichment_run_post",
    description: "Tool to run all enrichments for resource leads or unenriched leads. Use when you need to trigger enrichment processes for a list or campaign.",
    toolSlug: "INSTANTLY_SUPERSEARCH_ENRICHMENT_RUN_POST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        resource_id: {
          type: "string",
          description: "The unique identifier (UUID) of the list or campaign to run enrichment for",
        },
      },
      required: [
        "resource_id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "lead_enrichment_discovery",
    ],
    askBefore: [
      "Confirm the parameters before executing Run SuperSearch Enrichment.",
    ],
  }),
  composioTool({
    name: "instantly_test_accounts_vitals",
    description: "Tool to test IMAP/SMTP connectivity and account vitals for email accounts. Use when you need to verify email account health and connectivity status.",
    toolSlug: "INSTANTLY_TEST_ACCOUNTS_VITALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        accounts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of email addresses to test for IMAP/SMTP connectivity and account vitals",
        },
      },
      required: [
        "accounts",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_accounts_domains",
    ],
  }),
  composioTool({
    name: "instantly_test_webhook",
    description: "Tool to send a test payload to verify a webhook is working. Use when you need to verify a webhook configuration.",
    toolSlug: "INSTANTLY_TEST_WEBHOOK",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the webhook to test",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "webhooks_event_tracking",
    ],
  }),
  composioTool({
    name: "instantly_toggle_resource",
    description: "Tool to assign or unassign custom tags to resources like accounts and campaigns. Use when you need to manage custom tag associations with resources by either assigning or unassigning tags.",
    toolSlug: "INSTANTLY_TOGGLE_RESOURCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        assign: {
          type: "boolean",
          description: "Whether to assign (true) or unassign (false) the tags to the specified resources",
        },
        filter: {
          type: "object",
          additionalProperties: true,
          description: "Filter criteria to apply to resources. Only used when selected_all is true",
        },
        tag_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of tag IDs to assign or unassign to resources",
        },
        resource_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of resource IDs (account IDs or campaign IDs) to apply the tags to",
        },
        selected_all: {
          type: "boolean",
          description: "Whether to select all resources. When true, the filter parameter is used",
        },
        resource_type: {
          type: "integer",
          description: "Type of resource to apply tags to. Value: 1 for accounts or campaigns",
        },
      },
      required: [
        "tag_ids",
        "resource_type",
        "resource_ids",
        "assign",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "platform_administration_resources",
    ],
    askBefore: [
      "Confirm the parameters before executing Toggle Resource.",
    ],
  }),
  composioTool({
    name: "instantly_update_block_list_entry",
    description: "Tool to update a blocked email or domain entry. Use when you need to modify the bl_value of an existing block list entry.",
    toolSlug: "INSTANTLY_UPDATE_BLOCK_LIST_ENTRY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the block list entry to update",
        },
        bl_value: {
          type: "string",
          description: "The email address or domain to block (e.g., 'example@domain.com' or 'example.com')",
        },
      },
      required: [
        "id",
        "bl_value",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Block List Entry.",
    ],
  }),
  composioTool({
    name: "instantly_update_campaign",
    description: "Tool to update details of a campaign. Use when you need to modify campaign settings after verifying its ID.",
    toolSlug: "INSTANTLY_UPDATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the campaign to update",
        },
        name: {
          type: "string",
          description: "New campaign name",
        },
        cc_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to CC",
        },
        bcc_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to BCC",
        },
        owned_by: {
          type: "string",
          description: "UUID of the new owner; null to unset",
        },
        pl_value: {
          type: "number",
          description: "Value for each positive lead; null to unset",
        },
        email_gap: {
          type: "integer",
          description: "Gap between emails in minutes; null to unset",
        },
        sequences: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of sequence objects; only first is honored; include steps inside",
        },
        text_only: {
          type: "boolean",
          description: "Send emails as text-only; null to unset",
        },
        email_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of sender email addresses to use for this campaign. Must be email addresses of sender accounts that already exist in your Instantly workspace. Use INSTANTLY_LIST_ACCOUNTS to retrieve available sender email addresses.",
        },
        daily_limit: {
          type: "integer",
          description: "Daily send limit; null for unlimited",
        },
        is_evergreen: {
          type: "boolean",
          description: "Whether the campaign is evergreen; null to unset",
        },
        link_tracking: {
          type: "boolean",
          description: "Enable link click tracking; null to unset",
        },
        open_tracking: {
          type: "boolean",
          description: "Enable open tracking; null to unset",
        },
        stop_on_reply: {
          type: "boolean",
          description: "Stop campaign when a lead replies; null to unset",
        },
        email_tag_list: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email tag UUIDs to apply",
        },
        match_lead_esp: {
          type: "boolean",
          description: "Match leads by ESP; null to unset",
        },
        daily_max_leads: {
          type: "integer",
          description: "Max new leads to contact per day; null to unset",
        },
        random_wait_max: {
          type: "integer",
          description: "Maximum random wait in minutes; null to unset",
        },
        stop_for_company: {
          type: "boolean",
          description: "Stop for company on reply; null to unset",
        },
        campaign_schedule: {
          type: "object",
          additionalProperties: true,
          description: "Raw campaign schedule configuration",
        },
        stop_on_auto_reply: {
          type: "boolean",
          description: "Stop on auto-reply; null to unset",
        },
        auto_variant_select: {
          type: "object",
          additionalProperties: true,
          description: "Settings for auto variant selection",
        },
        allow_risky_contacts: {
          type: "boolean",
          description: "Allow sending to risky contacts; null to unset",
        },
        prioritize_new_leads: {
          type: "boolean",
          description: "Prioritize new leads; null to unset",
        },
        first_email_text_only: {
          type: "boolean",
          description: "Send only the first email as text-only; null to unset",
        },
        disable_bounce_protect: {
          type: "boolean",
          description: "Disable bounce protection; null to unset",
        },
        provider_routing_rules: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Custom provider routing rule objects",
        },
        insert_unsubscribe_header: {
          type: "boolean",
          description: "Insert unsubscribe header; null to unset",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Campaign.",
    ],
  }),
  composioTool({
    name: "instantly_update_custom_tag",
    description: "Tool to update an existing custom tag's label or description. Use when you need to modify a custom tag used for organizing accounts and campaigns.",
    toolSlug: "INSTANTLY_UPDATE_CUSTOM_TAG",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the custom tag to update",
        },
        label: {
          type: "string",
          description: "The label/name for the custom tag. Include only if you want to update it.",
        },
        description: {
          type: "string",
          description: "A description for the tag to provide additional context. Include only if you want to update it. Set to empty string to clear.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads_segmentation",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Custom Tag.",
    ],
  }),
  composioTool({
    name: "instantly_update_inbox_placement_test",
    description: "Tool to update an inbox placement test. Use when you need to modify an existing inbox placement test by its ID.",
    toolSlug: "INSTANTLY_UPDATE_INBOX_PLACEMENT_TEST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the inbox placement test to update",
        },
        name: {
          type: "string",
          description: "Name of the inbox placement test",
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of tag UUIDs to apply to the test",
        },
        type: {
          type: "integer",
          description: "Test type: 1=one-time, 2=automated",
          enum: [
            1,
            2,
          ],
        },
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of recipient email addresses for the test",
        },
        status: {
          type: "integer",
          description: "Status: 1=Active, 2=Paused, 3=Completed",
          enum: [
            1,
            2,
            3,
          ],
        },
        schedule: {
          type: "object",
          additionalProperties: true,
          properties: {
            days: {
              type: "object",
              additionalProperties: true,
              description: "Object map of weekdays when the test should run (keys 0-6 as strings), e.g., {\"1\": true, \"3\": true, \"5\": true}",
            },
            timing: {
              type: "object",
              additionalProperties: true,
              description: "Object with time window for the test in 24-hour format, e.g., {\"from\": \"09:00\", \"to\": \"17:00\"}",
            },
            timezone: {
              type: "string",
              description: "IANA timezone for scheduling, e.g., 'UTC' or 'America/Los_Angeles'",
            },
          },
          description: "Schedule settings for automated inbox placement tests.",
        },
        test_code: {
          type: "string",
          description: "External identifier for tests sent from outside Instantly",
        },
        text_only: {
          type: "boolean",
          description: "If true, send plain-text only and disable open tracking",
        },
        email_body: {
          type: "string",
          description: "HTML body of the test email",
        },
        automations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Automations to trigger based on test results or schedule",
        },
        campaign_id: {
          type: "string",
          description: "UUID of the campaign to associate with the test",
        },
        description: {
          type: "string",
          description: "Optional description of the test",
        },
        delivery_mode: {
          type: "integer",
          description: "Delivery mode: 1=one by one, 2=all together",
          enum: [
            1,
            2,
          ],
        },
        email_subject: {
          type: "string",
          description: "Subject line for the test email",
        },
        sending_method: {
          type: "integer",
          description: "Sending method: 1=From Instantly, 2=From outside Instantly",
          enum: [
            1,
            2,
          ],
        },
        recipients_labels: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Label settings for email service providers; fetch options via GET /inbox-placement-tests/email-service-provider-options",
        },
        not_sending_status: {
          type: "string",
          description: "Reason for not sending: 'daily_limits_hit' or 'other'",
          enum: [
            "daily_limits_hit",
            "other",
          ],
        },
        timestamp_next_run: {
          type: "string",
          description: "Next run timestamp in ISO 8601 format",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "deliverability_inbox_placement",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Inbox Placement Test.",
    ],
  }),
  composioTool({
    name: "instantly_update_lead",
    description: "Tool to update a lead's details. Use when you need to modify fields of an existing lead after identifying its ID.",
    toolSlug: "INSTANTLY_UPDATE_LEAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead to update.",
        },
        phone: {
          type: "string",
          description: "Phone number of the lead, or null to clear.",
        },
        website: {
          type: "string",
          description: "Website URL of the lead, or null to clear.",
        },
        last_name: {
          type: "string",
          description: "Last name of the lead, or null to clear.",
        },
        first_name: {
          type: "string",
          description: "First name of the lead, or null to clear.",
        },
        company_name: {
          type: "string",
          description: "Company name of the lead, or null to clear.",
        },
        personalization: {
          type: "string",
          description: "Personalization content for the lead, or null to clear.",
        },
        lt_interest_status: {
          type: "integer",
          description: "Lead interest status. Static values: 0=Out of Office, 1=Interested, 2=Meeting Booked, 3=Meeting Completed, 4=Closed, -1=Not Interested, -2=Wrong Person, -3=Lost; or custom status.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Lead.",
    ],
  }),
  composioTool({
    name: "instantly_update_lead_interest_status",
    description: "Tool to update a lead's interest status. Use when you need to set or reset a lead’s interest status for follow-up actions.",
    toolSlug: "INSTANTLY_UPDATE_LEAD_INTEREST_STATUS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "Optional list ID to scope the update",
        },
        lead_email: {
          type: "string",
          description: "Email address of the lead whose interest status to update",
        },
        campaign_id: {
          type: "string",
          description: "Optional campaign ID to scope the update",
        },
        interest_value: {
          type: "string",
          description: "Interest status code. Set to null to reset to 'Lead'. Valid values: 0=Out of Office, 1=Interested, 2=Meeting Booked, 3=Meeting Completed, 4=Closed, -1=Not Interested, -2=Wrong Person, -3=Lost",
        },
        ai_interest_value: {
          type: "integer",
          description: "Optional AI interest value for the lead",
        },
        disable_auto_interest: {
          type: "boolean",
          description: "Disable Instantly's automatic interest updates when set to true",
        },
      },
      required: [
        "lead_email",
        "interest_value",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "leads",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Lead Interest Status.",
    ],
  }),
  composioTool({
    name: "instantly_update_lead_list",
    description: "Tool to update details of a specific lead list by its ID. Use after verifying the list ID exists.",
    toolSlug: "INSTANTLY_UPDATE_LEAD_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the lead list to update",
        },
        name: {
          type: "string",
          description: "New name for the lead list",
        },
        owned_by: {
          type: "string",
          description: "User ID of the new owner (UUID)",
        },
        has_enrichment_task: {
          type: "boolean",
          description: "Whether this list runs the enrichment process on every added lead",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "lead_lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Lead List.",
    ],
  }),
  composioTool({
    name: "instantly_update_subsequence",
    description: "Tool to update a campaign subsequence entity. Use when you need to modify subsequence settings such as name, schedule, or triggered CRM statuses.",
    toolSlug: "INSTANTLY_UPDATE_SUBSEQUENCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "UUID of the subsequence to update",
        },
        name: {
          type: "string",
          description: "Name of the subsequence",
        },
        sequences: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of sequences containing email steps. Important: Only the first array element is processed, so provide only one array item with steps inside it.",
        },
        crm_statuses: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Lead CRM statuses that trigger the subsequence",
        },
        parent_campaign: {
          type: "string",
          description: "UUID of the campaign this subsequence belongs to",
        },
        subsequence_schedule: {
          type: "object",
          additionalProperties: true,
          properties: {
            timing: {
              type: "object",
              additionalProperties: true,
              properties: {
                to: {
                  type: "string",
                  description: "End time in HH:MM format (24-hour)",
                },
                from: {
                  type: "string",
                  description: "Start time in HH:MM format (24-hour)",
                },
              },
              description: "Timing configuration for subsequence schedule.",
            },
            end_date: {
              type: "string",
              description: "End date in YYYY-MM-DD format (uses campaign's timezone)",
            },
            timezone: {
              type: "string",
              description: "Timezone in IANA format (e.g., 'America/Los_Angeles'). Supports 100+ timezones.",
            },
            start_date: {
              type: "string",
              description: "Start date in YYYY-MM-DD format (uses campaign's timezone)",
            },
          },
          description: "Schedule configuration for the subsequence.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "sequences_subsequences",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Subsequence.",
    ],
  }),
  composioTool({
    name: "instantly_update_workspace_current",
    description: "Tool to update the current workspace details. Use when you need to modify workspace settings such as name or logo URL.",
    toolSlug: "INSTANTLY_UPDATE_WORKSPACE_CURRENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Name of the workspace",
        },
        org_logo_url: {
          type: "string",
          description: "URL to the workspace logo. Set to null to remove the logo.",
        },
      },
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "workspace_members_billing",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Current Workspace.",
    ],
  }),
  composioTool({
    name: "instantly_verify_email",
    description: "Tool to initiate email verification. Use when you need to verify an email's deliverability before sending emails.",
    toolSlug: "INSTANTLY_VERIFY_EMAIL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Email address to verify in RFC 5322 format.",
        },
        webhook_url: {
          type: "string",
          description: "Optional webhook URL to receive verification results asynchronously if the process takes longer than 10 seconds.",
        },
      },
      required: [
        "email",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "email_verification",
    ],
  }),
  composioTool({
    name: "instantly_workspace_group_members_admin_get",
    description: "Tool to retrieve admin workspace details for the current sub workspace. Use when you need to get information about the admin workspace relationship, including workspace IDs and status.",
    toolSlug: "INSTANTLY_WORKSPACE_GROUP_MEMBERS_ADMIN_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "workspace_members_billing",
    ],
  }),
  composioTool({
    name: "instantly_workspace_members_get",
    description: "Tool to retrieve details of a specific workspace member by ID. Use when you need information about a member of a workspace with associated user details.",
    toolSlug: "INSTANTLY_WORKSPACE_MEMBERS_GET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the workspace member to retrieve (UUID format)",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "read",
      "workspace_members_billing",
    ],
  }),
  composioTool({
    name: "instantly_workspace_members_post",
    description: "Tool to add a new member to workspace with email and role. Use when you need to invite a new team member to the workspace with specific role and permissions.",
    toolSlug: "INSTANTLY_WORKSPACE_MEMBERS_POST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        role: {
          type: "string",
          description: "The role of the workspace member defining their access level. Available values: 'editor', 'admin'. Note: 'owner' role cannot be created via API",
          enum: [
            "editor",
            "admin",
          ],
        },
        email: {
          type: "string",
          description: "Email address of the user to be added as a workspace member",
        },
        permissions: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Permissions for this workspace member used to restrict access to certain sections (e.g., ['unibox.all']). Can be null or omitted",
        },
      },
      required: [
        "email",
        "role",
      ],
    },
    tags: [
      "composio",
      "instantly",
      "write",
      "workspace_members_billing",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Workspace Member.",
    ],
  }),
];
