import { LitElement, css, html } from 'lit';
import { base, define, t } from './shared';

/**
 * Site header with the Tidebook wordmark.
 * @slot - Optional content on the right, such as navigation.
 */
export class TbHeader extends LitElement {
  static override properties = { href: {} };

  /** Where the wordmark links to. */
  declare href: string;

  constructor() {
    super();
    this.href = '/';
  }

  static override styles = [
    base,
    css`
      :host {
        display: block;
        background: ${t.color.primary};
        color: ${t.color.onPrimary};
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${t.space.md};
        max-width: 72rem;
        margin: 0 auto;
        padding: ${t.space.md};
      }
      a {
        display: inline-flex;
        align-items: center;
        gap: ${t.space.sm};
        color: inherit;
        text-decoration: none;
        font-size: ${t.font.sizeLg};
        font-weight: ${t.font.weightBold};
      }
      :focus-visible {
        outline-color: ${t.color.onPrimary};
      }
    `,
  ];

  override render() {
    return html`<header>
      <a href=${this.href}>
        <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" stroke-width="2" />
          <path
            d="M5 19c3.5-3 7.5-3 11 0s7.5 3 11 0M7 24c3-2.4 6-2.4 9 0s6 2.4 9 0"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
          <circle cx="16" cy="11" r="3.5" fill="currentColor" />
        </svg>
        Tidebook
      </a>
      <slot></slot>
    </header>`;
  }
}

define('tb-header', TbHeader);

declare global {
  interface HTMLElementTagNameMap {
    'tb-header': TbHeader;
  }
}
