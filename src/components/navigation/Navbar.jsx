// src/components/navigation/Navbar.jsx
import {
	ArrowRightOnRectangleIcon, // Patients / Users
	Bars3Icon // Mobile Menu
	, // Logout
	BellIcon, // Dashboard
	CalendarDaysIcon, // Notifications
	Cog6ToothIcon, // Profile fallback
	Squares2X2Icon, // Settings
	UserCircleIcon, // Appointments
	UserGroupIcon
} from '@heroicons/react/24/outline';
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Main application Navbar component.
 * Adapts based on authentication state and user role.
 */
function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Ensure redirect after logout
    };

    // Define navigation links based on potential roles
    // In a real app, filter these based on user.role
    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon, roles: ['Patient', 'Doctor', 'Staff', 'Admin'] },
        { name: 'Appointments', href: '/appointments', icon: CalendarDaysIcon, roles: ['Patient', 'Doctor', 'Staff', 'Admin'] },
        { name: 'Patients', href: '/patients', icon: UserGroupIcon, roles: ['Doctor', 'Staff', 'Admin'] },
        // Add more links like 'Schedule', 'Billing', etc.
    ];

    const adminLinks = [
		{ name: 'User Management', href: '/admin/users', icon: UserGroupIcon, roles: ['Admin'] },
         // Add other admin links
    ];

    // Filter links based on current user role (example logic)
    const accessibleNavLinks = navLinks.filter(link => user?.role && link.roles.includes(user.role));
    const accessibleAdminLinks = adminLinks.filter(link => user?.role && link.roles.includes(user.role));


    // Helper for NavLink active state
    const navLinkClass = ({ isActive }) =>
        `font-medium px-3 py-2 rounded-md text-sm transition-colors duration-150 ${isActive
            ? 'bg-primary/10 text-primary' // Active link style (Subtle Blue BG, Blue text)
            : 'text-base-content hover:bg-base-200 hover:text-primary' // Default state (Black text, Off-white hover)
        }`;

	const mobileNavLinkClass = ({ isActive }) =>
        `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${isActive
            ? 'bg-primary/10 text-primary'
            : 'text-base-content hover:bg-base-200 hover:text-primary'
        }`;


    return (
        <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 border-b border-black/10 px-4 sm:px-6 lg:px-8">
            {/* Left Side: Brand and Mobile Menu Toggle */}
            <div className="navbar-start">
                {/* Mobile Menu Dropdown */}
                {isAuthenticated && (
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-primary">
                            <Bars3Icon className="h-6 w-6" />
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[51] p-2 shadow bg-base-100 rounded-box w-52">
                            {accessibleNavLinks.map((item) => (
                                <li key={item.name}>
                                    <NavLink to={item.href} className={mobileNavLinkClass}>
                                        <item.icon className="w-4 h-4 mr-2" /> {item.name}
                                    </NavLink>
                                </li>
                            ))}
                            {/* Add Admin links if applicable */}
							{accessibleAdminLinks.length > 0 && <div className="divider my-1"></div>}
							{accessibleAdminLinks.map((item) => (
								<li key={item.name}>
									<NavLink to={item.href} className={mobileNavLinkClass}>
										<item.icon className="w-4 h-4 mr-2" /> {item.name}
									</NavLink>
								</li>
							))}
                        </ul>
                    </div>
                )}
                {/* Brand Logo/Name */}
                <Link to={isAuthenticated ? "/dashboard" : "/"} className="btn btn-ghost text-xl text-primary font-bold normal-case hover:bg-transparent focus:bg-transparent">
                    KonsulDok
                </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <div className="navbar-center hidden lg:flex">
                {isAuthenticated && (
                    <ul className="menu menu-horizontal px-1 space-x-1">
                        {accessibleNavLinks.map((item) => (
							<li key={item.name}>
								<NavLink to={item.href} className={navLinkClass}>
								{/* <item.icon className="w-4 h-4 mr-1 opacity-70" /> */}
								{item.name}
								</NavLink>
							</li>
                        ))}
                         {/* Optional Admin Link */}
                        {accessibleAdminLinks.length > 0 && (
							<li>
                                <NavLink to="/admin/users" className={navLinkClass}> {/* Adjust path */}
                                    Admin Panel
                                </NavLink>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {/* Right Side: Actions/User Menu */}
            <div className="navbar-end">
                {isAuthenticated && user ? (
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Notification Button */}
                        <button className="btn btn-ghost btn-circle hover:bg-secondary/10 focus:bg-secondary/10" aria-label="Notifications">
                            <div className="indicator">
                                <BellIcon className="h-6 w-6 text-secondary" />
                                {/* Example: show badge if there are notifications */}
                                {/* <span className="badge badge-xs badge-primary indicator-item">3</span> */}
                            </div>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-transparent hover:border-primary focus:border-primary transition-colors">
                                <div className="w-10 rounded-full ring-1 ring-primary ring-offset-base-100 ring-offset-1 bg-primary/10 flex items-center justify-center">
                                    {/* Placeholder for actual avatar image later */}
                                    <span className="text-lg text-primary font-semibold">
                                        {user.firstName?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                    {/* <img src={user.avatarUrl || defaultAvatar} alt="User Avatar" /> */}
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[51] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-black/10">
                                <li className="p-2 border-b border-black/10 mb-1">
                                    <p className="text-sm font-semibold text-base-content">{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-base-content/70">{user.email}</p>
                                </li>
                                <li>
                                    <Link to="/profile" className="focus:bg-primary/10 text-base-content">
										<UserCircleIcon className="w-4 h-4 mr-2 opacity-70"/> Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings" className="focus:bg-primary/10 text-base-content">
                                        <Cog6ToothIcon className="w-4 h-4 mr-2 opacity-70"/> Settings
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout} className="text-secondary focus:bg-secondary/10 w-full text-left">
                                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2"/> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    // Buttons shown when not logged in
                    <div className="space-x-2">
						<Link to="/login" className="btn btn-primary btn-outline btn-sm">Login</Link>
						<Link to="/register" className="btn btn-secondary btn-sm">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;