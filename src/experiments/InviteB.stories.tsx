import { useId, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';

/*
 * Experiment B: "Invite teammate" form built only from TextField and Button.
 *
 * Unlike experiment A (story-local radio group), the role picker here is a
 * TextField wired to a native <datalist>: the user picks a suggestion or types
 * it, and the value is checked against the known roles on blur and on submit.
 * No custom label, hint or error markup is needed.
 */

const roles = ['Admin', 'Member', 'Viewer'] as const;

type Field = 'name' | 'email' | 'role';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const fields: Field[] = ['name', 'email', 'role'];
const emptyValues: Values = { name: '', email: '', role: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function matchRole(input: string) {
  return roles.find((role) => role.toLowerCase() === input.trim().toLowerCase());
}

function validate(field: Field, value: string): string | undefined {
  const trimmed = value.trim();
  switch (field) {
    case 'name':
      return trimmed ? undefined : 'Enter your teammate’s name';
    case 'email':
      if (!trimmed) return 'Enter their work email';
      return emailPattern.test(trimmed) ? undefined : 'Enter an email like name@company.com';
    case 'role':
      return matchRole(trimmed) ? undefined : 'Enter Admin, Member or Viewer';
  }
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
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const titleId = useId();
  const roleListId = useId();
  const refs: Record<Field, React.RefObject<HTMLInputElement | null>> = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    role: useRef<HTMLInputElement>(null),
  };

  /** Shared wiring: typing clears the field's error; leaving a filled field validates it. */
  function fieldProps(field: Field) {
    return {
      ref: refs[field],
      name: field,
      value: values[field],
      error: errors[field],
      // Every field is required, so none is marked ("mark the minority").
      required: true,
      requiredMark: false,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [field]: event.target.value });
        if (errors[field]) setErrors({ ...errors, [field]: undefined });
      },
      onBlur: () => {
        // An empty field is only flagged on submit, not for tabbing past it.
        if (!values[field].trim()) return;
        setErrors({ ...errors, [field]: validate(field, values[field]) });
        // Tidy "member" into "Member" once it's a valid role.
        const role = field === 'role' ? matchRole(values.role) : undefined;
        if (role) setValues({ ...values, role });
      },
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    for (const field of fields) next[field] = validate(field, values[field]);
    setErrors(next);
    setSentMessage(null);

    const firstInvalid = fields.find((field) => next[field]);
    if (firstInvalid) return refs[firstInvalid].current?.focus();

    // Stand-in for the real request.
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSentMessage(`Invite sent to ${values.email.trim()} as ${matchRole(values.role)}`);
      setValues(emptyValues);
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
        <TextField
          {...fieldProps('role')}
          label="Role"
          list={roleListId}
          autoComplete="off"
          hint="Admin, Member or Viewer."
        />
        <datalist id={roleListId}>
          {roles.map((role) => (
            <option key={role} value={role} />
          ))}
        </datalist>

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
  title: 'Experiments/Invite B',
  component: InviteTeammateForm,
} satisfies Meta<typeof InviteTeammateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
