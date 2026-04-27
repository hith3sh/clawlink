import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const YoutubePipedreamToolManifests: PipedreamActionToolManifest[] = [
{
    "integration": "youtube",
    "name": "youtube_create_comment_thread",
    "description": "create-comment-thread via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-create-comment-thread",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-create-comment-thread",
      "componentName": "create-comment-thread"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_create_playlist",
    "description": "create-playlist via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-create-playlist",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-create-playlist",
      "componentName": "create-playlist"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_delete_playlist",
    "description": "delete-playlist via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-delete-playlist",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-delete-playlist",
      "componentName": "delete-playlist"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_delete_playlist_items",
    "description": "delete-playlist-items via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-delete-playlist-items",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-delete-playlist-items",
      "componentName": "delete-playlist-items"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_activities",
    "description": "list-activities via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-list-activities",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-list-activities",
      "componentName": "list-activities"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_playlists",
    "description": "list-playlists via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-list-playlists",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-list-playlists",
      "componentName": "list-playlists"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_videos",
    "description": "list-videos via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-list-videos",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-list-videos",
      "componentName": "list-videos"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_reply_to_comment",
    "description": "reply-to-comment via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-reply-to-comment",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-reply-to-comment",
      "componentName": "reply-to-comment"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_update_channel",
    "description": "update-channel via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-update-channel",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-update-channel",
      "componentName": "update-channel"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_update_playlist",
    "description": "update-playlist via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-update-playlist",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-update-playlist",
      "componentName": "update-playlist"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_update_video_details",
    "description": "update-video-details via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-update-video-details",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-update-video-details",
      "componentName": "update-video-details"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_upload_channel_banner",
    "description": "upload-channel-banner via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-upload-channel-banner",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-upload-channel-banner",
      "componentName": "upload-channel-banner"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_upload_thumbnail",
    "description": "upload-thumbnail via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-upload-thumbnail",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-upload-thumbnail",
      "componentName": "upload-thumbnail"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_upload_video",
    "description": "upload-video via Pipedream",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "youtube",
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-upload-video",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-upload-video",
      "componentName": "upload-video"
    }
  },
{
    "integration": "youtube",
    "name": "youtube_get_video_metrics",
    "description": "Retrieve detailed analytics for a specific video. [See the documentation](https://developers.google.com/youtube/analytics/reference/reports/query)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "startDate": {
          "type": "string",
          "title": "Start Date",
          "description": "The start date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format."
        },
        "endDate": {
          "type": "string",
          "title": "End Date",
          "description": "The end date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format. The API response contains data up until the last day for which all metrics in the query are available at the time of the query. So, for example, if the request specifies an end date of July 5, 2017, and values for all of the requested metrics are only available through July 3, 2017, that will be the last date for which data is included in the response. (That is true even if data for some of the requested metrics is available for July 4, 2017.)"
        },
        "dimensions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Dimensions",
          "description": "A list of YouTube Analytics dimensions, such as `video` or `ageGroup`, `gender`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the dimensions used for those reports. (The [Dimensions](https://developers.google.com/youtube/reporting#dimensions) document contains definitions for all of the dimensions.)."
        },
        "sort": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Sort",
          "description": "A list of dimensions or metrics that determine the sort order for YouTube Analytics data. By default the sort order is ascending. The `-` prefix causes descending sort order. Eg. `-views`."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of rows to include in the response."
        },
        "idType": {
          "type": "string",
          "title": "ID Type",
          "description": "The type of ID to use for the query. This can be either `My Channel`, `Channel ID`, or `Content Owner`."
        },
        "videoId": {
          "type": "string",
          "title": "Video ID",
          "description": "The ID of the video for which you want to retrieve metrics. Eg. `pd1FJh59zxQ`."
        },
        "metrics": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Metrics",
          "description": "Metrics, such as `views` or `likes`, `dislikes`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the metrics available in each report. (The [Metrics](https://developers.google.com/youtube/reporting#metrics) document contains definitions for all of the metrics.)."
        }
      },
      "required": [
        "startDate",
        "endDate",
        "idType",
        "videoId",
        "metrics"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "youtube",
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
      "app": "youtube_analytics_api",
      "componentId": "youtube_analytics_api-get-video-metrics",
      "version": "0.0.4",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [
        "idType"
      ],
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
          "name": "startDate",
          "type": "string",
          "label": "Start Date",
          "description": "The start date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format.",
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
          "description": "The end date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format. The API response contains data up until the last day for which all metrics in the query are available at the time of the query. So, for example, if the request specifies an end date of July 5, 2017, and values for all of the requested metrics are only available through July 3, 2017, that will be the last date for which data is included in the response. (That is true even if data for some of the requested metrics is available for July 4, 2017.)",
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
          "description": "A list of YouTube Analytics dimensions, such as `video` or `ageGroup`, `gender`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the dimensions used for those reports. (The [Dimensions](https://developers.google.com/youtube/reporting#dimensions) document contains definitions for all of the dimensions.).",
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
          "type": "string[]",
          "label": "Sort",
          "description": "A list of dimensions or metrics that determine the sort order for YouTube Analytics data. By default the sort order is ascending. The `-` prefix causes descending sort order. Eg. `-views`.",
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
          "description": "The maximum number of rows to include in the response.",
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
          "name": "idType",
          "type": "string",
          "label": "ID Type",
          "description": "The type of ID to use for the query. This can be either `My Channel`, `Channel ID`, or `Content Owner`.",
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
          "name": "ids",
          "type": "string",
          "label": "Channel ID OR Content Owner Name",
          "description": "The use of this property depends on the value of the `idType` prop.  If `idType` is set to `MINE`, then this property is unused. If `idType` is set to `channelId`, then this property is used to specify the Channel ID for this action. If `idType` is set to `contentOwner`, then this property is used to specify the Content Owner Name for this action.",
          "required": false,
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
          "name": "videoId",
          "type": "string",
          "label": "Video ID",
          "description": "The ID of the video for which you want to retrieve metrics. Eg. `pd1FJh59zxQ`.",
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
          "description": "Metrics, such as `views` or `likes`, `dislikes`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the metrics available in each report. (The [Metrics](https://developers.google.com/youtube/reporting#metrics) document contains definitions for all of the metrics.).",
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
      "app": "youtube_analytics_api",
      "componentKey": "youtube_analytics_api-get-video-metrics",
      "componentName": "Get Video Metrics"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_channel_reports",
    "description": "Fetch summary analytics reports for a specified youtube channel. Optional filters include date range and report type. [See the documentation](https://developers.google.com/youtube/analytics/reference/reports/query)",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "youtube",
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
      "app": "youtube_analytics_api",
      "componentId": "youtube_analytics_api-list-channel-reports",
      "version": "0.0.4",
      "authPropNames": [],
      "dynamicPropNames": [],
      "props": []
    },
    "source": {
      "app": "youtube_analytics_api",
      "componentKey": "youtube_analytics_api-list-channel-reports",
      "componentName": "List Channel Reports"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_query_custom_analytics",
    "description": "Execute a custom analytics query using specified metrics, dimensions, filters, and date ranges. Requires query parameters to configure. [See the documentation](https://developers.google.com/youtube/analytics/reference/reports/query).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "startDate": {
          "type": "string",
          "title": "Start Date",
          "description": "The start date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format."
        },
        "endDate": {
          "type": "string",
          "title": "End Date",
          "description": "The end date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format. The API response contains data up until the last day for which all metrics in the query are available at the time of the query. So, for example, if the request specifies an end date of July 5, 2017, and values for all of the requested metrics are only available through July 3, 2017, that will be the last date for which data is included in the response. (That is true even if data for some of the requested metrics is available for July 4, 2017.)"
        },
        "dimensions": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Dimensions",
          "description": "A list of YouTube Analytics dimensions, such as `video` or `ageGroup`, `gender`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the dimensions used for those reports. (The [Dimensions](https://developers.google.com/youtube/reporting#dimensions) document contains definitions for all of the dimensions.)."
        },
        "sort": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Sort",
          "description": "A list of dimensions or metrics that determine the sort order for YouTube Analytics data. By default the sort order is ascending. The `-` prefix causes descending sort order. Eg. `-views`."
        },
        "maxResults": {
          "type": "number",
          "title": "Max Results",
          "description": "The maximum number of rows to include in the response."
        },
        "idType": {
          "type": "string",
          "title": "ID Type",
          "description": "The type of ID to use for the query. This can be either `My Channel`, `Channel ID`, or `Content Owner`."
        },
        "metrics": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Metrics",
          "description": "Metrics, such as `views` or `likes`, `dislikes`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the metrics available in each report. (The [Metrics](https://developers.google.com/youtube/reporting#metrics) document contains definitions for all of the metrics.)."
        },
        "filters": {
          "type": "object",
          "title": "Filters",
          "description": "A list of filters that should be applied when retrieving YouTube Analytics data. The documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) and [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) identifies the dimensions that can be used to filter each report, and the [Dimensions](https://developers.google.com/youtube/analytics/dimsmets/dims) document defines those dimensions.\n\nIf a request uses multiple filters the returned result table will satisfy both filters. For example, a filters parameter value of `{\"video\":\"dMH0bHeiRNg\",\"country\":\"IT\"}` restricts the result set to include data for the given video in Italy.\n\nSpecifying multiple values for a filter\nThe API supports the ability to specify multiple values for the [video](https://developers.google.com/youtube/reporting#supported-reports), [playlist](https://developers.google.com/youtube/reporting#supported-reports), and [channel](https://developers.google.com/youtube/reporting#supported-reports) filters. To do so, specify a separated list of the video, playlist, or channel IDs for which the API response should be filtered. For example, a filters parameter value of `{\"video\":\"pd1FJh59zxQ,Zhawgd0REhA\",\"country\":\"IT\"}` restricts the result set to include data for the given videos in Italy. The parameter value can specify up to 500 IDs. For more details on the filters parameter, see the filters parameter in [Parameters](https://developers.google.com/youtube/analytics/reference/reports/query#Parameters) section."
        }
      },
      "required": [
        "startDate",
        "endDate",
        "idType",
        "metrics"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "youtube",
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
      "app": "youtube_analytics_api",
      "componentId": "youtube_analytics_api-query-custom-analytics",
      "version": "0.0.4",
      "authPropNames": [
        "app"
      ],
      "dynamicPropNames": [
        "idType"
      ],
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
          "name": "startDate",
          "type": "string",
          "label": "Start Date",
          "description": "The start date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format.",
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
          "description": "The end date for fetching YouTube Analytics data. The value should be in `YYYY-MM-DD` format. The API response contains data up until the last day for which all metrics in the query are available at the time of the query. So, for example, if the request specifies an end date of July 5, 2017, and values for all of the requested metrics are only available through July 3, 2017, that will be the last date for which data is included in the response. (That is true even if data for some of the requested metrics is available for July 4, 2017.)",
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
          "description": "A list of YouTube Analytics dimensions, such as `video` or `ageGroup`, `gender`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the dimensions used for those reports. (The [Dimensions](https://developers.google.com/youtube/reporting#dimensions) document contains definitions for all of the dimensions.).",
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
          "type": "string[]",
          "label": "Sort",
          "description": "A list of dimensions or metrics that determine the sort order for YouTube Analytics data. By default the sort order is ascending. The `-` prefix causes descending sort order. Eg. `-views`.",
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
          "description": "The maximum number of rows to include in the response.",
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
          "name": "idType",
          "type": "string",
          "label": "ID Type",
          "description": "The type of ID to use for the query. This can be either `My Channel`, `Channel ID`, or `Content Owner`.",
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
          "name": "ids",
          "type": "string",
          "label": "Channel ID OR Content Owner Name",
          "description": "The use of this property depends on the value of the `idType` prop.  If `idType` is set to `MINE`, then this property is unused. If `idType` is set to `channelId`, then this property is used to specify the Channel ID for this action. If `idType` is set to `contentOwner`, then this property is used to specify the Content Owner Name for this action.",
          "required": false,
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
          "name": "metrics",
          "type": "string[]",
          "label": "Metrics",
          "description": "Metrics, such as `views` or `likes`, `dislikes`. See the documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) or [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) for a list of the reports that you can retrieve and the metrics available in each report. (The [Metrics](https://developers.google.com/youtube/reporting#metrics) document contains definitions for all of the metrics.).",
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
          "name": "filters",
          "type": "object",
          "label": "Filters",
          "description": "A list of filters that should be applied when retrieving YouTube Analytics data. The documentation for [channel reports](https://developers.google.com/youtube/analytics/channel_reports) and [content owner reports](https://developers.google.com/youtube/analytics/content_owner_reports) identifies the dimensions that can be used to filter each report, and the [Dimensions](https://developers.google.com/youtube/analytics/dimsmets/dims) document defines those dimensions.\n\nIf a request uses multiple filters the returned result table will satisfy both filters. For example, a filters parameter value of `{\"video\":\"dMH0bHeiRNg\",\"country\":\"IT\"}` restricts the result set to include data for the given video in Italy.\n\nSpecifying multiple values for a filter\nThe API supports the ability to specify multiple values for the [video](https://developers.google.com/youtube/reporting#supported-reports), [playlist](https://developers.google.com/youtube/reporting#supported-reports), and [channel](https://developers.google.com/youtube/reporting#supported-reports) filters. To do so, specify a separated list of the video, playlist, or channel IDs for which the API response should be filtered. For example, a filters parameter value of `{\"video\":\"pd1FJh59zxQ,Zhawgd0REhA\",\"country\":\"IT\"}` restricts the result set to include data for the given videos in Italy. The parameter value can specify up to 500 IDs. For more details on the filters parameter, see the filters parameter in [Parameters](https://developers.google.com/youtube/analytics/reference/reports/query#Parameters) section.",
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
      "app": "youtube_analytics_api",
      "componentKey": "youtube_analytics_api-query-custom-analytics",
      "componentName": "Query Custom Analytics"
    }
  }
];
