// Teaches JSX about the `tb-*` custom elements. React 19 sets these props as element properties
// and wires `on<event-name>` props to `addEventListener('<event-name>')`.
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type {
  ElementProps,
  TbAlert,
  TbBadge,
  TbButton,
  TbCountChangeEvent,
  TbCounter,
  TbDateChangeEvent,
  TbDateField,
  TbFooter,
  TbHeader,
  TbInputEvent,
  TbPriceSummary,
  TbRoomCard,
  TbSelectEvent,
  TbTextField,
} from '@tidebook/ui';

type TbJsx<E, Events = object> = ElementProps<E> &
  Events &
  Omit<DetailedHTMLProps<HTMLAttributes<E>, E>, keyof ElementProps<E>>;

declare module 'react' {
  // Module augmentation of React's JSX namespace is the documented way to type custom elements.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'tb-alert': TbJsx<TbAlert>;
      'tb-badge': TbJsx<TbBadge>;
      'tb-button': TbJsx<TbButton>;
      'tb-counter': TbJsx<TbCounter, { 'ontb-count-change'?: (event: TbCountChangeEvent) => void }>;
      'tb-date-field': TbJsx<
        TbDateField,
        { 'ontb-date-change'?: (event: TbDateChangeEvent) => void }
      >;
      'tb-footer': TbJsx<TbFooter>;
      'tb-header': TbJsx<TbHeader>;
      'tb-price-summary': TbJsx<TbPriceSummary>;
      'tb-room-card': TbJsx<TbRoomCard, { 'ontb-select'?: (event: TbSelectEvent) => void }>;
      'tb-text-field': TbJsx<TbTextField, { 'ontb-input'?: (event: TbInputEvent) => void }>;
    }
  }
}
