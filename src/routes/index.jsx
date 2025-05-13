// src/routes/index.jsx
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation
} from 'react-router-dom';

// Import Contexts & Hooks
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserRoles } from '../utils/constants.js';

// Import Layouts
// AuthLayout is used by individual auth pages.
import MainLayout from '../layouts/MainLayout.jsx';

// Import Pages
// Public Auth Pages
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';

// General Authenticated Pages
import DashboardPage from '../pages/DashboardPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';

// Shared Appointment Pages
import AppointmentDetailPage from '../pages/AppointmentDetailPage.jsx';

// Patient Specific Pages
import AppointmentsPage from '../pages/AppointmentsPage.jsx';
import BookAppointmentPage from '../pages/BookAppointmentPage.jsx';
import HealthGoalsPage from '../pages/patient/HealthGoalsPage.jsx';
import LabResultsPage from '../pages/patient/LabResultsPage.jsx';
import MedicalRecordsPortalPage from "../pages/patient/MedicalRecordsPortalPage.jsx";
import MedicationsPage from '../pages/patient/MedicationsPage.jsx';
// import PatientDocumentsPage from '../pages/patient/PatientDocumentsPage.jsx'; // Future


// --- PHASE 6: Doctor/Staff Pages ---
import ClinicalPatientChartPage from '../pages/doctor/ClinicalPatientChartPage.jsx';
import DoctorAppointmentsPage from '../pages/doctor/DoctorAppointmentsPage.jsx';
import PatientSearchPage from '../pages/doctor/PatientSearchPage.jsx';
// Import placeholders for new Phase 6 pages (to be created)
// import MedicalNoteEditorPage from '../pages/doctor/MedicalNoteEditorPage.jsx';
// import ClinicalDocumentManagementPage from '../pages/doctor/ClinicalDocumentManagementPage.jsx';
// import LabReviewPage from '../pages/doctor/LabReviewPage.jsx';
// --- END PHASE 6 ---

// Admin Pages (Example)
// import AdminUserManagementPage from '../pages/admin/AdminUserManagementPage.jsx';


/**
 * General ProtectedRoute: Checks for authentication.
 * Redirects to login if not authenticated.
 * Displays a loading spinner while authentication status is being determined.
 * @param {object} props - Component props.
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
 * @param {object} props - Component props.
 * @param {Array<string>} props.allowedRoles - Array of roles allowed to access the route.
 * @param {string} [props.redirectTo='/dashboard'] - Path to redirect to if role is not allowed.
 */
const RoleProtectedRoute = ({ allowedRoles, redirectTo = '/dashboard' }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
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

// Define the application's routes using createBrowserRouter
const router = createBrowserRouter([
    // Public Auth Routes (not using MainLayout)
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/forgot-password', element: <ForgotPasswordPage /> },
    { path: '/reset-password/:token', element: <ResetPasswordPage /> },

    // Routes using MainLayout (for authenticated users)
    {
        element: <MainLayout />,
        children: [
            { // Protected Routes (general authentication required)
                element: <ProtectedRoute />,
                children: [
                    { path: '/dashboard', element: <DashboardPage /> },
                    { path: '/profile', element: <ProfilePage /> },

                    // Patient-specific routes
                    {
                        element: <RoleProtectedRoute allowedRoles={[UserRoles.PATIENT]} redirectTo="/dashboard" />,
                        children: [
                            { path: '/appointments', element: <AppointmentsPage /> }, // Patient's list view
                            { path: '/book-appointment', element: <BookAppointmentPage /> },
                            { path: '/medical-records', element: <MedicalRecordsPortalPage /> },
                            { path: '/lab-results', element: <LabResultsPage /> },
                            { path: '/medications', element: <MedicationsPage /> },
                            { path: '/health-goals', element: <HealthGoalsPage /> },
                            // { path: '/documents', element: <PatientDocumentsPage /> }, // Future placeholder
                        ]
                    },

                    // Routes accessible by multiple roles (Patient, Doctor, Staff, Admin)
                    // Fine-grained access control within components.
                    {
                        element: <RoleProtectedRoute allowedRoles={[UserRoles.PATIENT, UserRoles.DOCTOR, UserRoles.STAFF, UserRoles.ADMIN]} redirectTo="/dashboard" />,
                        children: [
                            { path: '/appointments/:appointmentId', element: <AppointmentDetailPage /> },
                        ]
                    },

                    // Doctor, Staff, Admin specific routes
                    {
                        element: <RoleProtectedRoute allowedRoles={[UserRoles.DOCTOR, UserRoles.STAFF, UserRoles.ADMIN]} redirectTo="/dashboard" />,
                        children: [
                            { path: '/doctor/appointments', element: <DoctorAppointmentsPage /> }, // Doctor's list view
                            { path: '/patients/search', element: <PatientSearchPage /> },
                            { path: '/patient/:patientId/chart', element: <ClinicalPatientChartPage /> },
                            // Uncomment and implement these as pages are built for Phase 6
                            // { path: '/patient/:patientId/notes/new', element: <MedicalNoteEditorPage mode="create" /> },
                            // { path: '/patient/:patientId/notes/:noteId/edit', element: <MedicalNoteEditorPage mode="edit" /> },
                            // { path: '/patient/:patientId/documents/manage', element: <ClinicalDocumentManagementPage /> },
                            // { path: '/doctor/labs/review', element: <LabReviewPage /> },
                        ]
                    },

                    // Admin Specific Routes (Example)
                    // {
                    //     element: <RoleProtectedRoute allowedRoles={[UserRoles.ADMIN]} redirectTo="/dashboard" />,
                    //     children: [
                    //         { path: '/admin/users', element: <AdminUserManagementPage /> },
                    //     ]
                    // },

                    // Default redirect for authenticated users accessing the root path '/'
                    { path: '/', element: <Navigate to="/dashboard" replace /> },
                ],
            },
            // Catch-all for 404 Not Found within the MainLayout
            { path: '*', element: <NotFoundPage /> },
        ],
    },
]);

/**
 * Main application router component.
 * Sets up the RouterProvider with the defined routes.
 */
function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;
