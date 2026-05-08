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

# Focus on tools with SCOPE_ERRORS vs ones that are fine
scenarios = [
    # Marketing (known failure zone)
    ("hubspot_get_campaigns", {"limit": 1}),
    ("hubspot_get_campaign", {"campaignId": "99999999", "confirmed": True}),
    ("hubspot_get_campaign_metrics", {"campaignGuid": "99999999", "confirmed": True}),
    ("hubspot_fetch_revenue", {"campaignId": "99999999", "confirmed": True}),

    # Products / line items (all working so far)
    ("hubspot_list_products", {"limit": 1}),
    ("hubspot_create_products", {"inputs": [{"properties": {"name": "Test"}}], "confirmed": True}),
    ("hubspot_archive_products", {"inputs": [{"id": "99999999"}], "confirmed": True}),
    ("hubspot_archive_line_items", {"inputs": [{"id": "99999999"}], "confirmed": True}),

    # Feedback submissions (failed with scope)
    ("hubspot_list_feedback_submissions", {"limit": 1}),
    ("hubspot_create_feedback_submission", {"properties": {"hs_content": "test"}, "confirmed": True}),
    ("hubspot_archive_feedback_submission", {"submissionId": "99999999", "confirmed": True}),
    ("hubspot_archive_batch_of_feedback_submissions", {"inputs": [{"id": "99999999"}], "confirmed": True}),

    # Emails (mixed)
    ("hubspot_create_email", {"properties": {"hs_timestamp": "2024-01-01T00:00:00Z", "hs_email_subject": "Test"}, "confirmed": True}),
    ("hubspot_archive_email", {"emailId": "99999999", "confirmed": True}),
    ("hubspot_archive_emails", {"inputs": [{"id": "99999999"}], "confirmed": True}),

    # Sensitive data (likely real scope issues)
    ("hubspot_archive_contact_gdpr", {"contactId": "99999999", "confirmed": True}),
    ("hubspot_delete_contact_gdpr", {"contactId": "99999999", "confirmed": True}),

    # Workflow (automation scope)
    ("hubspot_create_workflow", {"name": "Test", "type": "CONTACT_FLOW", "startActionId": "DELAY", "confirmed": True}),
    ("hubspot_archive_workflow", {"workflowId": "99999999", "confirmed": True}),

    # Pipeline (crud)
    ("hubspot_create_pipeline", {"objectType": "deals", "pipeline": {"label": "test"}, "confirmed": True}),
    ("hubspot_delete_pipeline", {"objectType": "deals", "pipelineId": "test", "confirmed": True}),

    # Schema/properties
    ("hubspot_create_object_schema", {"name": "test_object_123", "primaryDisplayProperty": "name", "confirmed": True}),
    ("hubspot_delete_schema", {"objectType": "test_object_123", "confirmed": True}),

    # Calls / meetings
    ("hubspot_create_call", {"properties": {"hs_timestamp": "2024-01-01T00:00:00Z"}, "confirmed": True}),
    ("hubspot_create_meeting", {"properties": {"hs_timestamp": "2024-01-01T00:00:00Z"}, "confirmed": True}),
    ("hubspot_create_note", {"properties": {"hs_note_body": "Test", "hs_timestamp": "2024-01-01T00:00:00Z"}, "confirmed": True}),

    # Tasks
    ("hubspot_create_task", {"properties": {"hs_task_subject": "Test task", "hs_timestamp": "2024-01-01T00:00:00Z"}, "confirmed": True}),
    ("hubspot_list_tasks", {"limit": 1}),
]

results = [test(s[0], s[1]) for s in scenarios]

ok_count = sum(1 for r in results if r[1])
scope_count = sum(1 for r in results if not r[1] and ("scope" in r[3].lower() or "granted" in r[3].lower()))
notfound_count = sum(1 for r in results if not r[1] and r[2] == "tool_not_found")
arg_count = sum(1 for r in results if not r[1] and r[2] == "invalid_arguments")
other_count = sum(1 for r in results if not r[1] and not any([
    "scope" in r[3].lower(), "granted" in r[3].lower(), r[2] == "tool_not_found", r[2] == "invalid_arguments"
]))

print(f"=== Results: {len(results)} tools tested ===")
for name, ok, code, msg in results:
    if ok:
        kind = "✅ OK"
    elif "scope" in msg.lower() or "granted" in msg.lower():
        kind = "❌ SCOPE"
    elif code == "tool_not_found":
        kind = "⚠️  GONE"
    elif code == "invalid_arguments":
        kind = "⚠️  ARGS"
    else:
        kind = "❓ OTHER"
    short = msg[:45] if msg else ""
    print(f"{name:<55} {kind:<10} {short}")

print(f"\nTotals: {ok_count} OK | {scope_count} SCOPE | {notfound_count} GONE | {arg_count} ARGS | {other_count} OTHER")
