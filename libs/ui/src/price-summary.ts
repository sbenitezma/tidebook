import { LitElement, css, html, nothing } from 'lit';
import { base, define, t } from './shared';

/**
 * Price breakdown of a stay. Receives already formatted amounts: the business rules that
 * produce them live in the core library.
 * @slot - Extra content under the total, such as alerts or a confirm button.
 */
export class TbPriceSummary extends LitElement {
  static override properties = {
    heading: {},
    nights: { type: Number },
    pricePerNight: { attribute: 'price-per-night' },
    subtotal: {},
    discount: {},
    discountLabel: { attribute: 'discount-label' },
    total: {},
  };

  declare heading: string;
  declare nights: number;
  declare pricePerNight: string;
  declare subtotal: string;
  /** Formatted discount amount; the row is hidden when empty. */
  declare discount: string;
  declare discountLabel: string;
  declare total: string;

  constructor() {
    super();
    this.heading = 'Your stay';
    this.nights = 0;
    this.pricePerNight = '';
    this.subtotal = '';
    this.discount = '';
    this.discountLabel = 'Discount';
    this.total = '';
  }

  static override styles = [
    base,
    css`
      :host {
        display: block;
      }
      section {
        padding: ${t.space.lg};
        background: ${t.color.surface};
        border-radius: ${t.radius.md};
        box-shadow: ${t.shadow.md};
      }
      h2 {
        margin: 0 0 ${t.space.md};
        font-size: ${t.font.sizeLg};
      }
      dl {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: ${t.space.sm} ${t.space.md};
        margin: 0 0 ${t.space.md};
      }
      dt {
        color: ${t.color.textMuted};
      }
      dd {
        margin: 0;
        text-align: end;
        font-variant-numeric: tabular-nums;
      }
      .discount {
        color: ${t.color.success};
      }
      .total {
        padding-top: ${t.space.sm};
        border-top: 1px solid ${t.color.border};
        font-size: ${t.font.sizeLg};
        font-weight: ${t.font.weightBold};
        color: ${t.color.text};
      }
    `,
  ];

  override render() {
    const nightsLabel = `${this.nights} ${this.nights === 1 ? 'night' : 'nights'}`;
    return html`
      <section aria-labelledby="heading">
        <h2 id="heading">${this.heading}</h2>
        <dl>
          <dt>${this.pricePerNight} × ${nightsLabel}</dt>
          <dd>${this.subtotal}</dd>
          ${
            this.discount
              ? html`<dt class="discount">${this.discountLabel}</dt>
                  <dd class="discount">−${this.discount}</dd>`
              : nothing
          }
          <dt class="total">Total</dt>
          <dd class="total">${this.total}</dd>
        </dl>
        <slot></slot>
      </section>
    `;
  }
}

define('tb-price-summary', TbPriceSummary);

declare global {
  interface HTMLElementTagNameMap {
    'tb-price-summary': TbPriceSummary;
  }
}
