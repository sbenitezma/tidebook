// Teaches Vue templates about the `tb-*` custom elements. Vue sets bindings as element
// properties when the element defines them, and `@tb-select` listens to the `tb-select` event
// (typed here as the `onTbSelect` prop, which is how Vue compiles that listener).
import type { HTMLAttributes, ReservedProps } from 'vue';
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

type TbVue<E, Events = object> = new () => {
  $props: ElementProps<E> & Events & Omit<HTMLAttributes, keyof ElementProps<E>> & ReservedProps;
};

declare module 'vue' {
  interface GlobalComponents {
    'tb-alert': TbVue<TbAlert>;
    'tb-badge': TbVue<TbBadge>;
    'tb-button': TbVue<TbButton>;
    'tb-counter': TbVue<TbCounter, { onTbCountChange?: (event: TbCountChangeEvent) => void }>;
    'tb-date-field': TbVue<TbDateField, { onTbDateChange?: (event: TbDateChangeEvent) => void }>;
    'tb-footer': TbVue<TbFooter>;
    'tb-header': TbVue<TbHeader>;
    'tb-price-summary': TbVue<TbPriceSummary>;
    'tb-room-card': TbVue<TbRoomCard, { onTbSelect?: (event: TbSelectEvent) => void }>;
    'tb-text-field': TbVue<TbTextField, { onTbInput?: (event: TbInputEvent) => void }>;
  }
}
