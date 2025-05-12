// src/components/goals/HealthGoalListItem.jsx
import React from 'react';
import { format } from 'date-fns';
import { FlagIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * Displays a single health goal item.
 * @param {object} props
 * @param {object} props.goal - The health goal object.
 * @param {Function} props.onEdit - Callback when edit button is clicked.
 * @param {Function} props.onDelete - Callback when delete button is clicked.
 */
function HealthGoalListItem({ goal, onEdit, onDelete }) {
    const getStatusColorClasses = (status) => {
        if (status === 'Achieved Today' || status === 'Completed') return { progress: 'progress-success', badge: 'badge-success text-success-content' }; // Blue
        if (status === 'In Progress') return { progress: 'progress-info', badge: 'badge-info text-info-content' }; // Blue
        if (status === 'Needs Attention' || status === 'Paused') return { progress: 'progress-warning', badge: 'badge-warning text-warning-content' }; // Orange
        return { progress: 'progress-neutral', badge: 'badge-neutral text-neutral-content' }; // Black
    };

    const statusColors = getStatusColorClasses(goal.status);

    return (
        <div className="p-4 rounded-lg bg-base-100 border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-start space-x-3">
                    <FlagIcon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${statusColors.badge.includes('success') || statusColors.badge.includes('info') ? 'text-primary' : 'text-secondary'}`} />
                    <div>
                        <h3 className="font-semibold text-primary text-md">{goal.name}</h3>
                        <p className="text-xs text-base-content/70">{goal.description}</p>
                    </div>
                </div>
                <span className={`badge badge-sm ${statusColors.badge}`}>{goal.status}</span>
            </div>
            <div className="mb-2">
                <progress
                    className={`progress ${statusColors.progress} w-full h-2.5 rounded-full`} // Slightly thicker progress bar
                    value={goal.progress}
                    max="100"
                ></progress>
                <div className="flex justify-between text-xs text-base-content/60 mt-1">
                    <span>{goal.progress}% Complete</span>
                    {goal.target && <span>Target: {goal.target}</span>}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-base-content/60">
                <span>Category: <span className="font-medium">{goal.category || 'General'}</span></span>
                <span className="mt-1 sm:mt-0">Last Updated: {goal.lastUpdated ? format(new Date(goal.lastUpdated), 'PPP') : 'N/A'}</span>
            </div>
            {goal.notes && (
                <p className="text-xs italic text-base-content/70 mt-2 border-t border-black/5 pt-2">
                    <strong>Notes:</strong> {goal.notes}
                </p>
            )}
            <div className="card-actions justify-end mt-4">
                <button onClick={() => onEdit(goal)} className="btn btn-xs btn-ghost text-secondary hover:bg-secondary/10">
                    <PencilSquareIcon className="w-4 h-4 mr-1"/> Edit
                </button>
                <button onClick={() => onDelete(goal._id)} className="btn btn-xs btn-ghost text-error hover:bg-error/10"> {/* Error is Orange */}
                    <TrashIcon className="w-4 h-4 mr-1"/> Delete
                </button>
            </div>
        </div>
    );
}

export default HealthGoalListItem;
