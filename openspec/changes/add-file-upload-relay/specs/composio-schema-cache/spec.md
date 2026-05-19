## ADDED Requirements

### Requirement: Schema simplification preserves the `file_uploadable` marker

`simplifySchemaNode` SHALL propagate the `file_uploadable: true` boolean from the raw Composio property schema to the simplified output node when the source has `file_uploadable === true`. The propagation SHALL apply at every node depth: top-level object properties, nested object properties, and array `items`. Properties whose source schema lacks `file_uploadable` (or has it set to `false` / `null`) SHALL NOT carry the marker on the simplified output. Downstream consumers (the file-upload relay stage) rely on this marker to identify which arguments paths require relay handling.

#### Scenario: Top-level uploadable property keeps the marker
- **WHEN** `simplifySchemaNode` processes the raw `INSTAGRAM_POST_IG_USER_MEDIA` schema whose `properties.image_file` declares `file_uploadable: true`
- **THEN** the simplified output's `properties.image_file` SHALL include `file_uploadable: true`

#### Scenario: Non-uploadable property has no marker
- **WHEN** `simplifySchemaNode` processes the same schema's `properties.caption` (which has no `file_uploadable` key)
- **THEN** the simplified output's `properties.caption` SHALL NOT include a `file_uploadable` key

#### Scenario: Array of uploadable items keeps the marker on items
- **WHEN** a property declares `{type: "array", items: { file_uploadable: true, ...FileUploadable shape }}`
- **THEN** the simplified output SHALL preserve `file_uploadable: true` on the items node so the path walker can resolve `<path>[].s3key`
