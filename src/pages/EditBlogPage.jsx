import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const EditBlogPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true); // fetching the existing post
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/blogs/${id}`)
      .then(({ data }) => {
        const blog = data.blog;
        // Security on the frontend too: non-owners get sent back home.
        const isOwner =
          user && String(blog.author?._id || blog.author) === String(user._id);
        if (!isOwner) {
          navigate("/", { replace: true });
          return;
        }
        setTitle(blog.title);
        setContent(blog.content);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (content.trim().length < 10) {
      setError("Content must be at least 10 characters.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/blogs/${id}`, {
        title: title.trim(),
        content: content.trim(),
      });
      notify("Blog updated successfully!");
      setTimeout(() => navigate(`/blogs/${id}`), 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container page auth-page">
        <div className="auth-card" aria-hidden="true">
          <div className="skeleton title" style={{ width: "45%" }} />
          <div className="skeleton thin" style={{ width: "60%", marginTop: "0.5rem" }} />
          <div className="skeleton" style={{ height: 200, marginTop: "1.25rem" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="container page auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Edit Blog</h1>
        <p className="muted">Update your blog and save the changes.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
          />
        </label>

        <label>
          Content
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <div className="form-actions">
          <Link to={`/blogs/${id}`} className="btn btn-outline">
            Cancel
          </Link>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;