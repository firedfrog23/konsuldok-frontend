// src/components/goals/HealthGoalForm.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Form for adding or editing a health goal.
 * Can be used within a modal or directly on a page.
 * @param {object} props
 * @param {Function} props.onSubmitGoal - Function to call with goal data on submission.
 * @param {Function} props.onCancel - Function to call when form is cancelled/closed.
 * @param {object} [props.existingGoal] - Optional existing goal data for editing.
 * @param {boolean} props.isSubmitting - Loading state for submission.
 */
function HealthGoalForm({ onSubmitGoal, onCancel, existingGoal, isSubmitting }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty } // isDirty to enable save button only if changes are made
    } = useForm({
        defaultValues: existingGoal || {
            name: '',
            description: '',
            category: 'Fitness', // Default category
            target: '',
            progress: 0, // Default progress for new goal
            status: 'In Progress', // Default status
            notes: '' // Added notes field
        }
    });

    useEffect(() => {
        // Reset form when existingGoal prop changes (e.g., when opening modal for edit)
        // or when it becomes null (e.g., opening modal for new goal after editing)
        if (existingGoal) {
            reset({
                name: existingGoal.name || '',
                description: existingGoal.description || '',
                category: existingGoal.category || 'Fitness',
                target: existingGoal.target || '',
                progress: existingGoal.progress || 0,
                status: existingGoal.status || 'In Progress',
                notes: existingGoal.notes || ''
            });
        } else {
            reset({
                name: '',
                description: '',
                category: 'Fitness',
                target: '',
                progress: 0,
                status: 'In Progress',
                notes: ''
            });
        }
    }, [existingGoal, reset]);

    const handleFormSubmit = (data) => {
        const payload = { ...data, progress: parseInt(data.progress, 10) || 0 };
        onSubmitGoal(payload);
    };

    // Common Tailwind classes for inputs and selects
    const inputClasses = (hasError, customPadding = 'pl-3') => // Default padding for inputs without icons
        `input input-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${customPadding} ${hasError ? 'border-secondary' : ''}`;

    const selectClasses = (hasError) =>
        `select select-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${hasError ? 'border-secondary' : ''}`;

    const textareaClasses = (hasError) =>
        `textarea textarea-bordered border-black/15 bg-base-100 w-full h-24 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${hasError ? 'border-secondary' : ''}`;

    return (
        // This form is designed to be placed within a modal or a dedicated section
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-1">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-primary">
                    {existingGoal ? 'Edit Health Goal' : 'Add New Health Goal'}
                </h3>
                {/* onCancel prop is used for the close button if this form is in a modal */}
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn btn-sm btn-circle btn-ghost" aria-label="Close form">
                        <XMarkIcon className="w-5 h-5"/>
                    </button>
                )}
            </div>

            {/* Goal Name */}
            <div className="form-control">
                <label htmlFor="goalName" className="label py-1">
                    <span className="label-text font-medium">Goal Name</span>
                </label>
                <input
                    id="goalName"
                    type="text"
                    placeholder="e.g., Morning Run, Drink More Water"
                    className={inputClasses(errors.name)}
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register('name', { required: 'Goal name is required.' })}
                />
                {errors.name && <p role="alert" className="text-secondary text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="form-control">
                <label htmlFor="goalDescription" className="label py-1">
                    <span className="label-text font-medium">Description (Optional)</span>
                </label>
                <textarea
                    id="goalDescription"
                    placeholder="e.g., Run 3km every morning before work. Aim for 8 glasses daily."
                    className={textareaClasses(errors.description)}
                    {...register('description', { maxLength: { value: 500, message: "Description cannot exceed 500 characters."}})}
                />
                {errors.description && <p role="alert" className="text-secondary text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* Category and Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                    <label htmlFor="goalCategory" className="label py-1">
                        <span className="label-text font-medium">Category</span>
                    </label>
                    <select
                        id="goalCategory"
                        className={selectClasses(errors.category)}
                        aria-invalid={errors.category ? "true" : "false"}
                        {...register('category', { required: 'Category is required.' })}
                    >
                        <option value="Fitness">Fitness</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Medical Adherence">Medical Adherence</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.category && <p role="alert" className="text-secondary text-xs mt-1">{errors.category.message}</p>}
                </div>
                <div className="form-control">
                    <label htmlFor="goalTarget" className="label py-1">
                        <span className="label-text font-medium">Target (Optional)</span>
                    </label>
                    <input
                        id="goalTarget"
                        type="text"
                        placeholder="e.g., 3km, 8 glasses, 70kg"
                        className={inputClasses(errors.target, 'pl-3')} // Default input padding
                        {...register('target')}
                    />
                    {/* No specific error display for target as it's optional */}
                </div>
            </div>

            {/* Progress and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="form-control">
                    <label htmlFor="goalProgress" className="label py-1">
                        <span className="label-text font-medium">Current Progress (%)</span>
                    </label>
                    <input
                        id="goalProgress"
                        type="number"
                        min="0"
                        max="100"
                        className={inputClasses(errors.progress, 'pl-3')} // Default input padding
                        aria-invalid={errors.progress ? "true" : "false"}
                        {...register('progress', {
                            valueAsNumber: true,
                            min: { value: 0, message: "Progress can't be less than 0"},
                            max: { value: 100, message: "Progress can't be more than 100"}
                        })}
                    />
                    {errors.progress && <p role="alert" className="text-secondary text-xs mt-1">{errors.progress.message}</p>}
                </div>
                 <div className="form-control">
                    <label htmlFor="goalStatus" className="label py-1">
                        <span className="label-text font-medium">Status</span>
                    </label>
                    <select
                        id="goalStatus"
                        className={selectClasses(errors.status)}
                        aria-invalid={errors.status ? "true" : "false"}
                        {...register('status', { required: 'Status is required.' })}
                    >
                        <option value="In Progress">In Progress</option>
                        <option value="Achieved Today">Achieved Today</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed (Archived)</option>
                    </select>
                    {errors.status && <p role="alert" className="text-secondary text-xs mt-1">{errors.status.message}</p>}
                </div>
            </div>

            {/* Notes */}
             <div className="form-control">
                <label htmlFor="goalNotes" className="label py-1">
                    <span className="label-text font-medium">Notes (Optional)</span>
                </label>
                <textarea
                    id="goalNotes"
                    placeholder="Any additional notes or reflections..."
                    className={textareaClasses(errors.notes)}
                    {...register('notes', { maxLength: { value: 300, message: "Notes cannot exceed 300 characters."}})}
                />
                 {errors.notes && <p role="alert" className="text-secondary text-xs mt-1">{errors.notes.message}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                {onCancel && ( // Only show cancel if prop is provided
                    <button type="button" onClick={onCancel} className="btn btn-ghost" disabled={isSubmitting}>
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !isDirty} // Disable if submitting or form hasn't changed
                >
                    {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        existingGoal ? 'Save Changes' : 'Add Goal'
                    )}
                </button>
            </div>
        </form>
    );
}

export default HealthGoalForm;
