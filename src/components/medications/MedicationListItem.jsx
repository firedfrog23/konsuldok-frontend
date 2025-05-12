// src/components/medications/MedicationListItem.jsx
import React from 'react';
import { format } from 'date-fns';
import { ClipboardDocumentListIcon, InformationCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

/**
 * Displays a single medication item.
 * @param {object} props
 * @param {object} props.medication - The medication object.
 * Expected: { _id, name, dosage, nextDue, instructions, prescribedBy, prescriptionDate, refillsLeft, isActive, type }
 */
function MedicationListItem({ medication }) {
    const isActiveClass = medication.isActive ? 'border-secondary/30' : 'border-black/10 opacity-70';
    const titleColorClass = medication.isActive ? 'text-secondary' : 'text-base-content/60';

    return (
        <div className={`p-4 rounded-lg bg-base-100 border ${isActiveClass} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <div className="flex items-center space-x-2">
                    <ClipboardDocumentListIcon className={`w-6 h-6 flex-shrink-0 ${titleColorClass}`} />
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
            <div className="pl-8 sm:pl-0"> {/* Indent content if icon is present */}
                <p className="text-sm text-base-content/90 mb-1">
                    <span className="font-medium">Dosage:</span> {medication.dosage}
                </p>
                {medication.type && (
                    <p className="text-xs text-base-content/70 mb-1">
                        <span className="font-medium">Type:</span> {medication.type}
                    </p>
                )}
                {medication.instructions && (
                    <p className="text-xs text-base-content/70 italic mb-2 flex items-start">
                        <InformationCircleIcon className="w-4 h-4 inline mr-1 mt-0.5 flex-shrink-0"/>
                        <span>{medication.instructions}</span>
                    </p>
                )}
                <div className="text-xs text-base-content/60">
                    <p>Prescribed by: {medication.prescribedBy || 'N/A'}</p>
                    <div className="flex items-center">
                        <CalendarDaysIcon className="w-3 h-3 mr-1 opacity-70"/>
                        <span>Prescribed Date: {medication.prescriptionDate ? format(new Date(medication.prescriptionDate), 'PPP') : 'N/A'}</span>
                        {medication.refillsLeft !== undefined && <span className="ml-2">(Refills left: {medication.refillsLeft})</span>}
                    </div>
                </div>
            </div>
            {/* Future actions: e.g., Request Refill button */}
            {/* {medication.isActive && medication.refillsLeft > 0 && (
                <div className="text-right mt-3">
                    <button className="btn btn-xs btn-outline btn-secondary">Request Refill</button>
                </div>
            )} */}
        </div>
    );
}

export default MedicationListItem;
