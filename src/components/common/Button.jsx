// src/components/common/Button.jsx
import React from 'react';
import Spinner from './Spinner'; // Assuming Spinner is in the same directory

/**
 * Reusable Button component integrated with DaisyUI btn classes.
 * Relies on the 3-color palette defined in the DaisyUI theme (index.css).
 * - 'primary' & 'accent': Blue background, White text.
 * - 'secondary' & 'neutral': Black background, White text.
 * - 'info', 'success': Blue background, White text.
 * - 'warning', 'error': Black background, White text.
 * - 'ghost': Transparent background, Black text (adapts based on context).
 * - 'link': Styled as text, color depends on context (usually primary - Blue).
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Button content.
 * @param {'primary'|'secondary'|'accent'|'neutral'|'info'|'success'|'warning'|'error'|'ghost'|'link'} [props.variant='primary'] - Button style variant.
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='md'] - Button size.
 * @param {boolean} [props.outline=false] - Use outline style. Outline buttons will use the variant color for border/text.
 * @param {boolean} [props.loading=false] - Show loading spinner. Spinner color inherits button text color.
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
    // DaisyUI button classes are themed in index.css.
    // e.g., btn-primary uses var(--color-primary) and var(--color-primary-content).
    const btnClasses = `btn btn-${size} ${
        outline ? `btn-outline btn-${variant}` : `btn-${variant}`
    } ${className}`;

    const isDisabled = disabled || loading;

    return (
        <button className={btnClasses} disabled={isDisabled} {...rest}>
            {/* Spinner color is 'currentColor', inheriting the button's text color */}
            {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} color="currentColor" /> : children}
        </button>
    );
};

export default Button;
