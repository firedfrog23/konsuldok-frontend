// src/components/appointments/AppointmentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, UserCircleIcon, ClockIcon, TagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns'; // npm install date-fns

/**
 * Displays a summary of a single appointment, adhering to the application's UI standards.
 * This component relies on DaisyUI theme classes which are customized in index.css
 * to use a strict 3-color palette: #FFFFFF (White), #000000 (Black), #007FFF (Blue).
 *
 * @param {object} props - The component's props.
 * @param {object} props.appointment - The appointment object.
 * Expected structure: {
 * _id: string,
 * doctor: {
 * userAccount: { fullName: string },
 * specialty: string
 * },
 * appointmentTime: string | Date,
 * type: string, // Custom field for appointment type, e.g., 'Consultation'
 * status: string, // e.g., 'Confirmed', 'Completed', 'Cancelled'
 * reasonForVisit: string
 * }
 */
function AppointmentCard({ appointment }) {
  /**
   * Determines the DaisyUI badge class based on the appointment status.
   * These classes are themed in `index.css`:
   * - 'badge-info', 'badge-success' -> Blue background, White text.
   * - 'badge-error', 'badge-warning' -> Black background, White text.
   * - 'badge-ghost' -> White background (transparent layer), Black text.
   * @param {string} status - The status of the appointment.
   * @returns {string} The corresponding DaisyUI badge class.
   */
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'requested':
        return 'badge-info'; // Maps to Blue background, White text via theme
      case 'completed':
        return 'badge-success'; // Maps to Blue background, White text via theme
      case 'cancelled':
        return 'badge-error'; // Maps to Black background, White text via theme
      case 'noshow':
        return 'badge-warning'; // Maps to Black background, White text via theme
      default:
        return 'badge-ghost'; // Maps to White BG (transparent layer), Black text via theme
    }
  };

  return (
    // Card styling: bg-base-200 is White. Border is Black with low opacity.
    // Shadow provides depth. Transition for hover effect.
    <div className="card bg-base-200 shadow border border-black/10 hover:shadow-md transition-shadow">
      <div className="card-body p-5">
        {/* Header: Appointment Type, Doctor Name, and Status Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
          {/* Main title: Uses primary color (Blue) */}
          <h3 className="card-title text-lg font-semibold text-primary mb-2 sm:mb-0">
            {appointment.type || 'Consultation'} with {appointment.doctor?.userAccount?.fullName || 'N/A'}
          </h3>
          {/* Status badge: Dynamically styled based on appointment status */}
          <span className={`badge badge-sm ${getStatusBadgeClass(appointment.status)}`}>
            {appointment.status || 'Unknown'}
          </span>
        </div>

        {/* Details Grid: Date, Time, Specialty, Reason for Visit */}
        {/* Uses responsive grid layout. Text is base-content (Black) with opacity for secondary info. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-base-content/80">
          {/* Appointment Date and Time */}
          <div className="flex items-center">
            {/* Icons use secondary color (Black) with opacity */}
            <CalendarDaysIcon className="w-4 h-4 mr-2 text-secondary opacity-70 flex-shrink-0" />
            <span>
              {appointment.appointmentTime ? format(new Date(appointment.appointmentTime), 'PPP p') : 'Date N/A'}
            </span>
          </div>
          {/* Doctor Specialty */}
          <div className="flex items-center">
            <UserCircleIcon className="w-4 h-4 mr-2 text-secondary opacity-70 flex-shrink-0" />
            <span>{appointment.doctor?.specialty || 'Specialty N/A'}</span>
          </div>
          {/* Reason for Visit (if available) */}
          {appointment.reasonForVisit && (
            <div className="flex items-start sm:col-span-2 mt-1"> {/* items-start for multiline text alignment */}
              <TagIcon className="w-4 h-4 mr-2 text-secondary opacity-70 flex-shrink-0 mt-0.5" />
              {/* Truncate long reasons, providing full reason on hover via title attribute */}
              <span className="truncate" title={appointment.reasonForVisit}>
                Reason: {appointment.reasonForVisit.length > 50 ? `${appointment.reasonForVisit.substring(0, 50)}...` : appointment.reasonForVisit}
              </span>
            </div>
          )}
        </div>

        {/* Card Actions: View Details and Conditional Cancel Button */}
        <div className="card-actions justify-end mt-4">
          {/* View Details button: Primary color (Blue) outline style */}
          <Link to={`/appointments/${appointment._id}`} className="btn btn-xs btn-outline btn-primary">
            View Details
            <ArrowRightIcon className="w-3 h-3 ml-1" />
          </Link>
          {/* Conditional Cancel Button: Shown for 'Confirmed' or 'Requested' appointments */}
          {/* Uses error color (Black outline, Black text, Black BG on hover) via theme */}
          {(appointment.status?.toLowerCase() === 'confirmed' || appointment.status?.toLowerCase() === 'requested') && (
            <Link to={`/appointments/${appointment._id}?action=cancel`} className="btn btn-xs btn-outline btn-error">
              Cancel
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
