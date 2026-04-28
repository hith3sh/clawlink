import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const KlaviyoPipedreamToolManifests = [
  {
    "integration": "klaviyo",
    "name": "klaviyo_add_member_to_list",
    "description": "Add member to a specific list. [See the documentation](https://developers.klaviyo.com/en/reference/add_profiles_to_list)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "list": {
          "type": "string",
          "title": "List",
          "description": "The list which will be affected"
        },
        "profileIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Profile IDs",
          "description": "An array of profile IDs"
        }
      },
      "required": [
        "list",
        "profileIds"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "klaviyo",
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
      "app": "klaviyo",
      "componentId": "klaviyo-add-member-to-list",
      "version": "1.0.3",
      "authPropNames": [
        "klaviyo"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "klaviyo",
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
          "name": "list",
          "type": "string",
          "label": "List",
          "description": "The list which will be affected",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": true,
          "appAuth": false
        },
        {
          "name": "profileIds",
          "type": "string[]",
          "label": "Profile IDs",
          "description": "An array of profile IDs",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": true,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "klaviyo",
      "componentKey": "klaviyo-add-member-to-list",
      "componentName": "Add Member To List"
    }
  },
  {
    "integration": "klaviyo",
    "name": "klaviyo_create_new_list",
    "description": "Creates a new list in an account. [See the documentation](https://developers.klaviyo.com/en/reference/create_list)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "listName": {
          "type": "string",
          "title": "List Name",
          "description": "The name of the new list"
        }
      },
      "required": [
        "listName"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "klaviyo",
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
      "app": "klaviyo",
      "componentId": "klaviyo-create-new-list",
      "version": "0.0.5",
      "authPropNames": [
        "klaviyo"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "klaviyo",
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
          "name": "listName",
          "type": "string",
          "label": "List Name",
          "description": "The name of the new list",
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
      "app": "klaviyo",
      "componentKey": "klaviyo-create-new-list",
      "componentName": "Create New List"
    }
  },
  {
    "integration": "klaviyo",
    "name": "klaviyo_get_lists",
    "description": "Get a listing of all of the lists in an account. [See the documentation](https://developers.klaviyo.com/en/reference/get_lists)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sort": {
          "type": "string",
          "title": "Sort",
          "description": "The field to sort by"
        },
        "sortDirection": {
          "type": "string",
          "title": "Sort Direction",
          "description": "Whether to sort ascending or descending. Default: `descending`"
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "klaviyo",
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
      "app": "klaviyo",
      "componentId": "klaviyo-get-lists",
      "version": "0.0.6",
      "authPropNames": [
        "klaviyo"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "klaviyo",
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
          "name": "sort",
          "type": "string",
          "label": "Sort",
          "description": "The field to sort by",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "sortDirection",
          "type": "string",
          "label": "Sort Direction",
          "description": "Whether to sort ascending or descending. Default: `descending`",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "maxResults",
          "type": "integer",
          "label": "Max Results",
          "description": "The maximum number of results to return",
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
      "app": "klaviyo",
      "componentKey": "klaviyo-get-lists",
      "componentName": "Get Lists"
    }
  }
] satisfies PipedreamActionToolManifest[];
