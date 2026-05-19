## Why

The `CANVA_POST_DESIGNS` and `CANVA_POST_EXPORTS` description-only overrides shipped in change `add-arg-trap-guards-and-recovery` document the wrong schema shape. The override tells the LLM to wrap variant arguments in envelope keys named after the schema's `anyOf` titles (`DesignTypeCustom`, `DesignTypePreset`, `PngFormat`, `JpgFormat`, etc.) — but those titles are JSON-Schema variant labels, not data field names. The actual schema is a flat `anyOf` discriminated on `type`.

Empirical evidence (2026-05-19 05:19 UTC):

```
"design_type": {
  "type": "custom",
  "DesignTypeCustom": {"width": 1200, "height": 627, "units": "px"},
  "DesignTypePreset": {}
}
```

Pydantic returned `Following fields are missing: {design_type.DesignTypeCustom.height, design_type.DesignTypeCustom.width, design_type.DesignTypePreset.name}` because both `anyOf` variants failed: the agent followed our (wrong) guidance and Pydantic's error references the variant titles as if they were fields. The original `CANVA_POST_EXPORTS` "success" with `{type: "png", PngFormat: {...}}` was incidental — PngFormat only requires `type`, so the extra envelope was silently dropped by Pydantic's default `extra="ignore"`.

D1 lifetime stats:
- `canva_post_designs`: 27 calls, 21 errors (78%)
- `canva_post_exports`: 4 calls, 2 errors (50%)

## What Changes

- Rewrite the `descriptionPrefix`, `fieldDescriptions.design_type`, `fieldDescriptions.format`, and `examples` blocks on `CANVA_POST_DESIGNS` and `CANVA_POST_EXPORTS` in `config/composio-tool-overrides.mjs` to use the real flat shape.
- Drop the invented `units` field from the custom-dimension example (not in the Composio schema).
- Drop the invented envelope keys (`DesignTypeCustom`, `DesignTypePreset`, `PngFormat`, `JpgFormat`, etc.).
- State explicitly that the agent must send exactly ONE variant per call, not multiple.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

_None — the `arg-validation` spec requirement that "Canva discriminated-union shapes are documented via descriptionPrefix + fieldDescriptions + examples" is unchanged. This is an implementation correction to the override content, not a behavior change at the spec level._

## Impact

- One file modified: `config/composio-tool-overrides.mjs`.
- No new code, no new types, no migrations, no dependencies.
- Takes effect on the next `npm run deploy:web`.
- Risk is low; the wrong shape was already shipped, and the new shape matches Composio's published examples verbatim.
