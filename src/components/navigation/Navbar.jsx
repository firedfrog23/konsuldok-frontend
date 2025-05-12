// src/components/navigation/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { UserRoles } from '../../utils/constants.js';
import {
    ArrowRightOnRectangleIcon, BellIcon, Cog6ToothIcon, UserCircleIcon,
    Squares2X2Icon, CalendarDaysIcon, UserGroupIcon, ShieldCheckIcon,
    Bars3Icon, XMarkIcon, BriefcaseIcon, HeartIcon as HealthRecordsIcon
} from '@heroicons/react/24/outline';

/**
 * Main application Navbar. Adheres to strict 3-color palette.
 * - Background (bg-base-100) is White. Border (border-black/10) is Black with opacity.
 * - Brand (text-primary) is Blue.
 * - NavLinks: Active state is Blue text with light Blue BG. Inactive is Black text, hover to Blue text/light White BG.
 * - Icons: Generally Black with opacity, or Blue for active/accented items.
 * - Buttons: Login (btn-primary outline) is Blue. Sign Up (btn-secondary) is Black BG, White text.
 * - User Avatar: Blue ring/text.
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

    const mainNavLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon, roles: [UserRoles.PATIENT, UserRoles.DOCTOR, UserRoles.STAFF, UserRoles.ADMIN] },
        { name: 'My Appointments', href: '/appointments', icon: CalendarDaysIcon, roles: [UserRoles.PATIENT] },
        { name: 'My Health', href: '/medical-records', icon: HealthRecordsIcon, roles: [UserRoles.PATIENT] },
        { name: "My Schedule", href: '/doctor/appointments', icon: BriefcaseIcon, roles: [UserRoles.DOCTOR] },
        { name: 'Patients', href: '/patients', icon: UserGroupIcon, roles: [UserRoles.DOCTOR, UserRoles.STAFF, UserRoles.ADMIN] },
    ];

    const adminNavLinks = [
        { name: 'User Management', href: '/admin/users', icon: UserGroupIcon, roles: [UserRoles.ADMIN] },
        { name: 'System Settings', href: '/admin/settings', icon: Cog6ToothIcon, roles: [UserRoles.ADMIN] },
    ];

    const accessibleNavLinks = mainNavLinks.filter(link => isAuthenticated && user?.role && link.roles.includes(user.role));
    const accessibleAdminLinks = adminNavLinks.filter(link => isAuthenticated && user?.role && link.roles.includes(user.role));

    // NavLink active: Blue text, light Blue BG (primary/10). Inactive: Black text, hover to Blue text.
    const navLinkClasses = ({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
            isActive ? 'bg-primary/10 text-primary' : 'text-base-content hover:bg-base-200 hover:text-primary'
        }`;

    const mobileNavLinkClasses = ({ isActive }) =>
        `flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out ${
            isActive ? 'bg-primary/10 text-primary' : 'text-base-content hover:bg-base-200 hover:text-primary'
        }`;

    const userInitials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : user?.email?.[0]?.toUpperCase() || 'U';

    return (
        // Navbar: White BG (bg-base-100), Black border with opacity
        <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 border-b border-black/10 px-4 sm:px-6 lg:px-8">
            <div className="navbar-start">
                {isAuthenticated && (
                    <div className="dropdown lg:hidden">
                        {/* Mobile Menu Toggle: text-primary (Blue) */}
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-primary hover:bg-primary/10 focus:bg-primary/10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                        </div>
                        {isMobileMenuOpen && (
                            // Mobile Menu: White BG (bg-base-100), Black border
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[51] p-2 shadow bg-base-100 rounded-box w-64 border border-black/5">
                                {accessibleNavLinks.map((item) => (
                                    <li key={item.name} onClick={() => setIsMobileMenuOpen(false)}>
                                        <NavLink to={item.href} className={mobileNavLinkClasses}>
                                            {/* Icons: Black with opacity */}
                                            <item.icon className="w-5 h-5 mr-3 text-base-content opacity-70 flex-shrink-0" /> {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                                {accessibleAdminLinks.length > 0 && (
                                    <>
                                        <div className="divider my-1 text-xs text-base-content/50 px-3 pt-1">Admin Tools</div>
                                        {accessibleAdminLinks.map((item) => (
                                            <li key={item.name} onClick={() => setIsMobileMenuOpen(false)}>
                                                <NavLink to={item.href} className={mobileNavLinkClasses}>
                                                    <item.icon className="w-5 h-5 mr-3 text-base-content opacity-70 flex-shrink-0" /> {item.name}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </>
                                )}
                                <div className="divider my-1"></div>
                                <li>
                                    <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                                        <UserCircleIcon className="w-5 h-5 mr-3 text-base-content opacity-70 flex-shrink-0"/> My Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/settings" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClasses}>
                                        <Cog6ToothIcon className="w-5 h-5 mr-3 text-base-content opacity-70 flex-shrink-0"/> Settings
                                    </NavLink>
                                </li>
                                <li>
                                    {/* Logout: text-secondary (Black) */}
                                    <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-secondary/10 focus:bg-secondary/10">
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> Logout
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                )}
                {/* Brand: text-primary (Blue) */}
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
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                        {accessibleAdminLinks.length > 0 && (
                            <li>
                                <NavLink to={accessibleAdminLinks[0].href} className={navLinkClasses}>
                                    {/* Admin Panel Icon: text-primary (Blue) if active, text-base-content (Black) otherwise */}
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
                        {/* Notification Bell: text-secondary (Black) */}
                        <button className="btn btn-ghost btn-circle hover:bg-secondary/10 focus:bg-secondary/10" aria-label="Notifications">
                            <div className="indicator">
                                <BellIcon className="h-6 w-6 text-secondary" />
                                {/* Optional Badge: primary (Blue) */}
                                {/* <span className="badge badge-xs badge-primary indicator-item animate-pulse">3</span> */}
                            </div>
                        </button>
                        <div className="dropdown dropdown-end">
                            {/* Avatar: Blue ring, Blue text for initials */}
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
                            {/* Dropdown Menu: White BG, Black text/border */}
                            <ul tabIndex={0} className="mt-3 z-[51] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-black/10">
                                <li className="px-4 py-2 border-b border-black/10 mb-1">
                                    <p className="text-sm font-semibold text-base-content truncate" title={`${user.firstName} ${user.lastName}`}>{user.firstName} {user.lastName}</p>
                                    <p className="text-xs text-base-content/70 truncate" title={user.email}>{user.email}</p>
                                </li>
                                <li>
                                    <NavLink to="/profile" className={mobileNavLinkClasses} onClick={() => document.activeElement.blur()} >
                                        <UserCircleIcon className="w-5 h-5 mr-3 text-base-content opacity-70 flex-shrink-0"/> My Profile
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/settings" className={mobileNavLinkClasses} onClick={() => document.activeElement.blur()} >
                                        <Cog6ToothIcon className="w-5 h-5 mr-3 text-base-content opacity-70 flex-shrink-0"/> Account Settings
                                    </NavLink>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    {/* Logout Button: text-secondary (Black) */}
                                    <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-secondary/10 focus:bg-secondary/10">
                                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 opacity-70 flex-shrink-0"/> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    // Login/Sign Up Buttons: Login (Blue outline), Sign Up (Black BG, White text)
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
