export default {
  slug: "youtube",
  read: [
    {
      tool: "youtube_search_videos",
      args: (ctx) => ({
        q: ctx.optional("youtubeQuery") ?? "clawlink",
        maxResults: ctx.number("youtubeMaxResults", 1),
      }),
    },
  ],
  preview: [
    {
      tool: "youtube_create_playlist",
      args: (ctx) => ({
        title: ctx.optional("youtubePlaylistTitle") ?? "ClawLink smoke preview",
        description: ctx.optional("youtubePlaylistDescription") ?? "Smoke preview only. Do not create.",
        privacyStatus: "private",
      }),
    },
  ],
  write: [],
};
