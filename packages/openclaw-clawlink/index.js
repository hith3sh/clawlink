import { Type } from "@sinclair/typebox";

const DEFAULT_BASE_URL = "https://claw-link.dev";
const USER_AGENT = "@useclawlink/openclaw-plugin/0.1.0";

function tokenizeArgs(value) {
  const input = typeof value === "string" ? value.trim() : "";

  if (!input) {
    return [];
  }

  return Array.from(input.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g), (match) =>
    match[1] ?? match[2] ?? match[3] ?? "",
  );
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function maskSecret(value) {
  if (!isNonEmptyString(value)) {
    return "(unset)";
  }

  const trimmed = value.trim();

  if (trimmed.length <= 8) {
    return `${trimmed.slice(0, 2)}***`;
  }

  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}

function normalizeBaseUrl(value) {
  if (!isNonEmptyString(value)) {
    return DEFAULT_BASE_URL;
  }

  return value.trim().replace(/\/+$/, "");
}

function getDynamicPluginConfig(api) {
  const liveConfig = api.runtime?.config?.loadConfig?.();
  const pluginEntry = liveConfig?.plugins?.entries?.[api.id];

  if (pluginEntry && typeof pluginEntry === "object") {
    return pluginEntry.config ?? {};
  }

  return api.pluginConfig ?? {};
}

function getPluginConfig(api) {
  const rawConfig = getDynamicPluginConfig(api);
  const apiKey = isNonEmptyString(rawConfig.apiKey) ? rawConfig.apiKey.trim() : "";
  const baseUrl = normalizeBaseUrl(rawConfig.baseUrl);

  return { apiKey, baseUrl };
}

function requireApiKey(api) {
  const { apiKey, baseUrl } = getPluginConfig(api);

  if (!apiKey) {
    throw new Error(
      "ClawLink is not configured yet. Ask the user to create an API key at https://claw-link.dev/dashboard/settings, then send `/clawlink login <apiKey>` in a private chat with OpenClaw.",
    );
  }

  return { apiKey, baseUrl };
}

async function parseJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function stringifyPayload(payload) {
  return JSON.stringify(payload, null, 2);
}

async function callClawLink(api, path, options = {}) {
  const { apiKey, baseUrl } = requireApiKey(api);
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const message =
      payload && typeof payload.error === "string"
        ? payload.error
        : `ClawLink request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

function textResult(text, details) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
    details,
  };
}

function buildStartConnectionText(payload) {
  const summary = {
    integration: payload.integration,
    sessionToken: payload.sessionToken,
    status: payload.status,
    displayCode: payload.displayCode,
    connectUrl: payload.connectUrl,
    statusUrl: payload.statusUrl,
    expiresAt: payload.expiresAt,
    pollIntervalMs: payload.pollIntervalMs,
  };

  return [
    "ClawLink connection session started.",
    "",
    "Open the hosted setup URL, complete authentication, then poll the session token until the status changes.",
    "",
    stringifyPayload(summary),
  ].join("\n");
}

function buildStatusText(payload) {
  const summary = {
    status: payload?.session?.status ?? null,
    integration: payload?.session?.integration ?? null,
    sessionToken: payload?.session?.token ?? null,
    displayCode: payload?.session?.displayCode ?? null,
    expiresAt: payload?.session?.expiresAt ?? null,
    completedAt: payload?.session?.completedAt ?? null,
    errorMessage: payload?.session?.errorMessage ?? null,
    connection: payload?.connection ?? null,
  };

  return [
    "ClawLink connection session status:",
    "",
    stringifyPayload(summary),
  ].join("\n");
}

async function persistPluginConfig(api, mutateConfig) {
  const runtimeConfig = api.runtime?.config;

  if (
    typeof runtimeConfig?.loadConfig === "function" &&
    typeof runtimeConfig?.writeConfigFile === "function"
  ) {
    const currentConfig = runtimeConfig.loadConfig();
    const nextConfig = mutateConfig(structuredClone(currentConfig));

    await runtimeConfig.writeConfigFile(nextConfig);

    return nextConfig;
  }

  const fallbackRuntime = await import("openclaw/plugin-sdk/config-runtime");

  if (typeof fallbackRuntime.updateConfig === "function") {
    return fallbackRuntime.updateConfig((currentConfig) =>
      mutateConfig(structuredClone(currentConfig)),
    );
  }

  if (
    typeof fallbackRuntime.loadConfig === "function" &&
    typeof fallbackRuntime.writeConfigFile === "function"
  ) {
    const currentConfig = fallbackRuntime.loadConfig();
    const nextConfig = mutateConfig(structuredClone(currentConfig));

    await fallbackRuntime.writeConfigFile(nextConfig);

    return nextConfig;
  }

  throw new Error("OpenClaw runtime config API is unavailable.");
}

function updatePluginEntryConfig(config, updater) {
  const currentPlugins = config.plugins ?? {};
  const currentEntries = currentPlugins.entries ?? {};
  const currentEntry = currentEntries.clawlink ?? {};
  const currentPluginConfig = currentEntry.config ?? {};
  const nextPluginConfig = updater({ ...currentPluginConfig });

  return {
    ...config,
    plugins: {
      ...currentPlugins,
      entries: {
        ...currentEntries,
        clawlink: {
          ...currentEntry,
          enabled: true,
          config: nextPluginConfig,
        },
      },
    },
  };
}

function buildCommandHelp() {
  return [
    "ClawLink commands:",
    "",
    "/clawlink status",
    "/clawlink login <apiKey> [baseUrl]",
    "/clawlink base-url <url>",
    "/clawlink base-url default",
    "/clawlink logout",
    "",
    "Send the login command in a private chat with OpenClaw so your API key is not exposed in a group.",
  ].join("\n");
}

const clawlinkPlugin = {
  id: "clawlink",
  name: "ClawLink",
  description: "Hosted connection sessions for ClawLink integrations inside OpenClaw",
  register(api) {
    api.registerCommand({
      name: "clawlink",
      description: "Configure ClawLink API access and inspect plugin status.",
      acceptsArgs: true,
      handler: async (ctx) => {
        const tokens = tokenizeArgs(ctx.args);
        const action = (tokens[0] ?? "help").toLowerCase();

        if (action === "help") {
          return { text: buildCommandHelp() };
        }

        if (action === "status") {
          const { apiKey, baseUrl } = getPluginConfig(api);

          return {
            text: [
              "ClawLink status:",
              `- apiKey: ${maskSecret(apiKey)}`,
              `- baseUrl: ${baseUrl}`,
              `- login: ${apiKey ? "configured" : "missing"}`,
            ].join("\n"),
          };
        }

        if (action === "login") {
          const apiKey = tokens[1]?.trim() ?? "";
          const baseUrl = tokens[2]?.trim();

          if (!apiKey) {
            return {
              text: "Usage: /clawlink login <apiKey> [baseUrl]\nCreate a key at https://claw-link.dev/dashboard/settings",
            };
          }

          const nextBaseUrl = isNonEmptyString(baseUrl)
            ? normalizeBaseUrl(baseUrl)
            : undefined;

          await persistPluginConfig(api, (config) =>
            updatePluginEntryConfig(config, (pluginConfig) => ({
              ...pluginConfig,
              apiKey,
              ...(nextBaseUrl ? { baseUrl: nextBaseUrl } : {}),
            })),
          );

          return {
            text: [
              `ClawLink API key saved: ${maskSecret(apiKey)}`,
              nextBaseUrl ? `Base URL saved: ${nextBaseUrl}` : null,
              "You can retry your connection request now.",
            ]
              .filter(Boolean)
              .join("\n"),
          };
        }

        if (action === "base-url") {
          const requested = tokens[1]?.trim() ?? "";

          if (!requested) {
            return { text: "Usage: /clawlink base-url <url>\nUsage: /clawlink base-url default" };
          }

          await persistPluginConfig(api, (config) =>
            updatePluginEntryConfig(config, (pluginConfig) => {
              const nextPluginConfig = { ...pluginConfig };

              if (requested === "default" || requested === "reset") {
                delete nextPluginConfig.baseUrl;
              } else {
                nextPluginConfig.baseUrl = normalizeBaseUrl(requested);
              }

              return nextPluginConfig;
            }),
          );

          return {
            text:
              requested === "default" || requested === "reset"
                ? `ClawLink base URL reset to ${DEFAULT_BASE_URL}.`
                : `ClawLink base URL saved: ${normalizeBaseUrl(requested)}`,
          };
        }

        if (action === "logout") {
          await persistPluginConfig(api, (config) =>
            updatePluginEntryConfig(config, (pluginConfig) => {
              const nextPluginConfig = { ...pluginConfig };

              delete nextPluginConfig.apiKey;

              return nextPluginConfig;
            }),
          );

          return { text: "ClawLink API key removed from OpenClaw config." };
        }

        return { text: buildCommandHelp() };
      },
    });

    api.registerTool({
      name: "clawlink_start_connection",
      description: "Start a hosted ClawLink connection session for an integration such as Slack or GitHub.",
      parameters: Type.Object({
        integration: Type.String({
          description: "Integration slug to connect, for example slack, github, or notion.",
          minLength: 1,
        }),
      }),
      async execute(_id, params) {
        const integration = isNonEmptyString(params.integration) ? params.integration.trim() : "";

        if (!integration) {
          throw new Error("integration is required");
        }

        const payload = await callClawLink(api, "/api/connect/start", {
          method: "POST",
          body: { integration },
        });

        return textResult(buildStartConnectionText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_get_connection_status",
      description: "Check the current status of a hosted ClawLink connection session.",
      parameters: Type.Object({
        sessionToken: Type.String({
          description: "Session token returned by clawlink_start_connection.",
          minLength: 1,
        }),
      }),
      async execute(_id, params) {
        const sessionToken = isNonEmptyString(params.sessionToken)
          ? params.sessionToken.trim()
          : "";

        if (!sessionToken) {
          throw new Error("sessionToken is required");
        }

        const payload = await callClawLink(
          api,
          `/api/connect/sessions/${encodeURIComponent(sessionToken)}`,
        );

        return textResult(buildStatusText(payload), payload);
      },
    });
  },
};

export default clawlinkPlugin;
