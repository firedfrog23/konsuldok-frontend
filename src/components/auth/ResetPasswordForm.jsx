// src/components/auth/ResetPasswordForm.jsx
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline'; // Use outline icons
import React, { useState } from 'react'; // Import useState for password toggle
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import authService from '../../services/auth.service.js';

/**
 * Reset password form using token from URL - Card removed.
 */
function ResetPasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm({ mode: 'onBlur' });
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const { token } = useParams();
    const passwordValue = watch('password');

    const onSubmit = async (data) => {
        if (!token) {
            addNotification("Invalid or missing reset token link.", "error");
            return;
        }
        // Password match validated by react-hook-form rule
        try {
            await authService.resetPassword(token, data.password);
            addNotification('Password reset successfully! Please log in.', 'success');
            reset();
            navigate('/login');
        } catch (error) {
            console.error("Reset Password failed:", error);
            addNotification(`Password reset failed: ${error.message}`, 'error');
        }
    };

    // Common input classes
    const inputClasses = (hasError, padding = 'pl-10 pr-10') => // Added pr-10 for eye icon
        `input input-bordered ${padding} border-black/15 bg-base-100 w-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${hasError ? 'border-error' : ''}`; // Use secondary focus/error

    return (
        // Removed Card div wrapper. Added padding if needed.
        <div className="w-full max-w-md mx-auto py-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-secondary mb-6">Set New Password</h2> {/* Orange title */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5"> {/* Increased spacing */}
                {/* New Password */}
                <div className="form-control">
                    <label className="label pb-1" htmlFor="password"><span className="label-text font-medium">New Password</span></label>
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"> <LockClosedIcon className="w-5 h-5 text-neutral opacity-40" /> </span>
                        <input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                            className={inputClasses(errors.password)}
                            aria-invalid={errors.password ? "true" : "false"}
                            {...register('password', {
                                required: 'New password is required',
                                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            })} />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral opacity-50 hover:opacity-80 z-10" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} >
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                     </div>
                     {errors.password && <p role="alert" className="text-error text-xs mt-1 pl-1">{errors.password.message}</p>} {/* Error mapped to Orange */}
                </div>
                {/* Confirm New Password */}
                <div className="form-control">
                    <label className="label pb-1" htmlFor="confirmPassword"><span className="label-text font-medium">Confirm New Password</span></label>
                     <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"> <LockClosedIcon className="w-5 h-5 text-neutral opacity-40" /> </span>
                        <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter new password"
                            className={inputClasses(errors.confirmPassword)}
                            aria-invalid={errors.confirmPassword ? "true" : "false"}
                            {...register('confirmPassword', {
                                required: 'Please confirm your new password',
                                validate: value => value === passwordValue || "Passwords do not match"
                            })} />
                         <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral opacity-50 hover:opacity-80 z-10" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} >
                            {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                     </div>
                     {errors.confirmPassword && <p role="alert" className="text-error text-xs mt-1 pl-1">{errors.confirmPassword.message}</p>} {/* Error mapped to Orange */}
                </div>

                {/* Submit Button */}
                <div className="form-control pt-4">
                    <button type="submit" className="btn btn-secondary w-full" disabled={isSubmitting}> {/* Orange button */}
                        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Set New Password'}
                    </button>
                </div>
                {/* Link back to Login */}
                <div className="text-center pt-4 text-sm">
                    <Link to="/login" className="link link-primary font-medium hover:underline"> {/* Blue link */}
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ResetPasswordForm;