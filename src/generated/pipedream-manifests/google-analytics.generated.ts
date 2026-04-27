import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const GoogleAnalyticsPipedreamToolManifests = [
  {
    "integration": "google-analytics",
    "name": "google-analytics_create_ga4_property",
    "description": "Creates a new GA4 property. [See the documentation](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "account": {
          "type": "string",
          "title": "Account",
          "description": "The Google Analytics account ID to list properties from."
        },
        "displayName": {
          "type": "string",
          "title": "Display Name",
          "description": "Human-readable display name for this property. The max allowed display name length is 100 UTF-16 code units."
        },
        "timeZone": {
          "type": "string",
          "title": "Time Zone",
          "description": "The reporting time zone for the property. Must be a valid value from [the IANA timezone database](https://www.iana.org/time-zones)."
        },
        "industryCategory": {
          "type": "string",
          "title": "Industry Category",
          "description": "The industry category associated with the property.",
          "enum": [
            "INDUSTRY_CATEGORY_UNSPECIFIED",
            "AUTOMOTIVE",
            "BUSINESS_AND_INDUSTRIAL_MARKETS",
            "FINANCE",
            "HEALTHCARE",
            "TECHNOLOGY",
            "TRAVEL",
            "OTHER",
            "ARTS_AND_ENTERTAINMENT",
            "BEAUTY_AND_FITNESS",
            "BOOKS_AND_LITERATURE",
            "FOOD_AND_DRINK",
            "GAMES",
            "HOBBIES_AND_LEISURE",
            "HOME_AND_GARDEN",
            "INTERNET_AND_TELECOM",
            "LAW_AND_GOVERNMENT",
            "NEWS",
            "ONLINE_COMMUNITIES",
            "PEOPLE_AND_SOCIETY",
            "PETS_AND_ANIMALS",
            "REAL_ESTATE",
            "REFERENCE",
            "SCIENCE",
            "SPORTS",
            "JOBS_AND_EDUCATION",
            "SHOPPING"
          ]
        },
        "currencyCode": {
          "type": "string",
          "title": "Currency Code",
          "description": "The currency type to be used in reports involving monetary values, [in ISO 4217 format](https://en.wikipedia.org/wiki/ISO_4217). Examples: `USD`, `EUR`, `JPY`"
        }
      },
      "required": [
        "account",
        "displayName",
        "timeZone"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-analytics",
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
      "app": "google_analytics",
      "componentId": "google_analytics-create-ga4-property",
      "version": "0.1.2",
      "authPropNames": [
        "googleAnalytics"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "googleAnalytics",
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
          "name": "account",
          "type": "string",
          "label": "Account",
          "description": "The Google Analytics account ID to list properties from.",
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
          "name": "displayName",
          "type": "string",
          "label": "Display Name",
          "description": "Human-readable display name for this property. The max allowed display name length is 100 UTF-16 code units.",
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
          "name": "timeZone",
          "type": "string",
          "label": "Time Zone",
          "description": "The reporting time zone for the property. Must be a valid value from [the IANA timezone database](https://www.iana.org/time-zones).",
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
          "name": "industryCategory",
          "type": "string",
          "label": "Industry Category",
          "description": "The industry category associated with the property.",
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
              "label": "Industry category unspecified",
              "value": "INDUSTRY_CATEGORY_UNSPECIFIED"
            },
            {
              "label": "Automotive",
              "value": "AUTOMOTIVE"
            },
            {
              "label": "Business and industrial markets",
              "value": "BUSINESS_AND_INDUSTRIAL_MARKETS"
            },
            {
              "label": "Finance",
              "value": "FINANCE"
            },
            {
              "label": "Healthcare",
              "value": "HEALTHCARE"
            },
            {
              "label": "Technology",
              "value": "TECHNOLOGY"
            },
            {
              "label": "Travel",
              "value": "TRAVEL"
            },
            {
              "label": "Other",
              "value": "OTHER"
            },
            {
              "label": "Arts and entertainment",
              "value": "ARTS_AND_ENTERTAINMENT"
            },
            {
              "label": "Beauty and fitness",
              "value": "BEAUTY_AND_FITNESS"
            },
            {
              "label": "Books and literature",
              "value": "BOOKS_AND_LITERATURE"
            },
            {
              "label": "Food and drink",
              "value": "FOOD_AND_DRINK"
            },
            {
              "label": "Games",
              "value": "GAMES"
            },
            {
              "label": "Hobbies and leisure",
              "value": "HOBBIES_AND_LEISURE"
            },
            {
              "label": "Home and garden",
              "value": "HOME_AND_GARDEN"
            },
            {
              "label": "Internet and telecom",
              "value": "INTERNET_AND_TELECOM"
            },
            {
              "label": "Law and government",
              "value": "LAW_AND_GOVERNMENT"
            },
            {
              "label": "News",
              "value": "NEWS"
            },
            {
              "label": "Online communities",
              "value": "ONLINE_COMMUNITIES"
            },
            {
              "label": "People and society",
              "value": "PEOPLE_AND_SOCIETY"
            },
            {
              "label": "Pets and animals",
              "value": "PETS_AND_ANIMALS"
            },
            {
              "label": "Real estate",
              "value": "REAL_ESTATE"
            },
            {
              "label": "Reference",
              "value": "REFERENCE"
            },
            {
              "label": "Science",
              "value": "SCIENCE"
            },
            {
              "label": "Sports",
              "value": "SPORTS"
            },
            {
              "label": "Jobs and education",
              "value": "JOBS_AND_EDUCATION"
            },
            {
              "label": "Shopping",
              "value": "SHOPPING"
            }
          ]
        },
        {
          "name": "currencyCode",
          "type": "string",
          "label": "Currency Code",
          "description": "The currency type to be used in reports involving monetary values, [in ISO 4217 format](https://en.wikipedia.org/wiki/ISO_4217). Examples: `USD`, `EUR`, `JPY`",
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
      "app": "google_analytics",
      "componentKey": "google_analytics-create-ga4-property",
      "componentName": "Create GA4 Property"
    }
  },
  {
    "integration": "google-analytics",
    "name": "google-analytics_create_key_event",
    "description": "Creates a new key event. [See the documentation](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties.keyEvents/create)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "parent": {
          "type": "string",
          "title": "Property",
          "description": "The resource name of the parent property where this Key Event will be created. Format: `properties/123`"
        },
        "eventName": {
          "type": "string",
          "title": "Event Name",
          "description": "Immutable. The event name for this key event. Examples: `click`, `purchase`"
        },
        "countingMethod": {
          "type": "string",
          "title": "Counting Method",
          "description": "The method by which Key Events will be counted across multiple events within a session.",
          "enum": [
            "COUNTING_METHOD_UNSPECIFIED",
            "ONCE_PER_EVENT",
            "ONCE_PER_SESSION"
          ]
        }
      },
      "required": [
        "parent",
        "eventName",
        "countingMethod"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "google-analytics",
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
      "app": "google_analytics",
      "componentId": "google_analytics-create-key-event",
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
          "name": "parent",
          "type": "string",
          "label": "Property",
          "description": "The resource name of the parent property where this Key Event will be created. Format: `properties/123`",
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
          "name": "eventName",
          "type": "string",
          "label": "Event Name",
          "description": "Immutable. The event name for this key event. Examples: `click`, `purchase`",
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
          "name": "countingMethod",
          "type": "string",
          "label": "Counting Method",
          "description": "The method by which Key Events will be counted across multiple events within a session.",
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
              "label": "Counting method not specified.",
              "value": "COUNTING_METHOD_UNSPECIFIED"
            },
            {
              "label": "Each Event instance is considered a Key Event.",
              "value": "ONCE_PER_EVENT"
            },
            {
              "label": "An Event instance is considered a Key Event at most once per session per user.",
              "value": "ONCE_PER_SESSION"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "google_analytics",
      "componentKey": "google_analytics-create-key-event",
      "componentName": "Create Key Event"
    }
  },
  {
    "integration": "google-analytics",
    "name": "google-analytics_run_report",
    "description": "Return report metrics based on a start and end date. [See the documentation](https://developers.google.com/analytics/devguides/reporting/core/v4/rest?hl=en)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "viewId": {
          "type": "string",
          "title": "View Id",
          "description": "ID of the view to monitor. Can be found on your Google Analytics Dashboard -> Admin -> View Setting"
        },
        "startDate": {
          "type": "string",
          "title": "Start Date",
          "description": "Start date in YYYY-MM-DD format"
        },
        "endDate": {
          "type": "string",
          "title": "End Date",
          "description": "End date in YYYY-MM-DD format"
        },
        "metrics": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Metrics",
          "description": "Metrics attributes for your data. Explore the available metrics and dimensions [here](https://ga-dev-tools.web.app/dimensions-metrics-explorer/)"
        },
        "dimensions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Dimensions",
          "description": "Dimension attributes for your data. Explore the available metrics and dimensions [here](https://ga-dev-tools.web.app/dimensions-metrics-explorer/)"
        }
      },
      "required": [
        "viewId",
        "startDate",
        "endDate",
        "metrics"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-analytics",
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
      "app": "google_analytics",
      "componentId": "google_analytics-run-report",
      "version": "0.1.2",
      "authPropNames": [
        "analytics"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "analytics",
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
          "name": "viewId",
          "type": "string",
          "label": "View Id",
          "description": "ID of the view to monitor. Can be found on your Google Analytics Dashboard -> Admin -> View Setting",
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
          "label": "Start Date",
          "description": "Start date in YYYY-MM-DD format",
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
          "label": "End Date",
          "description": "End date in YYYY-MM-DD format",
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
          "name": "metrics",
          "type": "string[]",
          "label": "Metrics",
          "description": "Metrics attributes for your data. Explore the available metrics and dimensions [here](https://ga-dev-tools.web.app/dimensions-metrics-explorer/)",
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
          "description": "Dimension attributes for your data. Explore the available metrics and dimensions [here](https://ga-dev-tools.web.app/dimensions-metrics-explorer/)",
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
      "app": "google_analytics",
      "componentKey": "google_analytics-run-report",
      "componentName": "Run Report"
    }
  },
  {
    "integration": "google-analytics",
    "name": "google-analytics_run_report_in_ga4",
    "description": "Returns a customized report of your Google Analytics event data. Reports contain statistics derived from data collected by the Google Analytics tracking code. [See the documentation](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "property": {
          "type": "string",
          "title": "Property",
          "description": "A Google Analytics GA4 property identifier whose events are tracked. Specified in the URL path and not the body. To learn more, [see where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Within a batch request, this property should either be unspecified or consistent with the batch-level property."
        },
        "startDate": {
          "type": "string",
          "title": "Start Date",
          "description": "Start date in YYYY-MM-DD format"
        },
        "endDate": {
          "type": "string",
          "title": "End Date",
          "description": "End date in YYYY-MM-DD format"
        },
        "metrics": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Metrics",
          "description": "Metrics attributes for your data. Explore the available metrics [here](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics)"
        },
        "dimensions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Dimensions",
          "description": "Dimension attributes for your data. Explore the available dimensions [here](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions)"
        },
        "dimensionFilter": {
          "type": "object",
          "title": "Dimension filter",
          "description": "Dimension filters let you ask for only specific dimension values in the report. Read more about dimension filters [here](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#dimension_filters)"
        }
      },
      "required": [
        "property",
        "startDate",
        "endDate",
        "metrics"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "google-analytics",
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
      "app": "google_analytics",
      "componentId": "google_analytics-run-report-in-ga4",
      "version": "0.1.2",
      "authPropNames": [
        "analytics"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "analytics",
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
          "name": "property",
          "type": "string",
          "label": "Property",
          "description": "A Google Analytics GA4 property identifier whose events are tracked. Specified in the URL path and not the body. To learn more, [see where to find your Property ID](https://developers.google.com/analytics/devguides/reporting/data/v1/property-id). Within a batch request, this property should either be unspecified or consistent with the batch-level property.",
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
          "label": "Start Date",
          "description": "Start date in YYYY-MM-DD format",
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
          "label": "End Date",
          "description": "End date in YYYY-MM-DD format",
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
          "name": "metrics",
          "type": "string[]",
          "label": "Metrics",
          "description": "Metrics attributes for your data. Explore the available metrics [here](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#metrics)",
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
          "description": "Dimension attributes for your data. Explore the available dimensions [here](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema#dimensions)",
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
          "name": "dimensionFilter",
          "type": "object",
          "label": "Dimension filter",
          "description": "Dimension filters let you ask for only specific dimension values in the report. Read more about dimension filters [here](https://developers.google.com/analytics/devguides/reporting/data/v1/basics#dimension_filters)",
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
      "app": "google_analytics",
      "componentKey": "google_analytics-run-report-in-ga4",
      "componentName": "Run Report in GA4"
    }
  }
] satisfies PipedreamActionToolManifest[];
