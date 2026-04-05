/**
 * GitHub integration handler
 */

import { BaseIntegration, defineTool, type IntegrationTool, registerHandler } from "./base";

class GitHubHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "list_repos", {
        description: "List repositories visible to the authenticated GitHub user",
        inputSchema: {
          type: "object",
          properties: {
            visibility: {
              type: "string",
              enum: ["all", "public", "private"],
              description: "Repository visibility filter",
            },
            affiliation: {
              type: "string",
              description: "Comma-separated affiliations such as owner,collaborator,organization_member",
            },
            perPage: { type: "number", description: "Maximum repositories to return (default 20)" },
          },
        },
        accessLevel: "read",
        tags: ["github", "repos", "discovery"],
        whenToUse: [
          "User wants to know which GitHub repositories are available.",
          "You need a repository before listing issues or creating one.",
        ],
        safeDefaults: {
          visibility: "all",
          perPage: 20,
        },
        examples: [
          {
            user: "what github repos can you access",
            args: {
              visibility: "all",
              perPage: 20,
            },
          },
        ],
        followups: [
          "Offer to list issues for a selected repository.",
        ],
      }),
      defineTool(integrationSlug, "list_issues", {
        description: "List issues from a GitHub repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "Repository owner" },
            repo: { type: "string", description: "Repository name" },
            state: {
              type: "string",
              enum: ["open", "closed", "all"],
              description: "Issue state filter",
            },
            perPage: { type: "number", description: "Maximum issues to return (default 20)" },
          },
          required: ["owner", "repo"],
        },
        accessLevel: "read",
        tags: ["github", "issues", "repos"],
        whenToUse: [
          "User wants to see issues in a repository.",
          "You need to inspect existing issues before creating a new one.",
        ],
        safeDefaults: {
          state: "open",
          perPage: 20,
        },
        askBefore: [
          "Ask which repository they mean if owner or repo is missing.",
        ],
        examples: [
          {
            user: "show open github issues in useclawlink/clawlink",
            args: {
              owner: "useclawlink",
              repo: "clawlink",
              state: "open",
              perPage: 20,
            },
          },
        ],
        followups: [
          "Offer to create a new issue if nothing matches.",
        ],
      }),
      defineTool(integrationSlug, "create_issue", {
        description: "Create an issue in a GitHub repository",
        inputSchema: {
          type: "object",
          properties: {
            owner: { type: "string", description: "Repository owner" },
            repo: { type: "string", description: "Repository name" },
            title: { type: "string", description: "Issue title" },
            body: { type: "string", description: "Issue body" },
          },
          required: ["owner", "repo", "title"],
        },
        accessLevel: "write",
        tags: ["github", "issues", "create"],
        whenToUse: [
          "User explicitly asks to open a GitHub issue.",
        ],
        askBefore: [
          "Ask which repository to use if owner or repo is missing.",
          "Ask for the issue title or body if the request is underspecified.",
        ],
        examples: [
          {
            user: "open a github issue in useclawlink/clawlink for the oauth timeout bug",
            args: {
              owner: "useclawlink",
              repo: "clawlink",
              title: "OAuth timeout bug",
              body: "Users are hitting a timeout during the OAuth callback flow.",
            },
          },
        ],
        followups: [
          "Offer to list issues afterward so the user can verify it was created.",
        ],
      }),
    ];
  }

  protected getHeaders(credentials: Record<string, string>): Record<string, string> {
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${credentials.accessToken}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  async execute(
    action: string,
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    switch (action) {
      case "list_repos":
        return this.listRepos(args, credentials);
      case "list_issues":
        return this.listIssues(args, credentials);
      case "create_issue":
        return this.createIssue(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: this.getHeaders(credentials),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async listRepos(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const params = new URLSearchParams({
      visibility: String(args.visibility ?? "all"),
      per_page: String(args.perPage ?? 20),
    });

    if (typeof args.affiliation === "string" && args.affiliation.trim()) {
      params.set("affiliation", args.affiliation);
    }

    const response = await this.apiRequest(
      `https://api.github.com/user/repos?${params.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list repositories", response);
    }

    return response.json();
  }

  private async listIssues(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const owner = String(args.owner ?? "");
    const repo = String(args.repo ?? "");
    const params = new URLSearchParams({
      state: String(args.state ?? "open"),
      per_page: String(args.perPage ?? 20),
    });

    const response = await this.apiRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues?${params.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to list issues", response);
    }

    return response.json();
  }

  private async createIssue(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const owner = String(args.owner ?? "");
    const repo = String(args.repo ?? "");
    const response = await this.apiRequest(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        body: JSON.stringify({
          title: args.title,
          body: args.body,
        }),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create issue", response);
    }

    return response.json();
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    return new Error(`${prefix}: ${body?.message ?? response.statusText}`);
  }
}

registerHandler("github", new GitHubHandler());
