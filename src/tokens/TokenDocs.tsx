import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Button } from '../components/Button';
import styles from './TokenDocs.module.css';
import { tokensWithPrefix, tokenValue } from './tokens';
import type { Token } from './tokens';

/** A list of tokens: name, declared value, and a live sample drawn with `var(--token)`. */
function TokenList({ list, sample }: { list: Token[]; sample: (token: Token) => ReactNode }) {
  return (
    <div className={styles.list}>
      {list.map((token) => (
        <div key={token.name} style={{ display: 'contents' }}>
          <code className={styles.name}>{token.name}</code>
          <span className={styles.value}>{token.value}</span>
          <div className={styles.sample}>{sample(token)}</div>
        </div>
      ))}
    </div>
  );
}

const cssVar = (token: Token) => `var(${token.name})`;

/** A square (or circle) whose side is the token. */
function sizeSample(token: Token, shape: 'square' | 'circle') {
  return <div className={styles[shape]} style={{ width: cssVar(token), height: cssVar(token) }} />;
}

export function SpacingScale() {
  return (
    <TokenList
      list={tokensWithPrefix('--space-')}
      sample={(token) => <div className={styles.bar} style={{ width: cssVar(token) }} />}
    />
  );
}

export function RadiusSamples() {
  return (
    <TokenList
      list={tokensWithPrefix('--radius-')}
      sample={(token) => (
        <div className={styles.radiusBox} style={{ borderRadius: cssVar(token) }} />
      )}
    />
  );
}

export function ControlSizes() {
  return (
    <TokenList
      list={tokensWithPrefix('--control-')}
      sample={(token) =>
        token.name.startsWith('--control-height-') ? (
          <div className={styles.control} style={{ height: cssVar(token) }} />
        ) : (
          sizeSample(token, 'square')
        )
      }
    />
  );
}

export function AvatarSizes() {
  return (
    <TokenList
      list={tokensWithPrefix('--avatar-size-', '--avatar-indicator-size-')}
      sample={(token) => sizeSample(token, 'circle')}
    />
  );
}

export function ElevationSamples() {
  return (
    <TokenList
      list={tokensWithPrefix('--shadow-')}
      sample={(token) => <div className={styles.shadowBox} style={{ boxShadow: cssVar(token) }} />}
    />
  );
}

/** Weights and line heights, shown on the same sample sentence. */
export function TypeProperties({ sampleText }: { sampleText: string }) {
  const style = (token: Token): CSSProperties =>
    token.name.startsWith('--weight-')
      ? { fontWeight: cssVar(token) }
      : token.name.startsWith('--leading-')
        ? { lineHeight: cssVar(token) }
        : { fontFamily: cssVar(token) };

  return (
    <TokenList
      list={tokensWithPrefix('--font-', '--weight-', '--leading-')}
      sample={(token) => (
        <span className={styles.typeSample} style={style(token)}>
          {sampleText}
        </span>
      )}
    />
  );
}

function DurationSample({ token }: { token: Token }) {
  const [atEnd, setAtEnd] = useState(false);
  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        aria-label={`Play ${token.name}`}
        onClick={() => setAtEnd(!atEnd)}
      >
        Play
      </Button>
      <div className={styles.track}>
        <div
          className={[styles.dot, atEnd ? styles.dotEnd : undefined].filter(Boolean).join(' ')}
          style={{ transitionDuration: cssVar(token) }}
        />
      </div>
    </>
  );
}

/** Each duration moves a dot across a track, eased with `--ease-out`. */
export function MotionDurations() {
  return (
    <TokenList
      list={tokensWithPrefix('--duration-')}
      sample={(token) => <DurationSample token={token} />}
    />
  );
}

/** The easing curve, plotted from the control points declared in tokens.css. */
export function EasingCurves() {
  return (
    <TokenList
      list={tokensWithPrefix('--ease-')}
      sample={(token) => {
        const points = tokenValue(token.name).match(/-?\d*\.?\d+/g)?.map(Number);
        if (!points || points.length !== 4) return null;
        const [x1, y1, x2, y2] = points.map((point) => point * 100);
        return (
          <svg
            className={styles.curve}
            viewBox="0 0 100 100"
            role="img"
            aria-label={`Curve of ${token.name}: time left to right, progress bottom to top`}
          >
            <path
              d={`M0 100 C ${x1} ${100 - y1}, ${x2} ${100 - y2}, 100 0`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        );
      }}
    />
  );
}
