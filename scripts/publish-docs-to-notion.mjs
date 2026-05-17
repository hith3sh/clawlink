/**
 * Publish docs/markdown files to the Notion blog database.
 *
 * Usage:
 *   node scripts/publish-docs-to-notion.mjs <path-to-md-file>
 *   NOTION_API_KEY and NOTION_DATABASE_ID are read from env.
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = "2022-06-28";

const files = process.argv.slice(2);

if (!NOTION_API_KEY || !DATABASE_ID) {
  console.error("Need NOTION_API_KEY and NOTION_DATABASE_ID in env");
  process.exit(1);
}

if (files.length === 0) {
  console.error("Usage: node scripts/publish-docs-to-notion.mjs <file1.md> [file2.md] ...");
  process.exit(1);
}

// --- basic markdown -> Notion block converter ---

function mdToBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // skip frontmatter (not expected here)
    if (line.startsWith("---")) {
      i++;
      while (i < lines.length && !lines[i].startsWith("---")) i++;
      i++;
      continue;
    }

    // empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // divider
    if (line.trim() === "---") {
      blocks.push({ type: "divider", divider: {} });
      i++;
      continue;
    }

    // heading
    const hMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      const content = hMatch[2];
      blocks.push({
        type: `heading_${level}`,
        [`heading_${level}`]: {
          rich_text: [{ type: "text", text: { content } }],
        },
      });
      i++;
      continue;
    }

    // code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: "code",
        code: {
          rich_text: [{ type: "text", text: { content: codeLines.join("\n") } }],
          language: lang || "plain text",
        },
      });
      continue;
    }

    // numbered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        const text = lines[i].replace(/^\d+\.\s/, "");
        items.push(text);
        i++;
        // consume sub-lines that are indented
        while (i < lines.length && lines[i].startsWith("  ") && lines[i].trim() !== "") {
          items[items.length - 1] += " " + lines[i].trim();
          i++;
        }
      }
      for (const item of items) {
        blocks.push({
          type: "numbered_list_item",
          numbered_list_item: {
            rich_text: [{ type: "text", text: { content: item } }],
          },
        });
      }
      continue;
    }

    // bulleted list
    if (/^[-*+]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        const text = lines[i].replace(/^[-*+]\s/, "");
        items.push(text);
        i++;
        while (i < lines.length && lines[i].startsWith("  ") && lines[i].trim() !== "") {
          items[items.length - 1] += " " + lines[i].trim();
          i++;
        }
      }
      for (const item of items) {
        blocks.push({
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: item } }],
          },
        });
      }
      continue;
    }

    // blockquote
    if (line.startsWith("> ")) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({
        type: "quote",
        quote: {
          rich_text: [{ type: "text", text: { content: quoteLines.join("\n") } }],
        },
      });
      continue;
    }

    // image ![alt](url) — only if external URL
    const imgMatch = line.match(/^!\[(.*?)\]\((.*)\)$/);
    if (imgMatch) {
      const [, alt, url] = imgMatch;
      if (/^https?:\/\//.test(url)) {
        blocks.push({
          type: "image",
          image: {
            type: "external",
            external: { url },
            caption: alt ? [{ type: "text", text: { content: alt } }] : [],
          },
        });
      }
      // skip local/relative images (Notion only accepts external URLs)
      i++;
      continue;
    }

    // plain paragraph (accumulate lines)
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6})\s|^```|^\d+\.\s|^[-*+]\s|^> |^!\[|^---$/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    const para = paraLines.join(" ").trim();
    if (para) {
      blocks.push({
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: para } }],
        },
      });
    }
  }

  return blocks;
}

// --- parse H1 title from markdown ---
function extractTitle(md) {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "Untitled";
}

function extractDescription(md) {
  // grab first paragraph after title/image
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("*") && line.endsWith("*")) {
      // skip italics tagline
      continue;
    }
    if (line === "" || line.startsWith("#") || line.startsWith("![")) continue;
    return line.slice(0, 200);
  }
  return "";
}

function slugFromFilename(filename) {
  return filename.replace(/^connect-/, "").replace(/\.md$/, "");
}

async function notionPost(path, body) {
  const res = await fetch("https://api.notion.com/v1" + path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Notion API error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function notionPatch(path, body) {
  const res = await fetch("https://api.notion.com/v1" + path, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Notion API error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function createPage(filePath) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const md = fs.readFileSync(filePath, "utf-8");
  const fileName = path.basename(filePath);

  const title = extractTitle(md);
  const description = extractDescription(md);
  const slug = slugFromFilename(fileName);
  const blocks = mdToBlocks(md);

  // Notion page-create limit is 100 children — chunk if needed
  const firstBatch = blocks.slice(0, 100);
  const rest = blocks.slice(100);

  const payload = {
    parent: { database_id: DATABASE_ID },
    properties: {
      Name: {
        title: [{ text: { content: title } }],
      },
      Slug: {
        rich_text: [{ text: { content: slug } }],
      },
      Description: {
        rich_text: [{ text: { content: description } }],
      },
      Status: {
        select: { name: "Published" },
      },
      Published: {
        date: { start: new Date().toISOString().split("T")[0] },
      },
      Tags: {
        multi_select: [{ name: "Integrations" }],
      },
      Author: {
        rich_text: [{ text: { content: "ClawLink" } }],
      },
    },
    children: firstBatch,
  };

  console.log(`Creating: ${title} (slug: ${slug}) …`);
  const page = await notionPost("/pages", payload);
  console.log(`  -> Created page ${page.id}`);

  // append remaining blocks in batches of 100
  let cursor = 100;
  while (cursor < blocks.length) {
    const batch = blocks.slice(cursor, cursor + 100);
    await notionPatch(`/blocks/${page.id}/children`, { children: batch });
    cursor += 100;
  }

  return page;
}

async function main() {
  for (const file of files) {
    try {
      await createPage(file);
    } catch (err) {
      console.error(`FAIL ${file}:`, err.message);
    }
  }
}

main();
