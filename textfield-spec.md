## TextField

Single-line text input with label, optional hint, and error message.

### API

```ts
label: string                 // required — every field has a visible label
hint?: string                 // helper text below the input
error?: string                // when set, field is in error state; replaces hint
size?: 'sm' | 'md'            // default 'md'; matches Button heights
// plus all native <input> attributes (value, onChange, disabled, required, type, placeholder...)
```

`id` is generated with React `useId()` unless one is passed.

### Anatomy & sizing

```
Label            ← --text-sm, medium, --color-text; gap --space-1 to input
[ input       ]  ← height 32 (sm) / 40 (md), padding 0 --space-3,
                   1px --color-border-strong, --radius-md, bg --color-bg,
                   text --text-md (16px avoids iOS zoom-on-focus)
Hint or error    ← --text-sm; gap --space-1 below input
```

- Placeholder: `--color-text-muted`. Placeholder is an example, never a replacement for the label.

### States

| State | Treatment |
|---|---|
| Rest | border `--color-border-strong` |
| Hover | border `--color-text-muted` |
| Focus | border `--color-primary` + 2px outline `--color-focus`, offset 1px. Uses `:focus` (not `:focus-visible`) — a text field shows focus on click too, because the user is about to type. |
| Error | border `--color-danger`; error text `--color-danger` with a small error icon (never color alone). Focus ring stays `--color-focus`. |
| Disabled | bg `--color-bg-subtle`, text `--color-text-muted`, `cursor: not-allowed`, native `disabled`. |

Transitions: border color, `--duration-fast` `--ease-out`.

### Accessibility

- `<label htmlFor={id}>` tied to the input — clicking the label focuses the input.
- Hint and error rendered with their own ids and linked via `aria-describedby`, so screen readers read them after the label.
- Error state sets `aria-invalid="true"`.
- Required uses native `required`; label shows required marking (see Usage).
- Error icon is decorative (`aria-hidden="true"`); the text carries the meaning.

### Usage rules (also go into AGENTS.md)

- Always pass a `label`. If the design hides it visually, it still exists for screen readers.
- Mark the minority: if most fields are required, mark optional ones with "(optional)"; otherwise mark required ones with "*".
- Show errors on blur or on submit, never while the user is still typing.
- Error text says how to fix it: "Enter an email like name@company.com", not "Invalid input".

### Stories to build

Default · With hint · Required · Optional · Error · Disabled · Filled · Small · In a form (two fields + primary Button)
