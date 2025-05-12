// src/pages/patient/MedicalRecordsPortalPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BeakerIcon, ClipboardDocumentListIcon, FlagIcon, DocumentTextIcon, ArrowRightIcon, InformationCircleIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

/**
 * Central portal page for patient's medical records and health tools.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function MedicalRecordsPortalPage() {
    // Section colors alternate between primary (Blue) and secondary (Black) for accents.
    const portalSections = [
        { name: "Lab Results", href: "/lab-results", icon: BeakerIcon, description: "View your past and recent laboratory test results.", accentColor: "primary" }, // Blue accent
        { name: "My Medications", href: "/medications", icon: ClipboardDocumentListIcon, description: "Manage your prescriptions and medication schedule.", accentColor: "neutral" }, // Black accent
        { name: "Health Goals", href: "/health-goals", icon: FlagIcon, description: "Track and update your personal health and wellness goals.", accentColor: "primary" }, // Blue accent
        { name: "My Documents", href: "/documents", icon: DocumentTextIcon, description: "Access documents uploaded by you or your providers.", accentColor: "neutral" }, // Black accent
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header: Back link (Blue), Title (Blue) */}
            <header className="mb-8 md:mb-12 pb-4 border-b border-black/10 flex items-center">
                <Link to="/dashboard" className="btn btn-ghost btn-sm mr-2 -ml-2 text-primary hover:bg-primary/10">
                    <ChevronLeftIcon className="w-5 h-5"/> Dashboard
                </Link>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">My Health Records & Tools</h1>
                    <p className="text-base-content/70 mt-1">Access and manage your health information in one place.</p>
                </div>
            </header>

            {/* Portal Sections: Cards White BG. Accent colors (Blue/Black) for borders and icons. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portalSections.map(section => {
                    const borderClass = section.accentColor === 'primary' ? 'border-primary hover:border-primary/70' : 'border-neutral hover:border-neutral/70';
                    const iconColorClass = section.accentColor === 'primary' ? 'text-primary' : 'text-neutral';
                    const titleColorClass = section.accentColor === 'primary' ? 'text-primary' : 'text-neutral';
                    const arrowHoverColorClass = section.accentColor === 'primary' ? 'group-hover:text-primary' : 'group-hover:text-neutral';

                    return (
                        <Link
                            key={section.name}
                            to={section.href}
                            className={`group card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border-l-4 ${borderClass}`}
                        >
                            <div className="card-body flex-row items-center space-x-4 p-6">
                                <section.icon className={`w-10 h-10 flex-shrink-0 ${iconColorClass}`} />
                                <div className="flex-grow">
                                    <h2 className={`card-title text-lg font-semibold ${titleColorClass}`}>{section.name}</h2>
                                    <p className="text-sm text-base-content/80">{section.description}</p>
                                </div>
                                <ArrowRightIcon className={`w-5 h-5 text-base-content/40 ml-auto transition-transform group-hover:translate-x-1 ${arrowHoverColorClass}`} />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Informational Footer: Icon Blue */}
            <div className="mt-12 p-6 bg-base-200 rounded-lg shadow-sm border border-black/5 text-center">
                <InformationCircleIcon className="w-8 h-8 mx-auto text-primary mb-2"/> {/* Icon Blue */}
                <p className="text-sm text-base-content/70">More features like shared consultation notes and care team information coming soon!</p>
            </div>
        </div>
    );
}

export default MedicalRecordsPortalPage;
