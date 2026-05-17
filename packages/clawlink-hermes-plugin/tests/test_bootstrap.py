"""Unit tests for the ClawLink Hermes config writer."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

# Make the plugin importable when running `python -m unittest` from the repo
# root.
PLUGIN_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PLUGIN_DIR))

from bootstrap import upsert_clawlink_config  # noqa: E402


SAMPLE_INSTALL = {
    "url": "https://claw-link.dev/api/mcp",
    "headers": {"x-clawlink-api-key": "ck_test_123"},
    "timeout": 180,
    "connect_timeout": 60,
}


class ConfigWriterTests(unittest.TestCase):
    def test_empty_config_creates_section(self) -> None:
        result = upsert_clawlink_config("", SAMPLE_INSTALL)
        self.assertIn("mcp_servers:", result)
        self.assertIn("  clawlink:", result)
        self.assertIn(
            'url: "https://claw-link.dev/api/mcp"',
            result,
        )
        self.assertIn(
            'x-clawlink-api-key: "ck_test_123"',
            result,
        )
        self.assertIn("timeout: 180", result)
        self.assertIn("connect_timeout: 60", result)

    def test_no_mcp_section_appends_section(self) -> None:
        config = "model:\n  name: claude\n"
        result = upsert_clawlink_config(config, SAMPLE_INSTALL)
        self.assertIn("model:\n  name: claude", result)
        self.assertIn("mcp_servers:", result)
        self.assertIn("  clawlink:", result)

    def test_empty_mcp_servers_dict_is_replaced(self) -> None:
        config = "mcp_servers: {}\n"
        result = upsert_clawlink_config(config, SAMPLE_INSTALL)
        self.assertNotIn("mcp_servers: {}", result)
        self.assertIn("mcp_servers:", result)
        self.assertIn("  clawlink:", result)

    def test_existing_clawlink_block_is_replaced(self) -> None:
        config = (
            "mcp_servers:\n"
            "  clawlink:\n"
            '    url: "https://old.example.com/api/mcp"\n'
            "    headers:\n"
            '      x-clawlink-api-key: "ck_old_token"\n'
            "    timeout: 60\n"
            "    connect_timeout: 30\n"
        )
        result = upsert_clawlink_config(config, SAMPLE_INSTALL)
        self.assertNotIn("ck_old_token", result)
        self.assertNotIn("https://old.example.com", result)
        self.assertIn("ck_test_123", result)
        self.assertIn("https://claw-link.dev/api/mcp", result)
        self.assertEqual(result.count("clawlink:"), 1)

    def test_other_servers_are_preserved(self) -> None:
        config = (
            "mcp_servers:\n"
            "  github:\n"
            "    command: github-mcp\n"
            '    args: ["--token", "ghp_test"]\n'
        )
        result = upsert_clawlink_config(config, SAMPLE_INSTALL)
        self.assertIn("  github:", result)
        self.assertIn("command: github-mcp", result)
        self.assertIn("  clawlink:", result)

    def test_missing_api_key_raises(self) -> None:
        bad_install = {"headers": {}}
        with self.assertRaises(Exception):
            upsert_clawlink_config("", bad_install)

    def test_special_chars_in_token_are_quoted(self) -> None:
        install = {
            "url": "https://claw-link.dev/api/mcp",
            "headers": {"x-clawlink-api-key": 'ck_with "quotes" and \\ slash'},
            "timeout": 180,
            "connect_timeout": 60,
        }
        result = upsert_clawlink_config("", install)
        # Embedded quotes/backslashes are escaped.
        self.assertIn(r'\"quotes\"', result)
        self.assertIn(r"\\ slash", result)


if __name__ == "__main__":
    unittest.main()
