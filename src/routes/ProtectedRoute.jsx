import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * A component that checks if the user is authenticated.
 * If authenticated, renders the child routes (`Outlet`).
 * If not authenticated, redirects to the login page, preserving the intended location.
 * Shows a loading indicator while authentication status is being checked.
 *
 * @param {object} props - Component props.
 * @param {string} [props.redirectTo='/login'] - Path to redirect unauthenticated users to.
 */
function ProtectedRoute({ redirectTo = '/login' }) {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		// Show a loading state while checking auth status (important for initial load)
		return (
		<div className="flex justify-center items-center min-h-screen bg-base-100">
			<span className="loading loading-spinner loading-lg text-primary"></span>
		</div>
		);
	}

	if (!isAuthenticated) {
		// Redirect unauthenticated users to the login page
		// Pass the current location state so we can redirect back after login
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	// Render the nested routes (the actual protected page component)
	return <Outlet />;
}

export default ProtectedRoute;