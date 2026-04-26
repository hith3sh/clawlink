import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const LinkedinPipedreamToolManifests = [
  {
    "integration": "linkedin",
    "name": "linkedin_create_comment",
    "description": "Create a comment on a share or user generated content post. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#create-comment)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "urnToComment": {
          "type": "string",
          "title": "Urn to comment",
          "description": "The share or user generated content post where the comment will be made."
        },
        "actor": {
          "type": "string",
          "title": "Actor",
          "description": "Entity which is authoring the comment, must be a person or an organization URN."
        },
        "message": {
          "type": "string",
          "title": "Message",
          "description": "Text of the comment. May contain attributes such as links to people and organizations."
        },
        "content": {
          "type": "object",
          "title": "Content",
          "description": "Array of a media content entities."
        },
        "parentComment": {
          "type": "string",
          "title": "Parent Comment",
          "description": "For nested comments, this is the urn of the parent comment. This is not available for first-level comments."
        }
      },
      "required": [
        "urnToComment",
        "actor",
        "message"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-create-comment",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "urnToComment",
          "type": "string",
          "label": "Urn to comment",
          "description": "The share or user generated content post where the comment will be made.",
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
          "name": "actor",
          "type": "string",
          "label": "Actor",
          "description": "Entity which is authoring the comment, must be a person or an organization URN.",
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
          "name": "message",
          "type": "string",
          "label": "Message",
          "description": "Text of the comment. May contain attributes such as links to people and organizations.",
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
          "name": "content",
          "type": "any",
          "label": "Content",
          "description": "Array of a media content entities.",
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
          "name": "parentComment",
          "type": "string",
          "label": "Parent Comment",
          "description": "For nested comments, this is the urn of the parent comment. This is not available for first-level comments.",
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
      "app": "linkedin",
      "componentKey": "linkedin-create-comment",
      "componentName": "Create Comment"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_create_like_on_share",
    "description": "Creates a like on a share. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#create-a-like-on-a-share)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parentUrn": {
          "type": "string",
          "title": "Parent Urn",
          "description": "The top-level share urn or user generated content where the like will be performed."
        },
        "actor": {
          "type": "string",
          "title": "Actor",
          "description": "Entity performing the like. Must be a person or an organization URN."
        },
        "object": {
          "type": "string",
          "title": "Object",
          "description": "Use the `object` field in the request body to specify the URN of the entity to which the like belongs. This object should be a sub-entity of the top-level share indicated in the request URL"
        }
      },
      "required": [
        "parentUrn",
        "actor",
        "object"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-create-like-on-share",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "parentUrn",
          "type": "string",
          "label": "Parent Urn",
          "description": "The top-level share urn or user generated content where the like will be performed.",
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
          "name": "actor",
          "type": "string",
          "label": "Actor",
          "description": "Entity performing the like. Must be a person or an organization URN.",
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
          "name": "object",
          "type": "string",
          "label": "Object",
          "description": "Use the `object` field in the request body to specify the URN of the entity to which the like belongs. This object should be a sub-entity of the top-level share indicated in the request URL",
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
      "app": "linkedin",
      "componentKey": "linkedin-create-like-on-share",
      "componentName": "Create Like On Share"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_create_text_post_organization",
    "description": "Create post on LinkedIn using text, URL or article. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api?view=li-lms-2022-11&tabs=http#create-organic-posts) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "organizationId": {
          "type": "string",
          "title": "Organization Id",
          "description": "ID of the organization that will author the post"
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "Text to be posted on LinkedIn timeline"
        },
        "article": {
          "type": "string",
          "title": "Article URL",
          "description": "The URL of an article to share"
        }
      },
      "required": [
        "organizationId",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-create-text-post-organization",
      "version": "0.0.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "organizationId",
          "type": "string",
          "label": "Organization Id",
          "description": "ID of the organization that will author the post",
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
          "name": "text",
          "type": "string",
          "label": "Text",
          "description": "Text to be posted on LinkedIn timeline",
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
          "name": "article",
          "type": "string",
          "label": "Article URL",
          "description": "The URL of an article to share",
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
      "app": "linkedin",
      "componentKey": "linkedin-create-text-post-organization",
      "componentName": "Create a Simple Post (Organization)"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_create_text_post_user",
    "description": "Create post on LinkedIn using text, URL or article. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/posts-api?view=li-lms-2022-11&tabs=http#create-organic-posts) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "visibility": {
          "type": "string",
          "title": "Visibility",
          "description": "Visibility restrictions on content",
          "enum": [
            "CONNECTIONS",
            "PUBLIC",
            "LOGGED_IN"
          ]
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "Text to be posted on LinkedIn timeline"
        },
        "article": {
          "type": "string",
          "title": "Article URL",
          "description": "The URL of an article to share"
        }
      },
      "required": [
        "visibility",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-create-text-post-user",
      "version": "0.0.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "visibility",
          "type": "string",
          "label": "Visibility",
          "description": "Visibility restrictions on content",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "Only my connections",
              "value": "CONNECTIONS"
            },
            {
              "label": "Public",
              "value": "PUBLIC"
            },
            {
              "label": "Logged-in users only",
              "value": "LOGGED_IN"
            }
          ]
        },
        {
          "name": "text",
          "type": "string",
          "label": "Text",
          "description": "Text to be posted on LinkedIn timeline",
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
          "name": "article",
          "type": "string",
          "label": "Article URL",
          "description": "The URL of an article to share",
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
      "app": "linkedin",
      "componentKey": "linkedin-create-text-post-user",
      "componentName": "Create a Simple Post (User)"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_delete_post",
    "description": "Removes a post from user's wall. [See the documentation](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/share-api?tabs=http#delete-shares) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "postId": {
          "type": "string",
          "title": "Post Id",
          "description": "URN of the post that will be deleted. URN must be either a ugcPostUrn (`urn:li:ugcPost:{id}`) or shareUrn (`urn:li:share:{id}`). The shareUrn can be found in the post's embed code."
        }
      },
      "required": [
        "postId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-delete-post",
      "version": "0.0.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "postId",
          "type": "string",
          "label": "Post Id",
          "description": "URN of the post that will be deleted. URN must be either a ugcPostUrn (`urn:li:ugcPost:{id}`) or shareUrn (`urn:li:share:{id}`). The shareUrn can be found in the post's embed code.",
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
      "app": "linkedin",
      "componentKey": "linkedin-delete-post",
      "componentName": "Delete Post"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_fetch_ad_account",
    "description": "Fetches an individual adAccount given its id. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-accounts#fetch-ad-account)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "adAccountId": {
          "type": "string",
          "title": "Ad Account Id",
          "description": "ID of the adAccount to fetch."
        }
      },
      "required": [
        "adAccountId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-fetch-ad-account",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "adAccountId",
          "type": "string",
          "label": "Ad Account Id",
          "description": "ID of the adAccount to fetch.",
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
      "app": "linkedin",
      "componentKey": "linkedin-fetch-ad-account",
      "componentName": "Fetch Ad Account"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_get_current_member_profile",
    "description": "Gets the profile of the current authenticated member. [See the docs here](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-current-members-profile)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-get-current-member-profile",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
        }
      ]
    },
    "source": {
      "app": "linkedin",
      "componentKey": "linkedin-get-current-member-profile",
      "componentName": "Get Current Member Profile"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_get_member_profile",
    "description": "Gets another member's profile, given its person id. [See the docs here](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-other-members-profile)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "personId": {
          "type": "string",
          "title": "Person Id",
          "description": "Identifier of the person to retrieve"
        }
      },
      "required": [
        "personId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-get-member-profile",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "personId",
          "type": "string",
          "label": "Person Id",
          "description": "Identifier of the person to retrieve",
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
      "app": "linkedin",
      "componentKey": "linkedin-get-member-profile",
      "componentName": "Get Member Profile"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_get_multiple_member_profiles",
    "description": "Gets multiple member profiles at once. [See the docs here](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api#retrieve-other-members-profile)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "peopleIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "People Ids",
          "description": "Identifiers of the members to retrieve"
        }
      },
      "required": [
        "peopleIds"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-get-multiple-member-profiles",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "peopleIds",
          "type": "string[]",
          "label": "People Ids",
          "description": "Identifiers of the members to retrieve",
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
      "app": "linkedin",
      "componentKey": "linkedin-get-multiple-member-profiles",
      "componentName": "Get Multiple Member Profiles"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_get_org_member_access",
    "description": "Gets the organization access control information of the current authenticated member. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control-by-role?view=li-lms-2025-01&tabs=http#find-a-members-organization-access-control-information)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "role": {
          "type": "string",
          "title": "Role",
          "description": "Limit results to specific roles, such as ADMINISTRATOR or DIRECT_SPONSORED_CONTENT_POSTER."
        },
        "state": {
          "type": "string",
          "title": "State",
          "description": "Limit results to specific role states, such as APPROVED or REQUESTED."
        },
        "max": {
          "type": "number",
          "title": "Max",
          "description": "Maximum number of results to return"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-get-org-member-access",
      "version": "1.0.6",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "role",
          "type": "string",
          "label": "Role",
          "description": "Limit results to specific roles, such as ADMINISTRATOR or DIRECT_SPONSORED_CONTENT_POSTER.",
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
          "name": "state",
          "type": "string",
          "label": "State",
          "description": "Limit results to specific role states, such as APPROVED or REQUESTED.",
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
          "name": "max",
          "type": "integer",
          "label": "Max",
          "description": "Maximum number of results to return",
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
      "app": "linkedin",
      "componentKey": "linkedin-get-org-member-access",
      "componentName": "Get Member's Organization Access Control Information"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_get_organization_access_control",
    "description": "Gets a selected organization's access control information. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control-by-role?view=li-lms-2025-01&tabs=http#find-organization-access-control)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "organizationId": {
          "type": "string",
          "title": "Organization Id",
          "description": "The ID of the organization for which the access control information is being retrieved"
        },
        "max": {
          "type": "number",
          "title": "Max",
          "description": "Maximum number of results to return"
        }
      },
      "required": [
        "organizationId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-get-organization-access-control",
      "version": "0.2.5",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "organizationId",
          "type": "string",
          "label": "Organization Id",
          "description": "The ID of the organization for which the access control information is being retrieved",
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
          "name": "max",
          "type": "integer",
          "label": "Max",
          "description": "Maximum number of results to return",
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
      "app": "linkedin",
      "componentKey": "linkedin-get-organization-access-control",
      "componentName": "Gets Organization Access Control"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_get_organization_administrators",
    "description": "Gets the administrator members of a selected organization. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/organization-access-control-by-role?view=li-lms-2025-01&tabs=http#find-organization-administrators)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "organizationId": {
          "type": "string",
          "title": "Organization Id",
          "description": "The ID of the organization for which administrators are being retrieved"
        }
      },
      "required": [
        "organizationId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-get-organization-administrators",
      "version": "0.3.5",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "organizationId",
          "type": "string",
          "label": "Organization Id",
          "description": "The ID of the organization for which administrators are being retrieved",
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
      "app": "linkedin",
      "componentKey": "linkedin-get-organization-administrators",
      "componentName": "Get Organization Administrators"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_get_profile_picture_fields",
    "description": "Gets the authenticated user's profile picture data including display image and metadata. [See the documentation](https://learn.microsoft.com/en-us/linkedin/shared/references/v2/profile/profile-picture)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "includeOriginalImage": {
          "type": "boolean",
          "title": "Include Original Image",
          "description": "Whether to include the original image data in the response (requires special permissions)"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-get-profile-picture-fields",
      "version": "0.0.6",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "includeOriginalImage",
          "type": "boolean",
          "label": "Include Original Image",
          "description": "Whether to include the original image data in the response (requires special permissions)",
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
      "app": "linkedin",
      "componentKey": "linkedin-get-profile-picture-fields",
      "componentName": "Get Profile Picture Fields"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_retrieve_comments_on_comments",
    "description": "Retrieves comments on comments, given the parent comment urn. [See the documentation](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-comments)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "commentUrn": {
          "type": "string",
          "title": "Comment Urn",
          "description": "To resolve nested comments for a given parent comment, provide a parent `commentUrn` as the target in the request URL. A `commentUrn` is a composite URN constructed using a comment ID and `activityUrn`."
        },
        "max": {
          "type": "number",
          "title": "Max",
          "description": "Maximum number of results to return"
        }
      },
      "required": [
        "commentUrn"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-retrieve-comments-on-comments",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "commentUrn",
          "type": "string",
          "label": "Comment Urn",
          "description": "To resolve nested comments for a given parent comment, provide a parent `commentUrn` as the target in the request URL. A `commentUrn` is a composite URN constructed using a comment ID and `activityUrn`.",
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
          "name": "max",
          "type": "integer",
          "label": "Max",
          "description": "Maximum number of results to return",
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
      "app": "linkedin",
      "componentKey": "linkedin-retrieve-comments-on-comments",
      "componentName": "Retrieves Comments on Comments"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_retrieve_comments_shares",
    "description": "Retrieve comments on shares given the share urn. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/network-update-social-actions#retrieve-comments-on-shares)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "entityUrn": {
          "type": "string",
          "title": "Entity Urn",
          "description": "Urn of the entity to retrieve comments on."
        },
        "max": {
          "type": "number",
          "title": "Max",
          "description": "Maximum number of results to return"
        }
      },
      "required": [
        "entityUrn"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-retrieve-comments-shares",
      "version": "0.1.12",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "entityUrn",
          "type": "string",
          "label": "Entity Urn",
          "description": "Urn of the entity to retrieve comments on.",
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
          "name": "max",
          "type": "integer",
          "label": "Max",
          "description": "Maximum number of results to return",
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
      "app": "linkedin",
      "componentKey": "linkedin-retrieve-comments-shares",
      "componentName": "Retrieve Comments On Shares"
    }
  },
  {
    "integration": "linkedin",
    "name": "linkedin_search_organization",
    "description": "Searches for an organization by vanity name or email domain. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-lookup-api)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "searchBy": {
          "type": "string",
          "title": "Search By",
          "description": "You can look up the `id`, `name`, `localizedName`, `vanityName`, `localizedWebsite`, `logoV2`, and `location` of any organization using `vanityName` or `emailDomain`"
        },
        "searchTerm": {
          "type": "string",
          "title": "Search Term",
          "description": "Keyword to search for"
        },
        "max": {
          "type": "number",
          "title": "Max",
          "description": "Maximum number of results to return"
        }
      },
      "required": [
        "searchBy",
        "searchTerm"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "linkedin",
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
      "app": "linkedin",
      "componentId": "linkedin-search-organization",
      "version": "0.1.11",
      "authPropNames": [
        "linkedin"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "linkedin",
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
          "name": "searchBy",
          "type": "string",
          "label": "Search By",
          "description": "You can look up the `id`, `name`, `localizedName`, `vanityName`, `localizedWebsite`, `logoV2`, and `location` of any organization using `vanityName` or `emailDomain`",
          "required": true,
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
          "name": "searchTerm",
          "type": "string",
          "label": "Search Term",
          "description": "Keyword to search for",
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
          "name": "max",
          "type": "integer",
          "label": "Max",
          "description": "Maximum number of results to return",
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
      "app": "linkedin",
      "componentKey": "linkedin-search-organization",
      "componentName": "Search Organization"
    }
  }
] satisfies PipedreamActionToolManifest[];
