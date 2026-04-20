import {
  BaseIntegration,
  defineTool,
  type IntegrationTool,
  IntegrationRequestError,
  registerHandler,
} from "./base";

const GOOGLE_SHEETS_BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

type UnknownRecord = Record<string, unknown>;

type SheetsValue = string | number | boolean | null;

type SheetsRow = SheetsValue[];

interface GoogleApiErrorPayload {
  error?: {
    code?: number | string;
    status?: string;
    message?: string;
  };
}

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
    throw new Error("Google Sheets credentials are missing an access token.");
  }

  return token;
}

function requiredString(value: unknown, fieldName: string): string {
  const normalized = safeTrim(value);

  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  return normalized;
}

function optionalString(value: unknown): string | undefined {
  return safeTrim(value) ?? undefined;
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

function normalizeRowArray(value: unknown, fieldName: string): SheetsRow[] {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array of rows`);
  }

  return value.map((row, rowIndex) => {
    if (!Array.isArray(row)) {
      throw new Error(`${fieldName}[${rowIndex}] must be an array`);
    }

    return row.map((cell, cellIndex) => {
      if (
        cell === null ||
        typeof cell === "string" ||
        typeof cell === "number" ||
        typeof cell === "boolean"
      ) {
        return cell;
      }

      throw new Error(`${fieldName}[${rowIndex}][${cellIndex}] must be a string, number, boolean, or null`);
    });
  });
}

function summarizeSpreadsheet(spreadsheet: UnknownRecord): UnknownRecord {
  const spreadsheetId = optionalString(spreadsheet.spreadsheetId) ?? null;
  const spreadsheetUrl = optionalString(spreadsheet.spreadsheetUrl) ?? null;
  const properties = isRecordObject(spreadsheet.properties) ? spreadsheet.properties : null;
  const title = properties ? optionalString(properties.title) ?? null : null;
  const sheets = Array.isArray(spreadsheet.sheets)
    ? spreadsheet.sheets
        .map((sheet) => {
          if (!isRecordObject(sheet)) {
            return null;
          }

          const sheetProperties = isRecordObject(sheet.properties) ? sheet.properties : null;
          if (!sheetProperties) {
            return null;
          }

          return {
            sheetId: optionalNumber(sheetProperties.sheetId) ?? null,
            title: optionalString(sheetProperties.title) ?? null,
            index: optionalNumber(sheetProperties.index) ?? null,
            rowCount: isRecordObject(sheetProperties.gridProperties)
              ? optionalNumber(sheetProperties.gridProperties.rowCount) ?? null
              : null,
            columnCount: isRecordObject(sheetProperties.gridProperties)
              ? optionalNumber(sheetProperties.gridProperties.columnCount) ?? null
              : null,
          };
        })
        .filter((sheet): sheet is Exclude<typeof sheet, null> => sheet !== null)
    : [];

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
    sheets,
  };
}

class GoogleSheetsHandler extends BaseIntegration {
  getTools(integrationSlug: string): IntegrationTool[] {
    return [
      defineTool(integrationSlug, "create_spreadsheet", {
        description: "Create a new Google Sheets spreadsheet",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Spreadsheet title" },
            sheetTitle: { type: "string", description: "Optional first sheet title" },
            headers: {
              type: "array",
              items: { type: "string" },
              description: "Optional first row values to write as headers",
            },
          },
          required: ["title"],
        },
        accessLevel: "write",
        tags: ["google-sheets", "spreadsheets", "create"],
      }),
      defineTool(integrationSlug, "get_spreadsheet", {
        description: "Get Google Sheets spreadsheet metadata and sheet list",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" },
          },
          required: ["spreadsheetId"],
        },
        accessLevel: "read",
        tags: ["google-sheets", "spreadsheets", "lookup"],
      }),
      defineTool(integrationSlug, "read_sheet", {
        description: "Read values from a Google Sheets range",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" },
            range: { type: "string", description: "A1 notation range such as Sheet1!A1:D20" },
            majorDimension: { type: "string", enum: ["ROWS", "COLUMNS"], description: "How values are grouped" },
            valueRenderOption: {
              type: "string",
              enum: ["FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA"],
              description: "How returned values should be rendered",
            },
          },
          required: ["spreadsheetId", "range"],
        },
        accessLevel: "read",
        tags: ["google-sheets", "spreadsheets", "read", "values"],
      }),
      defineTool(integrationSlug, "append_rows", {
        description: "Append rows to a Google Sheets worksheet range",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" },
            range: { type: "string", description: "Target A1 notation range such as Sheet1!A:C" },
            rows: {
              type: "array",
              items: {
                type: "array",
                items: {
                  anyOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "boolean" },
                    { type: "null" },
                  ],
                },
              },
              description: "Rows to append",
            },
            valueInputOption: {
              type: "string",
              enum: ["RAW", "USER_ENTERED"],
              description: "How Google Sheets should interpret incoming values",
            },
            insertDataOption: {
              type: "string",
              enum: ["OVERWRITE", "INSERT_ROWS"],
              description: "How appended data should be inserted",
            },
          },
          required: ["spreadsheetId", "range", "rows"],
        },
        accessLevel: "write",
        tags: ["google-sheets", "spreadsheets", "append", "rows"],
      }),
      defineTool(integrationSlug, "update_range", {
        description: "Write values into a Google Sheets range",
        inputSchema: {
          type: "object",
          properties: {
            spreadsheetId: { type: "string", description: "Google Sheets spreadsheet id" },
            range: { type: "string", description: "Target A1 notation range such as Sheet1!A1:C5" },
            rows: {
              type: "array",
              items: {
                type: "array",
                items: {
                  anyOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "boolean" },
                    { type: "null" },
                  ],
                },
              },
              description: "2D array of values to write",
            },
            valueInputOption: {
              type: "string",
              enum: ["RAW", "USER_ENTERED"],
              description: "How Google Sheets should interpret incoming values",
            },
          },
          required: ["spreadsheetId", "range", "rows"],
        },
        accessLevel: "write",
        tags: ["google-sheets", "spreadsheets", "update", "values"],
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
      case "create_spreadsheet":
        return this.createSpreadsheet(args, credentials);
      case "get_spreadsheet":
        return this.getSpreadsheet(args, credentials);
      case "read_sheet":
        return this.readSheet(args, credentials);
      case "append_rows":
        return this.appendRows(args, credentials);
      case "update_range":
        return this.updateRange(args, credentials);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async validateCredentials(credentials: Record<string, string>): Promise<boolean> {
    try {
      const response = await this.apiRequest(
        `${GOOGLE_SHEETS_BASE_URL}?fields=spreadsheetId`,
        { method: "POST", body: JSON.stringify({ properties: { title: "ClawLink Sheets Auth Check" } }) },
        credentials,
      );

      return response.ok || response.status === 400;
    } catch {
      return false;
    }
  }

  private async createSpreadsheet(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const title = requiredString(args.title, "title");
    const sheetTitle = optionalString(args.sheetTitle);
    const headers = Array.isArray(args.headers)
      ? args.headers.map((value, index) => requiredString(value, `headers[${index}]`))
      : [];

    const createBody: UnknownRecord = {
      properties: { title },
    };

    if (sheetTitle) {
      createBody.sheets = [
        {
          properties: {
            title: sheetTitle,
          },
        },
      ];
    }

    const response = await this.apiRequest(
      GOOGLE_SHEETS_BASE_URL,
      {
        method: "POST",
        body: JSON.stringify(createBody),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to create Google Sheets spreadsheet", response);
    }

    const spreadsheet = (await response.json()) as UnknownRecord;
    const spreadsheetId = requiredString(spreadsheet.spreadsheetId, "spreadsheetId");

    if (headers.length > 0) {
      const summary = summarizeSpreadsheet(spreadsheet);
      const firstSheetTitle = Array.isArray(summary.sheets) && summary.sheets.length > 0 && isRecordObject(summary.sheets[0])
        ? optionalString(summary.sheets[0].title) ?? "Sheet1"
        : "Sheet1";

      await this.updateRange(
        {
          spreadsheetId,
          range: `${firstSheetTitle}!A1`,
          rows: [headers],
          valueInputOption: "RAW",
        },
        credentials,
      );
    }

    return summarizeSpreadsheet(spreadsheet);
  }

  private async getSpreadsheet(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const spreadsheetId = requiredString(args.spreadsheetId, "spreadsheetId");
    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}?includeGridData=false`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to get Google Sheets spreadsheet", response);
    }

    return response.json();
  }

  private async readSheet(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const spreadsheetId = requiredString(args.spreadsheetId, "spreadsheetId");
    const range = requiredString(args.range, "range");
    const majorDimension = optionalString(args.majorDimension) ?? "ROWS";
    const valueRenderOption = optionalString(args.valueRenderOption) ?? "FORMATTED_VALUE";

    const query = new URLSearchParams({
      majorDimension,
      valueRenderOption,
    });

    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?${query.toString()}`,
      { method: "GET" },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to read Google Sheets range", response);
    }

    const body = (await response.json()) as UnknownRecord;
    const values = Array.isArray(body.values) ? body.values : [];

    return {
      spreadsheetId,
      range: optionalString(body.range) ?? range,
      majorDimension: optionalString(body.majorDimension) ?? majorDimension,
      rowCount: values.length,
      values,
    };
  }

  private async appendRows(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const spreadsheetId = requiredString(args.spreadsheetId, "spreadsheetId");
    const range = requiredString(args.range, "range");
    const rows = normalizeRowArray(args.rows, "rows");
    const valueInputOption = optionalString(args.valueInputOption) ?? "USER_ENTERED";
    const insertDataOption = optionalString(args.insertDataOption) ?? "INSERT_ROWS";

    const query = new URLSearchParams({
      valueInputOption,
      insertDataOption,
      includeValuesInResponse: "true",
    });

    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}:append?${query.toString()}`,
      {
        method: "POST",
        body: JSON.stringify({
          majorDimension: "ROWS",
          values: rows,
        }),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to append rows to Google Sheets", response);
    }

    const body = (await response.json()) as UnknownRecord;
    const updates = isRecordObject(body.updates) ? body.updates : null;

    return {
      spreadsheetId,
      tableRange: optionalString(body.tableRange) ?? null,
      updatedRange: updates ? optionalString(updates.updatedRange) ?? null : null,
      updatedRows: updates ? optionalNumber(updates.updatedRows) ?? rows.length : rows.length,
      updatedColumns: updates ? optionalNumber(updates.updatedColumns) ?? null : null,
      updatedCells: updates ? optionalNumber(updates.updatedCells) ?? null : null,
    };
  }

  private async updateRange(
    args: Record<string, unknown>,
    credentials: Record<string, string>,
  ): Promise<unknown> {
    const spreadsheetId = requiredString(args.spreadsheetId, "spreadsheetId");
    const range = requiredString(args.range, "range");
    const rows = normalizeRowArray(args.rows, "rows");
    const valueInputOption = optionalString(args.valueInputOption) ?? "USER_ENTERED";

    const query = new URLSearchParams({
      valueInputOption,
      includeValuesInResponse: "true",
    });

    const response = await this.apiRequest(
      `${GOOGLE_SHEETS_BASE_URL}/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?${query.toString()}`,
      {
        method: "PUT",
        body: JSON.stringify({
          majorDimension: "ROWS",
          range,
          values: rows,
        }),
      },
      credentials,
    );

    if (!response.ok) {
      throw await this.createApiError("Failed to update Google Sheets range", response);
    }

    const body = (await response.json()) as UnknownRecord;

    return {
      spreadsheetId,
      updatedRange: optionalString(body.updatedRange) ?? range,
      updatedRows: optionalNumber(body.updatedRows) ?? rows.length,
      updatedColumns: optionalNumber(body.updatedColumns) ?? null,
      updatedCells: optionalNumber(body.updatedCells) ?? null,
    };
  }

  private async createApiError(prefix: string, response: Response): Promise<Error> {
    const body = (await response.json().catch(() => null)) as GoogleApiErrorPayload | null;
    const status = safeTrim(body?.error?.status);
    const message = body?.error?.message ?? response.statusText;
    const code = body?.error?.code !== undefined ? String(body.error.code) : undefined;
    const detail = status ? `${status}: ${message}` : message;

    return new IntegrationRequestError(`${prefix}: ${detail}`, {
      status: response.status,
      code,
    });
  }
}

registerHandler("google-sheets", new GoogleSheetsHandler());
