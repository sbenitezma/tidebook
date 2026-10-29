import { nightsBetween, validateStay, type StayError } from './dates';
import { checkCapacity, validateGuests, type GuestsError } from './guests';
import { quoteStay } from './pricing';
import type { Booking, Guests, IsoDate, PromoResult, Room, Stay } from './types';

// No 0/O or 1/I, so references are easy to read out loud.
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function makeReference(random: () => number = Math.random): string {
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += REFERENCE_ALPHABET[Math.floor(random() * REFERENCE_ALPHABET.length)];
  }
  return `TB-${id}`;
}

export interface BookingRequest {
  room: Room;
  stay: Stay;
  guests: Guests;
  promo: PromoResult;
}

export interface BookingContext {
  today: IsoDate;
  now?: Date;
  random?: () => number;
}

export type BookingIssue = StayError | GuestsError | 'no-room-selected' | 'over-capacity';

/** Everything that stops a booking from being confirmed; empty when it can go ahead. */
export function validateBooking(
  { room, stay, guests }: { room: Pick<Room, 'maxGuests'> | undefined; stay: Stay; guests: Guests },
  today: IsoDate,
): BookingIssue[] {
  const issues: BookingIssue[] = [...validateStay(stay, today), ...validateGuests(guests)];
  if (!room) issues.push('no-room-selected');
  else if (!checkCapacity(room, guests).fits) issues.push('over-capacity');
  return issues;
}

/** Validates the request and freezes the quote, so the stored total is the one the guest saw. */
export function createBooking(
  { room, stay, guests, promo }: BookingRequest,
  { today, now = new Date(), random }: BookingContext,
): Booking {
  const issues = validateBooking({ room, stay, guests }, today);
  if (issues.length) throw new Error(`Invalid booking: ${issues.join(', ')}`);

  const valid = promo.status === 'valid' ? promo : null;
  return {
    reference: makeReference(random),
    createdAt: now.toISOString(),
    roomId: room.id,
    roomName: room.name,
    stay,
    guests,
    promoCode: valid?.code ?? null,
    quote: quoteStay({
      pricePerNightCents: room.pricePerNightCents,
      nights: nightsBetween(stay.checkIn, stay.checkOut),
      discountPercent: valid?.percent ?? 0,
    }),
  };
}

/** The subset of the Web Storage API the core needs, so it stays free of DOM types. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const BOOKINGS_STORAGE_KEY = 'tidebook:bookings';

/** Storage can be missing, blocked by privacy settings or full: reading never throws. */
export function loadBookings(storage: StorageLike | undefined): Booking[] {
  try {
    const parsed: unknown = JSON.parse(storage?.getItem(BOOKINGS_STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

/** Returns `false` instead of throwing when the booking cannot be persisted. */
export function saveBooking(booking: Booking, storage: StorageLike | undefined): boolean {
  if (!storage) return false;
  try {
    storage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([...loadBookings(storage), booking]));
    return true;
  } catch {
    return false;
  }
}
