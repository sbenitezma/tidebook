// Importing the package registers every `tb-*` custom element.
export * from './alert';
export * from './badge';
export * from './button';
export * from './counter';
export * from './date-field';
export * from './footer';
export * from './header';
export * from './price-summary';
export * from './room-card';
export * from './text-field';

import type { LitElement } from 'lit';

/** Public properties of a `tb-*` element, for typing framework bindings such as JSX. */
export type ElementProps<E> = Partial<Omit<E, keyof LitElement>>;
