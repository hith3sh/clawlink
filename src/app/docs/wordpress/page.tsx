# WordPress Integration

Learn how to connect WordPress to OpenClaw using ClawLink.

## Getting Your WordPress Credentials

You have two options depending on your WordPress setup:

### Option A: WordPress.com (Hosted)

If you use WordPress.com:

1. Go to your WordPress.com **Settings** → **Integrations**
2. Find **Manage** next to your plan
3. Scroll to **Application Passwords**
4. Click **Add New Application Password**
5. Name it "ClawLink"
6. Copy the generated password

You'll need:
- WordPress.com username
- Application Password

### Option B: Self-Hosted WordPress

For self-hosted WordPress (wordpress.org):

1. Go to your WordPress admin dashboard
2. Navigate to **Users** → **Profile**
3. Scroll to **Application Passwords**
4. Under "New Application Password Name", type "ClawLink"
5. Click **Add New**
6. Copy the generated password

You'll need:
- Your WordPress site URL
- Username
- Application Password

## Required Permissions

Make sure your user account has:
- Editor or Administrator role
- XML-RPC enabled on your site

## Connect to ClawLink

Run the setup:
```
npx clawlink@latest init
```

Enter:
1. Your WordPress site URL (e.g., `https://myblog.com`)
2. Username
3. Application Password

That's it! You can now create posts, pages, and manage your WordPress site through OpenClaw!