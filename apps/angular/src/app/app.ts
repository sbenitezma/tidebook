import { CUSTOM_ELEMENTS_SCHEMA, Component, computed, signal } from '@angular/core';
import {
  addDays,
  createBooking,
  formatMoney,
  nightsBetween,
  promoCodes,
  quoteStay,
  rooms,
  saveBooking,
  toIsoDate,
  validateBooking,
  validateStay,
  validatePromoCode,
  GUEST_LIMITS,
  issueMessages,
  promoMessage,
  type Booking,
  type StorageLike,
} from '@tidebook/core';
import { BookingConfirmation } from './booking-confirmation';

/** `window.localStorage` itself throws when the browser blocks storage. */
function browserStorage(): StorageLike | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

type IssueKey = keyof typeof issueMessages;

@Component({
  selector: 'app-root',
  imports: [BookingConfirmation],
  // tb-* are web components: Angular renders them as plain elements and sets bindings as
  // element properties.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
})
export class App {
  protected readonly rooms = rooms;
  protected readonly limits = GUEST_LIMITS;
  protected readonly issueMessages = issueMessages;
  protected readonly formatMoney = formatMoney;
  protected readonly addDays = addDays;

  protected readonly today = toIsoDate(new Date());
  protected readonly checkIn = signal(this.today);
  protected readonly checkOut = signal(addDays(this.today, 1));
  protected readonly adults = signal(2);
  protected readonly children = signal(0);
  protected readonly roomId = signal<string | undefined>(undefined);
  protected readonly promoInput = signal(
    new URLSearchParams(window.location.search).get('promo') ?? '',
  );
  protected readonly promo = signal(validatePromoCode(this.promoInput(), promoCodes, this.today));
  protected readonly confirmed = signal<{ booking: Booking; saved: boolean } | undefined>(
    undefined,
  );

  protected readonly room = computed(() =>
    rooms.find((candidate) => candidate.id === this.roomId()),
  );
  private readonly stay = computed(() => ({ checkIn: this.checkIn(), checkOut: this.checkOut() }));
  private readonly guests = computed(() => ({ adults: this.adults(), children: this.children() }));
  protected readonly issues = computed(() =>
    validateBooking({ room: this.room(), stay: this.stay(), guests: this.guests() }, this.today),
  );
  protected readonly quote = computed(() => {
    const room = this.room();
    const promo = this.promo();
    return room && validateStay(this.stay(), this.today).length === 0
      ? quoteStay({
          pricePerNightCents: room.pricePerNightCents,
          nights: nightsBetween(this.checkIn(), this.checkOut()),
          discountPercent: promo.status === 'valid' ? promo.percent : 0,
        })
      : undefined;
  });
  protected readonly discountLabel = computed(() => {
    const promo = this.promo();
    return promo.status === 'valid' ? `${promo.code} (${promo.percent}%)` : '';
  });
  protected readonly promoFeedback = computed(() => promoMessage(this.promo()));
  protected readonly blocking = computed(() =>
    this.issues().filter(
      (issue): issue is IssueKey => issue !== 'no-room-selected' && issue !== 'over-capacity',
    ),
  );

  protected fieldError(...keys: IssueKey[]): string {
    return (
      keys.map((key) => (this.issues().includes(key) ? issueMessages[key] : '')).find(Boolean) ?? ''
    );
  }

  protected changeCheckIn(value: string) {
    this.checkIn.set(value);
    // Keep at least one night so the guest does not have to fix check-out by hand.
    if (value && nightsBetween(value, this.checkOut()) < 1) this.checkOut.set(addDays(value, 1));
  }

  protected applyPromo() {
    this.promo.set(validatePromoCode(this.promoInput(), promoCodes, this.today));
  }

  protected confirm() {
    const room = this.room();
    if (!room || this.issues().length) return;
    const booking = createBooking(
      { room, stay: this.stay(), guests: this.guests(), promo: this.promo() },
      { today: this.today },
    );
    this.confirmed.set({ booking, saved: saveBooking(booking, browserStorage()) });
    window.scrollTo({ top: 0 });
  }

  protected startOver() {
    this.confirmed.set(undefined);
    this.roomId.set(undefined);
  }
}
