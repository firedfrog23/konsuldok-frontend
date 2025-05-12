// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.jsx'; // Ensure .jsx extension

/**
 * Custom hook to access authentication context.
 * This hook itself does not have direct UI implications regarding the 3-color palette,
 * but it provides data used by UI components which should adhere to the standards.
 *
 * @returns {import('../contexts/AuthContext.jsx').AuthContextType} Auth context values.
 * @throws {Error} If used outside of AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default useAuth;
