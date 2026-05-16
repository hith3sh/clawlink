import { getPosts } from "@/lib/notion";

// Revalidate every 60 seconds — new posts appear without redeploy
export const revalidate = 60;

export default async function BlogIndex() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div>
        <h1 className="page-title">Blog</h1>
        <p className="page-description">
          No posts yet. Write your first post in Notion and set its status to
          &quot;Published&quot;.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Blog</h1>
      <p className="page-description">
        Thoughts on AI agents, integrations, and building with OpenClaw.
      </p>

      <div className="posts-list">
        {posts.map((post) => (
          <a key={post.id} href={`/posts/${post.slug}`} className="post-card">
            <div className="post-card-meta">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {post.author && ` · ${post.author}`}
            </div>
            <h2 className="post-card-title">{post.title}</h2>
            {post.description && (
              <p className="post-card-description">{post.description}</p>
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
          </a>
        ))}
      </div>
    </div>
  );
}
