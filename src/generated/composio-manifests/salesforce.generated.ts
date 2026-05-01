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
    integration: "salesforce",
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
      toolkit: "salesforce",
      toolSlug: partial.toolSlug,
      version: "20260430_00",
    },
  };
}

export const salesforceComposioTools: IntegrationTool[] = [
  composioTool({
    name: "salesforce_add_contact_to_campaign",
    description: "Adds a contact to a campaign by creating a CampaignMember record to track campaign engagement. Fails if the contact is already a member of the campaign; pre-check membership via SOQL before calling.",
    toolSlug: "SALESFORCE_ADD_CONTACT_TO_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        status: {
          type: "string",
          description: "The status of the campaign member. Common values include 'Sent', 'Responded'. The available statuses depend on campaign configuration. Value must exactly match a configured CampaignMember Status for the campaign; arbitrary strings will fail. Query the campaign's CampaignMemberStatus records first if unsure of valid values.",
        },
        contact_id: {
          type: "string",
          description: "The Salesforce ID of the contact to add to the campaign.",
        },
        campaign_id: {
          type: "string",
          description: "The Salesforce ID of the campaign to add the contact to.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values for CampaignMember. Custom field names typically end with '__c'.",
        },
      },
      required: [
        "campaign_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Add contact to campaign.",
    ],
  }),
  composioTool({
    name: "salesforce_add_lead_to_campaign",
    description: "Adds a lead to a campaign by creating a CampaignMember record, allowing you to track campaign engagement. Both `campaign_id` and `lead_id` must be valid Salesforce IDs of active, existing records — names or emails cannot be substituted, and deleted or inactive records will cause the call to fail. This is a persistent CRM write; confirm the correct lead and campaign before calling.",
    toolSlug: "SALESFORCE_ADD_LEAD_TO_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        status: {
          type: "string",
          description: "The status of the campaign member. Common values include 'Sent', 'Responded'. The available statuses depend on campaign configuration. Value must exactly match one of the campaign's configured CampaignMember statuses; a mismatch will cause the call to be rejected.",
        },
        lead_id: {
          type: "string",
          description: "The Salesforce ID of the lead to add to the campaign.",
        },
        campaign_id: {
          type: "string",
          description: "The Salesforce ID of the campaign to add the lead to.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values for CampaignMember. Custom field names typically end with '__c'.",
        },
      },
      required: [
        "campaign_id",
        "lead_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Add lead to campaign.",
    ],
  }),
  composioTool({
    name: "salesforce_add_opportunity_line_item",
    description: "Adds a product (line item) to an opportunity. The product must exist in a pricebook entry that's associated with the opportunity's pricebook.",
    toolSlug: "SALESFORCE_ADD_OPPORTUNITY_LINE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        discount: {
          type: "number",
          description: "Discount percentage (0-100). Cannot be used with TotalPrice.",
        },
        quantity: {
          type: "number",
          description: "The quantity of the product to add.",
        },
        unit_price: {
          type: "number",
          description: "The sales price per unit. If not specified, uses the standard price from the pricebook entry.",
        },
        description: {
          type: "string",
          description: "Optional description for this line item.",
        },
        total_price: {
          type: "number",
          description: "The total price for this line item. Cannot be used with UnitPrice or Discount.",
        },
        service_date: {
          type: "string",
          description: "Service date for the product in YYYY-MM-DD format.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c'.",
        },
        opportunity_id: {
          type: "string",
          description: "The Salesforce ID of the opportunity to add a product to.",
        },
        pricebook_entry_id: {
          type: "string",
          description: "The ID of the PricebookEntry that contains the product and price information. This links to a specific product in a specific pricebook. Entry must be active and match the opportunity's pricebook and currency; mismatches cause REQUIRED_FIELD_MISSING or INVALID_CROSS_REFERENCE_KEY errors. Use SALESFORCE_LIST_PRICEBOOK_ENTRIES to find valid entries.",
        },
      },
      required: [
        "opportunity_id",
        "pricebook_entry_id",
        "quantity",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Add product to opportunity.",
    ],
  }),
  composioTool({
    name: "salesforce_apply_lead_assignment_rules",
    description: "Applies configured lead assignment rules to a specific lead, automatically routing it to the appropriate owner based on your organization's rules. Allow a brief propagation delay before querying updated ownership or field values after rule application.",
    toolSlug: "SALESFORCE_APPLY_LEAD_ASSIGNMENT_RULES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lead_id: {
          type: "string",
          description: "The Salesforce ID of the lead to apply assignment rules to.",
        },
      },
      required: [
        "lead_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "actions_and_quick_actions",
    ],
    askBefore: [
      "Confirm the parameters before executing Apply lead assignment rules.",
    ],
  }),
  composioTool({
    name: "salesforce_associate_contact_to_account",
    description: "Associates a contact with an account by updating the contact's AccountId field. Overwrites any existing AccountId on the contact. For broader contact field updates alongside the account association, use SALESFORCE_UPDATE_CONTACT instead.",
    toolSlug: "SALESFORCE_ASSOCIATE_CONTACT_TO_ACCOUNT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        account_id: {
          type: "string",
          description: "The Salesforce ID of the account to associate the contact with.",
        },
        contact_id: {
          type: "string",
          description: "The Salesforce ID of the contact to associate with an account.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values to update on the contact. Custom field names typically end with '__c'.",
        },
      },
      required: [
        "contact_id",
        "account_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Associate contact to account.",
    ],
  }),
  composioTool({
    name: "salesforce_clone_opportunity_with_products",
    description: "Clones an opportunity and optionally its products (line items). Creates a new opportunity with the same field values and products as the original.",
    toolSlug: "SALESFORCE_CLONE_OPPORTUNITY_WITH_PRODUCTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        new_name: {
          type: "string",
          description: "Name for the cloned opportunity. If not specified, will append 'Clone of' to original name.",
        },
        close_date: {
          type: "string",
          description: "Close date for the cloned opportunity in YYYY-MM-DD format. If not specified, uses original close date.",
        },
        stage_name: {
          type: "string",
          description: "Stage for the cloned opportunity. If not specified, uses original stage.",
        },
        clone_products: {
          type: "boolean",
          description: "Whether to clone the opportunity's products (line items). Set to false to clone only the opportunity.",
        },
        opportunity_id: {
          type: "string",
          description: "The ID of the opportunity to clone.",
        },
      },
      required: [
        "opportunity_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Clone opportunity with products.",
    ],
  }),
  composioTool({
    name: "salesforce_clone_record",
    description: "Creates a copy of an existing Salesforce record by reading its data, removing system fields, and creating a new record. Optionally apply field updates to the clone.",
    toolSlug: "SALESFORCE_CLONE_RECORD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record_id: {
          type: "string",
          description: "The ID of the record to clone.",
        },
        object_type: {
          type: "string",
          description: "The Salesforce object type to clone (e.g., Account, Contact, Lead, Opportunity).",
        },
        field_updates: {
          type: "string",
          description: "Optional field updates to apply to the cloned record as a JSON string. Use this to modify specific fields in the clone. Example: '{\"Name\": \"Clone of Original\", \"Status\": \"New\"}'",
        },
      },
      required: [
        "object_type",
        "record_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Clone record.",
    ],
  }),
  composioTool({
    name: "salesforce_close_or_abort_job",
    description: "Tool to close or abort a Salesforce Bulk API v2 ingest job. Use when you need to finalize job processing by closing (state: UploadComplete) or cancel a job by aborting (state: Aborted). This is required for every ingest job - closing queues data for processing, while aborting cancels the job and deletes uploaded data.",
    toolSlug: "SALESFORCE_CLOSE_OR_ABORT_JOB",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        state: {
          type: "string",
          description: "The state to update the job to. 'UploadComplete' closes the job and queues uploaded data for processing. 'Aborted' cancels the job and deletes any uploaded data. This field is required.",
          enum: [
            "UploadComplete",
            "Aborted",
          ],
        },
        job_id: {
          type: "string",
          description: "The unique identifier of the Bulk API v2 ingest job to close or abort.",
        },
      },
      required: [
        "job_id",
        "state",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "bulk_data_jobs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Close or abort a job.",
    ],
  }),
  composioTool({
    name: "salesforce_complete_task",
    description: "Marks a task as completed with optional completion notes. This is a convenience action that updates the task status to 'Completed'.",
    toolSlug: "SALESFORCE_COMPLETE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        task_id: {
          type: "string",
          description: "The Salesforce ID of the task to mark as completed.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Completion_Source__c').",
        },
        completion_notes: {
          type: "string",
          description: "Optional notes to add about the task completion. Will be appended to existing description.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Complete task.",
    ],
  }),
  composioTool({
    name: "salesforce_create_a_record",
    description: "Tool to create a Salesforce record using the UI API. Use when you need to create any type of Salesforce record with layout metadata and formatted field values.",
    toolSlug: "SALESFORCE_CREATE_A_RECORD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary mapping field API names to their values. Keys are field API names (e.g., 'Name', 'FirstName', 'AccountId') and values are the data to set for those fields. Custom fields (ending in '__c') should be passed as direct key-value pairs, not nested under a 'CustomFields' key.",
        },
        api_name: {
          type: "string",
          description: "The API name of the Salesforce object to create (e.g., 'Account', 'Contact', 'Opportunity', 'ContentNote').",
        },
        allow_save_on_duplicate: {
          type: "boolean",
          description: "Controls whether to allow saving when duplicates are detected. Note: Not currently supported in Lightning Web Components createRecord function.",
        },
        composio_execution_message: {
          type: "string",
          description: "Internal message about input processing performed during execution.",
        },
      },
      required: [
        "api_name",
        "fields",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "ui_api_records_lookups_and_related_lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a record.",
    ],
  }),
  composioTool({
    name: "salesforce_create_account",
    description: "Creates a new account in Salesforce with the specified information. Returns the created Account's ID at `data.response_data.id`.",
    toolSlug: "SALESFORCE_CREATE_ACCOUNT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fax: {
          type: "string",
          description: "Fax number.",
        },
        name: {
          type: "string",
          description: "Account name (required field in Salesforce).",
        },
        type: {
          type: "string",
          description: "Type of account.",
        },
        phone: {
          type: "string",
          description: "Main phone number.",
        },
        website: {
          type: "string",
          description: "Company website URL.",
        },
        industry: {
          type: "string",
          description: "Industry the account belongs to.",
        },
        sic_desc: {
          type: "string",
          description: "Standard Industrial Classification (SIC) description.",
        },
        parent_id: {
          type: "string",
          description: "ID of the parent account if this is a subsidiary. Must be a valid Salesforce Account Id (15- or 18-character).",
        },
        description: {
          type: "string",
          description: "Text description of the account.",
        },
        billing_city: {
          type: "string",
          description: "Billing address city.",
        },
        billing_state: {
          type: "string",
          description: "Billing address state/province. For US/Canada addresses, use full state/province names (e.g., 'California', 'New York', 'Ontario') or abbreviations ('CA', 'NY') which are auto-converted. For other countries, leave empty unless you know the exact valid picklist value for your Salesforce org. WARNING: If State/Country Picklists are enabled in your org, only pre-configured values are accepted; arbitrary region names will be rejected with FIELD_INTEGRITY_EXCEPTION.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Custom fields to set on the account. Use Salesforce API field names (e.g., 'Level__c', 'Languages__c'). Values can be strings, numbers, booleans, or null.",
        },
        shipping_city: {
          type: "string",
          description: "Shipping address city.",
        },
        account_source: {
          type: "string",
          description: "Source of the account.",
        },
        annual_revenue: {
          type: "number",
          description: "Estimated annual revenue.",
        },
        billing_street: {
          type: "string",
          description: "Billing address street.",
        },
        shipping_state: {
          type: "string",
          description: "Shipping address state/province. For US/Canada addresses, use full state/province names (e.g., 'California', 'New York', 'Ontario') or abbreviations ('CA', 'NY') which are auto-converted. For other countries, leave empty unless you know the exact valid picklist value for your Salesforce org. WARNING: If State/Country Picklists are enabled in your org, only pre-configured values are accepted; arbitrary region names will be rejected with FIELD_INTEGRITY_EXCEPTION.",
        },
        billing_country: {
          type: "string",
          description: "Billing address country.",
        },
        shipping_street: {
          type: "string",
          description: "Shipping address street.",
        },
        shipping_country: {
          type: "string",
          description: "Shipping address country.",
        },
        billing_postal_code: {
          type: "string",
          description: "Billing address postal/zip code.",
        },
        number_of_employees: {
          type: "integer",
          description: "Number of employees.",
        },
        shipping_postal_code: {
          type: "string",
          description: "Shipping address postal/zip code.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create account.",
    ],
  }),
  composioTool({
    name: "salesforce_create_campaign",
    description: "Creates a new campaign in Salesforce. Only `name` is universally required, but org-level validation rules commonly enforce `type`, `status`, `start_date`, and `end_date` as well — omitting them may cause creation to fail.",
    toolSlug: "SALESFORCE_CREATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Campaign name (required field in Salesforce).",
        },
        type: {
          type: "string",
          description: "Type of campaign.",
        },
        status: {
          type: "string",
          description: "Current status of the campaign.",
        },
        end_date: {
          type: "string",
          description: "Campaign end date in YYYY-MM-DD format.",
        },
        is_active: {
          type: "boolean",
          description: "Whether the campaign is currently active. Depending on org configuration, setting to `true` may require valid `start_date`/`end_date` ranges; violations raise a non-retriable `CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY` error.",
        },
        parent_id: {
          type: "string",
          description: "ID of the parent campaign if this is a child campaign.",
        },
        start_date: {
          type: "string",
          description: "Campaign start date in YYYY-MM-DD format.",
        },
        actual_cost: {
          type: "number",
          description: "Actual cost spent on the campaign.",
        },
        description: {
          type: "string",
          description: "Detailed description of the campaign.",
        },
        number_sent: {
          type: "number",
          description: "Number of individuals targeted by the campaign.",
        },
        budgeted_cost: {
          type: "number",
          description: "Budgeted cost for the campaign.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field names and their values. Custom field names should end with '__c' (e.g., 'Priority__c', 'Region__c'). Values can be strings, numbers, booleans, or dates depending on the field type.",
        },
        expected_revenue: {
          type: "number",
          description: "Expected revenue from the campaign.",
        },
        expected_response: {
          type: "number",
          description: "Expected response rate as a percentage.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create campaign.",
    ],
  }),
  composioTool({
    name: "salesforce_create_contact",
    description: "Creates a new contact in Salesforce with the specified information. Writes to live CRM data — obtain explicit user confirmation before executing. Failures may reflect org-specific validation rules, permission restrictions, or duplicate rules rather than invalid inputs.",
    toolSlug: "SALESFORCE_CREATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Contact's email address.",
        },
        phone: {
          type: "string",
          description: "Contact's primary phone number.",
        },
        title: {
          type: "string",
          description: "Contact's job title.",
        },
        birthdate: {
          type: "string",
          description: "Contact's birthdate in YYYY-MM-DD format.",
        },
        last_name: {
          type: "string",
          description: "Contact's last name (required field in Salesforce).",
        },
        account_id: {
          type: "string",
          description: "ID of the Account this contact is associated with.",
        },
        department: {
          type: "string",
          description: "Contact's department.",
        },
        first_name: {
          type: "string",
          description: "Contact's first name.",
        },
        lead_source: {
          type: "string",
          description: "Source from which this contact originated.",
        },
        mailing_city: {
          type: "string",
          description: "Contact's mailing city.",
        },
        mobile_phone: {
          type: "string",
          description: "Contact's mobile phone number.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Level__c', 'Languages__c').",
        },
        mailing_state: {
          type: "string",
          description: "Contact's mailing state/province.",
        },
        mailing_street: {
          type: "string",
          description: "Contact's mailing street address.",
        },
        mailing_country: {
          type: "string",
          description: "Contact's mailing country.",
        },
        mailing_postal_code: {
          type: "string",
          description: "Contact's mailing postal/zip code.",
        },
      },
      required: [
        "last_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create contact.",
    ],
  }),
  composioTool({
    name: "salesforce_create_custom_field",
    description: "Tool to create a custom field on a Salesforce object using the Tooling API. Use when you need to add a new field (Text, Number, Checkbox, Date, Picklist, Lookup, etc.) to any standard or custom object without deploying metadata packages. The Tooling API provides direct field creation for rapid development and automation tasks.",
    toolSlug: "SALESFORCE_CREATE_CUSTOM_FIELD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "The display label for the field shown in the Salesforce UI.",
        },
        scale: {
          type: "integer",
          description: "Number of decimal places for Number, Currency, or Percent fields. Must be less than precision.",
        },
        length: {
          type: "integer",
          description: "Maximum character length for Text fields. Required for Text type, max 255 characters. Not applicable for LongTextArea.",
        },
        unique: {
          type: "boolean",
          description: "If true, enforce that all values in this field are unique across all records (case-insensitive by default).",
        },
        required: {
          type: "boolean",
          description: "If true, this field must be populated when creating or editing records.",
        },
        precision: {
          type: "integer",
          description: "Total number of digits for Number, Currency, or Percent fields (including decimal places). Maximum is 18.",
        },
        field_type: {
          type: "string",
          description: "The type of custom field to create. Common types: Text (string up to 255 chars), LongTextArea (larger text), Number (integer or decimal), Checkbox (boolean), Date, DateTime, Picklist (single-select dropdown), MultiselectPicklist (multi-select), Lookup (relationship to another object), Email, Phone, Url, Currency, Percent.",
          enum: [
            "Text",
            "LongTextArea",
            "Number",
            "Checkbox",
            "Date",
            "DateTime",
            "Picklist",
            "MultiselectPicklist",
            "Lookup",
            "Email",
            "Phone",
            "Url",
            "Currency",
            "Percent",
          ],
        },
        restricted: {
          type: "boolean",
          description: "For Picklist/MultiselectPicklist fields, if true restricts values to only those defined in the picklist (no custom values allowed).",
        },
        description: {
          type: "string",
          description: "Optional description of the field's purpose and usage.",
        },
        external_id: {
          type: "boolean",
          description: "If true, marks this field as an external ID for integration purposes (allows upsert operations and improves query performance).",
        },
        reference_to: {
          type: "string",
          description: "For Lookup fields, the API name of the object this field references (e.g., 'Account', 'Contact', 'CustomObject__c').",
        },
        default_value: {
          type: "string",
          description: "Default value for the field. Format depends on field type (e.g., 'true'/'false' for Checkbox, date string for Date fields).",
        },
        visible_lines: {
          type: "integer",
          description: "Number of visible lines for LongTextArea fields in the UI. Typically 3-10.",
        },
        check_existing: {
          type: "boolean",
          description: "If true, checks if the field already exists before attempting creation. Prevents errors when field is already present.",
        },
        field_api_name: {
          type: "string",
          description: "The API name for the new custom field. Must end with '__c' for custom fields (e.g., 'Customer_Tier__c', 'Priority_Level__c').",
        },
        object_api_name: {
          type: "string",
          description: "The API name of the Salesforce object to add the field to (e.g., 'Account', 'Contact', 'Opportunity', or a custom object like 'Invoice__c').",
        },
        picklist_values: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              label: {
                type: "string",
                description: "The display label for this picklist value. If not specified, uses fullName as the label.",
              },
              default: {
                type: "boolean",
                description: "If true, this value is the default selection for the picklist field.",
              },
              full_name: {
                type: "string",
                description: "The API name/value of the picklist entry (e.g., 'Option1', 'High', 'Active').",
              },
            },
            description: "A single picklist value with its label and optional default setting.",
          },
          description: "List of picklist values for Picklist or MultiselectPicklist fields. Each value must have at minimum a fullName.",
        },
        inline_help_text: {
          type: "string",
          description: "Optional help text shown as a tooltip when users hover over the field in the UI.",
        },
        relationship_name: {
          type: "string",
          description: "For Lookup fields, the API name for the relationship (used in queries). If not specified, Salesforce auto-generates one.",
        },
        visible_lines_picklist: {
          type: "integer",
          description: "For MultiselectPicklist fields, number of visible lines to display in the UI.",
        },
      },
      required: [
        "object_api_name",
        "field_api_name",
        "field_type",
        "label",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "custom_fields",
    ],
    askBefore: [
      "Confirm the parameters before executing Create custom field.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_create_custom_object",
    description: "Tool to create a custom object in Salesforce using the Metadata API. Use when you need to dynamically create new object types (tables) in Salesforce with custom fields and configurations.",
    toolSlug: "SALESFORCE_CREATE_CUSTOM_OBJECT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "The display label for the custom object shown in the Salesforce UI (singular form).",
        },
        full_name: {
          type: "string",
          description: "The API name of the custom object. Must end with '__c' suffix (e.g., 'Invoice__c', 'Student__c'). This is the unique identifier for the object in Salesforce.",
        },
        name_field: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "The type of the name field. Use 'Text' for a standard text field or 'AutoNumber' for an auto-incrementing number field.",
              enum: [
                "Text",
                "AutoNumber",
              ],
            },
            label: {
              type: "string",
              description: "The label displayed for the name field in the Salesforce UI.",
            },
            display_format: {
              type: "string",
              description: "Format for AutoNumber fields (e.g., 'INV-{0000}'). Only used when type is 'AutoNumber'. The {0000} represents the auto-incrementing number with leading zeros.",
            },
            starting_number: {
              type: "integer",
              description: "Starting number for AutoNumber fields. Only used when type is 'AutoNumber'. Defaults to 1 if not specified.",
            },
          },
          description: "Configuration for the name field of the custom object. Every custom object requires a name field.",
        },
        description: {
          type: "string",
          description: "Optional description of the custom object's purpose and usage.",
        },
        plural_label: {
          type: "string",
          description: "The plural form of the label shown in the Salesforce UI when referring to multiple records.",
        },
        sharing_model: {
          type: "string",
          description: "Defines default record-level sharing. 'ReadWrite' allows all users to read and edit, 'Read' allows read-only access, 'Private' restricts to owner only, 'ControlledByParent' inherits from parent object.",
          enum: [
            "ReadWrite",
            "Read",
            "Private",
            "ControlledByParent",
          ],
        },
        enable_reports: {
          type: "boolean",
          description: "If true, enables reporting on this object. Allows users to create reports and dashboards with this object's data.",
        },
        deployment_status: {
          type: "string",
          description: "Deployment status of the custom object. 'Deployed' makes it available to all users, 'InDevelopment' restricts access to admins and developers only.",
          enum: [
            "Deployed",
            "InDevelopment",
          ],
        },
        enable_activities: {
          type: "boolean",
          description: "If true, enables tasks and events for this object. Allows users to track activities related to records.",
        },
      },
      required: [
        "full_name",
        "label",
        "plural_label",
        "name_field",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "custom_objects",
    ],
    askBefore: [
      "Confirm the parameters before executing Create custom object.",
    ],
  }),
  composioTool({
    name: "salesforce_create_lead",
    description: "Creates a new lead in Salesforce. `LastName` and `Company` are required. Org-level validation rules (e.g., email format, custom required fields) may reject requests beyond these; inspect the error response body for the failing field. The created lead `id` is returned in a response wrapper, not at the top level.",
    toolSlug: "SALESFORCE_CREATE_LEAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        City: {
          type: "string",
          description: "Lead's city.",
        },
        Email: {
          type: "string",
          description: "Lead's email address.",
        },
        Phone: {
          type: "string",
          description: "Lead's phone number.",
        },
        State: {
          type: "string",
          description: "Lead's state/province.",
        },
        Title: {
          type: "string",
          description: "Lead's job title. Maximum length is 128 characters.",
        },
        Rating: {
          type: "string",
          description: "Lead rating.",
        },
        Status: {
          type: "string",
          description: "Lead status.",
        },
        Street: {
          type: "string",
          description: "Lead's street address.",
        },
        Company: {
          type: "string",
          description: "Lead's company name. Required - must be provided to create a lead.",
        },
        Country: {
          type: "string",
          description: "Lead's country.",
        },
        Website: {
          type: "string",
          description: "Lead's company website.",
        },
        Industry: {
          type: "string",
          description: "Lead's industry.",
        },
        LastName: {
          type: "string",
          description: "Lead's last name. Required - must be provided to create a lead.",
        },
        FirstName: {
          type: "string",
          description: "Lead's first name.",
        },
        LeadSource: {
          type: "string",
          description: "Source of the lead.",
        },
        PostalCode: {
          type: "string",
          description: "Lead's postal/zip code.",
        },
        CustomFields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Level__c', 'Languages__c'). Use this to set any custom fields defined in your Salesforce org.",
        },
        AnnualRevenue: {
          type: "number",
          description: "Lead's company annual revenue.",
        },
        allow_duplicates: {
          type: "boolean",
          description: "When True, allows creating duplicate leads even if Salesforce duplicate detection rules are triggered. When False (default), creation fails if duplicates are detected and returns duplicate information in the response.",
        },
        NumberOfEmployees: {
          type: "integer",
          description: "Number of employees at lead's company.",
        },
      },
      required: [
        "LastName",
        "Company",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create lead.",
    ],
  }),
  composioTool({
    name: "salesforce_create_note",
    description: "Creates a new note attached to a Salesforce record with the specified title and content. Does not deduplicate — identical calls create duplicate notes. High-volume creation can trigger REQUEST_LIMIT_EXCEEDED; apply exponential backoff on retries.",
    toolSlug: "SALESFORCE_CREATE_NOTE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "string",
          description: "Body/content of the note. Can contain detailed text information.",
        },
        title: {
          type: "string",
          description: "Title of the note (required field in Salesforce).",
        },
        owner_id: {
          type: "string",
          description: "ID of the user who will own the note. Defaults to the current user if not specified.",
        },
        parent_id: {
          type: "string",
          description: "ID of the record to attach the note to (required field in Salesforce). Can be any record that supports notes like Account, Contact, Lead, Opportunity, etc.",
        },
        is_private: {
          type: "boolean",
          description: "Whether the note should be private (only visible to owner and users with Modify All Data permission).",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Priority__c', 'Category__c'). Use this to set any custom fields defined on the Note object in your Salesforce org.",
        },
      },
      required: [
        "parent_id",
        "title",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create note.",
    ],
  }),
  composioTool({
    name: "salesforce_create_opportunity",
    description: "Creates a new opportunity in Salesforce with the specified information.",
    toolSlug: "SALESFORCE_CREATE_OPPORTUNITY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Opportunity name (required field in Salesforce).",
        },
        type: {
          type: "string",
          description: "Type of opportunity.",
        },
        amount: {
          type: "number",
          description: "Estimated total sale amount.",
        },
        next_step: {
          type: "string",
          description: "Description of next step in sales process.",
        },
        account_id: {
          type: "string",
          description: "ID of the Account this opportunity is associated with. Omitting leaves the opportunity orphaned and excluded from account-based reports.",
        },
        close_date: {
          type: "string",
          description: "Expected close date in YYYY-MM-DD format (required field in Salesforce).",
        },
        contact_id: {
          type: "string",
          description: "Deprecated: Salesforce Opportunity does not have a writable ContactId field. Contact-to-Opportunity associations must be managed through OpportunityContactRole. This parameter is accepted but ignored.",
        },
        stage_name: {
          type: "string",
          description: "Current stage of the opportunity (required field in Salesforce).",
        },
        description: {
          type: "string",
          description: "Text description of the opportunity.",
        },
        lead_source: {
          type: "string",
          description: "Source of the opportunity.",
        },
        probability: {
          type: "number",
          description: "Percentage probability of closing (0-100).",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Custom_Field__c'). Values are subject to org-level validation rules; invalid values raise FIELD_CUSTOM_VALIDATION_EXCEPTION.",
        },
        pricebook2_id: {
          type: "string",
          description: "ID of the price book for this opportunity.",
        },
      },
      required: [
        "name",
        "close_date",
        "stage_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create opportunity.",
    ],
  }),
  composioTool({
    name: "salesforce_create_s_object_record",
    description: "Tool to create a new Salesforce SObject record. Use when you need to create any type of standard or custom Salesforce object record by specifying the object type and field values.",
    toolSlug: "SALESFORCE_CREATE_S_OBJECT_RECORD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of field API names and their values to set on the new record. Keys must be valid field API names for the specified object type. Required fields for the object must be included. Custom field names typically end with '__c'.",
        },
        sobject_type: {
          type: "string",
          description: "The API name of the Salesforce object type to create (e.g., 'Account', 'Contact', 'Opportunity', 'Lead', 'Case', 'Task'). This is case-sensitive and must match the exact API name in Salesforce.",
        },
      },
      required: [
        "sobject_type",
        "fields",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create SObject record.",
    ],
  }),
  composioTool({
    name: "salesforce_create_sobject_tree",
    description: "Tool to create one or more sObject trees with root records of the specified type. Use when creating nested parent-child record hierarchies in a single atomic operation (e.g., Account with Contacts and Opportunities). Supports up to 200 total records across all trees, up to 5 levels deep, with maximum 5 different object types. All records succeed or all fail together.",
    toolSlug: "SALESFORCE_CREATE_SOBJECT_TREE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        records: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of sObject record trees to create. Each record must include 'attributes' object with 'type' (matching sobject_api_name) and 'referenceId' fields, plus any standard or custom field values. Can include nested child records using relationship names (e.g., 'Contacts', 'Opportunities'). Constraints: Maximum 200 total records across all trees, maximum 5 levels deep, maximum 5 different object types.",
        },
        sobject_api_name: {
          type: "string",
          description: "The API name of the sObject type for root records (e.g., Account, Contact, Opportunity). All root records in the request must be of this type.",
        },
      },
      required: [
        "sobject_api_name",
        "records",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "composite_and_tree_apis",
    ],
    askBefore: [
      "Confirm the parameters before executing Create sObject tree.",
    ],
  }),
  composioTool({
    name: "salesforce_create_task",
    description: "Creates a new task in Salesforce to track activities, to-dos, and follow-ups related to contacts, leads, or other records. Ensure who_id, what_id, and owner_id reference existing records before calling; invalid IDs cause silent linkage failures or validation errors.",
    toolSlug: "SALESFORCE_CREATE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        status: {
          type: "string",
          description: "Status of the task. Must be a valid picklist value; arbitrary strings trigger validation errors.",
        },
        who_id: {
          type: "string",
          description: "ID of the Contact or Lead this task is associated with. Only accepts Contact IDs (prefix '003') or Lead IDs (prefix '00Q'). Do NOT use Account/Opportunity/Case IDs here; use what_id for those. Swapping who_id and what_id creates orphaned tasks that won't appear on contact/lead timelines. Accepts only a single ID; create separate task records for multiple contacts.",
        },
        subject: {
          type: "string",
          description: "Subject/title of the task.",
        },
        what_id: {
          type: "string",
          description: "ID of the related record (Account, Opportunity, Case, etc.) this task is associated with. Accepts Account IDs (prefix '001'), Opportunity IDs (prefix '006'), Case IDs (prefix '500'), and other business object IDs.",
        },
        owner_id: {
          type: "string",
          description: "ID of the user who owns the task. Defaults to current user if not specified.",
        },
        priority: {
          type: "string",
          description: "Priority level of the task.",
        },
        description: {
          type: "string",
          description: "Detailed description or notes for the task.",
        },
        activity_date: {
          type: "string",
          description: "Due date for the task in YYYY-MM-DD format. Do not use full datetimes or natural-language strings like 'yesterday'; only YYYY-MM-DD is accepted.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Priority_Level__c': 'Critical').",
        },
        is_reminder_set: {
          type: "boolean",
          description: "Whether to set a reminder for this task.",
        },
        reminder_date_time: {
          type: "string",
          description: "Date and time for the reminder in ISO format (YYYY-MM-DDTHH:MM:SS). Required if is_reminder_set is true. Interpreted according to org/user timezone, not UTC.",
        },
        composio_execution_message: {
          type: "string",
          description: "Internal field used to communicate processing details.",
        },
      },
      required: [
        "subject",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Create task.",
    ],
  }),
  composioTool({
    name: "salesforce_delete_account",
    description: "Permanently deletes an account from Salesforce. This action cannot be undone.",
    toolSlug: "SALESFORCE_DELETE_ACCOUNT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        account_id: {
          type: "string",
          description: "The Salesforce ID of the account to delete.",
        },
      },
      required: [
        "account_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete account.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_campaign",
    description: "Permanently deletes a campaign from Salesforce. This action cannot be undone.",
    toolSlug: "SALESFORCE_DELETE_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The Salesforce ID of the campaign to delete.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete campaign.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_contact",
    description: "Permanently deletes a contact from Salesforce. This action cannot be undone. Associated records (activities, opportunities) lose the contact reference upon deletion — ensure related data is migrated or acceptable to lose before proceeding. Returns HTTP 204 with empty body on success.",
    toolSlug: "SALESFORCE_DELETE_CONTACT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contact_id: {
          type: "string",
          description: "The Salesforce ID of the contact to delete.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete contact.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_file",
    description: "Tool to permanently delete a file from Salesforce. Use when you need to remove a file and its content. This operation cannot be undone.",
    toolSlug: "SALESFORCE_DELETE_FILE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file_id: {
          type: "string",
          description: "The unique identifier (ID) of the file to delete in Salesforce.",
        },
      },
      required: [
        "file_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "files_and_collaboration",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete file.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_job_query",
    description: "Tool to delete a Salesforce Bulk API v2 query job. Use when you need to permanently remove a job and its associated data. Only the user who created the job can delete it, and the job must be in a completed state.",
    toolSlug: "SALESFORCE_DELETE_JOB_QUERY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the Bulk API v2 query job to delete. Job must be in one of these states: JobComplete, Aborted, Failed, or UploadComplete.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "bulk_data_jobs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete job query.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_lead",
    description: "Permanently deletes a lead from Salesforce. This action cannot be undone.",
    toolSlug: "SALESFORCE_DELETE_LEAD",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lead_id: {
          type: "string",
          description: "The Salesforce ID of the lead to delete.",
        },
      },
      required: [
        "lead_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete lead.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_note",
    description: "Permanently deletes a note from Salesforce. This action cannot be undone.",
    toolSlug: "SALESFORCE_DELETE_NOTE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        note_id: {
          type: "string",
          description: "The Salesforce ID of the note to delete.",
        },
      },
      required: [
        "note_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete note.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_opportunity",
    description: "Permanently deletes an opportunity from Salesforce. This action cannot be undone.",
    toolSlug: "SALESFORCE_DELETE_OPPORTUNITY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        opportunity_id: {
          type: "string",
          description: "The Salesforce ID of the opportunity to delete.",
        },
      },
      required: [
        "opportunity_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete opportunity.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_sobject",
    description: "Tool to delete a single Salesforce record by its ID. Use when you need to permanently remove a specific record from Salesforce. This operation is idempotent - deleting the same record multiple times returns success. Works with standard and custom objects.",
    toolSlug: "SALESFORCE_DELETE_SOBJECT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the record to delete. Must be a valid 15 or 18-character Salesforce ID format.",
        },
        sobject_name: {
          type: "string",
          description: "The API name of the Salesforce object (sObject) to delete. Examples: Account, Contact, Opportunity, CustomObject__c. Must be a valid sObject type with proper permissions.",
        },
      },
      required: [
        "sobject_name",
        "id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete sObject record.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_delete_sobject_collections",
    description: "Tool to delete up to 200 records in one request with optional rollback. Use when you need to delete multiple records efficiently, reducing API calls.",
    toolSlug: "SALESFORCE_DELETE_SOBJECT_COLLECTIONS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of record IDs to delete. Can specify up to 200 record IDs. Each ID should be a valid 15 or 18-character Salesforce ID.",
        },
        all_or_none: {
          type: "boolean",
          description: "Specifies whether the operation should roll back if any record fails. When true, all records must be successfully deleted or the entire operation rolls back (atomic transaction). When false (default), partial success is allowed - successfully deleted records are committed even if some deletions fail.",
        },
      },
      required: [
        "ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "composite_and_tree_apis",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete multiple records (SObject Collections).",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_execute_sobject_quick_action",
    description: "Tool to execute a specific quick action on an sObject to create records with pre-configured defaults. Use when you need to leverage Salesforce Quick Actions to streamline record creation with field mappings and default values.",
    toolSlug: "SALESFORCE_EXECUTE_SOBJECT_QUICK_ACTION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record: {
          type: "object",
          additionalProperties: true,
          description: "Object containing field data for the record to be created. Field names and types depend on the target sObject and quick action configuration. Common fields include: Subject, Description, Status, Priority, etc.",
        },
        sobject: {
          type: "string",
          description: "The API name of the sObject type (e.g., 'Account', 'Contact', 'Task', 'Lead', 'Case').",
        },
        context_id: {
          type: "string",
          description: "The ID of the context record. For object-specific actions, this provides the parent/related record context for the action execution.",
        },
        action_name: {
          type: "string",
          description: "The API name of the quick action to execute (e.g., 'LogACall', 'NewTask', 'NewChildCase').",
        },
      },
      required: [
        "sobject",
        "action_name",
        "record",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Execute sObject Quick Action.",
    ],
  }),
  composioTool({
    name: "salesforce_execute_sosl_search",
    description: "Execute a SOSL search to search across multiple Salesforce objects. Use when you need to search for text across multiple object types simultaneously.",
    toolSlug: "SALESFORCE_EXECUTE_SOSL_SEARCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "SOSL search query string to execute. Must follow SOSL syntax with FIND clause. Special characters and spaces must be URL-encoded. Example: 'FIND {Acme} IN ALL FIELDS RETURNING Account(Name, Phone), Contact(FirstName, LastName)'",
        },
      },
      required: [
        "q",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_get_a_batch_of_records",
    description: "Tool to retrieve multiple Salesforce records in a single request with customizable field selection. Use when you need to fetch data for multiple records at once (up to 200 records).",
    toolSlug: "SALESFORCE_GET_A_BATCH_OF_RECORDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Comma-separated list of qualified field names to retrieve. Format: ObjectApiName.FieldName (e.g., 'Account.Name,Account.Phone'). If the user doesn't have access to a field, an error occurs. Either fields or optionalFields must be provided.",
        },
        record_ids: {
          type: "string",
          description: "Comma-separated list of record IDs to retrieve. All record IDs must be from supported objects. Maximum 200 records per request.",
        },
        optional_fields: {
          type: "string",
          description: "Comma-separated list of qualified optional field names. Format: ObjectApiName.FieldName (e.g., 'Account.AnnualRevenue'). If the user doesn't have access to an optional field, it's excluded from the response without error. Can be used with fields parameter. Either fields or optionalFields must be provided.",
        },
      },
      required: [
        "record_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_account",
    description: "Retrieves a specific account by ID from Salesforce, returning all available fields.",
    toolSlug: "SALESFORCE_GET_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        account_id: {
          type: "string",
          description: "The Salesforce ID of the account to retrieve.",
        },
      },
      required: [
        "account_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_all_custom_objects",
    description: "Retrieves all Salesforce objects (standard and custom) with detailed metadata. Each object includes a 'custom' field to identify custom objects. Use when you need to discover available objects or their capabilities.",
    toolSlug: "SALESFORCE_GET_ALL_CUSTOM_OBJECTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number to retrieve (1-indexed). Defaults to 1. Must be at least 1.",
        },
        page_size: {
          type: "integer",
          description: "Number of objects to return per page. Defaults to 50. Must be between 1 and 200 (inclusive).",
        },
        custom_only: {
          type: "boolean",
          description: "If true, only returns custom objects (objects where custom=true). Defaults to false.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_all_fields_for_object",
    description: "Retrieves all fields (standard and custom) for a Salesforce object with complete metadata including field types, constraints, picklist values, and relationships.",
    toolSlug: "SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        object_name: {
          type: "string",
          description: "API name of the Salesforce object to describe. Use standard object names (Account, Contact, Lead, Opportunity) or custom object API names ending in __c.",
        },
      },
      required: [
        "object_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_all_navigation_items",
    description: "Gets all navigation items (tabs) that the user has access to. Use when you need to retrieve available navigation tabs for display or navigation purposes.",
    toolSlug: "SALESFORCE_GET_ALL_NAVIGATION_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page offset for paginated results. Default is 0. For example, page=2 with pageSize=10 returns items starting at position 21.",
        },
        pageSize: {
          type: "integer",
          description: "Maximum number of navigation items to return per page. Default is 25.",
        },
        formFactor: {
          type: "string",
          description: "Specifies the display size. Valid values: 'Large' (desktop, default), 'Medium' (tablet), or 'Small' (phone). Determines which navigation items are returned based on the form factor.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        navItemNames: {
          type: "string",
          description: "Comma-delimited list of TabDefinition name values to include in the response. If omitted, all navigation items for the specified form factor are returned.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_api",
    description: "Tool to discover available REST API resources for a specified Salesforce API version. Use when you need to find available endpoints and their URIs for a specific API version.",
    toolSlug: "SALESFORCE_GET_API",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        version: {
          type: "string",
          description: "The Salesforce API version to query in format vXX.X (e.g., v62.0, v66.0). If not provided, uses the version from the authenticated connection.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_app",
    description: "Tool to get metadata about a specific Salesforce app by ID. Use when you need to retrieve app configuration details and navigation items for a particular application.",
    toolSlug: "SALESFORCE_GET_APP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        app_id: {
          type: "string",
          description: "The 18-character ID of the app or the API name (developerName) of the app to retrieve.",
        },
        form_factor: {
          type: "string",
          description: "Specifies the device form factor for which to retrieve app metadata. 'Large' for desktop/web client (default), 'Medium' for tablet client, 'Small' for phone/mobile client.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
      },
      required: [
        "app_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_apps",
    description: "Tool to get metadata for all apps a user has access to. Use when you need to list available Salesforce applications or check app navigation items. Metadata for the selected app includes tabs on the app's navigation bar, while other apps don't include tab details.",
    toolSlug: "SALESFORCE_GET_APPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        form_factor: {
          type: "string",
          description: "Specifies the form factor of the hardware/device the browser is running on. Determines which navigation items and metadata are returned. 'Large' for desktop/laptop, 'Medium' for tablets, 'Small' for mobile phones.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_campaign",
    description: "Retrieves a specific campaign by ID from Salesforce, returning all available fields.",
    toolSlug: "SALESFORCE_GET_CAMPAIGN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The Salesforce ID of the campaign to retrieve.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_chatter_resources",
    description: "Tool to access Chatter resources directory. Use when you need to discover available Chatter feeds, groups, users, email digest controls, emojis, extensions, or streams.",
    toolSlug: "SALESFORCE_GET_CHATTER_RESOURCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "files_and_collaboration",
    ],
  }),
  composioTool({
    name: "salesforce_get_child_records",
    description: "Tool to get child records for a specified parent record and child relationship name. Use when you need to retrieve related records from a parent-child relationship in Salesforce, such as getting all Contacts for an Account or all Opportunities for an Account. Results are paginated with configurable page size.",
    toolSlug: "SALESFORCE_GET_CHILD_RECORDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Comma-separated list of API names of the related list's column fields to query. Supports spanning relationships in the format ObjectApiName.ChildRelationshipName.FieldApiName (e.g., Opportunity.Account.BillingAddress). If not specified, default fields are returned.",
        },
        page_size: {
          type: "integer",
          description: "The number of list records to return per page. The default value is 5 and the value can be 1-2000.",
        },
        record_id: {
          type: "string",
          description: "The unique 18-character Salesforce ID of the parent record. This is the record whose child records you want to retrieve.",
        },
        page_token: {
          type: "string",
          description: "Token for pagination, used to navigate to a specific page of results. Obtained from the response's nextPageToken or previousPageToken fields.",
        },
        optional_fields: {
          type: "string",
          description: "Comma-separated list of additional field API names in the related list to query. These are additional fields queried for the records returned that don't create visible columns. If the field is not available to the user, no error occurs.",
        },
        relationship_name: {
          type: "string",
          description: "The API name of the child relationship (typically the plural form of the child object name). Common examples include 'Contacts', 'Opportunities', 'Cases', 'Tasks'.",
        },
      },
      required: [
        "record_id",
        "relationship_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_compact_layouts",
    description: "Tool to retrieve compact layout information for multiple Salesforce objects. Use when you need to display object data in compact form for Lightning Experience, mobile apps, or custom interfaces.",
    toolSlug: "SALESFORCE_GET_COMPACT_LAYOUTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        object_list: {
          type: "string",
          description: "Comma-separated list of Salesforce object names to retrieve compact layouts for (e.g., 'Account', 'Account,Contact', 'Account,Contact,Lead').",
        },
      },
      required: [
        "object_list",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_composite_resources",
    description: "Tool to retrieve a list of available composite resources in Salesforce. Use when you need to discover which composite API endpoints are available for batch operations.",
    toolSlug: "SALESFORCE_GET_COMPOSITE_RESOURCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "composite_and_tree_apis",
    ],
  }),
  composioTool({
    name: "salesforce_get_composite_sobjects",
    description: "Retrieves multiple records of the same object type by IDs with a request body. Use when you need to retrieve more records than URL length limits allow (up to 2000 records vs ~800 via GET).",
    toolSlug: "SALESFORCE_GET_COMPOSITE_SOBJECTS",
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
          description: "Array of record IDs to retrieve. Maximum 2000 IDs per request.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of field names to retrieve for each record. Specifies which fields to return in the response.",
        },
        sobject_name: {
          type: "string",
          description: "The sObject type name (e.g., 'Account', 'Contact', 'Lead', 'Opportunity'). This specifies which type of records to retrieve.",
        },
      },
      required: [
        "sobject_name",
        "ids",
        "fields",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "composite_and_tree_apis",
    ],
  }),
  composioTool({
    name: "salesforce_get_consent_action",
    description: "Tool to retrieve aggregated consent preferences across multiple records for a specific action. Use when you need to check if users have consented to email, tracking, fax, or other actions across Contact, Lead, User, Person Account, or Individual objects.",
    toolSlug: "SALESFORCE_GET_CONSENT_ACTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ids: {
          type: "string",
          description: "A comma-separated list of identifiers (email addresses or record IDs) for which consent data is being requested. These can be IDs of Lead, Contact, User, Person Account, or Individual records.",
        },
        action: {
          type: "string",
          description: "The consent action to check. Common values include 'email', 'track', 'fax', or 'shouldForget'. This determines what type of consent preference is being queried.",
        },
      },
      required: [
        "action",
        "ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "security_and_compliance",
    ],
  }),
  composioTool({
    name: "salesforce_get_contact",
    description: "Retrieves a specific contact by ID from Salesforce, returning all available fields.",
    toolSlug: "SALESFORCE_GET_CONTACT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Comma-delimited string of Contact field API names to retrieve. If omitted, all fields are returned.",
        },
        contact_id: {
          type: "string",
          description: "The Salesforce ID of the contact to retrieve. Must be a valid 18-character Salesforce ID; names or emails are not valid substitutes.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_contact_by_id",
    description: "Retrieves a Salesforce Contact by its unique ID; the ID must correspond to an existing Contact record in Salesforce.",
    toolSlug: "SALESFORCE_GET_CONTACT_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique Salesforce ID of the Contact record to retrieve.",
        },
        fields: {
          type: "string",
          description: "Comma-delimited string of Contact field API names to retrieve. If omitted, a default set of fields is returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_dashboard",
    description: "Gets detailed metadata for a specific dashboard including its components, layout, and filters.",
    toolSlug: "SALESFORCE_GET_DASHBOARD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dashboard_id: {
          type: "string",
          description: "The Salesforce ID of the dashboard to retrieve.",
        },
      },
      required: [
        "dashboard_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "support_knowledge_and_analytics",
    ],
  }),
  composioTool({
    name: "salesforce_get_file_content",
    description: "Returns the binary content of a Salesforce file, including references to external files. Use when you need to download or retrieve the actual file data from Salesforce.",
    toolSlug: "SALESFORCE_GET_FILE_CONTENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file_id: {
          type: "string",
          description: "The 18-character Salesforce ID of the ContentDocument or ContentVersion file to retrieve.",
        },
        version_id: {
          type: "string",
          description: "Specifies a particular version of the file to retrieve. If not specified, returns the latest version.",
        },
        rendition_type: {
          type: "string",
          description: "Specifies the type of file rendition to return. Available values: THUMB120BY90, THUMB240BY180, THUMB720BY480, SVGZ, ORIGINAL_<File_Extension>.",
        },
      },
      required: [
        "file_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "files_and_collaboration",
    ],
  }),
  composioTool({
    name: "salesforce_get_file_information",
    description: "Tool to retrieve comprehensive metadata and information about a specified file in Salesforce. Use when you need detailed file information including ownership, sharing settings, download URLs, and rendition status.",
    toolSlug: "SALESFORCE_GET_FILE_INFORMATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file_id: {
          type: "string",
          description: "The unique identifier for the file - 18-character Salesforce ID (ContentDocument ID or ContentVersion ID). Example: 069xx000000001AAAQ",
        },
      },
      required: [
        "file_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "files_and_collaboration",
    ],
  }),
  composioTool({
    name: "salesforce_get_file_shares",
    description: "Returns information about the objects with which the specified file has been shared. Use when you need to understand who has access to a specific file in Salesforce.",
    toolSlug: "SALESFORCE_GET_FILE_SHARES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file_id: {
          type: "string",
          description: "The 18-character Salesforce ID of the ContentDocument (file) for which to retrieve share information.",
        },
      },
      required: [
        "file_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "files_and_collaboration",
    ],
  }),
  composioTool({
    name: "salesforce_get_global_actions",
    description: "Tool to retrieve actions displayed in the Salesforce Global Actions menu with metadata. Use when you need to discover available global actions, quick actions, or custom buttons in the UI.",
    toolSlug: "SALESFORCE_GET_GLOBAL_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        apiNames: {
          type: "string",
          description: "Comma-separated list of action API names to filter results (e.g., 'NewTask,NewEvent,LogACall').",
        },
        formFactor: {
          type: "string",
          description: "Device form factor to filter actions. Valid values: 'Large' (Desktop), 'Medium' (Tablet), 'Small' (Mobile).",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        actionTypes: {
          type: "string",
          description: "Comma-separated list of action types to filter (e.g., 'StandardButton,QuickAction,CustomButton,ProductivityAction').",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_job_failed_record_results",
    description: "Tool to retrieve failed records from a Salesforce Bulk API 2.0 ingest job. Use when you need to get records that failed during a bulk operation, including error messages and original data.",
    toolSlug: "SALESFORCE_GET_JOB_FAILED_RECORD_RESULTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the bulk ingest job.",
        },
        locator: {
          type: "string",
          description: "Pagination token from the Sforce-Locator response header of a previous request, used to retrieve the next set of results.",
        },
        max_records: {
          type: "integer",
          description: "The maximum number of records to retrieve per page. If omitted, the API returns the maximum number of records it can send in a single page.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "bulk_data_jobs",
    ],
  }),
  composioTool({
    name: "salesforce_get_job_successful_record_results",
    description: "Tool to retrieve successfully processed records from a Salesforce Bulk API 2.0 ingest job. Use when you need to get records that were successfully created or updated during a bulk operation.",
    toolSlug: "SALESFORCE_GET_JOB_SUCCESSFUL_RECORD_RESULTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the bulk ingest job.",
        },
        locator: {
          type: "string",
          description: "Pagination token from the Sforce-Locator response header of a previous request, used to retrieve the next set of results.",
        },
        max_records: {
          type: "integer",
          description: "The maximum number of records to retrieve per page. If omitted, the API returns the maximum number of records it can send in a single page.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "bulk_data_jobs",
    ],
  }),
  composioTool({
    name: "salesforce_get_job_unprocessed_record_results",
    description: "Tool to retrieve unprocessed records from a Salesforce Bulk API 2.0 ingest job. Use when you need to get records that were not processed during a bulk operation, typically due to job abortion or interruption.",
    toolSlug: "SALESFORCE_GET_JOB_UNPROCESSED_RECORD_RESULTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the bulk ingest job.",
        },
        locator: {
          type: "string",
          description: "Pagination token from the Sforce-Locator response header of a previous request, used to retrieve the next set of results.",
        },
        max_records: {
          type: "integer",
          description: "The maximum number of records to retrieve per page. If omitted, the API returns the maximum number of records it can send in a single page.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "bulk_data_jobs",
    ],
  }),
  composioTool({
    name: "salesforce_get_last_selected_app",
    description: "Retrieves the app the current user last selected or the app the user sees by default. Use when you need to determine which application the user is currently working in or should be using.",
    toolSlug: "SALESFORCE_GET_LAST_SELECTED_APP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        formFactor: {
          type: "string",
          description: "Specifies the form factor of the hardware the browser is running on. 'Large' for desktop, 'Medium' for tablet, 'Small' for mobile. If not specified, returns metadata suitable for the current context.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_lead",
    description: "Retrieves a specific lead by ID from Salesforce, returning all available fields.",
    toolSlug: "SALESFORCE_GET_LEAD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lead_id: {
          type: "string",
          description: "The Salesforce ID of the lead to retrieve. Must be a Salesforce record ID (18-char format like '00QWd000005V3RmMAK'); names, emails, or external codes are not accepted — resolve to a Salesforce ID first using a search or query tool.",
        },
      },
      required: [
        "lead_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_list_view_actions",
    description: "Tool to retrieve header actions on list views. Use when you need to get available actions, buttons, and quick actions displayed on a specific list view header in Salesforce.",
    toolSlug: "SALESFORCE_GET_LIST_VIEW_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_view_id: {
          type: "string",
          description: "The 18-character ID or API name of the list view for which to retrieve header actions.",
        },
      },
      required: [
        "list_view_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_list_view_metadata_batch",
    description: "Tool to retrieve metadata for multiple list views in a single batch request. Use when you need to get list view configuration, columns, filters, and sorting for multiple list views at once.",
    toolSlug: "SALESFORCE_GET_LIST_VIEW_METADATA_BATCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_view_ids: {
          type: "string",
          description: "Comma-separated list of list view IDs to retrieve metadata for. Use the 18-character Salesforce list view IDs.",
        },
      },
      required: [
        "list_view_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_list_view_metadata_by_name",
    description: "Returns list view metadata by object and list view API name. Use when you need to retrieve complete metadata information for a specific list view, including display columns, filters, sort order, permissions, and user preferences.",
    toolSlug: "SALESFORCE_GET_LIST_VIEW_METADATA_BY_NAME",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject_api_name: {
          type: "string",
          description: "The API name of a supported Salesforce object.",
        },
        list_view_api_name: {
          type: "string",
          description: "The API name of the list view.",
        },
      },
      required: [
        "sobject_api_name",
        "list_view_api_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_list_view_records_by_id",
    description: "Returns record data for a list view by its ID. Use when you need to retrieve records from a specific Salesforce list view.",
    toolSlug: "SALESFORCE_GET_LIST_VIEW_RECORDS_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Additional fields queried for the records returned. These fields don't create visible columns. If the field is not available to the user, an error occurs.",
        },
        sort_by: {
          type: "string",
          description: "The API name of the field the list view is sorted by. If the name is preceded with '-', the sort order is descending.",
        },
        page_size: {
          type: "integer",
          description: "The number of list records viewed at one time. Default value is 50. Value can be 1-2000.",
        },
        page_token: {
          type: "string",
          description: "A token that represents the page offset used for pagination through result sets.",
        },
        list_view_id: {
          type: "string",
          description: "The ID of the list view to retrieve records from.",
        },
        optional_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Additional fields queried for the records returned. These fields don't create visible columns. If the field is not available to the user, no error occurs and the field isn't included in the records.",
        },
      },
      required: [
        "list_view_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_list_view_records_by_name",
    description: "Retrieves paginated record data for a specified list view using the object and list view API names. Use when you need to fetch records that match a specific list view's filters and sorting criteria. Returns the same data that powers Lightning Experience list views.",
    toolSlug: "SALESFORCE_GET_LIST_VIEW_RECORDS_BY_NAME",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        where: {
          type: "string",
          description: "Filter applied to returned records in GraphQL syntax.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of additional fields to query for the records returned. If a field is not available to the user, an error occurs. Example: 'Industry,AnnualRevenue,Description'",
        },
        sortBy: {
          type: "string",
          description: "The API name of the field to sort by. Prefix with '-' for descending order. Examples: 'Name', '-CreatedDate'",
        },
        pageSize: {
          type: "integer",
          description: "Number of list records to return per page. Default: 50. Valid range: 1-2000.",
        },
        pageToken: {
          type: "string",
          description: "Token representing the page offset for pagination. Obtained from nextPageToken in previous responses.",
        },
        searchTerm: {
          type: "string",
          description: "A search term to filter results. Wildcards are supported.",
        },
        optionalFields: {
          type: "string",
          description: "Comma-separated list of additional fields queried for the records. If a field is not available to the user, no error occurs and the field is not included. Example: 'CustomField__c,Phone'",
        },
        sobject_api_name: {
          type: "string",
          description: "The API name of a supported Salesforce object (e.g., 'Account', 'Contact', 'Opportunity', 'Lead', 'Case').",
        },
        list_view_api_name: {
          type: "string",
          description: "The API name of a list view (e.g., 'AllAccounts', 'MyAccounts') or the 18-character list view ID.",
        },
      },
      required: [
        "sobject_api_name",
        "list_view_api_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_list_view_results",
    description: "Retrieves the results of a list view for a specified sObject. Returns column definitions and record data with a 2,000 record limit per response.",
    toolSlug: "SALESFORCE_GET_LIST_VIEW_RESULTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject: {
          type: "string",
          description: "The API name of the Salesforce object (e.g., 'Account', 'Contact', 'Opportunity').",
        },
        list_view_id: {
          type: "string",
          description: "The unique 18-character ID of the list view to retrieve results from.",
        },
      },
      required: [
        "sobject",
        "list_view_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "list_views_and_mru",
    ],
  }),
  composioTool({
    name: "salesforce_get_lookup_field_suggestions",
    description: "Tool to retrieve lookup field suggestions for editing lookup fields with search filtering. Use when searching for records to populate a lookup field, supporting typeahead, recent, and full-text search.",
    toolSlug: "SALESFORCE_GET_LOOKUP_FIELD_SUGGESTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "Search query string used to filter and find matching records. Use for typeahead search.",
        },
        page: {
          type: "integer",
          description: "Page number for pagination of results.",
        },
        page_size: {
          type: "integer",
          description: "Number of records to return per page.",
        },
        form_factor: {
          type: "string",
          description: "Device form factor: 'Large' for desktop, 'Medium' for tablet, 'Small' for mobile.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        search_type: {
          type: "string",
          description: "Type of search to perform: 'Recent' for most recently used matches, 'Search' for any match in searchable fields, 'TypeAhead' for matching names.",
          enum: [
            "Recent",
            "Search",
            "TypeAhead",
          ],
        },
        field_api_name: {
          type: "string",
          description: "API name of the lookup field on the source object (e.g., 'AccountId', 'OwnerId').",
        },
        object_api_name: {
          type: "string",
          description: "API name of the object containing the lookup field (e.g., 'Opportunity', 'Account', 'Contact').",
        },
        dependent_field_bindings: {
          type: "string",
          description: "Lookup filter bindings for dependent lookups, specified as JSON string with field-value pairs for filtering.",
        },
      },
      required: [
        "object_api_name",
        "field_api_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_lookup_suggestions_case_contact",
    description: "Tool to get lookup field suggestions with POST request. Use when editing lookup fields with dependent lookup filtering or when you need to pass source record context in the request body.",
    toolSlug: "SALESFORCE_GET_LOOKUP_SUGGESTIONS_CASE_CONTACT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "The search term being queried. Used with TypeAhead or Search to find matching records. Leave empty for Recent searches.",
        },
        page: {
          type: "integer",
          description: "The page number for paginated results. Use this to navigate through multiple pages of lookup results.",
        },
        page_size: {
          type: "integer",
          description: "Number of items to return per page. Controls the size of each page in paginated responses.",
        },
        search_type: {
          type: "string",
          description: "The type of search to perform. Valid values: 'Recent' (most recently used), 'TypeAhead' (matching names as user types), 'Search' (full search across searchable fields).",
        },
        source_record: {
          type: "object",
          additionalProperties: true,
          properties: {
            fields: {
              type: "object",
              additionalProperties: true,
              properties: {
                Id: {
                  type: "string",
                  description: "The ID of the source record. Set to null when creating a new record.",
                },
              },
              description: "The fields of the source record, typically containing the Id. Set Id to null when creating a new record.",
            },
            apiName: {
              type: "string",
              description: "The API name of the source object containing the lookup field (e.g., 'Case', 'Opportunity', 'Account').",
            },
          },
          description: "The source record context, including the object API name and fields. Required for dependent lookup filtering.",
        },
        field_api_name: {
          type: "string",
          description: "The API name of the lookup field (e.g., 'ContactId', 'AccountId', 'OwnerId').",
        },
        object_api_name: {
          type: "string",
          description: "The API name of the source object containing the lookup field (e.g., 'Case', 'Opportunity', 'Account').",
        },
        dependent_field_bindings: {
          type: "object",
          additionalProperties: true,
          description: "Bindings for dependent lookup fields to apply contextual filtering based on other field values.",
        },
      },
      required: [
        "object_api_name",
        "field_api_name",
        "source_record",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_mru_list_view_metadata",
    description: "Tool to retrieve MRU list view metadata for a Salesforce object. Use when you need to understand the structure and configuration of the most recently used list view for an object.",
    toolSlug: "SALESFORCE_GET_MRU_LIST_VIEW_METADATA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject_api_name: {
          type: "string",
          description: "The API name of the Salesforce object to retrieve MRU list view metadata for.",
        },
      },
      required: [
        "sobject_api_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_mru_list_view_records",
    description: "Tool to retrieve record data for an object's most recently used (MRU) list view. Use when you need to get the records that a user has recently accessed for a specific Salesforce object type.",
    toolSlug: "SALESFORCE_GET_MRU_LIST_VIEW_RECORDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Comma-separated list of additional fields to query for returned records. An error occurs if a field is unavailable to the user.",
        },
        sort_by: {
          type: "string",
          description: "API name of the field to sort by. Prefix with '-' for descending order (e.g., 'CreatedDate' for ascending, '-CreatedDate' for descending).",
        },
        page_size: {
          type: "integer",
          description: "Number of list records to view at one time. Default is 50, minimum is 1, maximum is 2000.",
        },
        page_token: {
          type: "string",
          description: "Token representing the page offset for pagination to retrieve subsequent pages of results.",
        },
        optional_fields: {
          type: "string",
          description: "Comma-separated list of additional fields to query for returned records. No error occurs if a field is unavailable to the user.",
        },
        sobject_api_name: {
          type: "string",
          description: "The API name of the Salesforce object to retrieve MRU list view records for (e.g., 'Account', 'Contact', 'Opportunity').",
        },
      },
      required: [
        "sobject_api_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_note",
    description: "Retrieves a specific note by ID from Salesforce, returning all available fields. Notes with IsPrivate=true require the integration user to have sufficient permissions; inaccessible private notes will not be returned.",
    toolSlug: "SALESFORCE_GET_NOTE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        note_id: {
          type: "string",
          description: "The Salesforce ID of the note to retrieve.",
        },
      },
      required: [
        "note_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_object_list_views",
    description: "Returns a collection of list views associated with a Salesforce object. Use when you need to discover available list views for an object like Account, Contact, or Opportunity.",
    toolSlug: "SALESFORCE_GET_OBJECT_LIST_VIEWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject_api_name: {
          type: "string",
          description: "The API name of the Salesforce object to retrieve list views for (e.g., Account, Contact, Opportunity).",
        },
      },
      required: [
        "sobject_api_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_opportunity",
    description: "Retrieves a specific opportunity by ID from Salesforce, returning all available fields.",
    toolSlug: "SALESFORCE_GET_OPPORTUNITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Comma-delimited string of Opportunity field API names to retrieve. If omitted, all fields are returned. Custom objects may use non-standard API names for common fields (e.g., primary contact); verify exact field API names and handle null values.",
        },
        opportunity_id: {
          type: "string",
          description: "The Salesforce ID of the opportunity to retrieve. Must be a valid 15 or 18 character alphanumeric Salesforce ID (e.g., '006Wd000005FG3CIAW'). When multiple similarly named opportunities exist in search results, confirm the correct record by `Id` or other key attributes before passing the ID here.",
        },
      },
      required: [
        "opportunity_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_org_limits",
    description: "Tool to retrieve organization limits with max and remaining allocations. Use when you need to check API usage, storage limits, or other resource consumption in Salesforce.",
    toolSlug: "SALESFORCE_GET_ORG_LIMITS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "limits_and_platform_discovery",
    ],
  }),
  composioTool({
    name: "salesforce_get_photo_actions",
    description: "Tool to retrieve available photo actions for Salesforce pages. Use when you need to get photo management actions for user or group pages. Currently, only group and user pages support photo actions.",
    toolSlug: "SALESFORCE_GET_PHOTO_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record_ids: {
          type: "string",
          description: "The record ID(s) for which to retrieve photo actions. Can be a single User ID or Group ID, or comma-separated list of IDs.",
        },
        form_factor: {
          type: "string",
          description: "Specifies the device form factor for which to return actions. Large for Desktop/laptop, Medium for Tablet, Small for Mobile phone screens. If not specified, returns actions for all form factors.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        action_types: {
          type: "string",
          description: "Filters the types of actions to return. Can be a single value or comma-separated list. Valid values: StandardButton, QuickAction, CustomButton, ProductivityAction.",
        },
      },
      required: [
        "record_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_picklist_values_by_record_type",
    description: "Tool to get values for all picklist fields of a record type, including dependent picklists. Use when you need to retrieve available picklist options for a specific object and record type, especially for dependent picklist hierarchies.",
    toolSlug: "SALESFORCE_GET_PICKLIST_VALUES_BY_RECORD_TYPE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record_type_id: {
          type: "string",
          description: "The 18-character Record Type ID. Use '012000000000000AAA' for objects without record types (default record type).",
        },
        sobject_api_name: {
          type: "string",
          description: "The API name of the Salesforce object (e.g., 'Account', 'Contact', 'Opportunity', or custom object like 'Car__c').",
        },
      },
      required: [
        "sobject_api_name",
        "record_type_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_query_job_info",
    description: "Tool to retrieve information about a Salesforce Bulk API v2 query job. Use when you need to check the status and details of a query job.",
    toolSlug: "SALESFORCE_GET_QUERY_JOB_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the Bulk API v2 query job.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "bulk_data_jobs",
    ],
  }),
  composioTool({
    name: "salesforce_get_query_job_results",
    description: "Retrieves results for a completed Bulk API v2 query job in CSV format. Supports pagination for large datasets via maxRecords and locator parameters.",
    toolSlug: "SALESFORCE_GET_QUERY_JOB_RESULTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique 18-character identifier for the query job whose results you want to retrieve.",
        },
        locator: {
          type: "string",
          description: "A Base64-encoded string used for pagination to retrieve the next set of records. This value is obtained from the Sforce-Locator response header of the previous request. Use this to traverse through subsequent pages of results.",
        },
        max_records: {
          type: "integer",
          description: "Defines the number of records to be downloaded per page. If omitted, the API returns the maximum number of records it can send in a single page. Used to control page size for pagination.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "bulk_data_jobs",
    ],
  }),
  composioTool({
    name: "salesforce_get_quick_actions",
    description: "Tool to retrieve global and object-specific quick actions from Salesforce. Use when you need to list all available quick actions in the organization.",
    toolSlug: "SALESFORCE_GET_QUICK_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_get_record_counts",
    description: "Tool to retrieve total record counts for specified Salesforce objects. Use when you need to check storage usage or understand data volume for specific sObjects.",
    toolSlug: "SALESFORCE_GET_RECORD_COUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobjects: {
          type: "string",
          description: "Comma-separated list of Salesforce object API names to retrieve record counts for. Examples: 'Account' for a single object or 'Account,Opportunity,Contact' for multiple objects.",
        },
      },
      required: [
        "sobjects",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "limits_and_platform_discovery",
    ],
  }),
  composioTool({
    name: "salesforce_get_record_edit_page_actions",
    description: "Tool to get available actions on record edit pages. Use when you need to retrieve metadata about actions (standard actions, custom actions, quick actions, productivity actions) displayed on the record edit page for specific records.",
    toolSlug: "SALESFORCE_GET_RECORD_EDIT_PAGE_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record_ids: {
          type: "string",
          description: "Comma-separated list of 18-character Salesforce record IDs for which to retrieve record edit actions. Multiple IDs can be provided to retrieve actions for multiple records in a single request.",
        },
        form_factor: {
          type: "string",
          description: "The device form factor for which to retrieve actions. Valid values: 'Large' (desktop), 'Medium' (tablet), 'Small' (mobile/phone). This affects which actions are returned based on device type.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        action_types: {
          type: "string",
          description: "Comma-separated list of action types to filter results. Common values include: 'Standard', 'Custom', 'QuickAction', 'ProductivityAction', 'DefaultButton'.",
        },
        retrieval_mode: {
          type: "string",
          description: "Specifies how actions should be retrieved to control the retrieval behavior for actions.",
        },
      },
      required: [
        "record_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_related_list_actions",
    description: "Tool to get actions on related lists for record detail pages. Use when you need to retrieve metadata about all available actions (standard buttons, quick actions, custom buttons, and productivity actions) that can be performed on records within a specific related list context.",
    toolSlug: "SALESFORCE_GET_RELATED_LIST_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record_ids: {
          type: "string",
          description: "The 18-character Salesforce ID of the parent record for which to retrieve related list actions.",
        },
        form_factor: {
          type: "string",
          description: "Device form factor to filter actions by device type. 'Large' for desktop, 'Medium' for tablet, 'Small' for mobile.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        action_types: {
          type: "string",
          description: "Comma-separated list of action types to filter results. Valid values: 'StandardButton', 'QuickAction', 'CustomButton', 'ProductivityAction'.",
        },
        retrieval_mode: {
          type: "string",
          description: "Controls data retrieval from cache or server. Specifies how actions should be retrieved.",
        },
        related_list_ids: {
          type: "string",
          description: "The API name of the related list (e.g., 'Contacts', 'Opportunities', 'Cases'). For custom objects, use the plural form with '__r' suffix (e.g., 'Custom_Objects__r').",
        },
      },
      required: [
        "record_ids",
        "related_list_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_related_list_preferences_batch",
    description: "Tool to get a batch of related list user preferences from Salesforce. Use when retrieving display preferences, column widths, or sort orders for multiple related lists simultaneously.",
    toolSlug: "SALESFORCE_GET_RELATED_LIST_PREFERENCES_BATCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        related_list_ids: {
          type: "string",
          description: "Comma-separated list of related list IDs. Each ID follows the format 'objectApiName.relatedListId' (e.g., 'Account.Contacts,Account.Opportunities').",
        },
      },
      required: [
        "related_list_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_related_list_records_contacts",
    description: "Tool to retrieve related list records with request body parameters for filtering and pagination. Use when you need to get records from a related list associated with a parent record with complex query parameters. Returns up to 1,999 records per related list with pagination support.",
    toolSlug: "SALESFORCE_GET_RELATED_LIST_RECORDS_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        where: {
          type: "string",
          description: "Filter to apply to related list records, written in GraphQL syntax (e.g., '{Name: {like: \"A%\"}}'). Note: Semi-joins and anti-joins filters are currently not supported.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The API names of the related list's column fields to query. Supports spanning relationships using dot notation (e.g., 'Opportunity.Account.Name').",
        },
        sort_by: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of field API names to sort the related list by. Important: Despite being an array, it accepts only ONE value per request.",
        },
        page_size: {
          type: "integer",
          description: "The number of list records to return per page. Default: 50. Range: 1-1999.",
        },
        page_token: {
          type: "string",
          description: "Token for pagination to navigate to a specific page of results. Obtained from nextPageToken or previousPageToken in previous responses.",
        },
        optional_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "API names of additional fields in the related list that don't create visible columns. If a field is not available to the user, no error occurs - it's simply omitted from the response.",
        },
        related_list_id: {
          type: "string",
          description: "The API name of the related list or child relationship (e.g., 'Contacts', 'Opportunities', 'Cases'). This is typically the plural form of the object name.",
        },
        parent_record_id: {
          type: "string",
          description: "The 18-character Salesforce ID of the parent record for which to retrieve related lists (e.g., Account ID, Opportunity ID).",
        },
      },
      required: [
        "parent_record_id",
        "related_list_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_s_object_quick_action_default_values",
    description: "Retrieves default field values for a quick action in a specific record context. Use when you need to pre-populate fields when creating related records through quick actions.",
    toolSlug: "SALESFORCE_GET_S_OBJECT_QUICK_ACTION_DEFAULT_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject: {
          type: "string",
          description: "The API name of the sObject type (e.g., Account, Contact, Case, Opportunity).",
        },
        context_id: {
          type: "string",
          description: "The ID of the parent/context record that the action is related to. Used to calculate context-specific default values based on the parent record.",
        },
        action_name: {
          type: "string",
          description: "The API name of the quick action (e.g., LogACall, NewContact, _LightningRelatedContact).",
        },
      },
      required: [
        "sobject",
        "action_name",
        "context_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_get_s_object_record",
    description: "Tool to retrieve a single Salesforce record by ID from any sObject type. Use when you need to get detailed information about a specific record.",
    toolSlug: "SALESFORCE_GET_S_OBJECT_RECORD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Comma-separated list of field names to retrieve from the record. If omitted, all fields are returned. Example: Name,Id,CreatedDate,Industry",
        },
        record_id: {
          type: "string",
          description: "The unique Salesforce record ID (15 or 18 characters). The 3-character prefix indicates the object type (e.g., '001' for Account, '003' for Contact, '00Q' for Lead). Ensure the sobject_api_name matches the record ID prefix.",
        },
        sobject_api_name: {
          type: "string",
          description: "The API name of the Salesforce sObject type (e.g., Account, Contact, Opportunity, Custom__c). Object names are not case-sensitive. Ensure the sObject type matches the record ID prefix (e.g., Account IDs start with '001', Contact with '003', Lead with '00Q').",
        },
      },
      required: [
        "sobject_api_name",
        "record_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_s_objects_describe_layouts_record_type_id",
    description: "Tool to retrieve layout metadata for a specific record type on an object. Use when you need detailed information about page layouts, field positioning, sections, quick actions, related lists, and buttons for a particular record type.",
    toolSlug: "SALESFORCE_GET_S_OBJECTS_DESCRIBE_LAYOUTS_RECORD_TYPE_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject: {
          type: "string",
          description: "The API name of the Salesforce object to retrieve layout information for.",
        },
        record_type_id: {
          type: "string",
          description: "The 18-character ID of the record type for which to retrieve layout information.",
        },
      },
      required: [
        "sobject",
        "record_type_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_s_objects_updated",
    description: "Tool to retrieve a list of sObject records that have been updated within a given timeframe. Use when you need to synchronize records or track changes to specific sObject types over a time period.",
    toolSlug: "SALESFORCE_GET_S_OBJECTS_UPDATED",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        end: {
          type: "string",
          description: "End of the timeframe for which to retrieve updated records. Must be in ISO 8601 format (e.g., 2025-12-23T23:59:59Z). The date range between start and end cannot exceed 30 days.",
        },
        start: {
          type: "string",
          description: "Start of the timeframe for which to retrieve updated records. Must be in ISO 8601 format (e.g., 2025-12-23T10:22:26Z). Cannot be more than 30 days ago from the current date.",
        },
        sobject: {
          type: "string",
          description: "The API name of the sObject type to query for updated records (e.g., Account, Contact, CustomObject__c).",
        },
      },
      required: [
        "sobject",
        "start",
        "end",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_search_layout",
    description: "Retrieves search result layout information for specified sObjects. Use when you need to understand which fields are displayed in search results for objects.",
    toolSlug: "SALESFORCE_GET_SEARCH_LAYOUT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        object_names: {
          type: "string",
          description: "Comma-separated list of sObject API names for which to retrieve search layouts (e.g., 'Account,Contact'). Can include standard objects (Account, Contact, Lead, Opportunity, Case) and custom objects (CustomObject__c).",
        },
      },
      required: [
        "object_names",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_get_search_suggestions",
    description: "Returns a list of suggested searches based on the user's query string. Use when you want to help users discover relevant search terms before performing a search.",
    toolSlug: "SALESFORCE_GET_SEARCH_SUGGESTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "The search query string for which to return suggested queries. This is the partial text input from the user.",
        },
        channel: {
          type: "string",
          description: "The channel context for the search suggestions. Valid values: 'Pkb' (Public Knowledge Base), 'Csp' (Customer Service Portal), 'Prm' (Partner Portal), 'App' (Internal Application).",
          enum: [
            "Pkb",
            "Csp",
            "Prm",
            "App",
          ],
        },
        sobject: {
          type: "string",
          description: "The Salesforce object type to focus the suggestions on. Limits suggestions to queries relevant to specific object types.",
        },
        language: {
          type: "string",
          description: "The language for the search suggestions. Required parameter. Use standard locale codes (e.g., 'en_US', 'fr_FR').",
        },
      },
      required: [
        "q",
        "channel",
        "language",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobject_by_external_id",
    description: "Tool to retrieve a Salesforce record by matching an external ID field value. Use when you need to find a record using a custom external identifier instead of the Salesforce ID. The field specified must be marked as an External ID in Salesforce.",
    toolSlug: "SALESFORCE_GET_SOBJECT_BY_EXTERNAL_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Comma-separated list of field names to return. If not specified, returns all fields.",
        },
        sobject: {
          type: "string",
          description: "The API name of the Salesforce object (e.g., Account, Contact, Custom__c).",
        },
        field_name: {
          type: "string",
          description: "The API name of the external ID field. Must be marked as an External ID field in the object's field definition.",
        },
        field_value: {
          type: "string",
          description: "The value of the external ID field to match. Will be URL-encoded automatically.",
        },
      },
      required: [
        "sobject",
        "field_name",
        "field_value",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobject_collections",
    description: "Tool to retrieve multiple records of the same sObject type in a single API call. Use when you need to fetch up to 200 records by their IDs. Returns an array of sObjects with the specified fields.",
    toolSlug: "SALESFORCE_GET_SOBJECT_COLLECTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ids: {
          type: "string",
          description: "Comma-separated list of record IDs to retrieve. Maximum 200 IDs for GET requests. Example: '001xx000003DGb2AAG,001xx000003DGb3AAG'.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of field names to retrieve for each record. Specifies which fields to return in the response. Example: 'Name,BillingCity,Email'.",
        },
        all_or_none: {
          type: "boolean",
          description: "If true, the entire operation rolls back if any record fails. If false (default), partial success is allowed and errors are returned for individual failed records.",
        },
        sobject_type: {
          type: "string",
          description: "The sObject type name to retrieve records from (e.g., 'Account', 'Contact', 'Lead', 'Opportunity').",
        },
      },
      required: [
        "sobject_type",
        "ids",
        "fields",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "composite_and_tree_apis",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobject_list_view",
    description: "Tool to retrieve basic information about a specific list view for an sObject. Use when you need to get list view metadata including its ID, label, developer name, and URLs for accessing results and detailed descriptions.",
    toolSlug: "SALESFORCE_GET_SOBJECT_LIST_VIEW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_view_id: {
          type: "string",
          description: "The unique identifier (18-character ID) of the specific list view to retrieve.",
        },
        sobject_name: {
          type: "string",
          description: "The type of sObject to which the list view applies (e.g., Account, Contact, Opportunity).",
        },
      },
      required: [
        "sobject_name",
        "list_view_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "list_views_and_mru",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobject_list_views",
    description: "Tool to retrieve list views for a specified sObject. Use when you need to discover available filtered views of records for objects like Account, Contact, Lead, or Opportunity.",
    toolSlug: "SALESFORCE_GET_SOBJECT_LIST_VIEWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject_name: {
          type: "string",
          description: "The API name of the sObject type (e.g., Account, Contact, Lead, Opportunity, Case). Required to specify which object type's list views to retrieve.",
        },
      },
      required: [
        "sobject_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "list_views_and_mru",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobject_platformaction",
    description: "Retrieves metadata description of PlatformAction SObject. Use when you need to understand the structure and fields of PlatformAction for querying UI actions.",
    toolSlug: "SALESFORCE_GET_SOBJECT_PLATFORMACTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobject_quick_action_default_values",
    description: "Retrieves default field values for a specific quick action on an sObject. Use when you need to understand what fields will be automatically populated when executing the quick action.",
    toolSlug: "SALESFORCE_GET_SOBJECT_QUICK_ACTION_DEFAULT_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject: {
          type: "string",
          description: "The API name of the sObject type (e.g., 'Account', 'Contact', 'Task').",
        },
        action_name: {
          type: "string",
          description: "The API name of the quick action (e.g., '_LightningRelatedContact', 'LogACall', 'NewTask').",
        },
      },
      required: [
        "sobject",
        "action_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobject_relationship",
    description: "Retrieves records by traversing sObject relationships using friendly URLs. Use when you need to get related records through a relationship field (e.g., all Contacts for an Account).",
    toolSlug: "SALESFORCE_GET_SOBJECT_RELATIONSHIP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The 15 or 18-character Salesforce ID of the parent record.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of fields to retrieve from the related records. If not specified, returns default fields.",
        },
        sobject: {
          type: "string",
          description: "The parent sObject type (e.g., 'Account', 'Contact', 'Opportunity'). Must be a valid Salesforce object type.",
        },
        relationship_field_name: {
          type: "string",
          description: "The name of the relationship field to traverse (e.g., 'Contacts' for Account.Contacts, 'Opportunities' for Account.Opportunities).",
        },
      },
      required: [
        "sobject",
        "id",
        "relationship_field_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_sobjects_sobject_describe_approvallayouts",
    description: "Retrieves approval layouts for a specified Salesforce object. Use when you need to understand which fields are displayed in approval pages or to dynamically build approval interfaces.",
    toolSlug: "SALESFORCE_GET_SOBJECTS_SOBJECT_DESCRIBE_APPROVALLAYOUTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject_name: {
          type: "string",
          description: "The API name of the Salesforce object to retrieve approval layouts for. Use standard object names (Account, Contact, Opportunity, Case) or custom object API names ending in __c.",
        },
      },
      required: [
        "sobject_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_support",
    description: "Retrieves the root of the Support Knowledge REST API. Use when you need to access knowledge articles and data category information.",
    toolSlug: "SALESFORCE_GET_SUPPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "limits_and_platform_discovery",
    ],
  }),
  composioTool({
    name: "salesforce_get_support_knowledge_articles",
    description: "Retrieves user's visible knowledge articles and data categories from Salesforce Knowledge. Use when you need to access published, draft, or archived articles based on user permissions.",
    toolSlug: "SALESFORCE_GET_SUPPORT_KNOWLEDGE_ARTICLES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Sort order for results (e.g., 'mostViewed').",
        },
        topics: {
          type: "string",
          description: "Filter articles by topics.",
        },
        channel: {
          type: "string",
          description: "Specifies the visibility channel through which articles are accessed. Valid values: 'App' (internal app), 'Pkb' (public knowledge base), 'Csp' (customer portal), 'Prm' (partner portal).",
          enum: [
            "App",
            "Pkb",
            "Csp",
            "Prm",
          ],
        },
        page_size: {
          type: "integer",
          description: "Number of articles to return per page for pagination.",
        },
        categories: {
          type: "string",
          description: "Filters articles by data category groups and categories. Format varies based on category structure.",
        },
        page_number: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        publish_status: {
          type: "string",
          description: "Filter by publication status. Values: 'Draft', 'Online' (published), 'Archived'. Note: Requires 'Manage Articles' permission for 'Online' status. In API version 47.0+ with Lightning Knowledge, all statuses are returned by default.",
          enum: [
            "Draft",
            "Online",
            "Archived",
          ],
        },
        accept_language: {
          type: "string",
          description: "Language for the knowledge articles. Must be specified in HTTP header format (e.g., 'en-US', 'en-US,en;q=0.9'). This field is required by the Salesforce API.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "limits_and_platform_discovery",
    ],
  }),
  composioTool({
    name: "salesforce_get_supported_objects_directory",
    description: "Tool to get a Salesforce org's active theme and directory of supported objects. Use when you need to discover available objects that are supported by the User Interface API, including their CRUD permissions, labels, and theme information.",
    toolSlug: "SALESFORCE_GET_SUPPORTED_OBJECTS_DIRECTORY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "Comma-separated list of object API names to filter the response. When provided, only returns metadata for the specified objects. If omitted, returns all available objects.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_theme",
    description: "Tool to get icons and colors for Salesforce UI themes. Use when you need to retrieve theme information for objects in the organization.",
    toolSlug: "SALESFORCE_GET_THEME",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "apps_navigation_and_theme",
    ],
  }),
  composioTool({
    name: "salesforce_get_ui_api_actions_lookup_account",
    description: "Tool to get lookup field actions for a Salesforce object. Use when you need to retrieve available actions for lookup fields on a specific object type (e.g., Account, Contact).",
    toolSlug: "SALESFORCE_GET_UI_API_ACTIONS_LOOKUP_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sections: {
          type: "string",
          description: "Comma-separated list of action sections to include in the response.",
        },
        form_factor: {
          type: "string",
          description: "The device form factor for which to retrieve actions. Valid values: 'Large' (desktop), 'Medium' (tablet), 'Small' (mobile).",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        action_types: {
          type: "string",
          description: "Comma-separated list of action types to filter (e.g., 'standard,custom').",
        },
        object_api_name: {
          type: "string",
          description: "The API name of the object for which to retrieve lookup field actions.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_ui_api_actions_record_related_list",
    description: "Tool to get available actions on related lists for a record detail page. Use when you need to retrieve metadata about actions (standard actions, custom actions, quick actions, productivity actions) displayed on related lists for a specific parent record.",
    toolSlug: "SALESFORCE_GET_UI_API_ACTIONS_RECORD_RELATED_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record_id: {
          type: "string",
          description: "The 18-character ID of the parent record for which to retrieve related list actions.",
        },
        form_factor: {
          type: "string",
          description: "The form factor of the device running the browser. Valid values: 'Large' (desktop), 'Medium' (tablet), 'Small' (phone). This affects which actions are returned based on device type.",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        action_types: {
          type: "string",
          description: "Comma-separated list of action types to filter results. Common values include: 'Standard', 'Custom', 'QuickAction', 'ProductivityAction', 'DefaultButton'.",
        },
        retrieval_mode: {
          type: "string",
          description: "Specifies how actions should be retrieved to control the retrieval behavior for actions.",
        },
        related_list_ids: {
          type: "string",
          description: "Comma-separated list of related list API names to filter the actions. For custom objects, use the plural form with '__r' suffix (e.g., 'Custom_Objects__r').",
        },
      },
      required: [
        "record_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_ui_api_apps_user_nav_items",
    description: "Tool to get personalized navigation items for a specific Salesforce app. Use when you need to retrieve the navigation tabs that a user has access to within an application.",
    toolSlug: "SALESFORCE_GET_UI_API_APPS_USER_NAV_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page offset starting position (default: 0). Example: page=2 with pageSize=10 returns items 21-30.",
        },
        app_id: {
          type: "string",
          description: "The ID of the Salesforce application for which to retrieve navigation items.",
        },
        page_size: {
          type: "integer",
          description: "Maximum number of navigation items per page (default: 25).",
        },
        form_factor: {
          type: "string",
          description: "Specifies the device form factor for which to retrieve navigation items. Valid values: 'Large' (desktop, default), 'Medium' (tablet), or 'Small' (phone).",
        },
        nav_item_names: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of TabDefinition name values to include. If omitted, returns all navigation items for the specified form factor.",
        },
      },
      required: [
        "app_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_ui_api_list_info_recent",
    description: "Tool to get list views for a Salesforce object. Use when you need to retrieve available list views with options to filter by recent usage and search.",
    toolSlug: "SALESFORCE_GET_UI_API_LIST_INFO_RECENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "Search term to filter list view results. Supports wildcards.",
        },
        page_size: {
          type: "integer",
          description: "Number of list view records to return per page. Valid range: 1-2000. Default: 20.",
        },
        page_token: {
          type: "integer",
          description: "Page offset for pagination. Maximum offset: 2000. Default: 0.",
        },
        object_api_name: {
          type: "string",
          description: "The API name of the Salesforce object to retrieve list views for. Examples: Account, Contact, Lead, Opportunity, CustomObject__c.",
        },
        recent_lists_only: {
          type: "boolean",
          description: "When true, returns only recently used list views. When false, returns all list views for the object.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_ui_api_record_ui",
    description: "Tool to retrieve layout, field metadata, and record data in a single response. Use when you need comprehensive information including UI layout configuration, object metadata, and actual record values with child relationships.",
    toolSlug: "SALESFORCE_GET_UI_API_RECORD_UI",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        modes: {
          type: "string",
          description: "Comma-separated access modes for the record. Valid values: 'Create' (for creating records), 'Edit' (for editing records), 'View' (for displaying records). Determines which fields to get from layout.",
        },
        page_size: {
          type: "integer",
          description: "Number of child relationship records per page. Default: 5.",
        },
        record_ids: {
          type: "string",
          description: "Comma-separated list of up to 200 record IDs. All IDs must be from supported objects.",
        },
        form_factor: {
          type: "string",
          description: "Specifies device form factor. Valid values: 'Large' (desktop), 'Medium' (tablet), 'Small' (mobile phone).",
          enum: [
            "Large",
            "Medium",
            "Small",
          ],
        },
        layout_types: {
          type: "string",
          description: "Comma-separated layout types to return. Valid values: 'Compact' (key fields layout), 'Full' (full layout).",
        },
        optional_fields: {
          type: "string",
          description: "Comma-separated list of additional field names to include in format ObjectApiName.FieldApiName. If field is accessible to user, it's included in response; otherwise silently omitted without error.",
        },
        child_relationships: {
          type: "string",
          description: "Comma-separated list of child relationships to include in format ObjectApiName.ChildRelationshipName (e.g., 'Account.Contacts,Account.Opportunities'). Child records are paginated with default pageSize of 5.",
        },
      },
      required: [
        "record_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_uiapi_actions_mru_list_account",
    description: "Tool to retrieve header actions available on the MRU (Most Recently Used) list view for a specified Salesforce object. Use when you need to get available actions, buttons, and quick actions for an object's list view.",
    toolSlug: "SALESFORCE_GET_UIAPI_ACTIONS_MRU_LIST_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        form_factor: {
          type: "string",
          description: "Specifies the device form factor for which to return actions (e.g., 'Large' for desktop, 'Small' for mobile).",
        },
        action_types: {
          type: "string",
          description: "Filters the types of actions to return. Can be used to limit the response to specific action categories.",
        },
        object_api_name: {
          type: "string",
          description: "The API name of the Salesforce object for which to retrieve MRU list view actions.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_get_uiapi_list_info_account_all_accounts",
    description: "Retrieves list view metadata for the Account AllAccounts view using Salesforce UI API. Use when you need to understand the structure, columns, filters, and sorting of the standard AllAccounts list view.",
    toolSlug: "SALESFORCE_GET_UIAPI_LIST_INFO_ACCOUNT_ALL_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_uiapi_list_info_account_recent",
    description: "Tool to get list view metadata from Salesforce UI API. Use when you need to retrieve configuration details for a list view including columns, filters, sorting, and permissions.",
    toolSlug: "SALESFORCE_GET_UIAPI_LIST_INFO_ACCOUNT_RECENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        object_api_name: {
          type: "string",
          description: "The API name of the Salesforce object. Examples: Account, Contact, Lead, Opportunity, CustomObject__c.",
        },
        list_view_api_name: {
          type: "string",
          description: "The API name of the list view. Examples: AllAccounts, MyAccounts, __Recent. Special values like __Recent represent system-defined list views.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_uiapi_list_info_account_search_result",
    description: "Retrieves list view metadata for the Account __SearchResult view using Salesforce UI API. Use when you need to understand the structure, columns, filters, and sorting of search results for Accounts.",
    toolSlug: "SALESFORCE_GET_UIAPI_LIST_INFO_ACCOUNT_SEARCH_RESULT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "ui_api_records_lookups_and_related_lists",
    ],
  }),
  composioTool({
    name: "salesforce_get_uiapi_related_list_preferences",
    description: "Tool to retrieve user preferences for a specific related list on an object. Use when you need to get display settings, column widths, or sort preferences for related lists in Salesforce UI.",
    toolSlug: "SALESFORCE_GET_UIAPI_RELATED_LIST_PREFERENCES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        object_api_name: {
          type: "string",
          description: "The API name of the parent object whose related list preferences you want to retrieve.",
        },
        related_list_id: {
          type: "string",
          description: "The API name of the related list for which you want to retrieve user preferences.",
        },
      },
      required: [
        "object_api_name",
        "related_list_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_get_user_info",
    description: "Retrieves information about the current user or a specific user in Salesforce.",
    toolSlug: "SALESFORCE_GET_USER_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The Salesforce User ID to retrieve information for. If not provided, returns current user info.",
        },
        include_permissions: {
          type: "boolean",
          description: "Whether to include user permissions in the response (requires additional API call). Requires elevated access; permission data is returned inside salesforce_user_details and may be partially masked based on the user's profile.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_head_actions_custom",
    description: "Tool to return HTTP headers for custom invocable actions without response body. Use when you need to check resource availability and metadata before executing full requests or to validate resource state conditionally.",
    toolSlug: "SALESFORCE_HEAD_ACTIONS_CUSTOM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        if_unmodified_since: {
          type: "string",
          description: "Conditional header that returns data only if the resource hasn't been modified since the specified date. Uses HTTP date format (RFC 7231). Example: 'Wed, 21 Oct 2015 07:28:00 GMT'.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_head_actions_standard",
    description: "Tool to return HTTP headers for standard invocable actions metadata without response body. Use when you need to perform efficient cache validation, check for metadata changes, or reduce bandwidth usage before retrieving full action metadata.",
    toolSlug: "SALESFORCE_HEAD_ACTIONS_STANDARD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        if_modified_since: {
          type: "string",
          description: "Conditional header that returns data only if the resource has been modified since the specified date. Uses HTTP date format (RFC 2822/7232). Example: 'Thu, 05 Jul 2012 15:31:30 GMT'. If not modified, returns 304 status code.",
        },
        if_unmodified_since: {
          type: "string",
          description: "Conditional header that returns data only if the resource hasn't been modified since the specified date. Uses HTTP date format (RFC 2822/7232). Example: 'Tue, 10 Aug 2015 00:00:00 GMT'. If modified, returns 412 status code.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_head_appmenu_salesforce1",
    description: "Tool to return HTTP headers for AppMenu Salesforce1 mobile navigation items without response body. Use when you need to check resource metadata, validate cache (via ETag or Last-Modified), or test endpoint availability without data transfer overhead.",
    toolSlug: "SALESFORCE_HEAD_APPMENU_SALESFORCE1",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        if_none_match: {
          type: "string",
          description: "Entity tag (ETag) for conditional request. If the resource matches this ETag, returns 304 Not Modified.",
        },
        if_modified_since: {
          type: "string",
          description: "Timestamp for conditional request. Request succeeds only if data changed since specified date/time, otherwise returns 304 Not Modified. Format: RFC 2822 date-time (e.g., 'Mon, 15 Jan 2024 12:00:00 GMT').",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_head_process_rules_s_object",
    description: "Tool to return HTTP headers for process rules of an sObject without retrieving the response body. Use when you need to check if process rules exist for an sObject or retrieve metadata like ETag and Last-Modified headers.",
    toolSlug: "SALESFORCE_HEAD_PROCESS_RULES_S_OBJECT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sobject: {
          type: "string",
          description: "The Salesforce object name (sObject) to retrieve process rules headers for.",
        },
      },
      required: [
        "sobject",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_head_quick_actions",
    description: "Tool to return HTTP headers for Quick Actions resource without response body. Use when you need to inspect metadata before retrieving full Quick Actions content or to validate resource availability.",
    toolSlug: "SALESFORCE_HEAD_QUICK_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_head_sobject_quick_action_default_values",
    description: "Tool to return HTTP headers for sObject quick action default values by context ID without response body. Use when you need to check resource availability, verify cache validation headers (ETag, Last-Modified), or optimize API calls by avoiding unnecessary data transfer.",
    toolSlug: "SALESFORCE_HEAD_SOBJECT_QUICK_ACTION_DEFAULT_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        context_id: {
          type: "string",
          description: "The record ID that provides context for retrieving the default values. This is typically the ID of an existing record (Account, Contact, Lead, Opportunity, etc.) that the quick action is being invoked from.",
        },
        action_name: {
          type: "string",
          description: "The API name of the quick action (e.g., 'LogACall', 'NewTask', 'NewContact', 'SendEmail'). This is the specific action you want to get headers for.",
        },
        sobject_type: {
          type: "string",
          description: "The sObject type (e.g., 'Account', 'Contact', 'Lead', 'Opportunity'). This specifies which sObject the quick action belongs to.",
        },
        if_none_match: {
          type: "string",
          description: "ETag value for conditional requests. Returns 304 Not Modified if content hasn't changed since the specified ETag.",
        },
        if_modified_since: {
          type: "string",
          description: "Date format: EEE, dd MMM yyyy HH:mm:ss z. Returns 304 Not Modified if the action metadata has not changed since the specified date.",
        },
      },
      required: [
        "sobject_type",
        "action_name",
        "context_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_head_sobjects_global_describe_layouts",
    description: "Tool to return HTTP headers for all global publisher layouts without response body. Use when implementing cache validation strategies, efficient resource polling, or checking if layouts have been modified without transferring layout data.",
    toolSlug: "SALESFORCE_HEAD_SOBJECTS_GLOBAL_DESCRIBE_LAYOUTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        if_none_match: {
          type: "string",
          description: "ETag value for strong validation. Request succeeds only if the resource's ETag doesn't match the provided value(s). Multiple ETags can be specified as comma-separated values.",
        },
        if_modified_since: {
          type: "string",
          description: "Timestamp for weak validation. Request succeeds only if the resource has been modified since the specified date and time. Format: HTTP date (RFC 7231).",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_head_sobjects_quick_action",
    description: "Tool to return HTTP headers for a specific sObject quick action without response body. Use when you need to check ETag or Last-Modified headers before fetching full content or to validate quick action availability.",
    toolSlug: "SALESFORCE_HEAD_SOBJECTS_QUICK_ACTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        action_name: {
          type: "string",
          description: "The specific quick action name for which to retrieve headers (e.g., NewCase, LogACall, SendEmail).",
        },
        sobject_type: {
          type: "string",
          description: "The sObject type for which to retrieve quick action headers (e.g., Account, Contact, Case, Lead).",
        },
        if_none_match: {
          type: "string",
          description: "ETag value for conditional requests. Returns 304 Not Modified if content hasn't changed since the specified ETag.",
        },
        if_modified_since: {
          type: "string",
          description: "Time-based conditional header that returns data only if the resource has been modified since the specified date. Uses HTTP date format (RFC 7231). Example: 'Wed, 21 Oct 2015 07:28:00 GMT'.",
        },
      },
      required: [
        "sobject_type",
        "action_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_head_sobjects_user_password",
    description: "Tool to return HTTP headers for User password resource without response body. Use when you need to check user password metadata and expiration status efficiently without retrieving the full response content.",
    toolSlug: "SALESFORCE_HEAD_SOBJECTS_USER_PASSWORD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The Salesforce User record identifier (18-character User ID).",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "security_and_compliance",
    ],
  }),
  composioTool({
    name: "salesforce_list_accounts",
    description: "Lists accounts from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Results paginate via nextRecordsUrl with up to ~2000 rows per page. REQUEST_LIMIT_EXCEEDED requires exponential backoff; INVALID_FIELD or INSUFFICIENT_ACCESS_OR_READONLY errors indicate profile or field-level restrictions — simplify SELECT/WHERE clauses.",
    toolSlug: "SALESFORCE_LIST_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch accounts. Use standard SOQL syntax to filter, sort, and limit results. Always include WHERE and LIMIT clauses to avoid oversized responses. Avoid FIELDS(ALL) without LIMIT. Website and Phone are frequently null; avoid filtering on them without tolerating null values. To include parent-child relationships, explicitly add ParentId or Parent.Name to the SELECT clause.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_analytics_templates",
    description: "Tool to list CRM Analytics templates available in the org. Use when you need to discover available templates for creating Analytics apps.",
    toolSlug: "SALESFORCE_LIST_ANALYTICS_TEMPLATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for pagination (1-based indexing). Specifies which page of results to retrieve.",
        },
        type: {
          type: "string",
          description: "Filter templates by type. App returns app templates, Dashboard returns dashboard templates, Data returns data templates, Embedded returns embedded templates, Lens returns lens templates.",
          enum: [
            "App",
            "Dashboard",
            "Data",
            "Embedded",
            "Lens",
          ],
        },
        options: {
          type: "string",
          description: "Filter templates by visibility. CreateApp returns templates that can be used to create apps, ManageableOnly returns templates the user can manage, ViewOnly returns templates the user can only view.",
          enum: [
            "CreateApp",
            "ManageableOnly",
            "ViewOnly",
          ],
        },
        pageSize: {
          type: "integer",
          description: "Number of results per page. Controls how many template records are returned in a single response.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_list_campaigns",
    description: "Lists campaigns from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Results returned under `response_data.records`; use `Id` (not `Name`) to identify campaigns in downstream operations.",
    toolSlug: "SALESFORCE_LIST_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch campaigns. Use standard SOQL syntax to filter, sort, and limit results. To disambiguate similarly named campaigns, filter on `Type`, `Status`, `StartDate`, or `EndDate`.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_contacts",
    description: "Lists contacts from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Results are returned under `response_data.records`; check `response_data.done` and `response_data.totalSize` for pagination — use OFFSET or `nextRecordsUrl` until `done=true` to retrieve all records.",
    toolSlug: "SALESFORCE_LIST_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch contacts. Use standard SOQL syntax to filter, sort, and limit results. String literals must be single-quoted. Use correct field API names and relationship traversal (e.g., `Account.Industry`). To filter unassociated contacts use `AccountId = NULL`. Omitting an `AccountId` or `Account.Name` filter returns contacts across all accounts. Nullable fields like `LastActivityDate` require explicit null checks; use `ORDER BY ... NULLS FIRST` for null-safe sorting.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_custom_invocable_actions",
    description: "Retrieves the list of custom actions including Flow actions, Apex actions, and invocable processes. Use when you need to discover available custom invocable actions in your Salesforce organization.",
    toolSlug: "SALESFORCE_LIST_CUSTOM_INVOCABLE_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_list_dashboards",
    description: "Lists all dashboards available in Salesforce with basic metadata including name, ID, and URLs.",
    toolSlug: "SALESFORCE_LIST_DASHBOARDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "support_knowledge_and_analytics",
    ],
  }),
  composioTool({
    name: "salesforce_list_email_templates",
    description: "Lists available email templates in Salesforce with filtering and search capabilities.",
    toolSlug: "SALESFORCE_LIST_EMAIL_TEMPLATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum number of templates to return.",
        },
        order_by: {
          type: "string",
          description: "Field to sort results by.",
        },
        folder_name: {
          type: "string",
          description: "Filter by folder name to get templates from a specific folder.",
        },
        search_term: {
          type: "string",
          description: "Search term to filter templates by name. Uses LIKE operator for partial matches.",
        },
        include_body: {
          type: "boolean",
          description: "Whether to include the template body content in results. Note: This may increase response size significantly.",
        },
        template_type: {
          type: "string",
          description: "Filter by template type. Common values: text, custom, html, visualforce.",
        },
        is_active_only: {
          type: "boolean",
          description: "Whether to return only active templates. Set to false to include inactive templates.",
        },
        order_direction: {
          type: "string",
          description: "Sort direction: ASC for ascending, DESC for descending.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "files_and_collaboration",
    ],
  }),
  composioTool({
    name: "salesforce_list_leads",
    description: "Lists leads from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Results are paginated; follow nextRecordsUrl in the response to retrieve subsequent pages — the first page may silently omit matching records beyond the page limit.",
    toolSlug: "SALESFORCE_LIST_LEADS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch leads. Use standard SOQL syntax to filter, sort, and limit results. Field API names must be exact (e.g., LeadSource, LastModifiedDate) — invalid names cause MALFORMED_QUERY errors. Date literals like TODAY use the org timezone; use explicit ranges (e.g., LastModifiedDate >= TODAY AND LastModifiedDate < TOMORROW) to avoid boundary misses. Filter null Email with WHERE Email != null when downstream steps require it. Narrow LastModifiedDate ranges to avoid row-limit truncation.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_notes",
    description: "Lists notes from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Designed specifically for Note and ContentNote objects.",
    toolSlug: "SALESFORCE_LIST_NOTES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch notes. Use standard SOQL syntax to filter, sort, and limit results. This action is specifically designed for Note and ContentNote objects. For other objects like EmailMessage (which uses 'Subject' instead of 'Title'), use the general SOQL query action instead. Always include a LIMIT clause to avoid over-fetching; the default query has no LIMIT and may return very large payloads. Omit Body or use TextPreview (ContentNote only) when full note content is not needed.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_opportunities",
    description: "Lists opportunities from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Results are paginated up to ~2000 rows per batch; check `done`, `totalSize`, and `nextRecordsUrl` fields to detect and retrieve additional pages, or use a SOQL `LIMIT` clause to cap results. For complex queries rejected by this tool, use `SALESFORCE_RUN_SOQL_QUERY` instead.",
    toolSlug: "SALESFORCE_LIST_OPPORTUNITIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch opportunities. Use standard SOQL syntax to filter, sort, and limit results.  Omitting a `WHERE` clause returns all opportunities including historical ones. Results have no default sort order; include `ORDER BY CloseDate DESC` to retrieve recent opportunities first.IMPORTANT: Only use standard Salesforce fields unless you have confirmed that custom fields exist in the target org. Custom fields (ending with '__c') are org-specific and may not exist in all Salesforce instances. For relationship queries (e.g., Owner.Name), only use standard fields on the related object. To discover available fields, use the SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT action first.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_pricebook_entries",
    description: "Lists pricebook entries from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Use this to map product names to pricebook entry IDs needed for opportunity line items. When using returned IDs with SALESFORCE_ADD_OPPORTUNITY_LINE_ITEM, always filter with WHERE IsActive = true — inactive entries cause REQUIRED_FIELD_MISSING or INVALID_CROSS_REFERENCE_KEY errors.",
    toolSlug: "SALESFORCE_LIST_PRICEBOOK_ENTRIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch pricebook entries. Use standard SOQL syntax to filter, sort, and limit results.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_pricebooks",
    description: "Lists pricebooks from Salesforce using SOQL query, allowing flexible filtering, sorting, and field selection. Use this to map pricebook names to IDs.",
    toolSlug: "SALESFORCE_LIST_PRICEBOOKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to fetch pricebooks. Use standard SOQL syntax to filter, sort, and limit results.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_list_reports",
    description: "Lists all reports available in Salesforce with basic metadata including name, ID, and URLs.",
    toolSlug: "SALESFORCE_LIST_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "support_knowledge_and_analytics",
    ],
  }),
  composioTool({
    name: "salesforce_list_standard_invocable_actions",
    description: "Retrieves the list of standard actions that can be statically invoked. Use when you need to discover available standard invocable actions like posting to Chatter, sending email, or sending custom notifications.",
    toolSlug: "SALESFORCE_LIST_STANDARD_INVOCABLE_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "actions_and_quick_actions",
    ],
  }),
  composioTool({
    name: "salesforce_log_call",
    description: "Logs a completed phone call as a task in Salesforce with call-specific details like duration, type, and disposition.",
    toolSlug: "SALESFORCE_LOG_CALL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        who_id: {
          type: "string",
          description: "ID of the Contact or Lead associated with the call. Invalid or non-existent IDs create orphaned or mislinked activity records.",
        },
        subject: {
          type: "string",
          description: "Subject line for the call log. Defaults to 'Call'.",
        },
        what_id: {
          type: "string",
          description: "ID of the related record (Account, Opportunity, Case, etc.) associated with the call.",
        },
        comments: {
          type: "string",
          description: "Detailed notes or description of what was discussed during the call.",
        },
        call_date: {
          type: "string",
          description: "Date of the call in YYYY-MM-DD format. Defaults to today if not specified.",
        },
        call_type: {
          type: "string",
          description: "Standard Salesforce Task CallType values. This is a restricted picklist.",
          enum: [
            "Inbound",
            "Outbound",
            "Internal",
          ],
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Call_Outcome__c').",
        },
        call_disposition: {
          type: "string",
          description: "Outcome or result of the call. Restricted picklist — only org-configured values are accepted; unlisted values cause validation errors.",
        },
        call_duration_seconds: {
          type: "integer",
          description: "Duration of the call in seconds.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Log call.",
    ],
  }),
  composioTool({
    name: "salesforce_log_email_activity",
    description: "Creates an EmailMessage record to log email activity in Salesforce, associating it with related records. Requires EmailMessage insert permissions enabled at the org level; some orgs block this entirely.",
    toolSlug: "SALESFORCE_LOG_EMAIL_ACTIVITY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        status: {
          type: "string",
          description: "Status of the email. 0=New, 1=Read, 2=Replied, 3=Sent, 4=Forwarded, 5=Draft",
        },
        subject: {
          type: "string",
          description: "Subject line of the email.",
        },
        html_body: {
          type: "string",
          description: "HTML body of the email. If provided, takes precedence over text_body for display.",
        },
        parent_id: {
          type: "string",
          description: "ID of the parent record, typically a Case for case-related emails.",
        },
        text_body: {
          type: "string",
          description: "Plain text body of the email.",
        },
        cc_address: {
          type: "string",
          description: "CC email addresses (comma-separated if multiple).",
        },
        to_address: {
          type: "string",
          description: "Email addresses of the recipients (comma-separated if multiple).",
        },
        bcc_address: {
          type: "string",
          description: "BCC email addresses (comma-separated if multiple).",
        },
        is_incoming: {
          type: "boolean",
          description: "Whether this is an incoming email (true) or outgoing email (false).",
        },
        from_address: {
          type: "string",
          description: "Email address of the sender.",
        },
        message_date: {
          type: "string",
          description: "Date/time the email was sent in ISO format. Defaults to current time if not provided. Must be an explicit ISO datetime string; relative expressions like 'yesterday' cause validation errors.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Email_Category__c').",
        },
        related_to_id: {
          type: "string",
          description: "ID of the record to associate this email with (Account, Opportunity, Case, etc.). Must reference a supported object type (Account, Opportunity, Case, Contact, Lead, etc.); unsupported object types cause validation errors or create standalone records invisible on timelines.",
        },
        is_client_managed: {
          type: "boolean",
          description: "Whether the email is client-managed (not sent through Salesforce).",
        },
        is_externally_visible: {
          type: "boolean",
          description: "Whether the email is visible in customer portals/communities.",
        },
      },
      required: [
        "subject",
        "from_address",
        "to_address",
        "related_to_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "files_and_collaboration",
    ],
    askBefore: [
      "Confirm the parameters before executing Log email activity.",
    ],
  }),
  composioTool({
    name: "salesforce_mass_transfer_ownership",
    description: "Transfers ownership of multiple records to a new owner in a single operation using Salesforce's composite API for better performance. Operation has no rollback; all provided records are reassigned immediately.",
    toolSlug: "SALESFORCE_MASS_TRANSFER_OWNERSHIP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        record_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of record IDs to transfer ownership.",
        },
        object_type: {
          type: "string",
          description: "The Salesforce object type for the records to transfer (e.g., Account, Contact, Lead, Opportunity).",
        },
        new_owner_id: {
          type: "string",
          description: "The user ID of the new owner to transfer records to.",
        },
        trigger_assignment_rules: {
          type: "boolean",
          description: "Whether to trigger Salesforce assignment rules when transferring records. Applies mainly to Leads and Cases where assignment rules may reassign the record or send notifications.",
        },
      },
      required: [
        "object_type",
        "record_ids",
        "new_owner_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "composite_and_tree_apis",
    ],
    askBefore: [
      "Confirm the parameters before executing Mass transfer ownership.",
    ],
  }),
  composioTool({
    name: "salesforce_parameterized_search",
    description: "Tool to execute RESTful search using parameters instead of SOSL clause. Use when you need to search across Salesforce objects with simple GET requests (URL parameters) or complex POST requests (JSON body with advanced filtering). POST method supports DataCategories, networks, orderBy constraints, and per-object filtering.",
    toolSlug: "SALESFORCE_PARAMETERIZED_SEARCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "The search string to search for across Salesforce objects. This is the primary search term.",
        },
        in: {
          type: "string",
          description: "Search scope specifying which fields to search. Valid values: ALL, NAME, EMAIL, PHONE, SIDEBAR. Defaults to ALL.",
        },
        where: {
          type: "string",
          description: "Global filter conditions for the search results. Use standard SOQL WHERE clause syntax (without the 'WHERE' keyword).",
        },
        fields: {
          type: "string",
          description: "For GET: comma-separated string of fields in format 'Object.field1,Object.field2'. For POST: array of field names to return globally across all objects.",
        },
        method: {
          type: "string",
          description: "HTTP method to use. Use GET for simple searches with URL parameters, or POST for complex searches with JSON body including advanced filtering.",
          enum: [
            "GET",
            "POST",
          ],
        },
        sobjects: {
          type: "string",
          description: "For GET: comma-separated string of object names (e.g., 'Account,Contact'). For POST: array of SObjectFilter objects with name, fields, and where clauses.",
        },
        overallLimit: {
          type: "integer",
          description: "Maximum number of results to return across all objects. Helps control result set size.",
        },
        spellCorrection: {
          type: "boolean",
          description: "Enable spell correction for search terms to find results even with misspelled queries.",
        },
        defaultSearchScope: {
          type: "string",
          description: "Default search scope for the query when not explicitly specified.",
        },
      },
      required: [
        "q",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_patch_composite_sobjects",
    description: "Tool to upsert up to 200 records using external ID field matching. Use when you need to create or update multiple records efficiently in a single API call based on an external ID field.",
    toolSlug: "SALESFORCE_PATCH_COMPOSITE_SOBJECTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        records: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of record objects to upsert. Maximum 200 records. Each record must include the 'attributes' object with the 'type' field, and the external ID field value for matching.",
        },
        all_or_none: {
          type: "boolean",
          description: "Controls transaction behavior. If true, rolls back all changes if any record fails. If false (default), commits successful records even if others fail.",
        },
        sobject_name: {
          type: "string",
          description: "The API name of the Salesforce object (e.g., 'Account', 'Contact', 'CustomObject__c').",
        },
        external_id_field_name: {
          type: "string",
          description: "The API name of the external ID field to use for matching records (e.g., 'External_Account_ID__c', 'Id'). This field must be defined as an external ID field in Salesforce.",
        },
      },
      required: [
        "sobject_name",
        "external_id_field_name",
        "records",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "composite_and_tree_apis",
    ],
    askBefore: [
      "Confirm the parameters before executing Upsert records using external ID.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_post_composite_graph",
    description: "Tool to execute multiple related REST API requests in a single transactional call with up to 500 subrequests per graph. Use when you need to perform multiple Salesforce operations atomically where all operations must succeed or fail together. Supports referencing output from one request as input to subsequent requests using @{referenceId.fieldName} syntax.",
    toolSlug: "SALESFORCE_POST_COMPOSITE_GRAPH",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        graphs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              graphId: {
                type: "string",
                description: "Unique identifier for this graph. Must begin with an alphanumeric character, be less than 40 characters long, not contain a period (.), and be unique within the composite graph operation.",
              },
              compositeRequest: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    url: {
                      type: "string",
                      description: "The Salesforce REST API endpoint path (relative to base URL). Example: '/services/data/vXX.X/sobjects/Account'.",
                    },
                    body: {
                      type: "object",
                      additionalProperties: true,
                      description: "Request payload containing the data for POST/PATCH/PUT operations. Required for POST, PATCH, PUT methods; optional for GET, DELETE methods.",
                    },
                    method: {
                      type: "string",
                      description: "HTTP method for the subrequest. Valid values: GET, POST, PATCH, PUT, DELETE.",
                    },
                    referenceId: {
                      type: "string",
                      description: "Unique identifier used to reference the output of this request in subsequent requests using @{referenceId.fieldName} syntax. Must be unique within the graph.",
                    },
                  },
                  description: "Represents a single subrequest within a composite graph.",
                },
                description: "Array of individual REST API requests within this graph. Maximum 500 subrequests per graph. All operations succeed or fail together (transactional). Output from one request can be referenced in subsequent requests using @{referenceId.fieldName} syntax.",
              },
            },
            description: "Represents a single graph with multiple related subrequests.",
          },
          description: "Array of graph objects. Each graph can contain up to 500 subrequests and reach up to 15 levels of depth. All operations within a graph succeed or fail together. Subrequests in one graph cannot reference subrequests from another graph.",
        },
      },
      required: [
        "graphs",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "composite_and_tree_apis",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Execute Composite Graph.",
    ],
  }),
  composioTool({
    name: "salesforce_post_composite_sobjects",
    description: "Tool to create up to 200 records in one request using sObject Collections. Use when you need to create multiple records of potentially different sObject types efficiently in a single API call.",
    toolSlug: "SALESFORCE_POST_COMPOSITE_SOBJECTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        records: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              attributes: {
                type: "object",
                additionalProperties: true,
                properties: {
                  type: {
                    type: "string",
                    description: "The sObject API name (e.g., 'Account', 'Contact', 'Lead', 'CustomObject__c'). Required for each record to identify which object type to create.",
                  },
                },
                description: "Metadata identifying the sObject type for this record. Must include the 'type' field with the sObject API name.",
              },
            },
            description: "A single sObject record to create with its attributes and field values.",
          },
          description: "Array of sObject records to create. Minimum 1 record, maximum 200 records per request. Each record must include an 'attributes' object with the 'type' field specifying the sObject API name (e.g., Account, Contact), followed by field name-value pairs. Records are created in the order listed.",
        },
        all_or_none: {
          type: "boolean",
          description: "Determines whether the request should be processed atomically. When true, all records must succeed or the entire request is rolled back. When false (default), partial success is allowed and each record is processed independently.",
        },
      },
      required: [
        "records",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "composite_and_tree_apis",
    ],
    askBefore: [
      "Confirm the parameters before executing Create records using sObject Collections.",
    ],
  }),
  composioTool({
    name: "salesforce_post_parameterized_search",
    description: "Tool to execute parameterized search across Salesforce objects with advanced filtering. Use when you need to search for records using specific search terms with fine-grained control over which objects to search, which fields to return, and additional filtering criteria.",
    toolSlug: "SALESFORCE_POST_PARAMETERIZED_SEARCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "The search string to search for across Salesforce objects. This is the primary search term used in the SOSL FIND clause.",
        },
        in: {
          type: "string",
          description: "Search scope specifying which fields to search. Valid values: 'ALL' (ALL FIELDS), 'NAME' (NAME FIELDS), 'EMAIL' (EMAIL FIELDS), 'PHONE' (PHONE FIELDS), 'SIDEBAR' (SIDEBAR FIELDS). Defaults to 'ALL'.",
          enum: [
            "ALL",
            "NAME",
            "EMAIL",
            "PHONE",
            "SIDEBAR",
          ],
        },
        where: {
          type: "string",
          description: "Global WHERE clause applied to all sObjects (without the WHERE keyword). Uses standard SOQL WHERE clause syntax.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Default fields to return for all sObjects if not specified per object. Field API names like ['Id', 'Name', 'Email'].",
        },
        sobjects: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The sObject API name to search (e.g., 'Contact', 'Account', 'Lead').",
              },
              limit: {
                type: "integer",
                description: "Maximum records to return for this object. If not specified, uses defaultLimit.",
              },
              where: {
                type: "string",
                description: "WHERE clause filter for this specific object (without the WHERE keyword). Uses standard SOQL WHERE clause syntax.",
              },
              fields: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Field names to return for this object. If not specified, uses the default fields parameter.",
              },
            },
            description: "Specification for an sObject to search within.",
          },
          description: "Array of sObject specifications to limit search scope. Each object specifies which Salesforce object type to search and optional filters.",
        },
        defaultLimit: {
          type: "integer",
          description: "Default limit per sObject when not specified in the sobjects array. Default is 25.",
        },
        overallLimit: {
          type: "integer",
          description: "Maximum total number of records to return across all sObjects. Default is 2000, maximum is 2000.",
        },
        spellCorrection: {
          type: "boolean",
          description: "Enable spell correction for search terms. Default is true.",
        },
      },
      required: [
        "q",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_query_all",
    description: "Tool to execute SOQL queries including soft-deleted and archived records. Use when you need to query records that have been deleted via merge or delete operations, or when accessing archived Task and Event records.",
    toolSlug: "SALESFORCE_QUERY_ALL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "The SOQL query to execute. Unlike standard queries, QueryAll includes soft-deleted records (from merge or delete operations) and archived Task/Event records. Example: 'SELECT Id, Name FROM Account WHERE IsDeleted = true'. Use standard SOQL syntax.",
        },
      },
      required: [
        "query",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_remove_from_campaign",
    description: "Removes a lead or contact from a campaign by deleting the CampaignMember record. Provide either the member_id (lead/contact ID) or the specific campaign_member_id.",
    toolSlug: "SALESFORCE_REMOVE_FROM_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        member_id: {
          type: "string",
          description: "The Salesforce ID of the lead or contact to remove from the campaign. Either member_id or campaign_member_id must be provided.",
        },
        campaign_id: {
          type: "string",
          description: "The Salesforce ID of the campaign to remove the member from.",
        },
        campaign_member_id: {
          type: "string",
          description: "The specific CampaignMember record ID to delete. Either member_id or campaign_member_id must be provided.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove from campaign.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "salesforce_retrieve_lead_by_id",
    description: "Retrieves details for a Salesforce Lead by its ID; the specified Lead ID must exist in Salesforce.",
    toolSlug: "SALESFORCE_RETRIEVE_LEAD_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Unique identifier (ID) of the Salesforce Lead to retrieve.",
        },
        fields: {
          type: "string",
          description: "Comma-delimited list of Salesforce Lead field API names to return (e.g., Name,Email,Company). Field names must be exact API names (alphanumeric with underscores, no spaces). Custom fields typically end with '__c'. If omitted, all accessible fields are returned.",
        },
        filtered_fields_message: {
          type: "string",
          description: "Internal field to store message about filtered fields.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_crud_and_collections",
    ],
  }),
  composioTool({
    name: "salesforce_retrieve_opportunities_data",
    description: "Retrieves all available Opportunity records, representing potential revenue-generating deals, from Salesforce.",
    toolSlug: "SALESFORCE_RETRIEVE_OPPORTUNITIES_DATA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "sobjects_metadata_layouts_and_relationships",
    ],
  }),
  composioTool({
    name: "salesforce_run_report",
    description: "Runs a report and returns the results. Creates a report instance that can be checked for completion. Results are returned in a nested structure (factMap, reportExtendedMetadata), not a flat record list; an empty factMap/rows is a valid result. Avoid repeated calls when freshness allows — reuse an existing instance_id instead.",
    toolSlug: "SALESFORCE_RUN_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        report_id: {
          type: "string",
          description: "The Salesforce ID of the report to run.",
        },
      },
      required: [
        "report_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "support_knowledge_and_analytics",
    ],
  }),
  composioTool({
    name: "salesforce_run_soql_query",
    description: "Executes a SOQL query against Salesforce data. Returns records matching the query with pagination support.",
    toolSlug: "SALESFORCE_RUN_SOQL_QUERY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "SOQL query to execute. Must start with SELECT. Field names must match object schema exactly — use SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT for unfamiliar objects. ALIASES: No 'AS' keyword (use 'SUM(Amount) TotalSales' NOT 'SUM(Amount) AS TotalSales'). AGGREGATES: Without GROUP BY, ORDER BY/LIMIT not allowed (single-row result). COUNT() SYNTAX: Bare COUNT() only valid alone. With GROUP BY or other fields, must specify field: COUNT(Id) or COUNT(fieldName). Example: 'SELECT COUNT(Id), Status FROM Lead GROUP BY Status' NOT 'SELECT COUNT(), Status FROM Lead GROUP BY Status'. NON-GROUPABLE: Long text, rich text, encrypted text, compound address/location fields. NON-FILTERABLE: Long text area, rich text, encrypted text, multi-select picklists, blob fields CANNOT be in WHERE. FIELDS(ALL)/FIELDS(CUSTOM) require LIMIT ≤200. ID values need single quotes. Apostrophes use backslash: 'O\\'Brien'.",
        },
      },
      required: [
        "query",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_accounts",
    description: "Search for Salesforce accounts using criteria like name, industry, type, location, or contact information. Always provide at least one filter parameter; omitting all filters returns a broad, slow listing. Owner/territory filtering is unsupported — use SALESFORCE_RUN_SOQL_QUERY for ownership-based filters. Use SALESFORCE_GET_ACCOUNT to fetch complete field data for a specific record. Unsupported filter fields may be silently ignored — verify results reflect intended criteria.",
    toolSlug: "SALESFORCE_SEARCH_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Search by account name. Supports partial matches.",
        },
        type: {
          type: "string",
          description: "Search by account type.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of accounts to return. Results are hard-capped at approximately 2000 rows; use more selective filters if the full dataset exceeds this.",
        },
        phone: {
          type: "string",
          description: "Search by phone number. Supports partial matches. Requires field-level security access to the Phone field.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of valid Salesforce Account field API names to retrieve. Only use actual field names like Id, Name, Industry, etc. Do not include type annotations or placeholders like <string> or <DATE_TIME>. If any field in this list is restricted by field-level security, the entire request will fail — use a minimal set of standard fields (e.g., Id,Name,Website) when access is uncertain.",
        },
        website: {
          type: "string",
          description: "Search by website. Supports partial matches.",
        },
        industry: {
          type: "string",
          description: "Search by industry.",
        },
        billing_city: {
          type: "string",
          description: "Search by billing city. Supports partial matches.",
        },
        billing_state: {
          type: "string",
          description: "Search by billing state/province. Supports partial matches.",
        },
        billing_country: {
          type: "string",
          description: "Search by billing country. Supports partial matches.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_campaigns",
    description: "Search for Salesforce campaigns using multiple criteria like name, type, status, date range, or active status. Requires access to the Campaign object (Marketing User feature must be enabled in the org). For complex sorting (multi-field ORDER BY), use SALESFORCE_RUN_SOQL_QUERY instead.",
    toolSlug: "SALESFORCE_SEARCH_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Search by campaign name. Supports partial matches. Combine with type, status, or date range filters to narrow results when names are non-unique.",
        },
        type: {
          type: "string",
          description: "Search by campaign type.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of campaigns to return. Check totalSize in the response to determine if results are truncated; issue additional queries if needed.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of Campaign fields to retrieve.",
        },
        status: {
          type: "string",
          description: "Search by campaign status.",
        },
        is_active: {
          type: "boolean",
          description: "Filter by active status. True for active campaigns, False for inactive.",
        },
        start_date_to: {
          type: "string",
          description: "Upper bound for StartDate (inclusive). Use YYYY-MM-DD.",
        },
        start_date_from: {
          type: "string",
          description: "Lower bound for StartDate (inclusive). Use YYYY-MM-DD.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_contacts",
    description: "Search Salesforce Contact records (not Leads — use SALESFORCE_SEARCH_LEADS for those) using name, email, phone, account, or title. All parameters support partial/fuzzy matching, so results may include unrelated records; post-filter client-side for exact matches. Partial matches and common names can return multiple contacts — always confirm the correct contact by its 18-character Id before passing to write operations like SALESFORCE_LOG_CALL or SALESFORCE_CREATE_TASK. A response with totalSize=0 is a valid 'not found' outcome. Provide at least one search criterion; omitting all returns a broad, slow result set. Returned Ids are 18-character strings and must be used as-is in downstream tools.",
    toolSlug: "SALESFORCE_SEARCH_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Search by contact name (first name, last name, or full name). Supports partial matches.",
        },
        email: {
          type: "string",
          description: "Search by email address. Supports partial matches.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of contacts to return. Maximum allowed is 2000; when totalSize exceeds limit, paginate to retrieve full results.",
        },
        phone: {
          type: "string",
          description: "Search by phone number. Supports partial matches.",
        },
        title: {
          type: "string",
          description: "Search by job title. Supports partial matches.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of Contact fields to retrieve. Custom and non-default fields are excluded unless explicitly listed here.",
        },
        account_name: {
          type: "string",
          description: "Search by associated account name. Supports partial matches.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_knowledge_articles",
    description: "Search for Salesforce Knowledge articles with titles matching the search query. Returns auto-suggest results for Knowledge articles based on title matches.",
    toolSlug: "SALESFORCE_SEARCH_KNOWLEDGE_ARTICLES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        q: {
          type: "string",
          description: "The user's search query string to match against article titles. This is the text that will be matched against Knowledge article titles.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of suggested articles to return. Default: 5, Maximum: 10. Controls how many article suggestions are included in the response.",
        },
        topics: {
          type: "string",
          description: "Knowledge article topic names to filter results. Provide topic names to narrow down the search to articles tagged with specific topics.",
        },
        channel: {
          type: "string",
          description: "The channel for which the article is visible. Valid values: 'Pkb' (Public Knowledge Base), 'Csp' (Customer Portal), 'Prm' (Partner Portal), 'App' (Application).",
          enum: [
            "Pkb",
            "Csp",
            "Prm",
            "App",
          ],
        },
        language: {
          type: "string",
          description: "The article language API name (e.g., 'en_US', 'fr_FR', 'de_DE'). Filters results to articles in the specified language. If not provided, returns articles in all languages.",
        },
        publishStatus: {
          type: "string",
          description: "The article publication status. Valid values: 'Draft', 'Online', 'Archived'. Filters results to articles with the specified publication status.",
          enum: [
            "Draft",
            "Online",
            "Archived",
          ],
        },
        validationStatus: {
          type: "string",
          description: "The article's validation status. Valid values: 'Draft', 'Validated', 'Published'. Filters results by the article's validation state.",
          enum: [
            "Draft",
            "Validated",
            "Published",
          ],
        },
      },
      required: [
        "q",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_leads",
    description: "Search for Salesforce leads using criteria like name, email, phone, company, title, status, or lead source. At least one search criterion should be provided — omitting all parameters results in a broad, slow listing of arbitrary records. Partial matches on name, email, and company may return multiple candidates; confirm Email or Company field values before using a lead ID in downstream operations.",
    toolSlug: "SALESFORCE_SEARCH_LEADS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Search by lead name (first name, last name, or full name). Supports partial matches.",
        },
        email: {
          type: "string",
          description: "Search by email address. Supports partial matches.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of leads to return. Maximum cap is 2000; for result sets beyond 2000, use SALESFORCE_RUN_SOQL_QUERY with pagination via nextRecordsUrl.",
        },
        phone: {
          type: "string",
          description: "Search by phone number. Supports partial matches.",
        },
        title: {
          type: "string",
          description: "Search by job title. Supports partial matches.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of Lead fields to retrieve.",
        },
        status: {
          type: "string",
          description: "Search by lead status.",
        },
        company: {
          type: "string",
          description: "Search by company name. Supports partial matches.",
        },
        lead_source: {
          type: "string",
          description: "Search by lead source.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_notes",
    description: "Search for Salesforce notes using multiple criteria like title, body content, parent record, owner, or creation date. Provide at least one filter criterion — omitting all filters returns a broad, slow, noisy listing.",
    toolSlug: "SALESFORCE_SEARCH_NOTES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "string",
          description: "Search within note body content using full-text search (SOSL). When provided, body search is combined with any additional filters using AND logic.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of notes to return. Maximum allowed value is 2000; apply precise filters or paginate when result sets may exceed the limit.",
        },
        title: {
          type: "string",
          description: "Search by note title. Supports partial matches.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of Note fields to retrieve. Parent.Name may be null when the parent record is deleted or inaccessible.",
        },
        is_private: {
          type: "boolean",
          description: "Filter by private status. True for private notes, False for public notes. Private notes may be silently omitted if the integration user lacks permission — absence of results does not guarantee no notes exist.",
        },
        owner_name: {
          type: "string",
          description: "Search by note owner's user name. Supports partial matches.",
        },
        parent_name: {
          type: "string",
          description: "Search by parent record name (Account, Contact, Lead, Opportunity, Case, or custom objects). Supports partial matches. Searches across common parent object types to find matching records. Cannot filter by parent record ID or parent object type; use SALESFORCE_RUN_SOQL_QUERY for ID-scoped note lookups.",
        },
        created_date_to: {
          type: "string",
          description: "Filter notes created on or before this date (YYYY-MM-DD).",
        },
        created_date_from: {
          type: "string",
          description: "Filter notes created on or after this date (YYYY-MM-DD).",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_opportunities",
    description: "Search for Salesforce opportunities using multiple criteria like name, account, stage, amount, close date, or status. Apply at least one filter to avoid broad result sets. Partial-match searches may return multiple similar records; verify the correct record by Id before downstream use.",
    toolSlug: "SALESFORCE_SEARCH_OPPORTUNITIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Search by opportunity name. Supports partial matches.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of opportunities to return. Maximum value is 2000. When totalSize in the response exceeds limit, use nextRecordsUrl to paginate through the full dataset.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of Opportunity fields to retrieve. Supports direct Opportunity fields (e.g., Id, Name, Amount) and parent relationship fields (e.g., Account.Name, Owner.Name). Note: Contact.* fields (Contact.Name, Contact.Email, etc.) are NOT valid because Opportunity does not have a direct parent relationship to Contact; use OpportunityContactRole queries to get contact information. Parent relationship fields like Account.Name may be null on returned records; guard against missing nested values when post-processing.",
        },
        is_won: {
          type: "boolean",
          description: "Filter by won status. True for won opportunities, False for lost (only applies to closed opportunities).",
        },
        is_closed: {
          type: "boolean",
          description: "Filter by closed status. True for closed opportunities, False for open.",
        },
        amount_max: {
          type: "number",
          description: "Maximum opportunity amount.",
        },
        amount_min: {
          type: "number",
          description: "Minimum opportunity amount.",
        },
        stage_name: {
          type: "string",
          description: "Search by opportunity stage.",
        },
        lead_source: {
          type: "string",
          description: "Search by lead source.",
        },
        account_name: {
          type: "string",
          description: "Search by associated account name. Supports partial matches.",
        },
        close_date_to: {
          type: "string",
          description: "Search opportunities with close date before this date (YYYY-MM-DD).",
        },
        close_date_from: {
          type: "string",
          description: "Search opportunities with close date from this date (YYYY-MM-DD). When computing relative ranges (e.g., 'this week'), derive dates using the user's local timezone to avoid off-by-one-day errors.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_search_tasks",
    description: "Search for Salesforce tasks using multiple criteria like subject, status, priority, assigned user, related records, or dates. Always provide at least one filter criterion — no filters produces broad, slow results. For complex filtering not supported here, use SALESFORCE_RUN_SOQL_QUERY.",
    toolSlug: "SALESFORCE_SEARCH_TASKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum number of tasks to return. Maximum is 2000. When returned record count equals limit or nextRecordsUrl is present in the response, paginate to retrieve all matching tasks.",
        },
        fields: {
          type: "string",
          description: "Comma-separated list of Task fields to retrieve. WhoId/Who.Name, WhatId/What.Name, OwnerId/Owner.Name, and Description can be null on Task records — guard against null before accessing nested .Name fields. Call-specific fields (CallType, CallDurationInSeconds) are frequently null and unreliable as sole filters.",
        },
        status: {
          type: "string",
          description: "Search by task status.",
        },
        subject: {
          type: "string",
          description: "Search by task subject. Supports partial matches. Many Tasks are system-generated or email-related; combine with activity_date_from/activity_date_to, status, and priority for better precision.",
        },
        priority: {
          type: "string",
          description: "Search by task priority.",
        },
        is_closed: {
          type: "boolean",
          description: "Filter by closed status. True for completed tasks, False for open tasks.",
        },
        account_name: {
          type: "string",
          description: "Search by related account name. Supports partial matches.",
        },
        contact_name: {
          type: "string",
          description: "Search by related contact name. Supports partial matches.",
        },
        activity_date_to: {
          type: "string",
          description: "Search tasks with activity date before this date (YYYY-MM-DD).",
        },
        assigned_to_name: {
          type: "string",
          description: "Search by assigned user name. Supports partial matches.",
        },
        activity_date_from: {
          type: "string",
          description: "Search tasks with activity date from this date (YYYY-MM-DD). Date filtering may not strictly bound results; verify ActivityDate in returned records when date accuracy matters.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_send_email",
    description: "Sends an email through Salesforce with options for recipients, attachments, and activity logging. Can partially succeed — check per-recipient success/failure status rather than treating the call as all-or-nothing. For large recipient lists, use SALESFORCE_SEND_MASS_EMAIL instead.",
    toolSlug: "SALESFORCE_SEND_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "string",
          description: "Body content of the email.",
        },
        is_html: {
          type: "boolean",
          description: "Whether the email body is HTML formatted.",
        },
        subject: {
          type: "string",
          description: "Subject line of the email.",
        },
        log_email: {
          type: "boolean",
          description: "Whether to log the email on the recipient's activity timeline. Requires correct recipient_id and related_record_id values; incorrect IDs silently log the activity against the wrong records.",
        },
        sender_type: {
          type: "string",
          description: "Type of sender.",
          enum: [
            "CurrentUser",
            "OrgWideEmailAddress",
          ],
        },
        cc_addresses: {
          type: "string",
          description: "CC email addresses. Can be a comma-delimited string or a list.",
        },
        recipient_id: {
          type: "string",
          description: "ID of a lead, contact, or person account to send the email to. Used for logging and merge fields.",
        },
        to_addresses: {
          type: "string",
          description: "Email addresses of recipients. Can be a comma-delimited string or a list. Recipients with null email fields generate per-recipient errors without failing the entire call; filter out null-email records beforehand.",
        },
        bcc_addresses: {
          type: "string",
          description: "BCC email addresses. Can be a comma-delimited string or a list.",
        },
        attachment_ids: {
          type: "string",
          description: "IDs of files to attach. Provide ContentVersion (068...), Document (015...) Ids, or ContentDocument (069...) IdsCan be a comma-delimited string or a list.",
        },
        sender_address: {
          type: "string",
          description: "Organization-wide email address. Required only when sender_type is OrgWideEmailAddress.",
        },
        related_record_id: {
          type: "string",
          description: "ID of a related record (e.g., Account, Opportunity, Case) for logging and merge fields.",
        },
        org_wide_email_address_id: {
          type: "string",
          description: "Org-Wide Email Address Id to use when sender_type is OrgWideEmailAddress.",
        },
      },
      required: [
        "to_addresses",
        "subject",
        "body",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "actions_and_quick_actions",
    ],
    askBefore: [
      "Confirm the parameters before executing Send email.",
    ],
  }),
  composioTool({
    name: "salesforce_send_email_from_template",
    description: "Sends an email using a predefined Salesforce email template with merge field support.",
    toolSlug: "SALESFORCE_SEND_EMAIL_FROM_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        log_email: {
          type: "boolean",
          description: "Whether to log the email on the recipient's activity timeline. Defaults to true for template emails.",
        },
        sender_type: {
          type: "string",
          description: "Type of sender. Valid values: CurrentUser, DefaultWorkflowUser, OrgWideEmailAddress.",
        },
        template_id: {
          type: "string",
          description: "ID of the email template to use.",
        },
        cc_addresses: {
          type: "string",
          description: "CC email addresses. Can be a comma-delimited string or a list.",
        },
        recipient_id: {
          type: "string",
          description: "ID of the lead, contact, or person account to send the email to. Required when using templates.",
        },
        bcc_addresses: {
          type: "string",
          description: "BCC email addresses. Can be a comma-delimited string or a list.",
        },
        attachment_ids: {
          type: "string",
          description: "IDs of files to attach. Can be a comma-delimited string or a list.",
        },
        sender_address: {
          type: "string",
          description: "Organization-wide email address. Required only when sender_type is OrgWideEmailAddress.",
        },
        related_record_id: {
          type: "string",
          description: "ID of a related record (e.g., Case, Opportunity) to populate merge fields from a different object.",
        },
        add_threading_tokens: {
          type: "boolean",
          description: "Whether to add threading tokens for email-to-case or custom threading. Useful for case-related emails.",
        },
        additional_to_addresses: {
          type: "string",
          description: "Additional email addresses to send to (besides the recipient). Can be a comma-delimited string or a list.",
        },
      },
      required: [
        "template_id",
        "recipient_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "actions_and_quick_actions",
    ],
    askBefore: [
      "Confirm the parameters before executing Send email from template.",
    ],
  }),
  composioTool({
    name: "salesforce_send_mass_email",
    description: "Sends bulk emails to multiple recipients immediately and irreversibly using a template or custom content. Requires either a valid template_id or both subject and body; omitting all three causes errors. Processes in batches for performance. Check failedRecipients and summary.failureCount in the response even when success=true, as individual recipient failures can occur without an overall failure.",
    toolSlug: "SALESFORCE_SEND_MASS_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "string",
          description: "Body content of the email. Required if template_id is not provided.",
        },
        is_html: {
          type: "boolean",
          description: "Whether the email body is HTML formatted. Only applies when not using a template.",
        },
        subject: {
          type: "string",
          description: "Subject line of the email. Required if template_id is not provided.",
        },
        batch_size: {
          type: "integer",
          description: "Number of recipients to process in each batch. Maximum is 150.",
        },
        log_emails: {
          type: "boolean",
          description: "Whether to log the emails on each recipient's activity timeline.",
        },
        sender_type: {
          type: "string",
          description: "Type of sender.",
          enum: [
            "CurrentUser",
            "DefaultWorkflowUser",
            "OrgWideEmailAddress",
          ],
        },
        template_id: {
          type: "string",
          description: "ID of the email template to use. If not specified, subject and body must be provided.",
        },
        recipient_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of IDs for leads, contacts, or person accounts to send emails to. Maximum 150 recipients per call. All recipient records must have a non-null Email field; null emails generate per-recipient errors.",
        },
        sender_address: {
          type: "string",
          description: "Organization-wide email address. Required only when sender_type is OrgWideEmailAddress.",
        },
      },
      required: [
        "recipient_ids",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "actions_and_quick_actions",
    ],
    askBefore: [
      "Confirm the parameters before executing Send mass email.",
    ],
  }),
  composioTool({
    name: "salesforce_set_user_password",
    description: "Tool to set or reset a user's password in Salesforce. Use when you need to assign a specific password or generate a random one for a user.",
    toolSlug: "SALESFORCE_SET_USER_PASSWORD",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The Salesforce User ID for which to set the password. Must be a valid 15 or 18-character Salesforce User ID.",
        },
        new_password: {
          type: "string",
          description: "The new password to set for the user. If omitted, Salesforce will generate and return a random password. The password must meet the organization's password policies including length and complexity requirements.",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "security_and_compliance",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Set user password.",
    ],
  }),
  composioTool({
    name: "salesforce_sobject_rows_update",
    description: "Tool to update specific fields in an existing Salesforce sObject record. Use when you need to modify one or more fields in a record without affecting other fields.",
    toolSlug: "SALESFORCE_SOBJECT_ROWS_UPDATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of field name/value pairs to update. Only include fields that need to be updated. Field names must match the API names of the sObject fields (e.g., 'Phone', 'Name', 'CustomField__c'). Field names are case-sensitive.",
        },
        record_id: {
          type: "string",
          description: "The unique 15 or 18-character Salesforce ID of the record to update.",
        },
        sobject_api_name: {
          type: "string",
          description: "The API name of the Salesforce object type to update (e.g., Account, Contact, Opportunity, CustomObject__c). Case-sensitive.",
        },
      },
      required: [
        "sobject_api_name",
        "record_id",
        "fields",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update sObject record.",
    ],
  }),
  composioTool({
    name: "salesforce_sobject_user_password",
    description: "Tool to check whether a Salesforce user's password has expired. Use when you need to verify password expiration status for a specific user.",
    toolSlug: "SALESFORCE_SOBJECT_USER_PASSWORD",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        user_id: {
          type: "string",
          description: "The 15 or 18-character Salesforce User ID to check password expiration status for.",
        },
      },
      required: [
        "user_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "security_and_compliance",
    ],
  }),
  composioTool({
    name: "salesforce_tooling_query",
    description: "Tool to execute SOQL queries against Salesforce Tooling API metadata objects. Use when you need to query metadata components like ApexClass, ApexTrigger, ValidationRule, WorkflowRule, FieldDefinition, or EntityDefinition. The Tooling API exposes objects that use the external object framework and provides granular access to metadata components for development and deployment tasks.",
    toolSlug: "SALESFORCE_TOOLING_QUERY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "The SOQL query to execute against Tooling API metadata objects. Example: 'SELECT Id, Name FROM ApexClass LIMIT 10'. Can query metadata objects like ApexClass, ApexTrigger, ValidationRule, WorkflowRule, FieldDefinition, EntityDefinition, etc. Supports standard SOQL syntax including WHERE, ORDER BY, LIMIT, and OFFSET clauses. Maximum OFFSET value is 2000 when using pagination with LIMIT/OFFSET.",
        },
      },
      required: [
        "query",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "read",
      "search_and_query",
    ],
  }),
  composioTool({
    name: "salesforce_update_account",
    description: "Updates an existing account in Salesforce with the specified changes. Only provided fields will be updated.",
    toolSlug: "SALESFORCE_UPDATE_ACCOUNT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fax: {
          type: "string",
          description: "Updated fax number. Leave empty to keep unchanged.",
        },
        name: {
          type: "string",
          description: "Updated account name. Leave empty to keep unchanged.",
        },
        type: {
          type: "string",
          description: "Updated account type. Leave empty to keep unchanged.",
        },
        phone: {
          type: "string",
          description: "Updated phone number. Leave empty to keep unchanged.",
        },
        website: {
          type: "string",
          description: "Updated website URL. Leave empty to keep unchanged.",
        },
        industry: {
          type: "string",
          description: "Updated industry. Leave empty to keep unchanged.",
        },
        sic_desc: {
          type: "string",
          description: "Updated SIC description. Leave empty to keep unchanged.",
        },
        parent_id: {
          type: "string",
          description: "Updated parent account ID. Leave empty to keep unchanged.",
        },
        account_id: {
          type: "string",
          description: "The Salesforce ID of the account to update.",
        },
        description: {
          type: "string",
          description: "Updated description. Leave empty to keep unchanged.",
        },
        billing_city: {
          type: "string",
          description: "Updated billing city. Leave empty to keep unchanged.",
        },
        billing_state: {
          type: "string",
          description: "Updated billing state. Leave empty to keep unchanged. If your org has State and Country/Territory picklists enabled, provide the exact picklist value (e.g., 'California' instead of 'CA').",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Level__c', 'Languages__c'). Values can be strings, numbers, booleans, or null depending on the field type.",
        },
        shipping_city: {
          type: "string",
          description: "Updated shipping city. Leave empty to keep unchanged.",
        },
        account_source: {
          type: "string",
          description: "Updated account source. Leave empty to keep unchanged.",
        },
        annual_revenue: {
          type: "number",
          description: "Updated annual revenue. Leave empty to keep unchanged.",
        },
        billing_street: {
          type: "string",
          description: "Updated billing street. Leave empty to keep unchanged.",
        },
        shipping_state: {
          type: "string",
          description: "Updated shipping state. Leave empty to keep unchanged.",
        },
        billing_country: {
          type: "string",
          description: "Updated billing country. Leave empty to keep unchanged. If your org has State and Country/Territory picklists enabled, provide the exact picklist value (e.g., 'United States' instead of 'USA').",
        },
        shipping_street: {
          type: "string",
          description: "Updated shipping street. Leave empty to keep unchanged.",
        },
        shipping_country: {
          type: "string",
          description: "Updated shipping country. Leave empty to keep unchanged.",
        },
        billing_postal_code: {
          type: "string",
          description: "Updated billing postal code. Leave empty to keep unchanged.",
        },
        number_of_employees: {
          type: "integer",
          description: "Updated number of employees. Leave empty to keep unchanged.",
        },
        shipping_postal_code: {
          type: "string",
          description: "Updated shipping postal code. Leave empty to keep unchanged.",
        },
      },
      required: [
        "account_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update account.",
    ],
  }),
  composioTool({
    name: "salesforce_update_campaign",
    description: "Updates an existing campaign in Salesforce with the specified changes. Only provided fields will be updated.",
    toolSlug: "SALESFORCE_UPDATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Updated campaign name. Leave empty to keep unchanged.",
        },
        type: {
          type: "string",
          description: "Updated campaign type. Leave empty to keep unchanged.",
        },
        status: {
          type: "string",
          description: "Updated campaign status. Leave empty to keep unchanged.",
        },
        end_date: {
          type: "string",
          description: "Updated end date in YYYY-MM-DD format. Leave empty to keep unchanged.",
        },
        is_active: {
          type: "boolean",
          description: "Updated active status. Leave as None to keep unchanged.",
        },
        parent_id: {
          type: "string",
          description: "Updated parent campaign ID. Leave empty to keep unchanged.",
        },
        start_date: {
          type: "string",
          description: "Updated start date in YYYY-MM-DD format. Leave empty to keep unchanged.",
        },
        actual_cost: {
          type: "number",
          description: "Updated actual cost. Leave unset to keep unchanged.",
        },
        campaign_id: {
          type: "string",
          description: "The Salesforce ID of the campaign to update.",
        },
        description: {
          type: "string",
          description: "Updated description. Leave empty to keep unchanged.",
        },
        number_sent: {
          type: "number",
          description: "Updated number sent. Leave unset to keep unchanged.",
        },
        budgeted_cost: {
          type: "number",
          description: "Updated budgeted cost. Leave unset to keep unchanged.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Custom fields to update on the campaign. Use API field names (ending in __c). Leave empty if not updating custom fields.",
        },
        expected_revenue: {
          type: "number",
          description: "Updated expected revenue. Leave unset to keep unchanged.",
        },
        expected_response: {
          type: "number",
          description: "Updated expected response rate. Leave unset to keep unchanged.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update campaign.",
    ],
  }),
  composioTool({
    name: "salesforce_update_contact",
    description: "Updates an existing contact in Salesforce with the specified changes. Only provided fields will be updated. Returns HTTP 204 with no body on success; use SALESFORCE_GET_CONTACT to verify applied changes. Org-level validation rules, duplicate rules, or field-level permissions may reject correctly formatted requests with HTTP 400; inspect the error response to identify the constraint.",
    toolSlug: "SALESFORCE_UPDATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email: {
          type: "string",
          description: "Updated email address. Leave empty to keep unchanged.",
        },
        phone: {
          type: "string",
          description: "Updated primary phone number. Leave empty to keep unchanged.",
        },
        title: {
          type: "string",
          description: "Updated job title. Leave empty to keep unchanged.",
        },
        birthdate: {
          type: "string",
          description: "Updated birthdate in YYYY-MM-DD format. Leave empty to keep unchanged.",
        },
        last_name: {
          type: "string",
          description: "Updated last name. Leave empty to keep unchanged.",
        },
        account_id: {
          type: "string",
          description: "Updated Account ID association. Leave empty to keep unchanged. Alternatively use SALESFORCE_ASSOCIATE_CONTACT_TO_ACCOUNT, but prefer setting this field when updating multiple fields simultaneously.",
        },
        contact_id: {
          type: "string",
          description: "The Salesforce ID of the contact to update. Must be a valid 18-character Salesforce ID (retrieve via SALESFORCE_SEARCH_CONTACTS); names or emails cannot substitute.",
        },
        department: {
          type: "string",
          description: "Updated department. Leave empty to keep unchanged.",
        },
        first_name: {
          type: "string",
          description: "Updated first name. Leave empty to keep unchanged.",
        },
        mailing_city: {
          type: "string",
          description: "Updated mailing city. Leave empty to keep unchanged.",
        },
        mobile_phone: {
          type: "string",
          description: "Updated mobile phone number. Leave empty to keep unchanged.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom fields in Salesforce end with '__c' (e.g., 'Level__c', 'Languages__c').",
        },
        mailing_state: {
          type: "string",
          description: "Updated mailing state/province. Leave empty to keep unchanged.",
        },
        mailing_street: {
          type: "string",
          description: "Updated mailing street address. Leave empty to keep unchanged.",
        },
        mailing_country: {
          type: "string",
          description: "Updated mailing country. Leave empty to keep unchanged.",
        },
        mailing_postal_code: {
          type: "string",
          description: "Updated mailing postal/zip code. Leave empty to keep unchanged.",
        },
      },
      required: [
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contact.",
    ],
  }),
  composioTool({
    name: "salesforce_update_favorite",
    description: "Tool to update a favorite's properties in Salesforce UI API. Use when you need to reorder favorites or modify their display properties.",
    toolSlug: "SALESFORCE_UPDATE_FAVORITE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The display name of the favorite. Update this to change how the favorite appears in the list.",
        },
        sort_order: {
          type: "integer",
          description: "The display order/position of the favorite in the user's favorites list. Lower numbers appear first. Used to reorder favorites.",
        },
        favorite_id: {
          type: "string",
          description: "The unique 15 or 18-character Salesforce ID of the favorite to update.",
        },
      },
      required: [
        "favorite_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "ui_api_records_lookups_and_related_lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a favorite.",
    ],
  }),
  composioTool({
    name: "salesforce_update_lead",
    description: "Updates an existing lead in Salesforce with the specified changes. Only provided fields will be updated.",
    toolSlug: "SALESFORCE_UPDATE_LEAD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        city: {
          type: "string",
          description: "Updated city. Leave empty to keep unchanged.",
        },
        email: {
          type: "string",
          description: "Updated email address. Leave empty to keep unchanged.",
        },
        phone: {
          type: "string",
          description: "Updated phone number. Leave empty to keep unchanged.",
        },
        state: {
          type: "string",
          description: "Updated state/province. Leave empty to keep unchanged.",
        },
        title: {
          type: "string",
          description: "Updated job title. Leave empty to keep unchanged.",
        },
        rating: {
          type: "string",
          description: "Updated rating. Leave empty to keep unchanged. Must match a valid picklist value configured in the org; invalid values cause a validation error. Represents lead quality (Hot/Warm/Cold), not pipeline stage.",
        },
        status: {
          type: "string",
          description: "Updated status. Leave empty to keep unchanged. Must match a valid picklist value configured in the org; invalid values cause a validation error. Represents pipeline stage, not lead quality rating.",
        },
        street: {
          type: "string",
          description: "Updated street address. Leave empty to keep unchanged.",
        },
        company: {
          type: "string",
          description: "Updated company name. Leave empty to keep unchanged.",
        },
        country: {
          type: "string",
          description: "Updated country. Leave empty to keep unchanged.",
        },
        lead_id: {
          type: "string",
          description: "The Salesforce ID of the lead to update.",
        },
        website: {
          type: "string",
          description: "Updated website. Leave empty to keep unchanged.",
        },
        industry: {
          type: "string",
          description: "Updated industry. Leave empty to keep unchanged.",
        },
        last_name: {
          type: "string",
          description: "Updated last name. Leave empty to keep unchanged.",
        },
        first_name: {
          type: "string",
          description: "Updated first name. Leave empty to keep unchanged.",
        },
        description: {
          type: "string",
          description: "Updated description. Leave empty to keep unchanged.",
        },
        lead_source: {
          type: "string",
          description: "Updated lead source. Leave empty to keep unchanged.",
        },
        postal_code: {
          type: "string",
          description: "Updated postal/zip code. Leave empty to keep unchanged.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Custom fields to update on the lead. Pass a dictionary where keys are the Salesforce API names of custom fields (e.g., 'Level__c', 'Languages__c') and values are the field values to set. Custom field names typically end with '__c'.",
        },
        annual_revenue: {
          type: "number",
          description: "Updated annual revenue. Leave unset to keep unchanged. Negative values are passed through to Salesforce as-is (useful for adjustments/write-offs).",
        },
        number_of_employees: {
          type: "integer",
          description: "Updated number of employees. Leave unset to keep unchanged.",
        },
      },
      required: [
        "lead_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update lead.",
    ],
  }),
  composioTool({
    name: "salesforce_update_list_view_preferences",
    description: "Tool to update user preferences for a Salesforce list view including column widths, text wrapping, and display order. Use when you need to customize how columns appear in a list view.",
    toolSlug: "SALESFORCE_UPDATE_LIST_VIEW_PREFERENCES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        column_wrap: {
          type: "object",
          additionalProperties: true,
          description: "Maps field API names to boolean values indicating whether text should wrap to multiple lines (true) or be truncated (false).",
        },
        column_order: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Defines the left-to-right display order of columns using field API names.",
        },
        column_widths: {
          type: "object",
          additionalProperties: true,
          description: "Maps field API names to their desired display widths in pixels. Only include columns you want to resize.",
        },
        object_api_name: {
          type: "string",
          description: "The API name of the Salesforce object (e.g., 'Account', 'Lead', 'Contact').",
        },
        list_view_api_name: {
          type: "string",
          description: "The API name of the specific list view (e.g., 'AllAccounts', 'MyLeads').",
        },
      },
      required: [
        "object_api_name",
        "list_view_api_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_metadata_layouts_and_relationships",
    ],
    askBefore: [
      "Confirm the parameters before executing Update list view preferences.",
    ],
  }),
  composioTool({
    name: "salesforce_update_note",
    description: "Updates an existing note in Salesforce with the specified changes. Only provided fields will be updated.",
    toolSlug: "SALESFORCE_UPDATE_NOTE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        body: {
          type: "string",
          description: "Updated body/content of the note. Leave empty to keep unchanged.",
        },
        title: {
          type: "string",
          description: "Updated title of the note. Leave empty to keep unchanged.",
        },
        note_id: {
          type: "string",
          description: "The Salesforce ID of the note to update.",
        },
        owner_id: {
          type: "string",
          description: "Updated owner ID. Leave empty to keep unchanged.",
        },
        is_private: {
          type: "boolean",
          description: "Updated privacy setting. Leave empty to keep unchanged.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Custom fields to update on the note. Keys should be the API names of custom fields (e.g., 'Custom_Field__c'). Values can be strings, numbers, booleans, or null.",
        },
      },
      required: [
        "note_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update note.",
    ],
  }),
  composioTool({
    name: "salesforce_update_opportunity",
    description: "Updates an existing opportunity in Salesforce with the specified changes. Only provided fields will be updated. Returns HTTP 204 with empty body on success; call SALESFORCE_GET_OPPORTUNITY afterward to read updated values. Updates may fail with FIELD_CUSTOM_VALIDATION_EXCEPTION or REQUIRED_FIELD_MISSING — inspect the error message to identify the offending field.",
    toolSlug: "SALESFORCE_UPDATE_OPPORTUNITY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Updated opportunity name. Leave empty to keep unchanged.",
        },
        type: {
          type: "string",
          description: "Updated opportunity type. Leave empty to keep unchanged.",
        },
        amount: {
          type: "number",
          description: "Updated amount. Leave unset to keep unchanged. Negative values are passed through to Salesforce as-is.",
        },
        next_step: {
          type: "string",
          description: "Updated next step. Leave empty to keep unchanged.",
        },
        account_id: {
          type: "string",
          description: "Updated Account ID. Leave empty to keep unchanged.",
        },
        close_date: {
          type: "string",
          description: "Updated close date in YYYY-MM-DD format. Leave empty to keep unchanged.",
        },
        stage_name: {
          type: "string",
          description: "Updated stage. Leave empty to keep unchanged. Must exactly match a stage defined in the org's current sales process; use SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT with object_name='Opportunity' to discover valid values.",
        },
        description: {
          type: "string",
          description: "Updated description. Leave empty to keep unchanged.",
        },
        lead_source: {
          type: "string",
          description: "Updated lead source. Leave empty to keep unchanged.",
        },
        probability: {
          type: "number",
          description: "Updated probability percentage (0-100). Leave unset to keep unchanged.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values to update. Use the exact API name ending with '__c'. IMPORTANT for lookup/reference fields: Fields that reference other records (e.g., Contact__c, User__c, Account__c) require a valid 18-character Salesforce record ID (e.g., '003XXXXXXXXXXXXXXX' for Contact, '005XXXXXXXXXXXXXXX' for User), NOT descriptive names or text. Passing names like 'John Smith' instead of IDs will fail with MALFORMED_ID error. IMPORTANT for picklist fields: Restricted picklists only accept predefined values from the Salesforce org. Use SALESFORCE_GET_ALL_FIELDS_FOR_OBJECT with object_name='Opportunity' to discover field types and valid values.",
        },
        opportunity_id: {
          type: "string",
          description: "The Salesforce ID of the opportunity to update. Multiple opportunities may share the same name — apply additional filters (stage, owner, account) or confirm with the user before updating to avoid modifying the wrong record. Use IDs from fresh search results; stale or manually constructed IDs may be invalid.",
        },
      },
      required: [
        "opportunity_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update opportunity.",
    ],
  }),
  composioTool({
    name: "salesforce_update_record",
    description: "Tool to update a record's data in Salesforce via UI API. Use when you need to modify field values on an existing record. Salesforce validation rules are enforced. Pass If-Unmodified-Since header to prevent conflicts.",
    toolSlug: "SALESFORCE_UPDATE_RECORD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "object",
          additionalProperties: true,
          description: "Map of field API names to their new values. Only include fields you want to update. Field names should use API names (e.g., 'FirstName', 'Email', 'CustomField__c'). Unspecified fields remain unchanged.",
        },
        api_name: {
          type: "string",
          description: "The API name of the record's object type (e.g., 'Contact', 'Account', 'Lead'). Can be null or omitted for updates.",
        },
        record_id: {
          type: "string",
          description: "The unique 15 or 18-character Salesforce ID of the record to update.",
        },
        use_default_rule: {
          type: "boolean",
          description: "Case, Lead, and Account objects only. If true, applies assignment and auto-response rules. Default is false.",
        },
        trigger_user_email: {
          type: "boolean",
          description: "Case and Lead objects only. If true, sends email notifications to users in the organization. Default is false.",
        },
        if_unmodified_since: {
          type: "string",
          description: "RFC 7231 date/time format. Makes the request conditional - server will only update if the record hasn't been modified since this timestamp. Returns 412 Precondition Failed if the record was modified after this date.",
        },
        trigger_other_email: {
          type: "boolean",
          description: "Case object only. If true, sends email notifications outside the organization. Default is false.",
        },
        allow_save_on_duplicate: {
          type: "boolean",
          description: "If true, allows the record to be saved even if duplicate detection rules are triggered. Default is false.",
        },
      },
      required: [
        "record_id",
        "fields",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "ui_api_records_lookups_and_related_lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a record.",
    ],
  }),
  composioTool({
    name: "salesforce_update_related_list_preferences",
    description: "Tool to update user preferences for a specific related list on an object in Salesforce. Use when customizing display settings such as column widths, text wrapping, column ordering, and sorting preferences for related lists.",
    toolSlug: "SALESFORCE_UPDATE_RELATED_LIST_PREFERENCES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ordered_by: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              isAscending: {
                type: "boolean",
                description: "Whether the sort order is ascending (true) or descending (false).",
              },
              fieldApiName: {
                type: "string",
                description: "The API name of the field to sort by.",
              },
            },
            description: "Sort preference for a column.",
          },
          description: "Array of sort preference objects defining field sorting order. Each object specifies a field and sort direction.",
        },
        column_wrap: {
          type: "object",
          additionalProperties: true,
          description: "Text wrapping preferences for columns, mapping field API names to boolean wrap settings. Set to true to enable text wrapping for that column, false to disable.",
        },
        column_widths: {
          type: "object",
          additionalProperties: true,
          description: "User-defined column width preferences mapping field API names to pixel widths. Use this to customize how wide each column appears in the related list.",
        },
        composite_layout_name: {
          type: "string",
          description: "The composite layout name in format {objectApiName}.{relatedListId}. This identifies which related list on which object to update preferences for.",
        },
      },
      required: [
        "composite_layout_name",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "composite_and_tree_apis",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Related List Preferences.",
    ],
  }),
  composioTool({
    name: "salesforce_update_task",
    description: "Updates an existing task in Salesforce with new information. Only provided fields will be updated.",
    toolSlug: "SALESFORCE_UPDATE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        status: {
          type: "string",
          description: "Updated status. Leave empty to keep unchanged.",
        },
        who_id: {
          type: "string",
          description: "Updated Contact or Lead ID. Leave empty to keep unchanged.",
        },
        subject: {
          type: "string",
          description: "Updated subject/title of the task. Leave empty to keep unchanged.",
        },
        task_id: {
          type: "string",
          description: "The Salesforce ID of the task to update.",
        },
        what_id: {
          type: "string",
          description: "Updated related record ID. Leave empty to keep unchanged.",
        },
        priority: {
          type: "string",
          description: "Updated priority level. Leave empty to keep unchanged.",
        },
        description: {
          type: "string",
          description: "Updated description or notes. Leave empty to keep unchanged.",
        },
        activity_date: {
          type: "string",
          description: "Updated due date in YYYY-MM-DD format. Leave empty to keep unchanged.",
        },
        custom_fields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom field API names and their values. Custom field names typically end with '__c' (e.g., 'Priority_Level__c': 'High').",
        },
        is_reminder_set: {
          type: "boolean",
          description: "Whether to set/unset a reminder. Leave empty to keep unchanged.",
        },
        reminder_date_time: {
          type: "string",
          description: "Updated reminder date/time in ISO format. Leave empty to keep unchanged.",
        },
      },
      required: [
        "task_id",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Update task.",
    ],
  }),
  composioTool({
    name: "salesforce_upload_file",
    description: "Upload a file to Salesforce Files home via the Connect REST API. Use when you need to attach files to records or store them in a user's personal library. File size limit: 50 MB per request.",
    toolSlug: "SALESFORCE_UPLOAD_FILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        desc: {
          type: "string",
          description: "Description of the file to help users understand its content.",
        },
        file: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The filename that will be used when uploading the file to the destination service",
            },
            s3key: {
              type: "string",
              description: "The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file",
            },
          },
          description: "File to upload to Salesforce Files home. Either 'file' or 'filename' + 'content_b64' must be provided.",
        },
        title: {
          type: "string",
          description: "The title/name of the file in Salesforce. If not specified, the filename from the uploaded file will be used.",
        },
        filename: {
          type: "string",
          description: "the name of the file (e.g., 'document.pdf'). Must be used together with 'content_b64'.",
        },
        content_b64: {
          type: "string",
          description: "Base64-encoded file content. Must be used together with 'filename'.",
        },
        mimetype_override: {
          type: "string",
          description: "MIME type for the file when using filename/content_b64. Defaults to 'application/octet-stream' if not provided.",
        },
        first_publish_location_id: {
          type: "string",
          description: "The ID of the record to associate the file with (typically an 18-character Salesforce ID). If not specified, the file is uploaded to the user's personal library. Can be Account, Contact, Lead, Opportunity, or other record IDs.",
        },
      },
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "files_and_collaboration",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload file to Salesforce Files.",
    ],
  }),
  composioTool({
    name: "salesforce_upload_job_data",
    description: "Tool to upload CSV data to a Salesforce Bulk API v2 ingest job. Use after creating a job and before closing it. Only ONE upload is allowed per job - multiple uploads will fail. After upload, close the job with state 'UploadComplete' to begin processing.",
    toolSlug: "SALESFORCE_UPLOAD_JOB_DATA",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier of the Bulk API v2 ingest job to upload data to. This is the job ID returned from job creation.",
        },
        csv_data: {
          type: "string",
          description: "The CSV-formatted data to upload. First row must contain column headers matching Salesforce object field names. Subsequent rows contain the data records. Line endings must match the lineEnding parameter specified during job creation (LF or CRLF).",
        },
      },
      required: [
        "job_id",
        "csv_data",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "bulk_data_jobs",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload job data.",
    ],
  }),
  composioTool({
    name: "salesforce_upsert_sobject_by_external_id",
    description: "Tool to upsert records using sObject Rows by External ID. Use when you need to create or update a Salesforce record based on an external ID field value - creates a new record if the external ID doesn't exist, or updates the existing record if it does.",
    toolSlug: "SALESFORCE_UPSERT_SOBJECT_BY_EXTERNAL_ID",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "object",
          additionalProperties: true,
          description: "JSON object containing the fields to create or update. Field names should be the Salesforce API names with their corresponding values.",
        },
        sobject: {
          type: "string",
          description: "The API name of the Salesforce object (e.g., Account, Contact, CustomObject__c).",
        },
        field_name: {
          type: "string",
          description: "The API name of the external ID field. This field must be marked as 'External ID' in Salesforce.",
        },
        field_value: {
          type: "string",
          description: "The value of the external ID for the specific record to upsert.",
        },
        update_only: {
          type: "boolean",
          description: "Available in API v62.0+. When set to true, only updates existing records without creating new ones. Returns 404 if record doesn't exist.",
        },
      },
      required: [
        "sobject",
        "field_name",
        "field_value",
        "fields",
      ],
    },
    tags: [
      "composio",
      "salesforce",
      "write",
      "sobjects_crud_and_collections",
    ],
    askBefore: [
      "Confirm the parameters before executing Upsert sObject by External ID.",
    ],
    idempotent: true,
  }),
];
