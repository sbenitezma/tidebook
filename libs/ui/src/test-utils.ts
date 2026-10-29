import type { LitElement } from 'lit';

/** Creates a custom element, attaches it to the document and waits for its first render. */
export async function mount<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
): Promise<HTMLElementTagNameMap[K]> {
  const element = Object.assign(document.createElement(tag), props);
  document.body.append(element);
  await (element as unknown as LitElement).updateComplete;
  return element;
}

export const shadow = (element: Element) => element.shadowRoot as ShadowRoot;
