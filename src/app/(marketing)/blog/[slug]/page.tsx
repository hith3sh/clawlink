import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/notion-blog";
import { NotionRenderer } from "@/components/NotionRenderer";
import type { Metadata } from "next";
import {
  ORGANIZATION_LOGO,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  toAbsoluteImageUrl,
  toAbsoluteUrl,
} from "@/lib/site";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const description = post.description || SITE_DESCRIPTION;
  const canonicalUrl = toAbsoluteUrl(`/blog/${post.slug}`);
  const socialImage = toAbsoluteImageUrl(post.coverImage);

  return {
    title: `${post.title} | ClawLink Blog`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      images: [
        {
          url: socialImage,
          alt: post.title,
        },
      ],
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [socialImage],
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

  const canonicalUrl = toAbsoluteUrl(`/blog/${post.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || SITE_DESCRIPTION,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    image: [toAbsoluteImageUrl(post.coverImage)],
    mainEntityOfPage: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO,
      },
    },
  };

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16 sm:px-8 sm:py-24">
      <Script id={`blog-post-schema-${post.id}`} type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
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
