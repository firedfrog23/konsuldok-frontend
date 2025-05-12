// src/components/appointments/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import appointmentService from '../../services/appointment.service.js';
import { CalendarDaysIcon, ClockIcon, UserGroupIcon, ChatBubbleLeftEllipsisIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatISO, parseISO, setHours, setMinutes, format } from 'date-fns';

/**
 * Form for booking/requesting a new appointment.
 * Adheres to strict 3-color palette: #FFFFFF (White), #000000 (Black), #007FFF (Blue).
 * Relies on DaisyUI theme classes customized in index.css.
 *
 * @param {object} props - Component props.
 * @param {Function} props.onSuccess - Callback when appointment is successfully created.
 */
function AppointmentForm({ onSuccess }) {
    const { user } = useAuth();
    const { addNotification } = useNotification();

    const [doctors, setDoctors] = useState([]);
    const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
    const [doctorFetchError, setDoctorFetchError] = useState(null);

    const [availableTimes, setAvailableTimes] = useState([]);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [availabilityFetchError, setAvailabilityFetchError] = useState(null);

    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            doctorId: '',
            appointmentDate: selectedDate,
            appointmentTime: '',
            reasonForVisit: '',
            durationMinutes: 30,
        }
    });

    const watchedDoctorId = watch('doctorId');
    const watchedAppointmentDate = watch('appointmentDate');

    // Effect to fetch doctors on component mount
    useEffect(() => {
        const fetchDoctorsList = async () => {
            setIsLoadingDoctors(true);
            setDoctorFetchError(null);
            try {
                const fetchedDoctors = await appointmentService.getDoctors();
                setDoctors(fetchedDoctors || []);
                if (fetchedDoctors.length === 0) {
                    setDoctorFetchError('No doctors are currently available.');
                }
            } catch (error) {
                const errorMsg = error.message || 'Failed to load doctors list.';
                addNotification(errorMsg, 'error'); // Error uses Black BG, White text
                setDoctorFetchError(errorMsg);
                setDoctors([]);
            } finally {
                setIsLoadingDoctors(false);
            }
        };
        fetchDoctorsList();
    }, [addNotification]);

    // Effect to fetch doctor availability when doctor or date changes
    useEffect(() => {
        if (watchedDoctorId && watchedAppointmentDate) {
            const fetchAvailability = async () => {
                setIsLoadingAvailability(true);
                setAvailableTimes([]);
                setAvailabilityFetchError(null);
                try {
                    const times = await appointmentService.getDoctorAvailability(watchedDoctorId, watchedAppointmentDate, 30);
                    setAvailableTimes(times || []);
                    setValue('appointmentTime', '');
                    if (times.length === 0) {
                        setAvailabilityFetchError('No slots available for this doctor on the selected date.');
                    }
                } catch (error) {
                    const errorMsg = error.message || 'Failed to load doctor availability.';
                    addNotification(errorMsg, 'error'); // Error uses Black BG, White text
                    setAvailabilityFetchError(errorMsg);
                    setAvailableTimes([]);
                } finally {
                    setIsLoadingAvailability(false);
                }
            };
            fetchAvailability();
        } else {
            setAvailableTimes([]);
            setAvailabilityFetchError(null);
        }
    }, [watchedDoctorId, watchedAppointmentDate, addNotification, setValue]);

    // Handles form submission
    const onSubmit = async (data) => {
        if (!user?.patientProfile) {
            addNotification('Patient profile not found. Cannot book appointment.', 'error');
            return;
        }
        if (!data.appointmentDate || !data.appointmentTime) {
            addNotification('Please select both a date and a time for the appointment.', 'error');
            return;
        }

        try {
            const [hours, minutes] = data.appointmentTime.split(':').map(Number);
            let appointmentDateTime = parseISO(data.appointmentDate);
            appointmentDateTime = setHours(appointmentDateTime, hours);
            appointmentDateTime = setMinutes(appointmentDateTime, minutes);

            const appointmentPayload = {
                doctor: data.doctorId,
                appointmentTime: formatISO(appointmentDateTime),
                reasonForVisit: data.reasonForVisit,
                durationMinutes: parseInt(data.durationMinutes, 10) || 30,
            };

            const newAppointment = await appointmentService.createAppointment(appointmentPayload);
            addNotification(`Appointment with ${newAppointment.doctor?.userAccount?.fullName || 'doctor'} requested successfully!`, 'success'); // Success uses Blue BG, White text
            reset({
                doctorId: '',
                appointmentDate: format(new Date(), 'yyyy-MM-dd'),
                appointmentTime: '',
                reasonForVisit: '',
                durationMinutes: 30,
            });
            setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
            setAvailableTimes([]);
            if (onSuccess) onSuccess(newAppointment);
        } catch (error) {
            console.error('Appointment creation failed:', error);
            addNotification(error.message || 'Could not request appointment.', 'error');
        }
    };

    // Common Tailwind classes for inputs and selects
    // bg-base-100 is White, border-black/15 is Black with opacity.
    // focus:border-primary and focus:ring-primary use Blue.
    const inputBaseClasses = "input input-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    const selectBaseClasses = "select select-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    // Error border class: Uses primary color (Blue) for error indication on inputs/selects.
    // DaisyUI's default .input-error/.select-error would map to black bg/white text which can be too heavy for form fields.
    // A blue border provides a clear visual cue using an allowed color.
    const errorBorderClass = "border-primary ring-1 ring-primary";

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 p-1">
            {/* Form Title: Uses primary color (Blue) */}
            <h2 className="text-xl font-semibold text-primary mb-6 border-b border-primary/20 pb-3">
                Request New Appointment
            </h2>

            {/* Doctor Selection */}
            <div className="form-control">
                <label className="label pb-1" htmlFor="doctorId">
                    {/* Label text is base-content (Black) */}
                    <span className="label-text font-medium text-base-content">Select Doctor</span>
                </label>
                <div className="relative">
                    {/* Icon color is neutral (Black) with opacity */}
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <UserGroupIcon className="w-5 h-5 text-neutral opacity-40" />
                    </span>
                    <select
                        id="doctorId"
                        className={`pl-10 ${selectBaseClasses} ${errors.doctorId || doctorFetchError ? errorBorderClass : 'border-black/15'}`}
                        disabled={isLoadingDoctors || (doctors.length === 0 && !doctorFetchError)}
                        {...register('doctorId', { required: 'Please select a doctor.' })}
                    >
                        <option value="" disabled>
                            {isLoadingDoctors ? 'Loading doctors...' :
                             doctorFetchError ? 'Error loading doctors' :
                             doctors.length === 0 ? 'No doctors available' :
                             '-- Choose a Doctor --'}
                        </option>
                        {!isLoadingDoctors && !doctorFetchError && doctors.map(doc => (
                            <option key={doc._id} value={doc._id}>
                                {doc.userAccount?.fullName} ({doc.specialty})
                            </option>
                        ))}
                    </select>
                </div>
                {/* Error messages use primary color (Blue) for visibility */}
                {errors.doctorId && <p role="alert" className="text-primary text-xs mt-1">{errors.doctorId.message}</p>}
                {!isLoadingDoctors && doctorFetchError && <p role="alert" className="text-primary text-xs mt-1">{doctorFetchError}</p>}
            </div>

            {/* Date Selection */}
            <div className="form-control">
                <label className="label pb-1" htmlFor="appointmentDate">
                    <span className="label-text font-medium text-base-content">Select Date</span>
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <CalendarDaysIcon className="w-5 h-5 text-neutral opacity-40" />
                    </span>
                    <input
                        id="appointmentDate"
                        type="date"
                        className={`pl-10 ${inputBaseClasses} ${errors.appointmentDate ? errorBorderClass : 'border-black/15'}`}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        defaultValue={selectedDate}
                        {...register('appointmentDate', { required: 'Please select a date.' })}
                        onChange={(e) => {
                            setValue('appointmentDate', e.target.value, { shouldValidate: true });
                            setSelectedDate(e.target.value);
                        }}
                    />
                </div>
                {errors.appointmentDate && <p role="alert" className="text-primary text-xs mt-1">{errors.appointmentDate.message}</p>}
            </div>

            {/* Time Selection (Conditional) */}
            {watchedDoctorId && watchedAppointmentDate && (
                <div className="form-control">
                    <label className="label pb-1" htmlFor="appointmentTime">
                        <span className="label-text font-medium text-base-content">Select Time</span>
                    </label>
                    {isLoadingAvailability ? (
                        // Loading spinner uses primary color (Blue)
                        <div className="flex items-center p-3 bg-base-200 rounded-md h-[2.9rem]">
                            <span className="loading loading-spinner loading-xs text-primary mr-2"></span>
                            <span className="text-sm text-base-content/70">Loading availability...</span>
                        </div>
                    ) : availableTimes.length > 0 ? (
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <ClockIcon className="w-5 h-5 text-neutral opacity-40" />
                            </span>
                            <select id="appointmentTime"
                                className={`pl-10 ${selectBaseClasses} ${errors.appointmentTime ? errorBorderClass : 'border-black/15'}`}
                                {...register('appointmentTime', { required: 'Please select a time.' })}>
                                <option value="" disabled>-- Available Slots --</option>
                                {availableTimes.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        // Availability error/empty state message. Icon uses primary color (Blue).
                        <div className="flex items-center p-3 bg-base-200 rounded-md text-sm text-base-content/70 min-h-[2.9rem]">
                            <ExclamationTriangleIcon className="w-5 h-5 text-primary mr-2 flex-shrink-0"/>
                            {availabilityFetchError || 'No slots available for this doctor on the selected date.'}
                        </div>
                    )}
                    {errors.appointmentTime && <p role="alert" className="text-primary text-xs mt-1">{errors.appointmentTime.message}</p>}
                </div>
            )}

            {/* Reason for Visit */}
            <div className="form-control">
                <label className="label pb-1" htmlFor="reasonForVisit">
                    <span className="label-text font-medium text-base-content">Reason for Visit (Optional)</span>
                </label>
                <div className="relative">
                    <span className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-neutral opacity-40" />
                    </span>
                    <textarea
                        id="reasonForVisit"
                        placeholder="Briefly describe your reason..."
                        // Textarea uses same base and error classes as inputs
                        className={`textarea textarea-bordered pl-10 border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.reasonForVisit ? errorBorderClass : 'border-black/15'}`}
                        rows="3"
                        {...register('reasonForVisit', { maxLength: { value: 500, message: "Reason cannot exceed 500 characters."}})}
                    ></textarea>
                </div>
                {errors.reasonForVisit && <p role="alert" className="text-primary text-xs mt-1">{errors.reasonForVisit.message}</p>}
            </div>

            {/* Submit Button: Uses primary color (Blue) */}
            <div className="form-control pt-4">
                <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting || isLoadingDoctors || isLoadingAvailability}>
                    {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Request Appointment'}
                </button>
            </div>
        </form>
    );
}

export default AppointmentForm;
