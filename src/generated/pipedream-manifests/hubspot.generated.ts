import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const HubspotPipedreamToolManifests = [
  {
    "integration": "hubspot",
    "name": "hubspot_add_comment",
    "description": "Adds a comment to a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/post-conversations-v3-conversations-threads-threadId-messages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inboxId": {
          "type": "string",
          "title": "Inbox ID",
          "description": "The ID of an inbox"
        },
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "The ID of a channel"
        },
        "threadId": {
          "type": "string",
          "title": "Thread ID",
          "description": "The ID of a thread"
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "The text content of the comment"
        },
        "fileId": {
          "type": "string",
          "title": "File ID",
          "description": "The ID of a file uploaded to HubSpot"
        }
      },
      "required": [
        "threadId",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-add-comment",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "inboxId",
          "type": "string",
          "label": "Inbox ID",
          "description": "The ID of an inbox",
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
          "name": "channelId",
          "type": "string",
          "label": "Channel ID",
          "description": "The ID of a channel",
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
          "name": "threadId",
          "type": "string",
          "label": "Thread ID",
          "description": "The ID of a thread",
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
          "description": "The text content of the comment",
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
          "name": "fileId",
          "type": "string",
          "label": "File ID",
          "description": "The ID of a file uploaded to HubSpot",
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
      "app": "hubspot",
      "componentKey": "hubspot-add-comment",
      "componentName": "Add Comment"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_add_contact_to_list",
    "description": "Adds a contact to a specific static list. [See the documentation](https://developers.hubspot.com/docs/api-reference/crm-lists-v3/memberships/put-crm-v3-lists-listId-memberships-add)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "list": {
          "type": "string",
          "title": "List",
          "description": "The list which the contact will be added to. Only static lists are shown here, as dynamic lists cannot be manually added to."
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "The contact to be added to the list"
        }
      },
      "required": [
        "list",
        "contactId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-add-contact-to-list",
      "version": "0.1.0",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The list which the contact will be added to. Only static lists are shown here, as dynamic lists cannot be manually added to.",
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
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "The contact to be added to the list",
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
      "app": "hubspot",
      "componentKey": "hubspot-add-contact-to-list",
      "componentName": "Add Contact to List"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_add_note_to_contact",
    "description": "Add Note to Contact via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "Select a contact or enter a **contact record ID**. Search uses HubSpot's contact list; if you only have an email, find the contact here or via **Search CRM Objects** first."
        },
        "noteBody": {
          "type": "string",
          "title": "Note Body",
          "description": "Plain text of the note. Stored in HubSpot as property `hs_note_body`."
        }
      },
      "required": [
        "contactId",
        "noteBody"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-add-note-to-contact",
      "version": "0.0.1",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "Select a contact or enter a **contact record ID**. Search uses HubSpot's contact list; if you only have an email, find the contact here or via **Search CRM Objects** first.",
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
          "name": "noteBody",
          "type": "string",
          "label": "Note Body",
          "description": "Plain text of the note. Stored in HubSpot as property `hs_note_body`.",
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
      "app": "hubspot",
      "componentKey": "hubspot-add-note-to-contact",
      "componentName": "Add Note to Contact"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_batch_create_companies",
    "description": "Create a batch of companies in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fcreate)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inputs": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Inputs (Companies)",
          "description": "Provide a **list of companies** to be created. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fcreate) for more information. Example: `[ { \"properties\": { \"name\": \"CompanyName\"} } ]`"
        }
      },
      "required": [
        "inputs"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-batch-create-companies",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "inputs",
          "type": "string[]",
          "label": "Inputs (Companies)",
          "description": "Provide a **list of companies** to be created. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fcreate) for more information. Example: `[ { \"properties\": { \"name\": \"CompanyName\"} } ]`",
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
      "app": "hubspot",
      "componentKey": "hubspot-batch-create-companies",
      "componentName": "Batch Create Companies"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_batch_create_or_update_contact",
    "description": "Create or update a batch of contacts by its ID or email. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "contacts": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Contacts Array",
          "description": "Provide a **list of contacts** to be created or updated. If the provided contact has the prop ID or if the provided email already exists, this action will attempt to update it.\n\n**Expected format for create:** `{ \"company\": \"Biglytics\", \"email\": \"bcooper@biglytics.net\", \"firstname\": \"Bryan\", \"lastname\": \"Cooper\", \"phone\": \"(877) 929-0687\", \"website\": \"biglytics.net\" }` \n\n**Expected format for update:** `{ \"id\": \"101\", \"company\": \"Biglytics\", \"email\": \"bcooper@biglytics.net\", \"firstname\": \"Bryan\", \"lastname\": \"Cooper\", \"phone\": \"(877) 929-0687\", \"website\": \"biglytics.net\" }`"
        }
      },
      "required": [
        "contacts"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-batch-create-or-update-contact",
      "version": "0.0.28",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "contacts",
          "type": "string[]",
          "label": "Contacts Array",
          "description": "Provide a **list of contacts** to be created or updated. If the provided contact has the prop ID or if the provided email already exists, this action will attempt to update it.\n\n**Expected format for create:** `{ \"company\": \"Biglytics\", \"email\": \"bcooper@biglytics.net\", \"firstname\": \"Bryan\", \"lastname\": \"Cooper\", \"phone\": \"(877) 929-0687\", \"website\": \"biglytics.net\" }` \n\n**Expected format for update:** `{ \"id\": \"101\", \"company\": \"Biglytics\", \"email\": \"bcooper@biglytics.net\", \"firstname\": \"Bryan\", \"lastname\": \"Cooper\", \"phone\": \"(877) 929-0687\", \"website\": \"biglytics.net\" }`",
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
      "app": "hubspot",
      "componentKey": "hubspot-batch-create-or-update-contact",
      "componentName": "Batch Create or Update Contact"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_batch_update_companies",
    "description": "Update a batch of companies in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupdate)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inputs": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Inputs (Companies)",
          "description": "Provide a **list of companies** to be updated. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupdate) for more information. Example: `[ { \"id\": \"123\", \"properties\": { \"name\": \"CompanyName\"} } ]`"
        }
      },
      "required": [
        "inputs"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-batch-update-companies",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "inputs",
          "type": "string[]",
          "label": "Inputs (Companies)",
          "description": "Provide a **list of companies** to be updated. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupdate) for more information. Example: `[ { \"id\": \"123\", \"properties\": { \"name\": \"CompanyName\"} } ]`",
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
      "app": "hubspot",
      "componentKey": "hubspot-batch-update-companies",
      "componentName": "Batch Update Companies"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_batch_upsert_companies",
    "description": "Upsert a batch of companies in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupsert)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inputs": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Inputs (Companies)",
          "description": "Provide a **list of companies** to be upserted. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupsert) for more information. Example: `[ { \"idProperty\": \"unique_property\", \"id\": \"123\", \"properties\": { \"name\": \"CompanyName\" } } ]`"
        }
      },
      "required": [
        "inputs"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-batch-upsert-companies",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "infoAlert",
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
          "name": "inputs",
          "type": "string[]",
          "label": "Inputs (Companies)",
          "description": "Provide a **list of companies** to be upserted. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupsert) for more information. Example: `[ { \"idProperty\": \"unique_property\", \"id\": \"123\", \"properties\": { \"name\": \"CompanyName\" } } ]`",
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
      "app": "hubspot",
      "componentKey": "hubspot-batch-upsert-companies",
      "componentName": "Batch Upsert Companies"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_clone_email",
    "description": "Clone a marketing email in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2Fclone)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "emailId": {
          "type": "string",
          "title": "Marketing Email ID",
          "description": "The ID of the marketing email to clone."
        },
        "cloneName": {
          "type": "string",
          "title": "Clone Name",
          "description": "The name to assign to the cloned email"
        },
        "language": {
          "type": "string",
          "title": "Language",
          "description": "The language code for the cloned email"
        }
      },
      "required": [
        "emailId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-clone-email",
      "version": "0.0.12",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "emailId",
          "type": "string",
          "label": "Marketing Email ID",
          "description": "The ID of the marketing email to clone.",
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
          "name": "cloneName",
          "type": "string",
          "label": "Clone Name",
          "description": "The name to assign to the cloned email",
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
          "name": "language",
          "type": "string",
          "label": "Language",
          "description": "The language code for the cloned email",
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
      "app": "hubspot",
      "componentKey": "hubspot-clone-email",
      "componentName": "Clone Marketing Email"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_clone_site_page",
    "description": "Clone a site page in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#post-%2Fcms%2Fv3%2Fpages%2Fsite-pages%2Fclone)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Page ID",
          "description": "The ID of the page to clone."
        },
        "cloneName": {
          "type": "string",
          "title": "Clone Name",
          "description": "The name of the cloned page."
        }
      },
      "required": [
        "pageId",
        "cloneName"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-clone-site-page",
      "version": "0.0.12",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The ID of the page to clone.",
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
          "name": "cloneName",
          "type": "string",
          "label": "Clone Name",
          "description": "The name of the cloned page.",
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
      "app": "hubspot",
      "componentKey": "hubspot-clone-site-page",
      "componentName": "Clone Site Page"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_association",
    "description": "Create Association via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fromObjectType": {
          "type": "string",
          "title": "From Object Type",
          "description": "The object type of the record you're associating from."
        },
        "fromObjectId": {
          "type": "string",
          "title": "From Object ID",
          "description": "The ID of the record you're associating from."
        },
        "toObjectType": {
          "type": "string",
          "title": "To Object Type",
          "description": "The object type of the record you're associating to."
        },
        "toObjectId": {
          "type": "string",
          "title": "To Object ID",
          "description": "The ID of the record you're associating to."
        },
        "associationTypeId": {
          "type": "number",
          "title": "Association Type ID",
          "description": "\"The numeric ID for the association type.\"\n        + \" Common types: contact→company (1), company→contact (2),\"\n        + \" deal→contact (3), contact→deal (4),\"\n        + \" deal→company (5), company→deal (6),\"\n        + \" ticket→contact (15), contact→ticket (16),\"\n        + \" ticket→company (26), company→ticket (25).\"\n        + \" For custom association types, use the HubSpot API to list available types.\""
        },
        "associationCategory": {
          "type": "string",
          "title": "Association Category",
          "description": "The category of the association.",
          "enum": [
            "HUBSPOT_DEFINED",
            "USER_DEFINED",
            "INTEGRATOR_DEFINED"
          ]
        }
      },
      "required": [
        "fromObjectType",
        "fromObjectId",
        "toObjectType",
        "toObjectId",
        "associationTypeId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-association",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "fromObjectType",
          "type": "string",
          "label": "From Object Type",
          "description": "The object type of the record you're associating from.",
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
          "name": "fromObjectId",
          "type": "string",
          "label": "From Object ID",
          "description": "The ID of the record you're associating from.",
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
          "name": "toObjectType",
          "type": "string",
          "label": "To Object Type",
          "description": "The object type of the record you're associating to.",
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
          "name": "toObjectId",
          "type": "string",
          "label": "To Object ID",
          "description": "The ID of the record you're associating to.",
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
          "name": "associationTypeId",
          "type": "integer",
          "label": "Association Type ID",
          "description": "\"The numeric ID for the association type.\"\n        + \" Common types: contact→company (1), company→contact (2),\"\n        + \" deal→contact (3), contact→deal (4),\"\n        + \" deal→company (5), company→deal (6),\"\n        + \" ticket→contact (15), contact→ticket (16),\"\n        + \" ticket→company (26), company→ticket (25).\"\n        + \" For custom association types, use the HubSpot API to list available types.\"",
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
          "name": "associationCategory",
          "type": "string",
          "label": "Association Category",
          "description": "The category of the association.",
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
              "label": "HubSpot Defined",
              "value": "HUBSPOT_DEFINED"
            },
            {
              "label": "User Defined",
              "value": "USER_DEFINED"
            },
            {
              "label": "Integrator Defined",
              "value": "INTEGRATOR_DEFINED"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "hubspot",
      "componentKey": "hubspot-create-association",
      "componentName": "Create Association"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_associations",
    "description": "Create associations between objects. [See the documentation](https://developers.hubspot.com/docs/api/crm/associations#endpoint?spec=POST-/crm/v3/associations/{fromObjectType}/{toObjectType}/batch/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fromObjectType": {
          "type": "string",
          "title": "From Object Type",
          "description": "The type of the object being associated"
        },
        "fromObjectId": {
          "type": "string",
          "title": "From Object",
          "description": "The ID of the object being associated"
        },
        "toObjectType": {
          "type": "string",
          "title": "To Object Type",
          "description": "Type of the objects the from object is being associated with"
        },
        "associationType": {
          "type": "number",
          "title": "Association Type",
          "description": "Type of the association"
        },
        "toObjectIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "To Objects",
          "description": "Id's of the objects the from object is being associated with"
        }
      },
      "required": [
        "fromObjectType",
        "fromObjectId",
        "toObjectType",
        "associationType",
        "toObjectIds"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-associations",
      "version": "1.0.17",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "fromObjectType",
          "type": "string",
          "label": "From Object Type",
          "description": "The type of the object being associated",
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
          "name": "fromObjectId",
          "type": "string",
          "label": "From Object",
          "description": "The ID of the object being associated",
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
          "name": "toObjectType",
          "type": "string",
          "label": "To Object Type",
          "description": "Type of the objects the from object is being associated with",
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
          "name": "associationType",
          "type": "integer",
          "label": "Association Type",
          "description": "Type of the association",
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
          "name": "toObjectIds",
          "type": "string[]",
          "label": "To Objects",
          "description": "Id's of the objects the from object is being associated with",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-associations",
      "componentName": "Create Associations"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_blog_post",
    "description": "Creates a new blog post in HubSpot. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/post-cms-v3-blogs-posts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The internal name of the blog post"
        },
        "__kind": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "name",
        "__kind",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-blog-post",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The internal name of the blog post",
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
          "name": "__kind",
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
        },
        {
          "name": "text",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-blog-post",
      "componentName": "Create Blog Post"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_communication",
    "description": "Create a WhatsApp, LinkedIn, or SMS message. [See the documentation](https://developers.hubspot.com/beta-docs/reference/api/crm/engagements/communications/v3#post-%2Fcrm%2Fv3%2Fobjects%2Fcommunications)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "toObjectType": {
          "type": "string",
          "title": "Associated Object Type",
          "description": "Type of object the communication is being associated with"
        },
        "toObjectId": {
          "type": "string",
          "title": "Associated Object",
          "description": "ID of object the communication is being associated with"
        },
        "associationType": {
          "type": "number",
          "title": "Association Type",
          "description": "A unique identifier to indicate the association type between the communication and the other object"
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the `communication` properties as a JSON object"
        }
      },
      "required": [
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-communication",
      "version": "0.0.24",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "toObjectType",
          "type": "string",
          "label": "Associated Object Type",
          "description": "Type of object the communication is being associated with",
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
          "name": "toObjectId",
          "type": "string",
          "label": "Associated Object",
          "description": "ID of object the communication is being associated with",
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
          "name": "associationType",
          "type": "integer",
          "label": "Association Type",
          "description": "A unique identifier to indicate the association type between the communication and the other object",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the `communication` properties as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-communication",
      "componentName": "Create Communication"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_company",
    "description": "Create a company in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies#endpoint?spec=POST-/crm/v3/objects/companies)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-company",
      "version": "0.0.36",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "hubspot",
      "componentKey": "hubspot-create-company",
      "componentName": "Create Company"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_contact_workflow",
    "description": "Create a contact workflow in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/automation/create-manage-workflows#post-%2Fautomation%2Fv4%2Fflows)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "canEnrollFromSalesforce": {
          "type": "boolean",
          "title": "Can Enroll From Salesforce",
          "description": "Whether the contact workflow can enroll from Salesforce"
        },
        "isEnabled": {
          "type": "boolean",
          "title": "Is Enabled",
          "description": "Whether the contact workflow is enabled"
        },
        "flowType": {
          "type": "string",
          "title": "Flow Type",
          "description": "The type of flow"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the contact workflow"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The description of the contact workflow"
        },
        "uuid": {
          "type": "string",
          "title": "UUID",
          "description": "The UUID of the contact workflow"
        },
        "startAction": {
          "type": "string",
          "title": "Start Action",
          "description": "The start action of the contact workflow"
        },
        "actions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Actions",
          "description": "The actions of the contact workflow"
        },
        "enrollmentCriteria": {
          "type": "object",
          "title": "Enrollment Criteria",
          "description": "An object with the enrollment criteria data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/enrollment-criteria-in-contact-workflows) for more information."
        },
        "enrollmentSchedule": {
          "type": "object",
          "title": "Enrollment Schedule",
          "description": "An object with the enrollment schedule data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/enrollment-schedule-in-contact-workflows) for more information."
        },
        "timeWindows": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Time Windows",
          "description": "A list of time windows for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/time-windows-in-contact-workflows) for more information."
        },
        "blockedDates": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Blocked Dates",
          "description": "A list of blocked dates for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/blocked-dates-in-contact-workflows) for more information."
        },
        "customProperties": {
          "type": "object",
          "title": "Custom Properties",
          "description": "An object with the custom properties data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/custom-properties-in-contact-workflows) for more information."
        },
        "dataSources": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Data Sources",
          "description": "A list of data sources for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/data-sources-in-contact-workflows) for more information."
        },
        "suppressionListIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Suppression List IDs",
          "description": "A list of suppression list IDs for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/suppression-list-ids-in-contact-workflows) for more information."
        },
        "goalFilterBranch": {
          "type": "object",
          "title": "Goal Filter Branch",
          "description": "An object with the goal filter branch data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/goal-filter-branch-in-contact-workflows) for more information."
        },
        "eventAnchor": {
          "type": "object",
          "title": "Event Anchor",
          "description": "An object with the event anchor data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/event-anchor-in-contact-workflows) for more information."
        },
        "unEnrollmentSetting": {
          "type": "object",
          "title": "Un Enrollment Setting",
          "description": "An object with the un enrollment setting data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/un-enrollment-setting-in-contact-workflows) for more information."
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-contact-workflow",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "canEnrollFromSalesforce",
          "type": "boolean",
          "label": "Can Enroll From Salesforce",
          "description": "Whether the contact workflow can enroll from Salesforce",
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
          "name": "isEnabled",
          "type": "boolean",
          "label": "Is Enabled",
          "description": "Whether the contact workflow is enabled",
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
          "name": "flowType",
          "type": "string",
          "label": "Flow Type",
          "description": "The type of flow",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the contact workflow",
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
          "description": "The description of the contact workflow",
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
          "name": "uuid",
          "type": "string",
          "label": "UUID",
          "description": "The UUID of the contact workflow",
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
          "name": "startAction",
          "type": "string",
          "label": "Start Action",
          "description": "The start action of the contact workflow",
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
          "name": "actions",
          "type": "string[]",
          "label": "Actions",
          "description": "The actions of the contact workflow",
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
          "name": "enrollmentCriteria",
          "type": "object",
          "label": "Enrollment Criteria",
          "description": "An object with the enrollment criteria data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/enrollment-criteria-in-contact-workflows) for more information.",
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
          "name": "enrollmentSchedule",
          "type": "object",
          "label": "Enrollment Schedule",
          "description": "An object with the enrollment schedule data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/enrollment-schedule-in-contact-workflows) for more information.",
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
          "name": "timeWindows",
          "type": "string[]",
          "label": "Time Windows",
          "description": "A list of time windows for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/time-windows-in-contact-workflows) for more information.",
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
          "name": "blockedDates",
          "type": "string[]",
          "label": "Blocked Dates",
          "description": "A list of blocked dates for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/blocked-dates-in-contact-workflows) for more information.",
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
          "name": "customProperties",
          "type": "object",
          "label": "Custom Properties",
          "description": "An object with the custom properties data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/custom-properties-in-contact-workflows) for more information.",
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
          "name": "dataSources",
          "type": "string[]",
          "label": "Data Sources",
          "description": "A list of data sources for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/data-sources-in-contact-workflows) for more information.",
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
          "name": "suppressionListIds",
          "type": "string[]",
          "label": "Suppression List IDs",
          "description": "A list of suppression list IDs for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/suppression-list-ids-in-contact-workflows) for more information.",
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
          "name": "goalFilterBranch",
          "type": "object",
          "label": "Goal Filter Branch",
          "description": "An object with the goal filter branch data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/goal-filter-branch-in-contact-workflows) for more information.",
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
          "name": "eventAnchor",
          "type": "object",
          "label": "Event Anchor",
          "description": "An object with the event anchor data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/event-anchor-in-contact-workflows) for more information.",
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
          "name": "unEnrollmentSetting",
          "type": "object",
          "label": "Un Enrollment Setting",
          "description": "An object with the un enrollment setting data for the contact workflow. [See the documentation](https://developers.hubspot.com/changelog/un-enrollment-setting-in-contact-workflows) for more information.",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-contact-workflow",
      "componentName": "Create Contact Workflow"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_crm_object",
    "description": "Create CRM Object via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The type of CRM object to create."
        },
        "properties": {
          "type": "string",
          "title": "Properties",
          "description": "\"JSON object of property name-value pairs for the new record.\"\n        + \" Example for a contact: `{\\\"firstname\\\": \\\"Jane\\\", \\\"lastname\\\": \\\"Doe\\\", \\\"email\\\": \\\"jane@example.com\\\"}`.\"\n        + \" Example for a deal: `{\\\"dealname\\\": \\\"Acme Contract\\\", \\\"amount\\\": \\\"50000\\\", \\\"pipeline\\\": \\\"default\\\", \\\"dealstage\\\": \\\"contractsent\\\"}`.\"\n        + \" All values must be strings. Use **Search Properties** and **Get Properties** to discover valid field names and values.\""
        },
        "associations": {
          "type": "string",
          "title": "Associations",
          "description": "\"Optional JSON array of associations to create alongside the new record.\"\n        + \" Each entry has `to` (object ID to associate with) and `types` (array of association type objects).\"\n        + \" Example: `[{\\\"to\\\": {\\\"id\\\": \\\"123\\\"}, \\\"types\\\": [{\\\"associationCategory\\\": \\\"HUBSPOT_DEFINED\\\", \\\"associationTypeId\\\": 1}]}]`.\"\n        + \" Use **Create Association** for more control over associations after creation.\""
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-crm-object",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The type of CRM object to create.",
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
          "type": "string",
          "label": "Properties",
          "description": "\"JSON object of property name-value pairs for the new record.\"\n        + \" Example for a contact: `{\\\"firstname\\\": \\\"Jane\\\", \\\"lastname\\\": \\\"Doe\\\", \\\"email\\\": \\\"jane@example.com\\\"}`.\"\n        + \" Example for a deal: `{\\\"dealname\\\": \\\"Acme Contract\\\", \\\"amount\\\": \\\"50000\\\", \\\"pipeline\\\": \\\"default\\\", \\\"dealstage\\\": \\\"contractsent\\\"}`.\"\n        + \" All values must be strings. Use **Search Properties** and **Get Properties** to discover valid field names and values.\"",
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
          "name": "associations",
          "type": "string",
          "label": "Associations",
          "description": "\"Optional JSON array of associations to create alongside the new record.\"\n        + \" Each entry has `to` (object ID to associate with) and `types` (array of association type objects).\"\n        + \" Example: `[{\\\"to\\\": {\\\"id\\\": \\\"123\\\"}, \\\"types\\\": [{\\\"associationCategory\\\": \\\"HUBSPOT_DEFINED\\\", \\\"associationTypeId\\\": 1}]}]`.\"\n        + \" Use **Create Association** for more control over associations after creation.\"",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-crm-object",
      "componentName": "Create CRM Object"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_custom_object",
    "description": "Create a new custom object in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/custom-objects#create-a-custom-object)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "hubspot": {
          "type": "string"
        },
        "customObjectType": {
          "type": "string"
        },
        "__kind": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "hubspot",
        "customObjectType",
        "__kind",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-custom-object",
      "version": "1.0.18",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
        },
        {
          "name": "customObjectType",
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
        },
        {
          "name": "__kind",
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
        },
        {
          "name": "name",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-custom-object",
      "componentName": "Create Custom Object"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_deal",
    "description": "Create a deal in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/deals#endpoint?spec=POST-/crm/v3/objects/deals)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to create as a JSON object"
        },
        "dealname": {
          "type": "string",
          "title": "Deal Name",
          "description": "Name of the deal"
        },
        "pipeline": {
          "type": "string",
          "title": "Pipeline",
          "description": "Pipeline of the deal"
        },
        "dealstage": {
          "type": "string",
          "title": "Stages",
          "description": "Stage of the deal"
        }
      },
      "required": [
        "objectProperties",
        "dealname",
        "pipeline",
        "dealstage"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-deal",
      "version": "0.0.36",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to create as a JSON object",
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
          "name": "dealname",
          "type": "string",
          "label": "Deal Name",
          "description": "Name of the deal",
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
          "name": "pipeline",
          "type": "string",
          "label": "Pipeline",
          "description": "Pipeline of the deal",
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
          "name": "dealstage",
          "type": "string",
          "label": "Stages",
          "description": "Stage of the deal",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-deal",
      "componentName": "Create Deal"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_email",
    "description": "Create a marketing email in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the email"
        },
        "campaign": {
          "type": "string",
          "title": "Campaign ID",
          "description": "The ID of the campaign to create the email in."
        },
        "customReplyTo": {
          "type": "string",
          "title": "Custom Reply To",
          "description": "The custom reply to address for the email"
        },
        "fromName": {
          "type": "string",
          "title": "From Name",
          "description": "The name of the sender"
        },
        "replyTo": {
          "type": "string",
          "title": "Reply To",
          "description": "The reply to address for the email"
        },
        "limitSendFrequency": {
          "type": "boolean",
          "title": "Limit Send Frequency",
          "description": "Whether to limit the send frequency for the email"
        },
        "suppressGraymail": {
          "type": "boolean",
          "title": "Suppress Graymail",
          "description": "Whether to suppress graymail for the email"
        },
        "includeContactLists": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Include Contact Lists",
          "description": "The contact lists to include"
        },
        "excludeContactLists": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Exclude Contact Lists",
          "description": "The contact lists to exclude"
        },
        "feedbackSurveyId": {
          "type": "string",
          "title": "Feedback Survey ID",
          "description": "Hubspot's internal ID for the feedback survey. From the Hubspot UI, go to Service -> Feedback Surveys and the ID will be in the URL."
        },
        "rssData": {
          "type": "object",
          "title": "RSS Data",
          "description": "An object with the RSS data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information."
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "The subject of the email"
        },
        "testing": {
          "type": "object",
          "title": "Testing",
          "description": "An object with the testing data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information."
        },
        "language": {
          "type": "string",
          "title": "Language",
          "description": "The language of the email"
        },
        "content": {
          "type": "object",
          "title": "Content",
          "description": "An object with the content data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information."
        },
        "webversion": {
          "type": "object",
          "title": "Webversion",
          "description": "An object with the webversion data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information."
        },
        "subscriptionDetails": {
          "type": "object",
          "title": "Subscription Details",
          "description": "An object with the subscription details for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information."
        },
        "sendOnPublish": {
          "type": "boolean",
          "title": "Send On Publish",
          "description": "Whether to send the email on publish"
        }
      },
      "required": [
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-email",
      "version": "0.0.12",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The name of the email",
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
          "name": "campaign",
          "type": "string",
          "label": "Campaign ID",
          "description": "The ID of the campaign to create the email in.",
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
          "name": "customReplyTo",
          "type": "string",
          "label": "Custom Reply To",
          "description": "The custom reply to address for the email",
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
          "name": "fromName",
          "type": "string",
          "label": "From Name",
          "description": "The name of the sender",
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
          "name": "replyTo",
          "type": "string",
          "label": "Reply To",
          "description": "The reply to address for the email",
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
          "name": "limitSendFrequency",
          "type": "boolean",
          "label": "Limit Send Frequency",
          "description": "Whether to limit the send frequency for the email",
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
          "name": "suppressGraymail",
          "type": "boolean",
          "label": "Suppress Graymail",
          "description": "Whether to suppress graymail for the email",
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
          "name": "includeContactLists",
          "type": "string[]",
          "label": "Include Contact Lists",
          "description": "The contact lists to include",
          "required": false,
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
          "name": "excludeContactLists",
          "type": "string[]",
          "label": "Exclude Contact Lists",
          "description": "The contact lists to exclude",
          "required": false,
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
          "name": "feedbackSurveyId",
          "type": "string",
          "label": "Feedback Survey ID",
          "description": "Hubspot's internal ID for the feedback survey. From the Hubspot UI, go to Service -> Feedback Surveys and the ID will be in the URL.",
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
          "name": "rssData",
          "type": "object",
          "label": "RSS Data",
          "description": "An object with the RSS data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
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
          "name": "subject",
          "type": "string",
          "label": "Subject",
          "description": "The subject of the email",
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
          "name": "testing",
          "type": "object",
          "label": "Testing",
          "description": "An object with the testing data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
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
          "name": "language",
          "type": "string",
          "label": "Language",
          "description": "The language of the email",
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
          "name": "content",
          "type": "object",
          "label": "Content",
          "description": "An object with the content data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
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
          "name": "webversion",
          "type": "object",
          "label": "Webversion",
          "description": "An object with the webversion data for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
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
          "name": "subscriptionDetails",
          "type": "object",
          "label": "Subscription Details",
          "description": "An object with the subscription details for the email. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#post-%2Fmarketing%2Fv3%2Femails%2F) for more information.",
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
          "name": "sendOnPublish",
          "type": "boolean",
          "label": "Send On Publish",
          "description": "Whether to send the email on publish",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-email",
      "componentName": "Create Marketing Email"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_engagement",
    "description": "Create Engagement via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "engagementType": {
          "type": "string",
          "title": "Engagement Type",
          "description": "\"Set this **before** other engagement fields load (`reloadProps`). \"\n        + \"Value must be exactly: `notes`, `tasks`, `meetings`, `emails`, or `calls`. \"\n        + \"For **note on contact by ID**, use **Add Note to Contact** instead.\""
        },
        "toObjectType": {
          "type": "string",
          "title": "Associated Object Type",
          "description": "Type of object the engagement is being associated with"
        },
        "toObjectId": {
          "type": "string",
          "title": "Associated Object",
          "description": "ID of object the engagement is being associated with"
        },
        "associationType": {
          "type": "number",
          "title": "Association Type",
          "description": "\"Association type ID between this engagement and the other object. \"\n        + \"Use **CONFIGURE_COMPONENT** with `propName` `associationType` after `toObjectType` and `engagementType` are set to load valid options.\""
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the `engagement` properties as a JSON object"
        }
      },
      "required": [
        "engagementType",
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-engagement",
      "version": "0.0.35",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "engagementType"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "engagementType",
          "type": "string",
          "label": "Engagement Type",
          "description": "\"Set this **before** other engagement fields load (`reloadProps`). \"\n        + \"Value must be exactly: `notes`, `tasks`, `meetings`, `emails`, or `calls`. \"\n        + \"For **note on contact by ID**, use **Add Note to Contact** instead.\"",
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
          "name": "toObjectType",
          "type": "string",
          "label": "Associated Object Type",
          "description": "Type of object the engagement is being associated with",
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
          "name": "toObjectId",
          "type": "string",
          "label": "Associated Object",
          "description": "ID of object the engagement is being associated with",
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
          "name": "associationType",
          "type": "integer",
          "label": "Association Type",
          "description": "\"Association type ID between this engagement and the other object. \"\n        + \"Use **CONFIGURE_COMPONENT** with `propName` `associationType` after `toObjectType` and `engagementType` are set to load valid options.\"",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the `engagement` properties as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-engagement",
      "componentName": "Create Engagement"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_form",
    "description": "Create a form in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the form."
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Whether the form is archived."
        },
        "fieldGroups": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Field Groups",
          "description": "A list for objects of group type and fields. **Format: `[{ \"groupType\": \"default_group\", \"richTextType\": \"text\", \"fields\": [ { \"objectTypeId\": \"0-1\", \"name\": \"email\", \"label\": \"Email\", \"required\": true, \"hidden\": false, \"fieldType\": \"email\", \"validation\": { \"blockedEmailDomains\": [], \"useDefaultBlockList\": false }}]}]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information."
        },
        "createNewContactForNewEmail": {
          "type": "boolean",
          "title": "Create New Contact for New Email",
          "description": "Whether to create a new contact when a form is submitted with an email address that doesn't match any in your existing contacts records."
        },
        "editable": {
          "type": "boolean",
          "title": "Editable",
          "description": "Whether the form can be edited."
        },
        "allowLinkToResetKnownValues": {
          "type": "boolean",
          "title": "Allow Link to Reset Known Values",
          "description": "Whether to add a reset link to the form. This removes any pre-populated content on the form and creates a new contact on submission."
        },
        "lifecycleStages": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Lifecycle Stages",
          "description": "A list of objects of lifecycle stages. **Format: `[{ \"objectTypeId\": \"0-1\", \"value\": \"subscriber\" }]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information."
        },
        "postSubmitActionType": {
          "type": "string",
          "title": "Post Submit Action Type",
          "description": "The action to take after submit. The default action is displaying a thank you message."
        },
        "postSubmitActionValue": {
          "type": "string",
          "title": "Post Submit Action Value",
          "description": "The thank you text or the page to redirect to."
        },
        "language": {
          "type": "string",
          "title": "Language",
          "description": "The language of the form."
        },
        "prePopulateKnownValues": {
          "type": "boolean",
          "title": "Pre-populate Known Values",
          "description": "Whether contact fields should pre-populate with known information when a contact returns to your site."
        },
        "cloneable": {
          "type": "boolean",
          "title": "Cloneable",
          "description": "Whether the form can be cloned."
        },
        "notifyContactOwner": {
          "type": "boolean",
          "title": "Notify Contact Owner",
          "description": "Whether to send a notification email to the contact owner when a submission is received."
        },
        "recaptchaEnabled": {
          "type": "boolean",
          "title": "Recaptcha Enabled",
          "description": "Whether CAPTCHA (spam prevention) is enabled."
        },
        "archivable": {
          "type": "boolean",
          "title": "Archivable",
          "description": "Whether the form can be archived."
        },
        "notifyRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Contact Email",
          "description": "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field."
        },
        "renderRawHtml": {
          "type": "boolean",
          "title": "Render Raw HTML",
          "description": "Whether the form will render as raw HTML as opposed to inside an iFrame."
        },
        "cssClass": {
          "type": "string",
          "title": "CSS Class",
          "description": "The CSS class of the form."
        },
        "theme": {
          "type": "string",
          "title": "Theme",
          "description": "The theme used for styling the input fields. This will not apply if the form is added to a HubSpot CMS page."
        },
        "submitButtonText": {
          "type": "string",
          "title": "Submit Button Text",
          "description": "The text displayed on the form submit button."
        },
        "labelTextSize": {
          "type": "string",
          "title": "Label Text Size",
          "description": "The size of the label text."
        },
        "legalConsentTextColor": {
          "type": "string",
          "title": "Legal Consent Text Color",
          "description": "The color of the legal consent text."
        },
        "fontFamily": {
          "type": "string",
          "title": "Font Family",
          "description": "The font family of the form."
        },
        "legalConsentTextSize": {
          "type": "string",
          "title": "Legal Consent Text Size",
          "description": "The size of the legal consent text."
        },
        "backgroundWidth": {
          "type": "string",
          "title": "Background Width",
          "description": "The width of the background."
        },
        "helpTextSize": {
          "type": "string",
          "title": "Help Text Size",
          "description": "The size of the help text."
        },
        "submitFontColor": {
          "type": "string",
          "title": "Submit Font Color",
          "description": "The color of the submit font."
        },
        "labelTextColor": {
          "type": "string",
          "title": "Label Text Color",
          "description": "The color of the label text."
        },
        "submitAlignment": {
          "type": "string",
          "title": "Submit Alignment",
          "description": "The alignment of the submit button."
        },
        "submitSize": {
          "type": "string",
          "title": "Submit Size",
          "description": "The size of the submit button."
        },
        "helpTextColor": {
          "type": "string",
          "title": "Help Text Color",
          "description": "The color of the help text."
        },
        "submitColor": {
          "type": "string",
          "title": "Submit Color",
          "description": "The color of the submit button."
        },
        "legalConsentOptionsType": {
          "type": "string",
          "title": "Legal Consent Options Type",
          "description": "The type of legal consent options."
        },
        "legalConsentOptionsObject": {
          "type": "object",
          "title": "Legal Consent Options Object",
          "description": "The object of legal consent options. **Format: `{\"subscriptionTypeIds\": [1,2,3], \"lawfulBasis\": \"lead\", \"privacy\": \"string\"}`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information."
        }
      },
      "required": [
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-form",
      "version": "0.0.12",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the form.",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Whether the form is archived.",
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
          "name": "fieldGroups",
          "type": "string[]",
          "label": "Field Groups",
          "description": "A list for objects of group type and fields. **Format: `[{ \"groupType\": \"default_group\", \"richTextType\": \"text\", \"fields\": [ { \"objectTypeId\": \"0-1\", \"name\": \"email\", \"label\": \"Email\", \"required\": true, \"hidden\": false, \"fieldType\": \"email\", \"validation\": { \"blockedEmailDomains\": [], \"useDefaultBlockList\": false }}]}]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
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
          "name": "createNewContactForNewEmail",
          "type": "boolean",
          "label": "Create New Contact for New Email",
          "description": "Whether to create a new contact when a form is submitted with an email address that doesn't match any in your existing contacts records.",
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
          "name": "editable",
          "type": "boolean",
          "label": "Editable",
          "description": "Whether the form can be edited.",
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
          "name": "allowLinkToResetKnownValues",
          "type": "boolean",
          "label": "Allow Link to Reset Known Values",
          "description": "Whether to add a reset link to the form. This removes any pre-populated content on the form and creates a new contact on submission.",
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
          "name": "lifecycleStages",
          "type": "string[]",
          "label": "Lifecycle Stages",
          "description": "A list of objects of lifecycle stages. **Format: `[{ \"objectTypeId\": \"0-1\", \"value\": \"subscriber\" }]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
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
          "name": "postSubmitActionType",
          "type": "string",
          "label": "Post Submit Action Type",
          "description": "The action to take after submit. The default action is displaying a thank you message.",
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
          "name": "postSubmitActionValue",
          "type": "string",
          "label": "Post Submit Action Value",
          "description": "The thank you text or the page to redirect to.",
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
          "name": "language",
          "type": "string",
          "label": "Language",
          "description": "The language of the form.",
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
          "name": "prePopulateKnownValues",
          "type": "boolean",
          "label": "Pre-populate Known Values",
          "description": "Whether contact fields should pre-populate with known information when a contact returns to your site.",
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
          "name": "cloneable",
          "type": "boolean",
          "label": "Cloneable",
          "description": "Whether the form can be cloned.",
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
          "name": "notifyContactOwner",
          "type": "boolean",
          "label": "Notify Contact Owner",
          "description": "Whether to send a notification email to the contact owner when a submission is received.",
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
          "name": "recaptchaEnabled",
          "type": "boolean",
          "label": "Recaptcha Enabled",
          "description": "Whether CAPTCHA (spam prevention) is enabled.",
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
          "name": "archivable",
          "type": "boolean",
          "label": "Archivable",
          "description": "Whether the form can be archived.",
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
          "name": "notifyRecipients",
          "type": "string[]",
          "label": "Contact Email",
          "description": "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field.",
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
          "name": "renderRawHtml",
          "type": "boolean",
          "label": "Render Raw HTML",
          "description": "Whether the form will render as raw HTML as opposed to inside an iFrame.",
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
          "name": "cssClass",
          "type": "string",
          "label": "CSS Class",
          "description": "The CSS class of the form.",
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
          "name": "theme",
          "type": "string",
          "label": "Theme",
          "description": "The theme used for styling the input fields. This will not apply if the form is added to a HubSpot CMS page.",
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
          "name": "submitButtonText",
          "type": "string",
          "label": "Submit Button Text",
          "description": "The text displayed on the form submit button.",
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
          "name": "labelTextSize",
          "type": "string",
          "label": "Label Text Size",
          "description": "The size of the label text.",
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
          "name": "legalConsentTextColor",
          "type": "string",
          "label": "Legal Consent Text Color",
          "description": "The color of the legal consent text.",
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
          "name": "fontFamily",
          "type": "string",
          "label": "Font Family",
          "description": "The font family of the form.",
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
          "name": "legalConsentTextSize",
          "type": "string",
          "label": "Legal Consent Text Size",
          "description": "The size of the legal consent text.",
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
          "name": "backgroundWidth",
          "type": "string",
          "label": "Background Width",
          "description": "The width of the background.",
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
          "name": "helpTextSize",
          "type": "string",
          "label": "Help Text Size",
          "description": "The size of the help text.",
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
          "name": "submitFontColor",
          "type": "string",
          "label": "Submit Font Color",
          "description": "The color of the submit font.",
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
          "name": "labelTextColor",
          "type": "string",
          "label": "Label Text Color",
          "description": "The color of the label text.",
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
          "name": "submitAlignment",
          "type": "string",
          "label": "Submit Alignment",
          "description": "The alignment of the submit button.",
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
          "name": "submitSize",
          "type": "string",
          "label": "Submit Size",
          "description": "The size of the submit button.",
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
          "name": "helpTextColor",
          "type": "string",
          "label": "Help Text Color",
          "description": "The color of the help text.",
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
          "name": "submitColor",
          "type": "string",
          "label": "Submit Color",
          "description": "The color of the submit button.",
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
          "name": "legalConsentOptionsType",
          "type": "string",
          "label": "Legal Consent Options Type",
          "description": "The type of legal consent options.",
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
          "name": "legalConsentOptionsObject",
          "type": "object",
          "label": "Legal Consent Options Object",
          "description": "The object of legal consent options. **Format: `{\"subscriptionTypeIds\": [1,2,3], \"lawfulBasis\": \"lead\", \"privacy\": \"string\"}`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-form",
      "componentName": "Create Form"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_landing_page",
    "description": "Create a landing page in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#post-%2Fcms%2Fv3%2Fpages%2Flanding-pages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageName": {
          "type": "string",
          "title": "Page Name",
          "description": "The name of the page."
        },
        "landingFolderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of the folder to create the landing page in."
        },
        "__kind": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "moduleUrl": {
          "type": "string"
        }
      },
      "required": [
        "pageName",
        "__kind",
        "name",
        "moduleUrl"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-landing-page",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "pageName",
          "type": "string",
          "label": "Page Name",
          "description": "The name of the page.",
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
          "name": "landingFolderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of the folder to create the landing page in.",
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
          "name": "__kind",
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
        },
        {
          "name": "name",
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
        },
        {
          "name": "moduleUrl",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-landing-page",
      "componentName": "Create Landing Page"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_lead",
    "description": "Create a lead in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#create-leads)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "hubspot": {
          "type": "string"
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "The contact to associate with the lead"
        },
        "__kind": {
          "type": "string"
        },
        "name": {
          "type": "string"
        }
      },
      "required": [
        "hubspot",
        "contactId",
        "__kind",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-lead",
      "version": "0.0.24",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "The contact to associate with the lead",
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
          "name": "__kind",
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
        },
        {
          "name": "name",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-lead",
      "componentName": "Create Lead"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_meeting",
    "description": "Creates a new meeting with optional associations to other objects. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/engagements/meetings#post-%2Fcrm%2Fv3%2Fobjects%2Fmeetings)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "toObjectType": {
          "type": "string",
          "title": "Associated Object Type",
          "description": "Type of object the meeting is being associated with"
        },
        "toObjectId": {
          "type": "string",
          "title": "Associated Object",
          "description": "ID of object the meeting is being associated with"
        },
        "associationType": {
          "type": "number",
          "title": "Association Type",
          "description": "A unique identifier to indicate the association type between the meeting and the other object"
        },
        "objectProperties": {
          "type": "object",
          "title": "Meeting Properties",
          "description": "Enter the meeting properties as a JSON object. Required properties: hs_meeting_title, hs_meeting_body, hs_meeting_start_time, hs_meeting_end_time. Optional: hs_meeting_status"
        }
      },
      "required": [
        "toObjectType",
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-meeting",
      "version": "0.0.16",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "toObjectType",
          "type": "string",
          "label": "Associated Object Type",
          "description": "Type of object the meeting is being associated with",
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
          "name": "toObjectId",
          "type": "string",
          "label": "Associated Object",
          "description": "ID of object the meeting is being associated with",
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
          "name": "associationType",
          "type": "integer",
          "label": "Association Type",
          "description": "A unique identifier to indicate the association type between the meeting and the other object",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Meeting Properties",
          "description": "Enter the meeting properties as a JSON object. Required properties: hs_meeting_title, hs_meeting_body, hs_meeting_start_time, hs_meeting_end_time. Optional: hs_meeting_status",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-meeting",
      "componentName": "Create Meeting"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_note",
    "description": "Create Note via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "toObjectType": {
          "type": "string",
          "title": "Associated Object Type",
          "description": "Type of CRM object to associate this note with (e.g. contact). Set before `toObjectId` / `associationType`."
        },
        "toObjectId": {
          "type": "string",
          "title": "Associated Object",
          "description": "Record ID to associate. MCP: use **CONFIGURE_COMPONENT** with `propName` `toObjectId` after `toObjectType` is set to load options."
        },
        "associationType": {
          "type": "number",
          "title": "Association Type",
          "description": "Association type ID for note → other object. Required with `toObjectId`. MCP: use **CONFIGURE_COMPONENT** with `propName` `associationType` when options are not known."
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-note",
      "version": "0.0.16",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "toObjectType",
          "type": "string",
          "label": "Associated Object Type",
          "description": "Type of CRM object to associate this note with (e.g. contact). Set before `toObjectId` / `associationType`.",
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
          "name": "toObjectId",
          "type": "string",
          "label": "Associated Object",
          "description": "Record ID to associate. MCP: use **CONFIGURE_COMPONENT** with `propName` `toObjectId` after `toObjectType` is set to load options.",
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
          "name": "associationType",
          "type": "integer",
          "label": "Association Type",
          "description": "Association type ID for note → other object. Required with `toObjectId`. MCP: use **CONFIGURE_COMPONENT** with `propName` `associationType` when options are not known.",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-note",
      "componentName": "Create Note"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_or_update_contact",
    "description": "Create or update a contact in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to create as a JSON object"
        },
        "updateIfExists": {
          "type": "boolean",
          "title": "Update If Exists",
          "description": "When selected, if Hubspot returns an error upon creation the resource should be updated."
        }
      },
      "required": [
        "objectProperties",
        "updateIfExists"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-or-update-contact",
      "version": "0.0.34",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to create as a JSON object",
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
          "name": "updateIfExists",
          "type": "boolean",
          "label": "Update If Exists",
          "description": "When selected, if Hubspot returns an error upon creation the resource should be updated.",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-or-update-contact",
      "componentName": "Create or Update Contact"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_page",
    "description": "Create a page in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#post-%2Fcms%2Fv3%2Fpages%2Fsite-pages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageName": {
          "type": "string",
          "title": "Page Name",
          "description": "The name of the page."
        },
        "__kind": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "moduleUrl": {
          "type": "string"
        }
      },
      "required": [
        "pageName",
        "__kind",
        "name",
        "moduleUrl"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-page",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "pageName",
          "type": "string",
          "label": "Page Name",
          "description": "The name of the page.",
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
          "name": "__kind",
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
        },
        {
          "name": "name",
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
        },
        {
          "name": "moduleUrl",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-page",
      "componentName": "Create Page"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_task",
    "description": "Create a new task. [See the documentation](https://developers.hubspot.com/docs/api/crm/engagements)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "toObjectType": {
          "type": "string",
          "title": "Associated Object Type",
          "description": "Type of object the engagement is being associated with"
        },
        "toObjectId": {
          "type": "string",
          "title": "Associated Object",
          "description": "ID of object the engagement is being associated with"
        },
        "associationType": {
          "type": "number",
          "title": "Association Type",
          "description": "A unique identifier to indicate the association type between the task and the other object"
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the `engagement` properties as a JSON object"
        }
      },
      "required": [
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-task",
      "version": "0.0.16",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "toObjectType",
          "type": "string",
          "label": "Associated Object Type",
          "description": "Type of object the engagement is being associated with",
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
          "name": "toObjectId",
          "type": "string",
          "label": "Associated Object",
          "description": "ID of object the engagement is being associated with",
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
          "name": "associationType",
          "type": "integer",
          "label": "Association Type",
          "description": "A unique identifier to indicate the association type between the task and the other object",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the `engagement` properties as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-task",
      "componentName": "Create Task"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_ticket",
    "description": "Create a ticket in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/tickets)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to create as a JSON object"
        },
        "subject": {
          "type": "string",
          "title": "Ticket Name",
          "description": "The name of the ticket"
        },
        "hs_pipeline": {
          "type": "string",
          "title": "Pipeline",
          "description": "The pipeline of the ticket"
        },
        "hs_pipeline_stage": {
          "type": "string",
          "title": "Ticket Stage",
          "description": "The stage of the ticket"
        }
      },
      "required": [
        "objectProperties",
        "subject",
        "hs_pipeline",
        "hs_pipeline_stage"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-ticket",
      "version": "0.0.27",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
          "required": true,
          "hidden": true,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to create as a JSON object",
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
          "name": "subject",
          "type": "string",
          "label": "Ticket Name",
          "description": "The name of the ticket",
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
          "name": "hs_pipeline",
          "type": "string",
          "label": "Pipeline",
          "description": "The pipeline of the ticket",
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
          "name": "hs_pipeline_stage",
          "type": "string",
          "label": "Ticket Stage",
          "description": "The stage of the ticket",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-ticket",
      "componentName": "Create Ticket"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_create_workflow",
    "description": "Create a new workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/post-automation-v3-workflows)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "title": "Workflow Name",
          "description": "The name of the workflow to create"
        },
        "type": {
          "type": "string",
          "title": "Type",
          "description": "The type of workflow to create",
          "enum": [
            "DRIP_DELAY",
            "STATIC_ANCHOR",
            "PROPERTY_ANCHOR"
          ]
        },
        "actions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Actions",
          "description": "A list of objects representing the workflow actions. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/guide#action-types) for more information."
        }
      },
      "required": [
        "name",
        "type"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-create-workflow",
      "version": "0.0.8",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "name",
          "type": "string",
          "label": "Workflow Name",
          "description": "The name of the workflow to create",
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
          "label": "Type",
          "description": "The type of workflow to create",
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
              "label": "Drip Delay",
              "value": "DRIP_DELAY"
            },
            {
              "label": "Static Anchor",
              "value": "STATIC_ANCHOR"
            },
            {
              "label": "Property Anchor",
              "value": "PROPERTY_ANCHOR"
            }
          ]
        },
        {
          "name": "actions",
          "type": "string[]",
          "label": "Actions",
          "description": "A list of objects representing the workflow actions. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/guide#action-types) for more information.",
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
      "app": "hubspot",
      "componentKey": "hubspot-create-workflow",
      "componentName": "Create a New Workflow"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_delete_workflow",
    "description": "Delete a workflow by ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/delete-automation-v3-workflows-workflowId)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workflowId": {
          "type": "string",
          "title": "Workflow",
          "description": "The ID of the workflow to delete"
        }
      },
      "required": [
        "workflowId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-delete-workflow",
      "version": "0.0.8",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "workflowId",
          "type": "string",
          "label": "Workflow",
          "description": "The ID of the workflow to delete",
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
      "app": "hubspot",
      "componentKey": "hubspot-delete-workflow",
      "componentName": "Delete a Workflow"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_enroll_contact_into_workflow",
    "description": "Add a contact to a workflow. Note: The Workflows API currently only supports contact-based workflows and is only available for Marketing Hub Enterprise accounts. [See the documentation](https://legacydocs.hubspot.com/docs/methods/workflows/add_contact)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workflow": {
          "type": "string",
          "title": "Workflow",
          "description": "The ID of the workflow you wish to see metadata for."
        },
        "contactEmail": {
          "type": "string",
          "title": "Contact Email",
          "description": "`The email of the contact to be added to the list. ${hubspot.propDefinitions.contactEmail.description}`"
        }
      },
      "required": [
        "workflow",
        "contactEmail"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-enroll-contact-into-workflow",
      "version": "0.0.31",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "workflow",
          "type": "string",
          "label": "Workflow",
          "description": "The ID of the workflow you wish to see metadata for.",
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
          "name": "contactEmail",
          "type": "string",
          "label": "Contact Email",
          "description": "`The email of the contact to be added to the list. ${hubspot.propDefinitions.contactEmail.description}`",
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
      "app": "hubspot",
      "componentKey": "hubspot-enroll-contact-into-workflow",
      "componentName": "Enroll Contact Into Workflow"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_associated_emails",
    "description": "Retrieves emails associated with a specific object (contact, company, or deal). [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/search)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Associated Object Type",
          "description": "The type of the object the emails are associated with"
        },
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "The ID of the object to get associated emails for"
        },
        "additionalProperties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Additional Properties",
          "description": "Additional properties to retrieve for the emails"
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "Maximum number of emails to retrieve"
        }
      },
      "required": [
        "objectType",
        "objectId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-associated-emails",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "label": "Associated Object Type",
          "description": "The type of the object the emails are associated with",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "The ID of the object to get associated emails for",
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
          "name": "additionalProperties",
          "type": "string[]",
          "label": "Additional Properties",
          "description": "Additional properties to retrieve for the emails",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "Maximum number of emails to retrieve",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-associated-emails",
      "componentName": "Get Associated Emails"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_associated_meetings",
    "description": "Retrieves meetings associated with a specific object (contact, company, or deal) with optional time filtering. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/associations/association-details#get-%2Fcrm%2Fv4%2Fobjects%2F%7Bobjecttype%7D%2F%7Bobjectid%7D%2Fassociations%2F%7Btoobjecttype%7D)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "From Object Type",
          "description": "The type of the object being associated"
        },
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "The ID of the object to get associated meetings for. For contacts, you can search by email."
        },
        "timeframe": {
          "type": "string",
          "title": "Time Frame",
          "description": "Filter meetings within a specific time frame",
          "enum": [
            "today",
            "this_week",
            "this_month",
            "last_month",
            "custom"
          ]
        },
        "mostRecent": {
          "type": "boolean",
          "title": "Most Recent Only",
          "description": "Only return the most recent meeting"
        },
        "additionalProperties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Additional Properties",
          "description": "Additional properties to retrieve for the meetings"
        }
      },
      "required": [
        "objectType",
        "objectId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-associated-meetings",
      "version": "0.0.16",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "timeframe"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "label": "From Object Type",
          "description": "The type of the object being associated",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "The ID of the object to get associated meetings for. For contacts, you can search by email.",
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
          "name": "timeframe",
          "type": "string",
          "label": "Time Frame",
          "description": "Filter meetings within a specific time frame",
          "required": false,
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
              "label": "Today",
              "value": "today"
            },
            {
              "label": "This Week",
              "value": "this_week"
            },
            {
              "label": "This Month",
              "value": "this_month"
            },
            {
              "label": "Last Month",
              "value": "last_month"
            },
            {
              "label": "Custom Range",
              "value": "custom"
            }
          ]
        },
        {
          "name": "mostRecent",
          "type": "boolean",
          "label": "Most Recent Only",
          "description": "Only return the most recent meeting",
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
          "name": "additionalProperties",
          "type": "string[]",
          "label": "Additional Properties",
          "description": "Additional properties to retrieve for the meetings",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-associated-meetings",
      "componentName": "Get Associated Meetings"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_blog_post_draft",
    "description": "Retrieves the draft version of a blog post. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/get-cms-v3-blogs-posts-objectId-draft)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blogPostId": {
          "type": "string",
          "title": "Blog Post ID",
          "description": "The ID of the blog post"
        }
      },
      "required": [
        "blogPostId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-blog-post-draft",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "blogPostId",
          "type": "string",
          "label": "Blog Post ID",
          "description": "The ID of the blog post",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-blog-post-draft",
      "componentName": "Get Blog Post Draft"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_channel",
    "description": "Retrieves a single channel by its ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-channel/get-conversations-v3-conversations-channels-channelId)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "The ID of a channel"
        }
      },
      "required": [
        "channelId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-channel",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "channelId",
          "type": "string",
          "label": "Channel ID",
          "description": "The ID of a channel",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-channel",
      "componentName": "Get Channel"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_company",
    "description": "Gets a company. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies#endpoint?spec=GET-/crm/v3/objects/companies/{companyId})",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Company ID",
          "description": "Hubspot's internal ID for the company"
        },
        "additionalProperties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Additional properties to retrieve"
        }
      },
      "required": [
        "objectId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-company",
      "version": "0.0.31",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "objectId"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Company ID",
          "description": "Hubspot's internal ID for the company",
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
          "name": "additionalProperties",
          "type": "string[]",
          "label": "Additional properties to retrieve",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-company",
      "componentName": "Get Company"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_contact",
    "description": "Gets a contact. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=GET-/crm/v3/objects/contacts/{contactId})",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Contact ID",
          "description": "Hubspot's internal ID for the contact"
        },
        "additionalProperties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Additional properties to retrieve"
        }
      },
      "required": [
        "objectId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-contact",
      "version": "0.0.31",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "objectId"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Contact ID",
          "description": "Hubspot's internal ID for the contact",
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
          "name": "additionalProperties",
          "type": "string[]",
          "label": "Additional properties to retrieve",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-contact",
      "componentName": "Get Contact"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_crm_objects",
    "description": "Get CRM Objects via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The CRM object type to fetch."
        },
        "objectIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Object IDs",
          "description": "List of object IDs to fetch. Min 1, max 100."
        },
        "properties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Properties",
          "description": "\"Property names to include in results.\"\n        + \" Use **Search Properties** to discover available property names.\"\n        + \" If not specified, returns default properties.\""
        }
      },
      "required": [
        "objectType",
        "objectIds"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-crm-objects",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The CRM object type to fetch.",
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
          "name": "objectIds",
          "type": "string[]",
          "label": "Object IDs",
          "description": "List of object IDs to fetch. Min 1, max 100.",
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
          "type": "string[]",
          "label": "Properties",
          "description": "\"Property names to include in results.\"\n        + \" Use **Search Properties** to discover available property names.\"\n        + \" If not specified, returns default properties.\"",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-crm-objects",
      "componentName": "Get CRM Objects"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_deal",
    "description": "Gets a deal. [See the documentation](https://developers.hubspot.com/docs/api/crm/deals#endpoint?spec=GET-/crm/v3/objects/deals/{dealId})",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Deal ID",
          "description": "Hubspot's internal ID for the deal"
        },
        "additionalProperties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Additional properties to retrieve"
        }
      },
      "required": [
        "objectId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-deal",
      "version": "0.0.31",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "objectId"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Deal ID",
          "description": "Hubspot's internal ID for the deal",
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
          "name": "additionalProperties",
          "type": "string[]",
          "label": "Additional properties to retrieve",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-deal",
      "componentName": "Get Deal"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_file_public_url",
    "description": "Get a publicly available URL for a file that was uploaded using a Hubspot form. [See the documentation](https://developers.hubspot.com/docs/api/files/files#endpoint?spec=GET-/files/v3/files/{fileId}/signed-url)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fileUrl": {
          "type": "string",
          "title": "File URL",
          "description": "The URL returned after a file has been uploaded to a HubSpot Form"
        },
        "expirationSeconds": {
          "type": "number",
          "title": "Public URL Expiration (seconds)",
          "description": "The number of seconds the returned public URL will be accessible for. Default is 1 hour (3600 seconds). Maximum is 6 hours (21600 seconds)."
        }
      },
      "required": [
        "fileUrl"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-file-public-url",
      "version": "0.0.31",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "fileUrl",
          "type": "string",
          "label": "File URL",
          "description": "The URL returned after a file has been uploaded to a HubSpot Form",
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
          "name": "expirationSeconds",
          "type": "integer",
          "label": "Public URL Expiration (seconds)",
          "description": "The number of seconds the returned public URL will be accessible for. Default is 1 hour (3600 seconds). Maximum is 6 hours (21600 seconds).",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-file-public-url",
      "componentName": "Get File Public URL"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_inbox",
    "description": "Retrieves a single inbox by its ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-inbox/get-conversations-v3-conversations-inboxes-inboxId)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inboxId": {
          "type": "string",
          "title": "Inbox ID",
          "description": "The ID of an inbox"
        }
      },
      "required": [
        "inboxId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-inbox",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "inboxId",
          "type": "string",
          "label": "Inbox ID",
          "description": "The ID of an inbox",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-inbox",
      "componentName": "Get Inbox"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_meeting",
    "description": "Retrieves a specific meeting by its ID. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/engagements/meetings#get-%2Fcrm%2Fv3%2Fobjects%2Fmeetings%2F%7Bmeetingid%7D)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Meeting ID",
          "description": "Hubspot's internal ID for the meeting"
        },
        "additionalProperties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Additional properties to retrieve"
        }
      },
      "required": [
        "objectId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-meeting",
      "version": "0.0.16",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "objectId"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Meeting ID",
          "description": "Hubspot's internal ID for the meeting",
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
          "name": "additionalProperties",
          "type": "string[]",
          "label": "Additional properties to retrieve",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-meeting",
      "componentName": "Get Meeting"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_owner",
    "description": "Get Owner via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ownerId": {
          "type": "string",
          "title": "Owner ID",
          "description": "HubSpot CRM owner ID (use the dropdown or enter an ID manually)"
        }
      },
      "required": [
        "ownerId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-owner",
      "version": "0.0.2",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "ownerId",
          "type": "string",
          "label": "Owner ID",
          "description": "HubSpot CRM owner ID (use the dropdown or enter an ID manually)",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-owner",
      "componentName": "Get Owner"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_properties",
    "description": "Get detailed property definitions for specific properties on a CRM object type. Returns full metadata including data types, enum options with valid values, referenced object types, and read-only status. Use this after **Search Properties** to get valid values for specific fields (e.g. enum options for `dealstage` or `hs_pipeline`). Property details can be large — fetch only the properties you need rather than all of them. [See the documentation](https://developers.hubspot.com/docs/api/crm/properties)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The CRM object type to get property definitions for (e.g. contact, company, deal, ticket)."
        },
        "propertyNames": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Names",
          "description": "The specific property names to retrieve full details for (e.g. `[\"dealstage\", \"pipeline\", \"hubspot_owner_id\"]`). Use **Search Properties** first to discover available property names. If not provided, returns all properties — but this can be very large, so specifying names is recommended."
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-properties",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The CRM object type to get property definitions for (e.g. contact, company, deal, ticket).",
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
          "name": "propertyNames",
          "type": "string[]",
          "label": "Property Names",
          "description": "The specific property names to retrieve full details for (e.g. `[\"dealstage\", \"pipeline\", \"hubspot_owner_id\"]`). Use **Search Properties** first to discover available property names. If not provided, returns all properties — but this can be very large, so specifying names is recommended.",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-properties",
      "componentName": "Get Properties"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_subscription_preferences",
    "description": "Retrieves the subscription preferences for a contact. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/subscriptions#get-%2Fcommunication-preferences%2Fv4%2Fstatuses%2F%7Bsubscriberidstring%7D)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "contactEmail": {
          "type": "string",
          "title": "Contact Email",
          "description": "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field."
        }
      },
      "required": [
        "contactEmail"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-subscription-preferences",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "contactEmail",
          "type": "string",
          "label": "Contact Email",
          "description": "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field.",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-subscription-preferences",
      "componentName": "Get Subscription Preferences"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_get_user_details",
    "description": "Get User Details via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-get-user-details",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
      "app": "hubspot",
      "componentKey": "hubspot-get-user-details",
      "componentName": "Get User Details"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_associated_engagements",
    "description": "List Associated Engagements via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "CRM Object Type",
          "description": "Type of CRM record to load engagements for. Legacy API: typically **company**, **deal**, or **quote**."
        },
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "HubSpot ID of the record. After choosing **CRM Object Type**, pick from the list or enter an ID (for contacts you can search by email)."
        },
        "offset": {
          "type": "number",
          "title": "Offset",
          "description": "Pagination offset from the legacy API (default 0)."
        }
      },
      "required": [
        "objectType",
        "objectId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-associated-engagements",
      "version": "0.0.2",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "label": "CRM Object Type",
          "description": "Type of CRM record to load engagements for. Legacy API: typically **company**, **deal**, or **quote**.",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "HubSpot ID of the record. After choosing **CRM Object Type**, pick from the list or enter an ID (for contacts you can search by email).",
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
          "name": "offset",
          "type": "integer",
          "label": "Offset",
          "description": "Pagination offset from the legacy API (default 0).",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-associated-engagements",
      "componentName": "List Associated Engagements"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_association_labels",
    "description": "List Association Labels via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fromObjectType": {
          "type": "string",
          "title": "From Object Type",
          "description": "First object type in the association pair (directional)."
        },
        "toObjectType": {
          "type": "string",
          "title": "To Object Type",
          "description": "Second object type in the association pair."
        }
      },
      "required": [
        "fromObjectType",
        "toObjectType"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-association-labels",
      "version": "0.0.2",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "fromObjectType",
          "type": "string",
          "label": "From Object Type",
          "description": "First object type in the association pair (directional).",
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
          "name": "toObjectType",
          "type": "string",
          "label": "To Object Type",
          "description": "Second object type in the association pair.",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-association-labels",
      "componentName": "List Association Labels"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_blog_posts",
    "description": "Retrieves a list of blog posts. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/blogs/blog-posts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "createdAt": {
          "type": "string",
          "title": "Created At",
          "description": "Only return Blog Posts created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "createdAfter": {
          "type": "string",
          "title": "Created After",
          "description": "Only return Blog Posts created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "createdBefore": {
          "type": "string",
          "title": "Created Before",
          "description": "Only return Blog Posts created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedAt": {
          "type": "string",
          "title": "Updated At",
          "description": "Only return Blog Posts updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedAfter": {
          "type": "string",
          "title": "Updated After",
          "description": "Only return Blog Posts updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedBefore": {
          "type": "string",
          "title": "Updated Before",
          "description": "Only return Blog Posts updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Specifies whether to return deleted Blog Posts"
        },
        "properties": {
          "type": "string",
          "title": "Properties",
          "description": "A comma-separated list of properties to return in the response"
        },
        "sort": {
          "type": "string",
          "title": "Sort",
          "description": "Sort the results by the specified field"
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-blog-posts",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "createdAt",
          "type": "string",
          "label": "Created At",
          "description": "Only return Blog Posts created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "createdAfter",
          "type": "string",
          "label": "Created After",
          "description": "Only return Blog Posts created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "createdBefore",
          "type": "string",
          "label": "Created Before",
          "description": "Only return Blog Posts created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedAt",
          "type": "string",
          "label": "Updated At",
          "description": "Only return Blog Posts updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedAfter",
          "type": "string",
          "label": "Updated After",
          "description": "Only return Blog Posts updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedBefore",
          "type": "string",
          "label": "Updated Before",
          "description": "Only return Blog Posts updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Specifies whether to return deleted Blog Posts",
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
          "type": "string",
          "label": "Properties",
          "description": "A comma-separated list of properties to return in the response",
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
          "name": "sort",
          "type": "string",
          "label": "Sort",
          "description": "Sort the results by the specified field",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-blog-posts",
      "componentName": "List Blog Posts"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_campaigns",
    "description": "Retrieves a list of campaigns. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/campaigns#get-%2Fmarketing%2Fv3%2Fcampaigns%2F)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sort": {
          "type": "string",
          "title": "Sort",
          "description": "The field by which to sort the results. An optional '-' before the property name can denote descending order"
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-campaigns",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The field by which to sort the results. An optional '-' before the property name can denote descending order",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-campaigns",
      "componentName": "List Campaigns"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_channels",
    "description": "Retrieves a list of channels. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-channel/get-conversations-v3-conversations-channels)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "after": {
          "type": "string",
          "title": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results."
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "The maximum number of results to display per page"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-channels",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "after",
          "type": "string",
          "label": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "The maximum number of results to display per page",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-channels",
      "componentName": "List Channels"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_crm_associations",
    "description": "List CRM Associations via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "fromObjectType": {
          "type": "string",
          "title": "From Object Type",
          "description": "Object type of the record you are listing associations from."
        },
        "fromObjectId": {
          "type": "string",
          "title": "From Object ID",
          "description": "The source record’s HubSpot ID. After choosing **From Object Type**, pick from the list or enter an ID (for contacts you can search by email)."
        },
        "toObjectType": {
          "type": "string",
          "title": "To Object Type",
          "description": "Object type of associated records to return (e.g. contacts linked to this company)."
        }
      },
      "required": [
        "fromObjectType",
        "fromObjectId",
        "toObjectType"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-crm-associations",
      "version": "0.0.2",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "fromObjectType",
          "type": "string",
          "label": "From Object Type",
          "description": "Object type of the record you are listing associations from.",
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
          "name": "fromObjectId",
          "type": "string",
          "label": "From Object ID",
          "description": "The source record’s HubSpot ID. After choosing **From Object Type**, pick from the list or enter an ID (for contacts you can search by email).",
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
          "name": "toObjectType",
          "type": "string",
          "label": "To Object Type",
          "description": "Object type of associated records to return (e.g. contacts linked to this company).",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-crm-associations",
      "componentName": "List CRM Associations"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_forms",
    "description": "Retrieves a list of forms. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#get-%2Fmarketing%2Fv3%2Fforms%2F)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Whether to return only results that have been archived"
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-forms",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Whether to return only results that have been archived",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-forms",
      "componentName": "List Forms"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_inboxes",
    "description": "Retrieves a list of inboxes. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-inbox/get-conversations-v3-conversations-inboxes)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "after": {
          "type": "string",
          "title": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results."
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Whether to include archived inboxes in the response"
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "The maximum number of results to display per page"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-inboxes",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "after",
          "type": "string",
          "label": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Whether to include archived inboxes in the response",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "The maximum number of results to display per page",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-inboxes",
      "componentName": "List Inboxes"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_marketing_emails",
    "description": "Retrieves a list of marketing emails. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/emails/marketing-emails#get-%2Fmarketing%2Fv3%2Femails%2F)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "createdAt": {
          "type": "string",
          "title": "Created At",
          "description": "Only return Marketing Emails created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "createdAfter": {
          "type": "string",
          "title": "Created After",
          "description": "Only return Marketing Emails created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "createdBefore": {
          "type": "string",
          "title": "Created Before",
          "description": "Only return Marketing Emails created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedAt": {
          "type": "string",
          "title": "Updated At",
          "description": "Only return Marketing Emails updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedAfter": {
          "type": "string",
          "title": "Updated After",
          "description": "Only return Marketing Emails updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedBefore": {
          "type": "string",
          "title": "Updated Before",
          "description": "Only return Marketing Emails updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "includeStats": {
          "type": "boolean",
          "title": "Include Stats",
          "description": "Include statistics with emails"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Specifies whether to return deleted Marketing Emails"
        },
        "sort": {
          "type": "string",
          "title": "Sort",
          "description": "Sort the results by the specified field"
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-marketing-emails",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "createdAt",
          "type": "string",
          "label": "Created At",
          "description": "Only return Marketing Emails created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "createdAfter",
          "type": "string",
          "label": "Created After",
          "description": "Only return Marketing Emails created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "createdBefore",
          "type": "string",
          "label": "Created Before",
          "description": "Only return Marketing Emails created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedAt",
          "type": "string",
          "label": "Updated At",
          "description": "Only return Marketing Emails updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedAfter",
          "type": "string",
          "label": "Updated After",
          "description": "Only return Marketing Emails updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedBefore",
          "type": "string",
          "label": "Updated Before",
          "description": "Only return Marketing Emails updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "includeStats",
          "type": "boolean",
          "label": "Include Stats",
          "description": "Include statistics with emails",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Specifies whether to return deleted Marketing Emails",
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
          "name": "sort",
          "type": "string",
          "label": "Sort",
          "description": "Sort the results by the specified field",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-marketing-emails",
      "componentName": "List Marketing Emails"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_marketing_events",
    "description": "Retrieves a list of marketing events. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/marketing-events#get-%2Fmarketing%2Fv3%2Fmarketing-events%2F)",
    "inputSchema": {
      "type": "object",
      "properties": {
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-marketing-events",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-marketing-events",
      "componentName": "List Marketing Events"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_messages",
    "description": "Retrieves a list of messages in a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/get-conversations-v3-conversations-threads-threadId-messages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inboxId": {
          "type": "string",
          "title": "Inbox ID",
          "description": "The ID of an inbox"
        },
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "The ID of a channel"
        },
        "threadId": {
          "type": "string",
          "title": "Thread ID",
          "description": "The ID of a thread"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Whether to return only results that have been archived"
        },
        "after": {
          "type": "string",
          "title": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results."
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "The maximum number of results to display per page"
        },
        "sort": {
          "type": "string",
          "title": "Sort",
          "description": "The sort direction"
        }
      },
      "required": [
        "threadId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-messages",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "inboxId",
          "type": "string",
          "label": "Inbox ID",
          "description": "The ID of an inbox",
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
          "name": "channelId",
          "type": "string",
          "label": "Channel ID",
          "description": "The ID of a channel",
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
          "name": "threadId",
          "type": "string",
          "label": "Thread ID",
          "description": "The ID of a thread",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Whether to return only results that have been archived",
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
          "name": "after",
          "type": "string",
          "label": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "The maximum number of results to display per page",
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
          "name": "sort",
          "type": "string",
          "label": "Sort",
          "description": "The sort direction",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-messages",
      "componentName": "List Messages"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_owners",
    "description": "List owners (users) in the HubSpot account. Returns owner IDs, names, and emails. Use this to discover valid values for the `hubspot_owner_id` property when creating or updating any CRM object (contacts, companies, deals, tickets, etc.). [See the documentation](https://developers.hubspot.com/docs/api/crm/owners)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "email": {
          "type": "string",
          "title": "Email",
          "description": "Filter owners by email address. Returns all owners if not provided."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-owners",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "email",
          "type": "string",
          "label": "Email",
          "description": "Filter owners by email address. Returns all owners if not provided.",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-owners",
      "componentName": "List Owners"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_pages",
    "description": "Retrieves a list of site pages. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "createdAt": {
          "type": "string",
          "title": "Created At",
          "description": "Only return Site Pages created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "createdAfter": {
          "type": "string",
          "title": "Created After",
          "description": "Only return Site Pages created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "createdBefore": {
          "type": "string",
          "title": "Created Before",
          "description": "Only return Site Pages created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedAt": {
          "type": "string",
          "title": "Updated At",
          "description": "Only return Site Pages updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedAfter": {
          "type": "string",
          "title": "Updated After",
          "description": "Only return Site Pages updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "updatedBefore": {
          "type": "string",
          "title": "Updated Before",
          "description": "Only return Site Pages updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ"
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Specifies whether to return deleted Site Pages"
        },
        "sort": {
          "type": "string",
          "title": "Sort",
          "description": "Sort the results by the specified field"
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-pages",
      "version": "0.0.14",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "createdAt",
          "type": "string",
          "label": "Created At",
          "description": "Only return Site Pages created at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "createdAfter",
          "type": "string",
          "label": "Created After",
          "description": "Only return Site Pages created after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "createdBefore",
          "type": "string",
          "label": "Created Before",
          "description": "Only return Site Pages created before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedAt",
          "type": "string",
          "label": "Updated At",
          "description": "Only return Site Pages updated at exactly the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedAfter",
          "type": "string",
          "label": "Updated After",
          "description": "Only return Site Pages updated after the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "updatedBefore",
          "type": "string",
          "label": "Updated Before",
          "description": "Only return Site Pages updated before the specified time. Format: YYYY-MM-DDTHH:MM:SSZ",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Specifies whether to return deleted Site Pages",
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
          "name": "sort",
          "type": "string",
          "label": "Sort",
          "description": "Sort the results by the specified field",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-pages",
      "componentName": "List Pages"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_pipelines_and_stages",
    "description": "List all pipelines and their stages for deals or tickets. Returns pipeline IDs, labels, and each pipeline's ordered stages with stage IDs and labels. Use this to discover valid `pipeline` and `dealstage` / `hs_pipeline_stage` values before creating or updating deals and tickets. [See the documentation](https://developers.hubspot.com/docs/api/crm/pipelines)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The object type to list pipelines for. Only `deal` and `ticket` have pipelines.",
          "enum": [
            "deal",
            "ticket"
          ]
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-pipelines-and-stages",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The object type to list pipelines for. Only `deal` and `ticket` have pipelines.",
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
              "label": "Deals",
              "value": "deal"
            },
            {
              "label": "Tickets",
              "value": "ticket"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "hubspot",
      "componentKey": "hubspot-list-pipelines-and-stages",
      "componentName": "List Pipelines and Stages"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_templates",
    "description": "Retrieves a list of templates. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/templates)",
    "inputSchema": {
      "type": "object",
      "properties": {
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-templates",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-templates",
      "componentName": "List Templates"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_list_threads",
    "description": "Retrieves a list of threads. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-thread/get-conversations-v3-conversations-threads)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "associatedContactId": {
          "type": "string",
          "title": "Associated Contact ID",
          "description": "The ID of the contact to filter threads by"
        },
        "association": {
          "type": "string",
          "title": "Association",
          "description": "You can specify an association type here of TICKET. If this is set the response will included a thread associations object and associated ticket id if present. If there are no associations to a ticket with this conversation, then the thread associations object will not be present on the response."
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Whether to return only results that have been archived"
        },
        "inboxId": {
          "type": "string",
          "title": "Inbox ID",
          "description": "The ID of the conversations inbox you can optionally include to retrieve the associated messages for. This parameter cannot be used in conjunction with the associatedContactId property."
        },
        "property": {
          "type": "string",
          "title": "Property",
          "description": "A specific property to include in the thread response"
        },
        "after": {
          "type": "string",
          "title": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results."
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "The maximum number of results to display per page"
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-list-threads",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "associatedContactId",
          "type": "string",
          "label": "Associated Contact ID",
          "description": "The ID of the contact to filter threads by",
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
          "name": "association",
          "type": "string",
          "label": "Association",
          "description": "You can specify an association type here of TICKET. If this is set the response will included a thread associations object and associated ticket id if present. If there are no associations to a ticket with this conversation, then the thread associations object will not be present on the response.",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Whether to return only results that have been archived",
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
          "name": "inboxId",
          "type": "string",
          "label": "Inbox ID",
          "description": "The ID of the conversations inbox you can optionally include to retrieve the associated messages for. This parameter cannot be used in conjunction with the associatedContactId property.",
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
          "name": "property",
          "type": "string",
          "label": "Property",
          "description": "A specific property to include in the thread response",
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
          "name": "after",
          "type": "string",
          "label": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the paging.next.after JSON property of a paged response containing more results.",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "The maximum number of results to display per page",
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
      "app": "hubspot",
      "componentKey": "hubspot-list-threads",
      "componentName": "List Threads"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_push_blog_post_draft_live",
    "description": "Pushes a blog post draft live, making it the published version. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/post-cms-v3-blogs-posts-objectId-draft-push-live)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blogPostId": {
          "type": "string",
          "title": "Blog Post ID",
          "description": "The ID of the blog post"
        }
      },
      "required": [
        "blogPostId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-push-blog-post-draft-live",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "blogPostId",
          "type": "string",
          "label": "Blog Post ID",
          "description": "The ID of the blog post",
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
      "app": "hubspot",
      "componentKey": "hubspot-push-blog-post-draft-live",
      "componentName": "Push Blog Post Draft Live"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_retrieve_quotes",
    "description": "Retrieve Quotes via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "quoteId": {
          "type": "string",
          "title": "Quote ID",
          "description": "Optional. Pick a quote from the list, search by name/title, or enter a quote ID. Leave empty to list quotes (use **After** / **Limit** for pagination)."
        },
        "after": {
          "type": "string",
          "title": "After (pagination cursor)",
          "description": "Paging cursor from a previous list response (`paging.next.after`). Ignored when **Quote ID** is set."
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "Max quotes per page when listing. Ignored when **Quote ID** is set."
        },
        "properties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Properties",
          "description": "Optional. Select quote properties to include in the response, or leave empty for HubSpot's default set. Options load from your account's quote property schema."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-retrieve-quotes",
      "version": "0.0.2",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "quoteId",
          "type": "string",
          "label": "Quote ID",
          "description": "Optional. Pick a quote from the list, search by name/title, or enter a quote ID. Leave empty to list quotes (use **After** / **Limit** for pagination).",
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
          "name": "after",
          "type": "string",
          "label": "After (pagination cursor)",
          "description": "Paging cursor from a previous list response (`paging.next.after`). Ignored when **Quote ID** is set.",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "Max quotes per page when listing. Ignored when **Quote ID** is set.",
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
          "type": "string[]",
          "label": "Properties",
          "description": "Optional. Select quote properties to include in the response, or leave empty for HubSpot's default set. Options load from your account's quote property schema.",
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
      "app": "hubspot",
      "componentKey": "hubspot-retrieve-quotes",
      "componentName": "Retrieve Quotes"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_retrieve_workflow_details",
    "description": "Retrieve detailed information about a specific workflow. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows-workflowId)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workflowId": {
          "type": "string",
          "title": "Workflow ID",
          "description": "The ID of the workflow you wish to see details for."
        }
      },
      "required": [
        "workflowId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-retrieve-workflow-details",
      "version": "0.0.8",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "workflowId",
          "type": "string",
          "label": "Workflow ID",
          "description": "The ID of the workflow you wish to see details for.",
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
      "app": "hubspot",
      "componentKey": "hubspot-retrieve-workflow-details",
      "componentName": "Retrieve Workflow Details"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_retrieve_workflow_emails",
    "description": "Retrieve emails sent by a workflow by ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/automation-automation-v4-v4/email-campaigns/get-automation-v4-flows-email-campaigns)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "workflowId": {
          "type": "string",
          "title": "Workflow",
          "description": "The ID of the workflow you wish to see metadata for."
        },
        "after": {
          "type": "string",
          "title": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results."
        },
        "before": {
          "type": "string",
          "title": "Before",
          "description": "The paging cursor token of the last successfully read resource will be returned as the `paging.next.before` JSON property of a paged response containing more results."
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "The maximum number of results to display per page."
        }
      },
      "required": [
        "workflowId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-retrieve-workflow-emails",
      "version": "0.0.8",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "workflowId",
          "type": "string",
          "label": "Workflow",
          "description": "The ID of the workflow you wish to see metadata for.",
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
          "name": "after",
          "type": "string",
          "label": "After",
          "description": "The paging cursor token of the last successfully read resource will be returned as the `paging.next.after` JSON property of a paged response containing more results.",
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
          "name": "before",
          "type": "string",
          "label": "Before",
          "description": "The paging cursor token of the last successfully read resource will be returned as the `paging.next.before` JSON property of a paged response containing more results.",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "The maximum number of results to display per page.",
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
      "app": "hubspot",
      "componentKey": "hubspot-retrieve-workflow-emails",
      "componentName": "Retrieve Workflow Emails"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_retrieve_workflows",
    "description": "Retrieve a list of all workflows. [See the documentation](https://developers.hubspot.com/docs/api-reference/legacy/create-manage-workflows-v3/get-automation-v3-workflows)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-retrieve-workflows",
      "version": "0.0.9",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
      "app": "hubspot",
      "componentKey": "hubspot-retrieve-workflows",
      "componentName": "Retrieve Workflows"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_schedule_blog_post",
    "description": "Schedules a blog post to be published at a specified time. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/post-cms-v3-blogs-posts-schedule)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blogPostId": {
          "type": "string",
          "title": "Blog Post ID",
          "description": "The ID of the blog post"
        },
        "publishDate": {
          "type": "string",
          "title": "Publish Date",
          "description": "The date and time to publish the blog post. Format: YYYY-MM-DDTHH:MM:SSZ (e.g., 2024-03-20T14:30:00Z)"
        }
      },
      "required": [
        "blogPostId",
        "publishDate"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-schedule-blog-post",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "blogPostId",
          "type": "string",
          "label": "Blog Post ID",
          "description": "The ID of the blog post",
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
          "name": "publishDate",
          "type": "string",
          "label": "Publish Date",
          "description": "The date and time to publish the blog post. Format: YYYY-MM-DDTHH:MM:SSZ (e.g., 2024-03-20T14:30:00Z)",
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
      "app": "hubspot",
      "componentKey": "hubspot-schedule-blog-post",
      "componentName": "Schedule Blog Post"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_search_crm",
    "description": "Search companies, contacts, deals, feedback submissions, products, tickets, line-items, quotes, leads, or custom objects. [See the documentation](https://developers.hubspot.com/docs/api/crm/search)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "Type of CRM object to search for",
          "enum": [
            "custom_object"
          ]
        },
        "exactMatch": {
          "type": "boolean",
          "title": "Exact Match",
          "description": "Set to `true` to search for an exact match of the search value. If `false`, partial matches will be returned. Default: `true`"
        },
        "createIfNotFound": {
          "type": "boolean",
          "title": "Create if not found?",
          "description": "Set to `true` to create the Hubspot object if it doesn't exist"
        },
        "offset": {
          "type": "number",
          "title": "Offset",
          "description": "The offset to start from. Used for pagination."
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-search-crm",
      "version": "1.1.7",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "objectType",
        "createIfNotFound"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "description": "Type of CRM object to search for",
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
              "label": "Custom Object",
              "value": "custom_object"
            }
          ]
        },
        {
          "name": "exactMatch",
          "type": "boolean",
          "label": "Exact Match",
          "description": "Set to `true` to search for an exact match of the search value. If `false`, partial matches will be returned. Default: `true`",
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
          "name": "createIfNotFound",
          "type": "boolean",
          "label": "Create if not found?",
          "description": "Set to `true` to create the Hubspot object if it doesn't exist",
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
          "name": "offset",
          "type": "integer",
          "label": "Offset",
          "description": "The offset to start from. Used for pagination.",
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
      "app": "hubspot",
      "componentKey": "hubspot-search-crm",
      "componentName": "Search CRM"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_search_crm_objects",
    "description": "Search CRM Objects via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The CRM object type to search."
        },
        "query": {
          "type": "string",
          "title": "Query",
          "description": "\"Text to search across default searchable properties of the object type.\"\n        + \" Uses simple text matching (contains).\"\n        + \" Each object type has different searchable properties:\"\n        + \" contacts (firstname, lastname, email, phone, company),\"\n        + \" companies (name, website, domain, phone),\"\n        + \" deals (dealname, pipeline, dealstage, description, dealtype),\"\n        + \" tickets (subject, content, hs_pipeline_stage, hs_ticket_category, hs_ticket_id).\"\n        + \" Max 200 characters.\""
        },
        "filterGroups": {
          "type": "string",
          "title": "Filter Groups",
          "description": "\"JSON array of filter groups for advanced filtering.\"\n        + \" Each group contains `filters` (AND logic within a group) and groups are OR'd together.\"\n        + \" Each filter has `propertyName`, `operator`, and `value`.\"\n        + \" Operators: EQ, NEQ, LT, LTE, GT, GTE, BETWEEN, IN, NOT_IN, HAS_PROPERTY, NOT_HAS_PROPERTY, CONTAINS_TOKEN, NOT_CONTAINS_TOKEN.\"\n        + \" Example: `[{\\\"filters\\\": [{\\\"propertyName\\\": \\\"lifecyclestage\\\", \\\"operator\\\": \\\"EQ\\\", \\\"value\\\": \\\"lead\\\"}]}]`.\"\n        + \" Max 5 groups, 6 filters per group, 18 total.\""
        },
        "properties": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Properties",
          "description": "\"Property names to include in results.\"\n        + \" If not specified, returns a default set of common properties for the object type.\"\n        + \" Use **Search Properties** to discover available property names.\""
        },
        "sorts": {
          "type": "string",
          "title": "Sorts",
          "description": "\"JSON array of sort rules. Only one sort rule is supported.\"\n        + \" Example: `[{\\\"propertyName\\\": \\\"createdate\\\", \\\"direction\\\": \\\"DESCENDING\\\"}]`.\"\n        + \" Default: sorted by createdate descending.\""
        },
        "limit": {
          "type": "number",
          "title": "Limit",
          "description": "Maximum number of results per page. Max: 200, default: 100."
        },
        "after": {
          "type": "string",
          "title": "After (Pagination Cursor)",
          "description": "Paging cursor from a previous response for retrieving the next page of results."
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-search-crm-objects",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The CRM object type to search.",
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
          "label": "Query",
          "description": "\"Text to search across default searchable properties of the object type.\"\n        + \" Uses simple text matching (contains).\"\n        + \" Each object type has different searchable properties:\"\n        + \" contacts (firstname, lastname, email, phone, company),\"\n        + \" companies (name, website, domain, phone),\"\n        + \" deals (dealname, pipeline, dealstage, description, dealtype),\"\n        + \" tickets (subject, content, hs_pipeline_stage, hs_ticket_category, hs_ticket_id).\"\n        + \" Max 200 characters.\"",
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
          "name": "filterGroups",
          "type": "string",
          "label": "Filter Groups",
          "description": "\"JSON array of filter groups for advanced filtering.\"\n        + \" Each group contains `filters` (AND logic within a group) and groups are OR'd together.\"\n        + \" Each filter has `propertyName`, `operator`, and `value`.\"\n        + \" Operators: EQ, NEQ, LT, LTE, GT, GTE, BETWEEN, IN, NOT_IN, HAS_PROPERTY, NOT_HAS_PROPERTY, CONTAINS_TOKEN, NOT_CONTAINS_TOKEN.\"\n        + \" Example: `[{\\\"filters\\\": [{\\\"propertyName\\\": \\\"lifecyclestage\\\", \\\"operator\\\": \\\"EQ\\\", \\\"value\\\": \\\"lead\\\"}]}]`.\"\n        + \" Max 5 groups, 6 filters per group, 18 total.\"",
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
          "type": "string[]",
          "label": "Properties",
          "description": "\"Property names to include in results.\"\n        + \" If not specified, returns a default set of common properties for the object type.\"\n        + \" Use **Search Properties** to discover available property names.\"",
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
          "name": "sorts",
          "type": "string",
          "label": "Sorts",
          "description": "\"JSON array of sort rules. Only one sort rule is supported.\"\n        + \" Example: `[{\\\"propertyName\\\": \\\"createdate\\\", \\\"direction\\\": \\\"DESCENDING\\\"}]`.\"\n        + \" Default: sorted by createdate descending.\"",
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
          "name": "limit",
          "type": "integer",
          "label": "Limit",
          "description": "Maximum number of results per page. Max: 200, default: 100.",
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
          "name": "after",
          "type": "string",
          "label": "After (Pagination Cursor)",
          "description": "Paging cursor from a previous response for retrieving the next page of results.",
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
      "app": "hubspot",
      "componentKey": "hubspot-search-crm-objects",
      "componentName": "Search CRM Objects"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_search_properties",
    "description": "Search for property definitions (field names) on a CRM object type. Returns lightweight results: property names, labels, descriptions, and types — without enum options. Use this to discover what fields exist before creating or updating records. To get full details including valid enum values for a specific property, use **Get Properties**. To search for actual CRM data/records, use **Search CRM**. [See the documentation](https://developers.hubspot.com/docs/api/crm/properties)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The CRM object type to search properties for (e.g. contact, company, deal, ticket)."
        },
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Keywords",
          "description": "Search keywords to find relevant properties by name or label. Use property name guesses, not natural language phrases. For example: `[\"owner\", \"assigned_to\"]` to find assignment-related fields, or `[\"name\", \"employees\", \"zip\"]` to find multiple fields at once. Leave empty to return all properties for the object type."
        },
        "includeReadOnly": {
          "type": "boolean",
          "title": "Include Read-Only Properties",
          "description": "Set to `true` to include read-only / calculated properties (e.g. `createdate`, `hs_object_id`). Default: `false` — only writable properties are returned."
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
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-search-properties",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The CRM object type to search properties for (e.g. contact, company, deal, ticket).",
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
          "name": "keywords",
          "type": "string[]",
          "label": "Keywords",
          "description": "Search keywords to find relevant properties by name or label. Use property name guesses, not natural language phrases. For example: `[\"owner\", \"assigned_to\"]` to find assignment-related fields, or `[\"name\", \"employees\", \"zip\"]` to find multiple fields at once. Leave empty to return all properties for the object type.",
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
          "name": "includeReadOnly",
          "type": "boolean",
          "label": "Include Read-Only Properties",
          "description": "Set to `true` to include read-only / calculated properties (e.g. `createdate`, `hs_object_id`). Default: `false` — only writable properties are returned.",
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
      "app": "hubspot",
      "componentKey": "hubspot-search-properties",
      "componentName": "Search Properties"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_send_message",
    "description": "Sends a message to a thread. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-message/post-conversations-v3-conversations-threads-threadId-messages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inboxId": {
          "type": "string",
          "title": "Inbox ID",
          "description": "The ID of an inbox"
        },
        "senderActorId": {
          "type": "string",
          "title": "Sender Actor ID",
          "description": "The ID of the sender actor"
        },
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "The ID of a channel"
        },
        "threadId": {
          "type": "string",
          "title": "Thread ID",
          "description": "The ID of a thread"
        },
        "channelAccountId": {
          "type": "string",
          "title": "Channel Account ID",
          "description": "The ID of a channel account"
        },
        "recipientType": {
          "type": "string",
          "title": "Recipient Type",
          "description": "The type of identifier. HS_EMAIL_ADDRESS for email addresses; HS_PHONE_NUMBER for a phone number; CHANNEL_SPECIFIC_OPAQUE_ID for channels that use their own proprietary identifiers, like Facebook Messenger or LiveChat. Use the \"List Messages\" action to locate a CHANNEL_SPECIFIC_OPAQUE_ID."
        },
        "recipientValue": {
          "type": "string",
          "title": "Recipient Value",
          "description": "The value of the recipient identifier. For HS_EMAIL_ADDRESS, this is the email address. For HS_PHONE_NUMBER, this is the phone number. For CHANNEL_SPECIFIC_OPAQUE_ID, this is the proprietary identifier."
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "The text content of the message"
        },
        "fileId": {
          "type": "string",
          "title": "File ID",
          "description": "The ID of a file uploaded to HubSpot"
        },
        "subject": {
          "type": "string",
          "title": "Subject",
          "description": "The subject of the message"
        }
      },
      "required": [
        "inboxId",
        "senderActorId",
        "channelId",
        "threadId",
        "channelAccountId",
        "recipientType",
        "recipientValue",
        "text"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-send-message",
      "version": "0.0.4",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "inboxId",
          "type": "string",
          "label": "Inbox ID",
          "description": "The ID of an inbox",
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
          "name": "senderActorId",
          "type": "string",
          "label": "Sender Actor ID",
          "description": "The ID of the sender actor",
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
          "name": "channelId",
          "type": "string",
          "label": "Channel ID",
          "description": "The ID of a channel",
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
          "name": "threadId",
          "type": "string",
          "label": "Thread ID",
          "description": "The ID of a thread",
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
          "name": "channelAccountId",
          "type": "string",
          "label": "Channel Account ID",
          "description": "The ID of a channel account",
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
          "name": "recipientType",
          "type": "string",
          "label": "Recipient Type",
          "description": "The type of identifier. HS_EMAIL_ADDRESS for email addresses; HS_PHONE_NUMBER for a phone number; CHANNEL_SPECIFIC_OPAQUE_ID for channels that use their own proprietary identifiers, like Facebook Messenger or LiveChat. Use the \"List Messages\" action to locate a CHANNEL_SPECIFIC_OPAQUE_ID.",
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
          "name": "recipientValue",
          "type": "string",
          "label": "Recipient Value",
          "description": "The value of the recipient identifier. For HS_EMAIL_ADDRESS, this is the email address. For HS_PHONE_NUMBER, this is the phone number. For CHANNEL_SPECIFIC_OPAQUE_ID, this is the proprietary identifier.",
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
          "description": "The text content of the message",
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
          "name": "fileId",
          "type": "string",
          "label": "File ID",
          "description": "The ID of a file uploaded to HubSpot",
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
          "name": "subject",
          "type": "string",
          "label": "Subject",
          "description": "The subject of the message",
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
      "app": "hubspot",
      "componentKey": "hubspot-send-message",
      "componentName": "Send Message"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_blog_post",
    "description": "Updates an existing blog post in HubSpot. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/patch-cms-v3-blogs-posts-objectId)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blogPostId": {
          "type": "string",
          "title": "Blog Post ID",
          "description": "The ID of the blog post"
        },
        "name": {
          "type": "string"
        },
        "__kind": {
          "type": "string"
        },
        "moduleUrl": {
          "type": "string"
        }
      },
      "required": [
        "blogPostId",
        "name",
        "__kind",
        "moduleUrl"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-blog-post",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "blogPostId",
          "type": "string",
          "label": "Blog Post ID",
          "description": "The ID of the blog post",
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
          "name": "__kind",
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
        },
        {
          "name": "moduleUrl",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-blog-post",
      "componentName": "Update Blog Post"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_blog_post_draft",
    "description": "Updates the draft version of an existing blog post in HubSpot. [See the documentation](https://developers.hubspot.com/docs/api-reference/cms-posts-v3/basic/patch-cms-v3-blogs-posts-objectId-draft)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "blogPostId": {
          "type": "string",
          "title": "Blog Post ID",
          "description": "The ID of the blog post"
        },
        "name": {
          "type": "string"
        },
        "__kind": {
          "type": "string"
        },
        "moduleUrl": {
          "type": "string"
        }
      },
      "required": [
        "blogPostId",
        "name",
        "__kind",
        "moduleUrl"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-blog-post-draft",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "blogPostId",
          "type": "string",
          "label": "Blog Post ID",
          "description": "The ID of the blog post",
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
          "name": "__kind",
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
        },
        {
          "name": "moduleUrl",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-blog-post-draft",
      "componentName": "Update Blog Post Draft"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_company",
    "description": "Update a company in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/companies)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "Hubspot's internal ID for the contact"
        },
        "propertyGroups": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Groups"
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to update as a JSON object"
        }
      },
      "required": [
        "objectId",
        "propertyGroups",
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-company",
      "version": "0.0.32",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "Hubspot's internal ID for the contact",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to update as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-company",
      "componentName": "Update Company"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_contact",
    "description": "Update a contact in Hubspot. [See the documentation](https://developers.hubspot.com/docs/api/crm/contacts#endpoint?spec=POST-/crm/v3/objects/contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "Hubspot's internal ID for the contact"
        },
        "propertyGroups": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Groups"
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to update as a JSON object"
        }
      },
      "required": [
        "objectId",
        "propertyGroups",
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-contact",
      "version": "0.0.33",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "Hubspot's internal ID for the contact",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to update as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-contact",
      "componentName": "Update Contact"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_crm_object",
    "description": "Update CRM Object via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectType": {
          "type": "string",
          "title": "Object Type",
          "description": "The type of CRM object to update."
        },
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "\"The ID of the record to update.\"\n        + \" Use **Search CRM Objects** to find record IDs.\""
        },
        "properties": {
          "type": "string",
          "title": "Properties",
          "description": "\"JSON object of property name-value pairs to update.\"\n        + \" Only include the properties you want to change.\"\n        + \" Example: `{\\\"dealstage\\\": \\\"closedwon\\\", \\\"amount\\\": \\\"75000\\\"}`.\"\n        + \" All values must be strings.\""
        }
      },
      "required": [
        "objectType",
        "objectId",
        "properties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-crm-object",
      "version": "0.0.3",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The type of CRM object to update.",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "\"The ID of the record to update.\"\n        + \" Use **Search CRM Objects** to find record IDs.\"",
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
          "type": "string",
          "label": "Properties",
          "description": "\"JSON object of property name-value pairs to update.\"\n        + \" Only include the properties you want to change.\"\n        + \" Example: `{\\\"dealstage\\\": \\\"closedwon\\\", \\\"amount\\\": \\\"75000\\\"}`.\"\n        + \" All values must be strings.\"",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-crm-object",
      "componentName": "Update CRM Object"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_custom_object",
    "description": "Update a custom object in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/custom-objects#update-existing-custom-objects)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "customObjectType": {
          "type": "string",
          "title": "Custom Object Type",
          "description": "The type of custom object to create. This is the object's `fullyQualifiedName`, `objectTypeId`, or the short-hand custom object type name (aka `p_{object_name}`)"
        },
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "The ID of the custom object"
        },
        "propertyGroups": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Groups"
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to update as a JSON object"
        }
      },
      "required": [
        "customObjectType",
        "objectId",
        "propertyGroups",
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-custom-object",
      "version": "1.0.18",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "customObjectType",
          "type": "string",
          "label": "Custom Object Type",
          "description": "The type of custom object to create. This is the object's `fullyQualifiedName`, `objectTypeId`, or the short-hand custom object type name (aka `p_{object_name}`)",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "The ID of the custom object",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to update as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-custom-object",
      "componentName": "Update Custom Object"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_deal",
    "description": "Update a deal in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/deals#update-deals)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Object ID",
          "description": "Hubspot's internal ID for the contact"
        },
        "propertyGroups": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Groups"
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to update as a JSON object"
        }
      },
      "required": [
        "objectId",
        "propertyGroups",
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-deal",
      "version": "0.0.23",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Object ID",
          "description": "Hubspot's internal ID for the contact",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to update as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-deal",
      "componentName": "Update Deal"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_fields_on_the_form",
    "description": "Update some of the form definition components. [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#patch-%2Fmarketing%2Fv3%2Fforms%2F%7Bformid%7D)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "formId": {
          "type": "string",
          "title": "Form ID",
          "description": "The ID of the form to update."
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the form."
        },
        "archived": {
          "type": "boolean",
          "title": "Archived",
          "description": "Whether the form is archived."
        },
        "fieldGroups": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Field Groups",
          "description": "A list for objects of group type and fields. **Format: `[{ \"groupType\": \"default_group\", \"richTextType\": \"text\", \"fields\": [ { \"objectTypeId\": \"0-1\", \"name\": \"email\", \"label\": \"Email\", \"required\": true, \"hidden\": false, \"fieldType\": \"email\", \"validation\": { \"blockedEmailDomains\": [], \"useDefaultBlockList\": false }}]}]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information."
        },
        "createNewContactForNewEmail": {
          "type": "boolean",
          "title": "Create New Contact for New Email",
          "description": "Whether to create a new contact when a form is submitted with an email address that doesn't match any in your existing contacts records."
        },
        "editable": {
          "type": "boolean",
          "title": "Editable",
          "description": "Whether the form can be edited."
        },
        "allowLinkToResetKnownValues": {
          "type": "boolean",
          "title": "Allow Link to Reset Known Values",
          "description": "Whether to add a reset link to the form. This removes any pre-populated content on the form and creates a new contact on submission."
        },
        "lifecycleStages": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Lifecycle Stages",
          "description": "A list of objects of lifecycle stages. **Format: `[{ \"objectTypeId\": \"0-1\", \"value\": \"subscriber\" }]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information."
        },
        "postSubmitActionType": {
          "type": "string",
          "title": "Post Submit Action Type",
          "description": "The action to take after submit. The default action is displaying a thank you message."
        },
        "postSubmitActionValue": {
          "type": "string",
          "title": "Post Submit Action Value",
          "description": "The thank you text or the page to redirect to."
        },
        "language": {
          "type": "string",
          "title": "Language",
          "description": "The language of the form."
        },
        "prePopulateKnownValues": {
          "type": "boolean",
          "title": "Pre-populate Known Values",
          "description": "Whether contact fields should pre-populate with known information when a contact returns to your site."
        },
        "cloneable": {
          "type": "boolean",
          "title": "Cloneable",
          "description": "Whether the form can be cloned."
        },
        "notifyContactOwner": {
          "type": "boolean",
          "title": "Notify Contact Owner",
          "description": "Whether to send a notification email to the contact owner when a submission is received."
        },
        "recaptchaEnabled": {
          "type": "boolean",
          "title": "Recaptcha Enabled",
          "description": "Whether CAPTCHA (spam prevention) is enabled."
        },
        "archivable": {
          "type": "boolean",
          "title": "Archivable",
          "description": "Whether the form can be archived."
        },
        "notifyRecipients": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Contact Email",
          "description": "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field."
        },
        "renderRawHtml": {
          "type": "boolean",
          "title": "Render Raw HTML",
          "description": "Whether the form will render as raw HTML as opposed to inside an iFrame."
        },
        "cssClass": {
          "type": "string",
          "title": "CSS Class",
          "description": "The CSS class of the form."
        },
        "theme": {
          "type": "string",
          "title": "Theme",
          "description": "The theme used for styling the input fields. This will not apply if the form is added to a HubSpot CMS page`."
        },
        "submitButtonText": {
          "type": "string",
          "title": "Submit Button Text",
          "description": "The text displayed on the form submit button."
        },
        "labelTextSize": {
          "type": "string",
          "title": "Label Text Size",
          "description": "The size of the label text."
        },
        "legalConsentTextColor": {
          "type": "string",
          "title": "Legal Consent Text Color",
          "description": "The color of the legal consent text."
        },
        "fontFamily": {
          "type": "string",
          "title": "Font Family",
          "description": "The font family of the form."
        },
        "legalConsentTextSize": {
          "type": "string",
          "title": "Legal Consent Text Size",
          "description": "The size of the legal consent text."
        },
        "backgroundWidth": {
          "type": "string",
          "title": "Background Width",
          "description": "The width of the background."
        },
        "helpTextSize": {
          "type": "string",
          "title": "Help Text Size",
          "description": "The size of the help text."
        },
        "submitFontColor": {
          "type": "string",
          "title": "Submit Font Color",
          "description": "The color of the submit font."
        },
        "labelTextColor": {
          "type": "string",
          "title": "Label Text Color",
          "description": "The color of the label text."
        },
        "submitAlignment": {
          "type": "string",
          "title": "Submit Alignment",
          "description": "The alignment of the submit button."
        },
        "submitSize": {
          "type": "string",
          "title": "Submit Size",
          "description": "The size of the submit button."
        },
        "helpTextColor": {
          "type": "string",
          "title": "Help Text Color",
          "description": "The color of the help text."
        },
        "submitColor": {
          "type": "string",
          "title": "Submit Color",
          "description": "The color of the submit button."
        },
        "legalConsentOptionsType": {
          "type": "string",
          "title": "Legal Consent Options Type",
          "description": "The type of legal consent options."
        },
        "legalConsentOptionsObject": {
          "type": "object",
          "title": "Legal Consent Options Object",
          "description": "The object of legal consent options. **Format: `{\"subscriptionTypeIds\": [1,2,3], \"lawfulBasis\": \"lead\", \"privacy\": \"string\"}`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information."
        }
      },
      "required": [
        "formId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-fields-on-the-form",
      "version": "0.0.12",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "name": "formId",
          "type": "string",
          "label": "Form ID",
          "description": "The ID of the form to update.",
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
          "description": "The name of the form.",
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
          "name": "archived",
          "type": "boolean",
          "label": "Archived",
          "description": "Whether the form is archived.",
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
          "name": "fieldGroups",
          "type": "string[]",
          "label": "Field Groups",
          "description": "A list for objects of group type and fields. **Format: `[{ \"groupType\": \"default_group\", \"richTextType\": \"text\", \"fields\": [ { \"objectTypeId\": \"0-1\", \"name\": \"email\", \"label\": \"Email\", \"required\": true, \"hidden\": false, \"fieldType\": \"email\", \"validation\": { \"blockedEmailDomains\": [], \"useDefaultBlockList\": false }}]}]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
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
          "name": "createNewContactForNewEmail",
          "type": "boolean",
          "label": "Create New Contact for New Email",
          "description": "Whether to create a new contact when a form is submitted with an email address that doesn't match any in your existing contacts records.",
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
          "name": "editable",
          "type": "boolean",
          "label": "Editable",
          "description": "Whether the form can be edited.",
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
          "name": "allowLinkToResetKnownValues",
          "type": "boolean",
          "label": "Allow Link to Reset Known Values",
          "description": "Whether to add a reset link to the form. This removes any pre-populated content on the form and creates a new contact on submission.",
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
          "name": "lifecycleStages",
          "type": "string[]",
          "label": "Lifecycle Stages",
          "description": "A list of objects of lifecycle stages. **Format: `[{ \"objectTypeId\": \"0-1\", \"value\": \"subscriber\" }]`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
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
          "name": "postSubmitActionType",
          "type": "string",
          "label": "Post Submit Action Type",
          "description": "The action to take after submit. The default action is displaying a thank you message.",
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
          "name": "postSubmitActionValue",
          "type": "string",
          "label": "Post Submit Action Value",
          "description": "The thank you text or the page to redirect to.",
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
          "name": "language",
          "type": "string",
          "label": "Language",
          "description": "The language of the form.",
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
          "name": "prePopulateKnownValues",
          "type": "boolean",
          "label": "Pre-populate Known Values",
          "description": "Whether contact fields should pre-populate with known information when a contact returns to your site.",
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
          "name": "cloneable",
          "type": "boolean",
          "label": "Cloneable",
          "description": "Whether the form can be cloned.",
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
          "name": "notifyContactOwner",
          "type": "boolean",
          "label": "Notify Contact Owner",
          "description": "Whether to send a notification email to the contact owner when a submission is received.",
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
          "name": "recaptchaEnabled",
          "type": "boolean",
          "label": "Recaptcha Enabled",
          "description": "Whether CAPTCHA (spam prevention) is enabled.",
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
          "name": "archivable",
          "type": "boolean",
          "label": "Archivable",
          "description": "Whether the form can be archived.",
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
          "name": "notifyRecipients",
          "type": "string[]",
          "label": "Contact Email",
          "description": "Note - this needs to be a contact that already exists within HubSpot. You may need to add a Create or Update Contact step before this one. Then, use the email created in that step in this field.",
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
          "name": "renderRawHtml",
          "type": "boolean",
          "label": "Render Raw HTML",
          "description": "Whether the form will render as raw HTML as opposed to inside an iFrame.",
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
          "name": "cssClass",
          "type": "string",
          "label": "CSS Class",
          "description": "The CSS class of the form.",
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
          "name": "theme",
          "type": "string",
          "label": "Theme",
          "description": "The theme used for styling the input fields. This will not apply if the form is added to a HubSpot CMS page`.",
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
          "name": "submitButtonText",
          "type": "string",
          "label": "Submit Button Text",
          "description": "The text displayed on the form submit button.",
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
          "name": "labelTextSize",
          "type": "string",
          "label": "Label Text Size",
          "description": "The size of the label text.",
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
          "name": "legalConsentTextColor",
          "type": "string",
          "label": "Legal Consent Text Color",
          "description": "The color of the legal consent text.",
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
          "name": "fontFamily",
          "type": "string",
          "label": "Font Family",
          "description": "The font family of the form.",
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
          "name": "legalConsentTextSize",
          "type": "string",
          "label": "Legal Consent Text Size",
          "description": "The size of the legal consent text.",
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
          "name": "backgroundWidth",
          "type": "string",
          "label": "Background Width",
          "description": "The width of the background.",
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
          "name": "helpTextSize",
          "type": "string",
          "label": "Help Text Size",
          "description": "The size of the help text.",
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
          "name": "submitFontColor",
          "type": "string",
          "label": "Submit Font Color",
          "description": "The color of the submit font.",
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
          "name": "labelTextColor",
          "type": "string",
          "label": "Label Text Color",
          "description": "The color of the label text.",
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
          "name": "submitAlignment",
          "type": "string",
          "label": "Submit Alignment",
          "description": "The alignment of the submit button.",
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
          "name": "submitSize",
          "type": "string",
          "label": "Submit Size",
          "description": "The size of the submit button.",
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
          "name": "helpTextColor",
          "type": "string",
          "label": "Help Text Color",
          "description": "The color of the help text.",
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
          "name": "submitColor",
          "type": "string",
          "label": "Submit Color",
          "description": "The color of the submit button.",
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
          "name": "legalConsentOptionsType",
          "type": "string",
          "label": "Legal Consent Options Type",
          "description": "The type of legal consent options.",
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
          "name": "legalConsentOptionsObject",
          "type": "object",
          "label": "Legal Consent Options Object",
          "description": "The object of legal consent options. **Format: `{\"subscriptionTypeIds\": [1,2,3], \"lawfulBasis\": \"lead\", \"privacy\": \"string\"}`** [See the documentation](https://developers.hubspot.com/docs/reference/api/marketing/forms#post-%2Fmarketing%2Fv3%2Fforms%2F) for more information.",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-fields-on-the-form",
      "componentName": "Update Fields on the Form"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_landing_page",
    "description": "Update a landing page in HubSpot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#patch-%2Fcms%2Fv3%2Fpages%2Flanding-pages%2F%7Bobjectid%7D)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Landing Page ID",
          "description": "The ID of the page to update."
        },
        "pageName": {
          "type": "string",
          "title": "Page Name",
          "description": "The name of the page."
        },
        "landingFolderId": {
          "type": "string",
          "title": "Folder ID",
          "description": "The ID of the folder to create the landing page in."
        },
        "__kind": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "moduleUrl": {
          "type": "string"
        }
      },
      "required": [
        "pageId",
        "__kind",
        "name",
        "moduleUrl"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-landing-page",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "label": "Landing Page ID",
          "description": "The ID of the page to update.",
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
          "name": "pageName",
          "type": "string",
          "label": "Page Name",
          "description": "The name of the page.",
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
          "name": "landingFolderId",
          "type": "string",
          "label": "Folder ID",
          "description": "The ID of the folder to create the landing page in.",
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
          "name": "__kind",
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
        },
        {
          "name": "name",
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
        },
        {
          "name": "moduleUrl",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-landing-page",
      "componentName": "Update Landing Page"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_lead",
    "description": "Update a lead in Hubspot. [See the documentation](https://developers.hubspot.com/beta-docs/guides/api/crm/objects/leads#update-leads)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "objectId": {
          "type": "string",
          "title": "Lead ID",
          "description": "The identifier of the lead"
        },
        "propertyGroups": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Property Groups"
        },
        "objectProperties": {
          "type": "object",
          "title": "Object Properties",
          "description": "Enter the object properties to update as a JSON object"
        }
      },
      "required": [
        "objectId",
        "propertyGroups",
        "objectProperties"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-lead",
      "version": "0.0.24",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [
        "propertyGroups"
      ],
      "props": [
        {
          "name": "hubspot",
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
          "name": "objectId",
          "type": "string",
          "label": "Lead ID",
          "description": "The identifier of the lead",
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
          "name": "propertyGroups",
          "type": "string[]",
          "label": "Property Groups",
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
          "name": "objectProperties",
          "type": "object",
          "label": "Object Properties",
          "description": "Enter the object properties to update as a JSON object",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-lead",
      "componentName": "Update Lead"
    }
  },
  {
    "integration": "hubspot",
    "name": "hubspot_update_page",
    "description": "Update a page in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/cms/pages#patch-%2Fcms%2Fv3%2Fpages%2Fsite-pages%2F%7Bobjectid%7D)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pageId": {
          "type": "string",
          "title": "Page ID",
          "description": "The ID of the page to update."
        },
        "pageName": {
          "type": "string",
          "title": "Page Name",
          "description": "The name of the page."
        },
        "__kind": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "moduleUrl": {
          "type": "string"
        }
      },
      "required": [
        "pageId",
        "__kind",
        "name",
        "moduleUrl"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "hubspot",
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
      "app": "hubspot",
      "componentId": "hubspot-update-page",
      "version": "0.0.13",
      "authPropNames": [
        "hubspot"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "hubspot",
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
          "description": "The ID of the page to update.",
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
          "name": "pageName",
          "type": "string",
          "label": "Page Name",
          "description": "The name of the page.",
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
          "name": "__kind",
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
        },
        {
          "name": "name",
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
        },
        {
          "name": "moduleUrl",
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
      "app": "hubspot",
      "componentKey": "hubspot-update-page",
      "componentName": "Update Page"
    }
  }
] satisfies PipedreamActionToolManifest[];
