import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { fn } from 'storybook/test';
import type { TbButton } from './button';

type Args = Pick<TbButton, 'variant' | 'disabled' | 'block'> & {
  label: string;
  onClick: () => void;
};

const meta: Meta<Args> = {
  title: 'Components/Button',
  component: 'tb-button',
  args: {
    label: 'Confirm booking',
    variant: 'primary',
    disabled: false,
    block: false,
    onClick: fn(),
  },
  argTypes: { variant: { control: 'inline-radio', options: ['primary', 'secondary'] } },
  render: (args) =>
    html`<tb-button
      variant=${args.variant}
      ?disabled=${args.disabled}
      ?block=${args.block}
      @click=${args.onClick}
      >${args.label}</tb-button
    >`,
};
export default meta;

type Story = StoryObj<Args>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', label: 'Apply' } };
export const Disabled: Story = { args: { disabled: true } };
export const Block: Story = { args: { block: true } };
