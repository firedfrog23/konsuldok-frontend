// src/pages/ForgotPasswordPage.jsx
import React from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm.jsx'; // Ensure .jsx extension
import AuthLayout from '../layouts/AuthLayout.jsx'; // Ensure .jsx extension

/**
 * Page for users to request a password reset.
 * This page uses AuthLayout and ForgotPasswordForm, which are already themed
 * to adhere to the strict 3-color palette and UI/UX standards.
 * - AuthLayout provides the overall page structure with themed visual elements.
 * - ForgotPasswordForm handles the specific form elements, also themed.
 */
function ForgotPasswordPage() {
    return (
        // AuthLayout handles its own theming (Blue/White/Black).
        <AuthLayout>
            {/* ForgotPasswordForm handles its own theming (Blue titles/buttons, Black text, White inputs). */}
            <ForgotPasswordForm />
        </AuthLayout>
    );
}

export default ForgotPasswordPage;
