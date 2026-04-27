import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const AirtablePipedreamToolManifests = [
  {
    "integration": "airtable",
    "name": "airtable_create_comment",
    "description": "Create a comment on a selected record. [See the documentation](https://airtable.com/developers/web/api/create-comment)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "Identifier of a record"
        },
        "comment": {
          "type": "string",
          "title": "Comment",
          "description": "The text comment to create"
        }
      },
      "required": [
        "baseId",
        "tableId",
        "recordId",
        "comment"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-create-comment",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "Identifier of a record",
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
          "description": "The text comment to create",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-create-comment",
      "componentName": "Create Comment"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_create_field",
    "description": "Create a new field in a table. [See the documentation](https://airtable.com/developers/web/api/create-field)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "name": {
          "type": "string",
          "title": "Field Name",
          "description": "The name of the field"
        },
        "type": {
          "type": "string",
          "title": "Field Type",
          "description": "The field type. [See the documentation](https://airtable.com/developers/web/api/model/field-type) for more information."
        },
        "description": {
          "type": "string",
          "title": "Field Description",
          "description": "The description of the field"
        },
        "options": {
          "type": "object",
          "title": "Field Options",
          "description": "The options for the field as a JSON object, e.g. `{ \"color\": \"greenBright\" }`. Each type has a specific set of options - [see the documentation](https://airtable.com/developers/web/api/field-model) for more information."
        }
      },
      "required": [
        "baseId",
        "tableId",
        "name",
        "type"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-create-field",
      "version": "0.1.5",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "name",
          "type": "string",
          "label": "Field Name",
          "description": "The name of the field",
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
          "name": "type",
          "type": "string",
          "label": "Field Type",
          "description": "The field type. [See the documentation](https://airtable.com/developers/web/api/model/field-type) for more information.",
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
          "name": "description",
          "type": "string",
          "label": "Field Description",
          "description": "The description of the field",
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
          "name": "options",
          "type": "object",
          "label": "Field Options",
          "description": "The options for the field as a JSON object, e.g. `{ \"color\": \"greenBright\" }`. Each type has a specific set of options - [see the documentation](https://airtable.com/developers/web/api/field-model) for more information.",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-create-field",
      "componentName": "Create Field"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_create_multiple_records",
    "description": "Create one or more records in a table in a single operation with an array. [See the documentation](https://airtable.com/developers/web/api/create-records)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "records": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Records",
          "description": "Each item in the array should be an object in JSON format, representing a new record. The keys are the column names and the corresponding values are the data to insert."
        },
        "typecast": {
          "type": "boolean",
          "title": "Typecast",
          "description": "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. This is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources."
        },
        "returnFieldsByFieldId": {
          "type": "boolean",
          "title": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name."
        }
      },
      "required": [
        "baseId",
        "tableId",
        "records"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-create-multiple-records",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "records",
          "type": "string[]",
          "label": "Records",
          "description": "Each item in the array should be an object in JSON format, representing a new record. The keys are the column names and the corresponding values are the data to insert.",
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
          "name": "customExpressionInfo",
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
          "name": "typecast",
          "type": "boolean",
          "label": "Typecast",
          "description": "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. This is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.",
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
          "name": "returnFieldsByFieldId",
          "type": "boolean",
          "label": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name.",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-create-multiple-records",
      "componentName": "Create Multiple Records"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_create_table",
    "description": "Create a new table. [See the documentation](https://airtable.com/developers/web/api/create-table)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the table"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The description of the table"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "A list of JSON objects representing the fields in the table. [See the documentation](https://airtable.com/developers/web/api/model/field-type) for supported field types, the write format for field options, and other specifics for certain field types."
        }
      },
      "required": [
        "baseId",
        "name",
        "fields"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-create-table",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the table",
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
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "The description of the table",
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
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "A list of JSON objects representing the fields in the table. [See the documentation](https://airtable.com/developers/web/api/model/field-type) for supported field types, the write format for field options, and other specifics for certain field types.",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-create-table",
      "componentName": "Create Table"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_delete_record",
    "description": "Delete a selected record from a table. [See the documentation](https://airtable.com/developers/web/api/delete-record)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "Identifier of a record"
        }
      },
      "required": [
        "baseId",
        "tableId",
        "recordId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-delete-record",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "Identifier of a record",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-delete-record",
      "componentName": "Delete Record"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_get_record",
    "description": "Get data of a selected record from a table. [See the documentation](https://airtable.com/developers/web/api/get-record)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "returnFieldsByFieldId": {
          "type": "boolean",
          "title": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "Identifier of a record"
        }
      },
      "required": [
        "baseId",
        "tableId",
        "recordId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-get-record",
      "version": "0.0.14",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "returnFieldsByFieldId",
          "type": "boolean",
          "label": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name.",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "Identifier of a record",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-get-record",
      "componentName": "Get Record"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_list_bases",
    "description": "Get the list of bases that can be accessed. [See the documentation](https://airtable.com/developers/web/api/list-bases)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-list-bases",
      "version": "0.0.4",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-list-bases",
      "componentName": "List Bases"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_list_records",
    "description": "Retrieve records from a table, optionally sorting and filtering results. [See the documentation](https://airtable.com/developers/web/api/list-records)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "sortFieldId": {
          "type": "string",
          "title": "Sort by Field",
          "description": "Optionally select a field to sort results by. To sort by multiple fields, use the **Filter by Formula** field."
        },
        "sortDirection": {
          "type": "string",
          "title": "Sort: Direction",
          "description": "If sorting by a field, which direction to sort by."
        },
        "maxRecords": {
          "type": "number",
          "title": "Max Records",
          "description": "The maximum number of records to return. Leave blank to retrieve all records."
        },
        "filterByFormula": {
          "type": "string",
          "title": "Filter by Formula",
          "description": "Optionally provide a [formula (see info on the documentation)](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, use `NOT({Name} = '')`."
        },
        "returnFieldsByFieldId": {
          "type": "boolean",
          "title": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name."
        }
      },
      "required": [
        "baseId",
        "tableId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-list-records",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "sortFieldId",
          "type": "string",
          "label": "Sort by Field",
          "description": "Optionally select a field to sort results by. To sort by multiple fields, use the **Filter by Formula** field.",
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
          "name": "sortDirection",
          "type": "string",
          "label": "Sort: Direction",
          "description": "If sorting by a field, which direction to sort by.",
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
          "name": "maxRecords",
          "type": "integer",
          "label": "Max Records",
          "description": "The maximum number of records to return. Leave blank to retrieve all records.",
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
          "name": "filterByFormula",
          "type": "string",
          "label": "Filter by Formula",
          "description": "Optionally provide a [formula (see info on the documentation)](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, use `NOT({Name} = '')`.",
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
          "name": "returnFieldsByFieldId",
          "type": "boolean",
          "label": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name.",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-list-records",
      "componentName": "commonList"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_list_records_in_view",
    "description": "Retrieve records from a view, optionally sorting and filtering results. [See the documentation](https://airtable.com/developers/web/api/list-views)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "viewId": {
          "type": "string",
          "title": "View",
          "description": "The View ID."
        },
        "sortFieldId": {
          "type": "string",
          "title": "Sort by Field",
          "description": "Optionally select a field to sort results by. To sort by multiple fields, use the **Filter by Formula** field."
        },
        "sortDirection": {
          "type": "string",
          "title": "Sort: Direction",
          "description": "If sorting by a field, which direction to sort by."
        },
        "maxRecords": {
          "type": "number",
          "title": "Max Records",
          "description": "The maximum number of records to return. Leave blank to retrieve all records."
        },
        "filterByFormula": {
          "type": "string",
          "title": "Filter by Formula",
          "description": "Optionally provide a [formula (see info on the documentation)](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, use `NOT({Name} = '')`."
        },
        "returnFieldsByFieldId": {
          "type": "boolean",
          "title": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name."
        }
      },
      "required": [
        "baseId",
        "tableId",
        "viewId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-list-records-in-view",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "accountTierAlert",
          "type": "alert",
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
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "viewId",
          "type": "string",
          "label": "View",
          "description": "The View ID.",
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
          "name": "sortFieldId",
          "type": "string",
          "label": "Sort by Field",
          "description": "Optionally select a field to sort results by. To sort by multiple fields, use the **Filter by Formula** field.",
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
          "name": "sortDirection",
          "type": "string",
          "label": "Sort: Direction",
          "description": "If sorting by a field, which direction to sort by.",
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
          "name": "maxRecords",
          "type": "integer",
          "label": "Max Records",
          "description": "The maximum number of records to return. Leave blank to retrieve all records.",
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
          "name": "filterByFormula",
          "type": "string",
          "label": "Filter by Formula",
          "description": "Optionally provide a [formula (see info on the documentation)](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, use `NOT({Name} = '')`.",
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
          "name": "returnFieldsByFieldId",
          "type": "boolean",
          "label": "Return Fields By ID",
          "description": "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name.",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-list-records-in-view",
      "componentName": "commonList"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_list_tables",
    "description": "Get a list of tables in the selected base. [See the documentation](https://airtable.com/developers/web/api/get-base-schema)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        }
      },
      "required": [
        "baseId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-list-tables",
      "version": "0.0.4",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-list-tables",
      "componentName": "List Tables"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_update_comment",
    "description": "Update an existing comment on a selected record. [See the documentation](https://airtable.com/developers/web/api/update-comment)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "Identifier of a record"
        },
        "commentId": {
          "type": "string",
          "title": "Comment ID",
          "description": "Identifier of a comment"
        },
        "comment": {
          "type": "string",
          "title": "Comment",
          "description": "The new content of the comment"
        }
      },
      "required": [
        "baseId",
        "tableId",
        "recordId",
        "commentId",
        "comment"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-update-comment",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "Identifier of a record",
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
          "name": "commentId",
          "type": "string",
          "label": "Comment ID",
          "description": "Identifier of a comment",
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
          "description": "The new content of the comment",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-update-comment",
      "componentName": "Update Comment"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_update_field",
    "description": "Update an existing field in a table. [See the documentation](https://airtable.com/developers/web/api/update-field)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "fieldId": {
          "type": "string",
          "title": "Field ID",
          "description": "The field to update"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The new name of the field"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The new description of the field"
        }
      },
      "required": [
        "baseId",
        "tableId",
        "fieldId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-update-field",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "fieldId",
          "type": "string",
          "label": "Field ID",
          "description": "The field to update",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The new name of the field",
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
          "description": "The new description of the field",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-update-field",
      "componentName": "Update Field"
    }
  },
  {
    "integration": "airtable",
    "name": "airtable_update_table",
    "description": "Update an existing table. [See the documentation](https://airtable.com/developers/web/api/update-table)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "baseId": {
          "type": "string",
          "title": "Base",
          "description": "The Base ID."
        },
        "tableId": {
          "type": "string",
          "title": "Table",
          "description": "The Table ID."
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The updated name of the table"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The updated description of the table"
        }
      },
      "required": [
        "baseId",
        "tableId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "airtable",
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
      "app": "airtable_oauth",
      "componentId": "airtable_oauth-update-table",
      "version": "0.0.13",
      "authPropNames": [
        "airtable"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "airtable",
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
          "name": "baseId",
          "type": "string",
          "label": "Base",
          "description": "The Base ID.",
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
          "name": "warningAlert",
          "type": "alert",
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
          "name": "tableId",
          "type": "string",
          "label": "Table",
          "description": "The Table ID.",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The updated name of the table",
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
          "description": "The updated description of the table",
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
      "app": "airtable_oauth",
      "componentKey": "airtable_oauth-update-table",
      "componentName": "Update Table"
    }
  }
] satisfies PipedreamActionToolManifest[];
