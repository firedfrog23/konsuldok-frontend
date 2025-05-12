// src/pages/doctor/DoctorAppointmentsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // useNavigate removed as not used
import { useAuth } from '../../contexts/AuthContext.jsx';
import appointmentService from '../../services/appointment.service.js';
import { useNotification } from '../../contexts/NotificationContext.jsx';
// format from date-fns is not directly used here, but DoctorAppointmentListItem uses it.
import {
    CalendarDaysIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon,
    ExclamationTriangleIcon // PencilSquareIcon, InformationCircleIcon removed as not directly used
} from '@heroicons/react/24/outline';
import UpdateAppointmentStatusModal from '../../components/doctor/UpdateAppointmentStatusModal.jsx';
import DoctorAppointmentListItem from '../../components/doctor/DoctorAppointmentListItem.jsx';

/**
 * Page for Doctors to view and manage their appointments.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function DoctorAppointmentsPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const { addNotification } = useNotification();
    // const navigate = useNavigate(); // Not used

    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
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
            setAppointments([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const filters = { page, limit: PAGE_LIMIT };
            if (filterStatus) {
                filters.status = filterStatus;
            }
            const data = await appointmentService.getMyAppointments(filters);
            setAppointments(data.appointments || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
            setTotalAppointments(data.totalCount || 0);
        } catch (err) {
            const errorMsg = err.message || 'Failed to load your appointments.';
            setError(errorMsg);
            addNotification(errorMsg, 'error'); // Themed error (Black BG)
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    }, [user, filterStatus, addNotification]);

    useEffect(() => {
        if (!isAuthLoading && user) { // Ensure auth state is resolved and user exists
             fetchDoctorAppointments(currentPage);
        } else if (!isAuthLoading && !user) {
            setIsLoading(false);
            setError("User not authenticated.");
        }
    }, [isAuthLoading, user, fetchDoctorAppointments, currentPage]);

    useEffect(() => {
        if (!isAuthLoading && user) {
            const oldPage = currentPage;
            setCurrentPage(1);
            if (oldPage === 1) {
                fetchDoctorAppointments(1);
            }
        }
    }, [filterStatus, user, isAuthLoading]); // Added isAuthLoading


    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
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
            addNotification('Appointment status updated successfully!', 'success'); // Themed success (Blue BG)
            setIsUpdateModalOpen(false);
            setSelectedAppointmentForUpdate(null);
            fetchDoctorAppointments(currentPage);
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
            {/* Header: Title Blue, Subtext Black */}
            <header className="mb-8 pb-4 border-b border-black/10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">My Appointments Schedule</h1>
                        <p className="text-base-content/70 mt-1">View and manage your patient appointments.</p>
                    </div>
                </div>
            </header>

            {/* Filters: White BG, Black text/border for select, Blue focus */}
            <section className="mb-8 p-4 bg-base-200 rounded-lg shadow-sm border border-black/5">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="form-control w-full md:w-auto md:min-w-[250px]">
                        <label htmlFor="statusFilterDoctor" className="label pb-1 sr-only"><span className="label-text">Filter by Status</span></label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"><FunnelIcon className="w-4 h-4 text-neutral opacity-40" /></span>
                            <select id="statusFilterDoctor"
                                className="select select-bordered pl-10 border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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

            {/* Appointments List */}
            <section>
                {isLoading ? (
                    <div className="text-center py-20"> <span className="loading loading-spinner loading-lg text-primary"></span> <p className="mt-3 text-base-content/70">Loading your appointments...</p> </div>
                ) : error ? (
                    <div role="alert" className="alert alert-neutral shadow-lg my-6"> {/* Black BG for error */}
                        <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6 text-neutral-content"/>
                        <div> <h3 className="font-bold text-neutral-content">Error Loading Appointments</h3> <div className="text-xs text-neutral-content/80">{error}</div> </div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-10 bg-base-200 rounded-lg shadow">
                        <CalendarDaysIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" /> {/* Icon Black opacity */}
                        <p className="text-base-content/70 mb-4">
                            {filterStatus ? `No appointments found with status: ${filterStatus}.` : "You have no appointments scheduled."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map(appointment => (
                            // DoctorAppointmentListItem handles its own theming
                            <DoctorAppointmentListItem
                                key={appointment._id}
                                appointment={appointment}
                                onUpdateStatusClick={openUpdateStatusModal}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Pagination: Blue outline/text for nav buttons, Blue BG for current page */}
            {!isLoading && !error && totalAppointments > 0 && totalPages > 1 && (
                <section className="mt-8 pt-4 border-t border-black/10">
                    <div className="flex justify-center items-center space-x-2">
                        <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"> <ChevronLeftIcon className="w-4 h-4"/> Previous </button>
                        <div className="join">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if ( pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ) {
                                    return ( <button key={pageNum} className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost text-base-content'}`} onClick={() => handlePageChange(pageNum)} > {pageNum} </button> );
                                } else if ( (pageNum === currentPage - 2 && currentPage > 2) || (pageNum === currentPage + 2 && currentPage < totalPages - 1) ) {
                                    return <button key={pageNum} className="join-item btn btn-sm btn-disabled btn-ghost">...</button>;
                                }
                                return null;
                            })}
                        </div>
                        <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page"> Next <ChevronRightIcon className="w-4 h-4"/> </button>
                    </div>
                    <p className="text-center text-xs text-base-content/60 mt-3"> Page {currentPage} of {totalPages} (Total: {totalAppointments} appointments) </p>
                </section>
            )}

            {selectedAppointmentForUpdate && (
                // UpdateAppointmentStatusModal handles its own theming
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
