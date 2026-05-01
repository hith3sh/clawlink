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
    integration: "mailchimp",
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
      toolkit: "mailchimp",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const mailchimpComposioTools: IntegrationTool[] = [
  composioTool({
    name: "mailchimp_add_automation",
    description: "Create a new classic abandoned cart automation in your Mailchimp account. This action creates an automation workflow that sends emails to customers who have abandoned their shopping cart. Requires a connected e-commerce store and an audience/list. Prerequisites: - A Mailchimp audience/list (use MAILCHIMP_ADD_LIST or MAILCHIMP_GET_LISTS_INFO) - A connected e-commerce store (use MAILCHIMP_ADD_STORE or MAILCHIMP_LIST_STORES) Note: Classic automations are only available to paid Mailchimp accounts that have previously created a classic automation. Currently only the 'abandonedCart' workflow type is supported via the API.",
    toolSlug: "MAILCHIMP_ADD_AUTOMATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        settings__reply__to: {
          type: "string",
          description: "The email address that recipients can reply to (e.g., 'support@yourcompany.com').",
        },
        recipients__list__id: {
          type: "string",
          description: "The unique ID of the Mailchimp audience/list that this automation will target. Required for creating an automation. Get this from MAILCHIMP_GET_LISTS_INFO.",
        },
        settings__from__name: {
          type: "string",
          description: "The sender name that appears in the \"From\" field of automation emails (e.g., 'Your Company Name'). Not an email address.",
        },
        recipients__store__id: {
          type: "string",
          description: "The unique ID of the connected e-commerce store. Required for abandonedCart workflow type to enable cart tracking. Get this from MAILCHIMP_LIST_STORES.",
        },
        trigger__settings__workflow__type: {
          type: "string",
          description: "The type of classic automation workflow to create. Currently only 'abandonedCart' is supported via the API. This triggers emails when a customer abandons their shopping cart.",
        },
      },
      required: [
        "recipients__list__id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "Confirm the parameters before executing Add automation.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_batch_webhook",
    description: "Configure a webhook that will fire whenever any batch request completes processing. You may only have a maximum of 20 batch webhooks.",
    toolSlug: "MAILCHIMP_ADD_BATCH_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "A valid URL for the batch webhook. Mailchimp will POST data to this URL when a batch operation completes processing. Must be a publicly accessible HTTPS URL.",
        },
        enabled: {
          type: "boolean",
          description: "Whether the webhook should be enabled to receive requests. Defaults to True if not specified.",
        },
      },
      required: [
        "url",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "batchwebhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Add batch webhook.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_campaign",
    description: "Create a new Mailchimp campaign.",
    toolSlug: "MAILCHIMP_ADD_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "There are four types of [campaigns](https://mailchimp.com/help/getting-started-with-campaigns/) you can create in Mailchimp. A/B Split campaigns have been deprecated and variate campaigns should be used instead. ",
          enum: [
            "regular",
            "plaintext",
            "absplit",
            "rss",
            "variate",
          ],
        },
        content_type: {
          type: "string",
          description: "How the campaign\"s content is put together. The old drag and drop editor uses \"template\" while the new editor uses \"multichannel\". Defaults to template. ",
          enum: [
            "template",
            "multichannel",
          ],
        },
        settings__title: {
          type: "string",
          description: "The title of the campaign.",
        },
        tracking__opens: {
          type: "boolean",
          description: "Whether to [track opens](https://mailchimp.com/help/about-open-tracking/). Defaults to `true`. Cannot be set to false for variate campaigns. ",
        },
        settings__to__name: {
          type: "string",
          description: "The campaign\"s custom \"To\" name. Typically the first name [audience field](https://mailchimp.com/help/getting-started-with-merge-tags/). ",
        },
        tracking__ecomm360: {
          type: "boolean",
          description: "Whether to enable e-commerce tracking.",
        },
        settings__reply__to: {
          type: "string",
          description: "The reply-to email address for the campaign. Note: while this field is not required for campaign creation, it is required for sending. ",
        },
        social__card__title: {
          type: "string",
          description: "The title for the card. Typically the subject line of the campaign.",
        },
        tracking__clicktale: {
          type: "string",
          description: "The custom slug for [ClickTale](https://mailchimp.com/help/additional-tracking-options-for-campaigns/) tracking (max of 50 bytes). ",
        },
        recipients__list__id: {
          type: "string",
          description: "The unique list id.",
        },
        rss__opts__feed__url: {
          type: "string",
          description: "The URL for the RSS feed.",
        },
        rss__opts__frequency: {
          type: "string",
          description: "The frequency of the RSS Campaign.",
          enum: [
            "daily",
            "weekly",
            "monthly",
          ],
        },
        settings__folder__id: {
          type: "string",
          description: "If the campaign is listed in a folder, the id for that folder.",
        },
        settings__from__name: {
          type: "string",
          description: "The \"from\" name on the campaign (not an email address).",
        },
        settings__auto__tweet: {
          type: "boolean",
          description: "Automatically tweet a link to the [campaign archive](https://mailchimp.com/help/about-email-campaign-archives-and-pages/) page when the campaign is sent. ",
        },
        settings__inline__css: {
          type: "boolean",
          description: "Automatically inline the CSS included with the campaign content.",
        },
        settings__authenticate: {
          type: "boolean",
          description: "Whether Mailchimp [authenticated](https://mailchimp.com/help/about-email-authentication/) the campaign. Defaults to `true`. ",
        },
        settings__auto__footer: {
          type: "boolean",
          description: "Automatically append Mailchimp\"s [default footer](https://mailchimp.com/help/about-campaign-footers/) to the campaign. ",
        },
        settings__fb__comments: {
          type: "boolean",
          description: "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to `true`. ",
        },
        settings__template__id: {
          type: "integer",
          description: "The id of the template to use.",
        },
        tracking__html__clicks: {
          type: "boolean",
          description: "Whether to [track clicks](https://mailchimp.com/help/enable-and-view-click-tracking/) in the HTML version of the campaign. Defaults to `true`. Cannot be set to false for variate campaigns. ",
        },
        tracking__text__clicks: {
          type: "boolean",
          description: "Whether to [track clicks](https://mailchimp.com/help/enable-and-view-click-tracking/) in the plain-text version of the campaign. Defaults to `true`. Cannot be set to false for variate campaigns. ",
        },
        settings__preview__text: {
          type: "string",
          description: "The preview text for the campaign.",
        },
        settings__subject__line: {
          type: "string",
          description: "The subject line for the campaign.",
        },
        settings__auto__fb__post: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of [Facebook](https://mailchimp.com/help/connect-or-disconnect-the-facebook-integration/) page ids to auto-post to. ",
        },
        social__card__image__url: {
          type: "string",
          description: "The url for the header image for the card.",
        },
        tracking__capsule__notes: {
          type: "boolean",
          description: "Update contact notes for a campaign based on subscriber email addresses.",
        },
        tracking__goal__tracking: {
          type: "boolean",
          description: "Deprecated",
        },
        rss__opts__schedule__hour: {
          type: "integer",
          description: "The hour to send the campaign in local time. Acceptable hours are 0-23. For example, \"4\" would be 4am in [your account\"s default time zone](https://mailchimp.com/help/set-account-defaults/). ",
        },
        social__card__description: {
          type: "string",
          description: "A short summary of the campaign to display.",
        },
        settings__use__conversation: {
          type: "boolean",
          description: "Use Mailchimp Conversation feature to manage out-of-office replies.",
        },
        tracking__google__analytics: {
          type: "string",
          description: "The custom slug for [Google Analytics](https://mailchimp.com/help/integrate-google-analytics-with-mailchimp/) tracking (max of 50 bytes). ",
        },
        tracking__salesforce__notes: {
          type: "boolean",
          description: "Update contact notes for a campaign based on subscriber email addresses.",
        },
        variate__settings__test__size: {
          type: "integer",
          description: "The percentage of recipients to send the test combinations to, must be a value between 10 and 100. ",
        },
        variate__settings__wait__time: {
          type: "integer",
          description: "The number of minutes to wait before choosing the winning campaign. The value of wait_time must be greater than 0 and in whole hours, specified in minutes. ",
        },
        rss__opts__constrain__rss__img: {
          type: "boolean",
          description: "Whether to add CSS to images in the RSS feed to constrain their width in campaigns. ",
        },
        tracking__salesforce__campaign: {
          type: "boolean",
          description: "Create a campaign in a connected Salesforce account.",
        },
        variate__settings__from__names: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible from names. The number of from_names provided must match the number of reply_to_addresses. If no from_names are provided, settings.from_name will be used. ",
        },
        variate__settings__send__times: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible send times to test. The times provided should be in the format YYYY-MM-DD HH:MM:SS. If send_times are provided to test, the test_size will be set to 100% and winner_criteria will be ignored. ",
        },
        recipients__segment__opts__match: {
          type: "string",
          description: "Segment match type.",
          enum: [
            "any",
            "all",
          ],
        },
        variate__settings__subject__lines: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible subject lines to test. If no subject lines are provided, settings.subject_line will be used. ",
        },
        variate__settings__winner__criteria: {
          type: "string",
          description: "The combination that performs the best. This may be determined automatically by click rate, open rate, or total revenue -- or you may choose manually based on the reporting data you find the most valuable. For Multivariate Campaigns testing send_time, winner_criteria is ignored. For Multivariate Campaigns with \"manual\" as the winner_criteria, the winner must be chosen in the Mailchimp web application. ",
          enum: [
            "opens",
            "clicks",
            "manual",
            "total_revenue",
          ],
        },
        recipients__segment__opts__conditions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Segment match conditions. There are multiple possible types, see the [condition types documentation](https://mailchimp.com/developer/marketing/docs/alternative-schemas/#segment-condition-schemas). ",
        },
        rss__opts__schedule__weekly__send__day: {
          type: "string",
          description: "The day of the week to send a weekly RSS Campaign.",
          enum: [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ],
        },
        variate__settings__reply__to__addresses: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible reply-to addresses. The number of reply_to_addresses provided must match the number of from_names. If no reply_to_addresses are provided, settings.reply_to will be used. ",
        },
        rss__opts__schedule__daily__send__friday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Fridays.",
        },
        rss__opts__schedule__daily__send__monday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Mondays.",
        },
        rss__opts__schedule__daily__send__sunday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Sundays.",
        },
        rss__opts__schedule__monthly__send__date: {
          type: "integer",
          description: "The day of the month to send a monthly RSS Campaign. Acceptable days are 0-31, where \"0\" is always the last day of a month. Months with fewer than the selected number of days will not have an RSS campaign sent out that day. For example, RSS Campaigns set to send on the 30th will not go out in February. ",
        },
        rss__opts__schedule__daily__send__tuesday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Tuesdays.",
        },
        rss__opts__schedule__daily__send__saturday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Saturdays.",
        },
        rss__opts__schedule__daily__send__thursday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Thursdays.",
        },
        rss__opts__schedule__daily__send__wednesday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Wednesdays.",
        },
        recipients__segment__opts__saved__segment__id: {
          type: "integer",
          description: "The id for an existing saved segment.",
        },
      },
      required: [
        "type",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Add campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_campaign_feedback",
    description: "Add feedback on a specific Mailchimp campaign. Use this to post comments, notes, or feedback while collaborating on a campaign with your team. The feedback can be associated with a specific content block or applied to the campaign as a whole.",
    toolSlug: "MAILCHIMP_ADD_CAMPAIGN_FEEDBACK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        message: {
          type: "string",
          description: "The content of the feedback message. This is the text of the feedback comment.",
        },
        block_id: {
          type: "integer",
          description: "The block ID for the editable block that the feedback addresses. Optional - omit if providing general feedback on the campaign.",
        },
        campaign_id: {
          type: "string",
          description: "The unique ID for the campaign. You can get this from the List Campaigns endpoint or when creating a campaign.",
        },
        is_complete: {
          type: "boolean",
          description: "Whether the feedback item is complete. Set to true to mark as resolved, false otherwise. Defaults to false if not provided.",
        },
      },
      required: [
        "campaign_id",
        "message",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Campaign Feedback.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_campaign_folder",
    description: "Create a new campaign folder to organize email campaigns in Mailchimp. Campaign folders help organize your email marketing campaigns into logical groups. Returns the created folder's ID, name, and initial campaign count (0).",
    toolSlug: "MAILCHIMP_ADD_CAMPAIGN_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name for the new campaign folder. This is used to organize campaigns in the Mailchimp interface.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaignfolders",
    ],
    askBefore: [
      "Confirm the parameters before executing Add campaign folder.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_cart",
    description: "Add a new cart to a store.",
    toolSlug: "MAILCHIMP_ADD_CART",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the cart.",
        },
        lines: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of the cart's line items. Each line item must include: 'id' (unique identifier for the line item), 'product_id' (ID of the product in your store), 'product_variant_id' (ID of the product variant), 'quantity' (number of items), and 'price' (price of the item as a number). Example: [{'id': 'line1', 'product_id': 'prod123', 'product_variant_id': 'var123', 'quantity': 1, 'price': 29.99}]",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Must be an existing store ID in your Mailchimp account.",
        },
        tax_total: {
          type: "number",
          description: "The total tax amount for the cart. Optional field that can be used to track tax separately.",
        },
        campaign_id: {
          type: "string",
          description: "A string that uniquely identifies the campaign for a cart.",
        },
        order_total: {
          type: "number",
          description: "The total price for all items in the cart. This should be the sum of all line item prices multiplied by their quantities.",
        },
        checkout_url: {
          type: "string",
          description: "The URL for the cart. This parameter is required for [Abandoned Cart](https://mailchimp.com/help/create-an-abandoned-cart-email/) automations. ",
        },
        customer__id: {
          type: "string",
          description: "A unique identifier for the customer who owns this cart. Limited to 50 characters. Required field.",
        },
        currency_code: {
          type: "string",
          description: "The three-letter ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP'). Must match the currency configured for the store.",
        },
        customer__company: {
          type: "string",
          description: "The customer's company name.",
        },
        customer__last__name: {
          type: "string",
          description: "The customer's last name.",
        },
        customer__first__name: {
          type: "string",
          description: "The customer's first name.",
        },
        customer__address__city: {
          type: "string",
          description: "The city the customer is located in.",
        },
        customer__email__address: {
          type: "string",
          description: "Required. The customer's email address. Must be a valid, real email address.",
        },
        customer__opt__in__status: {
          type: "boolean",
          description: "Required. The customer's opt-in status. This value will never overwrite the opt-in status of a pre-existing Mailchimp list member, but will apply to list members that are added through the e-commerce API endpoints. Customers who don't opt in to your Mailchimp list will be added as Transactional members.",
        },
        customer__address__country: {
          type: "string",
          description: "The customer's country.",
        },
        customer__address__address1: {
          type: "string",
          description: "The mailing address of the customer.",
        },
        customer__address__address2: {
          type: "string",
          description: "An additional field for the customer's mailing address.",
        },
        customer__address__province: {
          type: "string",
          description: "The customer's state name or normalized province.",
        },
        customer__address__postal__code: {
          type: "string",
          description: "The customer's postal or zip code.",
        },
        customer__address__country__code: {
          type: "string",
          description: "The two-letter ISO country code for the customer's country (e.g., 'US', 'DE').",
        },
        customer__address__province__code: {
          type: "string",
          description: "The two-letter code for the customer's province or state.",
        },
      },
      required: [
        "store_id",
        "id",
        "customer__id",
        "customer__email__address",
        "customer__opt__in__status",
        "currency_code",
        "order_total",
        "lines",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add cart.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_cart_line_item",
    description: "Add a new line item to an existing cart.",
    toolSlug: "MAILCHIMP_ADD_CART_LINE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the cart line item. Must be unique within the cart.",
        },
        price: {
          type: "number",
          description: "The price per unit for the cart line item in the store's currency.",
        },
        cart_id: {
          type: "string",
          description: "The unique identifier for the cart to add the line item to.",
        },
        quantity: {
          type: "integer",
          description: "The quantity of this product variant to add to the cart. Must be a positive integer.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product. The product must already exist in the store.",
        },
        product_variant_id: {
          type: "string",
          description: "The unique identifier for the product variant. The variant must exist for the specified product.",
        },
      },
      required: [
        "store_id",
        "cart_id",
        "id",
        "product_id",
        "product_variant_id",
        "quantity",
        "price",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add cart line item.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_connected_site",
    description: "Create a new Mailchimp connected site. Connected sites allow you to track website visitor activity and integrate with Mailchimp's marketing features. After adding a connected site, you'll receive a tracking script (site_script) that should be installed on your website to enable visitor tracking.",
    toolSlug: "MAILCHIMP_ADD_CONNECTED_SITE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        domain: {
          type: "string",
          description: "The full domain name of the connected site (e.g., 'example.com' or 'shop.mystore.com'). This is the website URL where the Mailchimp tracking script will be installed.",
        },
        foreign_id: {
          type: "string",
          description: "A unique identifier for the connected site that you define. This ID is used to reference the site in subsequent API calls. Example: 'my-website-001' or 'store-12345'.",
        },
      },
      required: [
        "foreign_id",
        "domain",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "connectedsites",
    ],
    askBefore: [
      "Confirm the parameters before executing Add connected site.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_contact_to_audience",
    description: "Tool to create a new omni-channel contact in a Mailchimp audience. Use when adding contacts with email and/or SMS channels to an audience.",
    toolSlug: "MAILCHIMP_ADD_CONTACT_TO_AUDIENCE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of tag names to add to the contact. This operation is append-only; existing tags will be preserved, and only new tags from this array will be added.",
        },
        language: {
          type: "string",
          description: "The subscriber's language preference as a two-letter ISO 639-1 code (e.g., 'en', 'es', 'fr').",
        },
        data_mode: {
          type: "string",
          description: "Data processing mode.",
          enum: [
            "historical",
            "live",
          ],
        },
        audience_id: {
          type: "string",
          description: "The unique ID for the audience. Get this from the Mailchimp account or via the list audiences endpoint.",
        },
        sms_channel: {
          type: "object",
          additionalProperties: true,
          properties: {
            sms_phone: {
              type: "string",
              description: "SMS phone number in E.164 format (e.g., +14045550102 for US numbers).",
            },
            marketing_consent: {
              type: "object",
              additionalProperties: true,
              properties: {
                status: {
                  type: "string",
                  description: "Marketing consent status. Use 'consented' for users who have given consent, 'denied' for those who have not, 'unknown' if consent status is unclear, or 'confirmed' for double opt-in confirmed consent.",
                  enum: [
                    "denied",
                    "unknown",
                    "consented",
                    "confirmed",
                  ],
                },
              },
              description: "A contact's current consent status for SMS marketing communications.",
            },
          },
          description: "SMS channel details for a contact.",
        },
        merge_fields: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of merge fields where the keys are the merge tags (like FNAME, LNAME). Values are strings representing the field values. See the Merge Fields documentation for more about the structure.",
        },
        email_channel: {
          type: "object",
          additionalProperties: true,
          properties: {
            email: {
              type: "string",
              description: "Email address for the contact. Must be a valid email format.",
            },
            marketing_consent: {
              type: "object",
              additionalProperties: true,
              properties: {
                status: {
                  type: "string",
                  description: "Marketing consent status. Use 'consented' for users who have given consent, 'denied' for those who have not, 'unknown' if consent status is unclear, or 'confirmed' for double opt-in confirmed consent.",
                  enum: [
                    "denied",
                    "unknown",
                    "consented",
                    "confirmed",
                  ],
                },
              },
              description: "A contact's current consent status for email marketing communications.",
            },
          },
          description: "Email channel details for a contact.",
        },
        merge_field_validation_mode: {
          type: "string",
          description: "Merge field validation mode.",
          enum: [
            "ignore_required_checks",
            "strict",
          ],
        },
      },
      required: [
        "audience_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Add contact to audience.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_domain_to_account",
    description: "Add a sending domain to the Mailchimp account for email verification. This action adds a new domain to your Mailchimp account and initiates the verification process by sending a verification code to the specified email address. After calling this action, use the 'verify_domain' action with the received verification code to complete the domain verification process.",
    toolSlug: "MAILCHIMP_ADD_DOMAIN_TO_ACCOUNT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        verification_email: {
          type: "string",
          description: "The email address at the domain you want to verify (e.g., 'admin@yourdomain.com'). A verification code will be sent to this email address to confirm domain ownership. You must have access to this email inbox to complete the verification process.",
        },
      },
      required: [
        "verification_email",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "verifieddomains",
    ],
    askBefore: [
      "Confirm the parameters before executing Add domain to account.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_event",
    description: "Add an event for a list member. Use this action to track contact activity and behavior outside of email campaigns. Events can be used for segmentation and triggering automation workflows. Common use cases: - Track purchases, signups, or page visits - Record custom milestones or achievements - Import historical events with is_syncing=true to avoid triggering automations Note: Returns 204 No Content on success (empty response body).",
    toolSlug: "MAILCHIMP_ADD_EVENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name for this type of event (e.g., 'purchased', 'visited', 'signup_completed'). Must be 2-30 characters in length. Use lowercase letters, numbers, and underscores only.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list/audience.",
        },
        is_syncing: {
          type: "boolean",
          description: "Set to true to prevent this event from triggering automations. Useful when bulk-importing historical events.",
        },
        properties: {
          type: "object",
          additionalProperties: true,
          description: "Optional key-value pairs of custom properties for the event. Example: {'product_name': 'T-Shirt', 'price': '29.99'}. Property names must be 2-30 characters.",
        },
        occurred_at: {
          type: "string",
          description: "The date and time the event occurred in ISO 8601 format (e.g., '2024-01-15T10:30:00Z'). Defaults to current time if not specified.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add event.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_export",
    description: "Create a new account export in your Mailchimp account. This action initiates an export of your Mailchimp account data as a downloadable ZIP file. The export runs in the background and may take from a few minutes to several hours depending on account size. Use the 'get_account_export_info' action with the returned export_id to check progress and retrieve the download URL. Important limitations: - Only one export can run at a time per account - Only one export can be created per 24-hour period - Completed exports are available for download for 90 days",
    toolSlug: "MAILCHIMP_ADD_EXPORT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        include_stages: {
          type: "array",
          items: {
            type: "string",
            description: "Types of data that can be included in the account export.",
            enum: [
              "audiences",
              "campaigns",
              "events",
              "gallery_files",
              "reports",
              "templates",
            ],
          },
          description: "The types of data to include in the export. At least one stage is required. Available stages: 'audiences' (contact lists and segments), 'campaigns' (email campaign content), 'events' (contact activity events), 'gallery_files' (uploaded images and files), 'reports' (campaign performance reports), 'templates' (email template designs). Example: ['audiences', 'campaigns'] to export both audiences and campaigns.",
        },
        since_timestamp: {
          type: "string",
          description: "Optional ISO 8601 timestamp to limit the export to data created after this time. Format: YYYY-MM-DDTHH:MM:SS+00:00 (e.g., '2024-01-15T00:00:00+00:00'). Note: This limit does NOT apply to audiences - all audience data is always included. Useful for incremental exports when you only need recent campaign reports or events.",
        },
      },
      required: [
        "include_stages",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "accountexports",
    ],
    askBefore: [
      "Confirm the parameters before executing Add export.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_file",
    description: "Upload a new image or file to the Mailchimp File Manager. Use this action to upload files (images, documents, etc.) that can be used in campaigns, templates, or signup forms. The file must be base64-encoded and under 10MB. Supported image types: jpg, jpeg, gif, png, svg. Supported document types: pdf, txt, csv, and more. The uploaded file will be available at the returned full_size_url for use in your content.",
    toolSlug: "MAILCHIMP_ADD_FILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the file including extension (e.g., 'image.png', 'document.pdf'). This will be the display name in the File Manager.",
        },
        file_data: {
          type: "string",
          description: "The base64-encoded contents of the file to upload. The file must be a supported type (images: jpg, jpeg, gif, png, svg; documents: pdf, txt, csv, etc.) and under 10MB.",
        },
        folder_id: {
          type: "integer",
          description: "The ID of the folder to upload the file to. If not provided, the file will be uploaded to the root folder.",
        },
      },
      required: [
        "name",
        "file_data",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "filemanager",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload File to File Manager.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_folder",
    description: "Create a new folder in the File Manager to organize uploaded files. Use this action to create organizational folders in the Mailchimp File Manager. Folders help organize images and other files that can be used in campaigns and templates.",
    toolSlug: "MAILCHIMP_ADD_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the folder to create in the File Manager. Must be unique within the account.",
        },
        created_at: {
          type: "string",
          description: "The date and time the folder was created in ISO 8601 format.",
        },
        created_by: {
          type: "string",
          description: "The username of the profile that created the folder.",
        },
        file_count: {
          type: "integer",
          description: "The number of files in the folder.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "filemanager",
    ],
    askBefore: [
      "Confirm the parameters before executing Add folder.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_interest_category",
    description: "Create a new interest category.",
    toolSlug: "MAILCHIMP_ADD_INTEREST_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Determines how this category's interests appear on signup forms. Options: 'checkboxes' (multiple selection), 'dropdown' (single selection from dropdown), 'radio' (single selection from radio buttons), 'hidden' (not visible on forms).",
          enum: [
            "checkboxes",
            "dropdown",
            "radio",
            "hidden",
          ],
        },
        title: {
          type: "string",
          description: "The text description of this category. This field appears on signup forms and is often phrased as a question (e.g., 'What topics interest you?').",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list/audience to add the interest category to.",
        },
        display_order: {
          type: "integer",
          description: "The order that the categories are displayed in the list. Lower numbers display first. Defaults to 0 if not specified.",
        },
      },
      required: [
        "list_id",
        "title",
        "type",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add interest category.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_interest_in_category",
    description: "Create a new interest or 'group name' for a specific category.",
    toolSlug: "MAILCHIMP_ADD_INTEREST_IN_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the interest (group name). This is shown publicly on subscription forms and used to group subscribers by their preferences.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list/audience (e.g., 'abc123def4').",
        },
        display_order: {
          type: "integer",
          description: "The display order for this interest within the category. Lower numbers display first. If not specified, the interest is added at the end.",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category (group) where the interest will be added (e.g., 'xyz789ghi0').",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add interest in category.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_landing_page",
    description: "Create a new Mailchimp landing page. Creates an unpublished landing page that can be customized and published later. Requires either a list_id or use_default_list=true. The landing page type can be 'signup' (for email list signups) or 'product' (for product promotions, requires store_id).",
    toolSlug: "MAILCHIMP_ADD_LANDING_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The internal name of this landing page (for your reference, not visible to visitors).",
        },
        type: {
          type: "string",
          description: "The type of landing page template: 'signup' for email list signups, or 'product' for product promotions.",
          enum: [
            "signup",
            "product",
          ],
        },
        title: {
          type: "string",
          description: "The title of this landing page displayed in the browser's title bar.",
        },
        list_id: {
          type: "string",
          description: "The audience/list ID to associate with this landing page. Either list_id or use_default_list=true must be provided.",
        },
        store_id: {
          type: "string",
          description: "The ID of the e-commerce store to associate with this landing page. Required for 'product' type pages.",
        },
        description: {
          type: "string",
          description: "A brief description of this landing page for internal reference.",
        },
        template_id: {
          type: "integer",
          description: "The specific template ID to use for this landing page. If not provided, a default template is used.",
        },
        use_default_list: {
          type: "boolean",
          description: "If true, creates the landing page using the account's default list instead of requiring a list_id. Either list_id or use_default_list=true must be provided.",
        },
        tracking__track__with__mailchimp: {
          type: "boolean",
          description: "Enable Mailchimp cookie tracking to monitor unique visitors and calculate conversion rates.",
        },
        tracking__enable__restricted__data__processing: {
          type: "boolean",
          description: "Enable Google's restricted data processing for CCPA compliance, limiting how Google uses certain identifiers and data in its services.",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "landingpages",
    ],
    askBefore: [
      "Confirm the parameters before executing Add landing page.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_list",
    description: "Create a new audience (list) in your Mailchimp account. This endpoint creates a new audience/list for managing email contacts. Each audience has unique settings for campaigns, permissions, and contact information. Note: Free Mailchimp accounts are limited to 1 audience. Paid plans allow multiple audiences. Required fields include: name, contact information (company, address1, city, country), permission_reminder, and campaign defaults (from_name, from_email, subject, language).",
    toolSlug: "MAILCHIMP_ADD_LIST",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the audience/list. Must be unique within your Mailchimp account.",
        },
        contact__zip: {
          type: "string",
          description: "The postal or zip code for the list contact (optional).",
        },
        double_optin: {
          type: "boolean",
          description: "Whether to require double opt-in (subscriber must confirm via email). Recommended for GDPR compliance. Defaults to false.",
        },
        contact__city: {
          type: "string",
          description: "The city for the list contact. Required.",
        },
        contact__phone: {
          type: "string",
          description: "The phone number for the list contact. Optional.",
        },
        contact__state: {
          type: "string",
          description: "The state or province for the list contact (optional).",
        },
        use_archive_bar: {
          type: "boolean",
          description: "Whether campaigns for this list use the Archive Bar in archives by default. Defaults to false.",
        },
        contact__company: {
          type: "string",
          description: "The company name for the list. Required.",
        },
        contact__country: {
          type: "string",
          description: "A two-character ISO3166 country code (e.g., 'US', 'GB', 'CA'). Required.",
        },
        contact__address1: {
          type: "string",
          description: "The street address for the list contact. Required.",
        },
        contact__address2: {
          type: "string",
          description: "The secondary street address for the list contact (optional).",
        },
        email_type_option: {
          type: "boolean",
          description: "Whether subscribers can choose their email format (HTML vs plain-text). When true, subscribers choose their format. When false, all receive HTML with plain-text backup.",
        },
        notify_on_subscribe: {
          type: "string",
          description: "Email address to send subscribe notifications to. Provide a valid email address or omit to disable notifications.",
        },
        permission_reminder: {
          type: "string",
          description: "The permission reminder explaining why contacts are receiving emails from this list. Example: 'You are receiving this email because you opted in via our website.'",
        },
        marketing_permissions: {
          type: "boolean",
          description: "Whether to enable GDPR-friendly marketing permissions. Defaults to false.",
        },
        notify_on_unsubscribe: {
          type: "string",
          description: "Email address to send unsubscribe notifications to. Provide a valid email address or omit to disable notifications.",
        },
        campaign__defaults__subject: {
          type: "string",
          description: "The default subject line for campaigns sent to this list. Required.",
        },
        campaign__defaults__language: {
          type: "string",
          description: "The default language for this list's forms (e.g., 'en' for English). Required.",
        },
        campaign__defaults__from__name: {
          type: "string",
          description: "The default 'From' name for campaigns sent to this list. Required.",
        },
        campaign__defaults__from__email: {
          type: "string",
          description: "The default 'From' email address for campaigns sent to this list. Required.",
        },
      },
      required: [
        "name",
        "contact__company",
        "contact__address1",
        "contact__city",
        "contact__country",
        "permission_reminder",
        "campaign__defaults__from__name",
        "campaign__defaults__from__email",
        "campaign__defaults__subject",
        "campaign__defaults__language",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add list.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_member_note",
    description: "Add a new note for a specific subscriber in a Mailchimp list (audience). Notes are useful for keeping internal records about contacts, such as conversation history, preferences, or other relevant information.",
    toolSlug: "MAILCHIMP_ADD_MEMBER_NOTE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        note: {
          type: "string",
          description: "The content of the note to add to the member. Note length is limited to 1,000 characters.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience).",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. Alternatively, you can provide the member's email address or contact_id directly.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
        "note",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add member note.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_member_to_segment",
    description: "Add an existing list member to a static segment (tag) in Mailchimp. This action adds a subscriber who is already a member of the specified list to a static segment. Static segments are also referred to as tags in Mailchimp's UI. Important notes: - The subscriber must already exist in the list before they can be added to a segment. - This only works with static segments, not saved segments that use conditions. - To add a member to a list first, use the Add Member To List action.",
    toolSlug: "MAILCHIMP_ADD_MEMBER_TO_SEGMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list. This can be found in the Audience settings or retrieved using the Get Lists Info action.",
        },
        segment_id: {
          type: "string",
          description: "The unique ID of the static segment (also known as a tag) within the list. This must be a static segment, not a saved segment with conditions. The segment ID can be retrieved using the List Segments action.",
        },
        email_address: {
          type: "string",
          description: "The email address of the subscriber to add to the segment. The subscriber must already exist in the list; this action does not create new list members.",
        },
      },
      required: [
        "list_id",
        "segment_id",
        "email_address",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add member to segment.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_merge_field",
    description: "Add a new merge field for a specific audience.",
    toolSlug: "MAILCHIMP_ADD_MERGE_FIELD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tag: {
          type: "string",
          description: "The merge tag used in campaigns (e.g., 'FNAME', 'COMPANY'). Must be 1-10 uppercase letters/numbers. If not provided, Mailchimp auto-generates one from the name.",
        },
        name: {
          type: "string",
          description: "The display name of the merge field shown to users (e.g., 'First Name', 'Company').",
        },
        type: {
          type: "string",
          description: "The field type. Use 'text' for general text, 'number' for numeric values, 'address' for full addresses, 'phone' for phone numbers, 'date' for dates, 'url' for web links, 'imageurl' for image URLs, 'radio' or 'dropdown' for single-choice fields (requires options_choices), 'birthday' for birthdays, 'zip' for postal codes.",
          enum: [
            "text",
            "number",
            "address",
            "phone",
            "date",
            "url",
            "imageurl",
            "radio",
            "dropdown",
            "birthday",
            "zip",
          ],
        },
        public: {
          type: "boolean",
          description: "Whether this field is visible on signup forms. Defaults to true.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the audience/list. Get this from the List Audiences endpoint or your Mailchimp dashboard.",
        },
        required: {
          type: "boolean",
          description: "Whether this field is required when importing or adding contacts. Defaults to false.",
        },
        help_text: {
          type: "string",
          description: "Help text displayed below the field on signup forms to guide users.",
        },
        default_value: {
          type: "string",
          description: "The default value to use when the field is empty or null.",
        },
        display_order: {
          type: "integer",
          description: "The display order of this field on signup forms. Lower numbers appear first.",
        },
        options__size: {
          type: "integer",
          description: "For 'text' type fields: the default display width of the text field (in characters).",
        },
        options__choices: {
          type: "array",
          items: {
            type: "string",
          },
          description: "For 'radio' or 'dropdown' type fields: list of choices for users to select from (e.g., ['Option 1', 'Option 2', 'Option 3']).",
        },
        options__date__format: {
          type: "string",
          description: "For 'date' or 'birthday' type fields: the date format (e.g., 'MM/DD/YYYY', 'DD/MM/YYYY').",
        },
        options__phone__format: {
          type: "string",
          description: "For 'phone' type fields: the format - 'US' for US format or 'International' for international format.",
        },
        options__default__country: {
          type: "integer",
          description: "For 'address' type fields: the default country code (ISO 3166-1 numeric, e.g., 840 for USA).",
        },
      },
      required: [
        "list_id",
        "name",
        "type",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add merge field.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_or_remove_member_tags",
    description: "Add or remove tags from a list member. Tags help organize and segment your audience. Use 'status': 'active' to add a tag, or 'status': 'inactive' to remove it. If a tag doesn't exist and status is 'active', a new tag will be created. Note: Only explicitly referenced tags are updated. Sending this request does not affect tags not mentioned in the request. This endpoint returns 204 No Content on success.",
    toolSlug: "MAILCHIMP_ADD_OR_REMOVE_MEMBER_TAGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tags: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "A list of tag objects to add or remove from the member. Each tag object must have: 'name' (string) - the tag name, and 'status' (string) - either 'active' to add the tag or 'inactive' to remove it. Example: [{'name': 'VIP', 'status': 'active'}]. If a tag doesn't exist and status is 'active', a new tag will be created.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience). You can get this from the Lists/Audiences endpoint.",
        },
        is_syncing: {
          type: "boolean",
          description: "When is_syncing is true, automations based on the tags in the request will not fire. Useful for bulk imports where you don't want to trigger automations.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address, or the member's email address itself, or the contact_id.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
        "tags",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add or remove member tags.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_add_or_update_customer",
    description: "Add or update a customer in a Mailchimp e-commerce store. This endpoint uses PUT semantics - if the customer exists, it will be updated; if not, a new customer will be created. The customer_id in the path and the id in the request body should match. Customers are linked to Mailchimp list members by email address.",
    toolSlug: "MAILCHIMP_ADD_OR_UPDATE_CUSTOMER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the customer. Limited to 50 characters. This should match the customer_id path parameter.",
        },
        company: {
          type: "string",
          description: "The customer's company name.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store in Mailchimp.",
        },
        last_name: {
          type: "string",
          description: "The customer's last name.",
        },
        first_name: {
          type: "string",
          description: "The customer's first name.",
        },
        customer_id: {
          type: "string",
          description: "The unique identifier for the customer within the store. This is used in the URL path and should match the 'id' field in the request body.",
        },
        address__city: {
          type: "string",
          description: "The city where the customer is located.",
        },
        email_address: {
          type: "string",
          description: "The customer's email address. Must be a valid email format.",
        },
        opt_in_status: {
          type: "boolean",
          description: "The customer's opt-in status for marketing emails. Set to true to subscribe the customer to marketing, false for transactional-only. This value will never overwrite the opt-in status of a pre-existing Mailchimp list member.",
        },
        address__country: {
          type: "string",
          description: "The customer's country name.",
        },
        address__address1: {
          type: "string",
          description: "The primary street address of the customer.",
        },
        address__address2: {
          type: "string",
          description: "Additional address information (apartment, suite, etc.).",
        },
        address__province: {
          type: "string",
          description: "The customer's state or province name.",
        },
        address__postal__code: {
          type: "string",
          description: "The customer's postal or ZIP code.",
        },
        address__country__code: {
          type: "string",
          description: "The two-letter ISO country code (e.g., 'US', 'CA', 'GB').",
        },
        address__province__code: {
          type: "string",
          description: "The two-letter code for the customer's state or province (e.g., 'CA', 'NY').",
        },
      },
      required: [
        "store_id",
        "customer_id",
        "id",
        "email_address",
        "opt_in_status",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add or update customer.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_add_or_update_list_member",
    description: "Add or update a list member (subscriber) in a Mailchimp audience/list. This is an upsert operation: if the subscriber exists, they will be updated; if not, they will be created. The subscriber_hash parameter should be the MD5 hash of the lowercase email address. Note: If the list has required merge fields, use skip_merge_validation=true to bypass validation, or provide the required merge_fields values.",
    toolSlug: "MAILCHIMP_ADD_OR_UPDATE_LIST_MEMBER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        vip: {
          type: "boolean",
          description: "[VIP status](https://mailchimp.com/help/designate-and-send-to-vip-contacts/) for subscriber. ",
        },
        ip_opt: {
          type: "string",
          description: "The IP address the subscriber used to confirm their opt-in status.",
        },
        status: {
          type: "string",
          description: "Subscriber's current status. Values: 'subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional'.",
          enum: [
            "subscribed",
            "unsubscribed",
            "cleaned",
            "pending",
            "transactional",
          ],
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        language: {
          type: "string",
          description: "The subscriber's language preference as a two-letter ISO 639-1 code (e.g., 'en', 'es', 'fr').",
        },
        interests: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of interest IDs as keys and boolean values indicating subscription to that interest. Get available interests from the list's interest-categories endpoint.",
        },
        ip_signup: {
          type: "string",
          description: "IP address the subscriber signed up from.",
        },
        email_type: {
          type: "string",
          description: "Type of email this member asked to get (\"html\" or \"text\").",
        },
        merge_fields: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of merge fields where the keys are the merge tags. See the [Merge Fields documentation](https://mailchimp.com/developer/marketing/docs/merge-fields/#structure) for more about the structure. ",
        },
        email_address: {
          type: "string",
          description: "Email address for a subscriber. This value is required only if the email address is not already present on the list. ",
        },
        status_if_new: {
          type: "string",
          description: "Subscriber's status when creating a new member. Required if email is not already on list. Values: 'subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional'.",
          enum: [
            "subscribed",
            "unsubscribed",
            "cleaned",
            "pending",
            "transactional",
          ],
        },
        timestamp_opt: {
          type: "string",
          description: "The date and time the subscriber confirmed their opt-in status in ISO 8601 format. ",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id. Example: for 'user@example.com', use MD5('user@example.com') = 'b58996c504c5638798eb6b511e6f49af'.",
        },
        timestamp_signup: {
          type: "string",
          description: "The date and time the subscriber signed up for the list in ISO 8601 format. ",
        },
        location__latitude: {
          type: "number",
          description: "The location latitude (e.g., 37.7749 for San Francisco).",
        },
        location__longitude: {
          type: "number",
          description: "The location longitude (e.g., -122.4194 for San Francisco).",
        },
        marketing_permissions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "The marketing permissions for the subscriber.",
        },
        skip_merge_validation: {
          type: "boolean",
          description: "If skip_merge_validation is true, member data will be accepted without merge field values, even if the merge field is usually required. This defaults to false. ",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
        "email_address",
        "status_if_new",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add or update list member.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_add_or_update_product_variant",
    description: "Add a new product variant or update an existing one in a Mailchimp e-commerce store. This endpoint uses PUT for an upsert operation - if the variant exists, it will be updated; if not, a new variant will be created. The variant_id in the URL path and the id in the request body should match. Product variants require inventory_quantity > 0 for product recommendations to work properly.",
    toolSlug: "MAILCHIMP_ADD_OR_UPDATE_PRODUCT_VARIANT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the product variant in the request body. Should match variant_id.",
        },
        sku: {
          type: "string",
          description: "The stock keeping unit (SKU) of the product variant for inventory tracking.",
        },
        url: {
          type: "string",
          description: "The URL where the product variant can be purchased.",
        },
        price: {
          type: "number",
          description: "The price of the product variant in the store's currency.",
        },
        title: {
          type: "string",
          description: "The title of the product variant (e.g., 'Small', 'Red', 'Size 10').",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store.",
        },
        image_url: {
          type: "string",
          description: "The URL of the product variant's image.",
        },
        backorders: {
          type: "string",
          description: "The backorder status of the product variant.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product within the store.",
        },
        variant_id: {
          type: "string",
          description: "The unique identifier for the product variant. Used in the URL path.",
        },
        visibility: {
          type: "string",
          description: "The visibility setting of the product variant (e.g., 'visible', 'hidden').",
        },
        inventory_quantity: {
          type: "integer",
          description: "The available inventory quantity. Must be > 0 for product recommendations to work.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "variant_id",
        "title",
        "id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add or update product variant.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_add_order_line_item",
    description: "Add a new line item to an existing order in a Mailchimp e-commerce store. Prerequisites: The store, order, product, and product variant must already exist. Use MAILCHIMP_ADD_STORE, MAILCHIMP_ADD_ORDER, and MAILCHIMP_ADD_PRODUCT to create them first if needed.",
    toolSlug: "MAILCHIMP_ADD_ORDER_LINE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for this order line item. Must be unique within the order (e.g., 'line_001', 'item_123').",
        },
        price: {
          type: "number",
          description: "The unit price of the line item in the store's currency (e.g., 29.99, 100.00).",
        },
        discount: {
          type: "number",
          description: "Optional discount amount applied to this line item in the store's currency (e.g., 5.00 for a $5 discount).",
        },
        order_id: {
          type: "string",
          description: "The unique identifier for an existing order in the store. Use MAILCHIMP_LIST_ORDERS to find available order IDs.",
        },
        quantity: {
          type: "integer",
          description: "The quantity of items to add. Must be a positive integer (e.g., 1, 2, 5).",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use MAILCHIMP_LIST_STORES to find available store IDs.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier of the product to add to the order. The product must already exist in the store. Use MAILCHIMP_LIST_PRODUCT to find available product IDs.",
        },
        product_variant_id: {
          type: "string",
          description: "The unique identifier of the specific product variant to add. Each product has at least one variant. Use MAILCHIMP_LIST_PRODUCT_VARIANTS to find available variant IDs.",
        },
      },
      required: [
        "store_id",
        "order_id",
        "id",
        "product_id",
        "product_variant_id",
        "quantity",
        "price",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add order line item.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_product",
    description: "Add a new product to a Mailchimp e-commerce store. Products are e-commerce items that can be added to carts and orders. Each product requires at least one variant. Products must be created before they can be included in carts or orders. For product recommendations to work properly, ensure products have a valid image_url and variants have inventory_quantity > 0.",
    toolSlug: "MAILCHIMP_ADD_PRODUCT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the product within the store. This ID is used to reference the product in carts and orders.",
        },
        url: {
          type: "string",
          description: "The URL where customers can view or purchase the product.",
        },
        type: {
          type: "string",
          description: "The type or category of the product (e.g., 'Clothing', 'Electronics').",
        },
        title: {
          type: "string",
          description: "The display title of the product shown to customers.",
        },
        handle: {
          type: "string",
          description: "The handle or slug for the product, typically used in URLs.",
        },
        images: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of additional product images. Each image object should include 'id' (unique identifier) and 'url' (image URL).",
        },
        vendor: {
          type: "string",
          description: "The vendor or brand name for the product. Required for segmenting campaigns by 'Category Purchased'.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the Mailchimp e-commerce store where the product will be added.",
        },
        variants: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of product variants. At least one variant is required. Each variant object should include: 'id' (required, unique variant identifier), 'title' (required, variant name), 'price' (optional, decimal price), 'inventory_quantity' (optional, must be > 0 for recommendations). A variant can use the same 'id' and 'title' as the parent product for single-variant products.",
        },
        image_url: {
          type: "string",
          description: "The URL of the product's main image. Required for product recommendations to display properly.",
        },
        description: {
          type: "string",
          description: "A text description of the product that provides details to customers.",
        },
        published_at_foreign: {
          type: "string",
          description: "The date and time the product was published in ISO 8601 format (e.g., '2024-01-15T10:30:00Z').",
        },
      },
      required: [
        "store_id",
        "id",
        "title",
        "variants",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add product.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_product_image",
    description: "Add a new image to a product in a Mailchimp e-commerce store. The image must be hosted at a publicly accessible URL. You can optionally associate the image with specific product variants.",
    toolSlug: "MAILCHIMP_ADD_PRODUCT_IMAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the product image. This should be a unique string that identifies this specific image.",
        },
        url: {
          type: "string",
          description: "The URL for the product image. Must be a valid, publicly accessible URL pointing to an image file (e.g., https://example.com/images/product.jpg).",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. This is the store ID you created when adding the store to Mailchimp.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product within the store. This is the product ID you specified when creating the product.",
        },
        variant_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of product variant IDs that use this image. If specified, associates the image with specific product variants.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "id",
        "url",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add product image.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_promo_code",
    description: "Add a new promo code to an e-commerce store under an existing promo rule. A promo code contains the actual discount code that customers can apply at checkout, along with a redemption URL. You must first create a promo rule (which defines the discount type, amount, and target) before you can add promo codes to it.",
    toolSlug: "MAILCHIMP_ADD_PROMO_CODE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the promo code. Restricted to UTF-8 characters with max length 50. ",
        },
        code: {
          type: "string",
          description: "The discount code. Restricted to UTF-8 characters with max length 50.",
        },
        enabled: {
          type: "boolean",
          description: "Whether the promo code is currently enabled.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the Mailchimp e-commerce store.",
        },
        usage_count: {
          type: "integer",
          description: "Number of times promo code has been used.",
        },
        promo_rule_id: {
          type: "string",
          description: "The unique identifier for the promo rule. A promo code must be associated with an existing promo rule.",
        },
        redemption_url: {
          type: "string",
          description: "The url that should be used in the promotion campaign restricted to UTF-8 characters with max length 2000. ",
        },
        created_at_foreign: {
          type: "string",
          description: "The date and time the promotion was created in ISO 8601 format.",
        },
        updated_at_foreign: {
          type: "string",
          description: "The date and time the promotion was updated in ISO 8601 format.",
        },
      },
      required: [
        "store_id",
        "promo_rule_id",
        "id",
        "code",
        "redemption_url",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add promo code.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_promo_rule",
    description: "Add a new promo rule to a store. Promo rules define the parameters for promotional discounts such as percentage off, fixed amount off, or free shipping. After creating a promo rule, you can create promo codes under it using the Add Promo Code endpoint.",
    toolSlug: "MAILCHIMP_ADD_PROMO_RULE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the promo rule. If your e-commerce platform does not support promo rules, use the promo code id as the promo rule id. Restricted to UTF-8 characters with max length of 50 characters.",
        },
        type: {
          type: "string",
          description: "The type of discount: 'fixed' for a fixed monetary amount off, or 'percentage' for a percentage discount. For free shipping promotions, use 'fixed' type with target 'shipping'.",
          enum: [
            "fixed",
            "percentage",
          ],
        },
        title: {
          type: "string",
          description: "The title that will show up in promotion campaign. Restricted to UTF-8 characters with max length of 100 bytes.",
        },
        amount: {
          type: "number",
          description: "The discount amount. For 'fixed' type, this is the monetary value (e.g., 10.00 for $10 off). For 'percentage' type, this must be a decimal between 0.0 and 1.0 (e.g., 0.15 for 15% off).",
        },
        target: {
          type: "string",
          description: "What the discount applies to: 'per_item' applies discount to each item, 'total' applies to the order total, 'shipping' applies to shipping costs (use with type 'fixed' for free shipping).",
          enum: [
            "per_item",
            "total",
            "shipping",
          ],
        },
        enabled: {
          type: "boolean",
          description: "Whether the promo rule is currently enabled. Defaults to true if not specified.",
        },
        ends_at: {
          type: "string",
          description: "The date and time when the promotion ends, in ISO 8601 format (e.g., '2024-12-31T23:59:59Z'). Must be after starts_at if both are specified.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use MAILCHIMP_LIST_STORES to get available store IDs.",
        },
        starts_at: {
          type: "string",
          description: "The date and time when the promotion becomes active, in ISO 8601 format (e.g., '2024-01-15T00:00:00Z').",
        },
        description: {
          type: "string",
          description: "The description of the promotion. Restricted to UTF-8 characters with max length of 255 characters.",
        },
        created_at_foreign: {
          type: "string",
          description: "The date and time the promotion was created in your e-commerce platform, in ISO 8601 format.",
        },
        updated_at_foreign: {
          type: "string",
          description: "The date and time the promotion was last updated in your e-commerce platform, in ISO 8601 format.",
        },
      },
      required: [
        "store_id",
        "description",
        "id",
        "amount",
        "type",
        "target",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add promo rule.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_segment",
    description: "Create a new segment in a specific Mailchimp list/audience. Segments can be either static (based on a list of specific email addresses) or saved (based on matching conditions). For static segments, provide static_segment with email addresses. For saved segments, provide options_match and options_conditions to define the segment criteria. Note: static_segment and options fields are mutually exclusive - use one or the other.",
    toolSlug: "MAILCHIMP_ADD_SEGMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the segment. Must be unique within the list.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list/audience where the segment will be created. You can get list IDs using the 'Get lists info' action.",
        },
        options__match: {
          type: "string",
          description: "Match type for segment conditions. Use 'any' to match contacts that meet ANY condition (OR logic), or 'all' to match contacts that meet ALL conditions (AND logic). Required when using options_conditions.",
          enum: [
            "any",
            "all",
          ],
        },
        static_segment: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of email addresses of existing list members to include in a static segment. Pass an empty array [] to create an empty static segment. Cannot be used together with options__match/options__conditions (use one or the other).",
        },
        options__conditions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Array of condition objects for dynamic segments. Each condition should have: 'condition_type' (e.g., 'EmailAddress', 'Merge'), 'field' (e.g., 'EMAIL'), 'op' (e.g., 'contains', 'is'), and 'value'. Example: [{\"condition_type\": \"EmailAddress\", \"field\": \"EMAIL\", \"op\": \"contains\", \"value\": \"@gmail.com\"}]. Cannot be used with static_segment.",
        },
      },
      required: [
        "list_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add segment.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_store",
    description: "Add a new store to your Mailchimp account.",
    toolSlug: "MAILCHIMP_ADD_STORE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique client-defined identifier for the store (e.g., 'my-store-001'). Once created, this cannot be changed.",
        },
        name: {
          type: "string",
          description: "The name of the store.",
        },
        phone: {
          type: "string",
          description: "The store phone number.",
        },
        domain: {
          type: "string",
          description: "The store domain. This parameter is required for Connected Sites and Google Ads. ",
        },
        list_id: {
          type: "string",
          description: "The unique identifier for the list associated with the store. The `list_id` for a specific store cannot change. ",
        },
        platform: {
          type: "string",
          description: "The e-commerce platform of the store.",
        },
        timezone: {
          type: "string",
          description: "The timezone for the store in IANA format (e.g., 'America/New_York', 'Europe/London').",
        },
        is_syncing: {
          type: "boolean",
          description: "Whether to disable automations because the store is currently [syncing](https://mailchimp.com/developer/marketing/docs/e-commerce/#pausing-store-automations). ",
        },
        money_format: {
          type: "string",
          description: "The currency format for the store. For example: `$`, `£`, etc.",
        },
        address__city: {
          type: "string",
          description: "The city the store is located in.",
        },
        currency_code: {
          type: "string",
          description: "The three-letter ISO 4217 currency code for the store (e.g., 'USD', 'EUR', 'GBP', 'CAD').",
        },
        email_address: {
          type: "string",
          description: "The email address for the store.",
        },
        primary_locale: {
          type: "string",
          description: "The primary locale for the store. For example: `en`, `de`, etc.",
        },
        address__country: {
          type: "string",
          description: "The store's country name (e.g., 'United States', 'Canada').",
        },
        address__address1: {
          type: "string",
          description: "The store's mailing address (street address line 1).",
        },
        address__address2: {
          type: "string",
          description: "An additional field for the store's mailing address (street address line 2).",
        },
        address__latitude: {
          type: "number",
          description: "The latitude of the store location (decimal degrees, e.g., 37.7749).",
        },
        address__province: {
          type: "string",
          description: "The store's state name or normalized province (e.g., 'California', 'Ontario').",
        },
        address__longitude: {
          type: "number",
          description: "The longitude of the store location (decimal degrees, e.g., -122.4194).",
        },
        address__postal__code: {
          type: "string",
          description: "The store's postal or zip code (e.g., '94102', 'M5V 3L9').",
        },
        address__country__code: {
          type: "string",
          description: "The two-letter ISO 3166-1 alpha-2 country code for the store (e.g., 'US', 'CA').",
        },
        address__province__code: {
          type: "string",
          description: "The two-letter code for the store's province or state (e.g., 'CA', 'ON').",
        },
      },
      required: [
        "id",
        "list_id",
        "name",
        "currency_code",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Add store.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_subscriber_to_workflow_email",
    description: "Manually add a subscriber to a classic automation workflow email queue, bypassing the default trigger settings. This action allows you to: - Add a list member to a specific automation email's queue - Trigger a series of automated emails in an API 3.0 workflow type - Bypass the normal trigger conditions for an automation Note: The subscriber must be a member of the list associated with the automation workflow. Returns HTTP 204 No Content on success.",
    toolSlug: "MAILCHIMP_ADD_SUBSCRIBER_TO_WORKFLOW_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique ID of the Automation workflow. Obtain this from the list_automations action.",
        },
        email_address: {
          type: "string",
          description: "The email address of the subscriber to add to the workflow. The subscriber must be a member of the list associated with the automation.",
        },
        workflow_email_id: {
          type: "string",
          description: "The unique ID of the Automation workflow email. Obtain this from the list_automated_emails action using the workflow_id.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
        "email_address",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "Confirm the parameters before executing Add subscriber to workflow email.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_template",
    description: "Create a new email template in the Mailchimp account. Templates can be used to create consistent email campaigns. Only Classic (HTML) templates are supported through this API endpoint. The template HTML can include Mailchimp merge tags (e.g., *|FNAME|*) for personalization.",
    toolSlug: "MAILCHIMP_ADD_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        html: {
          type: "string",
          description: "The raw HTML content for the template. Supports Mailchimp Template Language for dynamic content. Must be valid HTML. Example: '<html><body><h1>Hello *|FNAME|*</h1></body></html>'",
        },
        name: {
          type: "string",
          description: "The name of the template. Must be unique within the account.",
        },
        folder_id: {
          type: "string",
          description: "The ID of the folder to store the template in. If not provided, the template will not be assigned to any folder.",
        },
      },
      required: [
        "name",
        "html",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Add template.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_template_folder",
    description: "Create a new template folder in Mailchimp. Template folders help organize your email templates. Use this action to create a new folder, then add templates to it using the folder's ID.",
    toolSlug: "MAILCHIMP_ADD_TEMPLATE_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the template folder. This will be used to organize your templates within Mailchimp.",
        },
      },
      required: [
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "templatefolders",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Template Folder.",
    ],
  }),
  composioTool({
    name: "mailchimp_add_webhook",
    description: "Create a new webhook for a specific Mailchimp audience/list. Creates a webhook that will receive POST notifications when specified events occur. The webhook URL must be accessible and return HTTP 200 to validation requests. Requires a Standard or Premium Mailchimp plan for webhook functionality.",
    toolSlug: "MAILCHIMP_ADD_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "A valid URL endpoint that will receive webhook POST requests. Must return HTTP 200 to HEAD or POST requests.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list to add the webhook to.",
        },
        sources__api: {
          type: "boolean",
          description: "Whether the webhook is triggered by actions initiated via the API.",
        },
        sources__user: {
          type: "boolean",
          description: "Whether the webhook is triggered by subscriber-initiated actions.",
        },
        sources__admin: {
          type: "boolean",
          description: "Whether the webhook is triggered by admin-initiated actions in the web interface.",
        },
        events__cleaned: {
          type: "boolean",
          description: "Whether the webhook is triggered when a subscriber's email address is cleaned from the list.",
        },
        events__profile: {
          type: "boolean",
          description: "Whether the webhook is triggered when a subscriber's profile is updated.",
        },
        events__upemail: {
          type: "boolean",
          description: "Whether the webhook is triggered when a subscriber's email address is changed.",
        },
        events__campaign: {
          type: "boolean",
          description: "Whether the webhook is triggered when a campaign is sent or cancelled.",
        },
        events__subscribe: {
          type: "boolean",
          description: "Whether the webhook is triggered when a list subscriber is added.",
        },
        events__unsubscribe: {
          type: "boolean",
          description: "Whether the webhook is triggered when a list member unsubscribes.",
        },
      },
      required: [
        "list_id",
        "url",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Add webhook.",
    ],
  }),
  composioTool({
    name: "mailchimp_archive_automation",
    description: "Permanently archive a classic automation workflow in Mailchimp. IMPORTANT: This action is IRREVERSIBLE. Archiving will permanently end your automation and keep the report data. You'll be able to replicate your archived automation, but you can't restart it. Use this action when you want to: - Permanently stop an automation that is no longer needed - Clean up old automations while preserving historical report data - End a workflow that you don't plan to use again Prerequisites: - The automation must exist and not already be archived - Use 'list_automations' to find available workflow IDs",
    toolSlug: "MAILCHIMP_ARCHIVE_AUTOMATION",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique identifier for the Automation workflow to archive. You can obtain this ID from the list_automations action or from the Mailchimp dashboard URL when viewing an automation.",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive automation.",
    ],
  }),
  composioTool({
    name: "mailchimp_archive_contact",
    description: "Archive a contact in a Mailchimp audience. This action archives the specified contact, removing them from the active audience. Use when you need to archive a contact without permanently deleting their information. Returns HTTP 204 No Content on success with an empty response body.",
    toolSlug: "MAILCHIMP_ARCHIVE_CONTACT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contact_id: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the member's email address, the member's email address, or the contact_id.",
        },
        audience_id: {
          type: "string",
          description: "The unique ID for the list (audience).",
        },
      },
      required: [
        "audience_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive contact.",
    ],
  }),
  composioTool({
    name: "mailchimp_archive_list_member",
    description: "Archive (soft delete) a list member from a Mailchimp audience. This action archives the member, removing them from the active list but preserving their data. Archived members can be re-subscribed later. For permanent deletion that removes all personally identifiable information and prevents re-import, use the 'Delete list member' action with the delete-permanent endpoint instead. Returns HTTP 204 No Content on success with an empty response body.",
    toolSlug: "MAILCHIMP_ARCHIVE_LIST_MEMBER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience). Can be obtained from the 'Get lists info' action.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address directly or the contact_id.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Archive list member.",
    ],
  }),
  composioTool({
    name: "mailchimp_batch_add_or_remove_members",
    description: "Batch add or remove list members from a static segment in Mailchimp. This action allows you to efficiently manage membership in a static segment by adding and/or removing multiple email addresses in a single API call. Only works with static segments (not saved/dynamic segments based on conditions). Important notes: - At least one of members_to_add or members_to_remove must be provided - Email addresses must already exist as subscribers in the list - Non-existent emails are silently ignored (no error raised) - Maximum 500 emails can be processed per request for each operation - The segment must be a static segment (type='static'), not a saved segment",
    toolSlug: "MAILCHIMP_BATCH_ADD_OR_REMOVE_MEMBERS",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list/audience. Obtain this using the 'Get lists info' or 'List segments' actions.",
        },
        segment_id: {
          type: "string",
          description: "The unique ID for the static segment. This must be a static segment, not a saved/dynamic segment. Obtain this using the 'List segments' action and filter by type='static'.",
        },
        members_to_add: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of email addresses to add to the static segment. Emails must already exist as subscribers in the list - non-existent emails are ignored. Maximum 500 emails per request. Example: ['user1@example.com', 'user2@example.com']",
        },
        members_to_remove: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of email addresses to remove from the static segment. Emails not in the segment are ignored. Maximum 500 emails per request. Example: ['user3@example.com', 'user4@example.com']",
        },
      },
      required: [
        "list_id",
        "segment_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Batch add or remove members.",
    ],
  }),
  composioTool({
    name: "mailchimp_batch_subscribe_or_unsubscribe",
    description: "Batch subscribe or unsubscribe list members.",
    toolSlug: "MAILCHIMP_BATCH_SUBSCRIBE_OR_UNSUBSCRIBE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        members: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of member objects. Each object must contain 'email_address' (string) and 'status' (one of: 'subscribed', 'unsubscribed', 'cleaned', 'pending', 'transactional'). Optional fields include: 'merge_fields' (dict with field tags like FNAME, LNAME), 'tags' (list of tag names), 'vip' (bool), 'language' (string), 'email_type' ('html' or 'text'), 'ip_signup' and 'ip_opt' (strings). Up to 500 members may be added or updated with each API call.",
        },
        sync_tags: {
          type: "boolean",
          description: "Whether this batch operation will replace all existing tags with tags in request. ",
        },
        update_existing: {
          type: "boolean",
          description: "Whether this batch operation will change existing members' subscription status and data. Set to true to update existing members, false to only add new members. Defaults to false.",
        },
        skip_duplicate_check: {
          type: "boolean",
          description: "If skip_duplicate_check is true, we will ignore duplicates sent in the request when using the batch sub/unsub on the lists endpoint. The status of the first appearance in the request will be saved. This defaults to false. ",
        },
        skip_merge_validation: {
          type: "boolean",
          description: "If skip_merge_validation is true, member data will be accepted without merge field values, even if the merge field is usually required. This defaults to false. ",
        },
      },
      required: [
        "list_id",
        "members",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch subscribe or unsubscribe.",
    ],
  }),
  composioTool({
    name: "mailchimp_campaign_abuse_report_details",
    description: "Get detailed information about a specific abuse report for a campaign. An abuse complaint occurs when your recipient reports an email as spam in their mail program. This action retrieves the details of a specific abuse report including the email address that filed the complaint, the date of the report, and associated list information. Prerequisites: - You need a valid campaign_id (use 'list_campaigns' to find one) - You need a valid report_id (use 'retrieve_campaign_abuse_complaints' to list abuse reports)",
    toolSlug: "MAILCHIMP_CAMPAIGN_ABUSE_REPORT_DETAILS",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'id,email_address,date'.",
        },
        report_id: {
          type: "string",
          description: "The unique ID of the abuse report to retrieve. This can be obtained from the 'retrieve_campaign_abuse_complaints' action which lists all abuse reports for a campaign.",
        },
        campaign_id: {
          type: "string",
          description: "The unique ID of the campaign. This can be obtained from the 'list_campaigns' action or from campaign reports.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude from the response. Reference parameters of sub-objects with dot notation.",
        },
      },
      required: [
        "campaign_id",
        "report_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_campaign_statistics_feedback",
    description: "Get feedback based on a campaign's statistics. Advice feedback is based on campaign stats like opens, clicks, unsubscribes, bounces, and more.",
    toolSlug: "MAILCHIMP_CAMPAIGN_STATISTICS_FEEDBACK",
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
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation (e.g., 'advice.type', 'advice.message'). ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude. Reference parameters of sub-objects with dot notation (e.g., '_links'). ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_cancel_campaign",
    description: "Cancel a Regular or Plain-Text Campaign after you send, before all of your recipients receive it. This feature requires Mailchimp Pro or Premium plan. IMPORTANT: This action can only be used on campaigns that are currently in the 'sending' status. It cannot be used on: - Draft campaigns (status: 'save') - Scheduled campaigns (status: 'schedule') - use Unschedule Campaign instead - Already sent campaigns (status: 'sent') - Paused campaigns (status: 'paused') When successful, the campaign status will change to 'canceling' and then 'canceled'. Any recipients who have already received the email will not be affected. Returns HTTP 204 No Content on success. Returns HTTP 402 Payment Required if account lacks Mailchimp Pro/Premium subscription. Returns HTTP 404 Not Found if campaign_id is invalid.",
    toolSlug: "MAILCHIMP_CANCEL_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign to cancel. The campaign must be in 'sending' status (i.e., currently being delivered but not yet complete). You can obtain campaign IDs from the List Campaigns endpoint.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Cancel campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_create_a_survey_campaign",
    description: "Create a new email campaign that links to a specific survey in Mailchimp. This action generates a campaign based on an existing survey for a given audience/list. The survey must already exist in Mailchimp before creating a campaign for it. The created campaign will include a link to the survey, allowing recipients to participate. Prerequisites: - A valid Mailchimp audience/list (use 'Get lists info' to retrieve available lists) - An existing survey for that list (use 'Get information about all surveys for a list' to retrieve surveys) Returns the created campaign details including campaign ID, status, recipients, and settings.",
    toolSlug: "MAILCHIMP_CREATE_A_SURVEY_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list. This is a 10-character alphanumeric string (e.g., 'abc1234567'). You can obtain this from the 'Get lists info' action or from the Mailchimp dashboard.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID for the survey to create a campaign for. This is a 10-character alphanumeric string (e.g., 'xyz9876543'). You can obtain this from the 'Get information about all surveys for a list' action.",
        },
      },
      required: [
        "list_id",
        "survey_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "surveys",
    ],
    askBefore: [
      "Confirm the parameters before executing Create a survey campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_customer_journeys_api_trigger_for_a_contact",
    description: "Trigger a Customer Journey step for a specific contact via the Mailchimp API. This endpoint allows you to programmatically activate an API trigger step in a Customer Journey for a given contact. Before using this action: 1. Create a Customer Journey in the Mailchimp app with an \"API Trigger\" as a starting point or step 2. Mailchimp will provide you with a URL containing the journey_id and step_id 3. Use those IDs along with the contact's email address to trigger the journey The contact must be a member of the audience associated with the Customer Journey. Returns HTTP 204 (No Content) on success with an empty response body.",
    toolSlug: "MAILCHIMP_CUSTOMER_JOURNEYS_API_TRIGGER_FOR_A_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        step_id: {
          type: "integer",
          description: "The unique identifier for the step within the Customer Journey. This ID is provided by Mailchimp when you create an API trigger step in the Customer Journey builder.",
        },
        journey_id: {
          type: "integer",
          description: "The unique identifier for the Customer Journey. This ID is provided by Mailchimp when you create an API trigger step in the Customer Journey builder.",
        },
        email_address: {
          type: "string",
          description: "The email address of the contact to trigger in the Customer Journey. The contact must be a member of the audience associated with the journey.",
        },
      },
      required: [
        "journey_id",
        "step_id",
        "email_address",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "customerjourneys",
    ],
    askBefore: [
      "Confirm the parameters before executing Customer journeys api trigger for a contact.",
    ],
  }),
  composioTool({
    name: "mailchimp_customize_signup_form",
    description: "Customize the appearance and content of a Mailchimp list's signup form. Use this action to modify the header text/image, body content sections, and CSS styles of the embedded signup form for a specific audience/list. The signup form is used to collect email subscriptions from website visitors.",
    toolSlug: "MAILCHIMP_CUSTOMIZE_SIGNUP_FORM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        styles: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of style customizations for form elements. Each item should have 'selector' (e.g., 'page_background', 'body_link_style') and 'options' (list of CSS property/value pairs like [{'property': 'background-color', 'value': '#ffffff'}]).",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list/audience whose signup form you want to customize.",
        },
        contents: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "List of content sections for the signup form body. Each item should have 'section' (e.g., 'signup_message') and 'value' (the text content) keys.",
        },
        header__text: {
          type: "string",
          description: "The title/heading text displayed at the top of the signup form (e.g., 'Subscribe to Our Newsletter').",
        },
        header__image__alt: {
          type: "string",
          description: "Alternative text for the header image, used for accessibility and when the image cannot be displayed.",
        },
        header__image__url: {
          type: "string",
          description: "URL of the header image to display at the top of the signup form. Must be a publicly accessible image URL.",
        },
        header__image__link: {
          type: "string",
          description: "URL that users will be directed to when clicking the header image.",
        },
        header__image__align: {
          type: "string",
          description: "Horizontal alignment of the header image. Options: 'none', 'left', 'center', 'right'.",
          enum: [
            "none",
            "left",
            "center",
            "right",
          ],
        },
        header__image__width: {
          type: "string",
          description: "Width of the header image in pixels (e.g., '200').",
        },
        header__image__height: {
          type: "string",
          description: "Height of the header image in pixels (e.g., '100').",
        },
        header__image__target: {
          type: "string",
          description: "Target window for the header image link. '_blank' opens in new tab, 'null' opens in same window.",
          enum: [
            "_blank",
            "null",
          ],
        },
        header__image__border__color: {
          type: "string",
          description: "Color of the header image border in hex format (e.g., '#000000' for black).",
        },
        header__image__border__style: {
          type: "string",
          description: "CSS border style for the header image. Options: 'none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'outset', 'inset', 'ridge'.",
          enum: [
            "none",
            "solid",
            "dotted",
            "dashed",
            "double",
            "groove",
            "outset",
            "inset",
            "ridge",
          ],
        },
        header__image__border__width: {
          type: "string",
          description: "Width of the border around the header image in pixels (e.g., '2').",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Customize signup form.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_batch_request",
    description: "Stops a batch request from running. Since only one batch request is run at a time, this can be used to cancel a long running request. The results of any completed operations will not be available after this call.",
    toolSlug: "MAILCHIMP_DELETE_BATCH_REQUEST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        batch_id: {
          type: "string",
          description: "The unique ID of the batch operation to stop/delete. This ID is returned when you create a batch request using the 'Start batch operation' endpoint.",
        },
      },
      required: [
        "batch_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "batches",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete batch request.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_batch_webhook",
    description: "Permanently delete a batch webhook by its ID. Once deleted, the webhook URL will no longer receive POST notifications when batch operations complete. Use this action to remove webhooks that are no longer needed or to clean up invalid webhook endpoints. This action is idempotent - deleting a non-existent webhook returns a 404 error. Related actions: - list_batch_webhooks: Get all configured batch webhooks to find the ID - add_batch_webhook: Create a new batch webhook - update_batch_webhook: Modify an existing batch webhook's settings",
    toolSlug: "MAILCHIMP_DELETE_BATCH_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        batch_webhook_id: {
          type: "string",
          description: "The unique identifier for the batch webhook to delete. This ID can be obtained from the 'list_batch_webhooks' action or from the response of 'add_batch_webhook'. Example: '1537c038e7'.",
        },
      },
      required: [
        "batch_webhook_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "batchwebhooks",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete batch webhook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_campaign",
    description: "Permanently delete a campaign from your Mailchimp account. This action removes the specified campaign and all associated data. Note: Only campaigns with 'save' or 'paused' status can be deleted. Campaigns that have been sent cannot be deleted.",
    toolSlug: "MAILCHIMP_DELETE_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique identifier for the campaign to delete. This can be obtained from the campaign list or campaign creation response.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_campaign_feedback_message",
    description: "Remove a specific feedback message for a campaign.",
    toolSlug: "MAILCHIMP_DELETE_CAMPAIGN_FEEDBACK_MESSAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. Can be obtained from the list_campaigns action.",
        },
        feedback_id: {
          type: "string",
          description: "The unique id for the feedback message to delete. Can be obtained from the list_campaign_feedback or add_campaign_feedback actions.",
        },
      },
      required: [
        "campaign_id",
        "feedback_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete campaign feedback message.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_campaign_folder",
    description: "Delete a specific campaign folder from Mailchimp. When a campaign folder is deleted, all campaigns within that folder are automatically marked as 'unfiled' rather than being deleted. This operation is idempotent - deleting an already-deleted folder will return an error indicating the folder was not found. Returns HTTP 204 No Content on success.",
    toolSlug: "MAILCHIMP_DELETE_CAMPAIGN_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        folder_id: {
          type: "string",
          description: "The unique identifier for the campaign folder to delete. This ID can be obtained from the list_campaign_folders or add_campaign_folder actions.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaignfolders",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete campaign folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_cart",
    description: "Delete a cart from an e-commerce store. This endpoint permanently removes a cart and all its line items from the specified store. Use this when a cart is no longer needed (e.g., after converting it to an order or when the customer has abandoned the checkout process). Note: Deleting a cart will cancel any pending abandoned cart automation emails associated with it. Carts do not automatically expire and will remain until deleted.",
    toolSlug: "MAILCHIMP_DELETE_CART",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        cart_id: {
          type: "string",
          description: "The unique identifier for the cart to delete. This is the cart ID that was assigned when the cart was created. You can find cart IDs using the List Carts endpoint.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. This is the store ID you defined when creating the store using the Add Store endpoint.",
        },
      },
      required: [
        "store_id",
        "cart_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete cart.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_cart_line_item",
    description: "Delete a specific line item from a cart in a Mailchimp e-commerce store. Cart line items represent products that a customer has added to their shopping cart. This action permanently removes a line item from the specified cart. The deletion cannot be undone - to restore the item, you would need to add it again using 'add_cart_line_item'. Use this action when: - A customer removes an item from their cart - You need to clear invalid or outdated line items - Syncing cart changes from your e-commerce platform to Mailchimp Note: If you need to delete the entire cart, use 'delete_cart' instead.",
    toolSlug: "MAILCHIMP_DELETE_CART_LINE_ITEM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        cart_id: {
          type: "string",
          description: "The unique identifier for the cart containing the line item. You can get this from the 'list_carts' action or from the response when creating a cart.",
        },
        line_id: {
          type: "string",
          description: "The unique identifier for the line item to delete. You can get this from the 'list_cart_line_items' action or from the 'lines' array in cart details.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. You can get this from the 'list_stores' action or from the response when creating a store.",
        },
      },
      required: [
        "store_id",
        "cart_id",
        "line_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete cart line item.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_connected_site",
    description: "Remove a connected site from your Mailchimp account. This action permanently deletes the specified connected site. Connected sites are external websites that have been linked to your Mailchimp account for tracking and integration purposes. Once deleted, the site tracking script will no longer collect data for this site. Note: This action is idempotent - deleting an already-deleted site will not cause an error but may return a 404 Not Found response.",
    toolSlug: "MAILCHIMP_DELETE_CONNECTED_SITE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        connected_site_id: {
          type: "string",
          description: "The unique identifier for the connected site to delete. This ID can be obtained from the List Connected Sites or Get Connected Site actions (returned as 'foreign_id').",
        },
      },
      required: [
        "connected_site_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "connectedsites",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete connected site.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_customer",
    description: "Delete a customer from an e-commerce store. Permanently removes a customer record from the specified Mailchimp store. This action is destructive and cannot be undone. The customer's associated data including order history linkage will be removed, but existing orders will not be deleted. Returns HTTP 204 No Content on successful deletion.",
    toolSlug: "MAILCHIMP_DELETE_CUSTOMER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. This is the ID assigned when the store was created in Mailchimp.",
        },
        customer_id: {
          type: "string",
          description: "The unique identifier for the customer within the store. This is the customer ID that was assigned when the customer was added to the store.",
        },
      },
      required: [
        "store_id",
        "customer_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete customer.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_domain",
    description: "Delete a sending domain from the Mailchimp account's verified domains. This permanently removes a domain that was previously added for verification. The domain can be in any verification state (pending, verified, or authenticated). After deletion, the domain will no longer appear in the verified-domains list and cannot be used as a sender address until re-added and re-verified. Use 'list_sending_domains' to see available domains before deletion.",
    toolSlug: "MAILCHIMP_DELETE_DOMAIN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        domain_name: {
          type: "string",
          description: "The verified domain name to delete from the Mailchimp account (e.g., 'example.com').",
        },
      },
      required: [
        "domain_name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "verifieddomains",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete domain.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_file",
    description: "Permanently remove a file from the Mailchimp File Manager. This action deletes an image or document file from your Mailchimp account's File Manager. Once deleted, the file cannot be recovered. Files in the File Manager are typically used in campaigns, templates, or signup forms. IMPORTANT: This is a destructive action. Ensure you have the correct file_id before executing, as deletion is permanent. Files that are actively used in campaigns may still be accessible until those campaigns are deleted.",
    toolSlug: "MAILCHIMP_DELETE_FILE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        file_id: {
          type: "string",
          description: "The unique numeric ID of the file to delete from the File Manager. You can get this ID from the 'List stored files' action or from the 'Add file' action response when uploading a new file.",
        },
      },
      required: [
        "file_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "filemanager",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete file.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_folder",
    description: "Delete a specific folder in the File Manager. This permanently removes the folder and all files contained within it. Use with caution as this action cannot be undone.",
    toolSlug: "MAILCHIMP_DELETE_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        folder_id: {
          type: "string",
          description: "The unique ID of the File Manager folder to delete. This can be obtained from the list_folders action or from the response when creating a folder.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "filemanager",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_interest_category",
    description: "Delete a specific interest category from a Mailchimp audience/list. Interest categories are used to group related interests together on signup forms (e.g., 'Newsletter Preferences', 'Product Interests'). Each category can contain multiple interests that subscribers can select. WARNING: This action permanently deletes the interest category and all interests within it. This cannot be undone. Any subscriber data associated with these interests will also be removed. Use this action when you need to: - Remove obsolete or unused interest categories - Clean up test data - Reorganize your list's interest structure Prerequisites: - Obtain the list_id using 'Get lists info' action - Obtain the interest_category_id using 'List interest categories' action",
    toolSlug: "MAILCHIMP_DELETE_INTEREST_CATEGORY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list containing the interest category. This is a 10-character alphanumeric string (e.g., '2cc9d141a8'). Retrieve available list IDs using the 'Get lists info' action.",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category to delete. This is a 10-character alphanumeric string (e.g., 'a788d2f60b'). Retrieve available interest category IDs using the 'List interest categories' action. Note: Deleting an interest category will also delete all interests within it.",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete interest category.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_interest_in_category",
    description: "Delete a specific interest (group name) from an interest category within a Mailchimp list. This permanently removes the interest from the category. Returns HTTP 204 on success.",
    toolSlug: "MAILCHIMP_DELETE_INTEREST_IN_CATEGORY",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience) containing the interest category.",
        },
        interest_id: {
          type: "string",
          description: "The unique ID of the interest to delete within the category.",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category containing the interest to delete.",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
        "interest_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete interest in category.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_landing_page",
    description: "Permanently delete a Mailchimp landing page. This action permanently removes a landing page from your Mailchimp account. This operation cannot be undone. The landing page must exist and be in a deletable state (draft or unpublished). Published landing pages should be unpublished first before deletion. Returns a 204 No Content response on success, indicating the page was deleted. Returns a 404 error if the page_id does not exist.",
    toolSlug: "MAILCHIMP_DELETE_LANDING_PAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "The unique identifier for the landing page to delete. This is a 12-character hexadecimal string (e.g., '030001b4e1f0'). Use the List Landing Pages action to retrieve available page IDs.",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "landingpages",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete landing page.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_list",
    description: "Permanently delete a list (audience) from your Mailchimp account. WARNING: This is a destructive and irreversible operation. Deleting a list will permanently remove all associated data including: - Subscriber email addresses and profile data - Subscriber activity history (opens, clicks, etc.) - Unsubscribe records - Complaint records - Bounce records - Segments and tags Export and backup your list data before deletion if needed. Returns HTTP 204 No Content on success.",
    toolSlug: "MAILCHIMP_DELETE_LIST",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience) to delete. This is a 10-character alphanumeric string (e.g., '2cc9d141a8'). Can be obtained from the GET /lists endpoint or list settings in Mailchimp.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete list.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_list_member",
    description: "Permanently delete a list member and all their personally identifiable information (PII). WARNING: This is an irreversible action. Once deleted, the member cannot be re-imported with the same email address. Use this for GDPR compliance or when permanently removing a contact. For soft removal (keeping the ability to re-add later), use archive_list_member instead. Returns HTTP 204 No Content on success with an empty response body.",
    toolSlug: "MAILCHIMP_DELETE_LIST_MEMBER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list (e.g., 'abc123def4'). Can be obtained from the list_lists or get_lists_info actions.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. For example, for 'User@Example.com', compute MD5 of 'user@example.com'. This hash is also returned as 'id' when adding or listing members.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete list member.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_merge_field",
    description: "Delete a specific merge field (audience field) from a Mailchimp list/audience. WARNING: This action permanently deletes the merge field and all associated data collected from that field. This cannot be undone. Consider hiding the field from signup forms instead of deleting it. Back up your audience data before deleting. Note: Default merge fields (FNAME, LNAME, ADDRESS, PHONE) cannot be deleted.",
    toolSlug: "MAILCHIMP_DELETE_MERGE_FIELD",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the audience/list. Get this from the List Audiences endpoint (MAILCHIMP_GET_LISTS_INFO) or your Mailchimp dashboard.",
        },
        merge_id: {
          type: "string",
          description: "The numeric ID for the merge field to delete. Get this from the List Merge Fields endpoint (MAILCHIMP_LIST_MERGE_FIELDS). Note: Default fields like FNAME, LNAME, ADDRESS, and PHONE cannot be deleted.",
        },
      },
      required: [
        "list_id",
        "merge_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete merge field.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_note",
    description: "Delete a specific note for a list member in Mailchimp. Permanently removes a note associated with a subscriber. This operation cannot be undone. A successful deletion returns HTTP 204 No Content. To delete a note, you need: - list_id: The unique ID of the Mailchimp audience/list - subscriber_hash: The member's email address, MD5 hash of lowercase email, or contact_id - note_id: The unique ID of the note (can be obtained from list_recent_member_notes)",
    toolSlug: "MAILCHIMP_DELETE_NOTE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list (audience).",
        },
        note_id: {
          type: "string",
          description: "The unique ID of the note to delete.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts the member's email address or contact_id directly.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
        "note_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete note.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_order",
    description: "Permanently delete an order from a Mailchimp e-commerce store. This action removes the order and its associated line items. This operation cannot be undone.",
    toolSlug: "MAILCHIMP_DELETE_ORDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        order_id: {
          type: "string",
          description: "The unique identifier for the order to delete within the specified store.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store containing the order to delete.",
        },
      },
      required: [
        "store_id",
        "order_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete order.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_order_line_item",
    description: "Delete a specific line item from an order in a Mailchimp e-commerce store. This action permanently removes the specified line item from the order. The operation is idempotent - deleting an already-deleted line item returns the same success response. Prerequisites: The store, order, and line item must exist. Use MAILCHIMP_LIST_STORES, MAILCHIMP_LIST_ORDERS, and MAILCHIMP_LIST_ORDER_LINE_ITEMS to find valid IDs. Note: This action cannot be undone. To add the line item back, use MAILCHIMP_ADD_ORDER_LINE_ITEM.",
    toolSlug: "MAILCHIMP_DELETE_ORDER_LINE_ITEM",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        line_id: {
          type: "string",
          description: "The unique identifier for the line item to delete from the order. Use MAILCHIMP_LIST_ORDER_LINE_ITEMS to find available line item IDs.",
        },
        order_id: {
          type: "string",
          description: "The unique identifier for an order within the store. Use MAILCHIMP_LIST_ORDERS to find available order IDs for a store.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use MAILCHIMP_LIST_STORES to find available store IDs.",
        },
      },
      required: [
        "store_id",
        "order_id",
        "line_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete order line item.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_product",
    description: "Permanently delete a product from a Mailchimp e-commerce store. This action removes the product and all its variants. Returns HTTP 204 on success with no content. Use LIST_STORES to find store IDs and LIST_PRODUCT to find product IDs. This operation cannot be undone.",
    toolSlug: "MAILCHIMP_DELETE_PRODUCT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use LIST_STORES to find available store IDs.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product to delete. Use LIST_PRODUCT to find available product IDs for a store.",
        },
      },
      required: [
        "store_id",
        "product_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete product.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_product_image",
    description: "Delete a product image from a Mailchimp e-commerce store. This action permanently removes an image associated with a product. The operation is idempotent - deleting an already-deleted image will not cause an error. Before deleting, ensure you have the correct store_id, product_id, and image_id as this action cannot be undone.",
    toolSlug: "MAILCHIMP_DELETE_PRODUCT_IMAGE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        image_id: {
          type: "string",
          description: "The unique identifier for the product image to delete. This is the image ID you specified when adding the image to the product.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. This is the store ID you specified when adding the store to Mailchimp.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product within the store. This is the product ID you specified when creating the product.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "image_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete product image.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_product_variant",
    description: "Delete a specific product variant from a Mailchimp e-commerce store. This action permanently removes a variant from a product. Use this to clean up discontinued variants or manage product options. Note that a product must always have at least one variant, so attempting to delete the last remaining variant of a product will fail. Prerequisites: - The store must exist (use list_stores to verify) - The product must exist in the store (use list_product to verify) - The variant must exist and not be the only variant for the product",
    toolSlug: "MAILCHIMP_DELETE_PRODUCT_VARIANT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        store_id: {
          type: "string",
          description: "The unique identifier for the Mailchimp e-commerce store containing the product variant to delete.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product that contains the variant to be deleted.",
        },
        variant_id: {
          type: "string",
          description: "The unique identifier for the specific product variant to delete. Note: A product must have at least one variant, so deleting the last variant may fail.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "variant_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete product variant.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_promo_code",
    description: "Delete a promo code from an e-commerce store. This action permanently removes a specific promo code from a promo rule in a Mailchimp store. The promo code will no longer be available for customers to use. This action is idempotent - deleting an already-deleted promo code will not cause an error. Prerequisites: - The store must exist (use MAILCHIMP_LIST_STORES to verify) - The promo rule must exist in the store (use MAILCHIMP_LIST_PROMO_RULES to verify) - The promo code must exist within the promo rule (use MAILCHIMP_LIST_PROMO_CODES to verify) Note: This action is destructive and cannot be undone. The promo code will need to be recreated using MAILCHIMP_ADD_PROMO_CODE if you want to restore it.",
    toolSlug: "MAILCHIMP_DELETE_PROMO_CODE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use MAILCHIMP_LIST_STORES to retrieve available store IDs.",
        },
        promo_code_id: {
          type: "string",
          description: "The unique identifier for the promo code to delete. Use MAILCHIMP_LIST_PROMO_CODES to retrieve available promo code IDs for a promo rule.",
        },
        promo_rule_id: {
          type: "string",
          description: "The unique identifier for the promo rule that contains the promo code. Use MAILCHIMP_LIST_PROMO_RULES to retrieve available promo rule IDs for a store.",
        },
      },
      required: [
        "store_id",
        "promo_rule_id",
        "promo_code_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete promo code.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_promo_rule",
    description: "Permanently delete a promo rule from a Mailchimp e-commerce store. This action also removes all associated promo codes. Warning: This operation is irreversible. Returns HTTP 204 on success with no content body.",
    toolSlug: "MAILCHIMP_DELETE_PROMO_RULE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store containing the promo rule to delete. Use MAILCHIMP_LIST_STORES to find available store IDs.",
        },
        promo_rule_id: {
          type: "string",
          description: "The unique identifier for the promo rule to delete. Use MAILCHIMP_LIST_PROMO_RULES to find promo rule IDs for a specific store.",
        },
      },
      required: [
        "store_id",
        "promo_rule_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete promo rule.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_segment",
    description: "Permanently delete a segment from a Mailchimp list (audience). This action removes the segment definition from the list. It does NOT delete the contacts/members within the segment - they remain in the list. Both static segments and saved segments can be deleted using this action. Note: This is a destructive operation that cannot be undone. Use with caution.",
    toolSlug: "MAILCHIMP_DELETE_SEGMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list (audience) containing the segment. You can retrieve list IDs using the 'Get lists info' action.",
        },
        segment_id: {
          type: "string",
          description: "The unique ID of the segment to delete. You can retrieve segment IDs using the 'List segments' action. This can be either a saved segment (based on conditions) or a static segment (based on specific email addresses).",
        },
      },
      required: [
        "list_id",
        "segment_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete segment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_store",
    description: "Delete an e-commerce store from your Mailchimp account. WARNING: This is a destructive operation. Deleting a store will permanently remove all associated subresources, including Customers, Orders, Products, and Carts. This action cannot be undone. Returns HTTP 204 No Content on successful deletion.",
    toolSlug: "MAILCHIMP_DELETE_STORE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store to delete. This is the client-defined ID that was provided when the store was created (e.g., 'my-store-001').",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete store.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_template",
    description: "Permanently delete a user-created email template from your Mailchimp account. This action removes the specified template and cannot be undone. Only templates of type 'user' (custom templates you created) can be deleted. System templates and gallery templates cannot be deleted. Returns HTTP 204 No Content on success. Returns HTTP 404 if the template does not exist or is not a user template.",
    toolSlug: "MAILCHIMP_DELETE_TEMPLATE",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        template_id: {
          type: "string",
          description: "The unique numeric ID for the template to delete. Only user-created templates can be deleted; system/gallery templates cannot be deleted. Use the List Templates action to find available template IDs.",
        },
      },
      required: [
        "template_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "templates",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete template.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_template_folder",
    description: "Permanently delete a template folder from your Mailchimp account. This action removes a specific template folder. Any email templates that were stored in the folder will not be deleted, but will be marked as 'unfiled' and can still be accessed through the templates list. Important: This is a destructive action and cannot be undone. Make sure you have the correct folder_id before executing. Returns HTTP 204 No Content on successful deletion.",
    toolSlug: "MAILCHIMP_DELETE_TEMPLATE_FOLDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        folder_id: {
          type: "string",
          description: "The unique ID of the template folder to delete. This is a 10-character alphanumeric string (e.g., '1033a6ad30'). You can obtain this ID from the 'list_template_folders' or 'add_template_folder' actions.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "templatefolders",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete template folder.",
    ],
  }),
  composioTool({
    name: "mailchimp_delete_webhook",
    description: "Delete a specific webhook from a Mailchimp audience/list. Permanently removes a webhook configuration that was previously set up to receive POST notifications for list events. This action is irreversible - once deleted, the webhook URL will no longer receive notifications. Returns the deleted webhook object with its configuration details.",
    toolSlug: "MAILCHIMP_DELETE_WEBHOOK",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list containing the webhook to delete.",
        },
        webhook_id: {
          type: "string",
          description: "The unique identifier for the webhook to delete. Can be obtained from the list webhooks endpoint.",
        },
      },
      required: [
        "list_id",
        "webhook_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete webhook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_delete_workflow_email",
    description: "Permanently delete an email from a classic automation workflow. This action removes the specified email from an automation workflow. Important limitations: - Emails from Abandoned Cart (abandonedCart) workflows cannot be deleted. - Emails from Product Retargeting (abandonedBrowse) workflows cannot be deleted. - The automation workflow must exist and contain the specified email. Use the list_automations action to get valid workflow_id values. Use the list_automated_emails action to get valid workflow_email_id values.",
    toolSlug: "MAILCHIMP_DELETE_WORKFLOW_EMAIL",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique identifier for the Automation workflow. This can be obtained from the list automations endpoint or automation creation response.",
        },
        workflow_email_id: {
          type: "string",
          description: "The unique identifier for the Automation workflow email to delete. This can be obtained from the list automated emails endpoint.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete workflow email.",
    ],
  }),
  composioTool({
    name: "mailchimp_forget_contact",
    description: "Forget a contact and remove their personally identifiable information (PII). This action marks a contact to be forgotten and initiates the process to remove their PII from Mailchimp in compliance with GDPR and privacy regulations. Use this when handling \"right to be forgotten\" requests. The contact will be permanently removed from the audience. Returns HTTP 204 No Content on success with an empty response body.",
    toolSlug: "MAILCHIMP_FORGET_CONTACT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        contact_id: {
          type: "string",
          description: "The unique ID for the contact. This can be the MD5 hash of the lowercase email address, the contact_id, or the subscriber_hash.",
        },
        audience_id: {
          type: "string",
          description: "The unique ID for the audience (list). Can be obtained from the get_lists_info action.",
        },
      },
      required: [
        "audience_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Forget contact.",
    ],
  }),
  composioTool({
    name: "mailchimp_get_abuse_report",
    description: "Get details about a specific abuse report.",
    toolSlug: "MAILCHIMP_GET_ABUSE_REPORT",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'id,email_address,date'.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list/audience.",
        },
        report_id: {
          type: "string",
          description: "The unique ID for the abuse report.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Cannot be used with 'fields' parameter.",
        },
      },
      required: [
        "list_id",
        "report_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_account_export_info",
    description: "Get detailed information about a specific Mailchimp account export. Use this action to check the status of an export job and retrieve the download URL once it's complete. Exports can take anywhere from a few minutes to several hours depending on account size. Typical workflow: 1. Create an export using 'add_export' action 2. Poll this action periodically to check the 'finished' status 3. Once 'finished' is True, use the 'download_url' to download the ZIP file Note: The download_url is signed and provides direct access to your data without authentication. Keep this URL secure. Completed exports are available for download for up to 90 days.",
    toolSlug: "MAILCHIMP_GET_ACCOUNT_EXPORT_INFO",
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
          description: "Optional list of fields to include in the response. Use dot notation for nested fields (e.g., ['export_id', 'finished', 'download_url', 'stages.status']). If not specified, all fields are returned.",
        },
        export_id: {
          type: "string",
          description: "The unique identifier for the account export. This ID is returned when creating an export via 'add_export' or can be obtained from 'list_account_exports'.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional list of fields to exclude from the response. Use dot notation for nested fields (e.g., ['_links']). Cannot be used together with 'fields'.",
        },
      },
      required: [
        "export_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "accountexports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_audiences_contacts",
    description: "Tool to get a list of omni-channel contacts for a given audience. Use when you need to retrieve contacts from a Mailchimp audience with optional filtering and pagination.",
    toolSlug: "MAILCHIMP_GET_AUDIENCES_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000.",
        },
        cursor: {
          type: "string",
          description: "Paginate through a collection of records by setting the cursor parameter to a next_cursor attribute returned by a previous request. Default value fetches the first page of results.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation.",
        },
        sort_dir: {
          type: "string",
          description: "Enum for sort_dir parameter",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Enum for sort_field parameter",
          enum: [
            "created_at",
            "updated_at",
          ],
        },
        audience_id: {
          type: "string",
          description: "The unique ID for the audience.",
        },
        created_since: {
          type: "string",
          description: "Restricts the response to contacts created after the specified time (exclusive). Uses ISO 8601 format: 2025-04-23T15:41:36+00:00.",
        },
        updated_since: {
          type: "string",
          description: "Restricts the response to contacts updated after the specified time (exclusive). Uses ISO 8601 format: 2025-04-23T15:41:36+00:00.",
        },
        created_before: {
          type: "string",
          description: "Restricts the response to contacts created at or before the specified time (inclusive). Uses ISO 8601 format: 2025-04-23T15:41:36+00:00.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation.",
        },
        updated_before: {
          type: "string",
          description: "Restricts the response to contacts updated at or before the specified time (inclusive). Uses ISO 8601 format: 2025-04-23T15:41:36+00:00.",
        },
      },
      required: [
        "audience_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "mailchimp_get_audiences_contacts_detail",
    description: "Tool to retrieve a specific omni-channel contact from a Mailchimp audience by their ID or channel hash. Use when you need detailed information about a contact including email/SMS channels, merge fields, tags, and subscription status.",
    toolSlug: "MAILCHIMP_GET_AUDIENCES_CONTACTS_DETAIL",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation.",
        },
        contact_id: {
          type: "string",
          description: "A unique identifier for the contact, which can be a Mailchimp contact ID or a channel hash. A channel hash must follow the format email:[md5_hash] (where the hash is the MD5 of the lowercased email address) or sms:[sha256_hash] (where the hash is the SHA256 of the E.164-formatted phone number).",
        },
        audience_id: {
          type: "string",
          description: "The unique ID for the audience.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation.",
        },
      },
      required: [
        "audience_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "mailchimp_get_authorized_app_info",
    description: "Retrieve detailed information about a specific authorized OAuth application. Returns the app's ID, name, description, and list of users who have linked their Mailchimp accounts to this application. Use LIST_AUTHORIZED_APPS first to get valid app_id values.",
    toolSlug: "MAILCHIMP_GET_AUTHORIZED_APP_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        app_id: {
          type: "string",
          description: "The unique numeric ID of the authorized application. Obtain this from the LIST_AUTHORIZED_APPS action.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return in the response. Use dot notation for nested fields (e.g., ['id', 'name', 'description']). If not specified, all fields are returned.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for nested fields (e.g., ['_links']). Cannot be used with 'fields' parameter.",
        },
      },
      required: [
        "app_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "authorizedapps",
    ],
  }),
  composioTool({
    name: "mailchimp_get_automated_email_subscriber",
    description: "Get information about a specific subscriber in a classic automation email queue. This action retrieves details about a subscriber who is waiting to receive an automated email, including their email address and the scheduled send time. Note: Subscribers appear in the queue when they've been triggered by the automation but haven't yet received the email. The queue is typically processed quickly, so subscribers may only be in the queue briefly. Returns HTTP 404 if the subscriber is not found in the queue.",
    toolSlug: "MAILCHIMP_GET_AUTOMATED_EMAIL_SUBSCRIBER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique ID for the Automation workflow. Can be obtained from list_automations action.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address.",
        },
        workflow_email_id: {
          type: "string",
          description: "The unique ID for the Automation workflow email. Can be obtained from list_automated_emails action.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_get_automation_info",
    description: "Retrieve details of a Mailchimp automation workflow by its ID. Returns comprehensive information including: - Basic info: ID, status (save/paused/sending/archived), creation time - Settings: title, from_name, reply_to email - Recipients: associated list/audience ID, store ID for e-commerce automations - Tracking: opens, clicks, e-commerce tracking configuration - Report summary: opens, clicks, rates (for archived automations) Use MAILCHIMP_LIST_AUTOMATIONS to get available workflow IDs.",
    toolSlug: "MAILCHIMP_GET_AUTOMATION_INFO",
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
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation. Example: ['id', 'settings.title', 'recipients.list_id']",
        },
        workflow_id: {
          type: "string",
          description: "The unique id for the Automation workflow. Can be obtained from the list_automations action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Reference parameters of sub-objects with dot notation. Example: ['_links', 'tracking']",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_get_batch_operation_status",
    description: "Get the status of a batch operation. Retrieves details about a specific batch operation including its current status (pending, preprocessing, started, finalizing, or finished), operation counts, timestamps, and a URL to download the results when completed.",
    toolSlug: "MAILCHIMP_GET_BATCH_OPERATION_STATUS",
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
          description: "A list of fields to return. Use dot notation for sub-object fields (e.g., ['id', 'status', 'total_operations']). If not specified, all fields are returned.",
        },
        batch_id: {
          type: "string",
          description: "The unique ID for the batch operation. Obtain this from list_batch_requests or start_batch_operation.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., ['_links']). ",
        },
      },
      required: [
        "batch_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "batches",
    ],
  }),
  composioTool({
    name: "mailchimp_get_batch_webhook_info",
    description: "Retrieve detailed information about a specific batch webhook by its ID. Batch webhooks are used to receive notifications when batch operations complete. Use this endpoint to check the configuration and status of a specific webhook.",
    toolSlug: "MAILCHIMP_GET_BATCH_WEBHOOK_INFO",
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
          description: "A list of fields to return in the response. Use dot notation to reference sub-object parameters (e.g., ['id', 'url', 'enabled']). If not specified, all fields are returned.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation to reference sub-object parameters (e.g., ['_links']). Cannot be used together with 'fields'.",
        },
        batch_webhook_id: {
          type: "string",
          description: "The unique identifier for the batch webhook. This can be obtained from the list batch webhooks endpoint.",
        },
      },
      required: [
        "batch_webhook_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "batchwebhooks",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_content",
    description: "Get the HTML and plain-text content for a campaign.",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_CONTENT",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_feedback_message",
    description: "Get a specific feedback message from a campaign.",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_FEEDBACK_MESSAGE",
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
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation. Available fields: feedback_id, parent_id, block_id, message, is_complete, created_by, created_at, updated_at, source, campaign_id, _links.",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. Obtain from MAILCHIMP_LIST_CAMPAIGNS.",
        },
        feedback_id: {
          type: "string",
          description: "The unique id for the feedback message. Obtain from MAILCHIMP_LIST_CAMPAIGN_FEEDBACK or MAILCHIMP_ADD_CAMPAIGN_FEEDBACK.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Reference parameters of sub-objects with dot notation. Example: ['_links'] to exclude HATEOAS links.",
        },
      },
      required: [
        "campaign_id",
        "feedback_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_folder",
    description: "Get information about a specific folder used to organize campaigns in Mailchimp. Returns the folder details including its ID, name, and the count of campaigns stored within it. Use the 'list_campaign_folders' action to get available folder IDs.",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_FOLDER",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'id,name,count' to only return those fields.",
        },
        folder_id: {
          type: "string",
          description: "The unique ID for the campaign folder. This can be obtained from the 'list_campaign_folders' action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude from the response. Reference parameters of sub-objects with dot notation. Example: '_links' to exclude links from response.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaignfolders",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_info",
    description: "Get information about a specific campaign.",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_INFO",
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
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation. Example: ['id', 'status', 'settings.title', 'recipients.list_id']. If not specified, all fields are returned.",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Reference parameters of sub-objects with dot notation. Example: ['_links', 'tracking']. Cannot be used together with 'fields'.",
        },
        include_resend_shortcut_eligibility: {
          type: "boolean",
          description: "Return the `resend_shortcut_eligibility` field in the response, which tells you if the campaign is eligible for the various Campaign Resend Shortcuts offered. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_link_details",
    description: "Get click details for a specific link in a campaign. This endpoint retrieves detailed click statistics for a single link within a sent campaign, including total clicks, unique clicks, click percentages, and the timestamp of the last click. Use list_campaign_details first to get the list of available link IDs for a campaign.",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_LINK_DETAILS",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'id,url,total_clicks'.",
        },
        link_id: {
          type: "string",
          description: "The unique identifier for the link. Can be obtained from the list_campaign_details action which returns click details for all links in a campaign.",
        },
        campaign_id: {
          type: "string",
          description: "The unique identifier for the campaign. Can be obtained from the list_campaigns action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Example: '_links'.",
        },
      },
      required: [
        "campaign_id",
        "link_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_recipient_info",
    description: "Get information about a specific campaign recipient.",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_RECIPIENT_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'email_address,status,open_count'.",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. This must be a campaign that has been sent to have recipient data.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Example: '_links,merge_fields'.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. You can compute this using: md5(email_address.lower()). Also known as email_id in list endpoints.",
        },
      },
      required: [
        "campaign_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_report",
    description: "Retrieve detailed performance report for a Mailchimp campaign. Returns analytics including email delivery stats (sent, bounced), engagement metrics (opens, clicks), and e-commerce data (orders, revenue). Works for both sent campaigns (with actual data) and draft campaigns (returns zeros).",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_REPORT",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation (e.g., 'opens.opens_total,clicks.click_rate'). ",
        },
        campaign_id: {
          type: "string",
          description: "The unique ID of the sent campaign to retrieve the report for.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation (e.g., 'industry_stats,timeseries'). ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_campaign_send_checklist",
    description: "Review the send checklist for a Mailchimp campaign before sending. Returns a list of checklist items indicating issues that need to be resolved. Each item has a 'type' field: 'error' (must fix before sending), 'warning' (optional but recommended to address), or 'success' (item is complete). The 'is_ready' field indicates if the campaign can be sent (True when no errors). Common checklist items include: audience selection, subject line, from name/email, email content, and tracking settings.",
    toolSlug: "MAILCHIMP_GET_CAMPAIGN_SEND_CHECKLIST",
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
          description: "List of fields to return. Available fields: 'is_ready', 'items', '_links'. Use dot notation for nested fields (e.g., 'items.type', 'items.heading').",
        },
        campaign_id: {
          type: "string",
          description: "The unique ID for the campaign. Obtain this from list_campaigns or add_campaign actions.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from the response. Common use: exclude '_links' to reduce response size.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "mailchimp_get_cart_info",
    description: "Retrieve detailed information about a specific cart in an e-commerce store, including customer details and line items.",
    toolSlug: "MAILCHIMP_GET_CART_INFO",
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
          description: "A list of fields to return. Use dot notation for sub-object fields (e.g., 'customer.email_address', 'lines.product_id'). ",
        },
        cart_id: {
          type: "string",
          description: "The unique identifier for the cart to retrieve.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store containing the cart.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., '_links', 'customer._links'). ",
        },
      },
      required: [
        "store_id",
        "cart_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_cart_line_item",
    description: "Retrieve detailed information about a specific line item in a shopping cart. Returns product details, variant information, quantity, and price for a single cart line item. Useful for displaying cart item details or verifying cart contents before checkout.",
    toolSlug: "MAILCHIMP_GET_CART_LINE_ITEM",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Available fields include: id, product_id, product_title, product_variant_id, product_variant_title, quantity, price, _links.",
        },
        cart_id: {
          type: "string",
          description: "The unique identifier for the cart. Obtain this from the list_carts action for a given store.",
        },
        line_id: {
          type: "string",
          description: "The unique identifier for the line item within the cart. Obtain this from list_cart_line_items action.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Obtain this from the list_stores action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Use this to reduce response size by excluding unwanted fields.",
        },
      },
      required: [
        "store_id",
        "cart_id",
        "line_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_clicked_link_subscriber",
    description: "Get detailed information about a specific subscriber who clicked a link in a campaign. This action retrieves click data for a specific list member who clicked on a particular tracked link in a sent campaign. Use this to understand individual subscriber engagement with campaign links. Prerequisites: - The campaign must have been sent (status: 'sent') - The link must be a tracked link in the campaign - The subscriber must have clicked the link at least once To get the required IDs: 1. campaign_id: Use list_campaigns with status='sent' 2. link_id: Use list_campaign_details with the campaign_id to get urls_clicked 3. subscriber_hash: Use list_clicked_link_subscribers to get email_id of clickers",
    toolSlug: "MAILCHIMP_GET_CLICKED_LINK_SUBSCRIBER",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'email_address,clicks,contact_status'.",
        },
        link_id: {
          type: "string",
          description: "The id for the link. Can be obtained from list_campaign_details action which returns urls_clicked with id field for each link.",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. Can be obtained from list_campaigns action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Example: '_links,merge_fields'.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. Can be obtained from list_clicked_link_subscribers action (email_id field) or by computing MD5 hash of the lowercased email address.",
        },
      },
      required: [
        "campaign_id",
        "link_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_connected_site",
    description: "Retrieve information about a specific connected site in your Mailchimp account. Connected sites allow Mailchimp to track website activity and visitor behavior for your email marketing campaigns. Use this action to get details about a site including its domain, platform type, and the JavaScript tracking snippet. Returns the site's foreign_id, domain, platform, tracking script (site_script), and creation/update timestamps.",
    toolSlug: "MAILCHIMP_GET_CONNECTED_SITE",
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
          description: "A list of fields to return in the response. Available fields include: 'foreign_id', 'store_id', 'platform', 'domain', 'site_script', 'site_script.url', 'site_script.fragment', 'created_at', 'updated_at', '_links'. Use dot notation for nested fields (e.g., 'site_script.url').",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use same field names as 'fields' parameter. Useful for omitting large fields like 'site_script' or '_links' when not needed.",
        },
        connected_site_id: {
          type: "string",
          description: "The unique identifier (foreign_id) of the connected site to retrieve. This is the same ID used when the site was created via add_connected_site. Example: 'site_123', 'my-shop-456'.",
        },
      },
      required: [
        "connected_site_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "connectedsites",
    ],
  }),
  composioTool({
    name: "mailchimp_get_customer_info",
    description: "Get information about a specific customer.",
    toolSlug: "MAILCHIMP_GET_CUSTOMER_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store.",
        },
        customer_id: {
          type: "string",
          description: "The unique identifier for the customer within the specified store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
        "customer_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_domain_info",
    description: "Get the details for a single verified domain on the Mailchimp account. Retrieves information about a specific domain including its verification status, authentication status, and the email address used for verification. Use this action to check if a domain has been verified and is ready for sending emails. Returns 404 if the domain is not found in the account's verified domains list.",
    toolSlug: "MAILCHIMP_GET_DOMAIN_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        domain_name: {
          type: "string",
          description: "The domain name to retrieve information for (e.g., 'example.com'). This should be a domain that has been previously added to your Mailchimp account via the add_domain_to_account action. Use list_sending_domains to see all available domains.",
        },
      },
      required: [
        "domain_name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "verifieddomains",
    ],
  }),
  composioTool({
    name: "mailchimp_get_facebook_ad_info",
    description: "Retrieve detailed information about a specific Facebook ad created through Mailchimp. Returns ad details including id, name, web_id, channel_id (e.g., 'fb'), type, status (e.g., 'paused', 'active', 'disconnected'), audience targeting information, budget settings, content, create_time, start_time, end_time, and feedback data. Note: Facebook ads must be created through Mailchimp's Facebook Ad Campaigns feature. To get the outreach_id, first use the list_facebook_ads action to retrieve available ads.",
    toolSlug: "MAILCHIMP_GET_FACEBOOK_AD_INFO",
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
          description: "A list of fields to return. Reference sub-object parameters with dot notation. Example: ['id', 'name', 'status', 'audience.email_source']. If not specified, all fields are returned.",
        },
        outreach_id: {
          type: "string",
          description: "The unique identifier for the Facebook ad. This ID can be obtained from the list_facebook_ads action response, where it is returned as the 'id' field for each ad.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Reference sub-object parameters with dot notation. Example: ['_links']. Cannot be used together with 'fields'.",
        },
      },
      required: [
        "outreach_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "facebookads",
    ],
  }),
  composioTool({
    name: "mailchimp_get_facebook_ad_report",
    description: "Retrieve detailed performance report for a specific Facebook ad campaign. Returns comprehensive metrics including impressions, clicks, reach, engagement, budget information, content details, and ecommerce performance data. The report provides insights into ad effectiveness and ROI. Note: Requires a valid outreach_id which can be obtained from the list_facebook_ads or list_facebook_ads_reports endpoints.",
    toolSlug: "MAILCHIMP_GET_FACEBOOK_AD_REPORT",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation (e.g., 'report_summary.opens', 'budget.amount'). If not specified, all fields are returned.",
        },
        outreach_id: {
          type: "string",
          description: "The unique identifier of the Facebook ad to retrieve the report for. This ID can be obtained from the list_facebook_ads or list_facebook_ads_reports endpoints.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude from the response. Reference parameters of sub-objects with dot notation (e.g., '_links', 'content'). ",
        },
      },
      required: [
        "outreach_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_get_file",
    description: "Retrieve detailed information about a specific file in the Mailchimp File Manager. Returns file metadata including the file's unique ID, name, type, size, URLs for accessing the file (full-size and thumbnail), upload timestamp, and dimensions for image files. Use this action to get the public URL of a file for use in campaigns or to verify file details. Prerequisites: - You need a valid file_id. Use MAILCHIMP_LIST_STORED_FILES to get available file IDs. Returns: - File metadata including id, name, type, size, URLs, and dimensions (for images) - HATEOAS links for related operations (update, delete) Common use cases: - Get the public URL of an uploaded image for use in email campaigns - Verify file upload succeeded and get file details - Check file dimensions before using in templates",
    toolSlug: "MAILCHIMP_GET_FILE",
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
          description: "A list of specific fields to include in the response. Use dot notation for nested fields (e.g., ['id', 'name', 'full_size_url']). If not specified, all fields are returned.",
        },
        file_id: {
          type: "string",
          description: "The unique numeric ID of the file in the File Manager. You can obtain file IDs by using the 'List stored files' action (MAILCHIMP_LIST_STORED_FILES) which returns all files with their IDs.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for nested fields (e.g., ['_links'] to exclude HATEOAS links). Cannot be used together with 'fields' parameter.",
        },
      },
      required: [
        "file_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "filemanager",
    ],
  }),
  composioTool({
    name: "mailchimp_get_folder",
    description: "Get information about a specific folder in the File Manager.",
    toolSlug: "MAILCHIMP_GET_FOLDER",
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
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation. Example: ['id', 'name', 'file_count'].",
        },
        folder_id: {
          type: "string",
          description: "The unique ID for the File Manager folder. Get folder IDs using the List Folders action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Reference parameters of sub-objects with dot notation. Example: ['_links'] to exclude HATEOAS links.",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "filemanager",
    ],
  }),
  composioTool({
    name: "mailchimp_get_growth_history_by_month",
    description: "Retrieves detailed growth statistics for a Mailchimp audience/list for a specific month. Returns subscriber metrics including existing members, new opt-ins, imports, unsubscribes, cleaned (bounced), pending, deleted, and transactional members. The month parameter must be in YYYY-MM format. Note: Returns 404 if no growth history data exists for the specified month - use 'List growth history data' action first to check available months.",
    toolSlug: "MAILCHIMP_GET_GROWTH_HISTORY_BY_MONTH",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        month: {
          type: "string",
          description: "The month to retrieve growth history for in YYYY-MM format (e.g., '2024-01' for January 2024). Returns 404 if no growth data exists for the specified month.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list (e.g., 'abc123def4'). Use the 'List all lists' action to get available list IDs.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "list_id",
        "month",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_information_about_all_surveys_for_a_list",
    description: "Get information about all available surveys for a specific list.",
    toolSlug: "MAILCHIMP_GET_INFORMATION_ABOUT_ALL_SURVEYS_FOR_A_LIST",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_interest_category_info",
    description: "Get detailed information about a specific interest category within a Mailchimp list/audience. Interest categories are groups of interests (preferences) that subscribers can select on signup forms. The type field determines how interests are displayed: checkboxes (multi-select), dropdown (single-select), radio (single-select), or hidden (internal tracking only).",
    toolSlug: "MAILCHIMP_GET_INTEREST_CATEGORY_INFO",
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
          description: "A list of fields to return. Available fields: id, list_id, title, display_order, type, _links. Use dot notation for sub-object fields (e.g., '_links.rel').",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list/audience. Can be obtained from the List Lists action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., '_links' to exclude all links).",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category. Can be obtained from the List Interest Categories action.",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_interest_in_category",
    description: "Retrieve details of a specific interest (group) within an interest category for a Mailchimp list.",
    toolSlug: "MAILCHIMP_GET_INTEREST_IN_CATEGORY",
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
          description: "A list of fields to return. Available fields include: id, name, category_id, list_id, subscriber_count, display_order, _links. Use dot notation for nested fields.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list (audience).",
        },
        interest_id: {
          type: "string",
          description: "The unique ID for the specific interest (group) within the category.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for nested fields (e.g., '_links' to exclude HATEOAS links).",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category within the list.",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
        "interest_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_landing_page_content",
    description: "Get the HTML content for a specific Mailchimp landing page by its unique page ID.",
    toolSlug: "MAILCHIMP_GET_LANDING_PAGE_CONTENT",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        page_id: {
          type: "string",
          description: "The unique identifier for the landing page. Can be obtained from the list_landing_pages action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "landingpages",
    ],
  }),
  composioTool({
    name: "mailchimp_get_landing_page_info",
    description: "Retrieve detailed information about a specific Mailchimp landing page including its name, title, status, tracking settings, and associated list.",
    toolSlug: "MAILCHIMP_GET_LANDING_PAGE_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        page_id: {
          type: "string",
          description: "The unique identifier for the landing page. Can be obtained from the List Landing Pages action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "landingpages",
    ],
  }),
  composioTool({
    name: "mailchimp_get_landing_page_report",
    description: "Get analytics report for a specific landing page. Returns detailed statistics including total visits, clicks, and time-series data (daily and weekly). For e-commerce enabled pages, also includes revenue and order data. Use the list_landing_pages action to get available landing page IDs.",
    toolSlug: "MAILCHIMP_GET_LANDING_PAGE_REPORT",
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
          description: "A list of fields to return in the response. Available fields include: id, name, title, published_at, unpublished_at, status, list_id, visits, clicks, timeseries, ecommerce, web_id, list_name, signup_tags, _links. Use dot notation for nested fields (e.g., 'timeseries.daily_stats').",
        },
        outreach_id: {
          type: "string",
          description: "The unique identifier for the landing page. This is the 'id' field returned from the list_landing_pages action (e.g., '030001b4e1f0').",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Useful for excluding large nested objects like 'timeseries' or '_links' to reduce response size.",
        },
      },
      required: [
        "outreach_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_get_latest_chimp_chatter",
    description: "Return the Chimp Chatter for this account ordered by most recent.",
    toolSlug: "MAILCHIMP_GET_LATEST_CHIMP_CHATTER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of activity records to return. Default value is 10. Maximum value is 1000.",
        },
        offset: {
          type: "integer",
          description: "Used for pagination, the number of records from a collection to skip. Default value is 0.",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "activityfeed",
    ],
  }),
  composioTool({
    name: "mailchimp_get_list_info",
    description: "Get information about a specific list in your Mailchimp account. Results include list members who have signed up but haven't confirmed their subscription yet and unsubscribed or cleaned.",
    toolSlug: "MAILCHIMP_GET_LIST_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        include_total_contacts: {
          type: "boolean",
          description: "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state. ",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_lists_info",
    description: "Get information about all lists in the account.",
    toolSlug: "MAILCHIMP_GET_LISTS_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        email: {
          type: "string",
          description: "Restrict results to lists that include a specific subscriber\"s email address. ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "date_created",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        since_date_created: {
          type: "string",
          description: "Restrict results to lists created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_date_created: {
          type: "string",
          description: "Restrict response to lists created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        has_ecommerce_store: {
          type: "boolean",
          description: "Restrict results to lists that contain an active, connected, undeleted ecommerce store. ",
        },
        include_total_contacts: {
          type: "boolean",
          description: "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state. ",
        },
        since_campaign_last_sent: {
          type: "string",
          description: "Restrict results to lists created after the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_campaign_last_sent: {
          type: "string",
          description: "Restrict results to lists created before the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_member_info",
    description: "Get information about a specific list member, including a currently subscribed, unsubscribed, or bounced member.",
    toolSlug: "MAILCHIMP_GET_MEMBER_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "Fields to return. Can be a list or comma-separated string. Use field names for top-level fields (e.g., 'email_address', 'status') or entire sub-objects (e.g., 'merge_fields'). Use dot notation for specific nested fields (e.g., 'merge_fields.FNAME'). Example: ['email_address', 'status', 'merge_fields'] or 'email_address,status,merge_fields'.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience). Can be found via the lists endpoint.",
        },
        exclude_fields: {
          type: "string",
          description: "Fields to exclude. Can be a list or comma-separated string. Use field names for top-level fields or sub-objects (e.g., '_links', 'location'). Use dot notation for nested fields. Example: ['_links', 'location'] or '_links,location'.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts the member's email address directly or their contact_id.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_member_note",
    description: "Retrieve a specific note attached to a list member in Mailchimp. Notes are internal annotations that can be added to subscriber records for tracking conversations, preferences, or other relevant information. This endpoint returns the full details of a single note by its ID.",
    toolSlug: "MAILCHIMP_GET_MEMBER_NOTE",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation (e.g., 'note', 'created_at', 'created_by').",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list (audience). You can find this in your Mailchimp account under Audience > Settings > Audience name and defaults.",
        },
        note_id: {
          type: "string",
          description: "The unique numeric ID for the note. Can be obtained from the list_recent_member_notes endpoint.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation (e.g., '_links').",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts the member's email address directly or their contact_id.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
        "note_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_merge_field",
    description: "Retrieve details about a specific merge field (custom audience field) for a Mailchimp list. Merge fields are custom data fields like First Name (FNAME), Last Name (LNAME), Address, etc. that store subscriber information. Use this to get configuration details including field type, display settings, and type-specific options.",
    toolSlug: "MAILCHIMP_GET_MERGE_FIELD",
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
          description: "List of specific fields to return. Use dot notation for nested fields. Example: ['merge_id', 'name', 'type'].",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience (list). Example: 'af9d6415f0'.",
        },
        merge_id: {
          type: "string",
          description: "The numeric ID of the merge field to retrieve. Merge fields are custom fields like FNAME, LNAME, etc. Example: '1' for FNAME.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from the response. Use dot notation for nested fields. Example: ['_links', 'options'].",
        },
      },
      required: [
        "list_id",
        "merge_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_message",
    description: "The conversation endpoint is outdated and replaced by Inbox, which isn't supported by it. Historical conversation data is accessible, but new replies and Inbox messages are not.",
    toolSlug: "MAILCHIMP_GET_MESSAGE",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        message_id: {
          type: "string",
          description: "The unique id for the conversation message.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        conversation_id: {
          type: "string",
          description: "The unique id for the conversation.",
        },
      },
      required: [
        "conversation_id",
        "message_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "conversations",
    ],
  }),
  composioTool({
    name: "mailchimp_get_opened_campaign_subscriber",
    description: "Get information about a specific subscriber who opened a campaign.",
    toolSlug: "MAILCHIMP_GET_OPENED_CAMPAIGN_SUBSCRIBER",
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
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation (e.g., ['campaign_id', 'email_address', 'opens_count']).",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. The campaign must have been sent to have open data.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude. Reference parameters of sub-objects with dot notation (e.g., ['_links', 'merge_fields']).",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address.",
        },
      },
      required: [
        "campaign_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_order_info",
    description: "Get information about a specific order.",
    toolSlug: "MAILCHIMP_GET_ORDER_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        order_id: {
          type: "string",
          description: "The id for the order in a store.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
        "order_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_order_line_item",
    description: "Get information about a specific order line item.",
    toolSlug: "MAILCHIMP_GET_ORDER_LINE_ITEM",
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
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation (e.g., ['id', 'product_id', 'price']).",
        },
        line_id: {
          type: "string",
          description: "The unique identifier for the line item within the order.",
        },
        order_id: {
          type: "string",
          description: "The unique identifier for the order within the store.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Reference parameters of sub-objects with dot notation (e.g., ['_links']).",
        },
      },
      required: [
        "store_id",
        "order_id",
        "line_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_product_image_info",
    description: "Retrieve detailed information about a specific product image in a Mailchimp e-commerce store. Returns the image's URL, associated variant IDs, and API links for related operations. Requires valid store_id, product_id, and image_id. Returns 404 if any ID is not found.",
    toolSlug: "MAILCHIMP_GET_PRODUCT_IMAGE_INFO",
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
          description: "List of fields to return in the response. Use dot notation for nested fields (e.g., ['id', 'url', 'variant_ids']). If not specified, all fields are returned.",
        },
        image_id: {
          type: "string",
          description: "The unique identifier for the product image to retrieve (e.g., 'image_001').",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store in Mailchimp (e.g., 'my_store_001').",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product within the specified store (e.g., 'product_123').",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from the response. Use dot notation for nested fields (e.g., ['variant_ids', '_links']). Cannot be used together with 'fields'.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "image_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_product_info",
    description: "Get information about a specific product.",
    toolSlug: "MAILCHIMP_GET_PRODUCT_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        product_id: {
          type: "string",
          description: "The id for the product of a store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
        "product_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_product_variant_info",
    description: "Retrieve detailed information about a specific product variant from a Mailchimp e-commerce store. Returns variant details including title, SKU, price, inventory quantity, and URLs. Requires valid store_id, product_id, and variant_id. Use LIST_STORES, LIST_PRODUCT, and LIST_PRODUCT_VARIANTS to find the required identifiers.",
    toolSlug: "MAILCHIMP_GET_PRODUCT_VARIANT_INFO",
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
          description: "A list of fields to return. Use dot notation for sub-object fields (e.g., ['id', 'title', 'price']). If omitted, all fields are returned.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use LIST_STORES to find available store IDs.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product within the store. Use LIST_PRODUCT to find product IDs for a given store.",
        },
        variant_id: {
          type: "string",
          description: "The unique identifier for the product variant. Use LIST_PRODUCT_VARIANTS to find variant IDs for a given product.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., ['_links']). Useful for reducing response size.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "variant_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_promo_code",
    description: "Retrieve detailed information about a specific promo code. Returns the promo code details including its code string, redemption URL, usage count, enabled status, and timestamps. Promo codes are associated with promo rules within e-commerce stores.",
    toolSlug: "MAILCHIMP_GET_PROMO_CODE",
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
          description: "A list of fields to return in the response. Use dot notation for sub-object fields (e.g., ['id', 'code', 'enabled']). If not specified, all fields are returned.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store in Mailchimp.",
        },
        promo_code_id: {
          type: "string",
          description: "The unique identifier for the specific promo code to retrieve.",
        },
        promo_rule_id: {
          type: "string",
          description: "The unique identifier for the promo rule that the promo code belongs to.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., ['_links'] to exclude link information). Cannot be used with 'fields'.",
        },
      },
      required: [
        "store_id",
        "promo_rule_id",
        "promo_code_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_promo_rule",
    description: "Get information about a specific promo rule.",
    toolSlug: "MAILCHIMP_GET_PROMO_RULE",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        promo_rule_id: {
          type: "string",
          description: "The id for the promo rule of a store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
        "promo_rule_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_segment_info",
    description: "Get information about a specific segment.",
    toolSlug: "MAILCHIMP_GET_SEGMENT_INFO",
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
          description: "A list of fields to return in the response. Use dot notation for sub-objects (e.g., 'options.match'). Example: ['id', 'name', 'member_count'].",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience). Can be obtained from the List Lists (audiences) action.",
        },
        segment_id: {
          type: "string",
          description: "The unique numeric ID for the segment. Can be obtained from the List Segments action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-objects (e.g., '_links'). Example: ['_links', 'options'].",
        },
        include_cleaned: {
          type: "boolean",
          description: "Include cleaned (bounced/invalid) members in the member_count. Defaults to true.",
        },
        include_unsubscribed: {
          type: "boolean",
          description: "Include unsubscribed members in the member_count. Defaults to false.",
        },
        include_transactional: {
          type: "boolean",
          description: "Include transactional members (non-subscribed contacts who received transactional emails) in the member_count. Defaults to false.",
        },
      },
      required: [
        "list_id",
        "segment_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_store_info",
    description: "Get information about a specific store.",
    toolSlug: "MAILCHIMP_GET_STORE_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_get_subscriber_email_activity",
    description: "Get a specific list member's email activity in a sent campaign, including opens, clicks, bounces, and unsubscribes. The campaign must have been sent and the subscriber must have been a recipient for data to be available. Returns 404 if the campaign hasn't been sent or if the subscriber wasn't a recipient.",
    toolSlug: "MAILCHIMP_GET_SUBSCRIBER_EMAIL_ACTIVITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        since: {
          type: "string",
          description: "Restrict results to email activity events that occur after a specific time. Uses ISO 8601 time format (e.g., '2015-10-21T15:41:36+00:00').",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation (e.g., ['email_id', 'activity.action']).",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. The campaign must have been sent to have email activity data.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude. Reference parameters of sub-objects with dot notation (e.g., ['_links']).",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. The subscriber must have been a recipient of the campaign.",
        },
      },
      required: [
        "campaign_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_subscriber_removed_from_workflow",
    description: "Get information about a specific subscriber who was removed from a classic automation workflow. Returns the subscriber's email address and workflow details. The subscriber must have been previously removed using the remove_subscriber_from_workflow action. Returns 404 if the subscriber is not found in the removed subscribers list.",
    toolSlug: "MAILCHIMP_GET_SUBSCRIBER_REMOVED_FROM_WORKFLOW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique ID for the Automation workflow. Can be obtained from the list_automations action.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. For example, for 'example@email.com', compute md5('example@email.com'.lower()).",
        },
      },
      required: [
        "workflow_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_get_survey",
    description: "Retrieves detailed information about a specific survey associated with a Mailchimp audience (list). Returns survey metadata including its title, status, URL, timestamps, total response count, and the list of questions. Prerequisites: The survey must exist on the specified list. Surveys are created through the Mailchimp web interface, not via the API. Use 'Get information about all surveys for a list' to find available survey IDs for a given audience.",
    toolSlug: "MAILCHIMP_GET_SURVEY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID of the Mailchimp audience (list) containing the survey. You can get this from the 'Get lists info' action or from your Mailchimp dashboard under Audience > Settings > Audience name and defaults.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID of the survey to retrieve. You can get this from the 'Get information about all surveys for a list' action. Surveys must be created in the Mailchimp web interface before using this action.",
        },
      },
      required: [
        "list_id",
        "survey_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "surveys",
    ],
  }),
  composioTool({
    name: "mailchimp_get_survey_question_report",
    description: "Retrieves detailed reporting data for a specific question in a survey. Returns the question text, type, total response count, and for multiple choice questions, the breakdown of responses per option including counts. For rating questions, includes the average rating. Prerequisites: The survey and question must exist in your Mailchimp account. Surveys are created through the Mailchimp web interface, not via the API. Use 'List survey reports' to find survey IDs and 'List survey question reports' to find question IDs. Note: This action returns aggregated statistics for a single question. For detailed individual answers to a question, use 'List answers for question'. For the overall survey report, use 'Get survey report'.",
    toolSlug: "MAILCHIMP_GET_SURVEY_QUESTION_REPORT",
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
          description: "A list of fields to include in the response. Use dot notation for nested fields (e.g., ['id', 'question', 'type', 'total_responses']). If not specified, all fields are returned.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID of the survey containing the question. You can obtain survey IDs from the 'List survey reports' action which returns all surveys with reports in your account.",
        },
        question_id: {
          type: "string",
          description: "The unique ID of the survey question to retrieve the report for. You can obtain question IDs from the 'List survey question reports' action which returns all questions for a specific survey.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for nested fields (e.g., ['_links']). Cannot be used together with the 'fields' parameter.",
        },
      },
      required: [
        "survey_id",
        "question_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_get_survey_report",
    description: "Retrieves detailed reporting data for a specific survey. Returns survey metadata including its title, status, public URL, creation/publication timestamps, total response count, and the associated audience information. Prerequisites: The survey must exist in your Mailchimp account. Surveys are created through the Mailchimp web interface, not via the API. Use 'List survey reports' to find available survey IDs for surveys that have report data. Note: This action returns report-level summary data. For detailed question-level reports, use 'List survey question reports'. For individual response data, use 'List survey responses'.",
    toolSlug: "MAILCHIMP_GET_SURVEY_REPORT",
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
          description: "A list of fields to include in the response. Use dot notation for nested fields (e.g., ['id', 'title', 'total_responses']). If not specified, all fields are returned.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID of the survey to retrieve report data for. You can obtain survey IDs from the 'List survey reports' action which returns all surveys with reports in your account.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for nested fields (e.g., ['_links']). Cannot be used with 'fields' parameter.",
        },
      },
      required: [
        "survey_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_get_survey_response",
    description: "Retrieve a single survey response by its ID. Returns detailed information about the respondent's answers to all questions in the survey. This endpoint is useful for examining individual responses in detail, including the respondent's contact information and all their answers. Prerequisites: You must have an existing survey with at least one response. Surveys are created through the Mailchimp web interface and cannot be created via API.",
    toolSlug: "MAILCHIMP_GET_SURVEY_RESPONSE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        survey_id: {
          type: "string",
          description: "The unique identifier for the survey. You can get this ID from the 'List survey reports' action (/reporting/surveys) or from the 'Get information about all surveys for a list' action.",
        },
        response_id: {
          type: "string",
          description: "The unique identifier for a specific survey response. You can get this ID from the 'List survey responses' action (/reporting/surveys/{survey_id}/responses).",
        },
      },
      required: [
        "survey_id",
        "response_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_get_template_folder",
    description: "Retrieve information about a specific template folder in Mailchimp. Template folders are used to organize email templates. This action returns the folder's name, unique ID, the count of templates it contains, and HATEOAS links for related operations (update, delete, list templates). Use this action when you need to: - Get details about a specific template folder - Check how many templates are in a folder - Retrieve links to related operations for the folder",
    toolSlug: "MAILCHIMP_GET_TEMPLATE_FOLDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "A comma-separated list of fields to return. Available fields: 'id', 'name', 'count', '_links'. Use dot notation for nested fields (e.g., '_links.rel'). If not specified, all fields are returned.",
        },
        folder_id: {
          type: "string",
          description: "The unique ID of the template folder to retrieve. This ID can be obtained from the 'list_template_folders' action or from the response when creating a folder with 'add_template_folder'.",
        },
        exclude_fields: {
          type: "string",
          description: "A comma-separated list of fields to exclude from the response. Available fields: 'id', 'name', 'count', '_links'. Use dot notation for nested fields (e.g., '_links.rel').",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "templatefolders",
    ],
  }),
  composioTool({
    name: "mailchimp_get_template_info",
    description: "Get information about a specific template.",
    toolSlug: "MAILCHIMP_GET_TEMPLATE_INFO",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'id,name,type' or 'id,name,thumbnail'. ",
        },
        template_id: {
          type: "string",
          description: "The unique id for the template. Can be obtained from the list_templates action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Example: '_links' to exclude HATEOAS links. ",
        },
      },
      required: [
        "template_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "mailchimp_get_unsubscribed_member",
    description: "Get detailed information about a specific list member who unsubscribed from a campaign. This endpoint retrieves unsubscribe details for a member identified by their subscriber hash (MD5 of lowercase email) from a specific campaign's report. The campaign must have been sent and the member must have unsubscribed from it. Use the List Unsubscribed Members endpoint first to find valid subscriber hashes for a campaign. Returns 404 if the subscriber hash is not found in the campaign's unsubscribe list.",
    toolSlug: "MAILCHIMP_GET_UNSUBSCRIBED_MEMBER",
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
          description: "A list of fields to return in the response. Use dot notation for sub-object fields (e.g., ['email_address', 'merge_fields.FNAME']). If not provided, all fields are returned.",
        },
        campaign_id: {
          type: "string",
          description: "The unique identifier for the campaign. This is the campaign from which the member unsubscribed. You can get campaign IDs from the List Campaigns endpoint.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., ['_links']). Cannot be used together with 'fields' parameter.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. For example, for 'user@example.com', use MD5('user@example.com'). You can get subscriber hashes from the List Unsubscribed Members endpoint.",
        },
      },
      required: [
        "campaign_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_get_webhook_info",
    description: "Get information about a specific webhook for a Mailchimp list (audience). Returns the webhook's URL, enabled events (subscribe, unsubscribe, profile, cleaned, upemail, campaign), and trigger sources (user, admin, api).",
    toolSlug: "MAILCHIMP_GET_WEBHOOK_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list (audience). Use MAILCHIMP_GET_LISTS_INFO to retrieve available list IDs.",
        },
        webhook_id: {
          type: "string",
          description: "The unique ID of the webhook. Use MAILCHIMP_LIST_WEBHOOKS to retrieve available webhook IDs for a list.",
        },
      },
      required: [
        "list_id",
        "webhook_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_get_workflow_email_info",
    description: "Get information about an individual classic automation workflow email.",
    toolSlug: "MAILCHIMP_GET_WORKFLOW_EMAIL_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique ID for the Automation workflow. Can be obtained from the list_automations action.",
        },
        workflow_email_id: {
          type: "string",
          description: "The unique ID for the Automation workflow email. Can be obtained from the list_automated_emails action.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_list_abuse_reports",
    description: "Get all abuse reports for a specific list.",
    toolSlug: "MAILCHIMP_LIST_ABUSE_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_account_exports",
    description: "Get a list of account exports for a given account.",
    toolSlug: "MAILCHIMP_LIST_ACCOUNT_EXPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "accountexports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_account_orders",
    description: "Get information about an account's orders.",
    toolSlug: "MAILCHIMP_LIST_ACCOUNT_ORDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000.",
        },
        fields: {
          type: "string",
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'orders.id,orders.customer.email_address'.",
        },
        offset: {
          type: "integer",
          description: "Used for pagination, this is the number of records from a collection to skip. Default value is 0.",
        },
        campaign_id: {
          type: "string",
          description: "Restrict results to orders with a specific campaign_id value.",
        },
        customer_id: {
          type: "string",
          description: "Restrict results to orders made by a specific customer.",
        },
        outreach_id: {
          type: "string",
          description: "Restrict results to orders with a specific outreach_id value.",
        },
        has_outreach: {
          type: "boolean",
          description: "Restrict results to orders that have an outreach attached (e.g., email campaign or Facebook ad).",
        },
        exclude_fields: {
          type: "string",
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Example: 'orders._links'.",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_answers_for_question",
    description: "Retrieves all answers submitted for a specific question in a Mailchimp survey. This endpoint is part of the Reporting API and provides detailed response data for survey analysis. Use this to analyze how respondents answered a particular question, including their contact information and submission timestamps. Prerequisites: - The survey must exist and have been published to collect responses - Surveys are created through the Mailchimp web interface, not via API - Use 'List survey reports' to find available survey IDs - Use 'List survey question reports' to find question IDs for a specific survey Returns a list of answers with respondent details and the answer values.",
    toolSlug: "MAILCHIMP_LIST_ANSWERS_FOR_QUESTION",
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
          description: "A comma-separated list of fields to return. Use dot notation for nested fields (e.g., 'answers.contact.email_address'). If not specified, all fields are returned.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID of the survey. You can get this from the 'List survey reports' action or from 'Get information about all surveys for a list'. Surveys must be created in the Mailchimp web interface.",
        },
        question_id: {
          type: "string",
          description: "The unique ID of the survey question. You can get this from the 'List survey question reports' action by providing the survey_id.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude from the response. Use dot notation for nested fields (e.g., 'answers._links'). Cannot be used with 'fields' parameter.",
        },
        respondent_familiarity_is: {
          type: "string",
          description: "Filter type for respondent familiarity with your brand.",
          enum: [
            "new",
            "known",
            "unknown",
          ],
        },
      },
      required: [
        "survey_id",
        "question_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_list_api_root_resources",
    description: "Get Mailchimp account details and links to all available API resources. Returns account information including account ID, name, email, contact details, pricing plan, and subscriber count, along with navigation links to other API endpoints like lists, campaigns, automations, templates, and more.",
    toolSlug: "MAILCHIMP_LIST_API_ROOT_RESOURCES",
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
          description: "List of fields to include in the response. Use dot notation for nested fields (e.g., 'contact.company'). Available fields include: account_id, account_name, email, first_name, last_name, username, role, member_since, pricing_plan_type, account_timezone, contact, total_subscribers, _links.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from the response. Use dot notation for nested fields (e.g., 'contact.company'). Commonly excluded: _links (to reduce response size).",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "root",
    ],
  }),
  composioTool({
    name: "mailchimp_list_authorized_apps",
    description: "Get a list of an account's registered, connected applications.",
    toolSlug: "MAILCHIMP_LIST_AUTHORIZED_APPS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "authorizedapps",
    ],
  }),
  composioTool({
    name: "mailchimp_list_automated_email_subscribers",
    description: "Get information about a classic automation email queue.",
    toolSlug: "MAILCHIMP_LIST_AUTOMATED_EMAIL_SUBSCRIBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique id for the Automation workflow.",
        },
        workflow_email_id: {
          type: "string",
          description: "The unique id for the Automation workflow email.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_list_automated_emails",
    description: "Get a summary of the emails in a classic automation workflow.",
    toolSlug: "MAILCHIMP_LIST_AUTOMATED_EMAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique id for the Automation workflow.",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_list_automations",
    description: "Get a summary of an account's classic automations.",
    toolSlug: "MAILCHIMP_LIST_AUTOMATIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        status: {
          type: "string",
          description: "Restrict the results to automations with the specified status.",
          enum: [
            "save",
            "paused",
            "sending",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        since_start_time: {
          type: "string",
          description: "Restrict the response to automations started after this time. Uses the ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_start_time: {
          type: "string",
          description: "Restrict the response to automations started before this time. Uses the ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        since_create_time: {
          type: "string",
          description: "Restrict the response to automations created after this time. Uses the ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_create_time: {
          type: "string",
          description: "Restrict the response to automations created before this time. Uses the ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_list_batch_requests",
    description: "Get a summary of batch requests that have been made.",
    toolSlug: "MAILCHIMP_LIST_BATCH_REQUESTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "batches",
    ],
  }),
  composioTool({
    name: "mailchimp_list_batch_webhooks",
    description: "Get all webhooks that have been configured for batches.",
    toolSlug: "MAILCHIMP_LIST_BATCH_WEBHOOKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "batchwebhooks",
    ],
  }),
  composioTool({
    name: "mailchimp_list_campaign_feedback",
    description: "Get team feedback while you're working together on a Mailchimp campaign.",
    toolSlug: "MAILCHIMP_LIST_CAMPAIGN_FEEDBACK",
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
          description: "A list of fields to include in the response. Use dot notation for nested fields (e.g., 'feedback.message', 'feedback.feedback_id', 'total_items'). If not specified, all fields are returned.",
        },
        campaign_id: {
          type: "string",
          description: "The unique identifier for the campaign. This is a 10-character alphanumeric string (e.g., 'cdf16ea7a1'). You can obtain campaign IDs from the list campaigns action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for nested fields (e.g., 'feedback._links', '_links'). Useful for reducing response size.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "mailchimp_list_campaign_folders",
    description: "Get all folders used to organize campaigns.",
    toolSlug: "MAILCHIMP_LIST_CAMPAIGN_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaignfolders",
    ],
  }),
  composioTool({
    name: "mailchimp_list_campaign_open_details",
    description: "Get detailed information about any campaign emails that were opened by a list member.",
    toolSlug: "MAILCHIMP_LIST_CAMPAIGN_OPEN_DETAILS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        since: {
          type: "string",
          description: "Restrict results to campaign open events that occur after a specific time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Returns open reports sorted by the specified field.",
          enum: [
            "opens_count",
          ],
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_campaign_product_activity",
    description: "Get breakdown of product activity for a campaign",
    toolSlug: "MAILCHIMP_LIST_CAMPAIGN_PRODUCT_ACTIVITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        sort_field: {
          type: "string",
          description: "Returns products sorted by the specified field (title, total_revenue, or total_purchased).",
          enum: [
            "title",
            "total_revenue",
            "total_purchased",
          ],
        },
        campaign_id: {
          type: "string",
          description: "The unique ID for a sent campaign. The campaign must have e-commerce tracking enabled and associated orders to return product activity data.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_campaign_recipients",
    description: "Get information about campaign recipients.",
    toolSlug: "MAILCHIMP_LIST_CAMPAIGN_RECIPIENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_campaign_reports",
    description: "Retrieve analytics reports for sent email campaigns. Returns performance metrics including opens, clicks, bounces, unsubscribes, and e-commerce data for campaigns that have been sent.",
    toolSlug: "MAILCHIMP_LIST_CAMPAIGN_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Filter by campaign type. Options: 'regular' (standard email), 'plaintext' (text-only), 'absplit' (A/B test), 'rss' (RSS-driven), 'variate' (multivariate test).",
          enum: [
            "regular",
            "plaintext",
            "absplit",
            "rss",
            "variate",
          ],
        },
        count: {
          type: "integer",
          description: "Number of campaign reports to return per page. Default: 10, Maximum: 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to include in response (e.g., ['reports.id', 'reports.campaign_title', 'total_items']). Use dot notation for nested fields.",
        },
        offset: {
          type: "integer",
          description: "Number of records to skip for pagination. Default: 0. Use with 'count' to paginate through results.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from response (e.g., ['_links']). Use dot notation for nested fields.",
        },
        since_send_time: {
          type: "string",
          description: "Restrict the response to campaigns sent after the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_send_time: {
          type: "string",
          description: "Restrict the response to campaigns sent before the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_campaigns",
    description: "Get all campaigns in an account.",
    toolSlug: "MAILCHIMP_LIST_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The campaign type.",
          enum: [
            "regular",
            "plaintext",
            "absplit",
            "rss",
            "variate",
          ],
        },
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        status: {
          type: "string",
          description: "The status of the campaign.",
          enum: [
            "save",
            "paused",
            "schedule",
            "sending",
            "sent",
          ],
        },
        list_id: {
          type: "string",
          description: "The unique id for the list.",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        folder_id: {
          type: "string",
          description: "The unique folder id.",
        },
        member_id: {
          type: "string",
          description: "Retrieve campaigns sent to a particular list member. Member ID is The MD5 hash of the lowercase version of the list member’s email address. ",
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "create_time",
            "send_time",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        since_send_time: {
          type: "string",
          description: "Restrict the response to campaigns sent after the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_send_time: {
          type: "string",
          description: "Restrict the response to campaigns sent before the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        since_create_time: {
          type: "string",
          description: "Restrict the response to campaigns created after the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_create_time: {
          type: "string",
          description: "Restrict the response to campaigns created before the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        include_resend_shortcut_eligibility: {
          type: "boolean",
          description: "Return the `resend_shortcut_eligibility` field in the response, which tells you if the campaign is eligible for the various Campaign Resend Shortcuts offered. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "campaigns",
    ],
  }),
  composioTool({
    name: "mailchimp_list_cart_line_items",
    description: "Retrieve all line items in a shopping cart. Returns a list of products/variants that have been added to a specific cart in an e-commerce store. Each line item includes product details, variant info, quantity, and price. Useful for abandoned cart workflows and order management.",
    toolSlug: "MAILCHIMP_LIST_CART_LINE_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of line item records to return. Default value is 10. Maximum value is 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return in the response. Use dot notation to reference sub-object fields (e.g., 'lines.id', 'lines.product_id', 'total_items').",
        },
        offset: {
          type: "integer",
          description: "The number of records to skip for pagination. Default value is 0. Use with 'count' to paginate through large result sets.",
        },
        cart_id: {
          type: "string",
          description: "The unique identifier of the cart whose line items you want to retrieve.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier of the e-commerce store containing the cart.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation to reference sub-object fields (e.g., '_links', 'lines._links').",
        },
      },
      required: [
        "store_id",
        "cart_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_carts",
    description: "Get information about a store's carts.",
    toolSlug: "MAILCHIMP_LIST_CARTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use the List Stores action to retrieve available store IDs.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_child_campaign_reports",
    description: "Get a list of child campaign reports for a specific parent campaign. This endpoint returns reports for child campaigns that are part of A/B split test (variate) or RSS campaigns. For regular campaigns, this will return an empty reports array with total_items=0 since they do not have child campaigns.",
    toolSlug: "MAILCHIMP_LIST_CHILD_CAMPAIGN_REPORTS",
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
          description: "A list of fields to return. Use dot notation for sub-object fields (e.g., 'reports.id', 'reports.campaign_title', 'reports.opens.opens_total').",
        },
        campaign_id: {
          type: "string",
          description: "The unique identifier for the parent campaign (10-character alphanumeric string).",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., '_links', 'reports._links').",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_clicked_link_subscribers",
    description: "Get information about list members who clicked on a specific link in a campaign. This action retrieves all subscribers who clicked on a particular tracked link within a sent campaign, including click counts and subscriber details. Prerequisites: 1. The campaign must have been sent (status='sent') with click tracking enabled 2. The link must exist in the campaign and have been clicked at least once To get the required IDs: 1. campaign_id: Use list_campaigns with status='sent' to find sent campaigns 2. link_id: Use list_campaign_details with the campaign_id to get urls_clicked array Returns empty members array if no subscribers clicked the link.",
    toolSlug: "MAILCHIMP_LIST_CLICKED_LINK_SUBSCRIBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default is 10. Maximum is 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to return. Available fields: email_id, email_address, clicks, campaign_id, url_id, list_id, list_is_active, contact_status, merge_fields, vip, _links. Reference sub-object parameters with dot notation (e.g., 'merge_fields.FNAME').",
        },
        offset: {
          type: "integer",
          description: "Number of records to skip for pagination. Default is 0.",
        },
        link_id: {
          type: "string",
          description: "The unique id for the tracked link. Get link IDs from list_campaign_details action which returns all clicked links in the 'urls_clicked' array with their 'id' field.",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. The campaign must have been sent (status='sent') and have click tracking enabled. Get campaign IDs from list_campaigns action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from the response. Useful for excluding verbose fields like '_links' or 'merge_fields' to reduce response size.",
        },
      },
      required: [
        "campaign_id",
        "link_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_connected_sites",
    description: "Get all connected sites in an account.",
    toolSlug: "MAILCHIMP_LIST_CONNECTED_SITES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "connectedsites",
    ],
  }),
  composioTool({
    name: "mailchimp_list_customers",
    description: "Get information about a store's customers.",
    toolSlug: "MAILCHIMP_LIST_CUSTOMERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. This is the custom ID you defined when creating the store via the Mailchimp API.",
        },
        email_address: {
          type: "string",
          description: "Restrict the response to customers with the email address.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_domain_performance_stats",
    description: "Get statistics for the top-performing email domains in a campaign.",
    toolSlug: "MAILCHIMP_LIST_DOMAIN_PERFORMANCE_STATS",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_eep_url_activity",
    description: "Get EepURL click activity for a campaign. EepURL is Mailchimp's shareable campaign archive link used for social media sharing. Returns referrer information including IP addresses/domains that clicked the link, click counts, and timestamps.",
    toolSlug: "MAILCHIMP_LIST_EEP_URL_ACTIVITY",
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
          description: "A list of fields to return in the response. Use dot notation for sub-object fields (e.g., 'referrers.clicks'). Available fields: referrers, eepurl, campaign_id, total_items, _links.",
        },
        campaign_id: {
          type: "string",
          description: "The unique identifier for the campaign. Get this from the LIST_CAMPAIGNS action.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., '_links'). Cannot be used together with 'fields'.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_email_activity",
    description: "Get a list of member's subscriber activity in a specific campaign.",
    toolSlug: "MAILCHIMP_LIST_EMAIL_ACTIVITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        since: {
          type: "string",
          description: "Restrict results to email activity events that occur after a specific time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_facebook_ads",
    description: "Get list of Facebook ads.",
    toolSlug: "MAILCHIMP_LIST_FACEBOOK_ADS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "created_at",
            "updated_at",
            "end_time",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "facebookads",
    ],
  }),
  composioTool({
    name: "mailchimp_list_facebook_ads_reports",
    description: "Get reports of Facebook ads.",
    toolSlug: "MAILCHIMP_LIST_FACEBOOK_ADS_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "created_at",
            "updated_at",
            "end_time",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_list_facebook_ecommerce_report",
    description: "Get breakdown of product activity for a Facebook ad outreach. Returns a paginated list of products with ecommerce activity metrics attributed to a specific Facebook ad campaign. Includes revenue, purchase counts, and recommendation data for each product. Note: Requires a valid outreach_id which can be obtained from the list_facebook_ads or list_facebook_ads_reports endpoints. The Facebook ad must have ecommerce tracking enabled with a connected store.",
    toolSlug: "MAILCHIMP_LIST_FACEBOOK_ECOMMERCE_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of product records to return. Default value is 10. Maximum value is 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation (e.g., 'products.title', 'products.total_revenue'). If not specified, all fields are returned.",
        },
        offset: {
          type: "integer",
          description: "Used for pagination - the number of records from the collection to skip. Default value is 0.",
        },
        sort_field: {
          type: "string",
          description: "Sort field options for ecommerce product activity.",
          enum: [
            "title",
            "total_revenue",
            "total_purchased",
          ],
        },
        outreach_id: {
          type: "string",
          description: "The unique identifier of the Facebook ad outreach to retrieve product activity for. This ID can be obtained from the list_facebook_ads or list_facebook_ads_reports endpoints.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude from the response. Reference parameters of sub-objects with dot notation (e.g., '_links', 'products._links').",
        },
      },
      required: [
        "outreach_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_list_folders",
    description: "Get a list of all folders in the File Manager.",
    toolSlug: "MAILCHIMP_LIST_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        created_by: {
          type: "string",
          description: "The Mailchimp account user who created the File Manager file.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        since_created_at: {
          type: "string",
          description: "Restrict the response to files created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_created_at: {
          type: "string",
          description: "Restrict the response to files created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "filemanager",
    ],
  }),
  composioTool({
    name: "mailchimp_list_growth_history_data",
    description: "Get a month-by-month summary of a specific list's growth activity.",
    toolSlug: "MAILCHIMP_LIST_GROWTH_HISTORY_DATA",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "month",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_interest_categories",
    description: "Get information about a list's interest categories.",
    toolSlug: "MAILCHIMP_LIST_INTEREST_CATEGORIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Restrict results a type of interest group",
        },
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_interests_in_category",
    description: "Get a list of this category's interests.",
    toolSlug: "MAILCHIMP_LIST_INTERESTS_IN_CATEGORY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category.",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_landing_pages",
    description: "Get all landing pages.",
    toolSlug: "MAILCHIMP_LIST_LANDING_PAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "created_at",
            "updated_at",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "landingpages",
    ],
  }),
  composioTool({
    name: "mailchimp_list_landing_pages_reports",
    description: "Get performance reports for landing pages. Returns analytics data including visits, unique visits, clicks, subscribes, and conversion rates for published landing pages. Only landing pages that have been published will appear in reports.",
    toolSlug: "MAILCHIMP_LIST_LANDING_PAGES_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default is 10. Maximum is 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to return in the response. Use dot notation for nested fields (e.g., 'landing_pages.id', 'landing_pages.name', 'total_items').",
        },
        offset: {
          type: "integer",
          description: "The number of records to skip for pagination. Default is 0.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from the response. Use dot notation for nested fields (e.g., '_links').",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_list_locations",
    description: "Get the locations (countries) that the list's subscribers have been tagged to based on geocoding their IP address.",
    toolSlug: "MAILCHIMP_LIST_LOCATIONS",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_member_events",
    description: "Get events for a contact.",
    toolSlug: "MAILCHIMP_LIST_MEMBER_EVENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member\"s email address. This endpoint also accepts a list member\"s email address or contact_id. ",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_member_goal_events",
    description: "Get the last 50 Goal events for a member on a specific list.",
    toolSlug: "MAILCHIMP_LIST_MEMBER_GOAL_EVENTS",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member\"s email address. This endpoint also accepts a list member\"s email address or contact_id. ",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_member_tags",
    description: "Get the tags on a list member.",
    toolSlug: "MAILCHIMP_LIST_MEMBER_TAGS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member\"s email address. This endpoint also accepts a list member\"s email address or contact_id. ",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_members_in_segment",
    description: "Get information about members in a saved segment.",
    toolSlug: "MAILCHIMP_LIST_MEMBERS_IN_SEGMENT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        segment_id: {
          type: "string",
          description: "The unique id for the segment.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        include_cleaned: {
          type: "boolean",
          description: "Include cleaned members in response",
        },
        include_unsubscribed: {
          type: "boolean",
          description: "Include unsubscribed members in response",
        },
        include_transactional: {
          type: "boolean",
          description: "Include transactional members in response",
        },
      },
      required: [
        "list_id",
        "segment_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_members_info",
    description: "Get information about members in a specific Mailchimp list.",
    toolSlug: "MAILCHIMP_LIST_MEMBERS_INFO",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        status: {
          type: "string",
          description: "The subscriber\"s status.",
          enum: [
            "subscribed",
            "unsubscribed",
            "cleaned",
            "pending",
            "transactional",
            "archived",
          ],
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        vip_only: {
          type: "boolean",
          description: "A filter to return only the list\"s VIP members. Passing `true` will restrict results to VIP list members, passing `false` will return all list members. ",
        },
        email_type: {
          type: "string",
          description: "The email type.",
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "timestamp_opt",
            "timestamp_signup",
            "last_changed",
          ],
        },
        interest_ids: {
          type: "string",
          description: "Used to filter list members by interests. Must be accompanied by interest_category_id and interest_match. The value must be a comma separated list of interest ids present for any supplied interest categories. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        interest_match: {
          type: "string",
          description: "Used to filter list members by interests. Must be accompanied by interest_category_id and interest_ids. \"any\" will match a member with any of the interest supplied, \"all\" will only match members with every interest supplied, and \"none\" will match members without any of the interest supplied. ",
          enum: [
            "any",
            "all",
            "none",
          ],
        },
        unique_email_id: {
          type: "string",
          description: "A unique identifier for the email address across all Mailchimp lists.",
        },
        since_last_changed: {
          type: "string",
          description: "Restrict results to subscribers whose information changed after the set timeframe. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        unsubscribed_since: {
          type: "string",
          description: "Filter subscribers by those unsubscribed since a specific date. Using any status other than unsubscribed with this filter will result in an error. ",
        },
        before_last_changed: {
          type: "string",
          description: "Restrict results to subscribers whose information changed before the set timeframe. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        since_last_campaign: {
          type: "boolean",
          description: "Filter subscribers by those subscribed/unsubscribed/pending/cleaned since last email campaign send. Member status is required to use this filter. ",
        },
        since_timestamp_opt: {
          type: "string",
          description: "Restrict results to subscribers who opted-in after the set timeframe. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_timestamp_opt: {
          type: "string",
          description: "Restrict results to subscribers who opted-in before the set timeframe. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        interest_category_id: {
          type: "string",
          description: "The unique id for the interest category.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_merge_fields",
    description: "Get a list of all merge fields for an audience.",
    toolSlug: "MAILCHIMP_LIST_MERGE_FIELDS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The merge field type.",
        },
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        required: {
          type: "boolean",
          description: "Whether it\"s a required merge field.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_order_line_items",
    description: "Get information about an order's line items.",
    toolSlug: "MAILCHIMP_LIST_ORDER_LINE_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return. Use dot notation for sub-object properties (e.g., ['lines.id', 'lines.price', 'lines.quantity']). When specified, only these fields are included in the response.",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        order_id: {
          type: "string",
          description: "The unique identifier for the order within the store.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object properties (e.g., ['lines._links']). When specified, these fields are omitted from the response.",
        },
      },
      required: [
        "store_id",
        "order_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_orders",
    description: "Get information about a store's orders.",
    toolSlug: "MAILCHIMP_LIST_ORDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        campaign_id: {
          type: "string",
          description: "Restrict results to orders with a specific `campaign_id` value.",
        },
        customer_id: {
          type: "string",
          description: "Restrict results to orders made by a specific customer.",
        },
        outreach_id: {
          type: "string",
          description: "Restrict results to orders with a specific `outreach_id` value.",
        },
        has_outreach: {
          type: "boolean",
          description: "Restrict results to orders that have an outreach attached. For example, an email campaign or Facebook ad. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_product",
    description: "Get information about a store's products.",
    toolSlug: "MAILCHIMP_LIST_PRODUCT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_product_images",
    description: "Get information about a product's images.",
    toolSlug: "MAILCHIMP_LIST_PRODUCT_IMAGES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        product_id: {
          type: "string",
          description: "The id for the product of a store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
        "product_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_product_variants",
    description: "List all variants for a specific product in a Mailchimp e-commerce store. Returns a paginated list of product variants including details like title, SKU, price, inventory quantity, and URLs. Use 'count' and 'offset' parameters to paginate through large variant lists. Requires valid store_id and product_id. Use LIST_STORES and LIST_PRODUCT to find the required identifiers.",
    toolSlug: "MAILCHIMP_LIST_PRODUCT_VARIANTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of variant records to return. Default is 10. Maximum is 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return. Use dot notation for sub-object fields (e.g., ['variants.id', 'variants.title', 'total_items']). If omitted, all fields are returned.",
        },
        offset: {
          type: "integer",
          description: "The number of records to skip for pagination. Default is 0. Use with 'count' to paginate through large variant lists.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Use LIST_STORES to find available store IDs.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product within the store. Use LIST_PRODUCT to find product IDs for a given store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for sub-object fields (e.g., ['variants._links']). Useful for reducing response size.",
        },
      },
      required: [
        "store_id",
        "product_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_promo_codes",
    description: "Get information about a store's promo codes.",
    toolSlug: "MAILCHIMP_LIST_PROMO_CODES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        promo_rule_id: {
          type: "string",
          description: "The id for the promo rule of a store.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "promo_rule_id",
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_promo_rules",
    description: "Get information about a store's promo rules.",
    toolSlug: "MAILCHIMP_LIST_PROMO_RULES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_recent_activity",
    description: "Get up to the previous 180 days of daily detailed aggregated activity stats for a list, not including Automation activity.",
    toolSlug: "MAILCHIMP_LIST_RECENT_ACTIVITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of activity records to return. Default value is 10. Maximum value is 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation (e.g., ['activity.day', 'activity.subs', 'total_items']).",
        },
        offset: {
          type: "integer",
          description: "Used for pagination, this is the number of records from a collection to skip. Default value is 0.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list (e.g., 'af9d6415f0').",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude. Reference parameters of sub-objects with dot notation (e.g., ['_links']).",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_recent_member_notes",
    description: "Get recent notes for a specific list member.",
    toolSlug: "MAILCHIMP_LIST_RECENT_MEMBER_NOTES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to return. Use dot notation for nested fields (e.g., 'notes.id', 'notes.note', 'notes.created_at'). If not specified, all fields are returned.",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        sort_dir: {
          type: "string",
          description: "Sort direction. 'ASC' for ascending (oldest first) or 'DESC' for descending (newest first).",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        sort_field: {
          type: "string",
          description: "Field to sort notes by. Options: 'created_at', 'updated_at', or 'note_id'.",
          enum: [
            "created_at",
            "updated_at",
            "note_id",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from the response. Use dot notation for nested fields (e.g., 'notes._links').",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This value is also available as the 'id' field when listing members.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_segments",
    description: "Get information about all available segments for a specific list.",
    toolSlug: "MAILCHIMP_LIST_SEGMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Limit results based on segment type.",
        },
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        include_cleaned: {
          type: "boolean",
          description: "Include cleaned members in response",
        },
        since_created_at: {
          type: "string",
          description: "Restrict results to segments created after the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        since_updated_at: {
          type: "string",
          description: "Restrict results to segments update after the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_created_at: {
          type: "string",
          description: "Restrict results to segments created before the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_updated_at: {
          type: "string",
          description: "Restrict results to segments update before the set time. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        include_unsubscribed: {
          type: "boolean",
          description: "Include unsubscribed members in response",
        },
        include_transactional: {
          type: "boolean",
          description: "Include transactional members in response",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_sending_domains",
    description: "Get all of the sending domains on the account.",
    toolSlug: "MAILCHIMP_LIST_SENDING_DOMAINS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "verifieddomains",
    ],
  }),
  composioTool({
    name: "mailchimp_list_signup_forms",
    description: "Get signup forms for a specific list.",
    toolSlug: "MAILCHIMP_LIST_SIGNUP_FORMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_stored_files",
    description: "Get a list of available images and files stored in the File Manager for the account.",
    toolSlug: "MAILCHIMP_LIST_STORED_FILES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The file type for the File Manager file.",
        },
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        created_by: {
          type: "string",
          description: "The Mailchimp account user who created the File Manager file.",
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "added_date",
            "name",
            "size",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        since_created_at: {
          type: "string",
          description: "Restrict the response to files created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_created_at: {
          type: "string",
          description: "Restrict the response to files created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "filemanager",
    ],
  }),
  composioTool({
    name: "mailchimp_list_stores",
    description: "Get information about all stores in the account.",
    toolSlug: "MAILCHIMP_LIST_STORES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ecommerce",
    ],
  }),
  composioTool({
    name: "mailchimp_list_subscribers_removed_from_workflow",
    description: "Get information about subscribers who were removed from a classic automation workflow.",
    toolSlug: "MAILCHIMP_LIST_SUBSCRIBERS_REMOVED_FROM_WORKFLOW",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique id for the Automation workflow.",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "automations",
    ],
  }),
  composioTool({
    name: "mailchimp_list_survey_question_reports",
    description: "Get reports for all questions in a specific survey. Returns detailed reporting data for each question in the survey, including response counts, answer distributions for choice questions, and average ratings for range questions. This action is useful for analyzing survey results and understanding how respondents answered each question. Prerequisites: - A survey must exist in your Mailchimp account (surveys are created in the web interface) - Use 'List survey reports' or 'Get information about all surveys for a list' to find survey IDs Returns 404 error if the survey_id does not exist.",
    toolSlug: "MAILCHIMP_LIST_SURVEY_QUESTION_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        fields: {
          type: "string",
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. Example: 'questions.id,questions.text,total_items'.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID of the survey to get question reports for. You can get this from the 'List survey reports' action or the 'Get information about all surveys for a list' action. Surveys are created in the Mailchimp web interface.",
        },
        exclude_fields: {
          type: "string",
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. Example: '_links'.",
        },
      },
      required: [
        "survey_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_list_survey_reports",
    description: "Get reports for surveys.",
    toolSlug: "MAILCHIMP_LIST_SURVEY_REPORTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_list_survey_responses",
    description: "Retrieve all responses submitted to a survey. Returns a list of responses including respondent contact information, submission timestamps, and all question/answer results for each response. This endpoint is useful for analyzing survey results programmatically, exporting response data, or building integrations that react to survey submissions. Prerequisites: You must have an existing survey with at least one response. Surveys are created through the Mailchimp web interface and cannot be created via API. Use the 'List survey reports' or 'Get information about all surveys for a list' actions to find available survey IDs.",
    toolSlug: "MAILCHIMP_LIST_SURVEY_RESPONSES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation (e.g., 'responses.response_id,responses.submitted_at'). If not specified, all fields are returned.",
        },
        offset: {
          type: "integer",
          description: "Used for pagination, this is the number of records from a collection to skip. Default value is 0.",
        },
        survey_id: {
          type: "string",
          description: "The unique identifier for the survey. You can get this ID from the 'List survey reports' action (/reporting/surveys) or from the 'Get information about all surveys for a list' action. Surveys must be created through the Mailchimp web interface.",
        },
        chose_answer: {
          type: "string",
          description: "Filter responses to only those that chose a specific answer option. Provide the answer option ID. Works in conjunction with answered_question.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude from the response. Reference parameters of sub-objects with dot notation (e.g., 'responses._links').",
        },
        answered_question: {
          type: "integer",
          description: "Filter responses to only those that answered a specific question. Provide the numeric question ID from the survey.",
        },
        respondent_familiarity_is: {
          type: "string",
          description: "Filter type for survey respondent familiarity.",
          enum: [
            "new",
            "known",
            "unknown",
          ],
        },
      },
      required: [
        "survey_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reporting",
    ],
  }),
  composioTool({
    name: "mailchimp_list_template_folders",
    description: "Retrieve all template folders from the Mailchimp account. Template folders are used to organize email templates. This action returns a paginated list of all folders with their IDs, names, and template counts. Use the count and offset parameters to paginate through large result sets.",
    toolSlug: "MAILCHIMP_LIST_TEMPLATE_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return. Reference sub-object fields with dot notation (e.g., 'folders.id', 'folders.name'). If not specified, all fields are returned.",
        },
        offset: {
          type: "integer",
          description: "The number of records to skip from the beginning of the result set. Used for pagination. Default value is 0.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Reference sub-object fields with dot notation (e.g., 'folders._links'). Cannot be used with 'fields' parameter.",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "templatefolders",
    ],
  }),
  composioTool({
    name: "mailchimp_list_templates",
    description: "Get a list of an account's available templates.",
    toolSlug: "MAILCHIMP_LIST_TEMPLATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Limit results based on template type.",
        },
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        category: {
          type: "string",
          description: "Limit results based on category.",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        folder_id: {
          type: "string",
          description: "The unique folder id.",
        },
        created_by: {
          type: "string",
          description: "The Mailchimp account user who created the template.",
        },
        sort_field: {
          type: "string",
          description: "Returns user templates sorted by the specified field.",
          enum: [
            "date_created",
            "date_edited",
            "name",
          ],
        },
        content_type: {
          type: "string",
          description: "Limit results based on how the template\"s content is put together. Only templates of type `user` can be filtered by `content_type`. If you want to retrieve saved templates created with the legacy email editor, then filter `content_type` to `template`. If you\"d rather pull your saved templates for the new editor, filter to `multichannel`. For code your own templates, filter to `html`. ",
          enum: [
            "html",
            "template",
            "multichannel",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        since_date_created: {
          type: "string",
          description: "Restrict the response to templates created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_date_created: {
          type: "string",
          description: "Restrict the response to templates created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
      },
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "mailchimp_list_top_email_clients",
    description: "Get the top email clients used by subscribers in a Mailchimp list/audience. Returns statistics about the email clients (e.g., Gmail, Apple Mail, Outlook) used by subscribers, including the number of members using each client and the percentage of the total list. This data is collected via open tracking and relies on image loading, so contacts who disable images will not be tracked.",
    toolSlug: "MAILCHIMP_LIST_TOP_EMAIL_CLIENTS",
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
          description: "A list of fields to include in the response. Available fields: 'clients', 'list_id', 'total_items', '_links'. Use dot notation for sub-object fields (e.g., 'clients.client', 'clients.members').",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience/list. This is a 10-character alphanumeric string.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Common usage: exclude '_links' to reduce response size. Use dot notation for sub-object fields.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_list_top_open_activities",
    description: "Get top open locations for a specific campaign. Returns geographic data about where subscribers opened a campaign email, based on geocoding their IP addresses. Results include country codes, regions, and open counts for each location.",
    toolSlug: "MAILCHIMP_LIST_TOP_OPEN_ACTIVITIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return. Reference parameters of sub-objects with dot notation (e.g., ['locations', 'campaign_id', 'total_items']). ",
        },
        offset: {
          type: "integer",
          description: "Used for pagination, this is the number of records from a collection to skip. Default value is 0. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude. Reference parameters of sub-objects with dot notation (e.g., ['_links']). ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_unsubscribed_members",
    description: "Get information about members who have unsubscribed from a specific campaign.",
    toolSlug: "MAILCHIMP_LIST_UNSUBSCRIBED_MEMBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_list_webhooks",
    description: "Get information about all webhooks for a specific list.",
    toolSlug: "MAILCHIMP_LIST_WEBHOOKS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_pause_automated_email",
    description: "Pause a specific automated email within a classic automation workflow. This action pauses the sending of a specific automated email. The email must currently be in 'sending' (active) status. Use the start_automated_email action to resume a paused email. Prerequisites: - The automation workflow must exist - The email within the workflow must be in 'sending' status (not 'save' or 'paused') Common errors: - 400 Bad Request: Email is already paused or in draft state - 404 Not Found: Invalid workflow_id or workflow_email_id",
    toolSlug: "MAILCHIMP_PAUSE_AUTOMATED_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique id for the Automation workflow. Obtain this from list_automations action.",
        },
        workflow_email_id: {
          type: "string",
          description: "The unique id for the Automation workflow email. Obtain this from list_automated_emails action using the workflow_id.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "Confirm the parameters before executing Pause automated email.",
    ],
  }),
  composioTool({
    name: "mailchimp_pause_automation_emails",
    description: "Pause all emails in a specific classic automation workflow. This action pauses all emails in a classic automation workflow. The automation must be in 'sending' status to be paused. If the automation is already paused or in draft/save status, the API will return an error. Use cases: - Temporarily stop an automation workflow from sending emails - Pause automation for maintenance or content updates - Stop emails during a campaign review period Note: To resume a paused automation, use the start_automation_emails action.",
    toolSlug: "MAILCHIMP_PAUSE_AUTOMATION_EMAILS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique identifier for the Automation workflow. You can obtain this ID from the list_automations action.",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "Confirm the parameters before executing Pause automation emails.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_pause_rss_campaign",
    description: "Pause an RSS-Driven campaign that is currently sending. This action pauses an active RSS campaign, stopping it from sending new emails based on its schedule until it is resumed. Only campaigns of type 'rss' that are currently in 'sending' status can be paused. Prerequisites: - The campaign must be of type 'rss' (not 'regular', 'plaintext', etc.) - The campaign must be in 'sending' status (actively running according to schedule) - Campaigns in 'save', 'paused', or 'sent' status cannot be paused Use RESUME_RSS_CAMPAIGN to resume a paused RSS campaign. Use LIST_CAMPAIGNS with type='rss' to find RSS campaigns.",
    toolSlug: "MAILCHIMP_PAUSE_RSS_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the RSS-driven campaign to pause. The campaign must be of type 'rss' and currently in 'sending' status. Use LIST_CAMPAIGNS with type='rss' and status='sending' to find eligible campaigns.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Pause RSS Campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_ping",
    description: "A health check for the API that won't return any account-specific information.",
    toolSlug: "MAILCHIMP_PING",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "ping",
    ],
  }),
  composioTool({
    name: "mailchimp_publish_a_survey",
    description: "Publishes a survey that is in draft, unpublished, or has been previously published and edited. Once published, the survey becomes accessible via its public URL and can collect responses from your audience. Prerequisites: The survey must exist on the specified list and must be created through the Mailchimp web interface (surveys cannot be created via the API). The survey must be in 'draft' or 'unpublished' status. Use 'Get information about all surveys for a list' to find available surveys and their current status.",
    toolSlug: "MAILCHIMP_PUBLISH_A_SURVEY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID of the Mailchimp audience (list) containing the survey. You can get this from the 'Get lists info' action or from your Mailchimp dashboard under Audience > Settings > Audience name and defaults.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID of the survey to publish. You can get this from the 'Get information about all surveys for a list' action. The survey must be in 'draft' or 'unpublished' status. Surveys must be created in the Mailchimp web interface before using this action.",
        },
      },
      required: [
        "list_id",
        "survey_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "surveys",
    ],
    askBefore: [
      "Confirm the parameters before executing Publish a survey.",
    ],
  }),
  composioTool({
    name: "mailchimp_publish_landing_page",
    description: "Publish a Mailchimp landing page to make it live and accessible to visitors. Publishes a landing page that is currently in 'draft', 'unpublished', or has been previously published and edited. Once published, the landing page will be accessible via its public URL. Requirements: - The landing page must exist and be in a publishable state (draft or unpublished) - The Mailchimp account must have sending permissions enabled - The landing page should have valid content configured Note: Returns HTTP 204 No Content on successful publish with an empty response body.",
    toolSlug: "MAILCHIMP_PUBLISH_LANDING_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "The unique identifier for the landing page to publish. This ID can be obtained from the list landing pages endpoint or when creating a new landing page. Format: 12-character alphanumeric string (e.g., '030001b4e1f0').",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "landingpages",
    ],
    askBefore: [
      "Confirm the parameters before executing Publish landing page.",
    ],
  }),
  composioTool({
    name: "mailchimp_remove_list_member_from_segment",
    description: "Remove a member from a static segment in a Mailchimp list/audience. This action removes a list member from a specified static segment. The member remains in the list - they are only removed from the segment membership. Important notes: - Only works with static segments (type='static'), not dynamic/saved segments - Returns HTTP 204 No Content on success - Returns HTTP 404 if the member is not found in the segment - This is an idempotent operation",
    toolSlug: "MAILCHIMP_REMOVE_LIST_MEMBER_FROM_SEGMENT",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp list/audience. You can get this from the get_lists_info action.",
        },
        segment_id: {
          type: "string",
          description: "The unique ID for the static segment. This action only works with static segments (not dynamic/saved segments). You can get this from the list_segments action.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. For example, for 'user@example.com', compute MD5 of 'user@example.com'. You can also use the member 'id' field returned by list_members_info or add_member_to_segment actions.",
        },
      },
      required: [
        "list_id",
        "segment_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove list member from segment.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_remove_subscriber_from_workflow",
    description: "Remove a subscriber from a classic automation workflow at any point in the sequence. IMPORTANT: Once removed, the subscriber can NEVER be re-added to the same workflow. This action is irreversible. Prerequisites: - The automation must be in 'sending' or 'paused' status (not 'save' or 'archived') - The automation must have a list/audience associated with it - The email address must belong to a subscriber on that list Use MAILCHIMP_LIST_AUTOMATIONS to find workflows and check their status. Use MAILCHIMP_LIST_MEMBERS_INFO to verify subscriber email addresses.",
    toolSlug: "MAILCHIMP_REMOVE_SUBSCRIBER_FROM_WORKFLOW",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique ID for the classic automation workflow (e.g., 'abc123def4'). Use MAILCHIMP_LIST_AUTOMATIONS to retrieve available workflow IDs. Note: The automation must be in 'sending' or 'paused' status to remove subscribers.",
        },
        email_address: {
          type: "string",
          description: "The email address of the list member to remove from the workflow (e.g., 'user@example.com'). The subscriber must be on the list associated with this automation. Once removed, they cannot be re-added to this workflow.",
        },
      },
      required: [
        "workflow_id",
        "email_address",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Remove subscriber from workflow.",
    ],
  }),
  composioTool({
    name: "mailchimp_replicate_campaign",
    description: "Replicate a campaign in saved or send status.",
    toolSlug: "MAILCHIMP_REPLICATE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Replicate campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_resend_campaign",
    description: "Resend a previously sent campaign to specific subscriber segments. This creates a replica of the original campaign and sends it to common segments such as those who didn't open the original campaign, didn't click any links, or new subscribers added since the campaign was sent. IMPORTANT: The original campaign must: - Have been previously sent (status='sent') - Have tracking enabled (opens/clicks tracking) - Be eligible for resending (check the 'resendable' field on the campaign)",
    toolSlug: "MAILCHIMP_RESEND_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign to resend. The campaign must have been previously sent and have tracking enabled. You can verify a campaign is eligible by checking its 'resendable' field.",
        },
        shortcut_type: {
          type: "string",
          description: "Which campaign resend shortcut to use. Options: 'to_non_openers' (resend to subscribers who didn't open), 'to_new_subscribers' (send to subscribers added since the campaign was sent), 'to_non_clickers' (resend to subscribers who didn't click). If not specified, defaults to 'to_non_openers' on the server side.",
          enum: [
            "to_non_openers",
            "to_new_subscribers",
            "to_non_clickers",
          ],
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Resend campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_resume_rss_campaign",
    description: "Resume an RSS-Driven campaign that was previously paused. This action restarts the RSS feed delivery schedule for a paused RSS campaign. The campaign will continue checking the RSS feed and sending emails according to its configured schedule. Prerequisites: - Campaign must be of type 'rss' - Campaign must be in 'paused' status (was previously running and then paused) - Use PAUSE_RSS_CAMPAIGN to pause a running RSS campaign first - Use LIST_CAMPAIGNS with type='rss' and status='paused' to find eligible campaigns On success, returns HTTP 204 No Content. The campaign status will change from 'paused' back to 'sending'.",
    toolSlug: "MAILCHIMP_RESUME_RSS_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the RSS-driven campaign to resume. The campaign must be of type 'rss' and in 'paused' status.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Resume rss campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_retrieve_campaign_abuse_complaints",
    description: "Get a list of abuse complaints for a specific campaign.",
    toolSlug: "MAILCHIMP_RETRIEVE_CAMPAIGN_ABUSE_COMPLAINTS",
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
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "reports",
    ],
  }),
  composioTool({
    name: "mailchimp_retrieve_folder_contents",
    description: "Get a list of available images and files stored in this folder.",
    toolSlug: "MAILCHIMP_RETRIEVE_FOLDER_CONTENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "The file type for the File Manager file.",
        },
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        sort_dir: {
          type: "string",
          description: "Determines the order direction for sorted results.",
          enum: [
            "ASC",
            "DESC",
          ],
        },
        folder_id: {
          type: "string",
          description: "The unique id for the File Manager folder.",
        },
        created_by: {
          type: "string",
          description: "The Mailchimp account user who created the File Manager file.",
        },
        sort_field: {
          type: "string",
          description: "Returns files sorted by the specified field.",
          enum: [
            "added_date",
            "name",
            "size",
          ],
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
        since_created_at: {
          type: "string",
          description: "Restrict the response to files created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
        before_created_at: {
          type: "string",
          description: "Restrict the response to files created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00. ",
        },
      },
      required: [
        "folder_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "filemanager",
    ],
  }),
  composioTool({
    name: "mailchimp_schedule_campaign",
    description: "Schedule a campaign for delivery at a specific date and time. Important notes: - The campaign must be in 'save' (draft) status and pass all send checklist items - Schedule time must be in the future and on the quarter-hour (:00, :15, :30, :45) - If using Multivariate Campaigns to test send times or RSS Campaigns, use the send action instead - Timewarp and Batch Delivery cannot be used together - Requires a paid Mailchimp plan to schedule campaigns (free plans cannot schedule)",
    toolSlug: "MAILCHIMP_SCHEDULE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        timewarp: {
          type: "boolean",
          description: "Choose whether the campaign should use Timewarp when sending. Campaigns scheduled with Timewarp are localized based on the recipients' time zones. For example, a Timewarp campaign with a schedule_time of 13:00 will be sent to each recipient at 1:00pm in their local time. Cannot be set to true for campaigns using Batch Delivery.",
        },
        campaign_id: {
          type: "string",
          description: "The unique ID for the campaign to schedule (e.g., 'c16afdffd0').",
        },
        schedule_time: {
          type: "string",
          description: "The UTC date and time to schedule the campaign for delivery in ISO 8601 format (e.g., '2026-01-26T12:00:00+00:00'). Campaigns may only be scheduled to send on the quarter-hour (:00, :15, :30, :45). Must be at least 15 minutes in the future.",
        },
        batch__delivery__batch__count: {
          type: "integer",
          description: "The number of batches to divide the campaign send into when using Batch Delivery. Required if batch_delivery_batch_delay is provided. Cannot be used with Timewarp.",
        },
        batch__delivery__batch__delay: {
          type: "integer",
          description: "The delay, in minutes, between batches when using Batch Delivery. Required if batch_delivery_batch_count is provided. Enables staggered sending to reduce server load.",
        },
      },
      required: [
        "campaign_id",
        "schedule_time",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Schedule campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_search_campaigns",
    description: "Search all campaigns for the specified query terms. This action searches across campaign titles, subject lines, and content to find campaigns matching the provided query. Returns detailed campaign information including settings, tracking configuration, recipients, and status. Use the 'fields' parameter to limit response data or 'exclude_fields' to remove unnecessary fields like '_links' for cleaner responses.",
    toolSlug: "MAILCHIMP_SEARCH_CAMPAIGNS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "The search query used to filter campaigns. Searches across campaign titles, subject lines, and other campaign content. Returns campaigns that match the specified query terms.",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return in the response. Use dot notation to reference nested fields (e.g., 'results.campaign.id', 'results.campaign.settings.title'). If not specified, all fields are returned.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation to reference nested fields (e.g., 'results.campaign._links'). Useful for reducing response size by removing unnecessary data.",
        },
      },
      required: [
        "query",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "searchcampaigns",
    ],
  }),
  composioTool({
    name: "mailchimp_search_for_tags_on_a_list_by_name",
    description: "Search for tags on a list by name. If no name is provided, will return all tags on the list.",
    toolSlug: "MAILCHIMP_SEARCH_FOR_TAGS_ON_A_LIST_BY_NAME",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The search query used to filter tags. The search query will be compared to each tag as a prefix, so all tags that have a name starting with this field will be returned. If not provided, returns all tags on the list.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_search_members",
    description: "Search for list members. This search can be restricted to a specific list, or can be used to search across all lists in an account.",
    toolSlug: "MAILCHIMP_SEARCH_MEMBERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        query: {
          type: "string",
          description: "The search query used to filter results. Query should be a valid email, or a string representing a contact\"s first or last name. ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation. ",
        },
        list_id: {
          type: "string",
          description: "The unique id for the list. If omitted, search will be performed across all lists in the account.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation. ",
        },
      },
      required: [
        "query",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "searchmembers",
    ],
  }),
  composioTool({
    name: "mailchimp_send_campaign",
    description: "Send a Mailchimp campaign immediately. For RSS Campaigns, the campaign will send according to its schedule. All other campaign types (regular, plaintext, variate) will send immediately upon calling this endpoint. Prerequisites: - Campaign must be in 'save' (draft) status - Campaign must have a valid audience (list_id) with at least one recipient - Campaign must have a subject line, from name, and verified from email address - Campaign must have content (HTML or plain text) - The sending account must be in good standing (verified, not disabled) On success, returns HTTP 204 No Content. The campaign status will change to 'sending' and then 'sent' once all emails are delivered.",
    toolSlug: "MAILCHIMP_SEND_CAMPAIGN",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign to send. The campaign must be in 'save' status and pass all send-checklist requirements (valid audience, subject line, from name, verified from email domain, and content). Use GET /campaigns/{campaign_id}/send-checklist to verify the campaign is ready before sending.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Send campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_send_test_email",
    description: "Send a test email for a campaign to preview it before sending to your audience. This action allows you to send a test version of your campaign to specified email addresses to verify the content, formatting, and personalization before the final send. The campaign must have content set before a test email can be sent.",
    toolSlug: "MAILCHIMP_SEND_TEST_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        send_type: {
          type: "string",
          description: "The format of the test email. Use 'html' for the HTML version (default) or 'plaintext' for plain-text version.",
          enum: [
            "html",
            "plaintext",
          ],
        },
        campaign_id: {
          type: "string",
          description: "The unique ID of the campaign to send a test email for. Must be a valid campaign ID from your Mailchimp account.",
        },
        test_emails: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of email addresses to receive the test email. Free accounts can send to up to 6 addresses, paid accounts up to 20. Example: ['user1@example.com', 'user2@example.com']",
        },
      },
      required: [
        "campaign_id",
        "test_emails",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Send test email.",
    ],
  }),
  composioTool({
    name: "mailchimp_set_campaign_content",
    description: "Set the content for a campaign.",
    toolSlug: "MAILCHIMP_SET_CAMPAIGN_CONTENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "When importing a campaign, the URL where the HTML lives.",
        },
        html: {
          type: "string",
          description: "The raw HTML for the campaign.",
        },
        plain_text: {
          type: "string",
          description: "The plain-text portion of the campaign. If left unspecified, we\"ll generate this automatically. ",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        template__id: {
          type: "integer",
          description: "The id of the template to use.",
        },
        variate_contents: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Content options for [Multivariate Campaigns](https://mailchimp.com/help/about-multivariate-campaigns/). Each content option must provide HTML content and may optionally provide plain text. For campaigns not testing content, only one object should be provided. ",
        },
        archive__archive__type: {
          type: "string",
          description: "The type of encoded file. Defaults to zip.",
          enum: [
            "zip",
            "tar.gz",
            "tar.bz2",
            "tar",
            "tgz",
            "tbz",
          ],
        },
        archive__archive__content: {
          type: "string",
          description: "The base64-encoded representation of the archive file.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Set campaign content.",
    ],
  }),
  composioTool({
    name: "mailchimp_start_automated_email",
    description: "Start a specific automated email within an Automation workflow. This action starts sending a specific automated email that is part of a classic automation workflow. The email must be in a 'paused' status to be started. Emails in 'save' (draft) status may need additional configuration in the Mailchimp web interface before they can be started. Prerequisites: - The automation workflow must exist and not be archived - The automated email must be properly configured (subject line, content, etc.) - The email should be in 'paused' status (use Pause Automated Email first if needed) Common error responses: - 400: The automation email is missing requirements and can't be started - 404: The workflow_id or workflow_email_id was not found",
    toolSlug: "MAILCHIMP_START_AUTOMATED_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique ID for the Automation workflow. Use the List Automations action to get available workflow IDs.",
        },
        workflow_email_id: {
          type: "string",
          description: "The unique ID for the Automation workflow email to start. Use the List Automated Emails action with the workflow_id to get available email IDs. The email must be in 'paused' status to be started; emails in 'save' status may require additional configuration in Mailchimp before they can be started.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "Confirm the parameters before executing Start automated email.",
    ],
  }),
  composioTool({
    name: "mailchimp_start_automation_emails",
    description: "Start all emails in a classic automation workflow. This action starts all emails in a specific classic automation workflow. Once started, the automation will begin sending emails to subscribers based on its configured triggers. Prerequisites: - The automation must be in 'save' status (not 'archived') - The automation must be properly configured with email content - For abandoned cart automations, additional setup may be required in the UI Returns HTTP 204 No Content on success.",
    toolSlug: "MAILCHIMP_START_AUTOMATION_EMAILS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        workflow_id: {
          type: "string",
          description: "The unique ID for the Automation workflow. This is a 10-character alphanumeric string (e.g., 'ae5e650e3b'). You can obtain this ID by listing automations using the LIST_AUTOMATIONS action.",
        },
      },
      required: [
        "workflow_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "Confirm the parameters before executing Start automation emails.",
    ],
  }),
  composioTool({
    name: "mailchimp_start_batch_operation",
    description: "Begin processing a batch operations request.",
    toolSlug: "MAILCHIMP_START_BATCH_OPERATION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        operations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of objects that describes operations to perform.",
        },
      },
      required: [
        "operations",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "batches",
    ],
    askBefore: [
      "Confirm the parameters before executing Start batch operation.",
    ],
  }),
  composioTool({
    name: "mailchimp_unpublish_a_survey",
    description: "Unpublishes a survey that is currently published, making it unavailable for responses. The survey must be in 'published' status before calling this action. Prerequisites: The survey must exist on the specified list and be currently published. Surveys are created through the Mailchimp web interface, not via the API. Use 'Get information about all surveys for a list' to find available survey IDs, and 'Get survey' to verify a survey's current status before unpublishing. Returns the updated survey details with status changed to 'unpublished'.",
    toolSlug: "MAILCHIMP_UNPUBLISH_A_SURVEY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        list_id: {
          type: "string",
          description: "The unique ID of the Mailchimp audience (list) containing the survey. You can get this from the 'Get lists info' action or from your Mailchimp dashboard under Audience > Settings > Audience name and defaults.",
        },
        survey_id: {
          type: "string",
          description: "The unique ID of the survey to unpublish. You can get this from the 'Get information about all surveys for a list' action. The survey must be currently published - use 'Get survey' to check its status first.",
        },
      },
      required: [
        "list_id",
        "survey_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "surveys",
    ],
    askBefore: [
      "Confirm the parameters before executing Unpublish a survey.",
    ],
  }),
  composioTool({
    name: "mailchimp_unpublish_landing_page",
    description: "Unpublish a Mailchimp landing page. Takes a published landing page offline, changing its status back to draft. The page URL will no longer be accessible to visitors after unpublishing. This action can also be called on pages that are already in draft status (it will succeed without error). To publish a landing page, use the publish_landing_page action.",
    toolSlug: "MAILCHIMP_UNPUBLISH_LANDING_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page_id: {
          type: "string",
          description: "The unique identifier for the Mailchimp landing page to unpublish. You can get this ID from the list_landing_pages action or when creating a landing page.",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "landingpages",
    ],
    askBefore: [
      "Confirm the parameters before executing Unpublish landing page.",
    ],
  }),
  composioTool({
    name: "mailchimp_unschedule_campaign",
    description: "Unschedule a scheduled campaign that hasn't started sending. The campaign must be in 'schedule' status (not 'save', 'sent', or 'sending'). After unscheduling, the campaign status reverts to 'save' and can be edited or rescheduled. Returns HTTP 204 No Content on success.",
    toolSlug: "MAILCHIMP_UNSCHEDULE_CAMPAIGN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign to unschedule. The campaign must be in 'schedule' status (i.e., previously scheduled but not yet sent). Use list_campaigns with status='schedule' to find scheduled campaigns.",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Unschedule campaign.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_audiences_contacts",
    description: "Update an existing omni-channel contact in a Mailchimp audience. Use when you need to modify contact details such as language, tags, email/SMS channels, or merge fields.",
    toolSlug: "MAILCHIMP_UPDATE_AUDIENCES_CONTACTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of tag names to add to the contact. This operation is append-only; existing tags will be preserved, and only new tags from this array will be added.",
        },
        language: {
          type: "string",
          description: "The subscriber's detected language.",
        },
        data_mode: {
          type: "string",
          description: "Indicates the data processing mode. In `historical` mode, contact data changes do not trigger automations or webhooks. In `live` mode, such changes do trigger them.",
          enum: [
            "historical",
            "live",
          ],
        },
        contact_id: {
          type: "string",
          description: "A unique identifier for the contact, which can be a Mailchimp contact ID or a channel hash. A channel hash must follow the format email:[md5_hash] (where the hash is the MD5 of the lowercased email address) or sms:[sha256_hash] (where the hash is the SHA256 of the E.164-formatted phone number).",
        },
        audience_id: {
          type: "string",
          description: "The unique ID for the audience.",
        },
        sms_channel: {
          type: "object",
          additionalProperties: true,
          properties: {
            sms_phone: {
              type: "string",
              description: "SMS Phone Number",
            },
            marketing_consent: {
              type: "object",
              additionalProperties: true,
              properties: {
                source: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the source.",
                    },
                  },
                  description: "The source from which consent was obtained.",
                },
                status: {
                  type: "string",
                  description: "The marketing consent status. See Audiences (BETA) documentation for supported values.",
                },
              },
              description: "Marketing consent information for email or SMS.",
            },
          },
          description: "SMS channel details for the contact.",
        },
        merge_fields: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of merge fields where the keys are the merge tags. See the Merge Fields documentation for more about the structure.",
        },
        email_channel: {
          type: "object",
          additionalProperties: true,
          properties: {
            email: {
              type: "string",
              description: "Email address",
            },
            marketing_consent: {
              type: "object",
              additionalProperties: true,
              properties: {
                source: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the source.",
                    },
                  },
                  description: "The source from which consent was obtained.",
                },
                status: {
                  type: "string",
                  description: "The marketing consent status. See Audiences (BETA) documentation for supported values.",
                },
              },
              description: "Marketing consent information for email or SMS.",
            },
          },
          description: "Email channel details for the contact.",
        },
        merge_field_validation_mode: {
          type: "string",
          description: "Defines how merge field validation is handled. When set to `ignore_required_checks`, the API does not raise an error if required merge fields are missing. When set to `strict`, the API enforces validation. If omitted, `strict` is applied by default.",
          enum: [
            "ignore_required_checks",
            "strict",
          ],
        },
      },
      required: [
        "audience_id",
        "contact_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update contact in audience.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_batch_webhook",
    description: "Update a webhook that will fire whenever any batch request completes processing.",
    toolSlug: "MAILCHIMP_UPDATE_BATCH_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "A valid URL for the webhook endpoint. IMPORTANT: Mailchimp validates this URL by making a GET request to it during update. The URL must be publicly accessible and return a successful HTTP response (2xx) to GET requests. Example: https://example.com/webhook/batch",
        },
        enabled: {
          type: "boolean",
          description: "Whether the webhook is active and receives batch completion notifications.",
        },
        batch_webhook_id: {
          type: "string",
          description: "The unique identifier for the batch webhook to update.",
        },
      },
      required: [
        "batch_webhook_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "batchwebhooks",
    ],
    askBefore: [
      "Confirm the parameters before executing Update batch webhook.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_campaign_feedback_message",
    description: "Update a specific feedback message for a campaign.",
    toolSlug: "MAILCHIMP_UPDATE_CAMPAIGN_FEEDBACK_MESSAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        message: {
          type: "string",
          description: "The updated content of the feedback message.",
        },
        block_id: {
          type: "integer",
          description: "The block id for the editable block that the feedback addresses. Use 0 or omit for general campaign feedback not tied to a specific block.",
        },
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign. Can be obtained from list_campaigns or add_campaign actions.",
        },
        feedback_id: {
          type: "string",
          description: "The unique id for the feedback message to update. Can be obtained from list_campaign_feedback or add_campaign_feedback actions.",
        },
        is_complete: {
          type: "boolean",
          description: "Whether the feedback is marked as complete/resolved. Set to true to mark feedback as addressed, false to mark as pending.",
        },
      },
      required: [
        "campaign_id",
        "feedback_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Update campaign feedback message.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_campaign_folder",
    description: "Update the name of a campaign folder in Mailchimp. Campaign folders help organize email marketing campaigns into logical groups. Use this action to rename an existing folder. Returns the updated folder details including the folder ID, new name, and the count of campaigns in the folder.",
    toolSlug: "MAILCHIMP_UPDATE_CAMPAIGN_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name to assign to the campaign folder. This name will be displayed in the Mailchimp interface to help organize campaigns.",
        },
        folder_id: {
          type: "string",
          description: "The unique identifier for the campaign folder to update. Can be obtained from the list_campaign_folders action.",
        },
      },
      required: [
        "folder_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaignfolders",
    ],
    askBefore: [
      "Confirm the parameters before executing Update campaign folder.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_campaign_settings",
    description: "Update some or all of the settings for a specific campaign.",
    toolSlug: "MAILCHIMP_UPDATE_CAMPAIGN_SETTINGS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        campaign_id: {
          type: "string",
          description: "The unique id for the campaign.",
        },
        settings__title: {
          type: "string",
          description: "The title of the campaign.",
        },
        tracking__opens: {
          type: "boolean",
          description: "Whether to [track opens](https://mailchimp.com/help/about-open-tracking/). Defaults to `true`. Cannot be set to false for variate campaigns. ",
        },
        settings__to__name: {
          type: "string",
          description: "The campaign\"s custom \"To\" name. Typically the first name [audience field](https://mailchimp.com/help/getting-started-with-merge-tags/). ",
        },
        tracking__ecomm360: {
          type: "boolean",
          description: "Whether to enable e-commerce tracking.",
        },
        settings__reply__to: {
          type: "string",
          description: "The reply-to email address for the campaign.",
        },
        social__card__title: {
          type: "string",
          description: "The title for the card. Typically the subject line of the campaign.",
        },
        tracking__clicktale: {
          type: "string",
          description: "The custom slug for [ClickTale](https://mailchimp.com/help/additional-tracking-options-for-campaigns/) tracking (max of 50 bytes). ",
        },
        recipients__list__id: {
          type: "string",
          description: "The unique list id.",
        },
        rss__opts__feed__url: {
          type: "string",
          description: "The URL for the RSS feed.",
        },
        rss__opts__frequency: {
          type: "string",
          description: "The frequency of the RSS Campaign.",
          enum: [
            "daily",
            "weekly",
            "monthly",
          ],
        },
        settings__folder__id: {
          type: "string",
          description: "If the campaign is listed in a folder, the id for that folder.",
        },
        settings__from__name: {
          type: "string",
          description: "The \"from\" name on the campaign (not an email address).",
        },
        settings__auto__tweet: {
          type: "boolean",
          description: "Automatically tweet a link to the [campaign archive](https://mailchimp.com/help/about-email-campaign-archives-and-pages/) page when the campaign is sent. ",
        },
        settings__inline__css: {
          type: "boolean",
          description: "Automatically inline the CSS included with the campaign content.",
        },
        settings__authenticate: {
          type: "boolean",
          description: "Whether Mailchimp [authenticated](https://mailchimp.com/help/about-email-authentication/) the campaign. Defaults to `true`. ",
        },
        settings__auto__footer: {
          type: "boolean",
          description: "Automatically append Mailchimp\"s [default footer](https://mailchimp.com/help/about-campaign-footers/) to the campaign. ",
        },
        settings__fb__comments: {
          type: "boolean",
          description: "Allows Facebook comments on the campaign (also force-enables the Campaign Archive toolbar). Defaults to `true`. ",
        },
        settings__template__id: {
          type: "integer",
          description: "The id of the template to use.",
        },
        tracking__html__clicks: {
          type: "boolean",
          description: "Whether to [track clicks](https://mailchimp.com/help/enable-and-view-click-tracking/) in the HTML version of the campaign. Defaults to `true`. Cannot be set to false for variate campaigns. ",
        },
        tracking__text__clicks: {
          type: "boolean",
          description: "Whether to [track clicks](https://mailchimp.com/help/enable-and-view-click-tracking/) in the plain-text version of the campaign. Defaults to `true`. Cannot be set to false for variate campaigns. ",
        },
        settings__preview__text: {
          type: "string",
          description: "The preview text for the campaign.",
        },
        settings__subject__line: {
          type: "string",
          description: "The subject line for the campaign.",
        },
        settings__auto__fb__post: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of [Facebook](https://mailchimp.com/help/connect-or-disconnect-the-facebook-integration/) page ids to auto-post to. ",
        },
        social__card__image__url: {
          type: "string",
          description: "The url for the header image for the card.",
        },
        tracking__capsule__notes: {
          type: "boolean",
          description: "Update contact notes for a campaign based on subscriber email addresses.",
        },
        tracking__goal__tracking: {
          type: "boolean",
          description: "Deprecated",
        },
        rss__opts__schedule__hour: {
          type: "integer",
          description: "The hour to send the campaign in local time. Acceptable hours are 0-23. For example, \"4\" would be 4am in [your account\"s default time zone](https://mailchimp.com/help/set-account-defaults/). ",
        },
        social__card__description: {
          type: "string",
          description: "A short summary of the campaign to display.",
        },
        settings__use__conversation: {
          type: "boolean",
          description: "Use Mailchimp Conversation feature to manage out-of-office replies.",
        },
        tracking__google__analytics: {
          type: "string",
          description: "The custom slug for [Google Analytics](https://mailchimp.com/help/integrate-google-analytics-with-mailchimp/) tracking (max of 50 bytes). ",
        },
        tracking__salesforce__notes: {
          type: "boolean",
          description: "Update contact notes for a campaign based on subscriber email addresses.",
        },
        variate__settings__test__size: {
          type: "integer",
          description: "The percentage of recipients to send the test combinations to, must be a value between 10 and 100. ",
        },
        variate__settings__wait__time: {
          type: "integer",
          description: "The number of minutes to wait before choosing the winning campaign. The value of wait_time must be greater than 0 and in whole hours, specified in minutes. ",
        },
        rss__opts__constrain__rss__img: {
          type: "boolean",
          description: "Whether to add CSS to images in the RSS feed to constrain their width in campaigns. ",
        },
        tracking__salesforce__campaign: {
          type: "boolean",
          description: "Create a campaign in a connected Salesforce account.",
        },
        variate__settings__from__names: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible from names. The number of from_names provided must match the number of reply_to_addresses. If no from_names are provided, settings.from_name will be used. ",
        },
        variate__settings__send__times: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible send times to test. The times provided should be in the format YYYY-MM-DD HH:MM:SS. If send_times are provided to test, the test_size will be set to 100% and winner_criteria will be ignored. ",
        },
        recipients__segment__opts__match: {
          type: "string",
          description: "Segment match type.",
          enum: [
            "any",
            "all",
          ],
        },
        variate__settings__subject__lines: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible subject lines to test. If no subject lines are provided, settings.subject_line will be used. ",
        },
        variate__settings__winner__criteria: {
          type: "string",
          description: "The combination that performs the best. This may be determined automatically by click rate, open rate, or total revenue -- or you may choose manually based on the reporting data you find the most valuable. For Multivariate Campaigns testing send_time, winner_criteria is ignored. For Multivariate Campaigns with \"manual\" as the winner_criteria, the winner must be chosen in the Mailchimp web application. ",
          enum: [
            "opens",
            "clicks",
            "manual",
            "total_revenue",
          ],
        },
        recipients__segment__opts__conditions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "Segment match conditions. There are multiple possible types, see the [condition types documentation](https://mailchimp.com/developer/marketing/docs/alternative-schemas/#segment-condition-schemas). ",
        },
        rss__opts__schedule__weekly__send__day: {
          type: "string",
          description: "The day of the week to send a weekly RSS Campaign.",
          enum: [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ],
        },
        variate__settings__reply__to__addresses: {
          type: "array",
          items: {
            type: "string",
          },
          description: "The possible reply-to addresses. The number of reply_to_addresses provided must match the number of from_names. If no reply_to_addresses are provided, settings.reply_to will be used. ",
        },
        rss__opts__schedule__daily__send__friday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Fridays.",
        },
        rss__opts__schedule__daily__send__monday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Mondays.",
        },
        rss__opts__schedule__daily__send__sunday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Sundays.",
        },
        rss__opts__schedule__monthly__send__date: {
          type: "integer",
          description: "The day of the month to send a monthly RSS Campaign. Acceptable days are 0-31, where \"0\" is always the last day of a month. Months with fewer than the selected number of days will not have an RSS campaign sent out that day. For example, RSS Campaigns set to send on the 30th will not go out in February. ",
        },
        rss__opts__schedule__daily__send__tuesday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Tuesdays.",
        },
        rss__opts__schedule__daily__send__saturday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Saturdays.",
        },
        rss__opts__schedule__daily__send__thursday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Thursdays.",
        },
        rss__opts__schedule__daily__send__wednesday: {
          type: "boolean",
          description: "Sends the daily RSS Campaign on Wednesdays.",
        },
        recipients__segment__opts__saved__segment__id: {
          type: "integer",
          description: "The id for an existing saved segment.",
        },
        recipients__segment__opts__prebuilt__segment__id: {
          type: "string",
          description: "The prebuilt segment id, if a prebuilt segment has been designated for this campaign. ",
        },
      },
      required: [
        "campaign_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "campaigns",
    ],
    askBefore: [
      "Confirm the parameters before executing Update campaign settings.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_cart",
    description: "Update a specific cart.",
    toolSlug: "MAILCHIMP_UPDATE_CART",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lines: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of the cart\"s line items.",
        },
        cart_id: {
          type: "string",
          description: "The id for the cart.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        tax_total: {
          type: "string",
          description: "The total tax for the cart (supports decimal values).",
        },
        campaign_id: {
          type: "string",
          description: "A string that uniquely identifies the campaign associated with a cart.",
        },
        order_total: {
          type: "string",
          description: "The order total for the cart (supports decimal values).",
        },
        checkout_url: {
          type: "string",
          description: "The URL for the cart. This parameter is required for [Abandoned Cart](https://mailchimp.com/help/create-an-abandoned-cart-email/) automations. ",
        },
        currency_code: {
          type: "string",
          description: "The three-letter ISO 4217 code for the currency that the cart uses.",
        },
        customer__company: {
          type: "string",
          description: "The customer\"s company.",
        },
        customer__last__name: {
          type: "string",
          description: "The customer\"s last name.",
        },
        customer__first__name: {
          type: "string",
          description: "The customer\"s first name.",
        },
        customer__address__city: {
          type: "string",
          description: "The city the customer is located in.",
        },
        customer__opt__in__status: {
          type: "boolean",
          description: "The customer\"s opt-in status. This value will never overwrite the opt-in status of a pre-existing Mailchimp list member, but will apply to list members that are added through the e-commerce API endpoints. Customers who don\"t opt in to your Mailchimp list [will be added as `Transactional` members](https://mailchimp.com/developer/marketing/docs/e-commerce/#customers). ",
        },
        customer__address__country: {
          type: "string",
          description: "The customer\"s country.",
        },
        customer__address__address1: {
          type: "string",
          description: "The mailing address of the customer.",
        },
        customer__address__address2: {
          type: "string",
          description: "An additional field for the customer\"s mailing address.",
        },
        customer__address__province: {
          type: "string",
          description: "The customer\"s state name or normalized province.",
        },
        customer__address__postal__code: {
          type: "string",
          description: "The customer\"s postal or zip code.",
        },
        customer__address__country__code: {
          type: "string",
          description: "The two-letter code for the customer\"s country.",
        },
        customer__address__province__code: {
          type: "string",
          description: "The two-letter code for the customer\"s province or state.",
        },
      },
      required: [
        "store_id",
        "cart_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update cart.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_cart_line_item",
    description: "Update a specific cart line item in a Mailchimp e-commerce store. Use this action to modify the quantity, price, or product association of an existing line item in a shopping cart. All update fields are optional - only provide the fields you want to change. Carts and their line items are typically used for abandoned cart automations.",
    toolSlug: "MAILCHIMP_UPDATE_CART_LINE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        price: {
          type: "number",
          description: "The unit price of the cart line item in the cart's currency. Can be a decimal value (e.g., 29.99).",
        },
        cart_id: {
          type: "string",
          description: "The unique identifier for the cart containing the line item to update.",
        },
        line_id: {
          type: "string",
          description: "The unique identifier for the cart line item to update.",
        },
        quantity: {
          type: "integer",
          description: "The number of units of this product variant in the cart. Must be a positive integer.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store where the cart resides.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product to associate with this line item. Must be an existing product in the store.",
        },
        product_variant_id: {
          type: "string",
          description: "The unique identifier for the product variant. Must be an existing variant of the specified product.",
        },
      },
      required: [
        "store_id",
        "cart_id",
        "line_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update cart line item.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_customer",
    description: "Update an e-commerce customer's information in a Mailchimp store. Updates customer details such as name, company, opt-in status, and address. Note: The store must be associated with a Mailchimp list (audience) for this operation to succeed.",
    toolSlug: "MAILCHIMP_UPDATE_CUSTOMER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        company: {
          type: "string",
          description: "The customer's company name.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. The store must be associated with a Mailchimp list (audience) for customer updates to work.",
        },
        last_name: {
          type: "string",
          description: "The customer's last name.",
        },
        first_name: {
          type: "string",
          description: "The customer's first name.",
        },
        customer_id: {
          type: "string",
          description: "The unique identifier for the customer within the specified store.",
        },
        address__city: {
          type: "string",
          description: "The city the customer is located in.",
        },
        opt_in_status: {
          type: "boolean",
          description: "The customer's opt-in status for marketing emails. This value will never overwrite the opt-in status of a pre-existing Mailchimp list member, but will apply to list members that are added through the e-commerce API endpoints. Customers who don't opt in to your Mailchimp list will be added as Transactional members.",
        },
        address__country: {
          type: "string",
          description: "The customer's country name.",
        },
        address__address1: {
          type: "string",
          description: "The primary mailing address line (street address) of the customer.",
        },
        address__address2: {
          type: "string",
          description: "An additional address line for the customer's mailing address (apartment, suite, etc.).",
        },
        address__province: {
          type: "string",
          description: "The customer's state name or normalized province.",
        },
        address__postal__code: {
          type: "string",
          description: "The customer's postal or zip code.",
        },
        address__country__code: {
          type: "string",
          description: "The two-letter ISO country code for the customer's country (e.g., 'US' for United States).",
        },
        address__province__code: {
          type: "string",
          description: "The two-letter code for the customer's province or state (e.g., 'CA' for California).",
        },
      },
      required: [
        "store_id",
        "customer_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update customer.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_file",
    description: "Update an existing file's name or folder in the Mailchimp File Manager. This action allows you to rename a file or move it to a different folder. You can update the name, folder, or both in a single request. At least one of 'name' or 'folder_id' should be provided to make a meaningful update. To move a file to the root folder, set folder_id to 0. The file's content and URLs remain unchanged; only the metadata is updated. Returns the updated file's details including its ID, name, folder, URLs, and metadata.",
    toolSlug: "MAILCHIMP_UPDATE_FILE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the file including extension (e.g., 'logo.png', 'banner.jpg'). Supports Unicode characters. If not specified, the file name remains unchanged.",
        },
        file_id: {
          type: "string",
          description: "The unique ID of the file to update in the File Manager. Use the List Stored Files action to get available file IDs.",
        },
        folder_id: {
          type: "integer",
          description: "The ID of the folder to move the file to. Set to 0 to move the file to the root folder. Use the List Folders action to get available folder IDs. If not specified, the file remains in its current folder.",
        },
      },
      required: [
        "file_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "filemanager",
    ],
    askBefore: [
      "Confirm the parameters before executing Update file.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_update_folder",
    description: "Update the name of a File Manager folder in Mailchimp. Use this action to rename an existing folder in the Mailchimp File Manager. File Manager folders help organize images and other files used in campaigns, templates, and other Mailchimp content. Note: Only the folder name can be updated. The folder ID and creation metadata remain unchanged.",
    toolSlug: "MAILCHIMP_UPDATE_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the folder. Must be unique within the account's File Manager.",
        },
        folder_id: {
          type: "string",
          description: "The unique numeric ID for the File Manager folder to update. Obtain this from the 'list_folders' or 'add_folder' actions.",
        },
        created_at: {
          type: "string",
          description: "The date and time the folder was created in ISO 8601 format.",
        },
        created_by: {
          type: "string",
          description: "The name of the user who created the folder.",
        },
        file_count: {
          type: "integer",
          description: "The number of files in the folder.",
        },
      },
      required: [
        "folder_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "filemanager",
    ],
    askBefore: [
      "Confirm the parameters before executing Update folder.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_update_interest_category",
    description: "Update a specific interest category.",
    toolSlug: "MAILCHIMP_UPDATE_INTEREST_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Interest category display type for signup forms.",
          enum: [
            "checkboxes",
            "dropdown",
            "radio",
            "hidden",
          ],
        },
        title: {
          type: "string",
          description: "The text description of this category (required). This field appears on signup forms and is often phrased as a question (e.g., 'Which topics interest you?').",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience). You can find this in the Mailchimp dashboard or via the GET /lists endpoint.",
        },
        display_order: {
          type: "integer",
          description: "The order that the categories are displayed in the list. Lower numbers display first (e.g., 0 displays before 1).",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category to update. You can find this via the GET /lists/{list_id}/interest-categories endpoint.",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
        "title",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update interest category.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_update_interest_in_category",
    description: "Update an interest (group name) within an interest category on a Mailchimp list. Use this action to modify the name or display order of an existing interest. Interests are used to segment subscribers based on their preferences. The 'name' parameter is required for this update operation.",
    toolSlug: "MAILCHIMP_UPDATE_INTEREST_IN_CATEGORY",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the interest. This is required and will be shown publicly on subscription forms.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience). Use the LIST_INTERESTS_IN_CATEGORY action to find available lists.",
        },
        interest_id: {
          type: "string",
          description: "The unique ID of the interest to update. Use the LIST_INTERESTS_IN_CATEGORY action to find interests within a category.",
        },
        display_order: {
          type: "integer",
          description: "The display order for this interest within the category. Lower numbers appear first.",
        },
        interest_category_id: {
          type: "string",
          description: "The unique ID for the interest category. Use the LIST_INTEREST_CATEGORIES action to find categories for a list.",
        },
      },
      required: [
        "list_id",
        "interest_category_id",
        "interest_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update interest in category.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_update_landing_page",
    description: "Update a landing page.",
    toolSlug: "MAILCHIMP_UPDATE_LANDING_PAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The internal name of this landing page used for organization.",
        },
        title: {
          type: "string",
          description: "The title of this landing page shown in the browser's title bar.",
        },
        list_id: {
          type: "string",
          description: "The ID of the audience/list associated with this landing page.",
        },
        page_id: {
          type: "string",
          description: "The unique ID of the landing page to update.",
        },
        store_id: {
          type: "string",
          description: "The ID of the e-commerce store associated with this landing page.",
        },
        description: {
          type: "string",
          description: "The description of this landing page.",
        },
        tracking__track__with__mailchimp: {
          type: "boolean",
          description: "Use cookies to track unique visitors and calculate overall conversion rate. Learn more at https://mailchimp.com/help/use-track-mailchimp/.",
        },
        tracking__enable__restricted__data__processing: {
          type: "boolean",
          description: "Enable Google's restricted data processing for CCPA compliance. Restricts how Google uses certain identifiers. Learn more at https://privacy.google.com/businesses/rdp/.",
        },
      },
      required: [
        "page_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "landingpages",
    ],
    askBefore: [
      "Confirm the parameters before executing Update landing page.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_list_member",
    description: "Update information for a specific list member.",
    toolSlug: "MAILCHIMP_UPDATE_LIST_MEMBER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        vip: {
          type: "boolean",
          description: "[VIP status](https://mailchimp.com/help/designate-and-send-to-vip-contacts/) for subscriber. ",
        },
        ip_opt: {
          type: "string",
          description: "The IP address the subscriber used to confirm their opt-in status.",
        },
        status: {
          type: "string",
          description: "Subscriber's current status. Use 'subscribed', 'unsubscribed', 'cleaned', or 'pending'.",
          enum: [
            "subscribed",
            "unsubscribed",
            "cleaned",
            "pending",
          ],
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        language: {
          type: "string",
          description: "The subscriber's language code (e.g., 'en' for English, 'es' for Spanish, 'fr' for French).",
        },
        interests: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary mapping interest IDs to boolean values indicating if the subscriber is interested. Example: {'interest_id_123': true, 'interest_id_456': false}.",
        },
        ip_signup: {
          type: "string",
          description: "IP address the subscriber signed up from.",
        },
        email_type: {
          type: "string",
          description: "Type of email this member asked to get (\"html\" or \"text\").",
        },
        merge_fields: {
          type: "object",
          additionalProperties: true,
          description: "A dictionary of merge fields where the keys are the merge tags. See the [Merge Fields documentation](https://mailchimp.com/developer/marketing/docs/merge-fields/#structure) for more about the structure. ",
        },
        email_address: {
          type: "string",
          description: "Email address for a subscriber.",
        },
        timestamp_opt: {
          type: "string",
          description: "The date and time the subscriber confirmed their opt-in status in ISO 8601 format. ",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id directly.",
        },
        timestamp_signup: {
          type: "string",
          description: "The date and time the subscriber signed up for the list in ISO 8601 format. ",
        },
        location__latitude: {
          type: "number",
          description: "The location latitude (decimal degrees, e.g., 40.7128 for New York).",
        },
        location__longitude: {
          type: "number",
          description: "The location longitude (decimal degrees, e.g., -74.0060 for New York).",
        },
        marketing_permissions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "The marketing permissions for the subscriber.",
        },
        skip_merge_validation: {
          type: "boolean",
          description: "If skip_merge_validation is true, member data will be accepted without merge field values, even if the merge field is usually required. This defaults to false. ",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update list member.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_lists",
    description: "Update settings for a Mailchimp audience (list). This PATCH endpoint supports partial updates - only include the fields you want to change. The list_id is required to identify which audience to update. All other fields are optional. To update contact information, use the contact__* fields (e.g., contact__company, contact__city). To update campaign defaults, use the campaign__defaults__* fields (e.g., campaign__defaults__from__name).",
    toolSlug: "MAILCHIMP_UPDATE_LISTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the list/audience.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        contact__zip: {
          type: "string",
          description: "The postal or zip code for the list contact.",
        },
        double_optin: {
          type: "boolean",
          description: "Whether or not to require the subscriber to confirm subscription via email. ",
        },
        contact__city: {
          type: "string",
          description: "The city for the list contact.",
        },
        contact__phone: {
          type: "string",
          description: "The phone number for the list contact.",
        },
        contact__state: {
          type: "string",
          description: "The state for the list contact.",
        },
        use_archive_bar: {
          type: "boolean",
          description: "Whether campaigns for this list use the [Archive Bar](https://mailchimp.com/help/about-email-campaign-archives-and-pages/) in archives by default. ",
        },
        contact__company: {
          type: "string",
          description: "The company name for the list contact.",
        },
        contact__country: {
          type: "string",
          description: "A two-character ISO 3166 country code (e.g., 'US', 'GB').",
        },
        contact__address1: {
          type: "string",
          description: "The street address for the list contact (line 1).",
        },
        contact__address2: {
          type: "string",
          description: "The street address for the list contact (line 2).",
        },
        email_type_option: {
          type: "boolean",
          description: "Whether the list supports multiple formats for emails. When true, subscribers can choose between HTML or plain-text. When false, all subscribers receive HTML with plain-text backup.",
        },
        notify_on_subscribe: {
          type: "string",
          description: "The email address to send subscribe notifications to. Leave empty or omit to disable notifications.",
        },
        permission_reminder: {
          type: "string",
          description: "The permission reminder for the list - text that reminds subscribers how they got on the mailing list.",
        },
        marketing_permissions: {
          type: "boolean",
          description: "Whether or not the list has marketing permissions (eg. GDPR) enabled.",
        },
        notify_on_unsubscribe: {
          type: "string",
          description: "The email address to send unsubscribe notifications to. Leave empty or omit to disable notifications.",
        },
        campaign__defaults__subject: {
          type: "string",
          description: "The default subject line for campaigns sent to this list.",
        },
        campaign__defaults__language: {
          type: "string",
          description: "The default language for this list's forms (e.g., 'en').",
        },
        campaign__defaults__from__name: {
          type: "string",
          description: "The default 'From' name for campaigns sent to this list.",
        },
        campaign__defaults__from__email: {
          type: "string",
          description: "The default 'From' email for campaigns sent to this list.",
        },
      },
      required: [
        "list_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update lists.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_lists_segments",
    description: "Update a specific segment in a list. Use when you need to modify segment name, conditions, or static members.",
    toolSlug: "MAILCHIMP_UPDATE_LISTS_SEGMENTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the segment.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        segment_id: {
          type: "string",
          description: "The unique id for the segment.",
        },
        options__match: {
          type: "string",
          description: "Match type for segment conditions.",
          enum: [
            "any",
            "all",
          ],
        },
        static_segment: {
          type: "array",
          items: {
            type: "string",
          },
          description: "An array of emails to be used for a static segment. Any emails provided that are not present on the list will be ignored. Passing an empty array for an existing static segment will reset that segment and remove all members. This field cannot be provided with the options field.",
        },
        options__conditions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of segment conditions. Each condition should have: 'condition_type' (e.g., 'EmailAddress', 'Merge'), 'field' (e.g., 'EMAIL'), 'op' (e.g., 'contains', 'is'), and 'value'. This field cannot be provided with the static_segment field.",
        },
      },
      required: [
        "list_id",
        "segment_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update lists segments.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_merge_field",
    description: "Update a specific merge field (audience field) for a Mailchimp list. Use this action to modify properties of an existing merge field such as its name, whether it's required, default value, display order, help text, and type-specific options. Only provide the fields you want to change.",
    toolSlug: "MAILCHIMP_UPDATE_MERGE_FIELD",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tag: {
          type: "string",
          description: "The merge tag used in Mailchimp campaigns (e.g., *|FNAME|*). Must be uppercase, alphanumeric, and max 10 characters.",
        },
        name: {
          type: "string",
          description: "The display name of the merge field shown to users (e.g., 'First Name').",
        },
        public: {
          type: "boolean",
          description: "Whether the merge field is visible on the signup form.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the Mailchimp audience (list) containing the merge field.",
        },
        merge_id: {
          type: "string",
          description: "The unique numeric ID for the merge field to update.",
        },
        required: {
          type: "boolean",
          description: "Whether the merge field is required when importing or adding contacts.",
        },
        help_text: {
          type: "string",
          description: "Help text shown to subscribers to assist them in filling out the form.",
        },
        default_value: {
          type: "string",
          description: "The default value for the merge field when no value is provided.",
        },
        display_order: {
          type: "integer",
          description: "The display order position of this field on the signup form (lower numbers appear first).",
        },
        options__choices: {
          type: "array",
          items: {
            type: "string",
          },
          description: "For radio or dropdown fields only: the list of options users can select from.",
        },
        options__date__format: {
          type: "string",
          description: "For date or birthday fields only: the date format (e.g., 'MM/DD/YYYY', 'DD/MM/YYYY').",
        },
        options__phone__format: {
          type: "string",
          description: "For phone fields only: the phone number format. Use 'US' or 'International'.",
        },
        options__default__country: {
          type: "integer",
          description: "For address fields only: the default country code if none is provided.",
        },
      },
      required: [
        "list_id",
        "merge_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update merge field.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_note",
    description: "Update a specific note for a specific list member.",
    toolSlug: "MAILCHIMP_UPDATE_NOTE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        note: {
          type: "string",
          description: "The content of the note. Note length is limited to 1,000 characters.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        note_id: {
          type: "string",
          description: "The id for the note.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts the member's email address or contact_id.",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
        "note_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update note.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_order",
    description: "Update a specific order.",
    toolSlug: "MAILCHIMP_UPDATE_ORDER",
    mode: "write",
    risk: "high_impact",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        lines: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of the order\"s line items.",
        },
        promos: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "The promo codes applied on the order. Note: Patch will completely replace the value of promos with the new one provided. ",
        },
        order_id: {
          type: "string",
          description: "The id for the order in a store.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        order_url: {
          type: "string",
          description: "The URL for the order.",
        },
        tax_total: {
          type: "integer",
          description: "The tax total associated with an order.",
        },
        campaign_id: {
          type: "string",
          description: "A string that uniquely identifies the campaign associated with an order.",
        },
        order_total: {
          type: "integer",
          description: "The order total associated with an order.",
        },
        landing_site: {
          type: "string",
          description: "The URL for the page where the buyer landed when entering the shop.",
        },
        outreach__id: {
          type: "string",
          description: "A unique identifier for the outreach. Can be an email campaign ID.",
        },
        tracking_url: {
          type: "string",
          description: "The tracking URL associated with the order.",
        },
        currency_code: {
          type: "string",
          description: "The three-letter ISO 4217 code for the currency that the store accepts.",
        },
        tracking_code: {
          type: "string",
          description: "The Mailchimp tracking code for the order. Uses the \"mc_tc\" parameter in E-Commerce tracking URLs. ",
          enum: [
            "prec",
          ],
        },
        discount_total: {
          type: "integer",
          description: "The total amount of the discounts to be applied to the price of the order. ",
        },
        shipping_total: {
          type: "integer",
          description: "The shipping total for the order.",
        },
        tracking_number: {
          type: "string",
          description: "The tracking number associated with the order.",
        },
        financial_status: {
          type: "string",
          description: "The order status. Use this parameter to trigger [Order Notifications](https://mailchimp.com/developer/marketing/docs/e-commerce/#order-notifications). ",
        },
        tracking_carrier: {
          type: "string",
          description: "The tracking carrier associated with the order.",
        },
        customer__company: {
          type: "string",
          description: "The customer\"s company.",
        },
        fulfillment_status: {
          type: "string",
          description: "The fulfillment status for the order. Use this parameter to trigger [Order Notifications](https://mailchimp.com/developer/marketing/docs/e-commerce/#order-notifications). ",
        },
        updated_at_foreign: {
          type: "string",
          description: "The date and time the order was updated in ISO 8601 format.",
        },
        cancelled_at_foreign: {
          type: "string",
          description: "The date and time the order was cancelled in ISO 8601 format. Note: passing a value for this parameter will cancel the order being edited. ",
        },
        customer__last__name: {
          type: "string",
          description: "The customer\"s last name.",
        },
        processed_at_foreign: {
          type: "string",
          description: "The date and time the order was processed in ISO 8601 format.",
        },
        customer__first__name: {
          type: "string",
          description: "The customer\"s first name.",
        },
        billing__address__city: {
          type: "string",
          description: "The city in the billing address.",
        },
        billing__address__name: {
          type: "string",
          description: "The name associated with an order\"s billing address.",
        },
        billing__address__phone: {
          type: "string",
          description: "The phone number for the billing address.",
        },
        customer__address__city: {
          type: "string",
          description: "The city the customer is located in.",
        },
        shipping__address__city: {
          type: "string",
          description: "The city in the order\"s shipping address.",
        },
        shipping__address__name: {
          type: "string",
          description: "The name associated with an order\"s shipping address.",
        },
        shipping__address__phone: {
          type: "string",
          description: "The phone number for the order\"s shipping address",
        },
        billing__address__company: {
          type: "string",
          description: "The company associated with the billing address.",
        },
        billing__address__country: {
          type: "string",
          description: "The country in the billing address.",
        },
        customer__opt__in__status: {
          type: "boolean",
          description: "The customer\"s opt-in status. This value will never overwrite the opt-in status of a pre-existing Mailchimp list member, but will apply to list members that are added through the e-commerce API endpoints. Customers who don\"t opt in to your Mailchimp list [will be added as `Transactional` members](https://mailchimp.com/developer/marketing/docs/e-commerce/#customers). ",
        },
        billing__address__address1: {
          type: "string",
          description: "The billing address for the order.",
        },
        billing__address__address2: {
          type: "string",
          description: "An additional field for the billing address.",
        },
        billing__address__latitude: {
          type: "integer",
          description: "The latitude for the billing address location.",
        },
        billing__address__province: {
          type: "string",
          description: "The state or normalized province in the billing address.",
        },
        customer__address__country: {
          type: "string",
          description: "The customer\"s country.",
        },
        shipping__address__company: {
          type: "string",
          description: "The company associated with an order\"s shipping address.",
        },
        shipping__address__country: {
          type: "string",
          description: "The country in the order\"s shipping address.",
        },
        billing__address__longitude: {
          type: "integer",
          description: "The longitude for the billing address location.",
        },
        customer__address__address1: {
          type: "string",
          description: "The mailing address of the customer.",
        },
        customer__address__address2: {
          type: "string",
          description: "An additional field for the customer\"s mailing address.",
        },
        customer__address__province: {
          type: "string",
          description: "The customer\"s state name or normalized province.",
        },
        shipping__address__address1: {
          type: "string",
          description: "The shipping address for the order.",
        },
        shipping__address__address2: {
          type: "string",
          description: "An additional field for the shipping address.",
        },
        shipping__address__latitude: {
          type: "integer",
          description: "The latitude for the shipping address location.",
        },
        shipping__address__province: {
          type: "string",
          description: "The state or normalized province in the order\"s shipping address.",
        },
        shipping__address__longitude: {
          type: "integer",
          description: "The longitude for the shipping address location.",
        },
        billing__address__postal__code: {
          type: "string",
          description: "The postal or zip code in the billing address.",
        },
        billing__address__country__code: {
          type: "string",
          description: "The two-letter code for the country in the billing address.",
        },
        customer__address__postal__code: {
          type: "string",
          description: "The customer\"s postal or zip code.",
        },
        shipping__address__postal__code: {
          type: "string",
          description: "The postal or zip code in the order\"s shipping address.",
        },
        billing__address__province__code: {
          type: "string",
          description: "The two-letter code for the province or state in the billing address.",
        },
        customer__address__country__code: {
          type: "string",
          description: "The two-letter code for the customer\"s country.",
        },
        shipping__address__country__code: {
          type: "string",
          description: "The two-letter code for the country in the shipping address.",
        },
        customer__address__province__code: {
          type: "string",
          description: "The two-letter code for the customer\"s province or state.",
        },
        shipping__address__province__code: {
          type: "string",
          description: "The two-letter code for the province or state the order\"s shipping address is located in. ",
        },
      },
      required: [
        "store_id",
        "order_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Update order.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_order_line_item",
    description: "Update a specific order line item.",
    toolSlug: "MAILCHIMP_UPDATE_ORDER_LINE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        price: {
          type: "number",
          description: "The price of an order line item.",
        },
        line_id: {
          type: "string",
          description: "The id for the line item of an order.",
        },
        discount: {
          type: "number",
          description: "The total discount amount applied to this line item.",
        },
        order_id: {
          type: "string",
          description: "The id for the order in a store.",
        },
        quantity: {
          type: "integer",
          description: "The quantity of an order line item.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        product_id: {
          type: "string",
          description: "A unique identifier for the product associated with the order line item.",
        },
        product_variant_id: {
          type: "string",
          description: "A unique identifier for the product variant associated with the order line item. ",
        },
      },
      required: [
        "store_id",
        "order_id",
        "line_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update order line item.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_product",
    description: "Update a specific product.",
    toolSlug: "MAILCHIMP_UPDATE_PRODUCT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "The URL for a product.",
        },
        type: {
          type: "string",
          description: "The type of product.",
        },
        title: {
          type: "string",
          description: "The title of a product.",
        },
        handle: {
          type: "string",
          description: "The handle of a product.",
        },
        images: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of the product\"s images.",
        },
        vendor: {
          type: "string",
          description: "The vendor for a product.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        variants: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of the product\"s variants. At least one variant is required for each product. A variant can use the same `id` and `title` as the parent product. ",
        },
        image_url: {
          type: "string",
          description: "The image URL for a product.",
        },
        product_id: {
          type: "string",
          description: "The id for the product of a store.",
        },
        description: {
          type: "string",
          description: "The description of a product.",
        },
        published_at_foreign: {
          type: "string",
          description: "The date and time the product was published in ISO 8601 format.",
        },
      },
      required: [
        "store_id",
        "product_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update product.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_product_image",
    description: "Update a product image in a Mailchimp e-commerce store. Use this action to modify an existing product image's URL or associate it with specific product variants. Requires valid store_id, product_id, and image_id. At least one of 'url' or 'variant_ids' must be provided in the request body.",
    toolSlug: "MAILCHIMP_UPDATE_PRODUCT_IMAGE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A new unique identifier for the product image. Optional - only provide if you want to change the image ID.",
        },
        url: {
          type: "string",
          description: "The new URL for the product image. Must be a valid image URL. At least one of 'url' or 'variant_ids' should be provided.",
        },
        image_id: {
          type: "string",
          description: "The unique identifier for the product image to update. Required.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store. Required.",
        },
        product_id: {
          type: "string",
          description: "The unique identifier for the product within the store. Required.",
        },
        variant_ids: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of product variant IDs to associate with this image. Use to link the image to specific product variants (e.g., color/size variations).",
        },
      },
      required: [
        "store_id",
        "product_id",
        "image_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update product image.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_product_variant",
    description: "Update a product variant.",
    toolSlug: "MAILCHIMP_UPDATE_PRODUCT_VARIANT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sku: {
          type: "string",
          description: "The stock keeping unit (SKU) of a product variant.",
        },
        url: {
          type: "string",
          description: "The URL for a product variant.",
        },
        price: {
          type: "number",
          description: "The price of a product variant.",
        },
        title: {
          type: "string",
          description: "The title of a product variant.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        image_url: {
          type: "string",
          description: "The image URL for a product variant.",
        },
        backorders: {
          type: "string",
          description: "The backorders of a product variant.",
        },
        product_id: {
          type: "string",
          description: "The id for the product of a store.",
        },
        variant_id: {
          type: "string",
          description: "The id for the product variant.",
        },
        visibility: {
          type: "string",
          description: "The visibility of a product variant.",
        },
        inventory_quantity: {
          type: "integer",
          description: "The inventory quantity of a product variant.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "variant_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update product variant.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_promo_code",
    description: "Update a promo code.",
    toolSlug: "MAILCHIMP_UPDATE_PROMO_CODE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        code: {
          type: "string",
          description: "The discount code. Restricted to UTF-8 characters with max length 50.",
        },
        enabled: {
          type: "boolean",
          description: "Whether the promo code is currently enabled.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        usage_count: {
          type: "integer",
          description: "Number of times promo code has been used.",
        },
        promo_code_id: {
          type: "string",
          description: "The id for the promo code of a store.",
        },
        promo_rule_id: {
          type: "string",
          description: "The id for the promo rule of a store.",
        },
        redemption_url: {
          type: "string",
          description: "The url that should be used in the promotion campaign restricted to UTF-8 characters with max length 2000. ",
        },
        created_at_foreign: {
          type: "string",
          description: "The date and time the promotion was created in ISO 8601 format.",
        },
        updated_at_foreign: {
          type: "string",
          description: "The date and time the promotion was updated in ISO 8601 format.",
        },
      },
      required: [
        "store_id",
        "promo_rule_id",
        "promo_code_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update promo code.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_promo_rule",
    description: "Update an existing promo rule for an e-commerce store. Promo rules define discount promotions that can be applied to orders, items, or shipping. Only the fields provided will be updated.",
    toolSlug: "MAILCHIMP_UPDATE_PROMO_RULE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        type: {
          type: "string",
          description: "Type of discount. For free shipping set type to fixed.",
          enum: [
            "fixed",
            "percentage",
          ],
        },
        title: {
          type: "string",
          description: "The title that will show up in promotion campaign. Restricted to UTF-8 characters with max length of 100 bytes. ",
        },
        amount: {
          type: "number",
          description: "The amount of the promo code discount. If \"type\" is \"fixed\", the amount is treated as a monetary value. If \"type\" is \"percentage\", amount must be a decimal value between 0.0 and 1.0, inclusive. ",
        },
        target: {
          type: "string",
          description: "The target that the discount applies to.",
          enum: [
            "per_item",
            "total",
            "shipping",
          ],
        },
        enabled: {
          type: "boolean",
          description: "Whether the promo rule is currently enabled.",
        },
        ends_at: {
          type: "string",
          description: "The date and time when the promotion ends. Must be after starts_at and in ISO 8601 format. ",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store.",
        },
        starts_at: {
          type: "string",
          description: "The date and time when the promotion is in effect in ISO 8601 format.",
        },
        description: {
          type: "string",
          description: "The description of a promotion restricted to UTF-8 characters with max length 255. ",
        },
        promo_rule_id: {
          type: "string",
          description: "The unique identifier for the promo rule to update.",
        },
        created_at_foreign: {
          type: "string",
          description: "The date and time the promotion was created in ISO 8601 format.",
        },
        updated_at_foreign: {
          type: "string",
          description: "The date and time the promotion was updated in ISO 8601 format.",
        },
      },
      required: [
        "store_id",
        "promo_rule_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update promo rule.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_store",
    description: "Update a store.",
    toolSlug: "MAILCHIMP_UPDATE_STORE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The name of the store.",
        },
        phone: {
          type: "string",
          description: "The store phone number.",
        },
        domain: {
          type: "string",
          description: "The store domain.",
        },
        platform: {
          type: "string",
          description: "The e-commerce platform of the store.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        timezone: {
          type: "string",
          description: "The timezone for the store.",
        },
        is_syncing: {
          type: "boolean",
          description: "Whether to disable automations because the store is currently [syncing](https://mailchimp.com/developer/marketing/docs/e-commerce/#pausing-store-automations). ",
        },
        money_format: {
          type: "string",
          description: "The currency format for the store. For example: `$`, `£`, etc.",
        },
        address__city: {
          type: "string",
          description: "The city the store is located in.",
        },
        currency_code: {
          type: "string",
          description: "The three-letter ISO 4217 code for the currency that the store accepts.",
        },
        email_address: {
          type: "string",
          description: "The email address for the store.",
        },
        primary_locale: {
          type: "string",
          description: "The primary locale for the store. For example: `en`, `de`, etc.",
        },
        address__country: {
          type: "string",
          description: "The store\"s country.",
        },
        address__address1: {
          type: "string",
          description: "The store\"s mailing address.",
        },
        address__address2: {
          type: "string",
          description: "An additional field for the store\"s mailing address.",
        },
        address__latitude: {
          type: "integer",
          description: "The latitude of the store location.",
        },
        address__province: {
          type: "string",
          description: "The store\"s state name or normalized province.",
        },
        address__longitude: {
          type: "integer",
          description: "The longitude of the store location.",
        },
        address__postal__code: {
          type: "string",
          description: "The store\"s postal or zip code.",
        },
        address__country__code: {
          type: "string",
          description: "The two-letter code for to the store\"s country.",
        },
        address__province__code: {
          type: "string",
          description: "The two-letter code for the store\"s province or state.",
        },
      },
      required: [
        "store_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Update store.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_template",
    description: "Update the name, HTML, or `folder_id` of an existing template.",
    toolSlug: "MAILCHIMP_UPDATE_TEMPLATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        html: {
          type: "string",
          description: "The raw HTML for the template. Supports the Mailchimp Template Language (e.g., *|FNAME|*, *|LNAME|*) for personalization. See: https://mailchimp.com/help/getting-started-with-mailchimps-template-language/",
        },
        name: {
          type: "string",
          description: "The name of the template.",
        },
        folder_id: {
          type: "string",
          description: "The id of the folder to assign the template to. Pass an empty string to remove from folder.",
        },
        template_id: {
          type: "string",
          description: "The unique id for the template.",
        },
      },
      required: [
        "template_id",
        "name",
        "html",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "templates",
    ],
    askBefore: [
      "Confirm the parameters before executing Update template.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_template_folder",
    description: "Update the name of an existing template folder in Mailchimp. Template folders help organize email templates for easier management. Use this action to rename a folder. The folder_id can be obtained from the add_template_folder or list_template_folders actions. Returns the updated folder information including the new name, folder ID, and the count of templates contained in the folder.",
    toolSlug: "MAILCHIMP_UPDATE_TEMPLATE_FOLDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        name: {
          type: "string",
          description: "The new name for the template folder. This will replace the existing folder name.",
        },
        folder_id: {
          type: "string",
          description: "The unique ID of the template folder to update. Obtain this ID from the response of add_template_folder or list_template_folders actions.",
        },
      },
      required: [
        "folder_id",
        "name",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "templatefolders",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Template Folder.",
    ],
  }),
  composioTool({
    name: "mailchimp_update_webhook",
    description: "Update the settings for an existing webhook in a Mailchimp list (audience). This action allows you to modify the URL, event triggers, and source triggers of a webhook. Only the settings you provide will be updated; other settings will remain unchanged.",
    toolSlug: "MAILCHIMP_UPDATE_WEBHOOK",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        url: {
          type: "string",
          description: "A valid, publicly accessible URL for the webhook endpoint. Mailchimp will verify this URL is reachable before updating.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list (audience). Use MAILCHIMP_GET_LISTS_INFO to retrieve available list IDs.",
        },
        webhook_id: {
          type: "string",
          description: "The unique ID of the webhook to update. Use MAILCHIMP_LIST_WEBHOOKS to retrieve available webhook IDs for a list.",
        },
        sources__api: {
          type: "boolean",
          description: "Whether the webhook is triggered by actions initiated via the API.",
        },
        sources__user: {
          type: "boolean",
          description: "Whether the webhook is triggered by subscriber-initiated actions.",
        },
        sources__admin: {
          type: "boolean",
          description: "Whether the webhook is triggered by admin-initiated actions in the web interface.",
        },
        events__cleaned: {
          type: "boolean",
          description: "Whether the webhook is triggered when a subscriber's email address is cleaned from the list.",
        },
        events__profile: {
          type: "boolean",
          description: "Whether the webhook is triggered when a subscriber's profile is updated.",
        },
        events__upemail: {
          type: "boolean",
          description: "Whether the webhook is triggered when a subscriber's email address is changed.",
        },
        events__campaign: {
          type: "boolean",
          description: "Whether the webhook is triggered when a campaign is sent or cancelled.",
        },
        events__subscribe: {
          type: "boolean",
          description: "Whether the webhook is triggered when a list subscriber is added.",
        },
        events__unsubscribe: {
          type: "boolean",
          description: "Whether the webhook is triggered when a list member unsubscribes.",
        },
      },
      required: [
        "list_id",
        "webhook_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "lists",
    ],
    askBefore: [
      "Confirm the parameters before executing Update webhook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_update_workflow_email",
    description: "Update settings for a classic automation workflow email. Only works with workflows of type: abandonedBrowse, abandonedCart, emailFollowup, or singleWelcome.",
    toolSlug: "MAILCHIMP_UPDATE_WORKFLOW_EMAIL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        delay__type: {
          type: "string",
          description: "The type of delay for an automation email.",
          enum: [
            "now",
            "day",
            "hour",
            "week",
          ],
        },
        workflow_id: {
          type: "string",
          description: "The unique id for the Automation workflow.",
        },
        delay__action: {
          type: "string",
          description: "The action that triggers the delay of an automation emails.",
          enum: [
            "signup",
            "ecomm_abandoned_browse",
            "ecomm_abandoned_cart",
          ],
        },
        delay__amount: {
          type: "integer",
          description: "The delay amount for an automation email.",
        },
        settings__title: {
          type: "string",
          description: "The title of the Automation.",
        },
        delay__direction: {
          type: "string",
          description: "Whether the delay settings describe before or after the delay action of an automation email. ",
          enum: [
            "after",
          ],
        },
        workflow_email_id: {
          type: "string",
          description: "The unique id for the Automation workflow email.",
        },
        settings__reply__to: {
          type: "string",
          description: "The reply-to email address for the Automation.",
        },
        settings__from__name: {
          type: "string",
          description: "The \"from\" name for the Automation (not an email address).",
        },
        settings__preview__text: {
          type: "string",
          description: "The preview text for the campaign.",
        },
        settings__subject__line: {
          type: "string",
          description: "The subject line for the campaign.",
        },
      },
      required: [
        "workflow_id",
        "workflow_email_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "automations",
    ],
    askBefore: [
      "Confirm the parameters before executing Update workflow email.",
    ],
  }),
  composioTool({
    name: "mailchimp_upsert_ecommerce_stores_orders",
    description: "Add or update an e-commerce order in a Mailchimp store. Uses PUT semantics - if the order exists it will be updated, otherwise a new order will be created. The order_id in the path and the id in the request body should match.",
    toolSlug: "MAILCHIMP_UPSERT_ECOMMERCE_STORES_ORDERS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the order. This should match the order_id path parameter.",
        },
        lines: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "An array of the order's line items. Each line item must include: 'id' (string, required - unique identifier for the line item), 'product_id' (string - unique identifier for the product), 'product_variant_id' (string - unique identifier for the product variant), 'quantity' (integer - quantity of the line item), 'price' (number - price of the line item). Optional: 'product_title', 'product_variant_title', 'discount', 'product' (object with product details).",
        },
        promos: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
          },
          description: "The promo codes applied on the order. Each promo object should contain 'code' (string, required), 'amount_discounted' (number, required), and 'type' (string, required).",
        },
        cart_id: {
          type: "string",
          description: "A cart id that the order was placed for.",
        },
        order_id: {
          type: "string",
          description: "The unique identifier for the order in the store. This is used in the URL path and should match the 'id' field in the request body.",
        },
        store_id: {
          type: "string",
          description: "The unique identifier for the e-commerce store.",
        },
        order_url: {
          type: "string",
          description: "The URL for the order.",
        },
        tax_total: {
          type: "number",
          description: "The tax total for the order.",
        },
        campaign_id: {
          type: "string",
          description: "A string that uniquely identifies the campaign for an order.",
        },
        order_total: {
          type: "number",
          description: "The total for the order.",
        },
        customer__id: {
          type: "string",
          description: "A unique identifier for the customer associated with this order. Required. Limited to 50 characters.",
        },
        landing_site: {
          type: "string",
          description: "The URL for the page where the buyer landed when entering the shop.",
        },
        outreach__id: {
          type: "string",
          description: "A unique identifier for the outreach. Can be an email campaign ID.",
        },
        tracking_url: {
          type: "string",
          description: "The tracking URL associated with the order.",
        },
        currency_code: {
          type: "string",
          description: "The three-letter ISO 4217 code for the currency that the store accepts.",
        },
        tracking_code: {
          type: "string",
          description: "The Mailchimp tracking code for the order. Uses the 'mc_tc' parameter in E-Commerce tracking URLs.",
          enum: [
            "prec",
          ],
        },
        discount_total: {
          type: "number",
          description: "The total amount of the discounts to be applied to the price of the order.",
        },
        shipping_total: {
          type: "number",
          description: "The shipping total for the order.",
        },
        tracking_number: {
          type: "string",
          description: "The tracking number associated with the order.",
        },
        financial_status: {
          type: "string",
          description: "The order status. Use this parameter to trigger Order Notifications.",
        },
        tracking_carrier: {
          type: "string",
          description: "The tracking carrier associated with the order.",
        },
        customer__company: {
          type: "string",
          description: "The customer's company.",
        },
        fulfillment_status: {
          type: "string",
          description: "The fulfillment status for the order. Use this parameter to trigger Order Notifications.",
        },
        updated_at_foreign: {
          type: "string",
          description: "The date and time the order was updated in ISO 8601 format.",
        },
        cancelled_at_foreign: {
          type: "string",
          description: "The date and time the order was cancelled in ISO 8601 format. Note: passing a value for this parameter will cancel the order being created.",
        },
        customer__last__name: {
          type: "string",
          description: "The customer's last name.",
        },
        processed_at_foreign: {
          type: "string",
          description: "The date and time the order was processed in ISO 8601 format.",
        },
        customer__first__name: {
          type: "string",
          description: "The customer's first name.",
        },
        billing__address__city: {
          type: "string",
          description: "The city in the billing address.",
        },
        billing__address__name: {
          type: "string",
          description: "The name associated with the billing address.",
        },
        billing__address__phone: {
          type: "string",
          description: "The phone number for the billing address.",
        },
        customer__address__city: {
          type: "string",
          description: "The city the customer is located in.",
        },
        shipping__address__city: {
          type: "string",
          description: "The city in the order's shipping address.",
        },
        shipping__address__name: {
          type: "string",
          description: "The name associated with an order's shipping address.",
        },
        customer__email__address: {
          type: "string",
          description: "The customer's email address.",
        },
        shipping__address__phone: {
          type: "string",
          description: "The phone number for the order's shipping address.",
        },
        billing__address__company: {
          type: "string",
          description: "The company associated with the billing address.",
        },
        billing__address__country: {
          type: "string",
          description: "The country in the billing address.",
        },
        customer__opt__in__status: {
          type: "boolean",
          description: "The customer's opt-in status. This value will never overwrite the opt-in status of a pre-existing Mailchimp list member, but will apply to list members that are added through the e-commerce API endpoints. Customers who don't opt in to your Mailchimp list will be added as Transactional members.",
        },
        billing__address__address1: {
          type: "string",
          description: "The billing address for the order.",
        },
        billing__address__address2: {
          type: "string",
          description: "An additional field for the billing address.",
        },
        billing__address__latitude: {
          type: "number",
          description: "The latitude for the billing address location.",
        },
        billing__address__province: {
          type: "string",
          description: "The state or normalized province in the billing address.",
        },
        customer__address__country: {
          type: "string",
          description: "The customer's country.",
        },
        shipping__address__company: {
          type: "string",
          description: "The company associated with the shipping address.",
        },
        shipping__address__country: {
          type: "string",
          description: "The country in the shipping address.",
        },
        billing__address__longitude: {
          type: "number",
          description: "The longitude for the billing address location.",
        },
        customer__address__address1: {
          type: "string",
          description: "The mailing address of the customer.",
        },
        customer__address__address2: {
          type: "string",
          description: "An additional field for the customer's mailing address.",
        },
        customer__address__province: {
          type: "string",
          description: "The customer's state name or normalized province.",
        },
        shipping__address__address1: {
          type: "string",
          description: "The shipping address for the order.",
        },
        shipping__address__address2: {
          type: "string",
          description: "An additional field for the shipping address.",
        },
        shipping__address__latitude: {
          type: "number",
          description: "The latitude for the shipping address location.",
        },
        shipping__address__province: {
          type: "string",
          description: "The state or normalized province in the order's shipping address.",
        },
        shipping__address__longitude: {
          type: "number",
          description: "The longitude for the shipping address location.",
        },
        billing__address__postal__code: {
          type: "string",
          description: "The postal or zip code in the billing address.",
        },
        billing__address__country__code: {
          type: "string",
          description: "The two-letter code for the country in the billing address.",
        },
        customer__address__postal__code: {
          type: "string",
          description: "The customer's postal or zip code.",
        },
        shipping__address__postal__code: {
          type: "string",
          description: "The postal or zip code in the shipping address.",
        },
        billing__address__province__code: {
          type: "string",
          description: "The two-letter code for the province in the billing address.",
        },
        customer__address__country__code: {
          type: "string",
          description: "The two-letter code for the customer's country.",
        },
        shipping__address__country__code: {
          type: "string",
          description: "The two-letter code for the country in the shipping address.",
        },
        customer__address__province__code: {
          type: "string",
          description: "The two-letter code for the customer's province or state.",
        },
        shipping__address__province__code: {
          type: "string",
          description: "The two-letter code for the province or state in the shipping address.",
        },
      },
      required: [
        "store_id",
        "order_id",
        "id",
        "customer__id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Upsert ecommerce stores orders.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_upsert_ecommerce_stores_products",
    description: "Create or update a product in a Mailchimp e-commerce store. Use when you need to add a new product or update an existing product with idempotent behavior. This endpoint uses PUT semantics - if the product exists, it will be updated; if not, a new product will be created.",
    toolSlug: "MAILCHIMP_UPSERT_ECOMMERCE_STORES_PRODUCTS",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        id: {
          type: "string",
          description: "A unique identifier for the product.",
        },
        url: {
          type: "string",
          description: "The URL for a product.",
        },
        type: {
          type: "string",
          description: "The type of product.",
        },
        title: {
          type: "string",
          description: "The title of a product.",
        },
        handle: {
          type: "string",
          description: "The handle of a product.",
        },
        images: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "A unique identifier for the product image.",
              },
              url: {
                type: "string",
                description: "The URL for a product image.",
              },
              variant_ids: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "The list of product variants using the image.",
              },
            },
            description: "Input schema for a product image.",
          },
          description: "An array of the product's images.",
        },
        vendor: {
          type: "string",
          description: "The vendor for a product.",
        },
        store_id: {
          type: "string",
          description: "The store id.",
        },
        variants: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              id: {
                type: "string",
                description: "A unique identifier for the product variant.",
              },
              sku: {
                type: "string",
                description: "The stock keeping unit (SKU) of a product variant.",
              },
              url: {
                type: "string",
                description: "The URL for a product variant.",
              },
              price: {
                type: "number",
                description: "The price of a product variant.",
              },
              title: {
                type: "string",
                description: "The title of a product variant.",
              },
              image_url: {
                type: "string",
                description: "The image URL for a product variant.",
              },
              backorders: {
                type: "string",
                description: "The backorders of a product variant.",
              },
              visibility: {
                type: "string",
                description: "The visibility of a product variant.",
              },
              inventory_quantity: {
                type: "integer",
                description: "The inventory quantity of a product variant.",
              },
            },
            description: "Input schema for a product variant.",
          },
          description: "An array of the product's variants. At least one variant is required for each product. A variant can use the same `id` and `title` as the parent product.",
        },
        image_url: {
          type: "string",
          description: "The image URL for a product.",
        },
        product_id: {
          type: "string",
          description: "The id for the product of a store.",
        },
        description: {
          type: "string",
          description: "The description of a product.",
        },
        published_at_foreign: {
          type: "string",
          description: "The date and time the product was published.",
        },
      },
      required: [
        "store_id",
        "product_id",
        "id",
        "title",
        "variants",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "ecommerce",
    ],
    askBefore: [
      "Confirm the parameters before executing Upsert ecommerce stores products.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "mailchimp_verify_connected_site_script",
    description: "Verify that the Mailchimp connected site tracking script has been installed on the website. This checks if the script is properly installed either via the script URL or HTML fragment. Use this to confirm a connected site's tracking integration is working correctly. Returns HTTP 204 on success (script is installed) or HTTP 404 if the site is not found.",
    toolSlug: "MAILCHIMP_VERIFY_CONNECTED_SITE_SCRIPT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        connected_site_id: {
          type: "string",
          description: "The unique identifier for the connected site (foreign_id). Obtain this from LIST_CONNECTED_SITES or ADD_CONNECTED_SITE actions.",
        },
      },
      required: [
        "connected_site_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "connectedsites",
    ],
  }),
  composioTool({
    name: "mailchimp_verify_domain",
    description: "Complete domain verification by submitting the verification code. This action completes the domain verification process started by 'add_domain_to_account'. When a domain is added, a verification email is sent to the specified email address containing a unique verification code. Use this action to submit that code and complete the verification. Once verified, the domain can be used as a sender address in campaigns. Prerequisites: - Domain must be added first using 'add_domain_to_account' - Domain status should be 'VERIFICATION_IN_PROGRESS' - You need the verification code from the email sent during domain addition Common errors: - 400: Invalid verification code - the code doesn't match or has expired - 404: Domain not found - the domain hasn't been added to the account",
    toolSlug: "MAILCHIMP_VERIFY_DOMAIN",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        code: {
          type: "string",
          description: "The verification code from the email sent to the verification_email address when the domain was added via 'add_domain_to_account'. This is a unique code used to confirm ownership of the domain.",
        },
        domain_name: {
          type: "string",
          description: "The domain name to verify (e.g., 'yourdomain.com'). This must be a domain that was previously added via 'add_domain_to_account' and is in VERIFICATION_IN_PROGRESS status.",
        },
      },
      required: [
        "domain_name",
        "code",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "write",
      "verifieddomains",
    ],
    askBefore: [
      "Confirm the parameters before executing Verify domain.",
    ],
  }),
  composioTool({
    name: "mailchimp_view_default_content",
    description: "Get the sections that you can edit in a template, including each section's default content.",
    toolSlug: "MAILCHIMP_VIEW_DEFAULT_CONTENT",
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
          description: "A list of fields to return in the response. Use dot notation to reference nested fields (e.g., ['sections', '_links']). If not specified, all fields are returned.",
        },
        template_id: {
          type: "string",
          description: "The unique ID of the template to retrieve default content for.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation to reference nested fields (e.g., ['_links']). Cannot be used together with 'fields'.",
        },
      },
      required: [
        "template_id",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "templates",
    ],
  }),
  composioTool({
    name: "mailchimp_view_recent_activity",
    description: "Get a member's activity on a specific list, including opens, clicks, and unsubscribes.",
    toolSlug: "MAILCHIMP_VIEW_RECENT_ACTIVITY",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        count: {
          type: "integer",
          description: "The number of records to return. Default value is 10. Maximum value is 1000 ",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to return in the response. Use dot notation for nested fields (e.g., 'activity.activity_type'). Example: ['activity', 'email_id', 'list_id'].",
        },
        offset: {
          type: "integer",
          description: "Used for [pagination](https://mailchimp.com/developer/marketing/docs/methods-parameters/#pagination), this it the number of records from a collection to skip. Default value is 0. ",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of fields to exclude from the response. Use dot notation for nested fields (e.g., 'activity.avatar_url'). Example: ['_links'].",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member\"s email address. This endpoint also accepts a list member\"s email address or contact_id. ",
        },
        activity_filters: {
          type: "array",
          items: {
            type: "string",
          },
          description: "A list of activity type filters. Valid values include: 'open', 'click', 'bounce', 'unsub', 'sent', 'note', 'abuse', 'ecomm'. Example: ['open', 'click'].",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
  composioTool({
    name: "mailchimp_view_recent_activity50",
    description: "Get the last 50 events of a member's activity on a specific list, including opens, clicks, and unsubscribes.",
    toolSlug: "MAILCHIMP_VIEW_RECENT_ACTIVITY50",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        action: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of activity types to filter by (e.g., ['open', 'click', 'bounce', 'unsub', 'sent', 'ecomm', 'abuse']).",
        },
        fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to return (e.g., ['activity.action', 'activity.timestamp']). Use dot notation to reference sub-object parameters.",
        },
        list_id: {
          type: "string",
          description: "The unique ID for the list.",
        },
        exclude_fields: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of fields to exclude from response (e.g., ['_links']). Use dot notation to reference sub-object parameters.",
        },
        subscriber_hash: {
          type: "string",
          description: "The MD5 hash of the lowercase version of the list member\"s email address. This endpoint also accepts a list member\"s email address or contact_id. ",
        },
      },
      required: [
        "list_id",
        "subscriber_hash",
      ],
    },
    tags: [
      "composio",
      "mailchimp",
      "read",
      "lists",
    ],
  }),
];
