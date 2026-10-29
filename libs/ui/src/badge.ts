import { LitElement, css, html } from 'lit';
import { base, define, t } from './shared';

export type BadgeVariant = 'neutral' | 'accent' | 'success';

/**
 * Short label such as a room type.
 * @slot - Badge text.
 */
export class TbBadge extends LitElement {
  static override properties = { variant: { reflect: true } };

  declare variant: BadgeVariant;

  constructor() {
    super();
    this.variant = 'neutral';
  }

  static override styles = [
    base,
    css`
      :host {
        display: inline-block;
        padding: 0.125rem ${t.space.sm};
        border-radius: ${t.radius.pill};
        font-size: ${t.font.sizeSm};
        font-weight: ${t.font.weightBold};
        background: ${t.color.surfaceMuted};
        color: ${t.color.text};
      }
      :host([variant='accent']) {
        background: ${t.color.accent};
        color: ${t.color.onAccent};
      }
      :host([variant='success']) {
        background: ${t.color.successSurface};
        color: ${t.color.success};
      }
    `,
  ];

  override render() {
    return html`<slot></slot>`;
  }
}

define('tb-badge', TbBadge);

declare global {
  interface HTMLElementTagNameMap {
    'tb-badge': TbBadge;
  }
}
