# Discord Integration

Learn how to connect Discord to OpenClaw using ClawLink.

## Getting Your Discord Bot Token

### Step 1: Create a Discord Application

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Click **New Application**
3. Name your app (e.g., "ClawLink")
4. Click **Create**

### Step 2: Create a Bot User

1. Click **Bot** in the left sidebar
2. Click **Add Bot**
3. Click **Yes, do it!**

### Step 3: Get Your Bot Token

1. Under the bot username, click **Reset Token**
2. Click **Yes, do it!**
3. **Copy the token** - this starts with `mfa.`

⚠️ Keep this token secret! Don't share it.

### Step 4: Configure Bot Permissions

1. Under **Bot Permissions**, select:
   - `Send Messages`
   - `Read Message History`
   - `Manage Webhooks` (optional)

2. Go to **URL Generator** in the left sidebar
3. Select these permissions:
   - `bot` permission
   - `Send Messages`
   - `Read Message History`
4. Copy the generated URL

### Step 5: Invite Bot to Your Server

1. Use the URL from Step 4
2. Select your Discord server
3. Click **Authorize**

## Connect to ClawLink

Run the setup:
```
npx clawlink@latest init
```

Enter your Discord Bot Token when prompted.

Your bot will automatically be added to servers where it's invited!