import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from './Button';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Save changes',
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    iconLeft: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete project' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const WithIcon: Story = {
  args: { iconLeft: <PlusIcon />, children: 'Add member' },
};

export const Loading: Story = {
  args: { loading: true, iconLeft: <PlusIcon />, children: 'Add member' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllVariants: Story = {
  name: 'All variants side by side',
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <Button {...args} variant="primary">
        Save changes
      </Button>
      <Button {...args} variant="secondary">
        Cancel
      </Button>
      <Button {...args} variant="danger">
        Delete project
      </Button>
    </div>
  ),
};
