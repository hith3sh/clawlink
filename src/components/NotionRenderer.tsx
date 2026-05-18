"use client";

import type { NotionBlock } from "@/lib/notion-blog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderRichText(richText: any[]): string {
  return richText
    .map((text) => {
      let content: string = text.plain_text;

      if (text.annotations.bold) content = `<strong>${content}</strong>`;
      if (text.annotations.italic) content = `<em>${content}</em>`;
      if (text.annotations.strikethrough) content = `<del>${content}</del>`;
      if (text.annotations.code)
        content = `<code class="blog-inline-code">${content}</code>`;
      if (text.annotations.underline) content = `<u>${content}</u>`;

      if (text.href) {
        content = `<a href="${text.href}" class="blog-link" target="_blank" rel="noopener noreferrer">${content}</a>`;
      }

      return content;
    })
    .join("");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderBlock(block: any): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children = block.children as any[] | undefined;
  const childHtml = children ? children.map(renderBlock).join("") : "";

  switch (block.type) {
    case "paragraph": {
      const pText = renderRichText(block.paragraph.rich_text);
      if (!pText) return `<div class="blog-spacer"></div>`;
      return `<p>${pText}</p>${childHtml}`;
    }

    case "heading_1":
      return `<h2>${renderRichText(block.heading_1.rich_text)}</h2>${childHtml}`;

    case "heading_2":
      return `<h3>${renderRichText(block.heading_2.rich_text)}</h3>${childHtml}`;

    case "heading_3":
      return `<h4>${renderRichText(block.heading_3.rich_text)}</h4>${childHtml}`;

    case "bulleted_list_item":
      return `<li>${renderRichText(block.bulleted_list_item.rich_text)}${childHtml ? `<ul>${childHtml}</ul>` : ""}</li>`;

    case "numbered_list_item":
      return `<li>${renderRichText(block.numbered_list_item.rich_text)}${childHtml ? `<ol>${childHtml}</ol>` : ""}</li>`;

    case "to_do": {
      const checked = block.to_do.checked;
      return `<div class="blog-todo"><input type="checkbox" ${checked ? "checked" : ""} disabled /><span>${renderRichText(block.to_do.rich_text)}</span></div>`;
    }

    case "toggle":
      return `<details><summary>${renderRichText(block.toggle.rich_text)}</summary>${childHtml}</details>`;

    case "quote":
      return `<blockquote>${renderRichText(block.quote.rich_text)}${childHtml}</blockquote>`;

    case "callout": {
      const icon =
        block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "";
      return `<div class="blog-callout"><span class="blog-callout-icon">${icon}</span><div>${renderRichText(block.callout.rich_text)}${childHtml}</div></div>`;
    }

    case "code": {
      const lang = block.code.language || "plaintext";
      const code = block.code.rich_text
        .map((t: { plain_text: string }) => t.plain_text)
        .join("")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<pre class="blog-code-block" data-language="${lang}"><code>${code}</code></pre>`;
    }

    case "divider":
      return `<hr />`;

    case "image": {
      const imgUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      const caption = block.image.caption
        ? renderRichText(block.image.caption)
        : "";
      return `<figure class="blog-figure"><img src="${imgUrl}" alt="${caption}" loading="lazy" />${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    }

    case "video": {
      const videoUrl =
        block.video.type === "external"
          ? block.video.external.url
          : block.video.file.url;
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        const videoId = videoUrl.includes("youtu.be")
          ? videoUrl.split("/").pop()
          : new URL(videoUrl).searchParams.get("v");
        return `<div class="blog-video"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
      }
      return `<video src="${videoUrl}" controls></video>`;
    }

    case "bookmark": {
      const bookmarkUrl = block.bookmark.url;
      return `<a href="${bookmarkUrl}" class="blog-bookmark" target="_blank" rel="noopener noreferrer">${bookmarkUrl}</a>`;
    }

    case "embed":
      return `<div class="blog-embed"><iframe src="${block.embed.url}" frameborder="0"></iframe></div>`;

    case "table": {
      if (!children) return "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows = children.map((row: any) => {
        if (row.type !== "table_row") return "";
        const cells = row.table_row.cells
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((cell: any[]) => `<td>${renderRichText(cell)}</td>`)
          .join("");
        return `<tr>${cells}</tr>`;
      });
      return `<table>${rows.join("")}</table>`;
    }

    case "column_list":
      return `<div class="blog-columns">${childHtml}</div>`;

    case "column":
      return `<div class="blog-column">${childHtml}</div>`;

    default:
      return "";
  }
}

function groupBlocks(blocks: NotionBlock[]): string {
  let html = "";
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      html += "<ul>";
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        html += renderBlock(blocks[i]);
        i++;
      }
      html += "</ul>";
    } else if (block.type === "numbered_list_item") {
      html += "<ol>";
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        html += renderBlock(blocks[i]);
        i++;
      }
      html += "</ol>";
    } else {
      html += renderBlock(block);
      i++;
    }
  }

  return html;
}

interface NotionRendererProps {
  blocks: NotionBlock[];
}

export function NotionRenderer({ blocks }: NotionRendererProps) {
  const html = groupBlocks(blocks);

  return (
    <article
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
