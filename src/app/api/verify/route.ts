import { NextResponse } from "next/server";

import {
  CLAWHUB_PACKAGE_NAME,
  CLAWLINK_CLAWHUB_URL,
  CLAWLINK_GITHUB_URL,
  CLAWLINK_NPM_URL,
  CLAWLINK_OPENCLAW_DOCS_URL,
  CLAWLINK_VERIFY_URL,
  OPENCLAW_PLUGIN_ID,
  OPENCLAW_PLUGIN_PACKAGE,
} from "@/lib/openclaw-plugin";

const PUBLISH_WORKFLOW_URL =
  "https://github.com/hith3sh/clawlink/blob/main/.github/workflows/publish-openclaw-plugin.yml";
const PLUGIN_SOURCE_DIRECTORY_URL =
  "https://github.com/hith3sh/clawlink/tree/main/packages/openclaw-clawlink";
const SECURITY_POLICY_URL = "https://github.com/hith3sh/clawlink/blob/main/SECURITY.md";

export async function GET() {
  const body = {
    canonical_url: CLAWLINK_VERIFY_URL,
    package: {
      openclaw_plugin_id: OPENCLAW_PLUGIN_ID,
      npm_name: OPENCLAW_PLUGIN_PACKAGE,
      clawhub_name: CLAWHUB_PACKAGE_NAME,
    },
    registries: {
      npm: {
        url: CLAWLINK_NPM_URL,
        provenance: true,
        provenance_transparency_log: "https://search.sigstore.dev/",
        verify_command: `npm view ${OPENCLAW_PLUGIN_PACKAGE} --json`,
        attestation_field: "dist.attestations",
      },
      clawhub: {
        url: CLAWLINK_CLAWHUB_URL,
        verify_command: `npx clawhub package inspect ${CLAWHUB_PACKAGE_NAME} --json`,
        source_commit_field: "verification.sourceCommit",
        source_repo_field: "verification.sourceRepo",
      },
    },
    source: {
      repository: CLAWLINK_GITHUB_URL,
      license: "MIT",
      plugin_directory: PLUGIN_SOURCE_DIRECTORY_URL,
      release_workflow: PUBLISH_WORKFLOW_URL,
      cross_check_command:
        "git ls-remote https://github.com/hith3sh/clawlink openclaw-plugin-v<version>",
      cross_check_note:
        "The SHA returned by git ls-remote must equal verification.sourceCommit from the ClawHub inspect output. That proves the published tarball was built from this public repo at the matching tag.",
    },
    runtime: {
      outbound_domains: ["claw-link.dev"],
      credential_storage_path: "~/.openclaw/openclaw.json",
      credential_header: "X-ClawLink-API-Key",
      credential_sent_to: ["https://claw-link.dev"],
      credential_never_sent_to: [
        "the OpenClaw gateway",
        "the assistant context",
        "any third party other than claw-link.dev",
      ],
    },
    affiliation: {
      first_party_with_openclaw: false,
      endorsed_by_openclaw: false,
      maintainer_github_handle: "hith3sh",
    },
    contact: {
      website: "https://claw-link.dev",
      docs: CLAWLINK_OPENCLAW_DOCS_URL,
      security: "hello@claw-link.dev",
      security_policy: SECURITY_POLICY_URL,
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
