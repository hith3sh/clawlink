/* eslint-disable */
'use client'

export default function GoogleSheetsDoc() {
  return (
    <div className="prose max-w-none">
      <h1>Google Sheets Integration</h1>
      
      <p>Learn how to connect Google Sheets to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your Google Cloud Credentials</h2>
      
      <h3>Step 1: Create a Google Cloud Project</h3>
      <ol>
        <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener">console.cloud.google.com</a></li>
        <li>Click <strong>Select a project</strong> → <strong>New Project</strong></li>
        <li>Name your project (e.g., "ClawLink")</li>
      </ol>
      
      <h3>Step 2: Enable Google Sheets API</h3>
      <ol>
        <li>Go to <strong>APIs & Services</strong> → <strong>Library</strong></li>
        <li>Search for "Google Sheets API"</li>
        <li>Click <strong>Enable</strong></li>
      </ol>
      
      <h3>Step 3: Create OAuth Credentials</h3>
      <ol>
        <li>Go to <strong>APIs & Services</strong> → <strong>Credentials</strong></li>
        <li>Click <strong>Create Credentials</strong> → <strong>OAuth client ID</strong></li>
        <li>Configure consent screen:
          <ul>
            <li>User Type: <strong>External</strong></li>
            <li>Fill in required fields</li>
          </ul>
        </li>
        <li>Application type: <strong>Desktop application</strong></li>
        <li>Click <strong>Create</strong></li>
        <li>Download the JSON file</li>
      </ol>
      
      <h3>Step 4: Get Refresh Token</h3>
      <p>The OAuth JSON contains:</p>
      <ul>
        <li><code>client_id</code></li>
        <li><code>client_secret</code></li>
      </ul>
      <p>You'll need to run the OAuth flow once to get a <strong>refresh_token</strong>.</p>
      
      <h2>Alternative: Use Service Account</h2>
      <p>For server-to-server access:</p>
      <ol>
        <li>Go to <strong>Credentials</strong> → <strong>Create Credentials</strong> → <strong>Service Account</strong></li>
        <li>Name it "ClawLink"</li>
        <li>Go to <strong>Keys</strong> → <strong>Add Key</strong> → <strong>Create new key</strong></li>
        <li>Choose <strong>JSON</strong></li>
        <li>Download the file</li>
      </ol>
      <p>Then share your Google Sheets with the service account email.</p>
      
      <h2>Connect to ClawLink</h2>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>Enter your credentials when prompted.</p>
    </div>
  )
}