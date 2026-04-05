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
// import "./stripe";
// etc.

export { getIntegrationHandler, getAllHandlers, registerHandler } from "./base";
export type { IntegrationHandler, IntegrationTool } from "./base";
