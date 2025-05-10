// src/routes/index.jsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

// Layouts
import AuthLayout from '../layouts/AuthLayout.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

// Pages
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ForgotPasswordPage from '../pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '../pages/ResetPasswordPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
// --- ADDED Appointment Pages ---
import AppointmentsPage from '../pages/AppointmentsPage.jsx';
import AppointmentDetailPage from '../pages/AppointmentDetailPage.jsx';
import BookAppointmentPage from '../pages/BookAppointmentPage.jsx';
// --- END ADDED ---

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
      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/profile', element: <ProfilePage /> },
          // --- ADDED Appointment Routes ---
          { path: '/appointments', element: <AppointmentsPage /> },
          { path: '/appointments/:appointmentId', element: <AppointmentDetailPage /> },
          // Route for cancelling an appointment could be part of AppointmentDetailPage UI
          // or a specific route like /appointments/:appointmentId/cancel if needed
          { path: '/book-appointment', element: <BookAppointmentPage /> },
          // --- END ADDED ---
          { path: '/', element: <Navigate to="/dashboard" replace /> },
        ],
      },
      // Publicly accessible routes using MainLayout (e.g., 404)
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
