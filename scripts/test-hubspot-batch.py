import subprocess, json

TOKEN = "cllk_live_bgogIFmDh_Mg0bQfHYwj7iHR3K57-ivt"
BASE = "https://claw-link.dev"

def test(name, args):
    res = subprocess.run([
        "curl", "-s", "-X", "POST",
        f"{BASE}/api/tools/{name}/execute",
        "-H", f"Authorization: Bearer {TOKEN}",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(args)
    ], capture_output=True, text=True, timeout=30)
    try:
        d = json.loads(res.stdout)
    except:
        return name, False, "BAD_JSON", res.stdout[:100]
    ok = d.get("ok")
    if ok:
        return name, True, "OK", ""
    else:
        err = d.get("error", {})
        return name, False, err.get("code", "?"), err.get("message", "")[:200]

# Test more of the "scope_gap" flagged tools
scenarios = [
    # Objects that audit said would fail
    ("hubspot_create_product", {"properties": {"name": "Test Product", "price": "99"}, "confirmed": True}),
    ("hubspot_archive_product", {"productId": "99999999", "confirmed": True}),
    ("hubspot_create_line_item", {"properties": {"name": "Test Line Item"}, "confirmed": True}),
    ("hubspot_archive_line_item", {"lineItemId": "99999999", "confirmed": True}),
    ("hubspot_list_line_items", {"limit": 1}),
    ("hubspot_list_products", {"limit": 1}),

    # Emails (scope gap: crm.objects.emails.read)
    ("hubspot_get_emails", {"inputs": [{"id": "test@example.com"}]}),  # needs proper args
    ("hubspot_archive_email", {"emailId": "99999999", "confirmed": True}),

    # Feedback (scope gap)
    ("hubspot_list_feedback_submissions", {"limit": 1}),

    # Pipeline (scope gap: crm.pipelines.read)
    ("hubspot_audit_pipeline_changes", {"limit": 1}),
    ("hubspot_list_pipelines", {"limit": 1}),

    # Property/schema (scope gap)
    ("hubspot_list_properties_for_an_object_type", {"objectType": "deals", "limit": 1}),

    # Campaigns (scope gap: marketing.campaigns.read)
    ("hubspot_get_campaigns", {"limit": 1}),
    ("hubspot_get_campaign", {"campaignGuid": "test", "confirmed": True}),

    # Marketing emails
    ("hubspot_clone_marketing_email", {"emailId": "99999999", "confirmed": True}),

    # Workflow (scope gap: automation)
    ("hubspot_list_workflows", {"limit": 1}),

    # Events
    ("hubspot_list_event_templates", {"limit": 1}),

    # Schemas
    ("hubspot_list_object_schemas", {"limit": 1}),

    # Custom objects
    ("hubspot_list_custom_objects", {"limit": 1}),

    # Import
    ("hubspot_list_imports", {"limit": 1}),

    # Attachments
    ("hubspot_get_attachment_url", {"attachmentId": "99999999"}),

    # Associated company
    ("hubspot_list_associated_companies", {"contactId": "1", "toObjectType": "company", "limit": 1}),

    # Note
    ("hubspot_list_notes", {"limit": 1}),
    ("hubspot_create_note", {"properties": {"hs_note_body": "Test note"}, "confirmed": True}),
]

results = []
for slug, args in scenarios:
    results.append(test(slug, args))

print("=== HubSpot Spot-Check: 30 more tools ===")
print(f"{'Tool':<55} {'Result':<8} {'Code':<20}")
print("-" * 85)
ok_count = 0
scope_fail = 0
arg_fail = 0
other_fail = 0
for name, ok, code, msg in results:
    status = "✅ OK" if ok else "❌ FAIL"
    if not ok:
        if "scope" in msg.lower() or "granted" in msg.lower():
            scope_fail += 1
        elif code == "invalid_arguments":
            arg_fail += 1
        else:
            other_fail += 1
    else:
        ok_count += 1
    short_msg = msg[:40] if msg else ""
    print(f"{name:<55} {status:<8} {code:<20} {short_msg}")

print("-" * 85)
print(f"Summary: {ok_count} OK, {scope_fail} scope failures, {arg_fail} arg errors, {other_fail} other")
