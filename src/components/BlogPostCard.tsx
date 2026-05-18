import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/notion-blog";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const GRADIENTS = [
  "linear-gradient(135deg, rgba(224,53,43,0.15) 0%, rgba(255,122,74,0.10) 100%)",
  "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(167,139,250,0.10) 100%)",
  "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(52,211,153,0.10) 100%)",
  "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(251,191,36,0.10) 100%)",
  "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(96,165,250,0.10) 100%)",
  "linear-gradient(135deg, rgba(236,72,153,0.12) 0%, rgba(244,114,182,0.08) 100%)",
];

export function BlogPostCard({
  post,
  featured = false,
  index = 0,
}: {
  post: BlogPost;
  featured?: boolean;
  index?: number;
}) {
  const tagColors = post.tags.map(
    (tag) => TAG_COLORS[tag] ?? DEFAULT_TAG
  );

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="blog-card blog-card-featured group"
      >
        {post.coverImage ? (
          <div className="blog-card-image-wrapper">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="blog-card-image"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              unoptimized
            />
            <div className="blog-card-image-overlay" />
          </div>
        ) : (
          <div
            className="blog-card-gradient-hero"
            style={{ background: GRADIENTS[index % GRADIENTS.length] }}
          />
        )}
        <div className="blog-card-featured-content">
          <div className="blog-card-meta">
            <time className="blog-card-date">{formatDate(post.publishedAt)}</time>
            {post.author && (
              <span className="blog-card-author-dot">·</span>
            )}
            {post.author && (
              <span className="blog-card-author">{post.author}</span>
            )}
          </div>
          <h2 className="blog-card-title-featured">{post.title}</h2>
          {post.description && (
            <p className="blog-card-desc-featured">{post.description}</p>
          )}
          {post.tags.length > 0 && (
            <div className="blog-card-tags">
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
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="blog-card group"
    >
      <div className="blog-card-inner">
        {post.coverImage ? (
          <div className="blog-card-thumb-wrapper">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={88}
              height={88}
              className="blog-card-thumb"
              loading="lazy"
              sizes="88px"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="blog-card-gradient-thumb"
            style={{ background: GRADIENTS[index % GRADIENTS.length] }}
          >
            <span className="blog-card-gradient-initials">
              {getInitials(post.title.replace(/^How to Connect\s+/, "").split(" ")[0] || "C")}
            </span>
          </div>
        )}
        <div className="blog-card-body">
          <div className="blog-card-meta">
            <time className="blog-card-date">{formatDate(post.publishedAt)}</time>
            {post.author && (
              <span className="blog-card-author-dot">·</span>
            )}
            {post.author && (
              <span className="blog-card-author">{post.author}</span>
            )}
          </div>
          <h3 className="blog-card-title">{post.title}</h3>
          {post.description && (
            <p className="blog-card-desc">{post.description}</p>
          )}
          {post.tags.length > 0 && (
            <div className="blog-card-tags">
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
          )}
        </div>
      </div>
    </Link>
  );
}
