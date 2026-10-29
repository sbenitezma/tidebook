import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  afterNextRender,
  computed,
  input,
  output,
  viewChild,
  type ElementRef,
} from '@angular/core';
import { formatLongDate, formatMoney, type Booking } from '@tidebook/core';

@Component({
  selector: 'app-booking-confirmation',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    @let quote = booking().quote;
    <section class="confirmation" aria-labelledby="confirmation-title">
      <h1 id="confirmation-title" #heading tabindex="-1">Your stay is booked</h1>
      <tb-alert variant="success" [heading]="'Booking reference ' + booking().reference">
        Keep this reference to manage your stay.
      </tb-alert>
      @if (!saved()) {
        <tb-alert variant="info">
          Your browser blocks local storage, so this booking will not be remembered on this device.
        </tb-alert>
      }
      <tb-price-summary
        [heading]="booking().roomName"
        [nights]="quote.nights"
        [pricePerNight]="formatMoney(quote.pricePerNightCents)"
        [subtotal]="formatMoney(quote.subtotalCents)"
        [discount]="quote.discountCents ? formatMoney(quote.discountCents) : ''"
        [discountLabel]="booking().promoCode + ' (' + quote.discountPercent + '%)'"
        [total]="formatMoney(quote.totalCents)"
      >
        <dl class="details">
          <dt>Check-in</dt>
          <dd>{{ formatLongDate(booking().stay.checkIn) }}</dd>
          <dt>Check-out</dt>
          <dd>{{ formatLongDate(booking().stay.checkOut) }}</dd>
          <dt>Guests</dt>
          <dd>{{ guestsLabel() }}</dd>
        </dl>
      </tb-price-summary>
      <tb-button variant="secondary" (click)="done.emit()">Book another stay</tb-button>
    </section>
  `,
})
export class BookingConfirmation {
  readonly booking = input.required<Booking>();
  readonly saved = input.required<boolean>();
  readonly done = output();

  protected readonly formatMoney = formatMoney;
  protected readonly formatLongDate = formatLongDate;
  protected readonly guestsLabel = computed(() => {
    const { adults, children } = this.booking().guests;
    return (
      `${adults} adult${adults === 1 ? '' : 's'}` +
      (children > 0 ? `, ${children} child${children === 1 ? '' : 'ren'}` : '')
    );
  });

  private readonly heading = viewChild.required<ElementRef<HTMLHeadingElement>>('heading');

  constructor() {
    // Move focus to the new content so keyboard and screen reader users land on it.
    afterNextRender(() => this.heading().nativeElement.focus());
  }
}
