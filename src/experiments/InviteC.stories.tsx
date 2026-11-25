import { useId, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, FormEvent, RefObject } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { RadioGroup } from '../components/RadioGroup';
import { TextField } from '../components/TextField';

/*
 * Experiment C: "Invite teammate" form built from TextField, RadioGroup and Button.
 *
 * The role picker is the design system's RadioGroup, with Viewer (least
 * privilege) preselected — so the role can never be invalid or missing.
 */

const roles = [
  { value: 'admin', label: 'Admin', description: 'Manages members, billing and settings.' },
  { value: 'member', label: 'Member', description: 'Creates and edits projects.' },
  { value: 'viewer', label: 'Viewer', description: 'Views and comments only.' },
] as const;

type Role = (typeof roles)[number]['value'];
type TextFieldName = 'name' | 'email';
type Errors = Partial<Record<TextFieldName, string>>;

const defaultRole: Role = 'viewer';
const textFields: TextFieldName[] = ['name', 'email'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(field: TextFieldName, value: string): string | undefined {
  const trimmed = value.trim();
  if (field === 'name') return trimmed ? undefined : 'Enter your teammate’s name';
  if (!trimmed) return 'Enter their work email';
  return emailPattern.test(trimmed) ? undefined : 'Enter an email like name@company.com';
}

const s = {
  card: {
    boxSizing: 'border-box',
    width: 'calc(var(--space-8) * 12)',
    maxWidth: '100%',
    padding: 'var(--space-6)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    backgroundColor: 'var(--color-bg)',
    boxShadow: 'var(--shadow-sm)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-text)',
  },
  title: {
    margin: 0,
    fontSize: 'var(--text-lg)',
    fontWeight: 'var(--weight-semibold)',
    lineHeight: 'var(--leading-tight)',
  },
  intro: {
    margin: 'var(--space-1) 0 var(--space-5)',
    fontSize: 'var(--text-sm)',
    lineHeight: 'var(--leading-normal)',
    color: 'var(--color-text-muted)',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    minHeight: 'var(--control-height-md)',
  },
  status: {
    margin: 0,
    fontSize: 'var(--text-sm)',
    lineHeight: 'var(--leading-normal)',
    color: 'var(--color-text-muted)',
  },
} satisfies Record<string, CSSProperties>;

function InviteTeammateForm() {
  const [values, setValues] = useState<Record<TextFieldName, string>>({ name: '', email: '' });
  const [role, setRole] = useState<Role>(defaultRole);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const titleId = useId();
  const refs: Record<TextFieldName, RefObject<HTMLInputElement | null>> = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  };

  /** Shared wiring: typing clears the field's error; leaving a filled field validates it. */
  function fieldProps(field: TextFieldName) {
    return {
      ref: refs[field],
      name: field,
      value: values[field],
      error: errors[field],
      // Both text fields are required and the role has a default, so nothing is marked.
      required: true,
      requiredMark: false,
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [field]: event.target.value });
        if (errors[field]) setErrors({ ...errors, [field]: undefined });
      },
      onBlur: () => {
        // An empty field is only flagged on submit, not for tabbing past it.
        if (!values[field].trim()) return;
        setErrors({ ...errors, [field]: validate(field, values[field]) });
      },
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    for (const field of textFields) next[field] = validate(field, values[field]);
    setErrors(next);
    setSentMessage(null);

    const firstInvalid = textFields.find((field) => next[field]);
    if (firstInvalid) return refs[firstInvalid].current?.focus();

    // Stand-in for the real request.
    const roleLabel = roles.find((option) => option.value === role)?.label;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSentMessage(`Invite sent to ${values.email.trim()} as ${roleLabel}`);
      setValues({ name: '', email: '' });
      setRole(defaultRole);
      refs.name.current?.focus();
    }, 1200);
  }

  return (
    <section style={s.card} aria-labelledby={titleId}>
      <h2 id={titleId} style={s.title}>
        Invite teammate
      </h2>
      <p style={s.intro}>They’ll get an email with a link to join your workspace.</p>

      {/* noValidate: errors go through TextField's error state, not browser bubbles. */}
      <form onSubmit={handleSubmit} noValidate style={s.form}>
        <TextField {...fieldProps('name')} label="Name" autoComplete="off" />
        <TextField
          {...fieldProps('email')}
          label="Email"
          type="email"
          autoComplete="off"
          placeholder="name@company.com"
        />
        <RadioGroup
          label="Role"
          name="role"
          options={roles}
          value={role}
          onChange={(value) => setRole(value as Role)}
        />

        <div style={s.footer}>
          <Button type="submit" loading={sending}>
            {sending ? 'Sending…' : 'Send invite'}
          </Button>
          <p role="status" style={s.status}>
            {sentMessage}
          </p>
        </div>
      </form>
    </section>
  );
}

const meta = {
  title: 'Experiments/Invite C',
  component: InviteTeammateForm,
} satisfies Meta<typeof InviteTeammateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
