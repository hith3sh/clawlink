# Security Policy

ClawLink is a third-party integration hub for OpenClaw. It is not affiliated with, endorsed by, or part of the OpenClaw project.

This policy covers the ClawLink code published in this repository:

- the npm package `@useclawlink/openclaw-plugin` (source: `packages/openclaw-clawlink/`)
- the ClawLink web app and dashboard hosted at `claw-link.dev`
- the tool execution backend hosted at `api.claw-link.dev`

## Supported versions

| Component | Supported versions |
|---|---|
| `@useclawlink/openclaw-plugin` | Latest minor release (currently `0.1.x`) |
| `claw-link.dev` web app | Current deployment |
| `api.claw-link.dev` worker | Current deployment |

Older plugin versions are not patched in place. Please upgrade to the latest minor release before opening a report.

## Verifying a release

Each plugin release is published to npm with an [npm provenance attestation](https://docs.npmjs.com/generating-provenance-statements), recorded in the public [Sigstore](https://docs.sigstore.dev/) transparency log. The attestation cryptographically links the tarball on npm to the exact GitHub Actions run in this repository that built it. See `.github/workflows/publish-openclaw-plugin.yml` for the publish workflow.

To verify a given version:

```bash
npm view @useclawlink/openclaw-plugin --json | jq '.dist.attestations'
```

You can also inspect the Provenance section on the [npm package page](https://www.npmjs.com/package/@useclawlink/openclaw-plugin).

## Reporting a vulnerability

Please report vulnerabilities privately — do not open a public GitHub issue.

- Email: [hello@claw-link.dev](mailto:hello@claw-link.dev)
- Subject line: `[security] <short summary>`
- Include: affected component, reproduction steps, impact, and any relevant request/account context

We aim to acknowledge reports within 3 business days and provide an initial triage within 7 business days. Fix timelines depend on severity and scope.

## Scope

In scope:

- the plugin code in `packages/openclaw-clawlink/`
- authentication, credential storage, and tool execution at `api.claw-link.dev`
- the dashboard, billing, and hosted connect flows at `claw-link.dev`
- OAuth callback handling and connection-session lifecycle

Out of scope:

- vulnerabilities in third-party provider APIs that ClawLink integrates with (report those to the provider)
- user-specific misconfiguration, lost API keys, or compromised OpenClaw installs
- denial-of-service via rate-limit exhaustion against `api.claw-link.dev`
- social-engineering attacks against end users
- issues in unmaintained or yanked plugin versions

## Responsible disclosure

We support coordinated disclosure. If you plan to publish a writeup, please give us a reasonable window to ship a fix and notify affected users. We will credit reporters in release notes on request.

## Spotting a clone

The only legitimate sources for the ClawLink OpenClaw plugin are:

- npm: `@useclawlink/openclaw-plugin`
- Source: `https://github.com/hith3sh/clawlink`
- Website: `https://claw-link.dev`

Anything pointing at a different package name, domain, or repository is not the official ClawLink flow. Please report suspected clones to [hello@claw-link.dev](mailto:hello@claw-link.dev).
