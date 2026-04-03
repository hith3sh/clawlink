/* eslint-disable */
'use client'

export default function NotionDoc() {
  return (
    <div className="prose max-w-none">
      <h1>Notion Integration</h1>
      
      <p>Learn how to connect Notion to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your Notion API Key</h2>
      
      <h3>Step 1: Go to My Integrations</h3>
      <ol>
        <li>Visit <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener">notion.so/my-integrations</a></li>
        <li>Click <strong>+ New integration</strong></li>
      </ol>
      
      <h3>Step 2: Configure Your Integration</h3>
      <ol>
        <li>Name your integration (e.g., "ClawLink")</li>
        <li>Choose a profile picture (optional)</li>
        <li>Select capabilities:
          <ul>
            <li>Read content</li>
            <li>Update content</li>
            <li>Insert content</li>
          </ul>
        </li>
        <li>Click <strong>Submit</strong></li>
      </ol>
      
      <h3>Step 3: Get Your API Key</h3>
      <p>After creating the integration, you'll see:</p>
      <ul>
        <li><strong>Internal Integration Token</strong> - copy this!</li>
      </ul>
      <p>⚠️ <strong>Important</strong>: This token starts with <code>secret_</code></p>
      
      <h3>Step 4: Connect to Your Notion Pages</h3>
      <p>Your integration doesn't automatically have access to all pages:</p>
      <ol>
        <li>Open the Notion page you want to connect</li>
        <li>Click the <strong>•••</strong> menu (top right)</li>
        <li>Click <strong>Connect to</strong></li>
        <li>Select your ClawLink integration</li>
      </ol>
      <p>Repeat for each page/database you want ClawLink to access.</p>
      
      <h2>Connect to ClawLink</h2>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>Enter your Notion Internal Integration Token when prompted.</p>
    </div>
  )
}