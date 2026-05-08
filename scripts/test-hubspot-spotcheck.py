import subprocess, json, sys

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
        print(f"{name}: ??? (bad json: {res.stdout[:100]})")
        return
    ok = d.get("ok")
    if ok:
        print(f"✅ {name}: ok")
    else:
        err = d.get("error", {})
        code = err.get("code", "?")
        msg = err.get("message", "")[:150]
        print(f"❌ {name}: {code} | {msg}")

# Group 1: Read ops that audit says should work
print("=== Group A: Reads that should work ===")
test("hubspot_list_companies", {"limit": 1})
test("hubspot_list_contacts", {"limit": 1})
test("hubspot_list_deals", {"limit": 1})
test("hubspot_list_quotes", {"limit": 1})
test("hubspot_list_owners", {"limit": 1})
test("hubspot_list_tickets", {"limit": 1})

# Group 2: Write ops that should work (with confirmed flag)
print("\n=== Group B: Writes that should work ===")
test("hubspot_create_company", {"properties": {"name": "Test ClawLink Co", "domain": "test-abc.example.com"}, "confirmed": True})

# Group 3: Scope-gap reads
print("\n=== Group C: Scope-gap reads ===")
test("hubspot_get_emails", {"limit": 1})
test("hubspot_get_campaigns", {"limit": 1})
test("hubspot_list_marketing_emails_for_a_hubspot_account", {"limit": 1})

# Group 4: Scope-gap writes
print("\n=== Group D: Scope-gap writes ===")
test("hubspot_create_product", {"properties": {"name": "Test Product", "price": "99"}, "confirmed": True})
test("hubspot_create_line_item", {"properties": {"name": "Test Line"}, "confirmed": True})
test("hubspot_create_email", {"properties": {"hs_email_subject": "Test email"}, "confirmed": True})
test("hubspot_create_campaign", {"properties": {"name": "Test Campaign"}, "confirmed": True})

# Group 5: Workflow (automation scope)
print("\n=== Group E: Automation/workflow ===")
test("hubspot_create_workflow", {"name": "Test Workflow", "type": "CONTACT_FLOW", "confirmed": True})
test("hubspot_delete_workflow", {"workflowId": "9999999", "confirmed": True})
