// src/components/appointments/AppointmentList.jsx
import React from 'react';
import AppointmentCard from './AppointmentCard.jsx';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

/**
 * Renders a list of AppointmentCard components.
 * Adheres to the 3-color palette via DaisyUI theme.
 * - Icons in empty state use text-base-content (Black) with opacity.
 * - Text in empty state uses text-base-content (Black) with opacity.
 * - Title uses text-primary (Blue).
 *
 * @param {object} props - The component's props.
 * @param {Array<object>} props.appointments - List of appointment objects.
 * @param {string} [props.title="Appointments"] - Optional title for the list section.
 * @param {string} [props.emptyMessage="No appointments found."] - Message if list is empty.
 */
function AppointmentList({ appointments, title = "Appointments", emptyMessage = "No appointments found for this view." }) {
    // Empty state: bg-base-200 is White. Icon and text are Black with opacity.
    if (!appointments || appointments.length === 0) {
        return (
            <div className="text-center py-10 bg-base-200 rounded-lg shadow-sm border border-black/5">
                {/* Icon color is Black with opacity */}
                <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" />
                {/* Message text color is Black with opacity */}
                <p className="text-base-content/70">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Title uses primary color (Blue) */}
            {title && <h2 className="text-2xl font-semibold text-primary mb-4">{title}</h2>}
            {appointments.map(appointment => (
                <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
        </div>
    );
}

export default AppointmentList;
