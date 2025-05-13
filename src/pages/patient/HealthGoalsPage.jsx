// src/pages/patient/HealthGoalsPage.jsx
import { ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon, FlagIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HealthGoalForm from '../../components/goals/HealthGoalForm.jsx';
import HealthGoalListItem from '../../components/goals/HealthGoalListItem.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import patientDataService from '../../services/patient.service.js';

/**
 * Page for patients to view, add, edit, and delete their health goals.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function HealthGoalsPage() {
    const { user } = useAuth();
    const { addNotification } = useNotification();

    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalGoals, setTotalGoals] = useState(0);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

    const PAGE_LIMIT = 5;

    const fetchHealthGoals = useCallback(async (page = 1) => {
        if (!user) return;
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
            addNotification(errorMsg, 'error'); // Themed error (Black BG)
            setGoals([]);
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification]);

    useEffect(() => {
        fetchHealthGoals(currentPage);
    }, [fetchHealthGoals, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
        }
    };

    const handleOpenAddModal = () => {
        setEditingGoal(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (goal) => {
        setEditingGoal(goal);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
        setEditingGoal(null);
    };

    const handleGoalSubmit = async (goalData) => {
        setIsSubmittingGoal(true);
        try {
            if (editingGoal && editingGoal._id) {
                await patientDataService.updateHealthGoal(editingGoal._id, goalData);
                addNotification('Health goal updated successfully!', 'success'); // Themed success (Blue BG)
            } else {
                await patientDataService.addHealthGoal(goalData);
                addNotification('New health goal added successfully!', 'success');
            }
            handleCloseFormModal();
            fetchHealthGoals(editingGoal ? currentPage : 1);
        } catch (err) {
            addNotification(err.message || 'Failed to save health goal.', 'error');
        } finally {
            setIsSubmittingGoal(false);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        if (window.confirm('Are you sure you want to delete this health goal? This action cannot be undone.')) {
            try {
                await patientDataService.deleteHealthGoal(goalId);
                addNotification('Health goal deleted.', 'info'); // Themed info (Blue BG)
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
            {/* Header: Back link (Blue), Title (Blue), Add Goal button (Blue BG) */}
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

            {isLoading && (
                <div className="text-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span> {/* Spinner Blue */}
                    <p className="mt-3 text-base-content/70">Loading your health goals...</p>
                </div>
            )}

            {error && !isLoading && (
                // Error Alert: alert-neutral maps to Black BG, White text
                <div role="alert" className="alert alert-neutral shadow-lg my-6">
                    <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6 text-neutral-content"/>
                    <div>
                        <h3 className="font-bold text-neutral-content">Error Loading Health Goals</h3>
                        <div className="text-xs text-neutral-content/80">{error}</div>
                    </div>
                </div>
            )}

            {!isLoading && !error && (
                goals.length > 0 ? (
                    <>
                        <div className="space-y-4">
                            {goals.map(goal => (
                                // HealthGoalListItem handles its own theming
                                <HealthGoalListItem
                                    key={goal._id}
                                    goal={goal}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDeleteGoal}
                                />
                            ))}
                        </div>

                        {/* Pagination: Blue outline/text for nav buttons, Blue BG for current page */}
                        {totalPages > 1 && (
                            <section className="mt-8 pt-4 border-t border-black/10">
                                <div className="flex justify-center items-center space-x-2">
                                    <button className="btn btn-sm btn-outline btn-primary disabled:opacity-50" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous page">
                                        <ChevronLeftIcon className="w-4 h-4"/>Previous
                                    </button>
                                    <div className="join">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                                return (
                                                    <button key={pageNum} className={`join-item btn btn-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-ghost text-base-content'}`} onClick={() => handlePageChange(pageNum)}>
                                                        {pageNum}
                                                    </button>
                                                );
                                            } else if ((pageNum === currentPage - 2 && currentPage > 2) || (pageNum === currentPage + 2 && currentPage < totalPages - 1)) {
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
                    // Empty State: Icon Black, Button Black BG
                    <div className="text-center py-16 bg-base-200 rounded-lg shadow">
                        <FlagIcon className="w-16 h-16 mx-auto text-base-content/30 mb-3" />
                        <p className="text-base-content/70 mb-4">You haven't set any health goals yet.</p>
                        <button onClick={handleOpenAddModal} className="btn btn-sm btn-secondary"> {/* Secondary is Black BG */}
                            Set Your First Goal
                        </button>
                    </div>
                )
            )}

            {/* Modal for Add/Edit: HealthGoalForm handles its own theming */}
            <AnimatePresence>
                {isFormModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal modal-open modal-bottom sm:modal-middle"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="modal-box relative bg-base-100 w-11/12 max-w-lg"
                        >
                            <HealthGoalForm
                                onSubmitGoal={handleGoalSubmit}
                                onCancel={handleCloseFormModal}
                                existingGoal={editingGoal}
                                isSubmitting={isSubmittingGoal}
                            />
                        </motion.div>
                        <form method="dialog" className="modal-backdrop"><button onClick={handleCloseFormModal}>close</button></form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default HealthGoalsPage;
