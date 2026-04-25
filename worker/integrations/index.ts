/**
 * Integration handlers index
 * 
 * Import all integrations here to register them
 */

// Import and register handlers
import "./gmail";
import "./outlook";
import "./slack";
import "./github";
import "./notion";
import "./apollo";
import "./postiz";
import "./google-analytics";
import "./google-search-console";
import "./google-drive";
import "./google-docs";
import "./google-sheets";
import "./google-calendar";
import "./motion";
import "./twilio";
import "./linkedin";
import "./facebook";
import "./mailchimp";
// import "./stripe";
// etc.

export {
  classifyIntegrationError,
  defineTool,
  getIntegrationHandler,
  getAllHandlers,
  isAuthenticationFailure,
  registerHandler,
} from "./base";
export type {
  IntegrationHandler,
  IntegrationTool,
  IntegrationToolExample,
  ToolAccessLevel,
} from "./base";
