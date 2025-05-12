// src/components/navigation/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Standard application Footer component. Adheres to strict 3-color palette.
 * - Background (bg-base-200) is White. Border (border-black/10) is Black with opacity.
 * - Main Brand Link (text-primary) is Blue.
 * - Section Titles (text-secondary) are Black.
 * - Links (link-hover) are Black, hover to Blue.
 * - Copyright text (text-base-content/70) is Black with opacity.
 */
function Footer() {
    const footerLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ];

    // Social links are placeholders and would need actual SVG icons or a library.
    // Their color would be text-primary (Blue) on hover.
    const socialLinks = [
        // Example: { name: 'Facebook', href: '#', icon: <YourFacebookIconComponent className="w-6 h-6" /> },
    ];

    return (
        // Footer BG: bg-base-200 is White. Border is Black with opacity.
        <footer className="bg-base-200 border-t border-black/10 text-base-content"> {/* text-base-content is Black */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Brand/Copyright */}
                    <div className="text-center md:text-left">
                        {/* Brand Link: text-primary is Blue */}
                        <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
                            KonsulDok
                        </Link>
                        {/* Copyright Text: text-base-content (Black) with opacity */}
                        <p className="mt-2 text-sm text-base-content/70">
                            &copy; {new Date().getFullYear()} KonsulDok Healthcare.<br/> All rights reserved.
                        </p>
                    </div>

                    {/* Footer Navigation */}
                    <nav className="text-center">
                        {/* Section Title: text-secondary maps to Black */}
                        <h3 className="font-semibold text-secondary mb-3">Quick Links</h3>
                        <ul className="space-y-1">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
                                    {/* Links: Default Black, hover to Blue (text-primary) */}
                                    <Link to={link.href} className="text-sm link link-hover hover:text-primary">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Social Media (Optional) */}
                    <div className="text-center md:text-right">
                        {socialLinks.length > 0 && (
                            <>
                                <h3 className="font-semibold text-secondary mb-3">Follow Us</h3>
                                <div className="flex justify-center md:justify-end space-x-4">
                                    {socialLinks.map((link) => (
                                        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                                            // Social Icons: text-primary (Blue) on hover
                                            className="text-base-content hover:text-primary transition-colors"
                                            aria-label={link.name}>
                                            {/* Replace with actual SVG icon component */}
                                            {link.icon || <span className="text-2xl">Icon</span>}
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                        {/* Time Text: text-base-content (Black) with opacity */}
                        <p className="text-xs text-base-content/50 mt-4">
                            Current Time (WIB): {new Date().toLocaleTimeString('en-ID', { timeZone: 'Asia/Jakarta', hour12: false })}
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
