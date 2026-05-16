import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/notion-blog";
import { NotionRenderer } from "@/components/NotionRenderer";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} | ClawLink Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[720px] px-5 py-16 sm:py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
        style={{ color: "var(--blog-fg-faint)" }}
      >
        &larr; All posts
      </Link>

      <header className="mt-6">
        <div className="text-xs" style={{ color: "var(--blog-fg-faint)" }}>
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {post.author && ` · ${post.author}`}
        </div>
        <h1
          className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: "var(--blog-fg)", letterSpacing: "-0.03em" }}
        >
          {post.title}
        </h1>
        {post.description && (
          <p
            className="mt-3 text-lg leading-relaxed"
            style={{ color: "var(--blog-fg-muted)" }}
          >
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
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
      </header>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="mt-8 w-full rounded-xl object-cover"
          style={{ maxHeight: "400px" }}
        />
      )}

      <div className="mt-10">
        <NotionRenderer blocks={post.blocks} />
      </div>
    </div>
  );
}
