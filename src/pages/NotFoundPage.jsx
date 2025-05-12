// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // Example icon

/**
 * 404 Not Found Page. Adheres to strict 3-color palette.
 * - Rendered within MainLayout (White BG).
 * - Large "404" text uses Black (themed from text-secondary).
 * - Other text uses Black (text-base-content).
 * - Button (btn-primary) is Blue.
 * - Icon (optional) would be Black.
 */
function NotFoundPage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center text-center py-10 md:py-20">
            {/* Optional: Icon, text-neutral (Black) */}
            <ExclamationTriangleIcon className="w-20 h-20 text-neutral opacity-50 mb-6" />

            {/* "404" Text: text-secondary maps to Black */}
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-extrabold text-secondary mb-4">
                404
            </h1>
            {/* Heading: text-base-content is Black */}
            <h2 className="text-2xl sm:text-3xl font-semibold text-base-content mb-4">
                Oops! Page Not Found.
            </h2>
            {/* Paragraph: text-base-content (Black) with opacity */}
            <p className="text-base-content/80 mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>
            {/* Button: btn-primary is Blue BG, White text */}
            <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                className="btn btn-primary"
            >
                {isAuthenticated ? "Go to Dashboard" : "Go to Homepage"}
            </Link>
        </div>
    );
}

export default NotFoundPage;
