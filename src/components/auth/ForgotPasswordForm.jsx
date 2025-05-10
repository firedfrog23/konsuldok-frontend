// src/components/auth/ForgotPasswordForm.jsx
import { EnvelopeIcon } from '@heroicons/react/24/outline'; // Import icon
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext.jsx'; // Use .jsx
import authService from '../../services/auth.service.js'; // Corrected import

/**
 * Forgot password form - Card removed, icon added.
 */
function ForgotPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({ mode: 'onBlur' });
    const { addNotification } = useNotification();

    /**
     * Handles form submission for password reset request.
     * @param {object} data - Form data { email }.
     */
    const onSubmit = async (data) => {
        try {
            await authService.forgotPassword(data.email);
            addNotification('If an account exists, a password reset link has been sent.', 'success'); // Success is Blue
            reset();
        } catch (error) {
            console.error("Forgot Password failed:", error);
            addNotification(`Request failed: ${error.message}`, 'error'); // Error is Orange
        }
    };

    return (
        // --- REMOVED Card div ---
        // Added padding and max-width directly
        <div className="w-full max-w-md mx-auto py-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-4">Forgot Password?</h2> {/* Orange title */}
            <p className="text-center text-sm mb-8 text-base-content/70">
                Enter your email address to receive a reset link.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5"> {/* Adjusted spacing */}
                {/* Email Field */}
                <div className="form-control">
                    <label className="label pb-1" htmlFor="email">
                        <span className="label-text text-base-content font-medium">Email Address</span>
                    </label>
                    <div className="relative">
                        {/* Added Icon */}
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <EnvelopeIcon className="w-5 h-5 text-neutral opacity-40" />
                        </span>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            // Use secondary color for focus/error on this form
                            className={`input input-bordered pl-10 border-black/15 w-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${errors.email ? 'border-error' : ''}`} // Error maps to Orange
                            aria-invalid={errors.email ? "true" : "false"}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address format',
                                },
                            })}
                        />
                    </div>
                     {errors.email && <p role="alert" className="text-error text-xs mt-1 pl-1">{errors.email.message}</p>} {/* Error maps to Orange */}
                </div>

                {/* Submit Button */}
                <div className="form-control pt-4">
                    <button
                        type="submit"
                        className="btn btn-primary w-full" // Orange button
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Send Reset Link'}
                    </button>
                </div>

                {/* Link back to Login */}
                <div className="text-center pt-4 text-sm">
                    <Link to="/login" className="link link-secondary font-medium hover:underline"> {/* Blue link */}
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
        // --- REMOVED Closing Card div ---
    );
}

export default ForgotPasswordForm;