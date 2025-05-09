import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen text-center">
		<h1 className="text-6xl font-bold text-secondary mb-4">404</h1>
		<p className="text-xl mb-8">Oops! Page Not Found.</p>
		<Link to="/dashboard" className="btn btn-primary">
			Go to Dashboard
		</Link>
		</div>
	);
}
export default NotFoundPage;