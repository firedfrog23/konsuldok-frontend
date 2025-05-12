// src/pages/AppointmentDetailPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import appointmentService from '../services/appointment.service.js';
import { useNotification } from '../contexts/NotificationContext.jsx';
import CancelAppointmentModal from '../components/appointments/CancelAppointmentModal.jsx';
import {
    CalendarDaysIcon, UserCircleIcon as DoctorIcon, ClockIcon, TagIcon,
    InformationCircleIcon, ArrowLeftIcon, NoSymbolIcon, DocumentTextIcon // Added DocumentTextIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

/**
 * Page to display details of a single appointment.
 * Adheres to strict 3-color palette and UI/UX standards.
 * - Header: Title (Blue), Back button (Black text).
 * - Card: White BG, Black border. Card Title (Black).
 * - Status Badge: Blue BG for info/success, Black BG for error/warning.
 * - Detail Icons: Blue. Detail Labels/Values: Black.
 * - Cancel Button: Black outline/text.
 */
function AppointmentDetailPage() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [appointment, setAppointment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    const fetchAppointment = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await appointmentService.getAppointmentById(appointmentId);
            setAppointment(data);
        } catch (err) {
            const errorMessage = err.message || 'Failed to load appointment details.';
            setError(errorMessage);
            addNotification(errorMessage, 'error'); // Themed error notification (Black BG)
        } finally {
            setIsLoading(false);
        }
    }, [appointmentId, addNotification]);

    useEffect(() => {
        fetchAppointment();
    }, [fetchAppointment]);

    const handleConfirmCancel = async (reason) => {
        setIsCancelling(true);
        try {
            const updatedAppointment = await appointmentService.cancelAppointment(appointmentId, reason);
            setAppointment(updatedAppointment);
            addNotification('Appointment cancelled successfully.', 'success'); // Themed success (Blue BG)
            setIsModalOpen(false);
        } catch (err) {
            addNotification(err.message || 'Failed to cancel appointment.', 'error');
        } finally {
            setIsCancelling(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                {/* Loading spinner: text-primary is Blue */}
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            // Error alert: alert-error maps to Black BG, White text
            <div role="alert" className="alert alert-error shadow-md m-4">
                <InformationCircleIcon className="w-6 h-6 mr-2"/> {/* Icon color will be White due to alert-error theme */}
                <span>Error: {error}</span>
            </div>
        );
    }

    if (!appointment) {
        return <div className="text-center p-10 text-base-content">Appointment not found.</div>; // text-base-content is Black
    }

    const canCancel = appointment.status?.toLowerCase() === 'confirmed' || appointment.status?.toLowerCase() === 'requested';

    const DetailItem = ({ icon: Icon, label, children }) => (
        <div className="flex items-start py-2">
            {/* Detail Icon: text-primary is Blue */}
            <Icon className="w-5 h-5 text-primary mr-3 mt-1 flex-shrink-0 opacity-70" />
            <div>
                {/* Label: Black text with opacity */}
                <p className="text-xs text-base-content/70 font-medium">{label}</p>
                {/* Value: Black text */}
                <div className="text-base-content">{children}</div>
            </div>
        </div>
    );

    // Determine badge class based on status for 3-color palette
    const getStatusBadgeClass = (statusStr) => {
        const statusLower = statusStr?.toLowerCase();
        if (statusLower === 'confirmed' || statusLower === 'requested') return 'badge-info'; // Blue BG
        if (statusLower === 'completed') return 'badge-success'; // Blue BG
        if (statusLower === 'cancelled' || statusLower === 'noshow') return 'badge-error'; // Black BG
        return 'badge-ghost'; // Black text on White (transparent layer) BG
    };


    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-6 flex items-center">
                {/* Back button: btn-ghost uses Black text */}
                <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mr-2 text-base-content hover:bg-base-300">
                    <ArrowLeftIcon className="w-5 h-5"/> Back
                </button>
                {/* Page Title: text-primary is Blue */}
                <h1 className="text-2xl md:text-3xl font-bold text-primary">Appointment Details</h1>
            </header>

            {/* Card: bg-base-200 is White, border-black/10 */}
            <div className="card bg-base-200 shadow-xl border border-black/10">
                <div className="card-body p-6 sm:p-8 space-y-4">
                    <div className="flex justify-between items-start">
                        {/* Card Title: text-secondary maps to Black */}
                        <h2 className="card-title text-xl text-secondary">
                            {appointment.type || 'Consultation'} with {appointment.doctor?.userAccount?.fullName || 'N/A'}
                        </h2>
                        {/* Status Badge: Dynamically styled */}
                        <span className={`badge badge-lg ${getStatusBadgeClass(appointment.status)}`}>
                            {appointment.status || 'Unknown'}
                        </span>
                    </div>
                    {/* Divider: Uses themed color (Black with opacity) */}
                    <div className="divider my-1"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                        <DetailItem icon={DoctorIcon} label="Doctor">
                            <p>{appointment.doctor?.userAccount?.fullName || 'N/A'}</p>
                            <p className="text-sm text-base-content/70">{appointment.doctor?.specialty || 'N/A'}</p>
                        </DetailItem>
                        <DetailItem icon={CalendarDaysIcon} label="Date & Time">
                            {appointment.appointmentTime ? format(new Date(appointment.appointmentTime), 'EEEE, MMMM d, yyyy') : 'N/A'} <br/>
                            {appointment.appointmentTime ? format(new Date(appointment.appointmentTime), 'p') : 'N/A'}
                            {appointment.durationMinutes && ` (${appointment.durationMinutes} mins)`}
                        </DetailItem>
                        <DetailItem icon={TagIcon} label="Reason for Visit">
                            <p className="whitespace-pre-wrap">{appointment.reasonForVisit || 'Not specified'}</p>
                        </DetailItem>
                        {appointment.status?.toLowerCase() === 'cancelled' && appointment.cancellationReason && (
                            // Cancellation Reason: text-base-content (Black) with italic
                            <DetailItem icon={InformationCircleIcon} label="Cancellation Reason">
                                <p className="text-base-content italic">{appointment.cancellationReason}</p>
                            </DetailItem>
                        )}
                        {appointment.status?.toLowerCase() === 'completed' && appointment.completionNotes && (
                            <DetailItem icon={DocumentTextIcon} label="Completion Notes">
                                <p className="whitespace-pre-wrap">{appointment.completionNotes}</p>
                            </DetailItem>
                        )}
                    </div>

                    {canCancel && (
                        <div className="card-actions justify-end pt-4">
                            {/* Cancel Button: btn-error btn-outline maps to Black outline/text, Black BG on hover */}
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-error btn-outline">
                                <NoSymbolIcon className="w-5 h-5 mr-2"/> Cancel Appointment
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <CancelAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirmCancel={handleConfirmCancel}
                isCancelling={isCancelling}
            />
        </div>
    );
}

export default AppointmentDetailPage;
