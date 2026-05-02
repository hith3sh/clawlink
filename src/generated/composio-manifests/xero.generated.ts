import type { IntegrationTool } from "../../../worker/integrations/base";

function composioTool(
  partial: Omit<IntegrationTool, "integration" | "inputSchema" | "accessLevel" | "tags" | "whenToUse" | "askBefore" | "safeDefaults" | "examples" | "followups" | "requiresScopes" | "idempotent" | "supportsBatch" | "supportsDryRun" | "execution"> & {
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
    inputSchema: { type: "object", properties: {} },
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
      version: "20260501_00",
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
