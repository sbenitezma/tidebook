import { LitElement, css, html } from 'lit';
import { base, define, t } from './shared';

export type ButtonVariant = 'primary' | 'secondary';

/**
 * Button with Tidebook styles. Listen to the native `click` event, which crosses the shadow root.
 * @slot - Button label.
 */
export class TbButton extends LitElement {
  static override properties = {
    variant: { reflect: true },
    disabled: { type: Boolean, reflect: true },
    block: { type: Boolean, reflect: true },
  };

  declare variant: ButtonVariant;
  declare disabled: boolean;
  /** Takes the full width of its container. */
  declare block: boolean;

  constructor() {
    super();
    this.variant = 'primary';
    this.disabled = false;
    this.block = false;
  }

  static override styles = [
    base,
    css`
      :host {
        display: inline-block;
      }
      :host([block]) {
        display: block;
      }
      button {
        width: 100%;
        min-height: 2.75rem;
        padding: ${t.space.sm} ${t.space.lg};
        font: inherit;
        font-weight: ${t.font.weightBold};
        border-radius: ${t.radius.pill};
        border: 2px solid ${t.color.primary};
        cursor: pointer;
        transition: background-color 0.15s;
      }
      .primary {
        background: ${t.color.primary};
        color: ${t.color.onPrimary};
      }
      .primary:hover:not(:disabled) {
        background: ${t.color.primaryHover};
        border-color: ${t.color.primaryHover};
      }
      .secondary {
        background: ${t.color.surface};
        color: ${t.color.primary};
      }
      .secondary:hover:not(:disabled) {
        background: ${t.color.infoSurface};
      }
      button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }
    `,
  ];

  override render() {
    return html`<button class=${this.variant} ?disabled=${this.disabled} part="button">
      <slot></slot>
    </button>`;
  }
}

define('tb-button', TbButton);

declare global {
  interface HTMLElementTagNameMap {
    'tb-button': TbButton;
  }
}
