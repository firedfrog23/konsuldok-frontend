import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppointmentForm from '../components/appointments/AppointmentForm.jsx';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

/**
 * Page for booking a new appointment.
 * Currently uses a simplified AppointmentForm.
 */
function BookAppointmentPage() {
    const navigate = useNavigate();

    const handleAppointmentBooked = (newAppointment) => {
        // Navigate to the new appointment's detail page or appointment list
        navigate(`/appointments/${newAppointment._id}`);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-6 flex items-center">
                 <Link to="/appointments" className="btn btn-ghost btn-sm mr-2">
                    <ArrowLeftIcon className="w-5 h-5"/> Back to Appointments
                </Link>
            </header>
            <div className="bg-base-200 shadow-xl rounded-lg p-6 sm:p-8 border border-black/10">
                <AppointmentForm onSuccess={handleAppointmentBooked} />
            </div>
        </div>
    );
}

export default BookAppointmentPage;
