import apiClient from './apiClient';

/**
 * Registers a new user.
 * @param {object} userData - { email, password, firstName, lastName, role, phoneNumber, ...profileData }
 * @returns {Promise<{ user: object, accessToken: string }>} Response data from backend.
 */
const register = async (userData) => {
	try {
		const response = await apiClient.post('/auth/register', userData);
		// Backend sends { success: true, data: { user, accessToken }, message: '...' }
		return response.data.data; // Extract user and token
	} catch (error) {
		console.error('Registration API error:', error);
		// Rethrow the error message extracted by interceptor or the original error
		throw error;
	}
};

/**
 * Logs in a user.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<{ user: object, accessToken: string }>} Response data from backend.
 */
const login = async (email, password) => {
	try {
		const response = await apiClient.post('/auth/login', { email, password });
		return response.data.data; // Extract user and token
	} catch (error) {
		console.error('Login API error:', error);
		throw error;
	}
};

/**
 * Logs out the user (calls backend endpoint if exists).
 * @returns {Promise<void>}
 */
const logout = async () => {
	try {
		// Backend might require a specific token or cookie handling
		// to invalidate session/refresh tokens server-side.
		await apiClient.post('/auth/logout');
		// No data usually returned on successful logout
	} catch (error) {
		// Often, client-side logout proceeds even if backend call fails
		console.error('Logout API error (proceeding client-side):', error);
		// Don't necessarily rethrow unless critical
	}
};

/**
 * Fetches the current authenticated user's profile.
 * Assumes token/cookie is handled by apiClient interceptors or backend session.
 * @returns {Promise<object>} User profile data.
 */
const getMe = async () => {
	try {
		const response = await apiClient.get('/auth/me');
		return response.data.data; // Backend returns user data in 'data' field
	} catch (error) {
		// If 401, interceptor might handle redirect. Otherwise, rethrow.
		console.error('GetMe API error:', error.message);
		// Return null or let interceptor handle it, depends on desired flow
		// Returning null allows AuthContext to clear state gracefully
		if (error.response?.status === 401) {
		return null;
		}
		throw error; // Rethrow other errors
	}
};

/**
 * Requests a password reset email.
 * @param {string} email - User's email.
 * @returns {Promise<void>}
 */
const forgotPassword = async (email) => {
	try {
		await apiClient.post('/auth/forgot-password', { email });
		// Success usually indicated by 200 OK, no specific data needed
	} catch (error) {
		console.error('Forgot Password API error:', error);
		throw error;
	}
};

/**
 * Resets the password using a token.
 * @param {string} token - The password reset token from the URL/email.
 * @param {string} password - The new password.
 * @returns {Promise<void>}
 */
const resetPassword = async (token, password) => {
	try {
		// Token might be part of URL handled by router, passed here
		await apiClient.patch(`/auth/reset-password/${token}`, { password });
		// Success usually indicated by 200 OK
	} catch (error) {
		console.error('Reset Password API error:', error);
		throw error;
	}
};

const authService = {
	register,
	login,
	logout,
	getMe,
	forgotPassword,
	resetPassword,
};

export default authService;