// src/components/goals/HealthGoalListItem.jsx
import React from 'react';
import { format } from 'date-fns';
import { FlagIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

/**
 * Displays a single health goal item. Adheres to strict 3-color palette.
 * - Card: White BG, Blue border.
 * - Goal Name (text-primary) is Blue.
 * - Status Badge: Blue BG/White text for positive, Black BG/White text for neutral/attention.
 * - Progress Bar: Blue for positive, Black for neutral/attention.
 * - Icons: FlagIcon color matches status. Edit/Delete icons are Black.
 * - Buttons: Edit (text-secondary) is Black text. Delete (text-error) is Black text (themed from error).
 *
 * @param {object} props - Component props.
 * @param {object} props.goal - The health goal object.
 * @param {Function} props.onEdit - Callback when edit button is clicked.
 * @param {Function} props.onDelete - Callback when delete button is clicked.
 */
function HealthGoalListItem({ goal, onEdit, onDelete }) {
    /**
     * Determines DaisyUI progress and badge classes based on goal status.
     * Relies on theme where:
     * - 'progress-success', 'badge-success', 'progress-info', 'badge-info' map to Blue.
     * - 'progress-warning', 'badge-warning', 'progress-neutral', 'badge-neutral' map to Black.
     * @param {string} status - The status of the goal.
     * @returns {object} Object with progress and badge classes.
     */
    const getStatusColorClasses = (status) => {
        // Positive statuses use primary color (Blue)
        if (status === 'Achieved Today' || status === 'Completed') {
            return { progress: 'progress-primary', badge: 'badge-primary text-primary-content', iconColor: 'text-primary' }; // Blue BG, White text for badge
        }
        if (status === 'In Progress') {
            return { progress: 'progress-primary', badge: 'badge-info text-info-content', iconColor: 'text-primary' }; // Blue BG, White text for badge (info also blue)
        }
        // Neutral or attention statuses use neutral color (Black)
        if (status === 'Needs Attention' || status === 'Paused') {
            return { progress: 'progress-neutral', badge: 'badge-neutral text-neutral-content', iconColor: 'text-neutral' }; // Black BG, White text for badge
        }
        return { progress: 'progress-neutral', badge: 'badge-ghost', iconColor: 'text-base-content' }; // Default to Black text for ghost badge
    };

    const statusColors = getStatusColorClasses(goal.status);

    return (
        // Card: White BG (base-100), Blue border (border-primary/20), Black text (base-content)
        <div className="p-4 rounded-lg bg-base-100 border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-start space-x-3">
                    {/* FlagIcon color matches the status */}
                    <FlagIcon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${statusColors.iconColor}`} />
                    <div>
                        {/* Goal Name: text-primary is Blue */}
                        <h3 className="font-semibold text-primary text-md">{goal.name}</h3>
                        {/* Description: text-base-content (Black) with opacity */}
                        <p className="text-xs text-base-content/70">{goal.description}</p>
                    </div>
                </div>
                {/* Status Badge: Dynamically styled */}
                <span className={`badge badge-sm ${statusColors.badge}`}>{goal.status}</span>
            </div>
            <div className="mb-2">
                {/* Progress Bar: Dynamically styled */}
                <progress
                    className={`progress ${statusColors.progress} w-full h-2.5 rounded-full`}
                    value={goal.progress}
                    max="100"
                ></progress>
                {/* Progress Text: text-base-content (Black) with opacity */}
                <div className="flex justify-between text-xs text-base-content/60 mt-1">
                    <span>{goal.progress}% Complete</span>
                    {goal.target && <span>Target: {goal.target}</span>}
                </div>
            </div>
            {/* Category & Last Updated: text-base-content (Black) with opacity */}
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
                {/* Edit button: text-secondary (Black) for link-like appearance */}
                <button onClick={() => onEdit(goal)} className="btn btn-xs btn-ghost text-secondary hover:bg-secondary/10">
                    <PencilSquareIcon className="w-4 h-4 mr-1"/> Edit
                </button>
                {/* Delete button: text-error (maps to Black text for ghost button, themed from error color) */}
                <button onClick={() => onDelete(goal._id)} className="btn btn-xs btn-ghost text-error hover:bg-error/10">
                    <TrashIcon className="w-4 h-4 mr-1"/> Delete
                </button>
            </div>
        </div>
    );
}

export default HealthGoalListItem;

