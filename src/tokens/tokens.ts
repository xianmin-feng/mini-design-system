// Reads the design tokens straight out of tokens.css, so docs never repeat a value.
import css from './tokens.css?raw';

export type Token = {
  /** Custom property name, e.g. `--color-primary`. */
  name: string;
  /** Declared value, e.g. `#5b4cdb`. */
  value: string;
};

// Only the main :root block: what follows the first @media is overrides, not new tokens.
const mainBlock = css.split('@media')[0].replace(/\/\*[\s\S]*?\*\//g, '');

/** Every token, in the order it is declared in tokens.css. */
export const tokens: Token[] = Array.from(
  mainBlock.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g),
  ([, name, value]) => ({ name, value: value.trim() }),
);

/** Tokens whose name starts with any of the given prefixes. */
export function tokensWithPrefix(...prefixes: string[]): Token[] {
  return tokens.filter((token) => prefixes.some((prefix) => token.name.startsWith(prefix)));
}

/** The declared value of one token (empty string if it doesn't exist). */
export function tokenValue(name: string): string {
  return tokens.find((token) => token.name === name)?.value ?? '';
}

/**
 * Color tokens grouped for the palette. Groups are matched by prefix and the
 * last one catches the rest, so a new color token always shows up somewhere.
 */
export const colorGroups: { title: string; subtitle: string; tokens: Token[] }[] = (() => {
  const rules = [
    { title: 'Surface and text', subtitle: 'Backgrounds and text', prefixes: ['--color-bg', '--color-text'] },
    { title: 'Border', subtitle: 'Dividers and control borders', prefixes: ['--color-border'] },
    { title: 'Primary', subtitle: 'Main actions and focus', prefixes: ['--color-primary', '--color-focus'] },
    { title: 'Avatar tints', subtitle: 'Initials backgrounds', prefixes: ['--avatar-tint-'] },
  ];
  const grouped = rules.map(({ prefixes, ...group }) => ({
    ...group,
    tokens: tokensWithPrefix(...prefixes),
  }));
  const taken = new Set(grouped.flatMap((group) => group.tokens.map((token) => token.name)));
  const rest = tokensWithPrefix('--color-').filter((token) => !taken.has(token.name));
  grouped.splice(3, 0, { title: 'Status', subtitle: 'Danger, success, warning', tokens: rest });
  return grouped.filter((group) => group.tokens.length > 0);
})();

/** `{ '--color-bg': '#ffffff', … }`, the shape the ColorItem doc block expects. */
export function toColorMap(list: Token[]): Record<string, string> {
  return Object.fromEntries(list.map((token) => [token.name, token.value]));
}
