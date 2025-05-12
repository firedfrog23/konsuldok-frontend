// src/components/medications/MedicationListItem.jsx
import React from 'react';
// import { Link } from 'react-router-dom'; // Not used in this version
import { ClipboardDocumentListIcon, ClockIcon, InformationCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

/**
 * Displays a single medication item.
 * @param {object} props
 * @param {object} props.medication - The medication object.
 * Expected: { _id, name, dosage, nextDue, instructions, prescribedBy, prescriptionDate, refillsLeft, isActive, type }
 */
function MedicationListItem({ medication }) {
    const isActiveClass = medication.isActive ? 'border-secondary/40' : 'border-black/10 opacity-60';
    const titleColorClass = medication.isActive ? 'text-secondary' : 'text-base-content/60';

    return (
        <div className={`p-4 rounded-lg bg-base-100 border ${isActiveClass} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <div className="flex items-center space-x-2">
                    <ClipboardDocumentListIcon className={`w-5 h-5 flex-shrink-0 ${titleColorClass}`} />
                    <h3 className={`font-semibold text-md ${titleColorClass}`}>{medication.name}</h3>
                </div>
                {medication.isActive && medication.nextDue && (
                    <span className={`badge badge-sm mt-1 sm:mt-0 ${medication.nextDue === 'As Needed' ? 'badge-ghost' : 'badge-outline badge-secondary'}`}>
                        {medication.nextDue === 'As Needed' ? 'As Needed' : `Next: ${medication.nextDue}`}
                    </span>
                )}
                 {!medication.isActive && (
                     <span className="badge badge-sm badge-neutral text-neutral-content mt-1 sm:mt-0">Inactive/Past</span>
                 )}
            </div>
            <p className="text-xs text-base-content/80 mb-1 ml-7 sm:ml-0">
                <span className="font-medium">Dosage:</span> {medication.dosage}
            </p>
            {medication.type && (
                 <p className="text-xs text-base-content/70 mb-1 ml-7 sm:ml-0">
                    <span className="font-medium">Type:</span> {medication.type}
                </p>
            )}
            {medication.instructions && (
                <p className="text-xs text-base-content/70 italic mb-2 ml-7 sm:ml-0 flex items-start">
                    <InformationCircleIcon className="w-3 h-3 inline mr-1 mt-0.5 flex-shrink-0"/>
                    <span>{medication.instructions}</span>
                </p>
            )}
            <div className="text-xs text-base-content/60 ml-7 sm:ml-0">
                <p>Prescribed by: {medication.prescribedBy || 'N/A'}</p>
                <p>
                    Date: {medication.prescriptionDate ? format(new Date(medication.prescriptionDate), 'PPP') : 'N/A'}
                   {medication.refillsLeft !== undefined && <span className="ml-2">({medication.refillsLeft} refills left)</span>}
                </p>
            </div>
            {/* Add actions if needed, e.g., request refill, view details */}
            {/* <div className="card-actions justify-end mt-3">
                <Link to={`/medications/${medication._id}`} className="btn btn-xs btn-ghost text-secondary">Details</Link>
            </div> */}
        </div>
    );
}

export default MedicationListItem;
