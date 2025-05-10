// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/auth.service.js';
import { useNotification } from './NotificationContext.jsx';

const AuthContext = createContext(null);

/**
 * Provides authentication state and functions.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  const loadUser = useCallback(async () => {
    // console.log("AuthContext: Attempting to load user...");
    try {
      const currentUser = await authService.getMe();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
        // console.log("AuthContext: User loaded:", currentUser.email);
      } else {
        // This case means getMe returned null (e.g. 401 or no data)
        // console.log("AuthContext: No user data returned from getMe, setting unauthenticated.");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("AuthContext: Failed to load user:", error.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      // console.log("AuthContext: loadUser finished, isLoading:", false, "isAuthenticated:", isAuthenticated);
    }
  }, [/* Removed isAuthenticated from dependencies to avoid loop on initial set */]);


  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email, password) => { /* ... (keep existing login logic) ... */
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.login(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      addNotification('Login successful!', 'success'); // Success is Blue
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      addNotification(`Login failed: ${error.message || 'Invalid credentials'}`, 'error'); // Error is Orange
      setIsLoading(false);
      return false;
    }
  }, [addNotification]);

  const register = useCallback(async (userData) => { /* ... (keep existing register logic) ... */
    setIsLoading(true);
    try {
      const { user: registeredUser } = await authService.register(userData);
      setUser(registeredUser);
      setIsAuthenticated(true);
      addNotification('Registration successful! Welcome.', 'success'); // Success is Blue
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      addNotification(`Registration failed: ${error.message || 'Could not create account.'}`, 'error'); // Error is Orange
      setIsLoading(false);
      return false;
    }
  }, [addNotification]);

  const logout = useCallback(async () => { /* ... (keep existing logout logic) ... */
    setIsLoading(true);
    try {
      await authService.logout();
    } catch(error) {
       console.error("Backend logout failed:", error);
    } finally {
       setUser(null);
       setIsAuthenticated(false);
       addNotification('Logout successful.', 'info'); // Info is Blue
       setIsLoading(false);
    }
  }, [addNotification]);

  /**
   * Updates the user object in the context.
   * Useful after profile updates.
   * @param {object} updatedUserData - The new user data.
   */
  const updateUserInContext = useCallback((updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }));
    // If critical auth-related fields change (like role), you might need to re-verify or re-issue token,
    // but for typical profile updates (name, phone), just updating the local user object is often sufficient.
  }, []);


  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    loadUser,
    updateUserInContext // --- ADDED ---
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to consume the AuthContext.
 */
export const useAuth = () => { /* ... (keep existing useAuth logic) ... */
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};