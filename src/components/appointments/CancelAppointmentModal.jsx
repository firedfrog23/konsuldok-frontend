// src/components/appointments/CancelAppointmentModal.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Modal for confirming appointment cancellation and providing a reason.
 * Adheres to strict 3-color palette.
 * - Modal background (modal-box, bg-base-100) is White.
 * - Title (text-secondary) is Black.
 * - Text (text-base-content) is Black.
 * - Textarea uses White BG, Black text/border. Error state uses Blue border.
 * - Buttons: "Keep Appointment" (btn-ghost) is Black text. "Yes, Cancel It" (btn-error) is Black BG, White text.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Function to call when closing the modal.
 * @param {Function} props.onConfirmCancel - Function to call when cancellation is confirmed.
 * @param {boolean} props.isCancelling - Loading state for cancellation.
 */
function CancelAppointmentModal({ isOpen, onClose, onConfirmCancel, isCancelling }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({ defaultValues: { cancellationReason: '' } });

    const handleFormSubmit = (data) => {
        onConfirmCancel(data.cancellationReason);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    // Error border class for textarea: Uses primary color (Blue) for error indication.
    const errorBorderClass = "border-primary ring-1 ring-primary";

    return (
        // DaisyUI modal classes: modal-open, modal-bottom, sm:modal-middle
        <div className="modal modal-open modal-bottom sm:modal-middle">
            {/* Modal box: bg-base-100 is White */}
            <div className="modal-box relative bg-base-100">
                {/* Close button: btn-ghost uses Black text */}
                <button
                    onClick={handleClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content/70 hover:bg-base-300"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-5 h-5"/>
                </button>

                {/* Modal Title: text-secondary maps to Black */}
                <h3 className="font-bold text-lg text-secondary mb-4">Confirm Cancellation</h3>
                {/* Modal Text: text-base-content maps to Black */}
                <p className="py-2 text-sm text-base-content/80">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                </p>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="form-control">
                        <label htmlFor="cancellationReason" className="label">
                            <span className="label-text font-medium text-base-content">Reason for Cancellation (Optional)</span>
                        </label>
                        <textarea
                            id="cancellationReason"
                            // Textarea: White BG, Black text/border. Focus is Blue. Error border is Blue.
                            className={`textarea textarea-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.cancellationReason ? errorBorderClass : 'border-black/15'}`}
                            rows="3"
                            placeholder="e.g., Schedule conflict"
                            {...register('cancellationReason', {
                                maxLength: { value: 200, message: 'Reason cannot exceed 200 characters.' }
                            })}
                        ></textarea>
                        {/* Error message: text-primary (Blue) */}
                        {errors.cancellationReason && (
                            <p role="alert" className="text-primary text-xs mt-1">{errors.cancellationReason.message}</p>
                        )}
                    </div>

                    <div className="modal-action mt-6">
                        {/* Keep Appointment button: btn-ghost uses Black text */}
                        <button type="button" onClick={handleClose} className="btn btn-ghost" disabled={isCancelling}>
                            Keep Appointment
                        </button>
                        {/* Yes, Cancel It button: btn-error maps to Black BG, White text */}
                        <button type="submit" className="btn btn-error" disabled={isCancelling}>
                            {isCancelling ? <span className="loading loading-spinner loading-sm"></span> : 'Yes, Cancel It'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Click outside to close */}
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}

export default CancelAppointmentModal;
