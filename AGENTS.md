# AGENTS.md — building UI with the Mini Design System

Source of truth: `mini-ds-spec.md`. If this file and the spec disagree, the spec wins.
Components today: `Button`, `TextField`, `RadioGroup`. Don't invent a new component or restyle these.

**Never force a component into a job it isn't designed for** (e.g., a TextField for choosing from fixed options). If the right component doesn't exist, stop and ask, and name the missing component.

## 1. Tokens only

- Every color, size, spacing, radius, font, shadow and duration comes from `src/tokens/tokens.css`.
- Never hardcode a value: no hex colors, no `px` spacing, no `ms` durations.
- Never add or rename a token yourself. If no token fits, stop and ask.
- Pick tokens by purpose, not looks: `--color-danger` for errors, even if another token is the same shade.

| Need | Tokens |
|---|---|
| Color | `--color-bg`, `-bg-subtle`, `-text`, `-text-muted`, `-text-on-primary`, `-border`, `-border-strong`, `-primary` (`-hover`, `-active`, `-subtle`), `-danger` (`-hover`), `-focus` |
| Spacing | `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 |
| Radius | `--radius-sm` · `-md` (default) · `-lg` (cards) · `-full` |
| Control height | `--control-height-sm` 32 · `-md` 40 |
| Selection indicator | `--control-indicator-size` 16 (radio box) |
| Type | `--font-sans` · `--text-xs` 12 · `-sm` 14 · `-md` 16 · `-lg` 20 · `-xl` 24 · `--weight-regular` · `-medium` · `-semibold` · `--leading-tight` · `-normal` |
| Shadow | `--shadow-sm` · `-md` |
| Motion | `--duration-fast` (hover, press) · `-normal` (appear, expand) · `-loop` (spinners) · `--ease-out` |

Layout around components uses the same tokens:

```tsx
<div style={{ display: 'flex', gap: 'var(--space-3)' }}>…</div>
```

## 2. Button

`import { Button } from './components/Button';`

| Prop | Use it when |
|---|---|
| `variant="primary"` (default) | The single main action of the view. **One per view.** |
| `variant="secondary"` | Every other action: cancel, back, alternatives. |
| `variant="danger"` | Destructive, irreversible actions only. |
| `size="md"` (default) | Standard. |
| `size="sm"` | Dense areas: tables, toolbars. Pair with `sm` TextFields. |
| `loading` | The action is in progress. Keeps the label, ignores clicks. Don't also set `disabled`. |
| `disabled` | The action is unavailable right now. |
| `iconLeft` | An icon that supports the label. It is decorative; the label carries the meaning. |

Rules:

- Labels are verbs in sentence case: "Save changes", not "SAVE" or "Submit".
- Danger labels name the action: "Delete project", never "OK" or "Yes".
- Never use Button for navigation — use a link.
- Icon-only buttons must have `aria-label` (TypeScript enforces this).
- `type` defaults to `"button"`. Set `type="submit"` explicitly for a form's submit button.
- `className` is for layout only (width, spacing). Never use it or `style` to change colors, height, radius or type.

```tsx
<div style={{ display: 'flex', gap: 'var(--space-3)' }}>
  <Button variant="secondary" onClick={onCancel}>Cancel</Button>
  <Button loading={isSaving} onClick={onSave}>Save changes</Button>
</div>
```

## 3. TextField

`import { TextField } from './components/TextField';`

| Prop | Use it when |
|---|---|
| `label` (required) | Always. A placeholder never replaces the label. |
| `hint` | The user needs help before typing: format, purpose, limits. |
| `error` | Validation failed. Replaces the hint and sets `aria-invalid`. Pass `undefined` when valid. |
| `placeholder` | To show an example value only. |
| `required` | The field must be filled. Shows " *" on the label. |
| `requiredMark={false}` | Most fields in the form are required — hide the asterisks, mark optional ones instead. |
| `size="sm"` | Dense areas. Match the size of Buttons in the same row. |
| `disabled` | The field can't be edited right now. |

Rules:

- Mark the minority. Mostly optional form: leave "*" on required fields. Mostly required form: `requiredMark={false}` on those, and add "(optional)" to the label text of optional fields.
- Show errors on blur or on submit, never while the user is typing.
- Error text says how to fix it: "Enter an email like name@company.com", not "Invalid input".
- Set the right `type` and `autoComplete` (`email`, `name`, `tel`…).
- `className` goes on the wrapper and is for layout only (width, spacing). Don't build your own label, hint or error markup around it.

```tsx
<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
  <TextField
    label="Work email"
    name="email"
    type="email"
    autoComplete="email"
    placeholder="name@company.com"
    hint="We only use this for account notices."
    error={emailError} // set on blur or submit, e.g. "Enter an email like name@company.com"
    required
    requiredMark={false} // every field in this form is required
    onBlur={validateEmail}
  />
  <TextField label="Company (optional)" name="company" autoComplete="organization" />
  <div>
    <Button type="submit">Create account</Button>
  </div>
</form>
```

## 4. RadioGroup

`import { RadioGroup } from './components/RadioGroup';`

Use it to choose **exactly one of 2–5 fixed options**, all visible at once.

| Prop | Use it when |
|---|---|
| `label` (required) | Always. Name the thing being chosen: "Role", not "Choose a role". |
| `options` (required) | 2–5 items: `{ value, label, description?, disabled? }`, in a meaningful order. |
| `value` + `onChange` | Controlled. `onChange` receives the selected value (a string), not an event. |
| `defaultValue` | Uncontrolled, e.g. plain form posts. |
| `hint` | The user needs help before choosing. |
| `error` | Validation failed. Replaces the hint. Pass `undefined` when valid. |
| `required` | Nothing is preselected and a choice must be made. Shows " *" on the label. |
| `requiredMark={false}` | Most fields in the form are required — same "mark the minority" rule as TextField. |
| `disabled` | The whole group can't be changed right now. Use an option's `disabled` for a single choice. |

Rules:

- Preselect only when there is a safe default: the least-privilege or least-consequential option (for roles, "Viewer"). Otherwise select nothing, set `required`, and show the error on submit.
- More than 5 options needs a Select; picking several needs a Checkbox group; a single on/off needs a Checkbox or Switch. None exist yet — stop and ask, naming the missing component. Don't stretch RadioGroup or TextField to cover them.
- Option labels are short, parallel, sentence case, no trailing period: "Admin", "Member", "Viewer".
- Give a `description` to every option or to none; one short sentence each.
- Order options meaningfully (most to least access, smallest to largest), not alphabetically.
- Selecting only changes the selection. Never submit, navigate or open anything on select.
- Show the error on submit, never before. Error text says what to do: "Choose a role", not "Required".
- `className` is for layout only. Don't build your own legend, hint or error markup around it, and don't restyle the radios.

```tsx
<RadioGroup
  label="Role"
  name="role"
  options={[
    { value: 'admin', label: 'Admin', description: 'Manages members, billing and settings.' },
    { value: 'member', label: 'Member', description: 'Creates and edits projects.' },
    { value: 'viewer', label: 'Viewer', description: 'Views and comments only.' },
  ]}
  value={role} // starts as 'viewer': least privilege is the safe default
  onChange={setRole}
/>
```

## 5. Before you finish

- [ ] No hardcoded colors, sizes or durations anywhere in what you wrote.
- [ ] Exactly one `primary` Button in the view.
- [ ] Every TextField and RadioGroup has a `label`; every icon-only Button has an `aria-label`.
- [ ] Labels and error messages follow the wording rules above.
- [ ] New UI has a Storybook story and passes the Accessibility panel with no violations.
