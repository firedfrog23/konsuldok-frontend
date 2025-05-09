import React from 'react';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import AuthLayout from '../layouts/AuthLayout';

function ResetPasswordPage() {
	return (
		<AuthLayout>
			<ResetPasswordForm />
		</AuthLayout>
	);
}

export default ResetPasswordPage;