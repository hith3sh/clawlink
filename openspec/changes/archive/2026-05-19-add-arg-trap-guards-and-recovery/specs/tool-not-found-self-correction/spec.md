## ADDED Requirements

### Requirement: Tool-name search tokenizes on whitespace and slug separators

The system SHALL tokenize the search query and each candidate's `tool.name` on `[\s_-]+` (whitespace, underscore, hyphen) so that slug-shaped queries align against slug-shaped tool names regardless of separator-character drift. Tokens shorter than 2 characters SHALL be ignored. The scoring function SHALL award the following positive scores per query token: +12 if the token is an exact match against any token of the tool's name, OR +8 if the token appears only as a substring of the tool's lowercase name (this fallback handles plural/singular forms like `calendar` inside `calendars`). The function SHALL also award +4 per query token found in the tool's tags and +2 per query token found in the tool's description.

#### Scenario: Underscore-separated query matches by token
- **WHEN** an agent calls `tool_not_found` recovery with query `googlecalendar_list_calendars` against a candidate whose name is exactly `googlecalendar_list_calendars`
- **THEN** the scorer SHALL award the maximum tool-name-match bonus (exact name equality)

#### Scenario: Plural/singular substring backoff
- **WHEN** the query token is `calendar` and the candidate's name contains the token `calendars`
- **THEN** the scorer SHALL still award a positive contribution to the candidate's total

#### Scenario: Short tokens are ignored
- **WHEN** the query is `a_b_googlecalendar_list`
- **THEN** the scorer SHALL ignore the `a` and `b` tokens (length < 2) and SHALL only score on `googlecalendar` and `list`

### Requirement: Concise tool-name candidates outrank verbose ones at equal positive coverage

The system SHALL subtract a small penalty (-3) per token in a candidate's name that is NOT present in the query as either an exact token or a substring-related token. This penalty SHALL respect plural/singular backoff (a tool token like `calendars` is considered covered when the query has a token like `calendar`). The intent is that, when two candidates share the same set of positively-matched tokens, the candidate with fewer extra/uncovered tokens ranks higher — preventing verbose write-tool variants from outranking the right read-tool match.

#### Scenario: Concise read tool outranks verbose write tool at equal coverage
- **WHEN** the query is `googlecalendar_calendar_list_list` and both `googlecalendar_list_calendars` (3 covered tokens, 0 uncovered) and `googlecalendar_calendar_list_insert` (3 covered tokens, 1 uncovered `insert`) are candidates
- **THEN** `googlecalendar_list_calendars` SHALL rank first

#### Scenario: Penalty does not over-fire on plural mismatches
- **WHEN** the query has token `calendar` and the candidate's name has token `calendars`
- **THEN** the uncovered-token penalty SHALL NOT be applied for `calendars`

### Requirement: `tool_not_found` response embeds suggestions in the error message and hint

When the router cannot resolve a requested tool name, the executor SHALL return an error payload whose `error.message` reads `"Tool '<requested>' not found. Did you mean: '<sug1>', '<sug2>', '<sug3>'?"` (with up to 3 suggestions). The payload SHALL also include a top-level `hint` field whose value reads `"Retry with one of: <sug1>, <sug2>, <sug3>."` when suggestions exist, or `"Use 'clawlink_search_tools' to discover available tool names."` when no suggestion scored above zero. The full suggestion list SHALL also be present in `details` for downstream tooling.

#### Scenario: Message names the requested tool and lists top-3 suggestions
- **WHEN** an agent calls `googlecalendar_calendar_list_list` and the ranker returns three candidates
- **THEN** the `error.message` SHALL begin with `Tool 'googlecalendar_calendar_list_list' not found.` and SHALL list up to 3 quoted suggestions

#### Scenario: Hint provides explicit retry list when suggestions exist
- **WHEN** the ranker returns at least one candidate above the score threshold
- **THEN** the response SHALL include a `hint` field with the text `Retry with one of: ` followed by the top-3 suggestion names (unquoted, comma-separated)

#### Scenario: Hint falls back to `clawlink_search_tools` when no suggestions
- **WHEN** the ranker returns zero candidates above zero score
- **THEN** the response SHALL include a `hint` instructing the agent to use `clawlink_search_tools`, and `error.message` SHALL be `"Tool '<requested>' not found."` (no `Did you mean` clause)

#### Scenario: Suggestions remain in `details` for tooling consumers
- **WHEN** the response includes suggestions in `error.message` and `hint`
- **THEN** the same suggestion list (up to 5) SHALL also appear in `details` so non-LLM consumers can still read them
