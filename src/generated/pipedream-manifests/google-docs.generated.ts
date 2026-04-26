import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const GoogleDocsPipedreamToolManifests = [
  {
    "integration": "google-docs",
    "name": "google-docs_append_image",
    "description": "Appends an image to the end of a document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertInlineImageRequest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "imageUri": {
          "type": "string",
          "title": "Image URL",
          "description": "The URL of the image you want to insert into the doc"
        },
        "appendAtBeginning": {
          "type": "boolean",
          "title": "Append at Beginning",
          "description": "Whether to append at the beginning (`true`) of the document or at the end (`false`). Defaults to `false`"
        }
      },
      "required": [
        "docId",
        "imageUri"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-append-image",
      "version": "0.0.11",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "imageUri",
          "type": "string",
          "label": "Image URL",
          "description": "The URL of the image you want to insert into the doc",
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
          "name": "appendAtBeginning",
          "type": "boolean",
          "label": "Append at Beginning",
          "description": "Whether to append at the beginning (`true`) of the document or at the end (`false`). Defaults to `false`",
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
      "app": "google_docs",
      "componentKey": "google_docs-append-image",
      "componentName": "Append Image to Document"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_append_text",
    "description": "Append text to an existing document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTextRequest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`)."
        },
        "appendAtBeginning": {
          "type": "boolean",
          "title": "Append at Beginning",
          "description": "Whether to append at the beginning (`true`) of the document or at the end (`false`). Defaults to `false`"
        }
      },
      "required": [
        "docId",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-append-text",
      "version": "0.1.10",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "text",
          "type": "string",
          "label": "Text",
          "description": "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`).",
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
          "name": "appendAtBeginning",
          "type": "boolean",
          "label": "Append at Beginning",
          "description": "Whether to append at the beginning (`true`) of the document or at the end (`false`). Defaults to `false`",
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
      "app": "google_docs",
      "componentKey": "google_docs-append-text",
      "componentName": "Append Text"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_create_document",
    "description": "Create a new document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Title",
          "description": "Title of the new document"
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`)."
        },
        "useMarkdown": {
          "type": "boolean",
          "title": "Use Markdown Format",
          "description": "Enable markdown formatting support. When enabled, the text will be parsed as markdown and converted to Google Docs formatting (headings, bold, italic, lists, etc.)"
        }
      },
      "required": [
        "title"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-create-document",
      "version": "0.2.1",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "label": "Title",
          "description": "Title of the new document",
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
          "description": "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`).",
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
          "name": "useMarkdown",
          "type": "boolean",
          "label": "Use Markdown Format",
          "description": "Enable markdown formatting support. When enabled, the text will be parsed as markdown and converted to Google Docs formatting (headings, bold, italic, lists, etc.)",
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
          "name": "folderId",
          "type": "string",
          "required": false,
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
      "app": "google_docs",
      "componentKey": "google_docs-create-document",
      "componentName": "Create a New Document"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_get_document",
    "description": "Get the contents of the latest version of a document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "includeTabsContent": {
          "type": "boolean",
          "title": "Include Tabs Content",
          "description": "Whether to populate the `Document.tabs` field instead of the text content fields like `body` and `documentStyle` on `Document`"
        },
        "tabIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tab IDs",
          "description": "Only return content for the specified tabs"
        }
      },
      "required": [
        "docId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-get-document",
      "version": "0.1.10",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "includeTabsContent",
          "type": "boolean",
          "label": "Include Tabs Content",
          "description": "Whether to populate the `Document.tabs` field instead of the text content fields like `body` and `documentStyle` on `Document`",
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
          "name": "tabIds",
          "type": "string[]",
          "label": "Tab IDs",
          "description": "Only return content for the specified tabs",
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
      "app": "google_docs",
      "componentKey": "google_docs-get-document",
      "componentName": "Get Document"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_get_tab_content",
    "description": "Get the content of a tab in a document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/get)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "tabIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tab IDs",
          "description": "Return content for the specified tabs"
        }
      },
      "required": [
        "docId",
        "tabIds"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-get-tab-content",
      "version": "0.0.4",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "tabIds",
          "type": "string[]",
          "label": "Tab IDs",
          "description": "Return content for the specified tabs",
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
      "app": "google_docs",
      "componentKey": "google_docs-get-tab-content",
      "componentName": "Get Tab Content"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_insert_page_break",
    "description": "Insert a page break into a document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#insertpagebreakrequest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "index": {
          "type": "number",
          "title": "Index",
          "description": "The index to insert the page break at"
        },
        "tabId": {
          "type": "string",
          "title": "Tab ID",
          "description": "The Tab ID"
        }
      },
      "required": [
        "docId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-insert-page-break",
      "version": "0.0.4",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "index",
          "type": "integer",
          "label": "Index",
          "description": "The index to insert the page break at",
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
          "name": "tabId",
          "type": "string",
          "label": "Tab ID",
          "description": "The Tab ID",
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
      "app": "google_docs",
      "componentKey": "google_docs-insert-page-break",
      "componentName": "Insert Page Break"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_insert_table",
    "description": "Insert a table into a document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#inserttablerequest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "rows": {
          "type": "number",
          "title": "Rows",
          "description": "The number of rows in the table"
        },
        "columns": {
          "type": "number",
          "title": "Columns",
          "description": "The number of columns in the table"
        },
        "index": {
          "type": "number",
          "title": "Index",
          "description": "The index to insert the table at"
        },
        "tabId": {
          "type": "string",
          "title": "Tab ID",
          "description": "The Tab ID"
        }
      },
      "required": [
        "docId",
        "rows",
        "columns"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-insert-table",
      "version": "0.0.4",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "rows",
          "type": "integer",
          "label": "Rows",
          "description": "The number of rows in the table",
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
          "name": "columns",
          "type": "integer",
          "label": "Columns",
          "description": "The number of columns in the table",
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
          "name": "index",
          "type": "integer",
          "label": "Index",
          "description": "The index to insert the table at",
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
          "name": "tabId",
          "type": "string",
          "label": "Tab ID",
          "description": "The Tab ID",
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
      "app": "google_docs",
      "componentKey": "google_docs-insert-table",
      "componentName": "Insert Table"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_insert_text",
    "description": "Insert text into a document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#inserttextrequest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`)."
        },
        "index": {
          "type": "number",
          "title": "Index",
          "description": "The index to insert the text at"
        },
        "tabId": {
          "type": "string",
          "title": "Tab ID",
          "description": "The Tab ID"
        }
      },
      "required": [
        "docId",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-insert-text",
      "version": "0.0.4",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "text",
          "type": "string",
          "label": "Text",
          "description": "Enter static text (e.g., `hello world`) or a reference to a string exported by a previous step (e.g., `{{steps.foo.$return_value}}`).",
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
          "name": "index",
          "type": "integer",
          "label": "Index",
          "description": "The index to insert the text at",
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
          "name": "tabId",
          "type": "string",
          "label": "Tab ID",
          "description": "The Tab ID",
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
      "app": "google_docs",
      "componentKey": "google_docs-insert-text",
      "componentName": "Insert Text"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_replace_image",
    "description": "Replace image in a existing document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceImageRequest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "imageId": {
          "type": "string",
          "title": "Image ID",
          "description": "The image that will be replaced"
        },
        "imageUri": {
          "type": "string",
          "title": "Image URL",
          "description": "The URL of the image you want to insert into the doc"
        }
      },
      "required": [
        "docId",
        "imageId",
        "imageUri"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-replace-image",
      "version": "0.0.11",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "imageId",
          "type": "string",
          "label": "Image ID",
          "description": "The image that will be replaced",
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
          "name": "imageUri",
          "type": "string",
          "label": "Image URL",
          "description": "The URL of the image you want to insert into the doc",
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
      "app": "google_docs",
      "componentKey": "google_docs-replace-image",
      "componentName": "Replace Image"
    }
  },
  {
    "integration": "google-docs",
    "name": "google-docs_replace_text",
    "description": "Replace all instances of matched text in an existing document. Supports Markdown formatting in the replacement text. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#ReplaceAllTextRequest)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "docId": {
          "type": "string",
          "title": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`)."
        },
        "replaced": {
          "type": "string",
          "title": "Text to be replaced",
          "description": "The text that will be replaced"
        },
        "text": {
          "type": "string",
          "title": "New Text",
          "description": "The replacement text. Can include Markdown formatting (bold, italic, code, links, headings, lists, etc.)."
        },
        "enableMarkdown": {
          "type": "boolean",
          "title": "Parse as Markdown",
          "description": "Enable Markdown parsing for the replacement text. When enabled, Markdown syntax (e.g., **bold**, *italic*, [links](url), `code`) will be converted to Google Docs formatting."
        },
        "matchCase": {
          "type": "boolean",
          "title": "Match Case",
          "description": "Case sensitive search (`true`) or not (`false`). Defaults to `false`"
        },
        "tabIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tab IDs",
          "description": "The tab IDs to replace the text in"
        }
      },
      "required": [
        "docId",
        "replaced",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-docs",
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
      "app": "google_docs",
      "componentId": "google_docs-replace-text",
      "version": "0.0.11",
      "authPropNames": [
        "googleDocs"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleDocs",
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
          "name": "docId",
          "type": "string",
          "label": "Document",
          "description": "Search for and select a document. You can also use a custom expression to pass a value from a previous step (e.g., `{{steps.foo.$return_value.documentId}}`) or you can enter a static ID (e.g., `1KuEN7k8jVP3Qi0_svM5OO8oEuiLkq0csihobF67eat8`).",
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
          "name": "replaced",
          "type": "string",
          "label": "Text to be replaced",
          "description": "The text that will be replaced",
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
          "label": "New Text",
          "description": "The replacement text. Can include Markdown formatting (bold, italic, code, links, headings, lists, etc.).",
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
          "name": "enableMarkdown",
          "type": "boolean",
          "label": "Parse as Markdown",
          "description": "Enable Markdown parsing for the replacement text. When enabled, Markdown syntax (e.g., **bold**, *italic*, [links](url), `code`) will be converted to Google Docs formatting.",
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
          "name": "matchCase",
          "type": "boolean",
          "label": "Match Case",
          "description": "Case sensitive search (`true`) or not (`false`). Defaults to `false`",
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
          "name": "tabIds",
          "type": "string[]",
          "label": "Tab IDs",
          "description": "The tab IDs to replace the text in",
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
      "app": "google_docs",
      "componentKey": "google_docs-replace-text",
      "componentName": "Replace Text"
    }
  }
] satisfies PipedreamActionToolManifest[];
