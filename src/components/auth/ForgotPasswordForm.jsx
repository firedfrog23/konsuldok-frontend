// src/components/auth/ForgotPasswordForm.jsx
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import authService from '../../services/auth.service.js';

/**
 * Forgot password form. Adheres to strict 3-color palette.
 * - Title (text-primary) is Blue.
 * - Input field uses White BG, Black text/border. Focus/Error states use Blue border/ring.
 * - Submit button (btn-primary) is Blue.
 * - "Back to Login" link (link-secondary) is Black.
 */
function ForgotPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({ mode: 'onBlur' });
    const { addNotification } = useNotification();

    const onSubmit = async (data) => {
        try {
            await authService.forgotPassword(data.email);
            addNotification('If an account exists, a password reset link has been sent.', 'success'); // Success is Blue BG
            reset();
        } catch (error) {
            console.error("Forgot Password failed:", error);
            addNotification(`Request failed: ${error.message}`, 'error'); // Error is Black BG
        }
    };

    // Error border class for input: Uses primary color (Blue) for error indication.
    const errorBorderClass = "border-primary ring-1 ring-primary";

    return (
        <div className="w-full max-w-md mx-auto py-6">
            {/* Title: text-primary is Blue */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-4">Forgot Password?</h2>
            {/* Subtext: text-base-content is Black */}
            <p className="text-center text-sm mb-8 text-base-content/70">
                Enter your email address to receive a reset link.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Email Field */}
                <div className="form-control">
                    <label className="label pb-1" htmlFor="email">
                        <span className="label-text text-base-content font-medium">Email Address</span>
                    </label>
                    <div className="relative">
                        {/* Icon: text-neutral (Black) with opacity */}
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <EnvelopeIcon className="w-5 h-5 text-neutral opacity-40" />
                        </span>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            // Input: White BG, Black text/border. Focus is Blue. Error border is Blue.
                            className={`input input-bordered pl-10 border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.email ? errorBorderClass : 'border-black/15'}`}
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
                    {/* Error message: text-primary (Blue) */}
                    {errors.email && <p role="alert" className="text-primary text-xs mt-1 pl-1">{errors.email.message}</p>}
                </div>

                {/* Submit Button: btn-primary is Blue BG, White text */}
                <div className="form-control pt-4">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Send Reset Link'}
                    </button>
                </div>

                {/* Link back to Login: link-secondary maps to Black text */}
                <div className="text-center pt-4 text-sm">
                    <Link to="/login" className="link link-secondary font-medium hover:underline">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotPasswordForm;
