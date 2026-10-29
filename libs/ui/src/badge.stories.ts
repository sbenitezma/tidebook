import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { TbBadge } from './badge';

type Args = Pick<TbBadge, 'variant'> & { label: string };

const meta: Meta<Args> = {
  title: 'Components/Badge',
  component: 'tb-badge',
  args: { label: 'Room', variant: 'neutral' },
  argTypes: { variant: { control: 'inline-radio', options: ['neutral', 'accent', 'success'] } },
  render: (args) => html`<tb-badge variant=${args.variant}>${args.label}</tb-badge>`,
};
export default meta;

type Story = StoryObj<Args>;

export const Neutral: Story = {};
export const Accent: Story = { args: { variant: 'accent', label: 'Bungalow' } };
export const Success: Story = { args: { variant: 'success', label: 'Available' } };
