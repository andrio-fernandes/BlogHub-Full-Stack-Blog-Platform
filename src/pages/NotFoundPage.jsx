import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="container page not-found">
      <p className="not-found-code">404</p>
      <h1>Page not found</h1>
      <p className="muted">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;