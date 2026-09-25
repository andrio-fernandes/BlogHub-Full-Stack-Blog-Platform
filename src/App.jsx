import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import EditBlogPage from "./pages/EditBlogPage";
import MyBlogsPage from "./pages/MyBlogsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public: anyone can read a blog */}
          <Route path="/blogs/:id" element={<BlogDetailsPage />} />

          {/* Private: must be logged in */}
          <Route
            path="/blogs/new"
            element={
              <ProtectedRoute>
                <CreateBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id/edit"
            element={
              <ProtectedRoute>
                <EditBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-blogs"
            element={
              <ProtectedRoute>
                <MyBlogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        © 2026 Andrio Fernandes · BlogHub — a full-stack blog platform
      </footer>
    </>
  );
};

export default App;