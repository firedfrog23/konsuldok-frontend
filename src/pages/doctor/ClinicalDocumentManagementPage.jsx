// src/pages/doctor/ClinicalDocumentManagementPage.jsx
import {
	ArrowLeftIcon, DocumentArrowUpIcon,
	DocumentMagnifyingGlassIcon,
	EyeIcon,
	InformationCircleIcon,
	PencilSquareIcon,
	TrashIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import medicalDocumentService from '../../services/medicalDocument.service.js'; // Corrected service import
import patientService from '../../services/patient.service.js';

/**
 * ClinicalDocumentManagementPage allows doctors/staff to manage documents for a patient.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function ClinicalDocumentManagementPage() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // User performing actions
    const { addNotification } = useNotification();

    const [patientInfo, setPatientInfo] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadDocumentDate, setUploadDocumentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [uploadTags, setUploadTags] = useState('');

    const fileInputRef = useRef(null);

    const fetchPatientAndDocuments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [patientData, docsData] = await Promise.all([
                patientService.getPatientProfileById(patientId),
                medicalDocumentService.getMedicalDocumentsByPatient(patientId, { limit: 50, sortBy: 'createdAt', order: 'desc' })
            ]);
            setPatientInfo(patientData);
            setDocuments(docsData.documents || []);
        } catch (err) {
            const errorMsg = err.message || `Failed to load patient data or documents for ID: ${patientId}.`;
            setError(errorMsg);
            addNotification(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [patientId, addNotification]);

    useEffect(() => {
        fetchPatientAndDocuments();
    }, [fetchPatientAndDocuments]);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                addNotification('File is too large. Maximum size is 10MB.', 'error');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUploadDocument = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            addNotification('Please select a file to upload.', 'error');
            return;
        }
        setIsUploading(true);
        try {
            const documentMetadata = {
                description: uploadDescription,
                documentDate: uploadDocumentDate ? new Date(uploadDocumentDate).toISOString() : new Date().toISOString(),
                tags: uploadTags.split(',').map(tag => tag.trim()).filter(Boolean),
            };
            // Pass the file, metadata, patientId, and the authenticated user object
            await medicalDocumentService.uploadMedicalDocument(selectedFile, documentMetadata, patientId, user);

            addNotification('Document uploaded successfully!', 'success');
            setSelectedFile(null);
            setUploadDescription('');
            setUploadDocumentDate(format(new Date(), 'yyyy-MM-dd'));
            setUploadTags('');
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchPatientAndDocuments();
        } catch (err) {
            addNotification(err.message || 'Failed to upload document.', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            try {
                // Pass the authenticated user for backend audit/permission checks
                await medicalDocumentService.deleteMedicalDocument(documentId, user);
                addNotification('Document deleted successfully.', 'info');
                fetchPatientAndDocuments();
            } catch (err) {
                addNotification(err.message || 'Failed to delete document.', 'error');
            }
        }
    };

    const handleEditDocument = (doc) => {
        // For Phase 6, this could navigate to a separate edit page or open a modal form
        // For now, it's a placeholder.
        // Example: navigate(`/patient/${patientId}/documents/${doc._id}/edit`);
        addNotification(`Edit functionality for "${doc.fileName}" is not yet implemented.`, 'info');
    };

    const inputBaseClasses = "input input-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    // const textareaBaseClasses = "textarea textarea-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"; // Not used here

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    }
    if (error && !patientInfo) {
        return (
			<div className="text-center p-10">
                <InformationCircleIcon className="w-12 h-12 mx-auto text-neutral mb-4" />
                <p className="text-xl font-semibold text-base-content">Error Loading Patient Data</p>
                <p className="text-base-content/80 mt-2">{error}</p>
                <button onClick={() => navigate('/patients/search')} className="btn btn-primary mt-6">Back to Search</button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <header className="mb-6 pb-4 border-b border-black/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to={`/patient/${patientId}/chart`} className="btn btn-ghost btn-sm mr-3 text-primary hover:bg-primary/10">
                            <ArrowLeftIcon className="w-5 h-5"/> Patient Chart
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-primary">Manage Patient Documents</h1>
                            {patientInfo && (
                                <p className="text-sm text-base-content/70">
                                    Patient: {patientInfo.userAccount?.firstName} {patientInfo.userAccount?.lastName} (ID: {patientId})
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <section className="bg-base-200 p-6 rounded-lg shadow-md border border-black/5 mb-8">
                <h2 className="text-xl font-semibold text-primary mb-4">Upload New Document</h2>
                <form onSubmit={handleUploadDocument} className="space-y-4">
                    <div className="form-control">
                        <label htmlFor="documentFile" className="label pb-1"><span className="label-text text-base-content font-medium">Select File</span></label>
                        <input type="file" id="documentFile" ref={fileInputRef} onChange={handleFileSelect} className="file-input file-input-bordered file-input-primary w-full bg-base-100" />
                        {selectedFile && <p className="text-xs text-base-content/70 mt-1">Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</p>}
                    </div>
                    <div className="form-control">
                        <label htmlFor="uploadDescription" className="label pb-1"><span className="label-text text-base-content font-medium">Description (Optional)</span></label>
                        <input type="text" id="uploadDescription" value={uploadDescription} onChange={(e) => setUploadDescription(e.target.value)} placeholder="e.g., Referral letter, Lab results June 2024" className={inputBaseClasses} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label htmlFor="uploadDocumentDate" className="label pb-1"><span className="label-text text-base-content font-medium">Document Date</span></label>
                            <input type="date" id="uploadDocumentDate" value={uploadDocumentDate} onChange={(e) => setUploadDocumentDate(e.target.value)} className={inputBaseClasses} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="uploadTags" className="label pb-1"><span className="label-text text-base-content font-medium">Tags (comma-separated, optional)</span></label>
                            <input type="text" id="uploadTags" value={uploadTags} onChange={(e) => setUploadTags(e.target.value)} placeholder="e.g., referral, cardiology, lab" className={inputBaseClasses} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isUploading || !selectedFile}>
                        {isUploading ? <span className="loading loading-spinner loading-sm"></span> : <DocumentArrowUpIcon className="w-5 h-5 mr-2" />}
                        Upload Document
                    </button>
                </form>
            </section>

            <section>
                <h2 className="text-xl font-semibold text-neutral mb-4">Uploaded Documents</h2>
                {isLoading && !documents.length && <div className="text-center py-4"><span className="loading loading-dots text-primary"></span></div>}
                {error && documents.length === 0 && !isLoading && <p className="text-center text-neutral py-4">{error}</p>} {/* Show error only if no docs and not loading */}
                {!isLoading && documents.length === 0 && !error && (
                    <div className="text-center py-10 bg-base-200 rounded-lg shadow">
                        <DocumentMagnifyingGlassIcon className="w-12 h-12 mx-auto text-base-content/30 mb-3" />
                        <p className="text-base-content/70">No documents found for this patient.</p>
                    </div>
                )}
                {documents.length > 0 && (
                    <div className="overflow-x-auto bg-base-100 rounded-lg shadow border border-black/10">
                        <table className="table table-zebra w-full">
                            <thead className="bg-base-300 text-base-content"> {/* bg-base-300 is White */}
                                <tr>
                                    <th>File Name</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Upload Date</th>
                                    <th>Document Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map(doc => (
                                    <tr key={doc._id} className="hover:bg-base-200"> {/* hover:bg-base-200 is White */}
                                        <td className="font-medium text-primary hover:underline">
                                            <a href={doc.cloudinaryUrl} target="_blank" rel="noopener noreferrer" title={doc.description || doc.fileName}>
                                                {doc.fileName}
                                            </a>
                                        </td>
                                        <td className="text-base-content">{doc.fileType}</td>
                                        <td className="text-base-content/80">{(doc.fileSize / 1024).toFixed(1)} KB</td>
                                        <td className="text-base-content/80">{format(new Date(doc.createdAt), 'PPp')}</td>
                                        <td className="text-base-content/80">{doc.documentDate ? format(new Date(doc.documentDate), 'PP') : 'N/A'}</td>
                                        <td className="space-x-1">
                                            <a href={doc.cloudinaryUrl} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-ghost text-primary" title="View Document">
                                                <EyeIcon className="w-4 h-4"/>
                                            </a>
                                            <button onClick={() => handleEditDocument(doc)} className="btn btn-xs btn-ghost text-neutral" title="Edit Metadata">
                                                <PencilSquareIcon className="w-4 h-4"/>
                                            </button>
                                            <button onClick={() => handleDeleteDocument(doc._id)} className="btn btn-xs btn-ghost text-error" title="Delete Document">
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default ClinicalDocumentManagementPage;
