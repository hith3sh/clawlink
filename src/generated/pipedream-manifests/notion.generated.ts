import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const NotionPipedreamToolManifests = [
  {
    "integration": "notion",
    "name": "notion_append_block",
    "description": "Append one or more markdown snippets as new blocks under the specified parent page or block. Each markdown entry becomes one or more Notion blocks. [See the documentation](https://developers.notion.com/reference/patch-block-children)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Parent Block ID",
          "description": "Select a parent block/page or provide its ID"
        },
        "markdownContents": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Markdown Blocks",
          "description": "One or more markdown strings to append as new Notion blocks. Each entry is converted from Markdown into block content."
        }
      },
      "required": [
        "pageId",
        "markdownContents"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {
      "blockTypes": [
        "markdownContents"
      ]
    },
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "notion",
      "componentId": "notion-append-block",
      "version": "0.4.1",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [
        "blockTypes"
      ],
      "props": [
        {
          "name": "notion",
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
          "name": "pageId",
          "type": "string",
          "label": "Parent Block ID",
          "description": "Select a parent block/page or provide its ID",
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
          "name": "blockTypes",
          "type": "string[]",
          "label": "Block Type(s)",
          "description": "Select which type(s) of block you'd like to append",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "Append existing blocks",
              "value": "blockIds"
            },
            {
              "label": "Provide Markdown content to create new blocks with",
              "value": "markdownContents"
            },
            {
              "label": "Provide Image URLs to create new image blocks",
              "value": "imageUrls"
            }
          ]
        },
        {
          "name": "blockIds",
          "type": "string[]",
          "label": "Existing Block IDs",
          "description": "Select one or more block(s) or page(s) to append (selecting a page appends its children). You can also provide block or page IDs.",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "markdownContents",
          "type": "string[]",
          "label": "Markdown Blocks",
          "description": "One or more markdown strings to append as new Notion blocks. Each entry is converted from Markdown into block content.",
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
          "name": "imageUrls",
          "type": "string[]",
          "label": "Image URLs",
          "description": "One or more Image URLs to append new image blocks with. [See the documentation](https://www.notion.com/help/images-files-and-media#media-block-types) for more information",
          "required": true,
          "hidden": true,
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
      "app": "notion",
      "componentKey": "notion-append-block",
      "componentName": "Append Block to Parent"
    }
  },
  {
    "integration": "notion",
    "name": "notion_complete_file_upload",
    "description": "Use this action to finalize a `mode=multi_part` file upload after all of the parts have been sent successfully. [See the documentation](https://developers.notion.com/reference/complete-a-file-upload)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fileUploadId": {
          "type": "string",
          "title": "File Upload ID",
          "description": "The ID of the file upload to send."
        }
      },
      "required": [
        "fileUploadId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-complete-file-upload",
      "version": "0.0.8",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "fileUploadId",
          "type": "string",
          "label": "File Upload ID",
          "description": "The ID of the file upload to send.",
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
      "app": "notion",
      "componentKey": "notion-complete-file-upload",
      "componentName": "Complete File Upload"
    }
  },
  {
    "integration": "notion",
    "name": "notion_create_comment",
    "description": "Create a comment in a page or existing discussion thread. [See the documentation](https://developers.notion.com/reference/create-a-comment)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Page ID",
          "description": "Search for a page or provide a page ID"
        },
        "discussionId": {
          "type": "string",
          "title": "Discussion ID",
          "description": "The ID of a discussion thread. [See the documentation](https://developers.notion.com/docs/working-with-comments#retrieving-a-discussion-id) for more information"
        },
        "comment": {
          "type": "string",
          "title": "Comment",
          "description": "The comment text"
        }
      },
      "required": [
        "comment"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-create-comment",
      "version": "0.0.10",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "infoLabel",
          "type": "alert",
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
          "name": "pageId",
          "type": "string",
          "label": "Page ID",
          "description": "Search for a page or provide a page ID",
          "required": false,
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
          "name": "discussionId",
          "type": "string",
          "label": "Discussion ID",
          "description": "The ID of a discussion thread. [See the documentation](https://developers.notion.com/docs/working-with-comments#retrieving-a-discussion-id) for more information",
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
          "name": "comment",
          "type": "string",
          "label": "Comment",
          "description": "The comment text",
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
      "app": "notion",
      "componentKey": "notion-create-comment",
      "componentName": "Create Comment"
    }
  },
  {
    "integration": "notion",
    "name": "notion_create_database",
    "description": "Create a database and its initial data source. [See the documentation](https://developers.notion.com/reference/database-create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parent": {
          "type": "string",
          "title": "Parent Page ID",
          "description": "Select a parent page or provide a page ID"
        },
        "title": {
          "type": "string",
          "title": "Title",
          "description": "Title of database as it appears in Notion. An array of [rich text objects](https://developers.notion.com/reference/rich-text)."
        },
        "properties": {
          "type": "object",
          "title": "Properties",
          "description": "Property schema of database. The keys are the names of properties as they appear in Notion and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object)."
        }
      },
      "required": [
        "parent",
        "properties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-create-database",
      "version": "0.1.5",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "parent",
          "type": "string",
          "label": "Parent Page ID",
          "description": "Select a parent page or provide a page ID",
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
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "Title of database as it appears in Notion. An array of [rich text objects](https://developers.notion.com/reference/rich-text).",
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
          "name": "properties",
          "type": "object",
          "label": "Properties",
          "description": "Property schema of database. The keys are the names of properties as they appear in Notion and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object).",
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
      "app": "notion",
      "componentKey": "notion-create-database",
      "componentName": "Create Database"
    }
  },
  {
    "integration": "notion",
    "name": "notion_create_file_upload",
    "description": "Create a file upload. [See the documentation](https://developers.notion.com/reference/create-a-file-upload)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "mode": {
          "type": "string",
          "title": "Mode",
          "description": "How the file is being sent. Use `Multi Part` for files larger than 20MB. Use `External URL` for files that are temporarily hosted publicly elsewhere.",
          "enum": [
            "single_part",
            "multi_part",
            "external_url"
          ]
        },
        "filename": {
          "type": "string",
          "title": "Filename",
          "description": "Name of the file to be created. Required when mode is multi_part or external_url. Otherwise optional, and used to override the filename. Must include an extension."
        },
        "contentType": {
          "type": "string",
          "title": "Content Type",
          "description": "MIME type of the file to be created. Recommended when sending the file in multiple parts. Must match the content type of the file that's sent, and the extension of the `filename` parameter if any."
        },
        "numberOfParts": {
          "type": "number",
          "title": "Number of Parts",
          "description": "When mode is `Multi Part`, the number of parts you are uploading. Must be between 1 and 1,000. This must match the number of parts as well as the final part_number you send."
        },
        "externalUrl": {
          "type": "string",
          "title": "External URL",
          "description": "When mode is `External URL`, provide the HTTPS URL of a publicly accessible file to import into your workspace."
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-create-file-upload",
      "version": "0.0.8",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "mode",
          "type": "string",
          "label": "Mode",
          "description": "How the file is being sent. Use `Multi Part` for files larger than 20MB. Use `External URL` for files that are temporarily hosted publicly elsewhere.",
          "required": false,
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
              "label": "Single Part",
              "value": "single_part"
            },
            {
              "label": "Multi Part",
              "value": "multi_part"
            },
            {
              "label": "External URL",
              "value": "external_url"
            }
          ]
        },
        {
          "name": "filename",
          "type": "string",
          "label": "Filename",
          "description": "Name of the file to be created. Required when mode is multi_part or external_url. Otherwise optional, and used to override the filename. Must include an extension.",
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
          "name": "contentType",
          "type": "string",
          "label": "Content Type",
          "description": "MIME type of the file to be created. Recommended when sending the file in multiple parts. Must match the content type of the file that's sent, and the extension of the `filename` parameter if any.",
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
          "name": "numberOfParts",
          "type": "integer",
          "label": "Number of Parts",
          "description": "When mode is `Multi Part`, the number of parts you are uploading. Must be between 1 and 1,000. This must match the number of parts as well as the final part_number you send.",
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
          "name": "externalUrl",
          "type": "string",
          "label": "External URL",
          "description": "When mode is `External URL`, provide the HTTPS URL of a publicly accessible file to import into your workspace.",
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
      "app": "notion",
      "componentKey": "notion-create-file-upload",
      "componentName": "Create File Upload"
    }
  },
  {
    "integration": "notion",
    "name": "notion_create_page",
    "description": "Create a page from a parent page. [See the documentation](https://developers.notion.com/reference/post-page)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parent": {
          "type": "string",
          "title": "Parent Page ID",
          "description": "Select a parent page or provide a page ID"
        },
        "title": {
          "type": "string",
          "title": "Page Title",
          "description": "The page title (defaults to `Untitled`)"
        },
        "metaTypes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Meta Types",
          "description": "Select one or more page attributes (such as icon and cover)"
        },
        "pageContent": {
          "type": "string",
          "title": "Page Content",
          "description": "The content of the page, using Markdown syntax. [See the documentation](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts) for more information"
        }
      },
      "required": [
        "parent"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-create-page",
      "version": "0.3.1",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [
        "parent",
        "metaTypes"
      ],
      "props": [
        {
          "name": "notion",
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
          "name": "parent",
          "type": "string",
          "label": "Parent Page ID",
          "description": "Select a parent page or provide a page ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "title",
          "type": "string",
          "label": "Page Title",
          "description": "The page title (defaults to `Untitled`)",
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
          "name": "metaTypes",
          "type": "string[]",
          "label": "Meta Types",
          "description": "Select one or more page attributes (such as icon and cover)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "pageContent",
          "type": "string",
          "label": "Page Content",
          "description": "The content of the page, using Markdown syntax. [See the documentation](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts) for more information",
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
      "app": "notion",
      "componentKey": "notion-create-page",
      "componentName": "Create Page"
    }
  },
  {
    "integration": "notion",
    "name": "notion_create_page_from_database",
    "description": "Create a page from a data source. [See the documentation](https://developers.notion.com/reference/post-page)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parentDataSource": {
          "type": "string",
          "title": "Parent Data Source ID",
          "description": "Select a parent data source or provide a data source ID"
        },
        "templateType": {
          "type": "string",
          "title": "Template Type",
          "description": "The type of template to use for the page. [See the documentation](https://developers.notion.com/docs/creating-pages-from-templates) for more information.",
          "enum": [
            "none",
            "default",
            "template_id"
          ]
        },
        "propertyTypes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Types",
          "description": "Select one or more page properties. Willl override properties set in the `Properties` prop below."
        },
        "properties": {
          "type": "object",
          "title": "Properties",
          "description": "The values of the page's properties. The schema must match the parent data source's properties. [See the documentation](https://developers.notion.com/reference/property-object) for information on various property types. Example: `{ \"Tags\": [ \"tag1\" ], \"Link\": \"https://pipedream.com\" }`"
        },
        "icon": {
          "type": "string",
          "title": "Icon Emoji",
          "description": "Page Icon [Emoji](https://developers.notion.com/reference/emoji-object)"
        },
        "cover": {
          "type": "string",
          "title": "Cover URL",
          "description": "Cover [External URL](https://developers.notion.com/reference/file-object#external-file-objects)"
        },
        "pageContent": {
          "type": "string",
          "title": "Page Content",
          "description": "The content of the page, using Markdown syntax. [See the documentation](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts) for more information"
        }
      },
      "required": [
        "parentDataSource",
        "templateType"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-create-page-from-database",
      "version": "2.0.0",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [
        "templateType",
        "propertyTypes"
      ],
      "props": [
        {
          "name": "notion",
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
          "name": "parentDataSource",
          "type": "string",
          "label": "Parent Data Source ID",
          "description": "Select a parent data source or provide a data source ID",
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
          "name": "templateType",
          "type": "string",
          "label": "Template Type",
          "description": "The type of template to use for the page. [See the documentation](https://developers.notion.com/docs/creating-pages-from-templates) for more information.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "No template. Provided children and properties are immediately applied.",
              "value": "none"
            },
            {
              "label": "Applies the data source's default template to the newly created page. `children` cannot be specified in the create page request.",
              "value": "default"
            },
            {
              "label": "Indicates which exact template to apply to the newly created page. children cannot be specified in the create page request.",
              "value": "template_id"
            }
          ]
        },
        {
          "name": "propertyTypes",
          "type": "string[]",
          "label": "Property Types",
          "description": "Select one or more page properties. Willl override properties set in the `Properties` prop below.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "properties",
          "type": "object",
          "label": "Properties",
          "description": "The values of the page's properties. The schema must match the parent data source's properties. [See the documentation](https://developers.notion.com/reference/property-object) for information on various property types. Example: `{ \"Tags\": [ \"tag1\" ], \"Link\": \"https://pipedream.com\" }`",
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
          "name": "icon",
          "type": "string",
          "label": "Icon Emoji",
          "description": "Page Icon [Emoji](https://developers.notion.com/reference/emoji-object)",
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
          "name": "cover",
          "type": "string",
          "label": "Cover URL",
          "description": "Cover [External URL](https://developers.notion.com/reference/file-object#external-file-objects)",
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
          "name": "pageContent",
          "type": "string",
          "label": "Page Content",
          "description": "The content of the page, using Markdown syntax. [See the documentation](https://www.notion.com/help/writing-and-editing-basics#markdown-and-shortcuts) for more information",
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
      "app": "notion",
      "componentKey": "notion-create-page-from-database",
      "componentName": "Create Page from Data Source"
    }
  },
  {
    "integration": "notion",
    "name": "notion_delete_block",
    "description": "Sets a Block object, including page blocks, to archived: true using the ID specified. [See the documentation](https://developers.notion.com/reference/delete-a-block)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blockId": {
          "type": "string",
          "title": "Block ID",
          "description": "Block ID retrieved from the **Retrieve Page Content** action"
        }
      },
      "required": [
        "blockId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-delete-block",
      "version": "0.0.8",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "infoLabel",
          "type": "alert",
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
          "name": "blockId",
          "type": "string",
          "label": "Block ID",
          "description": "Block ID retrieved from the **Retrieve Page Content** action",
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
      "app": "notion",
      "componentKey": "notion-delete-block",
      "componentName": "Delete Block"
    }
  },
  {
    "integration": "notion",
    "name": "notion_duplicate_page",
    "description": "Create a new page copied from an existing page block. [See the documentation](https://developers.notion.com/reference/post-page)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Page ID",
          "description": "Select a page to copy or provide a page ID"
        },
        "title": {
          "type": "string",
          "title": "Page Title",
          "description": "The new page title"
        },
        "parentId": {
          "type": "string",
          "title": "Parent Page ID",
          "description": "Select a parent page for the new page being created, or provide the ID of a parent page"
        }
      },
      "required": [
        "pageId",
        "parentId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-duplicate-page",
      "version": "0.0.23",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "pageId",
          "type": "string",
          "label": "Page ID",
          "description": "Select a page to copy or provide a page ID",
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
          "name": "title",
          "type": "string",
          "label": "Page Title",
          "description": "The new page title",
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
          "name": "parentId",
          "type": "string",
          "label": "Parent Page ID",
          "description": "Select a parent page for the new page being created, or provide the ID of a parent page",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "notion",
      "componentKey": "notion-duplicate-page",
      "componentName": "Duplicate Page"
    }
  },
  {
    "integration": "notion",
    "name": "notion_get_current_user",
    "description": "Retrieve the Notion identity tied to the current OAuth token, returning the full `users.retrieve` payload for `me` (person or bot). Includes the user ID, name, avatar URL, type (`person` vs `bot`), and workspace ownership metadata—useful for confirming which workspace is connected, adapting downstream queries, or giving an LLM the context it needs about who is operating inside Notion. [See the documentation](https://developers.notion.com/reference/get-user).",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-get-current-user",
      "version": "0.0.2",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
      "app": "notion",
      "componentKey": "notion-get-current-user",
      "componentName": "Get Current User"
    }
  },
  {
    "integration": "notion",
    "name": "notion_list_all_users",
    "description": "Returns all users in the workspace. [See the documentation](https://developers.notion.com/reference/get-users)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-list-all-users",
      "version": "0.0.5",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
      "app": "notion",
      "componentKey": "notion-list-all-users",
      "componentName": "List All Users"
    }
  },
  {
    "integration": "notion",
    "name": "notion_list_file_uploads",
    "description": "Use this action to list file uploads. [See the documentation](https://developers.notion.com/reference/list-file-uploads)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-list-file-uploads",
      "version": "0.0.8",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
      "app": "notion",
      "componentKey": "notion-list-file-uploads",
      "componentName": "List File Uploads"
    }
  },
  {
    "integration": "notion",
    "name": "notion_query_database",
    "description": "Query a data source with a specified filter. [See the documentation](https://developers.notion.com/reference/query-a-data-source)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "dataSourceId": {
          "type": "string",
          "title": "Data Source ID",
          "description": "Select a data source or provide a data source ID"
        },
        "filter": {
          "type": "string",
          "title": "Filter (query)",
          "description": "The filter to apply, as a JSON-stringified object. [See the documentation for available filters](https://developers.notion.com/reference/filter-data-source-entries). Example: `{ \"property\": \"Name\", \"title\": { \"contains\": \"title to search for\" } }`"
        },
        "sorts": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Sorts",
          "description": "The sort order for the query. [See the documentation for available sorts](https://developers.notion.com/reference/sort-data-source-entries). Example: `[ { \"property\": \"Name\", \"direction\": \"ascending\" } ]`"
        }
      },
      "required": [
        "dataSourceId",
        "filter",
        "sorts"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-query-database",
      "version": "1.0.2",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "dataSourceId",
          "type": "string",
          "label": "Data Source ID",
          "description": "Select a data source or provide a data source ID",
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
          "name": "filter",
          "type": "string",
          "label": "Filter (query)",
          "description": "The filter to apply, as a JSON-stringified object. [See the documentation for available filters](https://developers.notion.com/reference/filter-data-source-entries). Example: `{ \"property\": \"Name\", \"title\": { \"contains\": \"title to search for\" } }`",
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
          "name": "sorts",
          "type": "string[]",
          "label": "Sorts",
          "description": "The sort order for the query. [See the documentation for available sorts](https://developers.notion.com/reference/sort-data-source-entries). Example: `[ { \"property\": \"Name\", \"direction\": \"ascending\" } ]`",
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
      "app": "notion",
      "componentKey": "notion-query-database",
      "componentName": "Query Data Source"
    }
  },
  {
    "integration": "notion",
    "name": "notion_retrieve_block",
    "description": "Get page content as block objects or markdown. Blocks can be text, lists, media, a page, among others. [See the documentation](https://developers.notion.com/reference/retrieve-a-block)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blockId": {
          "type": "string",
          "title": "Page ID",
          "description": "Search for a page or provide a page ID"
        },
        "retrieveChildren": {
          "type": "string",
          "title": "Retrieve Children",
          "description": "Retrieve all the children (recursively) for the specified page, or optionally filter to include only sub-pages in the result. [See the documentation](https://developers.notion.com/reference/get-block-children) for more information"
        },
        "retrieveMarkdown": {
          "type": "boolean",
          "title": "Retrieve as Markdown",
          "description": "Additionally return the page content as markdown"
        }
      },
      "required": [
        "blockId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-retrieve-block",
      "version": "0.2.8",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "blockId",
          "type": "string",
          "label": "Page ID",
          "description": "Search for a page or provide a page ID",
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
          "name": "retrieveChildren",
          "type": "string",
          "label": "Retrieve Children",
          "description": "Retrieve all the children (recursively) for the specified page, or optionally filter to include only sub-pages in the result. [See the documentation](https://developers.notion.com/reference/get-block-children) for more information",
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
          "name": "retrieveMarkdown",
          "type": "boolean",
          "label": "Retrieve as Markdown",
          "description": "Additionally return the page content as markdown",
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
      "app": "notion",
      "componentKey": "notion-retrieve-block",
      "componentName": "Retrieve Page Content"
    }
  },
  {
    "integration": "notion",
    "name": "notion_retrieve_database_content",
    "description": "Get all content of a data source. [See the documentation](https://developers.notion.com/reference/query-a-data-source)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "dataSourceId": {
          "type": "string",
          "title": "Data Source ID",
          "description": "Select a data source or provide a data source ID"
        }
      },
      "required": [
        "dataSourceId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-retrieve-database-content",
      "version": "1.0.2",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "dataSourceId",
          "type": "string",
          "label": "Data Source ID",
          "description": "Select a data source or provide a data source ID",
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
      "app": "notion",
      "componentKey": "notion-retrieve-database-content",
      "componentName": "Retrieve Data Source Content"
    }
  },
  {
    "integration": "notion",
    "name": "notion_retrieve_database_schema",
    "description": "Get the property schema of a data source in Notion. [See the documentation](https://developers.notion.com/reference/retrieve-a-data-source)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "dataSourceId": {
          "type": "string",
          "title": "Data Source ID",
          "description": "Select a data source or provide a data source ID"
        }
      },
      "required": [
        "dataSourceId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-retrieve-database-schema",
      "version": "1.0.2",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "dataSourceId",
          "type": "string",
          "label": "Data Source ID",
          "description": "Select a data source or provide a data source ID",
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
      "app": "notion",
      "componentKey": "notion-retrieve-database-schema",
      "componentName": "Retrieve Data Source Schema"
    }
  },
  {
    "integration": "notion",
    "name": "notion_retrieve_file_upload",
    "description": "Use this action to retrieve a file upload. [See the documentation](https://developers.notion.com/reference/retrieve-a-file-upload)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fileUploadId": {
          "type": "string",
          "title": "File Upload ID",
          "description": "The ID of the file upload to send."
        }
      },
      "required": [
        "fileUploadId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-retrieve-file-upload",
      "version": "0.0.8",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "fileUploadId",
          "type": "string",
          "label": "File Upload ID",
          "description": "The ID of the file upload to send.",
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
      "app": "notion",
      "componentKey": "notion-retrieve-file-upload",
      "componentName": "Retrieve File Upload"
    }
  },
  {
    "integration": "notion",
    "name": "notion_retrieve_page",
    "description": "Get details of a page. [See the documentation](https://developers.notion.com/reference/retrieve-a-page)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Page ID",
          "description": "Search for a page or provide a page ID"
        }
      },
      "required": [
        "pageId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-retrieve-page",
      "version": "0.0.14",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "infoLabel",
          "type": "alert",
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
          "name": "pageId",
          "type": "string",
          "label": "Page ID",
          "description": "Search for a page or provide a page ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": true,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "notion",
      "componentKey": "notion-retrieve-page",
      "componentName": "Retrieve Page Metadata"
    }
  },
  {
    "integration": "notion",
    "name": "notion_retrieve_page_property_item",
    "description": "Get a Property Item object for a selected page and property. [See the documentation](https://developers.notion.com/reference/retrieve-a-page-property)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Page ID",
          "description": "Search for a page or provide a page ID"
        },
        "propertyId": {
          "type": "string",
          "title": "Property ID",
          "description": "Select a page property or provide a property ID"
        }
      },
      "required": [
        "pageId",
        "propertyId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-retrieve-page-property-item",
      "version": "0.0.13",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "pageId",
          "type": "string",
          "label": "Page ID",
          "description": "Search for a page or provide a page ID",
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
          "name": "propertyId",
          "type": "string",
          "label": "Property ID",
          "description": "Select a page property or provide a property ID",
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
      "app": "notion",
      "componentKey": "notion-retrieve-page-property-item",
      "componentName": "Retrieve Page Property Item"
    }
  },
  {
    "integration": "notion",
    "name": "notion_retrieve_user",
    "description": "Returns a user using the ID specified. [See the documentation](https://developers.notion.com/reference/get-user)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "User ID",
          "description": "Select a user, or provide a user ID"
        }
      },
      "required": [
        "userId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-retrieve-user",
      "version": "0.0.5",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "userId",
          "type": "string",
          "label": "User ID",
          "description": "Select a user, or provide a user ID",
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
      "app": "notion",
      "componentKey": "notion-retrieve-user",
      "componentName": "Retrieve User"
    }
  },
  {
    "integration": "notion",
    "name": "notion_search",
    "description": "Searches for a page or data source. [See the documentation](https://developers.notion.com/reference/post-search)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Query (Title)",
          "description": "The object title to search for"
        },
        "sortDirection": {
          "type": "string",
          "title": "Sort Direction",
          "description": "The direction to sort by"
        },
        "pageSize": {
          "type": "number",
          "title": "Page Size",
          "description": "The number of items from the full list desired in the response (max 100)"
        },
        "startCursor": {
          "type": "string",
          "title": "Start Cursor (page_id)",
          "description": "Leave blank to retrieve the first page of results. Otherwise, the response will be the page of results starting after the provided cursor"
        },
        "filter": {
          "type": "string",
          "title": "Page or Data Source",
          "description": "Whether to search for pages or data sources."
        }
      },
      "required": [
        "title"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-search",
      "version": "0.1.2",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "title",
          "type": "string",
          "label": "Query (Title)",
          "description": "The object title to search for",
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
          "name": "sortDirection",
          "type": "string",
          "label": "Sort Direction",
          "description": "The direction to sort by",
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
          "name": "pageSize",
          "type": "integer",
          "label": "Page Size",
          "description": "The number of items from the full list desired in the response (max 100)",
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
          "name": "startCursor",
          "type": "string",
          "label": "Start Cursor (page_id)",
          "description": "Leave blank to retrieve the first page of results. Otherwise, the response will be the page of results starting after the provided cursor",
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
          "name": "filter",
          "type": "string",
          "label": "Page or Data Source",
          "description": "Whether to search for pages or data sources.",
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
        }
      ]
    },
    "source": {
      "app": "notion",
      "componentKey": "notion-search",
      "componentName": "Find Pages or Data Sources"
    }
  },
  {
    "integration": "notion",
    "name": "notion_update_block",
    "description": "Updates a child block object. [See the documentation](https://developers.notion.com/reference/update-a-block)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blockId": {
          "type": "string",
          "title": "Block ID",
          "description": "Block ID retrieved from the **Retrieve Page Content** action"
        },
        "content": {
          "type": "string",
          "title": "Content",
          "description": "The content of the block. **E.g. {\"code\": {\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"Updated content\"}}]}}** [See the documentation](https://developers.notion.com/reference/update-a-block)"
        }
      },
      "required": [
        "blockId",
        "content"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-update-block",
      "version": "0.0.8",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "notion",
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
          "name": "blockId",
          "type": "string",
          "label": "Block ID",
          "description": "Block ID retrieved from the **Retrieve Page Content** action",
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
          "name": "infoLabel",
          "type": "alert",
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
          "type": "string",
          "label": "Content",
          "description": "The content of the block. **E.g. {\"code\": {\"rich_text\":[{\"type\":\"text\",\"text\":{\"content\":\"Updated content\"}}]}}** [See the documentation](https://developers.notion.com/reference/update-a-block)",
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
      "app": "notion",
      "componentKey": "notion-update-block",
      "componentName": "Update Child Block"
    }
  },
  {
    "integration": "notion",
    "name": "notion_update_database",
    "description": "Update a data source. [See the documentation](https://developers.notion.com/reference/update-a-data-source)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "dataSourceId": {
          "type": "string",
          "title": "Data Source ID",
          "description": "Select a data source or provide a data source ID"
        },
        "title": {
          "type": "string",
          "title": "Title",
          "description": "Title of the data source as it appears in Notion. An array of [rich text objects](https://developers.notion.com/reference/rich-text)."
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the description of the data source that is displayed in the Notion UI. If omitted, then the data source description remains unchanged."
        },
        "properties": {
          "type": "object",
          "title": "Properties",
          "description": "The properties of a data source to be changed in the request, in the form of a JSON object. If updating an existing property, then the keys are the names or IDs of the properties as they appear in Notion, and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object). If adding a new property, then the key is the name of the new data source property and the value is a [property schema object](https://developers.notion.com/reference/property-schema-object)."
        }
      },
      "required": [
        "dataSourceId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-update-database",
      "version": "1.0.5",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [
        "dataSourceId"
      ],
      "props": [
        {
          "name": "notion",
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
          "name": "dataSourceId",
          "type": "string",
          "label": "Data Source ID",
          "description": "Select a data source or provide a data source ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "Title of the data source as it appears in Notion. An array of [rich text objects](https://developers.notion.com/reference/rich-text).",
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
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "An array of [rich text objects](https://developers.notion.com/reference/rich-text) that represents the description of the data source that is displayed in the Notion UI. If omitted, then the data source description remains unchanged.",
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
          "name": "properties",
          "type": "object",
          "label": "Properties",
          "description": "The properties of a data source to be changed in the request, in the form of a JSON object. If updating an existing property, then the keys are the names or IDs of the properties as they appear in Notion, and the values are [property schema objects](https://developers.notion.com/reference/property-schema-object). If adding a new property, then the key is the name of the new data source property and the value is a [property schema object](https://developers.notion.com/reference/property-schema-object).",
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
      "app": "notion",
      "componentKey": "notion-update-database",
      "componentName": "Update Data Source"
    }
  },
  {
    "integration": "notion",
    "name": "notion_update_page",
    "description": "Update a page's property values. To append page content, use the *Append Block* action instead. [See the documentation](https://developers.notion.com/reference/patch-page)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parentDataSource": {
          "type": "string",
          "title": "Parent Data Source ID",
          "description": "Select the data source that contains the page to update. If you instead provide a data source ID in a custom expression, you will also have to provide the page's ID in a custom expression"
        },
        "pageId": {
          "type": "string",
          "title": "Page ID",
          "description": "Search for a page from the data source or provide a page ID"
        },
        "archived": {
          "type": "boolean",
          "title": "Archive Page",
          "description": "Set to `true` to archive (delete) a page. Set to `false` to  un-archive (restore) a page"
        },
        "metaTypes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Meta Types",
          "description": "Select one or more page attributes (such as icon and cover)"
        },
        "propertyTypes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Types",
          "description": "Select one or more page properties"
        }
      },
      "required": [
        "parentDataSource",
        "pageId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "notion",
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
      "app": "notion",
      "componentId": "notion-update-page",
      "version": "2.0.5",
      "authPropNames": [
        "notion"
      ],
      "dynamicPropNames": [
        "parentDataSource",
        "metaTypes",
        "propertyTypes"
      ],
      "props": [
        {
          "name": "notion",
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
          "name": "infoLabel",
          "type": "alert",
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
          "name": "parentDataSource",
          "type": "string",
          "label": "Parent Data Source ID",
          "description": "Select the data source that contains the page to update. If you instead provide a data source ID in a custom expression, you will also have to provide the page's ID in a custom expression",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "pageId",
          "type": "string",
          "label": "Page ID",
          "description": "Search for a page from the data source or provide a page ID",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archive Page",
          "description": "Set to `true` to archive (delete) a page. Set to `false` to  un-archive (restore) a page",
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
          "name": "metaTypes",
          "type": "string[]",
          "label": "Meta Types",
          "description": "Select one or more page attributes (such as icon and cover)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "propertyTypes",
          "type": "string[]",
          "label": "Property Types",
          "description": "Select one or more page properties",
          "required": false,
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
      "app": "notion",
      "componentKey": "notion-update-page",
      "componentName": "Update Page"
    }
  }
] satisfies PipedreamActionToolManifest[];
