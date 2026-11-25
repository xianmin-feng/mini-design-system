import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
// Local test images (illustrated portraits), so the photo stories need no network.
import portrait1 from './test-assets/portrait-1.svg';
import portrait2 from './test-assets/portrait-2.svg';

const sizes = ['sm', 'md', 'lg', 'xl'] as const;
const statuses = ['active', 'away', 'busy', 'inactive'] as const;

/** Demo scaffolding only. */
const s = {
  row: { display: 'flex', alignItems: 'center', gap: 'var(--space-4)' },
  column: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-xs)',
    lineHeight: 'var(--leading-normal)',
    color: 'var(--color-text-muted)',
  },
  stack: { display: 'flex', paddingLeft: 'var(--space-2)' },
  // Each avatar slides over the one before it.
  stacked: { marginLeft: 'calc(var(--space-2) * -1)' },
  person: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-sm)',
    lineHeight: 'var(--leading-normal)',
    color: 'var(--color-text)',
  },
} satisfies Record<string, CSSProperties>;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    name: 'Mia Feng',
  },
  argTypes: {
    size: { control: 'inline-radio', options: sizes },
    status: { control: 'inline-radio', options: [undefined, ...statuses] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Photo: Story = {
  args: { src: portrait1, size: 'lg' },
};

export const Initials: Story = {
  args: { size: 'lg' },
};

/** The URL can't load, so `onError` swaps in the initials. */
export const BrokenImage: Story = {
  name: 'Broken image (falls back to initials)',
  args: { src: 'data:image/png;base64,broken', size: 'lg' },
};

export const AllSizes: Story = {
  render: (args) => (
    <div style={s.column}>
      {[portrait1, undefined].map((src) => (
        <div key={src ?? 'initials'} style={s.row}>
          {sizes.map((size) => (
            <Avatar key={size} {...args} src={src} size={size} status="active" />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllStatuses: Story = {
  render: (args) => (
    <div style={s.column}>
      {sizes.map((size) => (
        <div key={size} style={s.row}>
          {statuses.map((status) => (
            <div key={status} style={s.item}>
              <Avatar {...args} src={portrait2} name="Ana Souza" size={size} status={status} />
              {/* Caption only under the last row, to keep the grid readable. */}
              {size === 'xl' ? <span>{status}</span> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithRing: Story = {
  name: 'With ring (overlapping stack of 4)',
  render: (args) => (
    <div style={s.stack}>
      <Avatar {...args} ring size="lg" name="Mia Feng" src={portrait1} style={s.stacked} />
      <Avatar {...args} ring size="lg" name="Ana Souza" src={portrait2} style={s.stacked} />
      <Avatar {...args} ring size="lg" name="Kenji Watanabe" style={s.stacked} />
      <Avatar {...args} ring size="lg" name="Priya Raman" style={s.stacked} />
    </div>
  ),
};

/** The name is printed beside the avatar, so the avatar is hidden from screen readers. */
export const DecorativeNextToAName: Story = {
  name: 'Decorative next to a name',
  render: (args) => (
    <div style={s.person}>
      <Avatar {...args} src={portrait1} decorative />
      <span>{args.name}</span>
    </div>
  ),
};

export const LongAndSingleWordNames: Story = {
  name: 'Long/single-word names',
  render: (args) => (
    <div style={s.row}>
      {[
        'Mia',
        'Maria del Carmen Fernández de la Vega',
        'kenji watanabe',
        'Émile Zola',
        // CJK names show their last two characters.
        '李小龙',
        '王芳',
      ].map((name) => (
        <div key={name} style={s.item}>
          <Avatar {...args} name={name} size="lg" />
          <span>{name}</span>
        </div>
      ))}
    </div>
  ),
};
