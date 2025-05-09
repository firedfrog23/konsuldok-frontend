// src/services/apiClient.js
import axios from 'axios';
// Import utilities for handling tokens if stored locally (example)
// import { getToken, clearToken } from '../utils/localStorage'; // Assuming utils/localStorage.js exists

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use env var or fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Axios Interceptors (High Standard Practice) ---

// Request interceptor: Inject Auth Token
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = getToken(); // Get token from storage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor: Handle common errors (e.g., 401 Unauthorized)
// apiClient.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle unauthorized access - e.g., clear token, redirect to login
//       console.error('Unauthorized access - Redirecting to login');
//       clearToken(); // Clear invalid token
//       // Prevent infinite loops if login page itself causes 401
//       if (window.location.pathname !== '/login') {
//          window.location.href = '/login'; // Force redirect
//       }
//     }
//     // Extract backend error message if available
//     const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
//     // You might want to return a standardized error object here
//     return Promise.reject(new Error(errorMessage)); // Reject with error message
//   }
// );


export default apiClient;