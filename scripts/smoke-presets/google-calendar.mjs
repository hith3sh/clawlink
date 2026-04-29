export default {
  slug: "google-calendar",
  read: [
    { tool: "google-calendar_get_current_user" },
    { tool: "google-calendar_list_calendars" },
  ],
  preview: [
    {
      tool: "google-calendar_create_event",
      args: (ctx) => ({
        calendarId: ctx.optional("calendarId"),
        summary: ctx.optional("summary") ?? "ClawLink smoke preview",
        start: ctx.optional("start") ?? "2026-05-01T09:00:00Z",
        end: ctx.optional("end") ?? "2026-05-01T09:30:00Z",
      }),
    },
  ],
  write: [],
};
