import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Client-side validation mirrors the rules enforced on the server.
  const validate = () => {
    if (!name.trim() || !email.trim() || !password) {
      return "All fields are required.";
    }
    if (name.trim().length < 3) {
      return "Name must be at least 3 characters.";
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return "Please provide a valid email address.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (password !== confirm) {
      return "Passwords do not match.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      notify("Account created successfully!");
      setTimeout(() => navigate("/", { replace: true }), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create an account</h1>
        <p className="muted">Join BlogHub to start writing and commenting.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
          />
        </label>

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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </label>

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="muted center">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;