// src/components/common/Alert.jsx
import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline'; // Assuming XMarkIcon is used for close

/**
 * Reusable Alert component, styled according to the 3-color palette via DaisyUI theme.
 * - 'info' & 'success' alerts: Blue background, White text.
 * - 'warning' & 'error' alerts: Black background, White text.
 * - Close button text color adapts to the alert's content color.
 *
 * @param {object} props - Component props.
 * @param {'info'|'success'|'warning'|'error'} props.type - Alert type (maps to DaisyUI themed colors).
 * @param {React.ReactNode} props.children - Alert message content.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {() => void} [props.onClose] - Optional close handler.
 */
const Alert = ({ type, children, className = '', onClose }) => {
    // DaisyUI alert classes are themed in index.css:
    // alert-info & alert-success -> var(--color-primary) BG, var(--color-primary-content) text
    // alert-warning & alert-error -> var(--color-neutral) BG, var(--color-neutral-content) text (or var(--color-error) which is black)
    const alertClasses = `alert alert-${type} shadow-md ${className}`;

    // Determine text color for the close button based on the alert type for contrast
    // DaisyUI alert-*-content classes are not standard, so we check the type.
    // Primary and Neutral content colors are White in the theme.
    const closeButtonTextColorClass = (type === 'info' || type === 'success') ? 'text-primary-content' : 'text-neutral-content';


    return (
        <div role="alert" className={alertClasses}>
            {/* Children will inherit text color from alert-type (e.g., alert-info-content) */}
            <span>{children}</span>
            {onClose && (
                <button
                    className={`btn btn-ghost btn-sm btn-circle ${closeButtonTextColorClass} hover:bg-white/20`} // Ensure hover has some contrast
                    onClick={onClose}
                    aria-label="Close alert"
                >
                   <XMarkIcon className="w-5 h-5"/> {/* Using XMarkIcon from Heroicons */}
                </button>
            )}
        </div>
    );
};

export default Alert;
