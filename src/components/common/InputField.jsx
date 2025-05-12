// src/components/common/InputField.jsx
import React from 'react';

/**
 * Reusable Input Field component. Adheres to strict 3-color palette.
 * - Uses DaisyUI `input input-bordered` which is themed to White BG, Black text/border.
 * - Focus state is themed to use Blue outline/ring.
 * - Error state uses a Blue border for clear visual indication.
 * - Labels and error messages use Black and Blue text respectively.
 *
 * @param {object} props - Component props.
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
    // color prop removed as styling is now driven by theme and error state
    ...rest
}) => {
    // Base classes from DaisyUI, themed in index.css (White BG, Black border/text, Blue focus)
    // Error class adds a Blue border and ring for clear error indication.
    const inputClasses = `input input-bordered bg-base-100 border-black/15 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${error ? 'border-primary ring-1 ring-primary' : 'border-black/15'}`;

    return (
        <div className={`form-control w-full ${className}`}>
            <label htmlFor={id} className="label pb-1">
                {/* Label text is Black. Required asterisk is Blue. */}
                <span className={`label-text ${error ? 'text-primary' : 'text-base-content'} font-medium`}>
                    {label} {required && <span className="text-primary">*</span>}
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
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...rest}
            />
            {/* Error message text is Blue */}
            {error && (
                <label className="label" id={`${id}-error`}>
                    <span className="label-text-alt text-primary">{error}</span>
                </label>
            )}
        </div>
    );
};

export default InputField;
