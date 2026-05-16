import { getBlogPosts } from "@/lib/notion-blog";

export const revalidate = 60;

export async function GET() {
  const posts = await getBlogPosts();
  const siteUrl = "https://claw-link.dev";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ClawLink Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Thoughts on AI agents, integrations, and building with OpenClaw.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
