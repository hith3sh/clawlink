import { Type } from "@sinclair/typebox";

const PLUGIN_ID = "openclaw-plugin";
const LEGACY_PLUGIN_IDS = ["clawlink"];
const DEFAULT_BASE_URL = "https://claw-link.dev";
const USER_AGENT = "@useclawlink/openclaw-plugin/0.1.10";

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

function getPluginConfigEntry(entries, pluginId) {
  const pluginEntry = entries?.[pluginId];

  if (pluginEntry && typeof pluginEntry === "object") {
    return pluginEntry.config ?? {};
  }

  return null;
}

function getDynamicPluginConfig(api) {
  const liveConfig = api.runtime?.config?.loadConfig?.();
  const entries = liveConfig?.plugins?.entries;

  for (const pluginId of [api.id, ...LEGACY_PLUGIN_IDS]) {
    const config = getPluginConfigEntry(entries, pluginId);

    if (config) {
      return config;
    }
  }

  return api.pluginConfig ?? {};
}

function getPluginConfig(api) {
  const rawConfig = getDynamicPluginConfig(api);
  const apiKey = isNonEmptyString(rawConfig.apiKey) ? rawConfig.apiKey.trim() : "";

  return { apiKey };
}

function requireApiKey(api) {
  const { apiKey } = getPluginConfig(api);

  if (!apiKey) {
    throw new Error(
      "ClawLink is not configured yet. Ask the user to create an API key at https://claw-link.dev/dashboard/settings?tab=api, then paste the generated `/clawlink login ...` command into OpenClaw.",
    );
  }

  return { apiKey };
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

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function callClawLink(api, path, options = {}) {
  const { apiKey } = requireApiKey(api);
  const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "X-ClawLink-API-Key": apiKey,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok) {
    const details =
      Array.isArray(payload?.details) && payload.details.length > 0
        ? `\n${payload.details.join("\n")}`
        : "";
    const upgradeHint =
      typeof payload?.upgradeUrl === "string"
        ? `\nUpgrade here: ${payload.upgradeUrl}`
        : "";
    const message =
      payload && typeof payload.error === "string"
        ? `${payload.error}${details}${upgradeHint}`
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
  if (payload?.alreadyConnected) {
    const summary = {
      integration: payload.integration,
      connection: payload.connection ?? null,
    };

    return [
      `${payload.integration} is already connected through ClawLink. No new connection needed — use clawlink_list_tools and clawlink_call_tool to act on it.`,
      "",
      stringifyPayload(summary),
    ].join("\n");
  }

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

function summarizeIntegrations(payload) {
  const connections = Array.isArray(payload?.integrations) ? payload.integrations : [];
  const grouped = new Map();

  for (const connection of connections) {
    const slug = typeof connection?.integration === "string" ? connection.integration : "unknown";
    const existing = grouped.get(slug) ?? {
      integration: slug,
      connectionCount: 0,
      defaultConnectionId: null,
      connections: [],
    };

    existing.connectionCount += 1;

    if (connection?.isDefault) {
      existing.defaultConnectionId = connection.id ?? null;
    }

    existing.connections.push({
      id: connection?.id ?? null,
      connectionLabel: connection?.connectionLabel ?? null,
      accountLabel: connection?.accountLabel ?? null,
      isDefault: Boolean(connection?.isDefault),
      expiresAt: connection?.expiresAt ?? null,
    });

    grouped.set(slug, existing);
  }

  return Array.from(grouped.values()).sort((left, right) =>
    left.integration.localeCompare(right.integration),
  );
}

function buildIntegrationListText(payload) {
  const summary = summarizeIntegrations(payload);

  if (summary.length === 0) {
    return [
      "No connected ClawLink integrations found.",
      "",
      "Start a hosted connection first if the user wants to connect a new app.",
    ].join("\n");
  }

  return [
    "Connected ClawLink integrations:",
    "",
    stringifyPayload(summary),
  ].join("\n");
}

function buildToolListText(payload) {
  const tools = Array.isArray(payload?.tools) ? payload.tools : [];

  return [
    tools.length > 0 ? "Available ClawLink tools:" : "No ClawLink tools are currently available.",
    "",
    stringifyPayload(
      tools.map((tool) => ({
        integration: tool?.integration ?? null,
        name: tool?.name ?? null,
        description: tool?.description ?? null,
        accessLevel: tool?.accessLevel ?? null,
        risk: tool?.risk ?? null,
        requiresConfirmation: Boolean(tool?.requiresConfirmation),
        previewAvailable: Boolean(tool?.previewAvailable),
        tags: Array.isArray(tool?.tags) ? tool.tags : [],
        defaultConnectionId: tool?.defaultConnectionId ?? null,
        connectionCount: tool?.connectionCount ?? 0,
      })),
    ),
  ].join("\n");
}

function buildToolDescriptionText(payload) {
  const summary = payload?.tool ?? payload;

  return [
    "ClawLink tool description:",
    "",
    stringifyPayload(summary),
  ].join("\n");
}

function buildToolExecutionText(toolName, payload) {
  const summary = {
    tool: payload?.tool?.name ?? toolName,
    integration: payload?.tool?.integration ?? null,
    connectionId: payload?.connectionId ?? null,
    requiresConfirmation: Boolean(payload?.requiresConfirmation),
    policyReason: payload?.policyReason ?? null,
    args: payload?.args ?? null,
    result: payload?.result ?? payload,
  };

  return [
    `ClawLink tool result: ${toolName}`,
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
  const legacyEntry = LEGACY_PLUGIN_IDS.map((pluginId) => currentEntries[pluginId]).find(
    (entry) => entry && typeof entry === "object",
  );
  const currentEntry = currentEntries[PLUGIN_ID] ?? legacyEntry ?? {};
  const currentPluginConfig = currentEntry.config ?? {};
  const nextPluginConfig = updater({ ...currentPluginConfig });
  const nextEntries = {
    ...currentEntries,
    [PLUGIN_ID]: {
      ...currentEntry,
      enabled: true,
      config: nextPluginConfig,
    },
  };

  for (const legacyPluginId of LEGACY_PLUGIN_IDS) {
    if (legacyPluginId !== PLUGIN_ID) {
      delete nextEntries[legacyPluginId];
    }
  }

  return {
    ...config,
    plugins: {
      ...currentPlugins,
      entries: nextEntries,
    },
  };
}

function buildCommandHelp() {
  return [
    "ClawLink commands:",
    "",
    "/clawlink status",
    "/clawlink login <apiKey>",
    "/clawlink logout",
  ].join("\n");
}

const clawlinkPlugin = {
  id: PLUGIN_ID,
  name: "ClawLink",
  description: "Generic ClawLink bridge for hosted connections and dynamic integration tools inside OpenClaw",
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
          const { apiKey } = getPluginConfig(api);

          return {
            text: [
              "ClawLink status:",
              `- apiKey: ${maskSecret(apiKey)}`,
              `- login: ${apiKey ? "configured" : "missing"}`,
            ].join("\n"),
          };
        }

        if (action === "login") {
          const apiKey = tokens[1]?.trim() ?? "";

          if (!apiKey) {
            return {
              text: "Usage: /clawlink login <apiKey>\nCreate a key at https://claw-link.dev/dashboard/settings?tab=api",
            };
          }

          await persistPluginConfig(api, (config) =>
            updatePluginEntryConfig(config, (pluginConfig) => {
              const nextPluginConfig = {
                ...pluginConfig,
                apiKey,
              };

              delete nextPluginConfig.baseUrl;

              return nextPluginConfig;
            }),
          );

          return {
            text: [
              `ClawLink API key saved: ${maskSecret(apiKey)}`,
              "You can retry your connection request now.",
            ]
              .filter(Boolean)
              .join("\n"),
          };
        }

        if (action === "logout") {
          await persistPluginConfig(api, (config) =>
            updatePluginEntryConfig(config, (pluginConfig) => {
              const nextPluginConfig = { ...pluginConfig };

              delete nextPluginConfig.apiKey;
              delete nextPluginConfig.baseUrl;

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
      description: "Start (or reuse) a ClawLink connection to an external app. If the user already has an active connection for this integration, the response will be `alreadyConnected: true` and no new OAuth flow is needed — just proceed with clawlink_list_tools / clawlink_call_tool. Otherwise a hosted setup URL is returned for the user to authenticate.",
      parameters: Type.Object({
        integration: Type.String({
          description: "Integration slug to connect, for example slack, github, or notion.",
          minLength: 1,
        }),
        forceNew: Type.Optional(Type.Boolean({
          description: "Set to true only if the user explicitly wants to add an additional connection alongside an existing one. Defaults to false, which reuses the existing active connection when present.",
        })),
      }),
      async execute(_id, params) {
        const integration = isNonEmptyString(params.integration) ? params.integration.trim() : "";

        if (!integration) {
          throw new Error("integration is required");
        }

        const payload = await callClawLink(api, "/api/connect/start", {
          method: "POST",
          body: {
            integration,
            reuseIfConnected: params.forceNew !== true,
          },
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

    api.registerTool({
      name: "clawlink_list_integrations",
      description: "List all external apps and services currently connected through ClawLink.",
      parameters: Type.Object({}),
      async execute() {
        const payload = await callClawLink(api, "/api/integrations");
        return textResult(buildIntegrationListText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_list_tools",
      description: "List all available tools for the user's connected external apps and services. Call this first whenever the user wants to interact with any external app. The tool list is dynamic and is the source of truth for what the connected integrations can do right now.",
      parameters: Type.Object({}),
      async execute() {
        const payload = await callClawLink(api, "/api/tools");
        return textResult(buildToolListText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_describe_tool",
      description: "Get the input schema, safety guidance, examples, and follow-up hints for a ClawLink tool before calling it. Use this to verify how a specific live tool should be used instead of inferring provider behavior from memory.",
      parameters: Type.Object({
        tool: Type.String({
          description: "ClawLink tool name, for example notion_search or slack_send_message.",
          minLength: 1,
        }),
      }),
      async execute(_id, params) {
        const tool = isNonEmptyString(params.tool) ? params.tool.trim() : "";

        if (!tool) {
          throw new Error("tool is required");
        }

        const payload = await callClawLink(api, `/api/tools/${encodeURIComponent(tool)}`);
        return textResult(buildToolDescriptionText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_preview_tool",
      description: "Preview a ClawLink tool call before executing it. Use this for writes or anything that may require explicit confirmation.",
      parameters: Type.Object({
        tool: Type.String({
          description: "ClawLink tool name, for example notion_create_page or slack_send_message.",
          minLength: 1,
        }),
        arguments: Type.Optional(Type.Record(Type.String(), Type.Unknown(), {
          description: "Arguments for the selected tool.",
        })),
        connectionId: Type.Optional(Type.Integer({
          description: "Optional ClawLink connection id when the user has multiple connections for one integration.",
          minimum: 1,
        })),
      }),
      async execute(_id, params) {
        const tool = isNonEmptyString(params.tool) ? params.tool.trim() : "";
        const args = isPlainObject(params.arguments) ? params.arguments : {};

        if (!tool) {
          throw new Error("tool is required");
        }

        const payload = await callClawLink(
          api,
          `/api/tools/${encodeURIComponent(tool)}/preview`,
          {
            method: "POST",
            body: {
              arguments: args,
              ...(Number.isInteger(params.connectionId)
                ? { connectionId: params.connectionId }
                : {}),
            },
          },
        );

        return textResult(buildToolExecutionText(tool, payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_call_tool",
      description: "Execute an action on a connected external app or service through ClawLink. Use clawlink_list_tools to discover the live tool catalog first, then clawlink_describe_tool for usage guidance. Do not claim a capability is missing until the live tool list has been checked.",
      parameters: Type.Object({
        tool: Type.String({
          description: "ClawLink tool name, for example notion_search or github_list_issues.",
          minLength: 1,
        }),
        arguments: Type.Optional(Type.Record(Type.String(), Type.Unknown(), {
          description: "Arguments for the selected tool.",
        })),
        connectionId: Type.Optional(Type.Integer({
          description: "Optional ClawLink connection id when the user has multiple connections for one integration.",
          minimum: 1,
        })),
        confirmed: Type.Optional(Type.Boolean({
          description: "Defaults to true. Pass false only when you want ClawLink to refuse a write tool that needs explicit re-confirmation; use clawlink_preview_tool for dry runs instead.",
        })),
      }),
      async execute(_id, params) {
        const tool = isNonEmptyString(params.tool) ? params.tool.trim() : "";
        const args = isPlainObject(params.arguments) ? params.arguments : {};

        if (!tool) {
          throw new Error("tool is required");
        }

        const confirmed = params.confirmed !== false;

        const payload = await callClawLink(
          api,
          `/api/tools/${encodeURIComponent(tool)}/execute`,
          {
            method: "POST",
            body: {
              arguments: args,
              ...(Number.isInteger(params.connectionId)
                ? { connectionId: params.connectionId }
                : {}),
              confirmed,
            },
          },
        );

        return textResult(buildToolExecutionText(tool, payload), payload);
      },
    });
  },
};

export default clawlinkPlugin;
