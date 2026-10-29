import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { fn } from 'storybook/test';
import type { TbCountChangeEvent, TbCounter } from './counter';

type Args = Pick<TbCounter, 'label' | 'hint' | 'value' | 'min' | 'max'> & {
  onCountChange: (event: TbCountChangeEvent) => void;
};

const meta: Meta<Args> = {
  title: 'Components/Counter',
  component: 'tb-counter',
  args: { label: 'Adults', hint: '', value: 2, min: 1, max: 4, onCountChange: fn() },
  render: (args) =>
    html`<tb-counter
      label=${args.label}
      hint=${args.hint}
      .value=${args.value}
      .min=${args.min}
      .max=${args.max}
      @tb-count-change=${args.onCountChange}
    ></tb-counter>`,
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const AtMinimum: Story = {
  args: { label: 'Children', hint: 'Ages 0–12', value: 0, min: 0, max: 3 },
};
export const AtMaximum: Story = { args: { value: 4 } };
