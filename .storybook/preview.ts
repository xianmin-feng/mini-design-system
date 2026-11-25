import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    a11y: {
      // Report accessibility violations as failures, not just warnings.
      test: 'error',
    },
  },
};

export default preview;
