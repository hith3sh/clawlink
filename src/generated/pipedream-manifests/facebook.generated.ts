import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const FacebookPipedreamToolManifests = [
  {
    "integration": "facebook",
    "name": "facebook_get_comment",
    "description": "Retrieves a comment on a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/comment/#read)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "string",
          "title": "Page",
          "description": "The identifier of a page"
        },
        "post": {
          "type": "string",
          "title": "Post",
          "description": "The identifier of a post"
        },
        "comment": {
          "type": "string",
          "title": "Comment",
          "description": "The identifier of a comment"
        }
      },
      "required": [
        "page",
        "post",
        "comment"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "facebook",
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
      "app": "facebook",
      "componentId": "facebook_pages-get-comment",
      "version": "0.0.2",
      "authPropNames": [
        "facebookPages"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "facebookPages",
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
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "The identifier of a page",
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
          "name": "post",
          "type": "string",
          "label": "Post",
          "description": "The identifier of a post",
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
          "name": "comment",
          "type": "string",
          "label": "Comment",
          "description": "The identifier of a comment",
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
      "app": "facebook",
      "componentKey": "facebook_pages-get-comment",
      "componentName": "Get Comment"
    }
  },
  {
    "integration": "facebook",
    "name": "facebook_get_page",
    "description": "Retrieves a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/page)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "facebook",
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
      "app": "facebook",
      "componentId": "facebook_pages-get-page",
      "version": "0.0.2",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "facebook",
      "componentKey": "facebook_pages-get-page",
      "componentName": "Get Page"
    }
  },
  {
    "integration": "facebook",
    "name": "facebook_get_post",
    "description": "Retrieves a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/pagepost)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "string",
          "title": "Page",
          "description": "The identifier of a page"
        },
        "post": {
          "type": "string",
          "title": "Post",
          "description": "The identifier of a post"
        }
      },
      "required": [
        "page",
        "post"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "facebook",
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
      "app": "facebook",
      "componentId": "facebook_pages-get-post",
      "version": "0.0.2",
      "authPropNames": [
        "facebookPages"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "facebookPages",
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
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "The identifier of a page",
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
          "name": "post",
          "type": "string",
          "label": "Post",
          "description": "The identifier of a post",
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
      "app": "facebook",
      "componentKey": "facebook_pages-get-post",
      "componentName": "Get Post"
    }
  },
  {
    "integration": "facebook",
    "name": "facebook_list_comments",
    "description": "Retrieves a list of comments on a post on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/comment/#read)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "string",
          "title": "Page",
          "description": "The identifier of a page"
        },
        "post": {
          "type": "string",
          "title": "Post",
          "description": "The identifier of a post"
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        }
      },
      "required": [
        "page",
        "post"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "facebook",
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
      "app": "facebook",
      "componentId": "facebook_pages-list-comments",
      "version": "0.0.2",
      "authPropNames": [
        "facebookPages"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "facebookPages",
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
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "The identifier of a page",
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
          "name": "post",
          "type": "string",
          "label": "Post",
          "description": "The identifier of a post",
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
      "app": "facebook",
      "componentKey": "facebook_pages-list-comments",
      "componentName": "List Comments"
    }
  },
  {
    "integration": "facebook",
    "name": "facebook_list_posts",
    "description": "Retrieves a list of posts on a Facebook Page. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/page/feed)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "page": {
          "type": "string",
          "title": "Page",
          "description": "The identifier of a page"
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of results to return"
        }
      },
      "required": [
        "page"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "facebook",
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
      "app": "facebook",
      "componentId": "facebook_pages-list-posts",
      "version": "0.0.2",
      "authPropNames": [
        "facebookPages"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "facebookPages",
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
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "The identifier of a page",
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
      "app": "facebook",
      "componentKey": "facebook_pages-list-posts",
      "componentName": "List Posts"
    }
  }
] satisfies PipedreamActionToolManifest[];
