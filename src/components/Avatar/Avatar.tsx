import { useState } from 'react';
import type { ComponentPropsWithRef } from 'react';
import styles from './Avatar.module.css';

type Status = 'active' | 'away' | 'busy' | 'inactive';

type NativeSpanProps = Omit<ComponentPropsWithRef<'span'>, 'children'>;

export type AvatarProps = NativeSpanProps & {
  /** The person's full name. Gives the accessible label, the initials and the fallback color. */
  name: string;
  /** Photo URL. Falls back to initials when missing or when it fails to load. */
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Presence indicator. Omit for none. */
  status?: Status;
  /** Outer ring, for stacks where avatars overlap. */
  ring?: boolean;
  /** Hide from assistive tech. Set when the name is already shown as text next to the avatar. */
  decorative?: boolean;
};

const tints = [styles.tint1, styles.tint2, styles.tint3, styles.tint4, styles.tint5];

/** A name written only in Chinese, Japanese or Korean characters (spaces allowed). */
const cjkName = /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\s]+$/u;

/**
 * - Default: first letter of the first and last word ("Mia Feng" → "MF", "Mia" → "M").
 * - CJK names: the last two characters ("李小龙" → "小龙", "王芳" → "王芳").
 * - `single` (size sm): one character, so the indicator doesn't crowd it — the first
 *   character of the name, or the last one for CJK names ("李小龙" → "龙").
 */
function getInitials(name: string, single: boolean) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  // Array.from splits by code point, so characters outside the basic plane stay whole.
  const first = Array.from(words[0])[0];
  if (cjkName.test(name)) {
    return Array.from(words.join(''))
      .slice(single ? -1 : -2)
      .join('');
  }
  if (single) return first.toUpperCase();
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : '';
  return (first + last).toUpperCase();
}

/** Same name, same tint, every time. */
function getTint(name: string) {
  let hash = 0;
  for (const char of name.trim().toLowerCase()) {
    hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 1_000_003;
  }
  return tints[hash % tints.length];
}

/** Each status has its own shape, so meaning never relies on color alone. */
function StatusIndicator({ status }: { status: Status }) {
  return (
    <svg
      className={`${styles.indicator} ${styles[status]}`}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      {status === 'inactive' ? (
        // Hollow ring
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="3.5" />
      ) : (
        <circle cx="8" cy="8" r="8" fill="currentColor" />
      )}
      {/* Away: a bite out of the circle leaves a crescent moon. */}
      {status === 'away' ? <circle className={styles.cutout} cx="11" cy="5" r="5.5" /> : null}
      {/* Busy: horizontal bar (minus). */}
      {status === 'busy' ? (
        <rect className={styles.cutout} x="3.5" y="6.5" width="9" height="3" rx="1.5" />
      ) : null}
    </svg>
  );
}

export function Avatar({
  name,
  src,
  size = 'md',
  status,
  ring = false,
  decorative = false,
  className,
  ...rest
}: AvatarProps) {
  // Remember which URL failed, so a new `src` gets a fresh attempt.
  const [failedSrc, setFailedSrc] = useState<string>();
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const showImage = Boolean(src) && src !== failedSrc;
  const photoLoaded = showImage && src === loadedSrc;

  const classes = [styles.avatar, styles[size], ring ? styles.ring : undefined, className]
    .filter(Boolean)
    .join(' ');

  // One accessible name for the whole avatar, e.g. "Mia Feng, busy".
  const accessibility = decorative
    ? { 'aria-hidden': true }
    : { role: 'img', 'aria-label': status ? `${name}, ${status}` : name };

  return (
    <span {...rest} className={classes} {...accessibility}>
      <span className={`${styles.face} ${getTint(name)}`}>
        {/* Initials show while the photo loads and when it fails; a loaded photo hides them. */}
        <span className={photoLoaded ? styles.initialsHidden : undefined} aria-hidden="true">
          {getInitials(name, size === 'sm')}
        </span>
        {showImage ? (
          // alt="": the wrapper already carries the name, so it isn't read twice.
          <img
            className={styles.image}
            src={src}
            alt=""
            onLoad={() => setLoadedSrc(src)}
            onError={() => setFailedSrc(src)}
          />
        ) : null}
      </span>
      {status ? <StatusIndicator status={status} /> : null}
    </span>
  );
}
