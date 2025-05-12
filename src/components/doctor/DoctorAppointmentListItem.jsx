// src/components/doctor/DoctorAppointmentListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDaysIcon, UserCircleIcon, ClockIcon, PencilSquareIcon, TagIcon } from '@heroicons/react/24/outline';
import { AppointmentStatus as ApptStatusConst } from '../../utils/constants.js';

/**
 * Displays a single appointment item in a list for a Doctor.
 * @param {object} props
 * @param {object} props.appointment - The appointment object.
 * @param {Function} props.onUpdateStatusClick - Callback when "Update Status" is clicked.
 */
function DoctorAppointmentListItem({ appointment, onUpdateStatusClick }) {

    const getStatusColorClasses = (status) => {
        switch (status?.toLowerCase()) {
            case ApptStatusConst.CONFIRMED:
                return 'text-info border-info'; // Blue
            case ApptStatusConst.REQUESTED:
                return 'text-warning border-warning'; // Orange (needs doctor attention)
            case ApptStatusConst.COMPLETED:
                return 'text-success border-success'; // Blue
            case ApptStatusConst.CANCELLED:
                return 'text-error border-error line-through'; // Orange
            case ApptStatusConst.NO_SHOW:
                return 'text-neutral border-neutral line-through'; // Black
            default:
                return 'text-base-content/70 border-base-content/30';
        }
    };

    return (
        <div className="bg-base-100 shadow-md rounded-lg p-4 border border-black/10 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                {/* Left Side: Patient & Time Details */}
                <div className="flex-grow">
                    <div className="flex items-center mb-2">
                        <UserCircleIcon className="w-6 h-6 text-primary mr-2 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-primary truncate" title={appointment.patient?.userAccount?.fullName || 'N/A'}>
                            {appointment.patient?.userAccount?.fullName || 'Patient Name N/A'}
                        </h3>
                    </div>
                    <div className="text-sm space-y-1 text-base-content/90">
                        <div className="flex items-center">
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
                    <div className={`badge badge-lg badge-outline ${getStatusColorClasses(appointment.status)}`}>
                        {appointment.status || 'Unknown'}
                    </div>
                    <div className="flex gap-2">
                         <Link to={`/appointments/${appointment._id}`} className="btn btn-xs btn-ghost text-primary hover:bg-primary/10">
                            View Details
                         </Link>
                        {/* Only allow status update if not in a final state */}
                        {appointment.status !== ApptStatusConst.COMPLETED && appointment.status !== ApptStatusConst.CANCELLED && (
                            <button
                                onClick={() => onUpdateStatusClick(appointment)}
                                className="btn btn-xs btn-secondary"
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
