import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const MAILCHIMP_API_BASE = "https://login.mailchimp.com/oauth2";

function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function optionalStringArray(value: unknown, fieldName: string): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(`${fieldName} must be an array`);
  return value.map((entry, index) => {
    const normalized = typeof entry === "string" ? entry.trim() : null;
    if (!normalized) throw new Error(`${fieldName}[${index}] must be a non-empty string`);
    return normalized;
  });
}

function md5(input: string): string {
  // Minimal MD5 for Mailchimp subscriber hash
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  const msgLen = input.length;
  const bytes = new Uint8Array(msgLen);
  for (let i = 0; i < msgLen; i++) bytes[i] = input.charCodeAt(i);

  const bitLen = msgLen * 8;
  const paddedLen = Math.ceil((msgLen + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[msgLen] = 0x80;
  const dv = new DataView(padded.buffer);
  dv.setUint32(paddedLen - 8, bitLen >>> 0, true);
  dv.setUint32(paddedLen - 4, 0, true);

  function rotl(x: number, n: number) { return ((x << n) | (x >>> (32 - n))) >>> 0; }
  function add(...vals: number[]) { return vals.reduce((s, v) => (s + v) >>> 0, 0); }

  const s = [
    7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
    5,9,14,20, 5,9,14,20, 5,9,14,20, 5,9,14,20,
    4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
    6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21,
  ];
  const K = [
    0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,
    0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,
    0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,
    0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,
    0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,
    0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,
    0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,
    0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391,
  ];

  for (let offset = 0; offset < paddedLen; offset += 64) {
    const M = Array.from({ length: 16 }, (_, i) => dv.getUint32(offset + i * 4, true));
    let aa = a, bb = b, cc = c, dd = d;

    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) { f = (bb & cc) | (~bb & dd); g = i; }
      else if (i < 32) { f = (dd & bb) | (~dd & cc); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = bb ^ cc ^ dd; g = (3 * i + 5) % 16; }
      else { f = cc ^ (bb | ~dd); g = (7 * i) % 16; }

      f = add(f, aa, K[i], M[g]) >>> 0;
      aa = dd; dd = cc; cc = bb;
      bb = add(bb, rotl(f, s[i])) >>> 0;
    }

    a = add(a, aa); b = add(b, bb); c = add(c, cc); d = add(d, dd);
  }

  function hex32(n: number) {
    return [n, n >>> 8, n >>> 16, n >>> 24].map(v => (v & 0xff).toString(16).padStart(2, "0")).join("");
  }

  return hex32(a) + hex32(b) + hex32(c) + hex32(d);
}

class MailchimpHandler extends BaseIntegration {
  private cachedMetadata: { dc: string; loginUrl: string } | null = null;

  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "list_audiences", {
        description: "List Mailchimp audiences (formerly lists)",
        inputSchema: {
          type: "object",
          properties: {
            count: { type: "number", description: "Number of audiences to return" },
          },
        },
        accessLevel: "read",
        tags: ["mailchimp", "audience", "list"],
        safeDefaults: { count: 20 },
        whenToUse: [
          "User wants to see their Mailchimp audiences.",
          "You need an audience ID before adding members or creating campaigns.",
        ],
        followups: [
          "Offer to list members in a specific audience.",
        ],
      }),
      defineTool(integrationSlug, "get_audience", {
        description: "Get details for a specific Mailchimp audience",
        inputSchema: {
          type: "object",
          properties: {
            audienceId: { type: "string", description: "Mailchimp audience/list ID" },
          },
          required: ["audienceId"],
        },
        accessLevel: "read",
        tags: ["mailchimp", "audience", "detail"],
        whenToUse: [
          "User wants details about a specific Mailchimp audience.",
        ],
      }),
      defineTool(integrationSlug, "list_members", {
        description: "List members in a Mailchimp audience",
        inputSchema: {
          type: "object",
          properties: {
            audienceId: { type: "string", description: "Mailchimp audience/list ID" },
            count: { type: "number", description: "Number of members to return" },
            status: { type: "string", enum: ["subscribed", "unsubscribed", "cleaned", "pending"], description: "Filter by member status" },
          },
          required: ["audienceId"],
        },
        accessLevel: "read",
        tags: ["mailchimp", "members", "contacts"],
        safeDefaults: { count: 20 },
        whenToUse: [
          "User wants to see contacts in a Mailchimp audience.",
        ],
        followups: [
          "Offer to add a new member to the audience.",
        ],
      }),
      defineTool(integrationSlug, "add_member", {
        description: "Add or update a member in a Mailchimp audience",
        inputSchema: {
          type: "object",
          properties: {
            audienceId: { type: "string", description: "Mailchimp audience/list ID" },
            email: { type: "string", description: "Member email address" },
            status: { type: "string", enum: ["subscribed", "unsubscribed", "pending"], description: "Subscription status (default: subscribed)" },
            firstName: { type: "string", description: "First name (merge field FNAME)" },
            lastName: { type: "string", description: "Last name (merge field LNAME)" },
            tags: { type: "array", items: { type: "string" }, description: "Tags to apply to the member" },
          },
          required: ["audienceId", "email"],
        },
        accessLevel: "write",
        tags: ["mailchimp", "members", "add", "subscribe"],
        whenToUse: [
          "User wants to add a contact to a Mailchimp audience.",
        ],
        examples: [
          {
            user: "add john@example.com to my main audience",
            args: { audienceId: "abc123", email: "john@example.com", status: "subscribed" },
          },
        ],
      }),
      defineTool(integrationSlug, "list_campaigns", {
        description: "List Mailchimp campaigns",
        inputSchema: {
          type: "object",
          properties: {
            count: { type: "number", description: "Number of campaigns to return" },
            status: { type: "string", enum: ["save", "paused", "schedule", "sending", "sent"], description: "Filter by campaign status" },
          },
        },
        accessLevel: "read",
        tags: ["mailchimp", "campaign", "list"],
        safeDefaults: { count: 20 },
        whenToUse: [
          "User wants to see their Mailchimp campaigns.",
        ],
      }),
      defineTool(integrationSlug, "create_campaign", {
        description: "Create a new Mailchimp campaign",
        inputSchema: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["regular", "plaintext", "absplit", "rss", "variate"], description: "Campaign type (default: regular)" },
            audienceId: { type: "string", description: "Audience/list ID to send to" },
            subject: { type: "string", description: "Email subject line" },
            fromName: { type: "string", description: "From name" },
            replyTo: { type: "string", description: "Reply-to email address" },
          },
          required: ["audienceId", "subject", "fromName", "replyTo"],
        },
        accessLevel: "write",
        tags: ["mailchimp", "campaign", "create"],
        whenToUse: [
          "User wants to create a new email campaign in Mailchimp.",
        ],
        askBefore: [
          "Confirm campaign details before creating.",
        ],
        examples: [
          {
            user: "create a campaign for my weekly newsletter",
            args: {
              type: "regular",
              audienceId: "abc123",
              subject: "Weekly Newsletter",
              fromName: "My Company",
              replyTo: "hello@example.com",
            },
          },
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    const token = credentials.accessToken ?? credentials.access_token ?? credentials.token ?? "";
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "list_audiences":
        return this.listAudiences(args, credentials);
      case "get_audience":
        return this.getAudience(args, credentials);
      case "list_members":
        return this.listMembers(args, credentials);
      case "add_member":
        return this.addMember(args, credentials);
      case "list_campaigns":
        return this.listCampaigns(args, credentials);
      case "create_campaign":
        return this.createCampaign(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const metadata = await this.resolveMetadata(credentials);
      if (!metadata) return false;
      const response = await this.apiRequest(
        `${this.getBaseUrl(metadata.dc)}`,
        { method: "GET" },
        credentials,
      );
      return response.ok;
    } catch {
      return false;
    }
  }

  private async resolveMetadata(
    credentials: Record<string, string>,
  ): Promise<{ dc: string; loginUrl: string }> {
    if (this.cachedMetadata) return this.cachedMetadata;

    const token = credentials.accessToken ?? credentials.access_token ?? credentials.token ?? "";
    // Mailchimp OAuth metadata endpoint returns the datacenter and API URL
    const response = await fetch(`${MAILCHIMP_API_BASE}/metadata`, {
      headers: { Authorization: `OAuth ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to resolve Mailchimp OAuth metadata. The token may be invalid.");
    }

    const body = (await response.json()) as { dc?: string; login_url?: string; api_endpoint?: string };
    const dc = body.dc ?? body.api_endpoint?.replace("https://", "").split(".")[0] ?? "us1";
    const loginUrl = body.login_url ?? `https://${dc}.admin.mailchimp.com`;

    this.cachedMetadata = { dc, loginUrl };
    return this.cachedMetadata;
  }

  private getBaseUrl(dc: string): string {
    return `https://${dc}.api.mailchimp.com/3.0`;
  }

  private async listAudiences(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const count = typeof args.count === "number" ? args.count : 20;
    const { dc } = await this.resolveMetadata(credentials);
    const baseUrl = this.getBaseUrl(dc);

    const response = await this.apiRequest(
      `${baseUrl}/lists?count=${count}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Mailchimp audiences", response);
    }

    return response.json();
  }

  private async getAudience(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const audienceId = requireString(args.audienceId, "audienceId");
    const { dc } = await this.resolveMetadata(credentials);
    const baseUrl = this.getBaseUrl(dc);

    const response = await this.apiRequest(
      `${baseUrl}/lists/${encodeURIComponent(audienceId)}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Mailchimp audience", response);
    }

    return response.json();
  }

  private async listMembers(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const audienceId = requireString(args.audienceId, "audienceId");
    const count = typeof args.count === "number" ? args.count : 20;
    const status = safeTrim(args.status);
    const { dc } = await this.resolveMetadata(credentials);
    const baseUrl = this.getBaseUrl(dc);

    const params = new URLSearchParams({ count: String(count) });
    if (status) params.set("status", status);

    const response = await this.apiRequest(
      `${baseUrl}/lists/${encodeURIComponent(audienceId)}/members?${params.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Mailchimp members", response);
    }

    return response.json();
  }

  private async addMember(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const audienceId = requireString(args.audienceId, "audienceId");
    const email = requireString(args.email, "email");
    const status = safeTrim(args.status) ?? "subscribed";
    const firstName = safeTrim(args.firstName);
    const lastName = safeTrim(args.lastName);
    const tags = optionalStringArray(args.tags, "tags");
    const { dc } = await this.resolveMetadata(credentials);
    const baseUrl = this.getBaseUrl(dc);

    const mergeFields: Record<string, string> = {};
    if (firstName) mergeFields.FNAME = firstName;
    if (lastName) mergeFields.LNAME = lastName;

    const payload: Record<string, unknown> = {
      email_address: email.toLowerCase(),
      status,
      merge_fields: mergeFields,
    };

    if (tags.length > 0) {
      payload.tags = tags;
    }

    const subscriberHash = md5(email.toLowerCase());

    const response = await this.apiRequest(
      `${baseUrl}/lists/${encodeURIComponent(audienceId)}/members/${subscriberHash}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to add Mailchimp member", response);
    }

    return response.json();
  }

  private async listCampaigns(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const count = typeof args.count === "number" ? args.count : 20;
    const status = safeTrim(args.status);
    const { dc } = await this.resolveMetadata(credentials);
    const baseUrl = this.getBaseUrl(dc);

    const params = new URLSearchParams({ count: String(count) });
    if (status) params.set("status", status);

    const response = await this.apiRequest(
      `${baseUrl}/campaigns?${params.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Mailchimp campaigns", response);
    }

    return response.json();
  }

  private async createCampaign(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const audienceId = requireString(args.audienceId, "audienceId");
    const subject = requireString(args.subject, "subject");
    const fromName = requireString(args.fromName, "fromName");
    const replyTo = requireString(args.replyTo, "replyTo");
    const type = safeTrim(args.type) ?? "regular";
    const { dc } = await this.resolveMetadata(credentials);
    const baseUrl = this.getBaseUrl(dc);

    const payload = {
      type,
      recipients: { list_id: audienceId },
      settings: {
        subject_line: subject,
        from_name: fromName,
        reply_to: replyTo,
      },
    };

    const response = await this.apiRequest(
      `${baseUrl}/campaigns`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Mailchimp campaign", response);
    }

    return response.json();
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
      status?: number;
    } | null;

    const message = body?.detail ?? body?.title ?? response.statusText;
    const code = body?.status !== undefined ? String(body.status) : undefined;

    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
      code,
    });
  }
}

registerHandler("mailchimp", new MailchimpHandler());
