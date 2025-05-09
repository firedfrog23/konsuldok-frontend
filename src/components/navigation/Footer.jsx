// src/components/navigation/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Standard application Footer component.
 */
function Footer() {
    // Placeholder links - replace with actual paths
    const footerLinks = [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
    ];

    // Placeholder social links
    const socialLinks = [
        // { name: 'Facebook', href: '#', icon: <FaFacebook /> }, // Example using react-icons
        // { name: 'Twitter', href: '#', icon: <FaTwitter /> },
        // { name: 'LinkedIn', href: '#', icon: <FaLinkedin /> },
    ];

    return (
         // Use base-200 (subtle tinted off-white) for slight contrast from base-100 body
        <footer className="bg-base-200 border-t border-black/10 text-base-content">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Brand/Copyright */}
                    <div className="text-center md:text-left">
                        <Link to="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                            KonsulDok
                        </Link>
                        <p className="mt-2 text-sm text-base-content/70">
                            &copy; {new Date().getFullYear()} KonsulDok Healthcare.<br/> All rights reserved.
                        </p>
                    </div>

                    {/* Footer Navigation */}
                    <nav className="text-center">
                        <h3 className="font-semibold text-secondary mb-3">Quick Links</h3>
                        <ul className="space-y-1">
                            {footerLinks.map((link) => (
                                <li key={link.name}>
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
										className="text-primary hover:text-secondary transition-colors"
										aria-label={link.name}>
                                           {/* Render actual icon component here */}
                                           <span className="text-2xl">Icon</span> {/* Placeholder */}
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
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