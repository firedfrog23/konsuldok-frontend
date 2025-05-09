/* eslint-disable no-useless-escape */
import React from 'react';

/**
 * Reusable Input Field component.
 * @param {object} props
 * @param {string} props.id - Input ID.
 * @param {string} props.label - Input label text.
 * @param {string} [props.type='text'] - Input type (text, email, password, etc.).
 * @param {string} props.value - Controlled input value.
 * @param {(e: React.ChangeEvent<HTMLInputElement>) => void} props.onChange - Input change handler.
 * @param {string} [props.placeholder] - Input placeholder.
 * @param {string} [props.error] - Error message to display.
 * @param {boolean} [props.required=false] - Mark input as required.
 * @param {boolean} [props.disabled=false] - Disable input.
 * @param {string} [props.className] - Additional CSS classes for the wrapper div.
 * @param {'primary'|'secondary'|'accent'|'info'|'success'|'warning'|'error'} [props.color='primary'] - Border/focus color.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} [props.rest] - Other standard input attributes.
 */
const InputField = ({
	id,
	label,
	type = 'text',
	value,
	onChange,
	placeholder,
	error,
	required = false,
	disabled = false,
	className = '',
	color = 'primary',
	...rest
	}) => {
	const inputClasses = `input input-bordered w-full input-<span class="math-inline">\{color\} focus\:ring\-</span>{color}/30 focus:border-${color} focus:ring ${error ? `input-error border-error` : ''}`;

	return (
		<div className={`form-control w-full ${className}`}>
		<label htmlFor={id} className="label mb-1">
			<span className={`label-text ${error ? 'text-error' : 'text-base-content'} font-medium`}>
				{label} {required && <span className="text-error">*</span>}
			</span>
		</label>
		<input
			id={id}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			required={required}
			disabled={disabled}
			className={inputClasses}
			aria-invalid={!!error} // Accessibility: indicate invalid input
			aria-describedby={error ? `${id}-error` : undefined}
			{...rest}
		/>
		{error && (
			<label className="label" id={`${id}-error`}>
			<span className="label-text-alt text-error">{error}</span>
			</label>
		)}
		</div>
	);
};

export default InputField;