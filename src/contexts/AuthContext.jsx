// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/auth.service.js';
import { useNotification } from './NotificationContext.jsx'; // Ensure .jsx extension

/**
 * Provides authentication state and functions.
 * Notifications dispatched from here will use the themed colors defined in NotificationContext.
 * - 'success'/'info' notifications: Blue background, White text.
 * - 'error' notifications: Black background, White text.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { addNotification } = useNotification();

    const loadUser = useCallback(async () => {
        setIsLoading(true); // Ensure loading is true at the start
        try {
            const currentUser = await authService.getMe();
            if (currentUser) {
                setUser(currentUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            // Don't show notification for initial load user failure, as it's a common scenario (not logged in)
            // console.error("AuthContext: Failed to load user:", error.message);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []); // Removed addNotification as it's not used here

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        try {
            const { user: loggedInUser } = await authService.login(email, password);
            setUser(loggedInUser);
            setIsAuthenticated(true);
            addNotification('Login successful!', 'success'); // Uses themed success (Blue BG)
            setIsLoading(false);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            setIsAuthenticated(false);
            addNotification(`Login failed: ${error.message || 'Invalid credentials'}`, 'error'); // Uses themed error (Black BG)
            setIsLoading(false);
            return false;
        }
    }, [addNotification]);

    const register = useCallback(async (userData) => {
        setIsLoading(true);
        try {
            const { user: registeredUser } = await authService.register(userData);
            setUser(registeredUser);
            setIsAuthenticated(true);
            addNotification('Registration successful! Welcome.', 'success'); // Uses themed success (Blue BG)
            setIsLoading(false);
            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            addNotification(`Registration failed: ${error.message || 'Could not create account.'}`, 'error'); // Uses themed error (Black BG)
            setIsLoading(false);
            return false;
        }
    }, [addNotification]);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.logout();
        } catch(error) {
            console.error("Backend logout failed:", error);
            // Still proceed with client-side logout
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            addNotification('Logout successful.', 'info'); // Uses themed info (Blue BG)
            setIsLoading(false);
        }
    }, [addNotification]);

    const updateUserInContext = useCallback((updatedUserData) => {
        setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
    }, []);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        loadUser,
        updateUserInContext
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
