import { LitElement, css, html, nothing } from 'lit';
import { base, define, t } from './shared';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

/**
 * Inline message. Warnings and errors use `role="alert"` so screen readers announce them;
 * info and success use the politer `role="status"`.
 * @slot - Message body.
 */
export class TbAlert extends LitElement {
  static override properties = {
    variant: { reflect: true },
    heading: {},
  };

  declare variant: AlertVariant;
  declare heading: string;

  constructor() {
    super();
    this.variant = 'info';
    this.heading = '';
  }

  static override styles = [
    base,
    css`
      :host {
        display: block;
      }
      div {
        padding: ${t.space.md};
        border-radius: ${t.radius.sm};
        border-inline-start: 4px solid ${t.color.info};
        background: ${t.color.infoSurface};
      }
      .success {
        border-color: ${t.color.success};
        background: ${t.color.successSurface};
      }
      .warning {
        border-color: ${t.color.warning};
        background: ${t.color.warningSurface};
      }
      .danger {
        border-color: ${t.color.danger};
        background: ${t.color.dangerSurface};
      }
      strong {
        display: block;
      }
    `,
  ];

  override render() {
    const urgent = this.variant === 'warning' || this.variant === 'danger';
    return html`<div class=${this.variant} role=${urgent ? 'alert' : 'status'}>
      ${this.heading ? html`<strong>${this.heading}</strong>` : nothing}
      <slot></slot>
    </div>`;
  }
}

define('tb-alert', TbAlert);

declare global {
  interface HTMLElementTagNameMap {
    'tb-alert': TbAlert;
  }
}
