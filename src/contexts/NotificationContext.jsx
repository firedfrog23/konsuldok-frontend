// src/contexts/NotificationContext.jsx
import React, { createContext, useCallback, useContext, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // For close button

const NotificationContext = createContext(null);

/**
 * Provides notification state and functions.
 * Manages a list of notifications to be displayed globally.
 * Notifications adhere to the 3-color palette.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 */
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const value = { notifications, addNotification, removeNotification };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationList notifications={notifications} onClose={removeNotification} />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// --- Notification Display Components ---

/**
 * Renders the list of notifications using DaisyUI toast.
 * @param {object} props - Component props.
 * @param {Array} props.notifications - List of notification objects.
 * @param {Function} props.onClose - Function to call when closing a notification.
 */
const NotificationList = ({ notifications, onClose }) => {
    if (!notifications.length) return null;

    return (
        // DaisyUI toast container, positioned top-end, high z-index
        <div className="toast toast-end toast-top z-[100]">
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onClose={onClose} />
            ))}
        </div>
    );
};

/**
 * Renders a single notification item.
 * Adheres to 3-color palette:
 * - 'success' & 'info': Blue background (primary), White text (primary-content).
 * - 'error' & 'warning': Black background (neutral), White text (neutral-content).
 *
 * @param {object} props - Component props.
 * @param {object} props.notification - Notification object { id, message, type }.
 * @param {Function} props.onClose - Function to call when closing this notification.
 */
const NotificationItem = ({ notification, onClose }) => {
    // Determine alert class based on type, mapping to themed colors.
    // var(--color-primary) is Blue. var(--color-neutral) is Black.
    // var(--color-primary-content) and var(--color-neutral-content) are White.
    const alertTypeClass = {
        success: 'alert-primary', // Uses --color-primary (Blue)
        error: 'alert-neutral',   // Uses --color-neutral (Black)
        info: 'alert-primary',    // Uses --color-primary (Blue)
        warning: 'alert-neutral', // Uses --color-neutral (Black)
    }[notification.type] || 'alert-primary'; // Default to info (Blue)

    // Determine text color for the message and close button based on the alert type
    const contentColorClass = (notification.type === 'success' || notification.type === 'info') ?
        'text-primary-content' : // White text for Blue background
        'text-neutral-content';   // White text for Black background

    return (
        // Alert class provides background from theme (e.g., alert-primary gives Blue BG)
        <div className={`alert ${alertTypeClass} shadow-lg text-sm`}>
            {/* Message text color is set by contentColorClass */}
            <span className={contentColorClass}>{notification.message}</span>
            <button
                aria-label="Close notification"
                // Close button text color matches content, hover provides subtle feedback
                className={`btn btn-xs btn-ghost hover:bg-white/20 ${contentColorClass}`}
                onClick={() => onClose(notification.id)}
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};
