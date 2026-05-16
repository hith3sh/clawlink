import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/notion";
import { NotionRenderer } from "@/components/NotionRenderer";
import type { Metadata } from "next";

// Revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
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
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <a href="/" className="back-link">
        &larr; Back to all posts
      </a>

      <header className="post-header">
        <div className="post-header-meta">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {post.author && ` · ${post.author}`}
        </div>
        <h1>{post.title}</h1>
        {post.description && (
          <p className="post-header-description">{post.description}</p>
        )}
        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="post-tag">
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
          className="post-cover"
        />
      )}

      <NotionRenderer blocks={post.blocks} />
    </article>
  );
}
