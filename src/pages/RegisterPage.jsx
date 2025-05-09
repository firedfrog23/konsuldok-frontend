import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import AuthLayout from '../layouts/AuthLayout';

function RegisterPage() {
	return (
		<AuthLayout>
			<RegisterForm />
		</AuthLayout>
	);
}

export default RegisterPage;