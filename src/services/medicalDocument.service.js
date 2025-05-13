/* eslint-disable no-unused-vars */
// src/services/medicalDocument.service.js
import logger from '../utils/logger.js'; // Assuming a logger utility
import apiClient from './apiClient.js';

/**
 * Service for managing medical documents.
 */

/**
 * Uploads a medical document file along with its metadata.
 * @param {File} file - The file object to upload.
 * @param {object} documentMetadata - Metadata for the document.
 * Expected: { description?: string, documentDate?: string (ISO), tags?: string[] }
 * @param {string} patientId - The ID of the patient this document belongs to.
 * @param {object} uploadedByUser - The user object performing the upload (for backend audit).
 * @returns {Promise<object>} The created medical document record from the backend.
 */
const uploadMedicalDocument = async (file, documentMetadata, patientId, uploadedByUser) => {
    if (!file) throw new Error('File is required for upload.');
    if (!patientId) throw new Error('Patient ID is required for document upload.');

    const formData = new FormData();
    formData.append('documentFile', file); // Key 'documentFile' must match backend (e.g., Multer field name)
    formData.append('patientId', patientId); // Send patientId in form data
    if (documentMetadata.description) formData.append('description', documentMetadata.description);
    if (documentMetadata.documentDate) formData.append('documentDate', documentMetadata.documentDate);
    if (documentMetadata.tags && documentMetadata.tags.length > 0) {
        documentMetadata.tags.forEach(tag => formData.append('tags[]', tag)); // Send tags as an array
    }
    // uploadedByUser._id will be available in req.user on the backend

    try {
        // The backend route might be like /api/documents/upload or /api/documents/upload/:patientId
        // Adjust if patientId is part of the URL instead of FormData.
        // For now, assuming patientId is in FormData and route is /api/documents/upload
        const response = await apiClient.post(`/documents/upload/${patientId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        logger.info('MedicalDocumentService: Document uploaded successfully', response.data.data);
        return response.data.data;
    } catch (error) {
        logger.error('MedicalDocumentService: Upload Document API error:', error.response?.data || error.message);
        const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
        throw new Error(backendErrorMessage || error.message || 'Failed to upload medical document.');
    }
};


/**
 * Fetches medical documents for a specific patient, with pagination and filtering.
 * @param {string} patientId - The ID of the patient.
 * @param {object} [filters={}] - Optional filters (e.g., { page, limit, tags, startDate, endDate, sortBy, order }).
 * @returns {Promise<object>} An object containing the list of document metadata and pagination details.
 */
const getMedicalDocumentsByPatient = async (patientId, filters = {}) => {
    if (!patientId) {
        const errorMsg = 'Patient ID is required to fetch medical documents.';
        logger.error(`MedicalDocumentService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        // Backend route /api/documents?patientId=...
        const response = await apiClient.get('/documents', { params: { patientId, ...filters } });
        logger.debug(`MedicalDocumentService: Documents for patient ${patientId} retrieved`, response.data.data);
        return response.data.data; // Expects { documents: [], totalPages, currentPage, totalCount }
    } catch (error) {
        logger.error(`MedicalDocumentService: Get Documents for Patient ${patientId} API error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch medical documents.');
    }
};

/**
 * Fetches metadata for a specific medical document by its ID.
 * @param {string} documentId - The ID of the medical document.
 * @returns {Promise<object>} The medical document metadata object.
 */
const getMedicalDocumentById = async (documentId) => {
    if (!documentId) {
        const errorMsg = 'Document ID is required to fetch medical document details.';
        logger.error(`MedicalDocumentService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        const response = await apiClient.get(`/documents/${documentId}`);
        logger.debug(`MedicalDocumentService: Document ${documentId} retrieved`, response.data.data);
        return response.data.data;
    } catch (error) {
        logger.error(`MedicalDocumentService: Get Document by ID (${documentId}) API error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch medical document details.');
    }
};

/**
 * Updates metadata for an existing medical document.
 * @param {string} documentId - The ID of the document to update.
 * @param {object} updateData - Data to update (e.g., { description, tags, documentDate }).
 * @returns {Promise<object>} The updated medical document metadata object.
 */
const updateMedicalDocument = async (documentId, updateData) => {
    if (!documentId) {
        const errorMsg = 'Document ID is required to update a medical document.';
        logger.error(`MedicalDocumentService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        const response = await apiClient.patch(`/documents/${documentId}`, updateData);
        logger.info(`MedicalDocumentService: Document ${documentId} updated successfully`, response.data.data);
        return response.data.data;
    } catch (error) {
        logger.error(`MedicalDocumentService: Update Document (${documentId}) API error:`, error.response?.data || error.message);
        const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
        throw new Error(backendErrorMessage || error.message || 'Failed to update medical document metadata.');
    }
};

/**
 * Deletes a medical document (metadata and file from storage).
 * @param {string} documentId - The ID of the document to delete.
 * @param {object} deletedByUser - The user performing the deletion (for backend audit/permissions).
 * @returns {Promise<void>} Resolves if deletion is successful.
 */
const deleteMedicalDocument = async (documentId, deletedByUser) => {
    if (!documentId) {
        const errorMsg = 'Document ID is required to delete a medical document.';
        logger.error(`MedicalDocumentService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        // The backend will handle deletion from Cloudinary and DB soft/hard delete.
        // deletedByUser is implicitly passed via the authenticated request.
        await apiClient.delete(`/documents/${documentId}`);
        logger.warn(`MedicalDocumentService: Document ${documentId} deleted successfully.`);
    } catch (error) {
        logger.error(`MedicalDocumentService: Delete Document (${documentId}) API error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete medical document.');
    }
};


// It's good practice to also have a function to get a direct download link or stream if the backend supports it.
// const getMedicalDocumentDownloadLink = async (documentId) => { ... };


const medicalDocumentService = {
    uploadMedicalDocument,
    getMedicalDocumentsByPatient,
    getMedicalDocumentById,
    updateMedicalDocument,
    deleteMedicalDocument,
};

export default medicalDocumentService;
