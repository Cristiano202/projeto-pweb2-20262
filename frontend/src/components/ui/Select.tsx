import { useId, type SelectHTMLAttributes } from 'react';
import './Select.css';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export function Select({
  label,
  options,
  placeholder,
  error,
  helperText,
  id,
  required,
  className = '',
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const classes = [
    'ui-select__field',
    error ? 'ui-select__field--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ui-select-group">
      {label && (
        <label htmlFor={selectId} className="ui-select__label">
          {label}
          {required && <span className="ui-select__required" aria-hidden="true">*</span>}
        </label>
      )}

      <select
        id={selectId}
        className={classes}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <span id={errorId} className="ui-select__error" role="alert">{error}</span>
      ) : helperText ? (
        <span id={helperId} className="ui-select__helper">{helperText}</span>
      ) : null}
    </div>
  );
}
