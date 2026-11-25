import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { TextField } from './TextField';

/** Demo scaffolding only: gives the field a realistic column width (320px). */
const columnWidth = 'calc(var(--space-8) * 10)';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: {
    label: 'Email',
    placeholder: 'name@company.com',
    type: 'email',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: columnWidth }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'We only use this for account notices.' },
};

export const Required: Story = {
  args: { required: true },
};

export const Optional: Story = {
  args: { label: 'Company (optional)', type: 'text', placeholder: 'Acme Inc.' },
};

export const Error: Story = {
  args: {
    defaultValue: 'mia@company',
    hint: 'We only use this for account notices.',
    error: 'Enter an email like name@company.com',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'mia@company.com' },
};

export const Filled: Story = {
  args: { defaultValue: 'mia@company.com' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const InAForm: Story = {
  name: 'In a form',
  render: () => (
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      {/* Every field is required, so none is marked ("mark the minority"). */}
      <TextField label="Full name" name="name" autoComplete="name" required requiredMark={false} />
      <TextField
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="name@company.com"
        hint="We only use this for account notices."
        required
        requiredMark={false}
      />
      <div>
        <Button type="submit">Create account</Button>
      </div>
    </form>
  ),
};
