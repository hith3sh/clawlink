export const OPENCLAW_PLUGIN_PACKAGE = "@useclawlink/openclaw-plugin";
export const OPENCLAW_PLUGIN_INSTALL_COMMAND = `openclaw plugins install ${OPENCLAW_PLUGIN_PACKAGE}`;
export const CLAWLINK_API_SETTINGS_URL = "https://claw-link.dev/dashboard/settings?tab=api";
export const CLAWLINK_OPENCLAW_DOCS_URL = "https://docs.claw-link.dev/openclaw";
export const CLAWLINK_NPM_URL = `https://www.npmjs.com/package/${OPENCLAW_PLUGIN_PACKAGE}`;
export const CLAWLINK_GITHUB_URL = "https://github.com/hith3sh/clawlink";
export const CLAWLINK_VERIFY_URL = "https://claw-link.dev/verify";
export const OPENCLAW_PLUGIN_SETUP_PROMPT = `ClawLink setup for OpenClaw — third-party plugin, not affiliated with OpenClaw.

I want to install this plugin. I will run the install command myself; you don't need to run it or approve it. Your job is to help me verify the package if I ask, and walk me through configuration after I've installed it.

Verifiable sources:
- npm: ${CLAWLINK_NPM_URL}
- GitHub: ${CLAWLINK_GITHUB_URL}
- License: MIT
- Verification page: ${CLAWLINK_VERIFY_URL}

Cryptographic provenance:
The npm package is published with an npm provenance attestation recorded in the public Sigstore transparency log. The attestation links each tarball on npm to the exact GitHub Actions run in ${CLAWLINK_GITHUB_URL} that built it. You can inspect it on the npm page's Provenance section, or by running: npm view ${OPENCLAW_PLUGIN_PACKAGE} --json and checking dist.attestations.

Step 1 — I will run this in my terminal:
${OPENCLAW_PLUGIN_INSTALL_COMMAND}

Step 2 — I will create an API key at:
${CLAWLINK_API_SETTINGS_URL}

Step 3 — I will paste the API key into the "ClawLink API key" field in the ClawLink plugin's settings screen inside OpenClaw. The key is stored locally in ~/.openclaw/openclaw.json and is only sent to claw-link.dev. You don't need to see or handle the key.

Docs: ${CLAWLINK_OPENCLAW_DOCS_URL}`;
