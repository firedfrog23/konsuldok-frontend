import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import AuthLayout from '../layouts/AuthLayout';

function LoginPage() {
	return (
		<AuthLayout>
			<LoginForm />
		</AuthLayout>
	);
}

export default LoginPage;