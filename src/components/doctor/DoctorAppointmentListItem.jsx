// src/components/doctor/DoctorAppointmentListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDaysIcon, UserCircleIcon, ClockIcon, PencilSquareIcon, TagIcon } from '@heroicons/react/24/outline';
import { AppointmentStatus as ApptStatusConst } from '../../utils/constants.js';

/**
 * Displays a single appointment item in a list for a Doctor.
 * Adheres to the 3-color palette via DaisyUI theme.
 * - Patient name (text-primary) is Blue.
 * - Icons (text-secondary) are Black.
 * - Status badge colors are themed: info/success (Blue BG), warning/error (Black BG), neutral (Black text).
 * - "View Details" button (text-primary) is Blue text.
 * - "Update Status" button (btn-secondary) is Black BG, White text.
 *
 * @param {object} props - Component props.
 * @param {object} props.appointment - The appointment object.
 * @param {Function} props.onUpdateStatusClick - Callback when "Update Status" is clicked.
 */
function DoctorAppointmentListItem({ appointment, onUpdateStatusClick }) {

    /**
     * Determines text and border color classes for the status badge.
     * Relies on DaisyUI theme where:
     * - info/success map to Blue.
     * - warning/error map to Black (for background, text is White).
     * - neutral maps to Black text.
     * @param {string} status - The appointment status.
     * @returns {string} Tailwind CSS classes for text and border color.
     */
    const getStatusColorClasses = (status) => {
        switch (status?.toLowerCase()) {
            case ApptStatusConst.CONFIRMED:
                return 'text-primary-content border-primary bg-primary'; // Blue BG, White text
            case ApptStatusConst.REQUESTED:
                return 'text-neutral-content border-neutral bg-neutral'; // Black BG, White text (as warning)
            case ApptStatusConst.COMPLETED:
                return 'text-primary-content border-primary bg-primary'; // Blue BG, White text (as success)
            case ApptStatusConst.CANCELLED:
                return 'text-neutral-content border-neutral bg-neutral line-through'; // Black BG, White text (as error)
            case ApptStatusConst.NO_SHOW:
                return 'text-neutral-content border-neutral bg-neutral line-through'; // Black BG, White text
            default:
                return 'text-base-content border-base-content/30'; // Black text, Black border with opacity
        }
    };

    return (
        // Card: White BG, Black border with opacity
        <div className="bg-base-100 shadow-md rounded-lg p-4 border border-black/10 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                {/* Left Side: Patient & Time Details */}
                <div className="flex-grow">
                    <div className="flex items-center mb-2">
                        {/* Icon: text-primary is Blue */}
                        <UserCircleIcon className="w-6 h-6 text-primary mr-2 flex-shrink-0" />
                        {/* Patient Name: text-primary is Blue */}
                        <h3 className="text-lg font-semibold text-primary truncate" title={appointment.patient?.userAccount?.fullName || 'N/A'}>
                            {appointment.patient?.userAccount?.fullName || 'Patient Name N/A'}
                        </h3>
                    </div>
                    {/* Details Text: text-base-content is Black */}
                    <div className="text-sm space-y-1 text-base-content/90">
                        <div className="flex items-center">
                            {/* Icons: text-secondary maps to Black */}
                            <CalendarDaysIcon className="w-4 h-4 mr-2 text-secondary opacity-80" />
                            <span>{appointment.appointmentTime ? format(new Date(appointment.appointmentTime), 'EEE, MMM d, yyyy') : 'Date N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 mr-2 text-secondary opacity-80" />
                            <span>
                                {appointment.appointmentTime ? format(new Date(appointment.appointmentTime), 'p') : 'Time N/A'}
                                {appointment.durationMinutes && ` (${appointment.durationMinutes} min)`}
                            </span>
                        </div>
                        {appointment.reasonForVisit && (
                            <div className="flex items-start pt-1">
                                <TagIcon className="w-4 h-4 mr-2 text-secondary opacity-80 mt-0.5 flex-shrink-0" />
                                <span className="text-xs italic truncate" title={appointment.reasonForVisit}>
                                    Reason: {appointment.reasonForVisit}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Status & Actions */}
                <div className="flex flex-col items-start sm:items-end space-y-2 sm:space-y-3 mt-3 sm:mt-0 flex-shrink-0">
                    {/* Status Badge: Dynamically styled */}
                    <div className={`badge badge-lg badge-outline ${getStatusColorClasses(appointment.status)}`}>
                        {appointment.status || 'Unknown'}
                    </div>
                    <div className="flex gap-2">
                        {/* View Details: text-primary (Blue) for link-like appearance */}
                        <Link to={`/appointments/${appointment._id}`} className="btn btn-xs btn-ghost text-primary hover:bg-primary/10">
                            View Details
                        </Link>
                        {/* Update Status: btn-secondary maps to Black BG, White text */}
                        {appointment.status !== ApptStatusConst.COMPLETED && appointment.status !== ApptStatusConst.CANCELLED && (
                            <button
                                onClick={() => onUpdateStatusClick(appointment)}
                                className="btn btn-xs btn-secondary" // Secondary is Black BG, White text
                            >
                                <PencilSquareIcon className="w-4 h-4 mr-1" />
                                Update Status
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorAppointmentListItem;
