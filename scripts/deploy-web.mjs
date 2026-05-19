#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Load .env.production and use it as overrides so .env.local cannot win.
function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, "utf8");
    const env = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
    }
    return env;
  } catch {
    return {};
  }
}

const prodEnv = loadEnvFile(resolve(import.meta.dirname, "../.env.production"));

const wranglerArgs = process.argv.slice(2);
const isWorkersBuild = process.env.WORKERS_CI === "1";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      ...options.env,
    },
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (isWorkersBuild) {
  console.log("[deploy:web] Workers Builds detected; using the existing OpenNext build output.");
} else {
  // Pass .env.production values as explicit env vars so they override .env.local
  run("npm", ["run", "build:web"], { env: prodEnv });
}

run("npm", ["run", "migrate:web"]);

run("wrangler", ["deploy", "--config", "wrangler.toml", ...wranglerArgs], {
  env: {
    OPEN_NEXT_DEPLOY: "true",
  },
});
