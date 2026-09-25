import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null; // ProtectedRoute guarantees a user here anyway.

  const initials = user.name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="container page auth-page">
      <div className="auth-card profile-card">
        <h1>My Profile</h1>

        <div className="profile-avatar">{initials}</div>

        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span>{user.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span>{user.email}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Role</span>
          <span className="capitalize">{user.role || "user"}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Member since</span>
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;