import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { TbAlert } from './alert';

type Args = Pick<TbAlert, 'variant' | 'heading'> & { message: string };

const meta: Meta<Args> = {
  title: 'Components/Alert',
  component: 'tb-alert',
  args: { variant: 'info', heading: '', message: 'Your booking will be saved on this device.' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] },
  },
  render: (args) =>
    html`<tb-alert variant=${args.variant} heading=${args.heading}>${args.message}</tb-alert>`,
};
export default meta;

type Story = StoryObj<Args>;

export const Info: Story = {};
export const Success: Story = {
  args: { variant: 'success', message: 'WELCOME10 applied: 10% off your stay.' },
};
export const Warning: Story = {
  args: {
    variant: 'warning',
    heading: 'Too many guests for this room',
    message: 'Driftwood Room sleeps up to 2; your group is 3.',
  },
};
export const Danger: Story = {
  args: { variant: 'danger', message: 'SPRING20 has expired, so no discount was applied.' },
};
