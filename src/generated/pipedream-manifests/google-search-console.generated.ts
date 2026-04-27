import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const GoogleSearchConsolePipedreamToolManifests = [
  {
    "integration": "google-search-console",
    "name": "google-search-console_retrieve_site_performance_data",
    "description": "Fetches search analytics from Google Search Console for a verified site.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "siteUrl": {
          "type": "string",
          "title": "Site",
          "description": "Select a verified site from your Google Search Console. For subdomains, select the domain property and use dimension filters."
        },
        "startDate": {
          "type": "string",
          "title": "Start Date (YYYY-MM-DD)",
          "description": "Start date of the range for which to retrieve site performance data"
        },
        "endDate": {
          "type": "string",
          "title": "End Date (YYYY-MM-DD)",
          "description": "End date of the range for which to retrieve site performance data"
        },
        "dimensions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Dimensions",
          "description": "e.g. ['query', 'page', 'country', 'device']"
        },
        "searchType": {
          "type": "string",
          "title": "Search Type",
          "description": "The type of search to use"
        },
        "aggregationType": {
          "type": "string",
          "title": "Aggregation Type",
          "description": "The aggregation type to use"
        },
        "rowLimit": {
          "type": "number",
          "title": "Max Rows",
          "description": "Max number of rows to return"
        },
        "startRow": {
          "type": "number",
          "title": "Start Row",
          "description": "Start row (for pagination)"
        },
        "subdomainFilter": {
          "type": "string",
          "title": "Subdomain Filter",
          "description": "Filter results to a specific subdomain when using a domain property (e.g., `https://subdomain.example.com`). This will include all subpages of the subdomain."
        },
        "filterDimension": {
          "type": "string",
          "title": "Filter Dimension",
          "description": "Dimension to filter by (defaults to page when subdomain filter is used). Using 'page' will match the subdomain and all its subpages."
        },
        "filterOperator": {
          "type": "string",
          "title": "Filter Operator",
          "description": "Operator to use for filtering (defaults to contains when subdomain filter is used)"
        },
        "advancedDimensionFilters": {
          "type": "object",
          "title": "Advanced Dimension Filters",
          "description": "For advanced use cases: custom dimension filter groups following Search Console API structure."
        },
        "dataState": {
          "type": "string",
          "title": "Data State",
          "description": "The data state to use"
        }
      },
      "required": [
        "siteUrl",
        "startDate",
        "endDate"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-search-console",
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
      "app": "google_search_console",
      "componentId": "google_search_console-retrieve-site-performance-data",
      "version": "0.0.5",
      "authPropNames": [
        "googleSearchConsole"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleSearchConsole",
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
          "name": "siteUrl",
          "type": "string",
          "label": "Site",
          "description": "Select a verified site from your Google Search Console. For subdomains, select the domain property and use dimension filters.",
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
          "name": "startDate",
          "type": "string",
          "label": "Start Date (YYYY-MM-DD)",
          "description": "Start date of the range for which to retrieve site performance data",
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
          "name": "endDate",
          "type": "string",
          "label": "End Date (YYYY-MM-DD)",
          "description": "End date of the range for which to retrieve site performance data",
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
          "name": "dimensions",
          "type": "string[]",
          "label": "Dimensions",
          "description": "e.g. ['query', 'page', 'country', 'device']",
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
          "name": "searchType",
          "type": "string",
          "label": "Search Type",
          "description": "The type of search to use",
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
          "name": "aggregationType",
          "type": "string",
          "label": "Aggregation Type",
          "description": "The aggregation type to use",
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
          "name": "rowLimit",
          "type": "integer",
          "label": "Max Rows",
          "description": "Max number of rows to return",
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
          "name": "startRow",
          "type": "integer",
          "label": "Start Row",
          "description": "Start row (for pagination)",
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
          "name": "subdomainFilter",
          "type": "string",
          "label": "Subdomain Filter",
          "description": "Filter results to a specific subdomain when using a domain property (e.g., `https://subdomain.example.com`). This will include all subpages of the subdomain.",
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
          "name": "filterDimension",
          "type": "string",
          "label": "Filter Dimension",
          "description": "Dimension to filter by (defaults to page when subdomain filter is used). Using 'page' will match the subdomain and all its subpages.",
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
          "name": "filterOperator",
          "type": "string",
          "label": "Filter Operator",
          "description": "Operator to use for filtering (defaults to contains when subdomain filter is used)",
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
          "name": "advancedDimensionFilters",
          "type": "object",
          "label": "Advanced Dimension Filters",
          "description": "For advanced use cases: custom dimension filter groups following Search Console API structure.",
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
          "name": "dataState",
          "type": "string",
          "label": "Data State",
          "description": "The data state to use",
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
      "app": "google_search_console",
      "componentKey": "google_search_console-retrieve-site-performance-data",
      "componentName": "Retrieve Site Performance Data"
    }
  },
  {
    "integration": "google-search-console",
    "name": "google-search-console_submit_url_for_indexing",
    "description": "Sends a URL update notification to the Google Indexing API",
    "inputSchema": {
      "type": "object",
      "properties": {
        "siteUrl": {
          "type": "string",
          "title": "URL for indexing",
          "description": "URL to be submitted for indexing (must be a canonical URL that's verified in Google Search Console)"
        },
        "notificationType": {
          "type": "string",
          "title": "Notification Type",
          "description": "Type of notification to send to Google",
          "enum": [
            "URL_UPDATED",
            "URL_DELETED"
          ]
        }
      },
      "required": [
        "siteUrl",
        "notificationType"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-search-console",
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
      "app": "google_search_console",
      "componentId": "google_search_console-submit-url-for-indexing",
      "version": "0.0.5",
      "authPropNames": [
        "googleSearchConsole"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleSearchConsole",
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
          "name": "siteUrl",
          "type": "string",
          "label": "URL for indexing",
          "description": "URL to be submitted for indexing (must be a canonical URL that's verified in Google Search Console)",
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
          "name": "notificationType",
          "type": "string",
          "label": "Notification Type",
          "description": "Type of notification to send to Google",
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
              "label": "URL Updated (content has been updated)",
              "value": "URL_UPDATED"
            },
            {
              "label": "URL Deleted (page no longer exists)",
              "value": "URL_DELETED"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "google_search_console",
      "componentKey": "google_search_console-submit-url-for-indexing",
      "componentName": "Submit URL for Indexing"
    }
  }
] satisfies PipedreamActionToolManifest[];
