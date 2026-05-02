import { Type } from "@sinclair/typebox";

const PLUGIN_ID = "clawlink-plugin";
const LEGACY_PLUGIN_IDS = ["clawlink", "openclaw-plugin"];
const DEFAULT_BASE_URL = "https://claw-link.dev";
const USER_AGENT = "@useclawlink/openclaw-plugin/0.1.21";

function safeTrim(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : "";
}

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
  const pendingPairing = isPlainObject(rawConfig.pendingPairing)
    ? {
        sessionToken: safeTrim(rawConfig.pendingPairing.sessionToken),
        verifier: safeTrim(rawConfig.pendingPairing.verifier),
        pairUrl: safeTrim(rawConfig.pendingPairing.pairUrl),
        displayCode: safeTrim(rawConfig.pendingPairing.displayCode),
        deviceLabel: safeTrim(rawConfig.pendingPairing.deviceLabel),
        expiresAt: safeTrim(rawConfig.pendingPairing.expiresAt),
      }
    : null;

  const normalizedPendingPairing =
    pendingPairing &&
    pendingPairing.sessionToken &&
    pendingPairing.verifier &&
    pendingPairing.pairUrl &&
    pendingPairing.displayCode &&
    pendingPairing.expiresAt
      ? pendingPairing
      : null;

  return {
    apiKey,
    pendingPairing: normalizedPendingPairing,
  };
}

function requireApiKey(api) {
  const { apiKey } = getPluginConfig(api);

  if (!apiKey) {
    throw new Error(
      "ClawLink is not configured yet. Start browser pairing with clawlink_begin_pairing. If the plugin was just installed and this chat cannot see the tools yet, start a fresh chat and retry setup there. Advanced fallback: create an API key at https://claw-link.dev/dashboard/settings?tab=api and use the plugin settings UI if your client exposes one.",
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

async function callClawLinkPublic(path, options = {}) {
  const response = await fetch(`${DEFAULT_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
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
  const integration = isNonEmptyString(payload?.integration) ? payload.integration : null;

  return [
    tools.length > 0
      ? integration
        ? `Available ClawLink tools for ${integration}:`
        : "Available ClawLink tools:"
      : integration
        ? `No ClawLink tools are currently available for ${integration}.`
        : "No ClawLink tools are currently available.",
    "",
    "Use clawlink_describe_tool with one exact tool name to fetch arguments and examples before calling it.",
    "",
    stringifyPayload(
      tools.map((tool) => ({
        integration: tool?.integration ?? null,
        name: tool?.name ?? null,
        description: tool?.description ?? tool?.summary ?? null,
        mode: tool?.mode ?? null,
        accessLevel: tool?.accessLevel ?? null,
        risk: tool?.risk ?? null,
        guidanceAvailable: Boolean(tool?.guidanceAvailable),
        requiresConfirmation: Boolean(tool?.requiresConfirmation),
        previewAvailable: Boolean(tool?.previewAvailable),
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

function buildPairingStartText(payload) {
  const summary = {
    sessionToken: payload?.sessionToken ?? null,
    displayCode: payload?.displayCode ?? null,
    deviceLabel: payload?.deviceLabel ?? null,
    pairUrl: payload?.pairUrl ?? null,
    expiresAt: payload?.expiresAt ?? null,
    pollIntervalMs: payload?.pollIntervalMs ?? null,
  };

  return [
    "ClawLink browser pairing started.",
    "",
    "Open the pairing URL in your browser, sign in to ClawLink if needed, and approve this OpenClaw device.",
    "",
    stringifyPayload(summary),
  ].join("\n");
}

function buildPairingStatusText(payload) {
  const session = payload?.session ?? payload;
  const summary = {
    status: session?.status ?? null,
    sessionToken: session?.token ?? null,
    displayCode: session?.displayCode ?? null,
    deviceLabel: session?.deviceLabel ?? null,
    approvedUserHint: session?.approvedUserHint ?? null,
    expiresAt: session?.expiresAt ?? null,
    approvedAt: session?.approvedAt ?? null,
    pairedAt: session?.pairedAt ?? null,
    pairUrl: payload?.pairUrl ?? null,
    integrations: Array.isArray(payload?.integrations) ? payload.integrations : undefined,
  };

  return [
    "ClawLink pairing status:",
    "",
    stringifyPayload(summary),
  ].join("\n");
}

function collectToolArguments(params, reservedKeys) {
  if (isPlainObject(params.arguments)) {
    return params.arguments;
  }

  const fallback = {};

  for (const [key, value] of Object.entries(params ?? {})) {
    if (reservedKeys.has(key)) {
      continue;
    }

    fallback[key] = value;
  }

  return fallback;
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

async function saveApiKeyToConfig(api, apiKey, options = {}) {
  const clearPendingPairing = options.clearPendingPairing !== false;

  await persistPluginConfig(api, (config) =>
    updatePluginEntryConfig(config, (pluginConfig) => {
      const nextPluginConfig = {
        ...pluginConfig,
        apiKey,
      };

      delete nextPluginConfig.baseUrl;

      if (clearPendingPairing) {
        delete nextPluginConfig.pendingPairing;
      }

      return nextPluginConfig;
    }),
  );
}

async function clearPendingPairing(api) {
  await persistPluginConfig(api, (config) =>
    updatePluginEntryConfig(config, (pluginConfig) => {
      const nextPluginConfig = { ...pluginConfig };
      delete nextPluginConfig.pendingPairing;
      return nextPluginConfig;
    }),
  );
}

async function savePendingPairing(api, pairing) {
  await persistPluginConfig(api, (config) =>
    updatePluginEntryConfig(config, (pluginConfig) => ({
      ...pluginConfig,
      pendingPairing: pairing,
    })),
  );
}

function isPendingPairingExpired(pendingPairing) {
  if (!pendingPairing?.expiresAt) {
    return true;
  }

  const expiresAt = Date.parse(pendingPairing.expiresAt);

  return Number.isFinite(expiresAt) ? expiresAt <= Date.now() : true;
}

async function exchangeAndFinalizePairing(api, pendingPairing) {
  const exchanged = await callClawLinkPublic(
    `/api/openclaw/pair/sessions/${encodeURIComponent(pendingPairing.sessionToken)}/exchange`,
    {
      method: "POST",
      body: { verifier: pendingPairing.verifier },
    },
  );
  const apiKey = safeTrim(exchanged?.apiKey);

  if (!apiKey) {
    throw new Error("ClawLink pairing did not return a local device credential.");
  }

  await saveApiKeyToConfig(api, apiKey, {
    clearPendingPairing: false,
  });

  let finalizedSession = exchanged?.session ?? null;

  try {
    const finalized = await callClawLinkPublic(
      `/api/openclaw/pair/sessions/${encodeURIComponent(pendingPairing.sessionToken)}/finalize`,
      {
        method: "POST",
        body: { verifier: pendingPairing.verifier },
      },
    );
    finalizedSession = finalized?.session ?? finalizedSession;
    await clearPendingPairing(api);
  } catch {
    // Keep the pending pairing marker so the plugin can retry finalization later.
  }

  const integrationsPayload = await callClawLink(api, "/api/integrations").catch(() => ({
    integrations: [],
  }));

  return {
    session: finalizedSession,
    integrations: Array.isArray(integrationsPayload?.integrations)
      ? integrationsPayload.integrations
      : [],
  };
}

async function getPairingStatus(api) {
  const { pendingPairing, apiKey } = getPluginConfig(api);

  if (!pendingPairing) {
    if (apiKey) {
      const integrationsPayload = await callClawLink(api, "/api/integrations").catch(() => ({
        integrations: [],
      }));

      return {
        session: {
          status: "paired",
          token: null,
          displayCode: null,
          deviceLabel: null,
          approvedUserHint: null,
          expiresAt: null,
          approvedAt: null,
          pairedAt: null,
        },
        integrations: Array.isArray(integrationsPayload?.integrations)
          ? integrationsPayload.integrations
          : [],
      };
    }

    throw new Error("No ClawLink pairing session is in progress.");
  }

  if (isPendingPairingExpired(pendingPairing)) {
    await clearPendingPairing(api);
    throw new Error("The pending ClawLink pairing session expired. Start a new pairing flow.");
  }

  const payload = await callClawLinkPublic(
    `/api/openclaw/pair/sessions/${encodeURIComponent(pendingPairing.sessionToken)}`,
  );
  const status = safeTrim(payload?.session?.status);

  if (status === "ready_for_device" || status === "awaiting_local_save") {
    const completed = await exchangeAndFinalizePairing(api, pendingPairing);

    return {
      session: {
        ...(completed.session ?? {}),
      },
      pairUrl: pendingPairing.pairUrl,
      integrations: completed.integrations,
    };
  }

  if (status === "expired" || status === "failed") {
    await clearPendingPairing(api);
  }

  return {
    ...payload,
    pairUrl: pendingPairing.pairUrl,
  };
}

function buildCommandHelp() {
  return [
    "ClawLink commands:",
    "",
    "/clawlink pair [deviceLabel]",
    "/clawlink pair-status",
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
          const { apiKey, pendingPairing } = getPluginConfig(api);

          return {
            text: [
              "ClawLink status:",
              `- apiKey: ${maskSecret(apiKey)}`,
              `- login: ${apiKey ? "configured" : "missing"}`,
              `- pairing: ${
                pendingPairing
                  ? isPendingPairingExpired(pendingPairing)
                    ? "expired"
                    : "pending"
                  : apiKey
                    ? "not needed"
                    : "idle"
              }`,
              ...(pendingPairing && !isPendingPairingExpired(pendingPairing)
                ? [
                    `- pairUrl: ${pendingPairing.pairUrl}`,
                    `- displayCode: ${pendingPairing.displayCode}`,
                    `- expiresAt: ${pendingPairing.expiresAt}`,
                  ]
                : []),
            ].join("\n"),
          };
        }

        if (action === "pair") {
          const { apiKey, pendingPairing } = getPluginConfig(api);

          if (apiKey) {
            return {
              text: "ClawLink is already configured on this OpenClaw install. Use /clawlink logout first if you want to pair a different account.",
            };
          }

          if (pendingPairing && !isPendingPairingExpired(pendingPairing)) {
            return {
              text: buildPairingStartText({
                sessionToken: pendingPairing.sessionToken,
                displayCode: pendingPairing.displayCode,
                deviceLabel: pendingPairing.deviceLabel || "OpenClaw device",
                pairUrl: pendingPairing.pairUrl,
                expiresAt: pendingPairing.expiresAt,
                pollIntervalMs: 3000,
              }),
            };
          }

          const deviceLabel = tokens.slice(1).join(" ").trim() || "OpenClaw device";
          const payload = await callClawLinkPublic("/api/openclaw/pair/start", {
            method: "POST",
            body: { deviceLabel },
          });

          await savePendingPairing(api, {
            sessionToken: payload.sessionToken,
            verifier: payload.verifier,
            pairUrl: payload.pairUrl,
            displayCode: payload.displayCode,
            deviceLabel: payload.deviceLabel || deviceLabel,
            expiresAt: payload.expiresAt,
          });

          return { text: buildPairingStartText(payload) };
        }

        if (action === "pair-status") {
          const payload = await getPairingStatus(api);
          return { text: buildPairingStatusText(payload) };
        }

        if (action === "login") {
          const apiKey = tokens[1]?.trim() ?? "";

          if (!apiKey) {
            return {
              text: "Usage: /clawlink login <apiKey>\nCreate a key at https://claw-link.dev/dashboard/settings?tab=api",
            };
          }

          await saveApiKeyToConfig(api, apiKey);

          return {
            text: [
              `ClawLink API key saved: ${maskSecret(apiKey)}`,
              "ClawLink is configured on this OpenClaw install.",
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
              delete nextPluginConfig.pendingPairing;

              return nextPluginConfig;
            }),
          );

          return { text: "ClawLink credentials removed from local OpenClaw config." };
        }

        return { text: buildCommandHelp() };
      },
    });

    api.registerTool({
      name: "clawlink_begin_pairing",
      description: "Start or resume browser pairing for this OpenClaw install. Use this when ClawLink is not configured yet so the user can approve the device in a browser without copy/pasting an API key.",
      parameters: Type.Object({
        deviceLabel: Type.Optional(Type.String({
          description: "Optional friendly label for this OpenClaw device, for example Steve's MacBook.",
          minLength: 1,
        })),
      }),
      async execute(_id, params) {
        const { apiKey, pendingPairing } = getPluginConfig(api);

        if (apiKey) {
          return textResult(
            "ClawLink is already configured on this OpenClaw install. No pairing is needed unless the user wants to switch accounts.",
            {
              configured: true,
            },
          );
        }

        if (pendingPairing && isPendingPairingExpired(pendingPairing)) {
          await clearPendingPairing(api);
        }

        const deviceLabel = isNonEmptyString(params.deviceLabel)
          ? params.deviceLabel.trim()
          : "OpenClaw device";

        if (pendingPairing && !isPendingPairingExpired(pendingPairing)) {
          const payload = {
            sessionToken: pendingPairing.sessionToken,
            displayCode: pendingPairing.displayCode,
            deviceLabel: pendingPairing.deviceLabel || deviceLabel,
            pairUrl: pendingPairing.pairUrl,
            expiresAt: pendingPairing.expiresAt,
            pollIntervalMs: 3000,
          };

          return textResult(buildPairingStartText(payload), payload);
        }

        const payload = await callClawLinkPublic("/api/openclaw/pair/start", {
          method: "POST",
          body: {
            deviceLabel,
          },
        });

        await savePendingPairing(api, {
          sessionToken: payload.sessionToken,
          verifier: payload.verifier,
          pairUrl: payload.pairUrl,
          displayCode: payload.displayCode,
          deviceLabel: payload.deviceLabel || deviceLabel,
          expiresAt: payload.expiresAt,
        });

        return textResult(buildPairingStartText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_get_pairing_status",
      description: "Check whether browser pairing has been approved yet. When the browser approval is complete, this tool automatically exchanges the approved session for a locally stored ClawLink credential and finalizes pairing.",
      parameters: Type.Object({}),
      async execute() {
        const payload = await getPairingStatus(api);
        return textResult(buildPairingStatusText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_start_connection",
      description: "Internal: check whether a ClawLink integration is already connected. Prefer `clawlink_list_integrations` for this. Do NOT use this tool to start a new connection from chat — when an integration is not connected, tell the user to open https://claw-link.dev/dashboard and connect it there. If the user already has an active connection, the response will be `alreadyConnected: true`.",
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
      description: "Internal: poll a hosted ClawLink connection session by token. Rarely needed — connection setup is done in the dashboard at https://claw-link.dev/dashboard, and `clawlink_list_integrations` is the right way to confirm a new connection is live.",
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
      description: "List available tools for the user's connected external apps and services. Call this first whenever the user wants to interact with any external app. For large accounts, pass an integration slug such as youtube, gmail, or slack so the response stays focused. The tool list is dynamic and is the source of truth for what the connected integrations can do right now.",
      parameters: Type.Object({
        integration: Type.Optional(Type.String({
          description: "Optional integration slug to list only that app's tools, for example youtube, gmail, slack, notion, or github.",
          minLength: 1,
        })),
      }),
      async execute(_id, params) {
        const integration = isNonEmptyString(params?.integration)
          ? params.integration.trim().toLowerCase()
          : "";
        const path = integration
          ? `/api/tools?${new URLSearchParams({ integration }).toString()}`
          : "/api/tools";
        const payload = await callClawLink(api, path);
        return textResult(buildToolListText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_describe_tool",
      description: "Get the input schema, safety guidance, examples, and follow-up hints for a ClawLink tool before calling it. Use this to verify how a specific live tool should be used instead of inferring provider behavior from memory.",
      parameters: Type.Object({
        tool: Type.String({
          description: "ClawLink tool name, for example notion_search or gmail_find_email.",
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
          description: "ClawLink tool name, for example notion_create_page or gmail_send_email.",
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
        const args = collectToolArguments(
          params,
          new Set(["tool", "arguments", "connectionId"]),
        );

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
        const args = collectToolArguments(
          params,
          new Set(["tool", "arguments", "connectionId", "confirmed"]),
        );

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
