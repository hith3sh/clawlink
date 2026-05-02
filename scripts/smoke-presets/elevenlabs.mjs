export default {
  slug: "elevenlabs",
  read: [
    { tool: "elevenlabs_get_user_info", args: {}, label: "Get user info" },
    { tool: "elevenlabs_get_voices", args: {}, label: "List voices" },
    { tool: "elevenlabs_get_models", args: {}, label: "List models" },
    { tool: "elevenlabs_get_user_subscription_info", args: {}, label: "Get subscription info" },
    { tool: "elevenlabs_get_projects", args: {}, label: "List projects" },
    { tool: "elevenlabs_get_convai_agents_summaries", args: {}, label: "List conversational agents" },
  ],
  preview: [
    {
      tool: "elevenlabs_text_to_speech",
      args: {
        text: "Hello from ClawLink",
        voice_id: "21m00Tcm4TlvDq8ikWAM",
        model_id: "eleven_multilingual_v2",
      },
      label: "Preview text to speech",
    },
  ],
  write: [],
};
