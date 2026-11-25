import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button';
import { TextField } from '../TextField';
import { RadioGroup } from './RadioGroup';

/** Demo scaffolding only: gives the group a realistic column width (320px). */
const columnWidth = 'calc(var(--space-8) * 10)';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
];

const rolesWithDescriptions = [
  { value: 'admin', label: 'Admin', description: 'Manages members, billing and settings.' },
  { value: 'member', label: 'Member', description: 'Creates and edits projects.' },
  { value: 'viewer', label: 'Viewer', description: 'Views and comments only.' },
];

const plans = [
  { value: 'starter', label: 'Starter', description: 'Up to 3 projects.' },
  { value: 'team', label: 'Team', description: 'Unlimited projects and shared workspaces.' },
  { value: 'business', label: 'Business', description: 'Adds single sign-on and audit logs.' },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  args: {
    label: 'Role',
    options: roles,
    // Least privilege is the safe default for roles.
    defaultValue: 'viewer',
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: columnWidth }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescriptions: Story = {
  args: { options: rolesWithDescriptions },
};

/** No safe default exists for a plan, so nothing is preselected and the group is required. */
export const NoSelection: Story = {
  name: 'No selection (required)',
  args: { label: 'Plan', options: plans, defaultValue: undefined, required: true },
};

export const WithHint: Story = {
  args: { hint: 'You can change this later in workspace settings.' },
};

export const Error: Story = {
  args: {
    label: 'Plan',
    options: plans,
    defaultValue: undefined,
    required: true,
    error: 'Choose a plan',
  },
};

export const DisabledGroup: Story = {
  args: { options: rolesWithDescriptions, disabled: true },
};

export const OneDisabledOption: Story = {
  args: {
    options: rolesWithDescriptions.map((option) =>
      option.value === 'admin' ? { ...option, disabled: true } : option,
    ),
    hint: 'Only workspace owners can invite admins.',
  },
};

export const InAForm: Story = {
  name: 'In a form',
  render: () => (
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
    >
      {/* The email is required and the role has a default, so nothing needs a mark. */}
      <TextField
        label="Work email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="name@company.com"
        required
        requiredMark={false}
      />
      <RadioGroup label="Role" name="role" options={rolesWithDescriptions} defaultValue="viewer" />
      <div>
        <Button type="submit">Send invite</Button>
      </div>
    </form>
  ),
};
