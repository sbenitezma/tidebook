import type { Preview } from '@storybook/web-components-vite';
import { applyTokens } from '@tidebook/tokens';
import '../src/index';
import '../src/layout.css';

applyTokens();

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { options: { page: { name: 'Page', value: '#fbf7f0' } } },
  },
  initialGlobals: { backgrounds: { value: 'page' } },
};

export default preview;
