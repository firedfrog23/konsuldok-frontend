// src/services/medicalNote.service.js
import logger from '../utils/logger.js'; // Assuming a logger utility exists or will be created
import apiClient from './apiClient.js'; // Your configured Axios instance

/**
 * Service for managing medical notes.
 * All functions interact with the backend API for medical notes.
 */

/**
 * Creates a new medical note.
 * @param {object} noteData - Data for the new note.
 * Expected: { patient: string (patientProfileId), noteContent: string, consultationDate?: string, tags?: string[], appointment?: string }
 * @returns {Promise<object>} The created medical note object from the backend.
 */
const createMedicalNote = async (noteData) => {
    try {
        // The backend will set 'authoredBy' and 'createdBy' based on the authenticated user.
        const response = await apiClient.post('/notes', noteData);
        logger.info('MedicalNoteService: Note created successfully', response.data.data);
        return response.data.data;
    } catch (error) {
        logger.error('MedicalNoteService: Create Note API error:', error.response?.data || error.message);
        const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
        throw new Error(backendErrorMessage || error.message || 'Failed to create medical note.');
    }
};

/**
 * Fetches medical notes for a specific patient, with pagination and filtering.
 * @param {string} patientId - The ID of the patient.
 * @param {object} [filters={}] - Optional filters for the API query (e.g., { page, limit, startDate, endDate, sortBy, order }).
 * @returns {Promise<object>} An object containing the list of notes and pagination details.
 */
const getMedicalNotesByPatient = async (patientId, filters = {}) => {
    if (!patientId) {
        const errorMsg = 'Patient ID is required to fetch medical notes.';
        logger.error(`MedicalNoteService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        // The backend route /api/notes?patientId=... handles fetching notes for a specific patient.
        const response = await apiClient.get('/notes', { params: { patientId, ...filters } });
        logger.debug(`MedicalNoteService: Notes for patient ${patientId} retrieved`, response.data.data);
        return response.data.data; // Assuming backend returns { notes: [], totalPages, currentPage, totalCount }
    } catch (error) {
        logger.error(`MedicalNoteService: Get Notes for Patient ${patientId} API error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch medical notes.');
    }
};

/**
 * Fetches details of a specific medical note by its ID.
 * @param {string} noteId - The ID of the medical note.
 * @returns {Promise<object>} The medical note object.
 */
const getMedicalNoteById = async (noteId) => {
    if (!noteId) {
        const errorMsg = 'Note ID is required to fetch medical note details.';
        logger.error(`MedicalNoteService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        const response = await apiClient.get(`/notes/${noteId}`);
        logger.debug(`MedicalNoteService: Note ${noteId} retrieved`, response.data.data);
        return response.data.data;
    } catch (error) {
        logger.error(`MedicalNoteService: Get Note by ID (${noteId}) API error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch medical note details.');
    }
};

/**
 * Updates an existing medical note.
 * @param {string} noteId - The ID of the note to update.
 * @param {object} updateData - The data to update (e.g., { noteContent, tags, consultationDate }).
 * @returns {Promise<object>} The updated medical note object.
 */
const updateMedicalNote = async (noteId, updateData) => {
    if (!noteId) {
        const errorMsg = 'Note ID is required to update a medical note.';
        logger.error(`MedicalNoteService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        // Backend will handle 'updatedBy' based on authenticated user.
        const response = await apiClient.patch(`/notes/${noteId}`, updateData);
        logger.info(`MedicalNoteService: Note ${noteId} updated successfully`, response.data.data);
        return response.data.data;
    } catch (error) {
        logger.error(`MedicalNoteService: Update Note (${noteId}) API error:`, error.response?.data || error.message);
        const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
        throw new Error(backendErrorMessage || error.message || 'Failed to update medical note.');
    }
};

/**
 * Deletes a medical note (soft delete).
 * @param {string} noteId - The ID of the note to delete.
 * @returns {Promise<void>} Resolves if deletion is successful.
 */
const deleteMedicalNote = async (noteId) => {
    if (!noteId) {
        const errorMsg = 'Note ID is required to delete a medical note.';
        logger.error(`MedicalNoteService: ${errorMsg}`);
        throw new Error(errorMsg);
    }
    try {
        // Backend will handle 'deletedBy' and 'isDeleted' logic.
        await apiClient.delete(`/notes/${noteId}`);
        logger.warn(`MedicalNoteService: Note ${noteId} deleted successfully.`);
        // Typically, DELETE requests might return 204 No Content or a success message.
        // Adjust based on your backend's response.
    } catch (error) {
        logger.error(`MedicalNoteService: Delete Note (${noteId}) API error:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || error.message || 'Failed to delete medical note.');
    }
};

const medicalNoteService = {
    createMedicalNote,
    getMedicalNotesByPatient,
    getMedicalNoteById,
    updateMedicalNote,
    deleteMedicalNote,
};

export default medicalNoteService;
