import Link from "next/link";
import { getBlogPosts } from "@/lib/notion-blog";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | ClawLink",
  description:
    "Thoughts on AI agents, integrations, and building with OpenClaw.",
  openGraph: {
    title: "Blog | ClawLink",
    description:
      "Thoughts on AI agents, integrations, and building with OpenClaw.",
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-[720px] px-5 py-16 sm:py-24">
      <h1
        className="text-3xl font-bold tracking-tight sm:text-4xl"
        style={{ color: "var(--blog-fg)" }}
      >
        Blog
      </h1>
      <p
        className="mt-2 text-base leading-relaxed"
        style={{ color: "var(--blog-fg-muted)" }}
      >
        Thoughts on AI agents, integrations, and building with OpenClaw.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-sm" style={{ color: "var(--blog-fg-faint)" }}>
          No posts yet. Check back soon.
        </p>
      ) : (
        <div className="mt-12 flex flex-col gap-10">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div
                className="text-xs"
                style={{ color: "var(--blog-fg-faint)" }}
              >
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {post.author && ` · ${post.author}`}
              </div>
              <h2
                className="mt-1.5 text-xl font-semibold tracking-tight group-hover:text-[var(--blog-accent)] transition-colors"
                style={{ color: "var(--blog-fg)", letterSpacing: "-0.02em" }}
              >
                {post.title}
              </h2>
              {post.description && (
                <p
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: "var(--blog-fg-muted)" }}
                >
                  {post.description}
                </p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        background: "var(--blog-surface)",
                        color: "var(--blog-fg-muted)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
