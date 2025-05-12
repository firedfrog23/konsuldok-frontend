// src/pages/doctor/DoctorAppointmentsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import appointmentService from '../../services/appointment.service.js';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import { format } from 'date-fns';
import {
    CalendarDaysIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon,
    PencilSquareIcon, ExclamationTriangleIcon, InformationCircleIcon
} from '@heroicons/react/24/outline';
import UpdateAppointmentStatusModal from '../../components/doctor/UpdateAppointmentStatusModal.jsx';
import DoctorAppointmentListItem from '../../components/doctor/DoctorAppointmentListItem.jsx';

/**
 * Page for Doctors to view and manage their appointments.
 */
function DoctorAppointmentsPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState(''); // Default to show all
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);

    const [selectedAppointmentForUpdate, setSelectedAppointmentForUpdate] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const PAGE_LIMIT = 10;

    const fetchDoctorAppointments = useCallback(async (page = 1) => {
        if (!user || user.role !== 'Doctor' || !user.doctorProfile) {
            setError("Access denied or doctor profile not found.");
            setIsLoading(false);
            setAppointments([]); // Clear appointments
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const filters = { page, limit: PAGE_LIMIT };
            // Backend's getMyAppointments should use req.user.doctorProfile if user.role is Doctor
            if (filterStatus) {
                filters.status = filterStatus;
            }
            // Example: Add date range filter for "today" or "this week"
            // filters.startDate = format(new Date(), 'yyyy-MM-dd'); // For today's appointments

            const data = await appointmentService.getMyAppointments(filters);
            setAppointments(data.appointments || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
            setTotalAppointments(data.totalCount || 0);
        } catch (err) {
            const errorMsg = err.message || 'Failed to load your appointments.';
            setError(errorMsg);
            addNotification(errorMsg, 'error');
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    }, [user, filterStatus, addNotification]);

    useEffect(() => {
        fetchDoctorAppointments(currentPage); // Fetch based on current page
    }, [fetchDoctorAppointments, currentPage]); // Rerun if fetchDoctorAppointments or currentPage changes

    // Effect to refetch when filterStatus changes, resetting to page 1
    useEffect(() => {
        if (user) { // Ensure user is loaded before initial fetch due to filter change
           setCurrentPage(1); // Reset to page 1 when filter changes
           // fetchDoctorAppointments will be called by the above useEffect because currentPage potentially changes
           // or if fetchDoctorAppointments dependency on filterStatus triggers it.
           // To be explicit, call it here if currentPage was already 1.
           if (currentPage === 1) {
               fetchDoctorAppointments(1);
           }
        }
    }, [filterStatus, user]); // Only trigger for filterStatus change after user is loaded


    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        // Page reset and fetch is handled by the useEffect above
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage); // This will trigger the useEffect to fetch appointments
        }
    };

    const openUpdateStatusModal = (appointment) => {
        setSelectedAppointmentForUpdate(appointment);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateStatus = async (updatePayload) => {
        if (!selectedAppointmentForUpdate) return;
        setIsUpdatingStatus(true);
        try {
            await appointmentService.updateAppointment(selectedAppointmentForUpdate._id, updatePayload);
            addNotification('Appointment status updated successfully!', 'success');
            setIsUpdateModalOpen(false);
            setSelectedAppointmentForUpdate(null);
            fetchDoctorAppointments(currentPage); // Refresh the current page
        } catch (err) {
            addNotification(err.message || 'Failed to update status.', 'error');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    if (isAuthLoading && !user) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> <span className="loading loading-spinner loading-lg text-primary"></span> </div> );
    }


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8 pb-4 border-b border-black/10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">My Appointments Schedule</h1>
                        <p className="text-base-content/70 mt-1">View and manage your patient appointments.</p>
                    </div>
                    {/* Optional: Link to manage availability */}
                    {/* <Link to="/doctor/manage-availability" className="btn btn-secondary btn-outline">Manage My Availability</Link> */}
                </div>
            </header>

            {/* Filters and Summary Section */}
            <section className="mb-8 p-4 bg-base-200 rounded-lg shadow-sm border border-black/5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="form-control w-full md:w-auto md:min-w-[250px]">
                        <label htmlFor="statusFilterDoctor" className="label pb-1 sr-only"><span className="label-text">Filter by Status</span></label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><FunnelIcon className="w-4 h-4 text-neutral opacity-40" /></span>
                            <select id="statusFilterDoctor" className="select select-bordered pl-10 border-black/20 w-full focus:border-primary focus:ring-1 focus:ring-primary"
                                value={filterStatus} onChange={handleFilterChange}>
                                <option value="">All My Appointments</option>
                                <option value="Requested">Requested by Patient</option>
                                <option value="Confirmed">Confirmed / Upcoming</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="NoShow">No Show</option>
                            </select>
                        </div>
                    </div>
                    {!isLoading && !error && (
                        <div className="text-sm text-base-content/70">
                            Showing <span className="font-semibold text-primary">{appointments.length}</span> of <span className="font-semibold text-primary">{totalAppointments}</span> appointments
                            {filterStatus && <span className="ml-1">(Status: {filterStatus})</span>}
                        </div>
                    )}
                </div>
            </section>

            {/* Appointments List Display */}
            <section>
                {isLoading ? (
                    <div className="text-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-3 text-base-content/70">Loading your appointments...</p>
                    </div>
                ) : error ? (
                    <div role="alert" className="alert alert-error shadow-lg my-6 bg-secondary/10 border-secondary/30 text-secondary">
                        <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6"/>
                        <div> <h3 className="font-bold">Error Loading Appointments</h3> <div className="text-xs">{error}</div> </div>
                    </div>
                ) : appointments.length === 0 ? (
                     <div className="text-center py-10 bg-base-200 rounded-lg shadow">
                        <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" />
                        <p className="text-base-content/70 mb-4">
                            {filterStatus ? `No appointments found with status: ${filterStatus}.` : "You have no appointments scheduled."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map(appointment => (
                            <DoctorAppointmentListItem
                                key={appointment._id}
                                appointment={appointment}
                                onUpdateStatusClick={openUpdateStatusModal}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Pagination Controls */}
            {!isLoading && !error && totalAppointments > 0 && totalPages > 1 && (
                <section className="mt-8 pt-4 border-t border-black/10">
                    {/* ... (Pagination UI remains the same) ... */}
                    <div className="flex justify-center items-center space-x-2"> <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"> <ChevronLeftIcon className="w-4 h-4"/> Previous </button> <div className="join"> {[...Array(totalPages)].map((_, i) => { const pageNum = i + 1; if ( pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ) { return ( <button key={pageNum} className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handlePageChange(pageNum)} > {pageNum} </button> ); } else if ( (pageNum === currentPage - 2 && currentPage > 2) || (pageNum === currentPage + 2 && currentPage < totalPages - 1) ) { return <button key={pageNum} className="join-item btn btn-sm btn-disabled btn-ghost">...</button>; } return null; })} </div> <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page"> Next <ChevronRightIcon className="w-4 h-4"/> </button> </div> <p className="text-center text-xs text-base-content/60 mt-3"> Page {currentPage} of {totalPages} (Total: {totalAppointments} appointments) </p>
                </section>
            )}

            {selectedAppointmentForUpdate && (
                <UpdateAppointmentStatusModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdateStatus={handleUpdateStatus}
                    appointment={selectedAppointmentForUpdate}
                    isUpdating={isUpdatingStatus}
                />
            )}
        </div>
    );
}

export default DoctorAppointmentsPage;
