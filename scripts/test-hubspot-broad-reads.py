import subprocess, json, time

TOKEN = "cllk_live_bgogIFmDh_Mg0bQfHYwj7iHR3K57-ivt"
BASE = "https://claw-link.dev"

# The 68 tools the audit said are OK (should all work)
# Let's sample some from the scope_gap list that are READ operations
# and likely to fail if scope is actually missing
scope_gap_reads = [
    # Marketing
    ("hubspot_get_campaigns", {}),
    ("hubspot_get_campaign", {"campaignId": "test"}),
    ("hubspot_get_campaign_metrics", {"campaignGuid": "test"}),
    ("hubspot_fetch_revenue", {"campaignGuid": "test"}),
    ("hubspot_get_all_marketing_emails_for_a_hub_spot_account", {}),
    ("hubspot_get_marketing_email_draft", {"id": "test"}),
    ("hubspot_clone_marketing_email", {"id": "test", "confirmed": True}),

    # Feedback
    ("hubspot_list_feedback_submissions", {}),
    ("hubspot_get_feedback_submission", {"submissionId": "test"}),

    # Emails
    ("hubspot_get_emails", {"properties": ["hs_email_subject"], "inputs": [{"id": "test@example.com"}]}),
    ("hubspot_archive_email", {"emailId": "test", "confirmed": True}),

    # Pipeline
    ("hubspot_audit_pipeline_changes", {}),
    ("hubspot_list_pipelines", {"objectType": "deals"}),

    # Workflow
    ("hubspot_list_workflows", {}),
    ("hubspot_get_workflow", {"workflowId": "test"}),

    # Schema/property
    ("hubspot_list_properties_for_an_object_type", {"objectType": "deals"}),
    ("hubspot_list_object_schemas", {}),
    ("hubspot_get_property_by_object_type_and_name", {"objectType": "deals", "propertyName": "amount"}),

    # Import
    ("hubspot_list_imports", {}),
    ("hubspot_get_import", {"importId": "test"}),

    # Events
    ("hubspot_list_event_templates", {"appId": 123}),

    # Custom objects
    ("hubspot_list_custom_objects", {}),

    # Sensitive data reads
    ("hubspot_archive_contact_gdpr", {"contactId": "test", "confirmed": True}),
    ("hubspot_delete_contact_gdpr", {"objectId": "test", "confirmed": True}),

    # Goals, leads, etc.
    ("hubspot_list_goals", {}),
    ("hubspot_list_leads", {}),
    ("hubspot_list_services", {}),
    ("hubspot_list_courses", {}),
    ("hubspot_list_appointments", {}),
    ("hubspot_list_subscriptions", {}),
    ("hubspot_list_orders", {}),
    ("hubspot_list_invoices", {}),
    ("hubspot_list_carts", {}),
    ("hubspot_list_media_bridges", {}),
    ("hubspot_list_listings", {}),
    ("hubspot_list_partner_services", {}),

    # Commerce
    ("hubspot_list_commerce_payments", {}),
    ("hubspot_list_products", {}),
    ("hubspot_list_line_items", {}),
]

print("=== Broad scope-gap read test ===")
print(f"{'Tool':<55} {'Result':<10} {'Code':<20} {'Snippet'}")
print("-" * 110)

scope_fails = []
tool_not_founds = []
arg_errors = []
other_fails = []
ok_count = 0

for name, args in scope_gap_reads:
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
        continue

    ok = d.get("ok")
    err = d.get("error", {})
    code = err.get("code", "?")
    msg = err.get("message", "")[:60]

    if ok:
        ok_count += 1
        status = "✅ OK"
    elif "scope" in msg.lower() or "granted" in msg.lower() or "hasn't been granted" in msg.lower():
        scope_fails.append(name)
        status = "❌ SCOPE"
    elif code == "tool_not_found":
        tool_not_founds.append(name)
        status = "⚠️  GONE"
    elif code == "invalid_arguments":
        arg_errors.append(name)
        status = "⚠️  ARGS"
    else:
        other_fails.append((name, code, msg))
        status = "❓ OTHER"

    print(f"{name:<55} {status:<10} {code:<20} {msg}")
    time.sleep(0.3)

print("-" * 110)
print(f"\nSummary: ✅ {ok_count} | ❌ SCOPE {len(scope_fails)} | ⚠️ GONE {len(tool_not_founds)} | ⚠️ ARGS {len(arg_errors)} | ❓ OTHER {len(other_fails)}")
print(f"\nConfirmed SCOPE fails ({len(scope_fails)}):")
for s in scope_fails:
    print(f"  - {s}")
