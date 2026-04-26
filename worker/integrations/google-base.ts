/**
 * Shared base class for Google-family integration handlers.
 *
 * Provides a `googleApiRequest()` helper that routes through Pipedream's API Proxy
 * when `credentials.pipedreamAccountId` is present, otherwise falls back to direct
 * bearer-token requests (legacy Nango or manual credentials).
 */

import { BaseIntegration, IntegrationRequestError } from "./base";
import { pipedreamProxyRequest } from "../lib/pipedream-proxy";

export function safeTrim(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export function getAccessToken(credentials: Record<string, string>): string {
  const token = safeTrim(credentials.accessToken ?? credentials.access_token ?? credentials.token);
  if (!token) {
    throw new Error("Google credentials are missing an access token.");
  }
  return token;
}

export interface GoogleExecutionContext {
  requestId: string;
  dryRun?: boolean;
  timeoutMs?: number;
  connectionId?: number;
  userId?: string;
  env?: Record<string, unknown>;
}

export abstract class GoogleBaseIntegration extends BaseIntegration {
  protected getPipedreamAccountId(credentials: Record<string, string>): string | null {
    return safeTrim(credentials.pipedreamAccountId);
  }

  protected async googleApiRequest(
    url: string,
    options: RequestInit,
    credentials: Record<string, string>,
    context?: GoogleExecutionContext,
  ): Promise<Response> {
    const pipedreamAccountId = this.getPipedreamAccountId(credentials);

    if (pipedreamAccountId) {
      const externalUserId = safeTrim(context?.userId);
      if (!externalUserId) {
        throw new Error("Pipedream requests require the current ClawLink user id.");
      }

      const method = (options.method?.toUpperCase() ?? "GET") as
        | "GET"
        | "POST"
        | "PUT"
        | "PATCH"
        | "DELETE";
      const body =
        typeof options.body === "string" && options.body.length > 0
          ? (JSON.parse(options.body) as Record<string, unknown>)
          : undefined;
      const timeoutInSeconds =
        typeof context?.timeoutMs === "number" && Number.isFinite(context.timeoutMs)
          ? Math.max(1, Math.ceil(context.timeoutMs / 1000))
          : undefined;

      return pipedreamProxyRequest({
        accountId: pipedreamAccountId,
        externalUserId,
        env: context?.env,
        url,
        method,
        body,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeoutInSeconds,
      });
    }

    return this.apiRequest(url, options, credentials);
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${getAccessToken(credentials)}`,
      "Content-Type": "application/json",
    };
  }
}
