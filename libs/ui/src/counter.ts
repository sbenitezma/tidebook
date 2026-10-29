import { LitElement, css, html } from 'lit';
import { base, define, emit, t } from './shared';

export type TbCountChangeEvent = CustomEvent<{ value: number }>;

/**
 * Number stepper with − and + buttons, limited to `min`..`max`.
 * @fires tb-count-change - When the value changes, with `{ value }`.
 */
export class TbCounter extends LitElement {
  static override properties = {
    label: {},
    hint: {},
    value: { type: Number },
    min: { type: Number },
    max: { type: Number },
  };

  declare label: string;
  declare hint: string;
  declare value: number;
  declare min: number;
  declare max: number;

  constructor() {
    super();
    this.label = '';
    this.hint = '';
    this.value = 0;
    this.min = 0;
    this.max = 10;
  }

  static override styles = [
    base,
    css`
      .label {
        font-weight: ${t.font.weightBold};
        font-size: ${t.font.sizeSm};
      }
      .hint {
        color: ${t.color.textMuted};
        font-size: ${t.font.sizeSm};
      }
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${t.space.sm};
        margin-top: ${t.space.xs};
      }
      button {
        inline-size: 2.75rem;
        block-size: 2.75rem;
        border-radius: ${t.radius.pill};
        border: 2px solid ${t.color.primary};
        background: ${t.color.surface};
        color: ${t.color.primary};
        font-size: ${t.font.sizeLg};
        line-height: 1;
        cursor: pointer;
      }
      button:disabled {
        border-color: ${t.color.border};
        color: ${t.color.textMuted};
        cursor: not-allowed;
      }
      output {
        min-inline-size: 2ch;
        text-align: center;
        font-size: ${t.font.sizeLg};
        font-weight: ${t.font.weightBold};
      }
    `,
  ];

  private step(delta: number) {
    const next = Math.min(this.max, Math.max(this.min, this.value + delta));
    if (next === this.value) return;
    this.value = next;
    emit(this, 'tb-count-change', { value: next });
  }

  override render() {
    return html`
      <div role="group" aria-labelledby="label">
        <span class="label" id="label">${this.label}</span>
        ${this.hint ? html`<span class="hint">(${this.hint})</span>` : ''}
        <div class="row">
          <button
            type="button"
            aria-label="Decrease ${this.label}"
            ?disabled=${this.value <= this.min}
            @click=${() => this.step(-1)}
          >
            −
          </button>
          <output aria-live="polite" aria-labelledby="label">${this.value}</output>
          <button
            type="button"
            aria-label="Increase ${this.label}"
            ?disabled=${this.value >= this.max}
            @click=${() => this.step(1)}
          >
            +
          </button>
        </div>
      </div>
    `;
  }
}

define('tb-counter', TbCounter);

declare global {
  interface HTMLElementTagNameMap {
    'tb-counter': TbCounter;
  }
  interface HTMLElementEventMap {
    'tb-count-change': TbCountChangeEvent;
  }
}
