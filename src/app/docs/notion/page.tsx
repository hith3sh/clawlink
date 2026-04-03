# Notion Integration

Learn how to connect Notion to OpenClaw using ClawLink.

## Getting Your Notion API Key

### Step 1: Go to My Integrations

1. Visit [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**

### Step 2: Configure Your Integration

1. Name your integration (e.g., "ClawLink")
2. Choose a profile picture (optional)
3. Select capabilities:
   - Read content
   - Update content
   - Insert content
4. Click **Submit**

### Step 3: Get Your API Key

After creating the integration, you'll see:
- **Internal Integration Token** - copy this!

⚠️ **Important**: This token starts with `secret_`

### Step 4: Connect to Your Notion Pages

Your integration doesn't automatically have access to all pages. You need to share pages with it:

1. Open the Notion page you want to connect
2. Click the **•••** menu (top right)
3. Click **Connect to**
4. Select your ClawLink integration

Repeat for each page/database you want ClawLink to access.

## Required Capabilities

- ✅ Read content
- ✅ Update content (optional - for writing to Notion)
- ✅ Insert content (optional - for creating pages)

## Connect to ClawLink

Run the setup command:
```
npx clawlink@latest init
```

Enter your Notion Internal Integration Token when prompted.

You can now ask OpenClaw to read from and write to your Notion pages!