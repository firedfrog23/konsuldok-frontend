import React from 'react';

/**
 * Simple loading spinner component.
 * @param {object} props
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='md'] - Spinner size.
 * @param {'primary'|'secondary'|'accent'|'neutral'|'info'|'success'|'warning'|'error'} [props.color='primary'] - Spinner color.
 * @param {string} [props.className] - Additional CSS classes.
 */
const Spinner = ({ size = 'md', color = 'primary', className = '' }) => {
	const sizeClasses = {
		xs: 'loading-xs',
		sm: 'loading-sm',
		md: 'loading-md',
		lg: 'loading-lg',
	};
	return (
		<span
		className={`loading loading-spinner text-${color} ${sizeClasses[size]} ${className}`}
		role="status" // Accessibility: indicate loading status
		aria-live="polite"
		aria-label="Loading"
		></span>
	);
};

export default Spinner;