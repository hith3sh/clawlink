import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Docs | ClawLink',
  description: 'Learn how to connect integrations to OpenClaw',
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/docs" className="text-xl font-bold text-gray-900">
              ClawLink Docs
            </a>
            <a href="https://claw-link.dev" className="text-sm text-gray-500 hover:text-gray-900">
              ← Back to ClawLink
            </a>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <nav className="sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Integrations</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/docs/gmail" className="text-gray-600 hover:text-gray-900 block">
                    Gmail
                  </a>
                </li>
                <li>
                  <a href="/docs/slack" className="text-gray-600 hover:text-gray-900 block">
                    Slack
                  </a>
                </li>
                <li>
                  <a href="/docs/notion" className="text-gray-600 hover:text-gray-900 block">
                    Notion
                  </a>
                </li>
                <li>
                  <a href="/docs/wordpress" className="text-gray-600 hover:text-gray-900 block">
                    WordPress
                  </a>
                </li>
                <li>
                  <a href="/docs/discord" className="text-gray-600 hover:text-gray-900 block">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="/docs/github" className="text-gray-600 hover:text-gray-900 block">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="/docs/stripe" className="text-gray-600 hover:text-gray-900 block">
                    Stripe
                  </a>
                </li>
                <li>
                  <a href="/docs/google-sheets" className="text-gray-600 hover:text-gray-900 block">
                    Google Sheets
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}