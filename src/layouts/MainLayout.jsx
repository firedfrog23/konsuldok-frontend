// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/navigation/Footer.jsx'; // Import Footer
import Navbar from '../components/navigation/Navbar.jsx'; // Import Navbar

/**
 * Main application layout for authenticated users.
 * Includes Navbar, Footer, and renders child routes via Outlet.
 */
function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-base-100"> {/* Ensure base background */}
            <Navbar /> {/* Use the Navbar component */}

            {/* Content Area */}
            {/* flex-grow allows main content to fill available space */}
            <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <Outlet /> {/* Protected page content renders here */}
            </main>

            <Footer /> {/* Use the Footer component */}
        </div>
    );
}
export default MainLayout;