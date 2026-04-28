import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const YoutubePipedreamToolManifests = [
  {
    "integration": "youtube",
    "name": "youtube_channel_statistics",
    "description": "Returns statistics from my YouTube Channel or by id. [See the documentation](https://developers.google.com/youtube/v3/docs/channels/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "useCase": {
          "type": "string",
          "title": "Use Case",
          "description": "Select your use case to render the next properties.",
          "enum": [
            "id",
            "mine",
            "managedByMe"
          ]
        }
      },
      "required": [
        "useCase"
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-channel-statistics",
      "version": "0.0.5",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "useCase"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "useCase",
          "type": "string",
          "label": "Use Case",
          "description": "Select your use case to render the next properties.",
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
              "label": "By Channel ID",
              "value": "id"
            },
            {
              "label": "My Channels",
              "value": "mine"
            },
            {
              "label": "Managed by Me (exclusively for YouTube content partners)",
              "value": "managedByMe"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-channel-statistics",
      "componentName": "Channel Statistics"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_create_comment_thread",
    "description": "Creates a new top-level comment in a video. [See the documentation](https://developers.google.com/youtube/v3/docs/commentThreads/insert) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "Select the channel to update. E.g. `UChkRx83xLq2nk55D8CRODVz`"
        },
        "videoId": {
          "type": "string",
          "title": "Video ID",
          "description": "Select the video to add comment to. E.g. `wslno0wDSFQ`. Leave blank to post comment to channel."
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "The text of the comment"
        }
      },
      "required": [
        "channelId",
        "videoId",
        "text"
      ]
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
      "version": "0.0.3",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "channelId",
        "videoId"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "channelId",
          "type": "string",
          "label": "Channel ID",
          "description": "Select the channel to update. E.g. `UChkRx83xLq2nk55D8CRODVz`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "videoId",
          "type": "string",
          "label": "Video ID",
          "description": "Select the video to add comment to. E.g. `wslno0wDSFQ`. Leave blank to post comment to channel.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "text",
          "type": "string",
          "label": "Text",
          "description": "The text of the comment",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-create-comment-thread",
      "componentName": "Create Comment Thread"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_create_playlist",
    "description": "Creates a playlist. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/insert) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Title",
          "description": "The playlist's title"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The playlist's description"
        },
        "privacyStatus": {
          "type": "string",
          "title": "Privacy Status",
          "description": "The playlist's privacy status"
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        },
        "onBehalfOfContentOwnerChannel": {
          "type": "string",
          "title": "On Behalf Of Content Owner Channel",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.\n\nThe `onBehalfOfContentOwnerChannel` parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the `onBehalfOfContentOwner` parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the `onBehalfOfContentOwner` parameter specifies. Finally, the channel that the `onBehalfOfContentOwnerChannel` parameter value specifies must be linked to the content owner that the `onBehalfOfContentOwner` parameter specifies."
        }
      },
      "required": [
        "title"
      ]
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
      "version": "0.0.4",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "The playlist's title",
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
          "description": "The playlist's description",
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
          "name": "privacyStatus",
          "type": "string",
          "label": "Privacy Status",
          "description": "The playlist's privacy status",
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
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
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
          "name": "onBehalfOfContentOwnerChannel",
          "type": "string",
          "label": "On Behalf Of Content Owner Channel",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.\n\nThe `onBehalfOfContentOwnerChannel` parameter specifies the YouTube channel ID of the channel to which a video is being added. This parameter is required when a request specifies a value for the `onBehalfOfContentOwner` parameter, and it can only be used in conjunction with that parameter. In addition, the request must be authorized using a CMS account that is linked to the content owner that the `onBehalfOfContentOwner` parameter specifies. Finally, the channel that the `onBehalfOfContentOwnerChannel` parameter value specifies must be linked to the content owner that the `onBehalfOfContentOwner` parameter specifies.",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-create-playlist",
      "componentName": "Create Playlist"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_delete_playlist",
    "description": "Deletes a playlist. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/delete) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "playlistId": {
          "type": "string",
          "title": "Playlist ID",
          "description": "Add items to the selected playlist. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`"
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        }
      },
      "required": [
        "playlistId"
      ]
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
      "version": "0.0.3",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "playlistId"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "playlistId",
          "type": "string",
          "label": "Playlist ID",
          "description": "Add items to the selected playlist. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-delete-playlist",
      "componentName": "Delete Playlist"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_delete_playlist_items",
    "description": "Deletes a playlist item. [See the documentation](https://developers.google.com/youtube/v3/docs/playlistItems/delete) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "playlistId": {
          "type": "string",
          "title": "Playlist ID",
          "description": "Add items to the selected playlist. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`"
        },
        "videoIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Video IDs",
          "description": "Array of identifiers of the videos to be removed from the playlist. E.g. `o_U1CQn68VM`"
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        }
      },
      "required": [
        "playlistId",
        "videoIds"
      ]
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
      "version": "0.0.3",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "playlistId",
        "videoIds"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "playlistId",
          "type": "string",
          "label": "Playlist ID",
          "description": "Add items to the selected playlist. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "videoIds",
          "type": "string[]",
          "label": "Video IDs",
          "description": "Array of identifiers of the videos to be removed from the playlist. E.g. `o_U1CQn68VM`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-delete-playlist-items",
      "componentName": "Delete Playlist Items"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_activities",
    "description": "Returns a list of channel activity events that match the request criteria. [See the documentation](https://developers.google.com/youtube/v3/docs/activities/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "useCase": {
          "type": "string",
          "title": "Use Case",
          "description": "Select your use case to render the next properties.",
          "enum": [
            "channelId",
            "mine"
          ]
        }
      },
      "required": [
        "useCase"
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-list-activities",
      "version": "0.0.5",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "useCase"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "useCase",
          "type": "string",
          "label": "Use Case",
          "description": "Select your use case to render the next properties.",
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
              "label": "By Channel ID",
              "value": "channelId"
            },
            {
              "label": "My Activities",
              "value": "mine"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-list-activities",
      "componentName": "List Activities"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_playlist_videos",
    "description": "List videos in a playlist. [See the documentation](https://developers.google.com/youtube/v3/docs/playlistItems/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "playlistId": {
          "type": "string",
          "title": "Playlist ID",
          "description": "Select a **Playlist** or provide a custom *Playlist ID*. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`"
        },
        "maxResults": {
          "type": "number",
          "title": "Maximum Results",
          "description": "The maximum number of items that should be returned in the result set. Acceptable values are 0 to 50, inclusive. Default is 20"
        }
      },
      "required": [
        "playlistId"
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-list-playlist-videos",
      "version": "0.0.3",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "playlistId"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "playlistId",
          "type": "string",
          "label": "Playlist ID",
          "description": "Select a **Playlist** or provide a custom *Playlist ID*. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "maxResults",
          "type": "integer",
          "label": "Maximum Results",
          "description": "The maximum number of items that should be returned in the result set. Acceptable values are 0 to 50, inclusive. Default is 20",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-list-playlist-videos",
      "componentName": "List Playlist Videos"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_playlists",
    "description": "Returns a collection of playlists that match the API request parameters. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "useCase": {
          "type": "string",
          "title": "Use Case",
          "description": "Select your use case to render the next properties.",
          "enum": [
            "id",
            "channelId",
            "mine"
          ]
        }
      },
      "required": [
        "useCase"
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-list-playlists",
      "version": "0.0.5",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "useCase"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "useCase",
          "type": "string",
          "label": "Use Case",
          "description": "Select your use case to render the next properties.",
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
              "label": "By Playlist ID",
              "value": "id"
            },
            {
              "label": "All Playlists for a Channel",
              "value": "channelId"
            },
            {
              "label": "My Playlists",
              "value": "mine"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-list-playlists",
      "componentName": "List Playlists"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_list_videos",
    "description": "Returns a list of videos that match the API request parameters. [See the documentation](https://developers.google.com/youtube/v3/docs/videos/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "useCase": {
          "type": "string",
          "title": "Use Case",
          "description": "Select your use case to render the next properties.",
          "enum": [
            "id",
            "chart",
            "myRating"
          ]
        }
      },
      "required": [
        "useCase"
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-list-videos",
      "version": "0.0.5",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "useCase"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "useCase",
          "type": "string",
          "label": "Use Case",
          "description": "Select your use case to render the next properties.",
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
              "label": "By Video ID",
              "value": "id"
            },
            {
              "label": "Most Popular Videos",
              "value": "chart"
            },
            {
              "label": "My Liked Videos",
              "value": "myRating"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-list-videos",
      "componentName": "List Videos"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_reply_to_comment",
    "description": "Creates a reply to an existing comment. [See the documentation](https://developers.google.com/youtube/v3/docs/comments/insert) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "Select the channel to update. E.g. `UChkRx83xLq2nk55D8CRODVz`"
        },
        "commentThread": {
          "type": "string",
          "title": "Comment Thread",
          "description": "The top-level comment that you are replying to"
        },
        "text": {
          "type": "string",
          "title": "Text",
          "description": "The text of the comment"
        }
      },
      "required": [
        "channelId",
        "commentThread",
        "text"
      ]
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
      "version": "0.0.3",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "channelId",
        "commentThread"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "channelId",
          "type": "string",
          "label": "Channel ID",
          "description": "Select the channel to update. E.g. `UChkRx83xLq2nk55D8CRODVz`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "commentThread",
          "type": "string",
          "label": "Comment Thread",
          "description": "The top-level comment that you are replying to",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "text",
          "type": "string",
          "label": "Text",
          "description": "The text of the comment",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-reply-to-comment",
      "componentName": "Reply To Comment"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_search_videos",
    "description": "Returns a list of videos that match the search parameters. [See the documentation](https://developers.google.com/youtube/v3/docs/search/list) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "q": {
          "type": "string",
          "title": "Search Query",
          "description": "Search for new videos that match these keywords."
        },
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "The channelId parameter specifies a unique YouTube channel ID. E.g. `UChkRx83xLq2nk55D8CRODVz`"
        },
        "videoDuration": {
          "type": "string",
          "title": "Video Duration",
          "description": "Filter the results based on video duration",
          "enum": [
            "any",
            "long",
            "medium",
            "short"
          ]
        },
        "videoDefinition": {
          "type": "string",
          "title": "Video Definition",
          "description": "Filter the results to only include either high definition (HD) or standard definition (SD) videos"
        },
        "videoCaption": {
          "type": "string",
          "title": "Video Caption",
          "description": "Indicates whether the API should filter video search results based on whether they have captions",
          "enum": [
            "any",
            "closedCaption",
            "none"
          ]
        },
        "videoLicense": {
          "type": "string",
          "title": "Video License",
          "description": "Filter the results to only include videos with a particular license",
          "enum": [
            "any",
            "creativeCommon",
            "youtube"
          ]
        },
        "regionCode": {
          "type": "string",
          "title": "Region Code",
          "description": "The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR"
        },
        "videoCategoryId": {
          "type": "string",
          "title": "Video Category Id",
          "description": "Select the video's category"
        },
        "location": {
          "type": "string",
          "title": "Location",
          "description": "The location parameter, in conjunction with the locationRadius parameter, defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. The parameter value is a string that specifies latitude/longitude coordinates e.g. `37.42307,-122.08427`."
        },
        "locationRadius": {
          "type": "string",
          "title": "Location Radius",
          "description": "The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are m, km, ft, and mi. For example, valid parameter values include `1500m`, `5km`, `10000ft`, and `0.75mi`. The API does not support locationRadius parameter values larger than 1000 kilometers."
        },
        "sortOrder": {
          "type": "string",
          "title": "Sort Order",
          "description": "The method that will be used to order resources in the API response. The default value is `relevance`"
        },
        "maxResults": {
          "type": "number",
          "title": "Maximum Results",
          "description": "The maximum number of items that should be returned in the result set. Acceptable values are 0 to 50, inclusive. Default is 20"
        }
      },
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
      "app": "youtube_data_api",
      "componentId": "youtube_data_api-search-videos",
      "version": "0.0.2",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "videoCategoryId"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "q",
          "type": "string",
          "label": "Search Query",
          "description": "Search for new videos that match these keywords.",
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
          "description": "The channelId parameter specifies a unique YouTube channel ID. E.g. `UChkRx83xLq2nk55D8CRODVz`",
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
          "name": "videoDuration",
          "type": "string",
          "label": "Video Duration",
          "description": "Filter the results based on video duration",
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
              "label": "Do not filter video search results based on their duration. This is the default value.",
              "value": "any"
            },
            {
              "label": "Only include videos longer than 20 minutes",
              "value": "long"
            },
            {
              "label": "Only include videos that are between four and 20 minutes long (inclusive)",
              "value": "medium"
            },
            {
              "label": "Only include videos that are less than four minutes long",
              "value": "short"
            }
          ]
        },
        {
          "name": "videoDefinition",
          "type": "string",
          "label": "Video Definition",
          "description": "Filter the results to only include either high definition (HD) or standard definition (SD) videos",
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
          "name": "videoCaption",
          "type": "string",
          "label": "Video Caption",
          "description": "Indicates whether the API should filter video search results based on whether they have captions",
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
              "label": "Do not filter results based on caption availability",
              "value": "any"
            },
            {
              "label": "Only include videos that have captions",
              "value": "closedCaption"
            },
            {
              "label": "Only include videos that do not have captions",
              "value": "none"
            }
          ]
        },
        {
          "name": "videoLicense",
          "type": "string",
          "label": "Video License",
          "description": "Filter the results to only include videos with a particular license",
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
              "label": "Return all videos",
              "value": "any"
            },
            {
              "label": "Only return videos that have a Creative Commons license. Users can reuse videos with this license in other videos that they create.",
              "value": "creativeCommon"
            },
            {
              "label": "Only return videos that have the standard YouTube license",
              "value": "youtube"
            }
          ]
        },
        {
          "name": "regionCode",
          "type": "string",
          "label": "Region Code",
          "description": "The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR",
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
          "name": "videoCategoryId",
          "type": "string",
          "label": "Video Category Id",
          "description": "Select the video's category",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "location",
          "type": "string",
          "label": "Location",
          "description": "The location parameter, in conjunction with the locationRadius parameter, defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. The parameter value is a string that specifies latitude/longitude coordinates e.g. `37.42307,-122.08427`.",
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
          "name": "locationRadius",
          "type": "string",
          "label": "Location Radius",
          "description": "The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are m, km, ft, and mi. For example, valid parameter values include `1500m`, `5km`, `10000ft`, and `0.75mi`. The API does not support locationRadius parameter values larger than 1000 kilometers.",
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
          "name": "sortOrder",
          "type": "string",
          "label": "Sort Order",
          "description": "The method that will be used to order resources in the API response. The default value is `relevance`",
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
          "label": "Maximum Results",
          "description": "The maximum number of items that should be returned in the result set. Acceptable values are 0 to 50, inclusive. Default is 20",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-search-videos",
      "componentName": "Search Videos"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_update_channel",
    "description": "Updates a channel's metadata. [See the documentation](https://developers.google.com/youtube/v3/docs/channels/update) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "channelId": {
          "type": "string",
          "title": "Channel ID",
          "description": "Select the channel to update. E.g. `UChkRx83xLq2nk55D8CRODVz`"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The channel's description"
        },
        "defaultLanguage": {
          "type": "string",
          "title": "Language",
          "description": "The language of the text in the channel resource"
        },
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Keywords",
          "description": "Keywords associated with your channel"
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        }
      },
      "required": [
        "channelId"
      ]
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
      "version": "0.0.3",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "channelId",
        "defaultLanguage"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "channelId",
          "type": "string",
          "label": "Channel ID",
          "description": "Select the channel to update. E.g. `UChkRx83xLq2nk55D8CRODVz`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "The channel's description",
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
          "name": "defaultLanguage",
          "type": "string",
          "label": "Language",
          "description": "The language of the text in the channel resource",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "keywords",
          "type": "string[]",
          "label": "Keywords",
          "description": "Keywords associated with your channel",
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
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-update-channel",
      "componentName": "Update Channel"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_update_playlist",
    "description": "Modifies a playlist. For example, you could change a playlist's title, description, or privacy status. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/update) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "title": "Playlist ID",
          "description": "The identifier of the playlist to update. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`"
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        }
      },
      "required": [
        "id"
      ]
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
      "version": "0.0.5",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "id",
        "onBehalfOfContentOwner"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "id",
          "type": "string",
          "label": "Playlist ID",
          "description": "The identifier of the playlist to update. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-update-playlist",
      "componentName": "Update Playlist"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_update_video_details",
    "description": "Updates a video's metadata. [See the documentation](https://developers.google.com/youtube/v3/docs/videos/update) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "videoId": {
          "type": "string",
          "title": "Video ID",
          "description": "Select the video to update. E.g. `wslno0wDSFQ`"
        },
        "title": {
          "type": "string",
          "title": "Title",
          "description": "The video's title"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The video's description"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags",
          "description": "A list of keyword tags associated with the video. Tags may contain spaces."
        },
        "regionCode": {
          "type": "string",
          "title": "Region Code",
          "description": "The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR"
        },
        "categoryId": {
          "type": "string",
          "title": "Video Category Id",
          "description": "Select the video's category"
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        }
      },
      "required": [
        "videoId"
      ]
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
      "version": "0.0.3",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "videoId",
        "categoryId"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "videoId",
          "type": "string",
          "label": "Video ID",
          "description": "Select the video to update. E.g. `wslno0wDSFQ`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "The video's title",
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
          "description": "The video's description",
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
          "name": "tags",
          "type": "string[]",
          "label": "Tags",
          "description": "A list of keyword tags associated with the video. Tags may contain spaces.",
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
          "name": "regionCode",
          "type": "string",
          "label": "Region Code",
          "description": "The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR",
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
          "name": "categoryId",
          "type": "string",
          "label": "Video Category Id",
          "description": "Select the video's category",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
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
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-update-video-details",
      "componentName": "Update Video Details"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_upload_channel_banner",
    "description": "Uploads a channel banner image to YouTube. [See the documentation](https://developers.google.com/youtube/v3/docs/channelBanners/insert) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "filePath": {
          "type": "string",
          "title": "File Path or URL",
          "description": "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf)."
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        }
      },
      "required": [
        "filePath"
      ]
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
      "version": "1.0.2",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "infoAlert",
          "type": "alert",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": true,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "filePath",
          "type": "string",
          "label": "File Path or URL",
          "description": "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
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
          "name": "syncDir",
          "type": "dir",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": true,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-upload-channel-banner",
      "componentName": "Upload Channel Banner"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_upload_thumbnail",
    "description": "Uploads a custom video thumbnail to YouTube and sets it for a video. Note: Account must be [verified](https://www.youtube.com/verify). [See the documentation](https://developers.google.com/youtube/v3/docs/thumbnails/set) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "videoId": {
          "type": "string",
          "title": "Video ID",
          "description": "Select the video to update. E.g. `wslno0wDSFQ`"
        },
        "filePath": {
          "type": "string",
          "title": "File Path or URL",
          "description": "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf)."
        },
        "onBehalfOfContentOwner": {
          "type": "string",
          "title": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner."
        }
      },
      "required": [
        "videoId",
        "filePath"
      ]
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
      "version": "1.0.2",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [
        "videoId"
      ],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "infoAlert",
          "type": "alert",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": true,
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
          "description": "Select the video to update. E.g. `wslno0wDSFQ`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": true,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "filePath",
          "type": "string",
          "label": "File Path or URL",
          "description": "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
          "name": "onBehalfOfContentOwner",
          "type": "string",
          "label": "On Behalf Of Content Owner",
          "description": "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners. \n\nThe `onBehalfOfContentOwner` parameter indicates that the request's authorization credentials identify a YouTube CMS user who is acting on behalf of the content owner specified in the parameter value. This parameter is intended for YouTube content partners that own and manage many different YouTube channels. It allows content owners to authenticate once and get access to all their video and channel data, without having to provide authentication credentials for each individual channel. The CMS account that the user authenticates with must be linked to the specified YouTube content owner.",
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
          "name": "syncDir",
          "type": "dir",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": true,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-upload-thumbnail",
      "componentName": "Upload Thumbnail"
    }
  },
  {
    "integration": "youtube",
    "name": "youtube_upload_video",
    "description": "Post a video to your channel. [See the documentation](https://developers.google.com/youtube/v3/docs/videos/insert) for more information",
    "inputSchema": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string",
          "title": "Title",
          "description": "The video's title"
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The video's description"
        },
        "filePath": {
          "type": "string",
          "title": "File Path or URL",
          "description": "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf)."
        },
        "privacyStatus": {
          "type": "string",
          "title": "Privacy Status",
          "description": "The video's privacy status"
        },
        "publishAt": {
          "type": "string",
          "title": "Publish At",
          "description": "The date and time when the video is scheduled to publish. If you set this, the **Privacy Status** must be set to `private`. Only available to Youtube Partner accounts."
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Tags",
          "description": "A list of keyword tags associated with the video. Tags may contain spaces."
        },
        "notifySubscribers": {
          "type": "boolean",
          "title": "Notify Subscribers",
          "description": "Set to `true` if YouTube should send a notification about the new video to users who subscribe to the video's channel."
        }
      },
      "required": [
        "title",
        "description",
        "filePath"
      ]
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
      "version": "1.0.2",
      "authPropNames": [
        "youtubeDataApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "youtubeDataApi",
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
          "name": "title",
          "type": "string",
          "label": "Title",
          "description": "The video's title",
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
          "description": "The video's description",
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
          "name": "filePath",
          "type": "string",
          "label": "File Path or URL",
          "description": "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
          "name": "privacyStatus",
          "type": "string",
          "label": "Privacy Status",
          "description": "The video's privacy status",
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
          "name": "publishAt",
          "type": "string",
          "label": "Publish At",
          "description": "The date and time when the video is scheduled to publish. If you set this, the **Privacy Status** must be set to `private`. Only available to Youtube Partner accounts.",
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
          "name": "tags",
          "type": "string[]",
          "label": "Tags",
          "description": "A list of keyword tags associated with the video. Tags may contain spaces.",
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
          "name": "notifySubscribers",
          "type": "boolean",
          "label": "Notify Subscribers",
          "description": "Set to `true` if YouTube should send a notification about the new video to users who subscribe to the video's channel.",
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
          "name": "syncDir",
          "type": "dir",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": true,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "youtube_data_api",
      "componentKey": "youtube_data_api-upload-video",
      "componentName": "Upload Video"
    }
  }
] satisfies PipedreamActionToolManifest[];
