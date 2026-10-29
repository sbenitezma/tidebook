import { describe, expect, it } from 'vitest';
import { checkCapacity, GUEST_LIMITS, validateGuests } from './guests';

describe('validateGuests', () => {
  it('accepts 1 to 4 adults and 0 to 3 children', () => {
    expect(validateGuests({ adults: 1, children: 0 })).toEqual([]);
    expect(validateGuests({ adults: 4, children: 3 })).toEqual([]);
  });

  it('rejects counts out of range or not whole numbers', () => {
    expect(validateGuests({ adults: 0, children: 4 })).toEqual([
      'adults-out-of-range',
      'children-out-of-range',
    ]);
    expect(validateGuests({ adults: 1.5, children: -1 })).toEqual([
      'adults-out-of-range',
      'children-out-of-range',
    ]);
  });

  it('exposes the limits for the UI', () => {
    expect(GUEST_LIMITS).toEqual({ adults: { min: 1, max: 4 }, children: { min: 0, max: 3 } });
  });
});

describe('checkCapacity', () => {
  it('fits when guests are within the room capacity', () => {
    expect(checkCapacity({ maxGuests: 4 }, { adults: 2, children: 2 })).toEqual({
      fits: true,
      guests: 4,
      maxGuests: 4,
    });
  });

  it('counts children towards the capacity', () => {
    expect(checkCapacity({ maxGuests: 2 }, { adults: 2, children: 1 })).toEqual({
      fits: false,
      guests: 3,
      maxGuests: 2,
    });
  });
});
