import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { formatDate } from "../utils/formatDate";

const MyBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadMyBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/blogs/my");
      setBlogs(data.blogs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBlogs();
  }, []);

  const handleDelete = async (blog) => {
    if (
      !window.confirm(`Delete "${blog.title}"? This cannot be undone.`)
    ) {
      return;
    }
    setDeletingId(blog._id);
    setError("");
    try {
      await api.delete(`/blogs/${blog._id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h1>My Blogs</h1>
        <p className="muted">Posts you have written.</p>
      </div>

      {loading ? (
        <p className="page-feedback">Loading your blogs...</p>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="alert alert-info">
          You haven't written any blogs yet.{" "}
          <Link to="/blogs/new">Write your first post</Link>.
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <div className="blog-card-meta">
                  <span className="blog-card-author">{formatDate(blog.createdAt)}</span>
                  <span className="blog-card-updated">
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt
                      ? "edited"
                      : ""}
                  </span>
                </div>
                <h3 className="blog-card-title">
                  <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
                </h3>
                <p className="blog-card-excerpt">
                  {blog.content.length > 140
                    ? blog.content.slice(0, 140).trimEnd() + "…"
                    : blog.content}
                </p>
                <div className="blog-card-actions">
                  <Link to={`/blogs/${blog._id}`} className="btn btn-ghost btn-sm">
                    Read
                  </Link>
                  <Link to={`/blogs/${blog._id}/edit`} className="btn btn-outline btn-sm">
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(blog)}
                    disabled={deletingId === blog._id}
                  >
                    {deletingId === blog._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="muted count-line">
            Total: {blogs.length} blog{blogs.length === 1 ? "" : "s"}
          </p>
        </>
      )}
    </div>
  );
};

export default MyBlogsPage;