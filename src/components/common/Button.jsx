import React from 'react';
import Spinner from './Spinner';

/**
 * Reusable Button component integrated with DaisyUI btn classes.
 * @param {object} props
 * @param {React.ReactNode} props.children - Button content.
 * @param {'primary'|'secondary'|'accent'|'neutral'|'info'|'success'|'warning'|'error'|'ghost'|'link'} [props.variant='primary'] - Button style variant.
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='md'] - Button size.
 * @param {boolean} [props.outline=false] - Use outline style.
 * @param {boolean} [props.loading=false] - Show loading spinner.
 * @param {boolean} [props.disabled=false] - Disable button.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} [props.rest] - Other standard button attributes.
 */
const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	outline = false,
	loading = false,
	disabled = false,
	className = '',
	...rest
	}) => {
	const btnClasses = `btn btn-${size} ${
		outline ? `btn-outline btn-${variant}` : `btn-${variant}`
	} ${className}`;

	const isDisabled = disabled || loading;

	return (
		<button className={btnClasses} disabled={isDisabled} {...rest}>
		{loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} color="currentColor" /> : children}
		</button>
	);
};

export default Button;