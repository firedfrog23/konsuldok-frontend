// src/services/appointment.service.js
import apiClient from './apiClient';
// format, parseISO, etc. from date-fns are used in components, not directly here usually

const getMyAppointments = async (filters = {}) => {
  try {
    const response = await apiClient.get('/appointments', { params: filters });
    return response.data.data;
  } catch (error) {
    console.error('Get My Appointments API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch appointments.');
  }
};

const getAppointmentById = async (appointmentId) => {
  try {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Get Appointment by ID (${appointmentId}) API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch appointment details.');
  }
};

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
 * @param {object} [searchParams={}] - Optional search parameters (e.g., { specialty: 'Cardiology', search: 'Dr. Smith' }).
 * @returns {Promise<Array<object>>} List of doctor objects.
 */
const getDoctors = async (searchParams = {}) => {
  try {
    const response = await apiClient.get('/doctors/list-for-booking', { params: searchParams });
    // Assuming backend returns { success: true, data: { doctors: [], ...pagination }, message: '...' }
    return response.data.data.doctors || []; // Return the array of doctors
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
 * @returns {Promise<Array<string>>} List of available time slots (e.g., ["09:00", "09:30"]).
 */
const getDoctorAvailability = async (doctorId, date, duration = 30) => {
  try {
    const response = await apiClient.get(`/doctors/${doctorId}/availability`, {
      params: { date, duration }
    });
    // Assuming backend returns { success: true, data: { availableSlots: [] }, message: '...' }
    return response.data.data.availableSlots || [];
  } catch (error) {
    console.error(`Get Doctor Availability (doctorId: ${doctorId}, date: ${date}) API error:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch doctor availability.');
  }
};


const appointmentService = {
  getMyAppointments,
  getAppointmentById,
  createAppointment,
  cancelAppointment,
  getDoctors,
  getDoctorAvailability,
};

export default appointmentService;
