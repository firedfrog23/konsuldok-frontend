// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom'; // Added Link
import { useAuth } from '../contexts/AuthContext.jsx';
import Navbar from '../components/navigation/Navbar.jsx'; // Ensure these are created
import Footer from '../components/navigation/Footer.jsx'; // Ensure these are created
// Removed Icon import, assuming Navbar handles its own icons or imports Icon component

/**
 * Main application layout for authenticated users.
 */
function MainLayout() {
    // useAuth and useNavigate might not be directly needed here if Navbar handles it
    // const { user, logout } = useAuth();
    // const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-base-100">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
export default MainLayout;