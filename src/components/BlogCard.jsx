import { Link } from "react-router-dom";
import { timeAgo } from "../utils/formatDate";

// Estimates reading time from word count (~200 words / minute).
const readingTime = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

// Shows a single blog as a card on the Home / My Blogs pages.
const BlogCard = ({ blog, actions }) => {
  // Simple excerpt from the plain-text content.
  const excerpt =
    blog.content.length > 180
      ? blog.content.slice(0, 180).trimEnd() + "…"
      : blog.content;

  const authorName =
    blog.author?.name || (typeof blog.author === "string" ? "Unknown" : "");

  return (
    <article className="blog-card">
      <div className="blog-card-meta">
        <span className="blog-card-meta-group">
          <span className="avatar-xs" aria-hidden="true">
            {initials(authorName)}
          </span>
          <span className="blog-card-author">{authorName}</span>
        </span>
        <span className="blog-card-date">{timeAgo(blog.createdAt)}</span>
      </div>
      <h3 className="blog-card-title">
        <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
      </h3>
      <p className="blog-card-excerpt">{excerpt}</p>
      <div className="blog-card-actions">
        <Link to={`/blogs/${blog._id}`} className="btn btn-outline btn-sm">
          Read more
        </Link>
        <span className="blog-card-readtime muted">
          {!actions && `${readingTime(blog.content)} min read`}
        </span>
        {actions}
      </div>
    </article>
  );
};

export default BlogCard;