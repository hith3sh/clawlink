/* eslint-disable */
'use client'

export default function GmailDoc() {
  return (
    <div className="prose max-w-none">
      <h1>Gmail Integration</h1>
      
      <p>Learn how to connect Gmail to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your Gmail API Credentials</h2>
      
      <h3>Step 1: Go to Google Cloud Console</h3>
      <ol>
        <li>Visit <a href="https://console.cloud.google.com" target="_blank" rel="noopener">console.cloud.google.com</a></li>
        <li>Select or create a new project</li>
      </ol>
      
      <h3>Step 2: Enable the Gmail API</h3>
      <ol>
        <li>Go to <strong>APIs & Services</strong> → <strong>Library</strong></li>
        <li>Search for "Gmail API"</li>
        <li>Click <strong>Enable</strong></li>
      </ol>
      
      <h3>Step 3: Create OAuth Credentials</h3>
      <ol>
        <li>Go to <strong>APIs & Services</strong> → <strong>Credentials</strong></li>
        <li>Click <strong>Create Credentials</strong> → <strong>OAuth client ID</strong></li>
        <li>Configure the OAuth consent screen:
          <ul>
            <li>User Type: <strong>External</strong></li>
            <li>Fill in required fields (app name, email)</li>
          </ul>
        </li>
        <li>Application type: <strong>Desktop application</strong></li>
        <li>Click <strong>Create</strong></li>
        <li>Download the JSON file</li>
      </ol>
      
      <h3>Step 4: Get Your Access Token</h3>
      <p>The OAuth JSON contains:</p>
      <ul>
        <li><code>client_id</code></li>
        <li><code>client_secret</code></li>
        <li><code>refresh_token</code> (you'll get this after the first auth flow)</li>
      </ul>
      
      <p>For ClawLink, you'll need to run the OAuth flow once to get a refresh token, then use:</p>
      <ul>
        <li>Client ID</li>
        <li>Client Secret</li>
        <li>Refresh Token</li>
      </ul>
      
      <h2>Required Scopes</h2>
      <p>Make sure your OAuth app requests these scopes:</p>
      <ul>
        <li><code>https://www.googleapis.com/auth/gmail.readonly</code></li>
        <li><code>https://www.googleapis.com/auth/gmail.send</code></li>
        <li><code>https://www.googleapis.com/auth/gmail.modify</code></li>
      </ul>
      
      <h2>Connect to ClawLink</h2>
      <p>Once you have your credentials, run:</p>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>Enter your Gmail API credentials when prompted. That's it!</p>
    </div>
  )
}