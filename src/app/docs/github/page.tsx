# GitHub Integration

Learn how to connect GitHub to OpenClaw using ClawLink.

## Getting Your GitHub Personal Access Token

### Step 1: Create a Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**

### Step 2: Configure Token Permissions

1. Give your token a name (e.g., "ClawLink")
2. Select these scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `read:user` - Read user profile data
   - ✅ `user:email` - Read user email addresses

Or for more limited access:
- `public_repo` - Only public repositories
- `repo:status` - Access commit statuses

### Step 3: Generate Token

1. Click **Generate token**
2. **Copy the token** immediately!

⚠️ This token will only be shown once - copy it now!

## Connect to ClawLink

Run the setup:
```
npx clawlink@latest init
```

Enter your GitHub Personal Access Token when prompted.

## What Can You Do?

With the GitHub integration, you can:
- Create/manage repositories
- Create/close issues
- Create/manage pull requests
- Read and write files
- Manage branches and tags

## Security Note

Only grant the permissions you need. If you only need to read public repos, use `public_repo` scope only.