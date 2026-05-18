import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/notion-blog";
import { SITE_URL } from "@/lib/site";

const staticRoutes: Array<{
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/verify", changeFrequency: "monthly", priority: 0.8 },
  { path: "/security", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.6 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
  {
    path: "/best-clawlink-integrations-for-openclaw-users",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/build-an-openclaw-sales-assistant-with-gmail-and-hubspot",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/integrations/gmail",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    path: "/use-openclaw-to-triage-email-and-schedule-follow-ups",
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts().catch(() => []);

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route.path, SITE_URL).toString(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: new URL(`/blog/${post.slug}`, SITE_URL).toString(),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
