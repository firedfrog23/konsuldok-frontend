// src/routes/index.jsx
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';

// Import Contexts & Hooks
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserRoles } from '../utils/constants.js'; // Ensure this path is correct

// Import Layouts
import AuthLayout from '../layouts/AuthLayout.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

// Import Pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import AppointmentsPage from '../pages/AppointmentsPage.jsx'; // Patient's appointments list
import AppointmentDetailPage from '../pages/AppointmentDetailPage.jsx'; // Detail page for both
import BookAppointmentPage from '../pages/BookAppointmentPage.jsx';
import DoctorAppointmentsPage from '../pages/doctor/DoctorAppointmentsPage.jsx'; // Doctor's appointments list

/**
 * General ProtectedRoute: Checks for authentication.
 * Redirects to login if not authenticated.
 * @param {object} props
 * @param {string} [props.redirectTo='/login'] - Path to redirect to if not authenticated.
 */
function ProtectedRoute({ redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <Outlet />; // Renders child routes if authenticated
}

/**
 * RoleProtectedRoute: Checks for authentication AND specific user roles.
 * @param {object} props
 * @param {Array<string>} props.allowedRoles - Array of roles allowed to access the route.
 * @param {string} [props.redirectTo='/dashboard'] - Path to redirect to if role is not allowed.
 */
const RoleProtectedRoute = ({ allowedRoles, redirectTo = '/dashboard' }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles || !user?.role || !allowedRoles.includes(user.role)) {
        console.warn(`Role-based access denied for user role: ${user?.role}. Allowed: ${allowedRoles.join(', ')} to ${location.pathname}`);
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Outlet />;
};


const router = createBrowserRouter([
  // Public Auth Routes
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },

  // Routes using MainLayout
  {
    element: <MainLayout />,
    children: [
      // Protected Routes (General - for any authenticated user)
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },

          // --- MODIFIED: Appointment Detail Page accessible by Patient AND Doctor ---
          {
            element: <RoleProtectedRoute allowedRoles={[UserRoles.PATIENT, UserRoles.DOCTOR]} redirectTo="/dashboard" />,
            children: [
              { path: '/appointments/:appointmentId', element: <AppointmentDetailPage /> },
            ]
          },
          // --- END MODIFICATION ---

          // Patient-specific appointment routes
          {
            element: <RoleProtectedRoute allowedRoles={[UserRoles.PATIENT]} redirectTo="/dashboard" />,
            children: [
                { path: '/appointments', element: <AppointmentsPage /> }, // Patient's list view
                { path: '/book-appointment', element: <BookAppointmentPage /> },
            ]
          },
          // Doctor Specific Routes
          {
            element: <RoleProtectedRoute allowedRoles={[UserRoles.DOCTOR]} redirectTo="/dashboard" />,
            children: [
              { path: '/doctor/appointments', element: <DoctorAppointmentsPage /> }, // Doctor's list view
              // Add other doctor-specific routes here, e.g., /doctor/schedule-management
            ]
          },
          // Example: Admin Specific Routes (You would create AdminUserManagementPage)
          // {
          //   element: <RoleProtectedRoute allowedRoles={[UserRoles.ADMIN]} redirectTo="/dashboard" />,
          //   children: [
          //     { path: '/admin/users', element: <AdminUserManagementPage /> },
          //   ]
          // },
          { path: '/', element: <Navigate to="/dashboard" replace /> }, // Default for authenticated users
        ],
      },
      // Catch-all for 404 Not Found (also uses MainLayout)
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

/**
 * Main application router component.
 */
function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
