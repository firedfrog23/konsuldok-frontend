// src/pages/patient/MedicationsPage.jsx
import { ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentListIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // PlusCircleIcon removed
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MedicationListItem from '../../components/medications/MedicationListItem.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import patientDataService from '../../services/patient.service.js';

/**
 * Page for patients to view their medications with pagination and filtering.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function MedicationsPage() {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [medications, setMedications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMedications, setTotalMedications] = useState(0);
    const [filterStatus, setFilterStatus] = useState('active');

    const PAGE_LIMIT = 10;

    const fetchMedications = useCallback(async (page = 1) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const filters = { page, limit: PAGE_LIMIT, status: filterStatus };
            const data = await patientDataService.getAllMyMedications(filters);
            setMedications(data.medications || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
            setTotalMedications(data.totalCount || 0);
        } catch (err) {
            const errorMsg = err.message || "Failed to load medications.";
            setError(errorMsg);
            addNotification(errorMsg, 'error'); // Themed error (Black BG)
            setMedications([]);
        } finally {
            setIsLoading(false);
        }
    }, [user, filterStatus, addNotification]);

    useEffect(() => {
        fetchMedications(currentPage);
    }, [fetchMedications, currentPage]);

    useEffect(() => {
        const oldPage = currentPage;
        setCurrentPage(1);
        if (oldPage === 1) {
            fetchMedications(1);
        }
    }, [filterStatus]); // Removed fetchMedications from deps to avoid loop, rely on currentPage change

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header: Back link (Blue), Title (Blue) */}
            <header className="mb-8 md:mb-12 pb-4 border-b border-black/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                    <Link to="/medical-records" className="btn btn-ghost btn-sm mr-2 -ml-2 text-primary hover:bg-primary/10">
                        <ChevronLeftIcon className="w-5 h-5"/> Back to Records
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">My Medications</h1>
                </div>
            </header>

            {/* Filter Tabs: Active tab is Blue BG, White text. Inactive tabs Black text on White BG. */}
            <div className="tabs tabs-boxed bg-base-200 p-1 mb-6 shadow-sm border border-black/5">
                <button className={`tab tab-sm sm:tab-md flex-grow ${filterStatus === 'active' ? 'tab-active !bg-primary text-primary-content' : 'text-base-content hover:bg-base-300'}`} onClick={() => setFilterStatus('active')}>Active</button>
                <button className={`tab tab-sm sm:tab-md flex-grow ${filterStatus === 'inactive' ? 'tab-active !bg-primary text-primary-content' : 'text-base-content hover:bg-base-300'}`} onClick={() => setFilterStatus('inactive')}>Inactive/Past</button>
                <button className={`tab tab-sm sm:tab-md flex-grow ${filterStatus === 'all' ? 'tab-active !bg-primary text-primary-content' : 'text-base-content hover:bg-base-300'}`} onClick={() => setFilterStatus('all')}>All Medications</button>
            </div>

            {isLoading && (
                <div className="text-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span> {/* Spinner Blue */}
                    <p className="mt-3 text-base-content/70">Loading medications...</p>
                </div>
            )}
            {error && !isLoading && (
                // Error Alert: alert-neutral maps to Black BG, White text
                <div role="alert" className="alert alert-neutral shadow-lg my-6">
                    <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6 text-neutral-content"/>
                    <div><h3 className="font-bold text-neutral-content">Error Loading Medications</h3><div className="text-xs text-neutral-content/80">{error}</div></div>
                </div>
            )}
            {!isLoading && !error && (
                medications.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {medications.map(med => (
                                // MedicationListItem handles its own theming
                                <MedicationListItem key={med._id} medication={med} />
                            ))}
                        </div>
                        {/* Pagination: Blue outline/text for nav buttons, Blue BG for current page */}
                        {totalPages > 1 && (
                            <section className="mt-8 pt-4 border-t border-black/10">
                                <div className="flex justify-center items-center space-x-2">
                                    <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"><ChevronLeftIcon className="w-4 h-4"/>Previous</button>
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
                                    <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">Next<ChevronRightIcon className="w-4 h-4"/></button>
                                </div>
                                <p className="text-center text-xs text-base-content/60 mt-3">Page {currentPage} of {totalPages} (Total: {totalMedications} medications)</p>
                            </section>
                        )}
                    </>
                ) : (
                    // Empty State: Icon Black
                    <div className="text-center py-16 bg-base-200 rounded-lg shadow">
                        <ClipboardDocumentListIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" />
                        <p className="text-base-content/70">No medications found for this view.</p>
                    </div>
                )
            )}
        </div>
    );
}
export default MedicationsPage;
