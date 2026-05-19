/**
 * Boundary guards that reject obviously bad arguments before they reach the
 * upstream provider. Returns the same `{errors, missingFields, invalidFields,
 * hint}` shape as `prepareToolArguments` so the executor can build a
 * `type: "validation"` error payload through the existing self-correction path.
 *
 * Two layers live here:
 *
 * 1. Generic placeholder detector (`detectPlaceholderArgs`) — catches universal
 *    patterns an LLM tends to invent (angle-bracket templates, curly-brace
 *    templates, `YOUR_X` / `REPLACE_ME` / `PLACEHOLDER` keywords) across every
 *    integration with zero per-tool config.
 *
 * 2. Per-tool field validator (`validateFieldArgs`) — catches tool-specific
 *    traps that look like legitimate strings (e.g. LinkedIn's
 *    `urn:li:person:self`, Gmail's `user_id: "<email>"`). Rules are declared as
 *    data on the `fieldValidators` property of each entry in
 *    `config/composio-tool-overrides.mjs` so the trap warning sits next to the
 *    LLM-facing description that already names it.
 */

import composioToolOverrides from "../../../config/composio-tool-overrides.mjs";

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

/**
 * Per-tool field validator rule. Declared as data inside
 * `config/composio-tool-overrides.mjs` under each tool's `fieldValidators`
 * property. All fields are optional, but a useful rule needs at least one of
 * `allow`/`allowPatterns`/`deny`/`denyPatterns`.
 *
 * Semantics: a value is rejected if it matches any `deny`/`denyPattern`, OR if
 * an allowlist is declared and the value matches none of its entries.
 */
export interface FieldValidatorRule {
  allow?: string[];
  allowPatterns?: RegExp[];
  deny?: string[];
  denyPatterns?: RegExp[];
  message: string;
  hint?: string;
}

interface OverrideWithValidators {
  fieldValidators?: Record<string, FieldValidatorRule>;
}

export interface FieldValidationResult {
  errors: string[];
  invalidFields: string[];
  missingFields: string[];
  hint?: string;
}

function getFieldValidators(
  toolSlug: string | undefined,
): Record<string, FieldValidatorRule> | null {
  if (!toolSlug) return null;
  const override = (composioToolOverrides as Record<string, OverrideWithValidators | undefined>)[
    toolSlug
  ];
  const validators = override?.fieldValidators;
  if (!validators || typeof validators !== "object") return null;
  return validators;
}

function isStringValueRejected(value: string, rule: FieldValidatorRule): boolean {
  if (rule.deny && rule.deny.includes(value)) return true;
  if (rule.denyPatterns?.some((re) => re.test(value))) return true;

  const hasAllowlist =
    (rule.allow?.length ?? 0) > 0 || (rule.allowPatterns?.length ?? 0) > 0;
  if (hasAllowlist) {
    const matchesAllow = rule.allow?.includes(value) ?? false;
    const matchesAllowPattern = rule.allowPatterns?.some((re) => re.test(value)) ?? false;
    if (!matchesAllow && !matchesAllowPattern) return true;
  }

  return false;
}

export function validateFieldArgs(
  toolSlug: string | undefined,
  toolName: string | undefined,
  args: Record<string, unknown>,
): FieldValidationResult {
  const validators = getFieldValidators(toolSlug);
  if (!validators) {
    return { errors: [], invalidFields: [], missingFields: [] };
  }

  const errors: string[] = [];
  const invalidFields: string[] = [];
  const hints: string[] = [];

  for (const [field, rule] of Object.entries(validators)) {
    if (!rule || typeof rule !== "object") continue;
    const value = args[field];
    if (value === undefined || value === null) continue;
    if (typeof value !== "string") continue;

    if (isStringValueRejected(value, rule)) {
      errors.push(
        `arguments.${field} = ${JSON.stringify(value)} is not allowed. ${rule.message}`,
      );
      invalidFields.push(`arguments.${field}`);
      if (rule.hint) hints.push(rule.hint);
    }
  }

  if (errors.length === 0) {
    return { errors: [], invalidFields: [], missingFields: [] };
  }

  const uniqueHints = Array.from(new Set(hints));
  const hint = uniqueHints.length > 0
    ? uniqueHints.join(" ")
    : toolName
      ? `Retry ${toolName} with corrected arguments.`
      : "Retry the tool call with corrected arguments.";

  return {
    errors,
    invalidFields: Array.from(new Set(invalidFields)),
    missingFields: [],
    hint,
  };
}
