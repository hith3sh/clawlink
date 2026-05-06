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
    integration: "google-meet",
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
      toolkit: "googlemeet",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const googleMeetComposioTools: IntegrationTool[] = [
  composioTool({
    name: "googlemeet_create_meet",
    description: "Creates a new Google Meet space with optional configuration. Does not attach to any calendar event — calendar linking requires a separate Calendar tool call. Capture `meetingUri`, `meetingCode`, and `space.name` from the response immediately for downstream lookups. Requires `meetings.space.created` OAuth scope. Returns HTTP 429 under rapid calls; apply exponential backoff. Use when you need a meeting space with specific access controls, moderation, recording, or transcription settings.",
    toolSlug: "GOOGLEMEET_CREATE_MEET",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-meet",
      "write",
      "spaces",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Google Meet Space.",
    ],
  }),
  composioTool({
    name: "googlemeet_end_active_conference",
    description: "Ends an active conference in a Google Meet space. REQUIRES 'space_name' parameter (e.g., 'spaces/jQCFfuBOdN5z' or just 'jQCFfuBOdN5z'). Use when you need to terminate an ongoing conference in a specified space. This operation only succeeds if a conference is actively running in the space. You must always provide the space_name to identify which space's conference to end. Immediately drops all active participants — obtain explicit user confirmation before calling.",
    toolSlug: "GOOGLEMEET_END_ACTIVE_CONFERENCE",
    mode: "write",
    risk: "high_impact",
    tags: [
      "composio",
      "google-meet",
      "write",
      "meeting_control",
    ],
    askBefore: [
      "This action is destructive and cannot be undone. Confirm before executing End active conference.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "googlemeet_get_conference_record_by_name",
    description: "Tool to get a specific conference record by its resource name. Use when you have the conference record ID and need to retrieve detailed information about a single meeting instance.",
    toolSlug: "GOOGLEMEET_GET_CONFERENCE_RECORD_BY_NAME",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "conferencerecords",
    ],
  }),
  composioTool({
    name: "googlemeet_get_meet",
    description: "Retrieve details of a Google Meet space using its unique identifier. Newly created spaces may return incomplete data; retry after 1–3 seconds if needed.",
    toolSlug: "GOOGLEMEET_GET_MEET",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
    ],
  }),
  composioTool({
    name: "googlemeet_get_participant_session",
    description: "Retrieves detailed information about a specific participant session from a Google Meet conference record. Returns session details including start time and end time for a single join/leave session. A participant session represents each unique join or leave session when a user joins a conference from a device. If a user joins multiple times from the same device, each join creates a new session. PREREQUISITE: You must first obtain the participant session resource name. Use LIST_PARTICIPANT_SESSIONS with a conference record ID and participant ID to get available sessions and their resource names. The 'name' parameter is REQUIRED and must be in the format: 'conferenceRecords/{conference_record}/participants/{participant}/participantSessions/{participant_session}'",
    toolSlug: "GOOGLEMEET_GET_PARTICIPANT_SESSION",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "conferencerecords",
      "participants",
    ],
  }),
  composioTool({
    name: "googlemeet_get_recordings_by_conference_record_id",
    description: "Retrieves recordings from Google Meet for a given conference record ID. Only returns recordings if recording was enabled and permitted by the organizer's domain policies; a valid conference_record_id does not guarantee recordings exist. After a meeting ends, recordings may take several minutes to process — an empty result may be temporary, not permanent.",
    toolSlug: "GOOGLEMEET_GET_RECORDINGS_BY_CONFERENCE_RECORD_ID",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
    ],
  }),
  composioTool({
    name: "googlemeet_get_transcript",
    description: "Retrieves a specific transcript by its resource name. Returns transcript details including state (STARTED, ENDED, FILE_GENERATED), start/end times, and Google Docs destination. PREREQUISITE: Obtain the transcript resource name first by using GET_TRANSCRIPTS_BY_CONFERENCE_RECORD_ID or construct it from known IDs.",
    toolSlug: "GOOGLEMEET_GET_TRANSCRIPT",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "transcript",
    ],
  }),
  composioTool({
    name: "googlemeet_get_transcript_entry",
    description: "Fetches a single transcript entry by resource name for targeted inspection or incremental processing. Use when you have a specific transcript entry resource name and need to retrieve its details (text, speaker, timestamps, language). PREREQUISITE: Obtain the transcript entry resource name first by using LIST_TRANSCRIPT_ENTRIES or construct it from known IDs. The 'name' parameter is REQUIRED and must follow the format: 'conferenceRecords/{conferenceRecordId}/transcripts/{transcriptId}/entries/{entryId}'",
    toolSlug: "GOOGLEMEET_GET_TRANSCRIPT_ENTRY",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "conferencerecords",
    ],
  }),
  composioTool({
    name: "googlemeet_get_transcripts_by_conference_record_id",
    description: "Retrieves all transcripts for a specific Google Meet conference using its conference_record_id. Transcripts require processing time after a meeting ends — empty results may be transient; retry after a delay before concluding no transcripts exist. Returns results only if transcription was enabled during the meeting and permitted by the organizer's domain policies; an empty list may also indicate transcription was never generated.",
    toolSlug: "GOOGLEMEET_GET_TRANSCRIPTS_BY_CONFERENCE_RECORD_ID",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
    ],
  }),
  composioTool({
    name: "googlemeet_list_conference_records",
    description: "Tool to list conference records. Use when you need to retrieve a list of past conferences, optionally filtering them by criteria like meeting code, space name, or time range.",
    toolSlug: "GOOGLEMEET_LIST_CONFERENCE_RECORDS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "googlemeet",
      "conference",
      "list",
    ],
  }),
  composioTool({
    name: "googlemeet_list_participant_sessions",
    description: "Lists all participant sessions for a specific participant in a Google Meet conference. A participant session represents each unique join or leave session when a user joins a conference from a device. If a user joins multiple times from the same device, each join creates a new session. Returns session details including start time and end time for each session.",
    toolSlug: "GOOGLEMEET_LIST_PARTICIPANT_SESSIONS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "googlemeet",
    ],
  }),
  composioTool({
    name: "googlemeet_list_participants",
    description: "Lists the participants in a conference record. By default, ordered by join time descending. Use to retrieve all participants who joined a specific Google Meet conference, with support for filtering active participants (where `latest_end_time IS NULL`).",
    toolSlug: "GOOGLEMEET_LIST_PARTICIPANTS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "participants",
    ],
  }),
  composioTool({
    name: "googlemeet_list_recordings",
    description: "Tool to list recording resources from a conference record. Use when you need to retrieve recordings from a specific Google Meet conference. Recordings are created when meeting recording is enabled and saved to Google Drive as MP4 files.",
    toolSlug: "GOOGLEMEET_LIST_RECORDINGS",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "recordings",
    ],
  }),
  composioTool({
    name: "googlemeet_list_transcript_entries",
    description: "Tool to list structured transcript entries (speaker/time/text segments) for a specific Google Meet transcript. Use when you need to access the detailed content of a transcript, including individual spoken segments with timestamps and speaker information. Note: The transcript entries returned by the API might not match the transcription in Google Docs due to interleaved speakers or post-generation modifications.",
    toolSlug: "GOOGLEMEET_LIST_TRANSCRIPT_ENTRIES",
    mode: "read",
    risk: "safe",
    tags: [
      "composio",
      "google-meet",
      "read",
      "transcript",
    ],
  }),
  composioTool({
    name: "googlemeet_update_space",
    description: "Updates the settings of an existing Google Meet space. Requires organizer/host privileges and the meetings.space.created OAuth scope. REQUIRED PARAMETER: - name: The space identifier (e.g., 'spaces/jQCFfuBOdN5z'). This is always required to identify which space to update. OPTIONAL PARAMETERS: - config: The new configuration settings to apply (accessType, entryPointAccess, moderation, etc.) - updateMask: Specify which fields to update. If omitted, all provided config fields are updated. Example: To change access type, provide name='spaces/abc123' and config={'accessType': 'OPEN'}",
    toolSlug: "GOOGLEMEET_UPDATE_SPACE",
    mode: "write",
    risk: "confirm",
    tags: [
      "composio",
      "google-meet",
      "write",
      "googlemeet",
      "spaces",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Google Meet Space.",
    ],
  }),
];
