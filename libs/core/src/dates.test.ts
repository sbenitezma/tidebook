import { describe, expect, it } from 'vitest';
import { addDays, isIsoDate, nightsBetween, toIsoDate, validateStay } from './dates';

describe('isIsoDate', () => {
  it.each(['2026-07-01', '2028-02-29'])('accepts %s', (value) => {
    expect(isIsoDate(value)).toBe(true);
  });

  it.each(['', '2026-7-1', '01/07/2026', '2026-02-30', '2027-02-29', '2026-13-01', 'nope'])(
    'rejects %j',
    (value) => {
      expect(isIsoDate(value)).toBe(false);
    },
  );
});

describe('toIsoDate', () => {
  it('uses the local calendar date with zero padding', () => {
    expect(toIsoDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('addDays', () => {
  it('moves across month and year boundaries', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
  });

  it('is not affected by daylight saving changes', () => {
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
  });
});

describe('nightsBetween', () => {
  it('counts the nights between check-in and check-out', () => {
    expect(nightsBetween('2026-07-01', '2026-07-04')).toBe(3);
  });

  it('counts nights across a daylight saving change', () => {
    expect(nightsBetween('2026-10-24', '2026-10-26')).toBe(2);
  });

  it('returns 0 or less when check-out is not after check-in', () => {
    expect(nightsBetween('2026-07-04', '2026-07-04')).toBe(0);
    expect(nightsBetween('2026-07-04', '2026-07-01')).toBe(-3);
  });
});

describe('validateStay', () => {
  const today = '2026-07-01';

  it('accepts a stay from today to tomorrow', () => {
    expect(validateStay({ checkIn: today, checkOut: '2026-07-02' }, today)).toEqual([]);
  });

  it('reports invalid dates', () => {
    expect(validateStay({ checkIn: 'x', checkOut: '' }, today)).toEqual([
      'invalid-check-in',
      'invalid-check-out',
    ]);
  });

  it('rejects a check-in in the past', () => {
    expect(validateStay({ checkIn: '2026-06-30', checkOut: '2026-07-02' }, today)).toEqual([
      'check-in-in-past',
    ]);
  });

  it('rejects a check-out on or before check-in', () => {
    expect(validateStay({ checkIn: '2026-07-05', checkOut: '2026-07-05' }, today)).toEqual([
      'check-out-not-after-check-in',
    ]);
  });
});
