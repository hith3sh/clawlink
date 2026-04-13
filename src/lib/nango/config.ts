export type NangoEnvGetter = (key: string) => string | undefined;

export function normalizeNangoBaseUrl(value: string | undefined): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";

  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, "");
}

export function parseNangoProviderConfigMap(
  rawValue: string | undefined,
): Record<string, string> {
  const trimmed = typeof rawValue === "string" ? rawValue.trim() : "";

  if (!trimmed) {
    return {};
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          (entry): entry is [string, string] =>
            typeof entry[0] === "string" &&
            typeof entry[1] === "string" &&
            entry[0].trim().length > 0 &&
            entry[1].trim().length > 0,
        )
        .map(([slug, providerConfigKey]) => [slug.trim(), providerConfigKey.trim()]),
    );
  } catch {
    return {};
  }
}

export function getNangoBaseUrl(getEnv: NangoEnvGetter): string | null {
  return (
    normalizeNangoBaseUrl(getEnv("NANGO_BASE_URL")) ??
    normalizeNangoBaseUrl(getEnv("NEXT_PUBLIC_NANGO_BASE_URL"))
  );
}

export function getNangoPublicBaseUrl(getEnv: NangoEnvGetter): string | null {
  return (
    normalizeNangoBaseUrl(getEnv("NEXT_PUBLIC_NANGO_BASE_URL")) ??
    normalizeNangoBaseUrl(getEnv("NANGO_BASE_URL"))
  );
}

export function getNangoSecretKey(getEnv: NangoEnvGetter): string | null {
  const value = getEnv("NANGO_SECRET_KEY")?.trim();
  return value ? value : null;
}

export function getNangoPublicKey(getEnv: NangoEnvGetter): string | null {
  const value =
    getEnv("NEXT_PUBLIC_NANGO_PUBLIC_KEY")?.trim() ??
    getEnv("NANGO_PUBLIC_KEY")?.trim();
  return value ? value : null;
}

export function getNangoProviderConfigMap(
  getEnv: NangoEnvGetter,
): Record<string, string> {
  return parseNangoProviderConfigMap(getEnv("NANGO_PROVIDER_CONFIG_KEYS"));
}

export function getNangoProviderConfigKey(
  slug: string,
  getEnv: NangoEnvGetter,
): string | null {
  const mapping = getNangoProviderConfigMap(getEnv);
  return mapping[slug] ?? null;
}
