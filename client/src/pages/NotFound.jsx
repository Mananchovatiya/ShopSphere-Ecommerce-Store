import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container empty-state" style={{ minHeight: "60vh" }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}

export default NotFound;
