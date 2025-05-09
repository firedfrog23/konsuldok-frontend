import React from 'react';

/**
 * Reusable Alert component.
 * @param {object} props
 * @param {'info'|'success'|'warning'|'error'} props.type - Alert type (maps to color).
 * @param {React.ReactNode} props.children - Alert message content.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {() => void} [props.onClose] - Optional close handler.
 */
const Alert = ({ type, children, className = '', onClose }) => {
    const alertClasses = `alert alert-${type} shadow-md ${className}`;
    return (
        <div role="alert" className={alertClasses}>
            <span>{children}</span>
            {onClose && (
                <button
                    className="btn btn-ghost btn-sm btn-circle"
                    onClick={onClose}
                    aria-label="Close alert"
                >✕</button>
            )}
        </div>
    );
};

export default Alert;