import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import styles from './TextField.module.css';

/** Native `size` (width in characters) is replaced by the design-system size. */
type NativeInputProps = Omit<ComponentPropsWithRef<'input'>, 'size'>;

export type TextFieldProps = NativeInputProps & {
  /** Visible label. Required: a placeholder is never a replacement. */
  label: string;
  /** Helper text below the input. */
  hint?: string;
  /** Puts the field in the error state and replaces the hint. Say how to fix it. */
  error?: string;
  size?: 'sm' | 'md';
  /**
   * Show " *" on the label when `required`. Set false in forms where most
   * fields are required and the optional ones are marked instead.
   */
  requiredMark?: boolean;
};

function ErrorIcon() {
  return (
    <svg className={styles.errorIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.75v3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function TextField({
  label,
  hint,
  error,
  size = 'md',
  requiredMark = true,
  id: idProp,
  className,
  required,
  'aria-describedby': describedByProp,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  // Error replaces hint, so at most one message is rendered and described.
  const messageId = error ? errorId : hint ? hintId : undefined;
  const describedBy = [describedByProp, messageId].filter(Boolean).join(' ') || undefined;

  const fieldClasses = [styles.field, className].filter(Boolean).join(' ');
  const inputClasses = [styles.input, size === 'sm' ? styles.sm : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={fieldClasses}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {/* Visual only: native `required` already tells screen readers. */}
        {required && requiredMark ? <span aria-hidden="true"> *</span> : null}
      </label>
      <input
        {...rest}
        id={id}
        className={inputClasses}
        required={required}
        aria-invalid={error ? true : rest['aria-invalid']}
        aria-describedby={describedBy}
      />
      {error ? (
        <p className={styles.error} id={errorId}>
          <ErrorIcon />
          {error}
        </p>
      ) : hint ? (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
