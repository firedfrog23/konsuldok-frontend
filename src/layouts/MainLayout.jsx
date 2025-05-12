// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Link removed as not directly used
import Navbar from '../components/navigation/Navbar.jsx';
import Footer from '../components/navigation/Footer.jsx';

/**
 * Main application layout for authenticated users.
 * Relies on the 3-color palette through its child components (Navbar, Footer)
 * and the global theme applied to `bg-base-100` (White).
 * Page content rendered via Outlet will also adhere to the theme.
 */
function MainLayout() {
    return (
        // Main layout container: White BG (bg-base-100)
        <div className="flex flex-col min-h-screen bg-base-100">
            <Navbar /> {/* Navbar uses themed colors */}

            {/* Main content area: Padding provided, background is White */}
            <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <Outlet /> {/* Page-specific content will be rendered here */}
            </main>

            <Footer /> {/* Footer uses themed colors */}
        </div>
    );
}
export default MainLayout;
