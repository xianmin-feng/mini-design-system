import { useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';
import { TextField } from '../components/TextField';

/*
 * Experiment A: "Invite teammate" form built from TextField and Button.
 *
 * The system has no Select or Radio yet, so the role picker is a native radio
 * group laid out with tokens. If this pattern sticks, it should become a
 * RadioGroup component rather than stay as story-local styles.
 */

const roles = [
  { value: 'admin', label: 'Admin', description: 'Manages members, billing and settings.' },
  { value: 'member', label: 'Member', description: 'Creates and edits projects.' },
  { value: 'viewer', label: 'Viewer', description: 'Views and comments only.' },
] as const;

type Role = (typeof roles)[number]['value'];
type Errors = { name?: string; email?: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  fieldset: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    margin: 0,
    padding: 0,
    border: 0,
    minWidth: 0,
  },
  legend: {
    padding: 0,
    marginBottom: 'var(--space-1)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--weight-medium)',
    lineHeight: 'var(--leading-normal)',
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-2)',
    fontSize: 'var(--text-sm)',
    lineHeight: 'var(--leading-normal)',
    cursor: 'pointer',
  },
  radio: {
    flexShrink: 0,
    width: 'var(--space-4)',
    height: 'var(--space-4)',
    // Centres the radio on the first line of its label.
    margin: 'calc((1em * var(--leading-normal) - var(--space-4)) / 2) 0 0',
    accentColor: 'var(--color-primary)',
  },
  optionLabel: { display: 'block', fontWeight: 'var(--weight-medium)' },
  optionDescription: { display: 'block', color: 'var(--color-text-muted)' },
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    if (!name.trim()) next.name = 'Enter your teammate’s name';
    if (!email.trim()) next.email = 'Enter their work email';
    else if (!emailPattern.test(email.trim())) next.email = 'Enter an email like name@company.com';

    setErrors(next);
    setSentTo(null);

    if (next.name) return nameRef.current?.focus();
    if (next.email) return emailRef.current?.focus();

    // Stand-in for the real request.
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSentTo(email.trim());
      setName('');
      setEmail('');
      setRole('member');
      nameRef.current?.focus();
    }, 1200);
  }

  return (
    <section style={s.card} aria-labelledby="invite-a-title">
      <h2 id="invite-a-title" style={s.title}>
        Invite teammate
      </h2>
      <p style={s.intro}>They’ll get an email with a link to join your workspace.</p>

      {/* noValidate: errors go through TextField's error state, not browser bubbles. */}
      <form onSubmit={handleSubmit} noValidate style={s.form}>
        {/* Every field is required, so none is marked ("mark the minority"). */}
        <TextField
          ref={nameRef}
          label="Name"
          name="name"
          autoComplete="off"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
          required
          requiredMark={false}
        />
        <TextField
          ref={emailRef}
          label="Email"
          name="email"
          type="email"
          autoComplete="off"
          placeholder="name@company.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          error={errors.email}
          required
          requiredMark={false}
        />

        <fieldset style={s.fieldset}>
          <legend style={s.legend}>Role</legend>
          {roles.map((option) => (
            <label key={option.value} style={s.option}>
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={role === option.value}
                onChange={() => setRole(option.value)}
                style={s.radio}
              />
              <span>
                <span style={s.optionLabel}>{option.label}</span>
                <span style={s.optionDescription}>{option.description}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div style={s.footer}>
          <Button type="submit" loading={sending}>
            {sending ? 'Sending…' : 'Send invite'}
          </Button>
          <p role="status" style={s.status}>
            {sentTo ? `Invite sent to ${sentTo}` : null}
          </p>
        </div>
      </form>
    </section>
  );
}

const meta = {
  title: 'Experiments/Invite A',
  component: InviteTeammateForm,
} satisfies Meta<typeof InviteTeammateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
