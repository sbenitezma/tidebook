import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { fn } from 'storybook/test';
import type { TbInputEvent, TbTextField } from './text-field';

type Args = Pick<TbTextField, 'label' | 'value' | 'placeholder' | 'hint' | 'error'> & {
  onInput: (event: TbInputEvent) => void;
};

const meta: Meta<Args> = {
  title: 'Components/Text field',
  component: 'tb-text-field',
  args: {
    label: 'Promo code',
    value: '',
    placeholder: 'e.g. WELCOME10',
    hint: '',
    error: '',
    onInput: fn(),
  },
  render: (args) =>
    html`<tb-text-field
      label=${args.label}
      .value=${args.value}
      placeholder=${args.placeholder}
      hint=${args.hint}
      error=${args.error}
      @tb-input=${args.onInput}
    ></tb-text-field>`,
};
export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: 'Codes are not case sensitive.' } };
export const WithError: Story = {
  args: { value: 'SPRING20', error: 'SPRING20 has expired, so no discount was applied.' },
};
