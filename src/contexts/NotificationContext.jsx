import React, { createContext, useCallback, useContext, useState } from 'react';

const NotificationContext = createContext(null);

/**
 * Provides notification state and functions to children components.
 * Manages a list of notifications to be displayed.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]); // { id, message, type: 'success' | 'error' }

	/**
	 * Adds a new notification to the list.
	 * @param {string} message - The message to display.
	 * @param {'success' | 'error'} type - The type of notification.
	 */
	const addNotification = useCallback((message, type = 'info') => {
		const id = Date.now() + Math.random(); // Simple unique ID
		setNotifications((prev) => [...prev, { id, message, type }]);

		// Auto-remove notification after a delay
		setTimeout(() => {
		removeNotification(id);
		}, 5000); // Remove after 5 seconds
	}, []);

	/**
	 * Removes a notification by its ID.
	 * @param {number} id - The ID of the notification to remove.
	 */
	const removeNotification = useCallback((id) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	}, []);

	const value = { notifications, addNotification, removeNotification };

	return (
		<NotificationContext.Provider value={value}>
		{children}
		{/* Render notifications globally */}
		<NotificationList notifications={notifications} onClose={removeNotification} />
		</NotificationContext.Provider>
	);
};

/**
 * Hook to consume the NotificationContext.
 * @returns {{ notifications: Array, addNotification: Function, removeNotification: Function }} Notification context value.
 */
export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error('useNotification must be used within a NotificationProvider');
	}
	return context;
};

// --- Simple Notification Display Component ---

/**
 * Renders the list of notifications.
 * @param {object} props - Component props.
 * @param {Array} props.notifications - List of notification objects.
 * @param {Function} props.onClose - Function to call when closing a notification.
 */
const NotificationList = ({ notifications, onClose }) => {
	if (!notifications.length) return null;

	return (
		<div className="toast toast-end toast-top z-[100]"> {/* DaisyUI toast container */}
		{notifications.map((notification) => (
			<NotificationItem key={notification.id} notification={notification} onClose={onClose} />
		))}
		</div>
	);
};

/**
 * Renders a single notification item.
 * @param {object} props - Component props.
 * @param {object} props.notification - Notification object { id, message, type }.
 * @param {Function} props.onClose - Function to call when closing this notification.
 */
const NotificationItem = ({ notification, onClose }) => {
	const alertTypeClass = {
		success: 'alert-success', // Mapped to Blue in our theme
		error: 'alert-error',     // Mapped to Orange in our theme
		info: 'alert-info',       // Mapped to Blue in our theme
		warning: 'alert-warning', // Mapped to Orange in our theme
	}[notification.type] || 'alert-info'; // Default to info (blue)

	return (
		<div className={`alert ${alertTypeClass} shadow-lg text-sm`}>
		<span className="text-primary-content">{notification.message}</span> {/* Use primary-content (white) */}
		<button
			aria-label="Close notification"
			className="btn btn-xs btn-ghost hover:bg-white/20 text-primary-content"
			onClick={() => onClose(notification.id)}
		>
			✕
		</button>
		</div>
	);
};