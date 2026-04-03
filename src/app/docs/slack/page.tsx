/* eslint-disable */
'use client'

export default function SlackDoc() {
  return (
    <div className="prose max-w-none">
      <h1>Slack Integration</h1>
      
      <p>Learn how to connect Slack to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your Slack API Credentials</h2>
      
      <h3>Step 1: Create a Slack App</h3>
      <ol>
        <li>Go to <a href="https://api.slack.com/apps" target="_blank" rel="noopener">api.slack.com/apps</a></li>
        <li>Click <strong>Create New App</strong></li>
        <li>Choose "From scratch"</li>
        <li>Select your workspace</li>
        <li>Name your app (e.g., "ClawLink")</li>
      </ol>
      
      <h3>Step 2: Enable Bot Token Scopes</h3>
      <ol>
        <li>Go to <strong>OAuth & Permissions</strong></li>
        <li>Add these scopes:
          <ul>
            <li><code>chat:write</code></li>
            <li><code>channels:read</code></li>
            <li><code>channels:history</code></li>
            <li><code>groups:read</code></li>
            <li><code>users:read</code></li>
            <li><code>incoming-webhook</code> (optional)</li>
          </ul>
        </li>
      </ol>
      
      <h3>Step 3: Install App to Workspace</h3>
      <ol>
        <li>Scroll to the top of <strong>OAuth & Permissions</strong></li>
        <li>Click <strong>Install to Workspace</strong></li>
        <li>Review and allow permissions</li>
      </ol>
      
      <h3>Step 4: Get Your Bot Token</h3>
      <p>After installation, you'll see a <strong>Bot User OAuth Token</strong> starting with <code>xoxb-</code></p>
      <p>Copy this token - this is what you'll use with ClawLink!</p>
      
      <h2>Required Scopes</h2>
      <table>
        <thead>
          <tr><th>Scope</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td><code>chat:write</code></td><td>Send messages</td></tr>
          <tr><td><code>channels:read</code></td><td>List channels</td></tr>
          <tr><td><code>channels:history</code></td><td>Read channel messages</td></tr>
          <tr><td><code>users:read</code></td><td>List users</td></tr>
        </tbody>
      </table>
      
      <h2>Connect to ClawLink</h2>
      <p>Run the setup command and enter your Slack Bot Token:</p>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>That's it! You can now ask OpenClaw to send Slack messages!</p>
    </div>
  )
}