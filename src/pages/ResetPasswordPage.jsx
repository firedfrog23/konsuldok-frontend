// src/pages/ResetPasswordPage.jsx
import React from 'react';
import ResetPasswordForm from '../components/auth/ResetPasswordForm.jsx'; // Ensure .jsx extension
import AuthLayout from '../layouts/AuthLayout.jsx'; // Ensure .jsx extension

/**
 * Page for users to reset their password using a token.
 * This page uses AuthLayout and ResetPasswordForm, which are already themed
 * to adhere to the strict 3-color palette and UI/UX standards.
 */
function ResetPasswordPage() {
    return (
        // AuthLayout handles its own theming (Blue/White/Black).
        <AuthLayout>
            {/* ResetPasswordForm handles its own theming (Black titles, Blue buttons/links, White inputs). */}
            <ResetPasswordForm />
        </AuthLayout>
    );
}

export default ResetPasswordPage;
