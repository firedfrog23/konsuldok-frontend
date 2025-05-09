import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from 'react-router-dom';

// Import Layouts
import AuthLayout from '../layouts/AuthLayout.jsx';
import MainLayout from '../layouts/MainLayout.jsx'; // MainLayout includes Navbar and Footer

// Import Pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';

// Import Route Protection Component
import ProtectedRoute from './ProtectedRoute.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';

// Define the browser router configuration
const router = createBrowserRouter([
  // --- Public Routes (Auth) ---
  // These use AuthLayout which is simpler and typically without main Navbar/Footer
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />,
  },

  // --- Routes that use MainLayout (Navbar and Footer) ---
  // This group includes both protected routes and public-facing pages like 404
  {
    element: <MainLayout />, // All children here get Navbar and Footer
    children: [
      // --- Protected Routes nested under MainLayout ---
      {
        element: <ProtectedRoute />, // Guard for authentication
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            // Default route for authenticated users
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
		  {
			path: '/profile',
			element: <ProfilePage />
		  },
          // ... other protected routes like /profile, /appointments would go here ...
        ],
      },
      // --- Publicly accessible routes also using MainLayout (like 404) ---
      // The NotFoundPage route is defined within MainLayout's children
      // but OUTSIDE of ProtectedRoute if it should be accessible to everyone.
      // If 404 itself should only be for logged-in users, move it inside ProtectedRoute children.
      // Assuming 404 should be generally accessible with nav/footer:
      {
        path: '*', // Catch-all for any undefined routes
        element: <NotFoundPage />,
      },
    ],
  },
  // Note: If you had other public pages like "About Us", "Contact Us"
  // that should have the Navbar and Footer, they would also be children
  // of the route using <MainLayout /> but outside <ProtectedRoute />.
]);

/**
 * Main application router component.
 */
function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;