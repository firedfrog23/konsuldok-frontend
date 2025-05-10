// src/components/appointments/CancelAppointmentModal.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Modal for confirming appointment cancellation and providing a reason.
 * @param {object} props
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
        // Optionally reset form here or when modal closes successfully
    };

    // Close modal and reset form
    const handleClose = () => {
        reset(); // Reset form fields
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open modal-bottom sm:modal-middle"> {/* DaisyUI modal classes */}
            <div className="modal-box relative bg-base-100">
                <button
                    onClick={handleClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content/70 hover:bg-base-300"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-5 h-5"/>
                </button>

                <h3 className="font-bold text-lg text-secondary mb-4">Confirm Cancellation</h3>
                <p className="py-2 text-sm text-base-content/80">
                    Are you sure you want to cancel this appointment? This action cannot be undone.
                </p>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="form-control">
                        <label htmlFor="cancellationReason" className="label">
                            <span className="label-text font-medium">Reason for Cancellation (Optional)</span>
                        </label>
                        <textarea
                            id="cancellationReason"
                            className={`textarea textarea-bordered border-black/20 w-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${errors.cancellationReason ? 'border-error' : ''}`}
                            rows="3"
                            placeholder="e.g., Schedule conflict"
                            {...register('cancellationReason', {
                                maxLength: { value: 200, message: 'Reason cannot exceed 200 characters.' }
                            })}
                        ></textarea>
                        {errors.cancellationReason && (
                            <p className="text-error text-xs mt-1">{errors.cancellationReason.message}</p>
                        )}
                    </div>

                    <div className="modal-action mt-6">
                        <button type="button" onClick={handleClose} className="btn btn-ghost" disabled={isCancelling}>
                            Keep Appointment
                        </button>
                        <button type="submit" className="btn btn-error" disabled={isCancelling}> {/* Error is Orange */}
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
