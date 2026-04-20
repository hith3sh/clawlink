import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const WEBMASTERS_BASE_URL = "https://www.googleapis.com/webmasters/v3";
const URL_INSPECTION_BASE_URL = "https://searchconsole.googleapis.com/v1";

interface GoogleApiErrorPayload {
  error?: {
    code?: number | string;
    status?: string;
    message?: string;
  };
}

type UnknownRecord = Record<string, unknown>;

function isRecordObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getAccessToken(credentials: Record<string, string>): string {
  const token = safeTrim(
    credentials.accessToken ?? credentials.access_token ?? credentials.token,
  );

  if (!token) {
    throw new Error("Google Search Console credentials are missing an access token.");
  }

  return token;
}

function optionalObject(value: unknown, fieldName: string): UnknownRecord {
  if (value === undefined || value === null) {
    return {};
  }

  if (!isRecordObject(value)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return { ...value };
}

function normalizeStringList(value: unknown, fieldName: string): string[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return value.map((entry, index) => {
    const normalized = safeTrim(entry);

    if (!normalized) {
      throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    }

    return normalized;
  });
}

function encodePathSegment(value: string): string {
  return encodeURIComponent(value);
}

function requiredSiteUrl(value: unknown): string {
  const siteUrl = safeTrim(value);

  if (!siteUrl) {
    throw new Error("siteUrl is required");
  }

  return siteUrl;
}

function requiredFeedPath(value: unknown): string {
  const feedpath = safeTrim(value);

  if (!feedpath) {
    throw new Error("feedpath is required");
  }

  return feedpath;
}

class GoogleSearchConsoleHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "add_site", {
        description: "Add a Google Search Console site property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as Search Console expects, such as https://example.com/ or sc-domain:example.com",
            },
          },
          required: ["siteUrl"],
        },
        accessLevel: "write",
        tags: ["google-search-console", "sites", "property", "create"],
        whenToUse: [
          "User explicitly wants to add a Search Console property.",
        ],
        askBefore: [
          "Confirm the exact property format because URL-prefix properties need protocol and trailing slash, while domain properties must use sc-domain:.",
        ],
      }),
      defineTool(integrationSlug, "delete_site", {
        description: "Delete a Google Search Console site property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as stored in Search Console",
            },
          },
          required: ["siteUrl"],
        },
        accessLevel: "destructive",
        tags: ["google-search-console", "sites", "property", "delete"],
        whenToUse: [
          "User explicitly wants to remove a Search Console property.",
        ],
        askBefore: [
          "Confirm before deleting a Search Console property unless the user was already explicit.",
        ],
      }),
      defineTool(integrationSlug, "get_site", {
        description: "Get a specific Google Search Console site property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console",
            },
          },
          required: ["siteUrl"],
        },
        accessLevel: "read",
        tags: ["google-search-console", "sites", "property", "lookup"],
      }),
      defineTool(integrationSlug, "list_sites", {
        description: "List Google Search Console site properties for the connected account",
        inputSchema: {
          type: "object",
          properties: {},
        },
        accessLevel: "read",
        tags: ["google-search-console", "sites", "property", "list"],
        whenToUse: [
          "User wants to see verified Search Console properties.",
          "You need the exact siteUrl value before calling downstream Search Console tools.",
        ],
        followups: [
          "Use the returned siteUrl exactly as-is when fetching sitemaps, analytics, or URL inspection.",
        ],
      }),
      defineTool(integrationSlug, "get_sitemap", {
        description: "Get metadata for a Search Console sitemap",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by list_sites",
            },
            feedpath: {
              type: "string",
              description: "Full sitemap URL, for example https://example.com/sitemap.xml",
            },
          },
          required: ["siteUrl", "feedpath"],
        },
        accessLevel: "read",
        tags: ["google-search-console", "sitemaps", "lookup"],
      }),
      defineTool(integrationSlug, "inspect_url", {
        description: "Inspect a URL in Google Search Console for index coverage and related issues",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console",
            },
            inspectionUrl: {
              type: "string",
              description: "Fully-qualified URL to inspect. It must belong to the property.",
            },
            languageCode: {
              type: "string",
              description: "Optional BCP-47 language code such as en-US",
            },
          },
          required: ["siteUrl", "inspectionUrl"],
        },
        accessLevel: "read",
        tags: ["google-search-console", "url-inspection", "indexing"],
        whenToUse: [
          "User wants to check whether a page is indexed or has inspection issues.",
        ],
        askBefore: [
          "Prefer targeted inspection for priority URLs because the endpoint is quota-sensitive.",
        ],
      }),
      defineTool(integrationSlug, "list_sitemaps", {
        description: "List sitemaps for a Search Console property",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console",
            },
            sitemapIndex: {
              type: "string",
              description: "Optional sitemap index URL to filter by",
            },
          },
          required: ["siteUrl"],
        },
        accessLevel: "read",
        tags: ["google-search-console", "sitemaps", "list"],
      }),
      defineTool(integrationSlug, "search_analytics_query", {
        description: "Query Google Search Console search analytics data",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console",
            },
            startDate: {
              type: "string",
              description: "Required start date in YYYY-MM-DD format",
            },
            endDate: {
              type: "string",
              description: "Required end date in YYYY-MM-DD format",
            },
            dimensions: {
              type: "array",
              items: { type: "string" },
              description: "Optional dimensions such as query, page, country, device, searchAppearance, date, or hour",
            },
            type: {
              type: "string",
              enum: ["web", "image", "video", "discover", "googleNews", "news"],
              description: "Optional search type filter",
            },
            dimensionFilterGroups: {
              type: "array",
              items: { type: "object" },
              description: "Optional Search Console dimension filter groups",
            },
            aggregationType: {
              type: "string",
              description: "Optional aggregation type",
            },
            rowLimit: {
              type: "number",
              description: "Optional maximum rows to return",
            },
            startRow: {
              type: "number",
              description: "Optional row offset",
            },
            dataState: {
              type: "string",
              description: "Optional data state such as final or all",
            },
            request: {
              type: "object",
              description: "Optional raw request body to merge with top-level arguments",
            },
          },
          required: ["siteUrl", "startDate", "endDate"],
        },
        accessLevel: "read",
        tags: ["google-search-console", "analytics", "search-performance"],
        whenToUse: [
          "User wants clicks, impressions, CTR, or average position from Search Console.",
        ],
        safeDefaults: {
          type: "web",
          rowLimit: 100,
        },
      }),
      defineTool(integrationSlug, "submit_sitemap", {
        description: "Submit a sitemap to Google Search Console",
        inputSchema: {
          type: "object",
          properties: {
            siteUrl: {
              type: "string",
              description: "Property URL exactly as returned by Search Console",
            },
            feedpath: {
              type: "string",
              description: "Full sitemap URL to submit",
            },
          },
          required: ["siteUrl", "feedpath"],
        },
        accessLevel: "write",
        tags: ["google-search-console", "sitemaps", "submit"],
        whenToUse: [
          "User explicitly wants to submit or resubmit a sitemap.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Authorization: `Bearer ${getAccessToken(credentials)}`,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "add_site":
        return this.addSite(args, credentials);
      case "delete_site":
        return this.deleteSite(args, credentials);
      case "get_site":
        return this.getSite(args, credentials);
      case "list_sites":
        return this.listSites(credentials);
      case "get_sitemap":
        return this.getSitemap(args, credentials);
      case "inspect_url":
        return this.inspectUrl(args, credentials);
      case "list_sitemaps":
        return this.listSitemaps(args, credentials);
      case "search_analytics_query":
        return this.searchAnalyticsQuery(args, credentials);
      case "submit_sitemap":
        return this.submitSitemap(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        `${WEBMASTERS_BASE_URL}/sites`,
        { method: "GET" },
        credentials,
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  private async addSite(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}`,
      { method: "PUT" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to add Google Search Console site", response);
    }

    return {
      ok: true,
      siteUrl,
      added: true,
      message: "Site added to Search Console. Ownership verification may still be required.",
    };
  }

  private async deleteSite(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}`,
      { method: "DELETE" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to delete Google Search Console site", response);
    }

    return {
      ok: true,
      siteUrl,
      deleted: true,
    };
  }

  private async getSite(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Search Console site", response);
    }

    return response.json();
  }

  private async listSites(credentials: Record<string, string>): Promise<unknown> {
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Search Console sites", response);
    }

    return response.json();
  }

  private async getSitemap(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const feedpath = requiredFeedPath(args.feedpath);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/sitemaps/${encodePathSegment(feedpath)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Search Console sitemap", response);
    }

    return response.json();
  }

  private async inspectUrl(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const inspectionUrl = safeTrim(args.inspectionUrl);

    if (!inspectionUrl) {
      throw new Error("inspectionUrl is required");
    }

    const payload: UnknownRecord = {
      inspectionUrl,
      siteUrl,
    };

    const languageCode = safeTrim(args.languageCode);
    if (languageCode) {
      payload.languageCode = languageCode;
    }

    const response = await this.apiRequest(
      `${URL_INSPECTION_BASE_URL}/urlInspection/index:inspect`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to inspect URL in Google Search Console", response);
    }

    return response.json();
  }

  private async listSitemaps(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const query = new URLSearchParams();
    const sitemapIndex = safeTrim(args.sitemapIndex);

    if (sitemapIndex) {
      query.set("sitemapIndex", sitemapIndex);
    }

    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/sitemaps${query.size > 0 ? `?${query.toString()}` : ""}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Google Search Console sitemaps", response);
    }

    return response.json();
  }

  private async searchAnalyticsQuery(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const startDate = safeTrim(args.startDate);
    const endDate = safeTrim(args.endDate);

    if (!startDate) {
      throw new Error("startDate is required");
    }

    if (!endDate) {
      throw new Error("endDate is required");
    }

    const payload = optionalObject(args.request, "request");
    payload.startDate = startDate;
    payload.endDate = endDate;

    if (args.dimensions !== undefined) {
      payload.dimensions = normalizeStringList(args.dimensions, "dimensions");
    }

    const type = safeTrim(args.type);
    if (type) {
      payload.type = type;
    } else if (!payload.type) {
      payload.type = "web";
    }

    if (args.dimensionFilterGroups !== undefined) {
      if (!Array.isArray(args.dimensionFilterGroups)) {
        throw new Error("dimensionFilterGroups must be an array");
      }
      payload.dimensionFilterGroups = args.dimensionFilterGroups;
    }

    const aggregationType = safeTrim(args.aggregationType);
    if (aggregationType) {
      payload.aggregationType = aggregationType;
    }

    const dataState = safeTrim(args.dataState);
    if (dataState) {
      payload.dataState = dataState;
    }

    if (args.rowLimit !== undefined) {
      payload.rowLimit = Number(args.rowLimit);
    } else if (payload.rowLimit === undefined) {
      payload.rowLimit = 100;
    }

    if (args.startRow !== undefined) {
      payload.startRow = Number(args.startRow);
    }

    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to query Google Search Console analytics", response);
    }

    return response.json();
  }

  private async submitSitemap(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const siteUrl = requiredSiteUrl(args.siteUrl);
    const feedpath = requiredFeedPath(args.feedpath);
    const response = await this.apiRequest(
      `${WEBMASTERS_BASE_URL}/sites/${encodePathSegment(siteUrl)}/sitemaps/${encodePathSegment(feedpath)}`,
      { method: "PUT" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to submit Google Search Console sitemap", response);
    }

    return {
      ok: true,
      siteUrl,
      feedpath,
      submitted: true,
    };
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as
      | GoogleApiErrorPayload
      | null;
    const status = safeTrim(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code =
      body?.error?.code !== undefined ? String(body.error.code) : undefined;
    const detail = status ? `${status}: ${message}` : message;

    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code,
    });
  }
}

registerHandler("google-search-console", new GoogleSearchConsoleHandler());
