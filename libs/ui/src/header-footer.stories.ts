import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const meta: Meta = {
  title: 'Components/Header and footer',
  component: 'tb-header',
  parameters: { layout: 'fullscreen' },
};
export default meta;

export const Header: StoryObj = { render: () => html`<tb-header></tb-header>` };
export const Footer: StoryObj = {
  render: () =>
    html`<tb-footer>Tidebook is a portfolio project: no real bookings are made.</tb-footer>`,
};
