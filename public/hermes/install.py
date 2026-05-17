#!/usr/bin/env python3
"""Install ClawLink as an HTTP MCP server in Hermes."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import platform
import re
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


DEFAULT_BASE_URL = "https://claw-link.dev"
MIN_EXPECTED_TOOLS = 10
POLL_TIMEOUT_SECONDS = 15 * 60
POLL_INTERVAL_SECONDS = 3
USER_AGENT = "clawlink-hermes-bootstrap/1.0"


def log(message: str) -> None:
    print(f"[clawlink] {message}", flush=True)


def fail(message: str, code: int = 1) -> None:
    log(message)
    raise SystemExit(code)


def run_command(command: list[str], *, capture: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        check=False,
        capture_output=capture,
        text=True,
    )


def find_hermes() -> str:
    hermes = shutil.which("hermes")
    if not hermes:
        fail("Hermes CLI was not found on this machine. Install Hermes first.")
    log(f"Found Hermes at {hermes}")
    return hermes


def get_hermes_version(hermes: str) -> str | None:
    result = run_command([hermes, "--version"])
    if result.returncode != 0:
        return None
    return (result.stdout or result.stderr).strip().splitlines()[0][:80] or None


def resolve_hermes_home() -> Path:
    return Path(os.environ.get("HERMES_HOME", "~/.hermes")).expanduser()


def parse_env_shebang(parts: list[str]) -> str | None:
    for idx, part in enumerate(parts):
        if part in {"python", "python3"} or part.startswith("python3."):
            return shutil.which(part) or part
        if part == "-S":
            continue
        if part.startswith("-"):
            continue
        if idx > 0 and (part.startswith("python") or "/python" in part):
            return shutil.which(part) or part
    return None


def python_candidates_near_launcher(launcher: Path) -> list[str]:
    candidates: list[str] = []

    for base in {launcher, launcher.resolve()}:
        bin_dir = base.parent
        for name in ("python3", "python"):
            candidate = bin_dir / name
            if candidate.exists():
                candidates.append(str(candidate))

    return candidates


def resolve_hermes_python(hermes: str) -> str:
    launcher = Path(hermes)

    for candidate in python_candidates_near_launcher(launcher):
        if run_command(
            [
                candidate,
                "-c",
                "import sys; print(sys.executable)",
            ],
        ).returncode == 0:
            return candidate

    try:
        first_line = launcher.read_text(encoding="utf-8", errors="ignore").splitlines()[0]
    except Exception:
        first_line = ""

    if first_line.startswith("#!"):
        shebang = first_line[2:].strip()
        parts = shebang.split()
        if parts:
            executable = parts[0]
            if executable.endswith("/env"):
                for candidate in python_candidates_near_launcher(launcher):
                    return candidate
                env_python = parse_env_shebang(parts[1:])
                if env_python:
                    return env_python
            if "python" in Path(executable).name:
                return executable

    return sys.executable or shutil.which("python3") or "python3"


def ensure_mcp_dependency(hermes_python: str) -> None:
    check = run_command(
        [
            hermes_python,
            "-c",
            "import importlib.util; print(importlib.util.find_spec('mcp') is not None)",
        ],
    )
    if check.returncode == 0 and check.stdout.strip() == "True":
        log("MCP dependency already installed")
        return

    log(f"MCP dependency missing in {hermes_python}; installing mcp")
    ensurepip = run_command([hermes_python, "-m", "ensurepip", "--upgrade"])
    pip_command = [hermes_python, "-m", "pip", "install", "--upgrade", "mcp"]
    pip = run_command(pip_command)
    if ensurepip.returncode != 0 or pip.returncode != 0:
        attempted = " ".join(pip_command)
        detail = (pip.stderr or ensurepip.stderr or pip.stdout or ensurepip.stdout).strip()
        log(f"Detected Hermes python: {hermes_python}")
        log(f"Attempted command: {attempted}")
        if detail:
            log(detail[-1200:])
        fail("MCP dependency install failed. Install Python package 'mcp' in the Hermes environment, then rerun this installer.")

    log("MCP dependency installed")


def request_json(method: str, url: str, payload: dict | None = None) -> dict:
    data = None
    headers = {
        "accept": "application/json",
        "user-agent": USER_AGENT,
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["content-type"] = "application/json"

    request = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        try:
            message = json.loads(body).get("error") or body
        except Exception:
            message = body
        raise RuntimeError(f"{method} {url} failed: {message}") from error


def create_bootstrap_session(base_url: str, hermes: str | None, *, announce: bool = True) -> dict:
    payload = {
        "agent_family": "hermes",
        "agent_version": get_hermes_version(hermes) if hermes else None,
        "client_label": "Hermes Agent",
        "hostname": socket.gethostname(),
        "platform": platform.system().lower(),
        "approval_return_hint": "chat",
        "requested_transport": "mcp_http_header",
    }
    session = request_json("POST", f"{base_url}/api/hermes/bootstrap-sessions", payload)
    approval_url = session.get("approval_url")
    if not approval_url:
        raise RuntimeError("Bootstrap session response did not include an approval URL.")
    if announce:
        log(f"Approval required: {approval_url}")
    return session


def poll_for_approval(poll_url: str) -> dict:
    deadline = time.monotonic() + POLL_TIMEOUT_SECONDS
    last_progress = 0.0
    log("Waiting for approval...")

    while time.monotonic() < deadline:
        data = request_json("GET", poll_url)
        status = data.get("status")

        if status == "approved" and data.get("install"):
            log("Approval received")
            return data["install"]
        if status == "expired":
            fail("Approval expired. Run the installer again to generate a new link.")
        if status == "rejected":
            fail("Approval was canceled. Run the installer again when you are ready.")
        if status == "consumed":
            fail("This approval was already used. Rerun the installer with --repair to generate a fresh link.")

        now = time.monotonic()
        if now - last_progress >= 6:
            log("Waiting for approval...")
            last_progress = now
        time.sleep(POLL_INTERVAL_SECONDS)

    fail("Approval timed out. Run the installer again to generate a new link.")


def yaml_quote(value: object) -> str:
    return '"' + str(value).replace("\\", "\\\\").replace('"', '\\"') + '"'


def render_clawlink_block(install: dict, *, include_parent: bool) -> list[str]:
    headers = install.get("headers") or {}
    api_key = headers.get("x-clawlink-api-key")
    if not api_key:
        raise RuntimeError("Approved install payload did not include a ClawLink API key.")

    prefix = ["mcp_servers:\n"] if include_parent else []
    return prefix + [
        "  clawlink:\n",
        f"    url: {yaml_quote(install.get('url', 'https://claw-link.dev/api/mcp'))}\n",
        "    headers:\n",
        f"      x-clawlink-api-key: {yaml_quote(api_key)}\n",
        f"    timeout: {int(install.get('timeout', 180))}\n",
        f"    connect_timeout: {int(install.get('connect_timeout', 60))}\n",
    ]


def indentation(line: str) -> int:
    return len(line) - len(line.lstrip(" "))


def find_top_level_section(lines: list[str], name: str) -> tuple[int, int] | None:
    pattern = re.compile(rf"^{re.escape(name)}:\s*(?:#.*)?$")
    for start, line in enumerate(lines):
        if pattern.match(line.rstrip("\n")):
            end = len(lines)
            for idx in range(start + 1, len(lines)):
                stripped = lines[idx].strip()
                if stripped and not lines[idx].startswith((" ", "\t")) and not stripped.startswith("#"):
                    end = idx
                    break
            return start, end
    return None


def upsert_clawlink_config(config_text: str, install: dict) -> str:
    lines = config_text.splitlines(keepends=True)
    if not lines:
        return "".join(render_clawlink_block(install, include_parent=True))

    section = find_top_level_section(lines, "mcp_servers")
    if section is None:
        if lines[-1] and not lines[-1].endswith("\n"):
            lines[-1] += "\n"
        if lines and lines[-1].strip():
            lines.append("\n")
        lines.extend(render_clawlink_block(install, include_parent=True))
        return "".join(lines)

    start, end = section
    if lines[start].strip() == "mcp_servers: {}":
        lines[start : start + 1] = render_clawlink_block(install, include_parent=True)
        return "".join(lines)

    child_start = None
    child_indent = None
    for idx in range(start + 1, end):
        if re.match(r"^  clawlink:\s*(?:#.*)?$", lines[idx].rstrip("\n")):
            child_start = idx
            child_indent = indentation(lines[idx])
            break

    child_block = render_clawlink_block(install, include_parent=False)
    if child_start is None:
        insert_at = end
        lines[insert_at:insert_at] = child_block
        return "".join(lines)

    child_end = end
    for idx in range(child_start + 1, end):
        stripped = lines[idx].strip()
        if stripped and indentation(lines[idx]) <= child_indent:
            child_end = idx
            break

    lines[child_start:child_end] = child_block
    return "".join(lines)


def config_has_clawlink(config_path: Path) -> bool:
    if not config_path.exists():
        return False
    return bool(re.search(r"(?m)^mcp_servers:\s*$[\s\S]*?^  clawlink:\s*$", config_path.read_text()))


def backup_config(config_path: Path) -> Path | None:
    if not config_path.exists():
        return None
    timestamp = dt.datetime.now().strftime("%Y%m%d%H%M%S")
    backup_path = config_path.with_name(f"{config_path.name}.bak.{timestamp}")
    shutil.copy2(config_path, backup_path)
    return backup_path


def write_config(hermes_home: Path, install: dict) -> Path:
    config_path = hermes_home / "config.yaml"
    hermes_home.mkdir(parents=True, exist_ok=True)
    backup_path = backup_config(config_path)
    original = config_path.read_text() if config_path.exists() else ""
    updated = upsert_clawlink_config(original, install)
    temp_path = config_path.with_suffix(".yaml.tmp")

    try:
        temp_path.write_text(updated)
        temp_path.replace(config_path)
    except Exception:
        if backup_path and backup_path.exists():
            shutil.copy2(backup_path, config_path)
            log(f"Config write failed; restored backup {backup_path}")
        raise

    if backup_path:
        log(f"Backed up config to {backup_path}")
    log(f"Updated {config_path}")
    return config_path


def mcp_test_passed(output: str) -> tuple[bool, str | None]:
    counts = [int(match) for match in re.findall(r"(\d+)\s+(?:available\s+)?tools?", output, re.I)]
    if counts and max(counts) < MIN_EXPECTED_TOOLS:
        return False, f"discovered only {max(counts)} tools; expected at least {MIN_EXPECTED_TOOLS}"
    return True, None


def run_mcp_test(hermes: str) -> bool:
    result = run_command([hermes, "mcp", "test", "clawlink"])
    output = ((result.stdout or "") + "\n" + (result.stderr or "")).strip()
    if result.returncode != 0:
        log("MCP test failed")
        if output:
            log(output[-1600:])
        return False

    passed, reason = mcp_test_passed(output)
    if not passed:
        log(f"MCP test failed: {reason}")
        if output:
            log(output[-1600:])
        return False

    log("MCP test passed")
    return True


def consume_session(base_url: str, session_id: str) -> None:
    try:
        request_json("POST", f"{base_url}/api/hermes/bootstrap-sessions/{session_id}/consume")
    except Exception as error:
        log(f"Could not mark bootstrap session consumed: {error}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Install ClawLink into Hermes.")
    parser.add_argument("--yes", action="store_true", help="Run without interactive prompts.")
    parser.add_argument("--repair", action="store_true", help="Rotate the token and rewrite Hermes config.")
    parser.add_argument(
        "--print-approval-url-only",
        action="store_true",
        help="Create an approval session, print its URL, and exit.",
    )
    parser.add_argument(
        "--base-url",
        default=os.environ.get("CLAWLINK_BASE_URL", DEFAULT_BASE_URL),
        help=argparse.SUPPRESS,
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    base_url = args.base_url.rstrip("/")

    if args.print_approval_url_only:
        session = create_bootstrap_session(base_url, None, announce=False)
        print(session["approval_url"])
        return

    hermes = find_hermes()
    hermes_home = resolve_hermes_home()
    config_path = hermes_home / "config.yaml"

    if config_has_clawlink(config_path) and not args.repair and not args.print_approval_url_only:
        log("Existing ClawLink config found; validating")
        if run_mcp_test(hermes):
            log("ClawLink is already installed. Use --repair to rotate the token.")
            return
        log("Existing config did not pass validation; repairing")

    hermes_python = resolve_hermes_python(hermes)
    ensure_mcp_dependency(hermes_python)

    session = create_bootstrap_session(base_url, hermes)
    install = poll_for_approval(session["poll_url"])
    try:
        write_config(hermes_home, install)
    except Exception as error:
        fail(f"Config write fails: {error}")

    consume_session(base_url, session["session_id"])

    if not run_mcp_test(hermes):
        fail("Rerun the installer with --repair after checking the error above.")

    log("Run /reload-mcp in active Hermes chats, or start a new Hermes session to use ClawLink.")
    log("Done")


if __name__ == "__main__":
    main()
