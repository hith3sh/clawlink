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
// import "./stripe";
// etc.

export { defineTool, getIntegrationHandler, getAllHandlers, registerHandler } from "./base";
export type {
  IntegrationHandler,
  IntegrationTool,
  IntegrationToolExample,
  ToolAccessLevel,
} from "./base";
