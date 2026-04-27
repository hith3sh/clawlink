import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const SalesforcePipedreamToolManifests = [
  {
    "integration": "salesforce",
    "name": "salesforce_add_contact_to_campaign",
    "description": "Adds an existing contact to an existing campaign. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaignmember.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The Campaign to add a Contact to."
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "The Contact to add to the selected Campaign."
        }
      },
      "required": [
        "campaignId",
        "contactId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-add-contact-to-campaign",
      "version": "0.1.4",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "description": "The Campaign to add a Contact to.",
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
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "The Contact to add to the selected Campaign.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-add-contact-to-campaign",
      "componentName": "Add Contact to Campaign"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_add_lead_to_campaign",
    "description": "Adds an existing lead to an existing campaign. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.object_reference.meta/object_reference/sforce_api_objects_campaignmember.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "campaignId": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The Campaign to add a Lead to."
        },
        "leadId": {
          "type": "string",
          "title": "Lead ID",
          "description": "The Lead to add to the selected Campaign."
        }
      },
      "required": [
        "campaignId",
        "leadId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-add-lead-to-campaign",
      "version": "0.1.4",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "description": "The Campaign to add a Lead to.",
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
          "name": "leadId",
          "type": "string",
          "label": "Lead ID",
          "description": "The Lead to add to the selected Campaign.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-add-lead-to-campaign",
      "componentName": "Add Lead to Campaign"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_convert_soap_xml_to_json",
    "description": "Converts a SOAP XML Object received from Salesforce to JSON",
    "inputSchema": {
      "type": "object",
      "properties": {
        "xml": {
          "type": "string",
          "title": "XML Soap Object",
          "description": "The object received from Salesforce that will be converted."
        },
        "extractNotificationOnly": {
          "type": "boolean",
          "title": "Extract Notifications Only",
          "description": "Whether to extract only the notification parts from the XML. Default: `true`."
        },
        "failOnError": {
          "type": "boolean",
          "title": "Fail on Error",
          "description": "Whether the action should fail if an error occurs when extracting notifications. Default: `false`."
        }
      },
      "required": [
        "xml"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-convert-soap-xml-to-json",
      "version": "0.0.10",
      "authPropNames": [
        "salesforce_rest_api"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce_rest_api",
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
          "name": "infoBox",
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
          "name": "xml",
          "type": "string",
          "label": "XML Soap Object",
          "description": "The object received from Salesforce that will be converted.",
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
          "name": "extractNotificationOnly",
          "type": "boolean",
          "label": "Extract Notifications Only",
          "description": "Whether to extract only the notification parts from the XML. Default: `true`.",
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
          "name": "failOnError",
          "type": "boolean",
          "label": "Fail on Error",
          "description": "Whether the action should fail if an error occurs when extracting notifications. Default: `false`.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-convert-soap-xml-to-json",
      "componentName": "Convert SOAP XML Object to JSON"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_create_crm_record",
    "description": "Create Record via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "\"The Salesforce object API name (e.g. `Account`, `Contact`, `Lead`, `Opportunity`, `Case`, `Task`, `Event`).\"\n        + \" Use **List Objects** to discover custom object types (ending in `__c`).\""
        },
        "properties": {
          "type": "object",
          "title": "Record Properties",
          "description": "\"Field name → value pairs for the new record.\"\n        + \" Example for Contact: `{\\\"FirstName\\\": \\\"Jane\\\", \\\"LastName\\\": \\\"Doe\\\", \\\"Email\\\": \\\"jane@example.com\\\", \\\"AccountId\\\": \\\"001xxx\\\"}`.\"\n        + \" Example for Opportunity: `{\\\"Name\\\": \\\"Acme Deal\\\", \\\"StageName\\\": \\\"Prospecting\\\", \\\"CloseDate\\\": \\\"2025-12-31\\\", \\\"Amount\\\": 50000}`.\"\n        + \" Use **Describe Object** to discover valid field names and picklist values.\""
        }
      },
      "required": [
        "objectType",
        "properties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-create-crm-record",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "objectType",
          "type": "string",
          "label": "Object Type",
          "description": "\"The Salesforce object API name (e.g. `Account`, `Contact`, `Lead`, `Opportunity`, `Case`, `Task`, `Event`).\"\n        + \" Use **List Objects** to discover custom object types (ending in `__c`).\"",
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
          "name": "properties",
          "type": "object",
          "label": "Record Properties",
          "description": "\"Field name → value pairs for the new record.\"\n        + \" Example for Contact: `{\\\"FirstName\\\": \\\"Jane\\\", \\\"LastName\\\": \\\"Doe\\\", \\\"Email\\\": \\\"jane@example.com\\\", \\\"AccountId\\\": \\\"001xxx\\\"}`.\"\n        + \" Example for Opportunity: `{\\\"Name\\\": \\\"Acme Deal\\\", \\\"StageName\\\": \\\"Prospecting\\\", \\\"CloseDate\\\": \\\"2025-12-31\\\", \\\"Amount\\\": 50000}`.\"\n        + \" Use **Describe Object** to discover valid field names and picklist values.\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-create-crm-record",
      "componentName": "Create Record"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_delete_crm_record",
    "description": "Delete Record via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`)."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "\"The ID of the record to delete.\"\n        + \" Use **SOQL Query** to find the ID if you only have the record name.\""
        }
      },
      "required": [
        "objectType",
        "recordId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-delete-crm-record",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "objectType",
          "type": "string",
          "label": "Object Type",
          "description": "The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`).",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "\"The ID of the record to delete.\"\n        + \" Use **SOQL Query** to find the ID if you only have the record name.\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-delete-crm-record",
      "componentName": "Delete Record"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_delete_note",
    "description": "Delete a note or content note from a Salesforce record. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve_delete.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sobjectType": {
          "type": "string",
          "title": "Note Type",
          "description": "The type of note to delete"
        },
        "recordId": {
          "type": "string",
          "title": "Note ID Or Content Note ID",
          "description": "The ID of the note or content note to delete"
        }
      },
      "required": [
        "sobjectType",
        "recordId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-delete-note",
      "version": "0.0.2",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "sobjectType",
          "type": "string",
          "label": "Note Type",
          "description": "The type of note to delete",
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
          "name": "recordId",
          "type": "string",
          "label": "Note ID Or Content Note ID",
          "description": "The ID of the note or content note to delete",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-delete-note",
      "componentName": "Delete Note Or Content Note"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_delete_opportunity",
    "description": "Deletes an opportunity. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.228.0.api_rest.meta/api_rest/dome_delete_record.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "recordId": {
          "type": "string",
          "title": "Opportunity ID",
          "description": "ID of the opportunity to delete."
        }
      },
      "required": [
        "recordId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-delete-opportunity",
      "version": "0.3.4",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "recordId",
          "type": "string",
          "label": "Opportunity ID",
          "description": "ID of the opportunity to delete.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-delete-opportunity",
      "componentName": "Delete Opportunity"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_delete_record",
    "description": "Deletes an existing record in an object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_retrieve_delete.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sobjectType": {
          "type": "string",
          "title": "SObject Type",
          "description": "The type of object to delete a record of."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "The record to delete."
        }
      },
      "required": [
        "sobjectType",
        "recordId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-delete-record",
      "version": "0.2.4",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "sobjectType",
          "type": "string",
          "label": "SObject Type",
          "description": "The type of object to delete a record of.",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "The record to delete.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-delete-record",
      "componentName": "Delete Record"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_describe_object",
    "description": "Describe Object via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "\"The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`, `CustomObject__c`).\"\n        + \" Use **List Objects** to discover available object types.\""
        },
        "fieldsFilter": {
          "type": "string",
          "title": "Fields Filter",
          "description": "\"Optional keyword to filter field names and labels (case-insensitive).\"\n        + \" For example, `stage` returns fields like `StageName`, `ForecastCategoryName`.\"\n        + \" Omit to return all fields.\""
        }
      },
      "required": [
        "objectType"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-describe-object",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "objectType",
          "type": "string",
          "label": "Object Type",
          "description": "\"The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`, `CustomObject__c`).\"\n        + \" Use **List Objects** to discover available object types.\"",
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
          "name": "fieldsFilter",
          "type": "string",
          "label": "Fields Filter",
          "description": "\"Optional keyword to filter field names and labels (case-insensitive).\"\n        + \" For example, `stage` returns fields like `StageName`, `ForecastCategoryName`.\"\n        + \" Omit to return all fields.\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-describe-object",
      "componentName": "Describe Object"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_find_records",
    "description": "Retrieves selected fields for some or all records of a selected object. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sobjectType": {
          "type": "string",
          "title": "SObject Type",
          "description": "The type of object to obtain records of."
        },
        "fieldsToObtain": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields to Obtain",
          "description": "Select the field(s) to obtain for the selected record(s) (or all records)."
        },
        "recordIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Record ID(s)",
          "description": "The record(s) to retrieve. If not specified, all records will be retrieved."
        }
      },
      "required": [
        "sobjectType",
        "fieldsToObtain"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-find-records",
      "version": "0.2.4",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "sobjectType",
          "type": "string",
          "label": "SObject Type",
          "description": "The type of object to obtain records of.",
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
          "name": "fieldsToObtain",
          "type": "string[]",
          "label": "Fields to Obtain",
          "description": "Select the field(s) to obtain for the selected record(s) (or all records).",
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
          "name": "recordIds",
          "type": "string[]",
          "label": "Record ID(s)",
          "description": "The record(s) to retrieve. If not specified, all records will be retrieved.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-find-records",
      "componentName": "Find Records"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_case",
    "description": "Retrieves a case by its ID. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "caseId": {
          "type": "string",
          "title": "Case ID",
          "description": "The case ID to retrieve"
        }
      },
      "required": [
        "caseId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-case",
      "version": "0.0.5",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "caseId",
          "type": "string",
          "label": "Case ID",
          "description": "The case ID to retrieve",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-case",
      "componentName": "Get Case"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_current_user",
    "description": "Returns the authenticated Salesforce user's ID, name, email, and organization ID. Call this first when the user says 'my leads', 'my opportunities', 'my cases', or any first-person query. Use `user_id` as the OwnerId filter in **SOQL Search** (e.g. `WHERE OwnerId = '{user_id}'`) and `organization_id` to construct Salesforce UI URLs. [See the documentation](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_using_userinfo_endpoint.htm).",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-current-user",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-current-user",
      "componentName": "Get Current User"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_knowledge_articles",
    "description": "Get a page of online articles for the given language and category through either search or query. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/sforce_api_rest_retrieve_article_list.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string",
          "title": "Language",
          "description": "The language code. Defaults to `en-US`."
        },
        "q": {
          "type": "string",
          "title": "Search Term",
          "description": "Performs an SOSL search. If this property is not set, an SOQL query runs. The characters `?` and `*` are used for wildcard searches. The characters `(`, `)`, and `\"` are used for complex search terms. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_find.htm)."
        },
        "channel": {
          "type": "string",
          "title": "Channel",
          "description": "Where articles are visible (App, Pkb, Csp, Prm).",
          "enum": [
            "App",
            "Pkb",
            "Csp",
            "Prm"
          ]
        },
        "categories": {
          "type": "string",
          "title": "Categories",
          "description": "This should be a map in json format `{\"group1\": \"category1\", \"group2\": \"category2\", ...}`. It must be unique in each group:category pair, otherwise you get `ARGUMENT_OBJECT_PARSE_ERROR`. There is a limit of three data category conditions, otherwise you get `INVALID_FILTER_VALUE`."
        },
        "queryMethod": {
          "type": "string",
          "title": "Query Method",
          "description": "Only valid when categories are specified, defaults to `ABOVE_OR_BELOW`."
        },
        "sort": {
          "type": "string",
          "title": "Sort By",
          "description": "Field to sort results by. Defaults to `LastPublishedDate` for query and relevance for search"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-knowledge-articles",
      "version": "0.0.3",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
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
          "name": "info",
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
          "name": "language",
          "type": "string",
          "label": "Language",
          "description": "The language code. Defaults to `en-US`.",
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
          "name": "q",
          "type": "string",
          "label": "Search Term",
          "description": "Performs an SOSL search. If this property is not set, an SOQL query runs. The characters `?` and `*` are used for wildcard searches. The characters `(`, `)`, and `\"` are used for complex search terms. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl_find.htm).",
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
          "name": "channel",
          "type": "string",
          "label": "Channel",
          "description": "Where articles are visible (App, Pkb, Csp, Prm).",
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
              "label": "Internal Knowledge App",
              "value": "App"
            },
            {
              "label": "Public Knowledge Base",
              "value": "Pkb"
            },
            {
              "label": "Customer Portal",
              "value": "Csp"
            },
            {
              "label": "Partner Portal",
              "value": "Prm"
            }
          ]
        },
        {
          "name": "categories",
          "type": "string",
          "label": "Categories",
          "description": "This should be a map in json format `{\"group1\": \"category1\", \"group2\": \"category2\", ...}`. It must be unique in each group:category pair, otherwise you get `ARGUMENT_OBJECT_PARSE_ERROR`. There is a limit of three data category conditions, otherwise you get `INVALID_FILTER_VALUE`.",
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
          "name": "queryMethod",
          "type": "string",
          "label": "Query Method",
          "description": "Only valid when categories are specified, defaults to `ABOVE_OR_BELOW`.",
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
          "name": "sort",
          "type": "string",
          "label": "Sort By",
          "description": "Field to sort results by. Defaults to `LastPublishedDate` for query and relevance for search",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-knowledge-articles",
      "componentName": "Get Knowledge Articles"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_knowledge_data_category_groups",
    "description": "Fetch data category groups visible to the current user. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/resources_knowledge_support_dcgroups.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string",
          "title": "Language",
          "description": "The language code. Defaults to `en-US`."
        },
        "topCategoriesOnly": {
          "type": "boolean",
          "title": "Top Categories Only",
          "description": "Return only top-level categories if `true`, entire tree if `false`."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-knowledge-data-category-groups",
      "version": "0.0.3",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
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
          "name": "info",
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
          "name": "language",
          "type": "string",
          "label": "Language",
          "description": "The language code. Defaults to `en-US`.",
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
          "name": "topCategoriesOnly",
          "type": "boolean",
          "label": "Top Categories Only",
          "description": "Return only top-level categories if `true`, entire tree if `false`.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-knowledge-data-category-groups",
      "componentName": "Get Knowledge Data Category Groups"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_record_by_id",
    "description": "Retrieves a record by its ID. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sobjectType": {
          "type": "string",
          "title": "SObject Type",
          "description": "The type of object to retrieve a record of"
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "The ID of the record to retrieve"
        },
        "fieldsToObtain": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields to Obtain",
          "description": "Select the field(s) to obtain for the selected record(s) (or all records)."
        }
      },
      "required": [
        "sobjectType",
        "recordId",
        "fieldsToObtain"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-record-by-id",
      "version": "0.0.2",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "sobjectType",
          "type": "string",
          "label": "SObject Type",
          "description": "The type of object to retrieve a record of",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "The ID of the record to retrieve",
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
          "name": "fieldsToObtain",
          "type": "string[]",
          "label": "Fields to Obtain",
          "description": "Select the field(s) to obtain for the selected record(s) (or all records).",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-record-by-id",
      "componentName": "Get Record by ID"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_related_records",
    "description": "Get Related Records via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Parent Object Type",
          "description": "The SObject API name of the parent record (e.g. `Account`, `Contact`, `Opportunity`)."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "The ID of the parent record."
        },
        "relationshipName": {
          "type": "string",
          "title": "Relationship Name",
          "description": "\"The API name of the relationship to traverse (e.g. `Contacts`, `Opportunities`, `Cases`, `Tasks`).\"\n        + \" This is the plural relationship name, not the field name.\"\n        + \" Use **Describe Object** on the parent type to discover available relationships.\""
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields",
          "description": "\"Fields to return on the related records (e.g. `[\\\"Id\\\", \\\"Name\\\", \\\"Email\\\"]`).\"\n        + \" If omitted, returns default fields.\""
        }
      },
      "required": [
        "objectType",
        "recordId",
        "relationshipName"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-related-records",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "objectType",
          "type": "string",
          "label": "Parent Object Type",
          "description": "The SObject API name of the parent record (e.g. `Account`, `Contact`, `Opportunity`).",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "The ID of the parent record.",
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
          "name": "relationshipName",
          "type": "string",
          "label": "Relationship Name",
          "description": "\"The API name of the relationship to traverse (e.g. `Contacts`, `Opportunities`, `Cases`, `Tasks`).\"\n        + \" This is the plural relationship name, not the field name.\"\n        + \" Use **Describe Object** on the parent type to discover available relationships.\"",
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
          "name": "fields",
          "type": "string[]",
          "label": "Fields",
          "description": "\"Fields to return on the related records (e.g. `[\\\"Id\\\", \\\"Name\\\", \\\"Email\\\"]`).\"\n        + \" If omitted, returns default fields.\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-related-records",
      "componentName": "Get Related Records"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_user",
    "description": "Retrieves a user by their ID. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "userId": {
          "type": "string",
          "title": "Record ID",
          "description": "The ID of the record of the selected object type."
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
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-user",
      "version": "0.0.5",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "label": "Record ID",
          "description": "The ID of the record of the selected object type.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-user",
      "componentName": "Get User"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_get_user_info",
    "description": "Get User Info via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-get-user-info",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-get-user-info",
      "componentName": "Get User Info"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_list_case_comments",
    "description": "Lists all comments for a case. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "caseId": {
          "type": "string",
          "title": "Record ID",
          "description": "The ID of the record of the selected object type."
        }
      },
      "required": [
        "caseId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-list-case-comments",
      "version": "0.0.5",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "caseId",
          "type": "string",
          "label": "Record ID",
          "description": "The ID of the record of the selected object type.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-list-case-comments",
      "componentName": "List Case Comments"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_list_email_messages",
    "description": "Lists all email messages for a case. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_get_field_values.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "caseId": {
          "type": "string",
          "title": "Case ID",
          "description": "The ID of the case to retrieve email messages for"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-list-email-messages",
      "version": "0.0.5",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "caseId",
          "type": "string",
          "label": "Case ID",
          "description": "The ID of the case to retrieve email messages for",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-list-email-messages",
      "componentName": "List Email Messages"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_list_email_templates",
    "description": "Lists all email templates. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_emailtemplate.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-list-email-templates",
      "version": "0.0.5",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-list-email-templates",
      "componentName": "List Email Templates"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_list_knowledge_articles",
    "description": "Lists all knowledge articles. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_knowledgearticle.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-list-knowledge-articles",
      "version": "0.0.5",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-list-knowledge-articles",
      "componentName": "List Knowledge Articles"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_list_object_fields",
    "description": "Lists all fields for a given object type. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_describe.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sobjectType": {
          "type": "string",
          "title": "SObject Type",
          "description": "The type of object to list fields of"
        },
        "customOnly": {
          "type": "boolean",
          "title": "Custom Only",
          "description": "Set to `true` to only list custom fields"
        }
      },
      "required": [
        "sobjectType"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-list-object-fields",
      "version": "0.0.2",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "sobjectType",
          "type": "string",
          "label": "SObject Type",
          "description": "The type of object to list fields of",
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
          "name": "customOnly",
          "type": "boolean",
          "label": "Custom Only",
          "description": "Set to `true` to only list custom fields",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-list-object-fields",
      "componentName": "List Object Fields"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_list_objects",
    "description": "List Objects via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "filter": {
          "type": "string",
          "title": "Filter",
          "description": "\"Optional keyword to filter object names and labels (case-insensitive).\"\n        + \" For example, `custom` returns only custom objects, `account` returns Account-related objects.\""
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-list-objects",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "filter",
          "type": "string",
          "label": "Filter",
          "description": "\"Optional keyword to filter object names and labels (case-insensitive).\"\n        + \" For example, `custom` returns only custom objects, `account` returns Account-related objects.\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-list-objects",
      "componentName": "List Objects"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_post_feed_to_chatter",
    "description": "Post a feed item in Chatter. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/quickreference_post_feed_item.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sobjectType": {
          "type": "string",
          "title": "SObject Type",
          "description": "The type of object to select a record from."
        },
        "subjectId": {
          "type": "string",
          "title": "Record ID",
          "description": "The record that will parent the feed item."
        },
        "messageSegments": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Message segments",
          "description": "Each message segment can be a text string, which will be treated as a segment of `type: Text`, or a [message segment object](https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/connect_requests_message_body_input.htm) such as `{ \"type\": \"Mention\", \"username\": \"john\" }`"
        }
      },
      "required": [
        "sobjectType",
        "subjectId",
        "messageSegments"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-post-feed-to-chatter",
      "version": "0.1.4",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "sobjectType",
          "type": "string",
          "label": "SObject Type",
          "description": "The type of object to select a record from.",
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
          "name": "subjectId",
          "type": "string",
          "label": "Record ID",
          "description": "The record that will parent the feed item.",
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
          "name": "messageSegments",
          "type": "string[]",
          "label": "Message segments",
          "description": "Each message segment can be a text string, which will be treated as a segment of `type: Text`, or a [message segment object](https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/connect_requests_message_body_input.htm) such as `{ \"type\": \"Mention\", \"username\": \"john\" }`",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-post-feed-to-chatter",
      "componentName": "Post a Message to Chatter Feed"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_search_string",
    "description": "Searches for records in an object using a parameterized search. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_search_parameterized_get.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sobjectType": {
          "type": "string",
          "title": "SObject Type",
          "description": "The type of object to search for records"
        },
        "searchTerm": {
          "type": "string",
          "title": "Search Term",
          "description": "The term to search for"
        },
        "fields": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Fields to Obtain",
          "description": "Select the field(s) to obtain for the selected record(s) (or all records)."
        }
      },
      "required": [
        "sobjectType",
        "searchTerm",
        "fields"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-search-string",
      "version": "0.0.8",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "infoBox",
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
          "name": "sobjectType",
          "type": "string",
          "label": "SObject Type",
          "description": "The type of object to search for records",
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
          "name": "searchTerm",
          "type": "string",
          "label": "Search Term",
          "description": "The term to search for",
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
          "name": "fields",
          "type": "string[]",
          "label": "Fields to Obtain",
          "description": "Select the field(s) to obtain for the selected record(s) (or all records).",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-search-string",
      "componentName": "Search Object Records"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_send_email",
    "description": "Sends an email. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.api_action.meta/api_action/actions_obj_email_simple.htm)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "emailAddress": {
          "type": "string",
          "title": "Email Address",
          "description": "The email address to send the email to"
        },
        "emailSubject": {
          "type": "string",
          "title": "Subject",
          "description": "The subject of the email"
        },
        "emailBody": {
          "type": "string",
          "title": "Body",
          "description": "The body of the email"
        },
        "logEmailOnSend": {
          "type": "boolean",
          "title": "Log Email on Send",
          "description": "Indicates whether to log the email on the specified records' activity time lines"
        },
        "relatedRecordId": {
          "type": "string",
          "title": "Related Record ID",
          "description": "The ID of a record that is not a person (for example, a case record). If `logEmailOnSend` is included, this is the ID of a secondary record (except a lead) to log the email to."
        },
        "addThreadingTokenToBody": {
          "type": "boolean",
          "title": "Add Threading Token to Body",
          "description": "Whether to create a unique token for the related record and add it to the email body. When the related record is a case record, Email-to-Case uses the token to link future email responses to that case."
        },
        "addThreadingTokenToSubject": {
          "type": "boolean",
          "title": "Add Threading Token to Subject",
          "description": "The same as `Add Threading Token to Body`, but for the email subject."
        },
        "senderType": {
          "type": "string",
          "title": "Sender Type",
          "description": "Email address used as the email's **From** and **Reply-To** addresses. In scheduled flows, the only valid value is `OrgWideEmailAddress`.",
          "enum": [
            "CurrentUser",
            "DefaultWorkflowUser",
            "OrgWideEmailAddress"
          ]
        },
        "senderAddress": {
          "type": "string",
          "title": "Sender Address",
          "description": "If `Sender Type` is `OrgWideEmailAddress`, this is the organization-wide email address to be used as the sender."
        }
      },
      "required": [
        "emailAddress",
        "emailSubject",
        "emailBody",
        "senderType"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-send-email",
      "version": "0.1.0",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "emailAddress",
          "type": "string",
          "label": "Email Address",
          "description": "The email address to send the email to",
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
          "name": "emailSubject",
          "type": "string",
          "label": "Subject",
          "description": "The subject of the email",
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
          "name": "emailBody",
          "type": "string",
          "label": "Body",
          "description": "The body of the email",
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
          "name": "logEmailOnSend",
          "type": "boolean",
          "label": "Log Email on Send",
          "description": "Indicates whether to log the email on the specified records' activity time lines",
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
          "name": "relatedRecordId",
          "type": "string",
          "label": "Related Record ID",
          "description": "The ID of a record that is not a person (for example, a case record). If `logEmailOnSend` is included, this is the ID of a secondary record (except a lead) to log the email to.",
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
          "name": "addThreadingTokenToBody",
          "type": "boolean",
          "label": "Add Threading Token to Body",
          "description": "Whether to create a unique token for the related record and add it to the email body. When the related record is a case record, Email-to-Case uses the token to link future email responses to that case.",
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
          "name": "addThreadingTokenToSubject",
          "type": "boolean",
          "label": "Add Threading Token to Subject",
          "description": "The same as `Add Threading Token to Body`, but for the email subject.",
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
          "name": "senderType",
          "type": "string",
          "label": "Sender Type",
          "description": "Email address used as the email's **From** and **Reply-To** addresses. In scheduled flows, the only valid value is `OrgWideEmailAddress`.",
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
              "label": "CurrentUser - Email address of the user running the flow (default)",
              "value": "CurrentUser"
            },
            {
              "label": "DefaultWorkflowUser - Email address of the default workflow user",
              "value": "DefaultWorkflowUser"
            },
            {
              "label": "OrgWideEmailAddress - The organization-wide email address, specified in senderAddress",
              "value": "OrgWideEmailAddress"
            }
          ]
        },
        {
          "name": "senderAddress",
          "type": "string",
          "label": "Sender Address",
          "description": "If `Sender Type` is `OrgWideEmailAddress`, this is the organization-wide email address to be used as the sender.",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-send-email",
      "componentName": "Send Email"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_soql_query",
    "description": "SOQL Query via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "title": "SOQL Query",
          "description": "\"The SOQL query string to execute.\"\n        + \" Example: `SELECT Id, Name, Amount, StageName FROM Opportunity WHERE OwnerId = '005xxx' AND StageName = 'Closed Won' ORDER BY Amount DESC LIMIT 10`\""
        }
      },
      "required": [
        "query"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-soql-query",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "query",
          "type": "string",
          "label": "SOQL Query",
          "description": "\"The SOQL query string to execute.\"\n        + \" Example: `SELECT Id, Name, Amount, StageName FROM Opportunity WHERE OwnerId = '005xxx' AND StageName = 'Closed Won' ORDER BY Amount DESC LIMIT 10`\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-soql-query",
      "componentName": "SOQL Query"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_soql_search",
    "description": "`Executes a [Salesforce Object Query Language (SOQL)](${docsLink}) query-based, SQL-like search.`",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "title": "SOQL Query",
          "description": "`A SOQL search query. [See the documentation](${docsLink}) for examples and more information.`"
        }
      },
      "required": [
        "query"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-soql-search",
      "version": "0.2.13",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "docsInfo",
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
          "name": "exampleInfo",
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
          "name": "query",
          "type": "string",
          "label": "SOQL Query",
          "description": "`A SOQL search query. [See the documentation](${docsLink}) for examples and more information.`",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-soql-search",
      "componentName": "SOQL Query (Object Query)"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_sosl_search",
    "description": "`Executes a [Salesforce Object Search Language (SOSL)](${docsLink}) text-based search query.`",
    "inputSchema": {
      "type": "object",
      "properties": {
        "search": {
          "type": "string",
          "title": "SOSL Query",
          "description": "`A SOSL search query. [See the documentation](${docsLink}) for examples and more information.`"
        }
      },
      "required": [
        "search"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-sosl-search",
      "version": "0.2.12",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "docsInfo",
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
          "name": "exampleInfo",
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
          "name": "search",
          "type": "string",
          "label": "SOSL Query",
          "description": "`A SOSL search query. [See the documentation](${docsLink}) for examples and more information.`",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-sosl-search",
      "componentName": "SOSL Search (Object Search)"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_text_search",
    "description": "Text Search via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "searchTerm": {
          "type": "string",
          "title": "Search Term",
          "description": "\"The text to search for across Salesforce records.\"\n        + \" Searches name fields and other indexed text fields.\""
        },
        "objectTypes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Object Types",
          "description": "\"SObject types to search. Default: Account, Contact, Lead, Opportunity.\"\n        + \" Example: `[\\\"Account\\\", \\\"Contact\\\", \\\"Case\\\"]`.\""
        }
      },
      "required": [
        "searchTerm"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-text-search",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "searchTerm",
          "type": "string",
          "label": "Search Term",
          "description": "\"The text to search for across Salesforce records.\"\n        + \" Searches name fields and other indexed text fields.\"",
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
          "name": "objectTypes",
          "type": "string[]",
          "label": "Object Types",
          "description": "\"SObject types to search. Default: Account, Contact, Lead, Opportunity.\"\n        + \" Example: `[\\\"Account\\\", \\\"Contact\\\", \\\"Case\\\"]`.\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-text-search",
      "componentName": "Text Search"
    }
  },
  {
    "integration": "salesforce",
    "name": "salesforce_update_crm_record",
    "description": "Update Record via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`)."
        },
        "recordId": {
          "type": "string",
          "title": "Record ID",
          "description": "\"The ID of the record to update.\"\n        + \" Use **SOQL Query** to find the ID if you only have the record name.\""
        },
        "properties": {
          "type": "object",
          "title": "Properties to Update",
          "description": "\"Field name → new value pairs. Only include fields you want to change.\"\n        + \" Example: `{\\\"StageName\\\": \\\"Closed Won\\\", \\\"Amount\\\": 75000}`.\"\n        + \" Use **Describe Object** to discover valid field names and picklist values.\""
        }
      },
      "required": [
        "objectType",
        "recordId",
        "properties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "salesforce",
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
      "app": "salesforce_rest_api",
      "componentId": "salesforce_rest_api-update-crm-record",
      "version": "0.0.1",
      "authPropNames": [
        "salesforce"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "salesforce",
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
          "name": "objectType",
          "type": "string",
          "label": "Object Type",
          "description": "The Salesforce object API name (e.g. `Account`, `Contact`, `Opportunity`).",
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
          "name": "recordId",
          "type": "string",
          "label": "Record ID",
          "description": "\"The ID of the record to update.\"\n        + \" Use **SOQL Query** to find the ID if you only have the record name.\"",
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
          "name": "properties",
          "type": "object",
          "label": "Properties to Update",
          "description": "\"Field name → new value pairs. Only include fields you want to change.\"\n        + \" Example: `{\\\"StageName\\\": \\\"Closed Won\\\", \\\"Amount\\\": 75000}`.\"\n        + \" Use **Describe Object** to discover valid field names and picklist values.\"",
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
      "app": "salesforce_rest_api",
      "componentKey": "salesforce_rest_api-update-crm-record",
      "componentName": "Update Record"
    }
  }
] satisfies PipedreamActionToolManifest[];
