/**
 * Notion API client using fetch (Cloudflare Workers compatible).
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

async function notionFetch(path: string, body?: Record<string, unknown>) {
  const res = await fetch(`${NOTION_API}${path}`, {
    method: body ? "POST" : "GET",
    headers: headers(),
    ...(body && { body: JSON.stringify(body) }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion API error ${res.status}: ${err}`);
  }
  return res.json();
}

const databaseId = process.env.NOTION_DATABASE_ID || "";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  publishedAt: string;
  tags: string[];
  author: string;
}

export interface BlogPostWithContent extends BlogPost {
  blocks: NotionBlock[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NotionBlock = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getPropertyValue(page: any, key: string) {
  const prop = page.properties[key];
  if (!prop) return null;

  switch (prop.type) {
    case "title":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return prop.title.map((t: any) => t.plain_text).join("");
    case "rich_text":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return prop.rich_text.map((t: any) => t.plain_text).join("");
    case "date":
      return prop.date?.start ?? null;
    case "multi_select":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return prop.multi_select.map((s: any) => s.name);
    case "select":
      return prop.select?.name ?? null;
    case "url":
      return prop.url;
    case "checkbox":
      return prop.checkbox;
    default:
      return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCoverImage(page: any): string | null {
  if (!page.cover) return null;
  if (page.cover.type === "external") return page.cover.external.url;
  if (page.cover.type === "file") return page.cover.file.url;
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pageToPost(page: any): BlogPost {
  return {
    id: page.id,
    slug: getPropertyValue(page, "Slug") || page.id,
    title:
      getPropertyValue(page, "Title") ||
      getPropertyValue(page, "Name") ||
      "Untitled",
    description: getPropertyValue(page, "Description") || "",
    coverImage: getCoverImage(page),
    publishedAt:
      getPropertyValue(page, "Published") ||
      getPropertyValue(page, "Date") ||
      page.created_time,
    tags: getPropertyValue(page, "Tags") || [],
    author: getPropertyValue(page, "Author") || "ClawLink",
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await notionFetch(`/databases/${databaseId}/query`, {
    filter: {
      property: "Status",
      select: {
        equals: "Published",
      },
    },
    sorts: [
      {
        property: "Published",
        direction: "descending",
      },
    ],
  });

  return response.results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((page: any) => "properties" in page)
    .map(pageToPost);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPostWithContent | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = await notionFetch(`/databases/${databaseId}/query`, {
    filter: {
      and: [
        {
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
        {
          property: "Status",
          select: {
            equals: "Published",
          },
        },
      ],
    },
  });

  const page = response.results[0];
  if (!page || !("properties" in page)) return null;

  const blocks = await getAllBlocks(page.id);

  return {
    ...pageToPost(page),
    blocks,
  };
}

async function getAllBlocks(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ page_size: "100" });
    if (cursor) params.set("start_cursor", cursor);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await notionFetch(
      `/blocks/${blockId}/children?${params.toString()}`
    );

    for (const block of response.results) {
      if ("type" in block) {
        blocks.push(block);

        if (block.has_children) {
          const children = await getAllBlocks(block.id);
          block.children = children;
        }
      }
    }

    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return blocks;
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((p) => p.slug);
}
