import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import appointmentService from '../services/appointment.service.js';
import AppointmentList from '../components/appointments/AppointmentList.jsx';
import { PlusCircleIcon, AdjustmentsHorizontalIcon, FunnelIcon } from '@heroicons/react/24/outline';

/**
 * Page for patients to view and manage their appointments.
 */
function AppointmentsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState(''); // e.g., 'Upcoming', 'Past', 'Cancelled'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchAppointments = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const filters = { page, limit: 5 }; // Example: 5 appointments per page
            if (filterStatus) {
                filters.status = filterStatus;
            }
            // In a real app, you might have more filters like date range

            const data = await appointmentService.getMyAppointments(filters);
            setAppointments(data.appointments || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
        } catch (err) {
            setError(err.message || 'Failed to load appointments.');
            setAppointments([]); // Clear appointments on error
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus]); // Re-fetch when filterStatus changes

    useEffect(() => {
        if (user) { // Only fetch if user is loaded
            fetchAppointments(1); // Fetch first page on initial load or filter change
        }
    }, [user, fetchAppointments]); // fetchAppointments is memoized by useCallback

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
        // fetchAppointments will be called by useEffect due to filterStatus change
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchAppointments(newPage);
        }
    };


    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8 md:mb-12 pb-4 border-b border-black/10 flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">Your Appointments</h1>
                    <p className="text-base-content/70 mt-1">View and manage your scheduled consultations.</p>
                </div>
                <Link to="/book-appointment" className="btn btn-primary mt-4 sm:mt-0">
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Book New Appointment
                </Link>
            </header>

            {/* Filters Section */}
            <div className="mb-6 p-4 bg-base-200 rounded-lg shadow-sm border border-black/5">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="form-control w-full sm:w-auto">
                        <label htmlFor="statusFilter" className="label pb-1">
                            <span className="label-text text-sm font-medium flex items-center">
                                <FunnelIcon className="w-4 h-4 mr-1 text-secondary"/>Filter by Status:
                            </span>
                        </label>
                        <select
                            id="statusFilter"
                            className="select select-sm select-bordered border-black/20 focus:border-primary focus:ring-primary"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Statuses</option>
                            <option value="Requested">Requested</option>
                            <option value="Confirmed">Upcoming/Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="NoShow">No Show</option>
                        </select>
                    </div>
                    {/* Add more filters like date range picker here if needed */}
                </div>
            </div>


            {isLoading && (
                <div className="text-center py-10">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-2 text-base-content/70">Loading appointments...</p>
                </div>
            )}
            {error && !isLoading && (
                <div role="alert" className="alert alert-error shadow-md"> {/* Error is Orange */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>Error: {error}</span>
                </div>
            )}
            {!isLoading && !error && (
                <AppointmentList
                    appointments={appointments}
                    emptyMessage={filterStatus ? `No appointments found with status: ${filterStatus}.` : "You haven't scheduled any appointments yet."}
                />
            )}

            {/* Pagination Controls */}
            {!isLoading && !error && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                    <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &laquo; Previous
                    </button>
                    <span className="text-sm text-base-content/80">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next &raquo;
                    </button>
                </div>
            )}
        </div>
    );
}

export default AppointmentsPage;
