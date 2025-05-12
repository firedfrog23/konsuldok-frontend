// src/components/common/Spinner.jsx
import React from 'react';

/**
 * Simple loading spinner component using DaisyUI classes.
 * The color of the spinner is determined by Tailwind text color utility passed via `color` prop,
 * which should align with the 3-color palette.
 * - `text-primary` for Blue spinner.
 * - `text-base-content` or `text-neutral` for Black spinner.
 * - `text-primary-content` or `text-neutral-content` for White spinner (if on dark BG).
 * - `currentColor` can be used if the parent element has the desired text color.
 *
 * @param {object} props - Component props.
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='md'] - Spinner size.
 * @param {string} [props.color='primary'] - Spinner color class (e.g., 'primary', 'base-content').
 * Corresponds to DaisyUI/Tailwind text color utilities.
 * @param {string} [props.className] - Additional CSS classes.
 */
const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
    const sizeClasses = {
        xs: 'loading-xs',
        sm: 'loading-sm',
        md: 'loading-md',
        lg: 'loading-lg',
    };

    // The text-${color} class will apply the themed color.
    // e.g., text-primary will be Blue, text-base-content will be Black.
    return (
        <span
            className={`loading loading-spinner text-${color} ${sizeClasses[size]} ${className}`}
            role="status"
            aria-live="polite"
            aria-label="Loading"
        ></span>
    );
};

export default Spinner;
