import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/lib/notion-blog";
import { NotionRenderer } from "@/components/NotionRenderer";
import { CopyMarkdownButton } from "@/components/CopyMarkdownButton";
import { blogPostToMarkdown } from "@/lib/notion-to-md";
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

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Integrations: {
    bg: "rgba(224, 53, 43, 0.10)",
    text: "#FF9A78",
    border: "rgba(224, 53, 43, 0.25)",
  },
  Tutorial: {
    bg: "rgba(139, 92, 246, 0.10)",
    text: "#A78BFA",
    border: "rgba(139, 92, 246, 0.25)",
  },
  Engineering: {
    bg: "rgba(16, 185, 129, 0.10)",
    text: "#34D399",
    border: "rgba(16, 185, 129, 0.25)",
  },
  Release: {
    bg: "rgba(245, 158, 11, 0.10)",
    text: "#FBBF24",
    border: "rgba(245, 158, 11, 0.25)",
  },
  Updates: {
    bg: "rgba(59, 130, 246, 0.10)",
    text: "#60A5FA",
    border: "rgba(59, 130, 246, 0.25)",
  },
};

const DEFAULT_TAG = {
  bg: "rgba(255, 255, 255, 0.06)",
  text: "var(--mk-fg-muted, rgba(255,255,255,0.72))",
  border: "rgba(255, 255, 255, 0.12)",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = toAbsoluteUrl(`/blog/${post.slug}`);
  const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`;
  const tagColors = post.tags.map(
    (tag) => TAG_COLORS[tag] ?? DEFAULT_TAG
  );
  const postMarkdown = blogPostToMarkdown({
    title: post.title,
    description: post.description,
    author: post.author,
    publishedAt: post.publishedAt,
    tags: post.tags,
    slug: post.slug,
    blocks: post.blocks,
  });

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
    <article className="blog-post-article">
      <Script id={`blog-post-schema-${post.id}`} type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>

      <div className="blog-post-hero">
        <Link href="/blog" className="blog-post-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="blog-post-tags-row">
          {post.tags.map((tag, i) => (
            <span
              key={tag}
              className="blog-card-tag"
              style={{
                background: tagColors[i].bg,
                color: tagColors[i].text,
                borderColor: tagColors[i].border,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="blog-post-title">{post.title}</h1>

        {post.description && (
          <p className="blog-post-description">{post.description}</p>
        )}

        <div className="blog-post-meta-row">
          <div className="blog-post-author-block">
            <div className="blog-post-author-avatar">
              {getInitials(post.author)}
            </div>
            <div className="blog-post-author-info">
              <span className="blog-post-author-name">{post.author}</span>
              <time className="blog-post-date">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>

          <div className="blog-post-share">
            <CopyMarkdownButton markdown={postMarkdown} />
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-post-share-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share
            </a>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="blog-post-cover">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1180}
            height={440}
            className="blog-post-cover-img"
            priority
            sizes="(min-width: 768px) calc(100vw - 4rem), calc(100vw - 3rem)"
            unoptimized
          />
        </div>
      )}

      <div className="blog-post-prose">
        <NotionRenderer blocks={post.blocks} />
      </div>

      <footer className="blog-post-footer">
        <hr className="blog-post-divider" />
        <div className="blog-post-footer-inner">
          <Link href="/blog" className="blog-post-footer-back">
            &larr; All posts
          </Link>
          <div className="blog-post-footer-share">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="blog-post-share-btn"
            >
              Share on X
            </a>
          </div>
        </div>
      </footer>
    </article>
  );
}
