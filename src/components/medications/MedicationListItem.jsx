// src/components/medications/MedicationListItem.jsx
import React from 'react';
import { format } from 'date-fns';
import { ClipboardDocumentListIcon, InformationCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

/**
 * Displays a single medication item. Adheres to strict 3-color palette.
 * - Active items: Blue border, Blue title.
 * - Inactive items: Black border (opacity), Black title (opacity).
 * - Next Due Badge: Black outline/text for specific due, Black text (ghost) for "As Needed".
 * - Inactive Badge: Black BG, White text.
 * - Icons: Blue for active, Black for inactive.
 *
 * @param {object} props - Component props.
 * @param {object} props.medication - The medication object.
 * Expected: { _id, name, dosage, nextDue, instructions, prescribedBy, prescriptionDate, refillsLeft, isActive, type }
 */
function MedicationListItem({ medication }) {
    // Active items use primary color (Blue) for border and title.
    // Inactive items use neutral color (Black) with opacity.
    const isActiveClass = medication.isActive ? 'border-primary/30' : 'border-black/10 opacity-70';
    const titleColorClass = medication.isActive ? 'text-primary' : 'text-base-content/60'; // Blue for active, Black with opacity for inactive
    const iconColorClass = medication.isActive ? 'text-primary' : 'text-base-content/50'; // Blue for active, Black with opacity for inactive

    return (
        // Card: White BG (base-100). Border and title color depend on active status.
        <div className={`p-4 rounded-lg bg-base-100 border ${isActiveClass} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <div className="flex items-center space-x-2">
                    {/* Main Icon: Color depends on active status */}
                    <ClipboardDocumentListIcon className={`w-6 h-6 flex-shrink-0 ${iconColorClass}`} />
                    {/* Medication Name: Color depends on active status */}
                    <h3 className={`font-semibold text-md ${titleColorClass}`}>{medication.name}</h3>
                </div>
                {medication.isActive && medication.nextDue && (
                    // Next Due Badge: badge-outline + badge-secondary maps to Black outline/text.
                    // badge-ghost maps to Black text on transparent BG.
                    <span className={`badge badge-sm mt-1 sm:mt-0 ${medication.nextDue === 'As Needed' ? 'badge-ghost' : 'badge-outline badge-secondary'}`}>
                        {medication.nextDue === 'As Needed' ? 'As Needed' : `Next: ${medication.nextDue}`}
                    </span>
                )}
                {!medication.isActive && (
                    // Inactive Badge: badge-neutral maps to Black BG, White text.
                    <span className="badge badge-sm badge-neutral text-neutral-content mt-1 sm:mt-0">Inactive/Past</span>
                )}
            </div>
            <div className="pl-8 sm:pl-0"> {/* Indent content if icon is present */}
                {/* Details Text: text-base-content is Black */}
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
                        {/* Instruction Icon: Color depends on active status */}
                        <InformationCircleIcon className={`w-4 h-4 inline mr-1 mt-0.5 flex-shrink-0 ${iconColorClass}`} />
                        <span>{medication.instructions}</span>
                    </p>
                )}
                {/* Prescribed Info: text-base-content (Black) with opacity */}
                <div className="text-xs text-base-content/60">
                    <p>Prescribed by: {medication.prescribedBy || 'N/A'}</p>
                    <div className="flex items-center">
                        {/* Calendar Icon: Color depends on active status */}
                        <CalendarDaysIcon className={`w-3 h-3 mr-1 ${iconColorClass} opacity-70`}/>
                        <span>Prescribed Date: {medication.prescriptionDate ? format(new Date(medication.prescriptionDate), 'PPP') : 'N/A'}</span>
                        {medication.refillsLeft !== undefined && <span className="ml-2">(Refills left: {medication.refillsLeft})</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MedicationListItem;
