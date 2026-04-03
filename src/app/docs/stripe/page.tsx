'use client'

export default function StripeDoc() {
  return (
    <div className="prose max-w-none">
      <h1>Stripe Integration</h1>
      
      <p>Learn how to connect Stripe to OpenClaw using ClawLink.</p>
      
      <h2>Getting Your Stripe API Keys</h2>
      
      <h3>Step 1: Access Stripe Dashboard</h3>
      <ol>
        <li>Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener">dashboard.stripe.com/apikeys</a></li>
        <li>Make sure you're viewing <strong>Test mode</strong> (toggle in top right)</li>
      </ol>
      
      <h3>Step 2: Get Your Secret Key</h3>
      <ol>
        <li>Under <strong>Standard keys</strong>, find the <strong>Secret key</strong></li>
        <li>Click <strong>Reveal test key</strong></li>
        <li><strong>Copy the key</strong> - it starts with <code>sk_test_</code></li>
      </ol>
      
      <h3>Step 3: (Optional) Get Publishable Key</h3>
      <p>For some features, you may also need the Publishable key:</p>
      <ul>
        <li>Found under <strong>Standard keys</strong> as well</li>
        <li>Starts with <code>pk_test_</code></li>
      </ul>
      
      <h2>What's the Difference?</h2>
      <table>
        <thead>
          <tr><th>Key Type</th><th>Prefix</th><th>Use Case</th></tr>
        </thead>
        <tbody>
          <tr><td>Secret Key</td><td><code>sk_test_</code></td><td>Server-side operations</td></tr>
          <tr><td>Publishable Key</td><td><code>pk_test_</code></td><td>Client-side display</td></tr>
        </tbody>
      </table>
      <p>For ClawLink, you'll primarily use the <strong>Secret Key</strong>.</p>
      
      <h2>Test Mode vs Live Mode</h2>
      <p>⚠️ <strong>Important</strong>: The API key above is your <strong>Test</strong> key.</p>
      <ul>
        <li><strong>Test keys</strong> (<code>sk_test_</code>) - For development, no real money</li>
        <li><strong>Live keys</strong> (<code>sk_live_</code>) - For production, real transactions</li>
      </ul>
      
      <h2>Connect to ClawLink</h2>
      <pre><code>npx clawlink@latest init</code></pre>
      <p>Enter your Stripe Secret Key when prompted.</p>
    </div>
  )
}