/**
 * Apollo integration handler
 */

import { BaseIntegration, defineTool, type IntegrationTool, registerHandler } from "./base";

const APOLLO_BASE_URL = "https://api.apollo.io/api/v1";

type ApolloQueryValue = string | number | boolean | null | undefined | string[];

interface ApolloErrorPayload {
  error?: string | { message?: string };
  message?: string;
  errors?: Array<{ message?: string }> | unknown;
}

class ApolloHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "search_people", {
        description: "Search Apollo's people database for leads that match role, company, geography, and seniority filters",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "General keyword query across names, titles, and employers",
            },
            personTitles: {
              type: "array",
              items: { type: "string" },
              description: "Job titles to match, for example sales director or founder",
            },
            includeSimilarTitles: {
              type: "boolean",
              description: "Whether Apollo should include similar job titles",
            },
            personLocations: {
              type: "array",
              items: { type: "string" },
              description: "Person locations, for example California, US",
            },
            personSeniorities: {
              type: "array",
              items: { type: "string" },
              description: "Apollo seniority filters such as founder, c_suite, vp, director, or manager",
            },
            organizationLocations: {
              type: "array",
              items: { type: "string" },
              description: "Headquarters locations for the current employer",
            },
            organizationDomains: {
              type: "array",
              items: { type: "string" },
              description: "Employer domains such as apollo.io or microsoft.com",
            },
            contactEmailStatus: {
              type: "array",
              items: { type: "string" },
              description: "Email-status filters such as verified or unverified",
            },
            organizationIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo organization ids to constrain the search",
            },
            organizationNumEmployeesRanges: {
              type: "array",
              items: { type: "string" },
              description: "Headcount ranges like 1,10 or 250,500",
            },
            page: {
              type: "number",
              description: "Results page number",
            },
            perPage: {
              type: "number",
              description: "Results per page, between 1 and 100",
            },
            filters: {
              type: "object",
              description: "Additional Apollo query parameters to forward directly",
            },
          },
        },
        accessLevel: "read",
        tags: ["prospecting", "people", "search", "apollo"],
        whenToUse: [
          "User wants to find net-new prospects in Apollo's database.",
          "User asks for people matching job title, company, geography, or seniority filters.",
        ],
        askBefore: [
          "Ask for tighter filters before running a broad search, because Apollo pages large result sets and encourages narrowing searches.",
          "If the user expects email addresses or phone numbers, explain that this search endpoint may require additional enrichment or Apollo credits.",
        ],
        safeDefaults: {
          includeSimilarTitles: true,
          page: 1,
          perPage: 10,
        },
        examples: [
          {
            user: "find sales directors in California and Oregon at microsoft.com",
            args: {
              personTitles: ["sales director", "director sales"],
              personLocations: ["California, US", "Oregon, US"],
              organizationDomains: ["microsoft.com"],
              perPage: 10,
            },
          },
        ],
        followups: [
          "Offer to enrich a selected person to retrieve fuller profile details.",
          "Offer to create a contact after the user confirms the prospect they want to save.",
        ],
      }),
      defineTool(integrationSlug, "search_organizations", {
        description: "Search companies in Apollo's organization database",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Company-name or keyword filter",
            },
            organizationDomains: {
              type: "array",
              items: { type: "string" },
              description: "Company domains such as apollo.io or microsoft.com",
            },
            organizationLocations: {
              type: "array",
              items: { type: "string" },
              description: "Headquarters locations such as Texas or Tokyo",
            },
            organizationNotLocations: {
              type: "array",
              items: { type: "string" },
              description: "Headquarters locations to exclude",
            },
            organizationIds: {
              type: "array",
              items: { type: "string" },
              description: "Specific Apollo organization IDs to look up",
            },
            organizationNumEmployeesRanges: {
              type: "array",
              items: { type: "string" },
              description: "Headcount ranges like 1,10 or 1000,5000",
            },
            keywordTags: {
              type: "array",
              items: { type: "string" },
              description: "Apollo keyword tags associated with companies",
            },
            page: {
              type: "number",
              description: "Results page number",
            },
            perPage: {
              type: "number",
              description: "Results per page, between 1 and 100",
            },
            filters: {
              type: "object",
              description: "Additional Apollo query parameters to forward directly",
            },
          },
        },
        accessLevel: "read",
        tags: ["prospecting", "companies", "accounts", "apollo"],
        whenToUse: [
          "User wants to find companies before searching for people or enriching a company.",
          "User asks for organizations filtered by name, domain, size, or HQ location.",
        ],
        askBefore: [
          "Ask for a company name, domain, or location if the request is too broad.",
        ],
        safeDefaults: {
          page: 1,
          perPage: 10,
        },
        examples: [
          {
            user: "find SaaS companies in California with 250 to 500 employees",
            args: {
              keywordTags: ["saas"],
              organizationLocations: ["California, US"],
              organizationNumEmployeesRanges: ["250,500"],
              perPage: 10,
            },
          },
        ],
        followups: [
          "Offer to search people within a selected organization.",
          "Offer to enrich a selected organization by domain for fuller firmographic details.",
        ],
      }),
      defineTool(integrationSlug, "enrich_person", {
        description: "Enrich a single person's profile in Apollo",
        inputSchema: {
          type: "object",
          properties: {
            firstName: { type: "string", description: "Person's first name" },
            lastName: { type: "string", description: "Person's last name" },
            name: {
              type: "string",
              description: "Person's full name if you are not sending first and last separately",
            },
            email: { type: "string", description: "Work email address for the person" },
            organizationName: { type: "string", description: "Employer name" },
            domain: { type: "string", description: "Employer domain such as apollo.io" },
            id: { type: "string", description: "Apollo person id" },
            linkedinUrl: { type: "string", description: "LinkedIn profile URL" },
            revealPersonalEmails: {
              type: "boolean",
              description: "Request personal emails in addition to standard profile data",
            },
          },
        },
        accessLevel: "read",
        tags: ["enrichment", "people", "profile", "apollo"],
        whenToUse: [
          "User has identified a specific prospect and wants richer profile details.",
          "A previous people search returned an Apollo person id and the next step is to enrich it.",
        ],
        askBefore: [
          "Ask for more identifying data if the user only provides a very generic name.",
          "Confirm before revealing personal emails because that can consume Apollo credits.",
        ],
        safeDefaults: {
          revealPersonalEmails: false,
        },
        examples: [
          {
            user: "enrich that Apollo prospect from microsoft.com",
            args: {
              id: "587cf802f65125cad923a266",
              revealPersonalEmails: false,
            },
          },
        ],
        followups: [
          "Offer to create a contact from the enriched person once the user confirms.",
        ],
      }),
      defineTool(integrationSlug, "enrich_organization", {
        description: "Enrich a single organization in Apollo by domain",
        inputSchema: {
          type: "object",
          properties: {
            domain: {
              type: "string",
              description: "Company domain such as apollo.io or microsoft.com",
            },
          },
          required: ["domain"],
        },
        accessLevel: "read",
        tags: ["enrichment", "companies", "firmographics", "apollo"],
        whenToUse: [
          "User wants fuller firmographic data for a specific company.",
          "You already know the company domain and want revenue, size, industry, or location details.",
        ],
        examples: [
          {
            user: "enrich apollo.io in Apollo",
            args: {
              domain: "apollo.io",
            },
          },
        ],
        followups: [
          "Offer to search people at the enriched company.",
        ],
      }),
      defineTool(integrationSlug, "search_contacts", {
        description: "Search contacts already added to the team's Apollo account",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Keywords across names, job titles, employers, and emails",
            },
            contactStageIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo contact stage ids to include",
            },
            contactLabelIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo contact label ids to include",
            },
            emailStatuses: {
              type: "array",
              items: { type: "string" },
              description: "Apollo contact email status values to filter on",
            },
            sortByField: {
              type: "string",
              description: "Sort field, for example contact_created_at or contact_last_activity_date",
            },
            sortAscending: {
              type: "boolean",
              description: "Whether to sort ascending",
            },
            page: {
              type: "number",
              description: "Results page number",
            },
            perPage: {
              type: "number",
              description: "Results per page, between 1 and 100",
            },
            filters: {
              type: "object",
              description: "Additional Apollo body fields to merge into the search request",
            },
          },
        },
        accessLevel: "read",
        tags: ["contacts", "crm", "search", "apollo"],
        whenToUse: [
          "User wants to search people already saved in their Apollo workspace.",
          "You need to check whether a prospect is already a contact before creating one.",
        ],
        askBefore: [
          "Use a keyword query or stage filter to avoid broad contact scans when possible.",
        ],
        safeDefaults: {
          page: 1,
          perPage: 10,
        },
        examples: [
          {
            user: "search Apollo contacts for Tim Zheng",
            args: {
              query: "Tim Zheng",
              perPage: 10,
            },
          },
        ],
        followups: [
          "Offer to create a contact if nothing relevant exists.",
          "Offer to list contact stages if they want to organize results.",
        ],
      }),
      defineTool(integrationSlug, "list_contact_stages", {
        description: "List the contact stages available in Apollo",
        inputSchema: {
          type: "object",
          properties: {},
        },
        accessLevel: "read",
        tags: ["apollo", "contacts", "stages", "metadata"],
        whenToUse: [
          "You need Apollo contact stage IDs before assigning or filtering contacts by stage.",
        ],
        examples: [
          {
            user: "what contact stages are available in apollo",
            args: {},
          },
        ],
        followups: [
          "Offer to search contacts in a chosen stage.",
          "Offer to create a contact using one of the returned stage ids.",
        ],
      }),
      defineTool(integrationSlug, "create_contact", {
        description: "Create a contact in the team's Apollo account",
        inputSchema: {
          type: "object",
          properties: {
            firstName: { type: "string", description: "Contact first name" },
            lastName: { type: "string", description: "Contact last name" },
            organizationName: { type: "string", description: "Employer name" },
            title: { type: "string", description: "Current job title" },
            accountId: {
              type: "string",
              description: "Apollo account id if you already have it",
            },
            email: { type: "string", description: "Work email address" },
            websiteUrl: { type: "string", description: "Corporate website URL" },
            linkedinUrl: { type: "string", description: "LinkedIn profile URL" },
            ownerId: { type: "string", description: "Apollo user ID to assign as owner" },
            listIds: {
              type: "array",
              items: { type: "string" },
              description: "Apollo list ids to attach",
            },
            contactStageId: { type: "string", description: "Apollo contact stage id" },
            presentRawAddress: {
              type: "string",
              description: "Location text for the contact",
            },
            phone: { type: "string", description: "Primary phone number" },
            directPhone: { type: "string", description: "Primary direct phone number" },
            workPhone: { type: "string", description: "Office phone number" },
            mobilePhone: { type: "string", description: "Mobile phone number" },
            homePhone: { type: "string", description: "Home phone number" },
            otherPhone: { type: "string", description: "Alternative phone number" },
            typedCustomFields: {
              type: "object",
              description: "Apollo custom-field payload keyed by custom field id",
            },
            runDedupe: {
              type: "boolean",
              description: "Whether Apollo should deduplicate instead of always creating a new row",
            },
            extra: {
              type: "object",
              description: "Additional Apollo body fields to merge into the create request",
            },
          },
        },
        accessLevel: "write",
        tags: ["contacts", "crm", "create", "apollo"],
        whenToUse: [
          "User explicitly asks to save a person as an Apollo contact.",
          "A previous Apollo search or enrichment step identified the person to add.",
        ],
        askBefore: [
          "Check for an existing Apollo contact first when duplicates are likely.",
          "Confirm before creating the contact if the person selection is still ambiguous.",
        ],
        safeDefaults: {
          runDedupe: true,
        },
        examples: [
          {
            user: "create an Apollo contact for Mark Twain at Great American Writers",
            args: {
              firstName: "Mark",
              lastName: "Twain",
              organizationName: "Great American Writers Co.",
              email: "mark@greatamericanwriters.com",
              websiteUrl: "https://www.greatamericanwriters.com",
              runDedupe: true,
            },
          },
        ],
        followups: [
          "Offer to search Apollo contacts afterward to verify the saved record.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "X-Api-Key": credentials.apiKey,
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "search_people":
        return this.searchPeople(args, credentials);
      case "search_organizations":
        return this.searchOrganizations(args, credentials);
      case "enrich_person":
        return this.enrichPerson(args, credentials);
      case "enrich_organization":
        return this.enrichOrganization(args, credentials);
      case "search_contacts":
        return this.searchContacts(args, credentials);
      case "list_contact_stages":
        return this.listContactStages(credentials);
      case "create_contact":
        return this.createContact(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        `${APOLLO_BASE_URL}/contacts/search?page=1&per_page=1`,
        {
          method: "POST",
          body: JSON.stringify({}),
        },
        credentials,
      );

      return response.ok;
    } catch {
      return false;
    }
  }

  private buildApolloQuery(params: Record<string, ApolloQueryValue>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === "string" && item.trim()) {
            searchParams.append(key, item.trim());
          }
        }
        continue;
      }

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) {
          searchParams.append(key, trimmed);
        }
        continue;
      }

      searchParams.append(key, String(value));
    }

    return searchParams.toString();
  }

  private async searchPeople(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const query = this.buildApolloQuery({
      "person_titles[]": this.toStringArray(args.personTitles),
      include_similar_titles: this.toOptionalBoolean(args.includeSimilarTitles),
      q_keywords: this.toOptionalString(args.query),
      "person_locations[]": this.toStringArray(args.personLocations),
      "person_seniorities[]": this.toStringArray(args.personSeniorities),
      "organization_locations[]": this.toStringArray(args.organizationLocations),
      "q_organization_domains_list[]": this.toStringArray(args.organizationDomains),
      "contact_email_status[]": this.toStringArray(args.contactEmailStatus),
      "organization_ids[]": this.toStringArray(args.organizationIds),
      "organization_num_employees_ranges[]": this.toStringArray(args.organizationNumEmployeesRanges),
      ...this.recordQueryParams(args.filters),
      page: this.toPositiveInteger(args.page) ?? 1,
      per_page: this.clampPerPage(args.perPage, 10),
    });

    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/mixed_people/api_search?${query}`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to search Apollo people", response);
    }

    return response.json();
  }

  private async searchOrganizations(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const query = this.buildApolloQuery({
      q_organization_name: this.toOptionalString(args.query),
      "q_organization_domains_list[]": this.toStringArray(args.organizationDomains),
      "organization_locations[]": this.toStringArray(args.organizationLocations),
      "organization_not_locations[]": this.toStringArray(args.organizationNotLocations),
      "organization_ids[]": this.toStringArray(args.organizationIds),
      "organization_num_employees_ranges[]": this.toStringArray(args.organizationNumEmployeesRanges),
      "q_organization_keyword_tags[]": this.toStringArray(args.keywordTags),
      ...this.recordQueryParams(args.filters),
      page: this.toPositiveInteger(args.page) ?? 1,
      per_page: this.clampPerPage(args.perPage, 10),
    });

    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/mixed_companies/search?${query}`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to search Apollo organizations", response);
    }

    return response.json();
  }

  private async enrichPerson(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const query = this.buildApolloQuery({
      first_name: this.toOptionalString(args.firstName),
      last_name: this.toOptionalString(args.lastName),
      name: this.toOptionalString(args.name),
      email: this.toOptionalString(args.email),
      organization_name: this.toOptionalString(args.organizationName),
      domain: this.toOptionalString(args.domain),
      id: this.toOptionalString(args.id),
      linkedin_url: this.toOptionalString(args.linkedinUrl),
      reveal_personal_emails: this.toOptionalBoolean(args.revealPersonalEmails) ?? false,
    });

    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/people/match?${query}`,
      { method: "POST" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to enrich Apollo person", response);
    }

    return response.json();
  }

  private async enrichOrganization(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const domain = this.toOptionalString(args.domain);

    if (!domain) {
      throw new Error("domain is required");
    }

    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/organizations/enrich?${this.buildApolloQuery({ domain })}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to enrich Apollo organization", response);
    }

    return response.json();
  }

  private async searchContacts(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const body: Record<string, unknown> = {
      page: this.toPositiveInteger(args.page) ?? 1,
      per_page: this.clampPerPage(args.perPage, 10),
    };

    if (this.toOptionalString(args.query)) {
      body.q_keywords = this.toOptionalString(args.query);
    }

    if (this.toStringArray(args.contactStageIds).length > 0) {
      body.contact_stage_ids = this.toStringArray(args.contactStageIds);
    }

    if (this.toStringArray(args.contactLabelIds).length > 0) {
      body.contact_label_ids = this.toStringArray(args.contactLabelIds);
    }

    if (this.toStringArray(args.emailStatuses).length > 0) {
      body.contact_email_status = this.toStringArray(args.emailStatuses);
    }

    if (this.toOptionalString(args.sortByField)) {
      body.sort_by_field = this.toOptionalString(args.sortByField);
    }

    if (this.toOptionalBoolean(args.sortAscending) !== undefined) {
      body.sort_ascending = this.toOptionalBoolean(args.sortAscending);
    }

    if (this.isRecord(args.filters)) {
      for (const [key, value] of Object.entries(args.filters)) {
        body[key] = value;
      }
    }

    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/contacts/search`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to search Apollo contacts", response);
    }

    return response.json();
  }

  private async listContactStages(credentials: Record<string, string>): Promise<unknown> {
    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/contact_stages`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list Apollo contact stages", response);
    }

    return response.json();
  }

  private async createContact(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const hasIdentity =
      this.toOptionalString(args.email) ||
      this.toOptionalString(args.firstName) ||
      this.toOptionalString(args.lastName) ||
      this.toOptionalString(args.organizationName);

    if (!hasIdentity) {
      throw new Error(
        "Provide at least one identifying field such as email, firstName, lastName, or organizationName.",
      );
    }

    const query = this.buildApolloQuery({
      first_name: this.toOptionalString(args.firstName),
      last_name: this.toOptionalString(args.lastName),
      organization_name: this.toOptionalString(args.organizationName),
      title: this.toOptionalString(args.title),
      account_id: this.toOptionalString(args.accountId),
      email: this.toOptionalString(args.email),
      website_url: this.toOptionalString(args.websiteUrl),
      linkedin_url: this.toOptionalString(args.linkedinUrl),
      owner_id: this.toOptionalString(args.ownerId),
      list_ids: this.toStringArray(args.listIds),
      contact_stage_id: this.toOptionalString(args.contactStageId),
      present_raw_address: this.toOptionalString(args.presentRawAddress),
      phone_number: this.toOptionalString(args.phone),
      direct_phone: this.toOptionalString(args.directPhone),
      work_phone: this.toOptionalString(args.workPhone),
      mobile_phone: this.toOptionalString(args.mobilePhone),
      home_phone: this.toOptionalString(args.homePhone),
      other_phone: this.toOptionalString(args.otherPhone),
      run_dedupe: this.toOptionalBoolean(args.runDedupe) ?? true,
    });

    const body: Record<string, unknown> = {};

    if (this.isRecord(args.typedCustomFields)) {
      body.typed_custom_fields = args.typedCustomFields;
    }

    if (this.isRecord(args.extra)) {
      for (const [key, value] of Object.entries(args.extra)) {
        body[key] = value;
      }
    }

    const response = await this.apiRequest(
      `${APOLLO_BASE_URL}/contacts?${query}`,
      {
        method: "POST",
        ...(Object.keys(body).length > 0 ? { body: JSON.stringify(body) } : {}),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Apollo contact", response);
    }

    return response.json();
  }

  private recordQueryParams(value: unknown): Record<string, ApolloQueryValue> {
    if (!this.isRecord(value)) {
      return {};
    }

    const entries: Array<[string, ApolloQueryValue]> = [];

    for (const [key, rawValue] of Object.entries(value)) {
      if (
        rawValue === null ||
        rawValue === undefined ||
        typeof rawValue === "string" ||
        typeof rawValue === "number" ||
        typeof rawValue === "boolean"
      ) {
        entries.push([key, rawValue]);
        continue;
      }

      if (Array.isArray(rawValue)) {
        const values = rawValue.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0,
        );
        entries.push([key, values]);
      }
    }

    return Object.fromEntries(entries);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private toOptionalString(value: unknown): string | undefined {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private toStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private toOptionalBoolean(value: unknown): boolean | undefined {
    return typeof value === "boolean" ? value : undefined;
  }

  private toPositiveInteger(value: unknown): number | undefined {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return undefined;
    }

    const rounded = Math.trunc(value);
    return rounded > 0 ? rounded : undefined;
  }

  private clampPerPage(value: unknown, fallback: number): number {
    const parsed = this.toPositiveInteger(value);

    if (!parsed) {
      return fallback;
    }

    return Math.min(parsed, 100);
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const payload = (await response.json().catch(() => null)) as ApolloErrorPayload | null;
    const nestedErrors = Array.isArray(payload?.errors)
      ? payload.errors
          .map((entry) => (entry && typeof entry === "object" && "message" in entry ? String(entry.message) : ""))
          .filter(Boolean)
          .join("; ")
      : payload?.errors && typeof payload.errors === "object"
        ? JSON.stringify(payload.errors)
        : undefined;
    const message =
      payload?.message ??
      (typeof payload?.error === "string" ? payload.error : payload?.error?.message) ??
      nestedErrors ??
      response.statusText;

    if (response.status === 403) {
      return new Error(`${prefix}: ${message}. Apollo may require a master API key for this endpoint.`);
    }

    return new Error(`${prefix}: ${message}`);
  }
}

registerHandler("apollo", new ApolloHandler());
