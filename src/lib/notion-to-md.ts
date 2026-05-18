import type { NotionBlock } from "@/lib/notion-blog";

function richTextToMarkdown(richText: NotionBlock[]): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText
    .map((t) => {
      let text: string = t.plain_text || "";
      if (t.annotations?.italic && t.annotations?.bold) {
        text = `***${text}***`;
      } else if (t.annotations?.bold) {
        text = `**${text}**`;
      } else if (t.annotations?.italic) {
        text = `*${text}*`;
      }
      if (t.annotations?.strikethrough) text = `~~${text}~~`;
      if (t.annotations?.code) text = `\`${text}\``;
      if (t.href) text = `[${text}](${t.href})`;
      return text;
    })
    .join("");
}

function blockToMarkdown(block: NotionBlock, indent: number = 0): string {
  const children = (block.children as NotionBlock[] | undefined) ?? [];
  const childMd = children
    .map((c) => blockToMarkdown(c, indent + 1))
    .join("\n");
  const prefix = "  ".repeat(indent);

  switch (block.type) {
    case "paragraph": {
      const text = richTextToMarkdown(block.paragraph?.rich_text);
      return text ? `${prefix}${text}` : "";
    }
    case "heading_1":
      return `${prefix}# ${richTextToMarkdown(block.heading_1?.rich_text)}`;
    case "heading_2":
      return `${prefix}## ${richTextToMarkdown(block.heading_2?.rich_text)}`;
    case "heading_3":
      return `${prefix}### ${richTextToMarkdown(block.heading_3?.rich_text)}`;
    case "bulleted_list_item":
      return `${prefix}- ${richTextToMarkdown(block.bulleted_list_item?.rich_text)}${childMd ? `\n${childMd}` : ""}`;
    case "numbered_list_item":
      return `${prefix}1. ${richTextToMarkdown(block.numbered_list_item?.rich_text)}${childMd ? `\n${childMd}` : ""}`;
    case "to_do": {
      const checked = block.to_do?.checked ? "x" : " ";
      return `${prefix}- [${checked}] ${richTextToMarkdown(block.to_do?.rich_text)}`;
    }
    case "toggle":
      return `${prefix}<details><summary>${richTextToMarkdown(block.toggle?.rich_text)}</summary>\n\n${childMd}\n\n</details>`;
    case "quote":
      return `${prefix}> ${richTextToMarkdown(block.quote?.rich_text)}${childMd ? `\n${childMd.split("\n").map((l: string) => `> ${l}`).join("\n")}` : ""}`;
    case "callout": {
      const icon =
        block.callout?.icon?.type === "emoji" ? block.callout.icon.emoji + " " : "";
      return `${prefix}> ${icon}${richTextToMarkdown(block.callout?.rich_text)}${childMd ? `\n${childMd.split("\n").map((l: string) => `> ${l}`).join("\n")}` : ""}`;
    }
    case "code": {
      const lang = block.code?.language || "";
      const code = (block.code?.rich_text || [])
        .map((t: { plain_text: string }) => t.plain_text)
        .join("");
      return `${prefix}\`\`\`${lang}\n${code}\n\`\`\``;
    }
    case "divider":
      return `${prefix}---`;
    case "image": {
      const url =
        block.image?.type === "external"
          ? block.image.external.url
          : block.image?.file?.url || "";
      const caption = richTextToMarkdown(block.image?.caption);
      return `${prefix}![${caption}](${url})`;
    }
    case "video": {
      const url =
        block.video?.type === "external"
          ? block.video.external.url
          : block.video?.file?.url || "";
      return `${prefix}[Watch video](${url})`;
    }
    case "bookmark":
      return `${prefix}[${block.bookmark?.url}](${block.bookmark?.url})`;
    case "embed":
      return `${prefix}[Embedded content](${block.embed?.url})`;
    default:
      return childMd;
  }
}

export function notionBlocksToMarkdown(blocks: NotionBlock[]): string {
  const lines: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (!block || !("type" in block)) {
      i++;
      continue;
    }

    if (block.type === "bulleted_list_item") {
      while (i < blocks.length && blocks[i]?.type === "bulleted_list_item") {
        lines.push(blockToMarkdown(blocks[i], 0));
        i++;
      }
      lines.push("");
    } else if (block.type === "numbered_list_item") {
      while (i < blocks.length && blocks[i]?.type === "numbered_list_item") {
        lines.push(blockToMarkdown(blocks[i], 0));
        i++;
      }
      lines.push("");
    } else {
      const md = blockToMarkdown(block, 0);
      if (md) lines.push(md);
      i++;
    }
  }

  return lines.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function blogPostToMarkdown(post: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  tags: string[];
  slug: string;
  blocks: NotionBlock[];
}): string {
  const frontmatter = [
    `# ${post.title}`,
    "",
    post.description ? `> ${post.description}` : "",
    post.description ? "" : "",
    `By ${post.author} · ${new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    "",
    post.tags.length > 0 ? post.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ") : "",
    post.tags.length > 0 ? "" : "",
    "---",
    "",
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  const body = notionBlocksToMarkdown(post.blocks);
  return `${frontmatter}\n${body}`;
}