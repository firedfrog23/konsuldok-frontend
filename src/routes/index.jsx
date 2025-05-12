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
// Note: AuthLayout is imported but not explicitly used in the router config below.
// It might be intended for wrapping the public auth routes directly in their respective page components
// or could be added here if needed.
import AuthLayout from '../layouts/AuthLayout.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

// Import Pages
// Public Auth Pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';

// General Authenticated Pages
import NotFoundPage from '../pages/NotFoundPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';

// Shared Appointment Pages
import AppointmentDetailPage from '../pages/AppointmentDetailPage.jsx'; // Detail page for both Patient and Doctor

// Patient Specific Pages
import AppointmentsPage from '../pages/AppointmentsPage.jsx'; // Patient's appointments list
import BookAppointmentPage from '../pages/BookAppointmentPage.jsx';
// --- ADDED Phase 5 Patient Pages ---
import MedicalRecordsPortalPage from "../pages/patient/MedicalRecordsPortalPage.jsx"
import LabResultsPage from '../pages/patient/LabResultsPage.jsx';
import MedicationsPage from '../pages/patient/MedicationsPage.jsx';
import HealthGoalsPage from '../pages/patient/HealthGoalsPage.jsx';
// --- END ADDED ---

// Doctor Specific Pages
import DoctorAppointmentsPage from '../pages/doctor/DoctorAppointmentsPage.jsx'; // Doctor's appointments list

// Potentially Admin Pages (Example - requires creating the component)
// import AdminUserManagementPage from '../pages/admin/AdminUserManagementPage.jsx';

/**
 * General ProtectedRoute: Checks for authentication.
 * Redirects to login if not authenticated.
 * Displays a loading spinner while authentication status is being determined.
 * @param {object} props
 * @param {string} [props.redirectTo='/login'] - Path to redirect to if not authenticated.
 */
function ProtectedRoute({ redirectTo = '/login' }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Display a full-page loading indicator while checking auth status
    return (
      <div className="flex justify-center items-center min-h-screen bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, saving the intended destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render the nested routes if authenticated
  return <Outlet />;
}

/**
 * RoleProtectedRoute: Checks for authentication AND specific user roles.
 * Redirects to login if not authenticated, or to a specified route (defaulting to dashboard)
 * if the user role is not allowed.
 * Displays a loading spinner while authentication/user data is loading.
 * @param {object} props
 * @param {Array<string>} props.allowedRoles - Array of roles allowed to access the route.
 * @param {string} [props.redirectTo='/dashboard'] - Path to redirect to if role is not allowed.
 */
const RoleProtectedRoute = ({ allowedRoles, redirectTo = '/dashboard' }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Display a loading indicator while checking auth/user status
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if the user exists and their role is included in the allowed roles
    if (!allowedRoles || !user?.role || !allowedRoles.includes(user.role)) {
        console.warn(`Role-based access denied for user role: ${user?.role}. Allowed: ${allowedRoles.join(', ')} to ${location.pathname}`);
        // Redirect to a fallback page (e.g., dashboard) if role is not permitted
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Render the nested routes if authenticated and role is allowed
    return <Outlet />;
};


// Define the application's routes using createBrowserRouter
const router = createBrowserRouter([
  // Public Auth Routes (Typically don't use MainLayout)
  // Consider wrapping these with AuthLayout if needed, either here or within the page components.
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },

  // Routes using MainLayout (for authenticated users)
  {
    element: <MainLayout />, // Apply MainLayout to all nested routes
    children: [
      // Protected Routes (Require authentication, but no specific role)
      {
        element: <ProtectedRoute />, // Ensures user is logged in
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },

          // Appointment Detail Page (Accessible by Patient AND Doctor)
          {
            element: <RoleProtectedRoute allowedRoles={[UserRoles.PATIENT, UserRoles.DOCTOR]} redirectTo="/dashboard" />,
            children: [
              { path: '/appointments/:appointmentId', element: <AppointmentDetailPage /> },
            ]
          },

          // Patient-specific routes (Require PATIENT role)
          {
            element: <RoleProtectedRoute allowedRoles={[UserRoles.PATIENT]} redirectTo="/dashboard" />,
            children: [
                { path: '/appointments', element: <AppointmentsPage /> }, // Patient's list view
                { path: '/book-appointment', element: <BookAppointmentPage /> },
                // --- ADDED Phase 5 Patient Routes ---
                { path: '/medical-records', element: <MedicalRecordsPortalPage /> },
                { path: '/lab-results', element: <LabResultsPage /> },
                { path: '/medications', element: <MedicationsPage /> },
                { path: '/health-goals', element: <HealthGoalsPage /> },
                // --- END ADDED ---
            ]
          },

          // Doctor Specific Routes (Require DOCTOR role)
          {
            element: <RoleProtectedRoute allowedRoles={[UserRoles.DOCTOR]} redirectTo="/dashboard" />,
            children: [
              { path: '/doctor/appointments', element: <DoctorAppointmentsPage /> }, // Doctor's list view
              // Add other doctor-specific routes here, e.g.:
              // { path: '/doctor/schedule', element: <DoctorSchedulePage /> },
            ]
          },

          // Example: Admin Specific Routes (Require ADMIN role)
          // {
          //   element: <RoleProtectedRoute allowedRoles={[UserRoles.ADMIN]} redirectTo="/dashboard" />,
          //   children: [
          //     { path: '/admin/users', element: <AdminUserManagementPage /> },
          //     // Add other admin routes here
          //   ]
          // },

          // Default redirect for authenticated users accessing the root path '/'
          { path: '/', element: <Navigate to="/dashboard" replace /> },
        ],
      }, // End of general ProtectedRoute children

      // Catch-all for 404 Not Found within the MainLayout
      // This renders NotFoundPage inside the MainLayout structure
      { path: '*', element: <NotFoundPage /> },
    ],
  }, // End of MainLayout routes
]);

/**
 * Main application router component.
 * Sets up the RouterProvider with the defined routes.
 */
function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;