// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/auth/LoginForm.jsx'; // Ensure .jsx extension
import AuthLayout from '../layouts/AuthLayout.jsx'; // Ensure .jsx extension

/**
 * Page for user login.
 * This page uses AuthLayout and LoginForm, which are already themed
 * to adhere to the strict 3-color palette and UI/UX standards.
 * - AuthLayout provides the overall page structure with themed visual elements.
 * - LoginForm handles the specific form elements, also themed.
 */
function LoginPage() {
    return (
        // AuthLayout handles its own theming (Blue/White/Black).
        <AuthLayout>
            {/* LoginForm handles its own theming (Black titles, Blue buttons/links, White inputs). */}
            <LoginForm />
        </AuthLayout>
    );
}

export default LoginPage;
