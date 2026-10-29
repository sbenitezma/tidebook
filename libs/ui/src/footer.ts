import { LitElement, css, html } from 'lit';
import { base, define, t } from './shared';

/**
 * Site footer.
 * @slot - Footer content.
 */
export class TbFooter extends LitElement {
  static override styles = [
    base,
    css`
      :host {
        display: block;
        margin-top: ${t.space.xxl};
        background: ${t.color.surfaceMuted};
        color: ${t.color.textMuted};
        font-size: ${t.font.sizeSm};
      }
      footer {
        max-width: 72rem;
        margin: 0 auto;
        padding: ${t.space.lg} ${t.space.md};
      }
      ::slotted(a) {
        color: ${t.color.primary};
      }
    `,
  ];

  override render() {
    return html`<footer><slot></slot></footer>`;
  }
}

define('tb-footer', TbFooter);

declare global {
  interface HTMLElementTagNameMap {
    'tb-footer': TbFooter;
  }
}
