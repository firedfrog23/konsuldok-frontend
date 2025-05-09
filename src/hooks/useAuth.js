import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to access authentication context.
 * @returns {import('../contexts/AuthContext').AuthContextType} Auth context values.
 * @throws {Error} If used outside of AuthProvider.
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};