import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
    accessLevel?: IntegrationTool["accessLevel"];
    tags?: string[];
    whenToUse?: string[];
    askBefore?: string[];
    safeDefaults?: Record<string, unknown>;
    examples?: IntegrationTool["examples"];
    requiresScopes?: string[];
    idempotent?: boolean;
    supportsDryRun?: boolean;
    supportsBatch?: boolean;
    toolSlug: string;
  },
): IntegrationTool {
  return {
    integration: "xero",
    name: partial.name,
    description: partial.description,
    inputSchema: partial.inputSchema,
    outputSchema: partial.outputSchema,
    accessLevel: partial.accessLevel ?? partial.mode,
    mode: partial.mode,
    risk: partial.risk,
    tags: partial.tags ?? [],
    whenToUse: partial.whenToUse ?? [],
    askBefore: partial.askBefore ?? [],
    safeDefaults: partial.safeDefaults ?? {},
    examples: partial.examples ?? [],
    followups: [],
    requiresScopes: partial.requiresScopes ?? [],
    idempotent: partial.idempotent ?? partial.mode === "read",
    supportsDryRun: partial.supportsDryRun ?? false,
    supportsBatch: partial.supportsBatch ?? false,
    execution: {
      kind: "composio_tool",
      toolkit: "xero",
      toolSlug: partial.toolSlug,
      version: "20260429_00",
    },
  };
}

export const xeroComposioTools: IntegrationTool[] = [
  composioTool({
    name: "xero_create_bank_transaction",
    description: "Create a bank transaction in Xero. Use SPEND for payments out or RECEIVE for money received.",
    toolSlug: "XERO_CREATE_BANK_TRANSACTION",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Date: {
          type: "string",
          description: "Transaction date in YYYY-MM-DD format.",
        },
        Type: {
          type: "string",
          description: "Transaction type: SPEND (payment out) or RECEIVE (money in).",
        },
        Status: {
          type: "string",
          description: "Transaction status: AUTHORISED or DELETED.",
        },
        ContactID: {
          type: "string",
          description: "Xero Contact ID for the transaction.",
        },
        LineItems: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              TaxType: {
                type: "string",
                description: "Tax type for the line item (e.g., OUTPUT, INPUT, NONE).",
              },
              Quantity: {
                type: "number",
                description: "Quantity of the item (default 1).",
              },
              Tracking: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                },
                description: "Tracking categories for the line item.",
              },
              UnitAmount: {
                type: "number",
                description: "Unit price of the item.",
              },
              AccountCode: {
                type: "string",
                description: "Account code for the line item.",
              },
              Description: {
                type: "string",
                description: "Description of the line item.",
              },
            },
            description: "Line item for a bank transaction.",
          },
          description: "List of line items for the bank transaction.",
        },
        Reference: {
          type: "string",
          description: "Reference or transaction description.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        CurrencyCode: {
          type: "string",
          description: "Currency code (e.g., USD, EUR).",
        },
        BankAccountID: {
          type: "string",
          description: "Bank account UUID identifier. Either bank_account_code or bank_account_id must be provided.",
        },
        BankAccountCode: {
          type: "string",
          description: "Short alphanumeric account code (e.g., '090', '091'), not the account name. Maximum 10 characters.",
        },
      },
      required: [
        "Type",
        "ContactID",
        "LineItems",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Bank Transaction.",
    ],
  }),
  composioTool({
    name: "xero_create_contact",
    description: "Create a new contact in Xero. Contacts can be customers, suppliers, or both.",
    toolSlug: "XERO_CREATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Name: {
          type: "string",
          description: "Full name of the contact or organization.",
        },
        Website: {
          type: "string",
          description: "Website URL of the contact.",
        },
        LastName: {
          type: "string",
          description: "Last name of the contact person.",
        },
        FirstName: {
          type: "string",
          description: "First name of the contact person.",
        },
        TaxNumber: {
          type: "string",
          description: "Tax number (VAT/ABN/GST number).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        IsCustomer: {
          type: "boolean",
          description: "Mark as customer when true.",
        },
        IsSupplier: {
          type: "boolean",
          description: "Mark as supplier when true.",
        },
        EmailAddress: {
          type: "string",
          description: "Email address of the contact.",
        },
        phone_number: {
          type: "string",
          description: "Primary phone number (will be added as DEFAULT phone type).",
        },
        AccountNumber: {
          type: "string",
          description: "Account reference number for the contact.",
        },
        mobile_number: {
          type: "string",
          description: "Mobile phone number (will be added as MOBILE phone type).",
        },
        DefaultCurrency: {
          type: "string",
          description: "Default currency code (e.g., USD, EUR).",
        },
        BankAccountDetails: {
          type: "string",
          description: "Bank account details for the contact.",
        },
      },
      required: [
        "Name",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Contact.",
    ],
  }),
  composioTool({
    name: "xero_create_invoice",
    description: "Create a new invoice in Xero. Supports both sales invoices (ACCREC) and bills (ACCPAY).",
    toolSlug: "XERO_CREATE_INVOICE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Date: {
          type: "string",
          description: "Invoice date in YYYY-MM-DD format.",
        },
        Type: {
          type: "string",
          description: "Invoice type: ACCREC (accounts receivable/sales) or ACCPAY (accounts payable/bills).",
          enum: [
            "ACCREC",
            "ACCPAY",
          ],
        },
        Status: {
          type: "string",
          description: "Invoice status.",
          enum: [
            "DRAFT",
            "SUBMITTED",
            "AUTHORISED",
          ],
        },
        DueDate: {
          type: "string",
          description: "Due date in YYYY-MM-DD format.",
        },
        ContactID: {
          type: "string",
          description: "Xero Contact ID (UUID). At least one of contact_id or contact_name must be provided.",
        },
        LineItems: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              TaxType: {
                type: "string",
                description: "Tax type from TaxRates.",
              },
              ItemCode: {
                type: "string",
                description: "Item code reference.",
              },
              Quantity: {
                type: "number",
                description: "LineItem quantity.",
              },
              Tracking: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    Name: {
                      type: "string",
                      description: "Name of the tracking category.",
                    },
                    Option: {
                      type: "string",
                      description: "Selected tracking option.",
                    },
                  },
                  description: "Tracking category for line items.",
                },
                description: "Optional tracking categories; maximum 2 elements per line item.",
              },
              AccountID: {
                type: "string",
                description: "Associated account ID (UUID) related to line item.",
              },
              TaxAmount: {
                type: "number",
                description: "Auto-calculated tax percentage; can be overridden if incorrect.",
              },
              LineAmount: {
                type: "number",
                description: "Can provide when Quantity or UnitAmount omitted; reflects discounted price.",
              },
              LineItemID: {
                type: "string",
                description: "LineItem unique ID (UUID).",
              },
              UnitAmount: {
                type: "number",
                description: "LineItem unit amount.",
              },
              AccountCode: {
                type: "string",
                description: "Account code reference.",
              },
              Description: {
                type: "string",
                description: "Line item description. Must be at least 1 char long. Can create line item with just description.",
              },
              DiscountRate: {
                type: "number",
                description: "Percentage discount (ACCREC invoices only).",
              },
              DiscountAmount: {
                type: "number",
                description: "Discount amount (ACCREC invoices and quotes only).",
              },
            },
            description: "Line item for an invoice.",
          },
          description: "List of line items for the invoice.",
        },
        Reference: {
          type: "string",
          description: "Reference or purchase order number.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. In multi-org setups, pass the same tenant_id consistently across all Xero tool calls.",
        },
        ContactName: {
          type: "string",
          description: "Contact name. At least one of contact_id or contact_name must be provided.",
        },
        CurrencyCode: {
          type: "string",
          description: "Currency code (e.g., USD, EUR).",
        },
        InvoiceNumber: {
          type: "string",
          description: "Invoice number (auto-generated if not provided). WARNING: If this matches an existing invoice number, Xero will attempt to UPDATE that invoice instead of creating a new one. Omit this field to ensure a new invoice is created, or ensure the number is unique.",
        },
      },
      required: [
        "Type",
        "LineItems",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Invoice.",
    ],
  }),
  composioTool({
    name: "xero_create_item",
    description: "Create an inventory item in Xero. Items can be tracked for sales and/or purchases.",
    toolSlug: "XERO_CREATE_ITEM",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Code: {
          type: "string",
          description: "Unique item code (SKU).",
        },
        Name: {
          type: "string",
          description: "Item name/description.",
        },
        IsSold: {
          type: "boolean",
          description: "Item can be sold when true.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        IsPurchased: {
          type: "boolean",
          description: "Item can be purchased when true.",
        },
        "SalesDetails.UnitPrice": {
          type: "number",
          description: "Unit price for sales.",
        },
        "SalesDetails.AccountCode": {
          type: "string",
          description: "Account code for sales.",
        },
        "PurchaseDetails.UnitPrice": {
          type: "number",
          description: "Unit price for purchases.",
        },
        "PurchaseDetails.AccountCode": {
          type: "string",
          description: "Account code for purchases.",
        },
      },
      required: [
        "Code",
        "Name",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Item.",
    ],
  }),
  composioTool({
    name: "xero_create_manual_journal",
    description: "Create one or more manual journals (journal entries) in Xero with journal lines. Manual journals must balance (debits equal credits).",
    toolSlug: "XERO_CREATE_MANUAL_JOURNAL",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Url: {
          type: "string",
          description: "URL link to a source document for reference, shown as 'Go to [appName]' in Xero",
        },
        Date: {
          type: "string",
          description: "Date journal was posted in YYYY-MM-DD format",
        },
        Status: {
          type: "string",
          description: "Manual journal status. DRAFT for unposted journals, POSTED to finalize. Defaults to DRAFT if not specified",
          enum: [
            "DRAFT",
            "POSTED",
          ],
        },
        Narration: {
          type: "string",
          description: "Description of journal being posted. This appears as the journal description in Xero",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant",
        },
        JournalLines: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              TaxType: {
                type: "string",
                description: "Tax classification; overrides default for the selected account. Common values: NONE, OUTPUT, INPUT",
              },
              Tracking: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    Name: {
                      type: "string",
                      description: "Name of the tracking category",
                    },
                    Option: {
                      type: "string",
                      description: "The specific tracking option value being applied",
                    },
                    TrackingOptionID: {
                      type: "string",
                      description: "GUID identifier for the specific tracking option",
                    },
                    TrackingCategoryID: {
                      type: "string",
                      description: "GUID identifier for the tracking category",
                    },
                  },
                  description: "Tracking category for journal line items.",
                },
                description: "Optional Tracking Category. Any JournalLine can have a maximum of 2 TrackingCategory elements",
              },
              LineAmount: {
                type: "number",
                description: "Total for line. Debits are positive, credits are negative value",
              },
              AccountCode: {
                type: "string",
                description: "Account code reference from the chart of accounts",
              },
              Description: {
                type: "string",
                description: "Text describing the journal line entry",
              },
            },
            description: "Journal line item for manual journal creation.",
          },
          description: "Array of journal line items. Manual journals must balance (sum of debits must equal sum of credits) or an error is returned",
        },
        LineAmountTypes: {
          type: "string",
          description: "Line amount type indicating whether amounts are inclusive or exclusive of tax. Defaults to NoTax if not specified",
          enum: [
            "Exclusive",
            "Inclusive",
            "NoTax",
          ],
        },
        idempotency_key: {
          type: "string",
          description: "Idempotency key to prevent duplicate journal creation. Recommended for production use. This is sent as a header, not in the body",
        },
        summarize_errors: {
          type: "boolean",
          description: "If true, API will return summarized validation errors. If false, detailed errors are returned. Query parameter only",
        },
        ShowOnCashBasisReports: {
          type: "boolean",
          description: "Boolean display indicator; defaults to true if not specified",
        },
      },
      required: [
        "Narration",
        "Date",
        "JournalLines",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
      "manual_journals",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Manual Journal.",
    ],
    idempotent: true,
  }),
  composioTool({
    name: "xero_create_payment",
    description: "Create a payment in Xero to link an invoice with a bank account transaction.",
    toolSlug: "XERO_CREATE_PAYMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Date: {
          type: "string",
          description: "Payment date in YYYY-MM-DD format.",
        },
        Amount: {
          type: "number",
          description: "Payment amount.",
        },
        AccountID: {
          type: "string",
          description: "Xero Account ID (bank account) for the payment.",
        },
        InvoiceID: {
          type: "string",
          description: "Xero Invoice ID that this payment is for.",
        },
        Reference: {
          type: "string",
          description: "Payment reference or description.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        CurrencyRate: {
          type: "number",
          description: "Exchange rate for foreign currency payments.",
        },
      },
      required: [
        "InvoiceID",
        "AccountID",
        "Amount",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Payment.",
    ],
  }),
  composioTool({
    name: "xero_create_purchase_order",
    description: "Create a purchase order in Xero to order goods/services from suppliers.",
    toolSlug: "XERO_CREATE_PURCHASE_ORDER",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Date: {
          type: "string",
          description: "Purchase order date in YYYY-MM-DD format.",
        },
        Status: {
          type: "string",
          description: "Purchase order status: DRAFT, SUBMITTED, AUTHORISED, BILLED.",
        },
        ContactID: {
          type: "string",
          description: "Xero Contact ID for the purchase order.",
        },
        LineItems: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              TaxType: {
                type: "string",
                description: "Tax type for the line item (e.g., INPUT, NONE).",
              },
              ItemCode: {
                type: "string",
                description: "Item code if using inventory items.",
              },
              Quantity: {
                type: "number",
                description: "Quantity of the item.",
              },
              UnitAmount: {
                type: "number",
                description: "Unit price of the item.",
              },
              AccountCode: {
                type: "string",
                description: "Account code for the line item.",
              },
              Description: {
                type: "string",
                description: "Description of the line item.",
              },
            },
            description: "Line item for a purchase order.",
          },
          description: "List of line items for the purchase order.",
        },
        Reference: {
          type: "string",
          description: "Reference or purchase order number.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        DeliveryDate: {
          type: "string",
          description: "Expected delivery date in YYYY-MM-DD format.",
        },
      },
      required: [
        "ContactID",
        "LineItems",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Create Purchase Order.",
    ],
  }),
  composioTool({
    name: "xero_get_account",
    description: "Retrieve a specific account from Xero's chart of accounts by its unique ID. Returns detailed account information including code, name, type (BANK, REVENUE, EXPENSE, etc.), status (ACTIVE/ARCHIVED), tax settings, bank details (for BANK accounts), and classification. Use XERO_LIST_ACCOUNTS to get account IDs if you don't already have one.",
    toolSlug: "XERO_GET_ACCOUNT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID (UUID format). If not provided, uses the first connected tenant.",
        },
        account_id: {
          type: "string",
          description: "Xero Account ID (UUID format, e.g., '562555f2-8cde-4ce9-8203-0363922537a4'). Get account IDs from XERO_LIST_ACCOUNTS action.",
        },
      },
      required: [
        "account_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_asset",
    description: "Retrieve a specific asset by ID from Xero. Returns depreciation details and book value.",
    toolSlug: "XERO_GET_ASSET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        asset_id: {
          type: "string",
          description: "Xero Asset ID to retrieve.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
      },
      required: [
        "asset_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_balance_sheet_report",
    description: "Retrieve Balance Sheet report from Xero. Shows assets, liabilities, and equity at a specific date. Liability and credit balances appear as negative numbers in the response. Response structure is Reports → Rows → Sections; account lines are nested inside group sections and summary totals (e.g., 'Total Current Assets') appear in SummaryRows.",
    toolSlug: "XERO_GET_BALANCE_SHEET_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        date: {
          type: "string",
          description: "Balance sheet as of this date in YYYY-MM-DD format. Should align with the organisation's financial year settings; misaligned dates may produce unexpected figures.",
        },
        periods: {
          type: "integer",
          description: "Number of periods to compare.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. In multi-org connections, omitting this returns the first tenant's data silently — always pass explicitly when multiple orgs are connected.",
        },
        timeframe: {
          type: "string",
          description: "Timeframe period: MONTH, QUARTER, or YEAR.",
        },
        paymentsOnly: {
          type: "boolean",
          description: "Show only cash transactions when true (cash basis).",
        },
        standardLayout: {
          type: "boolean",
          description: "Use standard layout when true.",
        },
        trackingOptionID: {
          type: "string",
          description: "Filter by tracking option ID.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_budget",
    description: "Retrieve a budget from Xero. Budgets track planned vs actual spending by account.",
    toolSlug: "XERO_GET_BUDGET",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        DateTo: {
          type: "string",
          description: "End date for budget data in YYYY-MM-DD format.",
        },
        DateFrom: {
          type: "string",
          description: "Start date for budget data in YYYY-MM-DD format.",
        },
        budget_id: {
          type: "string",
          description: "Xero Budget ID to retrieve.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
      },
      required: [
        "budget_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_connections",
    description: "Tool to list active Xero connections. Use to retrieve all current tenant connections for the authenticated user and resolve the correct tenant_id before making data requests. When multiple tenants are returned, never assume the first connection is correct — always explicitly pass the intended tenant_id to every subsequent call. Using a wrong or stale tenant_id can silently return or modify data for a different organisation.",
    toolSlug: "XERO_GET_CONNECTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      properties: {},
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_contacts",
    description: "Tool to retrieve a list of contacts. Use when you need up-to-date contact information with filtering, paging, or incremental updates.",
    toolSlug: "XERO_GET_CONTACTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        IDs: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Comma-separated list of ContactIDs to filter by.",
        },
        page: {
          type: "integer",
          description: "Page number for paginated results (requires pageSize). Iterate incrementing page until an empty result is returned to exhaust all records.",
        },
        order: {
          type: "string",
          description: "Sort by field, e.g. UpdatedDateUTC DESC.",
        },
        where: {
          type: "string",
          description: "OData-style filter for querying contacts. Optimized fields: Name, EmailAddress, AccountNumber, TaxNumber, ContactStatus, City, Country, IsCustomer, IsSupplier. Note: On high-volume accounts, some filters (e.g., IsCustomer, IsSupplier) may be rejected by Xero. If a filter fails on high-volume accounts, use searchTerm, page/pageSize pagination, or remove the where filter.",
        },
        pageSize: {
          type: "integer",
          description: "Number of contacts per page (requires page).",
        },
        ContactID: {
          type: "string",
          description: "Xero ContactID. If provided, fetches a single contact at /Contacts/{ContactID}.",
        },
        searchTerm: {
          type: "string",
          description: "Case-insensitive search across Name, FirstName, LastName, ContactNumber, CompanyNumber, EmailAddress.",
        },
        summaryOnly: {
          type: "boolean",
          description: "Return a lightweight summary-only response when true.",
        },
        includeArchived: {
          type: "boolean",
          description: "Include archived contacts when true.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp (YYYY-MM-DDThh:mm:ss) to set as the If-Modified-Since header; returns only contacts created or modified since this timestamp.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_invoice",
    description: "Retrieve a specific invoice by ID from Xero. Returns full invoice details including line items and status.",
    toolSlug: "XERO_GET_INVOICE",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        unitdp: {
          type: "integer",
          description: "Number of decimal places for unit amounts (default 4).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. In multi-org setups, always pass explicitly to avoid querying the wrong organisation's data.",
        },
        invoice_id: {
          type: "string",
          description: "Xero Invoice ID to retrieve. Must be the internal UUID (e.g. `a1b2c3d4-...`), not the human-readable InvoiceNumber (e.g. `INV-0001`); obtain the UUID via XERO_LIST_INVOICES first.",
        },
      },
      required: [
        "invoice_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_item",
    description: "Retrieve a specific item by ID from Xero. Returns item code, name, pricing, and tax details.",
    toolSlug: "XERO_GET_ITEM",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        item_id: {
          type: "string",
          description: "Xero Item ID to retrieve.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
      },
      required: [
        "item_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_manual_journal",
    description: "Retrieve a specific manual journal by ID from Xero. Returns full details including journal lines.",
    toolSlug: "XERO_GET_MANUAL_JOURNAL",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        manual_journal_id: {
          type: "string",
          description: "Xero Manual Journal ID to retrieve.",
        },
      },
      required: [
        "manual_journal_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_organisation",
    description: "Retrieve organisation details from Xero. Returns company info, base currency, timezone, financial year settings, SalesTaxBasis, SalesTaxPeriod, etc. Response fields are nested under data.data.Organisations[0]. Use Timezone when computing date ranges to avoid boundary errors.",
    toolSlug: "XERO_GET_ORGANISATION",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. In multi-tenant setups, omitting this defaults to the first tenant which may be unintended; use XERO_GET_CONNECTIONS to confirm the correct tenant_id.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_profit_loss_report",
    description: "Retrieve Profit & Loss report from Xero. Shows income, expenses, and net profit for a specified period. Response rows are labeled (e.g., 'Net Profit', SummaryRow); parse by row label, not array index. Aggregates multiple tax codes — not suitable for tax compliance reporting.",
    toolSlug: "XERO_GET_PROFIT_LOSS_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        toDate: {
          type: "string",
          description: "End date for the report in YYYY-MM-DD format. Date range between fromDate and toDate must not exceed 365 days.",
        },
        periods: {
          type: "integer",
          description: "Number of periods to compare (e.g., for month-on-month comparison).",
        },
        fromDate: {
          type: "string",
          description: "Start date for the report in YYYY-MM-DD format. Date range between fromDate and toDate must not exceed 365 days.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        timeframe: {
          type: "string",
          description: "Timeframe period: MONTH, QUARTER, or YEAR.",
        },
        paymentsOnly: {
          type: "boolean",
          description: "Show only cash transactions when true (cash basis).",
        },
        standardLayout: {
          type: "boolean",
          description: "Use standard layout when true.",
        },
        trackingOptionID: {
          type: "string",
          description: "Filter by tracking option ID.",
        },
        trackingOptionID2: {
          type: "string",
          description: "Filter by second tracking option ID.",
        },
        trackingCategoryID: {
          type: "string",
          description: "Filter by tracking category ID.",
        },
        trackingCategoryID2: {
          type: "string",
          description: "Filter by second tracking category ID.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_project",
    description: "Retrieve a specific project by ID from Xero. Returns project details, deadlines, and status.",
    toolSlug: "XERO_GET_PROJECT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        project_id: {
          type: "string",
          description: "Xero Project ID to retrieve. Must be a valid GUID format (e.g., '550e8400-e29b-41d4-a716-446655440000'); job numbers or non-GUID strings will fail.",
        },
      },
      required: [
        "project_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_purchase_order",
    description: "Retrieve a specific purchase order by ID from Xero. Returns full details including line items and status.",
    toolSlug: "XERO_GET_PURCHASE_ORDER",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        purchase_order_id: {
          type: "string",
          description: "Xero Purchase Order ID to retrieve.",
        },
      },
      required: [
        "purchase_order_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_get_quotes",
    description: "Tool to retrieve a list of quotes. Use when you need to list, filter, or page through sales quotes. Use after obtaining the tenant ID via connections.",
    toolSlug: "XERO_GET_QUOTES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results (1-based).",
        },
        order: {
          type: "string",
          description: "Order by any element, e.g., ExpiryDate ASC.",
        },
        DateTo: {
          type: "string",
          description: "Filter for quotes on or before this date (YYYY-MM-DD).",
        },
        Status: {
          type: "string",
          description: "Filter for quotes of a particular status.",
        },
        DateFrom: {
          type: "string",
          description: "Filter for quotes on or after this date (YYYY-MM-DD).",
        },
        ContactID: {
          type: "string",
          description: "Filter for quotes belonging to a particular contact by ContactID.",
        },
        tenant_id: {
          type: "string",
          description: "Xero Tenant ID. Optional - will auto-fetch from connections if not provided.",
        },
        QuoteNumber: {
          type: "string",
          description: "Filter by quote number.",
        },
        ExpiryDateTo: {
          type: "string",
          description: "Filter for quotes expiring on or before this date (YYYY-MM-DD).",
        },
        ExpiryDateFrom: {
          type: "string",
          description: "Filter for quotes expiring on or after this date (YYYY-MM-DD).",
        },
        "If-Modified-Since": {
          type: "string",
          description: "Only return quotes modified after this UTC timestamp in RFC3339 format.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
      "quotes",
    ],
  }),
  composioTool({
    name: "xero_get_trial_balance_report",
    description: "Retrieve Trial Balance report from Xero. Shows all account balances (debits and credits) at a specific date. Use to verify that total debits equal total credits and to prepare financial statements. Credit balances appear as negative numbers in the response.",
    toolSlug: "XERO_GET_TRIAL_BALANCE_REPORT",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        date: {
          type: "string",
          description: "The date for the Trial Balance report in YYYY-MM-DD format (e.g., 2018-03-31). If not specified, defaults to current date.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. In multi-org connections, omitting this returns the first tenant's data silently — always pass explicitly when multiple orgs are connected.",
        },
        paymentsOnly: {
          type: "boolean",
          description: "Return cash only basis for the Trial Balance report when true (cash basis accounting).",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
      "financial_reports",
    ],
  }),
  composioTool({
    name: "xero_list_accounts",
    description: "Retrieve chart of accounts from Xero. Returns all accounting codes used for categorizing transactions. Use AccountID (not name or code) as the unique identifier for accounts. Results may be paginated; increment the page parameter until empty results are returned to avoid missing accounts in large organisations.",
    toolSlug: "XERO_LIST_ACCOUNTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        order: {
          type: "string",
          description: "Sort by field, e.g. Code ASC or Name DESC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"ACTIVE\" AND Type==\"EXPENSE\" Invalid syntax silently returns empty or misleading results rather than an explicit error. Status-based filters (e.g., Status==\"ACTIVE\") exclude archived accounts; omit to retrieve full historical chart.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. Always specify when multiple organisations exist — omitting it defaults to the first tenant and may return another entity's data.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_assets",
    description: "Retrieve fixed assets from Xero. Assets track depreciation and book value of capital equipment.",
    toolSlug: "XERO_LIST_ASSETS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results. Defaults to 1.",
        },
        status: {
          type: "string",
          description: "Required. Asset status filter. Valid values: DRAFT, REGISTERED, DISPOSED. Defaults to DRAFT.",
        },
        orderBy: {
          type: "string",
          description: "Sort field. Valid values: AssetType, AssetName, AssetNumber, PurchaseDate, PurchasePrice. For DISPOSED status, also allows: DisposalDate, DisposalPrice.",
        },
        filterBy: {
          type: "string",
          description: "Filter string to search assets. Matches against AssetName, AssetNumber, Description, and AssetTypeName fields.",
        },
        pageSize: {
          type: "integer",
          description: "Number of assets per page. Defaults to 10.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        sortDirection: {
          type: "string",
          description: "Sort direction. Valid values: asc, desc.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_attachments",
    description: "List all attachments for a specific entity in Xero (invoice, contact, etc.).",
    toolSlug: "XERO_LIST_ATTACHMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        entity_id: {
          type: "string",
          description: "ID of the entity to list attachments for.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        entity_type: {
          type: "string",
          description: "Entity type: Invoices, Contacts, BankTransactions, CreditNotes, PurchaseOrders, etc.",
        },
      },
      required: [
        "entity_type",
        "entity_id",
      ],
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_bank_transactions",
    description: "Retrieve bank transactions from Xero. Includes SPEND, RECEIVE, and transfer types; unfiltered results include DELETED transactions that skew totals. Dates returned in /Date(milliseconds_since_epoch)/ format. Rate limit: ~60 requests/minute per org; heavy pagination may trigger 429 errors.",
    toolSlug: "XERO_LIST_BANK_TRANSACTIONS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results. Returns max 100 items per page; no total count provided. Iterate by incrementing page until response returns zero results.",
        },
        order: {
          type: "string",
          description: "Sort by field, e.g. Date DESC or UpdatedDateUTC ASC. Default ordering is unreliable; always specify explicitly (e.g., Date DESC).",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"AUTHORISED\" AND Type==\"SPEND\" String values require double quotes; field names must be exact (e.g., BankAccount.AccountID, IsReconciled, Status, Type). Malformed expressions or wrong field names silently return empty results. Always filter by Status (e.g., Status==\"AUTHORISED\") to exclude DELETED transactions. Use IsReconciled boolean for reconciliation filtering, not Status alone.",
        },
        unitdp: {
          type: "integer",
          description: "Decimal places for unit amounts (default 4).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. In multi-org setups, always provide explicitly to avoid targeting the wrong organisation.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp to return only bank transactions modified since this date.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_credit_notes",
    description: "Retrieve list of credit notes from Xero. Credit notes are issued to reduce amounts owed by customers.",
    toolSlug: "XERO_LIST_CREDIT_NOTES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        order: {
          type: "string",
          description: "Sort by field, e.g. Date DESC or CreditNoteNumber ASC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"AUTHORISED\"",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp to return only credit notes modified since this date.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_files",
    description: "Retrieve files from Xero Files. Lists documents stored in Xero's file management system.",
    toolSlug: "XERO_LIST_FILES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        sort: {
          type: "string",
          description: "Sort field: Name, Size, CreatedDateUTC.",
        },
        folderId: {
          type: "string",
          description: "Filter files by folder ID.",
        },
        pagesize: {
          type: "integer",
          description: "Number of files per page (max 100).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_folders",
    description: "Retrieve folders from Xero Files. Lists document folders in Xero's file management system.",
    toolSlug: "XERO_LIST_FOLDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        sort: {
          type: "string",
          description: "Sort field: Name, CreatedDateUTC.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_invoices",
    description: "Retrieve a list of invoices from Xero. Results include both sales invoices (Type=ACCREC) and bills (Type=ACCPAY) by default; filter by Type in the `where` clause when only one is needed. Supports filtering by status, contact, date range, and pagination.",
    toolSlug: "XERO_LIST_INVOICES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results. Returns up to 100 invoices per page; increment page and check `pagination.pageCount` in the response to retrieve all records.",
        },
        order: {
          type: "string",
          description: "Sort by field, e.g. Date DESC or InvoiceNumber ASC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"AUTHORISED\" AND Total>100 Malformed expressions silently return empty results rather than an error.",
        },
        Statuses: {
          type: "string",
          description: "Comma-separated list of invoice statuses to filter by (e.g., DRAFT, SUBMITTED, AUTHORISED, PAID).",
        },
        tenantId: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. When multiple organisations are connected, always pass this explicitly to avoid querying the wrong organisation's data.",
        },
        ContactIDs: {
          type: "string",
          description: "Comma-separated list of Contact IDs to filter invoices by contact.",
        },
        InvoiceIDs: {
          type: "string",
          description: "Comma-separated list of Invoice IDs to filter by.",
        },
        createdByMyApp: {
          type: "boolean",
          description: "Filter to invoices created by your app when true.",
        },
        includeArchived: {
          type: "boolean",
          description: "Include archived invoices when true.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp to return only invoices modified since this date.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_items",
    description: "Retrieve items (inventory/products) from Xero. Items can be tracked for sales and/or purchases.",
    toolSlug: "XERO_LIST_ITEMS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        order: {
          type: "string",
          description: "Sort by field, e.g. Code ASC or Name DESC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. IsSold==true AND IsPurchased==true",
        },
        unitdp: {
          type: "integer",
          description: "Number of decimal places for unit amounts (default 4).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_journals",
    description: "Retrieve journals from Xero. Journals show the accounting entries for all transactions. Omitting filters returns the full historical journal ledger and can produce very large responses — use If-Modified-Since and/or paymentsOnly to narrow scope. No date range filter parameter exists. Results are returned inside a Journals array field.",
    toolSlug: "XERO_LIST_JOURNALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        offset: {
          type: "integer",
          description: "Offset for pagination. Increment by 100 (the page size) across successive calls to retrieve all journals. Deduplicate results by JournalNumber to avoid gaps or duplicates.",
        },
        tenantId: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        paymentsOnly: {
          type: "boolean",
          description: "Filter to payment journals only when true.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp to return only journals modified since this date.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_manual_journals",
    description: "Retrieve manual journals from Xero. Manual journals are used for period-end adjustments and corrections.",
    toolSlug: "XERO_LIST_MANUAL_JOURNALS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        order: {
          type: "string",
          description: "Sort by field, e.g. Date DESC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"POSTED\"",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp to return only manual journals modified since this date.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_payments",
    description: "Retrieve list of payments from Xero. Payments link invoices to bank transactions; invoices may have multiple partial/split payment records. Response Date fields use Xero's /Date(milliseconds)/ format requiring custom parsing.",
    toolSlug: "XERO_LIST_PAYMENTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results. Returns max 100 items per page; iterate incrementing page until response returns empty array. Xero enforces ~60 requests/minute per org (HTTP 429 if exceeded).",
        },
        order: {
          type: "string",
          description: "Sort by field, e.g. Date DESC or Amount ASC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"AUTHORISED\" Results include both ACCREC and ACCPAY types; filter by Type==\"ACCREC\" or Type==\"ACCPAY\" to isolate sales or bill payments. Avoid strict Reference matching as format variations may miss valid records.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. Wrong tenant_id silently returns empty results; verify with XERO_GET_CONNECTIONS before large pulls.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp to return only payments modified since this date.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_projects",
    description: "Retrieve projects from Xero. Projects track time and costs for client work.",
    toolSlug: "XERO_LIST_PROJECTS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        states: {
          type: "string",
          description: "Comma-separated project states: INPROGRESS, CLOSED.",
        },
        pageSize: {
          type: "integer",
          description: "Number of projects per page (1-500, default 50).",
        },
        contactID: {
          type: "string",
          description: "Filter projects by contact ID.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        projectIds: {
          type: "string",
          description: "Comma-separated list of project IDs to filter by.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_purchase_orders",
    description: "Retrieve list of purchase orders from Xero. Purchase orders track goods/services ordered from suppliers.",
    toolSlug: "XERO_LIST_PURCHASE_ORDERS",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        page: {
          type: "integer",
          description: "Page number for paginated results.",
        },
        order: {
          type: "string",
          description: "Sort by field, e.g. Date DESC or PurchaseOrderNumber ASC.",
        },
        DateTo: {
          type: "string",
          description: "Filter by date to (YYYY-MM-DD).",
        },
        Status: {
          type: "string",
          description: "Filter by status: DRAFT, SUBMITTED, AUTHORISED, BILLED, DELETED.",
        },
        DateFrom: {
          type: "string",
          description: "Filter by date from (YYYY-MM-DD).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        "If-Modified-Since": {
          type: "string",
          description: "UTC timestamp to return only purchase orders modified since this date.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_tax_rates",
    description: "Retrieve tax rates from Xero. Shows available tax codes and rates for the organization. Use returned tax codes as valid `TaxType` values in other tools — invalid values cause ValidationException errors.",
    toolSlug: "XERO_LIST_TAX_RATES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        order: {
          type: "string",
          description: "Sort by field, e.g. Name ASC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"ACTIVE\"",
        },
        TaxType: {
          type: "string",
          description: "Filter by specific tax type.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant. In multi-org connections, always specify to avoid retrieving tax config from the wrong organisation.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_list_tracking_categories",
    description: "Retrieve tracking categories from Xero. Tracking categories are used to segment data for reporting (e.g., departments, regions).",
    toolSlug: "XERO_LIST_TRACKING_CATEGORIES",
    mode: "read",
    risk: "safe",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        order: {
          type: "string",
          description: "Sort by field, e.g. Name ASC.",
        },
        where: {
          type: "string",
          description: "OData-style filter, e.g. Status==\"ACTIVE\"",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        includeArchived: {
          type: "boolean",
          description: "Include archived tracking categories when true.",
        },
      },
    },
    tags: [
      "composio",
      "xero",
      "read",
    ],
  }),
  composioTool({
    name: "xero_post_invoice_update",
    description: "Tool to update an existing invoice. Use when you need to modify the details of an invoice after it's been created.",
    toolSlug: "XERO_POST_INVOICE_UPDATE",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        unitdp: {
          type: "integer",
          description: "Number of decimal places for unit amounts.",
        },
        Invoices: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: true,
            properties: {
              Url: {
                type: "string",
                description: "Reference URL for the invoice.",
              },
              Date: {
                type: "string",
                description: "Issue date for the invoice (YYYY-MM-DD).",
              },
              Status: {
                type: "string",
                description: "New status for the invoice. Note: Invoices with status DELETED, VOIDED, or PAID cannot be modified and will return a validation error. Only invoices in DRAFT, SUBMITTED, or AUTHORISED status can be updated.",
                enum: [
                  "DRAFT",
                  "SUBMITTED",
                  "AUTHORISED",
                  "DELETED",
                  "VOIDED",
                ],
              },
              Contact: {
                type: "object",
                additionalProperties: true,
                properties: {
                  ContactID: {
                    type: "string",
                    description: "Xero identifier for the contact.",
                  },
                },
                description: "Contact reference for updating an invoice.",
              },
              DueDate: {
                type: "string",
                description: "Due date for the invoice (YYYY-MM-DD).",
              },
              LineItems: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: true,
                  properties: {
                    TaxType: {
                      type: "string",
                      description: "Tax type for the line item.",
                    },
                    Quantity: {
                      type: "number",
                      description: "Quantity of the line item.",
                    },
                    Tracking: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          Name: {
                            type: "string",
                            description: "Name of the tracking category.",
                          },
                          Option: {
                            type: "string",
                            description: "Tracking option name.",
                          },
                        },
                        description: "Tracking category update details.",
                      },
                      description: "Tracking categories for the line item.",
                    },
                    LineItemID: {
                      type: "string",
                      description: "Xero identifier for the line item. Include to update existing items.",
                    },
                    UnitAmount: {
                      type: "number",
                      description: "Unit amount for the line item.",
                    },
                    AccountCode: {
                      type: "string",
                      description: "Account code for the line item.",
                    },
                    Description: {
                      type: "string",
                      description: "Description of the line item.",
                    },
                    DiscountRate: {
                      type: "number",
                      description: "Discount rate (%) for the line item.",
                    },
                    DiscountAmount: {
                      type: "number",
                      description: "Discount amount for the line item.",
                    },
                  },
                  description: "Line item details for updating an invoice.",
                },
                description: "Line items for the invoice.",
              },
              CurrencyCode: {
                type: "string",
                description: "Currency code (3-letter).",
              },
              CurrencyRate: {
                type: "number",
                description: "Currency exchange rate.",
              },
              InvoiceNumber: {
                type: "string",
                description: "Invoice number identifier. Must be unique within the invoice type (ACCREC/ACCPAY). Attempting to change an invoice's number to one already in use will result in a 'Invoice # must be unique.' validation error from Xero.",
              },
              SentToContact: {
                type: "boolean",
                description: "Mark invoice as sent to contact.",
              },
              BrandingThemeID: {
                type: "string",
                description: "Branding theme identifier.",
              },
              LineAmountTypes: {
                type: "string",
                description: "Line amount calculation method.",
                enum: [
                  "Exclusive",
                  "Inclusive",
                  "NoTax",
                ],
              },
              PlannedPaymentDate: {
                type: "string",
                description: "Planned payment date (YYYY-MM-DD).",
              },
              ExpectedPaymentDate: {
                type: "string",
                description: "Expected payment date (YYYY-MM-DD).",
              },
            },
            description: "Invoice details for update operation.",
          },
          description: "List containing invoice update definitions (one item).",
        },
        InvoiceID: {
          type: "string",
          description: "Unique identifier (UUID) of the invoice.",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        InvoiceNumber: {
          type: "string",
          description: "Invoice number identifier.",
        },
      },
      required: [
        "Invoices",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Invoice.",
    ],
  }),
  composioTool({
    name: "xero_update_contact",
    description: "Update an existing contact in Xero. Only provided fields will be updated.",
    toolSlug: "XERO_UPDATE_CONTACT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        Name: {
          type: "string",
          description: "Full name of the contact or organization.",
        },
        LastName: {
          type: "string",
          description: "Last name of the contact person.",
        },
        ContactID: {
          type: "string",
          description: "Xero Contact ID to update.",
        },
        FirstName: {
          type: "string",
          description: "First name of the contact person.",
        },
        TaxNumber: {
          type: "string",
          description: "Tax number (VAT/ABN/GST number).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        EmailAddress: {
          type: "string",
          description: "Email address of the contact.",
        },
        phone_number: {
          type: "string",
          description: "Primary phone number (will update DEFAULT phone type).",
        },
        AccountNumber: {
          type: "string",
          description: "Account reference number for the contact.",
        },
        mobile_number: {
          type: "string",
          description: "Mobile phone number (will update MOBILE phone type).",
        },
        DefaultCurrency: {
          type: "string",
          description: "Default currency code (e.g., USD, EUR).",
        },
        BankAccountDetails: {
          type: "string",
          description: "Bank account details for the contact.",
        },
      },
      required: [
        "ContactID",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Update Contact.",
    ],
  }),
  composioTool({
    name: "xero_upload_attachment",
    description: "Upload a file attachment to a Xero entity (invoice, contact, etc.). Supports PDF, images, and documents.",
    toolSlug: "XERO_UPLOAD_ATTACHMENT",
    mode: "write",
    risk: "confirm",
    inputSchema: {
      type: "object",
      additionalProperties: true,
      properties: {
        filename: {
          type: "string",
          description: "Filename for the attachment as it will appear in Xero (e.g., 'invoice-receipt.pdf'). Must include the file extension.",
        },
        entity_id: {
          type: "string",
          description: "UUID of the entity to attach the file to (e.g., InvoiceID, ContactID, BankTransactionID).",
        },
        tenant_id: {
          type: "string",
          description: "Xero tenant/organization ID. If not provided, uses the first connected tenant.",
        },
        entity_type: {
          type: "string",
          description: "Entity type to attach to. Valid values: Invoices, Contacts, BankTransactions, CreditNotes, Accounts, ManualJournals, PurchaseOrders, Quotes, Receipts, RepeatingInvoices.",
        },
        file_to_upload: {
          type: "object",
          additionalProperties: true,
          properties: {
            name: {
              type: "string",
              description: "The filename that will be used when uploading the file to the destination service",
            },
            s3key: {
              type: "string",
              description: "The S3 key of a publicly accessible file, typically returned from a previous download action that stored the file in S3. This key references an existing file that can be uploaded to another service.",
            },
            mimetype: {
              type: "string",
              description: "The MIME type of the file",
            },
          },
          description: "File to upload as attachment.",
        },
        include_online: {
          type: "boolean",
          description: "Set to true to include the attachment when sending online invoices to customers. Only applicable when entity_type is 'Invoices'.",
        },
      },
      required: [
        "entity_type",
        "entity_id",
        "file_to_upload",
        "filename",
      ],
    },
    tags: [
      "composio",
      "xero",
      "write",
    ],
    askBefore: [
      "Confirm the parameters before executing Upload Attachment.",
    ],
  }),
];
