import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Use .jsx

function DashboardPage() {
	const { user } = useAuth();
	return (
		<div>
		<h1 className="text-2xl font-bold text-primary mb-4">Dashboard</h1>
		<p>Welcome, {user?.firstName || 'User'}!</p>
		<p>Your role is: {user?.role}</p>
		{/* Add more dashboard content later */}
		</div>
	);
}
export default DashboardPage;