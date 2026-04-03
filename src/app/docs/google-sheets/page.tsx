# Google Sheets Integration

Learn how to connect Google Sheets to OpenClaw using ClawLink.

## Getting Your Google Cloud Credentials

### Step 1: Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Name your project (e.g., "ClawLink")

### Step 2: Enable Google Sheets API

1. Go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure consent screen:
   - User Type: **External**
   - Fill in required fields
4. Application type: **Desktop application**
5. Click **Create**
6. Download the JSON file

### Step 4: Get Refresh Token

The OAuth JSON contains:
- `client_id`
- `client_secret`

You'll need to run the OAuth flow once to get a **refresh_token**.

## Simplified: Use Service Account (Alternative)

For server-to-server access:

1. Go to **Credentials** → **Create Credentials** → **Service Account**
2. Name it "ClawLink"
3. Skip role selection, click **Done**
4. Click on your new service account
5. Go to **Keys** → **Add Key** → **Create new key**
6. Choose **JSON**
7. Download the file

Then share your Google Sheets with the service account email.

## Connect to ClawLink

Run the setup:
```
npx clawlink@latest init
```

Enter your credentials when prompted.

## Available Operations

With Google Sheets integration, you can:
- Read data from any spreadsheet
- Write data to cells
- Create new spreadsheets
- Manage sheets within workbooks
- Format cells (basic)