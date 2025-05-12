// src/components/doctor/UpdateAppointmentStatusModal.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon, CheckCircleIcon, NoSymbolIcon } from '@heroicons/react/24/outline';
import { AppointmentStatus as ApptStatusConst } from '../../utils/constants.js'; // Your constants file

/**
 * Modal for Doctors to update an appointment's status.
 * @param {object} props
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Function to call when closing the modal.
 * @param {Function} props.onUpdateStatus - Function to call with { status, notes } when status is updated.
 * @param {object} props.appointment - The current appointment object.
 * @param {boolean} props.isUpdating - Loading state for the update.
 */
function UpdateAppointmentStatusModal({ isOpen, onClose, onUpdateStatus, appointment, isUpdating }) {
    // Define which statuses a doctor can transition an appointment to.
    const doctorSelectableStatuses = [
        ApptStatusConst.CONFIRMED,
        ApptStatusConst.COMPLETED,
        ApptStatusConst.CANCELLED, // Doctor might cancel
        ApptStatusConst.NO_SHOW,
    ];

    // Filter out current status and potentially illogical transitions from final states
    const selectableStatuses = doctorSelectableStatuses.filter(status => {
        if (appointment?.status === ApptStatusConst.COMPLETED || appointment?.status === ApptStatusConst.CANCELLED) {
            return false; // Cannot change from these final states via this modal
        }
        return status !== appointment?.status;
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            newStatus: '', // Start with no status selected
            completionNotes: appointment?.completionNotes || '',
            cancellationReason: appointment?.cancellationReason || ''
        }
    });

    // Reset form when appointment changes or modal opens/closes
    React.useEffect(() => {
        if (isOpen && appointment) {
            reset({
                newStatus: '', // Important to reset to force selection
                completionNotes: appointment.completionNotes || '',
                cancellationReason: appointment.cancellationReason || ''
            });
        }
    }, [isOpen, appointment, reset]);

    const newStatusWatched = watch('newStatus');

    const handleFormSubmit = (data) => {
        const updatePayload = { status: data.newStatus };
        if (data.newStatus === ApptStatusConst.COMPLETED && data.completionNotes) {
            updatePayload.completionNotes = data.completionNotes.trim();
        }
        if (data.newStatus === ApptStatusConst.CANCELLED && data.cancellationReason) {
            updatePayload.cancellationReason = data.cancellationReason.trim();
        }
        // For No Show, you might not need extra notes, or you could add a field
        onUpdateStatus(updatePayload);
    };

    const handleClose = () => {
        reset(); // Reset form fields on close
        onClose();
    };

    if (!isOpen || !appointment) return null;

    return (
        <dialog className="modal modal-open modal-bottom sm:modal-middle" open>
            <div className="modal-box relative bg-base-100 text-base-content">
                <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Close modal">
                    <XMarkIcon className="w-5 h-5"/>
                </button>

                <h3 className="font-bold text-lg text-primary mb-1">Update Appointment Status</h3>
                <p className="text-sm text-base-content/80 mb-1">
                    Patient: <span className="font-medium">{appointment.patient?.userAccount?.fullName || 'N/A'}</span>
                </p>
                <p className="text-sm text-base-content/80 mb-4">
                    Date: <span className="font-medium">{appointment.appointmentTime ? new Date(appointment.appointmentTime).toLocaleString('en-ID', { dateStyle: 'medium', timeStyle: 'short'}) : 'N/A'}</span>
                </p>
                <p className="text-sm text-base-content/70 mb-1">Current Status: <span className="badge badge-sm badge-outline badge-neutral">{appointment.status}</span></p>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="form-control">
                        <label htmlFor="newStatus" className="label py-1">
                            <span className="label-text font-medium">Select New Status</span>
                        </label>
                        <select
                            id="newStatus"
                            className={`select select-bordered w-full border-black/20 focus:border-primary focus:ring-1 focus:ring-primary ${errors.newStatus ? 'select-error' : ''}`}
                            aria-invalid={errors.newStatus ? "true" : "false"}
                            {...register('newStatus', { required: 'Please select a new status.' })}
                        >
                            <option value="" disabled>-- Choose Status --</option>
                            {selectableStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        {errors.newStatus && <p role="alert" className="text-error text-xs mt-1">{errors.newStatus.message}</p>}
                    </div>

                    {newStatusWatched === ApptStatusConst.COMPLETED && (
                        <div className="form-control">
                            <label htmlFor="completionNotes" className="label py-1">
                                <span className="label-text font-medium">Completion Notes (Optional)</span>
                            </label>
                            <textarea
                                id="completionNotes"
                                className="textarea textarea-bordered border-black/20 h-24 focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="e.g., Patient responded well to treatment, follow-up in 2 weeks."
                                {...register('completionNotes', { maxLength: { value: 1000, message: 'Notes cannot exceed 1000 characters.'}})}
                            ></textarea>
                            {errors.completionNotes && <p role="alert" className="text-error text-xs mt-1">{errors.completionNotes.message}</p>}
                        </div>
                    )}

                    {(newStatusWatched === ApptStatusConst.CANCELLED || newStatusWatched === ApptStatusConst.NO_SHOW) && (
                        <div className="form-control">
                            <label htmlFor="cancellationReason" className="label py-1">
                                <span className="label-text font-medium">
                                    {newStatusWatched === ApptStatusConst.CANCELLED ? 'Cancellation Reason' : 'Notes for No Show'}
                                    {newStatusWatched === ApptStatusConst.CANCELLED && <span className="text-error ml-1">*</span>}
                                </span>
                            </label>
                            <textarea
                                id="cancellationReason" // Re-using for no-show notes for simplicity
                                className={`textarea textarea-bordered border-black/20 h-24 focus:border-primary focus:ring-1 focus:ring-primary ${errors.cancellationReason ? 'textarea-error' : ''}`}
                                placeholder={newStatusWatched === ApptStatusConst.CANCELLED ? "Reason for cancellation..." : "e.g., Patient did not arrive..."}
                                {...register('cancellationReason', {
                                    required: newStatusWatched === ApptStatusConst.CANCELLED ? 'Reason is required when cancelling.' : false,
                                    maxLength: { value: 200, message: 'Reason/notes cannot exceed 200 characters.'}
                                })}
                            ></textarea>
                            {errors.cancellationReason && <p role="alert" className="text-error text-xs mt-1">{errors.cancellationReason.message}</p>}
                        </div>
                    )}

                    <div className="modal-action mt-6">
                        <button type="button" onClick={handleClose} className="btn btn-ghost" disabled={isUpdating}>
                            Nevermind
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isUpdating || !newStatusWatched}>
                            {isUpdating ? <span className="loading loading-spinner loading-sm"></span> : 'Update Status'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Click outside to close (DaisyUI 5.x method) */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    );
}

export default UpdateAppointmentStatusModal;
