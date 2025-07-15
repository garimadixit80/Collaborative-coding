import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <section className="text-center">
        <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-2">
          Oops! The page <code className="text-red-500">{location.pathname}</code> doesn’t exist.
        </p>
        <p className="text-gray-500 mb-6">It may have been moved or deleted.</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          ⬅ Go Back Home
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
