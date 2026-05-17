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
    integration: "onenote",
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
      toolkit: "onenote",
      toolSlug: partial.toolSlug,
      version: "20260507_00",
    },
  };
}

export const onenoteComposioTools: IntegrationTool[] = [
  composioTool({
    name: "onenote_copy_onenote_group_notebook",
    description: "Copies a OneNote notebook to the Notebooks folder in the destination Documents library. The notebook is copied asynchronously. This action initiates the copy operation and returns a 202 Accepted response with an Operation-Location header. Use the OnenoteOperationGet action to poll the Operation-Location endpoint to check the status of the copy operation until it completes. Use this action when you need to duplicate a notebook within a Microsoft 365 group, or copy it to a different group's documents library. The copied notebook's folder is created in the destination Documents library if it doesn't exist.",
    toolSlug: "ONENOTE_COPY_ONENOTE_GROUP_NOTEBOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy notebook in group.",
    ],
  }),
  composioTool({
    name: "onenote_copy_onenote_site_notebook",
    description: "Copies a OneNote notebook to the destination site in the SharePoint documents library. Use this action when you need to duplicate a notebook within a SharePoint site, or copy it to a different site's documents library. The copied notebook's folder is created in the destination documents library if it doesn't exist. This is an asynchronous operation — the API returns a 202 Accepted response with an Operation-Location header. Poll the provided URL to check whether the copy has completed. The copied notebook becomes available at the destination site once the operation succeeds.",
    toolSlug: "ONENOTE_COPY_ONENOTE_SITE_NOTEBOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy notebook in site.",
    ],
  }),
  composioTool({
    name: "onenote_copy_section_to_notebook_for_user2",
    description: "Copies a OneNote section to a specific notebook for a specified user. Use this action when you need to duplicate an existing OneNote section into a different notebook under a specific user's account. The operation is asynchronous and returns an Operation-Location header that should be polled to get the final result. This action is irreversible once the copy operation is initiated.",
    toolSlug: "ONENOTE_COPY_SECTION_TO_NOTEBOOK_FOR_USER2",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy section to notebook (user).",
    ],
  }),
  composioTool({
    name: "onenote_copy_section_to_notebook2",
    description: "Copies a OneNote section to a specific notebook within a SharePoint site. Use this action when you need to duplicate an existing OneNote section into a different notebook within the same SharePoint site. The operation is asynchronous and returns an Operation-Location header that should be polled to get the final result. This action is irreversible once the copy operation is initiated.",
    toolSlug: "ONENOTE_COPY_SECTION_TO_NOTEBOOK2",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy section to notebook (site context).",
    ],
  }),
  composioTool({
    name: "onenote_copy_section_to_section_group",
    description: "Copies a OneNote section from a Microsoft 365 group's notebook into another section group. Use this action when you need to duplicate an existing OneNote section that lives in a Microsoft 365 group's notebook into a different section group. The operation is asynchronous and returns an Operation-Location header that should be polled to get the final result. This action is irreversible once the copy operation is initiated.",
    toolSlug: "ONENOTE_COPY_SECTION_TO_SECTION_GROUP",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy group section to section group.",
    ],
  }),
  composioTool({
    name: "onenote_copy_section_to_section_group_for_user",
    description: "Copies a OneNote section to a specific section group for a specified user. Use this action when you need to duplicate an existing OneNote section into a different section group under a specific user's account. The operation is asynchronous and returns an Operation-Location header that should be polled to get the final result. This action is irreversible once the copy operation is initiated.",
    toolSlug: "ONENOTE_COPY_SECTION_TO_SECTION_GROUP_FOR_USER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy section to section group (user).",
    ],
  }),
  composioTool({
    name: "onenote_copy_site_page_to_section3",
    description: "Copies a OneNote page from a SharePoint site to a destination section. Use this action when you need to duplicate a OneNote page into a different section within the same or a different SharePoint site's notebook. The operation is asynchronous and returns a 202 Accepted response with an Operation-Location header. Poll that endpoint to determine when the copy completes and get the result of the operation. This is an asynchronous operation — the API returns a 202 Accepted response with an Operation-Location header. Poll the provided URL to check whether the copy has completed.",
    toolSlug: "ONENOTE_COPY_SITE_PAGE_TO_SECTION3",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy site page to section.",
    ],
  }),
  composioTool({
    name: "onenote_copy_user_page_to_section",
    description: "Copy a OneNote page from a user's notebook to a specified section. Use this action when you need to duplicate a OneNote page into a different section within a user's Microsoft 365 account. This is an asynchronous operation that returns a 202 Accepted response with an Operation-Location header. Poll that endpoint to determine when the copy completes and get the result of the operation. The page is identified by its full path through the notebook's hierarchy.",
    toolSlug: "ONENOTE_COPY_USER_PAGE_TO_SECTION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Copy user page to section.",
    ],
  }),
  composioTool({
    name: "onenote_count_notebooks_section_groups_sections",
    description: "Gets the count of OneNote sections within a section group in a user's notebook. Use this action when you need to quickly determine the number of sections in a section group without retrieving the full list of section objects. This is a read-only operation.",
    toolSlug: "ONENOTE_COUNT_NOTEBOOKS_SECTION_GROUPS_SECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_count_site_notebook_section_groups_sections",
    description: "Gets the count of sections within a OneNote section group in a SharePoint site notebook. Use this action when you need to quickly determine the number of sections in a section group without retrieving the full list of section objects. Microsoft Graph requires the `ConsistencyLevel: eventual` header when using the `$count=true` query parameter on OneNote endpoints.",
    toolSlug: "ONENOTE_COUNT_SITE_NOTEBOOK_SECTION_GROUPS_SECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_create_group_notebook",
    description: "Creates a new OneNote notebook within a Microsoft 365 group. Use this action when you need to create a new notebook for storing notes within a specific Microsoft 365 group. The notebook will be owned by the specified group and accessible to all members of that group with appropriate permissions. Required permissions: Notes.Create (least privileged), Notes.ReadWrite, or Notes.ReadWrite.All for the group.",
    toolSlug: "ONENOTE_CREATE_GROUP_NOTEBOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create group notebook.",
    ],
  }),
  composioTool({
    name: "onenote_create_group_pages",
    description: "Creates a new OneNote page in the default section of the default notebook for a Microsoft 365 group. Use this action when you need to programmatically create a new page in a group's OneNote notebook. The page content must be provided as HTML. The page will be created in the default section of the default notebook unless a specific section name is provided via the sectionName query parameter.",
    toolSlug: "ONENOTE_CREATE_GROUP_PAGES",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create group OneNote page.",
    ],
  }),
  composioTool({
    name: "onenote_create_group_section_groups_sections",
    description: "Creates a new OneNote section within a specified section group of a Microsoft 365 group. Use this action when you need to add a new section to organize OneNote pages within a section group's hierarchy within a group. The section name must be unique within the same hierarchy level, cannot exceed 50 characters, and cannot contain the characters: ?*/:<>|&#''%~. This action is idempotent — calling it multiple times with the same display name may create duplicate sections depending on the API's handling of unique-name constraints.",
    toolSlug: "ONENOTE_CREATE_GROUP_SECTION_GROUPS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create section in section group.",
    ],
  }),
  composioTool({
    name: "onenote_create_me_notebooks",
    description: "Creates a new OneNote notebook for the signed-in user. Use this action when you need to create a new personal notebook to organize notes. The notebook will be created in the user's default OneDrive for Business location. Notebook names must be unique and cannot exceed 128 characters or contain special characters (?*\\/:<>|&'\"\"). Returns the full created notebook object including the server-assigned ID and URLs for accessing sections.",
    toolSlug: "ONENOTE_CREATE_ME_NOTEBOOKS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user notebook.",
    ],
  }),
  composioTool({
    name: "onenote_create_me_section_groups_sections",
    description: "Creates a new OneNote section within a specified section group of a notebook for the signed-in user. Use this action when you need to add a new section to organize OneNote pages within a user's section group hierarchy. The section name must be unique within the same hierarchy level, cannot exceed 50 characters, and cannot contain the characters: ?*/:<>|&#''%~. This action is idempotent — calling it multiple times with the same display name may create duplicate sections depending on the API's handling of unique-name constraints.",
    toolSlug: "ONENOTE_CREATE_ME_SECTION_GROUPS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create section in user's section group.",
    ],
  }),
  composioTool({
    name: "onenote_create_me_sections_pages",
    description: "Creates a new OneNote page in a specific section for the signed-in user. Use this action when you need to create a new page within a specific section of the user's OneNote notebook. The page content must be provided as HTML. The action constructs a complete HTML document including the title and optional creation timestamp in the meta tag. To include images or attachments, provide the full HTML with external image URLs, or use a multipart request approach. This action is idempotent - creating multiple pages with the same title creates separate pages.",
    toolSlug: "ONENOTE_CREATE_ME_SECTIONS_PAGES",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create OneNote page in section.",
    ],
  }),
  composioTool({
    name: "onenote_create_onenote_group_notebooks_section_groups",
    description: "Creates a new section group within a OneNote notebook that belongs to a Microsoft 365 group. Use this action when you need to organize sections inside a group notebook by creating a new top-level section group to hold related sections together. The displayName must be 50 characters or fewer and cannot contain the characters ? * / : < > | & # ' % ~. Section group names must be unique within the same hierarchy level in the notebook.",
    toolSlug: "ONENOTE_CREATE_ONENOTE_GROUP_NOTEBOOKS_SECTION_GROUPS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create section group in group notebook.",
    ],
  }),
  composioTool({
    name: "onenote_create_site_notebooks_sections",
    description: "Creates a new OneNote section within a specified notebook in a SharePoint site. Use this action when you need to add a new section to organize OneNote pages within a notebook that belongs to a SharePoint site. The section name must be unique within the same hierarchy level, cannot exceed 50 characters, and cannot contain the characters: ?*/:<>|&#''%~. This action is available in the following national cloud deployments: Global service only. Required permissions: Notes.Create (delegated/personal account), Notes.ReadWrite.All (application).",
    toolSlug: "ONENOTE_CREATE_SITE_NOTEBOOKS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create section in site notebook.",
    ],
  }),
  composioTool({
    name: "onenote_create_user_notebooks_sections",
    description: "Creates a new OneNote section within a specified notebook for a specific user. Use this action when you need to add a new section to organize OneNote pages within a notebook that belongs to a specific user. The section name must be unique within the same hierarchy level, cannot exceed 50 characters, and cannot contain the characters: ?*/:<>|&#''%~. Returns the full created section object including the server-assigned ID.",
    toolSlug: "ONENOTE_CREATE_USER_NOTEBOOKS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create section in user notebook.",
    ],
  }),
  composioTool({
    name: "onenote_create_user_pages",
    description: "Creates a new OneNote page in the default section of the default notebook for a specific user. Use this action when you need to programmatically create a new page in a user's OneNote notebook. The page content must be provided as HTML. The page will be created in the default section of the default notebook unless a specific section name is provided via the sectionName query parameter.",
    toolSlug: "ONENOTE_CREATE_USER_PAGES",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user OneNote page.",
    ],
  }),
  composioTool({
    name: "onenote_create_user_section_groups_sections",
    description: "Creates a new OneNote section within a specified section group for a specific user. Use this action when you need to add a new section to organize OneNote pages within a section group's hierarchy for a specific user's notebook. The section name must be unique within the same hierarchy level, cannot exceed 50 characters, and cannot contain the characters: ?*/:<>|&#''%~. This action is idempotent — calling it multiple times with the same display name may create duplicate sections depending on the API's handling of unique-name constraints.",
    toolSlug: "ONENOTE_CREATE_USER_SECTION_GROUPS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create section in user section group.",
    ],
  }),
  composioTool({
    name: "onenote_create_user_sections_pages4",
    description: "Creates a new OneNote page in a specific section of a user's notebook. Use this action when you need to create a new page directly in a section within a user's OneNote notebook. The page content must be provided as valid HTML with proper structure (html, head, and body tags). This action requires the Content-Type header to be set to text/html for the request body. This action is idempotent — calling it multiple times creates separate pages.",
    toolSlug: "ONENOTE_CREATE_USER_SECTIONS_PAGES4",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create user section page.",
    ],
  }),
  composioTool({
    name: "onenote_delete_onenote_group_section_group_page_content",
    description: "Deletes the HTML content of a OneNote page within a section in a section group in a Microsoft 365 group's OneNote workspace. This action is irreversible — the page content will be permanently deleted once removed. Use this action when you need to clear the content of a specific OneNote page within a section group hierarchy in a Microsoft 365 group.",
    toolSlug: "ONENOTE_DELETE_ONENOTE_GROUP_SECTION_GROUP_PAGE_CONTENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete page content from section group section.",
    ],
  }),
  composioTool({
    name: "onenote_delete_onenote_group_sections_pages2",
    description: "Delete a specific OneNote page from a section within a notebook in a group. Use this action when you need to remove a OneNote page permanently from a group's notebook section. This action is irreversible - once deleted, the page cannot be recovered.",
    toolSlug: "ONENOTE_DELETE_ONENOTE_GROUP_SECTIONS_PAGES2",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete OneNote page from section.",
    ],
  }),
  composioTool({
    name: "onenote_delete_site_pages",
    description: "Deletes a OneNote page from a SharePoint site. Use this action when you need to remove a OneNote page permanently from a SharePoint site's OneNote workspace. This action is irreversible - once deleted, the page and all its content cannot be recovered.",
    toolSlug: "ONENOTE_DELETE_SITE_PAGES",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete OneNote page from site.",
    ],
  }),
  composioTool({
    name: "onenote_delete_user_onenote_sections_pages",
    description: "Deletes a OneNote page from a section within a section group in a user's notebook. This action is irreversible — the page and all its content will be permanently deleted once removed. Use this action when you need to remove an unwanted page from a section in a user's OneNote notebook.",
    toolSlug: "ONENOTE_DELETE_USER_ONENOTE_SECTIONS_PAGES",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete user OneNote page from section.",
    ],
  }),
  composioTool({
    name: "onenote_delete_user_pages",
    description: "Deletes a OneNote page from a user's OneNote workspace. This action is irreversible — the page and all its content will be permanently deleted once removed. Use this action when you need to remove an unwanted OneNote page from a user's notebook that has been shared with the current user.",
    toolSlug: "ONENOTE_DELETE_USER_PAGES",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete OneNote page for user.",
    ],
  }),
  composioTool({
    name: "onenote_get_group_sections",
    description: "Retrieves a specific OneNote section from a Microsoft 365 group. Use this action when you need to fetch metadata or details for a single OneNote section by specifying the group ID and section ID. This action supports OData query parameters for selecting specific properties and expanding relationships like parentNotebook or parentSectionGroup.",
    toolSlug: "ONENOTE_GET_GROUP_SECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_me_onenote_resources_value",
    description: "Retrieves the binary content of a specific OneNote resource using its ID. Use this action when you need to fetch the raw binary content of an image, file attachment, or other embedded resource from a OneNote page in the signed-in user's notebooks. The resource is identified by its unique resource_id, which can be obtained from page content URLs. Note: Binary content is returned as-is; images and files may need additional processing (e.g., base64 decoding or writing to a file) depending on your use case.",
    toolSlug: "ONENOTE_GET_ME_ONENOTE_RESOURCES_VALUE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_me_section_page_content",
    description: "Retrieves the HTML content of a specific OneNote page from a section for the signed-in user. Use this action when you need to fetch the full HTML content of a OneNote page within a specific section. This endpoint provides access to page content for processing, rendering, or exporting page data. The returned HTML includes text, images, and other embedded content references. This action is read-only and does not modify any data.",
    toolSlug: "ONENOTE_GET_ME_SECTION_PAGE_CONTENT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_notebook_from_web_url",
    description: "Retrieves a OneNote notebook by using its web URL path. Use this action when you have the SharePoint or OneDrive URL of a notebook and need to retrieve its properties and metadata. The webUrl parameter accepts both standard HTTPS URLs and OneNote protocol URLs with the 'onenote:' prefix. This API is available in the following national cloud deployments: Global service only. Required permissions: Notes.Create (delegated) or Notes.Read.All (application).",
    toolSlug: "ONENOTE_GET_NOTEBOOK_FROM_WEB_URL",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_notebook_section_group",
    description: "Retrieves a specific section group from a OneNote notebook within a Microsoft 365 group. Use this action when you need to get details about a specific section group, including its name, creation/modification timestamps, and links to its sections and nested section groups.",
    toolSlug: "ONENOTE_GET_NOTEBOOK_SECTION_GROUP",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_onenote_group_operations",
    description: "Retrieves the status of a long-running OneNote operation for a group. Use this action when you need to check whether a copy or sync operation (e.g., CopyNotebook, CopyToNotebook, CopyToSectionGroup, CopyToSection) has completed, failed, or is still in progress.",
    toolSlug: "ONENOTE_GET_ONENOTE_GROUP_OPERATIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_onenote_group_sections_pages",
    description: "Retrieves a specific OneNote page from a section within a section group in a Microsoft 365 group's notebook. Use this action when you need to fetch metadata or details for a single OneNote page by navigating through its parent group, notebook, section group, and section hierarchy.",
    toolSlug: "ONENOTE_GET_ONENOTE_GROUP_SECTIONS_PAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_onenote_site_operations",
    description: "Retrieves the status of a long-running OneNote operation for a SharePoint site. Use this action when you need to check whether a copy or sync operation (e.g., CopyNotebook, CopyToNotebook, CopyToSectionGroup, CopyToSection) has completed, failed, or is still in progress for a site.",
    toolSlug: "ONENOTE_GET_ONENOTE_SITE_OPERATIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_onenote_user_page_content",
    description: "Gets the HTML content of a specific OneNote page for a user. Use this action when you need to retrieve the actual HTML content of a specific OneNote page for reading, processing, or displaying page content. The action supports the includeIDs query parameter to include element IDs in the HTML, which is useful when preparing content for page updates via the PATCH endpoint.",
    toolSlug: "ONENOTE_GET_ONENOTE_USER_PAGE_CONTENT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_site_onenote_pages",
    description: "Retrieves a specific OneNote page from a SharePoint site. Use this action when you need to fetch metadata or details for a single OneNote page by its page identifier within a SharePoint site. This action supports optional OData query parameters to select specific properties or expand related entities like parentSection and parentNotebook. Note: This action is read-only and does not modify any data.",
    toolSlug: "ONENOTE_GET_SITE_ONENOTE_PAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_site_pages_preview",
    description: "Retrieves a text preview of a specific OneNote page from a section within a section group in a SharePoint site-hosted notebook. Use this action when you need to quickly get the content preview of a OneNote page from a site-hosted notebook without fetching the full page content. The preview returns a text snippet of the page's content. This action is read-only and does not modify any data.",
    toolSlug: "ONENOTE_GET_SITE_PAGES_PREVIEW",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_site_sections",
    description: "Retrieves a specific OneNote section from a SharePoint site. Use this action when you need to fetch metadata or details for a single OneNote section by specifying the site ID and section ID. This action supports OData query parameters for selecting specific properties and expanding relationships like parentNotebook or parentSectionGroup.",
    toolSlug: "ONENOTE_GET_SITE_SECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_site_sections_pages",
    description: "Retrieves a specific OneNote page from a section within a section group in a SharePoint site notebook. Use this action when you need to fetch metadata or details for a single OneNote page by navigating through its parent site, notebook, section group, and section hierarchy. This is useful for retrieving page information from deeply nested notebook structures within SharePoint sites.",
    toolSlug: "ONENOTE_GET_SITE_SECTIONS_PAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_user_notebook",
    description: "Retrieves the properties and relationships of a OneNote notebook by ID for a specific user. Use this action when you need to fetch details about a specific notebook belonging to a user, including its display name, sharing status, section URLs, and the user's role on the notebook. Supports OData $select and $expand query parameters to customize the response.",
    toolSlug: "ONENOTE_GET_USER_NOTEBOOK",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_user_pages",
    description: "Retrieves a specific OneNote page from a user's OneNote notebooks. Use this action when you need to fetch metadata or details for a single OneNote page directly by page ID and user ID. This is useful for retrieving page information without navigating through the full notebook/section hierarchy. The default response expands the parentSection relationship and selects its id, name, and self properties.",
    toolSlug: "ONENOTE_GET_USER_PAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_get_user_parent_section_group2",
    description: "Retrieves the parent section group of a OneNote section within a user's notebook. Use this action when you need to navigate up the OneNote hierarchy from a section to its parent section group, for example to determine which section group contains a specific section.",
    toolSlug: "ONENOTE_GET_USER_PARENT_SECTION_GROUP2",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_group_notebook_section_groups",
    description: "Retrieves a list of section groups from the specified notebook within a Microsoft 365 group. Use this action when you need to list all section groups in a group-owned OneNote notebook to understand its structure or to find a specific section group.",
    toolSlug: "ONENOTE_LIST_GROUP_NOTEBOOK_SECTION_GROUPS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_group_notebook_section_pages",
    description: "Lists all OneNote pages from a specific section within a notebook in a Microsoft 365 group. Use this action when you need to retrieve all pages from a known section in a group notebook. This action accesses pages directly through the section path without going through section groups.",
    toolSlug: "ONENOTE_LIST_GROUP_NOTEBOOK_SECTION_PAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_group_section_groups_sections",
    description: "Lists all OneNote sections from a specific section group within a Microsoft 365 group's OneNote. Use this action when you need to retrieve the sections contained within a section group in a group-owned OneNote notebook. Supports pagination and filtering via OData query parameters. This is a read-only operation that retrieves existing sections without modifying any data.",
    toolSlug: "ONENOTE_LIST_GROUP_SECTION_GROUPS_SECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_me_onenote_sections_pages4",
    description: "Retrieves a list of OneNote pages from a specific section for the current user. Use this action when you need to retrieve all pages from a specific section in the current user's OneNote notebook. This action supports pagination, filtering, sorting, and relationship expansion via OData query parameters. The default query returns the top 20 pages ordered by lastModifiedTime descending. Note: This action is read-only and does not modify any data.",
    toolSlug: "ONENOTE_LIST_ME_ONENOTE_SECTIONS_PAGES4",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_onenote_group_pages",
    description: "Lists all OneNote pages from a Microsoft 365 group. Use this action when you need to retrieve all OneNote pages within a Microsoft 365 group. Supports pagination via the page_size parameter. The default page size is 25, and the maximum is 100. Results are ordered by lastModifiedDateTime descending by default.",
    toolSlug: "ONENOTE_LIST_ONENOTE_GROUP_PAGES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_onenote_group_section_groups_section_groups2",
    description: "Lists all section groups from a specified parent section group within a Microsoft 365 group's OneNote notebook. Use this action when you need to retrieve the nested section groups within a section group in a group context to navigate the OneNote notebook hierarchy. This action supports OData query parameters for filtering, sorting, pagination, and expanding related entities.",
    toolSlug: "ONENOTE_LIST_ONENOTE_GROUP_SECTION_GROUPS_SECTION_GROUPS2",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_onenote_group_sections_pages4",
    description: "Lists all OneNote pages from a specific section in a Microsoft 365 group. Use this action when you need to retrieve all pages from a known section in a group notebook without specifying the notebook ID. This action supports pagination, filtering, sorting, and relationship expansion via OData query parameters. Note: This action is read-only and does not modify any data.",
    toolSlug: "ONENOTE_LIST_ONENOTE_GROUP_SECTIONS_PAGES4",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_site_notebook_section_groups",
    description: "Retrieves a list of section groups from the specified notebook within a SharePoint site. Use this action when you need to list all section groups in a SharePoint site-owned OneNote notebook to understand its structure or to find a specific section group. The default sort order is name ascending. The default query expands parentNotebook and selects its id, displayName, and self properties.",
    toolSlug: "ONENOTE_LIST_SITE_NOTEBOOK_SECTION_GROUPS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_site_pages_content",
    description: "Retrieves the HTML content of a specific OneNote page within a SharePoint site. Use this action when you need to fetch the full HTML content of a OneNote page from a SharePoint site for processing, rendering, or exporting page data. This endpoint provides direct access to page content without requiring notebook or section context. Returns the raw HTML content of the page, including text, images, and other embedded content references. Note: This action is read-only and does not modify any data.",
    toolSlug: "ONENOTE_LIST_SITE_PAGES_CONTENT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_site_sections",
    description: "Retrieves a list of OneNote sections from a SharePoint site. Use this action when you need to list all OneNote sections within a SharePoint site's OneNote notebook to understand its structure or to find a specific section. This is a read-only operation that retrieves existing sections without modifying any data. Supports OData query parameters for filtering, sorting, pagination, and property expansion. The default sort order is name ascending. The default query expands parentNotebook and selects its id, displayName, and self properties.",
    toolSlug: "ONENOTE_LIST_SITE_SECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_user_notebook_sections",
    description: "Lists all OneNote sections from a specified notebook belonging to a user. Use this action when you need to retrieve all sections within a notebook that is owned by or accessible to a specific user. Supports OData query parameters for filtering, sorting, and pagination. Note: The user_id can be a GUID or user principal name (UPN). Use 'me' to reference the signed-in user. The default sort order is by display name ascending. This is a read-only operation.",
    toolSlug: "ONENOTE_LIST_USER_NOTEBOOK_SECTIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_list_user_notebooks",
    description: "Lists all OneNote notebooks accessible by a specific user. Use this action when you need to retrieve the available notebooks for a user, display notebook listings, or browse notebooks that are owned by or shared with a specific user. Supports OData query parameters for filtering, sorting, and pagination. Note: The user_id can be a GUID or a user principal name (UPN). Use 'me' to reference the signed-in user.",
    toolSlug: "ONENOTE_LIST_USER_NOTEBOOKS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "onenote",
      "read",
    ],
  }),
  composioTool({
    name: "onenote_update_me_page_content",
    description: "Update the content of a OneNote page for the signed-in user. Sends a PATCH request with patch content commands to modify the HTML structure of a OneNote page. Supports appending children, inserting siblings, replacing elements, prepending content, and deleting elements. Use this action when you need to update or modify the content of an existing OneNote page owned by the signed-in user, such as adding new paragraphs, inserting images, modifying lists, or replacing/removing existing elements. This action is idempotent for replace, append, prepend, and insert operations, but delete operations are irreversible — deleted elements cannot be recovered once removed.",
    toolSlug: "ONENOTE_UPDATE_ME_PAGE_CONTENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Update my OneNote page content.",
    ],
  }),
  composioTool({
    name: "onenote_update_me_sections",
    description: "Updates the navigation property sections in me. Use when you need to modify properties of an existing OneNote section, such as renaming it, within the current user's notebooks. This action uses a PATCH request to update the section entity at the specified path. Use this action when you need to update a specific OneNote section owned by the authenticated user, such as changing its display name. This is an idempotent operation that modifies the specified properties while preserving all other existing values. Note: Only the displayName property can be updated via this endpoint. Other properties like isDefault, createdDateTime, etc. are read-only.",
    toolSlug: "ONENOTE_UPDATE_ME_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update my OneNote section.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "onenote_update_onenote_page_content",
    description: "Update the content of a OneNote page within a Microsoft 365 group using HTML patch commands. Use this action when you need to modify the content of an existing OneNote page, such as replacing text, inserting new content, or appending elements. The action supports multiple patch commands in a single request. The API returns 204 No Content on success, meaning no JSON response body is returned.",
    toolSlug: "ONENOTE_UPDATE_ONENOTE_PAGE_CONTENT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update OneNote page content.",
    ],
  }),
  composioTool({
    name: "onenote_update_site_notebooks_sections",
    description: "Updates a OneNote section within a notebook in a SharePoint site. Use this action when you need to modify properties of an existing section, such as renaming it. This action uses a PATCH request to update the section entity at the specified path within the site's notebook hierarchy. Note: Only the displayName property of a section can be updated via this endpoint. Other properties like createdDateTime, isDefault, etc. are read-only.",
    toolSlug: "ONENOTE_UPDATE_SITE_NOTEBOOKS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update section in site notebook.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "onenote_update_site_pages_content",
    description: "Update the content of a OneNote page within a SharePoint site. Sends a PATCH request with patch content commands to modify the HTML structure of a OneNote page. Supports appending children, inserting siblings, replacing elements, prepending content, and deleting elements. Use this action when you need to update or modify the content of an existing OneNote page within a SharePoint site, such as adding new paragraphs, inserting images, modifying lists, or replacing/removing existing elements. This action is idempotent for replace, append, prepend, and insert operations, but delete operations are irreversible — deleted elements cannot be recovered once removed.",
    toolSlug: "ONENOTE_UPDATE_SITE_PAGES_CONTENT",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Update site OneNote page content.",
    ],
  }),
  composioTool({
    name: "onenote_update_site_section_groups_sections",
    description: "Updates a OneNote section within a section group in a SharePoint site notebook. Use this action when you need to modify properties of an existing OneNote section, such as updating its display name. This action uses a PATCH request to update the section entity at the specified path within the SharePoint site's notebook hierarchy. Note: Only the displayName property can be updated via this endpoint. Other properties are read-only.",
    toolSlug: "ONENOTE_UPDATE_SITE_SECTION_GROUPS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update site section group section.",
    ],
  }),
  composioTool({
    name: "onenote_update_user_notebooks_sections",
    description: "Updates a OneNote section within a user's notebook. Use this action when you need to modify properties of an existing OneNote section, such as renaming it, for a specific user identified by their Microsoft Graph user ID. This action uses a PATCH request to update the section entity at the specified path within the user's notebook hierarchy. Note: Only the displayName property can be updated via this endpoint. Other properties like isDefault, createdDateTime, etc. are read-only.",
    toolSlug: "ONENOTE_UPDATE_USER_NOTEBOOKS_SECTIONS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "onenote",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update section in user notebook.",
    ],
    idempotent: true,
  }),
];
