import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { fn } from 'storybook/test';
import type { TbDateChangeEvent, TbDateField } from './date-field';

type Args = Pick<TbDateField, 'label' | 'value' | 'min' | 'max' | 'error'> & {
  onDateChange: (event: TbDateChangeEvent) => void;
};

const meta: Meta<Args> = {
  title: 'Components/Date field',
  component: 'tb-date-field',
  args: {
    label: 'Check-in',
    value: '2026-07-04',
    min: '2026-07-01',
    max: '',
    error: '',
    onDateChange: fn(),
  },
  render: (args) =>
    html`<tb-date-field
      label=${args.label}
      .value=${args.value}
      min=${args.min}
      max=${args.max}
      error=${args.error}
      @tb-date-change=${args.onDateChange}
    ></tb-date-field>`,
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const WithError: Story = { args: { error: 'Check-in cannot be in the past.' } };
