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
    integration: "microsoft-excel",
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
      toolkit: "excel",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const microsoftExcelComposioTools: IntegrationTool[] = [
  composioTool({
    name: "excel_add_chart",
    description: "Add a chart to a worksheet using Microsoft Graph API.",
    toolSlug: "EXCEL_ADD_CHART",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Chart.",
    ],
  }),
  composioTool({
    name: "excel_add_sharepoint_worksheet",
    description: "Add a new worksheet to a SharePoint Excel workbook using Microsoft Graph Sites API.",
    toolSlug: "EXCEL_ADD_SHAREPOINT_WORKSHEET",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
      "sharepoint",
    ],
    askBefore: [
      "Confirm the parameters before executing Add SharePoint Worksheet.",
    ],
  }),
  composioTool({
    name: "excel_add_table",
    description: "Create a new table in a worksheet using the Microsoft Graph API.",
    toolSlug: "EXCEL_ADD_TABLE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Table.",
    ],
  }),
  composioTool({
    name: "excel_add_table_column",
    description: "Add a column to a table using Microsoft Graph API.",
    toolSlug: "EXCEL_ADD_TABLE_COLUMN",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Table Column.",
    ],
  }),
  composioTool({
    name: "excel_add_table_row",
    description: "Add a row to a table using Microsoft Graph API.",
    toolSlug: "EXCEL_ADD_TABLE_ROW",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Table Row.",
    ],
  }),
  composioTool({
    name: "excel_add_workbook_permission",
    description: "Tool to grant access to a workbook via invite. Use when you need to share a specific workbook file with designated recipients and roles.",
    toolSlug: "EXCEL_ADD_WORKBOOK_PERMISSION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Workbook Permission.",
    ],
  }),
  composioTool({
    name: "excel_add_worksheet",
    description: "Add a new worksheet to an Excel workbook using Microsoft Graph API.",
    toolSlug: "EXCEL_ADD_WORKSHEET",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Add Worksheet.",
    ],
  }),
  composioTool({
    name: "excel_apply_table_filter",
    description: "Apply a filter to a table column using Microsoft Graph API.",
    toolSlug: "EXCEL_APPLY_TABLE_FILTER",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Apply Table Filter.",
    ],
  }),
  composioTool({
    name: "excel_apply_table_sort",
    description: "Apply a sort to a table using Microsoft Graph API.",
    toolSlug: "EXCEL_APPLY_TABLE_SORT",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Apply Table Sort.",
    ],
  }),
  composioTool({
    name: "excel_clear_range",
    description: "Tool to clear values, formats, or contents in a specified worksheet range. Use when you need to reset cells before adding new data.",
    toolSlug: "EXCEL_CLEAR_RANGE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Clear Range.",
    ],
  }),
  composioTool({
    name: "excel_clear_table_filter",
    description: "Clear a filter from a table column using Microsoft Graph API.",
    toolSlug: "EXCEL_CLEAR_TABLE_FILTER",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Clear Table Filter.",
    ],
  }),
  composioTool({
    name: "excel_close_session",
    description: "Tool to close an existing Excel workbook session. Use when you need to explicitly end a persistent session to release workbook locks. Note: The Microsoft Graph closeSession API is idempotent - it returns 204 for both active and already-closed sessions. This action validates the session first and returns an error for invalid or already-closed sessions to provide clearer user feedback. The validation uses refreshSession which is the only API endpoint that can detect closed sessions.",
    toolSlug: "EXCEL_CLOSE_SESSION",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Close Excel Session.",
    ],
  }),
  composioTool({
    name: "excel_convert_table_to_range",
    description: "Convert a table to a range using Microsoft Graph API.",
    toolSlug: "EXCEL_CONVERT_TABLE_TO_RANGE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Convert Table To Range.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "excel_create_workbook",
    description: "Tool to create a new Excel workbook file at a specified drive path. Generates a new .xlsx file with specified worksheets and data, then uploads it to OneDrive.",
    toolSlug: "EXCEL_CREATE_WORKBOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Workbook.",
    ],
  }),
  composioTool({
    name: "excel_delete_table_column",
    description: "Delete a column from a table using Microsoft Graph API.",
    toolSlug: "EXCEL_DELETE_TABLE_COLUMN",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Table Column.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "excel_delete_table_row",
    description: "Delete a row from a table using Microsoft Graph API.",
    toolSlug: "EXCEL_DELETE_TABLE_ROW",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Table Row.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "excel_delete_worksheet",
    description: "Tool to delete a worksheet from the workbook. Use when cleaning up unused or temporary sheets after verifying no dependencies exist. Example: \"Delete 'Sheet2' after review.\"",
    toolSlug: "EXCEL_DELETE_WORKSHEET",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing Delete Worksheet.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "excel_export_workbook_to_pdf",
    description: "Tool to export an Excel workbook to PDF via Microsoft Graph's format conversion. Use when you need a PDF version of an Excel file for sending, storing, or attaching.",
    toolSlug: "EXCEL_EXPORT_WORKBOOK_TO_PDF",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Export Workbook to PDF.",
    ],
  }),
  composioTool({
    name: "excel_get_chart_axis",
    description: "Tool to retrieve a specific axis from a chart. Use when you need properties like min, max, interval, and formatting of the chart axis.",
    toolSlug: "EXCEL_GET_CHART_AXIS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_get_chart_data_labels",
    description: "Tool to retrieve the data labels object of a chart. Use when you need to inspect label settings like position, separator, and visibility flags after creating or updating a chart.",
    toolSlug: "EXCEL_GET_CHART_DATA_LABELS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_get_chart_legend",
    description: "Tool to retrieve the legend object of a chart. Use after creating or updating a chart when you need to inspect legend visibility and formatting.",
    toolSlug: "EXCEL_GET_CHART_LEGEND",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_get_range",
    description: "Get a range from a worksheet using Microsoft Graph API.",
    toolSlug: "EXCEL_GET_RANGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_get_session",
    description: "Create a session for an Excel workbook using Microsoft Graph API.",
    toolSlug: "EXCEL_GET_SESSION",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Excel Session.",
    ],
  }),
  composioTool({
    name: "excel_get_sharepoint_range",
    description: "Get a range from a worksheet in SharePoint using Microsoft Graph Sites API.",
    toolSlug: "EXCEL_GET_SHAREPOINT_RANGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
      "sharepoint",
    ],
  }),
  composioTool({
    name: "excel_get_sharepoint_worksheet",
    description: "Get a worksheet by name or ID from a SharePoint Excel workbook using Microsoft Graph Sites API.",
    toolSlug: "EXCEL_GET_SHAREPOINT_WORKSHEET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
      "sharepoint",
    ],
  }),
  composioTool({
    name: "excel_get_table_column",
    description: "Tool to retrieve a specific column from a workbook table. Use when you need to fetch column properties and data by its ID or name.",
    toolSlug: "EXCEL_GET_TABLE_COLUMN",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_get_workbook",
    description: "Tool to retrieve the properties and relationships of a workbook. Use when you need to inspect comments, names, tables, or worksheets.",
    toolSlug: "EXCEL_GET_WORKBOOK",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_get_worksheet",
    description: "Get a worksheet by name or ID from an Excel workbook using Microsoft Graph API.",
    toolSlug: "EXCEL_GET_WORKSHEET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_get_worksheet_used_range",
    description: "Tool to retrieve a worksheet's used range (active data region) without specifying a fixed range address. Use when you need to read all data from a sheet but don't know the exact range. The valuesOnly option helps filter out formatting-only cells.",
    toolSlug: "EXCEL_GET_WORKSHEET_USED_RANGE",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
      "ranges",
    ],
  }),
  composioTool({
    name: "excel_insert_range",
    description: "Tool to insert a new cell range into a worksheet, shifting existing cells down or right. Use when you need to create space for new content without overwriting.",
    toolSlug: "EXCEL_INSERT_RANGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Insert Range.",
    ],
  }),
  composioTool({
    name: "excel_list_chart_series",
    description: "Tool to list all data series in a chart. Use when you need to enumerate chart series for further analysis.",
    toolSlug: "EXCEL_LIST_CHART_SERIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_charts",
    description: "List charts in a worksheet using Microsoft Graph API.",
    toolSlug: "EXCEL_LIST_CHARTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_comments",
    description: "Tool to list comments in an Excel workbook. Use when you need to retrieve all workbook comments via Microsoft Graph API.",
    toolSlug: "EXCEL_LIST_COMMENTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_drive_item_children",
    description: "Tool to list immediate children (files/folders) of a folder DriveItem using driveId and itemId. Returns an array of child DriveItems with stable identifiers and pagination support.",
    toolSlug: "EXCEL_LIST_DRIVE_ITEM_CHILDREN",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
      "files",
    ],
  }),
  composioTool({
    name: "excel_list_files",
    description: "List files and folders in a drive root or specified path.",
    toolSlug: "EXCEL_LIST_FILES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_named_items",
    description: "List named items in a workbook using Microsoft Graph API.",
    toolSlug: "EXCEL_LIST_NAMED_ITEMS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_sharepoint_tables",
    description: "List tables in a SharePoint worksheet using Microsoft Graph Sites API.",
    toolSlug: "EXCEL_LIST_SHAREPOINT_TABLES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
      "sharepoint",
    ],
  }),
  composioTool({
    name: "excel_list_sharepoint_worksheets",
    description: "List worksheets in an Excel workbook stored in SharePoint using Microsoft Graph Sites API.",
    toolSlug: "EXCEL_LIST_SHAREPOINT_WORKSHEETS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
      "sharepoint",
    ],
  }),
  composioTool({
    name: "excel_list_table_columns",
    description: "List columns in a table using Microsoft Graph API.",
    toolSlug: "EXCEL_LIST_TABLE_COLUMNS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_table_rows",
    description: "List rows in a table using Microsoft Graph API.",
    toolSlug: "EXCEL_LIST_TABLE_ROWS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_tables",
    description: "List tables in a worksheet using Microsoft Graph API. This action retrieves information about all tables present in a specified worksheet of an Excel file. It requires the file ID and worksheet name or ID, and can optionally use a session ID for workbook operations.",
    toolSlug: "EXCEL_LIST_TABLES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_workbook_permissions",
    description: "Tool to list permissions set on the workbook file. Use when you need to see which users or links have access to a specific Excel file by supplying its drive and item IDs. Example: \"List permissions for workbook with drive_id 'b!abc123' and item_id '0123456789abcdef'.\"",
    toolSlug: "EXCEL_LIST_WORKBOOK_PERMISSIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_list_worksheets",
    description: "List worksheets in an Excel workbook using Microsoft Graph API.",
    toolSlug: "EXCEL_LIST_WORKSHEETS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
    ],
  }),
  composioTool({
    name: "excel_merge_cells",
    description: "Merge cells in a worksheet range using Microsoft Graph API.",
    toolSlug: "EXCEL_MERGE_CELLS",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Merge Cells.",
    ],
  }),
  composioTool({
    name: "excel_protect_worksheet",
    description: "Tool to protect a worksheet using optional protection options. Use when you need to prevent editing certain parts of a sheet before sharing. Example: \"Protect 'Sheet1' to lock formatting and sorting.\"",
    toolSlug: "EXCEL_PROTECT_WORKSHEET",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Protect Worksheet.",
    ],
  }),
  composioTool({
    name: "excel_search_files",
    description: "Tool to search OneDrive drive items by query to discover Excel workbook IDs. Use when you need to find Excel files by name before performing workbook operations.",
    toolSlug: "EXCEL_SEARCH_FILES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "microsoft-excel",
      "read",
      "search",
    ],
  }),
  composioTool({
    name: "excel_sort_range",
    description: "Sort a range in a worksheet using Microsoft Graph API.",
    toolSlug: "EXCEL_SORT_RANGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Sort Range.",
    ],
  }),
  composioTool({
    name: "excel_update_chart",
    description: "Update a chart in a worksheet using Microsoft Graph API.",
    toolSlug: "EXCEL_UPDATE_CHART",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Chart.",
    ],
  }),
  composioTool({
    name: "excel_update_chart_legend",
    description: "Tool to update formatting or position of a chart legend. Use when adjusting legend settings after confirming chart and worksheet exist.",
    toolSlug: "EXCEL_UPDATE_CHART_LEGEND",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Chart Legend.",
    ],
  }),
  composioTool({
    name: "excel_update_range",
    description: "Update a range in a worksheet using Microsoft Graph API.",
    toolSlug: "EXCEL_UPDATE_RANGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Range.",
    ],
  }),
  composioTool({
    name: "excel_update_sharepoint_range",
    description: "Update a range in a SharePoint worksheet using Microsoft Graph Sites API.",
    toolSlug: "EXCEL_UPDATE_SHAREPOINT_RANGE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
      "sharepoint",
    ],
    askBefore: [
      "Confirm the parameters before executing Update SharePoint Range.",
    ],
  }),
  composioTool({
    name: "excel_update_table",
    description: "Update a table in a workbook using Microsoft Graph API.",
    toolSlug: "EXCEL_UPDATE_TABLE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Table.",
    ],
  }),
  composioTool({
    name: "excel_update_worksheet",
    description: "Update worksheet properties (name, position) in an Excel workbook using Microsoft Graph API.",
    toolSlug: "EXCEL_UPDATE_WORKSHEET",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Worksheet.",
    ],
  }),
  composioTool({
    name: "excel_upload_workbook",
    description: "Tool to upload an external Excel file from a URL into OneDrive/SharePoint. Downloads the file server-side and uploads it to the specified drive location, returning the driveItem metadata for subsequent Excel operations.",
    toolSlug: "EXCEL_UPLOAD_WORKBOOK",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "microsoft-excel",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload Workbook from URL.",
    ],
  }),
];
