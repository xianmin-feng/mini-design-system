import { useId } from 'react';
import type { ComponentPropsWithRef } from 'react';
import styles from './RadioGroup.module.css';

export type RadioOption = {
  value: string;
  /** Short name of the choice. This alone is the radio's accessible name. */
  label: string;
  /** One sentence explaining the choice. Give one to every option or to none. */
  description?: string;
  /** Disables this option only. */
  disabled?: boolean;
};

type NativeFieldsetProps = Omit<
  ComponentPropsWithRef<'fieldset'>,
  'children' | 'onChange' | 'defaultValue'
>;

export type RadioGroupProps = NativeFieldsetProps & {
  /** Visible group label, rendered as the `<legend>`. Name the thing being chosen ("Role"). */
  label: string;
  /** 2 to 5 options, in display order. */
  options: readonly RadioOption[];
  /** Controlled: the selected option's value. */
  value?: string;
  /** Uncontrolled: the initially selected value. Preselect only a safe default. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Form field name. Generated when omitted. */
  name?: string;
  /** Helper text below the options. */
  hint?: string;
  /** Puts the group in the error state and replaces the hint. Say how to fix it. */
  error?: string;
  /** A choice must be made before submit. */
  required?: boolean;
  /**
   * Show " *" on the label when `required`. Set false in forms where most
   * fields are required and the optional ones are marked instead.
   */
  requiredMark?: boolean;
};

/** Same glyph as TextField's error icon, so errors look alike across fields. */
function ErrorIcon() {
  return (
    <svg className={styles.errorIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.75v3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="11" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function RadioGroup({
  label,
  options,
  value,
  defaultValue,
  onChange,
  name: nameProp,
  hint,
  error,
  required,
  requiredMark = true,
  className,
  'aria-describedby': describedByProp,
  ...rest
}: RadioGroupProps) {
  const baseId = useId();
  const name = nameProp ?? baseId;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;

  // Error replaces hint, so at most one message is rendered and described.
  const messageId = error ? errorId : hint ? hintId : undefined;
  const describedBy = [describedByProp, messageId].filter(Boolean).join(' ') || undefined;

  const groupClasses = [styles.group, className].filter(Boolean).join(' ');
  const isControlled = value !== undefined;

  return (
    <fieldset {...rest} className={groupClasses} aria-describedby={describedBy}>
      <legend className={styles.legend}>
        {label}
        {/* Visual only: native `required` already tells screen readers. */}
        {required && requiredMark ? <span aria-hidden="true"> *</span> : null}
      </legend>

      <div className={styles.options}>
        {options.map((option, index) => {
          const labelId = `${baseId}-${index}-label`;
          const descriptionId = option.description ? `${baseId}-${index}-description` : undefined;
          // The error is linked to each radio too, so it is read wherever focus lands.
          const optionDescribedBy =
            [descriptionId, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;

          return (
            // The <label> makes the whole row clickable; the name comes from the label text only.
            <label key={option.value} className={styles.option}>
              <input
                type="radio"
                className={styles.radio}
                name={name}
                value={option.value}
                {...(isControlled
                  ? { checked: value === option.value }
                  : { defaultChecked: defaultValue === option.value })}
                onChange={() => onChange?.(option.value)}
                disabled={option.disabled}
                required={required}
                aria-labelledby={labelId}
                aria-describedby={optionDescribedBy}
                aria-invalid={error ? true : undefined}
              />
              <span>
                <span className={styles.optionLabel} id={labelId}>
                  {option.label}
                </span>
                {option.description ? (
                  <span className={styles.optionDescription} id={descriptionId}>
                    {option.description}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

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
    </fieldset>
  );
}
