import { useCallback, useEffect, useState } from "react";
import api from "../api";
import BlogCard from "../components/BlogCard";

const HomePage = () => {
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
        <p className="page-feedback">Loading blogs...</p>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="alert alert-info">
          {query
            ? "No blogs matched your search."
            : "No blogs published yet. Be the first to write one!"}
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