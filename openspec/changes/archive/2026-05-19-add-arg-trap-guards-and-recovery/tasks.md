## 1. Arg-validation boundary guard

- [x] 1.1 Define `FieldValidatorRule` interface (allow / allowPatterns / deny / denyPatterns / message / hint) and `FieldValidationResult` in `src/lib/server/arg-guards.ts`.
- [x] 1.2 Implement `validateFieldArgs(toolSlug, toolName, args)` that reads `fieldValidators` from `config/composio-tool-overrides.mjs` (data-only, no functions) and applies rules with deny-then-allowlist semantics.
- [x] 1.3 Wire the new check into `src/lib/server/executor.ts` immediately after the existing `detectPlaceholderArgs` call; emit `type: "validation"` / `code: "invalid_field_value"` with the rule's message + hint.
- [x] 1.4 Register `LINKEDIN_CREATE_LINKED_IN_POST.author` and `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE.author` rules: deny `urn:li:person:(self|me|user|current_user)` AND `urn:li:organization:*`; allow only `urn:li:person:<id>`. Update `descriptionPrefix` and `fieldDescriptions.author` to mirror the validator rule.
- [x] 1.5 Register `LINKEDIN_SEARCH_AD_TARGETING_ENTITIES.facet` rule: deny `urn:li:adTargetingFacet:companies`/`company`; allow facets matching `^urn:li:adTargetingFacet:[A-Za-z][A-Za-z0-9]*$`; hint nudges agent toward `employers`.
- [x] 1.6 Register `user_id` rule on all 61 Gmail tools via a `buildGmailOverrides()` helper that injects `{ allow: ["me"], message, hint }` plus a uniform `descriptionPrefix` and `fieldDescriptions.user_id`.
- [x] 1.7 Functional smoke: 13 cases covering self / me / current_user / random_string / real person URN / org URN for LinkedIn; "me" / arbitrary email / "self" / no-manual-override slugs for Gmail. All pass.
- [x] 1.8 Add description-only overrides for `CANVA_POST_DESIGNS` and `CANVA_POST_EXPORTS` (discriminated-union shape; no validator rule).

## 2. Composio schema cache parameterless-tool fix

- [x] 2.1 Add optional `schemaHydrated?: boolean` to `IntegrationTool` in `worker/integrations/base.ts` with a documenting comment naming the parameterless-tool failure mode.
- [x] 2.2 In `src/lib/composio/manifest-registry.ts` `hydrateComposioToolSchemas`, change both loops' skip-already-hydrated guard from `if (!isStubSchema(tool.inputSchema)) continue` to `if (tool.schemaHydrated) continue`.
- [x] 2.3 Set `tool.schemaHydrated = true` in the second loop after a successful `tool.inputSchema = schema` assignment.
- [x] 2.4 In `src/lib/server/executor.ts`, change the stub guard from `isStubSchema(decision.tool.inputSchema)` to `!decision.tool.schemaHydrated && isStubSchema(decision.tool.inputSchema)` so parameterless hydrated tools execute.
- [x] 2.5 Document the stale `GOOGLE_SEARCH_CONSOLE_LIST_SITES` manifest entry as a follow-up (re-run the manifest import to drop it from `google-search-console.generated.ts`).

## 3. Tool-not-found self-correction

- [x] 3.1 In `src/lib/server/tool-registry.ts` `scoreTool`, change tokenization from `/\s+/` to `/[\s_-]+/` for the query, and split the tool's name on `/[_-]+/` too.
- [x] 3.2 Reward +12 for exact tool-name token match, +8 for substring backoff (catches plural/singular).
- [x] 3.3 Apply -3 penalty per tool-name token that doesn't appear in the query (after applying the plural-substring backoff so we don't double-penalize).
- [x] 3.4 In `src/lib/server/executor.ts` `tool_not_found` branch, embed top-3 suggestions in `error.message` (`"Tool 'X' not found. Did you mean: 'a', 'b', 'c'?"`) and populate a top-level `hint` with the explicit retry list.
- [x] 3.5 Functional verification against real D1 hallucinations: `googlecalendar_calendar_list_list`, `GOOGLECALENDAR_CALENDAR_LIST_LIST`, `googlecalendar_calendars_list` all rank `googlecalendar_list_calendars` first.

## 4. Validation and deploy

- [x] 4.1 `npx tsc --noEmit` exits 0 across all changes.
- [x] 4.2 `npx eslint` clean on touched files.
- [ ] 4.3 `npm run deploy:web` after this change archives and lands. (Done out-of-band by the operator — not part of the spec workflow.)
- [ ] 4.4 Post-deploy: monitor D1 `tool_executions` for `schema_unavailable` on `linkedin_get_my_info` to drop to zero, and `tool_not_found` retry rates on `googlecalendar_calendar_list_list` family to drop. (Follow-up.)
