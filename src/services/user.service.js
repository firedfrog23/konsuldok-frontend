// src/services/user.service.js
import apiClient from './apiClient';

/**
 * Updates the currently authenticated user's profile (text fields).
 * @param {object} profileData - Data to update (e.g., { firstName, lastName, phoneNumber }).
 * @returns {Promise<object>} The updated user object from the backend.
 */
const updateMyProfile = async (profileData) => {
  try {
    const response = await apiClient.patch('/users/profile/me', profileData);
    return response.data.data;
  } catch (error) {
    console.error('Update My Profile API error:', error);
    throw error;
  }
};

/**
 * Uploads a new profile picture for the authenticated user.
 * @param {File} file - The image file to upload.
 * @returns {Promise<object>} The updated user object from the backend (containing the new profilePictureUrl).
 */
const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file); // Key must match Multer's field name

  try {
    const response = await apiClient.patch('/users/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Upload Profile Picture API error:', error);
    const backendErrorMessage = error.response?.data?.message || error.response?.data?.errors?.[0]?.message;
    throw new Error(backendErrorMessage || error.message || 'Failed to upload profile picture.');
  }
};


const userService = {
  updateMyProfile,
  uploadProfilePicture,
};

export default userService;
