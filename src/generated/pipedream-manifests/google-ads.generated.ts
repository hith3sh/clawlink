import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const GoogleAdsPipedreamToolManifests = [
  {
    "integration": "google-ads",
    "name": "google-ads_add_contact_to_list_by_email",
    "description": "Adds a contact to a specific customer list in Google Ads. Lists typically update in 6 to 12 hours after operation. [See the documentation](https://developers.google.com/google-ads/api/docs/remarketing/audience-segments/customer-match/get-started)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "contactEmail": {
          "type": "string",
          "title": "Contact Email",
          "description": "Email address of the contact to add to the customer list."
        },
        "userListId": {
          "type": "string",
          "title": "Customer List ID",
          "description": "Select a Customer List to add the contact to, or provide a custom Customer List ID."
        }
      },
      "required": [
        "contactEmail",
        "userListId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "__kind": "customer_match_user_list",
      "name": "customer_match_user_list",
      "moduleUrl": "https://googleads.googleapis.com/v21/customers/{customer_id}/userLists:mutate"
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-add-contact-to-list-by-email",
      "version": "0.1.7",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "__kind",
          "type": "string",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "moduleUrl",
          "type": "string",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactEmail",
          "type": "string",
          "label": "Contact Email",
          "description": "Email address of the contact to add to the customer list.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "userListId",
          "type": "string",
          "label": "Customer List ID",
          "description": "Select a Customer List to add the contact to, or provide a custom Customer List ID.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-add-contact-to-list-by-email",
      "componentName": "Add Contact to Customer List by Email"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_create_ad_group_report",
    "description": "Creates a report for the Ad Group resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-create-ad-group-report",
      "version": "0.0.1",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-create-ad-group-report",
      "componentName": "Create Ad Group Report"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_create_ad_report",
    "description": "Creates a report for the Ad resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-create-ad-report",
      "version": "0.0.1",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-create-ad-report",
      "componentName": "Create Ad Report"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_create_campaign_report",
    "description": "Creates a report for the Campaign resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-create-campaign-report",
      "version": "0.0.1",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-create-campaign-report",
      "componentName": "Create Campaign Report"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_create_customer_list",
    "description": "create-customer-list via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-create-customer-list",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-create-customer-list",
      "componentName": "create-customer-list"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_create_customer_report",
    "description": "Creates a report for the Customer resource. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-create-customer-report",
      "version": "0.0.1",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-create-customer-report",
      "componentName": "Create Customer Report"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_create_report",
    "description": "Generates a report from your Google Ads data. [See the documentation](https://developers.google.com/google-ads/api/reference/rpc/v21/GoogleAdsService/Search?transport=rest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "resource": {
          "type": "string",
          "title": "Resource",
          "description": "The resource to generate a report for."
        }
      },
      "required": [
        "resource"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "__kind": "report",
      "name": "report",
      "moduleUrl": "https://.googleapis.com/googleads/v21/GoogleAdsService/Search"
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-create-report",
      "version": "0.1.6",
      "authPropNames": [],
      "dynamicPropNames": [
        "resource"
      ],
      "props": [
        {
          "name": "__kind",
          "type": "string",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "moduleUrl",
          "type": "string",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "resource",
          "type": "string",
          "label": "Resource",
          "description": "The resource to generate a report for.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-create-report",
      "componentName": "Create Report"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_generate_keyword_ideas",
    "description": "`Generate keyword ideas using the Google Ads API. [See the documentation](${docLink})`",
    "inputSchema": {
      "type": "object",
      "properties": {
        "accountId": {
          "type": "string",
          "title": "Use Google Ads As",
          "description": "Select an account from the list of [customers directly accessible by the authenticated user](https://developers.google.com/google-ads/api/reference/rpc/v21/CustomerService/ListAccessibleCustomers?transport=rest). This is usually a **Manager Account**, used as `login-customer-id`"
        },
        "customerClientId": {
          "type": "string",
          "title": "Managed Account",
          "description": "Select a [customer client](https://developers.google.com/google-ads/api/reference/rpc/v21/CustomerClient) from the list of [customers linked to the selected account](https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy)."
        },
        "additionalFields": {
          "type": "string"
        }
      },
      "required": [
        "accountId",
        "customerClientId",
        "additionalFields"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-generate-keyword-ideas",
      "version": "0.0.2",
      "authPropNames": [
        "googleAds"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleAds",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "accountId",
          "type": "string",
          "label": "Use Google Ads As",
          "description": "Select an account from the list of [customers directly accessible by the authenticated user](https://developers.google.com/google-ads/api/reference/rpc/v21/CustomerService/ListAccessibleCustomers?transport=rest). This is usually a **Manager Account**, used as `login-customer-id`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "customerClientId",
          "type": "string",
          "label": "Managed Account",
          "description": "Select a [customer client](https://developers.google.com/google-ads/api/reference/rpc/v21/CustomerClient) from the list of [customers linked to the selected account](https://developers.google.com/google-ads/api/docs/account-management/get-account-hierarchy).",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "additionalFields",
          "type": "string",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-generate-keyword-ideas",
      "componentName": "Generate Keyword Ideas"
    }
  },
  {
    "integration": "google-ads",
    "name": "google-ads_send_offline_conversion",
    "description": "send-offline-conversion via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-ads",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "google_ads",
      "componentId": "google_ads-send-offline-conversion",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "google_ads",
      "componentKey": "google_ads-send-offline-conversion",
      "componentName": "send-offline-conversion"
    }
  }
] satisfies PipedreamActionToolManifest[];
