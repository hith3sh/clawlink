export const OPENCLAW_PLUGIN_PACKAGE = "@useclawlink/openclaw-plugin";
export const OPENCLAW_PLUGIN_INSTALL_COMMAND = `openclaw plugins install ${OPENCLAW_PLUGIN_PACKAGE}`;
export const CLAWLINK_API_SETTINGS_URL = "https://claw-link.dev/dashboard/settings?tab=api";
export const CLAWLINK_OPENCLAW_DOCS_URL = "https://docs.claw-link.dev/openclaw";
export const OPENCLAW_PLUGIN_SETUP_PROMPT = `This is the official ClawLink setup flow for OpenClaw.

Install the first-party plugin:
${OPENCLAW_PLUGIN_INSTALL_COMMAND}

Then open:
${CLAWLINK_API_SETTINGS_URL}

Create an API key in the ClawLink dashboard and paste the dashboard-generated login command back into chat.

Expected command format:
/clawlink login cllk_live_...

Verify setup with:
/clawlink status

Canonical docs:
${CLAWLINK_OPENCLAW_DOCS_URL}`;
