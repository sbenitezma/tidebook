import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { TbPriceSummary } from './price-summary';

type Args = Pick<
  TbPriceSummary,
  'heading' | 'nights' | 'pricePerNight' | 'subtotal' | 'discount' | 'discountLabel' | 'total'
>;

const meta: Meta<Args> = {
  title: 'Components/Price summary',
  component: 'tb-price-summary',
  args: {
    heading: 'Seagrass Bungalow',
    nights: 3,
    pricePerNight: '€165.00',
    subtotal: '€495.00',
    discount: '',
    discountLabel: '',
    total: '€495.00',
  },
  render: (args) =>
    html`<div style="max-width: 22rem">
      <tb-price-summary
        heading=${args.heading}
        .nights=${args.nights}
        .pricePerNight=${args.pricePerNight}
        subtotal=${args.subtotal}
        discount=${args.discount}
        .discountLabel=${args.discountLabel}
        total=${args.total}
      >
        <tb-button block>Confirm booking</tb-button>
      </tb-price-summary>
    </div>`,
};
export default meta;

type Story = StoryObj<Args>;

export const WithoutDiscount: Story = {};
export const WithDiscount: Story = {
  args: { discount: '€49.50', discountLabel: 'WELCOME10 (10%)', total: '€445.50' },
};
