import { css, unsafeCSS, type CSSResult } from 'lit';
import { vars, type TokenVars } from '@tidebook/tokens';

type CssTokenVars = { [G in keyof TokenVars]: { [N in keyof TokenVars[G]]: CSSResult } };

/** Token references ready to interpolate in Lit `css` templates, e.g. `${t.color.primary}`. */
export const t = Object.fromEntries(
  Object.entries(vars).map(([group, values]) => [
    group,
    Object.fromEntries(Object.entries(values).map(([name, value]) => [name, unsafeCSS(value)])),
  ]),
) as CssTokenVars;

export const base = css`
  :host {
    font-family: ${t.font.family};
    font-size: ${t.font.sizeMd};
    line-height: ${t.font.lineHeight};
    color: ${t.color.text};
    box-sizing: border-box;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  :focus-visible {
    outline: 3px solid ${t.color.focus};
    outline-offset: 2px;
  }
`;

export const fieldStyles = css`
  label {
    display: block;
    font-weight: ${t.font.weightBold};
    font-size: ${t.font.sizeSm};
    margin-bottom: ${t.space.xs};
  }
  input {
    width: 100%;
    min-height: 2.75rem;
    padding: ${t.space.sm} ${t.space.md};
    font: inherit;
    color: ${t.color.text};
    background: ${t.color.surface};
    border: 1px solid ${t.color.textMuted};
    border-radius: ${t.radius.sm};
  }
  input[aria-invalid='true'] {
    border-color: ${t.color.danger};
  }
  .hint,
  .error {
    margin: ${t.space.xs} 0 0;
    font-size: ${t.font.sizeSm};
    color: ${t.color.textMuted};
  }
  .error {
    color: ${t.color.danger};
  }
`;

/** Registers the element once, so hot reloads and double imports do not throw. */
export function define(name: string, element: CustomElementConstructor): void {
  if (!customElements.get(name)) customElements.define(name, element);
}

/** Dispatches a typed event that crosses shadow roots, like native UI events. */
export function emit<T>(host: HTMLElement, type: string, detail: T): void {
  host.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}
