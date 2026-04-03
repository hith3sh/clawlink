'use client'

export default function DiscordDoc() {
  return (
    <div className="prose max-w-none">
      <h1>Discord Integration</h1>
      
      <p>Learn how to connect Discord to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your Discord Bot Token</h2>
      
      <h3>Step 1: Create a Discord Application</h3>
      <ol>
        <li>Go to <a href="https://discord.com/developers/applications" target="_blank" rel="noopener">discord.com/developers/applications</a></li>
        <li>Click <strong>New Application</strong></li>
        <li>Name your app (e.g., "ClawLink")</li>
        <li>Click <strong>Create</strong></li>
      </ol>
      
      <h3>Step 2: Create a Bot User</h3>
      <ol>
        <li>Click <strong>Bot</strong> in the left sidebar</li>
        <li>Click <strong>Add Bot</strong></li>
        <li>Click <strong>Yes, do it!</strong></li>
      </ol>
      
      <h3>Step 3: Get Your Bot Token</h3>
      <ol>
        <li>Under the bot username, click <strong>Reset Token</strong></li>
        <li>Click <strong>Yes, do it!</strong></li>
        <li><strong>Copy the token</strong> - this starts with <code>mfa.</code></li>
      </ol>
      <p>⚠️ Keep this token secret!</p>
      
      <h3>Step 4: Invite Bot to Your Server</h3>
      <ol>
        <li>Go to <strong>OAuth2</strong> → <strong>URL Generator</strong></li>
        <li>Select <code>bot</code> scope</li>
        <li>Select permissions: <code>Send Messages</code>, <code>Read Message History</code></li>
        <li>Copy the generated URL and open it</li>
        <li>Select your Discord server and authorize</li>
      </ol>
      
      <h2>Connect to ClawLink</h2>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>Enter your Discord Bot Token when prompted.</p>
    </div>
  )
}