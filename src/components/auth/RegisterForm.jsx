/* eslint-disable no-unused-vars */
// src/components/auth/RegisterForm.jsx
import {
    AcademicCapIcon,
    EnvelopeIcon,
    EyeIcon, EyeSlashIcon,
    IdentificationIcon,
    LockClosedIcon,
    PhoneIcon,
    UserIcon
} from '@heroicons/react/24/outline'; // Using outline
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { UserRoles } from '../../utils/constants.js';

/**
 * Registration form component - Re-fixed icon positioning using items-center.
 */
function RegisterForm() {
    // ... (useState, useForm, useAuth, navigate, selectedRole, passwordValue, onSubmit remain the same) ...
    const { register: formRegister, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({ /* ... */ });
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();
    const selectedRole = watch('role');
    const passwordValue = watch('password');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = async (data) => { /* ... */ };


    // Common input classes (remain the same)
    const inputClasses = (hasError, padding = 'pl-10') => `input input-bordered ${padding} border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${hasError ? 'border-secondary' : ''}`;
    const selectClasses = (hasError) => `select select-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${hasError ? 'border-secondary' : ''}`;
    const smallInputClasses = (hasError, padding = 'pl-8') => `input input-sm ${padding} input-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary ${hasError ? 'border-error' : ''}`;
    const radioLabelClasses = "flex items-center space-x-2 cursor-pointer";
    const radioInputClasses = "radio radio-sm checked:bg-primary";

    return (
        <div className="w-full py-6">
             <h1 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-2">Create Your Account</h1>
             <p className="text-center text-base-content/70 text-sm mb-8">Get started with your free account</p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* --- Personal Information --- */}
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <legend className="sr-only">Personal Information</legend>
                    {/* First Name */}
                    <div className="form-control">
                        <label className="label py-1" htmlFor="firstName"><span className="label-text text-sm font-medium">First Name</span></label>
                        <div className="relative">
                            {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <UserIcon className="w-5 h-5 text-neutral opacity-40" />
                            </span>
                            <input id="firstName" type="text" placeholder="John" className={inputClasses(errors.firstName)} aria-invalid={errors.firstName ? "true" : "false"}
                                {...formRegister('firstName', { required: 'First name is required' })} />
                        </div>
                        {errors.firstName && <p role="alert" className="text-secondary text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    {/* Last Name */}
                    <div className="form-control">
                        <label className="label py-1" htmlFor="lastName"><span className="label-text text-sm font-medium">Last Name</span></label>
                        <div className="relative">
                             {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                 <UserIcon className="w-5 h-5 text-neutral opacity-40" />
                            </span>
                            <input id="lastName" type="text" placeholder="Doe" className={inputClasses(errors.lastName)} aria-invalid={errors.lastName ? "true" : "false"}
                                {...formRegister('lastName', { required: 'Last name is required' })} />
                        </div>
                        {errors.lastName && <p role="alert" className="text-secondary text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                </fieldset>

                {/* --- Contact Information --- */}
                <fieldset className="space-y-4">
                   <legend className="sr-only">Contact Information</legend>
                    {/* Email */}
                    <div className="form-control">
                         <label className="label py-1" htmlFor="email"><span className="label-text text-sm font-medium">Email Address</span></label>
                         <div className="relative">
                            {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <EnvelopeIcon className="w-5 h-5 text-neutral opacity-40" />
                            </span>
                            <input id="email" type="email" placeholder="you@example.com" className={inputClasses(errors.email)} aria-invalid={errors.email ? "true" : "false"}
                            {...formRegister('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email format' }})} />
                        </div>
                        {errors.email && <p role="alert" className="text-secondary text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    {/* Phone */}
                    <div className="form-control">
                        <label className="label py-1" htmlFor="phoneNumber"><span className="label-text text-sm font-medium">Phone Number (Optional)</span></label>
                         <div className="relative">
                            {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <PhoneIcon className="w-5 h-5 text-neutral opacity-40" />
                            </span>
                            <input id="phoneNumber" type="tel" placeholder="e.g., 0812..." className={inputClasses(errors.phoneNumber)} aria-invalid={errors.phoneNumber ? "true" : "false"}
                            {...formRegister('phoneNumber', { pattern: { value: /^[0-9\s+()-]*$/, message: 'Numbers, spaces, -, () only' }})} />
                        </div>
                        {errors.phoneNumber && <p role="alert" className="text-secondary text-xs mt-1">{errors.phoneNumber.message}</p>}
                    </div>
                </fieldset>

                {/* --- Gender Selection (Structure remains the same) --- */}
                 <fieldset className="form-control">
                      {/* ... gender options ... */}
                       <label className="label pt-0"><span className="label-text font-medium">Gender</span></label> <div className="flex items-center space-x-4 pt-1"> <label className={radioLabelClasses}> <input type="radio" value="Male" className={radioInputClasses} {...formRegister("gender", { required: "Gender is required" })}/> <span className="label-text text-sm">Male</span> </label> <label className={radioLabelClasses}> <input type="radio" value="Female" className={radioInputClasses} {...formRegister("gender", { required: "Gender is required" })}/> <span className="label-text text-sm">Female</span> </label> </div> {errors.gender && <p role="alert" className="text-secondary text-xs mt-1">{errors.gender.message}</p>}
                 </fieldset>

                {/* --- Account Type --- */}
                <fieldset className="space-y-4">
                    {/* ... select and conditional doctor fields ... */}
                    <legend className="label"><span className="label-text font-medium">Account Type</span></legend>
                    <div className="form-control">
                        <select className={selectClasses(errors.role)} aria-invalid={errors.role ? "true" : "false"} {...formRegister('role', { required: 'Please select a role' })}>
                            <option value="" disabled>Select account type...</option>
                            <option value={UserRoles.PATIENT}>I am a Patient</option>
                            <option value={UserRoles.DOCTOR}>I am a Doctor</option>
                        </select>
                        {errors.role && <p role="alert" className="text-secondary text-xs mt-1">{errors.role.message}</p>}
                    </div>
                    {selectedRole === UserRoles.DOCTOR && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }} className="p-4 border border-primary/30 rounded-lg space-y-3 bg-base-200 overflow-hidden">
                            <p className="text-sm font-semibold text-primary">Doctor Information</p>
                            {/* Specialty */}
                            <div className="form-control relative">
                                <label className="label py-0" htmlFor="specialty"><span className="label-text text-xs font-medium">Specialty</span></label>
                                 {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none z-10"> <AcademicCapIcon className="w-5 h-5 text-neutral opacity-50" /> </span>
                                <input id="specialty" type="text" placeholder="e.g., Cardiology" className={smallInputClasses(errors.specialty)} aria-invalid={errors.specialty ? "true" : "false"} {...formRegister('specialty', { required: selectedRole === UserRoles.DOCTOR ? 'Specialty is required' : false })} />
                                {errors.specialty && <p role="alert" className="text-secondary text-xs mt-1">{errors.specialty.message}</p>}
                            </div>
                            {/* License */}
                            <div className="form-control relative">
                                <label className="label py-0" htmlFor="licenseNumber"><span className="label-text text-xs font-medium">License Number</span></label>
                                 {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                                <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none z-10"> <IdentificationIcon className="w-5 h-5 text-neutral opacity-50" /> </span>
                                <input id="licenseNumber" type="text" placeholder="STR Number" className={smallInputClasses(errors.licenseNumber)} aria-invalid={errors.licenseNumber ? "true" : "false"} {...formRegister('licenseNumber', { required: selectedRole === UserRoles.DOCTOR ? 'License number is required' : false })} />
                                {errors.licenseNumber && <p role="alert" className="text-secondary text-xs mt-1">{errors.licenseNumber.message}</p>}
                            </div>
                        </motion.div>
                    )}
                </fieldset>

                {/* --- Password Fields --- */}
                <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <legend className="sr-only">Password</legend>
                    {/* Password */}
                    <div className="form-control">
                        <label className="label py-1" htmlFor="password"><span className="label-text font-medium">Password</span></label>
                        <div className="relative">
                             {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"> <LockClosedIcon className="w-5 h-5 text-neutral opacity-40" /> </span>
                            <input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" className={`pr-10 ${inputClasses(errors.password)}`} aria-invalid={errors.password ? "true" : "false"} {...formRegister('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' }, })} />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral opacity-50 hover:opacity-80 z-10" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} > {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />} </button>
                        </div>
                        {errors.password && <p role="alert" className="text-secondary text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    {/* Confirm Password */}
                    <div className="form-control">
                        <label className="label py-1" htmlFor="confirmPassword"><span className="label-text font-medium">Confirm Password</span></label>
                        <div className="relative">
                            {/* --- FIX: Re-added flex items-center, removed mt-* --- */}
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"> <LockClosedIcon className="w-5 h-5 text-neutral opacity-40" /> </span>
                            <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter password" className={`pr-10 ${inputClasses(errors.confirmPassword)}`} aria-invalid={errors.confirmPassword ? "true" : "false"} {...formRegister('confirmPassword', { required: 'Please confirm your password', validate: value => value === passwordValue || "Passwords do not match" })} />
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral opacity-50 hover:opacity-80 z-10" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} > {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />} </button>
                        </div>
                        {errors.confirmPassword && <p role="alert" className="text-secondary text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                </fieldset>

                {/* Submit Button */}
                <div className="form-control pt-4">
                    <button type="submit" className="btn btn-primary w-full transition-opacity duration-300 ease-in-out hover:opacity-90" disabled={isSubmitting}>
                        {isSubmitting ? <span className="loading loading-spinner loading-sm mr-2"></span> : ''}
                        {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>

                {/* Link to Login */}
                <div className="text-center pt-4 text-sm">
                    <span className="text-base-content/80">Already have an account? </span>
                    <Link to="/login" className="link link-secondary font-medium hover:underline">
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
        // --- REMOVED Closing Card div ---
    );
}

export default RegisterForm;