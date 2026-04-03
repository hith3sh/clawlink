'use client'

export default function GitHubDoc() {
  return (
    <div className="prose max-w-none">
      <h1>GitHub Integration</h1>
      
      <p>Learn how to connect GitHub to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your GitHub Personal Access Token</h2>
      
      <h3>Step 1: Create a Personal Access Token</h3>
      <ol>
        <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener">github.com/settings/tokens</a></li>
        <li>Click <strong>Generate new token (classic)</strong></li>
      </ol>
      
      <h3>Step 2: Configure Token Permissions</h3>
      <p>Give your token a name (e.g., "ClawLink") and select these scopes:</p>
      <ul>
        <li>✅ <code>repo</code> - Full control of private repositories</li>
        <li>✅ <code>read:user</code> - Read user profile data</li>
        <li>✅ <code>user:email</code> - Read user email addresses</li>
      </ul>
      
      <p>Or for more limited access:</p>
      <ul>
        <li><code>public_repo</code> - Only public repositories</li>
        <li><code>repo:status</code> - Access commit statuses</li>
      </ul>
      
      <h3>Step 3: Generate Token</h3>
      <ol>
        <li>Click <strong>Generate token</strong></li>
        <li><strong>Copy the token</strong> immediately!</li>
      </ol>
      <p>⚠️ This token will only be shown once - copy it now!</p>
      
      <h2>Connect to ClawLink</h2>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>Enter your GitHub Personal Access Token when prompted.</p>
      
      <h2>What Can You Do?</h2>
      <ul>
        <li>Create/manage repositories</li>
        <li>Create/close issues</li>
        <li>Create/manage pull requests</li>
        <li>Read and write files</li>
        <li>Manage branches and tags</li>
      </ul>
    </div>
  )
}