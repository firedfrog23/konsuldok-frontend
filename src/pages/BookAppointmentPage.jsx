// src/pages/BookAppointmentPage.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppointmentForm from '../components/appointments/AppointmentForm.jsx';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * Page for booking a new appointment.
 * Adheres to strict 3-color palette through its child components and layout.
 * - Back link: Blue text.
 * - Card container (bg-base-200): White BG, Black border.
 * - AppointmentForm handles its own theming.
 */
function BookAppointmentPage() {
    const navigate = useNavigate();

    const handleAppointmentBooked = (newAppointment) => {
        navigate(`/appointments/${newAppointment._id}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-6 flex items-center">
                {/* Back Link: text-primary is Blue */}
                <Link to="/appointments" className="btn btn-ghost btn-sm mr-2 text-primary hover:bg-primary/10">
                    <ArrowLeftIcon className="w-5 h-5"/> Back to Appointments
                </Link>
            </header>
            {/* Card Container: bg-base-200 is White, border-black/10 */}
            <div className="bg-base-200 shadow-xl rounded-lg p-6 sm:p-8 border border-black/10">
                {/* AppointmentForm is already themed */}
                <AppointmentForm onSuccess={handleAppointmentBooked} />
            </div>
        </div>
    );
}

export default BookAppointmentPage;
