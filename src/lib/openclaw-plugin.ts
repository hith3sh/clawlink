export const OPENCLAW_PLUGIN_PACKAGE = "@useclawlink/openclaw-plugin";
export const OPENCLAW_PLUGIN_INSTALL_COMMAND = `openclaw plugins install ${OPENCLAW_PLUGIN_PACKAGE}`;
export const CLAWLINK_API_SETTINGS_URL = "https://claw-link.dev/dashboard/settings?tab=api";
export const CLAWLINK_OPENCLAW_DOCS_URL = "https://docs.claw-link.dev/openclaw";
export const OPENCLAW_PLUGIN_SETUP_PROMPT = `Please install the ClawLink plugin.

Install:
${OPENCLAW_PLUGIN_INSTALL_COMMAND}

After installation, tell me to open:
${CLAWLINK_API_SETTINGS_URL}

I’ll create an API key there and paste the generated \`/clawlink login ...\` command back here.

Docs:
${CLAWLINK_OPENCLAW_DOCS_URL}`;
