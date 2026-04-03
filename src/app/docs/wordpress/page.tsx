/* eslint-disable */
'use client'

export default function WordPressDoc() {
  return (
    <div className="prose max-w-none">
      <h1>WordPress Integration</h1>
      
      <p>Learn how to connect WordPress to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your WordPress Credentials</h2>
      <p>You have two options depending on your WordPress setup:</p>
      
      <h3>Option A: WordPress.com (Hosted)</h3>
      <ol>
        <li>Go to your WordPress.com <strong>Settings</strong> → <strong>Integrations</strong></li>
        <li>Find <strong>Manage</strong> next to your plan</li>
        <li>Scroll to <strong>Application Passwords</strong></li>
        <li>Click <strong>Add New Application Password</strong></li>
        <li>Name it "ClawLink"</li>
        <li>Copy the generated password</li>
      </ol>
      <p>You'll need:</p>
      <ul>
        <li>WordPress.com username</li>
        <li>Application Password</li>
      </ul>
      
      <h3>Option B: Self-Hosted WordPress</h3>
      <ol>
        <li>Go to your WordPress admin dashboard</li>
        <li>Navigate to <strong>Users</strong> → <strong>Profile</strong></li>
        <li>Scroll to <strong>Application Passwords</strong></li>
        <li>Under "New Application Password Name", type "ClawLink"</li>
        <li>Click <strong>Add New</strong></li>
        <li>Copy the generated password</li>
      </ol>
      <p>You'll need:</p>
      <ul>
        <li>Your WordPress site URL</li>
        <li>Username</li>
        <li>Application Password</li>
      </ul>
      
      <h2>Connect to ClawLink</h2>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>Enter your WordPress site URL, username, and Application Password.</p>
    </div>
  )
}