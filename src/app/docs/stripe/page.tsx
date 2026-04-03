# Stripe Integration

Learn how to connect Stripe to OpenClaw using ClawLink.

## Getting Your Stripe API Keys

### Step 1: Access Stripe Dashboard

1. Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Make sure you're viewing **Test mode** (toggle in top right)

### Step 2: Get Your Secret Key

1. Under **Standard keys**, find the **Secret key**
2. Click **Reveal test key**
3. **Copy the key** - it starts with `sk_test_`

### Step 3: (Optional) Get Publishable Key

For some features, you may also need the Publishable key:
- Found under **Standard keys** as well
- Starts with `pk_test_`

## What's the Difference?

| Key Type | Prefix | Use Case |
|----------|--------|----------|
| Secret Key | `sk_test_` | Server-side operations |
| Publishable Key | `pk_test_` | Client-side display |

For ClawLink, you'll primarily use the **Secret Key**.

## Connect to ClawLink

Run the setup:
```
npx clawlink@latest init
```

Enter your Stripe Secret Key when prompted.

## Test Mode vs Live Mode

⚠️ **Important**: The API key above is your **Test** key. It starts with `sk_test_`

- **Test keys** (`sk_test_`) - For development, no real money
- **Live keys** (`sk_live_`) - For production, real transactions

Switch to live mode in Stripe dashboard when ready for production!

## Available Operations

With Stripe integration, you can:
- List customers
- Create customers
- List payments
- Create invoices
- Manage subscriptions
- And more!