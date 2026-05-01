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
    integration: "hubspot",
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
      toolkit: "hubspot",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const hubspotComposioTools: IntegrationTool[] = [
  composioTool({
    name: "hubspot_add_asset_association",
    description: "Associates an existing asset ('FORM', 'OBJECT_LIST', or 'EXTERNAL_WEB_URL') with a specified HubSpot marketing campaign.",
    toolSlug: "HUBSPOT_ADD_ASSET_ASSOCIATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        assetId: {
          type: "string",
          description: "The unique identifier of the asset to be associated with the campaign. This ID is specific to the assetType. For FORMs, use the form's numeric ID. For OBJECT_LIST, use the list ID (ILS ID). For EMAIL, use the email's content ID. For LANDING_PAGE or BLOG_POST, use the page/post ID. These IDs can be obtained from HubSpot's UI (in the asset's URL or details panel) or by using the corresponding list/search actions for that asset type.",
        },
        assetType: {
          type: "string",
          description: "Type of asset to associate with the campaign. Commonly supported types include: 'FORM', 'OBJECT_LIST' (Static/Contact List), 'EXTERNAL_WEB_URL', 'EMAIL', 'LANDING_PAGE', 'BLOG_POST', 'CTA', 'WORKFLOW', 'SOCIAL_POST', 'WEBSITE_PAGE', 'SEQUENCE', 'MEETING_EVENT', 'PLAYBOOK', 'FEEDBACK_SURVEY', 'SALES_DOCUMENT'. HubSpot continues to expand asset type support over time.",
        },
        campaignGuid: {
          type: "string",
          description: "The unique identifier (UUID) of the HubSpot campaign to which the asset will be associated.",
        },
      },
      required: [
        "campaignGuid",
        "assetType",
        "assetId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "asset",
    ],
    askBefore: [
      "Confirm the parameters before executing Add asset association.",
    ],
  }),
  composioTool({
    name: "hubspot_add_token_to_event_template",
    description: "Adds a new custom data token to an existing event template for a specified HubSpot application, optionally populating a CRM object property if objectPropertyName is provided.",
    toolSlug: "HUBSPOT_ADD_TOKEN_TO_EVENT_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The internal name of the token, used for referencing it within templates. Must be unique for this event template. Allowed characters: alphanumeric, periods (.), dashes (-), or underscores (_).",
        },
        type: {
          type: "string",
          description: "The data type of the token. Determines how the token's value is stored and validated.",
          enum: [
            "date",
            "enumeration",
            "number",
            "string",
          ],
        },
        appId: {
          type: "integer",
          description: "Numeric identifier of the target application associated with the event template. Provided in the URL path.",
        },
        label: {
          type: "string",
          description: "The user-facing label for the token. This label is used for list segmentation and in reporting.",
        },
        options: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              label: {
                type: "string",
                description: "The user-facing display text for this option.",
              },
              value: {
                type: "string",
                description: "The internal programmatic value associated with this option.",
              },
            },
            description: "Represents a single choice in an enumeration token, consisting of a display label and an internal value.",
          },
          description: "A list of options for the token, required and applicable only if the token `type` is 'enumeration'. Each option must have a 'label' and a 'value'.",
        },
        eventTemplateId: {
          type: "string",
          description: "Unique identifier of the event template. Provided in the URL path.",
        },
        objectPropertyName: {
          type: "string",
          description: "The name of an existing CRM object property (e.g., 'dealstage', 'lifecyclestage'). If provided, this token will populate the specified CRM object property associated with the event. This allows for building or updating CRM objects through the Timeline API.",
        },
      },
      required: [
        "eventTemplateId",
        "appId",
        "name",
        "label",
        "type",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "tokens",
    ],
    askBefore: [
      "Confirm the parameters before executing Add token to event template.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_batch_of_feedback_submissions",
    description: "Asynchronously archives a batch of HubSpot feedback submissions using their unique IDs, which must correspond to valid and existing submissions; the operation is queued, and submissions are moved from active views without being deleted.",
    toolSlug: "HUBSPOT_ARCHIVE_BATCH_OF_FEEDBACK_SUBMISSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the feedback submission to be archived.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "A list of objects, where each object contains the 'id' of a feedback submission to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Archive batch of feedback submissions by id.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_batch_of_line_items",
    description: "Archives a batch of existing line items by their unique IDs in HubSpot CRM; this operation is irreversible via the API.",
    toolSlug: "HUBSPOT_ARCHIVE_BATCH_OF_LINE_ITEMS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the line item to be archived.",
              },
            },
            description: "Request schema for individual line item archival input.",
          },
          description: "A list of objects, where each object contains the 'id' of a line item to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive batch of line items by id.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_batch_of_objects",
    description: "Archives a batch of existing, non-archived CRM objects of a specified `objectType` by their IDs, effectively hiding them from active use.",
    toolSlug: "HUBSPOT_ARCHIVE_BATCH_OF_OBJECTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the CRM object to be archived.",
              },
            },
            description: "Request schema for individual object identifiers to be included in the batch archive operation.",
          },
          description: "A list of input objects, where each object contains the 'id' of a CRM record to be archived.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object to archive (e.g., 'contacts', 'companies', 'deals', 'tickets').",
        },
      },
      required: [
        "objectType",
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive batch of objects by id.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_batch_of_properties",
    description: "Archives a batch of properties by their internal names for a specified HubSpot CRM object type; this operation is idempotent and safe to retry.",
    toolSlug: "HUBSPOT_ARCHIVE_BATCH_OF_PROPERTIES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The internal name of the property to be archived.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "A list of properties to archive, each specified by its internal `name`.",
        },
        objectType: {
          type: "string",
          description: "The HubSpot CRM object type for which properties are being archived.",
        },
      },
      required: [
        "objectType",
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive batch of properties.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_archive_batch_of_quotes",
    description: "Archives a batch of existing quotes by their IDs, removing them from active views while keeping them accessible in your HubSpot account for viewing, downloading, cloning, or deletion; note that archived quotes cannot be restored to active status.",
    toolSlug: "HUBSPOT_ARCHIVE_BATCH_OF_QUOTES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the quote to be archived.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "A list of objects, where each object contains the ID of a quote to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive a batch of quotes by id.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_companies",
    description: "Archives multiple HubSpot companies by their IDs.",
    toolSlug: "HUBSPOT_ARCHIVE_COMPANIES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the company to be archived.",
              },
            },
            description: "Request schema for individual company archive operation.",
          },
          description: "A list of company objects, each specifying the ID of the company to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive companies.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_company",
    description: "Archives an existing company in HubSpot CRM by its `companyId`, moving it to a recycling bin from which it can be restored, rather than permanently deleting it.",
    toolSlug: "HUBSPOT_ARCHIVE_COMPANY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        companyId: {
          type: "string",
          description: "The numeric identifier for the company to archive. Must contain only digits (e.g., '1234567890'). Do not use email addresses or other non-numeric identifiers.",
        },
      },
      required: [
        "companyId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive company.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_contact",
    description: "Archives a HubSpot contact by its ID.",
    toolSlug: "HUBSPOT_ARCHIVE_CONTACT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contactId: {
          type: "string",
          description: "Numeric HubSpot contact ID (e.g., '386009987808'). Note: The archive endpoint does NOT support email addresses or idProperty - use HUBSPOT_GET_CONTACTS or HUBSPOT_SEARCH_CONTACTS to find the numeric ID first.",
        },
      },
      required: [
        "contactId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive contact.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_contacts",
    description: "Archives multiple HubSpot contacts by their IDs.",
    toolSlug: "HUBSPOT_ARCHIVE_CONTACTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The numeric HubSpot contact ID. Must be a numeric string (e.g., '12345'). Email addresses are NOT valid contact IDs - use HUBSPOT_LIST_CONTACTS or HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA to find the numeric ID for a contact.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "A list of contact objects, each specifying the ID of the contact to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive contacts.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_crm_object_by_id",
    description: "Archives a specific HubSpot CRM object by its type and ID, moving it to the recycling bin; this action is irreversible via the API but objects can often be restored via the HubSpot UI.",
    toolSlug: "HUBSPOT_ARCHIVE_CRM_OBJECT_BY_ID",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectId: {
          type: "string",
          description: "The unique identifier for the CRM object to be archived. This ID must correspond to an existing object of the specified `objectType`. The format is typically a string of numbers or a UUID. Ensure the correct ID is provided as this operation is irreversible via the API.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object to be archived. This value is case-sensitive, must be a valid HubSpot CRM object type (e.g., contacts, companies, deals, quotes), and should be provided in lowercase plural form (e.g., 'contacts', not 'Contact').",
        },
      },
      required: [
        "objectType",
        "objectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive a CRM object by ID.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_deals",
    description: "Archives multiple HubSpot deals by their IDs.",
    toolSlug: "HUBSPOT_ARCHIVE_DEALS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The numeric identifier of the deal to be archived. HubSpot deal IDs are always numeric strings (e.g., '12345'). Do NOT use email addresses, contact IDs, or other identifiers. Must contain only digits.",
              },
            },
            description: "Request schema for individual deal archive operation.",
          },
          description: "List of deal objects to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive deals.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_email",
    description: "Archives the HubSpot email specified by `emailId` by moving it to the recycling bin, making it inaccessible unless restored.",
    toolSlug: "HUBSPOT_ARCHIVE_EMAIL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "Numeric object ID of the email engagement record in HubSpot. This is NOT an email address - it must be a numeric ID (e.g., '1234567890'). The ID can be retrieved from the HubSpot CRM email activity list or from previous API responses.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing ArchiveEmail email.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_emails",
    description: "Archives multiple HubSpot emails by their IDs.",
    toolSlug: "HUBSPOT_ARCHIVE_EMAILS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the email to be archived.",
              },
            },
            description: "Request schema for individual email archive operation.",
          },
          description: "List of email objects to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive emails.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_feedback_submission",
    description: "Archives an existing, non-archived Feedback Submission in HubSpot CRM by its ID, moving it to the recycling bin (not permanently deleting it).",
    toolSlug: "HUBSPOT_ARCHIVE_FEEDBACK_SUBMISSION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        feedbackSubmissionId: {
          type: "string",
          description: "The unique identifier of an existing Feedback Submission in HubSpot CRM to be archived.",
        },
      },
      required: [
        "feedbackSubmissionId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive feedback submission.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_line_item",
    description: "Archives a specific HubSpot line item by its ID, moving it to a recoverable state.",
    toolSlug: "HUBSPOT_ARCHIVE_LINE_ITEM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lineItemId: {
          type: "string",
          description: "The unique identifier of the existing line item in HubSpot CRM to be archived.",
        },
      },
      required: [
        "lineItemId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive line item by id.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_archive_product",
    description: "Archives a HubSpot product by its ID.",
    toolSlug: "HUBSPOT_ARCHIVE_PRODUCT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        productId: {
          type: "string",
          description: "Unique HubSpot identifier for the product to be archived.",
        },
      },
      required: [
        "productId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive product.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_products",
    description: "Archives multiple HubSpot products by their IDs.",
    toolSlug: "HUBSPOT_ARCHIVE_PRODUCTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the product to be archived.",
              },
            },
            description: "Request schema for individual product archive operation.",
          },
          description: "List of product objects to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive products.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_property_by_object_type_and_name",
    description: "Archives a specified CRM property by its object type and name, moving it to the recycling bin; note that some default HubSpot properties cannot be archived.",
    toolSlug: "HUBSPOT_ARCHIVE_PROPERTY_BY_OBJECT_TYPE_AND_NAME",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The case-sensitive type of CRM object (e.g., 'contacts', 'companies') for which the property is being archived; must match an existing object type.",
        },
        propertyName: {
          type: "string",
          description: "The case-sensitive internal name of the property to archive (e.g., 'custom_field_1', 'annual_revenue').",
        },
      },
      required: [
        "objectType",
        "propertyName",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive property by object type and name.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_property_group",
    description: "Archives a HubSpot property group, making it inactive and hidden (not permanently deleted, allowing potential restoration) with immediate effect on its CRM visibility and usability.",
    toolSlug: "HUBSPOT_ARCHIVE_PROPERTY_GROUP",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        groupName: {
          type: "string",
          description: "The unique internal name of the property group you want to archive. This name is case-sensitive and must exactly match an existing property group's name within the specified `objectType`.",
        },
        objectType: {
          type: "string",
          description: "The specific CRM object type (e.g., 'contacts', 'companies', 'deals', or custom object types) that the property group belongs to. This value must be in lowercase and match an existing object type definition in your HubSpot account.",
        },
      },
      required: [
        "objectType",
        "groupName",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "groups",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive property group.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_quote",
    description: "Archives a HubSpot Quote object by ID, moving it to the recycling bin where it can be restored within 90 days.",
    toolSlug: "HUBSPOT_ARCHIVE_QUOTE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        quoteId: {
          type: "string",
          description: "The unique identifier (ID) of an existing Quote object in HubSpot CRM to be archived.",
        },
      },
      required: [
        "quoteId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive quote object by id.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_ticket",
    description: "Archives a HubSpot ticket by its ID.",
    toolSlug: "HUBSPOT_ARCHIVE_TICKET",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ticketId: {
          type: "string",
          description: "Unique HubSpot identifier for the ticket to be archived.",
        },
      },
      required: [
        "ticketId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive ticket.",
    ],
  }),
  composioTool({
    name: "hubspot_archive_tickets",
    description: "Archives multiple HubSpot tickets by their IDs.",
    toolSlug: "HUBSPOT_ARCHIVE_TICKETS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the ticket to be archived.",
              },
            },
            description: "Request schema for individual ticket archive operation.",
          },
          description: "List of ticket objects to be archived.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive tickets.",
    ],
  }),
  composioTool({
    name: "hubspot_audit_pipeline_changes",
    description: "Retrieves a reverse chronological audit log of all changes for a specific, existing HubSpot CRM pipeline, which is identified by its `pipelineId` and a valid `objectType` that supports pipelines (e.g., 'deals', 'tickets').",
    toolSlug: "HUBSPOT_AUDIT_PIPELINE_CHANGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The HubSpot CRM object type that has pipelines (e.g., 'deals', 'tickets'); determines the pipeline's context. Must be a valid, case-sensitive object type.",
        },
        pipelineId: {
          type: "string",
          description: "The unique identifier of an existing pipeline within the specified `objectType` for which to retrieve the audit history.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "pipeline_audits",
    ],
  }),
  composioTool({
    name: "hubspot_batch_read_companies_by_properties",
    description: "Batch-retrieves up to 100 HubSpot company records by their IDs in a single request. Supports custom ID properties (e.g., domain), selective property retrieval, and historical property values.",
    toolSlug: "HUBSPOT_BATCH_READ_COMPANIES_BY_PROPERTIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Unique identifier for the company, corresponding to the value of the property specified by `idProperty` in the main request.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "List of company identifiers to retrieve. Each `id` within an input object corresponds to the value of the property specified in `idProperty`.",
        },
        archived: {
          type: "boolean",
          description: "If true, returns only archived company records; otherwise (default), returns active, non-archived companies.",
        },
        idProperty: {
          type: "string",
          description: "Property name to use as the unique identifier for companies in `inputs`. Defaults to `hs_object_id` (the HubSpot record ID) if not specified. Can be set to any unique company property configured in your HubSpot account.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of company property names to retrieve. If omitted, a default set of properties (name, domain, hs_object_id, createdate, hs_lastmodifieddate, etc.) is returned.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of company property names for which to retrieve historical values. If not provided, no historical data is returned.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_batch_update_quotes",
    description: "Updates multiple existing HubSpot quotes in a batch; each quote is identified by its object ID or a custom unique property (via `idProperty`), and only writable properties are modified.",
    toolSlug: "HUBSPOT_BATCH_UPDATE_QUOTES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The quote's HubSpot object ID or the value of the unique property specified by `idProperty`.",
              },
              idProperty: {
                type: "string",
                description: "Name of the unique property used for quote identification if `id` is not the HubSpot object ID. If omitted, `id` is assumed to be the object ID.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Dictionary of writable properties to update (e.g., `hs_title`, `hs_status`). Keys are internal property names; values are the new property values.",
              },
            },
            description: "Defines a single quote update, specifying its identifier and the properties to change.",
          },
          description: "List of `InputsRequest` objects, each specifying a quote to update and its new property values.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch update quotes.",
    ],
  }),
  composioTool({
    name: "hubspot_cancel_import",
    description: "Cancels an active HubSpot data import job using its `importId`; this action is irreversible, and any data already processed will remain.",
    toolSlug: "HUBSPOT_CANCEL_IMPORT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        importId: {
          type: "integer",
          description: "The unique identifier for the active HubSpot import job to be cancelled; must correspond to an import job currently in progress.",
        },
      },
      required: [
        "importId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel active import.",
    ],
  }),
  composioTool({
    name: "hubspot_clone_marketing_email",
    description: "Duplicates an existing HubSpot marketing email, identified by its `id`, into a new draft; an optional `cloneName` can be assigned to this new email copy.",
    toolSlug: "HUBSPOT_CLONE_MARKETING_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the existing marketing email to be cloned.",
        },
        cloneName: {
          type: "string",
          description: "The name for the newly cloned marketing email. If not provided, HubSpot may assign a default name (e.g., 'Copy of [Original Email Name]').",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_vnext_emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Clone marketing email.",
    ],
  }),
  composioTool({
    name: "hubspot_configure_calling_extension_settings",
    description: "Configures or updates settings for a HubSpot app's calling extension, including its name, UI URL, iframe dimensions, `isReady` status, and `supportsCustomObjects` flag, for the specified `appId`.",
    toolSlug: "HUBSPOT_CONFIGURE_CALLING_EXTENSION_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "Publicly accessible HTTPS URL for the phone/calling UI, which should be built using the HubSpot Calling SDK.",
        },
        name: {
          type: "string",
          description: "Display name for the calling service in the HubSpot interface.",
        },
        appId: {
          type: "integer",
          description: "Unique identifier for the target HubSpot app whose calling extension settings are being configured.",
        },
        width: {
          type: "integer",
          description: "Target width in pixels for the iframe embedding the calling UI.",
        },
        height: {
          type: "integer",
          description: "Target height in pixels for the iframe embedding the calling UI.",
        },
        isReady: {
          type: "boolean",
          description: "If `true`, the calling service appears as an option under the 'Call' action in contact records; `false` hides it.",
        },
        supportsCustomObjects: {
          type: "boolean",
          description: "Specifies if the service is compatible with HubSpot's engagement v2 service and custom objects.",
        },
      },
      required: [
        "appId",
        "name",
        "width",
        "url",
        "height",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Configure calling extension settings.",
    ],
  }),
  composioTool({
    name: "hubspot_create_a_new_marketing_email",
    description: "Creates a new marketing email in HubSpot, allowing comprehensive configuration of content, recipients, sender details, A/B testing, scheduling, web version, and other settings; the internal `name` for the email is required.",
    toolSlug: "HUBSPOT_CREATE_A_NEW_MARKETING_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Internal name of the email, as displayed on the HubSpot email dashboard.",
        },
        state: {
          type: "string",
          description: "Current state of the email (e.g., DRAFT, SCHEDULED, PUBLISHED).",
          enum: [
            "AUTOMATED",
            "AUTOMATED_DRAFT",
            "AUTOMATED_SENDING",
            "AUTOMATED_FOR_FORM",
            "AUTOMATED_FOR_FORM_BUFFER",
            "AUTOMATED_FOR_FORM_DRAFT",
            "AUTOMATED_FOR_FORM_LEGACY",
            "BLOG_EMAIL_DRAFT",
            "BLOG_EMAIL_PUBLISHED",
            "DRAFT",
            "DRAFT_AB",
            "DRAFT_AB_VARIANT",
            "ERROR",
            "LOSER_AB_VARIANT",
            "PAGE_STUB",
            "PRE_PROCESSING",
            "PROCESSING",
            "PUBLISHED",
            "PUBLISHED_AB",
            "PUBLISHED_AB_VARIANT",
            "PUBLISHED_OR_SCHEDULED",
            "RSS_TO_EMAIL_DRAFT",
            "RSS_TO_EMAIL_PUBLISHED",
            "SCHEDULED",
            "SCHEDULED_AB",
            "SCHEDULED_OR_PUBLISHED",
            "AUTOMATED_AB",
            "AUTOMATED_AB_VARIANT",
            "AUTOMATED_DRAFT_AB",
            "AUTOMATED_DRAFT_ABVARIANT",
            "AUTOMATED_LOSER_ABVARIANT",
          ],
        },
        subject: {
          type: "string",
          description: "The subject line of the marketing email.",
        },
        archived: {
          type: "boolean",
          description: "True if the email is archived (typically hidden from main dashboard view).",
        },
        campaign: {
          type: "string",
          description: "ID (GUID) of the associated HubSpot campaign for tracking/reporting.",
        },
        language: {
          type: "string",
          description: "Primary language of the email content.",
          enum: [
            "af",
            "af-na",
            "af-za",
            "agq",
            "agq-cm",
            "ak",
            "ak-gh",
            "am",
            "am-et",
            "ar",
            "ar-001",
            "ar-ae",
            "ar-bh",
            "ar-dj",
            "ar-dz",
            "ar-eg",
            "ar-eh",
            "ar-er",
            "ar-il",
            "ar-iq",
            "ar-jo",
            "ar-km",
            "ar-kw",
            "ar-lb",
            "ar-ly",
            "ar-ma",
            "ar-mr",
            "ar-om",
            "ar-ps",
            "ar-qa",
            "ar-sa",
            "ar-sd",
            "ar-so",
            "ar-ss",
            "ar-sy",
            "ar-td",
            "ar-tn",
            "ar-ye",
            "as",
            "as-in",
            "asa",
            "asa-tz",
            "ast",
            "ast-es",
            "az",
            "az-az",
            "bas",
            "bas-cm",
            "be",
            "be-by",
            "bem",
            "bem-zm",
            "bez",
            "bez-tz",
            "bg",
            "bg-bg",
            "bm",
            "bm-ml",
            "bn",
            "bn-bd",
            "bn-in",
            "bo",
            "bo-cn",
            "bo-in",
            "br",
            "br-fr",
            "brx",
            "brx-in",
            "bs",
            "bs-ba",
            "ca",
            "ca-ad",
            "ca-es",
            "ca-fr",
            "ca-it",
            "ccp",
            "ccp-bd",
            "ccp-in",
            "ce",
            "ce-ru",
            "ceb",
            "ceb-ph",
            "cgg",
            "cgg-ug",
            "chr",
            "chr-us",
            "ckb",
            "ckb-iq",
            "ckb-ir",
            "cs",
            "cs-cz",
            "cu",
            "cu-ru",
            "cy",
            "cy-gb",
            "da",
            "da-dk",
            "da-gl",
            "dav",
            "dav-ke",
            "de",
            "de-at",
            "de-be",
            "de-ch",
            "de-de",
            "de-gr",
            "de-it",
            "de-li",
            "de-lu",
            "dje",
            "dje-ne",
            "doi",
            "doi-in",
            "dsb",
            "dsb-de",
            "dua",
            "dua-cm",
            "dyo",
            "dyo-sn",
            "dz",
            "dz-bt",
            "ebu",
            "ebu-ke",
            "ee",
            "ee-gh",
            "ee-tg",
            "el",
            "el-cy",
            "el-gr",
            "en",
            "en-001",
            "en-150",
            "en-ae",
            "en-ag",
            "en-ai",
            "en-as",
            "en-at",
            "en-au",
            "en-bb",
            "en-be",
            "en-bi",
            "en-bm",
            "en-bs",
            "en-bw",
            "en-bz",
            "en-ca",
            "en-cc",
            "en-ch",
            "en-ck",
            "en-cm",
            "en-cn",
            "en-cx",
            "en-cy",
            "en-de",
            "en-dg",
            "en-dk",
            "en-dm",
            "en-er",
            "en-fi",
            "en-fj",
            "en-fk",
            "en-fm",
            "en-gb",
            "en-gd",
            "en-gg",
            "en-gh",
            "en-gi",
            "en-gm",
            "en-gu",
            "en-gy",
            "en-hk",
            "en-ie",
            "en-il",
            "en-im",
            "en-in",
            "en-io",
            "en-je",
            "en-jm",
            "en-ke",
            "en-ki",
            "en-kn",
            "en-ky",
            "en-lc",
            "en-lr",
            "en-ls",
            "en-lu",
            "en-mg",
            "en-mh",
            "en-mo",
            "en-mp",
            "en-ms",
            "en-mt",
            "en-mu",
            "en-mw",
            "en-mx",
            "en-my",
            "en-na",
            "en-nf",
            "en-ng",
            "en-nl",
            "en-nr",
            "en-nu",
            "en-nz",
            "en-pg",
            "en-ph",
            "en-pk",
            "en-pn",
            "en-pr",
            "en-pw",
            "en-rw",
            "en-sb",
            "en-sc",
            "en-sd",
            "en-se",
            "en-sg",
            "en-sh",
            "en-si",
            "en-sl",
            "en-ss",
            "en-sx",
            "en-sz",
            "en-tc",
            "en-tk",
            "en-to",
            "en-tt",
            "en-tv",
            "en-tz",
            "en-ug",
            "en-um",
            "en-us",
            "en-vc",
            "en-vg",
            "en-vi",
            "en-vu",
            "en-ws",
            "en-za",
            "en-zm",
            "en-zw",
            "eo",
            "eo-001",
            "es",
            "es-419",
            "es-ar",
            "es-bo",
            "es-br",
            "es-bz",
            "es-cl",
            "es-co",
            "es-cr",
            "es-cu",
            "es-do",
            "es-ea",
            "es-ec",
            "es-es",
            "es-gq",
            "es-gt",
            "es-hn",
            "es-ic",
            "es-mx",
            "es-ni",
            "es-pa",
            "es-pe",
            "es-ph",
            "es-pr",
            "es-py",
            "es-sv",
            "es-us",
            "es-uy",
            "es-ve",
            "et",
            "et-ee",
            "eu",
            "eu-es",
            "ewo",
            "ewo-cm",
            "fa",
            "fa-af",
            "fa-ir",
            "ff",
            "ff-bf",
            "ff-cm",
            "ff-gh",
            "ff-gm",
            "ff-gn",
            "ff-gw",
            "ff-lr",
            "ff-mr",
            "ff-ne",
            "ff-ng",
            "ff-sl",
            "ff-sn",
            "fi",
            "fi-fi",
            "fil",
            "fil-ph",
            "fo",
            "fo-dk",
            "fo-fo",
            "fr",
            "fr-be",
            "fr-bf",
            "fr-bi",
            "fr-bj",
            "fr-bl",
            "fr-ca",
            "fr-cd",
            "fr-cf",
            "fr-cg",
            "fr-ch",
            "fr-ci",
            "fr-cm",
            "fr-dj",
            "fr-dz",
            "fr-fr",
            "fr-ga",
            "fr-gf",
            "fr-gn",
            "fr-gp",
            "fr-gq",
            "fr-ht",
            "fr-km",
            "fr-lu",
            "fr-ma",
            "fr-mc",
            "fr-mf",
            "fr-mg",
            "fr-ml",
            "fr-mq",
            "fr-mr",
            "fr-mu",
            "fr-nc",
            "fr-ne",
            "fr-pf",
            "fr-pm",
            "fr-re",
            "fr-rw",
            "fr-sc",
            "fr-sn",
            "fr-sy",
            "fr-td",
            "fr-tg",
            "fr-tn",
            "fr-vu",
            "fr-wf",
            "fr-yt",
            "fur",
            "fur-it",
            "fy",
            "fy-nl",
            "ga",
            "ga-gb",
            "ga-ie",
            "gd",
            "gd-gb",
            "gl",
            "gl-es",
            "gsw",
            "gsw-ch",
            "gsw-fr",
            "gsw-li",
            "gu",
            "gu-in",
            "guz",
            "guz-ke",
            "gv",
            "gv-im",
            "ha",
            "ha-gh",
            "ha-ne",
            "ha-ng",
            "haw",
            "haw-us",
            "he",
            "hi",
            "hi-in",
            "hr",
            "hr-ba",
            "hr-hr",
            "hsb",
            "hsb-de",
            "hu",
            "hu-hu",
            "hy",
            "hy-am",
            "ia",
            "ia-001",
            "id",
            "ig",
            "ig-ng",
            "ii",
            "ii-cn",
            "id-id",
            "is",
            "is-is",
            "it",
            "it-ch",
            "it-it",
            "it-sm",
            "it-va",
            "he-il",
            "ja",
            "ja-jp",
            "jgo",
            "jgo-cm",
            "yi",
            "yi-001",
            "jmc",
            "jmc-tz",
            "jv",
            "jv-id",
            "ka",
            "ka-ge",
            "kab",
            "kab-dz",
            "kam",
            "kam-ke",
            "kde",
            "kde-tz",
            "kea",
            "kea-cv",
            "khq",
            "khq-ml",
            "ki",
            "ki-ke",
            "kk",
            "kk-kz",
            "kkj",
            "kkj-cm",
            "kl",
            "kl-gl",
            "kln",
            "kln-ke",
            "km",
            "km-kh",
            "kn",
            "kn-in",
            "ko",
            "ko-kp",
            "ko-kr",
            "kok",
            "kok-in",
            "ks",
            "ks-in",
            "ksb",
            "ksb-tz",
            "ksf",
            "ksf-cm",
            "ksh",
            "ksh-de",
            "kw",
            "kw-gb",
            "ku",
            "ku-tr",
            "ky",
            "ky-kg",
            "lag",
            "lag-tz",
            "lb",
            "lb-lu",
            "lg",
            "lg-ug",
            "lkt",
            "lkt-us",
            "ln",
            "ln-ao",
            "ln-cd",
            "ln-cf",
            "ln-cg",
            "lo",
            "lo-la",
            "lrc",
            "lrc-iq",
            "lrc-ir",
            "lt",
            "lt-lt",
            "lu",
            "lu-cd",
            "luo",
            "luo-ke",
            "luy",
            "luy-ke",
            "lv",
            "lv-lv",
            "mai",
            "mai-in",
            "mas",
            "mas-ke",
            "mas-tz",
            "mer",
            "mer-ke",
            "mfe",
            "mfe-mu",
            "mg",
            "mg-mg",
            "mgh",
            "mgh-mz",
            "mgo",
            "mgo-cm",
            "mi",
            "mi-nz",
            "mk",
            "mk-mk",
            "ml",
            "ml-in",
            "mn",
            "mn-mn",
            "mni",
            "mni-in",
            "mr",
            "mr-in",
            "ms",
            "ms-bn",
            "ms-id",
            "ms-my",
            "ms-sg",
            "mt",
            "mt-mt",
            "mua",
            "mua-cm",
            "my",
            "my-mm",
            "mzn",
            "mzn-ir",
            "naq",
            "naq-na",
            "nb",
            "nb-no",
            "nb-sj",
            "nd",
            "nd-zw",
            "nds",
            "nds-de",
            "nds-nl",
            "ne",
            "ne-in",
            "ne-np",
            "nl",
            "nl-aw",
            "nl-be",
            "nl-ch",
            "nl-bq",
            "nl-cw",
            "nl-lu",
            "nl-nl",
            "nl-sr",
            "nl-sx",
            "nmg",
            "nmg-cm",
            "nn",
            "nn-no",
            "nnh",
            "nnh-cm",
            "no",
            "no-no",
            "nus",
            "nus-ss",
            "nyn",
            "nyn-ug",
            "om",
            "om-et",
            "om-ke",
            "or",
            "or-in",
            "os",
            "os-ge",
            "os-ru",
            "pa",
            "pa-in",
            "pa-pk",
            "pcm",
            "pcm-ng",
            "pl",
            "pl-pl",
            "prg",
            "prg-001",
            "ps",
            "ps-af",
            "ps-pk",
            "pt",
            "pt-ao",
            "pt-br",
            "pt-ch",
            "pt-cv",
            "pt-gq",
            "pt-gw",
            "pt-lu",
            "pt-mo",
            "pt-mz",
            "pt-pt",
            "pt-st",
            "pt-tl",
            "qu",
            "qu-bo",
            "qu-ec",
            "qu-pe",
            "rm",
            "rm-ch",
            "rn",
            "rn-bi",
            "ro",
            "ro-md",
            "ro-ro",
            "rof",
            "rof-tz",
            "ru",
            "ru-by",
            "ru-kg",
            "ru-kz",
            "ru-md",
            "ru-ru",
            "ru-ua",
            "rw",
            "rw-rw",
            "rwk",
            "rwk-tz",
            "sa",
            "sa-in",
            "sah",
            "sah-ru",
            "saq",
            "saq-ke",
            "sat",
            "sat-in",
            "sbp",
            "sbp-tz",
            "sd",
            "sd-in",
            "sd-pk",
            "se",
            "se-fi",
            "se-no",
            "se-se",
            "seh",
            "seh-mz",
            "ses",
            "ses-ml",
            "sg",
            "sg-cf",
            "shi",
            "shi-ma",
            "si",
            "si-lk",
            "sk",
            "sk-sk",
            "sl",
            "sl-si",
            "smn",
            "smn-fi",
            "sn",
            "sn-zw",
            "so",
            "so-dj",
            "so-et",
            "so-ke",
            "so-so",
            "sq",
            "sq-al",
            "sq-mk",
            "sq-xk",
            "sr",
            "sr-ba",
            "sr-cs",
            "sr-me",
            "sr-rs",
            "sr-xk",
            "su",
            "su-id",
            "sv",
            "sv-ax",
            "sv-fi",
            "sv-se",
            "sw",
            "sw-cd",
            "sw-ke",
            "sw-tz",
            "sw-ug",
            "sy",
            "ta",
            "ta-in",
            "ta-lk",
            "ta-my",
            "ta-sg",
            "te",
            "te-in",
            "teo",
            "teo-ke",
            "teo-ug",
            "tg",
            "tg-tj",
            "th",
            "th-th",
            "ti",
            "ti-er",
            "ti-et",
            "tk",
            "tk-tm",
            "tl",
            "to",
            "to-to",
            "tr",
            "tr-cy",
            "tr-tr",
            "tt",
            "tt-ru",
            "twq",
            "twq-ne",
            "tzm",
            "tzm-ma",
            "ug",
            "ug-cn",
            "uk",
            "uk-ua",
            "ur",
            "ur-in",
            "ur-pk",
            "uz",
            "uz-af",
            "uz-uz",
            "vai",
            "vai-lr",
            "vi",
            "vi-vn",
            "vo",
            "vo-001",
            "vun",
            "vun-tz",
            "wae",
            "wae-ch",
            "wo",
            "wo-sn",
            "xh",
            "xh-za",
            "xog",
            "xog-ug",
            "yav",
            "yav-cm",
            "yo",
            "yo-bj",
            "yo-ng",
            "yue",
            "yue-cn",
            "yue-hk",
            "zgh",
            "zgh-ma",
            "zh",
            "zh-cn",
            "zh-hk",
            "zh-mo",
            "zh-sg",
            "zh-tw",
            "zh-hans",
            "zh-hant",
            "zu",
            "zu-za",
          ],
        },
        publishDate: {
          type: "string",
          description: "Scheduled ISO 8601 date-time for email publication or sending.",
        },
        subcategory: {
          type: "string",
          description: "Email subcategory for internal organization or specific types (e.g., 'newsletter').",
        },
        activeDomain: {
          type: "string",
          description: "Domain for sending the email; must be a connected and verified HubSpot sending domain.",
        },
        rssData__url: {
          type: "string",
          description: "URL of the RSS feed for email content. Must be valid and accessible if using RSS features.",
        },
        from__replyTo: {
          type: "string",
          description: "Primary 'From' and reply-to email address, unless `from__customReplyTo` is used.",
        },
        sendOnPublish: {
          type: "boolean",
          description: "True to send email immediately on publish; false to publish without sending until triggered/scheduled.",
        },
        businessUnitId: {
          type: "string",
          description: "The ID of the business unit this email is associated with, if applicable.",
        },
        from__fromName: {
          type: "string",
          description: "Sender name appearing in the 'From' field of the received email.",
        },
        rssData__timing: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary specifying the timing and scheduling details for sending RSS emails. Each key must map to a dictionary/object value, not a simple string. Example: {\"dayOfWeek\": {\"value\": \"Tuesday\"}, \"time\": {\"hour\": 9, \"minute\": 0}}.",
        },
        testing__testId: {
          type: "string",
          description: "The unique identifier for the A/B test associated with this email.",
        },
        content__widgets: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of widgets (e.g., text, images, CTAs) and their configurations for email content. Each key must map to a dictionary/object value, not a simple string. Example: {\"widgetId\": {\"type\": \"text\", \"content\": \"Hello\", \"style\": {...}}}.",
        },
        feedbackSurveyId: {
          type: "string",
          description: "The ID of the feedback survey linked to the email.",
        },
        webversion__slug: {
          type: "string",
          description: "Custom URL slug for the email's web version (e.g., 'july-newsletter').",
        },
        testing__abStatus: {
          type: "string",
          description: "Current A/B test status for this email (e.g., master, variant).",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__title: {
          type: "string",
          description: "Browser tab title for the email's web version.",
        },
        content__flexAreas: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary defining content and layout of flexible, customizable areas in the email template. Each key must map to a dictionary/object value, not a simple string. Example: {\"areaName\": {\"content\": {...}, \"layout\": {...}}}.",
        },
        webversion__domain: {
          type: "string",
          description: "Domain for the email's web version; defaults to HubSpot domain if unspecified.",
        },
        from__customReplyTo: {
          type: "string",
          description: "Custom reply-to email address, overrides main 'Reply To' if set.",
        },
        rssData__blogLayout: {
          type: "string",
          description: "Specifies the layout to be used for the blog RSS email.",
        },
        rssData__maxEntries: {
          type: "integer",
          description: "The maximum number of blog posts (RSS entries) to include in a single RSS email.",
        },
        content__smartFields: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of smart fields for email personalization based on contact properties. Each key must map to a dictionary/object value, not a simple string. Example: {\"fieldName\": {\"value\": \"defaultValue\", \"conditions\": {...}}}.",
        },
        testing__hoursToWait: {
          type: "integer",
          description: "Hours to wait for A/B test results before sending the winning version to remaining recipients.",
        },
        to__suppressGraymail: {
          type: "boolean",
          description: "True to not send to contacts identified by HubSpot as 'graymail' (low engagement).",
        },
        content__templatePath: {
          type: "string",
          description: "Path to the email template in HubSpot Design Manager.",
        },
        webversion__expiresAt: {
          type: "string",
          description: "ISO 8601 date-time when the web version expires and becomes inaccessible.",
        },
        rssData__blogEmailType: {
          type: "string",
          description: "The type of blog email, which determines send frequency (e.g., instant, daily, weekly).",
        },
        rssData__hubspotBlogId: {
          type: "string",
          description: "The ID of the HubSpot blog to be used for the RSS email.",
        },
        to__limitSendFrequency: {
          type: "boolean",
          description: "True to apply HubSpot's send frequency limits, preventing over-mailing.",
        },
        to__contactIds__exclude: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific contact IDs to explicitly exclude, even if in included lists.",
        },
        to__contactIds__include: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of specific contact IDs to include as recipients.",
        },
        testing__abSuccessMetric: {
          type: "string",
          description: "Metric (e.g., CLICKS_BY_OPENS) to determine the A/B test winning version.",
          enum: [
            "CLICKS_BY_OPENS",
            "CLICKS_BY_DELIVERED",
            "OPENS_BY_DELIVERED",
          ],
        },
        content__plainTextVersion: {
          type: "string",
          description: "Plain text version of the email, for non-HTML clients or recipient preference.",
        },
        content__widgetContainers: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of widget containers for grouping and managing widgets in the email template. Each key must map to a dictionary/object value, not a simple string. Example: {\"containerId\": {\"widgets\": [...], \"layout\": {...}}}.",
        },
        rssData__rssEntryTemplate: {
          type: "string",
          description: "The HTML template for formatting each individual RSS entry within the email.",
        },
        testing__abTestPercentage: {
          type: "integer",
          description: "Percentage of recipients in the A/B test group (e.g., 20 for 20%).",
        },
        to__contactLists__exclude: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of contact list IDs whose members to explicitly exclude. HubSpot contact list IDs are typically numeric strings (e.g., '12345', '67890'). Provide the numeric ID as a string.",
        },
        to__contactLists__include: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of contact list IDs whose members to include as recipients. HubSpot contact list IDs are typically numeric strings (e.g., '12345', '67890'). Provide the numeric ID as a string.",
        },
        webversion__redirectToUrl: {
          type: "string",
          description: "Custom URL for redirect if web version link is expired/deactivated.",
        },
        rssData__blogImageMaxWidth: {
          type: "integer",
          description: "The maximum width for images included from the blog feed in the RSS email.",
        },
        testing__abSamplingDefault: {
          type: "string",
          description: "Default email version (master/variant) if A/B test is inconclusive after the test period.",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__metaDescription: {
          type: "string",
          description: "Meta description for the web version, used by search engines.",
        },
        content__themeSettingsValues: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of theme settings values to customize email appearance. Each key must map to a dictionary/object value, not a simple string. Example: {\"brandColor\": {\"value\": \"#0055CC\"}, \"fontFamily\": {\"name\": \"Arial\"}}.",
        },
        testing__abSampleSizeDefault: {
          type: "string",
          description: "Default email version (master/variant) if A/B test sample size is too small for significance.",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__redirectToPageId: {
          type: "string",
          description: "ID of a HubSpot page for redirect if web version link is expired/deactivated.",
        },
        rssData__useHeadlineAsSubject: {
          type: "boolean",
          description: "If true, the email subject will be automatically populated from the blog post headline for RSS emails.",
        },
        subscriptionDetails__subscriptionId: {
          type: "string",
          description: "ID of the specific subscription type (e.g., newsletter, product updates).",
        },
        subscriptionDetails__officeLocationId: {
          type: "string",
          description: "ID of the office location for CAN-SPAM compliance and personalization.",
        },
        subscriptionDetails__preferencesGroupId: {
          type: "string",
          description: "ID of the subscription preferences group for managing recipient preferences.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing_emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a new marketing email.",
    ],
  }),
  composioTool({
    name: "hubspot_create_ab_test_variation",
    description: "Creates a new A/B test variation for an existing HubSpot marketing email, using its `contentId`; the new variation is created as a draft that can be edited before publishing. This action only creates the variation—it does not start the A/B test or send emails. Note: If an active variation already exists for the email, a new one will not be created. Requires Marketing Hub Professional or Enterprise subscription.",
    toolSlug: "HUBSPOT_CREATE_AB_TEST_VARIATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contentId: {
          type: "string",
          description: "The ID of the original email content to use as a template for the new variation.",
        },
        variationName: {
          type: "string",
          description: "A unique name for the new A/B test variation.",
        },
      },
      required: [
        "variationName",
        "contentId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_vnext_emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Create A/B test variation.",
    ],
  }),
  composioTool({
    name: "hubspot_create_and_return_a_new_property_group",
    description: "Creates a new, empty property group for a specified CRM object type in HubSpot, requiring a unique group name for that object type; properties must be added separately.",
    toolSlug: "HUBSPOT_CREATE_AND_RETURN_A_NEW_PROPERTY_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The unique internal programmatic name for the property group within the specified `objectType`, used for API referencing.",
        },
        label: {
          type: "string",
          description: "Human-readable label for the property group, displayed in the HubSpot UI.",
        },
        objectType: {
          type: "string",
          description: "The CRM object type for which the property group will be created.",
        },
        displayOrder: {
          type: "integer",
          description: "Order in which the group appears in the HubSpot UI. Positive values are sorted ascendingly; -1 places it after groups with positive `displayOrder`. If unspecified, the group is added at the end.",
        },
      },
      required: [
        "objectType",
        "name",
        "label",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "groups",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a new property group.",
    ],
  }),
  composioTool({
    name: "hubspot_create_association",
    description: "Creates a new custom association definition (schema) for a custom object in HubSpot, specifying how this object type can relate to another object type; this defines the association type itself, not actual record-to-record links. Note: This endpoint requires crm.schemas.custom.write scope and only works with custom objects (not standard HubSpot objects like contacts or companies).",
    toolSlug: "HUBSPOT_CREATE_ASSOCIATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Optional, user-defined unique name for the new association type (e.g., 'contact_to_company_custom'). If not supplied, HubSpot may generate a default.",
        },
        objectType: {
          type: "string",
          description: "Fully qualified name or object type ID (e.g., '2-12345') of the CUSTOM object schema for which the new association type is being defined. Must be a custom object, not a standard HubSpot object.",
        },
        toObjectTypeId: {
          type: "string",
          description: "Object type ID or fully qualified name for the 'to' side of the association. For standard objects use names ('contacts', 'companies', 'deals', 'tickets') or IDs ('0-1', '0-2', '0-3', '0-5'). For custom objects use their objectTypeId (e.g., '2-12345').",
        },
        fromObjectTypeId: {
          type: "string",
          description: "Object type ID or fully qualified name for the 'from' side of the association. For standard objects use names ('contacts', 'companies', 'deals', 'tickets') or IDs ('0-1', '0-2', '0-3', '0-5'). For custom objects use their objectTypeId (e.g., '2-12345').",
        },
      },
      required: [
        "objectType",
        "fromObjectTypeId",
        "toObjectTypeId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "Confirm the parameters before executing Create association for object type.",
    ],
  }),
  composioTool({
    name: "hubspot_create_batch_of_feedback_submissions",
    description: "Creates a batch of feedback submissions in HubSpot, ideal for bulk imports; all property names, `associationTypeId`s, and association `to_id`s must reference existing entities in HubSpot.",
    toolSlug: "HUBSPOT_CREATE_BATCH_OF_FEEDBACK_SUBMISSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Key-value pairs of properties for the feedback submission. Names are case-sensitive. Custom properties use their internal HubSpot name (e.g., `my_custom_property`).",
              },
              associations: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    types: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          associationTypeId: {
                            type: "integer",
                            description: "ID for the association type, defining the relationship's nature (e.g., feedback submission to contact). Find in HubSpot settings or via associations API.",
                          },
                          associationCategory: {
                            type: "string",
                            description: "Category of the association: `HUBSPOT_DEFINED` (standard), `USER_DEFINED` (custom), or `INTEGRATOR_DEFINED` (integration-created). HubSpot-defined are generally recommended.",
                            enum: [
                              "HUBSPOT_DEFINED",
                              "USER_DEFINED",
                              "INTEGRATOR_DEFINED",
                            ],
                          },
                        },
                        description: "Request schema for defining association types.",
                      },
                      description: "A list of association types to be created between the feedback submission and other CRM objects.",
                    },
                    to__id: {
                      type: "string",
                      description: "ID of the target CRM object (e.g., Contact, Company, Deal, Ticket) for association.",
                    },
                  },
                  description: "Request schema for defining associations between a feedback submission and other CRM objects.",
                },
                description: "A list of associations to be created for this feedback submission with other CRM objects.",
              },
            },
            description: "Request schema for a single feedback submission within a batch.",
          },
          description: "A list of feedback submission objects to create. Each object defines the properties and associations for a new feedback submission.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create batch of feedback submissions.",
    ],
  }),
  composioTool({
    name: "hubspot_create_batch_of_objects",
    description: "Creates multiple CRM objects of a specified `objectType` (e.g., contacts, companies, deals) in a single batch operation, where each object can have its own set of properties and associations.",
    toolSlug: "HUBSPOT_CREATE_BATCH_OF_OBJECTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                description: "A dictionary of properties for the object; keys are internal property names, and values are their corresponding string values. Property names must be valid for the specified `objectType`.",
              },
              associations: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    to: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        id: {
                          type: "string",
                          description: "The unique identifier of the existing object to associate with the new object.",
                        },
                      },
                      description: "The target object for the association.",
                    },
                    types: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          associationTypeId: {
                            type: "integer",
                            description: "The unique identifier for the type of association (e.g., contact to company, deal to contact).",
                          },
                          associationCategory: {
                            type: "string",
                            description: "The category of the association, indicating how it was defined.",
                            enum: [
                              "HUBSPOT_DEFINED",
                              "USER_DEFINED",
                              "INTEGRATOR_DEFINED",
                            ],
                          },
                        },
                        description: "Defines the type and category of an association.",
                      },
                      description: "A list defining the types of associations to create.",
                    },
                  },
                  description: "Specifies an association to be created between the new object and an existing object.",
                },
                description: "Optional. List of associations to create for this object. If you do not want to associate this object with any others, omit this field or provide an empty list. Example with associations: [{...}]. Example with none: [].",
              },
            },
            description: "Represents a single object to be created in the batch, including its properties and associations.",
          },
          description: "A list of objects to be created in batch. Each item in the list defines the properties and associations for a new object.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object to create in batch (e.g., 'contacts', 'companies', 'deals', 'tickets', 'products', 'line_items', or a custom object ID). Must be a valid HubSpot CRM object type.",
        },
      },
      required: [
        "objectType",
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create batch of objects.",
    ],
  }),
  composioTool({
    name: "hubspot_create_batch_of_properties",
    description: "Efficiently creates multiple CRM properties in a single batch for a specified HubSpot object type (e.g., 'contacts', 'companies', custom object ID), ideal for schema setup or updates.",
    toolSlug: "HUBSPOT_CREATE_BATCH_OF_PROPERTIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Internal programmatic name, unique for the object type. Must contain only lowercase letters (a-z), numbers (0-9), and underscores (_). Must start with a letter. No spaces, hyphens, or special characters allowed.",
              },
              type: {
                type: "string",
                description: "Specifies the kind of data this property stores.",
                enum: [
                  "string",
                  "number",
                  "date",
                  "datetime",
                  "enumeration",
                  "bool",
                ],
              },
              label: {
                type: "string",
                description: "Human-readable label for UI display.",
              },
              hidden: {
                type: "boolean",
                description: "If true, property is hidden and inaccessible in HubSpot UI.",
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    label: {
                      type: "string",
                      description: "Human-readable label for UI display.",
                    },
                    value: {
                      type: "string",
                      description: "Internal value for API use.",
                    },
                    hidden: {
                      type: "boolean",
                      description: "If true, hides the option in the HubSpot UI.",
                    },
                    description: {
                      type: "string",
                      description: "Optional descriptive context for the option.",
                    },
                    displayOrder: {
                      type: "integer",
                      description: "Sort order for display in UI (ascending; -1 for last).",
                    },
                  },
                  description: "Defines a single option for an enumeration property.",
                },
                description: "Defines pre-set options for an 'enumeration' type property; required if `type` is 'enumeration' and `externalOptions` is false. For boolean properties (type='bool'), if not provided, options are auto-generated with values 'true' and 'false'.",
              },
              fieldType: {
                type: "string",
                description: "Controls UI rendering, behavior, and input field type for the property.",
                enum: [
                  "textarea",
                  "text",
                  "date",
                  "file",
                  "number",
                  "select",
                  "radio",
                  "checkbox",
                  "booleancheckbox",
                  "calculation_equation",
                ],
              },
              formField: {
                type: "boolean",
                description: "If true, property can be used in HubSpot forms.",
              },
              groupName: {
                type: "string",
                description: "Property group name for UI organization.",
              },
              description: {
                type: "string",
                description: "User-friendly description/help text displayed in HubSpot UI.",
              },
              displayOrder: {
                type: "integer",
                description: "Display order within its group in UI (ascending; -1 for last).",
              },
              hasUniqueValue: {
                type: "boolean",
                description: "If true, property value must be unique across all object records; unchangeable once set.",
              },
              externalOptions: {
                type: "boolean",
                description: "For 'enumeration' type properties, if true, options are sourced externally (e.g., from HubSpot users if `referencedObjectType` is 'OWNER').",
              },
              calculationFormula: {
                type: "string",
                description: "HubSpot-specific formula if `fieldType` is 'calculation_equation', to compute the property's value.",
              },
              referencedObjectType: {
                type: "string",
                description: "For \"enumeration\" type with `externalOptions` true, set to \"OWNER\" to source options from HubSpot users.",
              },
            },
            description: "Definition of a CRM property to be created.",
          },
          description: "List of definitions for the new properties to be created.",
        },
        objectType: {
          type: "string",
          description: "Target HubSpot CRM object type (e.g., 'contacts', 'companies', 'deals', or custom object ID) for property creation.",
        },
      },
      required: [
        "objectType",
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create batch of properties.",
    ],
  }),
  composioTool({
    name: "hubspot_create_batch_of_quotes",
    description: "Creates multiple HubSpot CRM quotes in a batch, ideal for bulk operations; provide meaningful quote details in `inputs` as property requirements can vary, and inspect response for individual quote statuses as partial success is possible.",
    toolSlug: "HUBSPOT_CREATE_BATCH_OF_QUOTES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                description: "A dictionary of properties for the quote. Keys are property internal names (e.g., `hs_title`, `hs_expiration_date`) and values are the corresponding property values.",
              },
              associations: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    to: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        id: {
                          type: "string",
                          description: "The unique identifier of the CRM object to associate with (e.g., contact ID, company ID, deal ID).",
                        },
                      },
                      description: "The target CRM object to associate with this quote. Contains the ID of the object (contact, company, deal, etc.).",
                    },
                    types: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          associationTypeId: {
                            type: "integer",
                            description: "The unique identifier of the specific association type (e.g., the ID for 'quote to contact' association).",
                          },
                          associationCategory: {
                            type: "string",
                            description: "The category of the association, specifying whether it's HubSpot-defined, user-defined, or integrator-defined.",
                            enum: [
                              "HUBSPOT_DEFINED",
                              "USER_DEFINED",
                              "INTEGRATOR_DEFINED",
                            ],
                          },
                        },
                        description: "Defines an association type, including its category and specific type ID.",
                      },
                      description: "A list defining the types of associations to create. Each item specifies the association category and type ID.",
                    },
                  },
                  description: "Defines associations to be created, specifying the target object and the types of association.",
                },
                description: "A list of associations to be established for this quote, linking it to other CRM objects like contacts, companies, or deals.",
              },
            },
            description: "Represents a single quote to be created in the batch, including its properties and associations.",
          },
          description: "A list of quote objects to be created. Each object in the list defines the properties and associations for a new quote.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create batch of quotes.",
    ],
  }),
  composioTool({
    name: "hubspot_create_campaign",
    description: "Creates a new HubSpot campaign.",
    toolSlug: "HUBSPOT_CREATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        properties: {
          type: "object",
          additionalProperties: true,
          properties: {
            hs_utm: {
              type: "string",
              description: "UTM parameter for tracking campaign traffic (max 256 characters).",
            },
            hs_name: {
              type: "string",
              description: "Campaign name (required, max 256 characters).",
            },
            hs_notes: {
              type: "string",
              description: "Notes or description for the campaign.",
            },
            hs_audience: {
              type: "string",
              description: "Target audience for the campaign.",
            },
            hs_end_date: {
              type: "string",
              description: "Campaign end date in YYYY-MM-DD format.",
            },
            hs_start_date: {
              type: "string",
              description: "Campaign start date in YYYY-MM-DD format.",
            },
            hs_currency_code: {
              type: "string",
              description: "Currency code for the campaign budget (e.g., USD, EUR, GBP).",
            },
            hs_campaign_status: {
              type: "string",
              description: "Current status of the campaign.",
            },
          },
          description: "Campaign properties including name and optional metadata.",
        },
      },
      required: [
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing",
    ],
    askBefore: [
      "Confirm the parameters before executing Create campaign.",
    ],
  }),
  composioTool({
    name: "hubspot_create_campaigns",
    description: "Creates multiple HubSpot campaigns by calling the single campaign creation endpoint for each campaign. Note: HubSpot does not provide a native batch create endpoint for campaigns. This action creates multiple campaigns by making individual API calls for each campaign in the batch.",
    toolSlug: "HUBSPOT_CREATE_CAMPAIGNS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Campaign name.",
              },
              type: {
                type: "string",
                description: "Campaign type.",
              },
            },
            description: "Request schema for creating individual campaigns within a batch operation.",
          },
          description: "List of campaign objects to create.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create campaigns.",
    ],
  }),
  composioTool({
    name: "hubspot_create_companies",
    description: "Creates multiple new HubSpot companies in a single batch operation.",
    toolSlug: "HUBSPOT_CREATE_COMPANIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Company properties to set. Keys are HubSpot internal property names and values are the data to set. Common properties: 'name' (company name), 'domain' (website domain), 'phone', 'city', 'state', 'country', 'zip', 'address'. The 'industry' property must use HubSpot's predefined SCREAMING_SNAKE_CASE enum values (e.g., COMPUTER_SOFTWARE, FINANCIAL_SERVICES, HOSPITAL_HEALTH_CARE, RETAIL, BIOTECHNOLOGY). See HubSpot's company properties documentation for the full list of ~120 valid industry values.",
              },
            },
            description: "Request schema for creating individual companies within a batch operation.",
          },
          description: "A list of company objects to create. Each object represents one new company with its properties.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create companies.",
    ],
  }),
  composioTool({
    name: "hubspot_create_company",
    description: "Creates a new HubSpot company.",
    toolSlug: "HUBSPOT_CREATE_COMPANY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        zip: {
          type: "string",
          description: "Company's postal code.",
        },
        city: {
          type: "string",
          description: "City where the company is located.",
        },
        name: {
          type: "string",
          description: "Company name.",
        },
        type: {
          type: "string",
          description: "Type of company.",
        },
        phone: {
          type: "string",
          description: "Company's primary phone number.",
        },
        state: {
          type: "string",
          description: "State or region where the company is located.",
        },
        domain: {
          type: "string",
          description: "Company's primary domain name.",
        },
        address: {
          type: "string",
          description: "Company street address.",
        },
        country: {
          type: "string",
          description: "Country where the company is located.",
        },
        website: {
          type: "string",
          description: "Company's website URL.",
        },
        about_us: {
          type: "string",
          description: "Company description or about us information.",
        },
        address2: {
          type: "string",
          description: "Additional address information (suite, floor, etc.).",
        },
        industry: {
          type: "string",
          description: "The type of business the company performs. Must be one of HubSpot's predefined industry enum values in SCREAMING_SNAKE_CASE (e.g., COMPUTER_SOFTWARE, FINANCIAL_SERVICES, HOSPITAL_HEALTH_CARE, RETAIL, BIOTECHNOLOGY). See HubSpot's company properties documentation for the full list of ~120 valid values.",
        },
        timezone: {
          type: "string",
          description: "Company's timezone.",
        },
        is_public: {
          type: "string",
          description: "Whether the company is publicly traded.",
        },
        description: {
          type: "string",
          description: "Brief description of the company.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "Associationtypeid",
                    },
                    associationCategory: {
                      type: "string",
                      description: "Associationcategory",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Request schema for `Types`",
                },
                description: "Types",
              },
              to__id: {
                type: "string",
                description: "Id",
              },
            },
            description: "Request schema for `Associations`",
          },
          description: "List of associations to create with other existing HubSpot objects.",
        },
        founded_year: {
          type: "string",
          description: "Year the company was founded.",
        },
        annualrevenue: {
          type: "string",
          description: "Company's annual revenue.",
        },
        lifecyclestage: {
          type: "string",
          description: "Current lifecycle stage of the company.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties for the company.",
        },
        numberofemployees: {
          type: "string",
          description: "Number of employees in the company.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create company.",
    ],
  }),
  composioTool({
    name: "hubspot_create_contact",
    description: "Creates a new HubSpot contact.",
    toolSlug: "HUBSPOT_CREATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fax: {
          type: "string",
          description: "The contact's fax number.",
        },
        zip: {
          type: "string",
          description: "The contact's postal code or ZIP code.",
        },
        city: {
          type: "string",
          description: "The city where the contact resides.",
        },
        email: {
          type: "string",
          description: "The primary email address of the contact. This is a unique identifier for contacts in HubSpot.",
        },
        phone: {
          type: "string",
          description: "The contact's primary phone number (often a business phone).",
        },
        photo: {
          type: "string",
          description: "URL of the contact's photo or avatar.",
        },
        state: {
          type: "string",
          description: "The state or region where the contact resides.",
        },
        degree: {
          type: "string",
          description: "The contact's highest completed educational degree.",
        },
        gender: {
          type: "string",
          description: "The contact's gender.",
        },
        school: {
          type: "string",
          description: "The name of the school, college, or university the contact attended.",
        },
        address: {
          type: "string",
          description: "The contact's street address, including apartment or unit number.",
        },
        company: {
          type: "string",
          description: "The name of the company the contact works for. If `associatedcompanyid` is set, this field might be auto-populated.",
        },
        country: {
          type: "string",
          description: "The country where the contact resides.",
        },
        ip_city: {
          type: "string",
          description: "The city associated with the contact's IP address, often captured during their first website visit or form submission.",
        },
        message: {
          type: "string",
          description: "A free-text message or note often captured from a form submission's message field.",
        },
        website: {
          type: "string",
          description: "The URL of the contact's personal or company website.",
        },
        industry: {
          type: "string",
          description: "The primary industry of the company the contact works for.",
        },
        ip_state: {
          type: "string",
          description: "The state or region associated with the contact's IP address.",
        },
        jobtitle: {
          type: "string",
          description: "The contact's job title.",
        },
        lastname: {
          type: "string",
          description: "The contact's last name.",
        },
        closedate: {
          type: "string",
          description: "The date when the deal associated with this contact was closed. Expected format is a UTC timestamp in milliseconds.",
        },
        firstname: {
          type: "string",
          description: "The contact's first name.",
        },
        ip_latlon: {
          type: "string",
          description: "The approximate latitude and longitude associated with the contact's IP address, typically in 'latitude,longitude' format.",
        },
        num_notes: {
          type: "string",
          description: "The total number of notes logged on the contact's record.",
        },
        ownername: {
          type: "string",
          description: "The full name of the HubSpot user who owns this contact. Read-only.",
        },
        seniority: {
          type: "string",
          description: "The contact's seniority level within their organization.",
        },
        createdate: {
          type: "string",
          description: "The date and time when the contact record was created in HubSpot. This is a read-only property, typically a UTC timestamp.",
        },
        ip_country: {
          type: "string",
          description: "The country associated with the contact's IP address.",
        },
        ip_zipcode: {
          type: "string",
          description: "The postal code or ZIP code associated with the contact's IP address.",
        },
        owneremail: {
          type: "string",
          description: "The email address of the HubSpot user who owns this contact. Read-only, reflects the owner's primary email.",
        },
        salutation: {
          type: "string",
          description: "The salutation for the contact (e.g., 'Mr.', 'Ms.', 'Dr.').",
        },
        start_date: {
          type: "string",
          description: "The contact's start date, typically referring to their employment start date at their current company. Format can vary.",
        },
        twitterbio: {
          type: "string",
          description: "The contact's biography from their Twitter profile.",
        },
        work_email: {
          type: "string",
          description: "The contact's work email address. This might be different from the primary `email` if that's a personal address.",
        },
        linkedinbio: {
          type: "string",
          description: "The contact's biography from their LinkedIn profile.",
        },
        mobilephone: {
          type: "string",
          description: "The contact's mobile phone number.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              to: {
                type: "object",
                additionalProperties: true,
                description: "The object to associate with. Must be a dictionary with an 'id' key containing the target object's ID (e.g., {'id': '1234567890'}).",
              },
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "The ID of the association type. This is a unique identifier for the type of relationship (e.g., Contact to Company).",
                    },
                    associationCategory: {
                      type: "string",
                      description: "A category of the association. Possible values: `HUBSPOT_DEFINED` - an association type created by HubSpot, `USER_DEFINED` - an association type created by the user, `INTEGRATOR_DEFINED` - an association type created by an integration.",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Request schema for `Types`",
                },
                description: "A list of association types and their categories to be created between the new contact and another object. Each item in the list defines one association.",
              },
            },
            description: "Request schema for `Associations`",
          },
          description: "List of associations to create with other existing HubSpot objects (e.g., companies, deals).",
        },
        company_size: {
          type: "string",
          description: "The size of the company the contact works for, often categorized (e.g., '1-10 employees', '501-1000 employees').",
        },
        hubspotscore: {
          type: "string",
          description: "The contact's HubSpot lead score, calculated based on criteria defined in your HubSpot portal's scoring settings.",
        },
        job_function: {
          type: "string",
          description: "The contact's job function or department.",
        },
        numemployees: {
          type: "string",
          description: "The number of employees at the company the contact works for. This may differ from 'company_size' if manually entered or from a different source.",
        },
        annualrevenue: {
          type: "string",
          description: "The annual revenue of the company the contact works for.",
        },
        date_of_birth: {
          type: "string",
          description: "The contact's date of birth. Format can vary, but YYYY-MM-DD is common.",
        },
        days_to_close: {
          type: "string",
          description: "The number of days it took to close the deal associated with this contact. This is usually calculated automatically.",
        },
        followercount: {
          type: "string",
          description: "The number of followers the contact has on a specified social media platform (e.g., Twitter).",
        },
        ip_state_code: {
          type: "string",
          description: "The state or region code associated with the contact's IP address (e.g., US state code).",
        },
        total_revenue: {
          type: "string",
          description: "The total revenue generated from all closed-won deals associated with this contact.",
        },
        twitterhandle: {
          type: "string",
          description: "The contact's Twitter username (handle), without the '@' symbol.",
        },
        field_of_study: {
          type: "string",
          description: "The contact's primary field of study during their education.",
        },
        hs_legal_basis: {
          type: "string",
          description: "Legal basis for processing contact data under GDPR and privacy regulations.",
          enum: [
            "Legitimate interest – prospect/lead",
            "Legitimate interest – existing customer",
            "Legitimate interest - other",
            "Performance of a contract",
            "Freely given consent from contact",
            "Not applicable",
          ],
        },
        lifecyclestage: {
          type: "string",
          description: "The contact's current stage in your sales and marketing funnel (e.g., 'Lead', 'Marketing Qualified Lead', 'Customer'). These stages are customizable in HubSpot.",
        },
        marital_status: {
          type: "string",
          description: "The contact's marital status.",
        },
        graduation_date: {
          type: "string",
          description: "The contact's graduation date from their educational institution. Format can vary.",
        },
        hs_all_team_ids: {
          type: "string",
          description: "A semicolon-separated list of all HubSpot Team IDs this contact is or has been associated with.",
        },
        hubspot_team_id: {
          type: "string",
          description: "The ID of the HubSpot team that owns this contact.",
        },
        ip_country_code: {
          type: "string",
          description: "The two-letter country code (ISO 3166-1 alpha-2) associated with the contact's IP address.",
        },
        military_status: {
          type: "string",
          description: "The contact's military status.",
        },
        hs_all_owner_ids: {
          type: "string",
          description: "A semicolon-separated list of all HubSpot Owner IDs who have been assigned to this contact at some point.",
        },
        hubspot_owner_id: {
          type: "string",
          description: "The ID of the HubSpot user who is the current owner of this contact.",
        },
        lastmodifieddate: {
          type: "string",
          description: "The date and time when the contact record was last modified. This is a read-only property, UTC timestamp.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of custom properties to set for the contact. Keys are the internal names of your custom contact properties, and values are the data to set. Example: `{'custom_property_internal_name': 'value_for_custom_property'}`. Note: For common properties with enum values like hs_legal_basis, use the dedicated field instead of custom_properties to ensure proper validation.",
        },
        kloutscoregeneral: {
          type: "string",
          description: "The contact's general Klout score, if available and integrated. Klout was a service that rated social media influence.",
        },
        notes_last_updated: {
          type: "string",
          description: "The date and time when the notes on the contact record were last updated. UTC timestamp in milliseconds.",
        },
        recent_deal_amount: {
          type: "string",
          description: "The amount of the most recent closed-won deal associated with this contact.",
        },
        associatedcompanyid: {
          type: "string",
          description: "The ID of the primary company associated with this contact. This is a read-only property automatically updated when an association is made.",
        },
        currentlyinworkflow: {
          type: "string",
          description: "Indicates whether the contact is currently active in any HubSpot workflow. Boolean value, 'true' or 'false'.",
        },
        hs_all_contact_vids: {
          type: "string",
          description: "A semicolon-separated list of all HubSpot Contact VID (Visitor ID) values associated with this contact, typically used for merging contacts.",
        },
        hs_analytics_source: {
          type: "string",
          description: "The original source that generated the contact (e.g., 'Organic Search', 'Paid Social', 'Referrals').",
        },
        linkedinconnections: {
          type: "string",
          description: "The number of LinkedIn connections the contact has.",
        },
        num_contacted_notes: {
          type: "string",
          description: "The number of notes on the contact record that relate to being contacted (e.g., call logs, meeting notes).",
        },
        relationship_status: {
          type: "string",
          description: "The contact's self-reported relationship status.",
        },
        twitterprofilephoto: {
          type: "string",
          description: "URL of the contact's Twitter profile photo.",
        },
        hs_additional_emails: {
          type: "string",
          description: "A semicolon-separated list of additional email addresses for the contact.",
        },
        hs_analytics_revenue: {
          type: "string",
          description: "Revenue attributed to this contact through HubSpot's analytics or e-commerce integrations. This is often a sum of closed-won deal amounts associated with the contact.",
        },
        notes_last_contacted: {
          type: "string",
          description: "The date and time the contact was last contacted, based on logged activities like calls, emails, or meetings. UTC timestamp in milliseconds.",
        },
        num_associated_deals: {
          type: "string",
          description: "The total number of deals currently associated with this contact.",
        },
        first_conversion_date: {
          type: "string",
          description: "The date and time of the contact's first conversion (e.g., form submission). UTC timestamp.",
        },
        hs_analytics_last_url: {
          type: "string",
          description: "The last URL on your website that the contact visited.",
        },
        num_conversion_events: {
          type: "string",
          description: "The total number of conversion events (e.g., form submissions, CTA clicks) attributed to this contact.",
        },
        hs_analytics_first_url: {
          type: "string",
          description: "The first URL on your website that the contact visited.",
        },
        recent_conversion_date: {
          type: "string",
          description: "The date and time of the contact's most recent conversion event. UTC timestamp.",
        },
        recent_deal_close_date: {
          type: "string",
          description: "The close date of the most recent closed-won deal associated with this contact. UTC timestamp in milliseconds.",
        },
        first_deal_created_date: {
          type: "string",
          description: "The date and time when the first deal was created for this contact. UTC timestamp.",
        },
        hs_analytics_num_visits: {
          type: "string",
          description: "The total number of sessions (visits) the contact has had on your website.",
        },
        webinareventlastupdated: {
          type: "string",
          description: "Timestamp of the last update related to a webinar event (e.g., GoToWebinar) for this contact, if integrated. UTC timestamp.",
        },
        notes_next_activity_date: {
          type: "string",
          description: "The date and time of the next scheduled activity (e.g., task, meeting) with the contact. UTC timestamp in milliseconds.",
        },
        hs_all_accessible_team_ids: {
          type: "string",
          description: "A semicolon-separated list of HubSpot Team IDs that have access to this contact record.",
        },
        hs_analytics_last_referrer: {
          type: "string",
          description: "The last referring URL that brought the contact to your website before their most recent session.",
        },
        hs_analytics_source_data_1: {
          type: "string",
          description: "Additional detail for the source. For 'Organic search', this might be the search engine. For 'Paid social', this could be the social media platform.",
        },
        hs_analytics_source_data_2: {
          type: "string",
          description: "Further detail for the source. For 'Organic search', this might be the keyword. For 'Paid social', this could be the campaign name.",
        },
        hubspot_owner_assigneddate: {
          type: "string",
          description: "The date and time when a HubSpot owner was most recently assigned to this contact. UTC timestamp in milliseconds.",
        },
        first_conversion_event_name: {
          type: "string",
          description: "The name or identifier of the event that marked the contact's first conversion.",
        },
        hs_analytics_first_referrer: {
          type: "string",
          description: "The first referring URL that brought the contact to your website.",
        },
        hs_analytics_last_timestamp: {
          type: "string",
          description: "Timestamp of the contact's last recorded interaction (e.g., last website visit, form submission). UTC timestamp.",
        },
        hs_analytics_num_page_views: {
          type: "string",
          description: "The total number of pages viewed by the contact on your website.",
        },
        associatedcompanylastupdated: {
          type: "string",
          description: "The timestamp of the last update to the primary associated company. This is a read-only property.",
        },
        hs_analytics_first_timestamp: {
          type: "string",
          description: "Timestamp of the contact's first recorded interaction (e.g., first website visit). UTC timestamp.",
        },
        num_unique_conversion_events: {
          type: "string",
          description: "The number of unique types of conversion events completed by the contact.",
        },
        recent_conversion_event_name: {
          type: "string",
          description: "The name or identifier of the contact's most recent conversion event.",
        },
        surveymonkeyeventlastupdated: {
          type: "string",
          description: "Timestamp of the last update related to a SurveyMonkey event for this contact, if integrated. UTC timestamp.",
        },
        engagements_last_meeting_booked: {
          type: "string",
          description: "Timestamp of the last meeting booked with the contact through HubSpot's meetings tool.",
        },
        hs_analytics_average_page_views: {
          type: "string",
          description: "The average number of pages viewed by the contact per session on your website, tracked by HubSpot analytics.",
        },
        hs_all_assigned_business_unit_ids: {
          type: "string",
          description: "A semicolon-separated list of Business Unit IDs assigned to this contact, if using HubSpot's Business Units feature.",
        },
        hs_analytics_last_visit_timestamp: {
          type: "string",
          description: "Timestamp of the contact's most recent visit to your website. UTC timestamp.",
        },
        hs_analytics_first_visit_timestamp: {
          type: "string",
          description: "Timestamp of the contact's first visit to your website. UTC timestamp.",
        },
        hs_analytics_num_event_completions: {
          type: "string",
          description: "The total number of HubSpot custom events completed by the contact.",
        },
        engagements_last_meeting_booked_medium: {
          type: "string",
          description: "The medium (e.g., 'Meetings Tool', 'Email') through which the last meeting was booked.",
        },
        engagements_last_meeting_booked_source: {
          type: "string",
          description: "The source (e.g., 'SALES', 'MARKETING') of the last meeting booked.",
        },
        engagements_last_meeting_booked_campaign: {
          type: "string",
          description: "The HubSpot campaign ID (GUID) associated with the last meeting booked.",
        },
        hs_analytics_last_touch_converting_campaign: {
          type: "string",
          description: "The HubSpot campaign ID (GUID) of the campaign that led to the contact's most recent conversion.",
        },
        hs_analytics_first_touch_converting_campaign: {
          type: "string",
          description: "The HubSpot campaign ID (GUID) of the campaign that led to the contact's first conversion.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create contact.",
    ],
  }),
  composioTool({
    name: "hubspot_create_contact_from_nl",
    description: "Creates a new contact in HubSpot from a natural language description. Fetches the contact property schema at runtime, uses an LLM to generate the correct property payload, and creates the contact.",
    toolSlug: "HUBSPOT_CREATE_CONTACT_FROM_NL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        nl_query: {
          type: "string",
          description: "Natural language description of the contact to create. Example: 'Add Jane Smith, email jane@test.com, phone +1-555-0100, company Acme Corp'.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional associations to create between the new contact and other CRM objects (e.g., companies, deals). Pass-through field, not LLM-generated.",
        },
      },
      required: [
        "nl_query",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Contact From Natural Language.",
    ],
  }),
  composioTool({
    name: "hubspot_create_contacts",
    description: "Creates multiple new HubSpot contacts in a single batch operation.",
    toolSlug: "HUBSPOT_CREATE_CONTACTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              zip: {
                type: "string",
                description: "The contact's postal code or ZIP code.",
              },
              city: {
                type: "string",
                description: "The city where the contact resides.",
              },
              email: {
                type: "string",
                description: "The primary email address of the contact. This is a unique identifier for contacts in HubSpot.",
              },
              phone: {
                type: "string",
                description: "The contact's primary phone number.",
              },
              state: {
                type: "string",
                description: "The state or region where the contact resides.",
              },
              address: {
                type: "string",
                description: "The contact's street address, including apartment or unit number.",
              },
              company: {
                type: "string",
                description: "The name of the company the contact works for.",
              },
              country: {
                type: "string",
                description: "The country where the contact resides.",
              },
              website: {
                type: "string",
                description: "The URL of the contact's personal or company website.",
              },
              jobtitle: {
                type: "string",
                description: "The contact's job title.",
              },
              lastname: {
                type: "string",
                description: "The contact's last name.",
              },
              firstname: {
                type: "string",
                description: "The contact's first name.",
              },
              associations: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    to: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        id: {
                          type: "string",
                          description: "The unique identifier of the CRM object (e.g., company ID, deal ID) to which the new contact will be associated.",
                        },
                      },
                      description: "The target CRM object to associate with the new contact.",
                    },
                    types: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          associationTypeId: {
                            type: "integer",
                            description: "The unique ID of the association type, defining the nature of the link (e.g., contact to company).",
                          },
                          associationCategory: {
                            type: "string",
                            description: "The category of the association. HubSpot-defined associations are default and cannot be deleted. User-defined associations are custom associations created by users. Integrator-defined associations are created by HubSpot integrations.",
                            enum: [
                              "HUBSPOT_DEFINED",
                              "USER_DEFINED",
                              "INTEGRATOR_DEFINED",
                            ],
                          },
                        },
                        description: "Request schema for defining association types between CRM objects.",
                      },
                      description: "A list of association type definitions, specifying the category and type ID for each association.",
                    },
                  },
                  description: "Request schema for defining associations between the new contact and existing CRM objects.",
                },
                description: "List of associations to create with other existing HubSpot objects (e.g., companies, deals).",
              },
              annualrevenue: {
                type: "string",
                description: "The annual revenue of the company the contact works for.",
              },
              lifecyclestage: {
                type: "string",
                description: "The contact's current stage in your sales and marketing funnel.",
              },
              custom_properties: {
                type: "object",
                additionalProperties: true,
                description: "A dictionary of custom properties to set for the contact. Keys must be the internal names of existing custom contact properties in your HubSpot portal (not display names). The properties must be created in HubSpot BEFORE using them via this API - passing non-existent property names will cause the request to fail with a PROPERTY_DOESNT_EXIST error. To find internal property names, go to HubSpot Settings > Properties > Contacts and check the 'Internal name' field.",
              },
            },
            description: "Request schema for creating individual contacts within a batch operation.",
          },
          description: "A list of contact objects to create. Each object represents one new contact with its properties and optional associations.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create contacts.",
    ],
  }),
  composioTool({
    name: "hubspot_create_crm_object_from_nl",
    description: "Creates a new CRM object (contact, deal, company, ticket, or custom object) in HubSpot from a natural language description. Fetches the object's property schema at runtime, uses an LLM to generate the correct property payload, and creates the object.",
    toolSlug: "HUBSPOT_CREATE_CRM_OBJECT_FROM_NL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        nl_query: {
          type: "string",
          description: "Natural language description of the record to create. Example: 'Create a contact named John Doe with email john@example.com and phone +1-555-0100'.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object to create. Standard types: 'contacts', 'deals', 'companies', 'tickets'. Can also be a custom object type ID.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional associations to create between the new object and other CRM objects. Pass-through field, not LLM-generated. Each association should include 'to' and 'types'.",
        },
      },
      required: [
        "objectType",
        "nl_query",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create CRM Object From Natural Language.",
    ],
  }),
  composioTool({
    name: "hubspot_create_crm_object_with_properties",
    description: "Creates a new HubSpot CRM object (e.g., contact, company, custom object) with specified `properties` (using valid internal names) and `associations` (to existing objects via valid type IDs).",
    toolSlug: "HUBSPOT_CREATE_CRM_OBJECT_WITH_PROPERTIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "Type of CRM object to create (e.g., 'contacts', 'companies', 'deals', or custom object schema ID like 'p12345678').",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Key-value pairs for the object's properties. Keys must be internal HubSpot property names valid for the `objectType`. IMPORTANT: Some properties are enumeration types that only accept specific values. For CONTACTS: 'email' (string), 'firstname' (string), 'lastname' (string), 'phone' (string), 'lifecyclestage' (enum: subscriber, lead, marketingqualifiedlead, salesqualifiedlead, opportunity, customer, evangelist, other). For COMPANIES: 'name' (string, required), 'domain' (string), 'phone' (string), 'city' (string), 'state' (string), 'country' (string), 'industry' (enum - must use UPPERCASE values like: ACCOUNTING, AIRLINES_AVIATION, BANKING, BIOTECHNOLOGY, COMPUTER_SOFTWARE, CONSTRUCTION, CONSUMER_GOODS, EDUCATION_MANAGEMENT, ENTERTAINMENT, FINANCIAL_SERVICES, FOOD_BEVERAGES, GOVERNMENT_ADMINISTRATION, HEALTH_WELLNESS_AND_FITNESS, HOSPITAL_HEALTH_CARE, HOSPITALITY, INFORMATION_TECHNOLOGY_AND_SERVICES, INSURANCE, INTERNET, LEGAL_SERVICES, MANAGEMENT_CONSULTING, MANUFACTURING, MARKETING_AND_ADVERTISING, MEDIA_PRODUCTION, NON_PROFIT_ORGANIZATION_MANAGEMENT, OIL_ENERGY, PHARMACEUTICALS, REAL_ESTATE, RETAIL, TELECOMMUNICATIONS, TRANSPORTATION_TRUCKING_RAILROAD, VENTURE_CAPITAL_PRIVATE_EQUITY, WHOLESALE, and ~115 more). For DEALS: 'dealname' (string, required), 'amount' (string/number), 'dealstage' (enum: pipeline-specific stage IDs), 'closedate' (ISO 8601 date), 'pipeline' (pipeline ID). For TICKETS: 'subject' (string), 'content' (string), 'hs_pipeline' (pipeline ID), 'hs_pipeline_stage' (stage ID), 'hs_ticket_priority' (enum: LOW, MEDIUM, HIGH). Use GET /crm/v3/properties/{objectType} to retrieve all valid properties and their enum options for any object type.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              to: {
                type: "string",
                description: "Unique ID of the existing CRM object to associate with the new object. Can be a string ID or dict with 'id' key.",
              },
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "Unique ID for the association type. CRITICAL: Must be valid for the SOURCE objectType being created. Association type IDs are DIRECTIONAL - when creating objectType='deals', use Deal-to-X type IDs. IDs BY SOURCE OBJECT TYPE: When creating 'contacts': Contact-to-Company=279 (or 1 for Primary), Contact-to-Deal=4, Contact-to-Ticket=15. When creating 'companies': Company-to-Contact=280 (or 2 for Primary), Company-to-Deal=342 (or 6 for Primary), Company-to-Ticket=340, Parent to child company=13, Child to parent company=14, Company to company=450 (unlabeled). When creating 'deals': Deal-to-Contact=3, Deal-to-Company=341 (or 5 for Primary), Deal-to-Ticket=27. When creating 'tickets': Ticket-to-Contact=16, Ticket-to-Company=339 (or 26 for Primary), Ticket-to-Deal=28. Use GET /crm/v4/associations/{fromObjectType}/{toObjectType}/labels to find all valid type IDs.",
                    },
                    associationCategory: {
                      type: "string",
                      description: "Category of the association type (HubSpot-defined, user-defined, or integrator-defined).",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Defines the type of association, including its category and type ID.",
                },
                description: "List defining association types, each specifying `associationCategory` and `associationTypeId`.",
              },
            },
            description: "An association for the new CRM object, detailing the target object's ID and the type of association.",
          },
          description: "List of associations to create between the new object and existing CRM objects, using `to_id` and `types`.",
        },
      },
      required: [
        "objectType",
        "associations",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create CRM object with properties.",
    ],
  }),
  composioTool({
    name: "hubspot_create_deal",
    description: "Creates a new HubSpot deal.",
    toolSlug: "HUBSPOT_CREATE_DEAL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        amount: {
          type: "string",
          description: "Total monetary value of the deal.",
        },
        hs_acv: {
          type: "string",
          description: "Annual Contract Value (ACV) (HubSpot-calculated).",
        },
        hs_arr: {
          type: "string",
          description: "Annual Recurring Revenue (ARR) (HubSpot-calculated).",
        },
        hs_mrr: {
          type: "string",
          description: "Monthly Recurring Revenue (MRR) (HubSpot-calculated).",
        },
        hs_tcv: {
          type: "string",
          description: "Total Contract Value (TCV) (HubSpot-calculated).",
        },
        dealname: {
          type: "string",
          description: "Descriptive name or title of the deal.",
        },
        dealtype: {
          type: "string",
          description: "Type of deal (e.g., 'newbusiness', 'existingbusiness').",
        },
        pipeline: {
          type: "string",
          description: "ID of the sales pipeline for this deal (required).",
        },
        closedate: {
          type: "string",
          description: "Date (YYYY-MM-DD) or datetime (ISO 8601) when the deal closed or is expected to close.",
        },
        dealstage: {
          type: "string",
          description: "Valid pipeline stage ID for the deal. IMPORTANT: Stage IDs must be actual values from your HubSpot pipeline configuration - random values, phone numbers, or placeholder text will be rejected by the API with INVALID_OPTION errors. Stage IDs can be either string-based (e.g., 'closedwon', 'closedlost') or numeric strings (e.g., '2317386479') depending on your pipeline setup. You MUST retrieve valid stage IDs using the Pipelines API (GET /crm/v3/pipelines/deals) or from HubSpot Settings > Objects > Deals > Pipelines before setting this field.",
        },
        createdate: {
          type: "string",
          description: "Date/time deal was created (read-only, HubSpot-set).",
        },
        description: {
          type: "string",
          description: "Detailed text description of the deal.",
        },
        hs_campaign: {
          type: "string",
          description: "GUID of the HubSpot campaign that generated this deal.",
        },
        hs_priority: {
          type: "string",
          description: "Priority level (e.g., 'high', 'medium', 'low').",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              to: {
                type: "object",
                additionalProperties: true,
                properties: {
                  id: {
                    type: "string",
                    description: "Numeric ID of the CRM object to associate with (e.g., '12345').",
                  },
                },
                description: "Represents the target object ID for an association.",
              },
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "Unique ID of the association type, specifying the relationship nature (e.g., deal-contact).",
                    },
                    associationCategory: {
                      type: "string",
                      description: "A categorization of the association type. The available categories are `HUBSPOT_DEFINED`, `USER_DEFINED`, and `INTEGRATOR_DEFINED`.",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Defines the type of association between CRM objects.",
                },
                description: "List of association types to be created, each defining category and type ID.",
              },
              to__id: {
                type: "string",
                description: "Numeric ID of the CRM object (e.g., contact, company) to associate with. Must be a numeric string (e.g., '12345'). Alternative to 'to' field - use either 'to_id' OR 'to', not both.",
              },
            },
            description: "Specifies associations with other CRM objects.",
          },
          description: "Associations to create between the new deal and other CRM objects (e.g., contact, company).",
        },
        hs_is_closed: {
          type: "string",
          description: "Indicates if deal is closed ('true'/'false'; read-only, from deal stage properties).",
        },
        hs_next_step: {
          type: "string",
          description: "Next planned step for this deal.",
        },
        hs_object_id: {
          type: "string",
          description: "Unique ID of the deal object (read-only, HubSpot-assigned).",
        },
        days_to_close: {
          type: "string",
          description: "Days between creation and close (read-only, HubSpot-calculated).",
        },
        hs_createdate: {
          type: "string",
          description: "Specific date/time deal record created (ISO 8601, read-only, HubSpot-set).",
        },
        hs_all_team_ids: {
          type: "string",
          description: "Semicolon-separated list of all associated team IDs (owner's primary, additional teams; typically read-only).",
        },
        hs_all_owner_ids: {
          type: "string",
          description: "Semicolon-separated list of all owner IDs (primary, co-owners).",
        },
        hs_closed_amount: {
          type: "string",
          description: "Actual amount when deal closed (HubSpot-calculated).",
        },
        hubspot_owner_id: {
          type: "string",
          description: "ID of the HubSpot user owning the deal; may be auto-assigned if unspecified.",
        },
        closed_won_reason: {
          type: "string",
          description: "Reason why the deal was won.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties for the deal. Keys are internal property names (as defined in your HubSpot account), values are the property values to set. CRITICAL: Enum/dropdown properties have STRICT validation - you MUST use exact values from your HubSpot configuration or the API will reject with INVALID_OPTION error. To find valid values: go to HubSpot Settings > Properties > Deals > [Property Name] > Edit > Field Type Options. Requirements by type: (1) Enum/dropdown: case-sensitive exact match required (check your HubSpot property settings for valid options); (2) Number: numeric strings only, no units (e.g., '12' not '12 months'); (3) Date: ISO 8601 format (e.g., '2024-01-15'); (4) Checkbox: 'true' or 'false'. Properties are account-specific and may not exist in all HubSpot portals. Example: `{'project_type': 'migration', 'priority_level': 'high'}`.",
        },
        closed_lost_reason: {
          type: "string",
          description: "Reason why the deal was lost.",
        },
        deal_currency_code: {
          type: "string",
          description: "Currency code for deal amount. IMPORTANT: Only currency codes enabled in your HubSpot portal settings are valid. If omitted, defaults to your portal's home currency. To find valid currency codes: go to Settings > Account defaults > Currencies to see your enabled currencies. Common codes include 'USD' and 'EUR', but availability depends on your portal configuration.",
        },
        hs_forecast_amount: {
          type: "string",
          description: "Forecasted amount ('Amount' * 'hs_deal_stage_probability'; HubSpot-calculated).",
        },
        hs_analytics_source: {
          type: "string",
          description: "Original deal source per HubSpot analytics (e.g., 'Organic Search'; typically read-only).",
        },
        hs_lastmodifieddate: {
          type: "string",
          description: "Date/time deal last modified (ISO 8601, read-only, HubSpot-updated).",
        },
        hs_projected_amount: {
          type: "string",
          description: "Projected deal amount (manually set or calculated).",
        },
        amount_in_home_currency: {
          type: "string",
          description: "Deal's value in company's home currency (read-only, HubSpot-calculated).",
        },
        hs_forecast_probability: {
          type: "string",
          description: "Sales forecasting probability; may differ from 'hs_deal_stage_probability'.",
        },
        hs_deal_stage_probability: {
          type: "string",
          description: "Win probability (decimal, e.g., 0.5) based on current stage; typically stage-defined.",
        },
        hs_all_accessible_team_ids: {
          type: "string",
          description: "Semicolon-separated list of team IDs with access (typically read-only).",
        },
        engagements_last_meeting_booked: {
          type: "string",
          description: "Date/time of last booked meeting for this deal (typically read-only).",
        },
        hs_all_assigned_business_unit_ids: {
          type: "string",
          description: "Semicolon-separated list of assigned business unit IDs (for Business Units add-on).",
        },
        hs_closed_amount_in_home_currency: {
          type: "string",
          description: "Closed amount in home currency (HubSpot-calculated).",
        },
        hs_projected_amount_in_home_currency: {
          type: "string",
          description: "Projected amount in home currency (HubSpot-calculated).",
        },
        engagements_last_meeting_booked_medium: {
          type: "string",
          description: "Medium (e.g., 'Meetings') of last booked meeting (typically read-only).",
        },
        engagements_last_meeting_booked_source: {
          type: "string",
          description: "Source (e.g., 'Calendar') of last booked meeting (typically read-only).",
        },
        engagements_last_meeting_booked_campaign: {
          type: "string",
          description: "Campaign ID for the last booked meeting (typically read-only).",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create deal.",
    ],
  }),
  composioTool({
    name: "hubspot_create_deal_from_nl",
    description: "Creates a new deal in HubSpot from a natural language description. Fetches the deal property schema and pipeline stages at runtime, uses an LLM to generate the correct property payload, and creates the deal.",
    toolSlug: "HUBSPOT_CREATE_DEAL_FROM_NL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        nl_query: {
          type: "string",
          description: "Natural language description of the deal to create. Example: 'New deal: Enterprise License for Acme Corp, amount $50,000, closing next month'.",
        },
        pipeline: {
          type: "string",
          description: "Optional pipeline ID override. If not specified, the LLM will infer from the NL query or default to 'default'.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Optional associations to create between the new deal and other CRM objects (e.g., contacts, companies). Pass-through field, not LLM-generated.",
        },
      },
      required: [
        "nl_query",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Deal From Natural Language.",
    ],
  }),
  composioTool({
    name: "hubspot_create_deals",
    description: "Creates multiple deals in HubSpot CRM; ensure any associated object IDs, deal stages, and pipeline IDs specified are valid and exist within the HubSpot account.",
    toolSlug: "HUBSPOT_CREATE_DEALS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                properties: {
                  amount: {
                    type: "string",
                    description: "Total monetary value of the deal.",
                  },
                  hs_acv: {
                    type: "string",
                    description: "Annual Contract Value (ACV) of the deal.",
                  },
                  hs_arr: {
                    type: "string",
                    description: "Annual Recurring Revenue (ARR) of the deal.",
                  },
                  hs_mrr: {
                    type: "string",
                    description: "Monthly Recurring Revenue (MRR) of the deal.",
                  },
                  hs_tcv: {
                    type: "string",
                    description: "Total Contract Value (TCV), including one-time and recurring charges.",
                  },
                  dealname: {
                    type: "string",
                    description: "Name or title of the deal. Typically required for creating a new deal.",
                  },
                  dealtype: {
                    type: "string",
                    description: "Type of deal (e.g., 'newbusiness', 'existingbusiness'), typically custom-defined.",
                  },
                  pipeline: {
                    type: "string",
                    description: "ID or internal name of the sales pipeline this deal belongs to.",
                  },
                  closedate: {
                    type: "string",
                    description: "Expected or actual close date (e.g., YYYY-MM-DD or Unix timestamp in milliseconds).",
                  },
                  dealstage: {
                    type: "string",
                    description: "ID or internal name of the current deal stage within a HubSpot pipeline.",
                  },
                  createdate: {
                    type: "string",
                    description: "Read-only: Date and time the deal was created.",
                  },
                  description: {
                    type: "string",
                    description: "Brief summary or notes about the deal.",
                  },
                  hs_campaign: {
                    type: "string",
                    description: "HubSpot campaign ID that led to this deal.",
                  },
                  hs_priority: {
                    type: "string",
                    description: "Priority of the deal (e.g., 'high', 'medium', 'low').",
                  },
                  hs_is_closed: {
                    type: "string",
                    description: "Read-only: Indicates if the deal is closed ('true' or 'false'), derived from `dealstage`.",
                  },
                  hs_next_step: {
                    type: "string",
                    description: "Next actionable step for this deal.",
                  },
                  hs_object_id: {
                    type: "string",
                    description: "Read-only: Unique ID of the deal in HubSpot.",
                  },
                  days_to_close: {
                    type: "string",
                    description: "Read-only: Number of days between creation and close date, calculated by HubSpot.",
                  },
                  hs_createdate: {
                    type: "string",
                    description: "Read-only: Exact date and time the deal was created in HubSpot.",
                  },
                  hs_all_team_ids: {
                    type: "string",
                    description: "Read-only: Semicolon-separated list of all teams assigned as an owner.",
                  },
                  hs_all_owner_ids: {
                    type: "string",
                    description: "Read-only: Semicolon-separated list of all assigned owner IDs.",
                  },
                  hs_closed_amount: {
                    type: "string",
                    description: "Final amount of the deal when closed.",
                  },
                  hubspot_owner_id: {
                    type: "string",
                    description: "ID of the HubSpot user assigned as the deal owner.",
                  },
                  closed_won_reason: {
                    type: "string",
                    description: "Reason why the deal was won.",
                  },
                  custom_properties: {
                    type: "object",
                    additionalProperties: true,
                    description: "Dictionary of custom properties. Keys are internal names, values are the values to set.",
                  },
                  closed_lost_reason: {
                    type: "string",
                    description: "Reason why the deal was lost.",
                  },
                  deal_currency_code: {
                    type: "string",
                    description: "ISO 4217 currency code for the deal's amount.",
                  },
                  hs_forecast_amount: {
                    type: "string",
                    description: "Weighted amount of the deal ('Amount' * 'Deal Stage Probability') for sales forecasting.",
                  },
                  hs_analytics_source: {
                    type: "string",
                    description: "Read-only: Original source of the associated contact (e.g., 'Organic Search').",
                  },
                  hs_lastmodifieddate: {
                    type: "string",
                    description: "Read-only: Date and time the deal was last modified.",
                  },
                  hs_projected_amount: {
                    type: "string",
                    description: "Deprecated. Use `hs_forecast_amount` instead. Projected deal amount.",
                  },
                  amount_in_home_currency: {
                    type: "string",
                    description: "Read-only: Deal amount in the company's home currency, calculated by HubSpot.",
                  },
                  hs_forecast_probability: {
                    type: "string",
                    description: "Probability of closing the deal for forecasting; can be manual or stage-based.",
                  },
                  hs_deal_stage_probability: {
                    type: "string",
                    description: "Read-only: Win probability for the current deal stage, based on pipeline settings.",
                  },
                  hs_all_accessible_team_ids: {
                    type: "string",
                    description: "Read-only: Semicolon-separated list of team IDs with access to this deal.",
                  },
                  engagements_last_meeting_booked: {
                    type: "string",
                    description: "Read-only: Date of the most recent meeting booked associated with this deal.",
                  },
                  hs_all_assigned_business_unit_ids: {
                    type: "string",
                    description: "Read-only: Semicolon-separated list of assigned business unit IDs (requires Business Units add-on).",
                  },
                  hs_closed_amount_in_home_currency: {
                    type: "string",
                    description: "Read-only: Final closed amount in company's home currency, calculated by HubSpot.",
                  },
                  hs_projected_amount_in_home_currency: {
                    type: "string",
                    description: "Deprecated. Projected deal amount in home currency.",
                  },
                  engagements_last_meeting_booked_medium: {
                    type: "string",
                    description: "Read-only: Medium (e.g., 'EMAIL', 'CALL') of the last meeting booked.",
                  },
                  engagements_last_meeting_booked_source: {
                    type: "string",
                    description: "Read-only: Source (e.g., 'CRM_UI', 'SALES_TOOLS') of the last meeting booked.",
                  },
                  engagements_last_meeting_booked_campaign: {
                    type: "string",
                    description: "Read-only: HubSpot campaign ID for the last meeting booked.",
                  },
                },
                description: "Properties for the new deal. `dealname` is typically required.",
              },
              associations: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    to: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        id: {
                          type: "string",
                          description: "Unique ID of the target object for association.",
                        },
                      },
                      description: "Target object (identified by its ID) to associate with the deal. The ID must be a valid HubSpot record ID for the target object type (contact, company, ticket, etc.).",
                    },
                    types: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          associationTypeId: {
                            type: "integer",
                            description: "Numeric ID of the association type for deals. Common deal association types: deal_to_contact=3, deal_to_company_primary=5, deal_to_company=341, deal_to_ticket=27, deal_to_line_item=19, deal_to_quote=63. Note: Use IDs that start with 'deal_to_*' when creating deals (not 'contact_to_*' or 'company_to_*').",
                          },
                          associationCategory: {
                            type: "string",
                            description: "Category of the association (HubSpot-defined, user-defined, or integrator-defined).",
                            enum: [
                              "HUBSPOT_DEFINED",
                              "USER_DEFINED",
                              "INTEGRATOR_DEFINED",
                            ],
                          },
                        },
                        description: "Defines the type and category of an association.",
                      },
                      description: "List of association types defining the relationship from the deal to the target object. Must use deal-to-* association type IDs (e.g., 3 for deal_to_contact, 5 for deal_to_company_primary).",
                    },
                  },
                  description: "Describes an association to be made with a deal. When creating deals, associations point FROM the deal TO other objects (contacts, companies, tickets, etc.).",
                },
                description: "Optional list of associations for this deal (e.g., with contacts or companies). If not provided, the deal will be created without associations.",
              },
            },
            description: "Defines a single deal to be created, including its properties and associations.",
          },
          description: "List of deal objects to create, each defining its properties and associations with other CRM objects.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create deals.",
    ],
  }),
  composioTool({
    name: "hubspot_create_email",
    description: "Creates a new HubSpot email engagement record. REQUIRED FIELDS in properties dict: - hs_email_subject: Subject line - hs_email_html: HTML content - hs_timestamp: Unix timestamp in milliseconds - hs_email_direction: One of 'EMAIL', 'INCOMING_EMAIL', 'FORWARDED_EMAIL', 'DRAFT_EMAIL' This creates an email engagement/activity record in HubSpot CRM, not a marketing email.",
    toolSlug: "HUBSPOT_CREATE_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Email properties to set. Keys are HubSpot internal property names. REQUIRED fields: 'hs_email_subject' (subject line), 'hs_email_html' (HTML content), 'hs_timestamp' (Unix timestamp in milliseconds), 'hs_email_direction' (one of: 'EMAIL', 'INCOMING_EMAIL', 'FORWARDED_EMAIL', 'DRAFT_EMAIL'). This creates an email engagement/activity record in HubSpot CRM.",
        },
      },
      required: [
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create email.",
    ],
  }),
  composioTool({
    name: "hubspot_create_emails",
    description: "Creates multiple HubSpot emails in a single batch operation.",
    toolSlug: "HUBSPOT_CREATE_EMAILS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Email properties to set. Keys are HubSpot internal property names.",
              },
            },
            description: "Request schema for creating individual emails within a batch operation.",
          },
          description: "List of email objects to create.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create emails.",
    ],
  }),
  composioTool({
    name: "hubspot_create_event_template_for_app",
    description: "Creates a new event template for a HubSpot app, defining structure, custom properties (tokens), and appearance (Markdown with Handlebars) of custom timeline events for CRM objects; this template must exist before logging corresponding events.",
    toolSlug: "HUBSPOT_CREATE_EVENT_TEMPLATE_FOR_APP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the event template, unique for the app and object type.",
        },
        appId: {
          type: "integer",
          description: "The unique identifier of the target HubSpot app.",
        },
        tokens: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Internal name of the token, unique for the event template. Allows alphanumeric characters, periods, dashes, or underscores.",
              },
              type: {
                type: "string",
                description: "Data type of the token.",
                enum: [
                  "date",
                  "enumeration",
                  "number",
                  "string",
                ],
              },
              label: {
                type: "string",
                description: "Human-readable label for the token, used for list segmentation and reporting.",
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    label: {
                      type: "string",
                      description: "The human-readable label for the option shown in the UI.",
                    },
                    value: {
                      type: "string",
                      description: "The internal value stored for the option.",
                    },
                  },
                  description: "Defines an option for an enumeration-type token.",
                },
                description: "List of selectable options if token `type` is 'enumeration'.",
              },
              createdAt: {
                type: "string",
                description: "ISO 8601 timestamp of token creation; null if template created before February 18th, 2020.",
              },
              updatedAt: {
                type: "string",
                description: "ISO 8601 timestamp of last token update; null if template created before February 18th, 2020.",
              },
              objectPropertyName: {
                type: "string",
                description: "Name of the corresponding CRM object property. If set, this token populates the CRM property, enabling CRM object creation/updates via Timeline API.",
              },
            },
            description: "Defines a token for custom properties on an event template.",
          },
          description: "Defines custom properties (tokens) for the event, which can populate CRM object properties if a token's `objectPropertyName` is set.",
        },
        objectType: {
          type: "string",
          description: "The CRM object type this event template is associated with (e.g., 'contacts', 'companies').",
        },
        detailTemplate: {
          type: "string",
          description: "Optional Markdown string with Handlebars templating for rendering HTML for expanded event details on the CRM timeline, using tokens for event-specific data.",
        },
        headerTemplate: {
          type: "string",
          description: "Optional Markdown string with Handlebars templating for rendering HTML for the event header on the CRM timeline, using tokens for event-specific data.",
        },
      },
      required: [
        "appId",
        "name",
        "tokens",
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Create event template for app.",
    ],
  }),
  composioTool({
    name: "hubspot_create_feedback_submission",
    description: "Creates a new HubSpot feedback submission to record customer feedback (e.g., survey responses, support interactions), optionally associating it with CRM objects.",
    toolSlug: "HUBSPOT_CREATE_FEEDBACK_SUBMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Properties for the feedback submission. Keys are internal names (e.g., 'hs_feedback_rating'), values must be strings. Property names must be pre-defined in your HubSpot account.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "Unique ID for the association type, defining the link's nature with another CRM object. Obtain from HubSpot documentation/API for specific associations.",
                    },
                    associationCategory: {
                      type: "string",
                      description: "Category of the association: 'HUBSPOT_DEFINED' (standard HubSpot), 'USER_DEFINED' (custom in account), or 'INTEGRATOR_DEFINED' (integration-created).",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Request schema for `Types`",
                },
                description: "Defines association types to create, each with an association category and type ID.",
              },
              to__id: {
                type: "string",
                description: "ID of the target HubSpot CRM object for association (e.g., contact ID, ticket ID).",
              },
            },
            description: "Request schema for `Associations`",
          },
          description: "Associations between this feedback submission and other CRM objects, specifying target object ID and association types.",
        },
      },
      required: [
        "associations",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create feedback submission.",
    ],
  }),
  composioTool({
    name: "hubspot_create_line_item",
    description: "Creates a new HubSpot line item.",
    toolSlug: "HUBSPOT_CREATE_LINE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Line item properties to set. Keys are HubSpot internal property names.",
        },
      },
      required: [
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create line item.",
    ],
  }),
  composioTool({
    name: "hubspot_create_line_items",
    description: "Creates multiple HubSpot line items in a single batch operation.",
    toolSlug: "HUBSPOT_CREATE_LINE_ITEMS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Line item properties to set.",
              },
            },
            description: "Request schema for creating individual line items within a batch operation.",
          },
          description: "List of line item objects to create.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create line items.",
    ],
  }),
  composioTool({
    name: "hubspot_create_note",
    description: "Creates a new HubSpot CRM note. Use when you need to add a timestamped note with optional attachments and associations to contacts, companies, deals, or tickets.",
    toolSlug: "HUBSPOT_CREATE_NOTE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of associations to link with the note (e.g., contacts, deals, companies).",
        },
        hs_note_body: {
          type: "string",
          description: "Text content of the note (up to 65,536 characters).",
        },
        hs_timestamp: {
          type: "string",
          description: "Creation time of the note. Either an ISO-8601 UTC timestamp (e.g., '2021-11-12T15:48:22Z') or Unix milliseconds since epoch.",
        },
        hubspot_owner_id: {
          type: "string",
          description: "HubSpot user ID to assign as the creator/owner of this note.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of custom properties. Boolean-type fields accept 'Yes'/'No', 'true'/'false', 'on'/'off', 'y'/'n' and Python booleans, which are auto-converted to string values ('true'/'false') for HubSpot API compatibility. Numeric strings ('0', '1', '2', etc.) are preserved as-is for number fields.",
        },
        hs_attachment_ids: {
          type: "string",
          description: "Semicolon-separated list of file attachment IDs.",
        },
      },
      required: [
        "hs_timestamp",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create note.",
    ],
  }),
  composioTool({
    name: "hubspot_create_object_association",
    description: "Tool to create or label an association between two CRM records using HubSpot Associations v4 API. Use when you need to link records (e.g., contact to company, deal to contact) with explicit association labels.",
    toolSlug: "HUBSPOT_CREATE_OBJECT_ASSOCIATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        labels: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              associationTypeId: {
                type: "integer",
                description: "The numeric type ID for this association label. IMPORTANT: Association type IDs are specific to each object type combination and direction. Common examples: Contact→Company (1=primary, 279=unlabeled), Company→Contact (2=primary, 280=unlabeled), Company→Company (450=company_to_company, 13=parent_to_child, 14=child_to_parent), Contact→Contact (449), Deal→Contact (3), Deal→Company (5). To find valid IDs for your object types, use the HUBSPOT_LIST_ASSOCIATION_TYPES action. Custom associations use IDs ≥ 100000.",
              },
              associationCategory: {
                type: "string",
                description: "Category of the association: HUBSPOT_DEFINED for standard associations, USER_DEFINED for custom user-created associations, or INTEGRATOR_DEFINED for integration-specific associations.",
                enum: [
                  "HUBSPOT_DEFINED",
                  "USER_DEFINED",
                  "INTEGRATOR_DEFINED",
                ],
              },
            },
            description: "Association label descriptor with category and type ID.",
          },
          description: "Array of association label descriptors defining the type(s) of relationship between the two records. Each label includes an associationCategory and associationTypeId.",
        },
        objectId: {
          type: "string",
          description: "The unique ID of the source CRM record.",
        },
        objectType: {
          type: "string",
          description: "The type of the source object (e.g., 'contacts', 'companies', 'deals', 'tickets', or a custom object type).",
        },
        toObjectId: {
          type: "string",
          description: "The unique ID of the target CRM record to associate with.",
        },
        toObjectType: {
          type: "string",
          description: "The type of the target object to associate with (e.g., 'contacts', 'companies', 'deals', 'tickets', or a custom object type).",
        },
      },
      required: [
        "objectType",
        "objectId",
        "toObjectType",
        "toObjectId",
        "labels",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create object association.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_create_object_schema",
    description: "Creates a new custom object schema in HubSpot CRM with unique naming for schema and properties, defined display/required/searchable properties within the 'properties' list, provided immutable labels, and correctly configured 'enumeration' type properties (options/referencedObjectType).",
    toolSlug: "HUBSPOT_CREATE_OBJECT_SCHEMA",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Unique, immutable programmatic name for the schema (used in API calls); must be unique in the account.",
        },
        properties: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Unique internal programmatic name for API use.",
              },
              type: {
                type: "string",
                description: "Data type of the property.",
                enum: [
                  "string",
                  "number",
                  "date",
                  "datetime",
                  "enumeration",
                  "bool",
                ],
              },
              label: {
                type: "string",
                description: "Human-readable label displayed in HubSpot.",
              },
              hidden: {
                type: "boolean",
                description: "Hides the property in the HubSpot UI if true.",
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    label: {
                      type: "string",
                      description: "Human-readable label displayed in HubSpot.",
                    },
                    value: {
                      type: "string",
                      description: "Internal value used when setting the property via API.",
                    },
                    hidden: {
                      type: "boolean",
                      description: "Hides the option in the HubSpot UI if true.",
                    },
                    description: {
                      type: "string",
                      description: "Optional help text for the option.",
                    },
                    displayOrder: {
                      type: "integer",
                      description: "Sort order for display; -1 places it after positive values.",
                    },
                  },
                  description: "Defines an option for an enumeration property.",
                },
                description: "List of options for 'enumeration' type properties; required for this type.",
              },
              fieldType: {
                type: "string",
                description: "UI field type (e.g., 'text', 'select'); depends on property 'type'.",
              },
              formField: {
                type: "boolean",
                description: "Allows this property to be used in HubSpot forms if true.",
              },
              groupName: {
                type: "string",
                description: "Property group name for UI organization.",
              },
              description: {
                type: "string",
                description: "Optional help text for the property displayed in HubSpot.",
              },
              displayOrder: {
                type: "integer",
                description: "Display order relative to other properties; -1 places it after positive values.",
              },
              hasUniqueValue: {
                type: "boolean",
                description: "Ensures property value is unique across all records; immutable after creation.",
              },
              textDisplayHint: {
                type: "string",
                description: "Display and validation hint for 'string' type properties in UI.",
                enum: [
                  "unformatted_single_line",
                  "multi_line",
                  "email",
                  "phone_number",
                  "domain_name",
                  "ip_address",
                  "physical_address",
                  "postal_code",
                ],
              },
              numberDisplayHint: {
                type: "string",
                description: "Display hint for 'number' type properties in UI.",
                enum: [
                  "unformatted",
                  "formatted",
                  "currency",
                  "percentage",
                  "duration",
                  "probability",
                ],
              },
              optionSortStrategy: {
                type: "string",
                description: "Sort strategy for 'enumeration' property options in UI: 'DISPLAY_ORDER' or 'ALPHABETICAL'.",
                enum: [
                  "DISPLAY_ORDER",
                  "ALPHABETICAL",
                ],
              },
              showCurrencySymbol: {
                type: "boolean",
                description: "Displays currency symbol for 'number' type properties with 'CURRENCY' or 'FORMATTED' hint.",
              },
              referencedObjectType: {
                type: "string",
                description: "For 'enumeration' type, specifies the object type whose records populate options (e.g., 'CONTACT', 'COMPANY', 'OWNER' for users).",
              },
              searchableInGlobalSearch: {
                type: "boolean",
                description: "Makes property values searchable in HubSpot's global search; subject to limits.",
              },
            },
            description: "Defines a property for a custom object schema.",
          },
          description: "List of property definitions for this custom object schema.",
        },
        description: {
          type: "string",
          description: "Optional human-readable description for the custom object schema.",
        },
        labels__plural: {
          type: "string",
          description: "Plural display name used in HubSpot UI; immutable after creation.",
        },
        labels__singular: {
          type: "string",
          description: "Singular display name used in HubSpot UI; immutable after creation.",
        },
        associatedObjects: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object type IDs (e.g., 'CONTACT', 'COMPANY', 'p123456') this schema can be associated with.",
        },
        requiredProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Internal names of properties required for new records; must be defined in 'properties'.",
        },
        searchableProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Internal names of properties indexed for global search; must be defined in 'properties'.",
        },
        primaryDisplayProperty: {
          type: "string",
          description: "Internal name of the primary identifier property; must be defined in 'properties'.",
        },
        secondaryDisplayProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Internal names of properties for secondary display on record pages; must be defined in 'properties'.",
        },
      },
      required: [
        "requiredProperties",
        "name",
        "associatedObjects",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "Confirm the parameters before executing Create new object schema with custom properties.",
    ],
  }),
  composioTool({
    name: "hubspot_create_or_update_draft_version",
    description: "Creates or updates the draft version of a marketing email identified by `emailId`; if no draft exists, a new one is created from the current live version to prepare changes or A/B tests before publishing.",
    toolSlug: "HUBSPOT_CREATE_OR_UPDATE_DRAFT_VERSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Internal name of the email for HubSpot dashboard.",
        },
        state: {
          type: "string",
          description: "Current state of the email (e.g., 'DRAFT'); typically system-managed.",
          enum: [
            "AUTOMATED",
            "AUTOMATED_DRAFT",
            "AUTOMATED_SENDING",
            "AUTOMATED_FOR_FORM",
            "AUTOMATED_FOR_FORM_BUFFER",
            "AUTOMATED_FOR_FORM_DRAFT",
            "AUTOMATED_FOR_FORM_LEGACY",
            "BLOG_EMAIL_DRAFT",
            "BLOG_EMAIL_PUBLISHED",
            "DRAFT",
            "DRAFT_AB",
            "DRAFT_AB_VARIANT",
            "ERROR",
            "LOSER_AB_VARIANT",
            "PAGE_STUB",
            "PRE_PROCESSING",
            "PROCESSING",
            "PUBLISHED",
            "PUBLISHED_AB",
            "PUBLISHED_AB_VARIANT",
            "PUBLISHED_OR_SCHEDULED",
            "RSS_TO_EMAIL_DRAFT",
            "RSS_TO_EMAIL_PUBLISHED",
            "SCHEDULED",
            "SCHEDULED_AB",
            "SCHEDULED_OR_PUBLISHED",
            "AUTOMATED_AB",
            "AUTOMATED_AB_VARIANT",
            "AUTOMATED_DRAFT_AB",
            "AUTOMATED_DRAFT_ABVARIANT",
            "AUTOMATED_LOSER_ABVARIANT",
          ],
        },
        emailId: {
          type: "string",
          description: "The unique identifier of the marketing email.",
        },
        subject: {
          type: "string",
          description: "The subject line of the email.",
        },
        archived: {
          type: "boolean",
          description: "Indicates if the marketing email is archived.",
        },
        campaign: {
          type: "string",
          description: "Associated HubSpot campaign ID for tracking/reporting.",
        },
        language: {
          type: "string",
          description: "Primary language of email content (e.g., 'en', 'en-us').",
          enum: [
            "af",
            "af-na",
            "af-za",
            "agq",
            "agq-cm",
            "ak",
            "ak-gh",
            "am",
            "am-et",
            "ar",
            "ar-001",
            "ar-ae",
            "ar-bh",
            "ar-dj",
            "ar-dz",
            "ar-eg",
            "ar-eh",
            "ar-er",
            "ar-il",
            "ar-iq",
            "ar-jo",
            "ar-km",
            "ar-kw",
            "ar-lb",
            "ar-ly",
            "ar-ma",
            "ar-mr",
            "ar-om",
            "ar-ps",
            "ar-qa",
            "ar-sa",
            "ar-sd",
            "ar-so",
            "ar-ss",
            "ar-sy",
            "ar-td",
            "ar-tn",
            "ar-ye",
            "as",
            "as-in",
            "asa",
            "asa-tz",
            "ast",
            "ast-es",
            "az",
            "az-az",
            "bas",
            "bas-cm",
            "be",
            "be-by",
            "bem",
            "bem-zm",
            "bez",
            "bez-tz",
            "bg",
            "bg-bg",
            "bm",
            "bm-ml",
            "bn",
            "bn-bd",
            "bn-in",
            "bo",
            "bo-cn",
            "bo-in",
            "br",
            "br-fr",
            "brx",
            "brx-in",
            "bs",
            "bs-ba",
            "ca",
            "ca-ad",
            "ca-es",
            "ca-fr",
            "ca-it",
            "ccp",
            "ccp-bd",
            "ccp-in",
            "ce",
            "ce-ru",
            "ceb",
            "ceb-ph",
            "cgg",
            "cgg-ug",
            "chr",
            "chr-us",
            "ckb",
            "ckb-iq",
            "ckb-ir",
            "cs",
            "cs-cz",
            "cu",
            "cu-ru",
            "cy",
            "cy-gb",
            "da",
            "da-dk",
            "da-gl",
            "dav",
            "dav-ke",
            "de",
            "de-at",
            "de-be",
            "de-ch",
            "de-de",
            "de-gr",
            "de-it",
            "de-li",
            "de-lu",
            "dje",
            "dje-ne",
            "doi",
            "doi-in",
            "dsb",
            "dsb-de",
            "dua",
            "dua-cm",
            "dyo",
            "dyo-sn",
            "dz",
            "dz-bt",
            "ebu",
            "ebu-ke",
            "ee",
            "ee-gh",
            "ee-tg",
            "el",
            "el-cy",
            "el-gr",
            "en",
            "en-001",
            "en-150",
            "en-ae",
            "en-ag",
            "en-ai",
            "en-as",
            "en-at",
            "en-au",
            "en-bb",
            "en-be",
            "en-bi",
            "en-bm",
            "en-bs",
            "en-bw",
            "en-bz",
            "en-ca",
            "en-cc",
            "en-ch",
            "en-ck",
            "en-cm",
            "en-cn",
            "en-cx",
            "en-cy",
            "en-de",
            "en-dg",
            "en-dk",
            "en-dm",
            "en-er",
            "en-fi",
            "en-fj",
            "en-fk",
            "en-fm",
            "en-gb",
            "en-gd",
            "en-gg",
            "en-gh",
            "en-gi",
            "en-gm",
            "en-gu",
            "en-gy",
            "en-hk",
            "en-ie",
            "en-il",
            "en-im",
            "en-in",
            "en-io",
            "en-je",
            "en-jm",
            "en-ke",
            "en-ki",
            "en-kn",
            "en-ky",
            "en-lc",
            "en-lr",
            "en-ls",
            "en-lu",
            "en-mg",
            "en-mh",
            "en-mo",
            "en-mp",
            "en-ms",
            "en-mt",
            "en-mu",
            "en-mw",
            "en-mx",
            "en-my",
            "en-na",
            "en-nf",
            "en-ng",
            "en-nl",
            "en-nr",
            "en-nu",
            "en-nz",
            "en-pg",
            "en-ph",
            "en-pk",
            "en-pn",
            "en-pr",
            "en-pw",
            "en-rw",
            "en-sb",
            "en-sc",
            "en-sd",
            "en-se",
            "en-sg",
            "en-sh",
            "en-si",
            "en-sl",
            "en-ss",
            "en-sx",
            "en-sz",
            "en-tc",
            "en-tk",
            "en-to",
            "en-tt",
            "en-tv",
            "en-tz",
            "en-ug",
            "en-um",
            "en-us",
            "en-vc",
            "en-vg",
            "en-vi",
            "en-vu",
            "en-ws",
            "en-za",
            "en-zm",
            "en-zw",
            "eo",
            "eo-001",
            "es",
            "es-419",
            "es-ar",
            "es-bo",
            "es-br",
            "es-bz",
            "es-cl",
            "es-co",
            "es-cr",
            "es-cu",
            "es-do",
            "es-ea",
            "es-ec",
            "es-es",
            "es-gq",
            "es-gt",
            "es-hn",
            "es-ic",
            "es-mx",
            "es-ni",
            "es-pa",
            "es-pe",
            "es-ph",
            "es-pr",
            "es-py",
            "es-sv",
            "es-us",
            "es-uy",
            "es-ve",
            "et",
            "et-ee",
            "eu",
            "eu-es",
            "ewo",
            "ewo-cm",
            "fa",
            "fa-af",
            "fa-ir",
            "ff",
            "ff-bf",
            "ff-cm",
            "ff-gh",
            "ff-gm",
            "ff-gn",
            "ff-gw",
            "ff-lr",
            "ff-mr",
            "ff-ne",
            "ff-ng",
            "ff-sl",
            "ff-sn",
            "fi",
            "fi-fi",
            "fil",
            "fil-ph",
            "fo",
            "fo-dk",
            "fo-fo",
            "fr",
            "fr-be",
            "fr-bf",
            "fr-bi",
            "fr-bj",
            "fr-bl",
            "fr-ca",
            "fr-cd",
            "fr-cf",
            "fr-cg",
            "fr-ch",
            "fr-ci",
            "fr-cm",
            "fr-dj",
            "fr-dz",
            "fr-fr",
            "fr-ga",
            "fr-gf",
            "fr-gn",
            "fr-gp",
            "fr-gq",
            "fr-ht",
            "fr-km",
            "fr-lu",
            "fr-ma",
            "fr-mc",
            "fr-mf",
            "fr-mg",
            "fr-ml",
            "fr-mq",
            "fr-mr",
            "fr-mu",
            "fr-nc",
            "fr-ne",
            "fr-pf",
            "fr-pm",
            "fr-re",
            "fr-rw",
            "fr-sc",
            "fr-sn",
            "fr-sy",
            "fr-td",
            "fr-tg",
            "fr-tn",
            "fr-vu",
            "fr-wf",
            "fr-yt",
            "fur",
            "fur-it",
            "fy",
            "fy-nl",
            "ga",
            "ga-gb",
            "ga-ie",
            "gd",
            "gd-gb",
            "gl",
            "gl-es",
            "gsw",
            "gsw-ch",
            "gsw-fr",
            "gsw-li",
            "gu",
            "gu-in",
            "guz",
            "guz-ke",
            "gv",
            "gv-im",
            "ha",
            "ha-gh",
            "ha-ne",
            "ha-ng",
            "haw",
            "haw-us",
            "he",
            "hi",
            "hi-in",
            "hr",
            "hr-ba",
            "hr-hr",
            "hsb",
            "hsb-de",
            "hu",
            "hu-hu",
            "hy",
            "hy-am",
            "ia",
            "ia-001",
            "id",
            "ig",
            "ig-ng",
            "ii",
            "ii-cn",
            "id-id",
            "is",
            "is-is",
            "it",
            "it-ch",
            "it-it",
            "it-sm",
            "it-va",
            "he-il",
            "ja",
            "ja-jp",
            "jgo",
            "jgo-cm",
            "yi",
            "yi-001",
            "jmc",
            "jmc-tz",
            "jv",
            "jv-id",
            "ka",
            "ka-ge",
            "kab",
            "kab-dz",
            "kam",
            "kam-ke",
            "kde",
            "kde-tz",
            "kea",
            "kea-cv",
            "khq",
            "khq-ml",
            "ki",
            "ki-ke",
            "kk",
            "kk-kz",
            "kkj",
            "kkj-cm",
            "kl",
            "kl-gl",
            "kln",
            "kln-ke",
            "km",
            "km-kh",
            "kn",
            "kn-in",
            "ko",
            "ko-kp",
            "ko-kr",
            "kok",
            "kok-in",
            "ks",
            "ks-in",
            "ksb",
            "ksb-tz",
            "ksf",
            "ksf-cm",
            "ksh",
            "ksh-de",
            "kw",
            "kw-gb",
            "ku",
            "ku-tr",
            "ky",
            "ky-kg",
            "lag",
            "lag-tz",
            "lb",
            "lb-lu",
            "lg",
            "lg-ug",
            "lkt",
            "lkt-us",
            "ln",
            "ln-ao",
            "ln-cd",
            "ln-cf",
            "ln-cg",
            "lo",
            "lo-la",
            "lrc",
            "lrc-iq",
            "lrc-ir",
            "lt",
            "lt-lt",
            "lu",
            "lu-cd",
            "luo",
            "luo-ke",
            "luy",
            "luy-ke",
            "lv",
            "lv-lv",
            "mai",
            "mai-in",
            "mas",
            "mas-ke",
            "mas-tz",
            "mer",
            "mer-ke",
            "mfe",
            "mfe-mu",
            "mg",
            "mg-mg",
            "mgh",
            "mgh-mz",
            "mgo",
            "mgo-cm",
            "mi",
            "mi-nz",
            "mk",
            "mk-mk",
            "ml",
            "ml-in",
            "mn",
            "mn-mn",
            "mni",
            "mni-in",
            "mr",
            "mr-in",
            "ms",
            "ms-bn",
            "ms-id",
            "ms-my",
            "ms-sg",
            "mt",
            "mt-mt",
            "mua",
            "mua-cm",
            "my",
            "my-mm",
            "mzn",
            "mzn-ir",
            "naq",
            "naq-na",
            "nb",
            "nb-no",
            "nb-sj",
            "nd",
            "nd-zw",
            "nds",
            "nds-de",
            "nds-nl",
            "ne",
            "ne-in",
            "ne-np",
            "nl",
            "nl-aw",
            "nl-be",
            "nl-ch",
            "nl-bq",
            "nl-cw",
            "nl-lu",
            "nl-nl",
            "nl-sr",
            "nl-sx",
            "nmg",
            "nmg-cm",
            "nn",
            "nn-no",
            "nnh",
            "nnh-cm",
            "no",
            "no-no",
            "nus",
            "nus-ss",
            "nyn",
            "nyn-ug",
            "om",
            "om-et",
            "om-ke",
            "or",
            "or-in",
            "os",
            "os-ge",
            "os-ru",
            "pa",
            "pa-in",
            "pa-pk",
            "pcm",
            "pcm-ng",
            "pl",
            "pl-pl",
            "prg",
            "prg-001",
            "ps",
            "ps-af",
            "ps-pk",
            "pt",
            "pt-ao",
            "pt-br",
            "pt-ch",
            "pt-cv",
            "pt-gq",
            "pt-gw",
            "pt-lu",
            "pt-mo",
            "pt-mz",
            "pt-pt",
            "pt-st",
            "pt-tl",
            "qu",
            "qu-bo",
            "qu-ec",
            "qu-pe",
            "rm",
            "rm-ch",
            "rn",
            "rn-bi",
            "ro",
            "ro-md",
            "ro-ro",
            "rof",
            "rof-tz",
            "ru",
            "ru-by",
            "ru-kg",
            "ru-kz",
            "ru-md",
            "ru-ru",
            "ru-ua",
            "rw",
            "rw-rw",
            "rwk",
            "rwk-tz",
            "sa",
            "sa-in",
            "sah",
            "sah-ru",
            "saq",
            "saq-ke",
            "sat",
            "sat-in",
            "sbp",
            "sbp-tz",
            "sd",
            "sd-in",
            "sd-pk",
            "se",
            "se-fi",
            "se-no",
            "se-se",
            "seh",
            "seh-mz",
            "ses",
            "ses-ml",
            "sg",
            "sg-cf",
            "shi",
            "shi-ma",
            "si",
            "si-lk",
            "sk",
            "sk-sk",
            "sl",
            "sl-si",
            "smn",
            "smn-fi",
            "sn",
            "sn-zw",
            "so",
            "so-dj",
            "so-et",
            "so-ke",
            "so-so",
            "sq",
            "sq-al",
            "sq-mk",
            "sq-xk",
            "sr",
            "sr-ba",
            "sr-cs",
            "sr-me",
            "sr-rs",
            "sr-xk",
            "su",
            "su-id",
            "sv",
            "sv-ax",
            "sv-fi",
            "sv-se",
            "sw",
            "sw-cd",
            "sw-ke",
            "sw-tz",
            "sw-ug",
            "sy",
            "ta",
            "ta-in",
            "ta-lk",
            "ta-my",
            "ta-sg",
            "te",
            "te-in",
            "teo",
            "teo-ke",
            "teo-ug",
            "tg",
            "tg-tj",
            "th",
            "th-th",
            "ti",
            "ti-er",
            "ti-et",
            "tk",
            "tk-tm",
            "tl",
            "to",
            "to-to",
            "tr",
            "tr-cy",
            "tr-tr",
            "tt",
            "tt-ru",
            "twq",
            "twq-ne",
            "tzm",
            "tzm-ma",
            "ug",
            "ug-cn",
            "uk",
            "uk-ua",
            "ur",
            "ur-in",
            "ur-pk",
            "uz",
            "uz-af",
            "uz-uz",
            "vai",
            "vai-lr",
            "vi",
            "vi-vn",
            "vo",
            "vo-001",
            "vun",
            "vun-tz",
            "wae",
            "wae-ch",
            "wo",
            "wo-sn",
            "xh",
            "xh-za",
            "xog",
            "xog-ug",
            "yav",
            "yav-cm",
            "yo",
            "yo-bj",
            "yo-ng",
            "yue",
            "yue-cn",
            "yue-hk",
            "zgh",
            "zgh-ma",
            "zh",
            "zh-cn",
            "zh-hk",
            "zh-mo",
            "zh-sg",
            "zh-tw",
            "zh-hans",
            "zh-hant",
            "zu",
            "zu-za",
          ],
        },
        publishDate: {
          type: "string",
          description: "Scheduled send date/time (ISO 8601). Used for scheduled emails.",
        },
        subcategory: {
          type: "string",
          description: "Email subcategory for organization/reporting (e.g., 'MARKETING_EMAIL').",
        },
        activeDomain: {
          type: "string",
          description: "Connected and verified sending domain in HubSpot.",
        },
        rssData__url: {
          type: "string",
          description: "External RSS feed URL. Required for external blog RSS emails.",
        },
        from__replyTo: {
          type: "string",
          description: "'From' email address; receives replies if `customReplyTo` is not set.",
        },
        sendOnPublish: {
          type: "boolean",
          description: "If true, sends email immediately on publishing, overriding `publishDate`.",
        },
        businessUnitId: {
          type: "string",
          description: "Associated business unit ID, for accounts with multiple units.",
        },
        from__fromName: {
          type: "string",
          description: "'From' name displayed to recipients.",
        },
        rssData__timing: {
          type: "object",
          additionalProperties: true,
          description: "Send timing for RSS emails. Applies if `rssData` is configured.",
        },
        testing__testId: {
          type: "string",
          description: "Unique identifier of the A/B test, if applicable.",
        },
        content__widgets: {
          type: "object",
          additionalProperties: true,
          description: "Configuration for widgets (modules) in email content.",
        },
        webversion__slug: {
          type: "string",
          description: "URL slug for the web version (e.g., 'july-newsletter').",
        },
        testing__abStatus: {
          type: "string",
          description: "Current status of the A/B test.",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__title: {
          type: "string",
          description: "Browser tab title for the web version.",
        },
        content__flexAreas: {
          type: "object",
          additionalProperties: true,
          description: "Configuration for flexible content areas in the email template.",
        },
        webversion__domain: {
          type: "string",
          description: "Domain for the email web version; defaults to HubSpot domain if unspecified.",
        },
        from__customReplyTo: {
          type: "string",
          description: "Custom reply-to email address; overrides `replyTo`.",
        },
        rssData__blogLayout: {
          type: "string",
          description: "Layout style for blog posts in RSS email. Applies if `rssData` is configured.",
        },
        rssData__maxEntries: {
          type: "integer",
          description: "Maximum blog posts per RSS email. Applies if `rssData` is configured.",
        },
        content__smartFields: {
          type: "object",
          additionalProperties: true,
          description: "Smart fields and values for email personalization.",
        },
        testing__hoursToWait: {
          type: "integer",
          description: "Hours to wait for A/B test results before sending the winning version.",
        },
        to__suppressGraymail: {
          type: "boolean",
          description: "If true, suppresses sending to 'graymail' contacts.",
        },
        content__templatePath: {
          type: "string",
          description: "Path to the email template in HubSpot Design Manager.",
        },
        webversion__expiresAt: {
          type: "string",
          description: "Expiration date/time (ISO 8601) for the web version link.",
        },
        rssData__blogEmailType: {
          type: "string",
          description: "Type of RSS email (e.g., 'instant', 'daily', 'weekly'). Applies if `rssData` is configured.",
        },
        rssData__hubspotBlogId: {
          type: "string",
          description: "HubSpot-hosted blog ID for RSS-to-Email. Applies if `rssData` is configured and blog is HubSpot-hosted.",
        },
        to__limitSendFrequency: {
          type: "boolean",
          description: "If true, respects contact send frequency limits.",
        },
        to__contactIds__exclude: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific contact IDs to exclude from recipients.",
        },
        to__contactIds__include: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific contact IDs to include as recipients.",
        },
        testing__abSuccessMetric: {
          type: "string",
          description: "Metric to determine A/B test winning version (e.g., 'CLICKS_BY_OPENS').",
          enum: [
            "CLICKS_BY_OPENS",
            "CLICKS_BY_DELIVERED",
            "OPENS_BY_DELIVERED",
          ],
        },
        content__plainTextVersion: {
          type: "string",
          description: "Plain text version of the email.",
        },
        content__widgetContainers: {
          type: "object",
          additionalProperties: true,
          description: "Configuration for widget containers in the email template.",
        },
        rssData__rssEntryTemplate: {
          type: "string",
          description: "HTML template for each RSS entry. Applies if `rssData` is configured.",
        },
        testing__abTestPercentage: {
          type: "integer",
          description: "Percentage of recipients in the A/B test group (e.g., 20 for 20%).",
        },
        to__contactLists__exclude: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact list IDs whose members will be excluded.",
        },
        to__contactLists__include: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact list IDs whose members will be included as recipients.",
        },
        webversion__redirectToUrl: {
          type: "string",
          description: "Custom URL to redirect to from web version link if `redirectToPageId` is not set.",
        },
        rssData__blogImageMaxWidth: {
          type: "integer",
          description: "Maximum width for images imported from RSS feed blog posts. Applies if `rssData` is configured.",
        },
        testing__abSamplingDefault: {
          type: "string",
          description: "Default email version ('master' or 'variant') if A/B test results are inconclusive.",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__metaDescription: {
          type: "string",
          description: "Meta description for the web version (for search engines).",
        },
        content__themeSettingsValues: {
          type: "object",
          additionalProperties: true,
          description: "Custom values for theme settings applied to the email template.",
        },
        testing__abSampleSizeDefault: {
          type: "string",
          description: "Default email version ('master' or 'variant') if A/B test sample size is too small.",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__redirectToPageId: {
          type: "string",
          description: "HubSpot page ID to redirect to from web version link; overrides `redirectToUrl`.",
        },
        rssData__useHeadlineAsSubject: {
          type: "boolean",
          description: "If true, email subject is first blog post headline. Applies if `rssData` is configured.",
        },
        subscriptionDetails__subscriptionId: {
          type: "string",
          description: "Specific subscription type ID (e.g., newsletter).",
        },
        subscriptionDetails__officeLocationId: {
          type: "string",
          description: "Company office location ID for email footer (compliance).",
        },
        subscriptionDetails__preferencesGroupId: {
          type: "string",
          description: "Associated subscription preferences group ID.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing_emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Create or update draft version.",
    ],
  }),
  composioTool({
    name: "hubspot_create_pipeline",
    description: "Creates a new HubSpot pipeline for a specified CRM `objectType` (e.g., 'deals', 'tickets'), requiring the pipeline `label` be unique for that `objectType` and each stage `label` be unique within the pipeline.",
    toolSlug: "HUBSPOT_CREATE_PIPELINE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "A unique label for the pipeline, used for organization in the HubSpot UI for this object type.",
        },
        stages: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              label: {
                type: "string",
                description: "A unique label for the pipeline stage, unique within the parent pipeline.",
              },
              metadata: {
                type: "object",
                additionalProperties: true,
                description: "Stage-specific properties. For 'deals' pipelines, `probability` (a value between 0.0-1.0, in 0.1 increments) is required. For 'tickets' pipelines, `ticketState` ('OPEN'/'CLOSED') is optional. Values can be strings or numbers.",
              },
              displayOrder: {
                type: "integer",
                description: "Display order for this stage. Stages with the same `displayOrder` are sorted alphabetically by label.",
              },
            },
            description: "Defines a stage within a pipeline.",
          },
          description: "A list of stage definitions for the new pipeline; each stage `label` must be unique within this pipeline.",
        },
        objectType: {
          type: "string",
          description: "Identifier for the CRM object type (e.g., 'deals', 'tickets', or a custom object type ID) for the new pipeline, determining its context and properties in HubSpot.",
        },
        displayOrder: {
          type: "integer",
          description: "Display order for this pipeline. Pipelines for the same object type with matching `displayOrder` are sorted alphabetically by label.",
        },
      },
      required: [
        "objectType",
        "displayOrder",
        "stages",
        "label",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipelines",
    ],
    askBefore: [
      "Confirm the parameters before executing Create pipeline for object type.",
    ],
  }),
  composioTool({
    name: "hubspot_create_pipeline_stage",
    description: "Creates a new stage in a specified HubSpot CRM pipeline for a given object type, such as 'deals' or 'tickets'.",
    toolSlug: "HUBSPOT_CREATE_PIPELINE_STAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "User-visible name for the pipeline stage, unique within the parent pipeline.",
        },
        metadata: {
          type: "object",
          additionalProperties: true,
          description: "Stage-specific properties. For `deals` pipelines, `metadata` must include a `probability` key (value 0.0-1.0 in 0.1 increments). For `tickets` pipelines, an optional `ticketState` key can specify `OPEN` or `CLOSED` status.",
        },
        objectType: {
          type: "string",
          description: "CRM object type (e.g., 'deals', 'tickets') for the new stage. Must be a valid HubSpot CRM object type supporting pipelines. Typically lowercase and plural.",
        },
        pipelineId: {
          type: "string",
          description: "Identifier of the existing pipeline (specific to `objectType`) where the new stage will be added.",
        },
        displayOrder: {
          type: "integer",
          description: "Stage's display order in the pipeline (lower numbers first). Stages with identical `displayOrder` are sorted alphabetically by `label`.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
        "metadata",
        "displayOrder",
        "label",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipeline_stages",
    ],
    askBefore: [
      "Confirm the parameters before executing Create pipeline stage.",
    ],
  }),
  composioTool({
    name: "hubspot_create_product",
    description: "Creates a new HubSpot product. Note: Products are catalog items and cannot be directly associated with deals, contacts, or companies. To connect product information to a deal or quote, create a line item using HUBSPOT_CREATE_LINE_ITEM that references this product's ID via hs_product_id.",
    toolSlug: "HUBSPOT_CREATE_PRODUCT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The official name of the product.",
        },
        price: {
          type: "number",
          description: "The selling price of the product in the default currency of the HubSpot account.",
        },
        hs_sku: {
          type: "string",
          description: "The Stock Keeping Unit (SKU) for the product. This should be unique across all products if used for inventory management.",
        },
        hs_url: {
          type: "string",
          description: "A direct URL link to the product's page on an e-commerce website or product information site.",
        },
        quantity: {
          type: "integer",
          description: "The current quantity of the product available in inventory. This property might be relevant for physical goods.",
        },
        hs_active: {
          type: "boolean",
          description: "Indicates if the product is currently active and available for sale. Set to `true` if active, `false` otherwise.",
        },
        hs_images: {
          type: "string",
          description: "A comma-separated string of URLs for product images. The first URL is typically used as the primary image.",
        },
        description: {
          type: "string",
          description: "A detailed description of the product, its features, and benefits.",
        },
        hs_archived: {
          type: "boolean",
          description: "Indicates if the product has been archived. Archived products are typically hidden from active lists and sales processes. Set to `true` to archive.",
        },
        hs_featured: {
          type: "boolean",
          description: "Indicates if the product is marked as a featured item, which can be used to highlight it in product listings.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "Unique numeric ID of the association type. To find valid association type IDs, query GET /crm/v4/associations/products/{toObjectType}/labels. Note: Products have limited association support - they cannot be directly associated with deals, contacts, or companies. To connect product information to deals, create a line item using hs_product_id instead.",
                    },
                    associationCategory: {
                      type: "string",
                      description: "The category of the association. Determines if the association is defined by HubSpot, a user, or an integrator.",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Defines the type and category of an association between HubSpot objects.",
                },
                description: "A list defining the types of associations. Note: Products have limited association support and cannot be associated with deals, contacts, or companies directly.",
              },
              to__id: {
                type: "string",
                description: "The unique ID of the target CRM object to associate with this product. Note: Products cannot be directly associated with deals, contacts, or companies - use line items instead.",
              },
            },
            description: "Specifies an association to be created between the new product and another HubSpot CRM object. Note: Products have very limited association support in HubSpot. Products CANNOT be directly associated with deals, contacts, or companies. To connect product information to a deal or quote, create a line item (using HUBSPOT_CREATE_LINE_ITEM) that references this product via hs_product_id.",
          },
          description: "A list of associations to create between this new product and other CRM objects. IMPORTANT: Products CANNOT be directly associated with deals, contacts, or companies. To connect product information to a deal, create a line item using HUBSPOT_CREATE_LINE_ITEM with hs_product_id referencing this product's ID.",
        },
        tax_category: {
          type: "string",
          description: "The tax category or code applicable to the product, used for calculating sales tax (e.g., 'Taxable Goods', 'Non-Taxable').",
        },
        hs_product_id: {
          type: "string",
          description: "An external or secondary unique identifier for the product. Useful for mapping to external systems. HubSpot does not auto-generate this.",
        },
        hs_valid_from: {
          type: "string",
          description: "The date (YYYY-MM-DD format) from which the product is considered valid or available for sale.",
        },
        hs_product_type: {
          type: "string",
          description: "The type of the product. Valid values: 'inventory' (physical goods tracked in inventory), 'non_inventory' (physical goods not tracked), 'service' (services or labor).",
        },
        hs_valid_through: {
          type: "string",
          description: "The date (YYYY-MM-DD format) until which the product is considered valid or available. Leave empty if there's no expiration date.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of custom properties for the product. Keys must be internal names of custom properties that already exist in your HubSpot account. Create custom properties in HubSpot Settings > Objects > Products > Product properties before using them here. Example: `{\"material\": \"Titanium\", \"warranty_years\": \"5\"}`.",
        },
        hs_product_status: {
          type: "string",
          description: "The current sales or lifecycle status of the product (e.g., 'Available', 'Discontinued', 'Pre-order', 'Out of Stock').",
        },
        hs_product_category: {
          type: "string",
          description: "The primary category the product belongs to (e.g., 'Electronics', 'Apparel', 'Consulting Services').",
        },
        hs_cost_of_goods_sold: {
          type: "number",
          description: "The cost of goods sold (COGS) for the product. Used for profit margin calculations.",
        },
        hs_product_subcategory: {
          type: "string",
          description: "A more specific subcategory for the product (e.g., 'Laptops' under 'Electronics').",
        },
        hs_recurring_billing_period: {
          type: "string",
          description: "The billing frequency for recurring revenue products, formatted as a PnYnMnDTnHnMnS string (e.g., P1M for 1 month, P1Y for 1 year).",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create product.",
    ],
  }),
  composioTool({
    name: "hubspot_create_products",
    description: "Creates multiple HubSpot products in a single batch operation.",
    toolSlug: "HUBSPOT_CREATE_PRODUCTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Product properties to set. Keys are HubSpot internal property names.",
              },
            },
            description: "Request schema for creating individual products within a batch operation.",
          },
          description: "List of product objects to create.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create products.",
    ],
  }),
  composioTool({
    name: "hubspot_create_property_for_specified_object_type",
    description: "Creates a new custom property for a specified HubSpot CRM object type; ensure `groupName` refers to an existing property group for the `objectType`.",
    toolSlug: "HUBSPOT_CREATE_PROPERTY_FOR_SPECIFIED_OBJECT_TYPE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "Internal programmatic name (snake_case), unique within the `objectType`, used for API referencing.",
        },
        type: {
          type: "string",
          description: "The data type of the property.",
          enum: [
            "string",
            "number",
            "date",
            "datetime",
            "enumeration",
            "bool",
          ],
        },
        label: {
          type: "string",
          description: "Human-readable label for the property shown in HubSpot UI.",
        },
        hidden: {
          type: "boolean",
          description: "If true, hides property in HubSpot UI, lists, and forms. Defaults to false if not set.",
        },
        options: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              label: {
                type: "string",
                description: "Human-readable label for the option shown in HubSpot UI.",
              },
              value: {
                type: "string",
                description: "Internal value of the option, used in API calls and must be unique among all options for this property.",
              },
              hidden: {
                type: "boolean",
                description: "If true, this option will not be displayed in HubSpot.",
              },
              description: {
                type: "string",
                description: "Optional description for the property option.",
              },
              displayOrder: {
                type: "integer",
                description: "Controls display order of options, sorted ascending; -1 displays after positive values.",
              },
            },
            description: "Request schema for individual property options, used when the property type is 'enumeration'.",
          },
          description: "List of predefined options. Required if `type` is 'enumeration'. For `fieldType` of 'booleancheckbox', must include exactly two options with values 'true' and 'false'. Each option defines a possible value.",
        },
        fieldType: {
          type: "string",
          description: "Controls UI display and interaction method (e.g., text input, dropdown, checkbox).",
          enum: [
            "textarea",
            "text",
            "date",
            "file",
            "number",
            "select",
            "radio",
            "checkbox",
            "booleancheckbox",
            "calculation_equation",
          ],
        },
        formField: {
          type: "boolean",
          description: "If true, property can be used in HubSpot forms. Defaults to false if not set.",
        },
        groupName: {
          type: "string",
          description: "Name of the property group for organization in HubSpot UI.",
        },
        objectType: {
          type: "string",
          description: "Target HubSpot CRM object type (e.g., contacts, companies) for the new property. Case-sensitive.",
        },
        description: {
          type: "string",
          description: "Optional description for the property, displayed as help text in HubSpot UI.",
        },
        displayOrder: {
          type: "integer",
          description: "Controls display order of properties in HubSpot UI, sorted ascending; -1 displays after positive values.",
        },
        hasUniqueValue: {
          type: "boolean",
          description: "If true, property's value must be unique across all records for the `objectType`. Cannot be changed to false after being set to true.",
        },
        externalOptions: {
          type: "boolean",
          description: "If true, 'enumeration' options are sourced externally, requiring `referencedObjectType` (e.g., 'OWNER' for HubSpot users). Defaults to false. Only for 'enumeration' type.",
        },
        calculationFormula: {
          type: "string",
          description: "Formula for calculated property, required if `fieldType` is 'calculation_equation'. Can reference other properties by their internal names.",
        },
        referencedObjectType: {
          type: "string",
          description: "For properties referencing other HubSpot objects (e.g., \"OWNER\" when `externalOptions` is true and `type` is \"enumeration\" to populate options with users). Applicable for specific property types.",
        },
      },
      required: [
        "objectType",
        "label",
        "type",
        "groupName",
        "name",
        "fieldType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "Confirm the parameters before executing Create property for specified object type.",
    ],
  }),
  composioTool({
    name: "hubspot_create_quote_object",
    description: "Creates a new quote object in HubSpot CRM with specified properties and associations.",
    toolSlug: "HUBSPOT_CREATE_QUOTE_OBJECT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        properties: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of key-value pairs representing the properties of the quote to be created. Property names are HubSpot internal names.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              to: {
                type: "object",
                additionalProperties: true,
                description: "Object containing the ID of the existing object to associate the new quote with.",
              },
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "The ID that specifies the type of association. For example, to associate a quote with a deal, use the appropriate HubSpot-defined ID.",
                    },
                    associationCategory: {
                      type: "string",
                      description: "The category of the association. HubSpot-defined associations are created by HubSpot, user-defined are created by users, and integrator-defined are created by integrations.",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Request schema for defining an association type between objects.",
                },
                description: "A list of association types to create between the new quote and other objects.",
              },
            },
            description: "Request schema for specifying associations to be created with the quote.",
          },
          description: "A list of associations to create for the new quote. Each item specifies the object to associate with and the type of association.",
        },
      },
      required: [
        "associations",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create quote object.",
    ],
  }),
  composioTool({
    name: "hubspot_create_task",
    description: "Creates a new CRM task record. Use when adding a task with properties and optional associations.",
    toolSlug: "HUBSPOT_CREATE_TASK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "Numeric ID representing the specific type of association.",
                    },
                    associationCategory: {
                      type: "string",
                      description: "Category of the association (HUBSPOT_DEFINED, USER_DEFINED, or INTEGRATOR_DEFINED).",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Association type descriptor for linking task with another record.",
                },
                description: "List of association type descriptors defining how the task links to the target record.",
              },
              to__id: {
                type: "string",
                description: "ID of the existing CRM record to associate with this task. Must be a numeric string (e.g., '12345'). Can also be provided via 'to' object with 'id' field (e.g., {\"to\": {\"id\": \"12345\"}}).",
              },
            },
            description: "Defines an association between the new task and another CRM record.",
          },
          description: "Optional list of associations to link this task with existing CRM records.",
        },
        hs_task_body: {
          type: "string",
          description: "Notes or body text of the task.",
        },
        hs_task_type: {
          type: "string",
          description: "Type of the task. Defaults to TODO if not specified.",
          enum: [
            "CALL",
            "EMAIL",
            "TODO",
          ],
        },
        hs_timestamp: {
          type: "string",
          description: "Task due date in ISO 8601 format or Unix milliseconds; required.",
        },
        hs_task_status: {
          type: "string",
          description: "Current status of the task. Defaults to NOT_STARTED if not specified.",
          enum: [
            "NOT_STARTED",
            "COMPLETED",
          ],
        },
        hs_task_subject: {
          type: "string",
          description: "Title or subject line of the task.",
        },
        hs_task_priority: {
          type: "string",
          description: "Priority level of the task. Defaults to NONE if not specified.",
          enum: [
            "LOW",
            "MEDIUM",
            "HIGH",
            "NONE",
          ],
        },
        hubspot_owner_id: {
          type: "string",
          description: "ID of the HubSpot owner to assign this task to. This is a numeric string (typically 6-9 digits, e.g., '85424051') that uniquely identifies a user in your HubSpot account. To obtain valid owner IDs, use the HUBSPOT_RETRIEVE_OWNERS action. If omitted, the task will be unassigned.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of custom properties. Boolean-type fields accept 'Yes'/'No', 'true'/'false', 'on'/'off', 'y'/'n' and Python booleans, which are auto-converted to string values ('true'/'false') for HubSpot API compatibility. Numeric strings ('0', '1', '2', etc.) are preserved as-is for number fields.",
        },
        hs_task_reminders: {
          type: "integer",
          description: "Reminder time for the task in Unix milliseconds.",
        },
      },
      required: [
        "hs_timestamp",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create task.",
    ],
  }),
  composioTool({
    name: "hubspot_create_ticket",
    description: "Creates a new HubSpot ticket.",
    toolSlug: "HUBSPOT_CREATE_TICKET",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        content: {
          type: "string",
          description: "Main body or description of the ticket, detailing the issue or request; typically required.",
        },
        subject: {
          type: "string",
          description: "Subject line or title of the ticket; typically a required field.",
        },
        created_by: {
          type: "string",
          description: "ID of the HubSpot user who created the ticket.",
        },
        createdate: {
          type: "string",
          description: "Date and time the ticket was created (ISO 8601 format, e.g., 'YYYY-MM-DDTHH:mm:ssZ'); HubSpot typically sets this automatically if not provided.",
        },
        hs_tag_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of tag IDs associated with the ticket for categorization or filtering.",
        },
        closed_date: {
          type: "string",
          description: "Date and time the ticket was closed (ISO 8601 format, e.g., 'YYYY-MM-DDTHH:mm:ssZ').",
        },
        hs_pipeline: {
          type: "string",
          description: "ID of the pipeline this ticket belongs to; often a required field.",
        },
        source_type: {
          type: "string",
          description: "Source channel through which the ticket was created; must be one of: 'CHAT', 'EMAIL', 'FORM', 'PHONE'.",
        },
        associations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              to: {
                type: "string",
                description: "ID of the HubSpot object to associate with the ticket (e.g., a contact ID, company ID).",
              },
              types: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    associationTypeId: {
                      type: "integer",
                      description: "Unique ID of the specific association type (e.g., ID for 'ticket_to_contact' association).",
                    },
                    associationCategory: {
                      type: "string",
                      description: "Category of the association.",
                      enum: [
                        "HUBSPOT_DEFINED",
                        "USER_DEFINED",
                        "INTEGRATOR_DEFINED",
                      ],
                    },
                  },
                  description: "Defines association types when linking HubSpot objects.",
                },
                description: "List of association type definitions specifying the link between the ticket and the target object.",
              },
            },
            description: "Defines an association between the new ticket and another HubSpot object.",
          },
          description: "List defining associations between this new ticket and other existing HubSpot objects (e.g., linking to a contact or company). Each item specifies the target object ID (`to`) and the type of association (`types`).",
        },
        time_to_close: {
          type: "string",
          description: "Time taken to close the ticket, often in milliseconds or ISO 8601 duration (e.g. 'PT2H30M').",
        },
        hs_all_team_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of all team IDs associated with this ticket; usually managed by HubSpot.",
        },
        hubspot_team_id: {
          type: "string",
          description: "ID of the HubSpot team this ticket is assigned to.",
        },
        last_reply_date: {
          type: "string",
          description: "Date and time of the last reply (either from agent or contact) on this ticket (ISO 8601 format).",
        },
        hs_all_owner_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of all HubSpot owner IDs associated with this ticket; usually managed by HubSpot.",
        },
        hs_lastcontacted: {
          type: "string",
          description: "Date and time of the last contact associated with this ticket (ISO 8601 format).",
        },
        hubspot_owner_id: {
          type: "string",
          description: "ID of the HubSpot user who owns this ticket.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of custom properties for the ticket: keys are internal names (e.g., `my_custom_field_name`), values are the data.",
        },
        hs_pipeline_stage: {
          type: "string",
          description: "ID of the current stage of the ticket within its pipeline; often required and must belong to the specified `hs_pipeline`.",
        },
        hs_primary_company: {
          type: "string",
          description: "ID of the primary company associated with this ticket.",
        },
        hs_ticket_category: {
          type: "string",
          description: "Category of the ticket; must be one of: 'PRODUCT_ISSUE', 'BILLING_ISSUE', 'FEATURE_REQUEST', 'GENERAL_INQUIRY'.",
        },
        hs_ticket_priority: {
          type: "string",
          description: "Priority of the ticket (e.g., 'HIGH', 'MEDIUM', 'LOW'); values might be HubSpot-defined or custom.",
        },
        notes_last_updated: {
          type: "string",
          description: "Timestamp of when the notes for this ticket were last updated (ISO 8601 format).",
        },
        hs_lastmodifieddate: {
          type: "string",
          description: "Date and time this ticket was last modified (ISO 8601 format); HubSpot typically sets this automatically.",
        },
        hs_assigned_team_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of team IDs specifically assigned to this ticket.",
        },
        hs_assignment_method: {
          type: "string",
          description: "Method used for assigning the ticket (e.g., 'MANUAL', 'AUTOMATIC_ROUND_ROBIN').",
        },
        last_engagement_date: {
          type: "string",
          description: "Date and time of the last engagement (e.g., email, call) with this ticket (ISO 8601 format).",
        },
        notes_last_contacted: {
          type: "string",
          description: "Timestamp of the last contact logged in notes associated with the ticket (ISO 8601 format).",
        },
        hs_created_by_user_id: {
          type: "string",
          description: "HubSpot user ID of the person or system that created this ticket.",
        },
        first_agent_reply_date: {
          type: "string",
          description: "Date and time of the first agent reply on this ticket (ISO 8601 format).",
        },
        notes_next_activity_date: {
          type: "string",
          description: "Timestamp for the next scheduled activity related to this ticket's notes (ISO 8601 format).",
        },
        hs_all_accessible_team_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of all team IDs with access to this ticket; usually managed by HubSpot.",
        },
        hs_all_conversation_mentions: {
          type: "array",
          items: {
            type: "string",
          },
          description: "System-populated list of all mentions in conversations related to this ticket.",
        },
        hs_all_associated_contact_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "System-populated list of email addresses of contacts associated with this ticket.",
        },
        hs_all_associated_contact_phones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "System-populated list of phone numbers of contacts associated with this ticket.",
        },
        hs_auto_generated_from_thread_id: {
          type: "string",
          description: "If auto-generated from a conversation, the ID of the originating thread.",
        },
        hs_all_assigned_business_unit_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of all business unit IDs assigned to this ticket; usually managed by HubSpot.",
        },
        hs_all_associated_contact_companies: {
          type: "array",
          items: {
            type: "string",
          },
          description: "System-populated list of company names or IDs for contacts linked to this ticket.",
        },
        hs_all_associated_contact_lastnames: {
          type: "array",
          items: {
            type: "string",
          },
          description: "System-populated list of last names of contacts associated with this ticket.",
        },
        hs_all_associated_contact_firstnames: {
          type: "array",
          items: {
            type: "string",
          },
          description: "System-populated list of first names of contacts associated with this ticket.",
        },
        hs_all_associated_contact_mobilephones: {
          type: "array",
          items: {
            type: "string",
          },
          description: "System-populated list of mobile phone numbers of contacts associated with this ticket.",
        },
        hs_conversations_originating_thread_id: {
          type: "string",
          description: "ID of the conversation thread from which this ticket originated.",
        },
        hs_conversations_originating_message_id: {
          type: "string",
          description: "ID of the first message in the conversation that led to this ticket's creation.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Create ticket.",
    ],
  }),
  composioTool({
    name: "hubspot_create_tickets",
    description: "Creates multiple HubSpot tickets in a batch, each with its own properties and associations; `inputs` list must not be empty, each item needs `properties`, and associations/custom properties must be validly defined using internal names for custom fields and ISO 8601 for dates.",
    toolSlug: "HUBSPOT_CREATE_TICKETS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              properties: {
                type: "object",
                additionalProperties: true,
                properties: {
                  content: {
                    type: "string",
                    description: "Main content or description of the ticket, detailing the issue or request.",
                  },
                  subject: {
                    type: "string",
                    description: "Subject line or title of the ticket (often a required field for ticket creation).",
                  },
                  created_by: {
                    type: "string",
                    description: "ID of the user who initially created the ticket.",
                  },
                  createdate: {
                    type: "string",
                    description: "Date and time ticket was created (ISO 8601 format); HubSpot automatically sets this if not provided.",
                  },
                  hs_tag_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Tag IDs applied to the ticket for categorization or filtering.",
                  },
                  closed_date: {
                    type: "string",
                    description: "Date and time ticket was closed (ISO 8601 format, e.g., 'YYYY-MM-DDTHH:mm:ss.SSSZ').",
                  },
                  hs_pipeline: {
                    type: "string",
                    description: "ID of the pipeline this ticket belongs to (uses default pipeline if not provided).",
                  },
                  source_type: {
                    type: "string",
                    description: "Source from which the ticket originated.",
                  },
                  time_to_close: {
                    type: "string",
                    description: "Duration taken to resolve and close the ticket (usually set by HubSpot upon closing).",
                  },
                  hs_all_team_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "All team IDs associated with this ticket, including primary and secondary.",
                  },
                  hubspot_team_id: {
                    type: "string",
                    description: "HubSpot team ID assigned to this ticket.",
                  },
                  last_reply_date: {
                    type: "string",
                    description: "Date and time of the last reply sent or received regarding the ticket (ISO 8601 format).",
                  },
                  hs_all_owner_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "All HubSpot user IDs who are owners of this ticket, including primary and secondary.",
                  },
                  hs_lastcontacted: {
                    type: "string",
                    description: "Date and time of the last contact activity related to the ticket (ISO 8601 format).",
                  },
                  hubspot_owner_id: {
                    type: "string",
                    description: "HubSpot user ID of the owner assigned to this ticket.",
                  },
                  custom_properties: {
                    type: "object",
                    additionalProperties: true,
                    description: "Custom properties for the ticket, using internal names as keys and providing their values (e.g., `{'my_custom_field': 'value'}`).",
                  },
                  hs_pipeline_stage: {
                    type: "string",
                    description: "ID of the stage within the pipeline this ticket is currently in. Required for ticket creation.",
                  },
                  hs_primary_company: {
                    type: "string",
                    description: "ID of the primary company associated with this ticket.",
                  },
                  hs_ticket_category: {
                    type: "string",
                    description: "Category of the ticket (values are often custom to your HubSpot setup).",
                  },
                  hs_ticket_priority: {
                    type: "string",
                    description: "Priority level of the ticket.",
                  },
                  notes_last_updated: {
                    type: "string",
                    description: "Date and time when notes associated with the ticket were last updated (ISO 8601 format).",
                  },
                  hs_lastmodifieddate: {
                    type: "string",
                    description: "Date and time when the ticket was last modified (ISO 8601 format; HubSpot automatically updates this).",
                  },
                  hs_assigned_team_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Team IDs specifically assigned to work on this ticket.",
                  },
                  hs_assignment_method: {
                    type: "string",
                    description: "Method used for assigning the ticket.",
                  },
                  last_engagement_date: {
                    type: "string",
                    description: "Date and time of the last engagement activity on the ticket (ISO 8601 format).",
                  },
                  notes_last_contacted: {
                    type: "string",
                    description: "Date and time of the last contact as recorded in notes (ISO 8601 format).",
                  },
                  hs_created_by_user_id: {
                    type: "string",
                    description: "HubSpot user ID of the person who created the ticket within the HubSpot system.",
                  },
                  first_agent_reply_date: {
                    type: "string",
                    description: "Date and time of the first agent reply to this ticket (ISO 8601 format).",
                  },
                  notes_next_activity_date: {
                    type: "string",
                    description: "Date and time for the next scheduled activity related to the ticket notes (ISO 8601 format).",
                  },
                  hs_all_accessible_team_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "All team IDs with access to view or interact with this ticket (typically HubSpot-managed).",
                  },
                  hs_all_conversation_mentions: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Read-only. User IDs or names mentioned in the ticket's conversation thread (HubSpot-populated).",
                  },
                  hs_all_associated_contact_emails: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Read-only. Email addresses of contacts associated with this ticket (HubSpot-populated).",
                  },
                  hs_all_associated_contact_phones: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Read-only. Phone numbers of contacts associated with this ticket (HubSpot-populated).",
                  },
                  hs_auto_generated_from_thread_id: {
                    type: "string",
                    description: "ID of the conversation thread if this ticket was automatically generated from it.",
                  },
                  hs_all_assigned_business_unit_ids: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "All business unit IDs associated with this ticket for data partitioning (typically HubSpot-managed).",
                  },
                  hs_all_associated_contact_companies: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Read-only. Company names linked to contacts associated with this ticket (HubSpot-populated).",
                  },
                  hs_all_associated_contact_lastnames: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Read-only. Last names of contacts associated with this ticket (HubSpot-populated).",
                  },
                  hs_all_associated_contact_firstnames: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Read-only. First names of contacts associated with this ticket (HubSpot-populated).",
                  },
                  hs_all_associated_contact_mobilephones: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "Read-only. Mobile phone numbers of contacts associated with this ticket (HubSpot-populated).",
                  },
                  hs_conversations_originating_thread_id: {
                    type: "string",
                    description: "ID of the conversation thread from which this ticket originated.",
                  },
                  hs_conversations_originating_message_id: {
                    type: "string",
                    description: "ID of the initial message in the conversation that led to this ticket's creation.",
                  },
                },
                description: "Properties for the new ticket (e.g., `subject`, `hs_pipeline`, `hs_pipeline_stage`); `subject` is often required.",
              },
              associations: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    to: {
                      type: "object",
                      additionalProperties: true,
                      properties: {
                        id: {
                          type: "string",
                          description: "Unique ID of the HubSpot object to associate with (e.g., a contact ID, company ID).",
                        },
                      },
                      description: "Target object to associate with this ticket, specifying its ID.",
                    },
                    types: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          associationTypeId: {
                            type: "integer",
                            description: "Unique ID of the association type (e.g., `16` for 'ticket to contact', `26` for 'ticket to company').",
                          },
                          associationCategory: {
                            type: "string",
                            description: "Category of the association (e.g., `HUBSPOT_DEFINED`, `USER_DEFINED`).",
                            enum: [
                              "HUBSPOT_DEFINED",
                              "USER_DEFINED",
                              "INTEGRATOR_DEFINED",
                            ],
                          },
                        },
                        description: "Request schema for defining association types between HubSpot objects.",
                      },
                      description: "Defines the types of associations, specifying `associationCategory` and `associationTypeId` for each.",
                    },
                  },
                  description: "Request schema for defining associations for a ticket.",
                },
                description: "Associations to create for this ticket, linking to other HubSpot CRM objects (e.g., contacts, companies).",
              },
            },
            description: "Request schema for a single ticket input within a batch creation request.",
          },
          description: "List of ticket creation requests; each item defines one ticket with its properties and associations.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Create tickets.",
    ],
  }),
  composioTool({
    name: "hubspot_create_timeline_event",
    description: "Creates an immutable custom timeline event on a CRM object's record using a specified, existing event template (identified by `eventTemplateId`), optionally updating CRM object properties if defined in the template; requires `email`, `utk`, or `objectId` for association.",
    toolSlug: "HUBSPOT_CREATE_TIMELINE_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Optional unique event identifier; HubSpot auto-generates if omitted. Use `{{uuid}}` for uniqueness if providing an ID.",
        },
        utk: {
          type: "string",
          description: "HubSpot user token (e.g., from `hubspotutk` cookie) to associate event with a contact; use if contact's email is unknown.",
        },
        email: {
          type: "string",
          description: "Email for contact-specific events; identifies existing contact, creates new, or changes email (if `objectId` provided).",
        },
        domain: {
          type: "string",
          description: "Domain associated with the event, often paired with `utk` for contact event context.",
        },
        tokens: {
          type: "object",
          additionalProperties: true,
          description: "Key-value pairs for populating dynamic content in the event template; keys are token names from the template.",
        },
        objectId: {
          type: "string",
          description: "Unique identifier of the CRM object (e.g., company, deal) for event association; required for non-contact objects.",
        },
        timestamp: {
          type: "string",
          description: "ISO 8601 UTC timestamp of event occurrence; defaults to current time. Determines timeline placement.",
        },
        eventTemplateId: {
          type: "string",
          description: "The unique identifier of the event template, which must exist in HubSpot.",
        },
        timelineIFrame__url: {
          type: "string",
          description: "URL of content to display in the iframe.",
        },
        timelineIFrame__width: {
          type: "integer",
          description: "Width of the iframe modal window (pixels).",
        },
        timelineIFrame__height: {
          type: "integer",
          description: "Height of the iframe modal window (pixels).",
        },
        timelineIFrame__linkLabel: {
          type: "string",
          description: "Text for the link that opens the iframe modal with more details.",
        },
        timelineIFrame__headerLabel: {
          type: "string",
          description: "Title/header for the modal window displaying iframe content.",
        },
      },
      required: [
        "eventTemplateId",
        "tokens",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create timeline event based on template.",
    ],
  }),
  composioTool({
    name: "hubspot_create_timeline_events_batch",
    description: "Creates multiple immutable timeline events in a batch, ideal for bulk data imports or real-time synchronizations, using a valid event template; may update CRM properties if the template is so configured.",
    toolSlug: "HUBSPOT_CREATE_TIMELINE_EVENTS_BATCH",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Optional unique identifier for the event. HubSpot will generate one if omitted. You can use `{{uuid}}` within the ID string (e.g., `my-event-{{uuid}}`) to ensure uniqueness if providing your own.",
              },
              utk: {
                type: "string",
                description: "The HubSpot user token (utk) to associate the event with a contact. Recommended if the contact's email is unknown but a `usertoken` from a cookie is available.",
              },
              email: {
                type: "string",
                description: "The email address of the contact to associate with this event. Can be used to identify existing contacts, create new ones, or update the email of an existing contact if `objectId` is also provided.",
              },
              domain: {
                type: "string",
                description: "The domain name to associate with the event, often used with `utk` (user token) for analytics or contact tracking.",
              },
              tokens: {
                type: "object",
                additionalProperties: true,
                description: "A dictionary of key-value pairs, where keys are token names defined in the event template and values are the specific data for this event. All token values must be strings.",
              },
              objectId: {
                type: "string",
                description: "The unique identifier of the CRM object (e.g., company, deal) to which this event pertains. Required for all event types except contact events where `email` or `utk` can be used instead.",
              },
              timestamp: {
                type: "string",
                description: "The Coordinated Universal Time (UTC) ISO 8601 formatted date and time when the event actually occurred (e.g., '2023-05-15T10:30:00Z'). If omitted, HubSpot will use the time the event is processed. This timestamp influences the event's chronological position on the CRM object's timeline.",
              },
              eventTemplateId: {
                type: "string",
                description: "The unique identifier of the event template to be used for creating the timeline event. This template defines the structure and properties of the event.",
              },
              timelineIFrame__url: {
                type: "string",
                description: "The URL of the content to be displayed within the iframe. This is required if the event template is configured to display an iframe.",
              },
              timelineIFrame__width: {
                type: "integer",
                description: "The width of the iframe's modal window in pixels. Applicable if the event template uses an iframe.",
              },
              timelineIFrame__height: {
                type: "integer",
                description: "The height of the iframe's modal window in pixels. Applicable if the event template uses an iframe.",
              },
              timelineIFrame__linkLabel: {
                type: "string",
                description: "The text for the link that, when clicked, will display the iframe. Relevant only if the event template uses an iframe.",
              },
              timelineIFrame__headerLabel: {
                type: "string",
                description: "The title or header label for the modal window that displays the iframe's content. Used if the event template includes an iframe.",
              },
            },
            description: "Defines a single timeline event to be created as part of a batch.",
          },
          description: "A list of event objects to be created. Each object in the list must conform to the InputsRequest schema and define a single timeline event.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create multiple timeline events batch.",
    ],
  }),
  composioTool({
    name: "hubspot_create_workflow",
    description: "Creates a new HubSpot workflow to automate processes; ensure `enrollmentCriteria` and `actions` use properties relevant to the specified `objectTypeId`.",
    toolSlug: "HUBSPOT_CREATE_WORKFLOW",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The unique name for the workflow.",
        },
        type: {
          type: "string",
          description: "'CONTACT_FLOW' for contact-based workflows, 'PLATFORM_FLOW' for workflows based on other CRM object types (deals, companies, tickets, custom objects).",
          enum: [
            "CONTACT_FLOW",
            "PLATFORM_FLOW",
          ],
        },
        actions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of workflow action configurations. Each action must include: 'actionId' (unique string ID), 'type' (e.g., 'SINGLE_CONNECTION'), 'actionTypeId' (e.g., '0-1' for delay, '0-4' for email), 'actionTypeVersion' (typically 0), 'connection' (object with 'edgeType' and 'nextActionId'), and 'fields' (action-specific settings). Example: [{'actionId': '1', 'type': 'SINGLE_CONNECTION', 'actionTypeId': '0-1', 'actionTypeVersion': 0, 'connection': {'edgeType': 'STANDARD', 'nextActionId': '2'}, 'fields': {'delayMillis': 3600000}}]",
        },
        flowType: {
          type: "string",
          description: "Flow category: 'WORKFLOW' for standard workflows, 'ACTION_SET' for reusable action sets that can be called from other workflows.",
          enum: [
            "WORKFLOW",
            "ACTION_SET",
            "UNKNOWN",
          ],
        },
        isEnabled: {
          type: "boolean",
          description: "Set to true to activate the workflow immediately upon creation, or false to create it in disabled state for review.",
        },
        dataSources: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data source configurations for conditions or personalization.",
        },
        description: {
          type: "string",
          description: "Optional explanation of the workflow's purpose and functionality.",
        },
        timeWindows: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Configurations for periods when workflow actions can execute.",
        },
        blockedDates: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Configurations for dates when workflow actions should not execute.",
        },
        objectTypeId: {
          type: "string",
          description: "HubSpot internal ID for the CRM object type: '0-1' for Contacts, '0-2' for Companies, '0-3' for Deals, '0-5' for Tickets, or custom object type ID.",
        },
        startActionId: {
          type: "string",
          description: "The unique ID of the first action in the workflow. This must match the actionId of one of the actions in the actions array.",
        },
        customProperties: {
          type: "object",
          additionalProperties: true,
          description: "Custom key-value pairs for organization or tracking.",
        },
        enrollmentCriteria: {
          type: "object",
          additionalProperties: true,
          description: "Required configuration defining enrollment triggers for the workflow. Must include: 'type' (either 'EVENT_BASED' or 'LIST_BASED'), 'shouldReEnroll' (boolean for allowing re-enrollment), and either 'eventFilterBranches' (for event-based) or 'listFilterBranch' (for list-based enrollment). Example for event-based: {'type': 'EVENT_BASED', 'shouldReEnroll': false, 'eventFilterBranches': [{'filterBranchType': 'OR', 'filterBranchOperator': 'OR', 'filters': [{'filterType': 'PROPERTY', 'property': 'email', 'operator': 'HAS_PROPERTY'}]}]}",
        },
        suppressionListIds: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "HubSpot list IDs for contacts to be prevented from enrollment.",
        },
        unEnrollmentSetting: {
          type: "object",
          additionalProperties: true,
          properties: {
            type: {
              type: "string",
              description: "Unenrollment behavior: 'ALL' from all other workflows, 'SELECTIVE' from specified workflows.",
              enum: [
                "ALL",
                "SELECTIVE",
              ],
            },
            flowIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Workflow IDs for unenrollment if 'type' is 'SELECTIVE'.",
            },
          },
          description: "Defines if/how objects unenroll from other workflows upon enrolling in this one.",
        },
        nextAvailableActionId: {
          type: "string",
          description: "The next available action ID number for sequencing. This should be one higher than the highest action ID number used in the workflow.",
        },
        canEnrollFromSalesforce: {
          type: "boolean",
          description: "Allow contacts to be enrolled directly from Salesforce.",
        },
      },
      required: [
        "name",
        "startActionId",
        "nextAvailableActionId",
        "actions",
        "enrollmentCriteria",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "automation",
    ],
    askBefore: [
      "Confirm the parameters before executing Create workflow.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_calling_extension_settings",
    description: "Permanently deletes the settings for a calling extension app, specified by its `appId`, rendering it unusable for all connected HubSpot accounts; this operation is irreversible.",
    toolSlug: "HUBSPOT_DELETE_CALLING_EXTENSION_SETTINGS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique identifier for the calling extension app to be deleted. This ID is assigned by HubSpot when the extension is created.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "settings",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete calling extension settings.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_campaign",
    description: "Permanently deletes a marketing campaign from HubSpot using its `campaignGuid`; returns a 204 No Content status even if the campaign does not exist.",
    toolSlug: "HUBSPOT_DELETE_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaignGuid: {
          type: "string",
          description: "The unique identifier (UUID) for the marketing campaign to be deleted.",
        },
      },
      required: [
        "campaignGuid",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete campaign.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_delete_campaigns_batch",
    description: "Archives a batch of up to 50 marketing campaigns, hiding them from active views rather than permanently deleting them.",
    toolSlug: "HUBSPOT_DELETE_CAMPAIGNS_BATCH",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the marketing campaign to be archived.",
              },
            },
            description: "Specifies a single marketing campaign to be archived.",
          },
          description: "A list of marketing campaign identifiers to be archived in batch.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive a batch of campaigns.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_company_gdpr",
    description: "Permanently deletes a company (identified by objectId) and its associated data from HubSpot for GDPR compliance; this action is irreversible and requires the company to exist.",
    toolSlug: "HUBSPOT_DELETE_COMPANY_GDPR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectId: {
          type: "string",
          description: "The unique identifier of the company to be permanently deleted. If `idProperty` is specified, this is the value of that custom unique property. Otherwise, this is the company's HubSpot Company ID.",
        },
        idProperty: {
          type: "string",
          description: "Optional name of an alternate unique identifier property. If provided, objectId must be the value of this property for the company.",
        },
      },
      required: [
        "objectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "gdpr",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently delete company for GDPR compliance.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_contact_gdpr",
    description: "Irreversibly erases a HubSpot contact and associated data per a GDPR request; if an email is given for a non-existent contact, it's blocklisted.",
    toolSlug: "HUBSPOT_DELETE_CONTACT_GDPR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectId: {
          type: "string",
          description: "The contact's identifier (email or HubSpot ID, based on `idProperty`) for permanent deletion.",
        },
        idProperty: {
          type: "string",
          description: "Identifies how `objectId` should be interpreted: 'email' for email address, or null/omitted for HubSpot contact ID (default).",
        },
      },
      required: [
        "objectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "gdpr",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently delete contact for GDPR compliance.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_deal_gdpr",
    description: "Archives a HubSpot deal by its ID. Note: HubSpot's GDPR permanent deletion API only supports contacts, not deals. This action archives the deal (moves to recycling bin for 90 days) as the closest available functionality.",
    toolSlug: "HUBSPOT_DELETE_DEAL_GDPR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dealId: {
          type: "string",
          description: "The unique HubSpot Deal ID of the deal to archive. Archived deals are moved to the recycling bin and recoverable for 90 days.",
        },
      },
      required: [
        "dealId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive deal (GDPR permanent delete not supported for deals).",
    ],
  }),
  composioTool({
    name: "hubspot_delete_line_items_gdpr",
    description: "Permanently deletes a specified line item and its associated content for GDPR compliance; this action is irreversible and cannot be undone.",
    toolSlug: "HUBSPOT_DELETE_LINE_ITEMS_GDPR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectId: {
          type: "string",
          description: "The value of the unique identifier for the line item to be permanently deleted. This corresponds to the property named in `idProperty`, or the line item's primary HubSpot ID if `idProperty` is not provided.",
        },
        idProperty: {
          type: "string",
          description: "The name of the property that uniquely identifies the line item, if `objectId` is not its primary HubSpot ID. For example, 'external_id'. If omitted, `objectId` is assumed to be the line item's primary HubSpot ID.",
        },
      },
      required: [
        "objectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "gdpr",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently delete line items for gdpr.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_marketing_email",
    description: "Permanently deletes a marketing email from your HubSpot account. This action cannot be undone.",
    toolSlug: "HUBSPOT_DELETE_MARKETING_EMAIL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "The unique identifier of the marketing email to delete.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing_emails",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete a marketing email.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_pipeline",
    description: "Permanently deletes a HubSpot pipeline and all its stages by `pipelineId` and `objectType`; this is irreversible, so use validation flags to avoid errors if the pipeline is not empty.",
    toolSlug: "HUBSPOT_DELETE_PIPELINE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "Type of CRM object associated with the pipeline, determining which pipeline category is affected.",
        },
        pipelineId: {
          type: "string",
          description: "Unique identifier of the pipeline to be deleted.",
        },
        validateReferencesBeforeDelete: {
          type: "boolean",
          description: "If true, HubSpot checks for existing references to this pipeline before deletion to prevent data loss or orphaned records.",
        },
        validateDealStageUsagesBeforeDelete: {
          type: "boolean",
          description: "If true (for deal pipelines), HubSpot verifies if any deals use stages from this pipeline before deletion to prevent disruption.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipelines",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete pipeline by id.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_pipeline_stage",
    description: "Permanently deletes a specific pipeline stage for an `objectType` (e.g., 'deals', 'tickets') that supports pipelines; this operation is irreversible, so ensure no active CRM records are associated with the stage to prevent data issues.",
    toolSlug: "HUBSPOT_DELETE_PIPELINE_STAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        stageId: {
          type: "string",
          description: "Identifier of the pipeline stage to be deleted.",
        },
        objectType: {
          type: "string",
          description: "The CRM object type for the pipeline (e.g., 'deals', 'tickets').",
        },
        pipelineId: {
          type: "string",
          description: "Identifier of the pipeline (specific to the `objectType`) from which the stage will be deleted.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
        "stageId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipeline_stages",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete pipeline stage by id.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_schema",
    description: "Deletes a HubSpot custom object schema by `objectType`. With `archived=false` (default), it archives the schema (soft delete). With `archived=true`, it permanently deletes an already-archived schema (hard delete). Prerequisites: All object instances, associations, and properties must be deleted first.",
    toolSlug: "HUBSPOT_DELETE_SCHEMA",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Controls deletion type: `false` (default) archives the schema (soft delete), `true` permanently deletes an already-archived schema (hard delete). To fully remove a schema, first call with `false` to archive it, then call again with `true` to purge it.",
        },
        objectType: {
          type: "string",
          description: "The fully qualified name or object type ID of the custom object schema to delete. Must be an exact match to an existing schema. Note: All object instances, associations, and properties must be deleted before the schema can be removed.",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete schema by object type.",
    ],
  }),
  composioTool({
    name: "hubspot_delete_timeline_event_template",
    description: "Permanently and irreversibly deletes a specific timeline event template, identified by its `eventTemplateId`, from the application `appId`.",
    toolSlug: "HUBSPOT_DELETE_TIMELINE_EVENT_TEMPLATE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The numeric identifier (positive integer) for the target application within which the event template exists. The template specified by `eventTemplateId` must be part of this application.",
        },
        eventTemplateId: {
          type: "string",
          description: "The unique identifier for the event template to be deleted. This ID must correspond to an existing template within the specified application. Typically a UUID or a system-generated string.",
        },
      },
      required: [
        "eventTemplateId",
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "templates",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete timeline event template.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_delete_video_conferencing_app_settings",
    description: "Irreversibly deletes all settings for a video conferencing application identified by its `appId` in HubSpot, removing its configuration and preventing it from functioning until reconfigured; existing meetings and historical data are unaffected. Note: This API requires developer API key (hapikey) authentication from your HubSpot developer account, not OAuth tokens.",
    toolSlug: "HUBSPOT_DELETE_VIDEO_CONFERENCING_APP_SETTINGS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique identifier for the video conferencing application whose settings are to be deleted; assigned when the application is created in your HubSpot developer portal.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "settings",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete video conferencing app settings.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_delete_workflow",
    description: "Permanently deletes a HubSpot workflow by its ID; deleted workflows cannot be restored via the API and the ID must exist.",
    toolSlug: "HUBSPOT_DELETE_WORKFLOW",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique identifier of the HubSpot workflow to be deleted.",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "automation",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete workflow.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_fetch_import_error_details",
    description: "Fetches a paginated list of read-only error details for a specific HubSpot CRM import, requiring a valid `importId` for a processed import.",
    toolSlug: "HUBSPOT_FETCH_IMPORT_ERROR_DETAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from a previous response's `paging.next.after` property to fetch the next page of error details.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of error records to return per page (e.g., between 1 and a HubSpot-defined maximum of 100).",
        },
        importId: {
          type: "integer",
          description: "Identifier of the import operation for which to fetch error details; must correspond to an existing import in HubSpot.",
        },
      },
      required: [
        "importId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "public_imports",
    ],
  }),
  composioTool({
    name: "hubspot_fetch_recording_settings",
    description: "Fetches call recording settings for a specified, existing HubSpot calling extension app.",
    toolSlug: "HUBSPOT_FETCH_RECORDING_SETTINGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique identifier for an existing calling extension app.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "recording_settings",
    ],
  }),
  composioTool({
    name: "hubspot_fetch_revenue",
    description: "Fetches a revenue attribution report for a specified, existing marketing campaign, optionally using a specific attribution model and date range; if both start and end dates are given, `endDate` must not be earlier than `startDate`.",
    toolSlug: "HUBSPOT_FETCH_REVENUE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        endDate: {
          type: "string",
          description: "End date (YYYY-MM-DD) for filtering report data; defaults to the current date if omitted.",
        },
        startDate: {
          type: "string",
          description: "Start date (YYYY-MM-DD) for filtering report data; defaults to '2006-01-01' if omitted.",
        },
        campaignGuid: {
          type: "string",
          description: "The unique identifier (UUID) for the marketing campaign.",
        },
        attributionModel: {
          type: "string",
          description: "Attribution model for revenue calculation; defaults to 'LINEAR' if omitted. Allowed values: 'LINEAR', 'FIRST_INTERACTION', 'LAST_INTERACTION', 'FULL_PATH', 'U_SHAPED', 'W_SHAPED', 'TIME_DECAY', 'J_SHAPED', 'INVERSE_J_SHAPED'.",
        },
      },
      required: [
        "campaignGuid",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "hubspot_get_ab_email_variation",
    description: "Retrieves the alternate variation of a specified A/B marketing email; the `emailId` must identify an email currently in an A/B test. Requires Marketing Hub Professional or Enterprise subscription.",
    toolSlug: "HUBSPOT_GET_AB_EMAIL_VARIATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "The unique identifier of the A/B marketing email. If this ID refers to variation A, the details for variation B will be returned, and vice-versa.",
        },
        archived: {
          type: "boolean",
          description: "Boolean variable to request archived email. Set to true to retrieve archived A/B test emails.",
        },
        includeStats: {
          type: "boolean",
          description: "Boolean variable to request stats to be returned in response. Set to true to include email performance statistics.",
        },
        workflowNames: {
          type: "boolean",
          description: "Boolean variable to request name of the associated workflows in response. Set to true to include workflow names.",
        },
        includedProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of properties to be returned in the API response. If not specified, all properties will be returned.",
        },
        marketingCampaignNames: {
          type: "boolean",
          description: "Boolean variable to request name of the campaign in response. Set to true to include associated campaign names.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing_emails",
    ],
  }),
  composioTool({
    name: "hubspot_get_account_info",
    description: "Gets current HubSpot account info (email, hubId, user details) using access-token lookup.",
    toolSlug: "HUBSPOT_GET_ACCOUNT_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_get_active_imports_list",
    description: "Retrieves a list of currently active import jobs in HubSpot for monitoring ongoing data operations.",
    toolSlug: "HUBSPOT_GET_ACTIVE_IMPORTS_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Cursor for the next page of results, from a previous response's `paging.next.after` property.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of import results per page.",
        },
        before: {
          type: "string",
          description: "Cursor for the previous page of results, obtained from a previous response.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "core",
    ],
  }),
  composioTool({
    name: "hubspot_get_aggregated_statistic_intervals",
    description: "Retrieves aggregated statistics for marketing emails (e.g., send counts), grouped by specified time intervals within a defined time range.",
    toolSlug: "HUBSPOT_GET_AGGREGATED_STATISTIC_INTERVALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailIds: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Optional list of specific email IDs to filter results; if omitted, statistics for all emails in the time range are returned.",
        },
        interval: {
          type: "string",
          description: "Time interval for aggregating email statistics, defining data granularity (e.g., YEAR, MONTH, DAY).",
          enum: [
            "YEAR",
            "QUARTER",
            "MONTH",
            "WEEK",
            "DAY",
            "HOUR",
            "QUARTER_HOUR",
            "MINUTE",
            "SECOND",
          ],
        },
        endTimestamp: {
          type: "string",
          description: "End of the time span for statistics (ISO8601 timestamp); must be on or after `startTimestamp`.",
        },
        startTimestamp: {
          type: "string",
          description: "Start of the time span for statistics (ISO8601 timestamp).",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "statistics",
    ],
  }),
  composioTool({
    name: "hubspot_get_aggregated_statistics",
    description: "Retrieves aggregated statistics for marketing emails, optionally within an ISO8601 formatted time range, by email IDs, or specific email properties.",
    toolSlug: "HUBSPOT_GET_AGGREGATED_STATISTICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailIds: {
          type: "array",
          items: {
            type: "integer",
          },
          description: "Filter statistics by specific email IDs.",
        },
        property: {
          type: "string",
          description: "Specific email property to include (e.g., 'subject', 'campaignGuid'); if omitted, all available properties are returned. See HubSpot docs for available properties.",
        },
        endTimestamp: {
          type: "string",
          description: "End of the time range (ISO8601 format); statistics are aggregated for emails sent on or before this time. Required by the API; if not provided, defaults to current time.",
        },
        startTimestamp: {
          type: "string",
          description: "Start of the time range (ISO8601 format); statistics are aggregated for emails sent on or after this time. Required by the API; if not provided, defaults to 30 days ago.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "statistics",
    ],
  }),
  composioTool({
    name: "hubspot_get_all_marketing_emails_for_a_hub_spot_account",
    description: "Fetches a list of marketing emails from a HubSpot account, with options for filtering, sorting, pagination, and including performance statistics.",
    toolSlug: "HUBSPOT_GET_ALL_MARKETING_EMAILS_FOR_A_HUB_SPOT_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to sort the results by. Valid fields are `name`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`. Prefix with '-' for descending order (e.g., '-createdAt'). `createdAt` is the default sort order if unspecified.",
        },
        type: {
          type: "string",
          description: "Filter emails by type. Multiple types can be specified. If omitted, emails of all types are returned. See TypeEnm for allowed values.",
          enum: [
            "AB_EMAIL",
            "BATCH_EMAIL",
            "LOCALTIME_EMAIL",
            "AUTOMATED_AB_EMAIL",
            "BLOG_EMAIL",
            "BLOG_EMAIL_CHILD",
            "RSS_EMAIL",
            "RSS_EMAIL_CHILD",
            "RESUBSCRIBE_EMAIL",
            "OPTIN_EMAIL",
            "OPTIN_FOLLOWUP_EMAIL",
            "AUTOMATED_EMAIL",
            "FEEDBACK_CES_EMAIL",
            "FEEDBACK_CUSTOM_EMAIL",
            "FEEDBACK_CUSTOM_SURVEY_EMAIL",
            "FEEDBACK_NPS_EMAIL",
            "FOLLOWUP_EMAIL",
            "LEADFLOW_EMAIL",
            "SINGLE_SEND_API",
            "MARKETING_SINGLE_SEND_API",
            "SMTP_TOKEN",
            "TICKET_EMAIL",
            "MEMBERSHIP_REGISTRATION_EMAIL",
            "MEMBERSHIP_PASSWORD_SAVED_EMAIL",
            "MEMBERSHIP_PASSWORD_RESET_EMAIL",
            "MEMBERSHIP_EMAIL_VERIFICATION_EMAIL",
            "MEMBERSHIP_OTP_LOGIN_EMAIL",
          ],
        },
        after: {
          type: "string",
          description: "The cursor token to retrieve the next page of results. This value is obtained from the `paging.next.after` property of a previous paged response.",
        },
        limit: {
          type: "integer",
          description: "The maximum number of emails to return per page. Default is 100, max is 100.",
        },
        archived: {
          type: "boolean",
          description: "Specifies whether to include archived emails in the results. Defaults to `false` (archived emails are not returned). Set to `true` to retrieve archived emails.",
        },
        createdAt: {
          type: "string",
          description: "Filter emails created at this exact ISO 8601 date-time (e.g., '2023-10-26T10:30:00Z').",
        },
        updatedAt: {
          type: "string",
          description: "Filter emails last updated at this exact ISO 8601 date-time (e.g., '2023-10-26T12:45:00Z').",
        },
        isPublished: {
          type: "boolean",
          description: "Filter emails based on their publication status: `true` for published emails, `false` for draft emails. If omitted, both published and draft emails are returned.",
        },
        createdAfter: {
          type: "string",
          description: "Filter emails created after this ISO 8601 date-time (e.g., '2023-10-26T00:00:00Z').",
        },
        includeStats: {
          type: "boolean",
          description: "If `true`, includes statistics (e.g., open rates, click rates) with each email. Defaults to `false`.",
        },
        updatedAfter: {
          type: "string",
          description: "Filter emails last updated after this ISO 8601 date-time (e.g., '2023-10-26T00:00:00Z').",
        },
        createdBefore: {
          type: "string",
          description: "Filter emails created before this ISO 8601 date-time (e.g., '2023-10-27T00:00:00Z').",
        },
        updatedBefore: {
          type: "string",
          description: "Filter emails last updated before this ISO 8601 date-time (e.g., '2023-10-27T00:00:00Z').",
        },
        includedProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of specific property names to include in the response for each email object. If omitted, a default set of properties is returned. Consult the HubSpot API documentation for available email properties.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing_emails",
    ],
  }),
  composioTool({
    name: "hubspot_get_campaign",
    description: "Retrieves a HubSpot campaign by its ID.",
    toolSlug: "HUBSPOT_GET_CAMPAIGN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaignId: {
          type: "string",
          description: "Unique HubSpot identifier for the campaign to retrieve.",
        },
      },
      required: [
        "campaignId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing",
    ],
  }),
  composioTool({
    name: "hubspot_get_campaign_metrics",
    description: "Retrieves key attribution metrics for an existing marketing campaign, identified by its `campaignGuid`, within an optional date range.",
    toolSlug: "HUBSPOT_GET_CAMPAIGN_METRICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        endDate: {
          type: "string",
          description: "The end date (YYYY-MM-DD) for filtering report data. Defaults to the current date if not specified.",
        },
        startDate: {
          type: "string",
          description: "The start date (YYYY-MM-DD) for filtering report data. Defaults to 2006-01-01 if not specified.",
        },
        campaignGuid: {
          type: "string",
          description: "The unique identifier (UUID) for the marketing campaign for which to retrieve metrics.",
        },
      },
      required: [
        "campaignGuid",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "hubspot_get_campaigns",
    description: "Retrieves multiple HubSpot campaigns.",
    toolSlug: "HUBSPOT_GET_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from previous response.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of campaigns to return.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing",
    ],
  }),
  composioTool({
    name: "hubspot_get_company",
    description: "Retrieves a HubSpot company by its ID.",
    toolSlug: "HUBSPOT_GET_COMPANY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Set to true to include only archived companies; defaults to false (active companies).",
        },
        companyId: {
          type: "string",
          description: "Unique HubSpot identifier for the company to retrieve.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Company property names to include in the response; if omitted, only default properties (name, domain, createdate, etc.) are returned. Use \"all\" to retrieve all properties, or specify individual property names. Accepts a list of strings or a JSON-stringified array (e.g., '[\"name\", \"domain\"]').",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types (e.g., 'contacts', 'deals') to include associated object IDs in the response. Accepts a list of strings or a JSON-stringified array (e.g., '[\"contacts\", \"deals\"]').",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names for which to include current and historical values in the response. Accepts a list of strings or a JSON-stringified array.",
        },
      },
      required: [
        "companyId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_get_contact_ids",
    description: "Fetches a list of contact IDs for a specific HubSpot campaign based on interaction type.",
    toolSlug: "HUBSPOT_GET_CONTACT_IDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "A pagination cursor. Used to fetch the next set of results. Provide the 'after' value from a previous response to get subsequent pages. Example: NTI1Cg%3D%3D",
        },
        limit: {
          type: "integer",
          description: "The maximum number of contact IDs to return in a single request. Default is 100.",
        },
        endDate: {
          type: "string",
          description: "The end date for filtering report data, formatted as YYYY-MM-DD. If not provided, defaults to the current date.",
        },
        startDate: {
          type: "string",
          description: "The start date for filtering report data, formatted as YYYY-MM-DD. If not provided, defaults to 2006-01-01.",
        },
        contactType: {
          type: "string",
          description: "The type of contact interaction to filter by. Allowed values: 'contactFirstTouch' (contacts whose first interaction was with this campaign), 'contactLastTouch' (contacts whose last interaction before a key event was with this campaign), 'influencedContacts' (all contacts who interacted with assets of this campaign).",
        },
        campaignGuid: {
          type: "string",
          description: "The unique identifier (UUID) of the campaign for which to fetch contact IDs.",
        },
      },
      required: [
        "campaignGuid",
        "contactType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "hubspot_get_deal",
    description: "Retrieves a HubSpot deal by its ID.",
    toolSlug: "HUBSPOT_GET_DEAL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dealId: {
          type: "string",
          description: "Unique HubSpot identifier for the deal to retrieve.",
        },
        archived: {
          type: "boolean",
          description: "Set to true to include only archived deals; defaults to false (active deals).",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Deal property names to include in the response; if omitted, all available properties are returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types (e.g., 'contacts', 'companies') for which to retrieve associated IDs.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names for which to include current and historical values in the response.",
        },
      },
      required: [
        "dealId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_get_deals",
    description: "Retrieves multiple HubSpot deals by their IDs in a single batch request.",
    toolSlug: "HUBSPOT_GET_DEALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the deal to retrieve.",
              },
            },
            description: "Request schema for individual deal retrieval.",
          },
          description: "List of deal identifiers to retrieve.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status.",
        },
        idProperty: {
          type: "string",
          description: "Alternate unique identifier property to use for retrieving deals.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Deal property names to include in the response. If not specified, only default properties will be returned. Common properties include: dealname, amount, dealstage, pipeline, closedate, hubspot_owner_id.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Deal property names for which to retrieve historical values. Leave empty if historical data is not needed.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_get_emails",
    description: "Retrieves multiple HubSpot email engagement records by their IDs in a single batch request.",
    toolSlug: "HUBSPOT_GET_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the email to retrieve.",
              },
            },
            description: "Request schema for individual email retrieval.",
          },
          description: "List of email identifiers to retrieve.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status.",
        },
        idProperty: {
          type: "string",
          description: "Alternate unique identifier property to use.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Email property names to include in the response.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Email property names for which to retrieve historical values. Leave empty if history is not needed.",
        },
      },
      required: [
        "inputs",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_get_event_template",
    description: "Retrieves detailed information about a specific event template for a given application in HubSpot's CRM timeline.",
    toolSlug: "HUBSPOT_GET_EVENT_TEMPLATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The ID of the target application for which the event template is being retrieved. This parameter is required and ensures the template lookup is specific to an app integration within HubSpot. The appId must be a valid, existing app ID in your HubSpot account.",
        },
        eventTemplateId: {
          type: "string",
          description: "The unique identifier of the event template. This ID is assigned by HubSpot when the template is created. It is required and must be a valid, existing template ID associated with the specified app.",
        },
      },
      required: [
        "eventTemplateId",
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "hubspot_get_import_record_information",
    description: "Retrieves a comprehensive summary of a specific HubSpot CRM import record by its `importId`, including status, progress, updates, results, and errors; useful for monitoring and troubleshooting data imports.",
    toolSlug: "HUBSPOT_GET_IMPORT_RECORD_INFORMATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        importId: {
          type: "integer",
          description: "The unique identifier for the import record to retrieve, typically obtained when an import is initiated or from a list of imports.",
        },
      },
      required: [
        "importId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "core",
    ],
  }),
  composioTool({
    name: "hubspot_get_marketing_email_draft",
    description: "Retrieves the draft version of a marketing email by its `emailId`; if no draft exists, returns the published version.",
    toolSlug: "HUBSPOT_GET_MARKETING_EMAIL_DRAFT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "The unique identifier of the marketing email. Used to fetch its draft version or, if unavailable, its published version.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing_emails",
    ],
  }),
  composioTool({
    name: "hubspot_get_marketing_email_revision",
    description: "Retrieves a specific, previously saved revision of a marketing email using its unique email ID and revision ID.",
    toolSlug: "HUBSPOT_GET_MARKETING_EMAIL_REVISION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "The unique identifier of the marketing email whose revision is to be fetched.",
        },
        revisionId: {
          type: "string",
          description: "The unique identifier of the specific revision of the marketing email to be retrieved.",
        },
      },
      required: [
        "emailId",
        "revisionId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing_emails",
    ],
  }),
  composioTool({
    name: "hubspot_get_marketing_email_revisions",
    description: "Retrieves a paginated list of all historical versions (including full state like content, settings, metadata) for a specified, existing marketing email; revision ID -1 identifies the current version.",
    toolSlug: "HUBSPOT_GET_MARKETING_EMAIL_REVISIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Cursor for the next page of results, typically from `paging.next.after` in a previous response.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of email revisions per page. The API defaults to 100 if this parameter is not provided.",
        },
        before: {
          type: "string",
          description: "Cursor for the previous page of results, typically from `paging.prev.before` in a previous response.",
        },
        emailId: {
          type: "string",
          description: "The unique identifier of the marketing email for which revisions are to be fetched.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing_emails",
    ],
  }),
  composioTool({
    name: "hubspot_get_pipeline_by_id",
    description: "Retrieves a specific pipeline by its ID and CRM object type, detailing its stages and properties.",
    toolSlug: "HUBSPOT_GET_PIPELINE_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The CRM object type for which the pipeline is being retrieved. Must be a valid HubSpot object type that supports pipelines.",
        },
        pipelineId: {
          type: "string",
          description: "Unique identifier of the pipeline to retrieve for the specified object type, typically a system-generated string or UUID.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "pipelines",
    ],
  }),
  composioTool({
    name: "hubspot_get_pipeline_stage_audit",
    description: "Retrieves a reverse chronological list of all mutations (changes) for a specific pipeline stage, including CREATE and UPDATE events with timestamps and details.",
    toolSlug: "HUBSPOT_GET_PIPELINE_STAGE_AUDIT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        stageId: {
          type: "string",
          description: "The unique identifier of the pipeline stage.",
        },
        objectType: {
          type: "string",
          description: "The CRM object type (e.g., 'deals', 'tickets') for the pipeline stage.",
        },
        pipelineId: {
          type: "string",
          description: "The unique identifier of the pipeline containing the stage.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
        "stageId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "pipeline_stage_audits",
    ],
  }),
  composioTool({
    name: "hubspot_get_product",
    description: "Retrieves a HubSpot product by its ID.",
    toolSlug: "HUBSPOT_GET_PRODUCT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Filter by archived status.",
        },
        productId: {
          type: "string",
          description: "Unique HubSpot identifier for the product to retrieve.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Product property names to include in the response.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types for which to retrieve associated IDs.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names for which to include historical values.",
        },
      },
      required: [
        "productId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_get_products",
    description: "Retrieves multiple HubSpot products by their IDs.",
    toolSlug: "HUBSPOT_GET_PRODUCTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the product to retrieve.",
              },
            },
            description: "Request schema for individual product retrieval.",
          },
          description: "List of product identifiers to retrieve.",
        },
        archived: {
          type: "boolean",
          description: "Whether to include archived products in the results. Set to true to retrieve only archived products, false (default) to retrieve only active products.",
        },
        idProperty: {
          type: "string",
          description: "Alternate unique identifier property to use.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Product property names to include in the response. Common properties include: name, price, description, hs_sku, hs_cost_of_goods_sold, hs_bundle_type, hs_pricing_model, hs_recurring_billing_period, hs_product_classification.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Product property names for which to retrieve historical values. Pass an empty array if historical data is not needed.",
        },
      },
      required: [
        "inputs",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_get_quote",
    description: "Retrieves a specific HubSpot quote by its unique identifier.",
    toolSlug: "HUBSPOT_GET_QUOTE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        quoteId: {
          type: "string",
          description: "Unique identifier of the quote; can be the HubSpot object ID or a custom unique property value if `idProperty` is specified.",
        },
        archived: {
          type: "boolean",
          description: "Specifies whether the quote to retrieve is archived (`True`) or active (`False`).",
        },
        idProperty: {
          type: "string",
          description: "Internal name of a unique custom property to use as the quote identifier instead of the HubSpot object ID; this property must have unique values across all quotes.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "HubSpot property internal names to include in the response; limits data returned and improves performance. Non-existent properties are ignored.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object type names (e.g., 'deals', 'contacts') for which to retrieve IDs of associated objects; fetches linked CRM object IDs. Non-existent association types are ignored.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "HubSpot property internal names for which to include historical values; retrieves change history. Non-existent properties or those without history are ignored.",
        },
      },
      required: [
        "quoteId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_get_segment_members",
    description: "Tool to retrieve segment (list) members ordered by join timestamp. Use when you need to page through list membership data.",
    toolSlug: "HUBSPOT_GET_SEGMENT_MEMBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Cursor token to fetch records after the last returned record; sorts ascending. Overrides `before` if both provided.",
        },
        limit: {
          type: "integer",
          description: "Number of records to return; default 100; maximum 250.",
        },
        before: {
          type: "string",
          description: "Cursor token to fetch records before the previously returned records; sorts descending.",
        },
        listId: {
          type: "string",
          description: "The ID of the list (segment) to retrieve members for.",
        },
      },
      required: [
        "listId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "list",
      "paging",
    ],
  }),
  composioTool({
    name: "hubspot_get_the_details_of_a_specified_marketing_email",
    description: "Retrieves detailed information for a specific marketing email in HubSpot using its unique email ID, optionally including performance statistics and specific properties.",
    toolSlug: "HUBSPOT_GET_THE_DETAILS_OF_A_SPECIFIED_MARKETING_EMAIL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "The unique identifier of the marketing email to retrieve.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status: `true` for archived, `false` for not archived. Omit to retrieve regardless of archived status.",
        },
        includeStats: {
          type: "boolean",
          description: "Whether to include performance statistics (e.g., open rates, click-through rates) with the email details.",
        },
        includedProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific marketing email property names to include in the response (e.g., \"name\", \"subject\", \"createdById\"). If omitted, a default set of properties is returned.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing_emails",
    ],
  }),
  composioTool({
    name: "hubspot_get_ticket",
    description: "Retrieves a HubSpot ticket by its ID.",
    toolSlug: "HUBSPOT_GET_TICKET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Filter by archived status.",
        },
        ticketId: {
          type: "string",
          description: "Unique HubSpot identifier for the ticket to retrieve.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Ticket property names to include in the response.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types for which to retrieve associated IDs.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names for which to include historical values.",
        },
      },
      required: [
        "ticketId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_get_tickets",
    description: "Retrieves multiple HubSpot tickets by their IDs.",
    toolSlug: "HUBSPOT_GET_TICKETS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the ticket to retrieve.",
              },
            },
            description: "Request schema for individual ticket retrieval.",
          },
          description: "List of ticket identifiers to retrieve.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status.",
        },
        idProperty: {
          type: "string",
          description: "Alternate unique identifier property to use.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Ticket property names to include in the response. Common properties: subject, content, hs_ticket_priority, hs_ticket_category, hs_pipeline_stage, createdate, hubspot_owner_id.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Ticket property names for which to retrieve historical values. Leave empty if you only need current values.",
        },
      },
      required: [
        "inputs",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_get_workflow_by_id",
    description: "Retrieves comprehensive details for an existing HubSpot workflow by its unique ID; unsupported actions are designated 'UNSUPPORTED_ACTION' in the response.",
    toolSlug: "HUBSPOT_GET_WORKFLOW_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique identifier of the HubSpot workflow to retrieve. This ID can be found by using the 'Get all workflows' action or from the URL when viewing a workflow in the HubSpot UI.",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "automation",
    ],
  }),
  composioTool({
    name: "hubspot_get_workflows",
    description: "Retrieves a list of workflow summaries (ID, name, type, status) from HubSpot, using the 'limit' parameter for pagination.",
    toolSlug: "HUBSPOT_GET_WORKFLOWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        limit: {
          type: "integer",
          description: "Maximum number of workflows to retrieve per API call, used for pagination.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "automation",
    ],
  }),
  composioTool({
    name: "hubspot_list_assets",
    description: "Lists assets of a specific `assetType` for a given HubSpot marketing `campaignGuid`, optionally including performance metrics for a date range.",
    toolSlug: "HUBSPOT_LIST_ASSETS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination cursor from 'paging.next.after' of a previous response; results will begin after this cursor.",
        },
        limit: {
          type: "string",
          description: "Maximum number of assets to return per response (positive integer).",
        },
        endDate: {
          type: "string",
          description: "End date (YYYY-MM-DD, inclusive) for asset performance metrics. Metrics are not fetched if `startDate` or `endDate` is missing/invalid.",
        },
        assetType: {
          type: "string",
          description: "The specific type of asset to retrieve (e.g., BLOG_POST, LANDING_PAGE); only one asset type per request.",
        },
        startDate: {
          type: "string",
          description: "Start date (YYYY-MM-DD, inclusive) for asset performance metrics. Metrics are not fetched if `startDate` or `endDate` is missing/invalid.",
        },
        campaignGuid: {
          type: "string",
          description: "Unique identifier (UUID) of an existing marketing campaign whose assets are to be listed.",
        },
      },
      required: [
        "campaignGuid",
        "assetType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "asset",
    ],
  }),
  composioTool({
    name: "hubspot_list_association_types",
    description: "Lists all valid association types between two specified HubSpot CRM object types.",
    toolSlug: "HUBSPOT_LIST_ASSOCIATION_TYPES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        toObjectType: {
          type: "string",
          description: "The type of the second object in the association (e.g., contact, company, deal).",
        },
        fromObjectType: {
          type: "string",
          description: "The type of the first object in the association (e.g., contact, company, deal).",
        },
      },
      required: [
        "fromObjectType",
        "toObjectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "types",
    ],
  }),
  composioTool({
    name: "hubspot_list_companies",
    description: "Retrieves a paginated list of HubSpot companies.",
    toolSlug: "HUBSPOT_LIST_COMPANIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from `paging.next.after` of a previous response, used to fetch the subsequent page. Omit for the first page.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of companies to return per page, controlling pagination size (default: 10).",
        },
        archived: {
          type: "boolean",
          description: "Boolean flag to filter companies by archived status: `true` returns only archived companies; `false` (default) returns only active companies.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of company property internal names to include in the response (e.g., 'name', 'domain'). If omitted, a default set of properties is returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of object types (e.g., 'contacts', 'deals') for which to retrieve associated IDs with each company.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property internal names for which to retrieve historical values (e.g., 'industry'). If no history exists for a property, only its current value is returned.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_contact_properties",
    description: "Lists all contact properties in your HubSpot account, including custom properties you've created. Use this action to discover: - Available property names for updating contacts - Custom properties specific to your HubSpot account - Property types and valid options for enumeration fields - Which properties are read-only vs writable",
    toolSlug: "HUBSPOT_LIST_CONTACT_PROPERTIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Whether to include archived properties. Set to true to see archived properties, false for active only.",
        },
        custom_only: {
          type: "boolean",
          description: "Filter to only return custom properties (excludes HubSpot default properties). Custom properties are ones you created in your HubSpot account.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "core",
    ],
  }),
  composioTool({
    name: "hubspot_list_contacts",
    description: "Retrieves a paginated list of HubSpot contacts.",
    toolSlug: "HUBSPOT_LIST_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from `paging.next.after` of a previous response, used to fetch the subsequent page. Omit for the first page. Empty strings will be treated as None.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of contacts to return per page, controlling pagination size (default: 10).",
        },
        archived: {
          type: "boolean",
          description: "Boolean flag to filter contacts by archived status: `true` returns only archived contacts; `false` (default) returns only active (non-archived) contacts.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of contact property internal names to include in the response (e.g., \"email\", \"firstname\"). If omitted, a default set of properties is returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of object types (e.g., \"companies\", \"deals\") for which to retrieve associated IDs with each contact.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property internal names for which to retrieve historical values (e.g., \"lifecyclestage\"). If no history exists for a property, only its current value is returned.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_deals",
    description: "Retrieves a paginated list of HubSpot deals.",
    toolSlug: "HUBSPOT_LIST_DEALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from previous response to fetch the subsequent page.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of deals to return per page (default: 10). Maximum is 100 normally, but when propertiesWithHistory is requested, the maximum is 50.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status: true for archived deals, false for active deals.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of deal property names to include in the response.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of object types for which to retrieve associated IDs.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names for which to retrieve historical values.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_emails",
    description: "Retrieves a paginated list of HubSpot emails, allowing selection of specific properties (with or without history), associated object IDs, and filtering by archive status.",
    toolSlug: "HUBSPOT_LIST_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Cursor for pagination; use `paging.next.after` from a previous response for the next page.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of email records per page.",
        },
        archived: {
          type: "boolean",
          description: "Set to `True` to retrieve only archived emails, `False` (default) for non-archived emails.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of valid HubSpot email property names to include. If a requested property doesn't exist on a record, it's omitted from that record's response.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of valid HubSpot CRM object types (e.g., 'contact', 'deal') for which to retrieve associated IDs. If an association type is invalid or doesn't exist for an email, it's ignored for that email.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of valid HubSpot email property names to retrieve with history. If a requested property doesn't exist, it's ignored.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_event_templates",
    description: "Retrieves all event templates associated with a valid `appId` for an existing application in HubSpot's CRM Timeline.",
    toolSlug: "HUBSPOT_LIST_EVENT_TEMPLATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique integer identifier for the target HubSpot application.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "hubspot_list_feedback_submissions",
    description: "Retrieves a paginated list of feedback submissions from HubSpot, allowing specification of properties (including history), associated object IDs, and filtering by archive status.",
    toolSlug: "HUBSPOT_LIST_FEEDBACK_SUBMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "The pagination token to retrieve the next page of results. This value is obtained from the `paging.next.after` field of a previous response. If omitted, the first page is returned. Use with `limit` for iterating through large sets of feedback submissions.",
        },
        limit: {
          type: "integer",
          description: "The maximum number of feedback submissions to return per page. Using smaller values can lead to quicker responses, while larger values reduce the total number of API calls for large datasets.",
        },
        archived: {
          type: "boolean",
          description: "Specifies whether to include archived feedback submissions. Set to `True` to retrieve only archived submissions. `False` (default) retrieves only active (non-archived) submissions. Useful for accessing historical or managing archived feedback.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of HubSpot internal property names to include for each feedback submission in the response (e.g., `hs_sentiment`, `hs_survey_name`, `hs_content`). If specified, only these properties are returned. If a property doesn't exist for a submission, it's ignored. If omitted, a default set of properties is returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of object types (e.g., `contact`, `survey`, `ticket`) for which to retrieve associated IDs. This allows fetching IDs of related objects. If an association doesn't exist for a submission, it's ignored.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of HubSpot internal property names for which to include historical values. The response includes both current and past values for these properties. Requesting history may affect the number of submissions returned per page due to increased response size.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_granted_scopes",
    description: "Tool to introspect the current OAuth access token and return its granted scopes and metadata. Use when you need to check which permissions are available before calling an endpoint (e.g., workflows, automation) to proactively detect missing scopes and provide clear remediation guidance.",
    toolSlug: "HUBSPOT_LIST_GRANTED_SCOPES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        include_token: {
          type: "boolean",
          description: "Whether to include the full access token in the response. Default is false to avoid exposing sensitive token values in logs.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_object_associations",
    description: "List all associations from a single CRM record to a specified target object type. Use when you need to expand associations for a single record without fetching the full CRM object.",
    toolSlug: "HUBSPOT_LIST_OBJECT_ASSOCIATIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Paging cursor token from a previous response to fetch the next page of results. Leave empty to start from the first page.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of associations to return per page. Default is 500.",
        },
        objectId: {
          type: "string",
          description: "The unique ID of the source CRM record whose associations you want to retrieve.",
        },
        objectType: {
          type: "string",
          description: "Source object type (e.g., 'deals', 'contacts', 'companies', 'tickets'). The object type of the record you want to list associations from.",
        },
        toObjectType: {
          type: "string",
          description: "Target object type (e.g., 'contacts', 'companies', 'deals'). The object type you want to see associations to.",
        },
      },
      required: [
        "objectType",
        "objectId",
        "toObjectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
      "paging",
    ],
  }),
  composioTool({
    name: "hubspot_list_products",
    description: "Retrieves a paginated list of HubSpot products.",
    toolSlug: "HUBSPOT_LIST_PRODUCTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from previous response. Must be a valid token or omitted entirely.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of products to return per page.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of product property names to include in the response.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of object types for which to retrieve associated IDs.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names for which to retrieve historical values.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_quotes",
    description: "Retrieves a paginated list of quotes, allowing selection of specific properties, property history, associated object IDs, and filtering by archived status.",
    toolSlug: "HUBSPOT_LIST_QUOTES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from a previous response's `paging.next.after` property to fetch the subsequent page. Use the exact token provided by the API; do not modify it.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of quotes to return per page.",
        },
        archived: {
          type: "boolean",
          description: "If true, returns only archived quotes. If false, returns only active (non-archived) quotes.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of quote property names to include in the response for each quote (e.g., `hs_title`, `hs_quote_amount`). Non-existent properties for a quote are ignored. If omitted, a default set of properties is returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of object types (e.g., `contacts`, `companies`, `deals`) for which to retrieve IDs of associated records. Non-existent association types or associations for a specific quote are ignored.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of quote property names for which historical values should be included (e.g., `hs_quote_amount`, `hs_expiration_date`). Using this may reduce the maximum number of quotes returnable per request due to increased data volume.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_list_tickets",
    description: "Retrieves a paginated list of HubSpot tickets.",
    toolSlug: "HUBSPOT_LIST_TICKETS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from previous response.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of tickets to return per page.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archived status.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of ticket property names to include in the response.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of object types for which to retrieve associated IDs.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names for which to retrieve historical values.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_merge_companies",
    description: "Merges two existing company records of the same type in HubSpot CRM, where `objectIdToMerge` is absorbed into `primaryObjectId`; this operation is irreversible.",
    toolSlug: "HUBSPOT_MERGE_COMPANIES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The ID of the company record that will be merged into the primary company record and subsequently deleted.",
        },
        primaryObjectId: {
          type: "string",
          description: "The ID of the company record that will remain as the primary record after the merge, absorbing the information from the other company.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge two companies of same type.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_contacts",
    description: "Merges two HubSpot contacts into one.",
    toolSlug: "HUBSPOT_MERGE_CONTACTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The ID of the contact record that will be merged into the primary contact record. This contact will be deleted after the merge.",
        },
        primaryObjectId: {
          type: "string",
          description: "The ID of the contact record that will remain after the merge and will absorb the information from the contact specified by `objectIdToMerge`. The merged contact will retain this ID.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge contacts.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_deals",
    description: "Merges two HubSpot deals into one.",
    toolSlug: "HUBSPOT_MERGE_DEALS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The ID of the deal that will be merged into the primary deal.",
        },
        primaryObjectId: {
          type: "string",
          description: "The ID of the deal that will remain after the merge.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge deals.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_emails",
    description: "Merges two HubSpot emails into one.",
    toolSlug: "HUBSPOT_MERGE_EMAILS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The ID of the email that will be merged into the primary email.",
        },
        primaryObjectId: {
          type: "string",
          description: "The ID of the email that will remain after the merge.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge emails.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_feedback_submissions",
    description: "Merges two existing feedback submissions by ID, primarily for consolidating duplicates or related feedback; this operation is irreversible, and `primaryObjectId` values take precedence in conflicts.",
    toolSlug: "HUBSPOT_MERGE_FEEDBACK_SUBMISSIONS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The unique identifier of the feedback submission to be merged into the primary one. This submission will be absorbed and typically archived or deleted after the merge process.",
        },
        primaryObjectId: {
          type: "string",
          description: "The unique identifier of the feedback submission that will remain as the primary record after the merge. It will contain the combined information from both submissions.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge two feedback submissions.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_line_items",
    description: "Merges two line items, `objectIdToMerge` into `primaryObjectId`, which must be of the same type; `objectIdToMerge` is absorbed and the operation is irreversible.",
    toolSlug: "HUBSPOT_MERGE_LINE_ITEMS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The ID of the line item that will be merged into the primary line item. This line item will be absorbed and will no longer exist as a separate entity after the merge.",
        },
        primaryObjectId: {
          type: "string",
          description: "The ID of the primary line item that will remain after the merge. Its record will be updated with data from the line item specified by `objectIdToMerge`.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge two line items of same type.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_objects",
    description: "Merges two distinct HubSpot CRM objects of the same `objectType`, consolidating data into `primaryObjectId` (which is preserved) and deleting `objectIdToMerge`; this operation is permanent and irreversible.",
    toolSlug: "HUBSPOT_MERGE_OBJECTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The CRM object type (e.g., 'contacts', 'companies') of the two records to merge. Must be a valid object type in your HubSpot account.",
        },
        objectIdToMerge: {
          type: "string",
          description: "ID of the object to be merged into the primary object and subsequently deleted.",
        },
        primaryObjectId: {
          type: "string",
          description: "ID of the object that will remain after the merge, into which data from `objectIdToMerge` is consolidated.",
        },
      },
      required: [
        "objectType",
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge two objects of same type.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_products",
    description: "Merges two HubSpot products into one.",
    toolSlug: "HUBSPOT_MERGE_PRODUCTS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The ID of the product that will be merged into the primary product.",
        },
        primaryObjectId: {
          type: "string",
          description: "The ID of the product that will remain after the merge.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge products.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_quotes",
    description: "Merges two distinct quotes of the same type by consolidating `objectIdToMerge` into `primaryObjectId` (e.g., for combining information or updating terms); this operation is irreversible.",
    toolSlug: "HUBSPOT_MERGE_QUOTES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The unique identifier of the quote to be merged into the primary quote. This quote will be archived after the merge.",
        },
        primaryObjectId: {
          type: "string",
          description: "The unique identifier of the quote that will remain after the merge and will be updated with information from the other quote. Its properties take precedence in case of conflicts.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge two quotes of same type.",
    ],
  }),
  composioTool({
    name: "hubspot_merge_tickets",
    description: "Merges two HubSpot tickets into one.",
    toolSlug: "HUBSPOT_MERGE_TICKETS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectIdToMerge: {
          type: "string",
          description: "The ID of the ticket that will be merged into the primary ticket.",
        },
        primaryObjectId: {
          type: "string",
          description: "The ID of the ticket that will remain after the merge.",
        },
      },
      required: [
        "objectIdToMerge",
        "primaryObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "public_object",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge tickets.",
    ],
  }),
  composioTool({
    name: "hubspot_partially_update_crm_object_by_id",
    description: "Partially updates specified properties of a CRM object (e.g., contact, company, deal) identified by its type and ID, or optionally by a unique property value if `idProperty` is specified.",
    toolSlug: "HUBSPOT_PARTIALLY_UPDATE_CRM_OBJECT_BY_ID",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectId: {
          type: "string",
          description: "Unique identifier of the CRM object. Can be provided as a string, integer, or float. If `idProperty` is specified, this is the value of that unique property; otherwise, it's the internal object ID.",
        },
        idProperty: {
          type: "string",
          description: "Name of a unique property (e.g., 'email' for contacts) to use for identifying the object instead of its internal ID. If set, `objectId` should be the value of this property.",
        },
        objectType: {
          type: "string",
          description: "Type of the CRM object to be updated.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of properties to update. Keys are internal property names (e.g., 'firstname', 'dealstage'), and values are their new values. Some properties are enum fields with specific valid values: For 'deals', the 'dealstage' property requires a valid pipeline stage ID from the deal's pipeline (use HUBSPOT_RETRIEVE_PIPELINE_STAGES to get valid stage IDs for a pipeline). For 'tickets', the 'hs_pipeline_stage' property requires a valid ticket pipeline stage ID. For other enum properties, use HUBSPOT_READ_A_CRM_PROPERTY_BY_NAME to discover valid options.",
        },
      },
      required: [
        "objectType",
        "objectId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Partially update CRM object by ID.",
    ],
  }),
  composioTool({
    name: "hubspot_permanently_delete_contact_via_gdpr",
    description: "Permanently deletes a HubSpot contact and all its associated data for GDPR compliance, identifying the contact by its ID or another unique property.",
    toolSlug: "HUBSPOT_PERMANENTLY_DELETE_CONTACT_VIA_GDPR",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectId: {
          type: "string",
          description: "The unique identifier of the contact to be permanently deleted. This could be the contact's HubSpot ID or another unique property value (e.g., email address) if `idProperty` is specified.",
        },
        idProperty: {
          type: "string",
          description: "The name of the property that contains the unique identifier of the contact specified in `objectId`. For example, if `objectId` is an email address, set this to 'email'. If `objectId` is the HubSpot contact ID, this field can be omitted (or set to None).",
        },
        objectType: {
          type: "string",
          description: "The type of HubSpot object to be deleted. Must be 'contacts' for this GDPR deletion endpoint. This parameter is part of the URL path.",
        },
      },
      required: [
        "objectType",
        "objectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "gdpr",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Permanently delete contact via GDPR.",
    ],
  }),
  composioTool({
    name: "hubspot_publish_marketing_email",
    description: "Publishes or sends a specified HubSpot marketing email that is valid and ready for sending; requires Marketing Hub Enterprise or the transactional email add-on.",
    toolSlug: "HUBSPOT_PUBLISH_MARKETING_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        email_id: {
          type: "string",
          description: "Identifier of the HubSpot marketing email to publish or send.",
        },
      },
      required: [
        "email_id",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "emails",
      "marketing",
    ],
    askBefore: [
      "Confirm the parameters before executing Publish or send a marketing email.",
    ],
  }),
  composioTool({
    name: "hubspot_read_a_crm_property_by_name",
    description: "Reads a specific CRM property definition for a given HubSpot object type by its internal name.",
    toolSlug: "HUBSPOT_READ_A_CRM_PROPERTY_BY_NAME",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "If true, retrieves an archived property definition; retrieves active property definitions by default.",
        },
        objectType: {
          type: "string",
          description: "Specifies the CRM object type (e.g., 'contacts', 'deals') for which the property is retrieved.",
        },
        properties: {
          type: "string",
          description: "Optional comma-separated list of additional property attributes to return; consult HubSpot API documentation for available attributes and format.",
        },
        propertyName: {
          type: "string",
          description: "The internal, unique name of the property to retrieve (e.g., 'firstname', 'dealname').",
        },
      },
      required: [
        "objectType",
        "propertyName",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "core",
    ],
  }),
  composioTool({
    name: "hubspot_read_all_properties_for_object_type",
    description: "Retrieves definitions and metadata (not actual values) for properties of a specified HubSpot CRM object type (e.g., 'contacts', 'companies', 'deals', or custom objects).",
    toolSlug: "HUBSPOT_READ_ALL_PROPERTIES_FOR_OBJECT_TYPE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Filter properties by their archived status: `true` for archived, `false` for active (non-archived).",
        },
        objectType: {
          type: "string",
          description: "Identifier for the CRM object type (e.g., 'contacts', 'companies'). Must be a valid, case-sensitive object type name existing in HubSpot.",
        },
        properties: {
          type: "string",
          description: "DEPRECATED/NON-FUNCTIONAL: This parameter appears in the API but does not work as expected. When provided, the API returns empty property objects instead of filtered results. Leave this parameter unset (None) to retrieve all properties.",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "core",
    ],
  }),
  composioTool({
    name: "hubspot_read_apage_of_objects_by_type",
    description: "Retrieves a paginated list of objects for a specified and valid HubSpot CRM object type (e.g., 'contacts', 'companies', 'deals', or custom ID).",
    toolSlug: "HUBSPOT_READ_APAGE_OF_OBJECTS_BY_TYPE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from a previous response's `paging.next.after` property, used to fetch the next page of results.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of results to return per page (must be an integer between 1 and 100).",
        },
        archived: {
          type: "boolean",
          description: "Set to true to retrieve only archived objects. If false or omitted (default), non-archived objects are returned.",
        },
        objectType: {
          type: "string",
          description: "Identifier for the type of CRM object to retrieve (e.g., 'contacts', 'companies', 'deals', or a custom object type ID).",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names to include for each object; non-existent properties on an object are ignored. Customizes response and can reduce payload size.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of object types (e.g., 'companies', 'deals') for which to retrieve associated IDs. Only existing associations are returned.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names for which to include historical values. Using this parameter may reduce the maximum number of objects returnable in a single request.",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_read_associations_batch",
    description: "Tool to batch-read CRM associations (e.g., deals→contacts, deals→companies) for up to 1,000 source record IDs in one request. Use when you need to retrieve associated target IDs and association type metadata for multiple records efficiently, avoiding rate-limit issues from per-record GET calls.",
    toolSlug: "HUBSPOT_READ_ASSOCIATIONS_BATCH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Source record ID to retrieve associations for.",
              },
              after: {
                type: "string",
                description: "Per-source pagination cursor for retrieving next page of associations when a source has more than the page limit. Returned from previous response for this source record.",
              },
            },
            description: "Individual source record for batch association read.",
          },
          description: "List of source record IDs to retrieve associations for (max 1,000 per request). Each input can include an optional 'after' cursor for per-source pagination.",
        },
        toObjectType: {
          type: "string",
          description: "Target object type for associations. Use standard names (e.g., 'contacts', 'companies', 'deals') or object type IDs (e.g., '0-1' for contacts). For custom objects, use their objectTypeId.",
        },
        fromObjectType: {
          type: "string",
          description: "Source object type for associations. Use standard names (e.g., 'deals', 'contacts', 'companies', 'tickets') or object type IDs (e.g., '0-3' for deals). For custom objects, use their objectTypeId (e.g., '2-12345').",
        },
      },
      required: [
        "fromObjectType",
        "toObjectType",
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_read_batch_crm_object_properties",
    description: "Retrieves property definitions (metadata) for a batch of CRM object properties for a specified object type. Returns detailed information about property structure, data types, options, and configuration—not the actual property values of CRM records.",
    toolSlug: "HUBSPOT_READ_BATCH_CRM_OBJECT_PROPERTIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "The programmatic name of the CRM object property whose definition is to be retrieved.",
              },
            },
            description: "Specifies an individual property for a batch read operation.",
          },
          description: "A list of property identifiers, each specifying the 'name' of a property whose definition should be retrieved for the given `objectType`.",
        },
        archived: {
          type: "boolean",
          description: "If true, retrieves only archived property definitions; otherwise, retrieves non-archived definitions.",
        },
        objectType: {
          type: "string",
          description: "The case-sensitive CRM object type (e.g., 'contacts', 'companies') for which properties are being read, matching the type in your HubSpot account.",
        },
        dataSensitivity: {
          type: "string",
          description: "Optional filter to retrieve only properties with a specific data sensitivity level. Valid values: 'highly_sensitive', 'sensitive', 'non_sensitive'.",
        },
      },
      required: [
        "objectType",
        "archived",
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_read_batch_feedback_submissions_by_id_or_property",
    description: "Retrieves up to 100 feedback submissions in a batch using their IDs or a specified unique `idProperty`, optionally including specified properties and their history.",
    toolSlug: "HUBSPOT_READ_BATCH_FEEDBACK_SUBMISSIONS_BY_ID_OR_PROPERTY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the feedback submission.",
              },
            },
            description: "Identifies an individual feedback submission in a batch operation.",
          },
          description: "Identifiers for feedback submissions to retrieve, using primary 'id' or `idProperty`.",
        },
        archived: {
          type: "boolean",
          description: "Set to `true` to retrieve only archived submissions; `false` (default) for active submissions.",
        },
        idProperty: {
          type: "string",
          description: "Unique identifier property name to use instead of 'id'; `inputs` should contain values for this property if provided.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names to return for each feedback submission; defaults if not specified.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names for which to retrieve historical values; past values are included if updated.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_read_batch_of_crm_objects_by_id_or_property_values",
    description: "Reads a batch of CRM objects of a specified `objectType` using their HubSpot IDs or unique property values from the `inputs` list, allowing retrieval of specific `properties`, their historical values (`propertiesWithHistory`), and filtering by `archived` status.",
    toolSlug: "HUBSPOT_READ_BATCH_OF_CRM_OBJECTS_BY_ID_OR_PROPERTY_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Unique identifier of the CRM object, corresponding to `idProperty` if set, or the default object ID.",
              },
            },
            description: "Identifies an individual CRM object to be read in a batch.",
          },
          description: "List of objects, each with an 'id' identifying a CRM object to retrieve, using the HubSpot object ID or the value of `idProperty`.",
        },
        archived: {
          type: "boolean",
          description: "If true, retrieves only archived CRM objects; if false (default), retrieves non-archived objects.",
        },
        idProperty: {
          type: "string",
          description: "Alternate unique identifier property name (e.g., 'email' for contacts) to use instead of the default object ID.",
        },
        objectType: {
          type: "string",
          description: "Type of CRM object to read (e.g., 'contacts', 'companies'). Determines which object collection to query.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names to return for each CRM object. If omitted, default properties are returned.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names for which to retrieve historical values.",
        },
      },
      required: [
        "objectType",
        "propertiesWithHistory",
        "inputs",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_read_batch_of_line_items_by_id_or_property_values",
    description: "Retrieves a batch of HubSpot CRM line items by their IDs, or optionally by values of a custom unique property defined in `idProperty`.",
    toolSlug: "HUBSPOT_READ_BATCH_OF_LINE_ITEMS_BY_ID_OR_PROPERTY_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Identifier for the line item to retrieve. This can be the line item's unique ID or a value of the property specified in `idProperty`.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "A list of objects, where each object contains the 'id' of a line item to retrieve. The 'id' can be the line item's unique ID or the value of the property specified in `idProperty`.",
        },
        archived: {
          type: "boolean",
          description: "Whether to return only archived line items. If true, returns only archived line items; if false (default), returns only non-archived line items.",
        },
        idProperty: {
          type: "string",
          description: "The name of a property whose values are unique for that object type. Use this if you want to identify line items by a custom unique property instead of the default 'id'.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of property names to be returned in the response. If not specified, all readable properties will be returned.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of property names for which to return historical values; if a property has been updated, the response includes its previous values.",
        },
      },
      required: [
        "propertiesWithHistory",
        "inputs",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_read_batch_of_quotes_by_property_values",
    description: "Efficiently retrieves a batch of HubSpot CRM quotes by their IDs (or a specified unique property), optionally including archived quotes, specific properties, and property history.",
    toolSlug: "HUBSPOT_READ_BATCH_OF_QUOTES_BY_PROPERTY_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the quote to retrieve. This ID corresponds to the value of the property specified in `idProperty` in the main request, or the quote's primary object ID if `idProperty` is not specified.",
              },
            },
            description: "Request schema for identifying individual quotes in a batch operation.",
          },
          description: "A list of objects, each specifying a quote to retrieve. Each object must contain an `id` field that holds the identifier of the quote, corresponding to `idProperty` or the primary object ID.",
        },
        archived: {
          type: "boolean",
          description: "Specifies whether to include archived quotes in the results. If `true`, only archived quotes are returned. If `false` (default) or omitted, only active (non-archived) quotes are returned.",
        },
        idProperty: {
          type: "string",
          description: "The name of the property to use as the unique identifier for the quotes specified in the `inputs` list. If omitted, the quote's primary object ID (e.g., `hs_object_id`) is used. This property must be a unique identifier for quotes.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of internal names of quote properties to be included in the response for each quote. If omitted, a default set of properties is returned by HubSpot. Refer to HubSpot documentation for default properties.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of internal names of quote properties for which historical values should be retrieved. The response will include the history of changes for these properties.",
        },
      },
      required: [
        "propertiesWithHistory",
        "inputs",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_read_budget",
    description: "Fetches detailed budget (total, spent, remaining) and spend information for a marketing campaign, including an 'order' field for sequencing budget/spend items (0 is oldest).",
    toolSlug: "HUBSPOT_READ_BUDGET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaignGuid: {
          type: "string",
          description: "The unique identifier (UUID) of the marketing campaign for which to retrieve budget information.",
        },
      },
      required: [
        "campaignGuid",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "budget",
    ],
  }),
  composioTool({
    name: "hubspot_read_contact",
    description: "Retrieves a HubSpot contact by its ID.",
    toolSlug: "HUBSPOT_READ_CONTACT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Set to true to include only archived contacts; defaults to false (active contacts).",
        },
        contactId: {
          type: "string",
          description: "Unique internal HubSpot CRM object ID for the contact, which must be valid and existing.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact property names to include in the response; if omitted, all available properties are returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types (e.g., 'companies', 'deals') to include associated object IDs in the response.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names for which to include current and historical values in the response.",
        },
      },
      required: [
        "contactId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_read_contacts",
    description: "Batch read multiple HubSpot contacts by their IDs or custom identifier property. This action retrieves up to 100 contacts per request using the HubSpot CRM batch read API. You can specify which contact properties to return and optionally include historical values for properties.",
    toolSlug: "HUBSPOT_READ_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the contact to retrieve.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "A list of contact identifiers to retrieve. Each object in the list should contain an `id` (or the `idProperty` if specified) of a contact.",
        },
        archived: {
          type: "boolean",
          description: "Specifies if only archived contacts should be returned (`true`), or only non-archived contacts (`false`).",
        },
        idProperty: {
          type: "string",
          description: "The name of an alternate unique identifier property to use for retrieving contacts. If specified, the `inputs` objects should provide values for this property instead of the default `id`.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact property names to include in the response. Optional - a default set is returned if unspecified.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Contact property names for which to retrieve historical values. Optional - omit if history is not needed.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "batch",
    ],
  }),
  composioTool({
    name: "hubspot_read_crm_object_by_id",
    description: "Retrieves a specific CRM object (e.g., contact, company, deal, ticket) by its ID or a unique property, optionally including specific properties, history, and associations.",
    toolSlug: "HUBSPOT_READ_CRM_OBJECT_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Set to `true` to retrieve only archived objects. Defaults to `false` (non-archived objects).",
        },
        objectId: {
          type: "string",
          description: "The unique identifier of the CRM object, or the value of the unique property if `idProperty` is specified. Accepts both string and numeric values (numeric IDs are converted to strings automatically).",
        },
        idProperty: {
          type: "string",
          description: "The name of a unique property (e.g., 'email' for contacts, 'domain' for companies) to use for lookup instead of the internal object ID. If omitted, the internal object ID is used.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object to retrieve. Valid standard object types are: 'contacts', 'companies', 'deals', 'tickets', 'line_items', 'products', 'quotes', 'calls', 'emails', 'meetings', 'notes', 'tasks', 'postal_mail', 'communications', 'feedback_submissions', 'goals', 'leads', 'invoices', 'subscriptions', 'orders', 'payments', 'carts', 'appointments', 'courses', 'listings', 'services', 'users'. You can also use numeric object type IDs (e.g., '0-1' for contacts, '0-2' for companies, '0-3' for deals, '0-5' for tickets). For custom objects, use 'p_{internal_name}' format or the objectTypeId (e.g., '2-12345'). Note: 'owners' is NOT a valid object type - use the dedicated Owners API instead.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of property names to include in the response. Non-existent properties are ignored. If omitted, a default set of properties is returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of object types (e.g., 'contacts', 'companies') for which to retrieve associated IDs (e.g., to get associated companies for a contact). Non-existent associations are ignored.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of property names to retrieve value history for, showing changes over time. Non-existent properties or those without history are ignored.",
        },
      },
      required: [
        "objectType",
        "objectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_read_email",
    description: "Call this to retrieve an existing HubSpot email by its `emailId` or an alternative unique `idProperty`.",
    toolSlug: "HUBSPOT_READ_EMAIL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "The unique identifier (HubSpot ID) of the email object to retrieve, or the value of the `idProperty` if specified.",
        },
        archived: {
          type: "boolean",
          description: "Set to true to retrieve only archived email objects.",
        },
        idProperty: {
          type: "string",
          description: "Name of an alternative unique property to identify the email if not using `emailId`.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific email properties to include; non-existent properties are ignored.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types (e.g., 'contact', 'company') for associated IDs; non-existent associations are ignored.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Email properties for which to retrieve historical values; non-existent properties are ignored.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_read_feedback_submission_by_id",
    description: "Reads a HubSpot feedback submission by its ID, optionally using a custom unique 'idProperty', and allows specifying properties to return including history and associations.",
    toolSlug: "HUBSPOT_READ_FEEDBACK_SUBMISSION_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Set to true to retrieve only archived submissions; false (default) retrieves active ones.",
        },
        idProperty: {
          type: "string",
          description: "Name of a unique property (e.g., 'survey_response_id') to use as the identifier instead of the internal object ID. Its values must be unique.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific feedback submission property names to include in the response; HubSpot ignores non-existent ones.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types (e.g., 'CONTACT') for which to retrieve associated IDs; HubSpot ignores non-existent associations.",
        },
        feedbackSubmissionId: {
          type: "string",
          description: "Identifier of the feedback submission to retrieve; use a custom property value if 'idProperty' is set. Must be an existing submission.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Feedback submission property names for which to include a history of values; HubSpot ignores non-existent ones.",
        },
      },
      required: [
        "feedbackSubmissionId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_read_property_group",
    description: "Retrieves metadata for a specific property group of a given CRM object type, detailing its structure and attributes, but not the actual property values of CRM objects.",
    toolSlug: "HUBSPOT_READ_PROPERTY_GROUP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        groupName: {
          type: "string",
          description: "Unique identifier (name) of the property group to retrieve. These names are case-sensitive and often use lowercase letters and underscores.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object for which to retrieve the property group.",
        },
      },
      required: [
        "objectType",
        "groupName",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "groups",
    ],
  }),
  composioTool({
    name: "hubspot_read_property_groups_for_object_type",
    description: "Retrieves all property groups in a single call for a specified HubSpot CRM object type (e.g., 'contacts', 'companies'), returning only the groups themselves, not the individual properties within them.",
    toolSlug: "HUBSPOT_READ_PROPERTY_GROUPS_FOR_OBJECT_TYPE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "Specifies the HubSpot CRM object type for which property groups will be retrieved.",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "groups",
    ],
  }),
  composioTool({
    name: "hubspot_remove_asset_association",
    description: "Disassociates an asset from a HubSpot marketing campaign. Supports a wide range of asset types including forms, landing pages, emails, blog posts, workflows, static lists, and more.",
    toolSlug: "HUBSPOT_REMOVE_ASSET_ASSOCIATION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        assetId: {
          type: "string",
          description: "The unique identifier of the asset.",
        },
        assetType: {
          type: "string",
          description: "The category/type of asset to disassociate from the campaign. Supported types include: AD_CAMPAIGN, BLOG_POST, CALL, CASE_STUDY, CTA, CTA_LEGACY, EXTERNAL_WEB_URL, FEEDBACK_SURVEY, FORM, FILE, KNOWLEDGE_BASE_ARTICLE, LANDING_PAGE, MARKETING_EMAIL, MARKETING_EVENT, MEETING_EVENT, PLAYBOOK, PODCAST_EPISODE, SALES_DOCUMENT, SALES_EMAIL, SEQUENCE, MARKETING_SMS, SOCIAL_POST, OBJECT_LIST (static lists), VIDEO, WEBSITE_PAGE, AUTOMATION_PLATFORM_FLOW (workflows), and others.",
        },
        campaignGuid: {
          type: "string",
          description: "The unique identifier (UUID) of the HubSpot campaign.",
        },
      },
      required: [
        "campaignGuid",
        "assetType",
        "assetId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "asset",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove asset association.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_remove_association",
    description: "Tool to remove all associations between two CRM records using the v4 associations endpoint. Use when unlinking records or cleaning up incorrect associations.",
    toolSlug: "HUBSPOT_REMOVE_ASSOCIATION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectId: {
          type: "string",
          description: "ID of the source CRM record.",
        },
        objectType: {
          type: "string",
          description: "Source object type (e.g., 'contacts', 'deals', 'companies', 'tickets').",
        },
        toObjectId: {
          type: "string",
          description: "ID of the target CRM record.",
        },
        toObjectType: {
          type: "string",
          description: "Target object type (e.g., 'companies', 'contacts', 'deals', 'tickets').",
        },
      },
      required: [
        "objectType",
        "objectId",
        "toObjectType",
        "toObjectId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "associations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove association between CRM records.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_remove_association_from_schema",
    description: "Permanently removes a specified association definition (type) from a HubSpot object's schema, preventing future creations of this association type without affecting existing instances.",
    toolSlug: "HUBSPOT_REMOVE_ASSOCIATION_FROM_SCHEMA",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The fully qualified name or ID of the HubSpot object schema from which to remove the association definition.",
        },
        associationIdentifier: {
          type: "string",
          description: "The unique ID of the association definition to remove from the specified object schema.",
        },
      },
      required: [
        "objectType",
        "associationIdentifier",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove association from schema.",
    ],
  }),
  composioTool({
    name: "hubspot_remove_deal",
    description: "Removes a HubSpot deal by its ID.",
    toolSlug: "HUBSPOT_REMOVE_DEAL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dealId: {
          type: "string",
          description: "Unique HubSpot identifier for the deal to be removed.",
        },
      },
      required: [
        "dealId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove deal.",
    ],
  }),
  composioTool({
    name: "hubspot_remove_token_from_event_template",
    description: "Removes a token from a HubSpot event template, preventing its inclusion in new events created from that template.",
    toolSlug: "HUBSPOT_REMOVE_TOKEN_FROM_EVENT_TEMPLATE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique identifier of the target application associated with the event template. Must be a valid integer representing the ID of your HubSpot app.",
        },
        tokenName: {
          type: "string",
          description: "The name of the token to be removed from the event template. Must be a string that exactly matches an existing token's name within the specified template (case-sensitive).",
        },
        eventTemplateId: {
          type: "string",
          description: "The unique identifier of the event template from which the token will be removed. Must be a valid string representing an existing event template ID in your HubSpot account.",
        },
      },
      required: [
        "eventTemplateId",
        "tokenName",
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "tokens",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove token from event template.",
    ],
  }),
  composioTool({
    name: "hubspot_render_event_detail_template",
    description: "Renders detailed information for a specific HubSpot CRM timeline event using a predefined event template, ignoring `extraData` references in the template not present in event data.",
    toolSlug: "HUBSPOT_RENDER_EVENT_DETAIL_TEMPLATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        eventId: {
          type: "string",
          description: "The unique ID for a specific HubSpot CRM timeline event to render.",
        },
        eventTemplateId: {
          type: "string",
          description: "The unique ID for an existing HubSpot event template to use for rendering.",
        },
      },
      required: [
        "eventTemplateId",
        "eventId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "hubspot_render_event_header_or_detail_as_html",
    description: "Renders an event's header or detail template as HTML for a specified event on the HubSpot CRM timeline, using a given event template ID and event ID.",
    toolSlug: "HUBSPOT_RENDER_EVENT_HEADER_OR_DETAIL_AS_HTML",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        detail: {
          type: "boolean",
          description: "If true, renders the detailTemplate; if false or not provided, renders the headerTemplate.",
        },
        eventId: {
          type: "string",
          description: "The unique identifier for an existing event on the HubSpot timeline whose data will be used in the rendering.",
        },
        eventTemplateId: {
          type: "string",
          description: "The unique identifier for an existing event template to be used for rendering.",
        },
      },
      required: [
        "eventTemplateId",
        "eventId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "hubspot_replace_all_properties_of_pipeline",
    description: "Overwrites an entire CRM pipeline (specified by `objectType` and `pipelineId`) and all its stages with a new definition, returning the updated pipeline.",
    toolSlug: "HUBSPOT_REPLACE_ALL_PROPERTIES_OF_PIPELINE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "Unique label for this pipeline, for UI organization.",
        },
        stages: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              label: {
                type: "string",
                description: "Unique label for this stage within the pipeline, for UI organization.",
              },
              metadata: {
                type: "object",
                additionalProperties: true,
                description: "Stage-specific metadata, varying by pipeline type. For 'deals' pipelines, include 'probability' (e.g., `{'probability': 0.5}` for likelihood a deal will close, 0.0-1.0 in 0.1 increments). For 'tickets' pipelines, 'ticketState' (e.g., `{'ticketState': 'OPEN'}`) is optional, indicating if the ticket is 'OPEN' or 'CLOSED'.",
              },
              displayOrder: {
                type: "integer",
                description: "Display order for this stage; stages with the same order are sorted alphabetically by `label`.",
              },
            },
            description: "Defines an individual stage within a pipeline.",
          },
          description: "A list of stage definitions that will completely replace all existing stages in the pipeline.",
        },
        objectType: {
          type: "string",
          description: "Identifies the CRM object type (e.g., 'deals', 'tickets') for the pipeline being updated.",
        },
        pipelineId: {
          type: "string",
          description: "Unique ID of the pipeline to update, specific to its `objectType`.",
        },
        displayOrder: {
          type: "integer",
          description: "Display order for this pipeline; those with the same order are sorted alphabetically by `label`.",
        },
        validateReferencesBeforeDelete: {
          type: "boolean",
          description: "If true, validates existing references to the pipeline before updating to prevent issues from modifying referenced stages.",
        },
        validateDealStageUsagesBeforeDelete: {
          type: "boolean",
          description: "If true and `objectType` is 'deals', checks deal stage usage before modification/deletion to prevent data issues.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
        "displayOrder",
        "stages",
        "label",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipelines",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Replace all properties of pipeline.",
    ],
  }),
  composioTool({
    name: "hubspot_replace_pipeline_stage_properties",
    description: "Replaces all properties of a specified pipeline stage; the new `label` must be unique within the pipeline, and if `objectType` is 'deals', the `metadata` must include a 'probability' key.",
    toolSlug: "HUBSPOT_REPLACE_PIPELINE_STAGE_PROPERTIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "A new label for the pipeline stage.",
        },
        stageId: {
          type: "string",
          description: "Unique identifier of the specific pipeline stage to be updated, assigned by HubSpot and unique to the stage within its pipeline.",
        },
        metadata: {
          type: "object",
          additionalProperties: true,
          description: "Key-value pairs for custom stage properties; all values must be strings. For 'deals' `objectType`, 'probability' (string: number from 0.0-1.0 in 0.1 increments, e.g., '0.5') is required. For 'tickets' `objectType`, 'ticketState' (string: 'OPEN' or 'CLOSED') is optional.",
        },
        objectType: {
          type: "string",
          description: "The CRM object type associated with the pipeline (e.g., 'deals' for sales pipelines, 'tickets' for support pipelines).",
        },
        pipelineId: {
          type: "string",
          description: "Unique identifier of the pipeline, assigned by HubSpot when the pipeline is created.",
        },
        displayOrder: {
          type: "integer",
          description: "The display order for this pipeline stage. Stages with the same `displayOrder` value are sorted alphabetically by their label. Use -1 to place the stage at the end.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
        "stageId",
        "metadata",
        "displayOrder",
        "label",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipeline_stages",
    ],
    askBefore: [
      "Confirm the parameters before executing Replace pipeline stage properties.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_reset_draft",
    description: "Resets a marketing email's draft to its currently published (live) version, discarding all unpublished changes; the email must have a live version to revert to.",
    toolSlug: "HUBSPOT_RESET_DRAFT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "Identifier of the marketing email whose draft will be reset to its currently published (live) version.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing_emails",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Reset draft.",
    ],
  }),
  composioTool({
    name: "hubspot_restore_email_revision",
    description: "Restores a specific revision of a marketing email to a DRAFT state, overwriting any existing draft.",
    toolSlug: "HUBSPOT_RESTORE_EMAIL_REVISION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "The unique identifier of the marketing email.",
        },
        revisionId: {
          type: "integer",
          description: "The specific revision ID of the marketing email to restore.",
        },
      },
      required: [
        "emailId",
        "revisionId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing_emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Restore a revision of a marketing email to draft state.",
    ],
  }),
  composioTool({
    name: "hubspot_restore_marketing_email_revision",
    description: "Restores a specific, existing, non-active revision of a marketing email to become the new live version for that email.",
    toolSlug: "HUBSPOT_RESTORE_MARKETING_EMAIL_REVISION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "Identifier of the marketing email.",
        },
        revisionId: {
          type: "string",
          description: "Identifier of the specific email revision to restore.",
        },
      },
      required: [
        "emailId",
        "revisionId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing_emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Restore a revision of a marketing email.",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_all_object_schemas",
    description: "Retrieves all object schema definitions (not data records) for a HubSpot account, supporting retrieval of either active or archived schemas.",
    toolSlug: "HUBSPOT_RETRIEVE_ALL_OBJECT_SCHEMAS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Set to true to retrieve only archived object schemas, or false for only active, non-archived schemas. Archived schemas are typically inactive but retained for historical/compliance.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "core",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_all_pipelines_for_specified_object_type",
    description: "Retrieves all pipelines in HubSpot for a specified CRM object type, such as deals or tickets.",
    toolSlug: "HUBSPOT_RETRIEVE_ALL_PIPELINES_FOR_SPECIFIED_OBJECT_TYPE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The case-sensitive CRM object type (e.g., 'deals', 'tickets') for which to retrieve pipelines; must support pipelines.",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "pipelines",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_calling_settings_for_app",
    description: "Retrieves the read-only calling extension settings for a specific HubSpot app; the app must exist and have calling extensions configured.",
    toolSlug: "HUBSPOT_RETRIEVE_CALLING_SETTINGS_FOR_APP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique integer identifier for the target HubSpot app.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "settings",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_line_item_by_id",
    description: "Retrieves a HubSpot CRM line item by its ID or a specified unique property (`idProperty`).",
    toolSlug: "HUBSPOT_RETRIEVE_LINE_ITEM_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        archived: {
          type: "boolean",
          description: "Set to `True` to retrieve archived Line Items; `False` (default) retrieves non-archived items.",
        },
        idProperty: {
          type: "string",
          description: "Name of a unique property (e.g., 'sku') to use as the identifier instead of the HubSpot ID. Must be unique across all Line Items.",
        },
        lineItemId: {
          type: "string",
          description: "The Line Item's unique identifier. Must be a valid numeric HubSpot object ID of an existing line item, or the value of the property specified in `idProperty`. Use HUBSPOT_RETRIEVE_LINE_ITEMS_LIST or HUBSPOT_SEARCH_LINE_ITEMS_BY_CRITERIA to find valid IDs.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of property names to return for the Line Item. Non-existent properties are ignored.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of object types (e.g., 'deal') for which to retrieve IDs of associated objects. Ignores non-existent association types.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of property names for which to retrieve historical values. Ignores non-existent properties or those without history.",
        },
      },
      required: [
        "lineItemId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_line_items",
    description: "Fetches a paginated list of HubSpot CRM line items, allowing selection of specific properties (including history), associated object IDs, and filtering by archive status; ensure property and association names are valid HubSpot internal names.",
    toolSlug: "HUBSPOT_RETRIEVE_LINE_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from 'paging.next.after' of a previous response to fetch the subsequent page. Omit for the first request.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of line items to return per page; controls response size. An API-defined upper limit may apply.",
        },
        archived: {
          type: "boolean",
          description: "Filter by archive status: `true` for archived only, `false` (default) for active only. Manages historical or current items.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names to include for each line item (e.g., `[\"name\", \"price\"]`); customizes returned data. Non-existent properties are ignored. If omitted, a default set is returned.",
        },
        associations: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Object types (e.g., `[\"deal\", \"product\"]`) for which to retrieve associated IDs. Invalid types are ignored. Valid types depend on HubSpot data model.",
        },
        propertiesWithHistory: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Property names for which to include historical values (e.g., `[\"status\", \"amount\"]`); tracks changes. May reduce items returned per request due to increased payload.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "basic",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_object_schema",
    description: "Fetches the detailed schema definition for a specified, existing standard or custom HubSpot CRM object type; this action is read-only and does not create or modify schemas.",
    toolSlug: "HUBSPOT_RETRIEVE_OBJECT_SCHEMA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "Fully qualified name for standard HubSpot objects (e.g., 'contacts', 'companies') or unique object type ID for custom objects (e.g., 'p123456', '2-xxxxxxx'). Case-sensitive and must match an existing object type as defined in HubSpot.",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "core",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_owner_by_id_or_user_id",
    description: "Retrieves a specific HubSpot CRM owner by their ID, with options to specify ID type (owner or user) and to include archived records.",
    toolSlug: "HUBSPOT_RETRIEVE_OWNER_BY_ID_OR_USER_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ownerId: {
          type: "integer",
          description: "Unique identifier of the owner. Its meaning (HubSpot owner ID or user ID) is determined by `idProperty`.",
        },
        archived: {
          type: "boolean",
          description: "Set to `true` to retrieve only archived owners; otherwise, active (non-archived) owners are returned.",
        },
        idProperty: {
          type: "string",
          description: "Determines if `ownerId` refers to the HubSpot owner ID (`id`) or the user ID (`userId`).",
          enum: [
            "id",
            "userId",
          ],
        },
      },
      required: [
        "ownerId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "owners",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_owners",
    description: "Retrieves a list of all owners in the HubSpot CRM, including their ID, first name, last name, email, and user ID.",
    toolSlug: "HUBSPOT_RETRIEVE_OWNERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "owners",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_page_of_crm_owners",
    description: "Retrieves a paginated list of CRM owners from HubSpot, optionally filtering by email or archived status.",
    toolSlug: "HUBSPOT_RETRIEVE_PAGE_OF_CRM_OWNERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from a previous response to fetch the next page.",
        },
        email: {
          type: "string",
          description: "Filter by a specific email address.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of CRM owners per page. Refer to HubSpot's API documentation for current limits.",
        },
        archived: {
          type: "boolean",
          description: "Set to `true` for archived owners, or `false` for active owners.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "owners",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_pipeline_stage_by_id",
    description: "Fetches detailed properties and metadata (e.g., label, display order, custom properties) for a specific stage within a HubSpot CRM pipeline, identified by its `objectType`, `pipelineId`, and `stageId`.",
    toolSlug: "HUBSPOT_RETRIEVE_PIPELINE_STAGE_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        stageId: {
          type: "string",
          description: "The unique identifier (ID) of the specific pipeline stage to retrieve. This ID must be valid and exist within the specified pipeline.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object associated with the pipeline (e.g., 'deals', 'tickets'). This is case-sensitive and determines which object-specific pipeline and stages are queried. Must be a valid HubSpot CRM object type.",
        },
        pipelineId: {
          type: "string",
          description: "The unique identifier (ID) of the pipeline containing the stage. This ID must be valid and correspond to the specified `objectType`.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
        "stageId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "pipeline_stages",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_pipeline_stages",
    description: "Fetches all stages for a specified HubSpot CRM object type and pipeline ID.",
    toolSlug: "HUBSPOT_RETRIEVE_PIPELINE_STAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The CRM object type (e.g., deals, tickets) for which to retrieve pipeline stages; must support pipelines.",
        },
        pipelineId: {
          type: "string",
          description: "The unique ID of the pipeline associated with the specified objectType whose stages are to be retrieved.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "pipeline_stages",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_timeline_event_by_ids",
    description: "Retrieves a specific HubSpot CRM timeline event by its application ID, event template ID, and event ID, returning event details including timestamp, tokens, and associated object information.",
    toolSlug: "HUBSPOT_RETRIEVE_TIMELINE_EVENT_BY_IDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        eventId: {
          type: "string",
          description: "The unique identifier for the specific timeline event. This ID uniquely identifies the event within the context of its template and must correspond to an existing event in your HubSpot CRM timeline.",
        },
        applicationId: {
          type: "string",
          description: "The HubSpot application ID that created the timeline event. This is the ID of the developer app or integration that generated the timeline events you want to retrieve.",
        },
        eventTemplateId: {
          type: "string",
          description: "The unique identifier for the event template (also called event type ID). This ID is crucial for locating the specific type of event and must correspond to a pre-defined event template in your HubSpot account.",
        },
      },
      required: [
        "applicationId",
        "eventTemplateId",
        "eventId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "hubspot_retrieve_video_conference_settings_by_id",
    description: "Retrieves video conference application settings, such as webhook URLs and user/account management configurations, for a specified `appId`.",
    toolSlug: "HUBSPOT_RETRIEVE_VIDEO_CONFERENCE_SETTINGS_BY_ID",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique integer identifier for the video conference application, corresponding to the ID of the application created in your HubSpot developer portal.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "settings",
    ],
  }),
  composioTool({
    name: "hubspot_search_campaigns",
    description: "Searches for HubSpot campaigns.",
    toolSlug: "HUBSPOT_SEARCH_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from previous response.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of campaigns to return.",
        },
        query: {
          type: "string",
          description: "Text search query to find campaigns by name.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "marketing",
    ],
  }),
  composioTool({
    name: "hubspot_search_companies",
    description: "Searches for HubSpot companies using flexible criteria and filters.",
    toolSlug: "HUBSPOT_SEARCH_COMPANIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination cursor; use `paging.next.after` from a previous response to fetch the next page.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of company records to return.",
        },
        query: {
          type: "string",
          description: "String to search across default text properties of company records.",
        },
        sorts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              direction: {
                type: "string",
                description: "The direction of sorting.",
                enum: [
                  "ASCENDING",
                  "DESCENDING",
                ],
              },
              propertyName: {
                type: "string",
                description: "The HubSpot company property internal name to sort the results by. Supports both standard and custom properties.",
              },
            },
            description: "Defines a sorting rule by specifying a property and direction.",
          },
          description: "List of sort objects to define the order of results. Maximum 1 sort allowed.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "HubSpot company property internal names to include in the response. Supports both standard properties and custom properties; a default set is returned if unspecified.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "Comparison value for `propertyName`; serves as the lower bound when `operator` is `BETWEEN`.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "Values for `IN` or `NOT_IN` operators; required and used only when `operator` is `IN` or `NOT_IN`.",
                    },
                    operator: {
                      type: "string",
                      description: "Operator defining the filter's logic; determines which other fields (`value`, `values`, `highValue`) are required.",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "Upper bound for a range filter; required and used only when `operator` is `BETWEEN`.",
                    },
                    propertyName: {
                      type: "string",
                      description: "The HubSpot company property internal name to filter on. Supports both standard properties (name, domain, annualrevenue, etc.) and custom properties.",
                    },
                  },
                  description: "Defines a single filter criterion to apply when searching for company objects.",
                },
                description: "List of filter criteria; filters within this list are combined using an AND operator.",
              },
            },
            description: "Defines a group of filters. Filters within a group are ANDed together.",
          },
          description: "List of filter groups; filters within a group are ANDed, and multiple groups are ORed.",
        },
        custom_properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Custom company property internal names to include in the response.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_contacts_by_criteria",
    description: "Searches for HubSpot contacts using a text query, specific filter criteria (filters in a group are ANDed, groups are ORed), sorting, and pagination to retrieve selected properties.",
    toolSlug: "HUBSPOT_SEARCH_CONTACTS_BY_CRITERIA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "The cursor token for pagination. Use the `after` value from the `paging.next` object of a previous response to fetch the next set of results. If `None` or an empty string, it fetches the first page.",
        },
        limit: {
          type: "integer",
          description: "The maximum number of contacts to return.",
        },
        query: {
          type: "string",
          description: "A string to search across HubSpot's default searchable contact properties ONLY: firstname, lastname, email, phone, hs_additional_emails, hs_object_id, hs_searchable_calculated_phone_number, company. IMPORTANT: This does NOT search custom properties. To search/filter by custom properties (e.g., 'icp_segment', 'lead_source'), use filterGroups with specific property filters instead. At least one of 'query' or 'filterGroups' must be provided.",
        },
        sorts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              direction: {
                type: "string",
                description: "The direction for sorting (`ASCENDING` or `DESCENDING`). See `DirectionEnm` for options.",
                enum: [
                  "ASCENDING",
                  "DESCENDING",
                ],
              },
              propertyName: {
                type: "string",
                description: "The HubSpot contact property to sort by. Supports both standard and custom property internal names.",
              },
            },
            description: "Defines a sorting criterion for search results, including the property name and sort direction.",
          },
          description: "A list of sort criteria to apply. Each criterion specifies a contact `propertyName` and a sort `direction`. Example: `[{'propertyName': 'lastname', 'direction': 'ASCENDING'}]` sorts contacts by last name.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of contact property internal names to include in the response. Supports both standard properties (firstname, email, etc.) and custom properties. If omitted, a default set is returned.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "The value to compare the property against. Required for most operators (e.g., `EQ`, `LT`). Must NOT be set with `IN`, `NOT_IN`, `HAS_PROPERTY`, `NOT_HAS_PROPERTY` operators. For datetime properties (createdate, lastmodifieddate, etc.), use epoch milliseconds (e.g., '1609459200000'). Relative time strings like '24h', '7d', '24 hours ago' are automatically converted to epoch milliseconds.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "A list of values for `IN` or `NOT_IN` operations. Required and only used when `operator` is `IN` or `NOT_IN`.",
                    },
                    operator: {
                      type: "string",
                      description: "The operator to use for filtering (e.g., `EQ`, `NEQ`, `LT`, `BETWEEN`, `IN`). Determines how the `propertyName` is compared with `value`, `values`, or `highValue`. See `OperatorEnm` for all options.",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "The higher bound value for a `BETWEEN` operation. Required and only used when `operator` is `BETWEEN`.",
                    },
                    propertyName: {
                      type: "string",
                      description: "The HubSpot contact property to filter on. Supports both standard properties (email, lifecyclestage, etc.) and custom properties. IMPORTANT: To filter by contact ID, use 'hs_object_id' (not 'id').",
                    },
                  },
                  description: "Represents a single filter criterion for searching contacts, specifying a property, operator, and value(s).",
                },
                description: "A list of filter criteria objects. All filters within this list are combined using AND logic.",
              },
            },
            description: "Defines a group of filters. Filters within a group are ANDed. Multiple filter groups in a search request are ORed.",
          },
          description: "A list of filter groups. HubSpot enforces strict limits: maximum 5 filterGroups and maximum 18 total filters across all groups combined. Filters within a group are ANDed. Multiple groups are ORed. Use filterGroups to search/filter by ANY property (including custom properties) with precise operators. At least one of 'query' or 'filterGroups' must be provided. For custom property filtering (e.g., icp_segment='Construction'), use filterGroups instead of query. Example: `[{'filters': [{'propertyName': 'icp_segment', 'operator': 'EQ', 'value': 'Construction'}]}]`. If you need more filter groups or filters, split your search into multiple requests.",
        },
        custom_properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of internal names for custom contact properties to retrieve (e.g., `custom_lead_score`). This is a convenience alias that gets merged into `properties` before the API call - you can also include custom properties directly in the `properties` field instead.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_crm_objects_by_criteria",
    description: "Searches HubSpot CRM objects (e.g., 'contacts', 'companies') by `objectType` using complex criteria including filters, sorting, and pagination; property names used in filters, sorts, and returned properties must be valid for the specified `objectType`.",
    toolSlug: "HUBSPOT_SEARCH_CRM_OBJECTS_BY_CRITERIA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Optional. Cursor for pagination (from previous response). Must be formatted as an integer string (e.g., '100', '200'). HubSpot's search API has a hard limit of 10,000 total results; pagination cannot proceed beyond this point (i.e., after >= 10000 is not allowed).",
        },
        limit: {
          type: "integer",
          description: "Optional. Max results per page (default 10, max 100).",
        },
        query: {
          type: "string",
          description: "A string for a broad search across multiple fields on the object. Use this for quick text searches. Optional - can be omitted to retrieve all objects.",
        },
        sorts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional. List of sort rules. Accepts either simple strings (e.g., 'createdate' for ascending, '-createdate' for descending) or object format [{'propertyName': 'createdate', 'direction': 'ASCENDING'}]. Simple strings are automatically converted to the object format. Only one sorting rule can be applied to any search.",
        },
        objectType: {
          type: "string",
          description: "The type of CRM object to search. VALID VALUES: 'contacts', 'companies', 'deals', 'tickets', 'tasks', 'line_items', 'products', 'quotes', 'calls', 'emails', 'meetings', 'notes', or custom object IDs like '2-1234567'. Must be lowercase and plural for standard types. IMPORTANT: This is the OBJECT TYPE, not a property name. Do NOT pass property names like 'hs_task_status', 'email', 'dealname', etc. here - those belong in filterGroups.filters.propertyName. Example: To search for tasks with a specific status, use objectType='tasks' and add a filter with propertyName='hs_task_status'.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional. List of property names to include in the response. Property names must be valid for the objectType. For tasks: use hs_task_subject, hs_task_body, hs_task_status, hs_task_priority, hs_timestamp (due date), hs_task_type, hubspot_owner_id. Do NOT use hs_status, hs_due_date, or hs_priority for tasks. Note: Properties filtered with HAS_PROPERTY or NOT_HAS_PROPERTY operators cannot be included here and will be automatically removed.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "The single value to compare against. REQUIRED for operators: EQ, NEQ, LT, LTE, GT, GTE, CONTAINS_TOKEN, NOT_CONTAINS_TOKEN. For BETWEEN, use with 'highValue'. Not used for IN/NOT_IN (use 'values'), HAS_PROPERTY, or NOT_HAS_PROPERTY. CONTAINS_TOKEN constraint: Matches individual tokens/words in tokenized text fields. Multi-word values may not match as expected; for exact phrase matching use EQ, or use multiple CONTAINS_TOKEN filters (one per word), or use the 'query' parameter for full-text search.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "A list of values for `IN` or `NOT_IN` operators ONLY. Do NOT use for NEQ/EQ/LT/LTE/GT/GTE - these require 'value' (single string).",
                    },
                    operator: {
                      type: "string",
                      description: "The filter operator defining the comparison logic. CONTAINS_TOKEN/NOT_CONTAINS_TOKEN: Match individual tokens/words in tokenized text fields. Multi-word values may not work as expected - for exact phrase matching use EQ, or use multiple CONTAINS_TOKEN filters (one per word), or use the 'query' parameter for full-text search. Other operators: EQ (equals), NEQ (not equals), LT/LTE/GT/GTE (comparisons), IN/NOT_IN (list membership), BETWEEN (range), HAS_PROPERTY/NOT_HAS_PROPERTY (existence).",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "The highest value for a `BETWEEN` operator. Required and only used when `operator` is `BETWEEN`.",
                    },
                    propertyName: {
                      type: "string",
                      description: "The internal name of the CRM property to filter on. Property names vary by object type. For tasks: use hs_task_status, hs_task_priority, hs_timestamp (due date), hs_task_body, hs_task_subject, hs_task_type. Do NOT use hs_status, hs_due_date, or hs_priority for tasks - these are invalid property names. ASSOCIATION FILTERING: To filter by associated records, use the pseudo-property format 'associations.{objectType}' (e.g., 'associations.contact', 'associations.company', 'associations.deal'). Do NOT use 'associationIds' - this is not a valid property name. Example: To find all notes associated with contact ID 123, use propertyName='associations.contact' with operator='EQ' and value='123'.",
                    },
                  },
                  description: "Defines a single filter criterion to apply to a CRM object search.",
                },
                description: "A list of individual filter criteria; all filters in this list are ANDed together.",
              },
            },
            description: "Defines a group of filters. Filters within a group are ANDed together.",
          },
          description: "Optional. List of filter groups (AND within, OR between). Can be omitted to retrieve all objects without filtering. Maximum of 5 filter groups with up to 6 filters each (18 total).",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_deals",
    description: "Searches for HubSpot deals using flexible criteria and filters.",
    toolSlug: "HUBSPOT_SEARCH_DEALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from a previous response's `paging.next.after` to fetch the next page; omit for the first page. Note: HubSpot's search API has a hard limit of 10,000 total results - the 'after' value must be less than 10000.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of deal records to return.",
        },
        query: {
          type: "string",
          description: "String to search across default text properties in deals for records containing this string.",
        },
        sorts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              direction: {
                type: "string",
                description: "Direction of sorting.",
                enum: [
                  "ASCENDING",
                  "DESCENDING",
                ],
              },
              propertyName: {
                type: "string",
                description: "Internal name of the HubSpot deal property to sort by. Supports both standard and custom properties.",
              },
            },
            description: "Defines a sorting rule by a specific property and direction.",
          },
          description: "Sort order for results. If multiple sort objects are provided, they are applied in the given order.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "HubSpot deal property internal names to include in the response. Supports both standard and custom properties; a default set is returned if omitted.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "Value to compare the property against; used for operators other than `BETWEEN`, `IN`, `NOT_IN`, `HAS_PROPERTY`, and `NOT_HAS_PROPERTY`.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "Values to match for the property, used only when operator is `IN` or `NOT_IN`.",
                    },
                    operator: {
                      type: "string",
                      description: "Comparison operator defining how the property's value is compared against `value`, `values`, or `highValue`.",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "Higher bound value for a property, used only when operator is `BETWEEN`.",
                    },
                    propertyName: {
                      type: "string",
                      description: "Internal name of the HubSpot deal property to filter on. Supports both standard properties and custom properties.",
                    },
                  },
                  description: "Defines a single filter criterion used within a filter group.",
                },
                description: "Filter criteria to apply within this group.",
              },
            },
            description: "A group of filters where individual filters are combined using AND logic; multiple filter groups are combined using OR logic.",
          },
          description: "Filter groups to apply to the search. Filters within a group are ANDed; groups are ORed.",
        },
        custom_properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "User-defined custom property internal names (not standard HubSpot properties) to include in the response.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_emails",
    description: "Searches for HubSpot emails using flexible criteria and filters.",
    toolSlug: "HUBSPOT_SEARCH_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination token from previous response.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of emails to return.",
        },
        query: {
          type: "string",
          description: "Text search query to find emails by subject or content.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Email property names to include in the response.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "public_object",
    ],
  }),
  composioTool({
    name: "hubspot_search_feedback_submissions",
    description: "Searches for feedback submissions in HubSpot CRM using text query, filter groups, sorting, and pagination, returning specified properties.",
    toolSlug: "HUBSPOT_SEARCH_FEEDBACK_SUBMISSIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "A pagination token from a previous response to retrieve the next page of results. Omit for the first page.",
        },
        limit: {
          type: "integer",
          description: "The maximum number of feedback submissions to return in a single response. Defaults to 10.",
        },
        query: {
          type: "string",
          description: "A string to search across all searchable properties of feedback submissions. This performs a broad text search.",
        },
        sorts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of property names to sort the results by. Properties are sorted in ascending order by default. Prefix a property name with a hyphen (`-`) for descending order. Defaults to creation order (oldest first) if omitted.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of specific feedback submission property names to be included in the response. If omitted, returns default properties: hs_createdate, hs_lastmodifieddate, and hs_object_id.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "The string value to compare the property against. Used for operators like `EQ`, `LT`, `GT`, `CONTAINS_TOKEN`, etc., and as the lower bound when `operator` is `BETWEEN`.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "A list of string values to match against the property. Used when `operator` is `IN` or `NOT_IN`.",
                    },
                    operator: {
                      type: "string",
                      description: "The filter operator to apply.",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "Specifies the higher bound for a `BETWEEN` operation. Required only when `operator` is `BETWEEN`.",
                    },
                    propertyName: {
                      type: "string",
                      description: "The internal name of the feedback submission property to filter on.",
                    },
                  },
                  description: "Request schema for individual filter criteria within a filter group.",
                },
                description: "A list of filter criteria. Filters within this group are combined using AND logic.",
              },
            },
            description: "Request schema for a group of filters.",
          },
          description: "A list of filter groups to apply to the search. Each group represents a set of AND-ed filters. Multiple filter groups are combined using OR logic. Maximum 5 groups with up to 6 filters each (18 total filters maximum).",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_line_items_by_criteria",
    description: "Searches HubSpot line items using criteria including filters, sorting, and pagination; `after` must be a valid cursor from a previous response, and `sorts`/`properties` must refer to valid line item property names.",
    toolSlug: "HUBSPOT_SEARCH_LINE_ITEMS_BY_CRITERIA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Pagination cursor from a prior response to fetch the next page of results. Leave empty for the first page.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of line items to retrieve per page (default: 10, max: 200).",
        },
        query: {
          type: "string",
          description: "Optional search string applied across all searchable line item properties.",
        },
        sorts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of property names for sorting results. Prepend '-' for descending order. Defaults to creation date ascending if omitted.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific line item property names to include in results. If omitted or empty, a default set of properties is returned.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "Value to filter by; serves as the lower bound for the `BETWEEN` operator.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "List of values for multi-value operators (e.g., `IN`, `NOT_IN`).",
                    },
                    operator: {
                      type: "string",
                      description: "Filtering operator (e.g., `EQ`, `BETWEEN`) defining the comparison logic.",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "Higher value for range-based filters (e.g., `BETWEEN`).",
                    },
                    propertyName: {
                      type: "string",
                      description: "Name of the line item property to filter on.",
                    },
                  },
                  description: "Defines a single filter criterion for searching line items.",
                },
                description: "List of filter conditions to apply within this group. All conditions are ANDed together.",
              },
            },
            description: "Groups multiple filters; line items must match all filters (AND logic) within this group.",
          },
          description: "List of filter groups. Line items must match all filters in at least one group (filters within a group are ANDed; groups are ORed). Leave empty to return all line items.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_products",
    description: "Searches for HubSpot products using flexible criteria and filters.",
    toolSlug: "HUBSPOT_SEARCH_PRODUCTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "The cursor for pagination. To get the next page of results, use the `after` value from the `paging.next.after` property of a previous response.",
        },
        limit: {
          type: "integer",
          description: "The maximum number of products to return in the search results.",
        },
        query: {
          type: "string",
          description: "A string to search across all default text properties of products. Finds records where any of these properties contain the specified string.",
        },
        sorts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              direction: {
                type: "string",
                description: "The sorting direction for the `propertyName`. Can be `ASCENDING` or `DESCENDING`.",
                enum: [
                  "ASCENDING",
                  "DESCENDING",
                ],
              },
              propertyName: {
                type: "string",
                description: "The product property to sort by. Supports both standard properties (name, price, hs_sku, etc.) and custom properties.",
              },
            },
            description: "Specifies a product property to sort by and the direction of the sort.",
          },
          description: "A list of sort objects to define the order of search results. Each object specifies a `propertyName` and a `direction`. For example, `[{'propertyName': 'name', 'direction': 'ASCENDING'}]` sorts products by name alphabetically.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of product properties to include in the response. Supports both standard properties and custom properties. If not provided, a default set of properties will be returned.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "The single string value to filter by. Required for most operators (e.g., `EQ`, `GT`, `CONTAINS_TOKEN`) and serves as the lower bound when operator is `BETWEEN`.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "A list of string values to filter by. Required and only used when the operator is `IN` or `NOT_IN`.",
                    },
                    operator: {
                      type: "string",
                      description: "The comparison operator defining how the `propertyName` is evaluated against the provided value(s). See `OperatorEnm` for all options.",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "The higher string value for a range filter. Required and only used when the operator is `BETWEEN`.",
                    },
                    propertyName: {
                      type: "string",
                      description: "The product property to filter on. Supports both standard properties (price, hs_product_category, etc.) and custom properties.",
                    },
                  },
                  description: "Defines a single filter criterion for product searches, including property, operator, and value(s).",
                },
                description: "A list of filter criteria. Filters within a single group are combined with AND logic.",
              },
            },
            description: "A list of filters that are combined using AND logic within this group.",
          },
          description: "A list of filter groups to apply to the search. Each filter group contains one or more filters. Filters within a group are combined using AND logic, while multiple filter groups are combined using OR logic. For example: `[{'filters': [{'propertyName': 'price', 'operator': 'GT', 'value': '100'}]}]`.",
        },
        custom_properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of internal names of custom product properties to include in the response. It's important to use the property's internal API name. For example `['custom_field_api_name_1', 'custom_field_api_name_2']`.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_quotes_by_criteria",
    description: "Searches HubSpot CRM quotes using a text query, complex filter criteria, sorting, and pagination.",
    toolSlug: "HUBSPOT_SEARCH_QUOTES_BY_CRITERIA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "A cursor for pagination. Set this to the 'paging.next.after' value from a previous response to get the next page of results. If not provided, the first page is returned.",
        },
        limit: {
          type: "integer",
          description: "The maximum number of quote records to return in the response. Default is 10, maximum is 200.",
        },
        query: {
          type: "string",
          description: "A string to search across all searchable properties of quotes. This performs a broad text search.",
        },
        sorts: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              direction: {
                type: "string",
                description: "The sort direction. Use 'ASCENDING' or 'DESCENDING'. Default is 'ASCENDING'.",
              },
              propertyName: {
                type: "string",
                description: "The internal name of the quote property to sort by.",
              },
            },
            description: "Defines a sort rule for search results.",
          },
          description: "A list of sort rules to order the results. Only one sort rule can be applied. Each sort contains 'propertyName' and 'direction' ('ASCENDING' or 'DESCENDING'). If omitted, results are ordered by creation date (oldest first).",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Specific quote property internal names to include in the response. If omitted, a default set of properties is returned. Include custom property names here.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "The value to compare the property against. This is required for most operators, except 'BETWEEN', 'IN', 'NOT_IN', 'HAS_PROPERTY', and 'NOT_HAS_PROPERTY'.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "A list of values to be used with 'IN' or 'NOT_IN' operators. This is required if the operator is 'IN' or 'NOT_IN'.",
                    },
                    operator: {
                      type: "string",
                      description: "The comparison operator to use for the filter. Determines how the 'propertyName' and 'value' (or 'values'/'highValue') are compared.",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "The higher value for a 'BETWEEN' operator. This is required if the operator is 'BETWEEN'.",
                    },
                    propertyName: {
                      type: "string",
                      description: "The internal name of the quote property to filter by.",
                    },
                  },
                  description: "Defines a single filter to apply to the quote search.",
                },
                description: "A list of filters to apply. Multiple filters in this list will be combined with an AND operator.",
              },
            },
            description: "A group of filters. All filters within a group are combined with an AND logic.",
          },
          description: "A list of filter groups to apply to the search. Multiple filter groups are combined with an OR logic, while filters within a group are combined with AND logic. Maximum 5 filter groups with up to 6 filters each.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_search_tickets",
    description: "Searches for HubSpot tickets using flexible criteria and filters.",
    toolSlug: "HUBSPOT_SEARCH_TICKETS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        after: {
          type: "string",
          description: "Cursor token for pagination to get the next page of results.",
        },
        limit: {
          type: "integer",
          description: "Maximum number of tickets to return in the response.",
        },
        query: {
          type: "string",
          description: "Text search query to find tickets by content or subject.",
        },
        sorts: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of sort criteria for ordering the results.",
        },
        properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Ticket properties to include in the response. Supports both standard and custom properties.",
        },
        filterGroups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              filters: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    value: {
                      type: "string",
                      description: "The value to filter on.",
                    },
                    values: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      description: "List of values to match against for multi-value filters.",
                    },
                    operator: {
                      type: "string",
                      description: "The filter operator (e.g., EQ, GT, LT, CONTAINS).",
                      enum: [
                        "EQ",
                        "NEQ",
                        "LT",
                        "LTE",
                        "GT",
                        "GTE",
                        "BETWEEN",
                        "IN",
                        "NOT_IN",
                        "HAS_PROPERTY",
                        "NOT_HAS_PROPERTY",
                        "CONTAINS_TOKEN",
                        "NOT_CONTAINS_TOKEN",
                      ],
                    },
                    highValue: {
                      type: "string",
                      description: "The upper bound value for range filters.",
                    },
                    propertyName: {
                      type: "string",
                      description: "The name of the property to filter on.",
                    },
                  },
                },
                description: "List of filters within this filter group.",
              },
            },
          },
          description: "Groups of filters to apply to the ticket search.",
        },
        custom_properties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of custom property names to include in the response.",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "hubspot_set_call_recording_settings",
    description: "Configures the URL (`urlToRetrieveAuthedRecording`) that HubSpot uses to retrieve call recordings for a specified third-party calling app (`appId`). The URL must contain a %s placeholder which HubSpot replaces with the engagement's externalId. The calling app must be an existing calling extension app integrated with the HubSpot account.",
    toolSlug: "HUBSPOT_SET_CALL_RECORDING_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "Unique identifier for the third-party calling app integration in HubSpot CRM whose recording settings will be modified.",
        },
        urlToRetrieveAuthedRecording: {
          type: "string",
          description: "Endpoint URL for HubSpot to retrieve call recordings; must contain %s placeholder which HubSpot will replace with the engagement's externalId, and must serve recordings with authentication if required.",
        },
      },
      required: [
        "appId",
        "urlToRetrieveAuthedRecording",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "recording_settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Set call recording settings.",
    ],
  }),
  composioTool({
    name: "hubspot_start_import",
    description: "Call this action to start an asynchronous data import into HubSpot CRM using uploaded files and a detailed `importRequest` JSON configuration, ensuring this JSON correctly maps file columns to HubSpot properties and files align with these mappings.",
    toolSlug: "HUBSPOT_START_IMPORT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        files: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "File name, contains extension to indetify the file type",
            },
            content: {
              type: "string",
              description: "File content in base64",
            },
          },
          description: "The binary content of the file(s) to be imported. Supported formats typically include CSV, XLSX, and XLS. Ensure the file structure aligns with the mappings defined in `importRequest`.",
        },
        importRequest: {
          type: "string",
          description: "A JSON string specifying the configuration for the import process. This configuration dictates how data from the uploaded file(s) is mapped and imported into HubSpot. Key properties include `name` (a descriptive name for the import, e.g., \"Q3 Contact Import\"), `dateFormat` (e.g., 'MONTH_DAY_YEAR', 'DAY_MONTH_YEAR'), `importOperations` (defines if the import should create and update, only create, or only update records, e.g., 'CREATE_AND_UPDATE'), and `files` (an array detailing each file, its format, and `columnMappings`). The `columnMappings` are crucial as they map spreadsheet columns to HubSpot CRM object properties (e.g., map 'Email Address' column to 'CONTACT' object's 'email' property).",
        },
      },
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "Confirm the parameters before executing Initiate data import process.",
    ],
  }),
  composioTool({
    name: "hubspot_update_a_marketing_email",
    description: "Updates properties of an existing marketing email identified by its `emailId`; unspecified fields retain their current values.",
    toolSlug: "HUBSPOT_UPDATE_A_MARKETING_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The internal name of the email as it appears in the HubSpot dashboard.",
        },
        state: {
          type: "string",
          description: "The desired state of the email after the update. Common states include 'DRAFT', 'SCHEDULED', 'PUBLISHED'.",
          enum: [
            "AUTOMATED",
            "AUTOMATED_DRAFT",
            "AUTOMATED_SENDING",
            "AUTOMATED_FOR_FORM",
            "AUTOMATED_FOR_FORM_BUFFER",
            "AUTOMATED_FOR_FORM_DRAFT",
            "AUTOMATED_FOR_FORM_LEGACY",
            "BLOG_EMAIL_DRAFT",
            "BLOG_EMAIL_PUBLISHED",
            "DRAFT",
            "DRAFT_AB",
            "DRAFT_AB_VARIANT",
            "ERROR",
            "LOSER_AB_VARIANT",
            "PAGE_STUB",
            "PRE_PROCESSING",
            "PROCESSING",
            "PUBLISHED",
            "PUBLISHED_AB",
            "PUBLISHED_AB_VARIANT",
            "PUBLISHED_OR_SCHEDULED",
            "RSS_TO_EMAIL_DRAFT",
            "RSS_TO_EMAIL_PUBLISHED",
            "SCHEDULED",
            "SCHEDULED_AB",
            "SCHEDULED_OR_PUBLISHED",
            "AUTOMATED_AB",
            "AUTOMATED_AB_VARIANT",
            "AUTOMATED_DRAFT_AB",
            "AUTOMATED_DRAFT_ABVARIANT",
            "AUTOMATED_LOSER_ABVARIANT",
          ],
        },
        emailId: {
          type: "string",
          description: "The unique ID of the marketing email to be updated.",
        },
        subject: {
          type: "string",
          description: "The subject line of the marketing email.",
        },
        archived: {
          type: "boolean",
          description: "Set to `true` to archive the marketing email, or `false` to make it active (unarchive).",
        },
        campaign: {
          type: "string",
          description: "The ID of the HubSpot campaign this email is associated with.",
        },
        language: {
          type: "string",
          description: "The primary language of the email, using ISO 639-1 language codes (e.g., 'en') or language-locale codes (e.g., 'en-us').",
          enum: [
            "af",
            "af-na",
            "af-za",
            "agq",
            "agq-cm",
            "ak",
            "ak-gh",
            "am",
            "am-et",
            "ar",
            "ar-001",
            "ar-ae",
            "ar-bh",
            "ar-dj",
            "ar-dz",
            "ar-eg",
            "ar-eh",
            "ar-er",
            "ar-il",
            "ar-iq",
            "ar-jo",
            "ar-km",
            "ar-kw",
            "ar-lb",
            "ar-ly",
            "ar-ma",
            "ar-mr",
            "ar-om",
            "ar-ps",
            "ar-qa",
            "ar-sa",
            "ar-sd",
            "ar-so",
            "ar-ss",
            "ar-sy",
            "ar-td",
            "ar-tn",
            "ar-ye",
            "as",
            "as-in",
            "asa",
            "asa-tz",
            "ast",
            "ast-es",
            "az",
            "az-az",
            "bas",
            "bas-cm",
            "be",
            "be-by",
            "bem",
            "bem-zm",
            "bez",
            "bez-tz",
            "bg",
            "bg-bg",
            "bm",
            "bm-ml",
            "bn",
            "bn-bd",
            "bn-in",
            "bo",
            "bo-cn",
            "bo-in",
            "br",
            "br-fr",
            "brx",
            "brx-in",
            "bs",
            "bs-ba",
            "ca",
            "ca-ad",
            "ca-es",
            "ca-fr",
            "ca-it",
            "ccp",
            "ccp-bd",
            "ccp-in",
            "ce",
            "ce-ru",
            "ceb",
            "ceb-ph",
            "cgg",
            "cgg-ug",
            "chr",
            "chr-us",
            "ckb",
            "ckb-iq",
            "ckb-ir",
            "cs",
            "cs-cz",
            "cu",
            "cu-ru",
            "cy",
            "cy-gb",
            "da",
            "da-dk",
            "da-gl",
            "dav",
            "dav-ke",
            "de",
            "de-at",
            "de-be",
            "de-ch",
            "de-de",
            "de-gr",
            "de-it",
            "de-li",
            "de-lu",
            "dje",
            "dje-ne",
            "doi",
            "doi-in",
            "dsb",
            "dsb-de",
            "dua",
            "dua-cm",
            "dyo",
            "dyo-sn",
            "dz",
            "dz-bt",
            "ebu",
            "ebu-ke",
            "ee",
            "ee-gh",
            "ee-tg",
            "el",
            "el-cy",
            "el-gr",
            "en",
            "en-001",
            "en-150",
            "en-ae",
            "en-ag",
            "en-ai",
            "en-as",
            "en-at",
            "en-au",
            "en-bb",
            "en-be",
            "en-bi",
            "en-bm",
            "en-bs",
            "en-bw",
            "en-bz",
            "en-ca",
            "en-cc",
            "en-ch",
            "en-ck",
            "en-cm",
            "en-cn",
            "en-cx",
            "en-cy",
            "en-de",
            "en-dg",
            "en-dk",
            "en-dm",
            "en-er",
            "en-fi",
            "en-fj",
            "en-fk",
            "en-fm",
            "en-gb",
            "en-gd",
            "en-gg",
            "en-gh",
            "en-gi",
            "en-gm",
            "en-gu",
            "en-gy",
            "en-hk",
            "en-ie",
            "en-il",
            "en-im",
            "en-in",
            "en-io",
            "en-je",
            "en-jm",
            "en-ke",
            "en-ki",
            "en-kn",
            "en-ky",
            "en-lc",
            "en-lr",
            "en-ls",
            "en-lu",
            "en-mg",
            "en-mh",
            "en-mo",
            "en-mp",
            "en-ms",
            "en-mt",
            "en-mu",
            "en-mw",
            "en-mx",
            "en-my",
            "en-na",
            "en-nf",
            "en-ng",
            "en-nl",
            "en-nr",
            "en-nu",
            "en-nz",
            "en-pg",
            "en-ph",
            "en-pk",
            "en-pn",
            "en-pr",
            "en-pw",
            "en-rw",
            "en-sb",
            "en-sc",
            "en-sd",
            "en-se",
            "en-sg",
            "en-sh",
            "en-si",
            "en-sl",
            "en-ss",
            "en-sx",
            "en-sz",
            "en-tc",
            "en-tk",
            "en-to",
            "en-tt",
            "en-tv",
            "en-tz",
            "en-ug",
            "en-um",
            "en-us",
            "en-vc",
            "en-vg",
            "en-vi",
            "en-vu",
            "en-ws",
            "en-za",
            "en-zm",
            "en-zw",
            "eo",
            "eo-001",
            "es",
            "es-419",
            "es-ar",
            "es-bo",
            "es-br",
            "es-bz",
            "es-cl",
            "es-co",
            "es-cr",
            "es-cu",
            "es-do",
            "es-ea",
            "es-ec",
            "es-es",
            "es-gq",
            "es-gt",
            "es-hn",
            "es-ic",
            "es-mx",
            "es-ni",
            "es-pa",
            "es-pe",
            "es-ph",
            "es-pr",
            "es-py",
            "es-sv",
            "es-us",
            "es-uy",
            "es-ve",
            "et",
            "et-ee",
            "eu",
            "eu-es",
            "ewo",
            "ewo-cm",
            "fa",
            "fa-af",
            "fa-ir",
            "ff",
            "ff-bf",
            "ff-cm",
            "ff-gh",
            "ff-gm",
            "ff-gn",
            "ff-gw",
            "ff-lr",
            "ff-mr",
            "ff-ne",
            "ff-ng",
            "ff-sl",
            "ff-sn",
            "fi",
            "fi-fi",
            "fil",
            "fil-ph",
            "fo",
            "fo-dk",
            "fo-fo",
            "fr",
            "fr-be",
            "fr-bf",
            "fr-bi",
            "fr-bj",
            "fr-bl",
            "fr-ca",
            "fr-cd",
            "fr-cf",
            "fr-cg",
            "fr-ch",
            "fr-ci",
            "fr-cm",
            "fr-dj",
            "fr-dz",
            "fr-fr",
            "fr-ga",
            "fr-gf",
            "fr-gn",
            "fr-gp",
            "fr-gq",
            "fr-ht",
            "fr-km",
            "fr-lu",
            "fr-ma",
            "fr-mc",
            "fr-mf",
            "fr-mg",
            "fr-ml",
            "fr-mq",
            "fr-mr",
            "fr-mu",
            "fr-nc",
            "fr-ne",
            "fr-pf",
            "fr-pm",
            "fr-re",
            "fr-rw",
            "fr-sc",
            "fr-sn",
            "fr-sy",
            "fr-td",
            "fr-tg",
            "fr-tn",
            "fr-vu",
            "fr-wf",
            "fr-yt",
            "fur",
            "fur-it",
            "fy",
            "fy-nl",
            "ga",
            "ga-gb",
            "ga-ie",
            "gd",
            "gd-gb",
            "gl",
            "gl-es",
            "gsw",
            "gsw-ch",
            "gsw-fr",
            "gsw-li",
            "gu",
            "gu-in",
            "guz",
            "guz-ke",
            "gv",
            "gv-im",
            "ha",
            "ha-gh",
            "ha-ne",
            "ha-ng",
            "haw",
            "haw-us",
            "he",
            "hi",
            "hi-in",
            "hr",
            "hr-ba",
            "hr-hr",
            "hsb",
            "hsb-de",
            "hu",
            "hu-hu",
            "hy",
            "hy-am",
            "ia",
            "ia-001",
            "id",
            "ig",
            "ig-ng",
            "ii",
            "ii-cn",
            "id-id",
            "is",
            "is-is",
            "it",
            "it-ch",
            "it-it",
            "it-sm",
            "it-va",
            "he-il",
            "ja",
            "ja-jp",
            "jgo",
            "jgo-cm",
            "yi",
            "yi-001",
            "jmc",
            "jmc-tz",
            "jv",
            "jv-id",
            "ka",
            "ka-ge",
            "kab",
            "kab-dz",
            "kam",
            "kam-ke",
            "kde",
            "kde-tz",
            "kea",
            "kea-cv",
            "khq",
            "khq-ml",
            "ki",
            "ki-ke",
            "kk",
            "kk-kz",
            "kkj",
            "kkj-cm",
            "kl",
            "kl-gl",
            "kln",
            "kln-ke",
            "km",
            "km-kh",
            "kn",
            "kn-in",
            "ko",
            "ko-kp",
            "ko-kr",
            "kok",
            "kok-in",
            "ks",
            "ks-in",
            "ksb",
            "ksb-tz",
            "ksf",
            "ksf-cm",
            "ksh",
            "ksh-de",
            "kw",
            "kw-gb",
            "ku",
            "ku-tr",
            "ky",
            "ky-kg",
            "lag",
            "lag-tz",
            "lb",
            "lb-lu",
            "lg",
            "lg-ug",
            "lkt",
            "lkt-us",
            "ln",
            "ln-ao",
            "ln-cd",
            "ln-cf",
            "ln-cg",
            "lo",
            "lo-la",
            "lrc",
            "lrc-iq",
            "lrc-ir",
            "lt",
            "lt-lt",
            "lu",
            "lu-cd",
            "luo",
            "luo-ke",
            "luy",
            "luy-ke",
            "lv",
            "lv-lv",
            "mai",
            "mai-in",
            "mas",
            "mas-ke",
            "mas-tz",
            "mer",
            "mer-ke",
            "mfe",
            "mfe-mu",
            "mg",
            "mg-mg",
            "mgh",
            "mgh-mz",
            "mgo",
            "mgo-cm",
            "mi",
            "mi-nz",
            "mk",
            "mk-mk",
            "ml",
            "ml-in",
            "mn",
            "mn-mn",
            "mni",
            "mni-in",
            "mr",
            "mr-in",
            "ms",
            "ms-bn",
            "ms-id",
            "ms-my",
            "ms-sg",
            "mt",
            "mt-mt",
            "mua",
            "mua-cm",
            "my",
            "my-mm",
            "mzn",
            "mzn-ir",
            "naq",
            "naq-na",
            "nb",
            "nb-no",
            "nb-sj",
            "nd",
            "nd-zw",
            "nds",
            "nds-de",
            "nds-nl",
            "ne",
            "ne-in",
            "ne-np",
            "nl",
            "nl-aw",
            "nl-be",
            "nl-ch",
            "nl-bq",
            "nl-cw",
            "nl-lu",
            "nl-nl",
            "nl-sr",
            "nl-sx",
            "nmg",
            "nmg-cm",
            "nn",
            "nn-no",
            "nnh",
            "nnh-cm",
            "no",
            "no-no",
            "nus",
            "nus-ss",
            "nyn",
            "nyn-ug",
            "om",
            "om-et",
            "om-ke",
            "or",
            "or-in",
            "os",
            "os-ge",
            "os-ru",
            "pa",
            "pa-in",
            "pa-pk",
            "pcm",
            "pcm-ng",
            "pl",
            "pl-pl",
            "prg",
            "prg-001",
            "ps",
            "ps-af",
            "ps-pk",
            "pt",
            "pt-ao",
            "pt-br",
            "pt-ch",
            "pt-cv",
            "pt-gq",
            "pt-gw",
            "pt-lu",
            "pt-mo",
            "pt-mz",
            "pt-pt",
            "pt-st",
            "pt-tl",
            "qu",
            "qu-bo",
            "qu-ec",
            "qu-pe",
            "rm",
            "rm-ch",
            "rn",
            "rn-bi",
            "ro",
            "ro-md",
            "ro-ro",
            "rof",
            "rof-tz",
            "ru",
            "ru-by",
            "ru-kg",
            "ru-kz",
            "ru-md",
            "ru-ru",
            "ru-ua",
            "rw",
            "rw-rw",
            "rwk",
            "rwk-tz",
            "sa",
            "sa-in",
            "sah",
            "sah-ru",
            "saq",
            "saq-ke",
            "sat",
            "sat-in",
            "sbp",
            "sbp-tz",
            "sd",
            "sd-in",
            "sd-pk",
            "se",
            "se-fi",
            "se-no",
            "se-se",
            "seh",
            "seh-mz",
            "ses",
            "ses-ml",
            "sg",
            "sg-cf",
            "shi",
            "shi-ma",
            "si",
            "si-lk",
            "sk",
            "sk-sk",
            "sl",
            "sl-si",
            "smn",
            "smn-fi",
            "sn",
            "sn-zw",
            "so",
            "so-dj",
            "so-et",
            "so-ke",
            "so-so",
            "sq",
            "sq-al",
            "sq-mk",
            "sq-xk",
            "sr",
            "sr-ba",
            "sr-cs",
            "sr-me",
            "sr-rs",
            "sr-xk",
            "su",
            "su-id",
            "sv",
            "sv-ax",
            "sv-fi",
            "sv-se",
            "sw",
            "sw-cd",
            "sw-ke",
            "sw-tz",
            "sw-ug",
            "sy",
            "ta",
            "ta-in",
            "ta-lk",
            "ta-my",
            "ta-sg",
            "te",
            "te-in",
            "teo",
            "teo-ke",
            "teo-ug",
            "tg",
            "tg-tj",
            "th",
            "th-th",
            "ti",
            "ti-er",
            "ti-et",
            "tk",
            "tk-tm",
            "tl",
            "to",
            "to-to",
            "tr",
            "tr-cy",
            "tr-tr",
            "tt",
            "tt-ru",
            "twq",
            "twq-ne",
            "tzm",
            "tzm-ma",
            "ug",
            "ug-cn",
            "uk",
            "uk-ua",
            "ur",
            "ur-in",
            "ur-pk",
            "uz",
            "uz-af",
            "uz-uz",
            "vai",
            "vai-lr",
            "vi",
            "vi-vn",
            "vo",
            "vo-001",
            "vun",
            "vun-tz",
            "wae",
            "wae-ch",
            "wo",
            "wo-sn",
            "xh",
            "xh-za",
            "xog",
            "xog-ug",
            "yav",
            "yav-cm",
            "yo",
            "yo-bj",
            "yo-ng",
            "yue",
            "yue-cn",
            "yue-hk",
            "zgh",
            "zgh-ma",
            "zh",
            "zh-cn",
            "zh-hk",
            "zh-mo",
            "zh-sg",
            "zh-tw",
            "zh-hans",
            "zh-hant",
            "zu",
            "zu-za",
          ],
        },
        publishDate: {
          type: "string",
          description: "The scheduled publication date and time for the email in ISO 8601 format (e.g., '2023-12-31T10:00:00Z'). Used for scheduled emails.",
        },
        subcategory: {
          type: "string",
          description: "The subcategory of the email, often used for organization (e.g., 'newsletter', 'promotional').",
        },
        activeDomain: {
          type: "string",
          description: "The domain from which this email will be sent (e.g., 'info.example.com'). Must be a connected sending domain in HubSpot.",
        },
        rssData__url: {
          type: "string",
          description: "The URL of the external RSS feed if not using a HubSpot blog.",
        },
        from__replyTo: {
          type: "string",
          description: "The email address used as the 'From' address and default 'Reply-To' address. Must be a verified address in HubSpot.",
        },
        sendOnPublish: {
          type: "boolean",
          description: "If `true` and the email state is set to 'PUBLISHED', the email will be sent immediately. If `false` for a 'PUBLISHED' state, it implies it was already sent or is a template.",
        },
        businessUnitId: {
          type: "string",
          description: "The ID of the business unit this email belongs to. Requires the Business Units add-on for HubSpot.",
        },
        from__fromName: {
          type: "string",
          description: "The sender's name as it appears in the recipient's inbox (e.g., 'Marketing Team').",
        },
        rssData__timing: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary defining the scheduling for RSS emails (e.g., time of day, day of week/month). The structure depends on `blogEmailType`.",
        },
        testing__testId: {
          type: "string",
          description: "The unique identifier of the A/B test, if applicable.",
        },
        content__widgets: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary specifying the configuration and content of various widgets (modules) used in the email.",
        },
        webversion__slug: {
          type: "string",
          description: "The URL slug for the web version of the email (e.g., 'july-newsletter-2024').",
        },
        testing__abStatus: {
          type: "string",
          description: "Status of the AB test (e.g., 'master', 'variant').",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__title: {
          type: "string",
          description: "The title displayed in the browser tab for the web version of the email.",
        },
        content__flexAreas: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary defining content for flexible column areas within drag-and-drop email templates.",
        },
        webversion__domain: {
          type: "string",
          description: "The domain to be used for the web version of this email. If not specified, the default portal domain is used.",
        },
        from__customReplyTo: {
          type: "string",
          description: "A custom email address for replies. If set, this overrides the main `replyTo` address for replies.",
        },
        rssData__blogLayout: {
          type: "string",
          description: "Defines the layout style for displaying blog posts within an RSS email.",
        },
        rssData__maxEntries: {
          type: "integer",
          description: "The maximum number of blog posts to include in a single RSS email.",
        },
        content__smartFields: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of smart fields and their values/configurations used in the email content. Enables personalization based on contact properties.",
        },
        testing__hoursToWait: {
          type: "integer",
          description: "Time limit in hours on gathering test results. After this time is up, the winning version will be sent to the remaining contacts.",
        },
        to__suppressGraymail: {
          type: "boolean",
          description: "If `true`, HubSpot will attempt to avoid sending this email to contacts classified as 'graymail' (low engagement).",
        },
        content__templatePath: {
          type: "string",
          description: "The path to the email template file within the HubSpot Design Manager (e.g., 'marketplace/some_template_name').",
        },
        webversion__expiresAt: {
          type: "string",
          description: "The date and time when the web version link will expire, in ISO 8601 format. After this time, the link may redirect or show an error.",
        },
        rssData__blogEmailType: {
          type: "string",
          description: "Specifies the type of RSS email, such as instant, daily, weekly, or monthly.",
        },
        rssData__hubspotBlogId: {
          type: "string",
          description: "The ID of the HubSpot blog used as the source for an RSS-to-email.",
        },
        to__limitSendFrequency: {
          type: "boolean",
          description: "If `true`, respects HubSpot's send frequency limits for contacts. If `false`, may override these limits.",
        },
        to__contactIds__exclude: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of contact IDs to specifically exclude from receiving this email.",
        },
        to__contactIds__include: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of contact IDs to specifically include as recipients for this email.",
        },
        testing__abSuccessMetric: {
          type: "string",
          description: "Metric to determine the winning version that will be sent to the remaining contacts (e.g., 'CLICKS_BY_OPENS').",
          enum: [
            "CLICKS_BY_OPENS",
            "CLICKS_BY_DELIVERED",
            "OPENS_BY_DELIVERED",
          ],
        },
        content__plainTextVersion: {
          type: "string",
          description: "The plain text version of the email. If omitted, HubSpot may auto-generate it from the HTML content.",
        },
        content__widgetContainers: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary defining the layout and content of widget containers in the email template.",
        },
        rssData__rssEntryTemplate: {
          type: "string",
          description: "The HTML template used to render each individual blog post (entry) in an RSS email.",
        },
        testing__abTestPercentage: {
          type: "integer",
          description: "The percentage of recipients who will be part of the A/B test group (e.g., 50 for 50%).",
        },
        to__contactLists__exclude: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of contact list IDs whose members should be excluded from receiving this email.",
        },
        to__contactLists__include: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of contact list IDs whose members should receive this email.",
        },
        webversion__redirectToUrl: {
          type: "string",
          description: "An external URL to redirect to if the web version link is expired or disabled, used if `redirectToPageId` is not set.",
        },
        rssData__blogImageMaxWidth: {
          type: "integer",
          description: "Maximum width in pixels for images included from an RSS feed in the email.",
        },
        testing__abSamplingDefault: {
          type: "string",
          description: "Version of the email that should be sent if the results are inconclusive after the test period (e.g., 'master', 'variant').",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__metaDescription: {
          type: "string",
          description: "The meta description for the web version of the email, used by search engines.",
        },
        content__themeSettingsValues: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of theme settings overrides for the email template. Allows customization of global theme styles.",
        },
        testing__abSampleSizeDefault: {
          type: "string",
          description: "Version of the email that should be sent if there are too few recipients to conduct an AB test (e.g., 'master', 'variant').",
          enum: [
            "master",
            "variant",
            "loser_variant",
            "mab_master",
            "mab_variant",
            "automated_master",
            "automated_variant",
            "automated_loser_variant",
          ],
        },
        webversion__redirectToPageId: {
          type: "string",
          description: "The ID of a HubSpot-hosted page to redirect to if the web version link is expired or manually disabled.",
        },
        rssData__useHeadlineAsSubject: {
          type: "boolean",
          description: "If `true`, the headline of the latest blog post will be used as the email's subject line for RSS emails.",
        },
        subscriptionDetails__subscriptionId: {
          type: "string",
          description: "The ID of the specific email subscription type (e.g., marketing, newsletter) this email belongs to.",
        },
        subscriptionDetails__officeLocationId: {
          type: "string",
          description: "The ID of the CAN-SPAM office location to be used in the email footer.",
        },
        subscriptionDetails__preferencesGroupId: {
          type: "string",
          description: "The ID of the subscription preferences page/group associated with this email. Allows recipients to manage their preferences.",
        },
      },
      required: [
        "emailId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "marketing_emails",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a marketing email.",
    ],
  }),
  composioTool({
    name: "hubspot_update_batch_feedback_submissions",
    description: "Updates a batch of HubSpot feedback submissions; property keys must be existing internal HubSpot names and values must be correctly formatted strings.",
    toolSlug: "HUBSPOT_UPDATE_BATCH_FEEDBACK_SUBMISSIONS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Unique identifier of the feedback submission, either HubSpot object ID or value of `idProperty`.",
              },
              idProperty: {
                type: "string",
                description: "Name of an alternate unique property to identify the submission; if used, `id` must be the value of this property.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Properties to update; keys are internal HubSpot property names, values are new string values.",
              },
            },
            description: "Defines an individual feedback submission update within a batch.",
          },
          description: "List of feedback submissions to update, each specifying its identifier and new property values.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update batch feedback submissions.",
    ],
  }),
  composioTool({
    name: "hubspot_update_batch_of_objects_by_idor_property_values",
    description: "Performs a batch update on a valid `objectType` where properties are writeable and any `idProperty` used is designated unique; updates can be partial.",
    toolSlug: "HUBSPOT_UPDATE_BATCH_OF_OBJECTS_BY_IDOR_PROPERTY_VALUES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Unique identifier of the object to update, either its HubSpot ID or the value of the unique property specified in `idProperty`.",
              },
              idProperty: {
                type: "string",
                description: "Name of the unique property for object identification if `id` is not the HubSpot object ID; if omitted, `id` is assumed to be the HubSpot object ID.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Dictionary of property internal names to their new values for the update.",
              },
            },
            description: "A single object to be updated within the batch operation.",
          },
          description: "List of objects to update, each detailing the object and its property changes. Max 100 objects per batch.",
        },
        objectType: {
          type: "string",
          description: "Case-sensitive CRM object type to be updated in bulk (e.g., 'contacts', 'p_customobject'), determining the target object set.",
        },
      },
      required: [
        "objectType",
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a batch of objects by id or property values.",
    ],
  }),
  composioTool({
    name: "hubspot_update_calling_app_recording_settings",
    description: "Updates the recording settings, such as the URL for retrieving authenticated recordings, for a specific calling extension app identified by its `appId`.",
    toolSlug: "HUBSPOT_UPDATE_CALLING_APP_RECORDING_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "The unique identifier for the calling app.",
        },
        urlToRetrieveAuthedRecording: {
          type: "string",
          description: "URL HubSpot uses to retrieve call recordings requiring authentication from the calling app.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "recording_settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Update calling app recording settings.",
    ],
  }),
  composioTool({
    name: "hubspot_update_calling_extension_settings",
    description: "Updates settings (e.g., display name, UI URL/dimensions, feature flags) for an existing calling extension app, identified by `appId`.",
    toolSlug: "HUBSPOT_UPDATE_CALLING_EXTENSION_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "URL to the phone/calling UI, which should be built using the HubSpot Calling SDK.",
        },
        name: {
          type: "string",
          description: "User-facing display name of the calling service.",
        },
        appId: {
          type: "integer",
          description: "The unique ID of the target app whose calling extension settings are being modified.",
        },
        width: {
          type: "integer",
          description: "Target width (pixels) of the iframe embedding the phone/calling UI.",
        },
        height: {
          type: "integer",
          description: "Target height (pixels) of the iframe embedding the phone/calling UI.",
        },
        isReady: {
          type: "boolean",
          description: "If `true`, the calling service appears as an option under the 'Call' action in contact records.",
        },
        supportsCustomObjects: {
          type: "boolean",
          description: "Indicates if the calling service is compatible with HubSpot's engagement V2 service and custom objects.",
        },
      },
      required: [
        "appId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "settings",
    ],
    askBefore: [
      "Confirm the parameters before executing Modify calling extension settings.",
    ],
  }),
  composioTool({
    name: "hubspot_update_campaign",
    description: "Partially updates specific, writable properties of an existing HubSpot marketing campaign identified by `campaignGuid`; an empty string value in `properties` clears a property.",
    toolSlug: "HUBSPOT_UPDATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Dictionary of campaign properties to update. Keys are internal property names (e.g., hs_name, hs_campaign_status, hs_start_date), values are their new string values. Values overwrite existing ones. Attempting to update read-only or non-existent properties will result in an error. To clear a property, set it to an empty string.",
        },
        campaignGuid: {
          type: "string",
          description: "Unique identifier (UUID) of the HubSpot marketing campaign to update.",
        },
      },
      required: [
        "campaignGuid",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update campaign.",
    ],
  }),
  composioTool({
    name: "hubspot_update_campaigns",
    description: "Updates properties for up to 50 existing HubSpot marketing campaigns in a single batch operation.",
    toolSlug: "HUBSPOT_UPDATE_CAMPAIGNS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the marketing campaign.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Properties to update for the campaign; an empty string value resets a property. Refer to HubSpot's documentation for available properties.",
              },
            },
            description: "Request schema for `Inputs`",
          },
          description: "A list of campaign objects to update. Each object must include the campaign 'id' and a 'properties' dictionary.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a batch of campaigns.",
    ],
  }),
  composioTool({
    name: "hubspot_update_companies",
    description: "Updates multiple HubSpot companies in a single batch operation.",
    toolSlug: "HUBSPOT_UPDATE_COMPANIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The HubSpot Company ID of the company to be updated.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Properties to update. Only include changes. Use HubSpot internal property names.",
              },
            },
            description: "Individual company update definition for a batch operation.",
          },
          description: "List of company update operations, each specifying company 'id' and 'properties' with new values.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update companies.",
    ],
  }),
  composioTool({
    name: "hubspot_update_company",
    description: "Updates properties for an existing HubSpot company.",
    toolSlug: "HUBSPOT_UPDATE_COMPANY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        companyId: {
          type: "string",
          description: "Unique HubSpot identifier for the company to be updated. Can be provided as a string or number.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Company properties to update. Keys are internal HubSpot property names; use an empty string to clear a property. Common properties and their expected formats: 'name' (string), 'domain' (string, e.g., 'example.com'), 'phone' (string), 'website' (URL string), 'industry' (enum - must use HubSpot's predefined SCREAMING_SNAKE_CASE values, e.g., COMPUTER_SOFTWARE, FINANCIAL_SERVICES, HOSPITAL_HEALTH_CARE, RETAIL, BIOTECHNOLOGY; see HubSpot docs for the full list), 'annualrevenue' (numeric string only, e.g., '150000000' - do NOT include currency symbols, words, or text), 'numberofemployees' (numeric string, e.g., '500'), 'description' (string), 'city' (string), 'state' (string), 'country' (string), 'zip' (string). Read-only properties are ignored.",
        },
      },
      required: [
        "companyId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update company.",
    ],
  }),
  composioTool({
    name: "hubspot_update_contact",
    description: "Updates properties for an existing HubSpot contact.",
    toolSlug: "HUBSPOT_UPDATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contactId: {
          type: "string",
          description: "Unique HubSpot identifier for the contact to be partially updated. Can also be provided as 'contact_id' (snake_case).",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          properties: {
            fax: {
              type: "string",
              description: "Fax number.",
            },
            zip: {
              type: "string",
              description: "Postal/ZIP code of residence.",
            },
            city: {
              type: "string",
              description: "City of residence.",
            },
            email: {
              type: "string",
              description: "Primary email address (HubSpot unique identifier by default).",
            },
            phone: {
              type: "string",
              description: "Primary phone number.",
            },
            state: {
              type: "string",
              description: "State/region of residence.",
            },
            degree: {
              type: "string",
              description: "Highest educational degree.",
            },
            gender: {
              type: "string",
              description: "Gender (e.g., 'Male', 'Female', 'Other').",
            },
            school: {
              type: "string",
              description: "School name attended/attending.",
            },
            address: {
              type: "string",
              description: "Full street address.",
            },
            company: {
              type: "string",
              description: "Company name.",
            },
            country: {
              type: "string",
              description: "Country of residence.",
            },
            message: {
              type: "string",
              description: "General message/note, often from form submission.",
            },
            website: {
              type: "string",
              description: "Personal or company website URL.",
            },
            industry: {
              type: "string",
              description: "Industry of contact or company.",
            },
            jobtitle: {
              type: "string",
              description: "Job title.",
            },
            lastname: {
              type: "string",
              description: "Last name.",
            },
            firstname: {
              type: "string",
              description: "First name.",
            },
            seniority: {
              type: "string",
              description: "Seniority level (e.g., 'Entry-level', 'Manager', 'VP').",
            },
            salutation: {
              type: "string",
              description: "Salutation (e.g., 'Mr.', 'Ms.', 'Dr.').",
            },
            work_email: {
              type: "string",
              description: "Work email address.",
            },
            mobilephone: {
              type: "string",
              description: "Mobile phone number.",
            },
            company_size: {
              type: "string",
              description: "Company size (e.g., '1-10 employees', '500+ employees').",
            },
            job_function: {
              type: "string",
              description: "Job function or department (e.g., 'Marketing', 'Sales', 'Engineering').",
            },
            numemployees: {
              type: "string",
              description: "Number of employees in company (numeric value as string).",
            },
            annualrevenue: {
              type: "string",
              description: "Annual revenue (numeric value stored as string).",
            },
            date_of_birth: {
              type: "string",
              description: "Date of birth (e.g., 'YYYY-MM-DD').",
            },
            field_of_study: {
              type: "string",
              description: "Primary field of academic study.",
            },
            hs_lead_status: {
              type: "string",
              description: "Lead status. Valid values: NEW, OPEN, IN_PROGRESS, OPEN_DEAL, UNQUALIFIED, ATTEMPTED_TO_CONTACT, CONNECTED, BAD_TIMING.",
            },
            lifecyclestage: {
              type: "string",
              description: "Current lifecycle stage. Valid values: subscriber, lead, marketingqualifiedlead, salesqualifiedlead, opportunity, customer, evangelist, other.",
            },
            marital_status: {
              type: "string",
              description: "Marital status (e.g., 'Single', 'Married').",
            },
            graduation_date: {
              type: "string",
              description: "Graduation date (e.g., 'YYYY-MM-DD').",
            },
            hubspot_owner_id: {
              type: "string",
              description: "ID of the HubSpot user owning this contact.",
            },
            hs_additional_emails: {
              type: "string",
              description: "Semicolon-separated additional email addresses.",
            },
          },
          description: "Standard HubSpot contact properties. Use these for common contact fields.",
        },
        custom_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom HubSpot properties to update. Use this for any custom properties you've created in your HubSpot account. Keys must be the internal property names (e.g., 'my_custom_field'). Values must be strings. Use HUBSPOT_LIST_CONTACT_PROPERTIES with custom_only=true to discover available custom property names. These are merged with standard properties before sending to the API.",
        },
      },
      required: [
        "contactId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contact.",
    ],
  }),
  composioTool({
    name: "hubspot_update_contacts",
    description: "Updates multiple HubSpot contacts in a single batch operation.",
    toolSlug: "HUBSPOT_UPDATE_CONTACTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The VID (HubSpot Contact ID) of the contact to be updated.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                properties: {
                  fax: {
                    type: "string",
                    description: "Fax number.",
                  },
                  zip: {
                    type: "string",
                    description: "Postal/ZIP code of residence.",
                  },
                  city: {
                    type: "string",
                    description: "City of residence.",
                  },
                  email: {
                    type: "string",
                    description: "Primary email address (HubSpot unique identifier by default).",
                  },
                  phone: {
                    type: "string",
                    description: "Primary phone number.",
                  },
                  photo: {
                    type: "string",
                    description: "URL to photo/avatar.",
                  },
                  state: {
                    type: "string",
                    description: "State/region of residence.",
                  },
                  degree: {
                    type: "string",
                    description: "Highest educational degree.",
                  },
                  gender: {
                    type: "string",
                    description: "Gender (e.g., 'Male', 'Female', 'Other').",
                  },
                  school: {
                    type: "string",
                    description: "School name attended/attending.",
                  },
                  address: {
                    type: "string",
                    description: "Full street address.",
                  },
                  company: {
                    type: "string",
                    description: "Company name.",
                  },
                  country: {
                    type: "string",
                    description: "Country of residence.",
                  },
                  ip_city: {
                    type: "string",
                    description: "City from IP address (recent interaction).",
                  },
                  message: {
                    type: "string",
                    description: "General message/note, often from form submission.",
                  },
                  website: {
                    type: "string",
                    description: "Personal or company website URL.",
                  },
                  industry: {
                    type: "string",
                    description: "Industry of contact or company.",
                  },
                  ip_state: {
                    type: "string",
                    description: "State/region from IP address.",
                  },
                  jobtitle: {
                    type: "string",
                    description: "Job title.",
                  },
                  lastname: {
                    type: "string",
                    description: "Last name.",
                  },
                  closedate: {
                    type: "string",
                    description: "Close date of associated deal (YYYY-MM-DD or Unix milliseconds).",
                  },
                  firstname: {
                    type: "string",
                    description: "First name.",
                  },
                  ip_latlon: {
                    type: "string",
                    description: "Approximate latitude,longitude from IP address.",
                  },
                  num_notes: {
                    type: "string",
                    description: "Total associated notes (numeric value as string).",
                  },
                  ownername: {
                    type: "string",
                    description: "Full name of owning HubSpot user.",
                  },
                  seniority: {
                    type: "string",
                    description: "Seniority level (e.g., 'Entry-level', 'Manager', 'VP').",
                  },
                  createdate: {
                    type: "string",
                    description: "Record creation date (ISO 8601 or Unix milliseconds).",
                  },
                  ip_country: {
                    type: "string",
                    description: "Country from IP address.",
                  },
                  ip_zipcode: {
                    type: "string",
                    description: "Postal/ZIP code from IP address.",
                  },
                  owneremail: {
                    type: "string",
                    description: "Email address of owning HubSpot user.",
                  },
                  salutation: {
                    type: "string",
                    description: "Salutation (e.g., 'Mr.', 'Ms.', 'Dr.').",
                  },
                  start_date: {
                    type: "string",
                    description: "Start date (job/program, e.g., 'YYYY-MM-DD').",
                  },
                  twitterbio: {
                    type: "string",
                    description: "Twitter profile biography.",
                  },
                  work_email: {
                    type: "string",
                    description: "Work email address.",
                  },
                  linkedinbio: {
                    type: "string",
                    description: "LinkedIn profile biography.",
                  },
                  mobilephone: {
                    type: "string",
                    description: "Mobile phone number.",
                  },
                  company_size: {
                    type: "string",
                    description: "Company size (e.g., '1-10 employees', '500+ employees').",
                  },
                  hubspotscore: {
                    type: "string",
                    description: "HubSpot lead score (numeric value as string).",
                  },
                  job_function: {
                    type: "string",
                    description: "Job function or department (e.g., 'Marketing', 'Sales', 'Engineering').",
                  },
                  numemployees: {
                    type: "string",
                    description: "Number of employees in company (numeric value as string).",
                  },
                  annualrevenue: {
                    type: "string",
                    description: "Annual revenue (numeric value stored as string).",
                  },
                  date_of_birth: {
                    type: "string",
                    description: "Date of birth (e.g., 'YYYY-MM-DD').",
                  },
                  days_to_close: {
                    type: "string",
                    description: "Days to close associated deal (numeric value as string).",
                  },
                  followercount: {
                    type: "string",
                    description: "Social media follower count (numeric value as string).",
                  },
                  ip_state_code: {
                    type: "string",
                    description: "State/region code from IP address (e.g., 'CA', 'NY').",
                  },
                  total_revenue: {
                    type: "string",
                    description: "Total revenue from associated deals (numeric value as string).",
                  },
                  twitterhandle: {
                    type: "string",
                    description: "Twitter username (handle), without '@'.",
                  },
                  field_of_study: {
                    type: "string",
                    description: "Primary field of academic study.",
                  },
                  hs_lead_status: {
                    type: "string",
                    description: "Lead status indicating the current state of the lead. Valid values (case-sensitive, must be uppercase): NEW, OPEN, IN_PROGRESS, OPEN_DEAL, UNQUALIFIED, ATTEMPTED_TO_CONTACT, CONNECTED, BAD_TIMING. Input is automatically converted to uppercase.",
                  },
                  lifecyclestage: {
                    type: "string",
                    description: "Current marketing/sales funnel stage. Must be a valid lifecycle stage in your HubSpot instance.",
                  },
                  marital_status: {
                    type: "string",
                    description: "Marital status (e.g., 'Single', 'Married').",
                  },
                  graduation_date: {
                    type: "string",
                    description: "Graduation date (e.g., 'YYYY-MM-DD').",
                  },
                  hs_all_team_ids: {
                    type: "string",
                    description: "Semicolon-separated IDs of all teams the contact is a member of or assigned to.",
                  },
                  hubspot_team_id: {
                    type: "string",
                    description: "ID of the HubSpot team for the contact or owner.",
                  },
                  ip_country_code: {
                    type: "string",
                    description: "Country code from IP address (e.g., 'US', 'GB').",
                  },
                  military_status: {
                    type: "string",
                    description: "Military status.",
                  },
                  hs_all_owner_ids: {
                    type: "string",
                    description: "Semicolon-separated IDs of all assigned owners.",
                  },
                  hubspot_owner_id: {
                    type: "string",
                    description: "ID of the HubSpot user owning this contact.",
                  },
                  lastmodifieddate: {
                    type: "string",
                    description: "Record last modification date (ISO 8601 or Unix milliseconds).",
                  },
                  kloutscoregeneral: {
                    type: "string",
                    description: "Klout score, if available (numeric value as string).",
                  },
                  notes_last_updated: {
                    type: "string",
                    description: "Timestamp of last note update (often Unix milliseconds).",
                  },
                  recent_deal_amount: {
                    type: "string",
                    description: "Amount of most recent associated deal (numeric value as string).",
                  },
                  associatedcompanyid: {
                    type: "string",
                    description: "ID of the primary associated company.",
                  },
                  currentlyinworkflow: {
                    type: "string",
                    description: "Boolean (as string 'true'/'false') indicating if currently in any HubSpot workflow.",
                  },
                  hs_all_contact_vids: {
                    type: "string",
                    description: "Semicolon-separated known associated HubSpot contact IDs (VIDs), e.g., if merged.",
                  },
                  hs_analytics_source: {
                    type: "string",
                    description: "Original contact source (e.g., 'Organic Search', 'Paid Social', 'Direct Traffic').",
                  },
                  linkedinconnections: {
                    type: "string",
                    description: "Number of LinkedIn connections (numeric value as string).",
                  },
                  num_contacted_notes: {
                    type: "string",
                    description: "Number of notes about contacting this contact (numeric value as string).",
                  },
                  relationship_status: {
                    type: "string",
                    description: "Relationship status (e.g. 'Single', 'In a relationship').",
                  },
                  twitterprofilephoto: {
                    type: "string",
                    description: "URL to Twitter profile photo.",
                  },
                  hs_additional_emails: {
                    type: "string",
                    description: "Semicolon-separated additional email addresses (e.g., 'email1@example.com;email2@example.com').",
                  },
                  hs_analytics_revenue: {
                    type: "string",
                    description: "Revenue attributed via HubSpot analytics (numeric value as string).",
                  },
                  notes_last_contacted: {
                    type: "string",
                    description: "Timestamp of last logged contact (often Unix milliseconds).",
                  },
                  num_associated_deals: {
                    type: "string",
                    description: "Number of currently associated deals (numeric value as string).",
                  },
                  first_conversion_date: {
                    type: "string",
                    description: "Timestamp of first conversion (often Unix milliseconds).",
                  },
                  hs_analytics_last_url: {
                    type: "string",
                    description: "Last URL visited during most recent session.",
                  },
                  num_conversion_events: {
                    type: "string",
                    description: "Total recorded conversion events (numeric value as string).",
                  },
                  hs_analytics_first_url: {
                    type: "string",
                    description: "First URL visited on your website.",
                  },
                  recent_conversion_date: {
                    type: "string",
                    description: "Timestamp of most recent conversion (often Unix milliseconds).",
                  },
                  recent_deal_close_date: {
                    type: "string",
                    description: "Close date of most recent deal (Unix ms or YYYY-MM-DD).",
                  },
                  first_deal_created_date: {
                    type: "string",
                    description: "Timestamp of first deal creation (often Unix milliseconds).",
                  },
                  hs_analytics_num_visits: {
                    type: "string",
                    description: "Total website sessions (visits) (numeric value as string).",
                  },
                  webinareventlastupdated: {
                    type: "string",
                    description: "Timestamp of last webinar platform event update (often Unix milliseconds).",
                  },
                  notes_next_activity_date: {
                    type: "string",
                    description: "Timestamp of next scheduled activity (often Unix milliseconds).",
                  },
                  hs_all_accessible_team_ids: {
                    type: "string",
                    description: "Semicolon-separated IDs of all teams with access to the contact record.",
                  },
                  hs_analytics_last_referrer: {
                    type: "string",
                    description: "Last external referrer URL before most recent session/conversion.",
                  },
                  hs_analytics_source_data_1: {
                    type: "string",
                    description: "Additional source data (e.g., specific campaign name or search term).",
                  },
                  hs_analytics_source_data_2: {
                    type: "string",
                    description: "Further additional source data (e.g., ad group or specific link clicked).",
                  },
                  hubspot_owner_assigneddate: {
                    type: "string",
                    description: "Timestamp of HubSpot owner assignment (often Unix milliseconds).",
                  },
                  first_conversion_event_name: {
                    type: "string",
                    description: "Event name for first conversion (e.g., form name).",
                  },
                  hs_analytics_first_referrer: {
                    type: "string",
                    description: "First external referrer URL.",
                  },
                  hs_analytics_last_timestamp: {
                    type: "string",
                    description: "Timestamp of most recent interaction with website/tracked assets (often Unix milliseconds).",
                  },
                  hs_analytics_num_page_views: {
                    type: "string",
                    description: "Total page views across all sessions (numeric value as string).",
                  },
                  associatedcompanylastupdated: {
                    type: "string",
                    description: "Timestamp of last update to primary associated company (often Unix milliseconds).",
                  },
                  hs_analytics_first_timestamp: {
                    type: "string",
                    description: "Timestamp of first interaction with website/tracked assets (often Unix milliseconds).",
                  },
                  num_unique_conversion_events: {
                    type: "string",
                    description: "Number of unique types of conversion events (numeric value as string).",
                  },
                  recent_conversion_event_name: {
                    type: "string",
                    description: "Event name for most recent conversion.",
                  },
                  surveymonkeyeventlastupdated: {
                    type: "string",
                    description: "Timestamp of last SurveyMonkey event update (often Unix milliseconds).",
                  },
                  engagements_last_meeting_booked: {
                    type: "string",
                    description: "Timestamp of last booked meeting (often Unix milliseconds).",
                  },
                  hs_analytics_average_page_views: {
                    type: "string",
                    description: "Average page views per session (numeric value as string).",
                  },
                  hs_all_assigned_business_unit_ids: {
                    type: "string",
                    description: "Semicolon-separated IDs of all assigned business units.",
                  },
                  hs_analytics_last_visit_timestamp: {
                    type: "string",
                    description: "Timestamp of most recent website visit (often Unix milliseconds).",
                  },
                  hs_analytics_first_visit_timestamp: {
                    type: "string",
                    description: "Timestamp of first website visit (often Unix milliseconds).",
                  },
                  hs_analytics_num_event_completions: {
                    type: "string",
                    description: "Total HubSpot marketing events completed (numeric value as string).",
                  },
                  engagements_last_meeting_booked_medium: {
                    type: "string",
                    description: "Medium for last booked meeting (e.g., 'email', 'organic').",
                  },
                  engagements_last_meeting_booked_source: {
                    type: "string",
                    description: "Source for last booked meeting (e.g., 'Forms', 'Meetings').",
                  },
                  engagements_last_meeting_booked_campaign: {
                    type: "string",
                    description: "Campaign GUID for last booked meeting.",
                  },
                  hs_analytics_last_touch_converting_campaign: {
                    type: "string",
                    description: "GUID of HubSpot campaign for last touch conversion.",
                  },
                  hs_analytics_first_touch_converting_campaign: {
                    type: "string",
                    description: "GUID of HubSpot campaign for first touch conversion.",
                  },
                },
                description: "Standard HubSpot contact properties to update. Use typed fields like firstname, lastname, email, phone, company, lifecyclestage, hs_lead_status, etc. Only include the properties you want to change.",
              },
              custom_properties: {
                type: "object",
                additionalProperties: true,
                description: "Custom HubSpot properties to update. Use this for any custom properties you've created in your HubSpot account. Keys must be the internal property names (e.g., 'my_custom_field'). Values must be strings. Use HUBSPOT_LIST_CONTACT_PROPERTIES with custom_only=true to discover available custom property names. These are merged with standard properties before sending to the API.",
              },
            },
            description: "Individual contact update definition for a batch operation.",
          },
          description: "List of contact update operations, each specifying contact 'id' (VID) and 'properties' with new values.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contacts.",
    ],
  }),
  composioTool({
    name: "hubspot_update_crm_property",
    description: "Updates attributes of an existing HubSpot CRM property, identified by its `objectType` and `propertyName`; only provided fields are modified, and changing a property's `type` can cause data loss if incompatible with existing data.",
    toolSlug: "HUBSPOT_UPDATE_CRM_PROPERTY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "New data type for the property. Modifying the `type` of an existing property with data can cause data loss; use with caution.",
          enum: [
            "string",
            "number",
            "date",
            "datetime",
            "enumeration",
            "bool",
          ],
        },
        label: {
          type: "string",
          description: "New human-readable label for the property, displayed in the HubSpot UI.",
        },
        hidden: {
          type: "boolean",
          description: "If true, hides the property in the HubSpot UI, making it not generally visible or usable in standard interfaces.",
        },
        options: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              label: {
                type: "string",
                description: "User-friendly label displayed in the HubSpot UI for this option (e.g., 'High Priority').",
              },
              value: {
                type: "string",
                description: "Internal, machine-readable value for this option (e.g., 'high_priority'), used when programmatically setting the property's value via API.",
              },
              hidden: {
                type: "boolean",
                description: "If true, this option is hidden in HubSpot selection UIs.",
              },
              description: {
                type: "string",
                description: "Optional detailed description for this option, providing additional context in HubSpot.",
              },
              displayOrder: {
                type: "integer",
                description: "Sort order for this option relative to others. Lower positive integers display first; -1 typically places it after positively ordered options.",
              },
            },
            description: "Defines a single option for an enumeration-type property.",
          },
          description: "List of new option definitions if property `type` is 'enumeration'; supplying a new list overwrites existing options.",
        },
        fieldType: {
          type: "string",
          description: "New field type controlling how the property is displayed and interacted with in the HubSpot UI.",
          enum: [
            "textarea",
            "text",
            "date",
            "file",
            "number",
            "select",
            "radio",
            "checkbox",
            "booleancheckbox",
            "calculation_equation",
          ],
        },
        formField: {
          type: "boolean",
          description: "If true, allows this property to be included as a field in HubSpot forms and available in the form editor.",
        },
        groupName: {
          type: "string",
          description: "New internal name of the property group for this property; groups help organize properties in the HubSpot UI.",
        },
        objectType: {
          type: "string",
          description: "Type of CRM object for which the property is being updated; this determines its context.",
        },
        description: {
          type: "string",
          description: "New description for the property, displayed as help text in the HubSpot UI.",
        },
        displayOrder: {
          type: "integer",
          description: "New display order for the property within its group. Lower positive integers appear first; -1 typically places it after positively numbered properties.",
        },
        propertyName: {
          type: "string",
          description: "Internal name of the property to update (case-sensitive); must correspond to an existing property for the specified `objectType`.",
        },
        calculationFormula: {
          type: "string",
          description: "New formula if `fieldType` is 'calculation_equation'; defines how its value is auto-computed. Ensure valid HubSpot calculation syntax.",
        },
      },
      required: [
        "objectType",
        "propertyName",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "Confirm the parameters before executing Update specific CRM property.",
    ],
  }),
  composioTool({
    name: "hubspot_update_deal",
    description: "Updates properties for an existing HubSpot deal.",
    toolSlug: "HUBSPOT_UPDATE_DEAL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        dealId: {
          type: "string",
          description: "Unique HubSpot identifier for the deal to be updated.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Deal properties to update. Must contain at least one property. Keys are internal HubSpot property names; use empty string to clear a property. IMPORTANT - Some properties require specific internal HubSpot IDs: (1) 'dealstage' and 'pipeline' require internal IDs (not human-readable labels). (2) 'hubspot_owner_id' requires a valid HubSpot user/owner ID. Common text/numeric properties: dealname (string), amount (decimal string), closedate (YYYY-MM-DD or ISO 8601), description (string), deal_currency_code (3-letter currency code like 'USD'). Enum/select properties have case-sensitive values - use exact values as defined in HubSpot. Use HUBSPOT_READ_A_CRM_PROPERTY_BY_NAME to retrieve valid enum options for any property.",
        },
      },
      required: [
        "dealId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update deal.",
    ],
  }),
  composioTool({
    name: "hubspot_update_deals",
    description: "Updates multiple HubSpot deals in a single batch operation.",
    toolSlug: "HUBSPOT_UPDATE_DEALS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The HubSpot Deal ID to be updated.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Properties to update. Only include changes. IMPORTANT for 'dealstage': Use lowercase internal stage IDs, not display names. Default pipeline valid values: 'appointmentscheduled', 'qualifiedtobuy', 'presentationscheduled', 'decisionmakerboughtin', 'contractsent', 'closedwon', 'closedlost'. Custom pipelines use numeric stage IDs (e.g., '2317386479'). Common display names like 'Closed Won' are automatically converted to internal IDs.",
              },
            },
            description: "Individual deal update definition for a batch operation.",
          },
          description: "List of deal update operations.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update deals.",
    ],
  }),
  composioTool({
    name: "hubspot_update_email",
    description: "Partially updates properties of an existing HubSpot email object, identified by `emailId` (as internal ID or custom unique property value if `idProperty` is given); the object must exist.",
    toolSlug: "HUBSPOT_UPDATE_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emailId: {
          type: "string",
          description: "Identifier of the email object. This is its internal HubSpot ID, or a custom unique property value if `idProperty` is also provided.",
        },
        idProperty: {
          type: "string",
          description: "Name of a unique HubSpot property for emails. If specified, `emailId` must be the value of this unique property, not the internal HubSpot ID.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Property names and new values for the email. Values overwrite existing ones; an empty string clears a property. Read-only or non-existent properties are ignored.",
        },
      },
      required: [
        "emailId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing UpdateEmail Email.",
    ],
  }),
  composioTool({
    name: "hubspot_update_emails",
    description: "Updates multiple HubSpot emails in a single batch operation.",
    toolSlug: "HUBSPOT_UPDATE_EMAILS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The HubSpot Email ID to be updated.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Properties to update. Only include changes.",
              },
            },
            description: "Individual email update definition for a batch operation.",
          },
          description: "List of email update operations.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update emails.",
    ],
  }),
  composioTool({
    name: "hubspot_update_event_template",
    description: "Updates an existing HubSpot event template's name, display templates, and tokens; providing `tokens` replaces the entire existing list, and the `id` in the request body must match `eventTemplateId` in the path.",
    toolSlug: "HUBSPOT_UPDATE_EVENT_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Unique identifier of the event template; must match `eventTemplateId` in the URL path.",
        },
        name: {
          type: "string",
          description: "New name for the event template.",
        },
        appId: {
          type: "integer",
          description: "ID of the application associated with the event template.",
        },
        tokens: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              name: {
                type: "string",
                description: "Name of the token referenced in templates. Must be unique for the template and only contain alphanumeric characters, periods, dashes, or underscores.",
              },
              type: {
                type: "string",
                description: "Data type of the token (`string`, `number`, `date`, or `enumeration`).",
                enum: [
                  "date",
                  "enumeration",
                  "number",
                  "string",
                ],
              },
              label: {
                type: "string",
                description: "User-friendly label for the token, for display in HubSpot (e.g., list segmentation, reporting).",
              },
              options: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    label: {
                      type: "string",
                      description: "User-facing label for the enumeration option.",
                    },
                    value: {
                      type: "string",
                      description: "Internal or programmatic value of the enumeration option.",
                    },
                  },
                  description: "Request schema for `Options`",
                },
                description: "List of selectable options, required if token `type` is `enumeration`.",
              },
              createdAt: {
                type: "string",
                description: "Timestamp of when the Event Template Token was created. Informational and may be null if created before February 18th, 2020.",
              },
              updatedAt: {
                type: "string",
                description: "Timestamp of when the Event Template Token was last updated. Informational and may be null if created before February 18th, 2020.",
              },
              objectPropertyName: {
                type: "string",
                description: "Name of the CRM object property to populate, allowing CRM object construction via the Timeline API.",
              },
            },
            description: "Request schema for `Tokens`",
          },
          description: "List of token definitions; replaces all existing tokens for the template.",
        },
        detailTemplate: {
          type: "string",
          description: "Markdown for the event's detailed timeline view, using Handlebars for dynamic data (e.g., `{{token_name}}`).",
        },
        headerTemplate: {
          type: "string",
          description: "Markdown for the event's header on the timeline, using Handlebars for dynamic data (e.g., `{{token_name}}`).",
        },
        eventTemplateId: {
          type: "string",
          description: "Unique identifier of the event template to update.",
        },
      },
      required: [
        "eventTemplateId",
        "appId",
        "name",
        "tokens",
        "id",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Update existing event template.",
    ],
  }),
  composioTool({
    name: "hubspot_update_feedback_submission",
    description: "Partially updates writable properties of an existing HubSpot Feedback Submission, identified by its `feedbackSubmissionId` (which can be an internal object ID, or a unique property value if `idProperty` is specified).",
    toolSlug: "HUBSPOT_UPDATE_FEEDBACK_SUBMISSION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        idProperty: {
          type: "string",
          description: "The name of a unique property used to identify the Feedback Submission. If provided, `feedbackSubmissionId` must contain the value of this property, instead of the internal object ID. This property must be a unique identifier for Feedback Submission objects.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of properties to update on the Feedback Submission. Keys are the internal names of the properties, and values are their new string values. Only properties included here will be modified; others will remain unchanged.",
        },
        feedbackSubmissionId: {
          type: "string",
          description: "The unique identifier of the Feedback Submission to update. This can be its internal object ID or a unique property value if `idProperty` is specified. Must be a non-empty string.",
        },
      },
      required: [
        "feedbackSubmissionId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update feedback submission by id.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "hubspot_update_line_item",
    description: "Partially updates specified properties of an existing HubSpot Line Item, identified by `lineItemId` (as HubSpot object ID or value of `idProperty` if used); new values overwrite existing ones, and an empty string clears a property.",
    toolSlug: "HUBSPOT_UPDATE_LINE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        idProperty: {
          type: "string",
          description: "Name of a unique property on the Line Item used for identification instead of HubSpot object ID. If used, `lineItemId` must contain this property's value. Must be a valid, unique-value property for Line Items.",
        },
        lineItemId: {
          type: "string",
          description: "Identifier for the Line Item to update: HubSpot object ID by default, or the value of the unique property if `idProperty` is specified. Must be non-empty.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Properties to update. Keys are internal HubSpot line item property names (e.g., 'quantity', 'price'), values are new string values. Example: `{'quantity': '5', 'name': 'New Product Name'}`.",
        },
      },
      required: [
        "lineItemId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update line item object partially.",
    ],
  }),
  composioTool({
    name: "hubspot_update_line_items",
    description: "Updates a batch of existing HubSpot CRM line items in a single operation, identifying each by its primary ID or a unique `idProperty` (which must be a unique identifier property in HubSpot), and modifies their specified properties.",
    toolSlug: "HUBSPOT_UPDATE_LINE_ITEMS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "Identifier of the line item to update. If `idProperty` is specified, this is its value; otherwise, it's the line item's primary object ID.",
              },
              idProperty: {
                type: "string",
                description: "Name of a unique property for identifying the line item. If provided, `id` must be this property's value; otherwise, `id` is the line item's primary object ID.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Dictionary of properties to update for the line item: keys are internal property names, values are their new values.",
              },
            },
            description: "Defines a single line item update operation within a batch request.",
          },
          description: "A list of objects, where each object defines a line item to be updated and its new property values. Each object must conform to the InputsRequest schema.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update a batch of line items.",
    ],
  }),
  composioTool({
    name: "hubspot_update_object_schema",
    description: "Updates an existing custom object schema's metadata in HubSpot, such as its description, labels, display properties, required properties, searchable properties, and restorability, for a specified `objectType` that must already exist.",
    toolSlug: "HUBSPOT_UPDATE_OBJECT_SCHEMA",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        objectType: {
          type: "string",
          description: "The fully qualified name or object type ID that uniquely identifies the custom object schema to be updated. This must correspond to an existing schema in your HubSpot account.",
        },
        restorable: {
          type: "boolean",
          description: "A boolean indicating whether records of this object type can be restored from the recycle bin if deleted. Set to `true` to enable restoration, `false` otherwise.",
        },
        description: {
          type: "string",
          description: "A human-readable description for the custom object schema itself.",
        },
        labels__plural: {
          type: "string",
          description: "The plural display name for the custom object type (e.g., 'Companies', 'Tickets'), used in the HubSpot UI for multiple records of this type.",
        },
        labels__singular: {
          type: "string",
          description: "The singular display name for the custom object type (e.g., 'Company', 'Ticket'), used in the HubSpot UI for a single record of this type.",
        },
        requiredProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of internal names of properties that are mandatory when creating a new record of this object type.",
        },
        searchableProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of internal names of properties that will be indexed and searchable within HubSpot's product search for this object type.",
        },
        primaryDisplayProperty: {
          type: "string",
          description: "The internal name of the property that will serve as the primary display identifier on the HubSpot record page for this object type. This is typically a unique identifier like a name or ID.",
        },
        secondaryDisplayProperties: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of internal names of properties to be displayed as secondary information on the HubSpot record page for this object type. These properties appear below the primary display property.",
        },
      },
      required: [
        "objectType",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "core",
    ],
    askBefore: [
      "Confirm the parameters before executing Update existing object schema.",
    ],
  }),
  composioTool({
    name: "hubspot_update_pipeline",
    description: "Partially updates a CRM pipeline's label, display order, or restores an archived pipeline by setting `archived` to `false`.",
    toolSlug: "HUBSPOT_UPDATE_PIPELINE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "Unique label for the pipeline for UI organization.",
        },
        archived: {
          type: "boolean",
          description: "To restore an archived pipeline, set to `false`. Other uses (e.g., archiving an active pipeline or setting `false` for an already active one) will result in a `400 Bad Request`.",
        },
        objectType: {
          type: "string",
          description: "Type of CRM object the pipeline is associated with (e.g., 'deals', 'tickets').",
        },
        pipelineId: {
          type: "string",
          description: "Unique identifier of the pipeline to update.",
        },
        displayOrder: {
          type: "integer",
          description: "Display order for the pipeline. Pipelines with the same order are sorted alphabetically by label.",
        },
        validateReferencesBeforeDelete: {
          type: "boolean",
          description: "If `true`, verify existing references to pipeline stages before updates that could delete or alter them.",
        },
        validateDealStageUsagesBeforeDelete: {
          type: "boolean",
          description: "For deal pipelines only: if `true`, check if any deals use stages affected by the update.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipelines",
    ],
    askBefore: [
      "Confirm the parameters before executing Partially update pipeline by id.",
    ],
  }),
  composioTool({
    name: "hubspot_update_pipeline_stage",
    description: "Partially updates a HubSpot CRM pipeline stage identified by `objectType`, `pipelineId`, and `stageId`, requiring `metadata` in the request; unspecified fields are unchanged.",
    toolSlug: "HUBSPOT_UPDATE_PIPELINE_STAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "The display name (label) of the pipeline stage. This label must be unique within the pipeline it belongs to. Omit to leave unchanged.",
        },
        stageId: {
          type: "string",
          description: "Unique identifier of the pipeline stage to update; must exist within the specified `pipelineId`.",
        },
        archived: {
          type: "boolean",
          description: "Set to `true` to archive the pipeline stage, `false` to unarchive. If omitted, its archival status remains unchanged.",
        },
        metadata: {
          type: "object",
          additionalProperties: true,
          description: "Stage-specific metadata (key-value string pairs) based on `objectType`. Omit to leave unchanged.\n- For 'deals': If provided, MUST include 'probability' (string '0.0'-'1.0', e.g., '0.7', in '0.1' increments).\n- For 'tickets': Optional 'ticketState' ('OPEN' or 'CLOSED').\n- For other object types, an empty `{}` may be used.",
        },
        objectType: {
          type: "string",
          description: "Type of CRM object (e.g., 'deals', 'tickets') for the pipeline; must be a valid HubSpot object type that supports pipelines.",
        },
        pipelineId: {
          type: "string",
          description: "Unique identifier of the pipeline (specific to the HubSpot account and `objectType`) containing the stage to update; must refer to an existing pipeline.",
        },
        displayOrder: {
          type: "integer",
          description: "The display order for this pipeline stage. If multiple stages share the same `displayOrder`, they are sorted alphabetically by `label`. Lower numbers appear first. Omit to leave unchanged.",
        },
      },
      required: [
        "objectType",
        "pipelineId",
        "stageId",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "pipeline_stages",
    ],
    askBefore: [
      "Confirm the parameters before executing Update pipeline stage by ids.",
    ],
  }),
  composioTool({
    name: "hubspot_update_product",
    description: "Updates properties for an existing HubSpot product.",
    toolSlug: "HUBSPOT_UPDATE_PRODUCT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        productId: {
          type: "string",
          description: "Unique HubSpot identifier for the product to be updated.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Product properties to update. Keys are internal HubSpot property names.",
        },
      },
      required: [
        "productId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update product.",
    ],
  }),
  composioTool({
    name: "hubspot_update_products",
    description: "Updates multiple HubSpot products in a single batch operation.",
    toolSlug: "HUBSPOT_UPDATE_PRODUCTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The HubSpot Product ID to be updated.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Properties to update. Only include changes.",
              },
            },
            description: "Individual product update definition for a batch operation.",
          },
          description: "List of product update operations.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update products.",
    ],
  }),
  composioTool({
    name: "hubspot_update_property_group",
    description: "Partially updates a property group's `displayOrder` or `label` for a specified CRM `objectType` in HubSpot.",
    toolSlug: "HUBSPOT_UPDATE_PROPERTY_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        label: {
          type: "string",
          description: "Human-readable label for the property group in the UI. If omitted, the current label is unchanged.",
        },
        groupName: {
          type: "string",
          description: "The unique, case-sensitive internal name of the existing property group to be updated for the specified `objectType`.",
        },
        objectType: {
          type: "string",
          description: "The CRM object type (e.g., \"contacts\", \"companies\") for which the property group is updated; must be a valid HubSpot CRM object type.",
        },
        displayOrder: {
          type: "integer",
          description: "Order for displaying the property group: lowest positive integer first, -1 places it after positive values. If omitted, the current order is unchanged.",
        },
      },
      required: [
        "objectType",
        "groupName",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "groups",
    ],
    askBefore: [
      "Confirm the parameters before executing Partially update property group.",
    ],
  }),
  composioTool({
    name: "hubspot_update_quote",
    description: "Performs a partial update on an existing HubSpot quote's specified properties, identifying the quote by `quoteId` (either its internal ID or a custom unique property value if `idProperty` is provided).",
    toolSlug: "HUBSPOT_UPDATE_QUOTE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        quoteId: {
          type: "string",
          description: "Unique identifier of the quote. Typically an internal HubSpot object ID, or a unique property value if `idProperty` is specified.",
        },
        idProperty: {
          type: "string",
          description: "Optional. Name of a unique quote property. If provided, `quoteId` is interpreted as this property's value, not the internal object ID.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Properties to update on the quote (internal property names to new values). Only included properties will be updated.",
        },
      },
      required: [
        "quoteId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Partial update quote by quote id.",
    ],
  }),
  composioTool({
    name: "hubspot_update_ticket",
    description: "Updates properties for an existing HubSpot ticket.",
    toolSlug: "HUBSPOT_UPDATE_TICKET",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ticketId: {
          type: "string",
          description: "Unique HubSpot identifier for the ticket to be updated.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Ticket properties to update. Keys are internal HubSpot property names. Values can be strings, numbers, or booleans - they will be automatically converted to strings as required by HubSpot API.",
        },
      },
      required: [
        "ticketId",
        "properties",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "basic",
    ],
    askBefore: [
      "Confirm the parameters before executing Update ticket.",
    ],
  }),
  composioTool({
    name: "hubspot_update_tickets",
    description: "Updates multiple HubSpot tickets in a single batch operation.",
    toolSlug: "HUBSPOT_UPDATE_TICKETS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        inputs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The HubSpot Ticket ID to be updated.",
              },
              properties: {
                type: "object",
                additionalProperties: true,
                description: "Properties to update. Only include changes.",
              },
            },
            description: "Individual ticket update definition for a batch operation.",
          },
          description: "List of ticket update operations.",
        },
      },
      required: [
        "inputs",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "batch",
    ],
    askBefore: [
      "Confirm the parameters before executing Update tickets.",
    ],
  }),
  composioTool({
    name: "hubspot_update_token_on_event_template",
    description: "Updates the label or options of an existing token within a specified HubSpot CRM event template; token name and data type remain unchanged.",
    toolSlug: "HUBSPOT_UPDATE_TOKEN_ON_EVENT_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "Unique identifier (ID) of the application associated with the event template and token.",
        },
        label: {
          type: "string",
          description: "New human-readable label for the token, displayed in UIs and used for segmentation/reporting.",
        },
        options: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              label: {
                type: "string",
                description: "The display label for this option. This is what users will see in interfaces.",
              },
              value: {
                type: "string",
                description: "The internal value stored when this option is selected. This value is used by the system.",
              },
            },
            description: "Represents a single option for an enumeration token, containing a display label and an internal value.",
          },
          description: "List of option objects defining selectable choices, applicable only if the token's type is 'enumeration'. Required to modify options for an enumeration type token.",
        },
        tokenName: {
          type: "string",
          description: "Name of the token to update within the specified event template; must match an existing token's name.",
        },
        eventTemplateId: {
          type: "string",
          description: "Unique identifier (ID) of the event template containing the token to update.",
        },
        objectPropertyName: {
          type: "string",
          description: "Name of the CRM object property this token populates, linking its value to a CRM object property. If null, no direct mapping.",
        },
      },
      required: [
        "eventTemplateId",
        "tokenName",
        "appId",
        "label",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "tokens",
    ],
    askBefore: [
      "Confirm the parameters before executing Update token on event template.",
    ],
  }),
  composioTool({
    name: "hubspot_update_video_conference_app_settings",
    description: "Updates webhook URLs (for creating/updating/deleting meetings, fetching accounts, verifying users) for a video conference application specified by `appId`. Requires developer API key authentication. All URLs must use HTTPS protocol and be publicly accessible.",
    toolSlug: "HUBSPOT_UPDATE_VIDEO_CONFERENCE_APP_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        appId: {
          type: "integer",
          description: "Unique identifier for the video conference application in HubSpot, assigned upon creation in the developer portal. Example: 12345.",
        },
        userVerifyUrl: {
          type: "string",
          description: "URL HubSpot uses to verify a user's existence and authentication with the video conference app, confirming identity before certain actions.",
        },
        createMeetingUrl: {
          type: "string",
          description: "URL HubSpot uses to send requests for creating new video conference meetings. Must use HTTPS protocol.",
        },
        deleteMeetingUrl: {
          type: "string",
          description: "URL HubSpot uses to notify the video conference app when an integrated meeting is deleted in HubSpot.",
        },
        fetchAccountsUri: {
          type: "string",
          description: "URL HubSpot uses to fetch user accounts from the video conference app, enabling users to select from multiple accounts if available.",
        },
        updateMeetingUrl: {
          type: "string",
          description: "URL HubSpot uses to send updates for existing meetings, e.g., when details like topic or schedule are modified within HubSpot.",
        },
      },
      required: [
        "appId",
        "createMeetingUrl",
      ],
    },
    tags: [
      "composio",
      "hubspot",
      "write",
      "settings",
      "developerapikeyrequired",
    ],
    askBefore: [
      "Confirm the parameters before executing Update video conference app settings.",
    ],
    idempotent: true,
  }),
];
