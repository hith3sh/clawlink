'use client'

export default function DocsIndex() {
  return (
    <div className="prose max-w-none">
      <h1>Welcome to ClawLink Docs</h1>
      
      <p>Learn how to connect your favorite apps to OpenClaw using ClawLink.</p>
      
      <h2>Getting Started</h2>
      <ol>
        <li><strong>Install ClawLink</strong> in your OpenClaw instance:
          <pre><code>npx clawlink@latest init</code></pre>
        </li>
        <li><strong>Add your API key</strong> when prompted</li>
        <li><strong>Start using integrations</strong> - just ask OpenClaw to do things!</li>
      </ol>
      
      <h2>Available Integrations</h2>
      <table>
        <thead>
          <tr><th>Integration</th><th>Description</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>Gmail</td><td>Send, read, and manage emails</td><td>✅ Available</td></tr>
          <tr><td>Slack</td><td>Send messages and manage channels</td><td>✅ Available</td></tr>
          <tr><td>Notion</td><td>Manage pages, databases, and blocks</td><td>✅ Available</td></tr>
          <tr><td>WordPress</td><td>Create and manage posts and pages</td><td>✅ Available</td></tr>
          <tr><td>Discord</td><td>Send messages and manage servers</td><td>✅ Available</td></tr>
          <tr><td>GitHub</td><td>Manage repos, issues, and pull requests</td><td>✅ Available</td></tr>
          <tr><td>Stripe</td><td>Manage payments, customers, and invoices</td><td>✅ Available</td></tr>
          <tr><td>Google Sheets</td><td>Read and write spreadsheet data</td><td>✅ Available</td></tr>
        </tbody>
      </table>
      
      <h2>API Token Guides</h2>
      <p>Click on any integration in the sidebar to learn how to get your API credentials.</p>
      
      <h2>Need Help?</h2>
      <ul>
        <li><strong>GitHub</strong>: <a href="https://github.com/hith3sh/clawlink" target="_blank" rel="noopener">github.com/hith3sh/clawlink</a></li>
        <li><strong>Issues</strong>: Report bugs or request new integrations</li>
      </ul>
      
      <hr />
      <p><em>More integrations coming soon!</em></p>
    </div>
  )
}