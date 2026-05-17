import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "google-contacts",
    name: partial.name,
    description: partial.description,
    inputSchema: { type: "object", properties: {} },
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "googlecontacts",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleContactsComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googlecontacts_batch_create_contacts",
    description: "Create a batch of new contacts in Google Contacts. This action creates up to 200 contacts in a single API call and returns the PersonResponses for the newly created contacts. Use this action when you need to create multiple contacts at once to reduce API calls and improve performance. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures. Note: The contacts array accepts Person objects with any valid People API fields (names, emailAddresses, phoneNumbers, addresses, organizations, etc.). Each contact must be wrapped in a 'contactPerson' object.",
    toolSlug: "GOOGLECONTACTS_BATCH_CREATE_CONTACTS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "bulk_operations",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch create contacts.",
    ],
  }),
  composioTool({
    name: "googlecontacts_batch_get_contact_groups",
    description: "Get a list of contact groups owned by the authenticated user by specifying a list of contact group resource names. Use when you need to retrieve details for specific contact groups, such as getting group metadata, member counts, or group names for multiple groups in a single API call.",
    toolSlug: "GOOGLECONTACTS_BATCH_GET_CONTACT_GROUPS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "bulk_operations",
    ],
  }),
  composioTool({
    name: "googlecontacts_batch_update_contacts",
    description: "Update a batch of contacts in Google Contacts and return the updated contact data. Use this action when you need to modify multiple contacts at once, such as: - Updating names, phone numbers, or email addresses for several contacts - Making bulk changes to contact information - Syncing contact data from another source This action allows updating up to 200 contacts per request. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_BATCH_UPDATE_CONTACTS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "bulk_operations",
    ],
    askBefore: [
      "Confirm the parameters before executing Batch Update Google Contacts.",
    ],
  }),
  composioTool({
    name: "googlecontacts_copy_other_contact_to_my_contacts",
    description: "Copies an Other contact to a new contact in the user's myContacts group. Use this action when you need to save an existing \"Other contact\" (from Google's contact suggestions) to your permanent contacts in the myContacts group. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_COPY_OTHER_CONTACT_TO_MY_CONTACTS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "other_contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy Other Contact to My Contacts.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecontacts_create_contact",
    description: "Create a new contact in Google Contacts and return the person resource for that contact. Use when you need to add a new person to the authenticated user's Google Contacts. The request returns a 400 error if more than one field is specified on a field that is a singleton for contact sources: biographies, birthdays, genders, or names. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures. This action creates a single contact; for bulk creation of multiple contacts, use GOOGLECONTACTS_BATCH_CREATE_CONTACTS instead. Note: Only the primary entry for singleton fields (biographies, birthdays, genders, names) will be saved for contact sources.",
    toolSlug: "GOOGLECONTACTS_CREATE_CONTACT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Contact.",
    ],
  }),
  composioTool({
    name: "googlecontacts_create_contact_group",
    description: "Create a new contact group owned by the authenticated user. The group name must be unique among the user's contact groups. Use this action when you need to create a new contact group to organize the user's Google Contacts. Attempting to create a group with a duplicate name will return an HTTP 409 error. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_CREATE_CONTACT_GROUP",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contact_groups",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Contact Group.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecontacts_delete_contact",
    description: "Delete a contact person from Google Contacts. Any non-contact data will not be deleted. Use this action when you need to permanently remove a contact from the user's Google Contacts list. This action is irreversible — the contact cannot be recovered once deleted. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_DELETE_CONTACT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contacts",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Google Contact.",
    ],
  }),
  composioTool({
    name: "googlecontacts_delete_contact_group",
    description: "Deletes an existing contact group owned by the authenticated user by specifying the contact group resource name. This action is irreversible — once deleted, the contact group cannot be recovered. Use this action when you need to remove a contact group that is no longer needed. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_DELETE_CONTACT_GROUP",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contact_groups",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete contact group.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecontacts_delete_contact_photo",
    description: "Delete a contact's photo from Google Contacts. Use when you need to remove a profile picture from a specific contact. This action is irreversible — once the photo is deleted, it cannot be recovered. Mutate requests for the same user should be sent sequentially to avoid lock contention and failures.",
    toolSlug: "GOOGLECONTACTS_DELETE_CONTACT_PHOTO",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contact_photos",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Contact Photo.",
    ],
  }),
  composioTool({
    name: "googlecontacts_delete_contacts_batch",
    description: "Delete a batch of contacts from Google Contacts. Any non-contact data will not be deleted. Use this action when you need to permanently remove multiple contacts from the user's Google Contacts list at once. This action is irreversible — the contacts cannot be recovered once deleted. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_DELETE_CONTACTS_BATCH",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "bulk_operations",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Batch Delete Google Contacts.",
    ],
  }),
  composioTool({
    name: "googlecontacts_get_batch_people",
    description: "Batch retrieves information about multiple people from Google Contacts. Use this action when you need to fetch contact information for several people in a single API call rather than making individual requests per person. This improves efficiency when you need data from multiple contacts at once. Note: The personFields parameter is required and determines which contact information fields are returned in the response. If a person cannot be found, the corresponding response will contain a status but no person data.",
    toolSlug: "GOOGLECONTACTS_GET_BATCH_PEOPLE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "bulk_operations",
    ],
  }),
  composioTool({
    name: "googlecontacts_get_contact_group",
    description: "Retrieves a specific contact group owned by the authenticated user by specifying the contact group resource name. Use when you need to get details about a specific contact group, including its name, member count, and metadata. This is a read-only operation that fetches an existing contact group when you already know its resource name.",
    toolSlug: "GOOGLECONTACTS_GET_CONTACT_GROUP",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "contact_groups",
    ],
  }),
  composioTool({
    name: "googlecontacts_get_person",
    description: "Provides information about a person by specifying a resource name. Use when you need to retrieve detailed information about a specific person, including their names, email addresses, phone numbers, organizations, and other profile data. Use 'people/me' as the resource name to get the authenticated user's profile. The request will return a 400 error if 'personFields' is not specified.",
    toolSlug: "GOOGLECONTACTS_GET_PERSON",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "googlecontacts_list_connections",
    description: "Lists the connections (contacts) for the authenticated user. Use when you need to retrieve a paginated list of all contacts with optional sorting, filtering, and incremental sync support. Sync tokens expire 7 days after a full sync — requests with expired tokens return a 410 error. When using page_token or sync_token, all other parameters must match the original request. Deleted contacts appear as Person objects with PersonMetadata.deleted set to true. Incremental syncs are not intended for read-after-write use cases.",
    toolSlug: "GOOGLECONTACTS_LIST_CONNECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "googlecontacts_list_contact_groups",
    description: "List all contact groups owned by the authenticated user. Use when you need to retrieve all contact groups (e.g., \"My Contacts\", \"Starred\", custom groups) for organizing or managing contacts. Members of the contact groups are not populated in this response.",
    toolSlug: "GOOGLECONTACTS_LIST_CONTACT_GROUPS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "contact_groups",
    ],
  }),
  composioTool({
    name: "googlecontacts_list_directory_people",
    description: "Lists domain profiles and domain contacts in the authenticated user's domain directory. Use when you need to retrieve directory information for all users in a Google Workspace domain, including their contact details like names, emails, and phone numbers. Supports pagination via pageToken and incremental sync via syncToken. When syncToken is used, deleted resources are returned with PersonMetadata.deleted set to true. Note: Write propagation delays of several minutes may apply for sync requests — this is not suitable for read-after-write use cases. All request parameters must remain consistent when using pagination or sync tokens.",
    toolSlug: "GOOGLECONTACTS_LIST_DIRECTORY_PEOPLE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "directory_people",
    ],
  }),
  composioTool({
    name: "googlecontacts_list_other_contacts",
    description: "Lists \"Other contacts\" from Google People API. Other contacts are contacts that are not in a contact group, typically auto-created from interactions like emails sent or received. Use this action when you need to retrieve contacts that exist outside of organized contact groups, such as auto-generated contacts from email communications. Sync tokens expire 7 days after a full sync. If you receive an EXPIRED_SYNC_TOKEN error, make a new request without a sync_token. The first page of a full sync has a fixed quota that cannot be increased. When using pageToken or syncToken, all other request parameters must match the original call.",
    toolSlug: "GOOGLECONTACTS_LIST_OTHER_CONTACTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "other_contacts",
    ],
  }),
  composioTool({
    name: "googlecontacts_modify_contact_group_members",
    description: "Modifies the members of a contact group by adding or removing contact resource names. Only system contact groups 'contactGroups/myContacts' and 'contactGroups/starred' can have members added. Other system contact groups are deprecated and can only have contacts removed. Use when you need to add contacts to or remove contacts from a contact group. Note: Combined total of contacts to add and remove cannot exceed 1000 per request.",
    toolSlug: "GOOGLECONTACTS_MODIFY_CONTACT_GROUP_MEMBERS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contacts_management",
    ],
    askBefore: [
      "Confirm the parameters before executing Modify Contact Group Members.",
    ],
  }),
  composioTool({
    name: "googlecontacts_search_contacts",
    description: "Searches the authenticated user's contacts for matches against the provided query. The query matches against names, nicknames, email addresses, phone numbers, and organizations. Use this action when you need to find specific contacts in the user's Google Contacts by name, email, phone, or organization. Clients should send a warmup request with an empty query before searching to update the cache. Results are limited to contacts from the CONTACT source.",
    toolSlug: "GOOGLECONTACTS_SEARCH_CONTACTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "contacts",
    ],
  }),
  composioTool({
    name: "googlecontacts_search_directory_people",
    description: "Search domain directory people in Google Contacts. Provides a list of domain profiles and domain contacts in the authenticated user's domain directory that match the search query. Use this action when you need to find people within your organization's Google Workspace domain by searching their names or email addresses. This action requires the https://www.googleapis.com/auth/directory.readonly OAuth scope.",
    toolSlug: "GOOGLECONTACTS_SEARCH_DIRECTORY_PEOPLE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "directory_people",
    ],
  }),
  composioTool({
    name: "googlecontacts_search_other_contacts",
    description: "Searches other contacts from Google People API that match a query string. Other contacts are contacts not in any contact group, typically auto-created from interactions like emails sent or received. This action searches across names, email addresses, and phone numbers using prefix matching. Use this action when you need to find a specific contact among the authenticated user's other contacts by searching for a name, email, or phone number. Note: The Google People API recommends sending a warmup request with an empty query before the first search to update the cache, ensuring fresh results.",
    toolSlug: "GOOGLECONTACTS_SEARCH_OTHER_CONTACTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-contacts",
      "read",
      "other_contacts",
    ],
  }),
  composioTool({
    name: "googlecontacts_update_contact",
    description: "Update contact data for an existing contact person. Any non-contact data will not be modified. Use this action when you need to update information (such as name, email, phone) for an existing contact in Google Contacts. Important notes: - All fields specified in `update_person_fields` will be replaced. Fields not specified in the update mask will remain unchanged. - The `etag` field in the request body is required for optimistic concurrency control. - The server returns a 400 error if the contact has been modified since it was read (etag mismatch). - The server returns a 400 error if more than one value is specified for singleton fields (names, birthdays, genders, biographies). - Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_UPDATE_CONTACT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contacts",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Google Contact.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlecontacts_update_contact_group",
    description: "Update the name of an existing contact group owned by the authenticated user. Use this action when you need to rename a contact group or update its metadata. Attempting to create a group with a duplicate name will return an HTTP 409 error. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures.",
    toolSlug: "GOOGLECONTACTS_UPDATE_CONTACT_GROUP",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contact_groups",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Contact Group.",
    ],
  }),
  composioTool({
    name: "googlecontacts_update_contact_photo",
    description: "Update a contact's photo. Use when you need to change or set the profile picture for an existing Google Contact. Mutate requests for the same user should be sent sequentially to avoid increased latency and failures. The photo should be provided as base64-encoded bytes (JPEG, PNG, or WebP format).",
    toolSlug: "GOOGLECONTACTS_UPDATE_CONTACT_PHOTO",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-contacts",
      "write",
      "contact_photos",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Contact Photo.",
    ],
  }),
];
