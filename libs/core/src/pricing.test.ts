import { describe, expect, it } from 'vitest';
import { formatMoney, quoteStay } from './pricing';

describe('quoteStay', () => {
  it('multiplies the price per night by the number of nights', () => {
    expect(quoteStay({ pricePerNightCents: 12000, nights: 3 })).toEqual({
      nights: 3,
      pricePerNightCents: 12000,
      subtotalCents: 36000,
      discountPercent: 0,
      discountCents: 0,
      totalCents: 36000,
    });
  });

  it('applies the discount to the whole stay, not to one night', () => {
    const quote = quoteStay({ pricePerNightCents: 12000, nights: 3, discountPercent: 10 });
    expect(quote.discountCents).toBe(3600);
    expect(quote.totalCents).toBe(32400);
  });

  it('rounds the discount to the nearest cent', () => {
    // 29 850 × 15 % = 4 477.5 cents
    const quote = quoteStay({ pricePerNightCents: 9950, nights: 3, discountPercent: 15 });
    expect(quote.discountCents).toBe(4478);
    expect(quote.totalCents).toBe(25372);
  });

  it('keeps subtotal - discount = total for any percentage', () => {
    for (let percent = 0; percent <= 100; percent++) {
      const quote = quoteStay({ pricePerNightCents: 9999, nights: 7, discountPercent: percent });
      expect(quote.subtotalCents - quote.discountCents).toBe(quote.totalCents);
      expect(Number.isInteger(quote.totalCents)).toBe(true);
    }
  });

  it.each([0, -1, 1.5, Number.NaN])('rejects %s nights', (nights) => {
    expect(() => quoteStay({ pricePerNightCents: 100, nights })).toThrow(RangeError);
  });

  it.each([-5, 101, 12.5])('rejects a %s % discount', (discountPercent) => {
    expect(() => quoteStay({ pricePerNightCents: 100, nights: 1, discountPercent })).toThrow(
      RangeError,
    );
  });

  it('rejects a price that is not a whole number of cents', () => {
    expect(() => quoteStay({ pricePerNightCents: 99.5, nights: 1 })).toThrow(RangeError);
  });
});

describe('formatMoney', () => {
  it('formats cents as euros', () => {
    expect(formatMoney(32400)).toBe('€324.00');
    expect(formatMoney(4478)).toBe('€44.78');
  });
});
