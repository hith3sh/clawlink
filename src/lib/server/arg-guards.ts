/**
 * Cross-cutting boundary guard that rejects obviously hallucinated placeholder
 * arguments before they reach the upstream provider. Returns the same
 * `{errors, missingFields, invalidFields, hint}` shape as
 * `prepareToolArguments` so the executor can build a `type: "validation"`
 * error payload through the existing self-correction path.
 *
 * Generic layer only: catches the universal patterns an LLM tends to invent
 * (angle-bracket templates, curly-brace templates, `YOUR_X` / `REPLACE_ME` /
 * `PLACEHOLDER` keywords) across every integration with zero per-tool config.
 * Tool-specific traps like LinkedIn's `urn:li:person:self` — which look like
 * valid strings — are handled by per-tool `fieldValidators` registered in
 * `config/composio-tool-overrides.mjs` (separate follow-up).
 */

// Whole-string angle-bracket template: `<id>`, `<user_id>`, `<your-shop>`.
// Whole-string match avoids false-positives on HTML content (`<p>`, `<div>`)
// that might legitimately appear inside richer string fields.
const ANGLE_BRACKET_WHOLE_RE = /^<[a-zA-Z_][\w.-]*>$/;

// URL-embedded angle-bracket template, e.g. `https://<your-shop>.myshopify.com`.
// Limited to placeholders whose name itself starts with `your` or contains a
// hyphen — the most common LLM-generated form — so we don't trip on JSX-like
// content embedded in larger payloads.
const ANGLE_BRACKET_URL_RE = /<(your[_-][\w.-]*|[\w]+-[\w.-]+)>/i;

// Whole-string curly-brace template: `{id}`, `{user_id}`, `{shop_domain}`.
// Whole-string match avoids JSON-blob false-positives (those contain quotes,
// colons, multiple keys).
const CURLY_BRACE_WHOLE_RE = /^\{[a-zA-Z_][\w.-]*\}$/;

// Whole-string keyword placeholders. Case-insensitive. Whitespace is tolerated
// on either side. Deliberately excludes ambiguous values like bare `me`,
// `self`, `current`, `null`, `TODO`, `TBD` — those need per-tool context
// because they can be legitimate values in some fields.
const KEYWORD_PLACEHOLDER_RE =
  /^\s*(your[_-][\w-]+|replace[_-]me|replace[_-]with[_-][\w-]+|placeholder([_-][\w-]+)?|insert[_-][\w-]+(?:[_-]here)?|put[_-][\w-]+[_-]here|paste[_-][\w-]+[_-]here|fixme|fix[_-]me|x{6,})\s*$/i;

const PLACEHOLDER_PATTERNS: ReadonlyArray<{ name: string; regex: RegExp }> = [
  { name: "angle_bracket_template", regex: ANGLE_BRACKET_WHOLE_RE },
  { name: "angle_bracket_in_url", regex: ANGLE_BRACKET_URL_RE },
  { name: "curly_brace_template", regex: CURLY_BRACE_WHOLE_RE },
  { name: "keyword_placeholder", regex: KEYWORD_PLACEHOLDER_RE },
];

export interface PlaceholderViolation {
  path: string;
  value: string;
  pattern: string;
}

export interface PlaceholderDetectionResult {
  errors: string[];
  invalidFields: string[];
  missingFields: string[];
  hint?: string;
  violations: PlaceholderViolation[];
}

function matchPlaceholder(value: string): { pattern: string } | null {
  for (const { name, regex } of PLACEHOLDER_PATTERNS) {
    if (regex.test(value)) {
      return { pattern: name };
    }
  }
  return null;
}

function formatPath(path: string): string {
  return path ? `arguments.${path}` : "arguments";
}

function appendPath(path: string, segment: string): string {
  return path ? `${path}.${segment}` : segment;
}

function walk(value: unknown, path: string, out: PlaceholderViolation[]): void {
  if (typeof value === "string") {
    const match = matchPlaceholder(value);
    if (match) {
      out.push({ path, value, pattern: match.pattern });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${path}[${index}]`, out));
    return;
  }

  if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      walk(child, appendPath(path, key), out);
    }
  }
}

function buildHint(
  toolName: string | undefined,
  violations: PlaceholderViolation[],
): string {
  const target = toolName ? `Retry ${toolName}` : "Retry the tool call";
  const fields = Array.from(new Set(violations.map((v) => formatPath(v.path))));
  const examples = violations
    .slice(0, 3)
    .map((v) => `${formatPath(v.path)}=${JSON.stringify(v.value)}`)
    .join(", ");
  return (
    `${target} with real values in place of placeholders. ` +
    `Found template-style arguments: ${examples}. ` +
    `Fields: ${fields.join(", ")}. ` +
    `Discover the real identifiers with a read/list tool (e.g. *_get_my_info, *_list_*) and pass those exact values back.`
  );
}

export function detectPlaceholderArgs(
  toolName: string | undefined,
  args: Record<string, unknown>,
): PlaceholderDetectionResult {
  const violations: PlaceholderViolation[] = [];
  walk(args, "", violations);

  if (violations.length === 0) {
    return {
      errors: [],
      invalidFields: [],
      missingFields: [],
      violations,
    };
  }

  const invalidFields = Array.from(
    new Set(violations.map((v) => formatPath(v.path))),
  );
  const errors = violations.map(
    (v) =>
      `${formatPath(v.path)} looks like a placeholder (${JSON.stringify(v.value)}). Pass the real value.`,
  );

  return {
    errors,
    invalidFields,
    missingFields: [],
    hint: buildHint(toolName, violations),
    violations,
  };
}
