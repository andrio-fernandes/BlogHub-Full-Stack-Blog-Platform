import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

// Shows a single blog as a card on the Home / My Blogs pages.
const BlogCard = ({ blog }) => {
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
        <span className="blog-card-author">{authorName}</span>
        <span className="blog-card-date">{formatDate(blog.createdAt)}</span>
      </div>
      <h3 className="blog-card-title">
        <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
      </h3>
      <p className="blog-card-excerpt">{excerpt}</p>
      <Link to={`/blogs/${blog._id}`} className="btn btn-ghost btn-sm">
        Read more
      </Link>
    </article>
  );
};

export default BlogCard;