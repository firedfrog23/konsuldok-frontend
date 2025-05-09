import React from 'react';
import {
	createBrowserRouter,
	Navigate,
	RouterProvider
} from 'react-router-dom';

// Import Layouts
import MainLayout from '../layouts/MainLayout.jsx';

// Import Pages
import DashboardPage from '../pages/DashboardPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';

// Import Route Protection Component
import ProtectedRoute from './ProtectedRoute.jsx';

// Define the browser router configuration
const router = createBrowserRouter([
	// --- Public Routes (Typically Auth related) ---
	// These routes usually don't need the main application layout
	// They might use a simpler AuthLayout or no layout
	{
		path: '/login',
		element: <LoginPage />, // LoginPage likely uses AuthLayout internally
	},
	{
		path: '/register',
		element: <RegisterPage />, // RegisterPage likely uses AuthLayout internally
	},
	{
		path: '/forgot-password',
		element: <ForgotPasswordPage />, // ForgotPasswordPage likely uses AuthLayout internally
	},
	{
		// Token is part of the URL path for reset password
		path: '/reset-password/:token',
		element: <ResetPasswordPage />, // ResetPasswordPage likely uses AuthLayout internally
	},

	// --- Protected Routes ---
	// Routes that require authentication
	{
		// The ProtectedRoute component acts as a guard
		element: <ProtectedRoute />, // Checks if user is authenticated
		children: [
		// Routes nested here will only be accessible if authenticated
		{
			// The MainLayout provides the standard application structure (navbar, sidebar, etc.)
			// All authenticated pages render inside this layout's <Outlet />
			element: <MainLayout />,
			children: [
			{
				path: '/dashboard',
				element: <DashboardPage />, // The actual dashboard page component
			},
			{
				// Default route for authenticated users - redirects to dashboard
				path: '/',
				element: <Navigate to="/dashboard" replace />, // Redirect '/' to '/dashboard'
			},
			// --- Add other protected routes here ---
			// Example:
			// {
			//   path: '/appointments',
			//   element: <AppointmentsPage />, // Assuming you create this page
			// },
			// {
			//   path: '/profile',
			//   element: <ProfilePage />, // Assuming you create this page
			// },
			// {
			//   path: '/patients',
			//   element: <PatientsListPage />, // Assuming you create this page
			// },
			// {
			//   path: '/patients/:patientId',
			//   element: <PatientDetailPage />, // Assuming you create this page
			// },
			// --- End Example Protected Routes ---
			],
		},
		],
	},

	// --- Catch-all for 404 Not Found ---
	// This should be the last route definition
	{
		path: '*',
		element: <NotFoundPage />, // Render your 404 component
	},
]);

/**
 * Main application router component.
 * Provides the configured router to the application.
 */
function AppRouter() {
	// The RouterProvider makes the router available to the app
	return <RouterProvider router={router} />;
}

export default AppRouter;