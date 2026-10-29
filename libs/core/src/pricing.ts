import type { Quote } from './types';

export interface QuoteInput {
  pricePerNightCents: number;
  nights: number;
  discountPercent?: number;
}

/**
 * The only place where a stay's price is computed. Works in integer cents so totals never
 * pick up floating point noise; the discount is rounded to the nearest cent.
 */
export function quoteStay({ pricePerNightCents, nights, discountPercent = 0 }: QuoteInput): Quote {
  if (!Number.isInteger(nights) || nights < 1) {
    throw new RangeError(`A stay needs at least one whole night, got ${nights}`);
  }
  if (!Number.isInteger(pricePerNightCents) || pricePerNightCents < 0) {
    throw new RangeError(`Price must be a whole number of cents, got ${pricePerNightCents}`);
  }
  if (!Number.isInteger(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    throw new RangeError(
      `Discount must be a whole percentage from 0 to 100, got ${discountPercent}`,
    );
  }
  const subtotalCents = pricePerNightCents * nights;
  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  return {
    nights,
    pricePerNightCents,
    subtotalCents,
    discountPercent,
    discountCents,
    totalCents: subtotalCents - discountCents,
  };
}

const euros = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

export function formatMoney(cents: number): string {
  return euros.format(cents / 100);
}
