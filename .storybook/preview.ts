import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        order: ['Introduction', 'Foundations', 'Components', 'Experiments'],
      },
    },
    a11y: {
      // Report accessibility violations as failures, not just warnings.
      test: 'error',
    },
  },
};

export default preview;
