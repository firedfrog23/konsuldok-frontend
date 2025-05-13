// src/components/doctor/PatientListItem.jsx
import { ChevronRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

/**
 * PatientListItem component for displaying a patient in a list (e.g., search results).
 * This is a basic structure. Actual implementation might be part of PatientSearchPage for now.
 * Adheres to strict 3-color palette.
 *
 * @param {object} props - Component props.
 * @param {object} props.patient - The patient object.
 * Expected: { _id, userAccount: { firstName, lastName }, dateOfBirth, gender }
 */
function PatientListItem({ patient }) {
    if (!patient || !patient.userAccount) {
        return null; // Or some error/placeholder rendering
    }

    return (
        <Link
            to={`/patient/${patient._id}/chart`}
            className="card bg-base-100 shadow-md hover:shadow-lg border border-black/10 hover:border-primary/50 transition-all duration-200 ease-in-out group block"
        >
            <div className="card-body p-4 flex flex-row items-center space-x-4">
                {/* Icon: Blue */}
                <UserCircleIcon className="w-10 h-10 text-primary opacity-80 flex-shrink-0" />
                <div className="flex-grow">
                    {/* Name: Blue, hover underline */}
                    <h3 className="card-title text-md text-primary group-hover:underline">
                        {patient.userAccount.firstName} {patient.userAccount.lastName}
                    </h3>
                    {/* ID: Black text */}
                    <p className="text-sm text-base-content/80">ID: {patient._id}</p>
                    {/* Details: Black text with opacity */}
                    <p className="text-xs text-base-content/60">
                        DOB: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-CA') : 'N/A'} | Gender: {patient.gender || 'N/A'}
                    </p>
                </div>
                {/* Chevron Icon: Black, hover Blue */}
                <ChevronRightIcon className="w-6 h-6 text-base-content/40 group-hover:text-primary transition-colors" />
            </div>
        </Link>
    );
}

export default PatientListItem;
