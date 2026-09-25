import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useToast } from "../context/ToastContext";

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation — match the backend rules exactly.
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (content.trim().length < 10) {
      setError("Content must be at least 10 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/blogs", {
        title: title.trim(),
        content: content.trim(),
      });
      notify("Blog created successfully!");
      setTimeout(() => navigate(`/blogs/${data.blog._id}`), 600);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create a New Blog</h1>
        <p className="muted">Share your ideas with the community.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A catchy title (3+ characters)"
            maxLength={200}
          />
        </label>

        <label>
          Content
          <textarea
            rows="10"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here (10+ characters)..."
          />
        </label>

        <div className="form-actions">
          <Link to="/" className="btn btn-outline">
            Cancel
          </Link>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPage;