// src/components/appointments/AppointmentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// --- CHANGE: Replaced UserMdIcon with UserCircleIcon ---
import { CalendarDaysIcon, UserCircleIcon, ClockIcon, TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
// --- END CHANGE ---
import { format } from 'date-fns'; // npm install date-fns

/**
 * Displays a summary of a single appointment.
 * @param {object} props
 * @param {object} props.appointment - The appointment object.
 * Expected: { _id, doctor: { userAccount: { fullName }, specialty }, appointmentTime, type (custom), status, reasonForVisit }
 */
function AppointmentCard({ appointment }) {
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'requested':
                return 'badge-info'; // Blue
            case 'completed':
                return 'badge-success'; // Blue (as success is mapped to primary)
            case 'cancelled':
                return 'badge-error'; // Orange
            case 'noshow':
                return 'badge-warning'; // Orange
            default:
                return 'badge-ghost'; // Default subtle
        }
    };

    return (
        <div className="card bg-base-200 shadow border border-black/10 hover:shadow-md transition-shadow">
            <div className="card-body p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <h3 className="card-title text-lg font-semibold text-primary mb-2 sm:mb-0">
                        {appointment.type || 'Consultation'} with {appointment.doctor?.userAccount?.fullName || 'N/A'}
                    </h3>
                    <span className={`badge badge-sm ${getStatusBadgeClass(appointment.status)}`}>
                        {appointment.status || 'Unknown'}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-base-content/80">
                    <div className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-2 text-secondary opacity-70 flex-shrink-0" />
                        <span>{appointment.appointmentTime ? format(new Date(appointment.appointmentTime), 'PPP p') : 'Date N/A'}</span>
                    </div>
                    <div className="flex items-center">
                        {/* --- CHANGE: Using UserCircleIcon --- */}
                        <UserCircleIcon className="w-4 h-4 mr-2 text-secondary opacity-70 flex-shrink-0" />
                        <span>{appointment.doctor?.specialty || 'Specialty N/A'}</span>
                    </div>
                    {appointment.reasonForVisit && (
                         <div className="flex items-start sm:col-span-2 mt-1"> {/* Changed to items-start for better alignment with multiline text */}
                            <TagIcon className="w-4 h-4 mr-2 text-secondary opacity-70 flex-shrink-0 mt-0.5" />
                            <span className="truncate" title={appointment.reasonForVisit}>
                                Reason: {appointment.reasonForVisit.length > 50 ? `${appointment.reasonForVisit.substring(0, 50)}...` : appointment.reasonForVisit}
                            </span>
                        </div>
                    )}
                </div>

                <div className="card-actions justify-end mt-4">
                    <Link to={`/appointments/${appointment._id}`} className="btn btn-xs btn-outline btn-primary">
                        View Details
                        <ArrowRightIcon className="w-3 h-3 ml-1" />
                    </Link>
                    {/* Conditional Cancel Button */}
                    {(appointment.status?.toLowerCase() === 'confirmed' || appointment.status?.toLowerCase() === 'requested') && (
                        // Link to a route that will open the CancelAppointmentModal, or handle modal directly here
                        <Link to={`/appointments/${appointment._id}?action=cancel`} className="btn btn-xs btn-outline btn-error"> {/* Error is Orange */}
                            Cancel
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AppointmentCard;
