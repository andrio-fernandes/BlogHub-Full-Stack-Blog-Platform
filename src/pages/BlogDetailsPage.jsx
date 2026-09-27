import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatDateTime, timeAgo } from "../utils/formatDate";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [posting, setPosting] = useState(false);

  const loadBlog = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch the blog and its comments in parallel — faster than two requests one after another.
      const [blogRes, commentsRes] = await Promise.all([
        api.get(`/blogs/${id}`),
        api.get(`/blogs/${id}/comments`),
      ]);
      setBlog(blogRes.data.blog);
      setComments(commentsRes.data.comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOwner =
    blog &&
    user &&
    String(blog.author?._id || blog.author) === String(user._id);

  const isAdmin = user?.role === "admin";

  const handleDeleteBlog = async () => {
    if (!window.confirm("Delete this blog permanently? This cannot be undone.")) {
      return;
    }
    try {
      await api.delete(`/blogs/${id}`);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!commentText.trim()) {
      setCommentError("Please write a comment first.");
      return;
    }

    setPosting(true);
    try {
      const { data } = await api.post(`/blogs/${id}/comments`, {
        text: commentText.trim(),
      });
      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
      notify("Comment posted!");
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (comment) => {
    if (!window.confirm("Delete this comment?")) return;
    setCommentError("");
    try {
      await api.delete(`/comments/${comment._id}`);
      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } catch (err) {
      setCommentError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container page" aria-hidden="true">
        <div className="skeleton thin" style={{ width: "120px", marginBottom: "1rem" }} />
        <div className="skeleton-block" style={{ height: "300px" }} />
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="container page">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    );
  }

  const authorName = blog.author?.name || "Unknown";

  return (
    <div className="container page">
      <article className="single-blog">
        <Link to="/" className="back-link">
          &larr; Back to all blogs
        </Link>

        <h1 className="single-title">{blog.title}</h1>

        <div className="single-meta">
          <span className="avatar-small">{authorName.charAt(0)}</span>
          <span>By <strong>{authorName}</strong></span>
          <span className="dot">•</span>
          <span>Published {formatDateTime(blog.createdAt)}</span>
          {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
            <>
              <span className="dot">•</span>
              <span className="muted">Edited {formatDateTime(blog.updatedAt)}</span>
            </>
          )}
        </div>

        {(isOwner || isAdmin) && (
          <div className="owner-actions">
            {isOwner && (
              <Link to={`/blogs/${id}/edit`} className="btn btn-outline btn-sm">
                Edit
              </Link>
            )}
            <button className="btn btn-danger btn-sm" onClick={handleDeleteBlog}>
              Delete
            </button>
          </div>
        )}

        <div className="single-content">{blog.content}</div>
      </article>

      <section className="comments">
        <h2>Comments ({comments.length})</h2>

        {user ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            {commentError && <div className="alert alert-error">{commentError}</div>}
            <textarea
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={`Comment as ${user.name}...`}
            />
            <button className="btn btn-primary" type="submit" disabled={posting}>
              {posting ? "Posting..." : "Post comment"}
            </button>
          </form>
        ) : (
          <p className="muted">
            <Link to="/login">Log in</Link> to join the discussion.
          </p>
        )}

        {comments.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              💬
            </span>
            <h2>No comments yet</h2>
            <p>Be the first to join the discussion.</p>
          </div>
        ) : (
          <ul className="comment-list">
            {comments.map((comment) => {
              const own =
                user &&
                (String(comment.user?._id || comment.user) === String(user._id) ||
                  isAdmin);
              return (
                <li key={comment._id} className="comment-item">
                  <div className="comment-head">
                    <span className="avatar-small">
                      {(comment.user?.name || "?").charAt(0)}
                    </span>
                    <div>
                      <span className="comment-author">
                        {comment.user?.name || "Unknown"}
                      </span>
                      <span
                        className="comment-date"
                        title={formatDateTime(comment.createdAt)}
                      >
                        {timeAgo(comment.createdAt)}
                      </span>
                    </div>
                    {own && (
                      <button
                        className="comment-delete"
                        onClick={() => handleDeleteComment(comment)}
                        title="Delete comment"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BlogDetailsPage;