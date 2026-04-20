import "server-only";

import { getIntegrationBySlug } from "@/data/integrations";
import { getIntegrationHandler } from "../../../worker/integrations";

export class ManualCredentialValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ManualCredentialValidationError";
  }
}

function buildInvalidCredentialMessage(slug: string): string {
  const integration = getIntegrationBySlug(slug);
  const integrationName = integration?.name ?? slug;

  if (slug === "twilio") {
    return "Twilio credentials were rejected. Check the Account SID and Auth Token, and make sure they belong to the account that owns the phone numbers you expect.";
  }

  return `${integrationName} credentials were rejected. Check the saved values and try again.`;
}

export async function validateManualIntegrationCredentials(
  slug: string,
  credentials: Record<string, string>,
): Promise<void> {
  const integration = getIntegrationBySlug(slug);
  const integrationName = integration?.name ?? slug;
  const handler = getIntegrationHandler(slug);

  if (!handler?.validateCredentials) {
    return;
  }

  try {
    const isValid = await handler.validateCredentials(credentials);

    if (!isValid) {
      throw new ManualCredentialValidationError(buildInvalidCredentialMessage(slug));
    }
  } catch (error) {
    if (error instanceof ManualCredentialValidationError) {
      throw error;
    }

    if (error instanceof Error && error.message.trim()) {
      throw new ManualCredentialValidationError(
        `Could not verify ${integrationName} credentials. ${error.message}`,
      );
    }

    throw new ManualCredentialValidationError(
      `Could not verify ${integrationName} credentials right now.`,
    );
  }
}
