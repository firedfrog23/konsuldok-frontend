/* eslint-disable no-unused-vars */
// src/pages/doctor/ClinicalPatientChartPage.jsx
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import patientService from '../../services/patient.service.js'; // Assuming this service can fetch full patient details
// Mock services for tab content until dedicated services are built
import appointmentService from '../../services/appointment.service.js';

import {
	ArrowLeftIcon, CalendarDaysIcon, DocumentTextIcon,
	InformationCircleIcon,
	UserCircleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// --- Tab Content Placeholder Components ---
// These would be more detailed components in a full implementation

const PatientDemographicsTab = ({ patientData }) => {
    if (!patientData || !patientData.userAccount) return <p className="text-base-content/70">Demographics not available.</p>;
    const { userAccount, dateOfBirth, gender, address, emergencyContact, bloodType, allergies, medicalHistorySummary, insuranceProvider, insurancePolicyNumber } = patientData;

    const DetailItem = ({ label, value, fullWidth = false }) => (
        <div className={`py-2 ${fullWidth ? 'sm:col-span-2' : ''}`}>
            <p className="text-xs text-base-content/60 font-medium">{label}</p>
            <p className="text-base-content">{value || '-'}</p>
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">Patient Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <DetailItem label="Full Name" value={`${userAccount.firstName} ${userAccount.lastName}`} />
                <DetailItem label="Email" value={userAccount.email} />
                <DetailItem label="Phone Number" value={userAccount.phoneNumber} />
                <DetailItem label="Date of Birth" value={dateOfBirth ? format(new Date(dateOfBirth), 'PPP') : 'N/A'} />
                <DetailItem label="Gender" value={gender} />
                <DetailItem label="Blood Type" value={bloodType} />
                <DetailItem label="Address" value={`${address?.street || ''}, ${address?.city || ''}, ${address?.province || ''} ${address?.postalCode || ''}`} fullWidth />
            </div>

            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2 mt-6">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <DetailItem label="Name" value={emergencyContact?.name} />
                <DetailItem label="Relationship" value={emergencyContact?.relationship} />
                <DetailItem label="Phone" value={emergencyContact?.phone} />
            </div>

            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2 mt-6">Medical Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <DetailItem label="Allergies" value={allergies?.join(', ') || 'None reported'} fullWidth />
                <DetailItem label="Medical History Summary" value={medicalHistorySummary || 'None reported'} fullWidth />
            </div>

            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2 mt-6">Insurance Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <DetailItem label="Provider" value={insuranceProvider} />
                <DetailItem label="Policy Number" value={insurancePolicyNumber} />
            </div>
        </div>
    );
};

const PatientAppointmentsTab = ({ patientId }) => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        appointmentService.getMyAppointments({ patientId: patientId, limit: 10, sortBy: 'appointmentTime', order: 'desc' })
            .then(data => setAppointments(data.appointments || []))
            .catch(err => console.error("Error fetching patient appointments for chart:", err))
            .finally(() => setIsLoading(false));
    }, [patientId]);

    if (isLoading) return <div className="text-center py-4"><span className="loading loading-spinner text-primary"></span></div>;
    if (!appointments.length) return <p className="text-base-content/70 p-4 text-center">No appointment history found for this patient.</p>;

    return (
        <div className="space-y-3">
            {appointments.map(appt => (
                <div key={appt._id} className="p-3 bg-base-100 rounded-md border border-black/10">
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-primary">{appt.doctor?.userAccount?.fullName || 'N/A'} ({appt.doctor?.specialty || 'N/A'})</p>
                        <span className={`badge badge-sm ${appt.status === 'Completed' ? 'badge-success' : appt.status === 'Cancelled' ? 'badge-error' : 'badge-info'}`}>{appt.status}</span>
                    </div>
                    <p className="text-sm text-base-content">{format(new Date(appt.appointmentTime), 'PPP p')}</p>
                    <p className="text-xs text-base-content/70 mt-1">Reason: {appt.reasonForVisit || 'Not specified'}</p>
					<Link to={`/appointments/${appt._id}`} className="text-xs link link-primary mt-1 inline-block">View Details</Link>
                </div>
            ))}
        </div>
    );
};

// Add similar placeholder tab components for Notes, Labs, Medications, Documents
// For brevity, these are simplified here.

const PatientMedicalNotesTab = ({ patientId }) => {
    // Mock or fetch actual notes
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Replace with actual service call: medicalNoteService.getMedicalNotesByPatient(patientId)
        setTimeout(() => {
            setNotes([
                { _id: 'note1', consultationDate: '2025-04-15T00:00:00Z', noteContent: 'Patient reported persistent cough. Advised rest and hydration. Follow up in 3 days if no improvement.', authoredBy: { firstName: 'Budi', lastName: 'Santoso'} },
                { _id: 'note2', consultationDate: '2025-03-10T00:00:00Z', noteContent: 'Routine check-up. All vitals stable. Discussed diet and exercise.', authoredBy: { firstName: 'Anisa', lastName: 'Putri'} },
            ]);
            setIsLoading(false);
        }, 500);
    }, [patientId]);

    if (isLoading) return <div className="text-center py-4"><span className="loading loading-spinner text-primary"></span></div>;
    if (!notes.length) return <p className="text-base-content/70 p-4 text-center">No medical notes found.</p>;

    return (
        <div className="space-y-3">
            {notes.map(note => (
                <div key={note._id} className="p-3 bg-base-100 rounded-md border border-black/10">
                    <p className="text-sm font-medium text-primary">{format(new Date(note.consultationDate), 'PPP')} - Dr. {note.authoredBy.firstName} {note.authoredBy.lastName}</p>
                    <p className="text-base-content whitespace-pre-wrap mt-1">{note.noteContent}</p>
                </div>
            ))}
        </div>
    );
};


/**
 * ClinicalPatientChartPage displays a comprehensive view of a patient's record.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function ClinicalPatientChartPage() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { user } = useAuth(); // For role checks if needed for specific actions

    const [patientData, setPatientData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('demographics');

    const fetchPatientFullRecord = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // This service method would fetch PatientProfile and potentially summary of other records
            const data = await patientService.getPatientProfileById(patientId); // Assuming this populates userAccount
            setPatientData(data);
        } catch (err) {
            const errorMsg = err.message || `Failed to load patient record for ID: ${patientId}.`;
            setError(errorMsg);
            addNotification(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [patientId, addNotification]);

    useEffect(() => {
        fetchPatientFullRecord();
    }, [fetchPatientFullRecord]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }

    if (error) {
        return (
            <div className="text-center p-10">
                <InformationCircleIcon className="w-12 h-12 mx-auto text-neutral mb-4" />
                <p className="text-xl font-semibold text-base-content">Error Loading Patient Record</p>
                <p className="text-base-content/80 mt-2">{error}</p>
                <button onClick={() => navigate(-1)} className="btn btn-primary mt-6">Go Back</button>
            </div>
        );
    }

    if (!patientData) {
        return <div className="text-center p-10 text-base-content">Patient record not found.</div>;
    }

    const tabs = [
        { id: 'demographics', label: 'Demographics', icon: UserCircleIcon, content: <PatientDemographicsTab patientData={patientData} /> },
        { id: 'appointments', label: 'Appointments', icon: CalendarDaysIcon, content: <PatientAppointmentsTab patientId={patientId} /> },
        { id: 'notes', label: 'Clinical Notes', icon: DocumentTextIcon, content: <PatientMedicalNotesTab patientId={patientId} /> },
        // Add LabResults, Medications, Documents tabs similarly
        // { id: 'labs', label: 'Lab Results', icon: BeakerIcon, content: <PatientLabResultsTab patientId={patientId} /> },
        // { id: 'medications', label: 'Medications', icon: ClipboardDocumentListIcon, content: <PatientMedicationsTab patientId={patientId} /> },
        // { id: 'documents', label: 'Documents', icon: DocumentTextIcon, content: <PatientDocumentsTab patientId={patientId} /> },
    ];

    const currentTab = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="mb-6 pb-4 border-b border-black/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mr-3 text-primary hover:bg-primary/10">
                            <ArrowLeftIcon className="w-5 h-5"/> Back
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary">
                                Patient Chart: {patientData.userAccount?.firstName} {patientData.userAccount?.lastName}
                            </h1>
                            <p className="text-sm text-base-content/70">
                                ID: {patientData._id} | DOB: {patientData.dateOfBirth ? format(new Date(patientData.dateOfBirth), 'PP') : 'N/A'}
                            </p>
                        </div>
                    </div>
                    {/* Placeholder for actions like "New Note" or "Upload Document" */}
                    {/* <button className="btn btn-primary btn-sm">
                        <PlusIcon className="w-4 h-4 mr-1"/> Add to Chart
                    </button> */}
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="tabs tabs-boxed bg-base-200 mb-6 sticky top-[calc(var(--navbar-height,64px)+1rem)] z-40 shadow-sm">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab tab-lifted sm:tab-lg flex-1 ${activeTab === tab.id ? 'tab-active !bg-primary text-primary-content' : 'text-base-content hover:bg-base-300'}`}
                    >
                        <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-primary-content' : 'text-primary opacity-70'}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="bg-base-100 p-4 sm:p-6 rounded-lg shadow">
                {currentTab ? currentTab.content : <p className="text-base-content">Select a tab to view content.</p>}
            </div>
        </div>
    );
}

export default ClinicalPatientChartPage;
