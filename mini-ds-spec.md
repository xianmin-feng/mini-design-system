# Mini Design System — Spec v0.1

Direction: clean, professional, enterprise SaaS. Purple primary, 8px radius, Geist type.
Owner: Mia (design decisions). Implementation partner: Claude Code.

---

## 1. Design tokens

All components use tokens only. No hardcoded colors, sizes, or durations.
Names describe purpose, not appearance (`--color-danger`, not `--red`).

### Color

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page / surface background |
| `--color-bg-subtle` | `#F7F7F8` | Secondary surfaces, hover fills |
| `--color-text` | `#18181B` | Primary text |
| `--color-text-muted` | `#63636B` | Secondary text, hints (passes 4.5:1 on white) |
| `--color-text-on-primary` | `#FFFFFF` | Text on primary / danger fills |
| `--color-border` | `#E4E4E7` | Dividers, card borders (decorative) |
| `--color-border-strong` | `#8E8E96` | Input borders (passes 3:1 on white) |
| `--color-primary` | `#5B4CDB` | Primary actions (white text ≈ 6:1) |
| `--color-primary-hover` | `#4B3CC4` | Primary hover |
| `--color-primary-active` | `#3F31A8` | Primary pressed |
| `--color-primary-subtle` | `#EFEDFD` | Tinted backgrounds, secondary hover |
| `--color-danger` | `#D92D20` | Destructive actions, error text/borders |
| `--color-danger-hover` | `#B42318` | Danger hover / pressed |
| `--color-focus` | `#5B4CDB` | Focus ring |

### Spacing (4px base)

`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` · `--space-5: 20px` · `--space-6: 24px` · `--space-8: 32px`

### Radius

`--radius-sm: 4px` · `--radius-md: 8px` (default) · `--radius-lg: 12px` (cards) · `--radius-full: 9999px`

### Sizing

`--control-height-sm: 32px` · `--control-height-md: 40px` — shared heights for interactive controls (Button, TextField), so they line up in a row.

`--control-indicator-size: 16px` — the box of a selection indicator (the radio in RadioGroup; later checkboxes).

### Typography

- Font: `--font-sans: "Geist", system-ui, sans-serif` (load Geist from Google Fonts)
- Sizes: `--text-xs: 12px` · `--text-sm: 14px` · `--text-md: 16px` · `--text-lg: 20px` · `--text-xl: 24px`
- Weights: `--weight-regular: 400` · `--weight-medium: 500` · `--weight-semibold: 600`
- Line height: `--leading-tight: 1.25` · `--leading-normal: 1.5`

### Elevation

- `--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.06)`
- `--shadow-md: 0 4px 12px rgb(0 0 0 / 0.08)`

### Motion

- `--duration-fast: 120ms` (hover, press) · `--duration-normal: 200ms` (appear, expand) · `--duration-loop: 800ms` (one cycle of a looping indicator, e.g. spinner)
- `--ease-out: cubic-bezier(0.2, 0, 0, 1)`
- Respect `prefers-reduced-motion: reduce` → drop transforms, keep color changes instant. Looping indicators fade (opacity) instead of rotating.

---

## 2. Button

### API

```ts
variant?: 'primary' | 'secondary' | 'danger'   // default 'primary'
size?: 'sm' | 'md'                              // default 'md'
loading?: boolean                               // default false
iconLeft?: ReactNode
// plus all native <button> attributes (disabled, onClick, type...)
```

### Anatomy & sizing

| | sm | md |
|---|---|---|
| Height | `--control-height-sm` (32px) | `--control-height-md` (40px) |
| Horizontal padding | `--space-3` | `--space-4` |
| Font | `--text-sm`, medium | `--text-sm`, medium |
| Icon gap | `--space-2` | `--space-2` |
| Radius | `--radius-md` | `--radius-md` |

### Variants

| | Rest | Hover | Pressed |
|---|---|---|---|
| primary | bg `--color-primary`, text on-primary | `--color-primary-hover` | `--color-primary-active` |
| secondary | bg `--color-bg`, 1px `--color-border-strong`, text `--color-text` | bg `--color-primary-subtle` | bg `--color-primary-subtle`, border `--color-primary` |
| danger | bg `--color-danger`, text on-primary | `--color-danger-hover` | `--color-danger-hover` |

### States

- **Hover:** color transition, `--duration-fast` `--ease-out`.
- **Pressed:** `transform: scale(0.98)`, `--duration-fast`. (Removed under reduced motion.)
- **Focus-visible:** 2px solid `--color-focus` outline, 2px offset. Keyboard only, never on mouse click.
- **Disabled:** 50% opacity, `cursor: not-allowed`, no hover/press effects. Uses native `disabled`.
- **Loading:** spinner replaces left icon, label stays (button width does not jump), `aria-busy="true"`, clicks ignored, no hover/press effects, `cursor: progress`. Spinner rotates once per `--duration-loop`; under reduced motion it fades instead.

### Accessibility

- Always a native `<button>`; default `type="button"` so it never submits a form by accident.
- Icon-only buttons require `aria-label`.
- Minimum target 32px tall (meets WCAG 2.2 target size).
- Text contrast ≥ 4.5:1 in every variant and state, except disabled (exempt, as in WCAG 1.4.3 — inactive controls have no contrast requirement).

### Usage rules (also go into AGENTS.md)

- One `primary` button per view — the single main action.
- `secondary` for every other action: cancel, back, alternatives.
- `sm` in dense areas (tables, toolbars); `md` everywhere else. Buttons and TextFields in the same row use the same size.
- `danger` only for destructive, irreversible actions. Label with the specific action ("Delete project"), never "OK" or "Yes".
- Labels are verbs, sentence case ("Save changes", not "SAVE").
- Don't use Button for navigation — use a link.

### Stories to build

Primary · Secondary · Danger · Small · With icon · Loading · Disabled · All variants side by side

---

## 3. TextField

Single-line text input with label, optional hint, and error message.

### API

```ts
label: string                 // required — every field has a visible label
hint?: string                 // helper text below the input
error?: string                // when set, field is in error state; replaces hint
size?: 'sm' | 'md'            // default 'md'; matches Button heights
requiredMark?: boolean        // default true; shows " *" on the label when `required`
// plus all native <input> attributes (value, onChange, disabled, required, type, placeholder...)
```

`id` is generated with React `useId()` unless one is passed.
`className` goes on the outer wrapper (for layout); all other native attributes go on the `<input>`.
The native `size` attribute (width in characters) is not available — `size` is the design-system size.

### Anatomy & sizing

```
Label            ← --text-sm, medium, --color-text; gap --space-1 to input
[ input       ]  ← height --control-height-sm / --control-height-md, padding 0 --space-3,
                   1px --color-border-strong, --radius-md, bg --color-bg,
                   text --text-md (16px avoids iOS zoom-on-focus)
Hint or error    ← --text-sm; gap --space-1 below input; hint is --color-text-muted
```

- Placeholder: `--color-text-muted`. Placeholder is an example, never a replacement for the label.

### States

| State | Treatment |
|---|---|
| Rest | border `--color-border-strong` |
| Hover | border `--color-text-muted` |
| Focus | border `--color-primary` + 2px outline `--color-focus`, offset 1px. Uses `:focus` (not `:focus-visible`) — a text field shows focus on click too, because the user is about to type. |
| Error | border `--color-danger`; error text `--color-danger` with a small error icon (never color alone). Focus ring stays `--color-focus`. |
| Disabled | bg `--color-bg-subtle`, text `--color-text-muted`, `cursor: not-allowed`, native `disabled`. Label also uses `--color-text-muted`. |

Transitions: border color, `--duration-fast` `--ease-out`.

### Accessibility

- `<label htmlFor={id}>` tied to the input — clicking the label focuses the input.
- Hint and error rendered with their own ids and linked via `aria-describedby`, so screen readers read them after the label.
- Error state sets `aria-invalid="true"`.
- Required uses native `required`; label shows " *" unless `requiredMark={false}` (see Usage). The asterisk is `aria-hidden` — native `required` already announces it.
- Error icon is decorative (`aria-hidden="true"`); the text carries the meaning.

### Usage rules (also go into AGENTS.md)

- Always pass a `label`. If the design hides it visually, it still exists for screen readers.
- `sm` in dense areas (tables, toolbars); `md` everywhere else. Match the size of Buttons in the same row.
- Mark the minority: if most fields are required, set `requiredMark={false}` on them and add "(optional)" to the label text of optional ones; otherwise leave the default "*" on required ones.
- Show errors on blur or on submit, never while the user is still typing.
- Error text says how to fix it: "Enter an email like name@company.com", not "Invalid input".

### Stories to build

Default · With hint · Required · Optional · Error · Disabled · Filled · Small · In a form (two fields + primary Button)

---

## 4. RadioGroup

A labelled set of 2–5 mutually exclusive options, all visible at once. The user picks exactly one.

### API

```ts
label: string                      // required — the group's visible label (rendered as <legend>)
options: RadioOption[]             // required — 2 to 5 options, in display order
value?: string                     // controlled: the selected option's value
defaultValue?: string              // uncontrolled: the initially selected value
onChange?: (value: string) => void // called with the newly selected value
name?: string                      // form field name; generated with useId() unless passed
hint?: string                      // helper text below the options
error?: string                     // when set, group is in error state; replaces hint
required?: boolean                 // a choice must be made before submit
requiredMark?: boolean             // default true; shows " *" on the label when `required`
disabled?: boolean                 // disables every option
// plus native <fieldset> attributes (id, ref, aria-*...); className is for layout only

type RadioOption = {
  value: string
  label: string                    // short name of the choice
  description?: string             // one sentence explaining the choice
  disabled?: boolean               // disables this option only
}
```

One size and one layout (vertical stack) in v0.1. No `size` or `orientation` prop until a real need shows up.
`hint`, `error`, `required` and `requiredMark` behave exactly as on TextField, so the two read the same in a form.

### Anatomy & sizing

```
Label                 ← <legend>: --text-sm, medium, --color-text; gap --space-2 to first option
(•) Option label      ← radio --control-indicator-size (16px) round, gap --space-2 to text;
    Description         label --text-sm, medium, --color-text;
( ) Option label        description --text-sm, regular, --color-text-muted
    Description       ← gap --space-2 between options; each row at least --space-6 (24px) tall
Hint or error         ← --text-sm; gap --space-2 below last option; hint is --color-text-muted
```

- The radio is centred on the first line of its label, also when the text wraps.
- The whole row (radio, label and description) is the click target.
- The radio's size comes from `--control-indicator-size`; the dot is half that size.

### States

| State | Treatment |
|---|---|
| Rest (unselected) | radio: bg `--color-bg`, 1px border `--color-border-strong` |
| Hover (unselected) | border `--color-text-muted`; `cursor: pointer` on the whole row |
| Selected | border and inner dot `--color-primary` on `--color-bg` — a dot, never color alone |
| Selected + hover | border and dot `--color-primary-hover` |
| Focus-visible | 2px solid `--color-focus` outline on the radio, 2px offset. Keyboard only (same as Button), which includes arrow-key movement. |
| Error | unselected radios get border `--color-danger`; error text `--color-danger` with the same error icon as TextField. Focus ring stays `--color-focus`. |
| Disabled | radio bg `--color-bg-subtle`; a selected dot turns `--color-text-muted`; option label uses `--color-text-muted`; `cursor: not-allowed`; no hover effect. Native `disabled`. When the whole group is disabled the group label is muted too. |

Transitions: border and dot color, `--duration-fast` `--ease-out`. No transforms, so nothing extra to remove under reduced motion.

### Keyboard behavior

Native radio behavior — the component adds no key handlers of its own.

| Key | Result |
|---|---|
| Tab / Shift+Tab | Moves focus into the group — to the selected option, or to the first (Tab) / last (Shift+Tab) enabled option if none is selected. Pressing again leaves the group: the group is a single tab stop. |
| ↓ / → | Moves focus to the next enabled option **and selects it**. Wraps from last to first. |
| ↑ / ← | Moves focus to the previous enabled option and selects it. Wraps from first to last. |
| Space | Selects the focused option if it isn't selected yet. |

- Disabled options are skipped by arrow keys and never receive focus.
- Enter is not handled: inside a form it submits the form, as on any other field.

### Accessibility

- Rendered as a native `<fieldset>` with a `<legend>`, and native `<input type="radio">` elements sharing one `name`. No ARIA role is added: the native elements already convey the group. Screen readers announce the group label, then each option with its position ("2 of 3").
- Each option's accessible name is its `label` only. Its `description` is linked with `aria-describedby`, so it is read after the name instead of making the name long.
- Hint and error are rendered with their own ids and linked to the `<fieldset>` via `aria-describedby`.
- Error state sets `aria-invalid="true"` on the radios and also links the error to each radio via `aria-describedby`, so it is read wherever focus lands in the group. The error icon is decorative (`aria-hidden="true"`); the text carries the meaning.
- `required` sets native `required` on the radios, which already announces it. The " *" on the label is `aria-hidden`.
- Selection is never shown by color alone: the dot is the indicator.
- Contrast: radio border ≥ 3:1 against the background (`--color-border-strong`); label and description text ≥ 4.5:1. Disabled is exempt (WCAG 1.4.3).
- Target size: every row is at least 24px tall and the full row is clickable (WCAG 2.2 target size).
- In forced-colors (high contrast) mode the radio falls back to the browser's native rendering.

### Usage rules (also go into AGENTS.md)

- Use for choosing **exactly one of 2–5 fixed options** that are worth seeing side by side. More than 5 options needs a Select; picking several needs a Checkbox group; a single on/off setting needs a Checkbox or Switch. None of those exist yet — stop and ask, don't stretch RadioGroup or TextField to cover them.
- Always pass a `label`. Phrase it as the thing being chosen ("Role"), not as an instruction.
- Preselect only when there is a safe default: the least-privilege or least-consequential option (for roles, "Viewer"). Otherwise start with nothing selected, set `required`, and show the error on submit.
- Option labels are short, parallel, sentence case, without a trailing period ("Admin", "Member", "Viewer").
- Add a `description` when the label alone doesn't say what the choice means. Give one to every option or to none; one short sentence each.
- Order options in a meaningful sequence (most to least access, smallest to largest), not alphabetically.
- Selecting an option only changes the selection. Never submit, navigate or open something on select — arrow keys select as they move.
- Show the error on submit, never before. Error text says what to do: "Choose a role", not "Required".
- Mark the minority, as with TextField: `requiredMark={false}` when most fields in the form are required. A group with a preselected option needs no mark at all.
- Don't build your own legend, hint or error markup around it, and don't restyle the radios.

### Stories to build

Default (preselected) · With descriptions · No selection (required) · With hint · Error · Disabled group · One disabled option · In a form (TextField + RadioGroup + primary Button)

---

## 5. Next up (not yet specced)

- Card
- Tokens showcase page in Storybook
- AGENTS.md + with/without experiment
- Select, Checkbox, Switch (RadioGroup's usage rules point to them)
