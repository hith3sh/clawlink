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
    integration: "klaviyo",
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
      toolkit: "klaviyo",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const klaviyoComposioTools: IntegrationTool[] = [
  composioTool({
    name: "klaviyo_add_profile_to_list",
    description: "Add profiles to a Klaviyo list by profile IDs or email addresses. This action subscribes profiles to a marketing list, which is ideal for giving marketing consent. You can add up to 1000 profiles per call using either their Klaviyo profile IDs or email addresses. Rate limits: 10/s burst, 150/m steady. Required scopes: `lists:write` and `profiles:write`. Preconditions: - Either profile_ids or emails must be provided (not both) - Maximum 1000 profiles per call - Email addresses must be valid format - The list must exist and be accessible",
    toolSlug: "KLAVIYO_ADD_PROFILE_TO_LIST",
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
          description: "List of email addresses to add to the list (alternative to profile_ids)",
        },
        list_id: {
          type: "string",
          description: "The ID of the list to add profiles to",
        },
        profile_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of profile IDs to add to the list (max 1000 per call)",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Profile to List.",
    ],
  }),
  composioTool({
    name: "klaviyo_assign_campaign_message_template",
    description: "Creates a non-reusable version of the template and assigns it to the message.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:write`",
    toolSlug: "KLAVIYO_ASSIGN_CAMPAIGN_MESSAGE_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__id: {
          type: "string",
          description: "The unique identifier of the campaign message to assign the template to. Obtained from campaign creation or get campaign messages endpoints.",
        },
        data__type: {
          type: "string",
          description: "Resource type for the campaign message. Must be 'campaign-message'.",
          enum: [
            "campaign-message",
          ],
        },
        data__relationships__template__data__id: {
          type: "string",
          description: "The unique identifier of the template to assign to the campaign message. A non-reusable clone of this template will be created and linked to the message.",
        },
        data__relationships__template__data__type: {
          type: "string",
          description: "Resource type for the template. Must be 'template'.",
          enum: [
            "template",
          ],
        },
      },
      required: [
        "data__id",
        "data__relationships__template__data__id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Assign campaign message template.",
    ],
  }),
  composioTool({
    name: "klaviyo_bulk_create_client_events",
    description: "Use the client-side endpoint with a public API key to track profile activity. It accepts up to 1000 events/request with rates of 10/s burst and 150/m steady. For server-side, use the bulk create event endpoint.",
    toolSlug: "KLAVIYO_BULK_CREATE_CLIENT_EVENTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        company_id: {
          type: "string",
          description: "Your Public API Key / Site ID. See [this article](https://help.klaviyo.com/hc/en-us/articles/115005062267) for more details. ",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "event-bulk-create",
          ],
        },
        data__attributes__events__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__attributes__profile__data__attributes____kx: {
          type: "string",
          description: "Also known as the `exchange_id`, this is an encrypted identifier used for identifying a profile by Klaviyo\"s web tracking. You can use this field as a filter when retrieving profiles via the Get Profiles endpoint. ",
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__profile__data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attrs__profile__data__attrs__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attrs__profile__data__attrs__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attrs__profile__data__attrs__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attrs__profile__data__attrs__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__attrs__profile__data__meta__patch__props__unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attrs__profile__data__attrs__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__profile__data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__profile__data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__profile__data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Anonymous Id",
        },
        data__attributes__profile__data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__profile__data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__profile__data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__profile__data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
      },
      required: [
        "company_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "client",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk create client events.",
    ],
  }),
  composioTool({
    name: "klaviyo_bulk_create_events",
    description: "Bulk create events for multiple profiles in a single request. Accepts up to 1,000 events with a 5MB max payload. Each event requires a profile identifier (email, phone_number, or external_id) and a metric name. Events are processed asynchronously; a 202 response indicates acceptance, not completion. Rate limits: 10/s burst, 150/min steady.",
    toolSlug: "KLAVIYO_BULK_CREATE_EVENTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type identifier. Must be 'event-bulk-create-job'.",
          enum: [
            "event-bulk-create-job",
          ],
        },
        data__attributes__events__bulk__create__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of event-bulk-create objects (max 1000). Each object contains: 1) 'type': must be 'event-bulk-create', 2) 'attributes': contains 'profile' (with data.type='profile' and data.attributes containing at least one identifier like email/phone_number/external_id) and 'events' (with data array of event objects, each having type='event' and attributes with 'metric' containing data.type='metric' and data.attributes.name, plus 'properties' object). Example: [{\"type\":\"event-bulk-create\",\"attributes\":{\"profile\":{\"data\":{\"type\":\"profile\",\"attributes\":{\"email\":\"user@example.com\"}}},\"events\":{\"data\":[{\"type\":\"event\",\"attributes\":{\"metric\":{\"data\":{\"type\":\"metric\",\"attributes\":{\"name\":\"Viewed Product\"}}},\"properties\":{\"product_id\":\"123\"}}}]}}}]",
        },
      },
      required: [
        "data__attributes__events__bulk__create__data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "events",
    ],
    askBefore: [
      "Confirm the parameters before executing Bulk create events.",
    ],
  }),
  composioTool({
    name: "klaviyo_cancel_campaign_send",
    description: "Cancel or revert a campaign send job. Use 'cancel' to permanently stop a campaign (status becomes CANCELED), or 'revert' to return it to DRAFT for editing. This action modifies a campaign send job that is currently queued or sending. The cancel action is irreversible and sets the status to CANCELED. The revert action returns the campaign to DRAFT status, allowing further modifications. Rate limits: 10/s burst, 150/m steady. Required scope: `campaigns:write`. Preconditions: - Valid API key with campaigns:write scope - Campaign send job ID must exist and be accessible - Campaign must be in a state that allows cancellation (queued or sending)",
    toolSlug: "KLAVIYO_CANCEL_CAMPAIGN_SEND",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        action: {
          type: "string",
          description: "The action to perform. 'cancel' permanently cancels the campaign (status becomes CANCELED, irreversible). 'revert' returns the campaign to DRAFT status for further editing.",
          enum: [
            "cancel",
            "revert",
          ],
        },
        campaign_send_job_id: {
          type: "string",
          description: "The unique identifier of the campaign send job to cancel or revert. This is the ID returned when creating a campaign send job.",
        },
      },
      required: [
        "campaign_send_job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel Campaign Send.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_back_in_stock_subscription",
    description: "Use the server-side endpoint to subscribe to restock alerts, following the Back in Stock API guide. For client-side, use the POST endpoint provided. Rate limits: 350/s burst and 3500/m steady. Required scopes: catalogs:write, profiles:write.",
    toolSlug: "KLAVIYO_CREATE_BACK_IN_STOCK_SUBSCRIPTION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "back-in-stock-subscription",
          ],
        },
        data__attributes__channels: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "EMAIL",
              "PUSH",
              "SMS",
            ],
          },
          description: "The channel(s) through which the profile would like to receive the back in stock notification. This can be leveraged within a back in stock flow to notify the subscriber through their preferred channel(s). ",
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__relationships__variant__data__id: {
          type: "string",
          description: "The catalog variant ID for which the profile is subscribing to back in stock notifications. This ID is made up of the integration type, catalog ID, and and the external ID of the variant like so: `integrationType:::catalogId:::externalId`. If the integration you are using is not set up for multi-catalog storage, the \"catalogId\" will be `$default`. For Shopify `$shopify:::$default:::33001893429341` ",
        },
        data__relationships__variant__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-variant",
          ],
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Anonymous Id",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create back in stock subscription.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_campaign",
    description: "Creates a campaign given a set of parameters, then returns it.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:write`",
    toolSlug: "KLAVIYO_CREATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "campaign",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The campaign name",
        },
        data__attributes__send__options: {
          type: "object",
          additionalProperties: true,
          description: "Options to use when sending a campaign",
        },
        data__attributes__tracking__options: {
          type: "object",
          additionalProperties: true,
          description: "The tracking options associated with the campaign",
        },
        data__attributes__audiences__excluded: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An optional list of excluded audiences",
        },
        data__attributes__audiences__included: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of included audiences",
        },
        data__attributes__send__strategy__method: {
          type: "string",
          description: "Describes the shape of the options object. Allowed values: [\"static\", \"throttled\", \"immediate\", \"smart_send_time\"] ",
        },
        data__attributes__campaign__messages__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
        data__attributes__send__strategy__options__sto__date: {
          type: "string",
          description: "The day to send on",
        },
        data__attrs__send__strategy__options__throttled__datetime: {
          type: "string",
          description: "The time to send at",
        },
        data__attributes__send__strategy__options__static__datetime: {
          type: "string",
          description: "The time to send at",
        },
        data__attributes__send__strategy__options__static__is__local: {
          type: "boolean",
          description: "If the campaign should be sent with local recipient timezone send (requires UTC time) or statically sent at the given time. Defaults to False. ",
        },
        data__attrs__send__strategy__options__static__past__recipients: {
          type: "boolean",
          description: "Determines if we should send to local recipient timezone if the given time has passed. Only applicable to local sends. Defaults to False. ",
        },
        data__attrs__send__strategy__options__throttled__throttle__pct: {
          type: "integer",
          description: "The percentage of recipients per hour to send to. Allowed values: [10, 11, 13, 14, 17, 20, 25, 33, 50] ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Create campaign.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_campaign_clone",
    description: "Clones an existing campaign, returning a new campaign based on the original with a new ID and name.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:write`",
    toolSlug: "KLAVIYO_CREATE_CAMPAIGN_CLONE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__id: {
          type: "string",
          description: "The campaign ID to be cloned",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "campaign",
          ],
        },
        data__attributes__new__name: {
          type: "string",
          description: "The name for the new cloned campaign",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Create campaign clone.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_campaign_recipient_estimation_job",
    description: "Start an asynchronous task to estimate the number of recipients for a campaign. This action creates a background job that calculates how many profiles would receive the campaign based on its current audience settings. Use the job ID returned to track progress with the 'Get Campaign Recipient Estimation Job' action, and get the final count via 'Get Campaign Recipient Estimation' action. Rate limits: 10/s burst, 150/m steady. Required scope: `campaigns:write`. Preconditions: - Valid API key with campaigns:write scope - Campaign ID must exist and be accessible - Campaign must have audience settings configured",
    toolSlug: "KLAVIYO_CREATE_CAMPAIGN_RECIPIENT_ESTIMATION_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The ID of the campaign to perform recipient estimation for",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Campaign Recipient Estimation Job.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_campaign_send_job",
    description: "Trigger a campaign to send asynchronously<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:write`",
    toolSlug: "KLAVIYO_CREATE_CAMPAIGN_SEND_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__id: {
          type: "string",
          description: "The unique identifier (ID) of the campaign to send. The campaign must have a template assigned to its message and a subject line set before it can be sent.",
        },
        data__type: {
          type: "string",
          description: "Resource type identifier. Must be 'campaign-send-job'.",
          enum: [
            "campaign-send-job",
          ],
        },
      },
      required: [
        "data__id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Create campaign send job.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_catalog_category",
    description: "Create a new catalog category.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_CREATE_CATALOG_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-category",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The name of the catalog category.",
        },
        data__attributes__external__id: {
          type: "string",
          description: "The ID of the catalog category in an external system.",
        },
        data__attributes__catalog__type: {
          type: "string",
          description: "The type of catalog. Currently only \"$default\" is supported.",
        },
        data__relationships__items__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
        data__attributes__integration__type: {
          type: "string",
          description: "The integration type. Currently only \"$custom\" is supported.",
          enum: [
            "$custom",
          ],
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create catalog category.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_catalog_category_relationships_items",
    description: "Create a new item relationship for the given category ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_CREATE_CATALOG_CATEGORY_RELATIONSHIPS_ITEMS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the catalog category. Must be URL-encoded for the API request.",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of catalog item resource identifiers to add to the category. Each item should have 'type': 'catalog-item' and 'id': '<catalog-item-id>'.",
        },
      },
      required: [
        "id",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create catalog category relationships items.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_catalog_item",
    description: "Create a new catalog item.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_CREATE_CATALOG_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-item",
          ],
        },
        data__attributes__url: {
          type: "string",
          description: "URL pointing to the location of the catalog item on your website.",
        },
        data__attributes__price: {
          type: "number",
          description: "This field can be used to set the price on the catalog item, which is what gets displayed for the item when included in emails. For most price-update use cases, you will also want to update the `price` on any child variants, using the [Update Catalog Variant Endpoint](https://developers.klaviyo.com/en/reference/update_catalog_variant). ",
        },
        data__attributes__title: {
          type: "string",
          description: "The title of the catalog item.",
        },
        data__attributes__images: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of URLs pointing to the locations of images of the catalog item.",
        },
        data__attributes__published: {
          type: "boolean",
          description: "Boolean value indicating whether the catalog item is published.",
        },
        data__attributes__description: {
          type: "string",
          description: "A description of the catalog item.",
        },
        data__attributes__external__id: {
          type: "string",
          description: "The ID of the catalog item in an external system.",
        },
        data__attributes__catalog__type: {
          type: "string",
          description: "The type of catalog. Currently only \"$default\" is supported.",
        },
        data__attributes__image__full__url: {
          type: "string",
          description: "URL pointing to the location of a full image of the catalog item.",
        },
        data__attributes__integration__type: {
          type: "string",
          description: "The integration type. Currently only \"$custom\" is supported.",
          enum: [
            "$custom",
          ],
        },
        data__relationships__categories__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
        data__attributes__image__thumbnail__url: {
          type: "string",
          description: "URL pointing to the location of an image thumbnail of the catalog item",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create catalog item.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_catalog_item_relationships_categories",
    description: "Create a new catalog category relationship for the given item ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_CREATE_CATALOG_ITEM_RELATIONSHIPS_CATEGORIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the catalog item (e.g., '$custom:::$default:::my-item-id'). Will be automatically URL-encoded for the API request.",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of catalog category resource identifiers to add to the item. Each entry should have 'type': 'catalog-category' and 'id': '<category-id>' (e.g., '$custom:::$default:::my-category').",
        },
      },
      required: [
        "id",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create catalog item relationships categories.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_catalog_variant",
    description: "Create a new variant for a related catalog item.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_CREATE_CATALOG_VARIANT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-variant",
          ],
        },
        data__attributes__sku: {
          type: "string",
          description: "The SKU of the catalog item variant.",
        },
        data__attributes__url: {
          type: "string",
          description: "URL pointing to the location of the catalog item variant on your website. ",
        },
        data__attributes__price: {
          type: "number",
          description: "This field can be used to set the price on the catalog item variant, which is what gets displayed for the item variant when included in emails. For most price-update use cases, you will also want to update the `price` on any parent items using the [Update Catalog Item Endpoint](https://developers.klaviyo.com/en/reference/update_catalog_item). ",
        },
        data__attributes__title: {
          type: "string",
          description: "The title of the catalog item variant.",
        },
        data__attributes__images: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of URLs pointing to the locations of images of the catalog item variant. ",
        },
        data__attributes__published: {
          type: "boolean",
          description: "Boolean value indicating whether the catalog item variant is published.",
        },
        data__attributes__description: {
          type: "string",
          description: "A description of the catalog item variant.",
        },
        data__attributes__external__id: {
          type: "string",
          description: "The ID of the catalog item variant in an external system.",
        },
        data__attributes__catalog__type: {
          type: "string",
          description: "The type of catalog. Currently only \"$default\" is supported.",
        },
        data__attributes__image__full__url: {
          type: "string",
          description: "URL pointing to the location of a full image of the catalog item variant. ",
        },
        data__attributes__integration__type: {
          type: "string",
          description: "The integration type. Currently only \"$custom\" is supported.",
          enum: [
            "$custom",
          ],
        },
        data__attributes__inventory__policy: {
          type: "integer",
          description: "This field controls the visibility of this catalog item variant in product feeds/blocks. This field supports the following values: `1`: a product will not appear in dynamic product recommendation feeds and blocks if it is out of stock. `0` or `2`: a product can appear in dynamic product recommendation feeds and blocks regardless of inventory quantity. ",
        },
        data__relationships__item__data__id: {
          type: "string",
          description: "The original catalog item ID for which this is a variant.",
        },
        data__attributes__inventory__quantity: {
          type: "number",
          description: "The quantity of the catalog item variant currently in stock.",
        },
        data__relationships__item__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-item",
          ],
        },
        data__attributes__image__thumbnail__url: {
          type: "string",
          description: "URL pointing to the location of an image thumbnail of the catalog item variant. ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Create catalog variant.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_client_back_in_stock_subscription",
    description: "Use the endpoint for client-side back in stock notifications with a public API key. For server-side, use POST /api/back-in-stock-subscriptions. Limits are 350 requests per second and 3500 per minute. Requires 'catalogs:write' and 'profiles:write' scopes.",
    toolSlug: "KLAVIYO_CREATE_CLIENT_BACK_IN_STOCK_SUBSCRIPTION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        company_id: {
          type: "string",
          description: "Your Public API Key / Site ID. See [this article](https://help.klaviyo.com/hc/en-us/articles/115005062267) for more details. ",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "back-in-stock-subscription",
          ],
        },
        data__attributes__channels: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "EMAIL",
              "PUSH",
              "SMS",
            ],
          },
          description: "The channel(s) through which the profile would like to receive the back in stock notification. This can be leveraged within a back in stock flow to notify the subscriber through their preferred channel(s). ",
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__relationships__variant__data__id: {
          type: "string",
          description: "The catalog variant ID for which the profile is subscribing to back in stock notifications. This ID is made up of the integration type, catalog ID, and and the external ID of the variant like so: `integrationType:::catalogId:::externalId`. If the integration you are using is not set up for multi-catalog storage, the \"catalogId\" will be `$default`. For Shopify `$shopify:::$default:::33001893429341` ",
        },
        data__relationships__variant__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-variant",
          ],
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Anonymous Id",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
      },
      required: [
        "company_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "client",
    ],
    askBefore: [
      "Confirm the parameters before executing Create client back in stock subscription.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_client_event2",
    description: "Create a client-side event in Klaviyo to track user interactions. This action uses the company_id in the request body instead of as a query parameter. Use when tracking events from publicly-browseable, client-side environments with a public API key.",
    toolSlug: "KLAVIYO_CREATE_CLIENT_EVENT2",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        ip: {
          type: "string",
          description: "IP address",
        },
        city: {
          type: "string",
          description: "City name",
        },
        image: {
          type: "string",
          description: "URL to profile image",
        },
        title: {
          type: "string",
          description: "Profile's job title",
        },
        region: {
          type: "string",
          description: "Region/state",
        },
        country: {
          type: "string",
          description: "Country name",
        },
        address1: {
          type: "string",
          description: "First line of street address",
        },
        address2: {
          type: "string",
          description: "Second line of street address",
        },
        latitude: {
          type: "string",
          description: "Latitude coordinate",
        },
        timezone: {
          type: "string",
          description: "Timezone",
        },
        zip_code: {
          type: "string",
          description: "Zip code",
        },
        last_name: {
          type: "string",
          description: "Profile's last name",
        },
        longitude: {
          type: "string",
          description: "Longitude coordinate",
        },
        unique_id: {
          type: "string",
          description: "Unique identifier for the event to prevent duplicates",
        },
        company_id: {
          type: "string",
          description: "Your Public API Key / Site ID for client-side tracking. This appears in both the event attributes and profile attributes.",
        },
        event_time: {
          type: "string",
          description: "When the event occurred. Defaults to current time if not provided.",
        },
        first_name: {
          type: "string",
          description: "Profile's first name",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties for the event",
        },
        event_value: {
          type: "number",
          description: "Monetary value associated with the event (e.g., purchase amount)",
        },
        metric_name: {
          type: "string",
          description: "Name of the event metric. Must be less than 128 characters.",
        },
        organization: {
          type: "string",
          description: "Profile's organization",
        },
        profile_email: {
          type: "string",
          description: "Email address of the profile to associate with the event",
        },
        value_currency: {
          type: "string",
          description: "Currency code for the event value (ISO 4217)",
        },
        profile_properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to update on the profile",
        },
        profile_external_id: {
          type: "string",
          description: "External ID of the profile",
        },
        profile_anonymous_id: {
          type: "string",
          description: "Anonymous ID of the profile",
        },
        profile_phone_number: {
          type: "string",
          description: "Phone number of the profile in E.164 format",
        },
      },
      required: [
        "company_id",
        "metric_name",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Client Event V2.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_client_subscription",
    description: "Endpoint manages email/SMS opt-ins using consent and requires public API key for client use. Allows single-channel with details. Rate limit: 100/s burst, 700/m steady, under 'subscriptions:write'.",
    toolSlug: "KLAVIYO_CREATE_CLIENT_SUBSCRIPTION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        company_id: {
          type: "string",
          description: "Your Public API Key / Site ID. See [this article](https://help.klaviyo.com/hc/en-us/articles/115005062267) for more details. ",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "subscription",
          ],
        },
        data__attributes__custom__source: {
          type: "string",
          description: "A custom method detail or source to store on the consent records for this subscription. ",
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__relationships__list__data__id: {
          type: "string",
          description: "The list ID to add the newly subscribed profile to.",
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__relationships__list__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "list",
          ],
        },
        data__attributes__profile__data__attributes____kx: {
          type: "string",
          description: "Also known as the `exchange_id`, this is an encrypted identifier used for identifying a profile by Klaviyo\"s web tracking. You can use this field as a filter when retrieving profiles via the Get Profiles endpoint. ",
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__profile__data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attrs__profile__data__attrs__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attrs__profile__data__attrs__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attrs__profile__data__attrs__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attrs__profile__data__attrs__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__attrs__profile__data__meta__patch__props__unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attrs__profile__data__attrs__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__profile__data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__profile__data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__profile__data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Id that can be used to identify a profile when other identifiers are not available ",
        },
        data__attributes__profile__data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__profile__data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__profile__data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__profile__data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
      },
      required: [
        "company_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "client",
    ],
    askBefore: [
      "Confirm the parameters before executing Create client subscription.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_coupon",
    description: "Creates a new coupon.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `coupons:write`",
    toolSlug: "KLAVIYO_CREATE_COUPON",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "coupon",
          ],
        },
        data__attributes__description: {
          type: "string",
          description: "A description of the coupon.",
        },
        data__attributes__external__id: {
          type: "string",
          description: "This is the id that is stored in an integration such as Shopify or Magento. ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "coupons",
    ],
    askBefore: [
      "Confirm the parameters before executing Create coupon.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_coupon_code",
    description: "Synchronously creates a coupon code for the given coupon.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `coupon-codes:write`",
    toolSlug: "KLAVIYO_CREATE_COUPON_CODE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "coupon-code",
          ],
        },
        data__attributes__expires__at: {
          type: "string",
          description: "The datetime when this coupon code will expire. If not specified or set to null, it will be automatically set to 1 year. ",
        },
        data__attributes__unique__code: {
          type: "string",
          description: "This is a unique string that will be or is assigned to each customer/profile and is associated with a coupon. ",
        },
        data__relationships__coupon__data__id: {
          type: "string",
          description: "Id",
        },
        data__relationships__coupon__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "coupon",
          ],
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "coupons",
    ],
    askBefore: [
      "Confirm the parameters before executing Create coupon code.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_event",
    description: "Create or update a profile event with minimum identifiers and metric name. Success means validation, not completion. Burst limit: 350/s, Steady: 3500/m. Scope required: `events:write`.",
    toolSlug: "KLAVIYO_CREATE_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "event",
          ],
        },
        data__attributes__time: {
          type: "string",
          description: "When this event occurred. By default, the time the request was received will be used. The time is truncated to the second. The time must be after the year 2000 and can only be up to 1 year in the future. ",
        },
        data__attributes__value: {
          type: "integer",
          description: "A numeric, monetary value to associate with this event. For example, the dollar amount of a purchase. ",
        },
        data__attributes__properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties of the event. Use this to store additional data about the event. Non-object properties can be used for creating segments. Use the '$extra' key for non-segmentable values like HTML templates. Defaults to an empty object if not provided. ",
        },
        data__attributes__unique__id: {
          type: "string",
          description: "A unique identifier for an event. If the unique_id is repeated for the same profile and metric, only the first processed event will be recorded. If this is not present, this will use the time to the second. Using the default, this limits only one event per profile per second. ",
        },
        data__attributes__value__currency: {
          type: "string",
          description: "The ISO 4217 currency code of the value associated with the event.",
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__attributes__metric__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "metric",
          ],
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__attributes__metric__data__attributes__name: {
          type: "string",
          description: "Name of the event. Must be less than 128 characters.",
        },
        data__attributes__profile__data__attributes____kx: {
          type: "string",
          description: "Also known as the `exchange_id`, this is an encrypted identifier used for identifying a profile by Klaviyo\"s web tracking. You can use this field as a filter when retrieving profiles via the Get Profiles endpoint. ",
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__profile__data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attributes__metric__data__attributes__service: {
          type: "string",
          description: "This is for advanced usage. For api requests, this should use the default, which is set to api. ",
        },
        data__attrs__profile__data__attrs__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attrs__profile__data__attrs__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attrs__profile__data__attrs__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attrs__profile__data__attrs__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__attrs__profile__data__attrs__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__profile__data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__profile__data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__profile__data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Anonymous Id",
        },
        data__attributes__profile__data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__profile__data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attrs__profile__data__attrs__meta__patch__props__unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attributes__profile__data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__profile__data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "events",
    ],
    askBefore: [
      "Confirm the parameters before executing Create event.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_list",
    description: "Create a new list.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m`<br>Daily: `100/d` **Scopes:** `lists:write`",
    toolSlug: "KLAVIYO_CREATE_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "list",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "A helpful name to label the list",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Create list.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_or_update_client_profile",
    description: "Update user profiles without tracking using a public client-side API; use a private server-side API for identifier changes. Burst rate is 350 requests/sec and 3500 requests/min with 'profiles:write' access.",
    toolSlug: "KLAVIYO_CREATE_OR_UPDATE_CLIENT_PROFILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        company_id: {
          type: "string",
          description: "Your Public API Key / Site ID. See [this article](https://help.klaviyo.com/hc/en-us/articles/115005062267) for more details. ",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__attributes____kx: {
          type: "string",
          description: "Also known as the `exchange_id`, this is an encrypted identifier used for identifying a profile by Klaviyo\"s web tracking. You can use this field as a filter when retrieving profiles via the Get Profiles endpoint. ",
        },
        data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__anonymous__id: {
          type: "string",
          description: "Anonymous Id",
        },
        data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
        data__attributes__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attributes__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attributes__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__meta__patch__properties__unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attributes__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
      },
      required: [
        "company_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "client",
    ],
    askBefore: [
      "Confirm the parameters before executing Create or update client profile.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_or_update_client_push_token",
    description: "This endpoint for mobile SDKs (iOS & Android) creates/updates push tokens using a public API key. Push notifications must be enabled. For migrating tokens use the server-side POST endpoint. Rate limits are 3/s burst, 150/m steady.",
    toolSlug: "KLAVIYO_CREATE_OR_UPDATE_CLIENT_PUSH_TOKEN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        company_id: {
          type: "string",
          description: "Your Public API Key / Site ID. See [this article](https://help.klaviyo.com/hc/en-us/articles/115005062267) for more details. ",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "push-token",
          ],
        },
        data__attributes__token: {
          type: "string",
          description: "A push token from APNS or FCM.",
        },
        data__attributes__vendor: {
          type: "string",
          description: "The vendor of the push token.",
          enum: [
            "apns",
            "fcm",
          ],
        },
        profile_meta_patch_unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attributes__platform: {
          type: "string",
          description: "The platform on which the push token was created.",
          enum: [
            "android",
            "ios",
          ],
        },
        data__attributes__background: {
          type: "string",
          description: "The background state of the push token.",
          enum: [
            "AVAILABLE",
            "DENIED",
            "RESTRICTED",
          ],
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__attributes__enablement__status: {
          type: "string",
          description: "This is the enablement status for the individual push token.",
          enum: [
            "AUTHORIZED",
            "DENIED",
            "NOT_DETERMINED",
            "PROVISIONAL",
            "UNAUTHORIZED",
          ],
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__attributes__device__metadata__app__id: {
          type: "string",
          description: "The ID of the app that created the push token",
        },
        data__attributes__device__metadata__os__name: {
          type: "string",
          description: "The name of the operating system on the device.",
          enum: [
            "android",
            "ios",
            "ipados",
            "macos",
            "tvos",
          ],
        },
        data__attributes__device__metadata__app__name: {
          type: "string",
          description: "The name of the app that created the push token",
        },
        data__attributes__device__metadata__app__build: {
          type: "string",
          description: "The build of the app that created the push token",
        },
        data__attributes__device__metadata__device__id: {
          type: "string",
          description: "Relatively stable ID for the device. Will update on app uninstall and reinstall ",
        },
        data__attributes__device__metadata__environment: {
          type: "string",
          description: "The environment in which the push token was created",
          enum: [
            "debug",
            "release",
          ],
        },
        data__attributes__device__metadata__os__version: {
          type: "string",
          description: "The version of the operating system on the device",
        },
        data__attributes__device__metadata__app__version: {
          type: "string",
          description: "The version of the app that created the push token",
        },
        data__attributes__device__metadata__klaviyo__sdk: {
          type: "string",
          description: "The name of the SDK used to create the push token.",
          enum: [
            "android",
            "swift",
          ],
        },
        data__attributes__device__metadata__manufacturer: {
          type: "string",
          description: "The manufacturer of the device",
        },
        data__attributes__device__metadata__sdk__version: {
          type: "string",
          description: "The version of the SDK used to create the push token",
        },
        data__attributes__device__metadata__device__model: {
          type: "string",
          description: "The model of the device",
        },
        data__attributes__profile__data__attributes____kx: {
          type: "string",
          description: "Also known as the `exchange_id`, this is an encrypted identifier used for identifying a profile by Klaviyo\"s web tracking. You can use this field as a filter when retrieving profiles via the Get Profiles endpoint. ",
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__profile__data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attrs__profile__data__attrs__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attrs__profile__data__attrs__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attrs__profile__data__attrs__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attrs__profile__data__attrs__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__attrs__profile__data__attrs__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__profile__data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__profile__data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__profile__data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Id that can be used to identify a profile when other identifiers are not available ",
        },
        data__attributes__profile__data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__profile__data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__profile__data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__profile__data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
      },
      required: [
        "company_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "client",
    ],
    askBefore: [
      "Confirm the parameters before executing Create or update client push token.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_or_update_profile",
    description: "Create or update a profile in Klaviyo with the given attributes. This action allows you to create a new profile or update an existing one if it already exists (based on email or other identifiers). Returns 201 for creation, 200 for update. Empty fields are cleared with `null`; omitted fields remain unchanged. Rate limits: 75/s burst, 700/m steady. Required scope: `profiles:write`. Preconditions: - At least one identifier (email, phone_number, external_id, or anonymous_id) must be provided - Email must be in valid format if provided - Phone number must be in E.164 format if provided",
    toolSlug: "KLAVIYO_CREATE_OR_UPDATE_PROFILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        city: {
          type: "string",
          description: "City name",
        },
        email: {
          type: "string",
          description: "Individual's email address",
        },
        image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        title: {
          type: "string",
          description: "Individual's job title",
        },
        region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        country: {
          type: "string",
          description: "Country name",
        },
        address1: {
          type: "string",
          description: "First line of street address",
        },
        address2: {
          type: "string",
          description: "Second line of street address",
        },
        latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places.",
        },
        timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database.",
        },
        zip_code: {
          type: "string",
          description: "Zip code",
        },
        last_name: {
          type: "string",
          description: "Individual's last name",
        },
        longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places.",
        },
        first_name: {
          type: "string",
          description: "Individual's first name",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Custom properties to associate with the profile",
        },
        external_id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system",
        },
        anonymous_id: {
          type: "string",
          description: "Id that can be used to identify a profile when other identifiers are not available",
        },
        organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works",
        },
        phone_number: {
          type: "string",
          description: "Individual's phone number in E.164 format",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Create or Update Profile.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_or_update_push_token",
    description: "Create or update a push token for mobile push notifications. This server-side endpoint is used for migrating push tokens from other platforms to Klaviyo. For creating tokens from mobile devices, use Klaviyo's mobile SDKs instead. Prerequisites: Push notifications must be enabled for the Klaviyo account. Required fields: - data__type: Must be 'push-token' - data__attributes__token: The push token from APNS or FCM - data__attributes__platform: 'ios' or 'android' - data__attributes__vendor: 'apns' (iOS) or 'fcm' (Android) - data__attributes__profile__data__type: Must be 'profile' - At least one profile identifier (email, phone_number, external_id, anonymous_id, or profile id) Rate limits: 75/s burst, 700/m steady. Max payload: 100KB. Requires scopes: profiles:write, push-tokens:write",
    toolSlug: "KLAVIYO_CREATE_OR_UPDATE_PUSH_TOKEN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type. Must be 'push-token'.",
          enum: [
            "push-token",
          ],
        },
        data__attributes__token: {
          type: "string",
          description: "A push token from APNS or FCM.",
        },
        data__attributes__vendor: {
          type: "string",
          description: "The push notification vendor. Use 'apns' for iOS (Apple Push Notification Service) or 'fcm' for Android (Firebase Cloud Messaging).",
          enum: [
            "apns",
            "fcm",
          ],
        },
        profile_meta_patch_unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attributes__platform: {
          type: "string",
          description: "The mobile platform. Use 'ios' for Apple devices or 'android' for Android devices.",
          enum: [
            "android",
            "ios",
          ],
        },
        data__attributes__background: {
          type: "string",
          description: "The background state of the push token.",
          enum: [
            "AVAILABLE",
            "DENIED",
            "RESTRICTED",
          ],
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__attributes__enablement__status: {
          type: "string",
          description: "This is the enablement status for the individual push token.",
          enum: [
            "AUTHORIZED",
            "DENIED",
            "NOT_DETERMINED",
            "PROVISIONAL",
            "UNAUTHORIZED",
          ],
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Profile resource type. Must be 'profile'.",
          enum: [
            "profile",
          ],
        },
        data__attributes__device__metadata__app__id: {
          type: "string",
          description: "The ID of the app that created the push token",
        },
        data__attributes__device__metadata__os__name: {
          type: "string",
          description: "The name of the operating system on the device.",
          enum: [
            "android",
            "ios",
            "ipados",
            "macos",
            "tvos",
          ],
        },
        data__attributes__device__metadata__app__name: {
          type: "string",
          description: "The name of the app that created the push token",
        },
        data__attributes__device__metadata__app__build: {
          type: "string",
          description: "The build of the app that created the push token",
        },
        data__attributes__device__metadata__device__id: {
          type: "string",
          description: "Relatively stable ID for the device. Will update on app uninstall and reinstall ",
        },
        data__attributes__device__metadata__environment: {
          type: "string",
          description: "The environment in which the push token was created",
          enum: [
            "debug",
            "release",
          ],
        },
        data__attributes__device__metadata__os__version: {
          type: "string",
          description: "The version of the operating system on the device",
        },
        data__attributes__device__metadata__app__version: {
          type: "string",
          description: "The version of the app that created the push token",
        },
        data__attributes__device__metadata__klaviyo__sdk: {
          type: "string",
          description: "The name of the SDK used to create the push token.",
          enum: [
            "android",
            "swift",
          ],
        },
        data__attributes__device__metadata__manufacturer: {
          type: "string",
          description: "The manufacturer of the device",
        },
        data__attributes__device__metadata__sdk__version: {
          type: "string",
          description: "The version of the SDK used to create the push token",
        },
        data__attributes__device__metadata__device__model: {
          type: "string",
          description: "The model of the device",
        },
        data__attributes__profile__data__attributes____kx: {
          type: "string",
          description: "Also known as the `exchange_id`, this is an encrypted identifier used for identifying a profile by Klaviyo\"s web tracking. You can use this field as a filter when retrieving profiles via the Get Profiles endpoint. ",
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__profile__data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attrs__profile__data__attrs__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attrs__profile__data__attrs__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attrs__profile__data__attrs__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attrs__profile__data__attrs__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__attrs__profile__data__attrs__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__profile__data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__profile__data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__profile__data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Id that can be used to identify a profile when other identifiers are not available ",
        },
        data__attributes__profile__data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__profile__data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__profile__data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__profile__data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Create or update push token.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_profile",
    description: "Create a new profile.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `profiles:write`",
    toolSlug: "KLAVIYO_CREATE_PROFILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
        data__attributes__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attributes__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attributes__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__attributes__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Create profile.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_segment",
    description: "Create a segment.<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `15/m`<br>Daily: `100/d` **Scopes:** `segments:write`",
    toolSlug: "KLAVIYO_CREATE_SEGMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "segment",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "Name",
        },
        data__attributes__is__starred: {
          type: "boolean",
          description: "Is Starred",
        },
        data__attributes__definition__condition__groups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Condition Groups",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "segments",
    ],
    askBefore: [
      "Confirm the parameters before executing Create segment.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_tag",
    description: "Summary: Instructions on creating a tag within an account's designated tag group with a maximum of 500 tags, with optional tag group specification. Rate limits are 3/s burst and 60/min steady. Tag: #TagCreationLimitAndRate",
    toolSlug: "KLAVIYO_CREATE_TAG",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "tag",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The Tag name",
        },
        data__relationships__tag__group__data__id: {
          type: "string",
          description: "The ID of the Tag Group to associate the Tag with. If this field is not specified, the Tag will be associated with the company\"s Default Tag Group. ",
        },
        data__relationships__tag__group__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "tag-group",
          ],
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Create tag.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_tag_group",
    description: "Create tag groups up to 50 per account, defaulting to non-exclusive unless specified. Related resources can have multiple non-exclusive tags but only one if exclusive. Rate limits: 3/s burst, 60/m steady. Scopes needed: tags:read, tags:write.",
    toolSlug: "KLAVIYO_CREATE_TAG_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "tag-group",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The Tag Group name",
        },
        data__attributes__exclusive: {
          type: "boolean",
          description: "Exclusive",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Create tag group.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_tag_relationships",
    description: "Associate a tag with other resources (flows, lists, segments, or campaigns) in Klaviyo. Use when you need to link a tag to one or more resources for organizational purposes. Note: A resource can have up to 100 tags associated with it. Rate limits: 3/s burst, 60/m steady. Required scopes vary by resource type: tags:write plus the appropriate write scope (flows:write, lists:write, segments:write, or campaigns:write).",
    toolSlug: "KLAVIYO_CREATE_TAG_RELATIONSHIPS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the resource",
              },
              type: {
                type: "string",
                description: "The type of resource (e.g., 'flow', 'list', 'segment', 'campaign')",
              },
            },
            description: "Resource identifier object for tag relationships.",
          },
          description: "List of resource identifiers to associate with the tag. Each item must have 'type' and 'id' fields.",
        },
        tag_id: {
          type: "string",
          description: "The unique identifier (UUID) of the tag to associate with resources",
        },
        related_resource: {
          type: "string",
          description: "The type of resource to associate the tag with (flows, lists, segments, or campaigns)",
          enum: [
            "flows",
            "lists",
            "segments",
            "campaigns",
          ],
        },
      },
      required: [
        "tag_id",
        "related_resource",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Tag Relationships.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_template",
    description: "Summary: Custom HTML templates can be created unless an account reaches 1,000 template limit. Use sparse fieldsets to request specific fields. Rate limits are 10 per second and 150 per minute. Requires 'templates:write' scope.",
    toolSlug: "KLAVIYO_CREATE_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "template",
          ],
        },
        data__attributes__html: {
          type: "string",
          description: "The HTML contents of the template",
        },
        data__attributes__name: {
          type: "string",
          description: "The name of the template",
        },
        data__attributes__text: {
          type: "string",
          description: "The plaintext version of the template",
        },
        data__attributes__editor__type: {
          type: "string",
          description: "Restricted to CODE",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Create template.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_template_clone",
    description: "Clone a template by its ID, but cloning fails if account has 1,000+ templates. API limit: 1,000 templates. Rate limits are 10 per second and 150 per minute. Requires `templates:write` scope.",
    toolSlug: "KLAVIYO_CREATE_TEMPLATE_CLONE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__id: {
          type: "string",
          description: "The ID of template to be cloned",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "template",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The name of the template",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Create template clone.",
    ],
  }),
  composioTool({
    name: "klaviyo_create_template_render",
    description: "Render an email template with specific context and sparse fieldsets, then get HTML/plain text. Rate limit: 3/s burst, 60/m steady. Scope: templates:read.",
    toolSlug: "KLAVIYO_CREATE_TEMPLATE_RENDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__id: {
          type: "string",
          description: "The ID of template",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "template",
          ],
        },
        data__attributes__context: {
          type: "object",
          additionalProperties: true,
          description: "The context (key-value pairs) to render the template with. Keys should match template variable names.",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "klaviyo_create_webhook",
    description: "Create a new Webhook to receive real-time notifications when specific events occur in Klaviyo (e.g., email clicks, SMS sent). Rate limits: Burst: 1/s, Steady: 15/m Required scopes: webhooks:write, events:read (for event-based topics) Note: Each Klaviyo account can have a maximum of 10 webhooks.",
    toolSlug: "KLAVIYO_CREATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "The resource type for the webhook. Must be 'webhook'.",
          enum: [
            "webhook",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "A name for the webhook.",
        },
        data__attributes__description: {
          type: "string",
          description: "A description for the webhook.",
        },
        data__attributes__secret__key: {
          type: "string",
          description: "A secret key used for HMAC-SHA256 signing of webhook requests. Use this to verify webhook authenticity on your server.",
        },
        data__attributes__endpoint__url: {
          type: "string",
          description: "The HTTPS URL where webhook payloads will be sent. Must use HTTPS protocol (e.g., 'https://example.com/webhook').",
        },
        data__relationships__webhook__topics__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of webhook topics to subscribe to. Each item must have 'type': 'webhook-topic' and 'id' with the topic identifier (e.g., 'event:klaviyo.clicked_email', 'event:klaviyo.sent_sms'). Use KLAVIYO_GET_WEBHOOK_TOPICS to get available topics.",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Create webhook.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_campaign",
    description: "Delete a campaign with the given campaign ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:write`",
    toolSlug: "KLAVIYO_DELETE_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The campaign ID to be deleted",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete campaign.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_catalog_category",
    description: "Delete a catalog category using the given category ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_DELETE_CATALOG_CATEGORY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog category ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete catalog category.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_catalog_category_relationships_items",
    description: "Delete item relationships for the given category ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_DELETE_CATALOG_CATEGORY_RELATIONSHIPS_ITEMS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the catalog category from which to remove item relationships. Format: '$custom:::$default:::{external_id}' (e.g., '$custom:::$default:::my-category-123'). Must be URL-encoded for the API request.",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of catalog item resource identifiers to remove from the category. Each item must have 'type': 'catalog-item' and 'id': '<catalog-item-id>' (e.g., [{'type': 'catalog-item', 'id': '$custom:::$default:::item-123'}]).",
        },
      },
      required: [
        "id",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete catalog category relationships items.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_catalog_item",
    description: "Delete a catalog item with the given item ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_DELETE_CATALOG_ITEM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog item ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete catalog item.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_delete_catalog_item_relationships_categories",
    description: "Delete catalog category relationships for the given item ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_DELETE_CATALOG_ITEM_RELATIONSHIPS_CATEGORIES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
      },
      required: [
        "id",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete catalog item relationships categories.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_catalog_variant",
    description: "Delete a catalog item variant with the given variant ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_DELETE_CATALOG_VARIANT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog variant ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete catalog variant.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_coupon",
    description: "Delete the coupon with the given coupon ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `coupons:write`",
    toolSlug: "KLAVIYO_DELETE_COUPON",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The internal id of a Coupon is equivalent to its external id stored within an integration. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "coupons",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete coupon.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_delete_coupon_code",
    description: "Deletes a coupon code specified by the given identifier synchronously. If a profile has been assigned to the coupon code, an exception will be raised<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `coupon-codes:write`",
    toolSlug: "KLAVIYO_DELETE_COUPON_CODE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the coupon code to delete. Format: '{COUPON_ID}-{UNIQUE_CODE}' where COUPON_ID is the external_id of the parent coupon and UNIQUE_CODE is the specific code string. Example: 'SUMMER_SALE_2026-SAVE20OFF'. Note: Coupon codes assigned to a profile cannot be deleted and will raise an exception.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "coupons",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete coupon code.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_flow",
    description: "Delete a flow with the given flow ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:write`",
    toolSlug: "KLAVIYO_DELETE_FLOW",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "ID of the Flow to delete. Ex: XVTP5Q",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "flows",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete flow.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_list",
    description: "Delete a list with the given list ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `lists:write`",
    toolSlug: "KLAVIYO_DELETE_LIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Primary key that uniquely identifies this list. Generated by Klaviyo.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete list.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_delete_segment",
    description: "Delete a segment with the given segment ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `segments:write`",
    toolSlug: "KLAVIYO_DELETE_SEGMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the segment to delete. Segment IDs are alphanumeric strings (e.g., 'TJx2Yb').",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "segments",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete segment.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_tag",
    description: "Delete the tag with the given tag ID. Any associations between the tag and other resources will also be removed.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `tags:read` `tags:write`",
    toolSlug: "KLAVIYO_DELETE_TAG",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Tag ID",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete tag.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_tag_group",
    description: "Delete a specified tag group and its contents; associated resource links will be removed. The default group is undeletable. Rate limits: 3/s burst, 60/m steady. Requires tags:read and tags:write permissions.",
    toolSlug: "KLAVIYO_DELETE_TAG_GROUP",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Tag Group ID",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete tag group.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_tag_relationships",
    description: "Remove a tag's association with other resources like flows, campaigns, lists, or segments. Use when you need to untag resources without deleting the tag itself.",
    toolSlug: "KLAVIYO_DELETE_TAG_RELATIONSHIPS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The tag ID from which to remove resource associations",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "ID of the resource to disassociate from the tag",
              },
              type: {
                type: "string",
                description: "Type of the resource (must match related_resource parameter)",
              },
            },
            description: "Resource object to disassociate from a tag",
          },
          description: "Array of resource objects to disassociate from the tag. Each object must have 'type' (matching related_resource) and 'id' fields",
        },
        related_resource: {
          type: "string",
          description: "The type of resource to disassociate from the tag. Valid values: flows, campaigns, lists, segments",
          enum: [
            "flows",
            "campaigns",
            "lists",
            "segments",
          ],
        },
      },
      required: [
        "id",
        "related_resource",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Tag Relationships.",
    ],
  }),
  composioTool({
    name: "klaviyo_delete_template",
    description: "Permanently delete a template from your Klaviyo account using its unique template ID. This action is destructive and cannot be undone. Rate limits: Burst 10/s, Steady 150/m. Requires 'templates:write' scope.",
    toolSlug: "KLAVIYO_DELETE_TEMPLATE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the template to delete. Can be obtained from the get_templates or create_template actions.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "templates",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete template.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_delete_webhook",
    description: "Permanently delete a webhook subscription from your Klaviyo account. This action removes the webhook configuration, stopping all future event notifications to the webhook's endpoint URL. This operation is irreversible. **Requirements:** - Advanced KDP (Klaviyo Data Platform) must be enabled on your account - API key must have `webhooks:write` scope **Rate limits:** Burst: 1/s, Steady: 15/m **Returns:** HTTP 204 No Content on successful deletion (empty response body).",
    toolSlug: "KLAVIYO_DELETE_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the webhook to delete. This is typically a UUID string returned when the webhook was created (e.g., 'abc123-def456-ghi789').",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "webhooks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete webhook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_get_account",
    description: "Retrieve a single account object by its account ID. You can only request the account by which the private API key was generated.<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `15/m` **Scopes:** `accounts:read`",
    toolSlug: "KLAVIYO_GET_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the account",
        },
        fields__account: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "test_account",
              "contact_information",
              "contact_information.default_sender_name",
              "contact_information.default_sender_email",
              "contact_information.website_url",
              "contact_information.organization_name",
              "contact_information.street_address",
              "contact_information.street_address.address1",
              "contact_information.street_address.address2",
              "contact_information.street_address.city",
              "contact_information.street_address.region",
              "contact_information.street_address.country",
              "contact_information.street_address.zip",
              "industry",
              "timezone",
              "preferred_currency",
              "public_api_key",
              "locale",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "accounts",
    ],
  }),
  composioTool({
    name: "klaviyo_get_accounts",
    description: "Use a private API key to fetch an associated account's details like contact info, timezone, and currency, as well as validate the key. Rate limit: 1 request/second, 15 requests/minute. Scope required: `accounts:read`.",
    toolSlug: "KLAVIYO_GET_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields__account: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "test_account",
              "contact_information",
              "contact_information.default_sender_name",
              "contact_information.default_sender_email",
              "contact_information.website_url",
              "contact_information.organization_name",
              "contact_information.street_address",
              "contact_information.street_address.address1",
              "contact_information.street_address.address2",
              "contact_information.street_address.city",
              "contact_information.street_address.region",
              "contact_information.street_address.country",
              "contact_information.street_address.zip",
              "industry",
              "timezone",
              "preferred_currency",
              "public_api_key",
              "locale",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "accounts",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_create_coupon_codes_job",
    description: "Tool to get a coupon code bulk create job with the given job ID. Use when you need to check the status of a previously initiated bulk coupon code creation job. Rate limits: 75/s burst, 700/m steady. Required scope: coupon-codes:read.",
    toolSlug: "KLAVIYO_GET_BULK_CREATE_COUPON_CODES_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier for the coupon code bulk create job to retrieve.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "bulk_operations",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_delete_catalog_items_job",
    description: "Get a catalog item bulk delete job with the given job ID. Use this to check the status and progress of a bulk delete operation for catalog items. Rate limits: 350/s burst, 3500/m steady. Required scope: `catalogs:read`. Preconditions: - Valid API key with catalogs:read scope - Job ID must exist and be accessible",
    toolSlug: "KLAVIYO_GET_BULK_DELETE_CATALOG_ITEMS_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier for the bulk delete job to retrieve",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "bulk_operations",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_profile_import_job",
    description: "Get a bulk profile import job with the given job ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `lists:read` `profiles:read`",
    toolSlug: "KLAVIYO_GET_BULK_PROFILE_IMPORT_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "lists",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__list: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "opt_in_process",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__profile__bulk__import__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "expires_at",
              "started_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_profile_import_job_errors",
    description: "Get import errors for the bulk profile import job with the given ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `profiles:read`",
    toolSlug: "KLAVIYO_GET_BULK_PROFILE_IMPORT_JOB_ERRORS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the bulk profile import job to retrieve errors for. Obtain this ID from the spawn_bulk_profile_import_job or get_bulk_profile_import_jobs actions.",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "Cursor for pagination. Use the value from the 'next' or 'prev' link in the response to fetch additional pages of errors.",
        },
        fields__import__error: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "code",
              "title",
              "detail",
              "source",
              "source.pointer",
              "original_payload",
            ],
          },
          description: "Select specific fields to include in the response (sparse fieldsets). Available fields: 'code', 'title', 'detail', 'source', 'source.pointer', 'original_payload'. If omitted, all fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_profile_import_job_lists",
    description: "Get list for the bulk profile import job with the given ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `lists:read`",
    toolSlug: "KLAVIYO_GET_BULK_PROFILE_IMPORT_JOB_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        fields__list: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "opt_in_process",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_profile_import_job_profiles",
    description: "Get profiles for the bulk profile import job with the given ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `profiles:read`",
    toolSlug: "KLAVIYO_GET_BULK_PROFILE_IMPORT_JOB_PROFILES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (ID) of the bulk profile import job to retrieve profiles from. This ID is returned when creating a bulk profile import job or can be obtained from the list of import jobs.",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "email",
              "phone_number",
              "external_id",
              "first_name",
              "last_name",
              "organization",
              "locale",
              "title",
              "image",
              "created",
              "updated",
              "last_event_date",
              "location",
              "location.address1",
              "location.address2",
              "location.city",
              "location.country",
              "location.latitude",
              "location.longitude",
              "location.region",
              "location.zip",
              "location.timezone",
              "location.ip",
              "properties",
              "subscriptions",
              "subscriptions.email",
              "subscriptions.email.marketing",
              "subscriptions.email.marketing.can_receive_email_marketing",
              "subscriptions.email.marketing.consent",
              "subscriptions.email.marketing.consent_timestamp",
              "subscriptions.email.marketing.last_updated",
              "subscriptions.email.marketing.method",
              "subscriptions.email.marketing.method_detail",
              "subscriptions.email.marketing.custom_method_detail",
              "subscriptions.email.marketing.double_optin",
              "subscriptions.email.marketing.suppression",
              "subscriptions.email.marketing.list_suppressions",
              "subscriptions.sms",
              "subscriptions.sms.marketing",
              "subscriptions.sms.marketing.can_receive_sms_marketing",
              "subscriptions.sms.marketing.consent",
              "subscriptions.sms.marketing.consent_timestamp",
              "subscriptions.sms.marketing.method",
              "subscriptions.sms.marketing.method_detail",
              "subscriptions.sms.marketing.last_updated",
              "predictive_analytics",
              "predictive_analytics.historic_clv",
              "predictive_analytics.predicted_clv",
              "predictive_analytics.total_clv",
              "predictive_analytics.historic_number_of_orders",
              "predictive_analytics.predicted_number_of_orders",
              "predictive_analytics.average_days_between_orders",
              "predictive_analytics.average_order_value",
              "predictive_analytics.churn_probability",
              "predictive_analytics.expected_date_of_next_order",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        additional__fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "subscriptions",
              "predictive_analytics",
            ],
          },
          description: "Request additional fields not included by default in the response. Supported values: \"subscriptions\", \"predictive_analytics\" ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_profile_import_job_relationships_lists",
    description: "Get list relationship for the bulk profile import job with the given ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `lists:read`",
    toolSlug: "KLAVIYO_GET_BULK_PROFILE_IMPORT_JOB_RELATIONSHIPS_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the bulk profile import job. Obtain this from the GET /api/profile-bulk-import-jobs/ endpoint or from the response when creating a bulk import job.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_profile_import_job_relationships_profiles",
    description: "Get profile relationships for the bulk profile import job with the given ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `profiles:read`",
    toolSlug: "KLAVIYO_GET_BULK_PROFILE_IMPORT_JOB_RELATIONSHIPS_PROFILES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_profile_import_jobs",
    description: "Get all bulk profile import jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `lists:read` `profiles:read`",
    toolSlug: "KLAVIYO_GET_BULK_PROFILE_IMPORT_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created_at",
            "-created_at",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `any`, `equals` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__profile__bulk__import__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "expires_at",
              "started_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_update_catalog_items_job",
    description: "Get a catalog item bulk update job with the given job ID. An `include` parameter can be provided to get the following related resource data: `items`.",
    toolSlug: "KLAVIYO_GET_BULK_UPDATE_CATALOG_ITEMS_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "items",
            ],
          },
          description: "Related resources to include in the response. Set to ['items'] to include full catalog item data for items being updated by this job. When specified, the response will contain an 'included' array with catalog item objects.",
        },
        fields__catalog__item: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "Sparse fieldset to limit which catalog item attributes are returned when using include=items. Valid values: 'external_id', 'title', 'description', 'price', 'url', 'image_full_url', 'image_thumbnail_url', 'images', 'custom_metadata', 'published', 'created', 'updated'. Only effective when include=items is specified.",
        },
        fields__catalog__item__bulk__update__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "Sparse fieldset to limit which job attributes are returned. Valid values: 'status', 'created_at', 'total_count', 'completed_count', 'failed_count', 'completed_at', 'errors', 'expires_at'. If omitted, all job attributes are returned.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "bulk_operations",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_update_categories_job",
    description: "Retrieve a catalog category bulk update job by its ID from Klaviyo. This action fetches the status and details of a bulk update job for catalog categories, including progress metrics (total, completed, failed counts) and optionally the related category resources. Use this to track the progress of bulk category update operations. Rate limits: 350/s burst, 3500/m steady. Required scope: `catalogs:read`. Preconditions: - Valid API key with catalogs:read scope - Job ID must exist and be accessible",
    toolSlug: "KLAVIYO_GET_BULK_UPDATE_CATEGORIES_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier for the bulk update categories job",
        },
        include_categories: {
          type: "boolean",
          description: "Whether to include related category data in the response",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "bulk_operations",
    ],
  }),
  composioTool({
    name: "klaviyo_get_bulk_update_variants_job",
    description: "Tool to retrieve a catalog variant bulk update job by its ID. Use when you need to check the status, progress, or results of a bulk update operation on catalog variants.",
    toolSlug: "KLAVIYO_GET_BULK_UPDATE_VARIANTS_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "The unique identifier for the catalog variant bulk update job to retrieve. Obtain this ID from the response of a create bulk update job operation.",
        },
        include: {
          type: "string",
          description: "Options for including related resources in the response.",
          enum: [
            "variants",
          ],
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "bulk_operations",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign",
    description: "Retrieve a specific campaign by its ID from Klaviyo. This action fetches detailed information about a single campaign including its name, status, audience settings, send strategy, and optionally related messages and tags. Rate limits: 10/s burst, 150/m steady. Required scope: `campaigns:read`. Preconditions: - Valid API key with campaigns:read scope - Campaign ID must exist and be accessible",
    toolSlug: "KLAVIYO_GET_CAMPAIGN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The campaign ID to retrieve",
        },
        include_tags: {
          type: "boolean",
          description: "Whether to include tags in the response",
        },
        include_messages: {
          type: "boolean",
          description: "Whether to include campaign messages in the response",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
      "readonly",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_campaign_messages",
    description: "Return all messages that belong to the given campaign.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_CAMPAIGN_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the campaign to retrieve messages for. You can obtain campaign IDs using the Get Campaigns action.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "campaign",
              "template",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__campaign: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "archived",
              "audiences",
              "audiences.included",
              "audiences.excluded",
              "send_options",
              "tracking_options",
              "send_strategy",
              "send_strategy.method",
              "send_strategy.options_static",
              "send_strategy.options_static.datetime",
              "send_strategy.options_static.is_local",
              "send_strategy.options_static.send_past_recipients_immediately",
              "send_strategy.options_throttled",
              "send_strategy.options_throttled.datetime",
              "send_strategy.options_throttled.throttle_percentage",
              "send_strategy.options_sto",
              "send_strategy.options_sto.date",
              "created_at",
              "scheduled_at",
              "updated_at",
              "send_time",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__template: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "editor_type",
              "html",
              "text",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__campaign__message: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "label",
              "channel",
              "content",
              "send_times",
              "render_options",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
              "created_at",
              "updated_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_message",
    description: "Returns a specific message based on a required id.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_MESSAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The message ID to be retrieved",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "campaign",
              "template",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__campaign: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "archived",
              "audiences",
              "audiences.included",
              "audiences.excluded",
              "send_options",
              "tracking_options",
              "send_strategy",
              "send_strategy.method",
              "send_strategy.options_static",
              "send_strategy.options_static.datetime",
              "send_strategy.options_static.is_local",
              "send_strategy.options_static.send_past_recipients_immediately",
              "send_strategy.options_throttled",
              "send_strategy.options_throttled.datetime",
              "send_strategy.options_throttled.throttle_percentage",
              "send_strategy.options_sto",
              "send_strategy.options_sto.date",
              "created_at",
              "scheduled_at",
              "updated_at",
              "send_time",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__template: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "editor_type",
              "html",
              "text",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__campaign__message: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "id",
              "label",
              "channel",
              "content",
              "send_times",
              "render_options",
              "created_at",
              "updated_at",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
              "content.subject",
              "content.preview_text",
              "content.from_email",
              "content.from_label",
              "content.reply_to_email",
              "content.cc_email",
              "content.bcc_email",
              "content.body",
              "content.title",
              "content.notification_type",
              "content.dynamic_image",
              "content.play_sound",
              "content.badge",
              "content.on_open",
            ],
          },
          description: "Sparse fieldset filter for campaign message attributes. Top-level fields: id, label, channel, content, send_times, render_options, created_at, updated_at. Nested content fields for email: content.subject, content.preview_text, content.from_email, content.from_label, content.reply_to_email, content.cc_email, content.bcc_email. Nested content fields for SMS/push: content.body, content.title. Nested render_options fields (SMS): render_options.shorten_links, render_options.add_org_prefix, render_options.add_info_link, render_options.add_opt_out_language.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_message_campaign",
    description: "Return the related campaign<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_MESSAGE_CAMPAIGN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the campaign message. Used to retrieve the parent campaign associated with this message.",
        },
        fields__campaign: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "archived",
              "audiences",
              "audiences.included",
              "audiences.excluded",
              "send_options",
              "tracking_options",
              "send_strategy",
              "send_strategy.method",
              "send_strategy.options_static",
              "send_strategy.options_static.datetime",
              "send_strategy.options_static.is_local",
              "send_strategy.options_static.send_past_recipients_immediately",
              "send_strategy.options_throttled",
              "send_strategy.options_throttled.datetime",
              "send_strategy.options_throttled.throttle_percentage",
              "send_strategy.options_sto",
              "send_strategy.options_sto.date",
              "created_at",
              "scheduled_at",
              "updated_at",
              "send_time",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_message_relationships_campaign",
    description: "Returns the ID of the related campaign<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_MESSAGE_RELATIONSHIPS_CAMPAIGN",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the campaign message to retrieve the campaign relationship for. You can obtain campaign message IDs using the Get Campaign Campaign Messages action.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_message_relationships_template",
    description: "Returns the ID of the related template<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read` `templates:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_MESSAGE_RELATIONSHIPS_TEMPLATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the campaign message to retrieve the template relationship for.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_message_template",
    description: "Return the related template<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read` `templates:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_MESSAGE_TEMPLATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the campaign message. Example: '01KFGQQNRE7Z9FZ0AAQ3TQAKYZ'.",
        },
        fields__template: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "editor_type",
              "html",
              "text",
              "amp",
              "created",
              "updated",
            ],
          },
          description: "Sparse fieldsets to limit which template fields are returned. Available fields: name, editor_type, html, text, amp, created, updated. If not specified, all fields are returned. Example: ['name', 'html'] returns only the template name and HTML content.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_recipient_estimation",
    description: "Get estimated recipients for a given campaign ID using `Create Campaign Recipient Estimation Job`. Rate limits are 10/s burst and 150/m steady. Required scope: `campaigns:read`.",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_RECIPIENT_ESTIMATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the campaign for which to get the estimated number of recipients ",
        },
        fields__campaign__recipient__estimation: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "estimated_recipient_count",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_recipient_estimation_job",
    description: "Retrieve the status of a recipient estimation job triggered with the `Create Campaign Recipient Estimation Job` endpoint.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_RECIPIENT_ESTIMATION_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the campaign to get recipient estimation status",
        },
        fields__campaign__recipient__estimation__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_relationships_campaign_messages",
    description: "Returns the IDs of all messages associated with the given campaign.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_RELATIONSHIPS_CAMPAIGN_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_relationships_tags",
    description: "Returns the IDs of all tags associated with the given campaign.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `campaigns:read` `tags:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_RELATIONSHIPS_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the campaign to retrieve tag relationships for.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_send_job",
    description: "Get a campaign send job<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_SEND_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the campaign to send",
        },
        fields__campaign__send__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaign_tags",
    description: "Return all tags that belong to the given campaign.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `campaigns:read` `tags:read`",
    toolSlug: "KLAVIYO_GET_CAMPAIGN_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the campaign to retrieve tags for (e.g., '01KFT75VHSJJ4X5E1G4ZT0VQCJ').",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "klaviyo_get_campaigns",
    description: "Retrieve campaigns from your Klaviyo account. This action allows you to fetch campaigns with optional filtering and sorting. Klaviyo requires specifying a channel (email or sms) to list campaigns. You can add additional filters for status, name, creation date, and other attributes. Results are paginated with a default of 10 campaigns per page. Rate limits: 10/s burst, 150/m steady. Required scope: `campaigns:read`. Preconditions: - Valid API key with campaigns:read scope - Channel must be specified (email or sms) - Additional filter syntax must be valid if provided",
    toolSlug: "KLAVIYO_GET_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Klaviyo API sort options - note the _at suffix is required for time-based fields.",
          enum: [
            "created_at",
            "-created_at",
            "id",
            "-id",
            "name",
            "-name",
            "scheduled_at",
            "-scheduled_at",
            "updated_at",
            "-updated_at",
          ],
        },
        filter: {
          type: "string",
          description: "Additional filter for campaigns. Will be combined with the required channel filter. Example: 'equals(status,\"draft\")' Malformed or overly complex filters trigger 4xx errors; use simple single-condition filters.",
        },
        channel: {
          type: "string",
          description: "Campaign channel to filter by (email or sms). Required by Klaviyo API.",
          enum: [
            "email",
            "sms",
          ],
        },
        page_cursor: {
          type: "string",
          description: "Cursor for pagination to get the next page of results Iterate using `links.next` until it returns null to retrieve all results.",
        },
        include_archived: {
          type: "boolean",
          description: "Whether to include archived campaigns in the results",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "campaigns",
      "readonly",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_categories",
    description: "Retrieve up to 100 account catalog categories, sortable by creation date. Only `$custom` integration and `$default` catalog types supported. Rate limits are 350/s and 3500/m. Requires `catalogs:read` scope.",
    toolSlug: "KLAVIYO_GET_CATALOG_CATEGORIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`ids`: `any`<br>`item.id`: `equals`<br>`name`: `contains` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__category: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "name",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_category",
    description: "Get a catalog category with the given category ID.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CATALOG_CATEGORY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog category ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        fields__catalog__category: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "name",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_category_items",
    description: "Retrieve up to 100 sorted items per request from a category using the category ID. Sort by 'created' field. Rate limits are 350/s burst and 3500/m steady. Requires 'catalogs:read' scope.",
    toolSlug: "KLAVIYO_GET_CATALOG_CATEGORY_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`ids`: `any`<br>`category.id`: `equals`<br>`title`: `contains`<br>`published`: `equals` ",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "variants",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__item: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__catalog__variant: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "sku",
              "inventory_policy",
              "inventory_quantity",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_category_relationships_items",
    description: "Get all items in the given category ID. Returns a maximum of 100 items per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CATALOG_CATEGORY_RELATIONSHIPS_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_item",
    description: "Get a specific catalog item with the given item ID.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CATALOG_ITEM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog item ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "variants",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__catalog__item: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__catalog__variant: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "sku",
              "inventory_policy",
              "inventory_quantity",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_item_categories",
    description: "Retrieve the catalog categories for an item by ID, sorted by 'created' date, with a 100-category maximum per request. Rate limits: 350/s burst, 3500/m steady. Requires 'catalogs:read' scope.",
    toolSlug: "KLAVIYO_GET_CATALOG_ITEM_CATEGORIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`ids`: `any`<br>`item.id`: `equals`<br>`name`: `contains` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__category: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "name",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_item_relationships_categories",
    description: "Get all catalog categories that a particular item is in. Returns a maximum of 100 categories per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CATALOG_ITEM_RELATIONSHIPS_CATEGORIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_item_variants",
    description: "Retrieve up to 100 variants per request for a specific item ID, sortable by creation date. Rate limits are 350/s burst and 3500/m steady. Requires 'catalogs:read' scope.",
    toolSlug: "KLAVIYO_GET_CATALOG_ITEM_VARIANTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`ids`: `any`<br>`item.id`: `equals`<br>`sku`: `equals`<br>`title`: `contains`<br>`published`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__variant: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "sku",
              "inventory_policy",
              "inventory_quantity",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_items",
    description: "Retrieve up to 100 sorted catalog items per account, with `$custom` integration and `$default` type. Rate limits: 350/s burst, 3500/m steady. Scope required: `catalogs:read`.",
    toolSlug: "KLAVIYO_GET_CATALOG_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`ids`: `any`<br>`category.id`: `equals`<br>`title`: `contains`<br>`published`: `equals` ",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "variants",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__item: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__catalog__variant: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "sku",
              "inventory_policy",
              "inventory_quantity",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_variant",
    description: "Get a catalog item variant with the given variant ID.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CATALOG_VARIANT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog variant ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        fields__catalog__variant: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "sku",
              "inventory_policy",
              "inventory_quantity",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_catalog_variants",
    description: "Retrieve up to 100 account variants per request, sortable by creation date. Supports only `$custom` integration and `$default` catalog types. Rate limits are 350/s burst and 3500/m steady. Requires `catalogs:read` scope.",
    toolSlug: "KLAVIYO_GET_CATALOG_VARIANTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`ids`: `any`<br>`item.id`: `equals`<br>`sku`: `equals`<br>`title`: `contains`<br>`published`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__variant: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "sku",
              "inventory_policy",
              "inventory_quantity",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon",
    description: "Get a specific coupon with the given coupon ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `coupons:read`",
    toolSlug: "KLAVIYO_GET_COUPON",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The internal id of a Coupon is equivalent to its external id stored within an integration. ",
        },
        fields__coupon: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "description",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_code",
    description: "Returns a Coupon Code specified by the given identifier.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `coupon-codes:read`",
    toolSlug: "KLAVIYO_GET_COUPON_CODE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The id of a coupon code is a combination of its unique code and the id of the coupon it is associated with. ",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "coupon",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__coupon: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "description",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__coupon__code: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "unique_code",
              "expires_at",
              "status",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_code_bulk_create_job",
    description: "Get a coupon code bulk create job with the given job ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `coupon-codes:read`",
    toolSlug: "KLAVIYO_GET_COUPON_CODE_BULK_CREATE_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "coupon-codes",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__coupon__code: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "unique_code",
              "expires_at",
              "status",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__coupon__code__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_code_bulk_create_jobs",
    description: "Get all coupon code bulk create jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `coupon-codes:read`",
    toolSlug: "KLAVIYO_GET_COUPON_CODE_BULK_CREATE_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__coupon__code__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_code_relationships_coupon",
    description: "Gets a list of coupon code relationships associated with the given coupon id<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `coupon-codes:read`",
    toolSlug: "KLAVIYO_GET_COUPON_CODE_RELATIONSHIPS_COUPON",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the coupon to retrieve coupon code relationships for.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_codes",
    description: "Obtains coupon codes using necessary coupon or profile filters. Rate limits: 350/s, 3500/m. Requires 'coupon-codes:read' scope.",
    toolSlug: "KLAVIYO_GET_COUPON_CODES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`expires_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`status`: `equals`<br>`coupon.id`: `any`, `equals`<br>`profile.id`: `any`, `equals` ",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "coupon",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__coupon: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "description",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__coupon__code: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "unique_code",
              "expires_at",
              "status",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_codes_for_coupon",
    description: "Gets a list of coupon codes associated with the given coupon id<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `coupon-codes:read`",
    toolSlug: "KLAVIYO_GET_COUPON_CODES_FOR_COUPON",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the coupon (external_id) for which to retrieve associated coupon codes.",
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`expires_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`status`: `equals`<br>`coupon.id`: `any`, `equals`<br>`profile.id`: `any`, `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__coupon__code: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "unique_code",
              "expires_at",
              "status",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_for_coupon_code",
    description: "Get the coupon associated with a given coupon code ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `coupons:read`",
    toolSlug: "KLAVIYO_GET_COUPON_FOR_COUPON_CODE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier for the coupon code. This is typically in the format '{coupon_id}-{unique_code}' (e.g., 'PROMO_SUMMER_2026-SUMMER2026PROMO').",
        },
        fields__coupon: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "description",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_id_for_coupon_code",
    description: "Tool to get the coupon relationship associated with a given coupon code ID. Use when you need to find which coupon is associated with a specific coupon code. Rate limits: Burst: 75/s, Steady: 700/m Required scope: coupons:read",
    toolSlug: "KLAVIYO_GET_COUPON_ID_FOR_COUPON_CODE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the coupon code to look up the relationship of.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupon_relationships_coupon_codes",
    description: "Retrieves the coupon code relationships (resource identifiers) for a given coupon. Returns a list of coupon code IDs associated with the specified coupon, along with pagination links for navigating large result sets. Rate limits: Burst: 75/s, Steady: 700/m Required scopes: coupons:read",
    toolSlug: "KLAVIYO_GET_COUPON_RELATIONSHIPS_COUPON_CODES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the coupon (external_id) to retrieve coupon code relationships for.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_coupons",
    description: "Get all coupons in an account. To learn more, see our [Coupons API guide](https://developers.klaviyo.com/en/docs/use_klaviyos_coupons_api).<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `coupons:read`",
    toolSlug: "KLAVIYO_GET_COUPONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__coupon: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "description",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "coupons",
    ],
  }),
  composioTool({
    name: "klaviyo_get_create_categories_job",
    description: "Get a catalog category bulk create job with the given job ID. An `include` parameter can be provided to get the following related resource data: `categories`.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CREATE_CATEGORIES_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "categories",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__catalog__category: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "name",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__catalog__category__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_create_categories_jobs",
    description: "Get all catalog category bulk create jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CREATE_CATEGORIES_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__category__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_create_items_job",
    description: "Get a catalog item bulk create job with the given job ID. An `include` parameter can be provided to get the following related resource data: `items`.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CREATE_ITEMS_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "items",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__catalog__item: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__catalog__item__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_create_items_jobs",
    description: "Get all catalog item bulk create jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CREATE_ITEMS_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__item__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_create_variants_job",
    description: "Get a catalog variant bulk create job with the given job ID. An `include` parameter can be provided to get the following related resource data: `variants`.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CREATE_VARIANTS_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "variants",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__catalog__variant: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "sku",
              "inventory_policy",
              "inventory_quantity",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__catalog__variant__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_create_variants_jobs",
    description: "Get all catalog variant bulk create jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_CREATE_VARIANTS_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__variant__bulk__create__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_delete_categories_job",
    description: "Get a catalog category bulk delete job with the given job ID.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_DELETE_CATEGORIES_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        fields__catalog__category__bulk__delete__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_delete_categories_jobs",
    description: "Get all catalog category bulk delete jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_DELETE_CATEGORIES_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__category__bulk__delete__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_delete_items_jobs",
    description: "Get all catalog item bulk delete jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_DELETE_ITEMS_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__item__bulk__delete__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_delete_variants_job",
    description: "Get a catalog variant bulk delete job with the given job ID.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_DELETE_VARIANTS_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        fields__catalog__variant__bulk__delete__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_delete_variants_jobs",
    description: "Get all catalog variant bulk delete jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_DELETE_VARIANTS_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__variant__bulk__delete__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_event",
    description: "Get an event with the given event ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `events:read`",
    toolSlug: "KLAVIYO_GET_EVENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "ID of the event",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "attributions",
              "metric",
              "profile",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__event: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "timestamp",
              "event_properties",
              "datetime",
              "uuid",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__metric: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "integration",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "email",
              "phone_number",
              "external_id",
              "first_name",
              "last_name",
              "organization",
              "locale",
              "title",
              "image",
              "created",
              "updated",
              "last_event_date",
              "location",
              "location.address1",
              "location.address2",
              "location.city",
              "location.country",
              "location.latitude",
              "location.longitude",
              "location.region",
              "location.zip",
              "location.timezone",
              "location.ip",
              "properties",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "klaviyo_get_event_metric",
    description: "Get the metric for an event with the given event ID.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `events:read` `metrics:read`",
    toolSlug: "KLAVIYO_GET_EVENT_METRIC",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        fields__metric: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "integration",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "klaviyo_get_event_profile",
    description: "Get the profile associated with an event with the given event ID.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `events:read` `profiles:read`",
    toolSlug: "KLAVIYO_GET_EVENT_PROFILE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the event to retrieve the associated profile for.",
        },
        fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "email",
              "phone_number",
              "external_id",
              "first_name",
              "last_name",
              "organization",
              "locale",
              "title",
              "image",
              "created",
              "updated",
              "last_event_date",
              "location",
              "location.address1",
              "location.address2",
              "location.city",
              "location.country",
              "location.latitude",
              "location.longitude",
              "location.region",
              "location.zip",
              "location.timezone",
              "location.ip",
              "properties",
              "subscriptions",
              "subscriptions.email",
              "subscriptions.email.marketing",
              "subscriptions.email.marketing.can_receive_email_marketing",
              "subscriptions.email.marketing.consent",
              "subscriptions.email.marketing.consent_timestamp",
              "subscriptions.email.marketing.last_updated",
              "subscriptions.email.marketing.method",
              "subscriptions.email.marketing.method_detail",
              "subscriptions.email.marketing.custom_method_detail",
              "subscriptions.email.marketing.double_optin",
              "subscriptions.email.marketing.suppression",
              "subscriptions.email.marketing.list_suppressions",
              "subscriptions.sms",
              "subscriptions.sms.marketing",
              "subscriptions.sms.marketing.can_receive_sms_marketing",
              "subscriptions.sms.marketing.consent",
              "subscriptions.sms.marketing.consent_timestamp",
              "subscriptions.sms.marketing.method",
              "subscriptions.sms.marketing.method_detail",
              "subscriptions.sms.marketing.last_updated",
              "predictive_analytics",
              "predictive_analytics.historic_clv",
              "predictive_analytics.predicted_clv",
              "predictive_analytics.total_clv",
              "predictive_analytics.historic_number_of_orders",
              "predictive_analytics.predicted_number_of_orders",
              "predictive_analytics.average_days_between_orders",
              "predictive_analytics.average_order_value",
              "predictive_analytics.churn_probability",
              "predictive_analytics.expected_date_of_next_order",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        additional__fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "subscriptions",
              "predictive_analytics",
            ],
          },
          description: "Request additional fields not included by default in the response. Supported values: \"subscriptions\", \"predictive_analytics\" ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "klaviyo_get_event_relationships",
    description: "Get metrics or profile relationships for a specific event. Use when you need to retrieve the metric or profile associated with an event. Rate limits: 350/s burst, 3500/m steady. Required scopes: Events Read, Metrics Read, Profiles Read.",
    toolSlug: "KLAVIYO_GET_EVENT_RELATIONSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier for the event",
        },
        related_resource: {
          type: "string",
          description: "The type of relationship to retrieve - either 'metric' or 'profile'",
          enum: [
            "metric",
            "profile",
          ],
        },
      },
      required: [
        "id",
        "related_resource",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "relationships",
    ],
  }),
  composioTool({
    name: "klaviyo_get_events",
    description: "Get all events in an account Requests can be sorted by the following fields: `datetime`, `timestamp` Returns a maximum of 200 events per page.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `events:read`",
    toolSlug: "KLAVIYO_GET_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "datetime",
            "-datetime",
            "timestamp",
            "-timestamp",
          ],
        },
        filter: {
          type: "string",
          description: "Filter events using Klaviyo filter syntax. IMPORTANT: Only the following fields are filterable for events: datetime, metric_id, profile, profile_id, timestamp. Fields like '$attributed_campaign' and other event properties are NOT filterable and will result in a 400 error. Allowed field(s)/operator(s): `metric_id`: `equals` - The metric_id must be a 6-character alphanumeric ID (e.g., 'Vatr8j'), NOT a metric name like 'Opened Email'. Use the Get Metrics endpoint (KLAVIYO_GET_METRICS) to retrieve valid metric IDs for your account. `profile_id`: `equals` - The profile_id must be a valid Klaviyo profile ID. `profile`: `has` - Check if profile exists. `datetime`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` - Use ISO 8601 format (e.g., '2024-01-01T00:00:00Z'). `timestamp`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` - Unix timestamp. Example: equals(metric_id,\"Vatr8j\"),greater-than(datetime,2024-01-01T00:00:00Z). For more information: https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "attributions",
              "metric",
              "profile",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__event: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "timestamp",
              "event_properties",
              "datetime",
              "uuid",
              "id",
            ],
          },
          description: "Sparse fieldsets to select specific event fields. Valid values: 'timestamp', 'event_properties', 'datetime', 'uuid', 'id'. Note: 'metric_id' and 'profile_id' are filter parameters (use the 'filter' param), not sparse fieldset values. Use 'event_properties' (not 'properties') for event custom properties. For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets",
        },
        fields__metric: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "integration",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "email",
              "phone_number",
              "external_id",
              "first_name",
              "last_name",
              "organization",
              "locale",
              "title",
              "image",
              "created",
              "updated",
              "last_event_date",
              "location",
              "location.address1",
              "location.address2",
              "location.city",
              "location.country",
              "location.latitude",
              "location.longitude",
              "location.region",
              "location.zip",
              "location.timezone",
              "location.ip",
              "properties",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "events",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow",
    description: "Get a flow with the given flow ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_GET_FLOW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow to retrieve. Flow IDs can be obtained from the Get Flows endpoint.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "flow-actions",
              "tags",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__flow: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "archived",
              "created",
              "updated",
              "trigger_type",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__flow__action: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "action_type",
              "status",
              "created",
              "updated",
              "settings",
              "tracking_options",
              "send_options",
              "send_options.use_smart_sending",
              "send_options.is_transactional",
              "render_options",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_action",
    description: "Get a flow action from a flow with the given flow action ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_GET_FLOW_ACTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "flow",
              "flow-messages",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__flow: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "archived",
              "created",
              "updated",
              "trigger_type",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__flow__action: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "action_type",
              "status",
              "created",
              "updated",
              "settings",
              "tracking_options",
              "send_options",
              "send_options.use_smart_sending",
              "send_options.is_transactional",
              "render_options",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__flow__message: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "channel",
              "content",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_action_for_message",
    description: "Get the flow action for a flow message with the given message ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_GET_FLOW_ACTION_FOR_MESSAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow message. Flow message IDs can be obtained from the GET flow action messages endpoint.",
        },
        fields__flow__action: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "action_type",
              "status",
              "created",
              "updated",
              "settings",
              "tracking_options",
              "send_options",
              "send_options.use_smart_sending",
              "send_options.is_transactional",
              "render_options",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_action_messages",
    description: "Retrieve up to 50 flow messages per request by action ID, sortable by various fields, with ascending/descending options, and paginated using `page[size]` and `page[number]`. Rate limits: 3/s burst, 60/m steady. Scope required: `flows:read`.",
    toolSlug: "KLAVIYO_GET_FLOW_ACTION_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow action to retrieve messages for. Flow action IDs can be obtained from the Get Flow Actions endpoint.",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
            "id",
            "-id",
            "name",
            "-name",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`id`: `any`<br>`name`: `contains`, `ends-with`, `equals`, `starts-with`<br>`created`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`updated`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 50. Min: 1. Max: 100.",
        },
        fields__flow__message: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "channel",
              "content",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_action_relationships_flow",
    description: "Get the parent flow associated with a given flow action ID. This endpoint returns the flow relationship data for a specific flow action, allowing you to identify which flow contains the specified action. Use cases: - Determine which flow a specific action belongs to - Navigate from an action to its parent flow Rate limits: Burst: 3/s, Steady: 60/m Required scope: flows:read",
    toolSlug: "KLAVIYO_GET_FLOW_ACTION_RELATIONSHIPS_FLOW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The numeric ID of the flow action. Flow action IDs can be obtained from the Get Flow Flow Actions endpoint or from the Get Flows endpoint with flow-actions included.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_action_relationships_messages",
    description: "Retrieves up to 50 flow message relationships per request for a specified flow action ID, with cursor pagination. Rate limits: 3/s burst, 60/min steady. Requires `flows:read` scope.",
    toolSlug: "KLAVIYO_GET_FLOW_ACTION_RELATIONSHIPS_MESSAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow action to retrieve message relationships for.",
        },
        sort: {
          type: "string",
          description: "Sort field and direction for results. Options: 'created', '-created', 'id', '-id', 'name', '-name', 'updated', '-updated'. Prefix with '-' for descending order.",
          enum: [
            "created",
            "-created",
            "id",
            "-id",
            "name",
            "-name",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "Filter criteria for flow messages. Allowed field(s)/operator(s): `name`: `contains`, `ends-with`, `equals`, `starts-with`; `created`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`; `updated`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`. Example: equals(name,'Welcome Email').",
        },
        page__size: {
          type: "integer",
          description: "Number of results per page. Default: 50. Min: 1. Max: 50.",
        },
        page__cursor: {
          type: "string",
          description: "Cursor for pagination. Use the value from 'links.next' in a previous response to fetch the next page.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_flow_actions",
    description: "Get all flow actions associated with the given flow ID. Returns a maximum of 50 flow actions per request, which can be paginated with cursor-based pagination.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_GET_FLOW_FLOW_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow to retrieve flow actions for. Flow IDs can be obtained from the Get Flows endpoint.",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "action_type",
            "-action_type",
            "created",
            "-created",
            "id",
            "-id",
            "status",
            "-status",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`id`: `any`<br>`action_type`: `any`, `equals` (valid values: BOOLEAN_BRANCH, SEND_EMAIL, UPDATE_CUSTOMER, <PERSON>, TIME_DELAY, BACK_IN_STOCK_DELAY, COUNTDOWN_DELAY, SEND_SMS, SEND_NOTIFICATION_MESSAGE, WEBHOOK, AB_TEST)<br>`status`: `equals`<br>`created`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`updated`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 50. Min: 1. Max: 50.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__flow__action: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "action_type",
              "status",
              "created",
              "updated",
              "settings",
              "tracking_options",
              "send_options",
              "send_options.use_smart_sending",
              "send_options.is_transactional",
              "render_options",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_for_flow_action",
    description: "Get the flow associated with the given action ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_GET_FLOW_FOR_FLOW_ACTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow action. Flow action IDs can be obtained from the Get Flow Actions endpoint or from flow-actions relationships on flow objects.",
        },
        fields__flow: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "archived",
              "created",
              "updated",
              "trigger_type",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_message",
    description: "Get the flow message of a flow with the given message ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_GET_FLOW_MESSAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The flow message ID. Flow messages are associated with EMAIL or SMS actions within flows. Obtain flow message IDs via the Get Flow Action Messages endpoint using a flow action ID of type SEND_EMAIL or SEND_SMS.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "flow-action",
              "template",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__template: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "editor_type",
              "html",
              "text",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__flow__action: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "action_type",
              "status",
              "created",
              "updated",
              "settings",
              "tracking_options",
              "send_options",
              "send_options.use_smart_sending",
              "send_options.is_transactional",
              "render_options",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__flow__message: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "channel",
              "content",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_message_relationships_action",
    description: "Get the flow action relationship for a specific flow message. This returns the parent flow action that contains the specified flow message (e.g., the SEND_EMAIL or SEND_SMS action). Requires a valid flow message ID which can be obtained from GET /api/flow-actions/{id}/flow-messages/. Rate limits: Burst 3/s, Steady 60/m. Required scope: flows:read",
    toolSlug: "KLAVIYO_GET_FLOW_MESSAGE_RELATIONSHIPS_ACTION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow message. Flow message IDs can be obtained from the GET /api/flow-actions/{id}/flow-messages/ endpoint or from the relationships.flow-messages.data array when fetching flow actions.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_message_relationships_template",
    description: "Returns the ID of the related template<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `templates:read`",
    toolSlug: "KLAVIYO_GET_FLOW_MESSAGE_RELATIONSHIPS_TEMPLATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The flow message ID. Flow messages are associated with EMAIL or SMS actions within flows. Get flow message IDs via the Get Flow Action Messages endpoint using a flow action ID.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_message_template",
    description: "Return the related template<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `templates:read`",
    toolSlug: "KLAVIYO_GET_FLOW_MESSAGE_TEMPLATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The flow message ID. Flow messages are associated with EMAIL or SMS actions within flows. Get flow message IDs via the Get Flow Action Messages endpoint using a flow action ID.",
        },
        fields__template: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "editor_type",
              "html",
              "text",
              "amp",
              "created",
              "updated",
            ],
          },
          description: "Optional list of template fields to include in the response. Available fields: name, editor_type, html, text, amp, created, updated. If not specified, all fields are returned. Use sparse fieldsets to reduce response size.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_relationships_flow_actions",
    description: "Retrieve all flow action relationships for a specific flow ID, sortable by `id`, `status`, `created`, `updated`. Refine with filters, max 50 per page, paginated by `page[size]` and `page[number]`. Rate limits: Burst 3/s, Steady 60/m. Scope: `flows:read`.",
    toolSlug: "KLAVIYO_GET_FLOW_RELATIONSHIPS_FLOW_ACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (ID) of the flow to retrieve flow action relationships for. Can be obtained from the Get Flows endpoint.",
        },
        sort: {
          type: "string",
          description: "Sort results by a specified field. Use '-' prefix for descending order. Options: 'created', '-created', 'id', '-id', 'status', '-status', 'updated', '-updated'. See https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting for more details.",
          enum: [
            "created",
            "-created",
            "id",
            "-id",
            "status",
            "-status",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "Filter string to refine results. Allowed field(s)/operator(s): `action_type`: `equals` - Valid values: BOOLEAN_BRANCH, SEND_EMAIL, UPDATE_CUSTOMER, <PERSON>, TIME_DELAY, BACK_IN_STOCK_DELAY, COUNTDOWN_DELAY, SEND_SMS, SEND_NOTIFICATION_MESSAGE, WEBHOOK, AB_TEST (e.g., 'equals(action_type,\"SEND_EMAIL\")'); `status`: `equals` (e.g., 'equals(status,\"live\")'); `created`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`; `updated`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`. See https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering for more details.",
        },
        page__size: {
          type: "integer",
          description: "Default: 50. Min: 1. Max: 100.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_relationships_tags",
    description: "Return the tag IDs of all tags associated with the given flow.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read` `tags:read`",
    toolSlug: "KLAVIYO_GET_FLOW_RELATIONSHIPS_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow to retrieve tag relationships for. Example: 'RkaANL'.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flow_tags",
    description: "Return all tags associated with the given flow ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read` `tags:read`",
    toolSlug: "KLAVIYO_GET_FLOW_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow to retrieve tags for. Example: 'Yd27AJ'.",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "Sparse fieldset to limit which tag fields are returned. Currently supports 'name' to only return tag names. If not specified, all available tag fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_flows",
    description: "Get all flows in an account. Returns a maximum of 50 flows per request, which can be paginated with cursor-based pagination.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_GET_FLOWS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
            "id",
            "-id",
            "name",
            "-name",
            "status",
            "-status",
            "trigger_type",
            "-trigger_type",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "Filter syntax uses function format: `operator(field,\"value\")`. **String values MUST be quoted.** Examples: `equals(status,\"live\")`, `contains(name,\"welcome\")`, `any(id,[\"ID1\",\"ID2\"])`. Allowed field(s)/operator(s): `id`: `any`; `name`: `contains`, `ends-with`, `equals`, `starts-with`; `status`: `equals`; `archived`: `equals`; `created`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`; `updated`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`; `trigger_type`: `equals`. For more information visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "flow-actions",
              "tags",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        page__size: {
          type: "integer",
          description: "Number of flows to return per page.",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__flow: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "archived",
              "created",
              "updated",
              "trigger_type",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__flow__action: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "action_type",
              "status",
              "created",
              "updated",
              "settings",
              "tracking_options",
              "send_options",
              "send_options.use_smart_sending",
              "send_options.is_transactional",
              "render_options",
              "render_options.shorten_links",
              "render_options.add_org_prefix",
              "render_options.add_info_link",
              "render_options.add_opt_out_language",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "flows",
    ],
  }),
  composioTool({
    name: "klaviyo_get_form",
    description: "Get the form with the given ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `forms:read`",
    toolSlug: "KLAVIYO_GET_FORM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the form to retrieve. This is a 6-character alphanumeric ID (e.g., 'RTcXBK'). You can get form IDs from the KLAVIYO_GET_FORMS action.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "form-versions",
            ],
          },
          description: "Related resources to include in the response. Currently supports: 'form-versions' to include detailed form version data.",
        },
        fields__form: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "ab_test",
              "created_at",
              "updated_at",
            ],
          },
          description: "Sparse fieldset to limit which form attributes are returned. Available fields: 'name', 'status', 'ab_test', 'created_at', 'updated_at'. If not specified, all fields are returned.",
        },
        fields__form__version: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "form_type",
              "ab_test",
              "ab_test.variation_name",
              "status",
              "created_at",
              "updated_at",
            ],
          },
          description: "Sparse fieldset to limit which form-version attributes are returned. Available fields: 'form_type', 'ab_test', 'ab_test.variation_name', 'status', 'created_at', 'updated_at'. Only used when include contains 'form-versions'.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "klaviyo_get_form_for_form_version",
    description: "Get the form associated with the given form version.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `forms:read`",
    toolSlug: "KLAVIYO_GET_FORM_FOR_FORM_VERSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (ID) of the form version. You can get form version IDs by calling get_version_ids_for_form with a form ID.",
        },
        fields__form: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "ab_test",
              "created_at",
              "updated_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "klaviyo_get_form_id_for_form_version",
    description: "Get the ID of the form associated with the given form version.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `forms:read`",
    toolSlug: "KLAVIYO_GET_FORM_ID_FOR_FORM_VERSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the form version to retrieve the associated form ID for.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "klaviyo_get_form_version",
    description: "Retrieve detailed information about a specific form version by its ID. Form versions represent different variations of a Klaviyo sign-up form. A form may have multiple versions for A/B testing (multiple live variations) or draft/live combinations during editing. Use this endpoint to get the full configuration including form type, status, steps, styling, triggers, and other settings. Rate limits: Burst 3/s, Steady 60/m. Required scope: forms:read",
    toolSlug: "KLAVIYO_GET_FORM_VERSION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the form version to retrieve. Obtain this ID from the 'Get Versions for Form' endpoint or from form version relationships.",
        },
        fields__form__version: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "form_type",
              "ab_test",
              "ab_test.variation_name",
              "status",
              "created_at",
              "updated_at",
            ],
          },
          description: "Sparse fieldset filter to limit which attributes are returned. Available fields: form_type, ab_test, ab_test.variation_name, status, created_at, updated_at. If omitted, all fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "klaviyo_get_forms",
    description: "Get all forms in an account.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `forms:read`",
    toolSlug: "KLAVIYO_GET_FORMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created_at",
            "-created_at",
            "updated_at",
            "-updated_at",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`id`: `any`, `equals`<br>`name`: `any`, `contains`, `equals`<br>`ab_test`: `equals`<br>`updated_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`created_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`status`: `equals` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        fields__form: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "status",
              "ab_test",
              "created_at",
              "updated_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "klaviyo_get_image",
    description: "Get the image with the given image ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `images:read`",
    toolSlug: "KLAVIYO_GET_IMAGE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the image",
        },
        fields__image: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "image_url",
              "format",
              "size",
              "hidden",
              "updated_at",
            ],
          },
          description: "Specify which image attributes to return (sparse fieldsets). Options: name, image_url, format, size, hidden, updated_at. If not specified, all attributes are returned. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "images",
    ],
  }),
  composioTool({
    name: "klaviyo_get_images",
    description: "Get all images in an account.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `images:read`",
    toolSlug: "KLAVIYO_GET_IMAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "format",
            "-format",
            "id",
            "-id",
            "name",
            "-name",
            "size",
            "-size",
            "updated_at",
            "-updated_at",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`id`: `any`, `equals`<br>`updated_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`format`: `any`, `equals`<br>`name`: `any`, `contains`, `ends-with`, `equals`, `starts-with`<br>`size`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`hidden`: `any`, `equals` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__image: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "image_url",
              "format",
              "size",
              "hidden",
              "updated_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "images",
    ],
  }),
  composioTool({
    name: "klaviyo_get_list",
    description: "API allows 75 req/sec and 700 req/min, but with 'profile_count' param, it's 1 req/sec and 15 req/min. 'lists:read' scope needed. See developer guide for details.",
    toolSlug: "KLAVIYO_GET_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Primary key that uniquely identifies this list. Generated by Klaviyo.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "tags",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__list: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "opt_in_process",
              "profile_count",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        additional__fields__list: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "profile_count",
            ],
          },
          description: "Request additional fields not included by default in the response. Supported values: \"profile_count\" ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "klaviyo_get_list_profiles",
    description: "Retrieve profiles in a list by ID, filterable by email/phone/push token/join date, sortable by join date. Regular rate limit: 75/s, 700/m; with predictive analytics: 10/s, 150/m. Details at Klaviyo guide. Scopes required: lists:read, profiles:read.",
    toolSlug: "KLAVIYO_GET_LIST_PROFILES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the Klaviyo list to retrieve profiles from. Example: 'Y6nRLr'",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "joined_group_at",
            "-joined_group_at",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`email`: `any`, `equals`<br>`phone_number`: `any`, `equals`<br>`push_token`: `any`, `equals`<br>`_kx`: `equals`<br>`joined_group_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "email",
              "phone_number",
              "external_id",
              "first_name",
              "last_name",
              "organization",
              "locale",
              "title",
              "image",
              "created",
              "updated",
              "last_event_date",
              "location",
              "location.address1",
              "location.address2",
              "location.city",
              "location.country",
              "location.latitude",
              "location.longitude",
              "location.region",
              "location.zip",
              "location.timezone",
              "location.ip",
              "properties",
              "joined_group_at",
              "subscriptions",
              "subscriptions.email",
              "subscriptions.email.marketing",
              "subscriptions.email.marketing.can_receive_email_marketing",
              "subscriptions.email.marketing.consent",
              "subscriptions.email.marketing.consent_timestamp",
              "subscriptions.email.marketing.last_updated",
              "subscriptions.email.marketing.method",
              "subscriptions.email.marketing.method_detail",
              "subscriptions.email.marketing.custom_method_detail",
              "subscriptions.email.marketing.double_optin",
              "subscriptions.email.marketing.suppression",
              "subscriptions.email.marketing.list_suppressions",
              "subscriptions.sms",
              "subscriptions.sms.marketing",
              "subscriptions.sms.marketing.can_receive_sms_marketing",
              "subscriptions.sms.marketing.consent",
              "subscriptions.sms.marketing.consent_timestamp",
              "subscriptions.sms.marketing.method",
              "subscriptions.sms.marketing.method_detail",
              "subscriptions.sms.marketing.last_updated",
              "predictive_analytics",
              "predictive_analytics.historic_clv",
              "predictive_analytics.predicted_clv",
              "predictive_analytics.total_clv",
              "predictive_analytics.historic_number_of_orders",
              "predictive_analytics.predicted_number_of_orders",
              "predictive_analytics.average_days_between_orders",
              "predictive_analytics.average_order_value",
              "predictive_analytics.churn_probability",
              "predictive_analytics.expected_date_of_next_order",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        additional__fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "subscriptions",
              "predictive_analytics",
            ],
          },
          description: "Request additional fields not included by default in the response. Supported values: \"subscriptions\", \"predictive_analytics\" ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "klaviyo_get_list_relationships",
    description: "Get profile membership relationships for a Klaviyo list. Returns references (IDs) to profiles that are members of the specified list. Use when you need to retrieve which profiles belong to a list without fetching full profile data.",
    toolSlug: "KLAVIYO_GET_LIST_RELATIONSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the list",
        },
        page_cursor: {
          type: "string",
          description: "Cursor for pagination to get the next page of results",
        },
        related_resource: {
          type: "string",
          description: "The type of related resource to retrieve (currently only 'profiles' is supported)",
          enum: [
            "profiles",
          ],
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "relationships",
    ],
  }),
  composioTool({
    name: "klaviyo_get_list_relationships_tags",
    description: "Returns the tag IDs of all tags associated with the given list.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `lists:read` `tags:read`",
    toolSlug: "KLAVIYO_GET_LIST_RELATIONSHIPS_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (ID) of the list to retrieve tag relationships for. Example: 'TDFT78'",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "klaviyo_get_list_tags",
    description: "Return all tags associated with the given list ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `lists:read` `tags:read`",
    toolSlug: "KLAVIYO_GET_LIST_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the Klaviyo list to retrieve tags for.",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "klaviyo_get_lists",
    description: "Retrieve marketing lists from your Klaviyo account. This action allows you to fetch lists with optional filtering and sorting. You can filter by name, creation date, and other attributes. Results are paginated with a default of 10 lists per page. Rate limits: 75/s burst, 700/m steady. Required scope: `lists:read`. Preconditions: - Valid API key with lists:read scope - Filter syntax must be valid if provided",
    toolSlug: "KLAVIYO_GET_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Sort lists by field (add '-' prefix for descending order)",
          enum: [
            "created",
            "-created",
            "id",
            "-id",
            "name",
            "-name",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "Filter lists by name, creation date, etc. Example: 'equals(name,\"Newsletter\")'",
        },
        page_cursor: {
          type: "string",
          description: "Cursor for pagination to get the next page of results",
        },
        include_tags: {
          type: "boolean",
          description: "Whether to include tags associated with the lists",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "lists",
      "readonly",
    ],
  }),
  composioTool({
    name: "klaviyo_get_metric",
    description: "Get a metric with the given metric ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `metrics:read`",
    toolSlug: "KLAVIYO_GET_METRIC",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Metric ID",
        },
        fields__metric: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "integration",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "metrics",
    ],
  }),
  composioTool({
    name: "klaviyo_get_metrics",
    description: "Get all metrics in an account. Requests can be filtered by the following fields: integration `name`, integration `category` Returns a maximum of 200 results per page.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `metrics:read`",
    toolSlug: "KLAVIYO_GET_METRICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "Filter metrics by integration fields only. IMPORTANT: The metric's own 'name' field is NOT filterable. Only integration fields can be filtered. Allowed fields and operators: `integration.name` with `equals`, `integration.category` with `equals`. Example: equals(integration.name,'Klaviyo') or equals(integration.category,'Internal'). For more information visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__metric: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "integration",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "metrics",
    ],
  }),
  composioTool({
    name: "klaviyo_get_profile",
    description: "Get the profile with the given profile ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `profiles:read`",
    toolSlug: "KLAVIYO_GET_PROFILE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "lists",
              "segments",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__list: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "opt_in_process",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "email",
              "phone_number",
              "external_id",
              "first_name",
              "last_name",
              "organization",
              "locale",
              "title",
              "image",
              "created",
              "updated",
              "last_event_date",
              "location",
              "location.address1",
              "location.address2",
              "location.city",
              "location.country",
              "location.latitude",
              "location.longitude",
              "location.region",
              "location.zip",
              "location.timezone",
              "location.ip",
              "properties",
              "subscriptions",
              "subscriptions.email",
              "subscriptions.email.marketing",
              "subscriptions.email.marketing.can_receive_email_marketing",
              "subscriptions.email.marketing.consent",
              "subscriptions.email.marketing.consent_timestamp",
              "subscriptions.email.marketing.last_updated",
              "subscriptions.email.marketing.method",
              "subscriptions.email.marketing.method_detail",
              "subscriptions.email.marketing.custom_method_detail",
              "subscriptions.email.marketing.double_optin",
              "subscriptions.email.marketing.suppression",
              "subscriptions.email.marketing.list_suppressions",
              "subscriptions.sms",
              "subscriptions.sms.marketing",
              "subscriptions.sms.marketing.can_receive_sms_marketing",
              "subscriptions.sms.marketing.consent",
              "subscriptions.sms.marketing.consent_timestamp",
              "subscriptions.sms.marketing.method",
              "subscriptions.sms.marketing.method_detail",
              "subscriptions.sms.marketing.last_updated",
              "predictive_analytics",
              "predictive_analytics.historic_clv",
              "predictive_analytics.predicted_clv",
              "predictive_analytics.total_clv",
              "predictive_analytics.historic_number_of_orders",
              "predictive_analytics.predicted_number_of_orders",
              "predictive_analytics.average_days_between_orders",
              "predictive_analytics.average_order_value",
              "predictive_analytics.churn_probability",
              "predictive_analytics.expected_date_of_next_order",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        fields__segment: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "definition",
              "definition.condition_groups",
              "created",
              "updated",
              "is_active",
              "is_processing",
              "is_starred",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        additional__fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "subscriptions",
              "predictive_analytics",
            ],
          },
          description: "Request additional fields not included by default in the response. Supported values: \"subscriptions\", \"predictive_analytics\" ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_profile_lists",
    description: "Get list memberships for a profile with the given profile ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `lists:read` `profiles:read`",
    toolSlug: "KLAVIYO_GET_PROFILE_LISTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the profile to retrieve list memberships for. This is a Klaviyo profile ID (e.g., '01KFT7HBHVKV3D25581YVCNAJN').",
        },
        fields__list: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "created",
              "updated",
              "opt_in_process",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_profile_relationships",
    description: "Tool to get list membership or segment membership relationships for a profile with the given profile ID. Use when you need to determine which lists or segments a specific profile belongs to.",
    toolSlug: "KLAVIYO_GET_PROFILE_RELATIONSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the profile (e.g., '01KFT7HBHVKV3D25581YVCNAJN'). Retrieve profile IDs from the Get Profiles endpoint.",
        },
        related_resource: {
          type: "string",
          description: "The type of relationship to retrieve - either 'lists' for list memberships or 'segments' for segment memberships.",
          enum: [
            "lists",
            "segments",
          ],
        },
      },
      required: [
        "id",
        "related_resource",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "relationships",
    ],
  }),
  composioTool({
    name: "klaviyo_get_profile_segments",
    description: "Get segment memberships for a profile with the given profile ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `profiles:read` `segments:read`",
    toolSlug: "KLAVIYO_GET_PROFILE_SEGMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        fields__segment: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "definition",
              "definition.condition_groups",
              "created",
              "updated",
              "is_active",
              "is_processing",
              "is_starred",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
    ],
  }),
  composioTool({
    name: "klaviyo_get_profiles",
    description: "Retrieve profiles from your Klaviyo account. This action allows you to fetch profiles with optional filtering and sorting. You can filter by email, external_id, creation date, and other attributes. Results are paginated with a configurable page size. Rate limits: 75/s burst, 700/m steady (lower with predictive_analytics). Required scope: `profiles:read`. Preconditions: - Valid API key with profiles:read scope - Filter syntax must be valid if provided - Page size must be between 1 and 100",
    toolSlug: "KLAVIYO_GET_PROFILES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Sort profiles by field (add '-' prefix for descending order)",
          enum: [
            "created",
            "-created",
            "email",
            "-email",
            "id",
            "-id",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "Filter profiles by email, external_id, created date, etc. Example: 'equals(email,\"user@example.com\")' Prefer specific filters (email, external_id) over broad queries to reduce response size. Multi-condition filters are more error-prone than single-condition filters.",
        },
        page_size: {
          type: "integer",
          description: "Number of profiles to return per page (1-100)",
        },
        page_cursor: {
          type: "string",
          description: "Cursor for pagination to get the next page of results",
        },
        include_subscriptions: {
          type: "boolean",
          description: "Whether to include subscription information in the response",
        },
        include_predictive_analytics: {
          type: "boolean",
          description: "Whether to include predictive analytics data (note: this may reduce rate limits)",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "profiles",
      "readonly",
    ],
  }),
  composioTool({
    name: "klaviyo_get_segment",
    description: "Fetch a segment by ID with default rates of 75/s and 700/m, or with `additional-fields` at 1/s and 15/m. For details, visit the provided guide. Required scope: `segments:read`.",
    toolSlug: "KLAVIYO_GET_SEGMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the segment to retrieve. This ID is returned when creating segments or listing segments via the API.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "tags",
            ],
          },
          description: "Include related resources in the response. Set to ['tags'] to include tag objects associated with this segment. When included, the full tag objects will appear in an 'included' array in the response.",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "Specify which tag fields to include in the response when using include=['tags']. Available fields: 'name'. If not specified, all tag fields are returned.",
        },
        fields__segment: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "definition",
              "definition.condition_groups",
              "created",
              "updated",
              "is_active",
              "is_processing",
              "is_starred",
              "profile_count",
            ],
          },
          description: "Specify which segment fields to include in the response using sparse fieldsets. Available fields: 'name', 'definition', 'definition.condition_groups', 'created', 'updated', 'is_active', 'is_processing', 'is_starred', 'profile_count'. If not specified, all fields are returned.",
        },
        additional__fields__segment: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "profile_count",
            ],
          },
          description: "Request additional fields not included by default in the response. Supported values: \"profile_count\" ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "segments",
    ],
  }),
  composioTool({
    name: "klaviyo_get_segment_profiles",
    description: "Retrieve profiles in a segment by ID, filtering by email, phone, token, or join date, and sorting by join date. Rate limit: 75/s burst, 700/m steady. Requires profiles:read and segments:read scopes.",
    toolSlug: "KLAVIYO_GET_SEGMENT_PROFILES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "joined_group_at",
            "-joined_group_at",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`email`: `any`, `equals`<br>`phone_number`: `any`, `equals`<br>`push_token`: `any`, `equals`<br>`_kx`: `equals`<br>`joined_group_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "email",
              "phone_number",
              "external_id",
              "first_name",
              "last_name",
              "organization",
              "locale",
              "title",
              "image",
              "created",
              "updated",
              "last_event_date",
              "location",
              "location.address1",
              "location.address2",
              "location.city",
              "location.country",
              "location.latitude",
              "location.longitude",
              "location.region",
              "location.zip",
              "location.timezone",
              "location.ip",
              "properties",
              "joined_group_at",
              "subscriptions",
              "subscriptions.email",
              "subscriptions.email.marketing",
              "subscriptions.email.marketing.can_receive_email_marketing",
              "subscriptions.email.marketing.consent",
              "subscriptions.email.marketing.consent_timestamp",
              "subscriptions.email.marketing.last_updated",
              "subscriptions.email.marketing.method",
              "subscriptions.email.marketing.method_detail",
              "subscriptions.email.marketing.custom_method_detail",
              "subscriptions.email.marketing.double_optin",
              "subscriptions.email.marketing.suppression",
              "subscriptions.email.marketing.list_suppressions",
              "subscriptions.sms",
              "subscriptions.sms.marketing",
              "subscriptions.sms.marketing.can_receive_sms_marketing",
              "subscriptions.sms.marketing.consent",
              "subscriptions.sms.marketing.consent_timestamp",
              "subscriptions.sms.marketing.method",
              "subscriptions.sms.marketing.method_detail",
              "subscriptions.sms.marketing.last_updated",
              "predictive_analytics",
              "predictive_analytics.historic_clv",
              "predictive_analytics.predicted_clv",
              "predictive_analytics.total_clv",
              "predictive_analytics.historic_number_of_orders",
              "predictive_analytics.predicted_number_of_orders",
              "predictive_analytics.average_days_between_orders",
              "predictive_analytics.average_order_value",
              "predictive_analytics.churn_probability",
              "predictive_analytics.expected_date_of_next_order",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        additional__fields__profile: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "subscriptions",
              "predictive_analytics",
            ],
          },
          description: "Request additional fields not included by default in the response. Supported values: \"subscriptions\", \"predictive_analytics\" ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "segments",
    ],
  }),
  composioTool({
    name: "klaviyo_get_segment_relationships",
    description: "Get all profile membership or tag relationships for a segment. Use 'profiles' to retrieve profile membership relationships or 'tags' to retrieve tag associations. Rate limits: Burst 75/s, Steady 700/m. Required scopes: profiles:read, segments:read.",
    toolSlug: "KLAVIYO_GET_SEGMENT_RELATIONSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The segment identifier (e.g., 'TJx2Yb')",
        },
        page_size: {
          type: "integer",
          description: "Number of results per page. Must be between 1 and 100",
        },
        related_resource: {
          type: "string",
          description: "The related resource type. Use 'profiles' for profile membership relationships or 'tags' for tag relationships",
          enum: [
            "profiles",
            "tags",
          ],
        },
      },
      required: [
        "id",
        "related_resource",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "relationships",
    ],
  }),
  composioTool({
    name: "klaviyo_get_segment_tags",
    description: "Return all tags associated with the given segment ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `segments:read` `tags:read`",
    toolSlug: "KLAVIYO_GET_SEGMENT_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the segment to retrieve tags for (e.g., 'TJx2Yb'). Use KLAVIYO_GET_SEGMENTS to list available segment IDs.",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "Optional sparse fieldsets to limit which tag fields are returned. Use ['name'] to return only the tag name attribute. If not specified, all tag fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "segments",
    ],
  }),
  composioTool({
    name: "klaviyo_get_segments",
    description: "Fetch segments from an account with filters like `name`, `created`, and `updated`. Max 10 results/page. Rate limits are 75/s burst, 700/m steady. Requires `segments:read` scope.",
    toolSlug: "KLAVIYO_GET_SEGMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
            "id",
            "-id",
            "name",
            "-name",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`name`: `any`, `equals`<br>`id`: `any`, `equals`<br>`created`: `greater-than`<br>`updated`: `greater-than`<br>`is_active`: `any`, `equals`<br>`is_starred`: `equals` ",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "tags",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__segment: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "definition",
              "definition.condition_groups",
              "created",
              "updated",
              "is_active",
              "is_processing",
              "is_starred",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "segments",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tag",
    description: "Retrieve the tag with the given tag ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `tags:read`",
    toolSlug: "KLAVIYO_GET_TAG",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (UUID) of the tag to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "tag-group",
            ],
          },
          description: "Related resources to include in the response. Use 'tag-group' to include the full tag-group object that this tag belongs to in the 'included' array of the response.",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "Sparse fieldset for the tag resource. Limits which fields are returned in the tag's attributes. Allowed values: 'name'.",
        },
        fields__tag__group: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "exclusive",
              "default",
            ],
          },
          description: "Sparse fieldset for the tag-group resource. Limits which fields are returned in the included tag-group object. Allowed values: 'name', 'exclusive', 'default'. Only applicable when include contains 'tag-group'.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tag_group",
    description: "Retrieve the tag group with the given tag group ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `tags:read`",
    toolSlug: "KLAVIYO_GET_TAG_GROUP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Tag Group ID",
        },
        fields__tag__group: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "exclusive",
              "default",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tag_group_relationships_tags",
    description: "Returns the tag IDs of all tags inside the given tag group.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `tags:read`",
    toolSlug: "KLAVIYO_GET_TAG_GROUP_RELATIONSHIPS_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (UUID) of the tag group to retrieve tag relationships for.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tag_group_tags",
    description: "Return the tags for a given tag group ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `tags:read`",
    toolSlug: "KLAVIYO_GET_TAG_GROUP_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (UUID) of the tag group to retrieve tags from.",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tag_groups",
    description: "Retrieve up to 25 tag groups per account, sortable/filterable by specific attributes. Default group included. Supports cursor pagination and adheres to rate limits of 3 requests per second and 60 per minute. Requires `tags:read` scope.",
    toolSlug: "KLAVIYO_GET_TAG_GROUPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "id",
            "-id",
            "name",
            "-name",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`name`: `contains`, `ends-with`, `equals`, `starts-with`<br>`exclusive`: `equals`<br>`default`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__tag__group: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "exclusive",
              "default",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tag_relationships",
    description: "Tool to retrieve relationship IDs for a tag. Returns the IDs of related resources (campaigns, flows, lists, segments, or tag-group) associated with a specific tag. The response format varies based on the related_resource type: - For collections (campaigns, flows, lists, segments): returns an array of resource identifiers - For tag-group: returns a single resource identifier object Rate limits: 3/s burst, 60/m steady. Required scopes: tags:read and scope for the related resource type.",
    toolSlug: "KLAVIYO_GET_TAG_RELATIONSHIPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (UUID) of the tag to retrieve relationships for.",
        },
        related_resource: {
          type: "string",
          description: "The type of related resource to retrieve: campaigns, flows, lists, segments, or tag-group.",
          enum: [
            "campaigns",
            "flows",
            "lists",
            "segments",
            "tag-group",
          ],
        },
      },
      required: [
        "id",
        "related_resource",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "relationships",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tag_tag_group",
    description: "Returns the tag group resource for a given tag ID.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `tags:read`",
    toolSlug: "KLAVIYO_GET_TAG_TAG_GROUP",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier (UUID) of the tag whose tag group should be retrieved.",
        },
        fields__tag__group: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "exclusive",
              "default",
            ],
          },
          description: "Optional list of tag group fields to include in the response. Use for sparse fieldsets to limit response size. Available fields: 'name', 'exclusive', 'default'. If not specified, all fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "klaviyo_get_tags",
    description: "Retrieve up to 50 account tags at once, filterable/sortable by name or id, with cursor pagination. Rate limits: 3/s burst, 60/m steady. Requires `tags:read` scope.",
    toolSlug: "KLAVIYO_GET_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "id",
            "-id",
            "name",
            "-name",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`name`: `contains`, `ends-with`, `equals`, `starts-with` ",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "tag-group",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#relationships ",
        },
        fields__tag: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__tag__group: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "exclusive",
              "default",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "tags",
    ],
  }),
  composioTool({
    name: "klaviyo_get_template",
    description: "Get a template with the given template ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `templates:read`",
    toolSlug: "KLAVIYO_GET_TEMPLATE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the template to retrieve (e.g., 'Rz66gr').",
        },
        fields__template: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "editor_type",
              "html",
              "text",
              "created",
              "updated",
            ],
          },
          description: "Sparse fieldsets to request only specific template attributes. Available fields: name, editor_type, html, text, created, updated. If not provided, all fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "klaviyo_get_templates",
    description: "Retrieve account templates with sorting options (`id`, `name`, `created`, `updated`). Limit of 10 results per page, rate limits at 10/s burst and 150/m steady. Requires `templates:read` scope.",
    toolSlug: "KLAVIYO_GET_TEMPLATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created",
            "-created",
            "id",
            "-id",
            "name",
            "-name",
            "updated",
            "-updated",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`id`: `any`, `equals`<br>`name`: `any`, `equals`<br>`created`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`updated`: `equals`, `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__template: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "editor_type",
              "html",
              "text",
              "created",
              "updated",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "klaviyo_get_update_categories_jobs",
    description: "Get all catalog category bulk update jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_UPDATE_CATEGORIES_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "Filter jobs by status using equals operator. Format: equals(status,'<value>'). Valid status values: 'cancelled', 'complete', 'processing', 'queued'. Example: equals(status,'complete')",
        },
        page__cursor: {
          type: "string",
          description: "Cursor-based pagination token from a previous response's 'links.next' field to fetch the next page of results.",
        },
        fields__catalog__category__bulk__update__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "Sparse fieldsets to select specific fields to return. Available fields: status, created_at, total_count, completed_count, failed_count, completed_at, errors, expires_at. Example: ['status', 'created_at', 'total_count']",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_update_items_job",
    description: "Get a catalog item bulk update job with the given job ID. An `include` parameter can be provided to get the following related resource data: `items`.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_UPDATE_ITEMS_JOB",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        job_id: {
          type: "string",
          description: "ID of the job to retrieve.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "items",
            ],
          },
          description: "Related resources to include in the response. Set to ['items'] to include full catalog item data for items being updated by this job. When specified, the response will contain an 'included' array with catalog item objects.",
        },
        fields__catalog__item: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "external_id",
              "title",
              "description",
              "price",
              "url",
              "image_full_url",
              "image_thumbnail_url",
              "images",
              "custom_metadata",
              "published",
              "created",
              "updated",
            ],
          },
          description: "Sparse fieldset to limit which catalog item attributes are returned when using include=items. Valid values: 'external_id', 'title', 'description', 'price', 'url', 'image_full_url', 'image_thumbnail_url', 'images', 'custom_metadata', 'published', 'created', 'updated'. Only effective when include=items is specified.",
        },
        fields__catalog__item__bulk__update__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "Sparse fieldset to limit which job attributes are returned. Valid values: 'status', 'created_at', 'total_count', 'completed_count', 'failed_count', 'completed_at', 'errors', 'expires_at'. If omitted, all job attributes are returned.",
        },
      },
      required: [
        "job_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_update_items_jobs",
    description: "Get all catalog item bulk update jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_UPDATE_ITEMS_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`status`: `equals` ",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__catalog__item__bulk__update__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_update_variants_jobs",
    description: "Get all catalog variant bulk update jobs. Returns a maximum of 100 jobs per request.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `catalogs:read`",
    toolSlug: "KLAVIYO_GET_UPDATE_VARIANTS_JOBS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filter: {
          type: "string",
          description: "Filter jobs by status using Klaviyo's filter syntax. Supported: equals(status,\"<value>\") where value can be 'queued', 'processing', 'complete', or 'cancelled'. Example: equals(status,\"complete\") to get only completed jobs.",
        },
        page__cursor: {
          type: "string",
          description: "Cursor for pagination. Use the cursor value from the 'next' or 'prev' link in the response to fetch additional pages of results. Returns up to 100 jobs per request.",
        },
        fields__catalog__variant__bulk__update__job: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "status",
              "created_at",
              "total_count",
              "completed_count",
              "failed_count",
              "completed_at",
              "errors",
              "expires_at",
            ],
          },
          description: "Select specific fields to include in the response. Available fields: 'status', 'created_at', 'total_count', 'completed_count', 'failed_count', 'completed_at', 'errors', 'expires_at'. If not specified, all fields are returned.",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "catalogs",
    ],
  }),
  composioTool({
    name: "klaviyo_get_variant_ids_for_catalog_item",
    description: "Tool to get all variant IDs related to a given catalog item ID. Returns a maximum of 100 variants per request. Use when you need to retrieve variant IDs without fetching full variant data. Supports filtering and sorting by creation date.",
    toolSlug: "KLAVIYO_GET_VARIANT_IDS_FOR_CATALOG_ITEM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog item ID in the format: {integration}:::{catalog}:::{external_id}. Currently, the only supported integration type is $custom, and the only supported catalog is $default.",
        },
        sort: {
          type: "string",
          description: "Sort options for variant IDs.",
          enum: [
            "created",
            "-created",
          ],
        },
        filter: {
          type: "string",
          description: "Filter to apply to the results. Allowed fields/operators: ids (any), item.id (equals), sku (equals), title (contains), published (equals). Example: any(ids,['$custom:::$default:::VARIANT-1'])",
        },
        page_cursor: {
          type: "string",
          description: "Cursor for pagination to retrieve the next page of results.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "relationships",
    ],
  }),
  composioTool({
    name: "klaviyo_get_version_ids_for_form",
    description: "Get the IDs of the form versions for the given form.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `forms:read`",
    toolSlug: "KLAVIYO_GET_VERSION_IDS_FOR_FORM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the form to retrieve version IDs for. Use the Get Forms endpoint to retrieve available form IDs.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "klaviyo_get_versions_for_form",
    description: "Get the form versions for the given form.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `forms:read`",
    toolSlug: "KLAVIYO_GET_VERSIONS_FOR_FORM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the form to retrieve versions for. Form IDs can be obtained from the Get Forms endpoint or from the Klaviyo UI URL (https://www.klaviyo.com/forms/<FORM_ID>).",
        },
        sort: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sorting ",
          enum: [
            "created_at",
            "-created_at",
            "updated_at",
            "-updated_at",
          ],
        },
        filter: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#filtering<br>Allowed field(s)/operator(s):<br>`form_type`: `any`, `equals`<br>`status`: `equals`<br>`updated_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than`<br>`created_at`: `greater-or-equal`, `greater-than`, `less-or-equal`, `less-than` ",
        },
        page__size: {
          type: "integer",
          description: "Default: 20. Min: 1. Max: 100.",
        },
        page__cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        fields__form__version: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "form_type",
              "ab_test",
              "ab_test.variation_name",
              "status",
              "created_at",
              "updated_at",
            ],
          },
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#sparse-fieldsets ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "forms",
    ],
  }),
  composioTool({
    name: "klaviyo_get_webhook",
    description: "Get the webhook with the given ID.<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `15/m` **Scopes:** `webhooks:read`",
    toolSlug: "KLAVIYO_GET_WEBHOOK",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the webhook to retrieve. Obtain this from the list webhooks endpoint or webhook creation response.",
        },
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "webhook-topics",
            ],
          },
          description: "Include related resources in the response. Use 'webhook-topics' to include the topics that trigger this webhook.",
        },
        fields__webhook: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "description",
              "endpoint_url",
              "enabled",
              "created_at",
              "updated_at",
            ],
          },
          description: "Select which webhook fields to include in the response. Available fields: 'name', 'description', 'endpoint_url', 'enabled', 'created_at', 'updated_at'. If not specified, all fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "klaviyo_get_webhook_topic",
    description: "Retrieve details of a specific webhook topic by its ID. Webhook topics define the events that can trigger webhooks (e.g., email_delivered, sent_sms). Use this to get the human-readable name and metadata for a specific topic. Rate limits: Burst 1/s, Steady 15/m. Required scope: webhooks:read",
    toolSlug: "KLAVIYO_GET_WEBHOOK_TOPIC",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the webhook topic to retrieve. Format: 'event:klaviyo.{event_name}' (e.g., 'event:klaviyo.email_delivered', 'event:klaviyo.sent_sms', 'event:klaviyo.clicked_email'). Use the Get Webhook Topics endpoint to list all available topic IDs.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "klaviyo_get_webhook_topics",
    description: "Get all webhook topics in a Klaviyo account.<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `15/m` **Scopes:** `webhooks:read`",
    toolSlug: "KLAVIYO_GET_WEBHOOK_TOPICS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "klaviyo_get_webhooks",
    description: "Get all webhooks in an account.<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `15/m` **Scopes:** `webhooks:read`",
    toolSlug: "KLAVIYO_GET_WEBHOOKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        include: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "webhook-topics",
            ],
          },
          description: "Optional list of related resources to include in the response. Use 'webhook-topics' to include the event topics that trigger each webhook.",
        },
        fields__webhook: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "name",
              "description",
              "endpoint_url",
              "enabled",
              "created_at",
              "updated_at",
            ],
          },
          description: "Optional list of webhook fields to include in the response. If not specified, all fields are returned. Available fields: 'name', 'description', 'endpoint_url', 'enabled', 'created_at', 'updated_at'. Use this to reduce response size by requesting only needed fields.",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "webhooks",
    ],
  }),
  composioTool({
    name: "klaviyo_merge_profiles",
    description: "Merge one or more source profiles into a destination profile. The source profile(s) data (events, attributes, list memberships) will be transferred to the destination, and the source profile(s) will be deleted. This operation is queued asynchronously and returns HTTP 202 Accepted. Rate limits: 10/s burst, 150/m steady. Requires `profiles:write` scope.",
    toolSlug: "KLAVIYO_MERGE_PROFILES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__id: {
          type: "string",
          description: "The ID of the destination profile that will receive the merged data. This profile will be kept after the merge.",
        },
        data__type: {
          type: "string",
          description: "The resource type for merge operation. Must be 'profile-merge'.",
          enum: [
            "profile-merge",
          ],
        },
        data__relationships__profiles__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of source profile objects to merge into the destination. Each object must have 'type' (always 'profile') and 'id' (the source profile ID). Source profiles will be deleted after the merge. Example: [{'type': 'profile', 'id': 'PROFILE_ID'}]",
        },
      },
      required: [
        "data__id",
        "data__relationships__profiles__data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Merge profiles.",
    ],
  }),
  composioTool({
    name: "klaviyo_query_campaign_values",
    description: "Returns the requested campaign analytics values data<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `2/m`<br>Daily: `225/d` **Scopes:** `campaigns:read`",
    toolSlug: "KLAVIYO_QUERY_CAMPAIGN_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the campaign values report request. Must be 'campaign-values-report'.",
          enum: [
            "campaign-values-report",
          ],
        },
        page_cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        data__attributes__filter: {
          type: "string",
          description: "API filter string (not an array) used to filter the query. Example: equals(campaign_id,\"01GMRWDSA0ARTAKE1SFX8JGXAY\"). Allowed filters: campaign_id. Allowed operators: equals, contains-any. Only one filter can be used per attribute, only AND can be used as a combination operator. Max of 100 campaign IDs per contains-any filter.",
        },
        data__attributes__timeframe: {
          type: "object",
          additionalProperties: true,
          description: "The timeframe to query for data within (max 1 year). Supports two formats: 1) Predefined key: {'key': 'last_12_months'} - valid keys include 'last_12_months', 'last_30_days', 'last_7_days', 'this_month', 'last_month', etc. 2) Custom date range: {'start': '2024-01-01T00:00:00+00:00', 'end': '2024-12-31T23:59:59+00:00'} using ISO 8601 timestamps.",
        },
        data__attributes__statistics: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "average_order_value",
              "bounce_rate",
              "bounced",
              "bounced_or_failed",
              "bounced_or_failed_rate",
              "click_rate",
              "click_to_open_rate",
              "clicks",
              "clicks_unique",
              "conversion_rate",
              "conversion_uniques",
              "conversion_value",
              "conversions",
              "delivered",
              "delivery_rate",
              "failed",
              "failed_rate",
              "open_rate",
              "opens",
              "opens_unique",
              "recipients",
              "revenue_per_recipient",
              "spam_complaint_rate",
              "spam_complaints",
              "unsubscribe_rate",
              "unsubscribe_uniques",
              "unsubscribes",
              "message_segment_count_sum",
              "text_message_credit_usage_amount",
              "text_message_roi",
              "text_message_spend",
            ],
          },
          description: "List of statistics to query for. All rate statistics will be returned in fractional form [0.0, 1.0]. Common aliases are supported: 'average_open_rate' maps to 'open_rate', 'count_opened' maps to 'opens', 'count_sent' maps to 'recipients'. ",
        },
        data__attributes__conversion__metric__id: {
          type: "string",
          description: "Required. ID of the metric for calculating conversion-based statistics (e.g., 'Placed Order' metric). Use Get Metrics API to find valid metric IDs. Note: Use purchase/order event metrics (not engagement metrics like 'Opened Email') to avoid 'does not support querying for values data' errors.",
        },
      },
      required: [
        "data__attributes__conversion__metric__id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "klaviyo_query_flow_series",
    description: "Returns time-series analytics data for flows, enabling performance tracking over time intervals. Use this to analyze flow metrics like open rates, click rates, conversions, and delivery statistics. Rate limits: Burst 1/s, Steady 2/m, Daily 225/d. Scopes: flows:read",
    toolSlug: "KLAVIYO_QUERY_FLOW_SERIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "The resource type. Must be 'flow-series-report'.",
          enum: [
            "flow-series-report",
          ],
        },
        page_cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        data__attributes__filter: {
          type: "string",
          description: "API filter string to filter the query. Allowed filters: flow_id, send_channel, flow_message_id. Operators: equals, contains-any. Use AND to combine filters. Max 100 messages per ANY filter. send_channel values: 'email', 'push-notification', 'sms'. Examples: 'equals(flow_id,\"abc123\")' or 'equals(send_channel,\"email\") AND equals(flow_id,\"abc123\")'",
        },
        data__attributes__interval: {
          type: "string",
          description: "The interval used to aggregate data within the series request. If hourly is used, the timeframe cannot be longer than 7 days. If daily is used, the timeframe cannot be longer than 60 days. If monthly is used, the timeframe cannot be longer than 52 weeks. ",
          enum: [
            "daily",
            "hourly",
            "monthly",
            "weekly",
          ],
        },
        data__attributes__timeframe: {
          type: "object",
          additionalProperties: true,
          description: "The timeframe to query for data within (max 1 year). Use either a preset key format: {'key': 'last_30_days'} or {'key': 'last_7_days'} or {'key': 'last_12_months'}, or a custom date range: {'start': '2024-01-01T00:00:00+00:00', 'end': '2024-01-31T00:00:00+00:00'}. Dates must be ISO 8601 format with timezone.",
        },
        data__attributes__statistics: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "average_order_value",
              "bounce_rate",
              "bounced",
              "bounced_or_failed",
              "bounced_or_failed_rate",
              "click_rate",
              "click_to_open_rate",
              "clicks",
              "clicks_unique",
              "conversion_rate",
              "conversion_uniques",
              "conversion_value",
              "conversions",
              "delivered",
              "delivery_rate",
              "failed",
              "failed_rate",
              "open_rate",
              "opens",
              "opens_unique",
              "recipients",
              "revenue_per_recipient",
              "spam_complaint_rate",
              "spam_complaints",
              "unsubscribe_rate",
              "unsubscribe_uniques",
              "unsubscribes",
            ],
          },
          description: "List of statistics to query for. All rate statistics will be returned in fractional form [0.0, 1.0] ",
        },
        data__attributes__conversion__metric__id: {
          type: "string",
          description: "ID of the metric to be used for conversion statistics. Get metric IDs from the KLAVIYO_GET_METRICS action. Common metrics: 'Placed Order', 'Opened Email', 'Clicked Email'.",
        },
      },
      required: [
        "data__attributes__statistics",
        "data__attributes__timeframe",
        "data__attributes__interval",
        "data__attributes__conversion__metric__id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "klaviyo_query_flow_values",
    description: "Returns the requested flow analytics values data<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `2/m`<br>Daily: `225/d` **Scopes:** `flows:read`",
    toolSlug: "KLAVIYO_QUERY_FLOW_VALUES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the flow values report request. Must be 'flow-values-report'.",
          enum: [
            "flow-values-report",
          ],
        },
        page_cursor: {
          type: "string",
          description: "For more information please visit https://developers.klaviyo.com/en/v2024-07-15/reference/api-overview#pagination ",
        },
        data__attributes__filter: {
          type: "string",
          description: "Filter string to narrow results. Accepts either a plain filter string like 'equals(send_channel,\"email\")' or a JSON-encoded array like '[\"equals(flow_id,\"ABC123\")\"]' (which will be automatically converted). Supported filters: flow_id, send_channel, flow_message_id. Supported operators: equals (for SINGLE value, e.g., 'equals(flow_id,\"ABC123\")'), contains-any (for MULTIPLE values, e.g., 'contains-any(flow_id,[\"ABC123\",\"DEF456\"])'). Only one filter per attribute, only AND for combining. Max 100 messages per ANY filter. For send_channel: email, push-notification, or sms.",
        },
        data__attributes__timeframe: {
          type: "object",
          additionalProperties: true,
          description: "The timeframe to query for data within. Max length is 1 year. IMPORTANT: 'key' and 'start'/'end' are mutually exclusive - use EITHER a predefined key like {'key': 'last_30_days'} OR custom date ranges like {'start': '2024-01-01T00:00:00Z', 'end': '2024-12-31T23:59:59Z'}, but never combine them. Available predefined keys: last_7_days, last_30_days, last_90_days, last_365_days, this_week, this_month, this_quarter, this_year, last_week, last_month, last_quarter, last_year.",
        },
        data__attributes__statistics: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "average_order_value",
              "bounce_rate",
              "bounced",
              "bounced_or_failed",
              "bounced_or_failed_rate",
              "click_rate",
              "click_to_open_rate",
              "clicks",
              "clicks_unique",
              "conversion_rate",
              "conversion_uniques",
              "conversion_value",
              "conversions",
              "delivered",
              "delivery_rate",
              "failed",
              "failed_rate",
              "open_rate",
              "opens",
              "opens_unique",
              "recipients",
              "revenue_per_recipient",
              "spam_complaint_rate",
              "spam_complaints",
              "unsubscribe_rate",
              "unsubscribe_uniques",
              "unsubscribes",
            ],
          },
          description: "List of statistics to query for. All rate statistics will be returned in fractional form [0.0, 1.0]. Common aliases are supported: 'average_open_rate' maps to 'open_rate', 'count_opened' maps to 'opens', 'count_sent' maps to 'recipients'. ",
        },
        data__attributes__conversion_metric_id: {
          type: "string",
          description: "ID of the conversion metric (e.g., 'Placed Order' metric ID) required for ALL flow values report queries. This metric is used for calculating conversion-based statistics, but the endpoint will return all requested statistics regardless of conversion status. For example, 'opens' will include all opens whether or not they resulted in conversions. Get metric IDs from the Get Metrics endpoint.",
        },
      },
      required: [
        "data__attributes__conversion_metric_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "klaviyo_query_metric_aggregates",
    description: "The Klaviyo endpoint fetches metric events, handling JSON requests for custom data queries, sorting, and filtering; offers grouping and time-based filters; requires adherence to rate limits (3 requests per second, 60 per minute) under 'metrics:read'.",
    toolSlug: "KLAVIYO_QUERY_METRIC_AGGREGATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "metric-aggregate",
          ],
        },
        data__attributes__by: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "$attributed_channel",
              "$attributed_flow",
              "$attributed_message",
              "$attributed_variation",
              "$campaign_channel",
              "$flow",
              "$flow_channel",
              "$message",
              "$message_send_cohort",
              "$variation",
              "$variation_send_cohort",
              "Bot Click",
              "Bounce Type",
              "Campaign Name",
              "Client Canonical",
              "Client Name",
              "Client Type",
              "Email Domain",
              "Failure Source",
              "Failure Type",
              "From Number",
              "From Phone Region",
              "Inbox Provider",
              "List",
              "Message Name",
              "Message Type",
              "Method",
              "Subject",
              "To Number",
              "To Phone Region",
              "URL",
              "form_id",
            ],
          },
          description: "Optional attribute(s) used for partitioning by the aggregation function",
        },
        data__attributes__sort: {
          type: "string",
          description: "Provide a sort key (e.g. -$message)",
          enum: [
            "$attributed_channel",
            "-$attributed_channel",
            "$attributed_flow",
            "-$attributed_flow",
            "$attributed_message",
            "-$attributed_message",
            "$attributed_variation",
            "-$attributed_variation",
            "$campaign_channel",
            "-$campaign_channel",
            "$flow",
            "-$flow",
            "$flow_channel",
            "-$flow_channel",
            "$message",
            "-$message",
            "$message_send_cohort",
            "-$message_send_cohort",
            "$variation",
            "-$variation",
            "$variation_send_cohort",
            "-$variation_send_cohort",
            "Bot Click",
            "-Bot Click",
            "Bounce Type",
            "-Bounce Type",
            "Campaign Name",
            "-Campaign Name",
            "Client Canonical",
            "-Client Canonical",
            "Client Name",
            "-Client Name",
            "Client Type",
            "-Client Type",
            "Email Domain",
            "-Email Domain",
            "Failure Source",
            "-Failure Source",
            "Failure Type",
            "-Failure Type",
            "From Number",
            "-From Number",
            "From Phone Region",
            "-From Phone Region",
            "Inbox Provider",
            "-Inbox Provider",
            "List",
            "-List",
            "Message Name",
            "-Message Name",
            "Message Type",
            "-Message Type",
            "Method",
            "-Method",
            "Subject",
            "-Subject",
            "To Number",
            "-To Number",
            "To Phone Region",
            "-To Phone Region",
            "URL",
            "-URL",
            "count",
            "-count",
            "form_id",
            "-form_id",
            "sum_value",
            "-sum_value",
            "unique",
            "-unique",
          ],
        },
        data__attributes__filter: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of filter strings for querying metric aggregates. Each filter uses function syntax: operator(field,value). TIME RANGE (REQUIRED): Must use 'datetime' (not $attributed_time) for time filtering with ISO 8601 format (YYYY-MM-DDTHH:MM:SS). Typically requires both: 'greater-or-equal(datetime,START_TIME)' and 'less-than(datetime,END_TIME)'. Maximum time range: 1 year (365 days). ADDITIONAL FILTERS (OPTIONAL): Can filter by metric attributes using $ prefix (e.g., $message, $flow, $attributed_flow). Supported operators: equals, not, any. Examples: ['greater-or-equal(datetime,2024-01-15T00:00:00)', 'less-than(datetime,2024-02-15T00:00:00)'] or with attribute filter: ['greater-or-equal(datetime,2024-01-01T00:00:00)', 'less-than(datetime,2024-12-31T00:00:00)', 'equals($message,\"MSG_ID\")']",
        },
        data__attributes__interval: {
          type: "string",
          description: "Aggregation interval, e.g. \"hour\", \"day\", \"week\", \"month\"",
          enum: [
            "day",
            "hour",
            "month",
            "week",
          ],
        },
        data__attributes__timezone: {
          type: "string",
          description: "The timezone used for processing the query, e.g. `\"America/New_York\"`.             This field is validated against a list of common timezones from the [IANA Time Zone Database](https://www.iana.org/time-zones).             While most are supported, a few notable exceptions are `Factory`, `Europe/Kyiv` and `Pacific/Kanton`. This field is case-sensitive. ",
        },
        data__attributes__timeframe: {
          type: "object",
          additionalProperties: true,
          description: "Convenient timeframe parameter with 'start' and 'end' datetime values in ISO 8601 format (YYYY-MM-DDTHH:MM:SS). If provided, this will automatically be converted to the required filter format. The maximum allowed time range is 1 year (365 days). Example: {'start': '2024-01-15T00:00:00', 'end': '2025-01-15T00:00:00'}",
        },
        data__attributes__metric__id: {
          type: "string",
          description: "The metric ID used in the aggregation.",
        },
        data__attributes__page__size: {
          type: "integer",
          description: "Alter the maximum number of returned rows in a single page of aggregation results ",
        },
        data__attributes__measurements: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "count",
              "sum_value",
              "unique",
            ],
          },
          description: "Measurement key, e.g. `unique`, `sum_value`, `count`",
        },
        data__attributes__page__cursor: {
          type: "string",
          description: "Optional pagination cursor to iterate over large result sets",
        },
        data__attributes__return__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Provide fields to limit the returned data",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "read",
      "metrics",
    ],
  }),
  composioTool({
    name: "klaviyo_remove_profile_from_list",
    description: "Remove profiles from a Klaviyo list by profile IDs or email addresses. This action removes profiles from a marketing list without affecting their overall consent status. Use the Unsubscribe Profiles action for complete unsubscribing. You can remove up to 1000 profiles per call. Rate limits: 10/s burst, 150/m steady. Required scopes: `lists:write` and `profiles:write`. Preconditions: - Either profile_ids or emails must be provided (not both) - Maximum 1000 profiles per call - Email addresses must be valid format - The list must exist and be accessible",
    toolSlug: "KLAVIYO_REMOVE_PROFILE_FROM_LIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to remove from the list (alternative to profile_ids)",
        },
        list_id: {
          type: "string",
          description: "The ID of the list to remove profiles from",
        },
        profile_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of profile IDs to remove from the list (max 1000 per call)",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "lists",
      "destructive",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove Profile from List.",
    ],
  }),
  composioTool({
    name: "klaviyo_request_profile_deletion",
    description: "To delete a profile, use only one identifier: email, phone number, or ID. Requests are asynchronous and can be tracked. Ensure legal compliance; refer to docs. Rate limits: 3 per second, 60 per minute.",
    toolSlug: "KLAVIYO_REQUEST_PROFILE_DELETION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the deletion job request. Must be 'data-privacy-deletion-job'.",
          enum: [
            "data-privacy-deletion-job",
          ],
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Klaviyo profile ID to delete. Use this OR email OR phone_number (only one identifier required).",
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Resource type for the profile to delete. Must be 'profile'.",
          enum: [
            "profile",
          ],
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Email address of the profile to delete. Use this OR profile ID OR phone_number (only one identifier required).",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Phone number of the profile to delete in E.164 format (e.g., +15551234567). Use this OR profile ID OR email (only one identifier required).",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "data_privacy",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Request profile deletion.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_bulk_profile_import_job",
    description: "Initiate a job to create/update a batch of profiles, up to 10,000 with a max size of 5MB per request. Rate limits: 10/s burst, 150/m steady. Requires `lists:write` and `profiles:write` scopes. More info in the Bulk Profile Import API guide.",
    toolSlug: "KLAVIYO_SPAWN_BULK_PROFILE_IMPORT_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile-bulk-import-job",
          ],
        },
        data__attributes__profiles__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
        data__relationships__lists__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn bulk profile import job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_coupon_code_bulk_create_job",
    description: "Create a coupon-code-bulk-create-job to bulk create a list of coupon codes. Max 1000 coupon codes per job. Max 100 jobs queued at once. Rate limits: Burst 75/s, Steady 700/m. Scopes: coupon-codes:write. Returns a job ID that can be used to query the job status via the get_coupon_code_bulk_create_job endpoint.",
    toolSlug: "KLAVIYO_SPAWN_COUPON_CODE_BULK_CREATE_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the bulk create job. Must be 'coupon-code-bulk-create-job'.",
          enum: [
            "coupon-code-bulk-create-job",
          ],
        },
        data__attributes__coupon__codes__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of coupon code objects to create in bulk (max 1000 per job). Each object must have: 'type' (always 'coupon-code'), 'attributes' (with required 'unique_code' string and optional 'expires_at' ISO 8601 datetime), and 'relationships' (with 'coupon.data.type' as 'coupon' and 'coupon.data.id' as the coupon ID to associate the codes with). Example: [{\"type\": \"coupon-code\", \"attributes\": {\"unique_code\": \"CODE123\"}, \"relationships\": {\"coupon\": {\"data\": {\"type\": \"coupon\", \"id\": \"COUPON_ID\"}}}}]",
        },
      },
      required: [
        "data__attributes__coupon__codes__data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "coupons",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn coupon code bulk create job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_create_categories_job",
    description: "Create bulk job for up to 100 catalog categories with a 5MB size limit and a max of 500 concurrent jobs. Rate limits: 75/s burst, 700/m steady. Requires 'catalogs:write' scope.",
    toolSlug: "KLAVIYO_SPAWN_CREATE_CATEGORIES_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "The type of resource. Must be 'catalog-category-bulk-create-job'.",
          enum: [
            "catalog-category-bulk-create-job",
          ],
        },
        data__attributes__categories__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog category objects to create in bulk (max 100). Each object must have 'type': 'catalog-category' and 'attributes' containing 'external_id' (unique identifier in your system) and 'name' (category display name). Optional: 'integration_type' (default: '$custom') and 'catalog_type' (default: '$default').",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn create categories job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_create_items_job",
    description: "Create batches of up to 100 catalog items with a 5MB size limit using the bulk job, which allows 500 concurrent jobs. Rate limits are 75/s burst and 700/m steady. Requires `catalogs:write` scope.",
    toolSlug: "KLAVIYO_SPAWN_CREATE_ITEMS_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the bulk create job. Must be 'catalog-item-bulk-create-job'.",
          enum: [
            "catalog-item-bulk-create-job",
          ],
        },
        data__attributes__items__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog items to create in bulk (max 100 items, 5MB total). Each item must include 'type' ('catalog-item') and 'attributes' object with required fields: 'external_id' (unique ID), 'title', 'description', 'url'. Optional fields: 'price' (float), 'published' (boolean), 'image_full_url', 'image_thumbnail_url', 'images' (array of URLs).",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn create items job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_create_variants_job",
    description: "Initiate a job to bulk create up to 100 catalog variants, with a 5MB payload size limit. A max of 500 jobs can run concurrently. Rate limits are 75/s burst and 700/m steady. Requires 'catalogs:write' scope.",
    toolSlug: "KLAVIYO_SPAWN_CREATE_VARIANTS_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type identifier. Must be 'catalog-variant-bulk-create-job'.",
          enum: [
            "catalog-variant-bulk-create-job",
          ],
        },
        data__attributes__variants__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog variant objects to create (max 100). Each variant object must have: type='catalog-variant', attributes (with external_id, title, description, sku, inventory_quantity, price, url as required fields; optional: image_full_url, image_thumbnail_url, images, inventory_policy, published), and relationships.item.data (with type='catalog-item' and id=parent_item_id in format '$custom:::$default:::external_id').",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn create variants job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_delete_categories_job",
    description: "Delete multiple catalog categories in bulk, with a limit of 100 per request and a 5MB payload size. A maximum of 500 concurrent jobs permitted. Rate limits are 75/s burst and 700/min steady. Requires `catalogs:write` scope.",
    toolSlug: "KLAVIYO_SPAWN_DELETE_CATEGORIES_JOB",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the bulk delete job. Must be 'catalog-category-bulk-delete-job'.",
          enum: [
            "catalog-category-bulk-delete-job",
          ],
        },
        data__attributes__categories__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog category objects to delete. Each object must have 'type' set to 'catalog-category' and 'id' set to the category ID (format: '$custom:::$default:::{external_id}'). Maximum 100 categories per request.",
        },
      },
      required: [
        "data__attributes__categories__data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Spawn delete categories job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_delete_items_job",
    description: "Delete batches of catalog items with a bulk job, max 100 items/request, 5MB size limit, and up to 500 concurrent jobs. Rate limits are 75/s burst and 700/m steady. Requires `catalogs:write` scope.",
    toolSlug: "KLAVIYO_SPAWN_DELETE_ITEMS_JOB",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "The resource type for this bulk delete job. Must be 'catalog-item-bulk-delete-job'.",
          enum: [
            "catalog-item-bulk-delete-job",
          ],
        },
        data__attributes__items__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog items to delete. Each item must be an object with 'type' (always 'catalog-item') and 'id' (the catalog item ID in format '$custom:::$default:::{external_id}'). Maximum 100 items per request.",
        },
      },
      required: [
        "data__attributes__items__data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Spawn delete items job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_delete_variants_job",
    description: "Delete multiple catalog variants with a bulk job, max 100 per request, 5MB size limit. Only 500 jobs can run concurrently. Rate limits: 75/s burst, 700/m steady. Requires `catalogs:write` scope.",
    toolSlug: "KLAVIYO_SPAWN_DELETE_VARIANTS_JOB",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the bulk delete job. Must be 'catalog-variant-bulk-delete-job'.",
          enum: [
            "catalog-variant-bulk-delete-job",
          ],
        },
        data__attributes__variants__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of catalog variant objects to delete. Each object must include 'type' (always 'catalog-variant') and 'id' (variant ID in format '$custom:::$default:::{external_id}'). Maximum 100 variants per request.",
        },
      },
      required: [
        "data__attributes__variants__data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Spawn delete variants job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_update_categories_job",
    description: "Create a job to bulk update up to 100 categories, with a 5MB size limit and a maximum of 500 concurrent jobs. Burst rate limit is 75/s, steady is 700/m. Requires `catalogs:write` scope.",
    toolSlug: "KLAVIYO_SPAWN_UPDATE_CATEGORIES_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-category-bulk-update-job",
          ],
        },
        data__attributes__categories__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Data",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn update categories job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_update_items_job",
    description: "You can bulk update up to 100 catalog items with a 5MB payload limit. A max of 500 jobs can run concurrently. Rate limits are 75 requests/second and 700 requests/minute. Required scope: `catalogs:write`.",
    toolSlug: "KLAVIYO_SPAWN_UPDATE_ITEMS_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "The resource type for the bulk update job. Must be 'catalog-item-bulk-update-job'.",
          enum: [
            "catalog-item-bulk-update-job",
          ],
        },
        data__attributes__items__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog item objects to update in bulk (max 100 items). Each object must have: 'type' (always 'catalog-item'), 'id' (compound ID in format '$custom:::$default:::{external_id}'), and 'attributes' object containing fields to update (title, description, price, url, image_full_url, image_thumbnail_url, images array, custom_metadata object, published boolean).",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn update items job.",
    ],
  }),
  composioTool({
    name: "klaviyo_spawn_update_variants_job",
    description: "Create a job to bulk update up to 100 catalog variants with a 5MB payload limit. A max of 500 jobs may run concurrently. Rate limits are 75/s burst and 700/m steady. Requires `catalogs:write` scope.",
    toolSlug: "KLAVIYO_SPAWN_UPDATE_VARIANTS_JOB",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the bulk update job. Must be 'catalog-variant-bulk-update-job'.",
          enum: [
            "catalog-variant-bulk-update-job",
          ],
        },
        data__attributes__variants__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog variant objects to update. Each object must have 'type' (value: 'catalog-variant'), 'id' (the variant's unique identifier in format '$custom:::$default:::external_id'), and 'attributes' (object containing fields to update like title, description, sku, price, inventory_quantity, url, published, etc.). Maximum 100 variants per request.",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Spawn update variants job.",
    ],
  }),
  composioTool({
    name: "klaviyo_subscribe_profiles",
    description: "The API supports double opt-in for marketing, with 'historical_import' bypassing consent. It resets opt-outs for returning users. Caps at 1000 profiles, 75/s, and 700/min. Needs 'lists:write', 'profiles:write', 'subscriptions:write' permissions.",
    toolSlug: "KLAVIYO_SUBSCRIBE_PROFILES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type. Must be 'profile-subscription-bulk-create-job'.",
          enum: [
            "profile-subscription-bulk-create-job",
          ],
        },
        data__attributes__custom__source: {
          type: "string",
          description: "A custom method detail or source to store on the consent records.",
        },
        data__attributes__profiles__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of profile objects to subscribe. Each profile must have 'type': 'profile' and 'attributes' containing 'email' (required) and optionally 'phone_number', 'subscriptions' (for channel-specific opt-in like EMAIL or SMS). Max 1000 profiles per request.",
        },
        data__relationships__list__data__id: {
          type: "string",
          description: "The list to add the newly subscribed profiles to",
        },
        data__attributes__historical__import: {
          type: "boolean",
          description: "Whether this subscription is part of a historical import. If true, the consented_at field must be provided for each profile. ",
        },
        data__relationships__list__data__type: {
          type: "string",
          description: "Resource type for the list relationship. Must be 'list'.",
          enum: [
            "list",
          ],
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Subscribe profiles.",
    ],
  }),
  composioTool({
    name: "klaviyo_suppress_profiles",
    description: "Suppress profiles by email, segment, or list ID to stop email marketing, regardless of consent. View guides for details. Max 100 emails per request, with rate limits of 75/s and 700/m. Scopes: profiles:write, subscriptions:write.",
    toolSlug: "KLAVIYO_SUPPRESS_PROFILES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type identifier. Must be 'profile-suppression-bulk-create-job'.",
          enum: [
            "profile-suppression-bulk-create-job",
          ],
        },
        data__attributes__profiles__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of profile objects to suppress. Each object must have 'type': 'profile' and 'attributes': {'email': '<email_address>'}. Maximum 100 profiles per request. Can be empty if suppressing by list or segment.",
        },
        data__relationships__list__data__id: {
          type: "string",
          description: "The ID of the list whose profiles should be suppressed. All current members of this list will be suppressed from email marketing.",
        },
        data__relationships__list__data__type: {
          type: "string",
          description: "Resource type for list relationship. Must be 'list' when suppressing by list.",
          enum: [
            "list",
          ],
        },
        data__relationships__segment__data__id: {
          type: "string",
          description: "The ID of the segment whose profiles should be suppressed. All current members of this segment will be suppressed from email marketing.",
        },
        data__relationships__segment__data__type: {
          type: "string",
          description: "Resource type for segment relationship. Must be 'segment' when suppressing by segment.",
          enum: [
            "segment",
          ],
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Suppress profiles.",
    ],
  }),
  composioTool({
    name: "klaviyo_unregister_client_push_token",
    description: "This endpoint unsubscribes a push token, for use with Klaviyo's mobile SDKs and a public API key. Push notifications must be on. Rate limits are 3/s and 60/m.",
    toolSlug: "KLAVIYO_UNREGISTER_CLIENT_PUSH_TOKEN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        company_id: {
          type: "string",
          description: "Your Public API Key / Site ID. See [this article](https://help.klaviyo.com/hc/en-us/articles/115005062267) for more details. ",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "push-token-unregister",
          ],
        },
        data__attributes__token: {
          type: "string",
          description: "A push token from APNS or FCM.",
        },
        data__attributes__vendor: {
          type: "string",
          description: "The vendor of the push token.",
          enum: [
            "apns",
            "fcm",
          ],
        },
        data__attributes__platform: {
          type: "string",
          description: "The platform on which the push token was created.",
          enum: [
            "android",
            "ios",
          ],
        },
        data__attributes__profile__data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__attributes__profile__data__type: {
          type: "string",
          description: "Type",
          enum: [
            "profile",
          ],
        },
        data__attributes__profile__data__attributes____kx: {
          type: "string",
          description: "Also known as the `exchange_id`, this is an encrypted identifier used for identifying a profile by Klaviyo\"s web tracking. You can use this field as a filter when retrieving profiles via the Get Profiles endpoint. ",
        },
        data__attributes__profile__data__attributes__email: {
          type: "string",
          description: "Individual\"s email address",
        },
        data__attributes__profile__data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__profile__data__attributes__title: {
          type: "string",
          description: "Individual\"s job title",
        },
        data__attrs__profile__data__attrs__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attrs__profile__data__attrs__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attrs__profile__data__attrs__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attrs__profile__data__attrs__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__attrs__profile__data__meta__patch__props__unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attrs__profile__data__attrs__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__profile__data__attributes__last__name: {
          type: "string",
          description: "Individual\"s last name",
        },
        data__attributes__profile__data__attributes__first__name: {
          type: "string",
          description: "Individual\"s first name",
        },
        data__attributes__profile__data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__profile__data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__profile__data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__profile__data__attributes__anonymous__id: {
          type: "string",
          description: "Id that can be used to identify a profile when other identifiers are not available ",
        },
        data__attributes__profile__data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__profile__data__attributes__phone__number: {
          type: "string",
          description: "Individual\"s phone number in E.164 format",
        },
        data__attributes__profile__data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__profile__data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__profile__data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
      },
      required: [
        "company_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "client",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Unregister client push token.",
    ],
  }),
  composioTool({
    name: "klaviyo_unsubscribe_profiles",
    description: "Opt-out profiles from email or SMS marketing. Unsubscribe up to 100 profiles at a time with burst (75/s) and steady (700/m) rate limits. Use different method to remove without affecting subscriptions. More on consent and removal in the provided links.",
    toolSlug: "KLAVIYO_UNSUBSCRIBE_PROFILES",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type. Must be 'profile-subscription-bulk-delete-job'.",
          enum: [
            "profile-subscription-bulk-delete-job",
          ],
        },
        data__attributes__profiles__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of profile objects to unsubscribe (max 100). Each profile should have 'type': 'profile' and 'attributes' containing 'email' for email unsubscribe. Example: [{'type': 'profile', 'attributes': {'email': 'user@example.com'}}]",
        },
        data__relationships__list__data__id: {
          type: "string",
          description: "The ID of the Klaviyo list to unsubscribe the profiles from.",
        },
        data__relationships__list__data__type: {
          type: "string",
          description: "Resource type for the list relationship. Must be 'list'.",
          enum: [
            "list",
          ],
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Unsubscribe profiles.",
    ],
  }),
  composioTool({
    name: "klaviyo_unsubscribe_profiles_bulk",
    description: "Tool to unsubscribe one or more profiles from a Klaviyo list. Use when you need to bulk unsubscribe up to 100 profiles from email or SMS marketing for a specific list.",
    toolSlug: "KLAVIYO_UNSUBSCRIBE_PROFILES_BULK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of email addresses to unsubscribe. Maximum 100 profiles per request.",
        },
        list_id: {
          type: "string",
          description: "The ID of the Klaviyo list from which profiles should be unsubscribed",
        },
      },
      required: [
        "list_id",
        "emails",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "bulk_operations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Unsubscribe Profiles Bulk.",
    ],
  }),
  composioTool({
    name: "klaviyo_unsuppress_profiles",
    description: "Remove 'USER_SUPPRESSED' blocks on profiles manually via email, segment, or list ID. Does not affect unsubscribes or other suppressions. Limits: 100 emails per request, 75/s burst, 700/m steady. Scope: 'subscriptions:write'.",
    toolSlug: "KLAVIYO_UNSUPPRESS_PROFILES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type, must be 'profile-suppression-bulk-delete-job'.",
          enum: [
            "profile-suppression-bulk-delete-job",
          ],
        },
        data__attributes__profiles__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of profile objects to unsuppress. Each object should have 'type': 'profile' and 'attributes': {'email': 'user@example.com'}. Max 100 emails per request. Use empty list [] when unsuppressing via list or segment relationship.",
        },
        data__relationships__list__data__id: {
          type: "string",
          description: "The ID of the list whose members should be unsuppressed. When specified, all profiles in this list will have their USER_SUPPRESSED status removed.",
        },
        data__relationships__list__data__type: {
          type: "string",
          description: "Resource type for list relationship, must be 'list'. Required when specifying a list ID.",
          enum: [
            "list",
          ],
        },
        data__relationships__segment__data__id: {
          type: "string",
          description: "The ID of the segment whose members should be unsuppressed. When specified, all profiles in this segment will have their USER_SUPPRESSED status removed.",
        },
        data__relationships__segment__data__type: {
          type: "string",
          description: "Resource type for segment relationship, must be 'segment'. Required when specifying a segment ID.",
          enum: [
            "segment",
          ],
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Unsuppress profiles.",
    ],
  }),
  composioTool({
    name: "klaviyo_unsuppress_profiles_bulk",
    description: "Tool to unsuppress one or more profiles from email marketing by email address. Use when you need to remove USER_SUPPRESSED status from profiles. This only removes suppressions with reason USER_SUPPRESSED; profiles with HARD_BOUNCE or INVALID_EMAIL suppressions remain unchanged. Returns a job object that can be monitored for completion status.",
    toolSlug: "KLAVIYO_UNSUPPRESS_PROFILES_BULK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        suppressions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              email: {
                type: "string",
                description: "Email address of the profile to unsuppress from email marketing",
              },
            },
            description: "Individual suppression object containing an email address to unsuppress",
          },
          description: "List of suppression objects containing email addresses to unsuppress. Maximum 100 profiles per request.",
        },
      },
      required: [
        "suppressions",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Unsuppress Profiles (Bulk).",
    ],
  }),
  composioTool({
    name: "klaviyo_update_campaign",
    description: "Update a campaign with the specified attributes. This action allows you to modify campaign settings including name, audiences, and send strategy. Only the fields you provide will be updated; others remain unchanged. Rate limits: 10/s burst, 150/m steady. Required scope: `campaigns:write`. Preconditions: - Valid API key with campaigns:write scope - Campaign ID must exist and be accessible - Campaign must be in a state that allows updates (usually draft status) - Send strategy options must match the selected method",
    toolSlug: "KLAVIYO_UPDATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The campaign name",
        },
        campaign_id: {
          type: "string",
          description: "The unique identifier of the campaign to update. Use GET /api/campaigns to list available campaigns.",
        },
        send_options: {
          type: "object",
          additionalProperties: true,
          description: "Additional send options (advanced use)",
        },
        sto_send_date: {
          type: "string",
          description: "Date to send on for Smart Send Time (YYYY-MM-DD format)",
        },
        tracking_options: {
          type: "object",
          additionalProperties: true,
          description: "Tracking options for the campaign",
        },
        excluded_audiences: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of list/segment IDs to exclude from audiences",
        },
        included_audiences: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of list/segment IDs to include as audiences",
        },
        throttle_percentage: {
          type: "integer",
          description: "Percentage of recipients to send to per hour. Valid values: 10, 11, 13, 14, 17, 20, 25, 33, 50. Required when send_strategy_method is 'throttled'.",
          enum: [
            10,
            11,
            13,
            14,
            17,
            20,
            25,
            33,
            50,
          ],
        },
        send_strategy_method: {
          type: "string",
          description: "Method for sending the campaign. Options: 'static' (scheduled time), 'throttled' (gradual sending), 'immediate' (send now), 'smart_send_time' (AI-optimized timing)",
          enum: [
            "static",
            "throttled",
            "immediate",
            "smart_send_time",
          ],
        },
        static_send_datetime: {
          type: "string",
          description: "When to send the campaign (for static strategy)",
        },
        throttled_send_datetime: {
          type: "string",
          description: "When to start sending the campaign (for throttled strategy)",
        },
        static_is_local_timezone: {
          type: "boolean",
          description: "Whether to send in recipients' local timezones",
        },
        static_send_past_recipients_immediately: {
          type: "boolean",
          description: "Whether to send immediately to recipients in past timezones. Only valid when static_is_local_timezone is True.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
      "destructive",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Campaign.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_campaign_message",
    description: "Update a campaign message<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `campaigns:write`",
    toolSlug: "KLAVIYO_UPDATE_CAMPAIGN_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The message ID to be retrieved",
        },
        data__id: {
          type: "string",
          description: "The message ID to be retrieved",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "campaign-message",
          ],
        },
        data__attributes__label: {
          type: "string",
          description: "The label or name on the message",
        },
        data__attributes__content: {
          type: "object",
          additionalProperties: true,
          description: "Channel-specific message content fields. Valid fields depend on the channel type:\n- EMAIL: subject, preview_text, from_email, from_label, reply_to_email, cc_email, bcc_email. DO NOT include 'body' for email campaigns - email HTML is managed through templates.\n- SMS: body (message text), media_url (for MMS).\n- MOBILE_PUSH: body (up to 512 chars), title, notification_type, dynamic_image, play_sound, badge, on_open.",
        },
        data__attributes__render__options__shorten__links: {
          type: "boolean",
          description: "Shorten Links",
        },
        data__attributes__render__options__add__info__link: {
          type: "boolean",
          description: "Add Info Link",
        },
        data__attributes__render__options__add__org__prefix: {
          type: "boolean",
          description: "Add Org Prefix",
        },
        data__attributes__render__options__add__opt__out__language: {
          type: "boolean",
          description: "Add Opt Out Language",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Update campaign message.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_catalog_category",
    description: "Update a catalog category with the given category ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_UPDATE_CATALOG_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog category ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        data__id: {
          type: "string",
          description: "The catalog category ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        data__type: {
          type: "string",
          description: "The resource type for the catalog category. Must be 'catalog-category'.",
          enum: [
            "catalog-category",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The name of the catalog category.",
        },
        data__relationships__items__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog item relationships to associate with this category. Each item should have 'type' (always 'catalog-item') and 'id' (the catalog item ID).",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update catalog category.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_catalog_category_relationships",
    description: "Tool to update item relationships for a catalog category. Replaces all existing item relationships with the provided list. Use when you need to associate catalog items with a category or remove existing associations. Pass an empty data array to remove all item relationships from the category. Rate limits: 75/s burst, 700/m steady. Required scope: catalogs:write.",
    toolSlug: "KLAVIYO_UPDATE_CATALOG_CATEGORY_RELATIONSHIPS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the catalog category to update relationships for. Format: '$custom:::$default:::{external_id}' (e.g., '$custom:::$default:::test-category-001').",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "The unique identifier of the catalog item in format '$custom:::$default:::{external_id}' (e.g., '$custom:::$default:::test-item-001').",
              },
              type: {
                type: "string",
                description: "The resource type, must be 'catalog-item'.",
              },
            },
            description: "Catalog item identifier following Klaviyo's JSON:API format.",
          },
          description: "Array of catalog item identifiers to associate with the category. This replaces all existing relationships. Pass an empty array to remove all item relationships. Each item must have 'type' set to 'catalog-item' and 'id' in format '$custom:::$default:::{external_id}'.",
        },
        related_resource: {
          type: "string",
          description: "The type of related resource to update. Currently only 'items' is supported.",
          enum: [
            "items",
          ],
        },
      },
      required: [
        "id",
        "related_resource",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Catalog Category Relationships.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_catalog_category_relationships_items",
    description: "Update item relationships for the given category ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_UPDATE_CATALOG_CATEGORY_RELATIONSHIPS_ITEMS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the catalog category whose item relationships to update. Format: {integration_type}:::{catalog_type}:::{external_id} (e.g., '$custom:::$default:::my-category-id').",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog item resource identifiers to replace the existing relationships. Each object must have 'type' (always 'catalog-item') and 'id' (the item's unique identifier in format '$custom:::$default:::{external_id}'). Pass an empty array to remove all item relationships.",
        },
      },
      required: [
        "id",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update catalog category relationships items.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_catalog_item",
    description: "Update a catalog item with the given item ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_UPDATE_CATALOG_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog item ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        data__id: {
          type: "string",
          description: "The catalog item ID in the request body. Must match the 'id' path parameter. Format: `{integration}:::{catalog}:::{external_id}` (e.g., '$custom:::$default:::ITEM-123'). Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`.",
        },
        data__type: {
          type: "string",
          description: "The resource type. Must be 'catalog-item'.",
          enum: [
            "catalog-item",
          ],
        },
        data__attributes__url: {
          type: "string",
          description: "URL pointing to the location of the catalog item on your website.",
        },
        data__attributes__price: {
          type: "number",
          description: "This field can be used to set the price on the catalog item, which is what gets displayed for the item when included in emails. For most price-update use cases, you will also want to update the `price` on any child variants, using the [Update Catalog Variant Endpoint](https://developers.klaviyo.com/en/reference/update_catalog_variant). ",
        },
        data__attributes__title: {
          type: "string",
          description: "The title of the catalog item.",
        },
        data__attributes__images: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of URLs pointing to the locations of images of the catalog item.",
        },
        data__attributes__published: {
          type: "boolean",
          description: "Boolean value indicating whether the catalog item is published.",
        },
        data__attributes__description: {
          type: "string",
          description: "A description of the catalog item.",
        },
        data__attributes__image__full__url: {
          type: "string",
          description: "URL pointing to the location of a full image of the catalog item.",
        },
        data__relationships__categories__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of category relationships to associate with this catalog item. Each object should have 'type' (always 'catalog-category') and 'id' (the category ID in format '$custom:::$default:::CATEGORY_ID').",
        },
        data__attributes__image__thumbnail__url: {
          type: "string",
          description: "URL pointing to the location of an image thumbnail of the catalog item",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update catalog item.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_catalog_item_relationships_categories",
    description: "Update catalog category relationships for the given item ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_UPDATE_CATALOG_ITEM_RELATIONSHIPS_CATEGORIES",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the catalog item in the format '$custom:::$default:::{external_id}' (e.g., '$custom:::$default:::my-product-123').",
        },
        data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of catalog category relationship objects. Each object must have 'type' set to 'catalog-category' and 'id' set to the category ID in format '$custom:::$default:::{external_id}'. Pass an empty array [] to remove all category associations from the item.",
        },
      },
      required: [
        "id",
        "data",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update catalog item relationships categories.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_catalog_variant",
    description: "Update a catalog item variant with the given variant ID.<br><br>*Rate limits*:<br>Burst: `75/s`<br>Steady: `700/m` **Scopes:** `catalogs:write`",
    toolSlug: "KLAVIYO_UPDATE_CATALOG_VARIANT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The catalog variant ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        data__id: {
          type: "string",
          description: "The catalog variant ID is a compound ID (string), with format: `{integration}:::{catalog}:::{external_id}`. Currently, the only supported integration type is `$custom`, and the only supported catalog is `$default`. ",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "catalog-variant",
          ],
        },
        data__attributes__sku: {
          type: "string",
          description: "The SKU of the catalog item variant.",
        },
        data__attributes__url: {
          type: "string",
          description: "URL pointing to the location of the catalog item variant on your website. ",
        },
        data__attributes__price: {
          type: "number",
          description: "This field can be used to set the price on the catalog item variant, which is what gets displayed for the item variant when included in emails. For most price-update use cases, you will also want to update the `price` on any parent items using the [Update Catalog Item Endpoint](https://developers.klaviyo.com/en/reference/update_catalog_item). ",
        },
        data__attributes__title: {
          type: "string",
          description: "The title of the catalog item variant.",
        },
        data__attributes__images: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of URLs pointing to the locations of images of the catalog item variant. ",
        },
        data__attributes__published: {
          type: "boolean",
          description: "Boolean value indicating whether the catalog item variant is published.",
        },
        data__attributes__description: {
          type: "string",
          description: "A description of the catalog item variant.",
        },
        data__attributes__image__full__url: {
          type: "string",
          description: "URL pointing to the location of a full image of the catalog item variant. ",
        },
        data__attributes__inventory__policy: {
          type: "integer",
          description: "This field controls the visibility of this catalog item variant in product feeds/blocks. This field supports the following values: `1`: a product will not appear in dynamic product recommendation feeds and blocks if it is out of stock. `0` or `2`: a product can appear in dynamic product recommendation feeds and blocks regardless of inventory quantity. ",
        },
        data__attributes__inventory__quantity: {
          type: "number",
          description: "The quantity of the catalog item variant currently in stock.",
        },
        data__attributes__image__thumbnail__url: {
          type: "string",
          description: "URL pointing to the location of an image thumbnail of the catalog item variant. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "catalogs",
    ],
    askBefore: [
      "Confirm the parameters before executing Update catalog variant.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_update_coupon",
    description: "Update an existing coupon's properties. Currently, only the coupon description can be updated. The coupon ID (external_id) cannot be changed after creation. *Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `coupons:write`",
    toolSlug: "KLAVIYO_UPDATE_COUPON",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the coupon to update. This is the external_id that was assigned when the coupon was created (e.g., 'SUMMER_SALE_2026').",
        },
        data__id: {
          type: "string",
          description: "The coupon ID in the request body. Must match the 'id' path parameter.",
        },
        data__type: {
          type: "string",
          description: "The resource type. Must be 'coupon' for coupon objects.",
          enum: [
            "coupon",
          ],
        },
        data__attributes__description: {
          type: "string",
          description: "The new description for the coupon. Can be used to add or update the coupon's description text.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "coupons",
    ],
    askBefore: [
      "Confirm the parameters before executing Update coupon.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_coupon_code",
    description: "Updates a coupon code specified by the given identifier synchronously. We allow updating the 'status' and 'expires_at' of coupon codes.<br><br>*Rate limits*:<br>Burst: `350/s`<br>Steady: `3500/m` **Scopes:** `coupon-codes:write`",
    toolSlug: "KLAVIYO_UPDATE_COUPON_CODE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The id of a coupon code is a combination of its unique code and the id of the coupon it is associated with. ",
        },
        data__id: {
          type: "string",
          description: "The id of a coupon code is a combination of its unique code and the id of the coupon it is associated with. ",
        },
        data__type: {
          type: "string",
          description: "The resource type. Must be 'coupon-code' for coupon code resources.",
          enum: [
            "coupon-code",
          ],
        },
        data__attributes__status: {
          type: "string",
          description: "The API status of our coupon codes.",
          enum: [
            "ASSIGNED_TO_PROFILE",
            "DELETING",
            "PROCESSING",
            "UNASSIGNED",
            "USED",
            "VERSION_NOT_ACTIVE",
          ],
        },
        data__attributes__expires__at: {
          type: "string",
          description: "The datetime when this coupon code will expire. If not specified or set to null, it will be automatically set to 1 year. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "coupons",
    ],
    askBefore: [
      "Confirm the parameters before executing Update coupon code.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_flow_status",
    description: "Update the status of a flow with the given flow ID, and all actions in that flow. Flow statuses: - 'draft': Flow is disabled; no messages will be sent - 'manual': Messages require manual approval before sending - 'live': Messages are sent automatically when triggered Rate limits: Burst: 3/s, Steady: 60/m Required scope: flows:write",
    toolSlug: "KLAVIYO_UPDATE_FLOW_STATUS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the flow to update (e.g., 'XVTP5Q'). This ID is used in the URL path.",
        },
        data__id: {
          type: "string",
          description: "The flow ID in the request body. If not provided, defaults to the 'id' path parameter value. Must match the path parameter 'id'.",
        },
        data__type: {
          type: "string",
          description: "Resource type for the request body. Must always be 'flow'.",
          enum: [
            "flow",
          ],
        },
        data__attributes__status: {
          type: "string",
          description: "The new status to set for the flow. 'draft' = flow is disabled and no messages will be sent; 'manual' = messages require manual approval before sending; 'live' = messages are sent automatically when triggered.",
          enum: [
            "draft",
            "manual",
            "live",
          ],
        },
      },
      required: [
        "id",
        "data__attributes__status",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "flows",
    ],
    askBefore: [
      "Confirm the parameters before executing Update flow status.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_image",
    description: "Update the image with the given image ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `images:write`",
    toolSlug: "KLAVIYO_UPDATE_IMAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the image",
        },
        data__id: {
          type: "string",
          description: "The ID of the image in the request body. Must match the 'id' path parameter.",
        },
        data__type: {
          type: "string",
          description: "Resource type for the request body. Must always be 'image'.",
          enum: [
            "image",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "A name for the image. Can contain Unicode characters and special characters.",
        },
        data__attributes__hidden: {
          type: "boolean",
          description: "If true, the image is hidden and not shown in the asset library. Defaults to false if not specified.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "images",
    ],
    askBefore: [
      "Confirm the parameters before executing Update image.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_list",
    description: "Update the name of a list with the given list ID.<br><br>*Rate limits*:<br>Burst: `10/s`<br>Steady: `150/m` **Scopes:** `lists:write`",
    toolSlug: "KLAVIYO_UPDATE_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Primary key that uniquely identifies this list. Generated by Klaviyo.",
        },
        data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this list. Generated by Klaviyo.",
        },
        data__type: {
          type: "string",
          description: "Type",
          enum: [
            "list",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "A helpful name to label the list",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update list.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_profile",
    description: "Update profiles with the provided ID. Setting fields to `null` clears them; omitting fields retains existing data. Rate limits: 75/s burst, 700/m steady. Required scope: `profiles:write`.",
    toolSlug: "KLAVIYO_UPDATE_PROFILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__id: {
          type: "string",
          description: "Primary key that uniquely identifies this profile. Generated by Klaviyo.",
        },
        data__type: {
          type: "string",
          description: "Resource type. Must be 'profile'.",
          enum: [
            "profile",
          ],
        },
        data__attributes__email: {
          type: "string",
          description: "Individual's email address",
        },
        data__attributes__image: {
          type: "string",
          description: "URL pointing to the location of a profile image",
        },
        data__attributes__title: {
          type: "string",
          description: "Individual's job title",
        },
        data__attributes__last__name: {
          type: "string",
          description: "Individual's last name",
        },
        data__attributes__first__name: {
          type: "string",
          description: "Individual's first name",
        },
        data__attributes__external__id: {
          type: "string",
          description: "A unique identifier used by customers to associate Klaviyo profiles with profiles in an external system, such as a point-of-sale system. Format varies based on the external system. ",
        },
        data__attributes__location__ip: {
          type: "string",
          description: "IP Address",
        },
        data__attributes__organization: {
          type: "string",
          description: "Name of the company or organization within the company for whom the individual works ",
        },
        data__attributes__anonymous__id: {
          type: "string",
          description: "Anonymous identifier for tracking profiles before they are identified with an email or external ID",
        },
        data__attributes__location__zip: {
          type: "string",
          description: "Zip code",
        },
        data__attributes__phone__number: {
          type: "string",
          description: "Individual's phone number in E.164 format (e.g., +15005550006)",
        },
        data__attributes__location__city: {
          type: "string",
          description: "City name",
        },
        data__attributes__location__region: {
          type: "string",
          description: "Region within a country, such as state or province",
        },
        data__attributes__location__country: {
          type: "string",
          description: "Country name",
        },
        data__attributes__location__address1: {
          type: "string",
          description: "First line of street address",
        },
        data__attributes__location__address2: {
          type: "string",
          description: "Second line of street address",
        },
        data__attributes__location__latitude: {
          type: "string",
          description: "Latitude coordinate. We recommend providing a precision of four decimal places. ",
        },
        data__attributes__location__timezone: {
          type: "string",
          description: "Time zone name. We recommend using time zones from the IANA Time Zone Database. ",
        },
        data__meta__patch__properties__unset: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Remove a key or keys (and their values) completely from properties",
        },
        data__attributes__location__longitude: {
          type: "string",
          description: "Longitude coordinate. We recommend providing a precision of four decimal places. ",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "profiles",
    ],
    askBefore: [
      "Confirm the parameters before executing Update profile.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_segment",
    description: "Update a segment with the given segment ID.<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `15/m`<br>Daily: `100/d` **Scopes:** `segments:write`",
    toolSlug: "KLAVIYO_UPDATE_SEGMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the segment to update (e.g., 'XTTNN5'). This is a required path parameter.",
        },
        data__id: {
          type: "string",
          description: "The ID of the segment being updated. Should match the path parameter 'id'.",
        },
        data__type: {
          type: "string",
          description: "The resource type. Must be 'segment' for segment updates.",
          enum: [
            "segment",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The display name of the segment. Use this to rename the segment.",
        },
        data__attributes__is__starred: {
          type: "boolean",
          description: "Whether the segment should be starred/favorited for quick access. Set to true to star or false to unstar.",
        },
        data__attributes__definition__condition__groups: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of condition groups that define segment membership. Each group contains conditions combined with logical OR, and groups are combined with logical AND. Example: [{'conditions': [{'type': 'profile-property', 'property': 'email', 'filter': {'type': 'string', 'operator': 'contains', 'value': '@gmail.com'}}]}]",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "segments",
    ],
    askBefore: [
      "Confirm the parameters before executing Update segment.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_tag",
    description: "Update the tag with the given tag ID. Only a tag's `name` can be changed. A tag cannot be moved from one tag group to another. **Important**: The `data__id` in the request body must match the `id` path parameter. Returns HTTP 204 No Content on success. *Rate limits*: Burst: `3/s` | Steady: `60/m` **Scopes:** `tags:read` `tags:write`",
    toolSlug: "KLAVIYO_UPDATE_TAG",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Tag ID",
        },
        data__id: {
          type: "string",
          description: "The Tag ID in the request body. Must match the 'id' path parameter.",
        },
        data__type: {
          type: "string",
          description: "The resource type for the request body. Must be 'tag'.",
          enum: [
            "tag",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The new name for the tag. This is the only attribute that can be updated.",
        },
      },
      required: [
        "id",
        "data__attributes__name",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Update tag.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_update_tag_group",
    description: "Update the tag group with the given tag group ID. Only a tag group's `name` can be changed. A tag group's `exclusive` or `default` value cannot be changed.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `60/m` **Scopes:** `tags:read` `tags:write`",
    toolSlug: "KLAVIYO_UPDATE_TAG_GROUP",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The Tag Group ID",
        },
        data__id: {
          type: "string",
          description: "The Tag Group ID in the request body. Must match the 'id' path parameter.",
        },
        data__type: {
          type: "string",
          description: "Resource type identifier. Must be 'tag-group'. Defaults to 'tag-group' if not provided.",
          enum: [
            "tag-group",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "The new name for the tag group. This is the only attribute that can be modified after creation.",
        },
        data__attributes__return__fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of fields to return in the response. If not specified, default fields are returned.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "tags",
    ],
    askBefore: [
      "Confirm the parameters before executing Update tag group.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_update_template",
    description: "Update an existing email template by ID. Supports updating name, HTML content, and plaintext content. Note: This action only works with CODE editor type templates; drag & drop templates cannot be updated via API. Rate limits: Burst 10/s, Steady 150/m. Requires 'templates:write' scope.",
    toolSlug: "KLAVIYO_UPDATE_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The unique identifier of the template to update. Used in the URL path.",
        },
        data__id: {
          type: "string",
          description: "The template ID in the request body. Must match the 'id' path parameter.",
        },
        data__type: {
          type: "string",
          description: "Resource type identifier. Must be 'template'.",
          enum: [
            "template",
          ],
        },
        data__attributes__html: {
          type: "string",
          description: "The new HTML content for the template. Only works with CODE editor type templates, not drag & drop templates.",
        },
        data__attributes__name: {
          type: "string",
          description: "The new name for the template. Optional - only include if updating the name.",
        },
        data__attributes__text: {
          type: "string",
          description: "The new plaintext version of the template. This is the fallback content for email clients that don't support HTML.",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Update template.",
    ],
  }),
  composioTool({
    name: "klaviyo_update_webhook",
    description: "Update the webhook with the given ID.<br><br>*Rate limits*:<br>Burst: `1/s`<br>Steady: `15/m` **Scopes:** `webhooks:write`",
    toolSlug: "KLAVIYO_UPDATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "The ID of the webhook.",
        },
        data__id: {
          type: "string",
          description: "The ID of the webhook.",
        },
        data__type: {
          type: "string",
          description: "Resource type identifier. Must be set to 'webhook' for webhook resources.",
          enum: [
            "webhook",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "A name for the webhook.",
        },
        data__attributes__enabled: {
          type: "boolean",
          description: "Boolean flag to enable or disable the webhook. Set to true to enable the webhook to receive events, or false to disable it.",
        },
        data__attributes__description: {
          type: "string",
          description: "A description for the webhook.",
        },
        data__attributes__secret__key: {
          type: "string",
          description: "A secret key, that will be used for webhook request signing.",
        },
        data__attributes__endpoint__url: {
          type: "string",
          description: "A url to send webhook calls to. Must be https.",
        },
        data__relationships__webhook__topics__data: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of webhook topic references. Each item should have 'type' set to 'webhook-topic' and 'id' set to a webhook topic identifier (e.g., 'event:klaviyo.sent_sms', 'event:klaviyo.received_sms').",
        },
      },
      required: [
        "id",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "webhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update webhook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "klaviyo_upload_image_from_file",
    description: "Upload an image from a file. If you want to import an image from an existing url or a data uri, use the Upload Image From URL endpoint instead.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `100/m`<br>Daily: `100/d` **Scopes:** `images:write`",
    toolSlug: "KLAVIYO_UPLOAD_IMAGE_FROM_FILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
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
          description: "The image file to upload. Supported formats: jpeg, png, gif. Maximum file size: 5 MB.",
        },
        name: {
          type: "string",
          description: "A name for the image. If not provided, defaults to the filename.",
        },
        hidden: {
          type: "boolean",
          description: "If True, the image will not be shown in the asset library. Defaults to False.",
        },
      },
      required: [
        "file",
      ],
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "images",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload image from file.",
    ],
  }),
  composioTool({
    name: "klaviyo_upload_image_from_url",
    description: "Import an image from a url or data uri. If you want to upload an image from a file, use the Upload Image From File endpoint instead.<br><br>*Rate limits*:<br>Burst: `3/s`<br>Steady: `100/m`<br>Daily: `100/d` **Scopes:** `images:write`",
    toolSlug: "KLAVIYO_UPLOAD_IMAGE_FROM_URL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        data__type: {
          type: "string",
          description: "Resource type for the request. Must be 'image'.",
          enum: [
            "image",
          ],
        },
        data__attributes__name: {
          type: "string",
          description: "A name for the image.  Defaults to the filename if not provided.  If the name matches an existing image, a suffix will be added. ",
        },
        data__attributes__hidden: {
          type: "boolean",
          description: "If true, this image is not shown in the asset library.",
        },
        data__attributes__import__from__url: {
          type: "string",
          description: "An existing image url to import the image from. Alternatively, you may specify a base-64 encoded data-uri (`data:image/...`). Supported image formats: jpeg,png,gif. Maximum image size: 5MB. ",
        },
      },
    },
    tags: [
      "composio",
      "klaviyo",
      "write",
      "images",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload image from url.",
    ],
  }),
];
