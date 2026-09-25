import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps routes that require a logged-in user.
// If the session is still being checked, show a placeholder.
// If there is no user, redirect to the login page (remembering where we were).
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="page-feedback">Checking login...</div>;
  }

  if (!user) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export default ProtectedRoute;