import { promises as fs } from 'node:fs';
const authData = JSON.parse(await fs.readFile('audit/auth-schemes.json', 'utf8'));
const integrations = (await import('../src/data/integrations.ts')).integrations;
const composioSlugs = integrations.filter(i => i.setupMode === 'composio').map(i => i.slug);

const byKey = new Map();
for (const row of authData) {
  if (row.authScheme) {
    byKey.set(row.slug, row);
    if (row.toolkitSlug) byKey.set(row.toolkitSlug, row);
  }
}

function findMatch(slug) {
  if (byKey.has(slug)) return byKey.get(slug);
  const underscored = slug.replace(/-/g, '_');
  if (byKey.has(underscored)) return byKey.get(underscored);
  const fallbacks = {
    'microsoft-excel': 'excel',
    'dynamics-365': 'dynamics365',
    'onedrive': 'one_drive',
    'plausible-analytics': 'plausible_analytics',
    'perplexity-ai': 'perplexityai',
    'reddit-ads': 'reddit_ads',
  };
  const fallback = fallbacks[slug];
  if (fallback && byKey.has(fallback)) return byKey.get(fallback);
  return null;
}

const SCHEME_MAP = {
  'OAUTH2': 'oauth2',
  'OAUTH1': 'oauth1',
  'API_KEY': 'api_key',
  'BASIC': 'basic',
  'BASIC_WITH_JWT': 'basic_with_jwt',
  'BEARER_TOKEN': 'bearer_token',
  'NO_AUTH': 'no_auth',
};

const result = {};
const missing = [];
for (const slug of composioSlugs) {
  const match = findMatch(slug);
  if (!match) { missing.push(slug); continue; }
  result[slug] = SCHEME_MAP[match.authScheme] ?? match.authScheme.toLowerCase();
}

console.log('const composioAuthSchemes: Partial<Record<string, IntegrationAuthScheme>> = {');
for (const slug of Object.keys(result).sort()) {
  console.log(`  "${slug}": "${result[slug]}",`);
}
console.log('};');
console.log('');
console.log('// MISSING (env auth_config missing or stale on Composio side):');
for (const slug of missing) console.log(`//   ${slug}`);
