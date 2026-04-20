import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const GOOGLE_CALENDAR_BASE_URL = "https://www.googleapis.com/calendar/v3";

type UnknownRecord = Record<string, unknown>;

interface GoogleApiErrorPayload {
  error?: {
    code?: number | string;
    status?: string;
    message?: string;
  };
}

function isRecordObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getAccessToken(credentials: Record<string, string>): string {
  const token = safeTrim(
    credentials.accessToken ?? credentials.access_token ?? credentials.token,
  );

  if (!token) {
    throw new Error("Google Calendar credentials are missing an access token.");
  }

  return token;
}

function requiredString(value: unknown, fieldName: string): string {
  const normalized = safeTrim(value);

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function optionalString(value: unknown): string | undefined {
  return safeTrim(value) ?? undefined;
}

function optionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") return true;
    if (value === "false") return false;
  }

  return undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function optionalStringList(value: unknown, fieldName: string): string[] | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array of strings`);
  }

  return value.map((entry, index) => requiredString(entry, `${fieldName}[${index}]`));
}

function summarizeCalendar(calendar: UnknownRecord): UnknownRecord {
  return {
    id: optionalString(calendar.id) ?? null,
    summary: optionalString(calendar.summary) ?? null,
    description: optionalString(calendar.description) ?? null,
    timeZone: optionalString(calendar.timeZone) ?? null,
    primary: typeof calendar.primary === "boolean" ? calendar.primary : null,
    accessRole: optionalString(calendar.accessRole) ?? null,
    backgroundColor: optionalString(calendar.backgroundColor) ?? null,
    foregroundColor: optionalString(calendar.foregroundColor) ?? null,
  };
}

function summarizeEvent(event: UnknownRecord): UnknownRecord {
  const start = isRecordObject(event.start) ? event.start : null;
  const end = isRecordObject(event.end) ? event.end : null;
  const creator = isRecordObject(event.creator) ? event.creator : null;
  const organizer = isRecordObject(event.organizer) ? event.organizer : null;
  const attendees = Array.isArray(event.attendees)
    ? event.attendees
        .map((attendee) => {
          if (!isRecordObject(attendee)) {
            return null;
          }

          return {
            email: optionalString(attendee.email) ?? null,
            displayName: optionalString(attendee.displayName) ?? null,
            responseStatus: optionalString(attendee.responseStatus) ?? null,
            optional: typeof attendee.optional === "boolean" ? attendee.optional : null,
          };
        })
        .filter((attendee): attendee is Exclude<typeof attendee, null> => attendee !== null)
    : [];

  return {
    id: optionalString(event.id) ?? null,
    status: optionalString(event.status) ?? null,
    htmlLink: optionalString(event.htmlLink) ?? null,
    summary: optionalString(event.summary) ?? null,
    description: optionalString(event.description) ?? null,
    location: optionalString(event.location) ?? null,
    start: start
      ? {
          dateTime: optionalString(start.dateTime) ?? null,
          date: optionalString(start.date) ?? null,
          timeZone: optionalString(start.timeZone) ?? null,
        }
      : null,
    end: end
      ? {
          dateTime: optionalString(end.dateTime) ?? null,
          date: optionalString(end.date) ?? null,
          timeZone: optionalString(end.timeZone) ?? null,
        }
      : null,
    created: optionalString(event.created) ?? null,
    updated: optionalString(event.updated) ?? null,
    recurringEventId: optionalString(event.recurringEventId) ?? null,
    creator: creator
      ? {
          email: optionalString(creator.email) ?? null,
          displayName: optionalString(creator.displayName) ?? null,
        }
      : null,
    organizer: organizer
      ? {
          email: optionalString(organizer.email) ?? null,
          displayName: optionalString(organizer.displayName) ?? null,
        }
      : null,
    attendees,
  };
}

function buildEventTime(
  args: Record<string, unknown>,
  prefix: "start" | "end",
): UnknownRecord {
  const dateTime = optionalString(args[`${prefix}DateTime`]);
  const date = optionalString(args[`${prefix}Date`]);
  const timeZone = optionalString(args[`${prefix}TimeZone`]);

  if (!dateTime && !date) {
    throw new Error(`${prefix}DateTime or ${prefix}Date is required`);
  }

  if (dateTime && date) {
    throw new Error(`Provide either ${prefix}DateTime or ${prefix}Date, not both`);
  }

  const result: UnknownRecord = {};

  if (dateTime) {
    result.dateTime = dateTime;
  }

  if (date) {
    result.date = date;
  }

  if (timeZone) {
    result.timeZone = timeZone;
  }

  return result;
}

function buildAttendees(value: unknown): UnknownRecord[] | undefined {
  const emails = optionalStringList(value, "attendees");
  return emails?.map((email) => ({ email }));
}

class GoogleCalendarHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "list_calendars", {
        description: "List Google Calendars available to the connected account",
        inputSchema: {
          type: "object",
          properties: {},
        },
        accessLevel: "read",
        tags: ["google-calendar", "calendars", "list"],
      }),
      defineTool(integrationSlug, "get_calendar", {
        description: "Get Google Calendar metadata by calendar id",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
          },
          required: ["calendarId"],
        },
        accessLevel: "read",
        tags: ["google-calendar", "calendars", "lookup"],
      }),
      defineTool(integrationSlug, "list_events", {
        description: "List events from a Google Calendar within an optional time window",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            timeMin: { type: "string", description: "Optional ISO timestamp lower bound" },
            timeMax: { type: "string", description: "Optional ISO timestamp upper bound" },
            q: { type: "string", description: "Optional free-text search query" },
            maxResults: { type: "number", description: "Optional result limit" },
            singleEvents: { type: "boolean", description: "Whether to expand recurring events into instances" },
            orderBy: { type: "string", enum: ["startTime", "updated"], description: "Optional event ordering" },
          },
          required: ["calendarId"],
        },
        accessLevel: "read",
        tags: ["google-calendar", "events", "list"],
      }),
      defineTool(integrationSlug, "get_event", {
        description: "Get a Google Calendar event by event id",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            eventId: { type: "string", description: "Google Calendar event id" },
          },
          required: ["calendarId", "eventId"],
        },
        accessLevel: "read",
        tags: ["google-calendar", "events", "lookup"],
      }),
      defineTool(integrationSlug, "create_event", {
        description: "Create a Google Calendar event",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            summary: { type: "string", description: "Event title" },
            description: { type: "string", description: "Optional event description" },
            location: { type: "string", description: "Optional event location" },
            startDateTime: { type: "string", description: "ISO datetime for timed events" },
            startDate: { type: "string", description: "All-day start date in YYYY-MM-DD format" },
            startTimeZone: { type: "string", description: "Optional timezone for the start value" },
            endDateTime: { type: "string", description: "ISO datetime for timed events" },
            endDate: { type: "string", description: "All-day end date in YYYY-MM-DD format" },
            endTimeZone: { type: "string", description: "Optional timezone for the end value" },
            attendees: {
              type: "array",
              items: { type: "string" },
              description: "Optional attendee email addresses",
            },
          },
          required: ["calendarId", "summary"],
        },
        accessLevel: "write",
        tags: ["google-calendar", "events", "create"],
      }),
      defineTool(integrationSlug, "update_event", {
        description: "Update fields on an existing Google Calendar event",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            eventId: { type: "string", description: "Google Calendar event id" },
            summary: { type: "string", description: "Updated event title" },
            description: { type: "string", description: "Updated event description" },
            location: { type: "string", description: "Updated event location" },
            startDateTime: { type: "string", description: "Updated ISO datetime for timed events" },
            startDate: { type: "string", description: "Updated all-day start date in YYYY-MM-DD format" },
            startTimeZone: { type: "string", description: "Optional timezone for the start value" },
            endDateTime: { type: "string", description: "Updated ISO datetime for timed events" },
            endDate: { type: "string", description: "Updated all-day end date in YYYY-MM-DD format" },
            endTimeZone: { type: "string", description: "Optional timezone for the end value" },
            attendees: {
              type: "array",
              items: { type: "string" },
              description: "Optional full attendee email list to replace the current attendees",
            },
          },
          required: ["calendarId", "eventId"],
        },
        accessLevel: "write",
        tags: ["google-calendar", "events", "update"],
      }),
      defineTool(integrationSlug, "delete_event", {
        description: "Delete a Google Calendar event",
        inputSchema: {
          type: "object",
          properties: {
            calendarId: { type: "string", description: "Calendar id, or 'primary' for the main calendar" },
            eventId: { type: "string", description: "Google Calendar event id" },
            sendUpdates: {
              type: "string",
              enum: ["all", "externalOnly", "none"],
              description: "Optional attendee notification behavior",
            },
          },
          required: ["calendarId", "eventId"],
        },
        accessLevel: "destructive",
        tags: ["google-calendar", "events", "delete"],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${getAccessToken(credentials)}`,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "list_calendars":
        return this.listCalendars(credentials);
      case "get_calendar":
        return this.getCalendar(args, credentials);
      case "list_events":
        return this.listEvents(args, credentials);
      case "get_event":
        return this.getEvent(args, credentials);
      case "create_event":
        return this.createEvent(args, credentials);
      case "update_event":
        return this.updateEvent(args, credentials);
      case "delete_event":
        return this.deleteEvent(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        `${GOOGLE_CALENDAR_BASE_URL}/users/me/calendarList?maxResults=1`,
        { method: "GET" },
        credentials,
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  private async listCalendars(credentials: Record<string, string>): Promise<unknown> {
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/users/me/calendarList`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Calendars", response);
    }

    const body = (await response.json()) as UnknownRecord;
    const items = Array.isArray(body.items) ? body.items : [];

    return {
      count: items.length,
      calendars: items
        .filter(isRecordObject)
        .map((calendar) => summarizeCalendar(calendar)),
    };
  }

  private async getCalendar(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const calendarId = requiredString(args.calendarId, "calendarId");
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Calendar", response);
    }

    const body = (await response.json()) as UnknownRecord;
    return summarizeCalendar(body);
  }

  private async listEvents(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const calendarId = requiredString(args.calendarId, "calendarId");
    const query = new URLSearchParams();
    const timeMin = optionalString(args.timeMin);
    const timeMax = optionalString(args.timeMax);
    const q = optionalString(args.q);
    const maxResults = optionalNumber(args.maxResults);
    const singleEvents = optionalBoolean(args.singleEvents);
    const orderBy = optionalString(args.orderBy);

    if (timeMin) query.set("timeMin", timeMin);
    if (timeMax) query.set("timeMax", timeMax);
    if (q) query.set("q", q);
    if (maxResults !== undefined) query.set("maxResults", String(maxResults));
    if (singleEvents !== undefined) query.set("singleEvents", String(singleEvents));
    if (orderBy) query.set("orderBy", orderBy);

    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events?${query.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Calendar events", response);
    }

    const body = (await response.json()) as UnknownRecord;
    const items = Array.isArray(body.items) ? body.items : [];

    return {
      calendarId,
      count: items.length,
      nextPageToken: optionalString(body.nextPageToken) ?? null,
      nextSyncToken: optionalString(body.nextSyncToken) ?? null,
      events: items.filter(isRecordObject).map((event) => summarizeEvent(event)),
    };
  }

  private async getEvent(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const calendarId = requiredString(args.calendarId, "calendarId");
    const eventId = requiredString(args.eventId, "eventId");
    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Calendar event", response);
    }

    const body = (await response.json()) as UnknownRecord;
    return summarizeEvent(body);
  }

  private async createEvent(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const calendarId = requiredString(args.calendarId, "calendarId");
    const summary = requiredString(args.summary, "summary");
    const body: UnknownRecord = {
      summary,
      start: buildEventTime(args, "start"),
      end: buildEventTime(args, "end"),
    };

    const description = optionalString(args.description);
    const location = optionalString(args.location);
    const attendees = buildAttendees(args.attendees);

    if (description) body.description = description;
    if (location) body.location = location;
    if (attendees) body.attendees = attendees;

    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Calendar event", response);
    }

    const event = (await response.json()) as UnknownRecord;
    return summarizeEvent(event);
  }

  private async updateEvent(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const calendarId = requiredString(args.calendarId, "calendarId");
    const eventId = requiredString(args.eventId, "eventId");
    const body: UnknownRecord = {};

    const summary = optionalString(args.summary);
    const description = optionalString(args.description);
    const location = optionalString(args.location);
    const attendees = buildAttendees(args.attendees);

    if (summary) body.summary = summary;
    if (description) body.description = description;
    if (location) body.location = location;
    if (attendees) body.attendees = attendees;

    const hasStartInputs = [args.startDateTime, args.startDate, args.startTimeZone].some((value) => value !== undefined);
    const hasEndInputs = [args.endDateTime, args.endDate, args.endTimeZone].some((value) => value !== undefined);

    if (hasStartInputs) {
      body.start = buildEventTime(args, "start");
    }

    if (hasEndInputs) {
      body.end = buildEventTime(args, "end");
    }

    if (Object.keys(body).length === 0) {
      throw new Error("At least one updatable field is required");
    }

    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Calendar event", response);
    }

    const event = (await response.json()) as UnknownRecord;
    return summarizeEvent(event);
  }

  private async deleteEvent(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const calendarId = requiredString(args.calendarId, "calendarId");
    const eventId = requiredString(args.eventId, "eventId");
    const sendUpdates = optionalString(args.sendUpdates);
    const query = new URLSearchParams();

    if (sendUpdates) {
      query.set("sendUpdates", sendUpdates);
    }

    const response = await this.apiRequest(
      `${GOOGLE_CALENDAR_BASE_URL}/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${query.toString() ? `?${query.toString()}` : ""}`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Calendar event", response);
    }

    return {
      deleted: true,
      calendarId,
      eventId,
      sendUpdates: sendUpdates ?? null,
    };
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as GoogleApiErrorPayload | null;
    const status = safeTrim(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== undefined ? String(body.error.code) : undefined;
    const detail = status ? `${status}: ${message}` : message;

    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code,
    });
  }
}

registerHandler("google-calendar", new GoogleCalendarHandler());
