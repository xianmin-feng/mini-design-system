import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import styles from './Button.module.css';

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children'>;

type BaseProps = NativeButtonProps & {
  /** Visual style. One `primary` per view; `danger` only for destructive actions. */
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  /** Shows a spinner in the icon slot, sets `aria-busy`, and ignores clicks. */
  loading?: boolean;
  /** Decorative icon before the label. Hidden from assistive tech. */
  iconLeft?: ReactNode;
};

/**
 * Either the button has a visible label (children), or it is icon-only and
 * must carry an `aria-label`. TypeScript rejects an icon-only button without one.
 */
type LabelProps =
  | { children: ReactNode }
  | { children?: never; 'aria-label': string };

export type ButtonProps = BaseProps & LabelProps;

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  type = 'button',
  className,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      // Also stops a type="submit" button from submitting its form mid-request.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  const classes = [
    styles.button,
    styles[variant],
    size === 'sm' ? styles.sm : undefined,
    loading ? styles.loading : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const leading = loading ? <span className={styles.spinner} /> : iconLeft;

  return (
    <button
      {...rest}
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      onClick={handleClick}
    >
      {leading ? (
        <span className={styles.icon} aria-hidden="true">
          {leading}
        </span>
      ) : null}
      {children}
    </button>
  );
}
