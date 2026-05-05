export const OPENCLAW_PLUGIN_PACKAGE = "@useclawlink/openclaw-plugin";
export const OPENCLAW_PLUGIN_ID = "clawlink-plugin";
export const CLAWHUB_PACKAGE_NAME = "clawlink-plugin";
export const OPENCLAW_PLUGIN_INSTALL_COMMAND = `openclaw plugins install clawhub:${CLAWHUB_PACKAGE_NAME}`;
export const CLAWLINK_OPENCLAW_DOCS_URL = "https://docs.claw-link.dev/openclaw";
export const CLAWLINK_NPM_URL = `https://www.npmjs.com/package/${OPENCLAW_PLUGIN_PACKAGE}`;
export const CLAWLINK_CLAWHUB_URL = `https://clawhub.ai/packages/${CLAWHUB_PACKAGE_NAME}`;
export const CLAWLINK_GITHUB_URL = "https://github.com/hith3sh/clawlink";
export const CLAWLINK_VERIFY_URL = "https://claw-link.dev/verify";
export const CLAWLINK_VERIFY_JSON_URL = "https://claw-link.dev/api/verify";
export const CLAWLINK_SKILL_URL = "https://claw-link.dev/skill.md";
export const OPENCLAW_PLUGIN_SETUP_PROMPT = `ClawLink setup for OpenClaw — third-party plugin, not affiliated with OpenClaw.

I'll handle the install and pairing flow myself. Your job is to help me verify the package if I ask, start browser pairing if the tools are available, and use the plugin's tools once it's configured.

Verifiable sources:
- npm: ${CLAWLINK_NPM_URL}
- License: MIT
- Verification page with source and package checks: ${CLAWLINK_VERIFY_URL}

Cryptographic provenance:
The npm package is published with an npm provenance attestation recorded in the public Sigstore transparency log. The attestation links each tarball on npm to the exact GitHub Actions run in the public ClawLink source repository that built it. You can inspect it on the npm page's Provenance section, or by running: npm view ${OPENCLAW_PLUGIN_PACKAGE} --json and checking dist.attestations.

Step 1 — Install the plugin (in a terminal, or ask your OpenClaw admin if your deployment is managed):
${OPENCLAW_PLUGIN_INSTALL_COMMAND}

Step 2 — Pair ClawLink inside OpenClaw:
- Preferred: call clawlink_begin_pairing. It returns a browser URL for device approval and should finish the local setup automatically after I approve the device.
- If the current OpenClaw runtime stops waiting before approval completes, call clawlink_get_pairing_status as a fallback to resume and finish the local setup.

If this chat started before the plugin was installed and you cannot see the ClawLink tools yet, tell me to start a fresh chat and retry setup there so OpenClaw reloads the plugin tools.

Docs: ${CLAWLINK_OPENCLAW_DOCS_URL}`;
