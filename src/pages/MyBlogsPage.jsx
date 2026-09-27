import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import BlogCard from "../components/BlogCard";

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
        <div className="skeleton-grid" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton thin" />
              <div className="skeleton title" />
              <div className="skeleton body-tall" />
              <div className="skeleton thin" style={{ width: "30%" }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            ✎
          </span>
          <h2>No posts yet</h2>
          <p>
            You haven't written any blogs yet.{" "}
            <Link to="/blogs/new">Write your first post</Link>.
          </p>
          <Link to="/blogs/new" className="btn btn-primary">
            Create your first blog
          </Link>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                actions={
                  <>
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <span className="badge badge-user">edited</span>
                    )}
                    <Link
                      to={`/blogs/${blog._id}/edit`}
                      className="btn btn-outline btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(blog)}
                      disabled={deletingId === blog._id}
                    >
                      {deletingId === blog._id ? "Deleting…" : "Delete"}
                    </button>
                  </>
                }
              />
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