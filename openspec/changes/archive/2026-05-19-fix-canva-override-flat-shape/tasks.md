## 1. Rewrite the Canva constants

- [x] 1.1 Replace `CANVA_DESIGN_TYPE_DESCRIPTION` in `config/composio-tool-overrides.mjs` with a description that uses the real flat shapes (`{type: "preset", name: "presentation"}` and `{type: "custom", width: 1080, height: 1920}`) and explicitly says "send exactly ONE variant, not both."
- [x] 1.2 Replace `CANVA_EXPORT_FORMAT_DESCRIPTION` with the flat-shape equivalent for all six export variants: `pdf` (optional `size`), `jpg` (required `quality`), `png` (optional `lossless`), `gif`, `pptx`, `mp4` (required `quality` enum).

## 2. Rewrite the per-tool examples

- [x] 2.1 In `CANVA_POST_DESIGNS.examples`, replace the two envelope-shaped examples with three flat examples: two preset (`presentation`, `doc`) and one custom-dimension (LinkedIn banner 1200×627).
- [x] 2.2 In `CANVA_POST_EXPORTS.examples`, replace the two envelope-shaped examples with three flat examples: PNG (`{type: "png"}`), JPG with quality (`{type: "jpg", quality: 80}`), PDF (`{type: "pdf", size: "a4"}`).

## 3. Validate

- [x] 3.1 `npx tsc --noEmit -p tsconfig.json` exits 0.
- [x] 3.2 Load the override file with `node --input-type=module` and confirm `CANVA_POST_DESIGNS.examples[0].args.design_type` has shape `{type, name}` or `{type, width, height}` — no envelope keys. Verified: 6 examples total across both tools, all flat-shaped. Envelope-key mentions remain only inside "DO NOT use these" warning prose.

## 4. Deploy and verify

- [ ] 4.1 Operator runs `npm run deploy:web` after archive.
- [ ] 4.2 Monitor D1 `tool_executions` for `canva_post_designs` and `canva_post_exports` for the next 24h — expect `invalid_arguments` rate on these tools to drop close to zero.
