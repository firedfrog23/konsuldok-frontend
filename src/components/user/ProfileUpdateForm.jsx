// src/components/user/ProfileUpdateForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import { UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import userService from '../../services/user.service.js';

/**
 * Form for updating user's own profile. Adheres to strict 3-color palette.
 * - Title (text-secondary) is Black.
 * - Input fields: White BG, Black text/border. Focus/Error states use Blue border/ring.
 * - Disabled Email field: Lighter Black text on slightly off-white BG (standard disabled look).
 * - Submit button (btn-primary) is Blue.
 *
 * @param {object} props - Component props.
 * @param {Function} props.onUpdateSuccess - Optional callback after successful update.
 */
function ProfileUpdateForm({ onUpdateSuccess }) {
    const { user, updateUserInContext } = useAuth();
    const { addNotification } = useNotification();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset,
    } = useForm({
        mode: 'onBlur',
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phoneNumber || '',
        },
    });

    React.useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber || '',
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            const updatedUser = await userService.updateMyProfile(data);
            updateUserInContext(updatedUser);
            addNotification('Profile updated successfully!', 'success'); // Success is Blue BG
            if (onUpdateSuccess) onUpdateSuccess();
        } catch (error) {
            console.error('Profile update failed:', error);
            addNotification(`Update failed: ${error.message}`, 'error'); // Error is Black BG
        }
    };

    // Error border class for input: Uses primary color (Blue) for error indication.
    const errorBorderClass = "border-primary ring-1 ring-primary";
    // Base input classes: White BG, Black border/text, Blue focus.
    const inputClasses = (hasError) =>
        `input input-bordered pl-10 border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${hasError ? errorBorderClass : 'border-black/15'}`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 mt-6">
            {/* Title: text-secondary maps to Black */}
            <h3 className="text-xl font-semibold text-secondary border-b border-secondary/20 pb-2 mb-6">
                Edit Your Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="form-control">
                    <label className="label py-1" htmlFor="profileFirstName">
                        <span className="label-text text-sm font-medium text-base-content">First Name</span>
                    </label>
                    <div className="relative">
                        {/* Icon: text-neutral (Black) with opacity */}
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <UserIcon className="w-5 h-5 text-neutral opacity-40" />
                        </span>
                        <input
                            id="profileFirstName"
                            type="text"
                            className={inputClasses(errors.firstName)}
                            aria-invalid={errors.firstName ? "true" : "false"}
                            {...register('firstName', { required: 'First name is required' })}
                        />
                    </div>
                    {/* Error message: text-primary (Blue) */}
                    {errors.firstName && <p role="alert" className="text-primary text-xs mt-1">{errors.firstName.message}</p>}
                </div>

                {/* Last Name */}
                <div className="form-control">
                    <label className="label py-1" htmlFor="profileLastName">
                        <span className="label-text text-sm font-medium text-base-content">Last Name</span>
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <UserIcon className="w-5 h-5 text-neutral opacity-40" />
                        </span>
                        <input
                            id="profileLastName"
                            type="text"
                            className={inputClasses(errors.lastName)}
                            aria-invalid={errors.lastName ? "true" : "false"}
                            {...register('lastName', { required: 'Last name is required' })}
                        />
                    </div>
                    {errors.lastName && <p role="alert" className="text-primary text-xs mt-1">{errors.lastName.message}</p>}
                </div>
            </div>

            {/* Phone Number */}
            <div className="form-control">
                <label className="label py-1" htmlFor="profilePhoneNumber">
                    <span className="label-text text-sm font-medium text-base-content">Phone Number (Optional)</span>
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <PhoneIcon className="w-5 h-5 text-neutral opacity-40" />
                    </span>
                    <input
                        id="profilePhoneNumber"
                        type="tel"
                        className={inputClasses(errors.phoneNumber)}
                        aria-invalid={errors.phoneNumber ? "true" : "false"}
                        {...register('phoneNumber', {
                            pattern: { value: /^[0-9\s+()-]*$/, message: 'Invalid phone number format' }
                        })}
                    />
                </div>
                {errors.phoneNumber && <p role="alert" className="text-primary text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* Email (Display Only) - Disabled input uses themed styles */}
            <div className="form-control">
                <label className="label py-1"><span className="label-text text-sm font-medium text-base-content">Email Address</span></label>
                {/* Disabled input: bg-base-200 (White), text-base-content/70 (Black with opacity) */}
                <input type="email" value={user?.email || ''} readOnly disabled className="input input-bordered border-black/15 bg-base-200 w-full text-base-content/70 cursor-not-allowed" />
                <p className="text-xs text-base-content/50 mt-1">Email address cannot be changed.</p>
            </div>

            {/* Submit Button: btn-primary is Blue BG, White text */}
            <div className="form-control pt-4">
                <button
                    type="submit"
                    className="btn btn-primary w-full sm:w-auto"
                    disabled={isSubmitting || !isDirty}
                >
                    {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}

export default ProfileUpdateForm;
