import { getBlogPosts } from "@/lib/notion-blog";
import { BlogPostCard } from "@/components/BlogPostCard";
import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  toAbsoluteUrl,
} from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | ClawLink",
  description:
    "Thoughts on AI agents, integrations, and building with OpenClaw.",
  openGraph: {
    title: "Blog | ClawLink",
    description:
      "Thoughts on AI agents, integrations, and building with OpenClaw.",
    url: toAbsoluteUrl("/blog"),
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ClawLink blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | ClawLink",
    description:
      "Thoughts on AI agents, integrations, and building with OpenClaw.",
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: toAbsoluteUrl("/blog"),
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  return (
    <div className="blog-index">
      <div className="blog-index-inner">
        <div className="blog-index-header">
          <h1 className="blog-index-title">Blog</h1>
          <p className="blog-index-subtitle">
            Thoughts on AI agents, integrations, and building with OpenClaw.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="blog-index-empty">
            No posts yet. Check back soon.
          </p>
        ) : (
          <>
            <BlogPostCard post={posts[0]} featured index={0} />
            <div className="blog-index-grid">
              {posts.slice(1).map((post, i) => (
                <BlogPostCard key={post.id} post={post} index={i + 1} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}