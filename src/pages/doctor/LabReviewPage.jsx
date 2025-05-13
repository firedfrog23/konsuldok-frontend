/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/doctor/LabReviewPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
// Assume a service for fetching lab results needing review and updating them
// import labService from '../../services/lab.service.js'; // This would be a new service or part of patientDataService/doctorService
import { CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon, DocumentMagnifyingGlassIcon, EyeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import patientDataService from '../../services/patientData.service.js'; // Using existing for mock

/**
 * LabReviewPage allows doctors to review pending lab results.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function LabReviewPage() {
    const { user } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    const [pendingLabs, setPendingLabs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // const [selectedLab, setSelectedLab] = useState(null); // For a modal-based review
    // const [isReviewing, setIsReviewing] = useState(false);

    const PAGE_LIMIT = 10;

    const fetchPendingLabs = useCallback(async (page = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            // Placeholder: Replace with actual service call
            // const data = await labService.getPendingReviewLabs({ doctorId: user.doctorProfile._id, page, limit: PAGE_LIMIT });
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
            // Mock data - in reality, this would filter for status like 'Pending Review' or 'Action Required' by this doctor
            const allLabs = await patientDataService.getAllMyLabResults({ limit: 50 }); // Fetch a larger set to mock
            const labsForReview = (allLabs.results || [])
                .filter(lab => lab.status === 'Action Required' || lab.status === 'Pending Review by Doctor') // Example statuses
                .map(lab => ({ ...lab, patientName: `Patient ${lab._id.slice(-4)}` })); // Add mock patient name

            const paginatedLabs = labsForReview.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

            setPendingLabs(paginatedLabs);
            setTotalPages(Math.ceil(labsForReview.length / PAGE_LIMIT));
            setCurrentPage(page);

        } catch (err) {
            const errorMsg = err.message || 'Failed to load lab results for review.';
            setError(errorMsg);
            addNotification(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification]); // user dependency for doctorId

    useEffect(() => {
        if (user?.doctorProfile) { // Ensure doctor profile exists
            fetchPendingLabs(currentPage);
        } else if (user && !user.doctorProfile) {
            setError("Doctor profile not found. Cannot load labs for review.");
            setIsLoading(false);
        }
    }, [user, currentPage, fetchPendingLabs]);

    const handleMarkAsReviewed = async (labId) => {
        addNotification(`Marking lab ${labId} as reviewed (simulated).`, 'info');
        // Placeholder:
        // setIsReviewing(true);
        // try {
        //     await labService.markLabAsReviewed(labId, { reviewedBy: user._id, reviewNotes: "Reviewed and acknowledged." });
        //     addNotification('Lab result marked as reviewed.', 'success');
        //     fetchPendingLabs(currentPage); // Refresh list
        // } catch (err) {
        //     addNotification(err.message || 'Failed to mark lab as reviewed.', 'error');
        // } finally {
        //     setIsReviewing(false);
        // }
        setPendingLabs(prev => prev.filter(lab => lab._id !== labId)); // Optimistic UI update for mock
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };


    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (error) {
        return (
            <div className="text-center p-10">
                <InformationCircleIcon className="w-12 h-12 mx-auto text-neutral mb-4" />
                <p className="text-xl font-semibold text-base-content">Error Loading Labs for Review</p>
                <p className="text-base-content/80 mt-2">{error}</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-6">Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-8 pb-4 border-b border-black/10">
                <div className="flex items-center">
					<Link to="/dashboard" className="btn btn-ghost btn-sm mr-3 text-primary hover:bg-primary/10">
                        <ArrowLeftIcon className="w-5 h-5"/> Dashboard
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">Lab Results for Review</h1>
                </div>
                <p className="text-base-content/70 mt-1 pl-12">Review and acknowledge pending laboratory results.</p>
            </header>

            {pendingLabs.length === 0 && !isLoading && (
                <div className="text-center py-16 bg-base-200 rounded-lg shadow">
                    <DocumentMagnifyingGlassIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" />
                    <p className="text-base-content/70">No lab results currently requiring your review.</p>
                </div>
            )}

            {pendingLabs.length > 0 && (
                <div className="overflow-x-auto bg-base-100 rounded-lg shadow border border-black/10">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-300 text-base-content">
                            <tr>
                                <th>Patient Name</th>
                                <th>Test Name</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Summary</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingLabs.map(lab => (
                                <tr key={lab._id} className="hover:bg-base-200">
                                    <td className="font-medium text-base-content">
                                        <Link to={`/patient/${lab.patientId || lab._id.slice(-6)}/chart`} className="link link-hover text-primary">
                                            {lab.patientName || `Patient ${lab._id.slice(-6)}`}
                                        </Link>
                                    </td>
                                    <td className="text-base-content">{lab.name}</td>
                                    <td className="text-base-content/80">{format(new Date(lab.date), 'PP')}</td>
                                    <td>
                                        <span className={`badge badge-sm ${lab.status === 'Action Required' ? 'badge-neutral text-neutral-content' : 'badge-info text-info-content'}`}>
                                            {lab.status}
                                        </span>
                                    </td>
                                    <td className="text-xs text-base-content/70 max-w-xs truncate" title={lab.summary}>{lab.summary}</td>
                                    <td className="space-x-1">
                                        <a href={lab.reportUrl || '#'} target="_blank" rel="noopener noreferrer" className={`btn btn-xs btn-ghost ${lab.reportUrl ? 'text-primary' : 'text-base-content/50 cursor-not-allowed'}`} title="View Full Report">
                                            <EyeIcon className="w-4 h-4"/>
                                        </a>
                                        <button onClick={() => handleMarkAsReviewed(lab._id)} className="btn btn-xs btn-outline btn-primary" title="Mark as Reviewed">
                                            <CheckCircleIcon className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
                    <p className="text-center text-xs text-base-content/60 mt-3">Page {currentPage} of {totalPages}</p>
                </section>
            )}
        </div>
    );
}

export default LabReviewPage;
