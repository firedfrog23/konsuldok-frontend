// src/services/appointment.service.js
import apiClient from './apiClient'; // Your configured Axios instance

/**
 * Fetches the authenticated user's appointments from the backend.
 * @param {object} [filters={}] - Optional filters for the API query.
 * @returns {Promise<object>} An object containing the list of appointments and pagination details.
 */
const getMyAppointments = async (filters = {}) => {
  try {
    const response = await apiClient.get('/appointments', { params: filters });
    return response.data.data;
  } catch (error) {
    console.error('Get My Appointments API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch appointments.');
  }
};

/**
 * Fetches details of a specific appointment by its ID.
 * @param {string} appointmentId - The ID of the appointment.
 * @returns {Promise<object>} The appointment object.
 */
const getAppointmentById = async (appointmentId) => {
  try {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Get Appointment by ID (${appointmentId}) API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch appointment details.');
  }
};

/**
 * Creates (requests) a new appointment.
 * @param {object} appointmentData - Data for the new appointment.
 * @returns {Promise<object>} The created appointment object from the backend.
 */
const createAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data.data;
  } catch (error) {
    console.error('Create Appointment API error:', error.response?.data || error.message);
    const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
    throw new Error(backendErrorMessage || error.message || 'Failed to create appointment.');
  }
};

/**
 * Updates an existing appointment (e.g., status change by Doctor/Staff).
 * @param {string} appointmentId - The ID of the appointment to update.
 * @param {object} updateData - The data to update (e.g., { status: 'Confirmed' }).
 * @returns {Promise<object>} The updated appointment object.
 */
const updateAppointment = async (appointmentId, updateData) => {
    try {
        const response = await apiClient.patch(`/appointments/${appointmentId}`, updateData);
        return response.data.data;
    } catch (error) {
        console.error(`Update Appointment (${appointmentId}) API error:`, error.response?.data || error.message);
        const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
        throw new Error(backendErrorMessage || error.message || 'Failed to update appointment.');
    }
};

/**
 * Cancels an existing appointment.
 * @param {string} appointmentId - The ID of the appointment to cancel.
 * @param {string} reason - The reason for cancellation.
 * @returns {Promise<object>} The updated (cancelled) appointment object from the backend.
 */
const cancelAppointment = async (appointmentId, reason) => {
  try {
    const response = await apiClient.patch(`/appointments/${appointmentId}/cancel`, { reason });
    return response.data.data;
  } catch (error) {
    console.error(`Cancel Appointment (${appointmentId}) API error:`, error.response?.data || error.message);
    const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
    throw new Error(backendErrorMessage || error.message || 'Failed to cancel appointment.');
  }
};

/**
 * Fetches a list of doctors from the backend for booking purposes.
 * @param {object} [searchParams={}] - Optional search parameters.
 * @returns {Promise<Array<object>>} List of doctor objects.
 */
const getDoctors = async (searchParams = {}) => {
  try {
    const response = await apiClient.get('/doctors/list-for-booking', { params: searchParams });
    return response.data.data.doctors || [];
  } catch (error) {
    console.error('Get Doctors API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch doctors.');
  }
};

/**
 * Fetches availability for a specific doctor for a given date from the backend.
 * @param {string} doctorId - The ID of the doctor.
 * @param {string} date - The date to check availability for (e.g., 'YYYY-MM-DD').
 * @param {number} [duration=30] - Optional appointment duration in minutes.
 * @returns {Promise<Array<string>>} List of available time slots.
 */
const getDoctorAvailability = async (doctorId, date, duration = 30) => {
  try {
    const response = await apiClient.get(`/doctors/${doctorId}/availability`, {
      params: { date, duration }
    });
    return response.data.data.availableSlots || [];
  } catch (error) {
    console.error(`Get Doctor Availability (doctorId: ${doctorId}, date: ${date}) API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch doctor availability.');
  }
};

// Consolidate all service functions into an exported object
const appointmentService = {
  getMyAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment, // Ensure updateAppointment is included here
  cancelAppointment,
  getDoctors,
  getDoctorAvailability,
};

export default appointmentService;
