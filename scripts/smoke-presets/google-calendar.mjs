export default {
  slug: "google-calendar",
  read: [
    { tool: "googlecalendar_list_calendars", args: {}, label: "List calendars" },
    { tool: "googlecalendar_events_list", args: { calendarId: "primary", maxResults: 5 }, label: "List primary calendar events" },
    { tool: "googlecalendar_find_free_slots", args: {}, label: "Find free slots" },
    { tool: "googlecalendar_get_current_date_time", args: {}, label: "Get current date/time" },
  ],
  preview: [
    {
      tool: "googlecalendar_create_event",
      args: (ctx) => ({
        calendarId: ctx.optional("calendarId") ?? "primary",
        summary: ctx.optional("summary") ?? "ClawLink smoke preview",
        start: { dateTime: ctx.optional("start") ?? "2026-05-01T09:00:00Z" },
        end: { dateTime: ctx.optional("end") ?? "2026-05-01T09:30:00Z" },
      }),
      label: "Preview create event",
    },
  ],
  write: [],
};
