import test from "node:test";
import assert from "node:assert/strict";

import clawlinkPlugin from "./index.js";

function createFakeApi() {
  const tools = new Map();

  return {
    id: "openclaw-plugin",
    pluginConfig: {
      apiKey: "cllk_test_123",
    },
    registerCommand() {},
    registerTool(definition) {
      tools.set(definition.name, definition);
    },
    getTool(name) {
      const tool = tools.get(name);
      assert.ok(tool, `Expected tool ${name} to be registered`);
      return tool;
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
      "User-Agent": "@useclawlink/openclaw-plugin/0.1.13",
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
