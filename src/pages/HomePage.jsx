import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/blogs", {
        params: query ? { search: query } : {},
      });
      setBlogs(data.blogs);
    } catch (err) {
      setError(err.message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  return (
    <div className="container page">
      <div className="page-head">
        <h1>Latest Blogs</h1>
        <p className="muted">Read, write, and share with the community.</p>
      </div>

      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search.trim());
        }}
      >
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs by title..."
          aria-label="Search blogs by title"
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {query && (
        <div className="search-summary">
          {loading ? (
            "Searching..."
          ) : (
            <>
              {blogs.length} result{blogs.length === 1 ? "" : "s"} for
              &nbsp;&ldquo;{query}&rdquo;
              <button
                className="clear-search"
                onClick={() => {
                  setSearch("");
                  setQuery("");
                }}
              >
                Clear
              </button>
            </>
          )}
        </div>
      )}

      {loading ? (
        <div className="skeleton-grid" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
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
            {query ? "⌕" : "✎"}
          </span>
          <h2>{query ? "No matches found" : "Nothing published yet"}</h2>
          <p>
            {query
              ? "No blogs matched your search. Try a different title."
              : "Be the first to write one and get the community going."}
          </p>
          {query ? (
            <button
              className="btn btn-outline"
              onClick={() => {
                setSearch("");
                setQuery("");
              }}
            >
              Clear search
            </button>
          ) : user ? (
            <Link to="/blogs/new" className="btn btn-primary">
              Create a blog
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary">
              Get started
            </Link>
          )}
        </div>
      ) : (
        <section className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </section>
      )}
    </div>
  );
};

export default HomePage;