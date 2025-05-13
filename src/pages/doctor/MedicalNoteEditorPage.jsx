/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// src/pages/doctor/MedicalNoteEditorPage.jsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
// Assume medicalNoteService will have createMedicalNote and updateMedicalNote, getMedicalNoteById
import medicalNoteService from '../../services/medicalNote.service.js';
// Assume patientService can fetch basic patient info for context
import { ArrowLeftIcon, CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import patientService from '../../services/patient.service.js';

/**
 * MedicalNoteEditorPage allows doctors and staff to create or edit clinical notes for a patient.
 * Adheres to strict 3-color palette and UI/UX standards.
 * - Page Title: Blue (`text-primary`).
 * - Form Elements: White BG, Black text/border, Blue focus/error states.
 * - Buttons: Save (Blue BG), Cancel (Black text).
 */
function MedicalNoteEditorPage({ mode = 'create' }) { // mode can be 'create' or 'edit'
    const { patientId, noteId } = useParams(); // noteId will be present in 'edit' mode
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addNotification } = useNotification();

    const [patientInfo, setPatientInfo] = useState(null);
    const [isLoadingPatient, setIsLoadingPatient] = useState(true);
    const [isLoadingNote, setIsLoadingNote] = useState(mode === 'edit'); // Only load note if in edit mode
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);

    const { control, handleSubmit, register, reset, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            consultationDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"), // Default to now
            noteContent: '',
            tags: '', // Store tags as comma-separated string for simplicity in form
            appointment: '', // Optional appointment ID
        }
    });

    // Fetch patient info
    useEffect(() => {
        if (patientId) {
            setIsLoadingPatient(true);
            patientService.getPatientProfileById(patientId) // Assuming this fetches basic userAccount info
                .then(data => setPatientInfo(data))
                .catch(err => {
                    addNotification(`Failed to load patient information: ${err.message}`, 'error');
                    setError('Failed to load patient information.');
                })
                .finally(() => setIsLoadingPatient(false));
        }
    }, [patientId, addNotification]);

    // Fetch existing note if in edit mode
    useEffect(() => {
        if (mode === 'edit' && noteId) {
            setIsLoadingNote(true);
            medicalNoteService.getMedicalNoteById(noteId)
                .then(note => {
                    reset({
                        consultationDate: note.consultationDate ? format(new Date(note.consultationDate), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
                        noteContent: note.noteContent || '',
                        tags: note.tags ? note.tags.join(', ') : '',
                        appointment: note.appointment || '',
                    });
                })
                .catch(err => {
                    addNotification(`Failed to load note for editing: ${err.message}`, 'error');
                    setError('Failed to load the medical note.');
                })
                .finally(() => setIsLoadingNote(false));
        }
    }, [mode, noteId, reset, addNotification]);


    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setFormError(null);

        const payload = {
            patient: patientId,
            consultationDate: new Date(data.consultationDate).toISOString(),
            noteContent: data.noteContent,
            tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            appointment: data.appointment || null,
            // authoredBy will be set by the backend based on req.user
        };

        try {
            if (mode === 'edit' && noteId) {
                await medicalNoteService.updateMedicalNote(noteId, payload);
                addNotification('Medical note updated successfully!', 'success');
            } else {
                await medicalNoteService.createMedicalNote(payload);
                addNotification('Medical note created successfully!', 'success');
            }
            // Navigate back to patient chart's notes tab or a relevant page
            navigate(`/patient/${patientId}/chart?tab=notes`);
        } catch (err) {
            const errorMsg = err.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} medical note.`;
            setFormError(errorMsg);
            addNotification(errorMsg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseClasses = "input input-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    const textareaBaseClasses = "textarea textarea-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    const errorBorderClass = "border-primary ring-1 ring-primary";


    if (isLoadingPatient || isLoadingNote) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (formError && !isLoadingPatient && !isLoadingNote) { // Show formError only after initial loads
         return (
            <div className="text-center p-10">
                <InformationCircleIcon className="w-12 h-12 mx-auto text-neutral mb-4" />
                <p className="text-xl font-semibold text-base-content">Error</p>
                <p className="text-base-content/80 mt-2">{formError}</p>
                <button onClick={() => navigate(`/patient/${patientId}/chart`)} className="btn btn-primary mt-6">Back to Patient Chart</button>
            </div>
        );
    }
    
    if (!patientInfo && !isLoadingPatient) {
         return (
            <div className="text-center p-10">
                <InformationCircleIcon className="w-12 h-12 mx-auto text-neutral mb-4" />
                <p className="text-xl font-semibold text-base-content">Patient Not Found</p>
                <p className="text-base-content/80 mt-2">Could not load patient information.</p>
                <button onClick={() => navigate('/patients/search')} className="btn btn-primary mt-6">Search Patients</button>
            </div>
        );
    }


    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-6 pb-4 border-b border-black/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to={`/patient/${patientId}/chart`} className="btn btn-ghost btn-sm mr-3 text-primary hover:bg-primary/10">
                            <ArrowLeftIcon className="w-5 h-5"/> Patient Chart
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary">
                                {mode === 'edit' ? 'Edit Medical Note' : 'Create New Medical Note'}
                            </h1>
                            {patientInfo && (
                                <p className="text-sm text-base-content/70">
                                    For: {patientInfo.userAccount?.firstName} {patientInfo.userAccount?.lastName} (ID: {patientId})
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-200 p-6 sm:p-8 rounded-lg shadow-xl border border-black/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Consultation Date */}
                    <div className="form-control">
                        <label htmlFor="consultationDate" className="label pb-1">
                            <span className="label-text text-base-content font-medium">Consultation Date & Time</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="consultationDate"
                            className={`${inputBaseClasses} ${errors.consultationDate ? errorBorderClass : 'border-black/15'}`}
                            {...register('consultationDate', { required: 'Consultation date is required.' })}
                        />
                        {errors.consultationDate && <p role="alert" className="text-primary text-xs mt-1">{errors.consultationDate.message}</p>}
                    </div>

                    {/* Associated Appointment ID (Optional) */}
                    <div className="form-control">
                        <label htmlFor="appointment" className="label pb-1">
                            <span className="label-text text-base-content font-medium">Associated Appointment ID (Optional)</span>
                        </label>
                        <input
                            type="text"
                            id="appointment"
                            placeholder="Enter appointment ID if applicable"
                            className={`${inputBaseClasses} ${errors.appointment ? errorBorderClass : 'border-black/15'}`}
                            {...register('appointment', {
                                pattern: {
                                    value: /^[a-f\d]{24}$/i, // Basic MongoDB ObjectId pattern
                                    message: "Invalid Appointment ID format."
                                }
                            })}
                        />
                        {errors.appointment && <p role="alert" className="text-primary text-xs mt-1">{errors.appointment.message}</p>}
                    </div>
                </div>

                {/* Note Content (Textarea) */}
                <div className="form-control">
                    <label htmlFor="noteContent" className="label pb-1">
                        <span className="label-text text-base-content font-medium">Clinical Note Content</span>
                    </label>
                    {/* In a real app, this would be a Rich Text Editor */}
                    <textarea
                        id="noteContent"
                        rows={10}
                        placeholder="Enter detailed clinical notes here..."
                        className={`${textareaBaseClasses} ${errors.noteContent ? errorBorderClass : 'border-black/15'}`}
                        {...register('noteContent', {
                            required: 'Note content cannot be empty.',
                            maxLength: { value: 5000, message: 'Note content cannot exceed 5000 characters.' }
                        })}
                    ></textarea>
                    {errors.noteContent && <p role="alert" className="text-primary text-xs mt-1">{errors.noteContent.message}</p>}
                </div>

                {/* Tags */}
                <div className="form-control">
                    <label htmlFor="tags" className="label pb-1">
                        <span className="label-text text-base-content font-medium">Tags (comma-separated)</span>
                    </label>
                    <input
                        type="text"
                        id="tags"
                        placeholder="e.g., Follow Up, Diagnosis, Prescription"
                        className={`${inputBaseClasses} ${errors.tags ? errorBorderClass : 'border-black/15'}`}
                        {...register('tags')}
                    />
                    {errors.tags && <p role="alert" className="text-primary text-xs mt-1">{errors.tags.message}</p>}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(`/patient/${patientId}/chart?tab=notes`)}
                        className="btn btn-ghost text-base-content" // Black text
                        disabled={isSubmitting}
                    >
                        <XCircleIcon className="w-5 h-5 mr-1" /> Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary" // Blue BG
                        disabled={isSubmitting || !isDirty}
                    >
                        {isSubmitting ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <CheckCircleIcon className="w-5 h-5 mr-1" />
                        )}
                        {mode === 'edit' ? 'Save Changes' : 'Create Note'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default MedicalNoteEditorPage;
