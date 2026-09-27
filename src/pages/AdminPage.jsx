import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";

// Admin dashboard: lists every user and every blog, with admin delete powers.
// ProtectedRoute guarantees a logged-in user; this page also guards the role.
const AdminPage = () => {
  const { user } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Client-side guard — the server enforces this too via /api/admin.
  const isAdmin = user && user.role === "admin";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [blogsRes, usersRes] = await Promise.all([
        api.get("/blogs"),
        api.get("/admin/users"),
      ]);
      setBlogs(blogsRes.data.blogs);
      setUsers(usersRes.data.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteBlog = async (blog) => {
    if (
      !window.confirm(
        `Delete "${blog.title}" by ${blog.author?.name || "Unknown"}? This cannot be undone.`
      )
    ) {
      return;
    }
    setDeletingId(blog._id);
    setError("");
    try {
      await api.delete(`/admin/blogs/${blog._id}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container page" aria-hidden="true">
        <div className="skeleton thin" style={{ width: "180px", height: "28px" }} />
        <div className="skeleton-block" style={{ marginTop: "1.5rem" }} />
        <div className="skeleton-block" style={{ marginTop: "1.5rem" }} />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Admin Panel</h1>
        <p className="muted">Manage users and content.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <section className="comments">
        <h2>Users ({users.length})</h2>
        <ul className="comment-list">
          {users.map((u) => (
            <li key={u._id} className="comment-item">
              <div className="comment-head">
                <span className="avatar-small" aria-hidden="true">
                  {(u.name || "?").charAt(0).toUpperCase()}
                </span>
                <div>
                  <span className="comment-author">{u.name}</span>
                  <span className="comment-date">{u.email}</span>
                </div>
                <span
                  className={
                    u.role === "admin" ? "badge badge-admin" : "badge badge-user"
                  }
                >
                  {u.role || "user"}
                </span>
                <span className="comment-date">
                  Joined {formatDate(u.createdAt)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="comments">
        <h2>All Blogs ({blogs.length})</h2>
        {blogs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              ✎
            </span>
            <h2>No blogs published yet</h2>
            <p>Published blogs across all users will show up here.</p>
          </div>
        ) : (
          <ul className="comment-list">
            {blogs.map((blog) => (
              <li key={blog._id} className="comment-item">
                <div className="comment-head">
                  <Link to={`/blogs/${blog._id}`} className="comment-author">
                    {blog.title}
                  </Link>
                  <span className="comment-date">
                    by {blog.author?.name || "Unknown"}
                  </span>
                  <button
                    className="comment-delete"
                    onClick={() => handleDeleteBlog(blog)}
                    disabled={deletingId === blog._id}
                  >
                    {deletingId === blog._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AdminPage;