import { Type } from "@sinclair/typebox";

const PLUGIN_ID = "clawlink-plugin";
const LEGACY_PLUGIN_IDS = ["clawlink", "openclaw-plugin"];
const DEFAULT_BASE_URL = "https://claw-link.dev";
const USER_AGENT = "@useclawlink/openclaw-plugin/0.1.40";
const DEFAULT_PAIRING_POLL_INTERVAL_MS = 3000;
const DEFAULT_PAIRING_WAIT_TIMEOUT_MS = 5 * 60 * 1000;

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

function readApiKey(config) {
  return isNonEmptyString(config.apiKey) ? config.apiKey.trim() : "";
}

function getPluginConfig(api) {
  const rawConfig = getDynamicPluginConfig(api);
  const apiKey = readApiKey(rawConfig);
  const pendingPairing = isPlainObject(rawConfig.pendingPairing)
    ? {
        sessionToken: safeTrim(rawConfig.pendingPairing.sessionToken),
        verifier: safeTrim(rawConfig.pendingPairing.verifier),
        pairUrl: safeTrim(rawConfig.pendingPairing.pairUrl),
        displayCode: safeTrim(rawConfig.pendingPairing.displayCode) || null,
        deviceLabel: safeTrim(rawConfig.pendingPairing.deviceLabel),
        expiresAt: safeTrim(rawConfig.pendingPairing.expiresAt),
      }
    : null;

  const normalizedPendingPairing =
    pendingPairing &&
    pendingPairing.sessionToken &&
    pendingPairing.verifier &&
    pendingPairing.pairUrl &&
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
      "ClawLink is not configured yet. Start browser pairing with clawlink_begin_pairing. If the plugin was just installed and this chat cannot see the tools yet, start a fresh chat and retry setup there.",
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

function collectErrorFields(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isNonEmptyString).map((item) => item.trim());
}

function resolveErrorSchema(payload) {
  if (isPlainObject(payload?.inputSchema)) {
    return payload.inputSchema;
  }

  if (isPlainObject(payload?.tool) && isPlainObject(payload.tool.inputSchema)) {
    return payload.tool.inputSchema;
  }

  return null;
}

function formatStructuredClawLinkError(payload, status) {
  if (payload && typeof payload.error === "string") {
    const details =
      Array.isArray(payload?.details) && payload.details.length > 0
        ? `\n${payload.details.join("\n")}`
        : "";
    const upgradeHint =
      typeof payload?.upgradeUrl === "string"
        ? `\nUpgrade here: ${payload.upgradeUrl}`
        : "";
    return `${payload.error}${details}${upgradeHint}`;
  }

  const objectError = isPlainObject(payload?.error) ? payload.error : null;
  const message = isNonEmptyString(objectError?.message)
    ? objectError.message.trim()
    : isNonEmptyString(payload?.message)
      ? payload.message.trim()
      : `ClawLink request failed with status ${status}`;
  const missingFields = collectErrorFields(payload?.missingFields);
  const invalidFields = collectErrorFields(payload?.invalidFields);
  const details = collectErrorFields(payload?.details);
  const hint = isNonEmptyString(payload?.hint) ? payload.hint.trim() : "";
  const schema = resolveErrorSchema(payload);
  const lines = [message];

  if (missingFields.length > 0) {
    lines.push(`Missing fields: ${missingFields.join(", ")}`);
  }

  if (invalidFields.length > 0) {
    lines.push(`Invalid fields: ${invalidFields.join(", ")}`);
  }

  if (details.length > 0) {
    lines.push(...details);
  }

  if (hint) {
    lines.push(`Hint: ${hint}`);
  }

  if (schema) {
    lines.push("Input schema:");
    lines.push(stringifyPayload(schema));
  }

  if (typeof payload?.upgradeUrl === "string") {
    lines.push(`Upgrade here: ${payload.upgradeUrl}`);
  }

  return lines.join("\n");
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
    const error = new Error(formatStructuredClawLinkError(payload, response.status));
    error.clawlinkPayload = payload;
    error.clawlinkStatus = response.status;
    throw error;
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
      `${payload.integration} is already connected through ClawLink. No new connection needed — use clawlink_list_tools with integration "${payload.integration}" and clawlink_call_tool to act on it.`,
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
  const query = isNonEmptyString(payload?.query) ? payload.query : null;
  const heading = query
    ? integration
      ? `Matching ClawLink tools for ${integration} and "${query}":`
      : `Matching ClawLink tools for "${query}":`
    : integration
      ? `Available ClawLink tools for ${integration}:`
      : "Available ClawLink tools:";
  const emptyHeading = query
    ? integration
      ? `No matching ClawLink tools found for ${integration} and "${query}".`
      : `No matching ClawLink tools found for "${query}".`
    : integration
      ? `No ClawLink tools are currently available for ${integration}.`
      : "No ClawLink tools are currently available.";

  return [
    tools.length > 0 ? heading : emptyHeading,
    "",
    "List and search results include each tool's live inputSchema. Use clawlink_describe_tool for safety guidance, examples, and follow-up hints before unfamiliar or write calls.",
    "",
    stringifyPayload(
      tools.map((tool) => ({
        integration: tool?.integration ?? null,
        name: tool?.name ?? null,
        description: tool?.description ?? tool?.summary ?? null,
        inputSchema: tool?.inputSchema ?? null,
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

function buildToolErrorText(toolName, error) {
  const status = error?.clawlinkStatus ?? null;
  const formatted =
    typeof error?.message === "string" && error.message.trim()
      ? error.message
      : `ClawLink request failed${status ? ` with status ${status}` : ""}.`;
  return [`ClawLink tool failed: ${toolName}`, "", formatted].join("\n");
}

async function callToolWithErrorContent(toolName, api, path, options) {
  try {
    const payload = await callClawLink(api, path, options);
    return textResult(buildToolExecutionText(toolName, payload), payload);
  } catch (error) {
    if (error && typeof error === "object" && "clawlinkPayload" in error) {
      return textResult(buildToolErrorText(toolName, error), error.clawlinkPayload);
    }
    throw error;
  }
}

function buildPairingStartText(payload) {
  const summary = buildPairingSummary(payload);
  const autoFinish = payload?.autoFinish === true;

  return [
    "ClawLink browser pairing started.",
    "",
    autoFinish
      ? "Open the pairing URL in your browser, sign in to ClawLink if needed, and approve this OpenClaw device. ClawLink will keep checking and finish the local setup automatically."
      : "Open the pairing URL in your browser, sign in to ClawLink if needed, and approve this OpenClaw device. If pairing does not finish automatically in this chat, call clawlink_get_pairing_status after approval.",
    "",
    stringifyPayload(summary),
  ].join("\n");
}

function buildPairingSummary(payload) {
  const session = payload?.session ?? null;

  return {
    status: session?.status ?? payload?.status ?? null,
    sessionToken: session?.token ?? payload?.sessionToken ?? null,
    deviceLabel: session?.deviceLabel ?? payload?.deviceLabel ?? null,
    approvedUserHint: session?.approvedUserHint ?? null,
    expiresAt: session?.expiresAt ?? payload?.expiresAt ?? null,
    approvedAt: session?.approvedAt ?? null,
    pairedAt: session?.pairedAt ?? null,
    pairUrl: payload?.pairUrl ?? null,
    pollIntervalMs: payload?.pollIntervalMs ?? null,
    integrations: Array.isArray(payload?.integrations) ? payload.integrations : undefined,
  };
}

function buildPairingPendingText(payload) {
  return [
    "ClawLink pairing is still waiting for browser approval.",
    "",
    "Keep the pairing page open and approve this device. If this tool stops waiting before approval completes, call clawlink_get_pairing_status to resume the local setup.",
    "",
    stringifyPayload(buildPairingSummary(payload)),
  ].join("\n");
}

function buildPairingProgressText(payload) {
  return [
    "ClawLink browser approval received.",
    "",
    "Finishing the local setup automatically.",
    "",
    stringifyPayload(buildPairingSummary(payload)),
  ].join("\n");
}

function buildPairingCompletionText(payload) {
  return [
    "ClawLink pairing completed.",
    "",
    "The local device credential is saved and ready to use.",
    "",
    stringifyPayload(buildPairingSummary(payload)),
  ].join("\n");
}

function buildPairingStatusText(payload) {
  return [
    "ClawLink pairing status:",
    "",
    stringifyPayload(buildPairingSummary(payload)),
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

function normalizePairingPollIntervalMs(value) {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.floor(value);
  }

  return DEFAULT_PAIRING_POLL_INTERVAL_MS;
}

function resolvePairingWaitTimeoutMs(pendingPairing) {
  const expiresAt = Date.parse(pendingPairing?.expiresAt ?? "");

  if (Number.isFinite(expiresAt)) {
    return Math.max(0, Math.min(DEFAULT_PAIRING_WAIT_TIMEOUT_MS, expiresAt - Date.now()));
  }

  return DEFAULT_PAIRING_WAIT_TIMEOUT_MS;
}

function createAbortError() {
  const error = new Error("ClawLink pairing was interrupted before completion.");
  error.name = "AbortError";
  return error;
}

async function waitForPairingPollDelay(ms, signal) {
  if (ms <= 0) {
    return;
  }

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    const handleAbort = () => {
      cleanup();
      reject(createAbortError());
    };

    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", handleAbort);
    };

    if (signal?.aborted) {
      handleAbort();
      return;
    }

    signal?.addEventListener("abort", handleAbort, { once: true });
  });
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

async function waitForPairingCompletion(api, pendingPairing, options = {}) {
  const pollIntervalMs = normalizePairingPollIntervalMs(options.pollIntervalMs);
  const timeoutMs =
    typeof options.timeoutMs === "number" && Number.isFinite(options.timeoutMs)
      ? Math.max(0, Math.floor(options.timeoutMs))
      : resolvePairingWaitTimeoutMs(pendingPairing);
  const onUpdate = typeof options.onUpdate === "function" ? options.onUpdate : null;
  const initialPayload = {
    session: {
      status: "awaiting_browser",
      token: pendingPairing.sessionToken,
      deviceLabel: pendingPairing.deviceLabel || "OpenClaw device",
      approvedUserHint: null,
      expiresAt: pendingPairing.expiresAt,
      approvedAt: null,
      pairedAt: null,
    },
    pairUrl: pendingPairing.pairUrl,
    pollIntervalMs,
  };

  onUpdate?.(textResult(buildPairingStartText({ ...initialPayload, autoFinish: true }), initialPayload));

  const deadline = Date.now() + timeoutMs;
  let lastStatus = "awaiting_browser";
  let lastPayload = initialPayload;

  while (Date.now() <= deadline) {
    if (options.signal?.aborted) {
      throw createAbortError();
    }

    const payload = await getPairingStatus(api);
    const status = safeTrim(payload?.session?.status) || "awaiting_browser";

    lastPayload = payload;

    if (onUpdate && status !== lastStatus) {
      if (status === "ready_for_device" || status === "awaiting_local_save") {
        onUpdate(textResult(buildPairingProgressText(payload), payload));
      } else if (status === "paired") {
        onUpdate(textResult(buildPairingCompletionText(payload), payload));
      } else if (status === "expired" || status === "failed") {
        onUpdate(textResult(buildPairingStatusText(payload), payload));
      }
    }

    lastStatus = status;

    if (status === "paired" || status === "expired" || status === "failed") {
      return payload;
    }

    const remainingMs = deadline - Date.now();

    if (remainingMs <= 0) {
      break;
    }

    await waitForPairingPollDelay(Math.min(pollIntervalMs, remainingMs), options.signal);
  }

  return lastPayload;
}

function buildCommandHelp() {
  return [
    "ClawLink commands:",
    "",
    "/clawlink pair [deviceLabel]",
    "/clawlink pair-status",
    "/clawlink status",
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
      description: "Configure ClawLink pairing and inspect plugin status.",
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
              `- credential: ${maskSecret(apiKey)}`,
              `- configured: ${apiKey ? "yes" : "no"}`,
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
                deviceLabel: pendingPairing.deviceLabel || "OpenClaw device",
                pairUrl: pendingPairing.pairUrl,
                expiresAt: pendingPairing.expiresAt,
                pollIntervalMs: DEFAULT_PAIRING_POLL_INTERVAL_MS,
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
          return {
            text: "Manual credential entry is no longer supported. Use /clawlink pair to start browser pairing.",
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
      description: "Start or resume browser pairing for this OpenClaw install. Use this when ClawLink is not configured yet so the user can approve the device in a browser without manual credential entry. When live tool updates are available, this tool keeps watching for browser approval and finishes local setup automatically.",
      parameters: Type.Object({
        deviceLabel: Type.Optional(Type.String({
          description: "Optional friendly label for this OpenClaw device, for example Steve's MacBook.",
          minLength: 1,
        })),
      }),
      async execute(_id, params, signal, onUpdate) {
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
            status: "awaiting_browser",
            sessionToken: pendingPairing.sessionToken,
            deviceLabel: pendingPairing.deviceLabel || deviceLabel,
            pairUrl: pendingPairing.pairUrl,
            expiresAt: pendingPairing.expiresAt,
            pollIntervalMs: DEFAULT_PAIRING_POLL_INTERVAL_MS,
          };

          if (typeof onUpdate !== "function") {
            return textResult(buildPairingStartText(payload), payload);
          }

          const completedPayload = await waitForPairingCompletion(api, pendingPairing, {
            signal,
            onUpdate,
            pollIntervalMs: payload.pollIntervalMs,
          });
          const status = safeTrim(completedPayload?.session?.status);

          if (status === "paired") {
            return textResult(buildPairingCompletionText(completedPayload), completedPayload);
          }

          if (status === "expired" || status === "failed") {
            return textResult(buildPairingStatusText(completedPayload), completedPayload);
          }

          return textResult(buildPairingPendingText(completedPayload), completedPayload);
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

        const startPayload = {
          ...payload,
          pollIntervalMs: normalizePairingPollIntervalMs(payload?.pollIntervalMs),
        };

        if (typeof onUpdate !== "function") {
          return textResult(buildPairingStartText(startPayload), startPayload);
        }

        const completedPayload = await waitForPairingCompletion(api, {
          sessionToken: startPayload.sessionToken,
          verifier: payload.verifier,
          pairUrl: startPayload.pairUrl,
          displayCode: payload.displayCode,
          deviceLabel: startPayload.deviceLabel || deviceLabel,
          expiresAt: startPayload.expiresAt,
        }, {
          signal,
          onUpdate,
          pollIntervalMs: startPayload.pollIntervalMs,
        });
        const status = safeTrim(completedPayload?.session?.status);

        if (status === "paired") {
          return textResult(buildPairingCompletionText(completedPayload), completedPayload);
        }

        if (status === "expired" || status === "failed") {
          return textResult(buildPairingStatusText(completedPayload), completedPayload);
        }

        return textResult(buildPairingPendingText(completedPayload), completedPayload);
      },
    });

    api.registerTool({
      name: "clawlink_get_pairing_status",
      description: "Fallback: check whether browser pairing has been approved yet. When the browser approval is complete, this tool automatically exchanges the approved session for a locally stored ClawLink credential and finalizes pairing.",
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
      description: "List available tools for one connected integration, including each tool's live inputSchema. Always pass the integration slug from clawlink_list_integrations, for example youtube, gmail, slack, notion, or github. Use clawlink_search_tools when the user describes a capability but you are unsure which exact tool name matches.",
      parameters: Type.Object({
        integration: Type.String({
          description: "Required integration slug to list only that app's tools, for example youtube, gmail, slack, notion, or github. Call clawlink_list_integrations first if you do not know the slug.",
          minLength: 1,
        }),
      }),
      async execute(_id, params) {
        const integration = isNonEmptyString(params?.integration)
          ? params.integration.trim().toLowerCase()
          : "";

        if (!integration) {
          throw new Error("integration is required. Call clawlink_list_integrations first, then call clawlink_list_tools with that integration slug.");
        }

        const path = `/api/tools?${new URLSearchParams({ integration }).toString()}`;
        const payload = await callClawLink(api, path);
        return textResult(buildToolListText(payload), payload);
      },
    });

    api.registerTool({
      name: "clawlink_search_tools",
      description: "Search the user's connected ClawLink tools by capability or keyword without dumping the full tool catalog. Results include the live inputSchema for each match. Use this after clawlink_list_integrations when the user asks for an operation like playlists, send email, create ticket, calendar invite, or upload file. Pass integration when the app is known.",
      parameters: Type.Object({
        query: Type.String({
          description: "Capability or keyword to search for, for example playlist, send email, channel statistics, create event, upload file, or list records.",
          minLength: 1,
        }),
        integration: Type.Optional(Type.String({
          description: "Optional connected integration slug to narrow results, for example youtube, gmail, slack, notion, or github.",
          minLength: 1,
        })),
        limit: Type.Optional(Type.Integer({
          description: "Maximum number of matches to return. Defaults to 10 and is capped by ClawLink.",
          minimum: 1,
          maximum: 25,
        })),
      }),
      async execute(_id, params) {
        const query = isNonEmptyString(params?.query) ? params.query.trim() : "";

        if (!query) {
          throw new Error("query is required");
        }

        const searchParams = new URLSearchParams({ query });
        const integration = isNonEmptyString(params?.integration)
          ? params.integration.trim().toLowerCase()
          : "";

        if (integration) {
          searchParams.set("integration", integration);
        }

        if (Number.isInteger(params?.limit)) {
          searchParams.set("limit", String(params.limit));
        }

        const payload = await callClawLink(api, `/api/tools/search?${searchParams.toString()}`);
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

        return callToolWithErrorContent(
          tool,
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
      },
    });

    api.registerTool({
      name: "clawlink_call_tool",
      description: "Execute an action on a connected external app or service through ClawLink. Use app-scoped clawlink_list_tools or clawlink_search_tools to discover the live tool catalog and inputSchema first, then clawlink_describe_tool for safety guidance when needed. If ClawLink rejects the arguments, inspect the returned inputSchema and retry with corrected fields.",
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

        return callToolWithErrorContent(
          tool,
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
      },
    });
  },
};

export default clawlinkPlugin;
