// src/components/navigation/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { UserRoles } from '../../utils/constants.js';
import {
    ArrowRightOnRectangleIcon, // Logout
    BellIcon,                 // Notifications
    Cog6ToothIcon,            // Settings
    UserCircleIcon,           // Profile fallback / link icon
    Squares2X2Icon,           // Dashboard
    CalendarDaysIcon,         // Appointments
    UserGroupIcon,            // Patients / Users
    ShieldCheckIcon,          // Admin Panel
    Bars3Icon,                // Mobile Menu
    XMarkIcon,                // Close Mobile Menu
    BriefcaseIcon             // --- ADDED for Doctor's Schedule ---
} from '@heroicons/react/24/outline';

/**
 * Main application Navbar component.
 * Features:
 * - Responsive design with a mobile drawer/dropdown.
 * - Adapts links and actions based on user authentication status and role.
 * - Includes "Doctor's Schedule" link for users with the DOCTOR role.
 * - Consistent styling using the 4-color theme.
 * - Uses Heroicons for iconography.
 * - Leverages NavLink for active route styling.
 */
function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    // Define navigation links with role-based access
    const mainNavLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon, roles: [UserRoles.PATIENT, UserRoles.DOCTOR, UserRoles.STAFF, UserRoles.ADMIN] },
        // Patient's view of their appointments
        { name: 'My Appointments', href: '/appointments', icon: CalendarDaysIcon, roles: [UserRoles.PATIENT] },
        // Doctor's view of their schedule/appointments
        { name: "My Schedule", href: '/doctor/appointments', icon: BriefcaseIcon, roles: [UserRoles.DOCTOR] },
        // Generic "Patients" link for Doctors, Staff, Admins (could lead to a patient list/search)
        { name: 'Patients', href: '/patients', icon: UserGroupIcon, roles: [UserRoles.DOCTOR, UserRoles.STAFF, UserRoles.ADMIN] },
        // Add more links as needed
    ];

    const adminNavLinks = [
        { name: 'User Management', href: '/admin/users', icon: UserGroupIcon, roles: [UserRoles.ADMIN] },
        { name: 'System Settings', href: '/admin/settings', icon: Cog6ToothIcon, roles: [UserRoles.ADMIN] },
    ];

    const accessibleNavLinks = mainNavLinks.filter(link => isAuthenticated && user?.role && link.roles.includes(user.role));
    const accessibleAdminLinks = adminNavLinks.filter(link => isAuthenticated && user?.role && link.roles.includes(user.role));

    const navLinkClasses = ({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
            isActive ? 'bg-primary/10 text-primary' : 'text-base-content hover:bg-base-200 hover:text-primary'
        }`;

    const mobileNavLinkClasses = ({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out ${ // Added flex items-center
            isActive ? 'bg-primary/10 text-primary' : 'text-base-content hover:bg-base-200 hover:text-primary'
        }`;

    const userInitials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : user?.email?.[0]?.toUpperCase() || 'U';

    return (
        <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 border-b border-black/10 px-4 sm:px-6 lg:px-8">
            <div className="navbar-start">
                {isAuthenticated && (
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-primary hover:bg-primary/10 focus:bg-primary/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </div>
                        {isMobileMenuOpen && (
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[51] p-2 shadow bg-base-100 rounded-box w-64 border border-black/5">
                                {accessibleNavLinks.map((item) => (
                                    <li key={item.name} onClick={() => setIsMobileMenuOpen(false)}>
                                        <NavLink to={item.href} className={mobileNavLinkClasses}>
                                            <item.icon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0" /> {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {accessibleAdminLinks.length > 0 && (
                                    <>
                                        <div className="divider my-1 text-xs text-base-content/50 px-3 pt-1">Admin Tools</div>
                                        {accessibleAdminLinks.map((item) => (
                                            <li key={item.name} onClick={() => setIsMobileMenuOpen(false)}>
                                                <NavLink to={item.href} className={mobileNavLinkClasses}>
                                                    <item.icon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0" /> {item.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </>
                                )}
                                 <div className="divider my-1"></div>
                                 <li>
                                     <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                                        <UserCircleIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> My Profile
                                     </NavLink>
                                 </li>
                                 <li>
                                     <NavLink to="/settings" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                                        <Cog6ToothIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> Settings
                                     </NavLink>
                                 </li>
                                 <li>
                                     <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-secondary/10 focus:bg-secondary/10">
                                         <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> Logout
                                     </button>
                                 </li>
                            </ul>
                        )}
                    </div>
                )}
                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="btn btn-ghost text-xl text-primary font-bold normal-case hover:bg-transparent focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 rounded-md">
                    KonsulDok
                </Link>
            </div>

            <div className="navbar-center hidden lg:flex">
                {isAuthenticated && (
                    <ul className="menu menu-horizontal px-1 space-x-1">
                        {accessibleNavLinks.map((item) => (
                           <li key={item.name}>
                             <NavLink to={item.href} className={navLinkClasses}>
                                {/* Optional: <item.icon className="w-4 h-4 mr-1 opacity-70" /> */}
                                {item.name}
                             </NavLink>
                           </li>
                        ))}
                        {accessibleAdminLinks.length > 0 && (
                             <li>
                                <NavLink to={accessibleAdminLinks[0].href} className={navLinkClasses}>
                                    <ShieldCheckIcon className="w-4 h-4 mr-1 opacity-70" />
                                    Admin Panel
                                </NavLink>
                            </li>
                        )}
                    </ul>
                )}
            </div>

            <div className="navbar-end">
                {isAuthenticated && user ? (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <button className="btn btn-ghost btn-circle hover:bg-secondary/10 focus:bg-secondary/10" aria-label="Notifications">
                            <div className="indicator">
                                <BellIcon className="h-6 w-6 text-secondary" />
                                {/* <span className="badge badge-xs badge-primary indicator-item animate-pulse">3</span> */}
                            </div>
                        </button>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/50 ring-offset-base-100 ring-offset-1">
                                    {user.profilePictureUrl ? (
                                        <img src={user.profilePictureUrl} alt={`${user.firstName}'s Avatar`} className="rounded-full object-cover w-full h-full" />
                                    ) : (
                                        <span className="text-lg font-semibold">
                                            {userInitials}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[51] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-black/10">
                                <li className="px-4 py-2 border-b border-black/10 mb-1">
                                    <p className="text-sm font-semibold text-base-content truncate" title={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-base-content/70 truncate" title={user.email}>{user.email}</p>
                                </li>
                                <li>
                                    <NavLink to="/profile" className={mobileNavLinkClasses}>
                                       <UserCircleIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> My Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/settings" className={mobileNavLinkClasses}>
                                        <Cog6ToothIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> Account Settings
                                    </NavLink>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-secondary/10 focus:bg-secondary/10">
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="space-x-2">
                         <Link to="/login" className="btn btn-primary btn-outline btn-sm hover:bg-primary hover:text-primary-content">Login</Link>
                         <Link to="/register" className="btn btn-secondary btn-sm hover:opacity-90">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
