const OAUTH_PROVIDER_DISPLAY_NAMES: Record<string, string> = {
  apollo: "Apollo",
  gmail: "Gmail",
  notion: "Notion",
  outlook: "Outlook",
  postiz: "Postiz",
};

export function getOAuthProviderDisplayName(slug: string): string {
  return OAUTH_PROVIDER_DISPLAY_NAMES[slug] ?? slug;
}

export function safeTrim(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
