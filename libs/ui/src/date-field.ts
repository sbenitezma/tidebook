import { LitElement, html, nothing } from 'lit';
import { base, define, emit, fieldStyles } from './shared';

export type TbDateChangeEvent = CustomEvent<{ value: string }>;

/**
 * Labelled date input built on the native `<input type="date">`, so it gets the platform picker,
 * keyboard support and localisation for free. Values are `YYYY-MM-DD`.
 * @fires tb-date-change - When the user picks a date, with `{ value }`.
 */
export class TbDateField extends LitElement {
  static override properties = {
    label: {},
    value: {},
    min: {},
    max: {},
    error: {},
  };

  declare label: string;
  declare value: string;
  declare min: string;
  declare max: string;
  declare error: string;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.min = '';
    this.max = '';
    this.error = '';
  }

  static override styles = [base, fieldStyles];

  private onChange(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    emit(this, 'tb-date-change', { value: this.value });
  }

  override render() {
    return html`
      <label for="input">${this.label}</label>
      <input
        id="input"
        type="date"
        .value=${this.value}
        min=${this.min || nothing}
        max=${this.max || nothing}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-describedby=${this.error ? 'error' : nothing}
        @change=${this.onChange}
      />
      ${this.error ? html`<p class="error" id="error">${this.error}</p>` : nothing}
    `;
  }
}

define('tb-date-field', TbDateField);

declare global {
  interface HTMLElementTagNameMap {
    'tb-date-field': TbDateField;
  }
  interface HTMLElementEventMap {
    'tb-date-change': TbDateChangeEvent;
  }
}
