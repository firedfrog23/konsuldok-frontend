// src/pages/patient/LabResultsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import patientDataService from '../../services/patientData.service.js';
import LabResultListItem from '../../components/medical/LabResultListItem.jsx';
import { BeakerIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../contexts/NotificationContext.jsx';

/**
 * Page for patients to view all their lab results with pagination.
 */
function LabResultsPage() {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const [labResults, setLabResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const PAGE_LIMIT = 10;

    const fetchLabResults = useCallback(async (page = 1) => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await patientDataService.getAllMyLabResults({ page, limit: PAGE_LIMIT });
            setLabResults(data.results || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
            setTotalResults(data.totalCount || 0);
        } catch (err) {
            const errorMsg = err.message || "Failed to load lab results.";
            setError(errorMsg);
            addNotification(errorMsg, 'error');
            setLabResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification]);

    useEffect(() => {
        fetchLabResults(currentPage);
    }, [fetchLabResults, currentPage]); // Re-fetch when currentPage changes

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8 md:mb-12 pb-4 border-b border-black/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                     <Link to="/medical-records" className="btn btn-ghost btn-sm mr-2 -ml-2 text-primary hover:bg-primary/10">
                        <ChevronLeftIcon className="w-5 h-5"/> Back to Records
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">My Lab Results</h1>
                </div>
                {/* Placeholder for future "Upload Lab Result" button if patients can upload */}
                {/* <button className="btn btn-secondary btn-sm mt-4 sm:mt-0">
                    <DocumentPlusIcon className="w-5 h-5 mr-1"/> Upload New Result
                </button> */}
            </header>

            {isLoading && (
                <div className="text-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span><p className="mt-3 text-base-content/70">Loading lab results...</p></div>
            )}
            {error && !isLoading && (
                <div role="alert" className="alert alert-error shadow-lg my-6 bg-secondary/10 border-secondary/30 text-secondary">
                    <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6"/>
                    <div><h3 className="font-bold">Error Loading Results</h3><div className="text-xs">{error}</div></div>
                </div>
            )}
            {!isLoading && !error && (
                labResults.length > 0 ? (
                    <>
                        <ul className="divide-y divide-base-300 bg-base-100 shadow-md rounded-lg border border-black/10 p-2 sm:p-0"> {/* Removed p-4 for tighter list */}
                            {labResults.map(result => (
                                <LabResultListItem key={result._id} result={result} />
                            ))}
                        </ul>
                        {totalPages > 1 && (
                            <section className="mt-8 pt-4 border-t border-black/10">
                                <div className="flex justify-center items-center space-x-2">
                                    <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page"><ChevronLeftIcon className="w-4 h-4"/>Previous</button>
                                    <div className="join"> {[...Array(totalPages)].map((_, i) => { const pageNum = i + 1; if ( pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) ) { return ( <button key={pageNum} className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`} onClick={() => handlePageChange(pageNum)} > {pageNum} </button> ); } else if ( (pageNum === currentPage - 2 && currentPage > 2) || (pageNum === currentPage + 2 && currentPage < totalPages - 1) ) { return <button key={pageNum} className="join-item btn btn-sm btn-disabled btn-ghost">...</button>; } return null; })} </div>
                                    <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">Next<ChevronRightIcon className="w-4 h-4"/></button>
                                </div>
                                <p className="text-center text-xs text-base-content/60 mt-3">Page {currentPage} of {totalPages} (Total: {totalResults} results)</p>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16 bg-base-200 rounded-lg shadow"><BeakerIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" /><p className="text-base-content/70">You have no lab results available.</p></div>
                )
            )}
        </div>
    );
}
export default LabResultsPage;
