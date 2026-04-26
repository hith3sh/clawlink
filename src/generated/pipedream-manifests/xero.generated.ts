import type { PipedreamActionToolManifest } from "@/lib/pipedream/manifest-types";

export const XeroPipedreamToolManifests = [
  {
    "integration": "xero",
    "name": "xero_add_line_item_to_invoice",
    "description": "Adds line items to an existing sales invoice. [See the docs here](https://developer.xero.com/documentation/api/accounting/invoices#post-invoices)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "invoiceId": {
          "type": "string",
          "title": "Invoice ID",
          "description": "Unique identification of the invoice"
        },
        "lineItems": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Line Items",
          "description": "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `[{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }]`"
        }
      },
      "required": [
        "tenantId",
        "invoiceId",
        "lineItems"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-add-line-item-to-invoice",
      "version": "0.0.5",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceId",
          "type": "string",
          "label": "Invoice ID",
          "description": "Unique identification of the invoice",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lineItems",
          "type": "string[]",
          "label": "Line Items",
          "description": "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `[{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }]`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-add-line-item-to-invoice",
      "componentName": "Add Items to Existing Sales Invoice"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_bank_transaction",
    "description": "Create a new bank transaction [See the documentation](https://developer.xero.com/documentation/api/accounting/banktransactions#put-banktransactions)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "bankAccountCode": {
          "type": "string",
          "title": "Bank Account Code",
          "description": "The Account Code of the Bank Account of the transaction. If Code is not included then AccountID is required."
        },
        "bankAccountId": {
          "type": "string",
          "title": "Bank Account ID",
          "description": "The ID of the Bank Account transaction. If AccountID is not included then Code is required."
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "ID of the contact associated to the bank transaction."
        },
        "contactName": {
          "type": "string",
          "title": "Contact Name",
          "description": "Name of the contact associated to the bank transaction. If there is no contact matching this name, a new contact is created."
        },
        "type": {
          "type": "string",
          "title": "Type",
          "description": "See [Bank Transaction Types](https://developer.xero.com/documentation/api/types#BankTransactionTypes)"
        },
        "lineItems": {
          "type": "object",
          "title": "Line Items",
          "description": "See [LineItems](https://developer.xero.com/documentation/api/banktransactions#LineItemsPOST). The LineItems element can contain any number of individual LineItem sub-elements. At least **one** is required to create a bank transaction."
        },
        "isReconciled": {
          "type": "boolean",
          "title": "Is Reconciled",
          "description": "Boolean to show if transaction is reconciled. Conversion related apps can set the IsReconciled flag in scenarios when a matching bank statement line is not available. [Learn more](http://help.xero.com/#Q_BankRecNoImport)"
        },
        "date": {
          "type": "string",
          "title": "Date",
          "description": "Date of transaction - YYYY-MM-DD"
        },
        "reference": {
          "type": "string",
          "title": "Reference",
          "description": "Reference for the transaction. Only supported for SPEND and RECEIVE transactions."
        },
        "currencyCode": {
          "type": "string",
          "title": "Currency Code",
          "description": "The currency that bank transaction has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies)). Setting currency is only supported on overpayments."
        },
        "currencyRate": {
          "type": "string",
          "title": "Currency Rate",
          "description": "Exchange rate to base currency when money is spent or received. e.g. 0.7500 Only used for bank transactions in non base currency. If this isn't specified for non base currency accounts then either the user-defined rate (preference) or the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) will be used. Setting currency is only supported on overpayments."
        },
        "url": {
          "type": "string",
          "title": "URL",
          "description": "URL link to a source document - shown as \"Go to App Name\""
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "See [Bank Transaction Status Codes](https://developer.xero.com/documentation/api/types#BankTransactionStatuses)"
        },
        "lineAmountTypes": {
          "type": "string",
          "title": "Line Amount Types",
          "description": "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)"
        }
      },
      "required": [
        "tenantId",
        "type",
        "lineItems"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-bank-transaction",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "bankAccountCode",
          "type": "string",
          "label": "Bank Account Code",
          "description": "The Account Code of the Bank Account of the transaction. If Code is not included then AccountID is required.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "bankAccountId",
          "type": "string",
          "label": "Bank Account ID",
          "description": "The ID of the Bank Account transaction. If AccountID is not included then Code is required.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "ID of the contact associated to the bank transaction.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactName",
          "type": "string",
          "label": "Contact Name",
          "description": "Name of the contact associated to the bank transaction. If there is no contact matching this name, a new contact is created.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "type",
          "type": "string",
          "label": "Type",
          "description": "See [Bank Transaction Types](https://developer.xero.com/documentation/api/types#BankTransactionTypes)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "lineItems",
          "type": "object",
          "label": "Line Items",
          "description": "See [LineItems](https://developer.xero.com/documentation/api/banktransactions#LineItemsPOST). The LineItems element can contain any number of individual LineItem sub-elements. At least **one** is required to create a bank transaction.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isReconciled",
          "type": "boolean",
          "label": "Is Reconciled",
          "description": "Boolean to show if transaction is reconciled. Conversion related apps can set the IsReconciled flag in scenarios when a matching bank statement line is not available. [Learn more](http://help.xero.com/#Q_BankRecNoImport)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "date",
          "type": "string",
          "label": "Date",
          "description": "Date of transaction - YYYY-MM-DD",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "reference",
          "type": "string",
          "label": "Reference",
          "description": "Reference for the transaction. Only supported for SPEND and RECEIVE transactions.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyCode",
          "type": "string",
          "label": "Currency Code",
          "description": "The currency that bank transaction has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies)). Setting currency is only supported on overpayments.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyRate",
          "type": "string",
          "label": "Currency Rate",
          "description": "Exchange rate to base currency when money is spent or received. e.g. 0.7500 Only used for bank transactions in non base currency. If this isn't specified for non base currency accounts then either the user-defined rate (preference) or the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) will be used. Setting currency is only supported on overpayments.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "url",
          "type": "string",
          "label": "URL",
          "description": "URL link to a source document - shown as \"Go to App Name\"",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "See [Bank Transaction Status Codes](https://developer.xero.com/documentation/api/types#BankTransactionStatuses)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "lineAmountTypes",
          "type": "string",
          "label": "Line Amount Types",
          "description": "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-bank-transaction",
      "componentName": "Create Bank Transaction"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_bill",
    "description": "Creates a new bill (Accounts Payable)[See the docs here](https://developer.xero.com/documentation/api/accounting/invoices)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "invoiceNumber": {
          "type": "string",
          "title": "Invoice Number",
          "description": "Unique alpha numeric code identifying invoice"
        },
        "reference": {
          "type": "string",
          "title": "Reference",
          "description": "ACCREC only - additional reference number"
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "Unique identification of the contact"
        },
        "lineItems": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Line Items",
          "description": "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `[{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }]`"
        },
        "date": {
          "type": "string",
          "title": "Invoice Date",
          "description": "Date invoice was issued - YYYY-MM-DD"
        },
        "dueDate": {
          "type": "string",
          "title": "Invoice Due Date",
          "description": "Date invoice is due - YYYY-MM-DD"
        },
        "currencyCode": {
          "type": "string",
          "title": "The Invoice Currency",
          "description": "The currency that invoice has been raised in. Refer to [object documentation](https://www.xe.com/iso4217.php)"
        }
      },
      "required": [
        "tenantId",
        "contactId",
        "lineItems"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-bill",
      "version": "0.0.5",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceNumber",
          "type": "string",
          "label": "Invoice Number",
          "description": "Unique alpha numeric code identifying invoice",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "reference",
          "type": "string",
          "label": "Reference",
          "description": "ACCREC only - additional reference number",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "Unique identification of the contact",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lineItems",
          "type": "string[]",
          "label": "Line Items",
          "description": "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `[{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }]`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "date",
          "type": "string",
          "label": "Invoice Date",
          "description": "Date invoice was issued - YYYY-MM-DD",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDate",
          "type": "string",
          "label": "Invoice Due Date",
          "description": "Date invoice is due - YYYY-MM-DD",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyCode",
          "type": "string",
          "label": "The Invoice Currency",
          "description": "The currency that invoice has been raised in. Refer to [object documentation](https://www.xe.com/iso4217.php)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-bill",
      "componentName": "Create Bill"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_credit_note",
    "description": "Creates a new credit note.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "ID of the contact associated to the credit note"
        },
        "contactName": {
          "type": "string",
          "title": "Contact Name",
          "description": "Name of the contact associated to the credit note. If there is no contact matching this name, a new contact is created."
        },
        "contactNumber": {
          "type": "string",
          "title": "Contact Number",
          "description": "Number of the contact associated to the credit note. If there is no contact matching this name, a new contact is created."
        },
        "type": {
          "type": "string",
          "title": "Type",
          "description": "See [Credit Note Types](https://developer.xero.com/documentation/api/types#CreditNoteTypes)"
        },
        "date": {
          "type": "string",
          "title": "Date",
          "description": "The date the credit note is issued YYYY-MM-DD. If the Date element is not specified then it will default to the current date based on the timezone setting of the organisation"
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "See [Credit Note Status Codes](https://developer.xero.com/documentation/api/types#CreditNoteStatuses)"
        },
        "lineAmountTypes": {
          "type": "string",
          "title": "Line Amount Types",
          "description": "See [Invoice Line Amount Types](https://developer.xero.com/documentation/api/Types#LineAmountTypes)"
        },
        "lineItems": {
          "type": "object",
          "title": "Line Items",
          "description": "See [Invoice Line Items](https://developer.xero.com/documentation/api/Invoices#LineItems)"
        },
        "currencyCode": {
          "type": "string",
          "title": "Currency Code",
          "description": "Currency used for the Credit Note"
        },
        "creditNoteNumber": {
          "type": "string",
          "title": "Credit Note Number",
          "description": "[ACCRECCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - Unique alpha numeric code identifying credit note ( *when missing will auto-generate from your Organisation Invoice Settings*)\n[ACCPAYCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - non-unique alpha numeric code identifying credit note. This value will also display as Reference in the UI."
        },
        "reference": {
          "type": "string",
          "title": "Reference",
          "description": "ACCRECCREDIT only - additional reference number"
        },
        "sentToContact": {
          "type": "boolean",
          "title": "Sent to Contact",
          "description": "Boolean to indicate if a credit note has been sent to a contact via the Xero app (currently read only)"
        },
        "currencyRate": {
          "type": "string",
          "title": "Currency Rate",
          "description": "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used"
        },
        "brandingThemeId": {
          "type": "string",
          "title": "Branding Theme ID",
          "description": "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)"
        }
      },
      "required": [
        "tenantId",
        "type"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-credit-note",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "ID of the contact associated to the credit note",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactName",
          "type": "string",
          "label": "Contact Name",
          "description": "Name of the contact associated to the credit note. If there is no contact matching this name, a new contact is created.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactNumber",
          "type": "string",
          "label": "Contact Number",
          "description": "Number of the contact associated to the credit note. If there is no contact matching this name, a new contact is created.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "type",
          "type": "string",
          "label": "Type",
          "description": "See [Credit Note Types](https://developer.xero.com/documentation/api/types#CreditNoteTypes)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "date",
          "type": "string",
          "label": "Date",
          "description": "The date the credit note is issued YYYY-MM-DD. If the Date element is not specified then it will default to the current date based on the timezone setting of the organisation",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "See [Credit Note Status Codes](https://developer.xero.com/documentation/api/types#CreditNoteStatuses)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "lineAmountTypes",
          "type": "string",
          "label": "Line Amount Types",
          "description": "See [Invoice Line Amount Types](https://developer.xero.com/documentation/api/Types#LineAmountTypes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "lineItems",
          "type": "object",
          "label": "Line Items",
          "description": "See [Invoice Line Items](https://developer.xero.com/documentation/api/Invoices#LineItems)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyCode",
          "type": "string",
          "label": "Currency Code",
          "description": "Currency used for the Credit Note",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "creditNoteNumber",
          "type": "string",
          "label": "Credit Note Number",
          "description": "[ACCRECCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - Unique alpha numeric code identifying credit note ( *when missing will auto-generate from your Organisation Invoice Settings*)\n[ACCPAYCREDIT](https://developer.xero.com/documentation/api/types#CreditNoteTypes) - non-unique alpha numeric code identifying credit note. This value will also display as Reference in the UI.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "reference",
          "type": "string",
          "label": "Reference",
          "description": "ACCRECCREDIT only - additional reference number",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sentToContact",
          "type": "boolean",
          "label": "Sent to Contact",
          "description": "Boolean to indicate if a credit note has been sent to a contact via the Xero app (currently read only)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyRate",
          "type": "string",
          "label": "Currency Rate",
          "description": "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "brandingThemeId",
          "type": "string",
          "label": "Branding Theme ID",
          "description": "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-credit-note",
      "componentName": "Create Credit Note"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_employee",
    "description": "Creates a new employee.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "firstName": {
          "type": "string",
          "title": "First Name",
          "description": "First name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error."
        },
        "lastName": {
          "type": "string",
          "title": "Last Name",
          "description": "Last name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error."
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "Current status of an employee - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)"
        },
        "externalLink": {
          "type": "object",
          "title": "External Link",
          "description": "Link to an external resource, for example, an employee record in an external system. You can specify the URL element.\nThe description of the link is auto-generated in the form \"Go to <App name>\". <App name> refers to the [Xero application](https://api.xero.com/Application) name that is making the API call."
        }
      },
      "required": [
        "tenantId",
        "firstName",
        "lastName"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-xero-accounting-create-employee",
      "version": "0.3.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "firstName",
          "type": "string",
          "label": "First Name",
          "description": "First name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lastName",
          "type": "string",
          "label": "Last Name",
          "description": "Last name of an employee (max length = 255). If an existing employee matches your `FirstName` and `LastName` then you will receive an error.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "Current status of an employee - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "externalLink",
          "type": "object",
          "label": "External Link",
          "description": "Link to an external resource, for example, an employee record in an external system. You can specify the URL element.\nThe description of the link is auto-generated in the form \"Go to <App name>\". <App name> refers to the [Xero application](https://api.xero.com/Application) name that is making the API call.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-xero-accounting-create-employee",
      "componentName": "Create Employee"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_history_note",
    "description": "Creates a new note adding it to a document.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "endpoint": {
          "type": "string",
          "title": "Endpoint",
          "description": "The URL component, endpoint of the document type to add the history note. See [supported document types](https://developer.xero.com/documentation/api/history-and-notes#SupportedDocs)"
        },
        "guid": {
          "type": "string",
          "title": "GUID",
          "description": "Xero identifier of the document to add a history note to."
        },
        "details": {
          "type": "string",
          "title": "Details",
          "description": "The note to be recorded against a single document. Max Length 250 characters."
        }
      },
      "required": [
        "tenantId",
        "endpoint",
        "guid",
        "details"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-history-note",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "endpoint",
          "type": "string",
          "label": "Endpoint",
          "description": "The URL component, endpoint of the document type to add the history note. See [supported document types](https://developer.xero.com/documentation/api/history-and-notes#SupportedDocs)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "guid",
          "type": "string",
          "label": "GUID",
          "description": "Xero identifier of the document to add a history note to.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "details",
          "type": "string",
          "label": "Details",
          "description": "The note to be recorded against a single document. Max Length 250 characters.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-history-note",
      "componentName": "Create History Note"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_item",
    "description": "Creates a new item.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "code": {
          "type": "string",
          "title": "Code",
          "description": "User defined item code (max length = 30)"
        },
        "inventoryAssetAccountCode": {
          "type": "string",
          "title": "Inventory Asset Account Code",
          "description": "The inventory asset [account](https://developer.xero.com/documentation/api/accounts/) for the item. The account must be of type INVENTORY. The COGSAccountCode in PurchaseDetails is also required to create a tracked item"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the item (max length = 50)"
        },
        "isSold": {
          "type": "boolean",
          "title": "Is Sold",
          "description": "Boolean value, defaults to true. When IsSold is true the item will be available on sales transactions in the Xero UI. If IsSold is updated to false then Description and SalesDetails values will be nulled."
        },
        "isPurchased": {
          "type": "boolean",
          "title": "Is Purchased",
          "description": "Boolean value, defaults to true. When IsPurchased is true the item is available for purchase transactions in the Xero UI. If IsPurchased is updated to false then PurchaseDescription and PurchaseDetails values will be nulled."
        },
        "description": {
          "type": "string",
          "title": "Description",
          "description": "The sales description of the item (max length = 4000)"
        },
        "purchaseDescription": {
          "type": "string",
          "title": "Purchase Description",
          "description": "The purchase description of the item (max length = 4000)"
        },
        "purchaseDetails": {
          "type": "string",
          "title": "Purchase Details",
          "description": "See Purchases & Sales. The [PurchaseDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements."
        },
        "salesDetails": {
          "type": "string",
          "title": "Sales Details",
          "description": "See Purchases & Sales. The [SalesDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements."
        },
        "unitdp": {
          "type": "string",
          "title": "Unitdp",
          "description": "By default UnitPrice is returned to two decimal places."
        }
      },
      "required": [
        "tenantId",
        "code"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-item",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "code",
          "type": "string",
          "label": "Code",
          "description": "User defined item code (max length = 30)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "inventoryAssetAccountCode",
          "type": "string",
          "label": "Inventory Asset Account Code",
          "description": "The inventory asset [account](https://developer.xero.com/documentation/api/accounts/) for the item. The account must be of type INVENTORY. The COGSAccountCode in PurchaseDetails is also required to create a tracked item",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the item (max length = 50)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isSold",
          "type": "boolean",
          "label": "Is Sold",
          "description": "Boolean value, defaults to true. When IsSold is true the item will be available on sales transactions in the Xero UI. If IsSold is updated to false then Description and SalesDetails values will be nulled.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isPurchased",
          "type": "boolean",
          "label": "Is Purchased",
          "description": "Boolean value, defaults to true. When IsPurchased is true the item is available for purchase transactions in the Xero UI. If IsPurchased is updated to false then PurchaseDescription and PurchaseDetails values will be nulled.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "description",
          "type": "string",
          "label": "Description",
          "description": "The sales description of the item (max length = 4000)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "purchaseDescription",
          "type": "string",
          "label": "Purchase Description",
          "description": "The purchase description of the item (max length = 4000)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "purchaseDetails",
          "type": "string",
          "label": "Purchase Details",
          "description": "See Purchases & Sales. The [PurchaseDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "salesDetails",
          "type": "string",
          "label": "Sales Details",
          "description": "See Purchases & Sales. The [SalesDetails](https://developer.xero.com/documentation/api/items#PurchasesSales) element can contain a number of individual sub-elements.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "unitdp",
          "type": "string",
          "label": "Unitdp",
          "description": "By default UnitPrice is returned to two decimal places.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-item",
      "componentName": "Create Item"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_or_update_contact",
    "description": "Creates a new contact or updates if the contact exists.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "Full name of contact/organisation (max length = 255). The following is required to create a contact."
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "Unique identification of the contact"
        },
        "contactNumber": {
          "type": "string",
          "title": "Contact Number",
          "description": "This can be updated via the API only i.e. This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50). If the Contact Number is used, this is displayed as Contact Code in the Contacts UI in Xero."
        },
        "accountNumber": {
          "type": "string",
          "title": "Account Number",
          "description": "A user defined account number. This can be updated via the API and the [Xero UI](https://help.xero.com/ContactsAccountNumber) (max length = 50)."
        },
        "contactStatus": {
          "type": "string",
          "title": "Contact Status",
          "description": "Current status of a contact - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)"
        },
        "firstName": {
          "type": "string",
          "title": "First Name",
          "description": "First name of contact person (max length = 255)"
        },
        "lastName": {
          "type": "string",
          "title": "Last Name",
          "description": "Last name of contact person (max length = 255)"
        },
        "emailAddress": {
          "type": "string",
          "title": "Email Address",
          "description": "Email address of contact person (umlauts not supported) (max length = 255)"
        },
        "skypeUserName": {
          "type": "string",
          "title": "Skype User Name",
          "description": "Skype user name of contact"
        },
        "contactPersons": {
          "type": "object",
          "title": "Contact Persons",
          "description": "See [contact persons](https://developer.xero.com/documentation/api/contacts#contact-persons)"
        },
        "bankAccountDetails": {
          "type": "string",
          "title": "Bank Account Details",
          "description": "Bank account number of contact"
        },
        "taxNumber": {
          "type": "string",
          "title": "Tax Number",
          "description": "Tax number of contact - this is also known as the ABN (Australia), GST Number (New Zealand), VAT Number (UK) or Tax ID Number (US and global) in the Xero UI depending on which regionalized version of Xero you are using (max length = 50)"
        },
        "accountReceivableTaxType": {
          "type": "string",
          "title": "Account Receivable Tax Type",
          "description": "Default tax type used for contact on AP invoices"
        },
        "accountPayableType": {
          "type": "string",
          "title": "Account Payable Type",
          "description": "Store certain address types for a contact - see address types"
        },
        "addresses": {
          "type": "object",
          "title": "Addresses",
          "description": "Store certain address types for a contact - see address types"
        },
        "phones": {
          "type": "object",
          "title": "Phones",
          "description": "Store certain phone types for a contact - see phone types"
        },
        "isSupplier": {
          "type": "boolean",
          "title": "Is Supplier",
          "description": "true or false  Boolean that describes if a contact that has any AP invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts payable invoice is generated against this contact."
        },
        "isCustomer": {
          "type": "boolean",
          "title": "Is Customer",
          "description": "true or false  Boolean that describes if a contact has any AR invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts receivable invoice is generated against this contact."
        },
        "defaultCurrency": {
          "type": "string",
          "title": "Default Currency",
          "description": "Default currency for raising invoices against contact"
        },
        "xeroNetworkKey": {
          "type": "string",
          "title": "Xero Network Key",
          "description": "Store XeroNetworkKey for contacts"
        },
        "salesDefaultAccountCode": {
          "type": "string",
          "title": "Sales Default Account Code",
          "description": "The default sales [account code](https://developer.xero.com/documentation/api/accounts) for contacts"
        },
        "purchasesDefaultAccountCode": {
          "type": "string",
          "title": "Purchases Default Account Code",
          "description": "The default purchases [account code](https://developer.xero.com/documentation/api/accounts) for contacts"
        },
        "salesTrackingCategories": {
          "type": "string",
          "title": "Sales Tracking Categories",
          "description": "The default sales [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts"
        },
        "purchasesTrackingCategories": {
          "type": "string",
          "title": "Purchases Tracking Categories",
          "description": "The default purchases [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts"
        },
        "trackingCategoryName": {
          "type": "string",
          "title": "Tracking Category Name",
          "description": "The name of the Tracking Category assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories"
        },
        "trackingOptionName": {
          "type": "string",
          "title": "Tracking Option Name",
          "description": "The name of the Tracking Option assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories"
        },
        "paymentTermsBillDay": {
          "type": "number",
          "title": "Payment Terms Bill Day",
          "description": "The default payment terms bill day"
        },
        "paymentTermsBillType": {
          "type": "string",
          "title": "Payment Terms Bill Type",
          "description": "The default payment terms bill type",
          "enum": [
            "DAYSAFTERBILLDATE",
            "DAYSAFTERBILLMONTH",
            "OFCURRENTMONTH",
            "OFFOLLOWINGMONTH"
          ]
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-xero-accounting-create-or-update-contact",
      "version": "0.1.5",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "Full name of contact/organisation (max length = 255). The following is required to create a contact.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "Unique identification of the contact",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactNumber",
          "type": "string",
          "label": "Contact Number",
          "description": "This can be updated via the API only i.e. This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50). If the Contact Number is used, this is displayed as Contact Code in the Contacts UI in Xero.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountNumber",
          "type": "string",
          "label": "Account Number",
          "description": "A user defined account number. This can be updated via the API and the [Xero UI](https://help.xero.com/ContactsAccountNumber) (max length = 50).",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactStatus",
          "type": "string",
          "label": "Contact Status",
          "description": "Current status of a contact - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "firstName",
          "type": "string",
          "label": "First Name",
          "description": "First name of contact person (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lastName",
          "type": "string",
          "label": "Last Name",
          "description": "Last name of contact person (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "emailAddress",
          "type": "string",
          "label": "Email Address",
          "description": "Email address of contact person (umlauts not supported) (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "skypeUserName",
          "type": "string",
          "label": "Skype User Name",
          "description": "Skype user name of contact",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactPersons",
          "type": "any",
          "label": "Contact Persons",
          "description": "See [contact persons](https://developer.xero.com/documentation/api/contacts#contact-persons)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "bankAccountDetails",
          "type": "string",
          "label": "Bank Account Details",
          "description": "Bank account number of contact",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taxNumber",
          "type": "string",
          "label": "Tax Number",
          "description": "Tax number of contact - this is also known as the ABN (Australia), GST Number (New Zealand), VAT Number (UK) or Tax ID Number (US and global) in the Xero UI depending on which regionalized version of Xero you are using (max length = 50)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountReceivableTaxType",
          "type": "string",
          "label": "Account Receivable Tax Type",
          "description": "Default tax type used for contact on AP invoices",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountPayableType",
          "type": "string",
          "label": "Account Payable Type",
          "description": "Store certain address types for a contact - see address types",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "addresses",
          "type": "any",
          "label": "Addresses",
          "description": "Store certain address types for a contact - see address types",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "phones",
          "type": "any",
          "label": "Phones",
          "description": "Store certain phone types for a contact - see phone types",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isSupplier",
          "type": "boolean",
          "label": "Is Supplier",
          "description": "true or false  Boolean that describes if a contact that has any AP invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts payable invoice is generated against this contact.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isCustomer",
          "type": "boolean",
          "label": "Is Customer",
          "description": "true or false  Boolean that describes if a contact has any AR invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts receivable invoice is generated against this contact.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "defaultCurrency",
          "type": "string",
          "label": "Default Currency",
          "description": "Default currency for raising invoices against contact",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "xeroNetworkKey",
          "type": "string",
          "label": "Xero Network Key",
          "description": "Store XeroNetworkKey for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "salesDefaultAccountCode",
          "type": "string",
          "label": "Sales Default Account Code",
          "description": "The default sales [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "purchasesDefaultAccountCode",
          "type": "string",
          "label": "Purchases Default Account Code",
          "description": "The default purchases [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "salesTrackingCategories",
          "type": "string",
          "label": "Sales Tracking Categories",
          "description": "The default sales [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "purchasesTrackingCategories",
          "type": "string",
          "label": "Purchases Tracking Categories",
          "description": "The default purchases [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingCategoryName",
          "type": "string",
          "label": "Tracking Category Name",
          "description": "The name of the Tracking Category assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingOptionName",
          "type": "string",
          "label": "Tracking Option Name",
          "description": "The name of the Tracking Option assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "paymentTermsBillDay",
          "type": "integer",
          "label": "Payment Terms Bill Day",
          "description": "The default payment terms bill day",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "paymentTermsBillType",
          "type": "string",
          "label": "Payment Terms Bill Type",
          "description": "The default payment terms bill type",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "day(s) after bill date",
              "value": "DAYSAFTERBILLDATE"
            },
            {
              "label": "day(s) after bill month",
              "value": "DAYSAFTERBILLMONTH"
            },
            {
              "label": "of the current month",
              "value": "OFCURRENTMONTH"
            },
            {
              "label": "of the following month",
              "value": "OFFOLLOWINGMONTH"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-xero-accounting-create-or-update-contact",
      "componentName": "Create or Update Contact"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_payment",
    "description": "Creates a new payment",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "accountId": {
          "type": "string",
          "title": "Account ID",
          "description": "ID of account you are using to make the payment e.g. 294b1dc5-cc47-2afc-7ec8-64990b8761b8. This account needs to be either an account of type BANK or have enable payments to this accounts switched on (see [GET Accounts](https://developer.xero.com/documentation/api/Accounts)) . See the edit account screen of your Chart of Accounts in Xero if you wish to enable payments for an account other than a bank account"
        },
        "accountCode": {
          "type": "string",
          "title": "Account Code",
          "description": "Code of account you are using to make the payment e.g. 001 ( note: *not all accounts have a code value*)"
        },
        "invoiceId": {
          "type": "string",
          "title": "Invoice ID",
          "description": "ID of the invoice you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9"
        },
        "creditNoteId": {
          "type": "string",
          "title": "Credit Note ID",
          "description": "ID of the credit note you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9"
        },
        "prepaymentId": {
          "type": "string",
          "title": "Prepayment ID",
          "description": "ID of the prepayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9"
        },
        "overpaymentId": {
          "type": "string",
          "title": "Overpayment ID",
          "description": "ID of the overpayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9"
        },
        "invoiceNumber": {
          "type": "string",
          "title": "Invoice Number",
          "description": "Number of invoice you are applying payment to e.g. INV-4003"
        },
        "creditNoteNumber": {
          "type": "string",
          "title": "Credit Note Number",
          "description": "Number of credit note you are applying payment to e.g. INV-4003"
        },
        "date": {
          "type": "string",
          "title": "Date",
          "description": "Date the payment is being made (YYYY-MM-DD) e.g. 2009-09-06"
        },
        "currencyRate": {
          "type": "string",
          "title": "Currency Rate",
          "description": "Exchange rate when payment is received. Only used for non base currency invoices and credit notes e.g. 0.7500"
        },
        "amount": {
          "type": "string",
          "title": "Amount",
          "description": "The amount of the payment. Must be less than or equal to the outstanding amount owing on the invoice e.g. 200.00"
        },
        "reference": {
          "type": "string",
          "title": "Reference",
          "description": "An optional description for the payment e.g. Direct Debit"
        },
        "isReconciled": {
          "type": "boolean",
          "title": "Is Reconciled",
          "description": "A boolean indicating whether the payment has been reconciled."
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "The [status](https://developer.xero.com/documentation/api/types#PaymentStatusCodes) of the payment."
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-payment",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountId",
          "type": "string",
          "label": "Account ID",
          "description": "ID of account you are using to make the payment e.g. 294b1dc5-cc47-2afc-7ec8-64990b8761b8. This account needs to be either an account of type BANK or have enable payments to this accounts switched on (see [GET Accounts](https://developer.xero.com/documentation/api/Accounts)) . See the edit account screen of your Chart of Accounts in Xero if you wish to enable payments for an account other than a bank account",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountCode",
          "type": "string",
          "label": "Account Code",
          "description": "Code of account you are using to make the payment e.g. 001 ( note: *not all accounts have a code value*)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceId",
          "type": "string",
          "label": "Invoice ID",
          "description": "ID of the invoice you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "creditNoteId",
          "type": "string",
          "label": "Credit Note ID",
          "description": "ID of the credit note you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "prepaymentId",
          "type": "string",
          "label": "Prepayment ID",
          "description": "ID of the prepayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "overpaymentId",
          "type": "string",
          "label": "Overpayment ID",
          "description": "ID of the overpayment you are applying payment to e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceNumber",
          "type": "string",
          "label": "Invoice Number",
          "description": "Number of invoice you are applying payment to e.g. INV-4003",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "creditNoteNumber",
          "type": "string",
          "label": "Credit Note Number",
          "description": "Number of credit note you are applying payment to e.g. INV-4003",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "date",
          "type": "string",
          "label": "Date",
          "description": "Date the payment is being made (YYYY-MM-DD) e.g. 2009-09-06",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyRate",
          "type": "string",
          "label": "Currency Rate",
          "description": "Exchange rate when payment is received. Only used for non base currency invoices and credit notes e.g. 0.7500",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "amount",
          "type": "string",
          "label": "Amount",
          "description": "The amount of the payment. Must be less than or equal to the outstanding amount owing on the invoice e.g. 200.00",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "reference",
          "type": "string",
          "label": "Reference",
          "description": "An optional description for the payment e.g. Direct Debit",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isReconciled",
          "type": "boolean",
          "label": "Is Reconciled",
          "description": "A boolean indicating whether the payment has been reconciled.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "The [status](https://developer.xero.com/documentation/api/types#PaymentStatusCodes) of the payment.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-payment",
      "componentName": "Create Payment"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_purchase_bill",
    "description": "Creates a new purchase bill.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "ID of the contact associated to the invoice."
        },
        "contactName": {
          "type": "string",
          "title": "Contact Name",
          "description": "Name of the contact associated to the invoice. If there is no contact matching this name, a new contact is created."
        },
        "lineItems": {
          "type": "object",
          "title": "Line Items",
          "description": "See [LineItems](https://developer.xero.com/documentation/api/invoices#LineItemsPOST). The LineItems collection can contain any number of individual LineItem sub-elements. At least * **one** * is required to create a complete Invoice."
        },
        "date": {
          "type": "string",
          "title": "Date",
          "description": "Date invoice was issued - YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation."
        },
        "dueDate": {
          "type": "string",
          "title": "Due Date",
          "description": "Date invoice is due - YYYY-MM-DD."
        },
        "lineAmountType": {
          "type": "string",
          "title": "Line Amount Type",
          "description": "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)"
        },
        "purchaseBillNumber": {
          "type": "string",
          "title": "Purchase Bill Number",
          "description": "Non-unique alpha numeric code identifying purchase bill (printable ASCII characters only). This value will also display as Reference in the UI."
        },
        "reference": {
          "type": "string",
          "title": "Reference",
          "description": "Additional reference number (max length = 255)"
        },
        "brandingThemeId": {
          "type": "string",
          "title": "Branding Theme ID",
          "description": "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)"
        },
        "url": {
          "type": "string",
          "title": "URL",
          "description": "URL link to a source document - shown as \"Go to [appName]\" in the Xero app"
        },
        "currencyCode": {
          "type": "string",
          "title": "Currency Code",
          "description": "The currency that invoice has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies))"
        },
        "currencyRate": {
          "type": "string",
          "title": "Currency Rate",
          "description": "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used. (max length = [18].[6])"
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "See [Invoice Status Codes](https://developer.xero.com/documentation/api/invoices#status-codes)"
        },
        "sentToContact": {
          "type": "string",
          "title": "Sent to Contact",
          "description": "Boolean to set whether the invoice in the Xero app should be marked as \"sent\". This can be set only on invoices that have been approved"
        },
        "plannedPaymentDate": {
          "type": "string",
          "title": "Planned Payment Date",
          "description": "Shown on purchase bills (Accounts Payable) when this has been set"
        }
      },
      "required": [
        "tenantId",
        "lineItems"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-xero-create-purchase-bill",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "ID of the contact associated to the invoice.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactName",
          "type": "string",
          "label": "Contact Name",
          "description": "Name of the contact associated to the invoice. If there is no contact matching this name, a new contact is created.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lineItems",
          "type": "any",
          "label": "Line Items",
          "description": "See [LineItems](https://developer.xero.com/documentation/api/invoices#LineItemsPOST). The LineItems collection can contain any number of individual LineItem sub-elements. At least * **one** * is required to create a complete Invoice.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "date",
          "type": "string",
          "label": "Date",
          "description": "Date invoice was issued - YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDate",
          "type": "string",
          "label": "Due Date",
          "description": "Date invoice is due - YYYY-MM-DD.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lineAmountType",
          "type": "string",
          "label": "Line Amount Type",
          "description": "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "purchaseBillNumber",
          "type": "string",
          "label": "Purchase Bill Number",
          "description": "Non-unique alpha numeric code identifying purchase bill (printable ASCII characters only). This value will also display as Reference in the UI.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "reference",
          "type": "string",
          "label": "Reference",
          "description": "Additional reference number (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "brandingThemeId",
          "type": "string",
          "label": "Branding Theme ID",
          "description": "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "url",
          "type": "string",
          "label": "URL",
          "description": "URL link to a source document - shown as \"Go to [appName]\" in the Xero app",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyCode",
          "type": "string",
          "label": "Currency Code",
          "description": "The currency that invoice has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies))",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyRate",
          "type": "string",
          "label": "Currency Rate",
          "description": "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used. (max length = [18].[6])",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "See [Invoice Status Codes](https://developer.xero.com/documentation/api/invoices#status-codes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sentToContact",
          "type": "string",
          "label": "Sent to Contact",
          "description": "Boolean to set whether the invoice in the Xero app should be marked as \"sent\". This can be set only on invoices that have been approved",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "plannedPaymentDate",
          "type": "string",
          "label": "Planned Payment Date",
          "description": "Shown on purchase bills (Accounts Payable) when this has been set",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-xero-create-purchase-bill",
      "componentName": "Create Purchase Bill"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_sales_invoice",
    "description": "Creates a new sales invoice. [See the documentation](https://developer.xero.com/documentation/api/invoices#post)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "ID of the contact associated to the invoice."
        },
        "contactName": {
          "type": "string",
          "title": "Contact Name",
          "description": "Name of the contact associated to the invoice. If there is no contact matching this name, a new contact is created."
        },
        "lineItems": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Line Items",
          "description": "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `[{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }]`"
        },
        "date": {
          "type": "string",
          "title": "Date",
          "description": "Date invoice was issued - YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation."
        },
        "dueDate": {
          "type": "string",
          "title": "Due Date",
          "description": "Date invoice is due - YYYY-MM-DD."
        },
        "lineAmountType": {
          "type": "string",
          "title": "Line Amount Type",
          "description": "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)"
        },
        "invoiceNumber": {
          "type": "string",
          "title": "Invoice Number",
          "description": "Unique alpha numeric code identifying invoice (* when missing will auto-generate from your Organisation Invoice Settings*) (max length = 255)"
        },
        "reference": {
          "type": "string",
          "title": "Reference",
          "description": "Additional reference number (max length = 255)"
        },
        "brandingThemeId": {
          "type": "string",
          "title": "Branding Theme ID",
          "description": "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)"
        },
        "url": {
          "type": "string",
          "title": "URL",
          "description": "URL link to a source document - shown as \"Go to [appName]\" in the Xero app"
        },
        "currencyCode": {
          "type": "string",
          "title": "Currency Code",
          "description": "The currency that invoice has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies))"
        },
        "currencyRate": {
          "type": "string",
          "title": "Currency Rate",
          "description": "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used. (max length = [18].[6])"
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "See [Invoice Status Codes](https://developer.xero.com/documentation/api/invoices#status-codes)"
        },
        "sentToContact": {
          "type": "string",
          "title": "Sent To Contact",
          "description": "Boolean to set whether the invoice in the Xero app should be marked as \"sent\". This can be set only on invoices that have been approved"
        },
        "expectedPaymentData": {
          "type": "string",
          "title": "Expected Payment Date",
          "description": "Shown on the sales invoices when this has been set"
        }
      },
      "required": [
        "tenantId",
        "lineItems"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-xero-create-sales-invoice",
      "version": "0.3.5",
      "authPropNames": [
        "xero"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xero",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "ID of the contact associated to the invoice.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactName",
          "type": "string",
          "label": "Contact Name",
          "description": "Name of the contact associated to the invoice. If there is no contact matching this name, a new contact is created.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lineItems",
          "type": "string[]",
          "label": "Line Items",
          "description": "The LineItems collection can contain any number of individual LineItem sub-elements. At least one is required to create a complete Invoice. [Refer to Tax Type](https://developer.xero.com/documentation/api/accounting/types#report-tax-types), [Refer to Line Items](https://developer.xero.com/documentation/api/accounting/invoices#creating-updating-and-deleting-line-items-when-updating-invoices)\n\n**Example:** `[{\"Description\":\"Football\", \"Quantity\":\"20\", \"UnitAmount\":\"50000\", \"TaxType\":\"OUTPUT\" }]`",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "date",
          "type": "string",
          "label": "Date",
          "description": "Date invoice was issued - YYYY-MM-DD. If the Date element is not specified it will default to the current date based on the timezone setting of the organisation.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "dueDate",
          "type": "string",
          "label": "Due Date",
          "description": "Date invoice is due - YYYY-MM-DD.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lineAmountType",
          "type": "string",
          "label": "Line Amount Type",
          "description": "Line amounts are exclusive of tax by default if you don't specify this element. See [Line Amount Types](https://developer.xero.com/documentation/api/types#LineAmountTypes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceNumber",
          "type": "string",
          "label": "Invoice Number",
          "description": "Unique alpha numeric code identifying invoice (* when missing will auto-generate from your Organisation Invoice Settings*) (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "reference",
          "type": "string",
          "label": "Reference",
          "description": "Additional reference number (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "brandingThemeId",
          "type": "string",
          "label": "Branding Theme ID",
          "description": "See [BrandingThemes](https://developer.xero.com/documentation/api/branding-themes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "url",
          "type": "string",
          "label": "URL",
          "description": "URL link to a source document - shown as \"Go to [appName]\" in the Xero app",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyCode",
          "type": "string",
          "label": "Currency Code",
          "description": "The currency that invoice has been raised in (see [Currencies](https://developer.xero.com/documentation/api/currencies))",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "currencyRate",
          "type": "string",
          "label": "Currency Rate",
          "description": "The currency rate for a multicurrency invoice. If no rate is specified, the [XE.com day rate](http://help.xero.com/#CurrencySettings$Rates) is used. (max length = [18].[6])",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "See [Invoice Status Codes](https://developer.xero.com/documentation/api/invoices#status-codes)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "sentToContact",
          "type": "string",
          "label": "Sent To Contact",
          "description": "Boolean to set whether the invoice in the Xero app should be marked as \"sent\". This can be set only on invoices that have been approved",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "expectedPaymentData",
          "type": "string",
          "label": "Expected Payment Date",
          "description": "Shown on the sales invoices when this has been set",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-xero-create-sales-invoice",
      "componentName": "Create Sales Invoice"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_tracking_category",
    "description": "Create a new tracking category [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#put-trackingcategories).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the tracking category"
        },
        "options": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Options",
          "description": "Options for the tracking category"
        }
      },
      "required": [
        "tenantId",
        "name"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-tracking-category",
      "version": "0.0.3",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the tracking category",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "options",
          "type": "string[]",
          "label": "Options",
          "description": "Options for the tracking category",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-tracking-category",
      "componentName": "Create tracking category"
    }
  },
  {
    "integration": "xero",
    "name": "xero_create_update_contact",
    "description": "Creates a new contact or updates a contact if a contact already exists. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "contactID": {
          "type": "string",
          "title": "Contact ID",
          "description": "ID of the contact that requires update."
        },
        "name": {
          "type": "string",
          "title": "Contact name",
          "description": "Full name of contact/organization."
        },
        "firstName": {
          "type": "string",
          "title": "First name",
          "description": "First name of contact person ."
        },
        "lastName": {
          "type": "string",
          "title": "Last name",
          "description": "Last name of contact person."
        },
        "emailAddress": {
          "type": "string",
          "title": "Email address",
          "description": "Email address of contact person."
        },
        "accountNumber": {
          "type": "string",
          "title": "Account number",
          "description": "User defined account number.."
        },
        "contactStatus": {
          "type": "string",
          "title": "Contact status",
          "description": "See https://developer.xero.com/documentation/api/accounting/types#contacts"
        }
      },
      "required": [
        "tenantId",
        "contactStatus"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-create-update-contact",
      "version": "0.1.2",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactID",
          "type": "string",
          "label": "Contact ID",
          "description": "ID of the contact that requires update.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Contact name",
          "description": "Full name of contact/organization.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "firstName",
          "type": "string",
          "label": "First name",
          "description": "First name of contact person .",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lastName",
          "type": "string",
          "label": "Last name",
          "description": "Last name of contact person.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "emailAddress",
          "type": "string",
          "label": "Email address",
          "description": "Email address of contact person.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountNumber",
          "type": "string",
          "label": "Account number",
          "description": "User defined account number..",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactStatus",
          "type": "string",
          "label": "Contact status",
          "description": "See https://developer.xero.com/documentation/api/accounting/types#contacts",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-create-update-contact",
      "componentName": "Create or update contact "
    }
  },
  {
    "integration": "xero",
    "name": "xero_delete_tracking_category",
    "description": "Delete a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#delete-trackingcategories).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "trackingCategoryId": {
          "type": "string",
          "title": "Tracking Category ID",
          "description": "Unique identification of the tracking category"
        }
      },
      "required": [
        "tenantId",
        "trackingCategoryId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-delete-tracking-category",
      "version": "0.0.3",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingCategoryId",
          "type": "string",
          "label": "Tracking Category ID",
          "description": "Unique identification of the tracking category",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-delete-tracking-category",
      "componentName": "Delete tracking category"
    }
  },
  {
    "integration": "xero",
    "name": "xero_delete_tracking_category_option",
    "description": "Delete a tracking category option by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#delete-trackingcategories).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "trackingCategoryId": {
          "type": "string",
          "title": "Tracking Category ID",
          "description": "Unique identification of the tracking category"
        },
        "trackingOptionId": {
          "type": "string",
          "title": "Tracking Option ID",
          "description": "Unique identification of the tracking option"
        }
      },
      "required": [
        "tenantId",
        "trackingCategoryId",
        "trackingOptionId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-delete-tracking-category-option",
      "version": "0.0.3",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingCategoryId",
          "type": "string",
          "label": "Tracking Category ID",
          "description": "Unique identification of the tracking category",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingOptionId",
          "type": "string",
          "label": "Tracking Option ID",
          "description": "Unique identification of the tracking option",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-delete-tracking-category-option",
      "componentName": "Delete tracking category option"
    }
  },
  {
    "integration": "xero",
    "name": "xero_email_an_invoice",
    "description": "Triggers the email of a sales invoice out of Xero.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "invoiceId": {
          "type": "string",
          "title": "Invoice ID",
          "description": "Xero generated unique identifier for the invoice to send by email out of Xero. The invoice must be of Type ACCREC and a valid Status for sending (SUMBITTED,AUTHORISED or PAID)."
        }
      },
      "required": [
        "tenantId",
        "invoiceId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-email-an-invoice",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceId",
          "type": "string",
          "label": "Invoice ID",
          "description": "Xero generated unique identifier for the invoice to send by email out of Xero. The invoice must be of Type ACCREC and a valid Status for sending (SUMBITTED,AUTHORISED or PAID).",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-email-an-invoice",
      "componentName": "Email an Invoice"
    }
  },
  {
    "integration": "xero",
    "name": "xero_find_invoice",
    "description": "Finds an invoice by number or reference.[See the docs here](https://developer.xero.com/documentation/api/accounting/invoices/#get-invoices)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "invoiceNumber": {
          "type": "string",
          "title": "Invoice number",
          "description": "Unique alpha numeric code identifying invoice"
        },
        "reference": {
          "type": "string",
          "title": "Reference",
          "description": "ACCREC only - additional reference number"
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-find-invoice",
      "version": "0.0.5",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceNumber",
          "type": "string",
          "label": "Invoice number",
          "description": "Unique alpha numeric code identifying invoice",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "reference",
          "type": "string",
          "label": "Reference",
          "description": "ACCREC only - additional reference number",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-find-invoice",
      "componentName": "Find Invoice"
    }
  },
  {
    "integration": "xero",
    "name": "xero_find_or_create_contact",
    "description": "Finds a contact by name or email address. Optionally, create one if none are found. [See the docs here](https://developer.xero.com/documentation/api/accounting/contacts/#get-contacts)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "name": {
          "type": "string",
          "title": "Contact name",
          "description": "Full name of contact/organization "
        },
        "emailAddress": {
          "type": "string",
          "title": "Email address",
          "description": "Email address of contact/organization."
        },
        "createContactIfNotFound": {
          "type": "string",
          "title": "Create a new contact if not found",
          "description": "Create a new contact if not found?."
        }
      },
      "required": [
        "tenantId",
        "createContactIfNotFound"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-find-or-create-contact",
      "version": "0.1.2",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [
        "createContactIfNotFound"
      ],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Contact name",
          "description": "Full name of contact/organization ",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "emailAddress",
          "type": "string",
          "label": "Email address",
          "description": "Email address of contact/organization.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "createContactIfNotFound",
          "type": "string",
          "label": "Create a new contact if not found",
          "description": "Create a new contact if not found?.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": true,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-find-or-create-contact",
      "componentName": "Find or Create Contact"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_bank_statements_report",
    "description": "Gets bank statements for the specified bank account.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "bankAccountId": {
          "type": "string",
          "title": "Bank Account ID",
          "description": "Xero identifier of the bank account to get bank statements of"
        },
        "fromDate": {
          "type": "string",
          "title": "From Date",
          "description": "Get the bank statements of the specified bank account from this date"
        },
        "toDate": {
          "type": "string",
          "title": "To Date",
          "description": "Get the bank statements of the specified bank account to this date"
        }
      },
      "required": [
        "tenantId",
        "bankAccountId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-bank-statements-report",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "bankAccountId",
          "type": "string",
          "label": "Bank Account ID",
          "description": "Xero identifier of the bank account to get bank statements of",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "fromDate",
          "type": "string",
          "label": "From Date",
          "description": "Get the bank statements of the specified bank account from this date",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "toDate",
          "type": "string",
          "label": "To Date",
          "description": "Get the bank statements of the specified bank account to this date",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-bank-statements-report",
      "componentName": "Bank Statements Report"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_bank_summary",
    "description": "Gets the balances and cash movements for each bank account.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "bankAccountId": {
          "type": "string",
          "title": "Bank Account ID",
          "description": "Id of the bank account to get the summary for."
        },
        "fromDate": {
          "type": "string",
          "title": "From Date",
          "description": "Get the balances and cash movements for the specified bank account from this date"
        },
        "toDate": {
          "type": "string",
          "title": "To Date",
          "description": "Get the balances and cash movements for the specified bank account to this date"
        }
      },
      "required": [
        "tenantId",
        "bankAccountId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-bank-summary",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "bankAccountId",
          "type": "string",
          "label": "Bank Account ID",
          "description": "Id of the bank account to get the summary for.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "fromDate",
          "type": "string",
          "label": "From Date",
          "description": "Get the balances and cash movements for the specified bank account from this date",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "toDate",
          "type": "string",
          "label": "To Date",
          "description": "Get the balances and cash movements for the specified bank account to this date",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-bank-summary",
      "componentName": "Get Bank Summary"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_contact",
    "description": "Gets details of a contact.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "contactIdentifier": {
          "type": "string",
          "title": "Contact Identifier",
          "description": "Xero identifier of the contact to get. Possible values: \n* **ContactID** - The Xero identifier for a contact e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **ContactNumber** -  A custom identifier specified from another system e.g. a CRM system has a contact number of CUST100"
        }
      },
      "required": [
        "tenantId",
        "contactIdentifier"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-contact",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactIdentifier",
          "type": "string",
          "label": "Contact Identifier",
          "description": "Xero identifier of the contact to get. Possible values: \n* **ContactID** - The Xero identifier for a contact e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **ContactNumber** -  A custom identifier specified from another system e.g. a CRM system has a contact number of CUST100",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-contact",
      "componentName": "Get Contact"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_history_of_changes",
    "description": "Gets the history of changes to a single existing document.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "endpoint": {
          "type": "string",
          "title": "Endpoint",
          "description": "The URL component, endpoint of the document type to get history changes. See [supported document types](https://developer.xero.com/documentation/api/history-and-notes#SupportedDocs)"
        },
        "guid": {
          "type": "string",
          "title": "GUID",
          "description": "Xero identifier of the document to get history changes of."
        }
      },
      "required": [
        "tenantId",
        "endpoint",
        "guid"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-history-of-changes",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "endpoint",
          "type": "string",
          "label": "Endpoint",
          "description": "The URL component, endpoint of the document type to get history changes. See [supported document types](https://developer.xero.com/documentation/api/history-and-notes#SupportedDocs)",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "guid",
          "type": "string",
          "label": "GUID",
          "description": "Xero identifier of the document to get history changes of.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-history-of-changes",
      "componentName": "Get History of Changes"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_invoice",
    "description": "Gets details of an invoice.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "invoiceId": {
          "type": "string",
          "title": "Invoice ID",
          "description": "The ID of the invoice to get."
        }
      },
      "required": [
        "tenantId",
        "invoiceId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-invoice",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceId",
          "type": "string",
          "label": "Invoice ID",
          "description": "The ID of the invoice to get.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-invoice",
      "componentName": "Get Invoice"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_invoice_online_url",
    "description": "Retrieves the online sales invoice URL.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "invoiceId": {
          "type": "string",
          "title": "Invoice ID",
          "description": "Xero generated unique identifier for the invoice to retrieve its online url."
        }
      },
      "required": [
        "tenantId",
        "invoiceId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-invoice-online-url",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceId",
          "type": "string",
          "label": "Invoice ID",
          "description": "Xero generated unique identifier for the invoice to retrieve its online url.",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-invoice-online-url",
      "componentName": "Get Sales Invoice Online URL"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_item",
    "description": "Gets details of an item.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "itemId": {
          "type": "string",
          "title": "Item ID",
          "description": "Possible values:\n* **ItemID** - The Xero identifier for an Item e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **Code**- The user defined code of an item e.g. ITEM-001"
        }
      },
      "required": [
        "tenantId",
        "itemId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-item",
      "version": "0.2.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "itemId",
          "type": "string",
          "label": "Item ID",
          "description": "Possible values:\n* **ItemID** - The Xero identifier for an Item e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **Code**- The user defined code of an item e.g. ITEM-001",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-item",
      "componentName": "Get Item"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_tenant_connections",
    "description": "Gets the tenants connections the user is authorized to access",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "required": []
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-tenant-connections",
      "version": "0.1.4",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-tenant-connections",
      "componentName": "Get Tenant Connections"
    }
  },
  {
    "integration": "xero",
    "name": "xero_get_tracking_category",
    "description": "Get information from a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#get-trackingcategories).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "trackingCategoryId": {
          "type": "string",
          "title": "Tracking Category ID",
          "description": "Unique identification of the tracking category"
        }
      },
      "required": [
        "tenantId",
        "trackingCategoryId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-get-tracking-category",
      "version": "0.0.3",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingCategoryId",
          "type": "string",
          "label": "Tracking Category ID",
          "description": "Unique identification of the tracking category",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-get-tracking-category",
      "componentName": "Get tracking category"
    }
  },
  {
    "integration": "xero",
    "name": "xero_list_contacts",
    "description": "Lists information from contacts in the given tenant id as per filter parameters.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "modifiedAfter": {
          "type": "string",
          "title": "Modified After",
          "description": "Filter by a date. Only contacts modified since this date will be returned. Format: YYYY-MM-DD"
        },
        "ids": {
          "type": "string",
          "title": "IDs",
          "description": "Filter by a comma-separated list of ContactIDs. Allows you to retrieve a specific set of contacts in a single call. See [details.](https://developer.xero.com/documentation/api/contacts#optimised-queryparameters)"
        },
        "where": {
          "type": "string",
          "title": "Where",
          "description": "Filter using the where parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/contacts#optimised-parameters) only."
        },
        "order": {
          "type": "string",
          "title": "Order",
          "description": "Order by any element returned ([*see Order By.*](https://developer.xero.com/documentation/api/requests-and-responses#ordering))"
        },
        "page": {
          "type": "string",
          "title": "Page",
          "description": "Up to 100 contacts will be returned per call when the page parameter is used e.g. page=1."
        },
        "includeArchived": {
          "type": "boolean",
          "title": "Include Archived",
          "description": "e.g. includeArchived=true - Contacts with a status of ARCHIVED will be included in the response."
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-list-contacts",
      "version": "0.2.2",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "modifiedAfter",
          "type": "string",
          "label": "Modified After",
          "description": "Filter by a date. Only contacts modified since this date will be returned. Format: YYYY-MM-DD",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "ids",
          "type": "string",
          "label": "IDs",
          "description": "Filter by a comma-separated list of ContactIDs. Allows you to retrieve a specific set of contacts in a single call. See [details.](https://developer.xero.com/documentation/api/contacts#optimised-queryparameters)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "where",
          "type": "string",
          "label": "Where",
          "description": "Filter using the where parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/contacts#optimised-parameters) only.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "order",
          "type": "string",
          "label": "Order",
          "description": "Order by any element returned ([*see Order By.*](https://developer.xero.com/documentation/api/requests-and-responses#ordering))",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "Up to 100 contacts will be returned per call when the page parameter is used e.g. page=1.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "includeArchived",
          "type": "boolean",
          "label": "Include Archived",
          "description": "e.g. includeArchived=true - Contacts with a status of ARCHIVED will be included in the response.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-list-contacts",
      "componentName": "List Contacts"
    }
  },
  {
    "integration": "xero",
    "name": "xero_list_credit_notes",
    "description": "Lists information from credit notes in the given tenant id as per filter parameters.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "modifiedAfter": {
          "type": "string",
          "title": "Modified After",
          "description": "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only credit notes or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00"
        },
        "where": {
          "type": "string",
          "title": "Where",
          "description": "Filter by an any element ( see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified) )"
        },
        "order": {
          "type": "string",
          "title": "Order",
          "description": "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) )"
        },
        "page": {
          "type": "string",
          "title": "Page",
          "description": "Up to 100 credit notes will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1"
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-list-credit-notes",
      "version": "0.2.2",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "modifiedAfter",
          "type": "string",
          "label": "Modified After",
          "description": "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only credit notes or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "where",
          "type": "string",
          "label": "Where",
          "description": "Filter by an any element ( see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified) )",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "order",
          "type": "string",
          "label": "Order",
          "description": "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) )",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "Up to 100 credit notes will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-list-credit-notes",
      "componentName": "List Credit Notes"
    }
  },
  {
    "integration": "xero",
    "name": "xero_list_invoices",
    "description": "Lists information from invoices in the given tenant id as per filter parameters.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "modifiedAfter": {
          "type": "string",
          "title": "Modified After",
          "description": "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only invoices created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00"
        },
        "ids": {
          "type": "string",
          "title": "IDs",
          "description": "Filter by a comma-separated list of InvoicesIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters)."
        },
        "invoiceNumbers": {
          "type": "string",
          "title": "Invoice Numbers",
          "description": "Filter by a comma-separated list of InvoiceNumbers. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters)."
        },
        "contactIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "title": "Contact IDs",
          "description": "Filter by an array of ContactIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters)."
        },
        "statuses": {
          "type": "string",
          "title": "Statuses",
          "description": "Filter by a comma-separated list of Statuses. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters)."
        },
        "where": {
          "type": "string",
          "title": "Where",
          "description": "Filter using the *where* parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/invoices#optimised-parameters) only."
        },
        "createdByMyApp": {
          "type": "boolean",
          "title": "Created By My App",
          "description": "When set to true you'll only retrieve Invoices created by your app."
        },
        "order": {
          "type": "string",
          "title": "Order",
          "description": "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) )."
        },
        "page": {
          "type": "string",
          "title": "Page",
          "description": "Up to 100 invoices will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1"
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-list-invoices",
      "version": "0.3.2",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "modifiedAfter",
          "type": "string",
          "label": "Modified After",
          "description": "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only invoices created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "ids",
          "type": "string",
          "label": "IDs",
          "description": "Filter by a comma-separated list of InvoicesIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "invoiceNumbers",
          "type": "string",
          "label": "Invoice Numbers",
          "description": "Filter by a comma-separated list of InvoiceNumbers. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactIds",
          "type": "string[]",
          "label": "Contact IDs",
          "description": "Filter by an array of ContactIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "statuses",
          "type": "string",
          "label": "Statuses",
          "description": "Filter by a comma-separated list of Statuses. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "where",
          "type": "string",
          "label": "Where",
          "description": "Filter using the *where* parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/invoices#optimised-parameters) only.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "createdByMyApp",
          "type": "boolean",
          "label": "Created By My App",
          "description": "When set to true you'll only retrieve Invoices created by your app.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "order",
          "type": "string",
          "label": "Order",
          "description": "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) ).",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "Up to 100 invoices will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-list-invoices",
      "componentName": "List Invoices"
    }
  },
  {
    "integration": "xero",
    "name": "xero_list_manual_journals",
    "description": "Lists information from manual journals in the given tenant id as per filter parameters.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "modifiedAfter": {
          "type": "string",
          "title": "Modified After",
          "description": "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'**. A UTC timestamp (yyyy-mm-ddThh:mm:ss) . Only manual journals created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00"
        },
        "where": {
          "type": "string",
          "title": "Where",
          "description": "Filter by an any element (*see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified)*)"
        },
        "order": {
          "type": "string",
          "title": "Order",
          "description": "Order by any element returned (*see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering)*)"
        },
        "page": {
          "type": "string",
          "title": "Page",
          "description": "Up to 100 manual journals will be returned per call, with journal lines shown for each, when the page parameter is used e.g. page=1"
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-list-manual-journals",
      "version": "0.2.2",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "modifiedAfter",
          "type": "string",
          "label": "Modified After",
          "description": "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'**. A UTC timestamp (yyyy-mm-ddThh:mm:ss) . Only manual journals created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "where",
          "type": "string",
          "label": "Where",
          "description": "Filter by an any element (*see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified)*)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "order",
          "type": "string",
          "label": "Order",
          "description": "Order by any element returned (*see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering)*)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "page",
          "type": "string",
          "label": "Page",
          "description": "Up to 100 manual journals will be returned per call, with journal lines shown for each, when the page parameter is used e.g. page=1",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-list-manual-journals",
      "componentName": "List Manual Journals"
    }
  },
  {
    "integration": "xero",
    "name": "xero_list_tracking_categories",
    "description": "Lists information from tracking categories [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        }
      },
      "required": [
        "tenantId"
      ]
    },
    "accessLevel": "read",
    "mode": "read",
    "risk": "safe",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": true,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-list-tracking-categories",
      "version": "0.0.3",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-list-tracking-categories",
      "componentName": "List tracking categories"
    }
  },
  {
    "integration": "xero",
    "name": "xero_update_contact",
    "description": "Updates a contact given its identifier.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "contactId": {
          "type": "string",
          "title": "Contact ID",
          "description": "Contact identifier of the contact to update"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "Full name of contact/organisation (max length = 255). The following is required to create a contact."
        },
        "contactNumber": {
          "type": "string",
          "title": "Contact Number",
          "description": "This can be updated via the API only i.e. This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50). If the Contact Number is used, this is displayed as Contact Code in the Contacts UI in Xero."
        },
        "accountNumber": {
          "type": "string",
          "title": "Account Number",
          "description": "A user defined account number. This can be updated via the API and the [Xero UI](https://help.xero.com/ContactsAccountNumber) (max length = 50)."
        },
        "contactStatus": {
          "type": "string",
          "title": "Contact Status",
          "description": "Current status of a contact - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)"
        },
        "firstName": {
          "type": "string",
          "title": "First Name",
          "description": "First name of contact person (max length = 255)"
        },
        "lastName": {
          "type": "string",
          "title": "Last Name",
          "description": "Last name of contact person (max length = 255)"
        },
        "emailAddress": {
          "type": "string",
          "title": "Email Address",
          "description": "Email address of contact person (umlauts not supported) (max length = 255)"
        },
        "skypeUserName": {
          "type": "string",
          "title": "Skype User Name",
          "description": "Skype user name of contact"
        },
        "contactPersons": {
          "type": "object",
          "title": "Contact Persons",
          "description": "See [contact persons](https://developer.xero.com/documentation/api/contacts#contact-persons)"
        },
        "bankAccountDetails": {
          "type": "string",
          "title": "Bank Account Details",
          "description": "Bank account number of contact"
        },
        "taxNumber": {
          "type": "string",
          "title": "Tax Number",
          "description": "Tax number of contact - this is also known as the ABN (Australia), GST Number (New Zealand), VAT Number (UK) or Tax ID Number (US and global) in the Xero UI depending on which regionalized version of Xero you are using (max length = 50)"
        },
        "accountReceivableTaxType": {
          "type": "string",
          "title": "Account Receivable Tax Type",
          "description": "Default tax type used for contact on AP invoices"
        },
        "accountPayableType": {
          "type": "string",
          "title": "Account Payable Type",
          "description": "Store certain address types for a contact - see address types"
        },
        "addresses": {
          "type": "object",
          "title": "Addresses",
          "description": "Store certain address types for a contact - see address types"
        },
        "phones": {
          "type": "object",
          "title": "Phones",
          "description": "Store certain phone types for a contact - see phone types"
        },
        "isSupplier": {
          "type": "boolean",
          "title": "Is Supplier",
          "description": "true or false  Boolean that describes if a contact that has any AP invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts payable invoice is generated against this contact."
        },
        "isCustomer": {
          "type": "boolean",
          "title": "Is Customer",
          "description": "true or false  Boolean that describes if a contact has any AR invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts receivable invoice is generated against this contact."
        },
        "defaultCurrency": {
          "type": "string",
          "title": "Default Currency",
          "description": "Default currency for raising invoices against contact"
        },
        "xeroNetworkKey": {
          "type": "string",
          "title": "Xero Network Key",
          "description": "Store XeroNetworkKey for contacts"
        },
        "salesDefaultAccountCode": {
          "type": "string",
          "title": "Sales Default Account Code",
          "description": "The default sales [account code](https://developer.xero.com/documentation/api/accounts) for contacts"
        },
        "purchasesDefaultAccountCode": {
          "type": "string",
          "title": "Purchases Default Account Code",
          "description": "The default purchases [account code](https://developer.xero.com/documentation/api/accounts) for contacts"
        },
        "salesTrackingCategories": {
          "type": "string",
          "title": "Sales Tracking Categories",
          "description": "The default sales [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts"
        },
        "purchasesTrackingCategories": {
          "type": "string",
          "title": "Purchases Tracking Categories",
          "description": "The default purchases [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts"
        },
        "trackingCategoryName": {
          "type": "string",
          "title": "Tracking Category Name",
          "description": "The name of the Tracking Category assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories"
        },
        "trackingOptionName": {
          "type": "string",
          "title": "Tracking Option Name",
          "description": "The name of the Tracking Option assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories"
        },
        "paymentTermsBillDay": {
          "type": "number",
          "title": "Payment Terms Bill Day",
          "description": "The default payment terms bill day"
        },
        "paymentTermsBillType": {
          "type": "string",
          "title": "Payment Terms Bill Type",
          "description": "The default payment terms bill type",
          "enum": [
            "DAYSAFTERBILLDATE",
            "DAYSAFTERBILLMONTH",
            "OFCURRENTMONTH",
            "OFFOLLOWINGMONTH"
          ]
        }
      },
      "required": [
        "tenantId",
        "contactId"
      ]
    },
    "accessLevel": "write",
    "mode": "write",
    "risk": "confirm",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-xero-accounting-update-contact",
      "version": "0.1.5",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactId",
          "type": "string",
          "label": "Contact ID",
          "description": "Contact identifier of the contact to update",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "Full name of contact/organisation (max length = 255). The following is required to create a contact.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactNumber",
          "type": "string",
          "label": "Contact Number",
          "description": "This can be updated via the API only i.e. This field is read only on the Xero contact screen, used to identify contacts in external systems (max length = 50). If the Contact Number is used, this is displayed as Contact Code in the Contacts UI in Xero.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountNumber",
          "type": "string",
          "label": "Account Number",
          "description": "A user defined account number. This can be updated via the API and the [Xero UI](https://help.xero.com/ContactsAccountNumber) (max length = 50).",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactStatus",
          "type": "string",
          "label": "Contact Status",
          "description": "Current status of a contact - see contact status [types](https://developer.xero.com/documentation/api/types#ContactStatuses)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        },
        {
          "name": "firstName",
          "type": "string",
          "label": "First Name",
          "description": "First name of contact person (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "lastName",
          "type": "string",
          "label": "Last Name",
          "description": "Last name of contact person (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "emailAddress",
          "type": "string",
          "label": "Email Address",
          "description": "Email address of contact person (umlauts not supported) (max length = 255)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "skypeUserName",
          "type": "string",
          "label": "Skype User Name",
          "description": "Skype user name of contact",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "contactPersons",
          "type": "any",
          "label": "Contact Persons",
          "description": "See [contact persons](https://developer.xero.com/documentation/api/contacts#contact-persons)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "bankAccountDetails",
          "type": "string",
          "label": "Bank Account Details",
          "description": "Bank account number of contact",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "taxNumber",
          "type": "string",
          "label": "Tax Number",
          "description": "Tax number of contact - this is also known as the ABN (Australia), GST Number (New Zealand), VAT Number (UK) or Tax ID Number (US and global) in the Xero UI depending on which regionalized version of Xero you are using (max length = 50)",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountReceivableTaxType",
          "type": "string",
          "label": "Account Receivable Tax Type",
          "description": "Default tax type used for contact on AP invoices",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "accountPayableType",
          "type": "string",
          "label": "Account Payable Type",
          "description": "Store certain address types for a contact - see address types",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "addresses",
          "type": "any",
          "label": "Addresses",
          "description": "Store certain address types for a contact - see address types",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "phones",
          "type": "any",
          "label": "Phones",
          "description": "Store certain phone types for a contact - see phone types",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isSupplier",
          "type": "boolean",
          "label": "Is Supplier",
          "description": "true or false  Boolean that describes if a contact that has any AP invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts payable invoice is generated against this contact.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "isCustomer",
          "type": "boolean",
          "label": "Is Customer",
          "description": "true or false  Boolean that describes if a contact has any AR invoices entered against them. Cannot be set via PUT or POST - it is automatically set when an accounts receivable invoice is generated against this contact.",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "defaultCurrency",
          "type": "string",
          "label": "Default Currency",
          "description": "Default currency for raising invoices against contact",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "xeroNetworkKey",
          "type": "string",
          "label": "Xero Network Key",
          "description": "Store XeroNetworkKey for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "salesDefaultAccountCode",
          "type": "string",
          "label": "Sales Default Account Code",
          "description": "The default sales [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "purchasesDefaultAccountCode",
          "type": "string",
          "label": "Purchases Default Account Code",
          "description": "The default purchases [account code](https://developer.xero.com/documentation/api/accounts) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "salesTrackingCategories",
          "type": "string",
          "label": "Sales Tracking Categories",
          "description": "The default sales [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "purchasesTrackingCategories",
          "type": "string",
          "label": "Purchases Tracking Categories",
          "description": "The default purchases [tracking categories](https://developer.xero.com/documentation/api/tracking-categories/) for contacts",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingCategoryName",
          "type": "string",
          "label": "Tracking Category Name",
          "description": "The name of the Tracking Category assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingOptionName",
          "type": "string",
          "label": "Tracking Option Name",
          "description": "The name of the Tracking Option assigned to the contact under SalesTrackingCategories and PurchasesTrackingCategories",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "paymentTermsBillDay",
          "type": "integer",
          "label": "Payment Terms Bill Day",
          "description": "The default payment terms bill day",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "paymentTermsBillType",
          "type": "string",
          "label": "Payment Terms Bill Type",
          "description": "The default payment terms bill type",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": [
            {
              "label": "day(s) after bill date",
              "value": "DAYSAFTERBILLDATE"
            },
            {
              "label": "day(s) after bill month",
              "value": "DAYSAFTERBILLMONTH"
            },
            {
              "label": "of the current month",
              "value": "OFCURRENTMONTH"
            },
            {
              "label": "of the following month",
              "value": "OFFOLLOWINGMONTH"
            }
          ]
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-xero-accounting-update-contact",
      "componentName": "Update Contact"
    }
  },
  {
    "integration": "xero",
    "name": "xero_update_tracking_category",
    "description": "Update a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#post-trackingcategories).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "trackingCategoryId": {
          "type": "string",
          "title": "Tracking Category ID",
          "description": "Unique identification of the tracking category"
        },
        "name": {
          "type": "string",
          "title": "Name",
          "description": "The name of the tracking category"
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "The status of the tracking category"
        }
      },
      "required": [
        "tenantId",
        "trackingCategoryId"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-update-tracking-category",
      "version": "0.0.3",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingCategoryId",
          "type": "string",
          "label": "Tracking Category ID",
          "description": "Unique identification of the tracking category",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "name",
          "type": "string",
          "label": "Name",
          "description": "The name of the tracking category",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "The status of the tracking category",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-update-tracking-category",
      "componentName": "Update tracking category"
    }
  },
  {
    "integration": "xero",
    "name": "xero_update_tracking_category_option",
    "description": "Update a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#post-trackingcategories).",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "title": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID"
        },
        "trackingCategoryId": {
          "type": "string",
          "title": "Tracking Category ID",
          "description": "Unique identification of the tracking category"
        },
        "trackingOptionId": {
          "type": "string",
          "title": "Tracking Option ID",
          "description": "Unique identification of the tracking option"
        },
        "optionName": {
          "type": "string",
          "title": "Option name",
          "description": "The name of the tracking category option"
        },
        "status": {
          "type": "string",
          "title": "Status",
          "description": "The status of the tracking category option"
        }
      },
      "required": [
        "tenantId",
        "trackingCategoryId",
        "trackingOptionId",
        "optionName"
      ]
    },
    "accessLevel": "destructive",
    "mode": "destructive",
    "risk": "high_impact",
    "tags": [
      "xero",
      "pipedream"
    ],
    "whenToUse": [],
    "askBefore": [],
    "safeDefaults": {},
    "examples": [],
    "followups": [],
    "requiresScopes": [],
    "idempotent": false,
    "supportsDryRun": false,
    "supportsBatch": false,
    "execution": {
      "kind": "pipedream_action",
      "app": "xero_accounting_api",
      "componentId": "xero_accounting_api-update-tracking-category-option",
      "version": "0.0.3",
      "authPropNames": [
        "xeroAccountingApi"
      ],
      "dynamicPropNames": [],
      "props": [
        {
          "name": "xeroAccountingApi",
          "type": "app",
          "label": "Account",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": true
        },
        {
          "name": "tenantId",
          "type": "string",
          "label": "Tenant ID",
          "description": "Select an organization tenant to use, or provide a tenant ID",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingCategoryId",
          "type": "string",
          "label": "Tracking Category ID",
          "description": "Unique identification of the tracking category",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "trackingOptionId",
          "type": "string",
          "label": "Tracking Option ID",
          "description": "Unique identification of the tracking option",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "optionName",
          "type": "string",
          "label": "Option name",
          "description": "The name of the tracking category option",
          "required": true,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false
        },
        {
          "name": "status",
          "type": "string",
          "label": "Status",
          "description": "The status of the tracking category option",
          "required": false,
          "hidden": false,
          "disabled": false,
          "readOnly": false,
          "remoteOptions": false,
          "useQuery": false,
          "reloadProps": false,
          "withLabel": false,
          "appAuth": false,
          "options": []
        }
      ]
    },
    "source": {
      "app": "xero_accounting_api",
      "componentKey": "xero_accounting_api-update-tracking-category-option",
      "componentName": "Update tracking category option"
    }
  }
] satisfies PipedreamActionToolManifest[];
