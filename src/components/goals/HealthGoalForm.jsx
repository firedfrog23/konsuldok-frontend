// src/components/goals/HealthGoalForm.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Form for adding or editing a health goal. Adheres to strict 3-color palette.
 * - Title (text-primary) is Blue.
 * - Input/Select/Textarea: White BG, Black text/border. Focus/Error states use Blue border/ring.
 * - Buttons: "Cancel" (btn-ghost) is Black text. Submit button (btn-primary) is Blue BG, White text.
 *
 * @param {object} props - Component props.
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
        formState: { errors, isDirty }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            category: 'Fitness',
            target: '',
            progress: 0,
            status: 'In Progress',
            notes: ''
        }
    });

    useEffect(() => {
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
            reset({ name: '', description: '', category: 'Fitness', target: '', progress: 0, status: 'In Progress', notes: '' });
        }
    }, [existingGoal, reset]);

    const handleFormSubmit = (data) => {
        const payload = { ...data, progress: parseInt(data.progress, 10) || 0 };
        onSubmitGoal(payload);
    };

    // Error border class for inputs/selects: Uses primary color (Blue) for error indication.
    const errorBorderClass = "border-primary ring-1 ring-primary";
    // Base classes for form elements
    const formElementBaseClasses = "border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

    const inputClasses = (hasError, customPadding = 'pl-3') =>
        `input input-bordered ${customPadding} ${formElementBaseClasses} ${hasError ? errorBorderClass : 'border-black/15'}`;
    const selectClasses = (hasError) =>
        `select select-bordered ${formElementBaseClasses} ${hasError ? errorBorderClass : 'border-black/15'}`;
    const textareaClasses = (hasError) =>
        `textarea textarea-bordered h-24 ${formElementBaseClasses} ${hasError ? errorBorderClass : 'border-black/15'}`;

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-1">
            <div className="flex justify-between items-center mb-4">
                {/* Title: text-primary is Blue */}
                <h3 className="font-bold text-lg text-primary">
                    {existingGoal ? 'Edit Health Goal' : 'Add New Health Goal'}
                </h3>
                {/* Close button: btn-ghost is Black text */}
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:bg-base-300" aria-label="Close form">
                        <XMarkIcon className="w-5 h-5"/>
                    </button>
                )}
            </div>

            <div className="form-control">
                <label htmlFor="goalName" className="label py-1"><span className="label-text font-medium text-base-content">Goal Name</span></label>
                <input id="goalName" type="text" placeholder="e.g., Morning Run, Drink More Water"
                    className={inputClasses(errors.name)}
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register('name', { required: 'Goal name is required.' })} />
                {/* Error message: text-primary (Blue) */}
                {errors.name && <p role="alert" className="text-primary text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div className="form-control">
                <label htmlFor="goalDescription" className="label py-1"><span className="label-text font-medium text-base-content">Description (Optional)</span></label>
                <textarea id="goalDescription" placeholder="e.g., Run 3km every morning before work. Aim for 8 glasses daily."
                    className={textareaClasses(errors.description)}
                    {...register('description', { maxLength: { value: 500, message: "Description cannot exceed 500 characters."}})} />
                {errors.description && <p role="alert" className="text-primary text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                    <label htmlFor="goalCategory" className="label py-1"><span className="label-text font-medium text-base-content">Category</span></label>
                    <select id="goalCategory" className={selectClasses(errors.category)}
                        aria-invalid={errors.category ? "true" : "false"}
                        {...register('category', { required: 'Category is required.' })}>
                        <option value="Fitness">Fitness</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Medical Adherence">Medical Adherence</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.category && <p role="alert" className="text-primary text-xs mt-1">{errors.category.message}</p>}
                </div>
                <div className="form-control">
                    <label htmlFor="goalTarget" className="label py-1"><span className="label-text font-medium text-base-content">Target (Optional)</span></label>
                    <input id="goalTarget" type="text" placeholder="e.g., 3km, 8 glasses, 70kg"
                        className={inputClasses(errors.target, 'pl-3')}
                        {...register('target')} />
                     {/* No error message for optional target, but could be added if specific validation is present */}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                    <label htmlFor="goalProgress" className="label py-1"><span className="label-text font-medium text-base-content">Current Progress (%)</span></label>
                    <input id="goalProgress" type="number" min="0" max="100"
                        className={inputClasses(errors.progress, 'pl-3')}
                        aria-invalid={errors.progress ? "true" : "false"}
                        {...register('progress', {
                            valueAsNumber: true,
                            min: { value: 0, message: "Progress can't be less than 0"},
                            max: { value: 100, message: "Progress can't be more than 100"}
                        })} />
                    {errors.progress && <p role="alert" className="text-primary text-xs mt-1">{errors.progress.message}</p>}
                </div>
                <div className="form-control">
                    <label htmlFor="goalStatus" className="label py-1"><span className="label-text font-medium text-base-content">Status</span></label>
                    <select id="goalStatus" className={selectClasses(errors.status)}
                        aria-invalid={errors.status ? "true" : "false"}
                        {...register('status', { required: 'Status is required.' })}>
                        <option value="In Progress">In Progress</option>
                        <option value="Achieved Today">Achieved Today</option>
                        <option value="Needs Attention">Needs Attention</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed (Archived)</option>
                    </select>
                    {errors.status && <p role="alert" className="text-primary text-xs mt-1">{errors.status.message}</p>}
                </div>
            </div>
            <div className="form-control">
                <label htmlFor="goalNotes" className="label py-1"><span className="label-text font-medium text-base-content">Notes (Optional)</span></label>
                <textarea id="goalNotes" placeholder="Any additional notes or reflections..."
                    className={textareaClasses(errors.notes)}
                    {...register('notes', { maxLength: { value: 300, message: "Notes cannot exceed 300 characters."}})} />
                {errors.notes && <p role="alert" className="text-primary text-xs mt-1">{errors.notes.message}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                {/* Cancel button: btn-ghost is Black text */}
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn btn-ghost" disabled={isSubmitting}>
                        Cancel
                    </button>
                )}
                {/* Submit button: btn-primary is Blue BG, White text */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !isDirty}
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
