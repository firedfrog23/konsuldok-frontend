import React from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import AuthLayout from '../layouts/AuthLayout';

function ForgotPasswordPage() {
	return (
		<AuthLayout>
			<ForgotPasswordForm />
		</AuthLayout>
	);
}

export default ForgotPasswordPage;