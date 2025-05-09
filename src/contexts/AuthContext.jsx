// src/contexts/AuthContext.js
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import authService from '../services/auth.services';
import { useNotification } from './NotificationContext';
// Assume token utils exist if using localStorage
// import { getToken, setToken, clearToken } from '../utils/localStorage';

const AuthContext = createContext(null);

/**
 * Provides authentication state and functions.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // Stores user object { id, email, role, firstName, lastName, profile? }
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true); // Start loading initially to check for existing session
	const { addNotification } = useNotification();

	/**
	 * Fetches the current user profile if authenticated.
	 * Ideally called on initial load and after login/register.
	 */
	const loadUser = useCallback(async () => {
		// Check if token exists (e.g., from localStorage or httpOnly cookie handled by server)
		// const token = getToken();
		// For simplicity, we assume backend handles cookie/session or interceptor adds token.
		// If we have ways to check client-side, do it here. Let's assume check via /me endpoint.
		try {
		const currentUser = await authService.getMe();
		if (currentUser) {
			setUser(currentUser);
			setIsAuthenticated(true);
			console.log("User loaded:", currentUser.email);
		} else {
			throw new Error("No user data returned");
		}
		} catch (error) {
		console.error("Failed to load user:", error.message);
		setUser(null);
		setIsAuthenticated(false);
		// clearToken(); // Clear invalid token if stored client-side
		} finally {
		setIsLoading(false);
		}
	}, []);

	// Initial load check
	useEffect(() => {
		loadUser();
	}, [loadUser]);

	/**
	 * Logs in the user.
	 * @param {string} email - User's email.
	 * @param {string} password - User's password.
	 * @returns {Promise<boolean>} True on success, false on failure.
	 */
	const login = useCallback(async (email, password) => {
		setIsLoading(true);
		try {
		const { user: loggedInUser /*, accessToken */ } = await authService.login(email, password);
		// if (accessToken) setToken(accessToken); // Store token if needed client-side
		setUser(loggedInUser);
		setIsAuthenticated(true);
		addNotification('Login successful!', 'success');
		setIsLoading(false);
		return true;
		} catch (error) {
		console.error("Login failed:", error);
		setUser(null);
		setIsAuthenticated(false);
		addNotification(`Login failed: ${error.message}`, 'error');
		setIsLoading(false);
		return false;
		}
	}, [addNotification]);

	/**
	 * Registers a new user.
	 * @param {object} userData - User registration data.
	 * @returns {Promise<boolean>} True on success, false on failure.
	 */
	const register = useCallback(async (userData) => {
		setIsLoading(true);
		try {
		const { user: registeredUser /*, accessToken */ } = await authService.register(userData);
		// if (accessToken) setToken(accessToken); // Store token if needed client-side
		setUser(registeredUser);
		setIsAuthenticated(true);
		addNotification('Registration successful!', 'success');
		setIsLoading(false);
		return true;
		} catch (error) {
		console.error("Registration failed:", error);
		addNotification(`Registration failed: ${error.message}`, 'error');
		setIsLoading(false);
		return false;
		}
	}, [addNotification]);

	/**
	 * Logs out the user.
	 */
	const logout = useCallback(async () => {
		setIsLoading(true);
		try {
		await authService.logout(); // Call backend logout if necessary (e.g., invalidate refresh token)
		} catch(error) {
		console.error("Backend logout failed:", error);
		// Proceed with client-side logout anyway
		} finally {
		// clearToken(); // Clear client-side token
		setUser(null);
		setIsAuthenticated(false);
		addNotification('Logout successful.', 'info');
		setIsLoading(false);
		// Redirect handled by component or ProtectedRoute
		}
	}, [addNotification]);

	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		logout,
		loadUser // Expose loadUser if needed for manual refresh
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to consume the AuthContext.
 * @returns {{ user: object|null, isAuthenticated: boolean, isLoading: boolean, login: Function, register: Function, logout: Function, loadUser: Function }} Auth context value.
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};