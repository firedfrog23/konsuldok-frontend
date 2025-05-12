// src/pages/patient/HealthGoalsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import patientDataService from '../../services/patientData.service.js';
import HealthGoalListItem from '../../components/goals/HealthGoalListItem.jsx';
import HealthGoalForm from '../../components/goals/HealthGoalForm.jsx';
import { FlagIcon, PlusCircleIcon, ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import { motion, AnimatePresence } from 'framer-motion'; // For modal animation

/**
 * Page for patients to view, add, edit, and delete their health goals.
 * Implements pagination, modal forms for CRUD operations, loading and error states.
 */
function HealthGoalsPage() {
    const { user } = useAuth(); // Get authenticated user
    const { addNotification } = useNotification(); // For user feedback

    // State for health goals list and UI management
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGoals, setTotalGoals] = useState(0);

    // Modal state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null); // null for new goal, goal object for editing
    const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

    const PAGE_LIMIT = 5; // Number of goals to display per page

    /**
     * Fetches health goals for the current page and filter.
     * Wrapped in useCallback to memoize the function.
     */
    const fetchHealthGoals = useCallback(async (page = 1) => {
        if (!user) return; // Don't fetch if no user
        setIsLoading(true);
        setError(null);
        try {
            const data = await patientDataService.getAllMyHealthGoals({ page, limit: PAGE_LIMIT });
            setGoals(data.goals || []);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
            setTotalGoals(data.totalCount || 0);
        } catch (err) {
            const errorMsg = err.message || "Failed to load health goals.";
            setError(errorMsg);
            addNotification(errorMsg, 'error');
            setGoals([]); // Clear goals on error
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification]); // Dependencies for useCallback

    // Fetch goals when component mounts or currentPage/fetchHealthGoals changes
    useEffect(() => {
        fetchHealthGoals(currentPage);
    }, [fetchHealthGoals, currentPage]);

    /**
     * Handles changing the current page for pagination.
     * @param {number} newPage - The page number to navigate to.
     */
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage); // This will trigger the useEffect to fetch goals
        }
    };

    /**
     * Opens the modal for adding a new health goal.
     */
    const handleOpenAddModal = () => {
        setEditingGoal(null); // Ensure no existing goal data is pre-filled
        setIsFormModalOpen(true);
    };

    /**
     * Opens the modal for editing an existing health goal.
     * @param {object} goal - The goal object to edit.
     */
    const handleOpenEditModal = (goal) => {
        setEditingGoal(goal);
        setIsFormModalOpen(true);
    };

    /**
     * Closes the add/edit health goal modal.
     */
    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingGoal(null); // Clear editing state
    };

    /**
     * Handles the submission of the health goal form (add or update).
     * @param {object} goalData - The data from the HealthGoalForm.
     */
    const handleGoalSubmit = async (goalData) => {
        setIsSubmittingGoal(true);
        try {
            if (editingGoal && editingGoal._id) {
                // Update existing goal
                await patientDataService.updateHealthGoal(editingGoal._id, goalData);
                addNotification('Health goal updated successfully!', 'success');
            } else {
                // Add new goal
                await patientDataService.addHealthGoal(goalData);
                addNotification('New health goal added successfully!', 'success');
            }
            handleCloseFormModal();
            fetchHealthGoals(editingGoal ? currentPage : 1); // Refresh list, go to page 1 for new goal
        } catch (err) {
            addNotification(err.message || 'Failed to save health goal.', 'error');
        } finally {
            setIsSubmittingGoal(false);
        }
    };

    /**
     * Handles the deletion of a health goal.
     * @param {string} goalId - The ID of the goal to delete.
     */
    const handleDeleteGoal = async (goalId) => {
        // Standard practice: Confirm deletion with the user
        if (window.confirm('Are you sure you want to delete this health goal? This action cannot be undone.')) {
            // In a real app, you might have a loading state for deletion
            try {
                await patientDataService.deleteHealthGoal(goalId);
                addNotification('Health goal deleted.', 'info'); // Info is Blue
                // Refresh list, potentially adjusting page if it was the last item on a page
                if (goals.length === 1 && currentPage > 1) {
                    fetchHealthGoals(currentPage - 1);
                } else {
                    fetchHealthGoals(currentPage);
                }
            } catch (err) {
                addNotification(err.message || 'Failed to delete health goal.', 'error');
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <header className="mb-8 md:mb-12 pb-4 border-b border-black/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                     <Link to="/medical-records" className="btn btn-ghost btn-sm mr-2 -ml-2 text-primary hover:bg-primary/10">
                        <ChevronLeftIcon className="w-5 h-5"/> Back to Records
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary">My Health Goals</h1>
                </div>
                <button onClick={handleOpenAddModal} className="btn btn-primary mt-4 sm:mt-0 shadow-sm hover:shadow-md transition-shadow">
                    <PlusCircleIcon className="w-5 h-5 mr-2" /> Add New Goal
                </button>
            </header>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-3 text-base-content/70">Loading your health goals...</p>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div role="alert" className="alert alert-error shadow-lg my-6 bg-secondary/10 border-secondary/30 text-secondary">
                    <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6"/>
                    <div>
                        <h3 className="font-bold">Error Loading Health Goals</h3>
                        <div className="text-xs">{error}</div>
                    </div>
                </div>
            )}

            {/* Content: Goals List or Empty State */}
            {!isLoading && !error && (
                goals.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {goals.map(goal => (
                                <HealthGoalListItem
                                    key={goal._id}
                                    goal={goal}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDeleteGoal}
                                />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <section className="mt-8 pt-4 border-t border-black/10">
                                <div className="flex justify-center items-center space-x-2">
                                    <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
                                        <ChevronLeftIcon className="w-4 h-4"/>Previous
                                    </button>
                                    {/* Simplified Pagination - for more complex scenarios, a dedicated component is better */}
                                    <div className="join">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            // Logic to show first, last, current, and adjacent pages
                                            if (
                                                pageNum === 1 ||
                                                pageNum === totalPages ||
                                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost'}`}
                                                        onClick={() => handlePageChange(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if (
                                                (pageNum === currentPage - 2 && currentPage > 2) ||
                                                (pageNum === currentPage + 2 && currentPage < totalPages - 1)
                                            ) {
                                                // Show ellipsis for gaps
                                                return <button key={pageNum} className="join-item btn btn-sm btn-disabled btn-ghost">...</button>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next page">
                                        Next<ChevronRightIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                                <p className="text-center text-xs text-base-content/60 mt-3">
                                    Page {currentPage} of {totalPages} (Total: {totalGoals} goals)
                                </p>
                            </section>
                        )}
                    </>
                ) : (
                    // Empty State for No Goals
                    <div className="text-center py-16 bg-base-200 rounded-lg shadow">
                        <FlagIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" />
                        <p className="text-base-content/70 mb-4">You haven't set any health goals yet.</p>
                        <button onClick={handleOpenAddModal} className="btn btn-sm btn-secondary">
                            Set Your First Goal
                        </button>
                    </div>
                )
            )}

            {/* Modal for Adding/Editing Goal */}
            <AnimatePresence>
            {isFormModalOpen && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="modal modal-open modal-bottom sm:modal-middle" // DaisyUI modal classes
                  >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="modal-box relative bg-base-100 w-11/12 max-w-lg" // DaisyUI modal-box
                    >
                        {/* The HealthGoalForm itself handles the close button via onCancel */}
                        <HealthGoalForm
                            onSubmitGoal={handleGoalSubmit}
                            onCancel={handleCloseFormModal}
                            existingGoal={editingGoal}
                            isSubmitting={isSubmittingGoal}
                        />
                    </motion.div>
                    {/* Click outside to close - DaisyUI pattern */}
                    <form method="dialog" className="modal-backdrop"><button onClick={handleCloseFormModal}>close</button></form>
                 </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}

export default HealthGoalsPage;
