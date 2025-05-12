// src/components/auth/LoginForm.jsx
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

/**
 * Login form component. Adheres to strict 3-color palette.
 * - Title (text-base-content) is Black.
 * - Input fields use White BG, Black text/border. Focus/Error states use Blue border/ring.
 * - Links (Forgot Password, Create Account) are Black or Blue.
 * - Submit button (btn-primary) is Blue.
 */
function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ mode: 'onBlur' });
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        const success = await login(data.email, data.password);
        if (success) {
            navigate('/dashboard');
        }
    };

    // Error border class for input: Uses primary color (Blue) for error indication.
    const errorBorderClass = "border-primary ring-1 ring-primary";

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Title: text-base-content is Black */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-base-content mb-1">
                Welcome Back
            </h2>
            {/* Subtext: text-base-content is Black with opacity */}
            <p className="text-center text-base-content/70 text-sm mb-8">
                Sign in to your KonsulDok account
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
                            <EnvelopeIcon className="w-5 h-5 text-neutral opacity-50" />
                        </span>
                        <input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            // Input: White BG, Black text/border. Focus is Blue. Error border is Blue.
                            className={`input input-bordered pl-10 border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.email ? errorBorderClass : 'border-black/15'}`}
                            aria-invalid={errors.email ? "true" : "false"}
                            {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email format' }, })}
                        />
                    </div>
                    {/* Error message: text-primary (Blue) */}
                    {errors.email && (<p role="alert" className="text-primary text-xs mt-1 pl-1">{errors.email.message}</p>)}
                </div>

                {/* Password Field */}
                <div className="form-control">
                    <label className="label pb-1" htmlFor="password">
                        <span className="label-text text-base-content font-medium">Password</span>
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <LockClosedIcon className="w-5 h-5 text-neutral opacity-50" />
                        </span>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="*********"
                            className={`input input-bordered pl-10 pr-10 border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${errors.password ? errorBorderClass : 'border-black/15'}`}
                            aria-invalid={errors.password ? "true" : "false"}
                            {...register('password', { required: 'Password is required' })}
                        />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral opacity-50 hover:opacity-80 focus:opacity-80 z-10" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} >
                            {showPassword ? (<EyeSlashIcon className="h-5 w-5" />) : (<EyeIcon className="h-5 w-5" />)}
                        </button>
                    </div>
                    {errors.password && (<p role="alert" className="text-primary text-xs mt-1 pl-1">{errors.password.message}</p>)}
                    {/* Forgot password link: text-secondary maps to Black */}
                    <div className="text-right mt-1">
                         <Link to="/forgot-password" className="label-text-alt link link-hover text-secondary font-semibold text-sm"> Forgot password? </Link>
                    </div>
                </div>

                {/* Submit Button: btn-primary is Blue BG, White text */}
                <div className="form-control pt-2">
                    <button type="submit" className="btn btn-primary w-full transition-opacity duration-300 ease-in-out hover:opacity-90" disabled={isSubmitting}>
                        {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : 'Sign in'}
                    </button>
                </div>

                {/* Create Account Link: link-secondary maps to Black */}
                <div className="text-center pt-2 text-sm">
                    <span className="text-base-content/80">Don't have an account? </span>
                    <Link to="/register" className="link link-secondary font-medium hover:underline"> Create account </Link>
                </div>
                <div className="divider text-base-content/40 text-xs my-6">OR</div>
                {/* Guest Link: link-primary is Blue */}
                <div className="text-center text-sm">
                    <span className="text-base-content/80">Continue as </span>
                    <a href="#" className="link link-primary font-medium hover:underline"> Guest </a>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
