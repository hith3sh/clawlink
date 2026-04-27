import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const ApolloPipedreamToolManifests = [
  {
    "integration": "apollo",
    "name": "apollo_add_contacts_to_sequence",
    "description": "Adds one or more contacts to an email outreach sequence in Apollo. Requires a sequence ID, contact IDs, and a sending email account ID. Use **List Metadata** (type `sequences`) to find sequence IDs, (type `email_accounts`) to find email account IDs. Use **Search Contacts** to find contact IDs to enroll. Set `sequenceActiveInOtherCampaigns` to `true` to enroll contacts already active in other sequences. [See the documentation](https://docs.apollo.io/reference/add-contacts-to-sequence)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sequenceId": {
          "type": "string",
          "title": "Sequence ID",
          "description": "The ID of the sequence to add contacts to. Use **List Metadata** (type `sequences`) to find available sequences."
        },
        "contactIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Contact IDs",
          "description": "One or more contact IDs to enroll in the sequence. Use **Search Contacts** to find contact IDs."
        },
        "emailAccountId": {
          "type": "string",
          "title": "Email Account ID",
          "description": "The ID of the email account to send from. Use **List Metadata** (type `email_accounts`) to find available sending accounts."
        },
        "sequenceNoEmail": {
          "type": "boolean",
          "title": "Sequence Without Email",
          "description": "Set to `true` to sequence contacts even if they don't have an email address."
        },
        "sequenceActiveInOtherCampaigns": {
          "type": "boolean",
          "title": "Sequence Active in Other Campaigns",
          "description": "Set to `true` to enroll contacts who are already active or paused in another sequence."
        },
        "sequenceFinishedInOtherCampaigns": {
          "type": "boolean",
          "title": "Sequence Finished in Other Campaigns",
          "description": "Set to `true` to enroll contacts who have already finished another sequence."
        }
      },
      "required": [
        "sequenceId",
        "contactIds",
        "emailAccountId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-add-contacts-to-sequence",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "name": "sequenceId",
          "type": "string",
          "label": "Sequence ID",
          "description": "The ID of the sequence to add contacts to. Use **List Metadata** (type `sequences`) to find available sequences.",
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
          "name": "contactIds",
          "type": "string[]",
          "label": "Contact IDs",
          "description": "One or more contact IDs to enroll in the sequence. Use **Search Contacts** to find contact IDs.",
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
          "name": "emailAccountId",
          "type": "string",
          "label": "Email Account ID",
          "description": "The ID of the email account to send from. Use **List Metadata** (type `email_accounts`) to find available sending accounts.",
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
          "name": "sequenceNoEmail",
          "type": "boolean",
          "label": "Sequence Without Email",
          "description": "Set to `true` to sequence contacts even if they don't have an email address.",
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
          "name": "sequenceActiveInOtherCampaigns",
          "type": "boolean",
          "label": "Sequence Active in Other Campaigns",
          "description": "Set to `true` to enroll contacts who are already active or paused in another sequence.",
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
          "name": "sequenceFinishedInOtherCampaigns",
          "type": "boolean",
          "label": "Sequence Finished in Other Campaigns",
          "description": "Set to `true` to enroll contacts who have already finished another sequence.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-add-contacts-to-sequence",
      "componentName": "Add Contacts to Sequence"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_create_or_update_account",
    "description": "Creates a new account (company) or updates an existing one in your Apollo CRM. To create, omit `accountId` and provide at least a `name`. To update, provide the `accountId` and any fields to change. Use **Search Accounts** to find existing accounts before updating. Use **List Metadata** (type `account_stages`) to discover valid stage IDs. [See the documentation](https://docs.apollo.io/reference/create-an-account)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "accountId": {
          "type": "string",
          "title": "Account ID",
          "description": "The ID of an existing account to update. Omit this to create a new account."
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the account/company. Required when creating."
        },
        "domain": {
          "type": "string",
          "title": "Domain",
          "description": "The company's domain. Example: `\"acme.com\"`. Apollo uses this for enrichment."
        },
        "phone": {
          "type": "string",
          "title": "Phone",
          "description": "The company's phone number."
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-create-or-update-account",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "label": "Account ID",
          "description": "The ID of an existing account to update. Omit this to create a new account.",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the account/company. Required when creating.",
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
          "name": "domain",
          "type": "string",
          "label": "Domain",
          "description": "The company's domain. Example: `\"acme.com\"`. Apollo uses this for enrichment.",
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
          "name": "phone",
          "type": "string",
          "label": "Phone",
          "description": "The company's phone number.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-create-or-update-account",
      "componentName": "Create or Update Account"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_create_or_update_contact",
    "description": "Creates a new contact or updates an existing one in your Apollo CRM. To create, omit `contactId` and provide at least an `email`. To update, provide the `contactId` and any fields to change. Use **Search Contacts** to find existing contacts by name or email before updating. Use **List Metadata** (type `contact_stages`) to discover valid stage IDs. The `accountId` links this contact to a company — use **Search Accounts** to find the account ID. [See the documentation](https://docs.apollo.io/reference/create-a-contact)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "The ID of an existing contact to update. Omit this to create a new contact."
        },
        "email": {
          "type": "string",
          "title": "Email",
          "description": "Email address of the contact. Required when creating."
        },
        "firstName": {
          "type": "string",
          "title": "First Name",
          "description": "First name of the contact."
        },
        "lastName": {
          "type": "string",
          "title": "Last Name",
          "description": "Last name of the contact."
        },
        "title": {
          "type": "string",
          "title": "Title",
          "description": "Job title of the contact. Example: `\"VP of Sales\"`."
        },
        "accountId": {
          "type": "string",
          "title": "Account ID",
          "description": "ID of the account (company) to link this contact to. Use **Search Accounts** to find account IDs."
        },
        "websiteUrl": {
          "type": "string",
          "title": "Website URL",
          "description": "The organization website for Apollo to enrich data. Do NOT pass personal social media URLs. This is ignored if a valid email is provided."
        },
        "labelNames": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Label Names",
          "description": "Tag names to apply to this contact. Example: `[\"VIP\", \"Decision Maker\"]`. Use **List Metadata** (type `labels`) to see existing labels."
        },
        "contactStageId": {
          "type": "string",
          "title": "Contact Stage ID",
          "description": "The pipeline stage for this contact. Use **List Metadata** (type `contact_stages`) to discover valid stage IDs."
        },
        "address": {
          "type": "string",
          "title": "Address",
          "description": "Full address string. Apollo will infer city, state, country, and timezone."
        },
        "phone": {
          "type": "string",
          "title": "Phone",
          "description": "Direct dial phone number for this contact."
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-create-or-update-contact",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "description": "The ID of an existing contact to update. Omit this to create a new contact.",
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
          "name": "email",
          "type": "string",
          "label": "Email",
          "description": "Email address of the contact. Required when creating.",
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
          "name": "firstName",
          "type": "string",
          "label": "First Name",
          "description": "First name of the contact.",
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
          "name": "lastName",
          "type": "string",
          "label": "Last Name",
          "description": "Last name of the contact.",
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
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "Job title of the contact. Example: `\"VP of Sales\"`.",
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
          "name": "accountId",
          "type": "string",
          "label": "Account ID",
          "description": "ID of the account (company) to link this contact to. Use **Search Accounts** to find account IDs.",
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
          "name": "websiteUrl",
          "type": "string",
          "label": "Website URL",
          "description": "The organization website for Apollo to enrich data. Do NOT pass personal social media URLs. This is ignored if a valid email is provided.",
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
          "name": "labelNames",
          "type": "string[]",
          "label": "Label Names",
          "description": "Tag names to apply to this contact. Example: `[\"VIP\", \"Decision Maker\"]`. Use **List Metadata** (type `labels`) to see existing labels.",
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
          "name": "contactStageId",
          "type": "string",
          "label": "Contact Stage ID",
          "description": "The pipeline stage for this contact. Use **List Metadata** (type `contact_stages`) to discover valid stage IDs.",
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
          "name": "address",
          "type": "string",
          "label": "Address",
          "description": "Full address string. Apollo will infer city, state, country, and timezone.",
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
          "name": "phone",
          "type": "string",
          "label": "Phone",
          "description": "Direct dial phone number for this contact.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-create-or-update-contact",
      "componentName": "Create or Update Contact"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_create_or_update_opportunity",
    "description": "Creates a new opportunity (deal) or updates an existing one in your Apollo CRM. To create, omit `opportunityId` and provide `name`, `opportunityStageId`, `closedDate`, and `accountId`. To update, provide the `opportunityId` and any fields to change. Use **Get Opportunity** to fetch current details before updating. Use **List Metadata** (type `opportunity_stages`) to discover valid stage IDs, and **Search Accounts** to find account IDs. Use **Get Current User** to find owner IDs. [See the documentation](https://docs.apollo.io/reference/create-opportunity)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "opportunityId": {
          "type": "string",
          "title": "Opportunity ID",
          "description": "The ID of an existing opportunity to update. Omit this to create a new opportunity."
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the opportunity/deal. Required when creating."
        },
        "ownerId": {
          "type": "string",
          "title": "Owner ID",
          "description": "The user ID to assign as the deal owner. Use **Get Current User** or **List Metadata** (type `users`) to find user IDs."
        },
        "amount": {
          "type": "number",
          "title": "Amount",
          "description": "The monetary value of the deal. Example: `50000`."
        },
        "opportunityStageId": {
          "type": "string",
          "title": "Opportunity Stage ID",
          "description": "The pipeline stage for this deal. Use **List Metadata** (type `opportunity_stages`) to discover valid stage IDs. Required when creating."
        },
        "closedDate": {
          "type": "string",
          "title": "Closed Date",
          "description": "The expected or actual close date. Format: `YYYY-MM-DD`. Example: `\"2025-06-30\"`. Required when creating."
        },
        "accountId": {
          "type": "string",
          "title": "Account ID",
          "description": "The account (company) linked to this deal. Use **Search Accounts** to find account IDs. Required when creating."
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-create-or-update-opportunity",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "name": "opportunityId",
          "type": "string",
          "label": "Opportunity ID",
          "description": "The ID of an existing opportunity to update. Omit this to create a new opportunity.",
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
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the opportunity/deal. Required when creating.",
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
          "name": "ownerId",
          "type": "string",
          "label": "Owner ID",
          "description": "The user ID to assign as the deal owner. Use **Get Current User** or **List Metadata** (type `users`) to find user IDs.",
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
          "name": "amount",
          "type": "integer",
          "label": "Amount",
          "description": "The monetary value of the deal. Example: `50000`.",
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
          "name": "opportunityStageId",
          "type": "string",
          "label": "Opportunity Stage ID",
          "description": "The pipeline stage for this deal. Use **List Metadata** (type `opportunity_stages`) to discover valid stage IDs. Required when creating.",
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
          "name": "closedDate",
          "type": "string",
          "label": "Closed Date",
          "description": "The expected or actual close date. Format: `YYYY-MM-DD`. Example: `\"2025-06-30\"`. Required when creating.",
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
          "name": "accountId",
          "type": "string",
          "label": "Account ID",
          "description": "The account (company) linked to this deal. Use **Search Accounts** to find account IDs. Required when creating.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-create-or-update-opportunity",
      "componentName": "Create or Update Opportunity"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_enrich_person",
    "description": "Enriches a person's information using Apollo's 270M+ contact database. Pass any combination of name, email, domain, organization, or LinkedIn URL — the more info you provide, the better the match. This action consumes Apollo enrichment credits. Returns detailed profile data including title, company, seniority, phone numbers, and social profiles. Do NOT pass personal social media URLs as the `domain` — use only company domains like `apollo.io`. If `revealPhoneNumber` is `true`, you must also provide a `webhookUrl` where Apollo will POST the phone data asynchronously. [See the documentation](https://docs.apollo.io/reference/people-enrichment)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "firstName": {
          "type": "string",
          "title": "First Name",
          "description": "The person's first name."
        },
        "lastName": {
          "type": "string",
          "title": "Last Name",
          "description": "The person's last name."
        },
        "name": {
          "type": "string",
          "title": "Full Name",
          "description": "The person's full name. Use this instead of separate first/last name fields if you only have the full name."
        },
        "email": {
          "type": "string",
          "title": "Email",
          "description": "The person's email address."
        },
        "hashedEmail": {
          "type": "string",
          "title": "Hashed Email",
          "description": "MD5 or SHA-256 hashed email. Example: `8d935115b9ff4489f2d1f9249503cadf` (MD5)."
        },
        "organizationName": {
          "type": "string",
          "title": "Organization Name",
          "description": "The person's company name."
        },
        "domain": {
          "type": "string",
          "title": "Domain",
          "description": "The company domain (not a personal URL). Example: `apollo.io` or `microsoft.com`. Do NOT include `www.` or `@`."
        },
        "linkedinUrl": {
          "type": "string",
          "title": "LinkedIn URL",
          "description": "The person's LinkedIn profile URL. Example: `https://www.linkedin.com/in/johndoe`."
        },
        "revealPersonalEmails": {
          "type": "boolean",
          "title": "Reveal Personal Emails",
          "description": "Set to `true` to include personal email addresses in the enrichment results."
        },
        "revealPhoneNumber": {
          "type": "boolean",
          "title": "Reveal Phone Number",
          "description": "Set to `true` to request phone numbers including mobile. Requires `webhookUrl` to be set — Apollo delivers phone data asynchronously via webhook."
        },
        "webhookUrl": {
          "type": "string",
          "title": "Webhook URL",
          "description": "Required when `revealPhoneNumber` is `true`. Apollo will POST a JSON payload with phone data to this URL."
        }
      },
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-enrich-person",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "name": "firstName",
          "type": "string",
          "label": "First Name",
          "description": "The person's first name.",
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
          "name": "lastName",
          "type": "string",
          "label": "Last Name",
          "description": "The person's last name.",
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
          "name": "name",
          "type": "string",
          "label": "Full Name",
          "description": "The person's full name. Use this instead of separate first/last name fields if you only have the full name.",
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
          "name": "email",
          "type": "string",
          "label": "Email",
          "description": "The person's email address.",
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
          "name": "hashedEmail",
          "type": "string",
          "label": "Hashed Email",
          "description": "MD5 or SHA-256 hashed email. Example: `8d935115b9ff4489f2d1f9249503cadf` (MD5).",
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
          "name": "organizationName",
          "type": "string",
          "label": "Organization Name",
          "description": "The person's company name.",
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
          "name": "domain",
          "type": "string",
          "label": "Domain",
          "description": "The company domain (not a personal URL). Example: `apollo.io` or `microsoft.com`. Do NOT include `www.` or `@`.",
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
          "name": "linkedinUrl",
          "type": "string",
          "label": "LinkedIn URL",
          "description": "The person's LinkedIn profile URL. Example: `https://www.linkedin.com/in/johndoe`.",
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
          "name": "revealPersonalEmails",
          "type": "boolean",
          "label": "Reveal Personal Emails",
          "description": "Set to `true` to include personal email addresses in the enrichment results.",
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
          "name": "revealPhoneNumber",
          "type": "boolean",
          "label": "Reveal Phone Number",
          "description": "Set to `true` to request phone numbers including mobile. Requires `webhookUrl` to be set — Apollo delivers phone data asynchronously via webhook.",
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
          "name": "webhookUrl",
          "type": "string",
          "label": "Webhook URL",
          "description": "Required when `revealPhoneNumber` is `true`. Apollo will POST a JSON payload with phone data to this URL.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-enrich-person",
      "componentName": "Enrich Person"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_get_current_user",
    "description": "Returns the authenticated user's profile including their ID, name, email, and team information. Use this tool first to identify the current user's ID for filtering records by owner in **Search Contacts** or **Search Accounts**. [See the documentation](https://docs.apollo.io/reference/get-authenticated-user)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-get-current-user",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-get-current-user",
      "componentName": "Get Current User"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_get_opportunity",
    "description": "Fetches a single opportunity (deal) by ID with full details including name, amount, stage, close date, owner, and linked account. Use **Create or Update Opportunity** to modify it after retrieval. [See the documentation](https://docs.apollo.io/reference/get-opportunity)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "opportunityId": {
          "type": "string",
          "title": "Opportunity ID",
          "description": "The ID of the opportunity to retrieve."
        }
      },
      "required": [
        "opportunityId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-get-opportunity",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "name": "opportunityId",
          "type": "string",
          "label": "Opportunity ID",
          "description": "The ID of the opportunity to retrieve.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-get-opportunity",
      "componentName": "Get Opportunity"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_list_metadata",
    "description": "Lists metadata such as stages, sequences, labels, email accounts, or team users. Use this tool to discover valid IDs before calling write tools — e.g., find a contact stage ID for **Create or Update Contact**, a sequence ID for **Add Contacts to Sequence**, or an opportunity stage ID for **Create or Update Opportunity**. [See the documentation](https://docs.apollo.io/reference/get-contact-stages)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "metadataType": {
          "type": "string",
          "title": "Metadata Type",
          "description": "The type of metadata to list. `contact_stages` — pipeline stages for contacts. `account_stages` — pipeline stages for accounts. `opportunity_stages` — pipeline stages for opportunities/deals. `sequences` — email outreach sequences/campaigns. `email_accounts` — connected email sending accounts. `labels` — tags/labels for contacts. `users` — team members (useful for owner IDs)."
        }
      },
      "required": [
        "metadataType"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-list-metadata",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "name": "metadataType",
          "type": "string",
          "label": "Metadata Type",
          "description": "The type of metadata to list. `contact_stages` — pipeline stages for contacts. `account_stages` — pipeline stages for accounts. `opportunity_stages` — pipeline stages for opportunities/deals. `sequences` — email outreach sequences/campaigns. `email_accounts` — connected email sending accounts. `labels` — tags/labels for contacts. `users` — team members (useful for owner IDs).",
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
        }
      ]
    },
    "source": {
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-list-metadata",
      "componentName": "List Metadata"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_search_accounts",
    "description": "Searches for accounts (companies) in your Apollo CRM by name, stage, or sort criteria. Returns account name, domain, industry, and stage. Use this to find accounts before updating them with **Create or Update Account** or linking them to contacts or opportunities. [See the documentation](https://docs.apollo.io/reference/search-for-accounts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "title": "Query",
          "description": "Search by account/organization name. Example: `\"Acme Corp\"`."
        },
        "accountStageIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Account Stage IDs",
          "description": "Filter by one or more account stage IDs. Use **List Metadata** (type `account_stages`) to discover valid stage IDs."
        },
        "sortByField": {
          "type": "string",
          "title": "Sort By Field",
          "description": "The field to sort results by."
        },
        "sortAscending": {
          "type": "boolean",
          "title": "Sort Ascending",
          "description": "Set to `true` for ascending order, `false` for descending. Defaults to descending."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "Maximum number of accounts to return. Defaults to 100. Max 600."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-search-accounts",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "label": "Query",
          "description": "Search by account/organization name. Example: `\"Acme Corp\"`.",
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
          "name": "accountStageIds",
          "type": "string[]",
          "label": "Account Stage IDs",
          "description": "Filter by one or more account stage IDs. Use **List Metadata** (type `account_stages`) to discover valid stage IDs.",
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
          "name": "sortByField",
          "type": "string",
          "label": "Sort By Field",
          "description": "The field to sort results by.",
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
          "name": "sortAscending",
          "type": "boolean",
          "label": "Sort Ascending",
          "description": "Set to `true` for ascending order, `false` for descending. Defaults to descending.",
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
          "description": "Maximum number of accounts to return. Defaults to 100. Max 600.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-search-accounts",
      "componentName": "Search Accounts"
    }
  },
  {
    "integration": "apollo",
    "name": "apollo_search_contacts",
    "description": "Searches for contacts in your Apollo CRM by keyword, stage, or sort criteria. Returns contact name, email, title, company, and stage. Use this to find contacts before updating them with **Create or Update Contact** or enrolling them with **Add Contacts to Sequence**. The `query` parameter searches across name, title, company, and email. [See the documentation](https://docs.apollo.io/reference/search-for-contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "title": "Query",
          "description": "Search keyword matching contact name, title, company, or email. Example: `\"John\"` or `\"acme.com\"`."
        },
        "contactStageIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Contact Stage IDs",
          "description": "Filter by one or more contact stage IDs. Use **List Metadata** (type `contact_stages`) to discover valid stage IDs."
        },
        "sortByField": {
          "type": "string",
          "title": "Sort By Field",
          "description": "The field to sort results by."
        },
        "sortAscending": {
          "type": "boolean",
          "title": "Sort Ascending",
          "description": "Set to `true` for ascending order, `false` for descending. Defaults to descending."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "Maximum number of contacts to return. Defaults to 100. Max 600."
        }
      },
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "apollo",
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
      "app": "apollo_io_oauth",
      "componentId": "apollo_io_oauth-search-contacts",
      "version": "0.0.1",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "app",
          "type": "app",
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
          "label": "Query",
          "description": "Search keyword matching contact name, title, company, or email. Example: `\"John\"` or `\"acme.com\"`.",
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
          "name": "contactStageIds",
          "type": "string[]",
          "label": "Contact Stage IDs",
          "description": "Filter by one or more contact stage IDs. Use **List Metadata** (type `contact_stages`) to discover valid stage IDs.",
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
          "name": "sortByField",
          "type": "string",
          "label": "Sort By Field",
          "description": "The field to sort results by.",
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
          "name": "sortAscending",
          "type": "boolean",
          "label": "Sort Ascending",
          "description": "Set to `true` for ascending order, `false` for descending. Defaults to descending.",
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
          "description": "Maximum number of contacts to return. Defaults to 100. Max 600.",
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
      "app": "apollo_io_oauth",
      "componentKey": "apollo_io_oauth-search-contacts",
      "componentName": "Search Contacts"
    }
  }
] satisfies PipedreamActionToolManifest[];
