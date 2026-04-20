import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const TWILIO_BASE_URL = "https://api.twilio.com/2010-04-01";

type UnknownRecord = Record<string, unknown>;

interface TwilioApiErrorPayload {
  code?: number | string;
  message?: string;
  more_info?: string;
  status?: number;
}

interface TwilioIncomingPhoneNumber {
  sid?: string;
  account_sid?: string;
  phone_number?: string;
  friendly_name?: string;
  voice_url?: string;
  voice_method?: string;
  voice_fallback_url?: string;
  voice_fallback_method?: string;
  status_callback?: string;
  status_callback_method?: string;
  sms_url?: string;
  sms_method?: string;
  sms_fallback_url?: string;
  sms_fallback_method?: string;
  voice_application_sid?: string;
  sms_application_sid?: string;
  capabilities?: {
    voice?: boolean;
    sms?: boolean;
    mms?: boolean;
    fax?: boolean;
  };
}

function safeTrim(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isRecordObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function requireString(value: unknown, fieldName: string): string {
  const normalized = safeTrim(value);

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function optionalStringArray(value: unknown, fieldName: string): string[] {
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

function buildFormBody(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      }
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams.toString();
}

function formFieldIfProvided(
  target: Record<string, unknown>,
  field: string,
  value: unknown,
): void {
  if (value === undefined) {
    return;
  }

  if (typeof value === "string") {
    target[field] = value;
    return;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    target[field] = value;
  }
}

function summarizeNumberBehavior(phoneNumber: TwilioIncomingPhoneNumber): string {
  const voiceTarget =
    phoneNumber.voice_application_sid
      ? `TwiML app ${phoneNumber.voice_application_sid}`
      : phoneNumber.voice_url
        ? `voice webhook ${phoneNumber.voice_url}`
        : "no voice webhook or TwiML app configured";

  const smsTarget =
    phoneNumber.sms_application_sid
      ? `TwiML app ${phoneNumber.sms_application_sid}`
      : phoneNumber.sms_url
        ? `SMS webhook ${phoneNumber.sms_url}`
        : "no SMS webhook or TwiML app configured";

  return `${phoneNumber.phone_number ?? phoneNumber.sid ?? "Number"}: ${voiceTarget}; ${smsTarget}.`;
}

class TwilioHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "get_account", {
        description: "Get Twilio account details and status",
        inputSchema: { type: "object", properties: {} },
        accessLevel: "read",
        tags: ["twilio", "account", "auth"],
        whenToUse: [
          "Validate that Twilio credentials work.",
          "Inspect the connected Twilio account status and metadata.",
        ],
      }),
      defineTool(integrationSlug, "list_phone_numbers", {
        description: "List Twilio incoming phone numbers owned by the account",
        inputSchema: {
          type: "object",
          properties: {
            limit: { type: "number", description: "Maximum phone numbers to return" },
            pageSize: { type: "number", description: "Twilio page size to request" },
            friendlyName: { type: "string", description: "Optional exact friendly name filter" },
            phoneNumber: { type: "string", description: "Optional exact phone number filter" },
          },
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "inventory"],
        safeDefaults: {
          limit: 50,
          pageSize: 50,
        },
      }),
      defineTool(integrationSlug, "get_phone_number", {
        description: "Get a single Twilio incoming phone number and its configuration",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string", description: "Twilio incoming phone number SID" },
            phoneNumber: { type: "string", description: "Exact E.164 phone number to resolve if SID is not known" },
          },
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "lookup"],
      }),
      defineTool(integrationSlug, "update_phone_number", {
        description: "Update a Twilio incoming phone number configuration",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            friendlyName: { type: "string" },
            voiceUrl: { type: "string" },
            voiceMethod: { type: "string" },
            voiceFallbackUrl: { type: "string" },
            voiceFallbackMethod: { type: "string" },
            statusCallback: { type: "string" },
            statusCallbackMethod: { type: "string" },
            smsUrl: { type: "string" },
            smsMethod: { type: "string" },
            smsFallbackUrl: { type: "string" },
            smsFallbackMethod: { type: "string" },
            voiceApplicationSid: { type: "string" },
            smsApplicationSid: { type: "string" },
          },
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "routing", "update"],
        askBefore: [
          "Confirm before changing production routing on a live Twilio number unless the user was already explicit.",
        ],
      }),
      defineTool(integrationSlug, "bulk_update_phone_numbers", {
        description: "Apply the same configuration changes to multiple Twilio phone numbers",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSids: { type: "array", items: { type: "string" } },
            phoneNumbers: { type: "array", items: { type: "string" } },
            changes: { type: "object", description: "Same writable fields supported by update_phone_number" },
            dryRun: { type: "boolean", description: "Preview matched numbers without applying updates" },
          },
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "bulk", "routing"],
        askBefore: [
          "Prefer a dry run before changing many Twilio numbers at once.",
        ],
      }),
      defineTool(integrationSlug, "search_phone_numbers", {
        description: "Search Twilio phone numbers by number, name, capability, or webhook match",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Case-insensitive text match against phone number or friendly name" },
            capability: { type: "string", enum: ["voice", "sms", "mms", "fax"] },
            voiceUrlContains: { type: "string" },
            smsUrlContains: { type: "string" },
            twimlAppSid: { type: "string", description: "Match either voice or SMS TwiML application SID" },
            limit: { type: "number" },
          },
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "search"],
        safeDefaults: {
          limit: 50,
        },
      }),
      defineTool(integrationSlug, "set_voice_webhook", {
        description: "Set the incoming voice webhook for a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            voiceUrl: { type: "string", description: "Voice webhook URL" },
            voiceMethod: { type: "string", description: "GET or POST" },
            voiceFallbackUrl: { type: "string" },
            voiceFallbackMethod: { type: "string" },
            statusCallback: { type: "string" },
            statusCallbackMethod: { type: "string" },
          },
          required: ["voiceUrl"],
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "voice", "webhook"],
      }),
      defineTool(integrationSlug, "set_sms_webhook", {
        description: "Set the incoming SMS webhook for a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            smsUrl: { type: "string", description: "SMS webhook URL" },
            smsMethod: { type: "string", description: "GET or POST" },
            smsFallbackUrl: { type: "string" },
            smsFallbackMethod: { type: "string" },
          },
          required: ["smsUrl"],
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "sms", "webhook"],
      }),
      defineTool(integrationSlug, "assign_twiml_app", {
        description: "Assign a TwiML application to a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
            voiceApplicationSid: { type: "string" },
            smsApplicationSid: { type: "string" },
          },
        },
        accessLevel: "write",
        tags: ["twilio", "numbers", "twiml", "routing"],
      }),
      defineTool(integrationSlug, "send_sms", {
        description: "Send an SMS through Twilio",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string", description: "Twilio phone number to send from" },
            to: { type: "string", description: "Destination phone number" },
            body: { type: "string", description: "SMS body text" },
            mediaUrls: { type: "array", items: { type: "string" }, description: "Optional media URLs for MMS" },
            statusCallback: { type: "string" },
          },
          required: ["from", "to", "body"],
        },
        accessLevel: "write",
        tags: ["twilio", "messages", "sms"],
      }),
      defineTool(integrationSlug, "list_messages", {
        description: "List Twilio messages",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            status: { type: "string" },
            pageSize: { type: "number" },
            limit: { type: "number" },
          },
        },
        accessLevel: "read",
        tags: ["twilio", "messages", "sms"],
        safeDefaults: {
          limit: 50,
          pageSize: 50,
        },
      }),
      defineTool(integrationSlug, "get_message", {
        description: "Get a specific Twilio message",
        inputSchema: {
          type: "object",
          properties: {
            messageSid: { type: "string", description: "Twilio message SID" },
          },
          required: ["messageSid"],
        },
        accessLevel: "read",
        tags: ["twilio", "messages", "lookup"],
      }),
      defineTool(integrationSlug, "make_call", {
        description: "Create an outbound Twilio call",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string", description: "Twilio phone number to call from" },
            to: { type: "string", description: "Destination phone number" },
            url: { type: "string", description: "TwiML webhook URL" },
            twiml: { type: "string", description: "Inline TwiML to execute" },
            applicationSid: { type: "string", description: "Optional TwiML application SID" },
            statusCallback: { type: "string" },
            record: { type: "boolean" },
          },
          required: ["from", "to"],
        },
        accessLevel: "write",
        tags: ["twilio", "calls", "voice"],
        askBefore: [
          "Confirm before placing real outbound calls unless the user was already explicit.",
        ],
      }),
      defineTool(integrationSlug, "list_calls", {
        description: "List Twilio calls",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string" },
            to: { type: "string" },
            status: { type: "string" },
            pageSize: { type: "number" },
            limit: { type: "number" },
          },
        },
        accessLevel: "read",
        tags: ["twilio", "calls", "voice"],
        safeDefaults: {
          limit: 50,
          pageSize: 50,
        },
      }),
      defineTool(integrationSlug, "get_call", {
        description: "Get a specific Twilio call",
        inputSchema: {
          type: "object",
          properties: {
            callSid: { type: "string", description: "Twilio call SID" },
          },
          required: ["callSid"],
        },
        accessLevel: "read",
        tags: ["twilio", "calls", "lookup"],
      }),
      defineTool(integrationSlug, "get_number_behavior", {
        description: "Summarize the effective voice and SMS behavior for a Twilio phone number",
        inputSchema: {
          type: "object",
          properties: {
            phoneNumberSid: { type: "string" },
            phoneNumber: { type: "string" },
          },
        },
        accessLevel: "read",
        tags: ["twilio", "numbers", "routing", "summary"],
      }),
    ];
  }

  protected getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "get_account":
        return this.getAccount(credentials);
      case "list_phone_numbers":
        return this.listPhoneNumbers(args, credentials);
      case "get_phone_number":
        return this.getPhoneNumber(args, credentials);
      case "update_phone_number":
        return this.updatePhoneNumber(args, credentials);
      case "bulk_update_phone_numbers":
        return this.bulkUpdatePhoneNumbers(args, credentials);
      case "search_phone_numbers":
        return this.searchPhoneNumbers(args, credentials);
      case "set_voice_webhook":
        return this.updatePhoneNumber(
          {
            ...args,
            voiceUrl: requireString(args.voiceUrl, "voiceUrl"),
          },
          credentials,
        );
      case "set_sms_webhook":
        return this.updatePhoneNumber(
          {
            ...args,
            smsUrl: requireString(args.smsUrl, "smsUrl"),
          },
          credentials,
        );
      case "assign_twiml_app":
        return this.updatePhoneNumber(args, credentials);
      case "send_sms":
        return this.sendSms(args, credentials);
      case "list_messages":
        return this.listMessages(args, credentials);
      case "get_message":
        return this.getMessage(args, credentials);
      case "make_call":
        return this.makeCall(args, credentials);
      case "list_calls":
        return this.listCalls(args, credentials);
      case "get_call":
        return this.getCall(args, credentials);
      case "get_number_behavior":
        return this.getNumberBehavior(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.twilioRequest("GET", "/Accounts.json", undefined, credentials);
      return response.ok;
    } catch {
      return false;
    }
  }

  private getCredentials(credentials: Record<string, string>): { accountSid: string; authToken: string } {
    return {
      accountSid: requireString(credentials.accountSid, "accountSid"),
      authToken: requireString(credentials.authToken, "authToken"),
    };
  }

  private async twilioRequest(
    method: string,
    path: string,
    params: Record<string, unknown> | undefined,
    credentials: Record<string, string>,
  ): Promise<Response> {
    const { accountSid, authToken } = this.getCredentials(credentials);
    const headers = new Headers(this.getHeaders());
    headers.set("Authorization", `Basic ${btoa(`${accountSid}:${authToken}`)}`);

    let url = `${TWILIO_BASE_URL}${path}`;
    const init: RequestInit = {
      method,
      headers,
    };

    if (method === "GET") {
      const query = buildFormBody(params ?? {});
      if (query) {
        url += `?${query}`;
      }
    } else if (params) {
      init.body = buildFormBody(params);
    }

    return this.apiRequest(url, init, credentials);
  }

  private async getAccount(credentials: Record<string, string>): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest("GET", `/Accounts/${encodeURIComponent(accountSid)}.json`, undefined, credentials);

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio account", response);
    }

    return response.json();
  }

  private async listPhoneNumbers(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/IncomingPhoneNumbers.json`,
      {
        PageSize: optionalNumber(args.pageSize) ?? 50,
        FriendlyName: safeTrim(args.friendlyName) ?? undefined,
        PhoneNumber: safeTrim(args.phoneNumber) ?? undefined,
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Twilio phone numbers", response);
    }

    const payload = (await response.json()) as {
      incoming_phone_numbers?: TwilioIncomingPhoneNumber[];
      next_page_uri?: string | null;
      page?: number;
      page_size?: number;
    };

    const limit = optionalNumber(args.limit) ?? 50;

    return {
      ...payload,
      incoming_phone_numbers: (payload.incoming_phone_numbers ?? []).slice(0, limit),
    };
  }

  private async getPhoneNumber(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<TwilioIncomingPhoneNumber> {
    const { accountSid } = this.getCredentials(credentials);
    const sid = await this.resolvePhoneNumberSid(args, credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/IncomingPhoneNumbers/${encodeURIComponent(sid)}.json`,
      undefined,
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio phone number", response);
    }

    return (await response.json()) as TwilioIncomingPhoneNumber;
  }

  private async updatePhoneNumber(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const sid = await this.resolvePhoneNumberSid(args, credentials);
    const params: Record<string, unknown> = {};

    formFieldIfProvided(params, "FriendlyName", safeTrim(args.friendlyName) ?? undefined);
    formFieldIfProvided(params, "VoiceUrl", safeTrim(args.voiceUrl) ?? undefined);
    formFieldIfProvided(params, "VoiceMethod", safeTrim(args.voiceMethod) ?? undefined);
    formFieldIfProvided(params, "VoiceFallbackUrl", safeTrim(args.voiceFallbackUrl) ?? undefined);
    formFieldIfProvided(params, "VoiceFallbackMethod", safeTrim(args.voiceFallbackMethod) ?? undefined);
    formFieldIfProvided(params, "StatusCallback", safeTrim(args.statusCallback) ?? undefined);
    formFieldIfProvided(params, "StatusCallbackMethod", safeTrim(args.statusCallbackMethod) ?? undefined);
    formFieldIfProvided(params, "SmsUrl", safeTrim(args.smsUrl) ?? undefined);
    formFieldIfProvided(params, "SmsMethod", safeTrim(args.smsMethod) ?? undefined);
    formFieldIfProvided(params, "SmsFallbackUrl", safeTrim(args.smsFallbackUrl) ?? undefined);
    formFieldIfProvided(params, "SmsFallbackMethod", safeTrim(args.smsFallbackMethod) ?? undefined);
    formFieldIfProvided(params, "VoiceApplicationSid", safeTrim(args.voiceApplicationSid) ?? undefined);
    formFieldIfProvided(params, "SmsApplicationSid", safeTrim(args.smsApplicationSid) ?? undefined);

    if (Object.keys(params).length === 0) {
      throw new Error("At least one Twilio phone number field must be provided to update");
    }

    const response = await this.twilioRequest(
      "POST",
      `/Accounts/${encodeURIComponent(accountSid)}/IncomingPhoneNumbers/${encodeURIComponent(sid)}.json`,
      params,
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to update Twilio phone number", response);
    }

    return response.json();
  }

  private async bulkUpdatePhoneNumbers(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const sidList = optionalStringArray(args.phoneNumberSids, "phoneNumberSids");
    const phoneNumberList = optionalStringArray(args.phoneNumbers, "phoneNumbers");
    const dryRun = optionalBoolean(args.dryRun) ?? false;
    const changes = isRecordObject(args.changes) ? { ...args.changes } : null;

    if (!changes) {
      throw new Error("changes must be an object");
    }

    const targets = new Map<string, { sid?: string; phoneNumber?: string }>();

    for (const sid of sidList) {
      targets.set(`sid:${sid}`, { sid });
    }

    for (const phoneNumber of phoneNumberList) {
      targets.set(`number:${phoneNumber}`, { phoneNumber });
    }

    if (targets.size === 0) {
      throw new Error("Provide at least one phoneNumberSid or phoneNumber");
    }

    const resolved = await Promise.all(
      Array.from(targets.values()).map(async (target) => {
        const sid = target.sid ?? (await this.resolvePhoneNumberSid({ phoneNumber: target.phoneNumber }, credentials));
        const current = await this.getPhoneNumber({ phoneNumberSid: sid }, credentials);
        return {
          sid,
          phoneNumber: current.phone_number,
          current,
        };
      }),
    );

    if (dryRun) {
      return {
        dryRun: true,
        count: resolved.length,
        changes,
        targets: resolved,
      };
    }

    const results = [];
    for (const entry of resolved) {
      const updated = await this.updatePhoneNumber(
        {
          phoneNumberSid: entry.sid,
          ...changes,
        },
        credentials,
      );
      results.push(updated);
    }

    return {
      dryRun: false,
      count: results.length,
      results,
    };
  }

  private async searchPhoneNumbers(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const payload = (await this.listPhoneNumbers(
      {
        limit: optionalNumber(args.limit) ?? 50,
        pageSize: optionalNumber(args.limit) ?? 50,
      },
      credentials,
    )) as { incoming_phone_numbers?: TwilioIncomingPhoneNumber[] };

    const query = safeTrim(args.query)?.toLowerCase() ?? null;
    const capability = safeTrim(args.capability);
    const voiceUrlContains = safeTrim(args.voiceUrlContains)?.toLowerCase() ?? null;
    const smsUrlContains = safeTrim(args.smsUrlContains)?.toLowerCase() ?? null;
    const twimlAppSid = safeTrim(args.twimlAppSid);

    const filtered = (payload.incoming_phone_numbers ?? []).filter((entry) => {
      if (query) {
        const haystack = `${entry.phone_number ?? ""} ${entry.friendly_name ?? ""}`.toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      if (capability) {
        const capabilityValue = entry.capabilities?.[capability as keyof NonNullable<TwilioIncomingPhoneNumber["capabilities"]>];
        if (!capabilityValue) {
          return false;
        }
      }

      if (voiceUrlContains && !(entry.voice_url ?? "").toLowerCase().includes(voiceUrlContains)) {
        return false;
      }

      if (smsUrlContains && !(entry.sms_url ?? "").toLowerCase().includes(smsUrlContains)) {
        return false;
      }

      if (twimlAppSid) {
        if (entry.voice_application_sid !== twimlAppSid && entry.sms_application_sid !== twimlAppSid) {
          return false;
        }
      }

      return true;
    });

    return {
      count: filtered.length,
      incoming_phone_numbers: filtered,
    };
  }

  private async sendSms(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const mediaUrls = optionalStringArray(args.mediaUrls, "mediaUrls");
    const response = await this.twilioRequest(
      "POST",
      `/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
      {
        From: requireString(args.from, "from"),
        To: requireString(args.to, "to"),
        Body: requireString(args.body, "body"),
        StatusCallback: safeTrim(args.statusCallback) ?? undefined,
        MediaUrl: mediaUrls.length > 0 ? mediaUrls : undefined,
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to send Twilio message", response);
    }

    return response.json();
  }

  private async listMessages(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
      {
        From: safeTrim(args.from) ?? undefined,
        To: safeTrim(args.to) ?? undefined,
        Status: safeTrim(args.status) ?? undefined,
        PageSize: optionalNumber(args.pageSize) ?? 50,
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Twilio messages", response);
    }

    const payload = (await response.json()) as { messages?: unknown[] };
    const limit = optionalNumber(args.limit) ?? 50;

    return {
      ...payload,
      messages: (payload.messages ?? []).slice(0, limit),
    };
  }

  private async getMessage(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Messages/${encodeURIComponent(requireString(args.messageSid, "messageSid"))}.json`,
      undefined,
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio message", response);
    }

    return response.json();
  }

  private async makeCall(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const url = safeTrim(args.url);
    const twiml = safeTrim(args.twiml);
    const applicationSid = safeTrim(args.applicationSid);

    if (!url && !twiml && !applicationSid) {
      throw new Error("Provide one of url, twiml, or applicationSid to make a Twilio call");
    }

    const response = await this.twilioRequest(
      "POST",
      `/Accounts/${encodeURIComponent(accountSid)}/Calls.json`,
      {
        From: requireString(args.from, "from"),
        To: requireString(args.to, "to"),
        Url: url ?? undefined,
        Twiml: twiml ?? undefined,
        ApplicationSid: applicationSid ?? undefined,
        StatusCallback: safeTrim(args.statusCallback) ?? undefined,
        Record: optionalBoolean(args.record) ?? undefined,
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Twilio call", response);
    }

    return response.json();
  }

  private async listCalls(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Calls.json`,
      {
        From: safeTrim(args.from) ?? undefined,
        To: safeTrim(args.to) ?? undefined,
        Status: safeTrim(args.status) ?? undefined,
        PageSize: optionalNumber(args.pageSize) ?? 50,
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Twilio calls", response);
    }

    const payload = (await response.json()) as { calls?: UnknownRecord[] };
    const limit = optionalNumber(args.limit) ?? 50;

    return {
      ...payload,
      calls: (payload.calls ?? []).slice(0, limit),
    };
  }

  private async getCall(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const { accountSid } = this.getCredentials(credentials);
    const response = await this.twilioRequest(
      "GET",
      `/Accounts/${encodeURIComponent(accountSid)}/Calls/${encodeURIComponent(requireString(args.callSid, "callSid"))}.json`,
      undefined,
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to fetch Twilio call", response);
    }

    const payload = (await response.json()) as UnknownRecord;

    return {
      ...payload,
      summary: this.summarizeCall(payload),
    };
  }

  private async getNumberBehavior(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const number = await this.getPhoneNumber(args, credentials);

    return {
      sid: number.sid,
      phoneNumber: number.phone_number,
      friendlyName: number.friendly_name,
      voice: {
        voiceUrl: number.voice_url,
        voiceMethod: number.voice_method,
        voiceFallbackUrl: number.voice_fallback_url,
        voiceFallbackMethod: number.voice_fallback_method,
        statusCallback: number.status_callback,
        statusCallbackMethod: number.status_callback_method,
        voiceApplicationSid: number.voice_application_sid,
      },
      sms: {
        smsUrl: number.sms_url,
        smsMethod: number.sms_method,
        smsFallbackUrl: number.sms_fallback_url,
        smsFallbackMethod: number.sms_fallback_method,
        smsApplicationSid: number.sms_application_sid,
      },
      capabilities: number.capabilities,
      summary: summarizeNumberBehavior(number),
    };
  }

  private async resolvePhoneNumberSid(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<string> {
    const directSid = safeTrim(args.phoneNumberSid);
    if (directSid) {
      return directSid;
    }

    const phoneNumber = safeTrim(args.phoneNumber);
    if (!phoneNumber) {
      throw new Error("Provide phoneNumberSid or phoneNumber");
    }

    const payload = (await this.listPhoneNumbers(
      {
        phoneNumber,
        pageSize: 20,
        limit: 20,
      },
      credentials,
    )) as { incoming_phone_numbers?: TwilioIncomingPhoneNumber[] };

    const exact = (payload.incoming_phone_numbers ?? []).find(
      (entry) => entry.phone_number === phoneNumber,
    );

    if (!exact?.sid) {
      throw new Error(`No Twilio incoming phone number found for ${phoneNumber}`);
    }

    return exact.sid;
  }

  private summarizeCall(call: UnknownRecord): string {
    const from = safeTrim(call.from) ?? "unknown";
    const to = safeTrim(call.to) ?? "unknown";
    const status = safeTrim(call.status) ?? "unknown";
    const direction = safeTrim(call.direction) ?? "unknown direction";
    const duration = safeTrim(call.duration);

    return `${direction} call from ${from} to ${to} is ${status}${duration ? ` after ${duration} seconds` : ""}.`;
  }

  private async createApiError(prefix: string, response: Response): Promise<IntegrationRequestError> {
    const payload = (await response.json().catch(() => null)) as TwilioApiErrorPayload | null;
    const message = payload?.message ?? response.statusText;
    const code = payload?.code !== undefined ? String(payload.code) : undefined;

    return new IntegrationRequestError(`${prefix}: ${message}`, {
      status: response.status,
      code,
    });
  }
}

registerHandler("twilio", new TwilioHandler());
