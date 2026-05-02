import test from "node:test";
import assert from "node:assert/strict";

import clawlinkPlugin from "./index.js";

function createFakeApi(initialPluginConfig = {
  apiKey: "cllk_test_123",
}) {
  const tools = new Map();
  const commands = new Map();
  let fileConfig = {
    plugins: {
      entries: {
        "clawlink-plugin": {
          enabled: true,
          config: structuredClone(initialPluginConfig),
        },
      },
    },
  };

  return {
    id: "clawlink-plugin",
    pluginConfig: structuredClone(initialPluginConfig),
    runtime: {
      config: {
        loadConfig() {
          return structuredClone(fileConfig);
        },
        async writeConfigFile(nextConfig) {
          fileConfig = structuredClone(nextConfig);
          return fileConfig;
        },
      },
    },
    registerCommand(definition) {
      commands.set(definition.name, definition);
    },
    registerTool(definition) {
      tools.set(definition.name, definition);
    },
    getTool(name) {
      const tool = tools.get(name);
      assert.ok(tool, `Expected tool ${name} to be registered`);
      return tool;
    },
    getCommand(name) {
      const command = commands.get(name);
      assert.ok(command, `Expected command ${name} to be registered`);
      return command;
    },
    getPluginConfig() {
      return structuredClone(fileConfig.plugins.entries["clawlink-plugin"].config);
    },
  };
}

async function withFetchMock(handler, run) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = handler;

  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function successResponse(payload = {}) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

test("clawlink_call_tool forwards nested arguments unchanged", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_call_tool");
  let capturedRequest = null;

  await withFetchMock(async (url, options) => {
    capturedRequest = {
      url,
      method: options.method,
      headers: options.headers,
      body: JSON.parse(options.body),
    };

    return successResponse({ ok: true });
  }, async () => {
    await tool.execute("test", {
      tool: "gmail_send_email",
      arguments: {
        to: ["person@example.com"],
        subject: "Hello",
        body: "Test body",
      },
      connectionId: 12,
      confirmed: true,
    });
  });

  assert.deepEqual(capturedRequest, {
    url: "https://claw-link.dev/api/tools/gmail_send_email/execute",
    method: "POST",
    headers: {
      "X-ClawLink-API-Key": "cllk_test_123",
      "Content-Type": "application/json",
      "User-Agent": "@useclawlink/openclaw-plugin/0.1.38",
    },
    body: {
      arguments: {
        to: ["person@example.com"],
        subject: "Hello",
        body: "Test body",
      },
      connectionId: 12,
      confirmed: true,
    },
  });
});

test("clawlink_call_tool falls back to top-level tool args", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_call_tool");
  let capturedBody = null;

  await withFetchMock(async (_url, options) => {
    capturedBody = JSON.parse(options.body);
    return successResponse({ ok: true });
  }, async () => {
    await tool.execute("test", {
      tool: "gmail_send_email",
      to: ["person@example.com"],
      subject: "Hello",
      body: "Test body",
      connectionId: 12,
    });
  });

  assert.deepEqual(capturedBody, {
    arguments: {
      to: ["person@example.com"],
      subject: "Hello",
      body: "Test body",
    },
    connectionId: 12,
    confirmed: true,
  });
});

test("clawlink_call_tool prefers explicit arguments over top-level fallbacks", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_call_tool");
  let capturedBody = null;

  await withFetchMock(async (_url, options) => {
    capturedBody = JSON.parse(options.body);
    return successResponse({ ok: true });
  }, async () => {
    await tool.execute("test", {
      tool: "gmail_send_email",
      arguments: {
        to: ["nested@example.com"],
        subject: "Nested",
        body: "Nested body",
      },
      to: ["top-level@example.com"],
      subject: "Top level",
      body: "Top level body",
      connectionId: 12,
      confirmed: false,
    });
  });

  assert.deepEqual(capturedBody, {
    arguments: {
      to: ["nested@example.com"],
      subject: "Nested",
      body: "Nested body",
    },
    connectionId: 12,
    confirmed: false,
  });
});

test("clawlink_preview_tool also accepts top-level tool args", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_preview_tool");
  let capturedBody = null;

  await withFetchMock(async (_url, options) => {
    capturedBody = JSON.parse(options.body);
    return successResponse({ ok: true });
  }, async () => {
    await tool.execute("test", {
      tool: "gmail_send_email",
      to: ["person@example.com"],
      subject: "Preview",
      body: "Preview body",
      connectionId: 12,
    });
  });

  assert.deepEqual(capturedBody, {
    arguments: {
      to: ["person@example.com"],
      subject: "Preview",
      body: "Preview body",
    },
    connectionId: 12,
  });
});

test("clawlink_list_tools requires an integration slug", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_list_tools");

  await assert.rejects(
    () => tool.execute("test", {}),
    /integration is required/,
  );
});

test("clawlink_list_tools lists compact tools for one integration", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_list_tools");
  let capturedRequest = null;

  await withFetchMock(async (url, options) => {
    capturedRequest = {
      url,
      method: options.method,
    };

    return successResponse({
      tools: [
        {
          integration: "youtube",
          name: "youtube_list_user_playlists",
          description: "List playlists owned by the authenticated YouTube user.",
          mode: "read",
          accessLevel: "read",
          risk: "low",
          guidanceAvailable: false,
          requiresConfirmation: false,
          previewAvailable: true,
          defaultConnectionId: 23,
          connectionCount: 1,
        },
      ],
      count: 1,
      integration: "youtube",
    });
  }, async () => {
    const result = await tool.execute("test", { integration: " YouTube " });

    assert.match(result.content[0].text, /Available ClawLink tools for youtube:/);
    assert.match(result.content[0].text, /youtube_list_user_playlists/);
    assert.match(result.content[0].text, /clawlink_describe_tool/);
    assert.doesNotMatch(result.content[0].text, /inputSchema/);
  });

  assert.deepEqual(capturedRequest, {
    url: "https://claw-link.dev/api/tools?integration=youtube",
    method: "GET",
  });
});

test("clawlink_search_tools searches compact tools with integration and limit", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_search_tools");
  let capturedRequest = null;

  await withFetchMock(async (url, options) => {
    capturedRequest = {
      url,
      method: options.method,
    };

    return successResponse({
      tools: [
        {
          integration: "youtube",
          name: "youtube_list_user_playlists",
          description: "List playlists owned by the authenticated YouTube user.",
          mode: "read",
          accessLevel: "read",
          risk: "low",
          guidanceAvailable: true,
          requiresConfirmation: false,
          previewAvailable: true,
          defaultConnectionId: 23,
          connectionCount: 1,
        },
      ],
      count: 1,
      query: "playlist",
      integration: "youtube",
    });
  }, async () => {
    const result = await tool.execute("test", {
      query: "playlist",
      integration: " YouTube ",
      limit: 7,
    });

    assert.match(result.content[0].text, /Matching ClawLink tools for youtube and "playlist":/);
    assert.match(result.content[0].text, /youtube_list_user_playlists/);
    assert.doesNotMatch(result.content[0].text, /inputSchema/);
  });

  assert.deepEqual(capturedRequest, {
    url: "https://claw-link.dev/api/tools/search?query=playlist&integration=youtube&limit=7",
    method: "GET",
  });
});

test("clawlink_search_tools requires a query", async () => {
  const api = createFakeApi();
  clawlinkPlugin.register(api);
  const tool = api.getTool("clawlink_search_tools");

  await assert.rejects(
    () => tool.execute("test", { integration: "youtube" }),
    /query is required/,
  );
});

test("clawlink_get_pairing_status exchanges the approved session and clears pending pairing after finalize", async () => {
  const api = createFakeApi({});
  clawlinkPlugin.register(api);
  const beginPairing = api.getTool("clawlink_begin_pairing");
  const getPairingStatus = api.getTool("clawlink_get_pairing_status");
  const requests = [];

  await withFetchMock(async (url, options = {}) => {
    requests.push({
      url,
      method: options.method ?? "GET",
      headers: options.headers ?? {},
      body: options.body ? JSON.parse(options.body) : null,
    });

    if (url === "https://claw-link.dev/api/openclaw/pair/start") {
      return successResponse({
        sessionToken: "pair_sess_123",
        displayCode: "ABCD1234",
        deviceLabel: "Steve's MacBook",
        pairUrl: "https://claw-link.dev/openclaw/pair/pair_sess_123",
        expiresAt: "2099-05-01T01:15:00.000Z",
        verifier: "pair_verifier_123",
        pollIntervalMs: 3000,
      });
    }

    if (url === "https://claw-link.dev/api/openclaw/pair/sessions/pair_sess_123") {
      return successResponse({
        session: {
          token: "pair_sess_123",
          displayCode: "ABCD1234",
          deviceLabel: "Steve's MacBook",
          status: "ready_for_device",
          expiresAt: "2099-05-01T01:15:00.000Z",
          approvedAt: "2026-05-01T01:02:00.000Z",
          pairedAt: null,
        },
      });
    }

    if (url === "https://claw-link.dev/api/openclaw/pair/sessions/pair_sess_123/exchange") {
      return successResponse({
        session: {
          token: "pair_sess_123",
          displayCode: "ABCD1234",
          deviceLabel: "Steve's MacBook",
          status: "awaiting_local_save",
          expiresAt: "2099-05-01T01:15:00.000Z",
          approvedAt: "2026-05-01T01:02:00.000Z",
          pairedAt: null,
        },
        apiKey: "cllk_test_paired_123",
        apiKeyId: 41,
      });
    }

    if (url === "https://claw-link.dev/api/openclaw/pair/sessions/pair_sess_123/finalize") {
      return successResponse({
        session: {
          token: "pair_sess_123",
          displayCode: "ABCD1234",
          deviceLabel: "Steve's MacBook",
          status: "paired",
          expiresAt: "2099-05-01T01:15:00.000Z",
          approvedAt: "2026-05-01T01:02:00.000Z",
          pairedAt: "2026-05-01T01:03:00.000Z",
        },
      });
    }

    if (url === "https://claw-link.dev/api/integrations") {
      return successResponse({
        integrations: [
          {
            id: 7,
            integration: "gmail",
            isDefault: true,
            connectionLabel: "Work",
            accountLabel: "steve@example.com",
          },
        ],
      });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }, async () => {
    await beginPairing.execute("test", { deviceLabel: "Steve's MacBook" });
    const result = await getPairingStatus.execute("test", {});

    assert.equal(result.details.session.status, "paired");
    assert.deepEqual(result.details.integrations, [
      {
        id: 7,
        integration: "gmail",
        isDefault: true,
        connectionLabel: "Work",
        accountLabel: "steve@example.com",
      },
    ]);
  });

  assert.deepEqual(api.getPluginConfig(), {
    apiKey: "cllk_test_paired_123",
  });

  const integrationRequest = requests.find(
    (request) => request.url === "https://claw-link.dev/api/integrations",
  );
  assert.equal(integrationRequest?.headers["X-ClawLink-API-Key"], "cllk_test_paired_123");
});

test("clawlink_get_pairing_status preserves pending pairing when finalize fails", async () => {
  const api = createFakeApi({});
  clawlinkPlugin.register(api);
  const beginPairing = api.getTool("clawlink_begin_pairing");
  const getPairingStatus = api.getTool("clawlink_get_pairing_status");

  await withFetchMock(async (url) => {
    if (url === "https://claw-link.dev/api/openclaw/pair/start") {
      return successResponse({
        sessionToken: "pair_sess_124",
        displayCode: "ZXCV5678",
        deviceLabel: "OpenClaw device",
        pairUrl: "https://claw-link.dev/openclaw/pair/pair_sess_124",
        expiresAt: "2099-05-01T01:20:00.000Z",
        verifier: "pair_verifier_124",
        pollIntervalMs: 3000,
      });
    }

    if (url === "https://claw-link.dev/api/openclaw/pair/sessions/pair_sess_124") {
      return successResponse({
        session: {
          token: "pair_sess_124",
          displayCode: "ZXCV5678",
          deviceLabel: "OpenClaw device",
          status: "ready_for_device",
          expiresAt: "2099-05-01T01:20:00.000Z",
          approvedAt: "2026-05-01T01:04:00.000Z",
          pairedAt: null,
        },
      });
    }

    if (url === "https://claw-link.dev/api/openclaw/pair/sessions/pair_sess_124/exchange") {
      return successResponse({
        session: {
          token: "pair_sess_124",
          displayCode: "ZXCV5678",
          deviceLabel: "OpenClaw device",
          status: "awaiting_local_save",
          expiresAt: "2099-05-01T01:20:00.000Z",
          approvedAt: "2026-05-01T01:04:00.000Z",
          pairedAt: null,
        },
        apiKey: "cllk_test_paired_124",
        apiKeyId: 42,
      });
    }

    if (url === "https://claw-link.dev/api/openclaw/pair/sessions/pair_sess_124/finalize") {
      return new Response(JSON.stringify({ error: "transient failure" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (url === "https://claw-link.dev/api/integrations") {
      return successResponse({ integrations: [] });
    }

    throw new Error(`Unexpected fetch: ${url}`);
  }, async () => {
    await beginPairing.execute("test", {});
    const result = await getPairingStatus.execute("test", {});

    assert.equal(result.details.session.status, "awaiting_local_save");
  });

  assert.deepEqual(api.getPluginConfig(), {
    apiKey: "cllk_test_paired_124",
    pendingPairing: {
      sessionToken: "pair_sess_124",
      verifier: "pair_verifier_124",
      pairUrl: "https://claw-link.dev/openclaw/pair/pair_sess_124",
      displayCode: "ZXCV5678",
      deviceLabel: "OpenClaw device",
      expiresAt: "2099-05-01T01:20:00.000Z",
    },
  });
});
