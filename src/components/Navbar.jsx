import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active" : "");

  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    setBusy(true);
    setTimeout(() => {
      logout();
      setBusy(false);
      navigate("/");
    }, 150);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={close}>
          BlogHub
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={`nav-menu ${open ? "open" : ""}`}>
          <NavLink to="/" className={linkClass} end onClick={close}>
            Home
          </NavLink>

          {user ? (
            <>
              <NavLink to="/my-blogs" className={linkClass} onClick={close}>
                My Blogs
              </NavLink>
              <NavLink to="/blogs/new" className={linkClass} onClick={close}>
                Create
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" className={linkClass} onClick={close}>
                  Admin
                </NavLink>
              )}
              <NavLink to="/profile" className={linkClass} onClick={close}>
                Profile
              </NavLink>
              <button className="btn btn-outline btn-sm" onClick={handleLogout} disabled={busy}>
                {busy ? "..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={close}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm" onClick={close}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;