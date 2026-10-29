import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { tokens } from '@tidebook/tokens';

const meta: Meta = {
  title: 'Foundations/Design tokens',
  tags: ['!autodocs'],
};
export default meta;

const kebab = (value: string) => value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
const cssVar = (group: string, name: string) => `--tb-${group}-${kebab(name)}`;

export const Colours: StoryObj = {
  render: () => html`
    <div class="grid">
      ${Object.entries(tokens.color).map(
        ([name, value]) => html`
          <figure>
            <div class="swatch" style="background: ${value}"></div>
            <figcaption>
              <strong>${name}</strong><br /><code>${cssVar('color', name)}</code><br />${value}
            </figcaption>
          </figure>
        `,
      )}
    </div>
    <style>
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
        gap: 1rem;
      }
      figure {
        margin: 0;
        font-size: 0.875rem;
      }
      .swatch {
        height: 4rem;
        margin-bottom: 0.25rem;
        border: 1px solid var(--tb-color-border);
        border-radius: var(--tb-radius-sm);
      }
    </style>
  `,
};

export const Spacing: StoryObj = {
  render: () => html`
    ${Object.entries(tokens.space).map(
      ([name, value]) => html`
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem">
          <code style="width: 10rem">${cssVar('space', name)}</code>
          <div style="height: 1rem; width: ${value}; background: var(--tb-color-primary)"></div>
          <span>${value}</span>
        </div>
      `,
    )}
  `,
};

export const Typography: StoryObj = {
  render: () => html`
    ${(['sizeSm', 'sizeMd', 'sizeLg', 'sizeXl'] as const).map(
      (name) => html`
        <p style="margin: 0 0 0.5rem; font-size: ${tokens.font[name]}">
          Stays where the tide sets the pace · <code>${cssVar('font', name)}</code>
        </p>
      `,
    )}
  `,
};
