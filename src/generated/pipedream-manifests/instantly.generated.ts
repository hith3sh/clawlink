import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const InstantlyPipedreamToolManifests = [
  {
    "integration": "instantly",
    "name": "instantly_add_lead_campaign",
    "description": "Adds a lead or leads to a campaign for tracking or further actions. [See the documentation](https://developer.instantly.ai/api/v2/lead/moveleads)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "leadIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Lead IDs",
          "description": "The array of lead IDs to include"
        },
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The ID of the campaign"
        },
        "skipIfInCampaign": {
          "type": "boolean",
          "title": "Skip if in Campaign",
          "description": "Skip lead if it exists in the campaign"
        },
        "waitForCompletion": {
          "type": "boolean",
          "title": "Wait for Completion",
          "description": "Set to `true` to poll the API in 3-second intervals until the background job is completed"
        }
      },
      "required": [
        "leadIds",
        "campaignId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "instantly",
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
      "app": "instantly",
      "componentId": "instantly-add-lead-campaign",
      "version": "0.0.3",
      "authPropNames": [
        "instantly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "instantly",
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
          "name": "leadIds",
          "type": "string[]",
          "label": "Lead IDs",
          "description": "The array of lead IDs to include",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The ID of the campaign",
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
          "name": "skipIfInCampaign",
          "type": "boolean",
          "label": "Skip if in Campaign",
          "description": "Skip lead if it exists in the campaign",
          "required": false,
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
          "name": "waitForCompletion",
          "type": "boolean",
          "label": "Wait for Completion",
          "description": "Set to `true` to poll the API in 3-second intervals until the background job is completed",
          "required": false,
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
      "app": "instantly",
      "componentKey": "instantly-add-lead-campaign",
      "componentName": "Add Leads to Campaign"
    }
  },
  {
    "integration": "instantly",
    "name": "instantly_add_tags_campaign",
    "description": "Adds tags to a specific campaign. [See the documentation](https://developer.instantly.ai/api/v2/customtag/toggletagresource)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Campaign ID",
          "description": "The campaign IDs to assign tags to"
        },
        "tagIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags ID",
          "description": "List of tag IDs to add"
        }
      },
      "required": [
        "campaignIds",
        "tagIds"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "instantly",
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
      "app": "instantly",
      "componentId": "instantly-add-tags-campaign",
      "version": "0.0.3",
      "authPropNames": [
        "instantly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "instantly",
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
          "name": "campaignIds",
          "type": "string[]",
          "label": "Campaign ID",
          "description": "The campaign IDs to assign tags to",
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
          "name": "tagIds",
          "type": "string[]",
          "label": "Tags ID",
          "description": "List of tag IDs to add",
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
      "app": "instantly",
      "componentKey": "instantly-add-tags-campaign",
      "componentName": "Add Tags to Campaign"
    }
  },
  {
    "integration": "instantly",
    "name": "instantly_update_lead_status",
    "description": "Updates the interest status of a lead in a campaign. [See the documentation](https://developer.instantly.ai/api/v2/customtag/toggletagresource)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The ID of the campaign"
        },
        "email": {
          "type": "string",
          "title": "Lead Email",
          "description": "Email address of the lead to update"
        },
        "newStatus": {
          "type": "string",
          "title": "New Status",
          "description": "Lead interest status. It can be either a static value, or a custom status interest value."
        }
      },
      "required": [
        "campaignId",
        "email",
        "newStatus"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "instantly",
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
      "app": "instantly",
      "componentId": "instantly-update-lead-status",
      "version": "0.0.3",
      "authPropNames": [
        "instantly"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "instantly",
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
          "name": "campaignId",
          "type": "string",
          "label": "Campaign ID",
          "description": "The ID of the campaign",
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
          "name": "email",
          "type": "string",
          "label": "Lead Email",
          "description": "Email address of the lead to update",
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
          "name": "newStatus",
          "type": "string",
          "label": "New Status",
          "description": "Lead interest status. It can be either a static value, or a custom status interest value.",
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
      "app": "instantly",
      "componentKey": "instantly-update-lead-status",
      "componentName": "Update Lead Status"
    }
  }
] satisfies PipedreamActionToolManifest[];
