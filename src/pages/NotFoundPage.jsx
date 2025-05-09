// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // Import useAuth

/**
 * 404 Not Found Page.
 * Renders within MainLayout, so it will have Navbar and Footer.
 * Uses useAuth to determine the appropriate link for the button.
 */
function NotFoundPage() {
  // --- Use useAuth to check authentication status ---
  const { isAuthenticated } = useAuth();

  return (
    // The MainLayout provides overall page structure and padding for <main>
    // This div centers the 404 content within that <main> area
    <div className="flex flex-col items-center justify-center text-center py-10 md:py-20">
      <h1 className="text-6xl sm:text-7xl md:text-9xl font-extrabold text-secondary mb-4">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-semibold text-base-content mb-4">
        Oops! Page Not Found.
      </h2>
      <p className="text-base-content/80 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      {/* --- Button link changes based on authentication status --- */}
      <Link
        to={isAuthenticated ? "/dashboard" : "/"} // Go to dashboard if logged in, else home (which might redirect to login)
        className="btn btn-primary" // Use primary theme color
      >
        {isAuthenticated ? "Go to Dashboard" : "Go to Homepage"}
      </Link>
    </div>
  );
}

export default NotFoundPage;