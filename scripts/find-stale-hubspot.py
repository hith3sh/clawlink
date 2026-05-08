import json, subprocess

# Get all catalog slugs
res = subprocess.run([
    "curl", "-s", "https://backend.composio.dev/api/v3.1/tools?toolkit_slug=hubspot&limit=300",
    "-H", "x-api-key: ak_akPNASOvvif3v4ccXrI4"
], capture_output=True, text=True)
data = json.loads(res.stdout)
catalog = set(t["slug"] for t in data.get("items", []))

# Get all imported slugs
imported = set()
with open("src/generated/composio-manifests/hubspot.generated.ts") as f:
    for line in f:
        if "toolSlug:" in line and "HUBSPOT" in line:
            slug = line.split('"')[1]
            imported.add(slug)

not_in_catalog = sorted(imported - catalog)
print(f"Imported: {len(imported)}")
print(f"Catalog: {len(catalog)}")
print(f"Not in catalog: {len(not_in_catalog)}")
for s in not_in_catalog:
    print(f"  DROP: {s}")
