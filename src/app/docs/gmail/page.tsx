# Gmail Integration

Learn how to connect Gmail to OpenClaw using ClawLink.

## Getting Your Gmail API Credentials

### Step 1: Go to Google Cloud Console

1. Visit [console.cloud.google.com](https://console.cloud.google.com)
2. Select or create a new project

### Step 2: Enable the Gmail API

1. Go to **APIs & Services** → **Library**
2. Search for "Gmail API"
3. Click **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Configure the OAuth consent screen:
   - User Type: **External**
   - Fill in required fields (app name, email)
4. Application type: **Desktop application**
5. Click **Create**
6. Download the JSON file

### Step 4: Get Your Access Token

The OAuth JSON contains:
- `client_id`
- `client_secret`
- `refresh_token` (you'll get this after the first auth flow)

For ClawLink, you'll need to run the OAuth flow once to get a refresh token, then use:
- Client ID
- Client Secret  
- Refresh Token

## Required Scopes

Make sure your OAuth app requests these scopes:
- `https://www.googleapis.com/auth/gmail.readonly`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/gmail.modify`

## Connect to ClawLink

Once you have your credentials, run:
```
npx clawlink@latest init
```

Enter your Gmail API credentials when prompted. That's it!