// src/components/doctor/UpdateAppointmentStatusModal.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline'; // CheckCircleIcon, NoSymbolIcon removed as not directly used for styling
import { AppointmentStatus as ApptStatusConst } from '../../utils/constants.js';

/**
 * Modal for Doctors to update an appointment's status.
 * Adheres to strict 3-color palette.
 * - Modal BG (bg-base-100) is White. Title (text-primary) is Blue. Text (text-base-content) is Black.
 * - Select/Textarea: White BG, Black text/border. Focus is Blue. Error state uses Blue border.
 * - Buttons: "Nevermind" (btn-ghost) is Black text. "Update Status" (btn-primary) is Blue BG, White text.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Function to call when closing the modal.
 * @param {Function} props.onUpdateStatus - Function to call with { status, notes } when status is updated.
 * @param {object} props.appointment - The current appointment object.
 * @param {boolean} props.isUpdating - Loading state for the update.
 */
function UpdateAppointmentStatusModal({ isOpen, onClose, onUpdateStatus, appointment, isUpdating }) {
    const doctorSelectableStatuses = [
        ApptStatusConst.CONFIRMED,
        ApptStatusConst.COMPLETED,
        ApptStatusConst.CANCELLED,
        ApptStatusConst.NO_SHOW,
    ];

    const selectableStatuses = doctorSelectableStatuses.filter(status => {
        if (appointment?.status === ApptStatusConst.COMPLETED || appointment?.status === ApptStatusConst.CANCELLED) {
            return false;
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
            newStatus: '',
            completionNotes: appointment?.completionNotes || '',
            cancellationReason: appointment?.cancellationReason || ''
        }
    });

    React.useEffect(() => {
        if (isOpen && appointment) {
            reset({
                newStatus: '',
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
        onUpdateStatus(updatePayload);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen || !appointment) return null;

    // Error border class for select/textarea: Uses primary color (Blue) for error indication.
    const errorBorderClass = "border-primary ring-1 ring-primary";
    // Base classes for select/textarea
    const formElementBaseClasses = "border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";


    return (
        <dialog className="modal modal-open modal-bottom sm:modal-middle" open>
            {/* Modal box: bg-base-100 is White */}
            <div className="modal-box relative bg-base-100 text-base-content">
                {/* Close button: btn-ghost uses Black text */}
                <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content/70 hover:bg-base-300" aria-label="Close modal">
                    <XMarkIcon className="w-5 h-5"/>
                </button>

                {/* Title: text-primary is Blue */}
                <h3 className="font-bold text-lg text-primary mb-1">Update Appointment Status</h3>
                {/* Text: text-base-content is Black */}
                <p className="text-sm text-base-content/80 mb-1">
                    Patient: <span className="font-medium">{appointment.patient?.userAccount?.fullName || 'N/A'}</span>
                </p>
                <p className="text-sm text-base-content/80 mb-4">
                    Date: <span className="font-medium">{appointment.appointmentTime ? new Date(appointment.appointmentTime).toLocaleString('en-ID', { dateStyle: 'medium', timeStyle: 'short'}) : 'N/A'}</span>
                </p>
                {/* Badge: badge-neutral maps to Black BG, White text */}
                <p className="text-sm text-base-content/70 mb-1">Current Status: <span className="badge badge-sm badge-outline badge-neutral">{appointment.status}</span></p>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
                    <div className="form-control">
                        <label htmlFor="newStatus" className="label py-1">
                            <span className="label-text font-medium text-base-content">Select New Status</span>
                        </label>
                        <select
                            id="newStatus"
                            className={`select select-bordered ${formElementBaseClasses} ${errors.newStatus ? errorBorderClass : 'border-black/15'}`}
                            aria-invalid={errors.newStatus ? "true" : "false"}
                            {...register('newStatus', { required: 'Please select a new status.' })}
                        >
                            <option value="" disabled>-- Choose Status --</option>
                            {selectableStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        {/* Error message: text-primary (Blue) */}
                        {errors.newStatus && <p role="alert" className="text-primary text-xs mt-1">{errors.newStatus.message}</p>}
                    </div>

                    {newStatusWatched === ApptStatusConst.COMPLETED && (
                        <div className="form-control">
                            <label htmlFor="completionNotes" className="label py-1">
                                <span className="label-text font-medium text-base-content">Completion Notes (Optional)</span>
                            </label>
                            <textarea
                                id="completionNotes"
                                className={`textarea textarea-bordered h-24 ${formElementBaseClasses} ${errors.completionNotes ? errorBorderClass : 'border-black/15'}`}
                                placeholder="e.g., Patient responded well to treatment, follow-up in 2 weeks."
                                {...register('completionNotes', { maxLength: { value: 1000, message: 'Notes cannot exceed 1000 characters.'}})}
                            ></textarea>
                            {errors.completionNotes && <p role="alert" className="text-primary text-xs mt-1">{errors.completionNotes.message}</p>}
                        </div>
                    )}

                    {(newStatusWatched === ApptStatusConst.CANCELLED || newStatusWatched === ApptStatusConst.NO_SHOW) && (
                        <div className="form-control">
                            <label htmlFor="cancellationReason" className="label py-1">
                                <span className="label-text font-medium text-base-content">
                                    {newStatusWatched === ApptStatusConst.CANCELLED ? 'Cancellation Reason' : 'Notes for No Show'}
                                    {/* Required asterisk: text-primary (Blue) */}
                                    {newStatusWatched === ApptStatusConst.CANCELLED && <span className="text-primary ml-1">*</span>}
                                </span>
                            </label>
                            <textarea
                                id="cancellationReason"
                                className={`textarea textarea-bordered h-24 ${formElementBaseClasses} ${errors.cancellationReason ? errorBorderClass : 'border-black/15'}`}
                                placeholder={newStatusWatched === ApptStatusConst.CANCELLED ? "Reason for cancellation..." : "e.g., Patient did not arrive..."}
                                {...register('cancellationReason', {
                                    required: newStatusWatched === ApptStatusConst.CANCELLED ? 'Reason is required when cancelling.' : false,
                                    maxLength: { value: 200, message: 'Reason/notes cannot exceed 200 characters.'}
                                })}
                            ></textarea>
                            {errors.cancellationReason && <p role="alert" className="text-primary text-xs mt-1">{errors.cancellationReason.message}</p>}
                        </div>
                    )}

                    <div className="modal-action mt-6">
                        {/* Nevermind button: btn-ghost is Black text */}
                        <button type="button" onClick={handleClose} className="btn btn-ghost" disabled={isUpdating}>
                            Nevermind
                        </button>
                        {/* Update Status button: btn-primary is Blue BG, White text */}
                        <button type="submit" className="btn btn-primary" disabled={isUpdating || !newStatusWatched}>
                            {isUpdating ? <span className="loading loading-spinner loading-sm"></span> : 'Update Status'}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    );
}

export default UpdateAppointmentStatusModal;
