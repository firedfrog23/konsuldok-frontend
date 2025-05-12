// src/pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../components/auth/RegisterForm.jsx'; // Ensure .jsx extension
import AuthLayout from '../layouts/AuthLayout.jsx'; // Ensure .jsx extension

/**
 * Page for user registration.
 * This page uses AuthLayout and RegisterForm, which are already themed
 * to adhere to the strict 3-color palette and UI/UX standards.
 */
function RegisterPage() {
    return (
        // AuthLayout handles its own theming (Blue/White/Black).
        <AuthLayout>
            {/* RegisterForm handles its own theming (Blue titles/buttons, Black text, White inputs). */}
            <RegisterForm />
        </AuthLayout>
    );
}

export default RegisterPage;
