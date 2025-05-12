// src/pages/patient/MedicalRecordsPortalPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BeakerIcon, ClipboardDocumentListIcon, FlagIcon, DocumentTextIcon, ArrowRightIcon, InformationCircleIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
// No useAuth needed if not displaying user-specific messages directly here

/**
 * Central portal page for patient's medical records and health tools.
 */
function MedicalRecordsPortalPage() {
    const portalSections = [
        { name: "Lab Results", href: "/lab-results", icon: BeakerIcon, description: "View your past and recent laboratory test results.", color: "primary" },
        { name: "My Medications", href: "/medications", icon: ClipboardDocumentListIcon, description: "Manage your prescriptions and medication schedule.", color: "secondary" },
        { name: "Health Goals", href: "/health-goals", icon: FlagIcon, description: "Track and update your personal health and wellness goals.", color: "primary" },
        { name: "My Documents", href: "/documents", icon: DocumentTextIcon, description: "Access documents uploaded by you or your providers.", color: "secondary" }, // Link for future Phase
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8 md:mb-12 pb-4 border-b border-black/10 flex items-center">
                <Link to="/dashboard" className="btn btn-ghost btn-sm mr-2 -ml-2 text-primary hover:bg-primary/10">
                    <ChevronLeftIcon className="w-5 h-5"/> Dashboard
                </Link>
                <div> {/* This div helps keep the title aligned even with the back button */}
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">My Health Records & Tools</h1>
                    <p className="text-base-content/70 mt-1">Access and manage your health information in one place.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portalSections.map(section => (
                    <Link
                        key={section.name}
                        to={section.href}
                        className={`group card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-l-4 ${section.color === 'primary' ? 'border-primary hover:border-primary/70' : 'border-secondary hover:border-secondary/70'}`}
                    >
                        <div className="card-body flex-row items-center space-x-4 p-6">
                            <section.icon className={`w-10 h-10 flex-shrink-0 ${section.color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
                            <div className="flex-grow">
                                <h2 className={`card-title text-lg font-semibold ${section.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>{section.name}</h2>
                                <p className="text-sm text-base-content/80">{section.description}</p>
                            </div>
                            <ArrowRightIcon className={`w-5 h-5 text-base-content/40 ml-auto transition-transform group-hover:translate-x-1 ${section.color === 'primary' ? 'group-hover:text-primary' : 'group-hover:text-secondary'}`} />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 p-6 bg-base-200 rounded-lg shadow-sm border border-black/5 text-center">
                <InformationCircleIcon className="w-8 h-8 mx-auto text-info mb-2"/> {/* Info is Blue */}
                <p className="text-sm text-base-content/70">More features like shared consultation notes and care team information coming soon!</p>
            </div>
        </div>
    );
}

export default MedicalRecordsPortalPage;
