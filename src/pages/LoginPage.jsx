import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const LoginPage = () => {
  const { login } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Return the user to the page they originally wanted.
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      notify("Logged in successfully!");
      setTimeout(() => navigate(from, { replace: true }), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Login</h1>
        <p className="muted">Welcome back! Sign in to your account.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </label>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted center">
          No account yet? <Link to="/register">Create one here</Link>.
        </p>
      </form>
    </div>
  );
};

export default LoginPage;