// src/components/auth/ResetPasswordForm.jsx
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import authService from '../../services/auth.service.js';

/**
 * Reset password form. Adheres to strict 3-color palette.
 * - Title (text-secondary) is Black.
 * - Input fields use White BG, Black text/border. Focus/Error states use Blue border/ring.
 * - Submit button (btn-primary) is Blue.
 * - "Back to Login" link (link-primary) is Blue.
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
            addNotification("Invalid or missing reset token link.", "error"); // Error is Black BG
            return;
        }
        try {
            await authService.resetPassword(token, data.password);
            addNotification('Password reset successfully! Please log in.', 'success'); // Success is Blue BG
            reset();
            navigate('/login');
        } catch (error) {
            console.error("Reset Password failed:", error);
            addNotification(`Password reset failed: ${error.message}`, 'error');
        }
    };

    // Error border class for input: Uses primary color (Blue) for error indication.
    const errorBorderClass = "border-primary ring-1 ring-primary";

    const inputClasses = (hasError, padding = 'pl-10 pr-10') =>
        `input input-bordered ${padding} border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${hasError ? errorBorderClass : 'border-black/15'}`;

    return (
        <div className="w-full max-w-md mx-auto py-6">
            {/* Title: text-secondary maps to Black */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-secondary mb-6">Set New Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* New Password */}
                <div className="form-control">
                    <label className="label pb-1" htmlFor="password"><span className="label-text font-medium text-base-content">New Password</span></label>
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
                    {/* Error message: text-primary (Blue) */}
                    {errors.password && <p role="alert" className="text-primary text-xs mt-1 pl-1">{errors.password.message}</p>}
                </div>
                {/* Confirm New Password */}
                <div className="form-control">
                    <label className="label pb-1" htmlFor="confirmPassword"><span className="label-text font-medium text-base-content">Confirm New Password</span></label>
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
                    {errors.confirmPassword && <p role="alert" className="text-primary text-xs mt-1 pl-1">{errors.confirmPassword.message}</p>}
                </div>

                {/* Submit Button: btn-primary is Blue BG, White text */}
                <div className="form-control pt-4">
                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Set New Password'}
                    </button>
                </div>
                {/* Link back to Login: link-primary is Blue */}
                <div className="text-center pt-4 text-sm">
                    <Link to="/login" className="link link-primary font-medium hover:underline">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ResetPasswordForm;
