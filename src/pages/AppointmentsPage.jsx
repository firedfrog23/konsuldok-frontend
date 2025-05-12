// src/pages/AppointmentsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // useNavigate removed as not used
import { useAuth } from '../contexts/AuthContext.jsx';
import appointmentService from '../services/appointment.service.js';
import AppointmentList from '../components/appointments/AppointmentList.jsx';
import { PlusCircleIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../contexts/NotificationContext.jsx';

/**
 * Page for patients to view and manage their appointments.
 * Adheres to strict 3-color palette and UI/UX standards.
 * - Header: Title (Blue). "Book New" button (Blue BG).
 * - Filter Select: White BG, Black text/border. Focus is Blue. Icon is Black.
 * - Summary Text: Black text, Blue for counts.
 * - Loading Spinner: Blue. Error Alert: Black BG. Empty State Icon: Black.
 * - Pagination Buttons: Blue outline/text for active/navigation, Black text for current page number.
 */
function AppointmentsPage() {
    const { user } = useAuth();
    const { addNotification } = useNotification();

    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);

    const PAGE_LIMIT = 5;

    const fetchAppointments = useCallback(async (page = 1) => {
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
            const errorMsg = err.message || 'Failed to load appointments.';
            setError(errorMsg);
            addNotification(errorMsg, 'error'); // Themed error (Black BG)
            setAppointments([]);
        } finally {
            setIsLoading(false);
        }
    }, [filterStatus, addNotification]);

    useEffect(() => {
        if (user) {
            fetchAppointments(1);
        }
    }, [user, fetchAppointments]); // fetchAppointments dependency will re-run if filterStatus changes

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1); // Reset to first page, useEffect will trigger fetch
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            fetchAppointments(newPage);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <header className="mb-8 pb-4 border-b border-black/10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        {/* Title: text-primary is Blue */}
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">Your Appointments</h1>
                        {/* Subtext: text-base-content is Black */}
                        <p className="text-base-content/70 mt-1">View past, upcoming, and manage your consultations.</p>
                    </div>
                    {/* Book New Button: btn-primary is Blue BG, White text */}
                    <Link to="/book-appointment" className="btn btn-primary shadow-sm hover:shadow-md transition-shadow">
                        <PlusCircleIcon className="w-5 h-5 mr-2" /> Book New Appointment
                    </Link>
                </div>
            </header>

            {/* Filters and Summary Section: bg-base-200 is White */}
            <section className="mb-8 p-4 bg-base-200 rounded-lg shadow-sm border border-black/5">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="form-control w-full sm:max-w-xs">
                        <label htmlFor="statusFilter" className="label pb-1 sr-only">
                            <span className="label-text">Filter by Status</span>
                        </label>
                        <div className="relative">
                            {/* Filter Icon: text-neutral (Black) with opacity */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <FunnelIcon className="w-4 h-4 text-neutral opacity-40" />
                            </span>
                            {/* Select: White BG, Black text/border. Focus is Blue. */}
                            <select
                                id="statusFilter"
                                className="select select-bordered pl-10 border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
                    </div>
                    {!isLoading && !error && (
                        // Summary Text: text-base-content (Black), text-primary (Blue) for counts
                        <div className="text-sm text-base-content/70">
                            Showing <span className="font-semibold text-primary">{appointments.length}</span> of <span className="font-semibold text-primary">{totalAppointments}</span> appointments
                            {filterStatus && <span className="ml-1">(Status: {filterStatus})</span>}
                        </div>
                    )}
                </div>
            </section>

            {/* Appointments List Display */}
            <section>
                {isLoading && (
                    <div className="text-center py-20">
                        {/* Spinner: text-primary is Blue */}
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="mt-3 text-base-content/70">Loading your appointments...</p>
                    </div>
                )}
                {error && !isLoading && (
                    // Error Alert: alert-error maps to Black BG, White text
                    <div role="alert" className="alert alert-error shadow-lg my-6">
                        <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6"/> {/* Icon will be White */}
                        <div>
                            <h3 className="font-bold">Error Loading Appointments</h3>
                            <div className="text-xs">{error}</div>
                        </div>
                    </div>
                )}
                {!isLoading && !error && (
                    // AppointmentList component handles its own theming internally
                    <AppointmentList
                        appointments={appointments}
                        emptyMessage={filterStatus ? `No appointments found with status: ${filterStatus}.` : "You haven't scheduled any appointments yet."}
                    />
                )}
            </section>

            {/* Pagination Controls */}
            {!isLoading && !error && totalAppointments > 0 && totalPages > 1 && (
                <section className="mt-8 pt-4 border-t border-black/10">
                    <div className="flex justify-center items-center space-x-2">
                        {/* Prev/Next Buttons: btn-outline btn-primary are Blue outline/text */}
                        <button
                            className="btn btn-sm btn-outline btn-primary disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeftIcon className="w-4 h-4"/>
                            Previous
                        </button>

                        <div className="join">
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                ) {
                                    return (
                                        // Current Page: btn-primary (Blue BG, White text)
                                        // Other Pages: btn-ghost (Black text)
                                        <button
                                            key={pageNum}
                                            className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost text-base-content'}`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    (pageNum === currentPage - 2 && currentPage > 2) ||
                                    (pageNum === currentPage + 2 && currentPage < totalPages - 1)
                                ) {
                                    return <button key={pageNum} className="join-item btn btn-sm btn-disabled btn-ghost">...</button>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            className="btn btn-sm btn-outline btn-primary disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            Next
                            <ChevronRightIcon className="w-4 h-4"/>
                        </button>
                    </div>
                    <p className="text-center text-xs text-base-content/60 mt-3">
                        Page {currentPage} of {totalPages} (Total: {totalAppointments} appointments)
                    </p>
                </section>
            )}
        </div>
    );
}

export default AppointmentsPage;
