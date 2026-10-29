import { LitElement, html, nothing } from 'lit';
import { base, define, emit, fieldStyles } from './shared';

export type TbInputEvent = CustomEvent<{ value: string }>;

/**
 * Labelled text input.
 * @fires tb-input - On every keystroke, with `{ value }`.
 */
export class TbTextField extends LitElement {
  static override properties = {
    label: {},
    value: {},
    placeholder: {},
    hint: {},
    error: {},
  };

  declare label: string;
  declare value: string;
  declare placeholder: string;
  declare hint: string;
  /** Error message; marks the input as invalid when set. */
  declare error: string;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.placeholder = '';
    this.hint = '';
    this.error = '';
  }

  static override styles = [base, fieldStyles];

  private onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    emit(this, 'tb-input', { value: this.value });
  }

  override render() {
    const describedBy = this.error ? 'error' : this.hint ? 'hint' : nothing;
    return html`
      <label for="input">${this.label}</label>
      <input
        id="input"
        type="text"
        .value=${this.value}
        placeholder=${this.placeholder || nothing}
        aria-invalid=${this.error ? 'true' : 'false'}
        aria-describedby=${describedBy}
        @input=${this.onInput}
      />
      ${
        this.error
          ? html`<p class="error" id="error">${this.error}</p>`
          : this.hint
            ? html`<p class="hint" id="hint">${this.hint}</p>`
            : nothing
      }
    `;
  }
}

define('tb-text-field', TbTextField);

declare global {
  interface HTMLElementTagNameMap {
    'tb-text-field': TbTextField;
  }
  interface HTMLElementEventMap {
    'tb-input': TbInputEvent;
  }
}
