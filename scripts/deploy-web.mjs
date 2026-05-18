#!/usr/bin/env node

import { spawnSync } from "node:child_process";

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
  run("npm", ["run", "build:web"]);
}

run("npm", ["run", "migrate:web"]);

run("wrangler", ["deploy", "--config", "wrangler.toml", ...wranglerArgs], {
  env: {
    OPEN_NEXT_DEPLOY: "true",
  },
});
