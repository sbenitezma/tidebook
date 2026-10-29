import { describe, expect, it } from 'vitest';
import {
  BOOKINGS_STORAGE_KEY,
  createBooking,
  loadBookings,
  makeReference,
  saveBooking,
  type StorageLike,
} from './booking';
import type { Room } from './types';

const room: Room = {
  id: 'seagrass',
  name: 'Seagrass Bungalow',
  type: 'bungalow',
  description: 'A bungalow.',
  sizeM2: 40,
  beds: 2,
  bedType: 'Queen',
  maxGuests: 3,
  pricePerNightCents: 16500,
  image: 'rooms/seagrass.svg',
};

const context = { today: '2026-07-01', now: new Date('2026-07-01T10:00:00Z'), random: () => 0 };

const request = {
  room,
  stay: { checkIn: '2026-07-10', checkOut: '2026-07-13' },
  guests: { adults: 2, children: 1 },
  promo: { status: 'valid', code: 'WELCOME10', percent: 10 } as const,
};

describe('makeReference', () => {
  it('builds a TB- reference from unambiguous characters', () => {
    expect(makeReference(() => 0)).toBe('TB-AAAAAA');
    expect(makeReference(() => 0.999)).toMatch(/^TB-[A-HJ-NP-Z2-9]{6}$/);
  });

  it('uses Math.random by default', () => {
    expect(makeReference()).toMatch(/^TB-[A-HJ-NP-Z2-9]{6}$/);
  });
});

describe('createBooking', () => {
  it('stores the full quote computed for every night of the stay', () => {
    expect(createBooking(request, context)).toEqual({
      reference: 'TB-AAAAAA',
      createdAt: '2026-07-01T10:00:00.000Z',
      roomId: 'seagrass',
      roomName: 'Seagrass Bungalow',
      stay: request.stay,
      guests: request.guests,
      promoCode: 'WELCOME10',
      quote: {
        nights: 3,
        pricePerNightCents: 16500,
        subtotalCents: 49500,
        discountPercent: 10,
        discountCents: 4950,
        totalCents: 44550,
      },
    });
  });

  it('applies no discount without a valid promo code', () => {
    const booking = createBooking({ ...request, promo: { status: 'expired', code: 'X' } }, context);
    expect(booking.promoCode).toBeNull();
    expect(booking.quote.totalCents).toBe(49500);
  });

  it('refuses invalid dates', () => {
    expect(() =>
      createBooking(
        { ...request, stay: { checkIn: '2026-07-10', checkOut: '2026-07-09' } },
        context,
      ),
    ).toThrow('check-out-not-after-check-in');
  });

  it('refuses guests out of range', () => {
    expect(() =>
      createBooking({ ...request, guests: { adults: 0, children: 1 } }, context),
    ).toThrow('adults-out-of-range');
  });

  it('refuses more guests than the room fits', () => {
    expect(() =>
      createBooking({ ...request, guests: { adults: 3, children: 1 } }, context),
    ).toThrow('over-capacity');
  });

  it('works with the default clock and random source', () => {
    const booking = createBooking(request, { today: '2026-07-01' });
    expect(booking.reference).toMatch(/^TB-/);
    expect(Date.parse(booking.createdAt)).not.toBeNaN();
  });
});

const memoryStorage = (): StorageLike & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
};

const blockedStorage: StorageLike = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

describe('saveBooking / loadBookings', () => {
  const booking = createBooking(request, context);

  it('appends bookings to storage', () => {
    const storage = memoryStorage();
    expect(saveBooking(booking, storage)).toBe(true);
    expect(saveBooking({ ...booking, reference: 'TB-BBBBBB' }, storage)).toBe(true);
    expect(loadBookings(storage).map((b) => b.reference)).toEqual(['TB-AAAAAA', 'TB-BBBBBB']);
    expect(storage.data.has(BOOKINGS_STORAGE_KEY)).toBe(true);
  });

  it('does not throw when storage is blocked or missing', () => {
    expect(saveBooking(booking, blockedStorage)).toBe(false);
    expect(loadBookings(blockedStorage)).toEqual([]);
    expect(saveBooking(booking, undefined)).toBe(false);
    expect(loadBookings(undefined)).toEqual([]);
  });

  it('ignores corrupted data', () => {
    const storage = memoryStorage();
    storage.setItem(BOOKINGS_STORAGE_KEY, '{not json');
    expect(loadBookings(storage)).toEqual([]);
    storage.setItem(BOOKINGS_STORAGE_KEY, '{"a":1}');
    expect(loadBookings(storage)).toEqual([]);
    expect(saveBooking(booking, storage)).toBe(true);
    expect(loadBookings(storage)).toHaveLength(1);
  });
});
