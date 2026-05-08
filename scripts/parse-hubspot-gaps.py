import re
with open("audit/composio-scopes-2026-05-08.md") as f:
    content = f.read()

section = content.split("### `hubspot`")[1].split("### `")[0]
rows = re.findall(r"\|\s*`(HUBSPOT_[^`]+)`\s*\|\s*`([^|]+)`\s*\|\s*`([^`]+)`\s*\|", section)

missing_scopes = set()
for slug, scopes_str, category in rows:
    if "scope_gap" not in category: continue
    for s in scopes_str.split(", "):
        s = s.strip().strip("'")
        if s: missing_scopes.add(s)

print(f"Found {len(rows)} scope-gap rows")
print(f"Distinct missing scopes: {len(missing_scopes)}")
groups = {}
for s in sorted(missing_scopes):
    prefix = s.split(".")[0] if "." in s else s
    groups.setdefault(prefix, []).append(s)
for prefix, scopes in sorted(groups.items(), key=lambda x: -len(x[1]))[:15]:
    print(f"  {prefix}: {len(scopes)} scopes")
    for s in scopes[:2]:
        print(f"    - {s}")
