import { useId, type InputHTMLAttributes } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  id,
  required,
  className = '',
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const fieldClasses = [
    'ui-input__field',
    error ? 'ui-input__field--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ui-input-group">
      {label && (
        <label htmlFor={inputId} className="ui-input__label">
          {label}
          {required && (
            <span className="ui-input__required" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        className={fieldClasses}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...rest}
      />

      {error ? (
        <span id={errorId} className="ui-input__error" role="alert">
          {error}
        </span>
      ) : (
        helperText && (
          <span id={helperId} className="ui-input__helper">
            {helperText}
          </span>
        )
      )}
    </div>
  );
}